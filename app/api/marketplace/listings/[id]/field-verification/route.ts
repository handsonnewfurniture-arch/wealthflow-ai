/**
 * Field Verification API
 * Contributors upload photos/videos from property locations and earn rewards
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAuthClient, createServiceClient, requireAuth } from '@/lib/marketplace/api'
import { extractExifData, verifyLocation, verifyTimestamp, geocodeAddress } from '@/lib/marketplace/exif-extraction'

// GET /api/marketplace/listings/[id]/field-verification
// View field verification content (with access control)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAuthClient()

    // Get current user (may be null for anonymous)
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id

    // Fetch verification
    const { data: verification, error } = await supabase
      .from('marketplace_field_verifications')
      .select(`
        *,
        contributor:users!contributor_id(id, email, full_name),
        listing:marketplace_listings(id, title, property_address, county, state)
      `)
      .eq('listing_id', params.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching verification:', error)
      return NextResponse.json(
        { error: 'Failed to fetch verification' },
        { status: 500 }
      )
    }

    // No verification exists
    if (!verification) {
      return NextResponse.json({
        exists: false,
        canContribute: userId ? true : false
      })
    }

    // Check access control
    const canView = await checkViewAccess(verification, userId, supabase)

    if (!canView) {
      // User can see that verification exists but not the content
      return NextResponse.json({
        exists: true,
        canView: false,
        status: verification.status,
        exclusivityExpiresAt: verification.exclusivity_expires_at,
        message: verification.status === 'pending'
          ? 'Verification pending admin approval'
          : 'Verification in exclusivity period'
      })
    }

    // User can view - return full data
    return NextResponse.json({
      exists: true,
      canView: true,
      verification: {
        id: verification.id,
        status: verification.status,
        photoUrls: verification.photo_urls || [],
        videoUrls: verification.video_urls || [],
        uploadedAt: verification.uploaded_at,
        approvedAt: verification.approved_at,
        exclusivityExpiresAt: verification.exclusivity_expires_at,
        contributor: {
          id: verification.contributor.id,
          name: verification.contributor.full_name,
          isYou: verification.contributor_id === userId
        },
        gps: verification.gps_latitude && verification.gps_longitude ? {
          latitude: verification.gps_latitude,
          longitude: verification.gps_longitude,
          distanceFromProperty: verification.distance_from_property_feet
        } : null,
        photoTimestamp: verification.photo_timestamp
      }
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/marketplace/listings/[id]/field-verification
// Upload field verification (requires auth)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAuthClient()
    const user = await requireAuth(supabase)

    // Check if verification already exists for this listing
    const { data: existing } = await supabase
      .from('marketplace_field_verifications')
      .select('id, contributor_id, status')
      .eq('listing_id', params.id)
      .single()

    if (existing) {
      if (existing.contributor_id === user.id) {
        return NextResponse.json(
          { error: 'You already submitted a verification for this property' },
          { status: 400 }
        )
      } else {
        return NextResponse.json(
          { error: 'Another contributor already verified this property (first come, first served)' },
          { status: 409 }
        )
      }
    }

    // Get listing details
    const { data: listing, error: listingError } = await supabase
      .from('marketplace_listings')
      .select('id, property_address, county, state')
      .eq('id', params.id)
      .single()

    if (listingError || !listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const photos = formData.getAll('photos') as File[]
    const videos = formData.getAll('videos') as File[]

    if (photos.length === 0) {
      return NextResponse.json(
        { error: 'At least one photo is required' },
        { status: 400 }
      )
    }

    // Validate file counts and sizes
    if (photos.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 photos allowed' },
        { status: 400 }
      )
    }

    if (videos.length > 3) {
      return NextResponse.json(
        { error: 'Maximum 3 videos allowed' },
        { status: 400 }
      )
    }

    // Extract EXIF data from first photo
    const firstPhoto = photos[0]
    const exifData = await extractExifData(firstPhoto)

    let gpsLat: number | null = null
    let gpsLon: number | null = null
    let photoTimestamp: Date | null = null
    let distanceFromProperty: number | null = null
    let verificationWarnings: string[] = []

    // Verify GPS location
    if (exifData.hasGPS && exifData.latitude && exifData.longitude) {
      gpsLat = exifData.latitude
      gpsLon = exifData.longitude

      // Geocode property address to get expected coordinates
      const fullAddress = `${listing.property_address}, ${listing.county}, ${listing.state}`
      const propertyCoords = await geocodeAddress(fullAddress)

      if (propertyCoords) {
        const locationCheck = verifyLocation(
          gpsLat,
          gpsLon,
          propertyCoords.lat,
          propertyCoords.lon,
          100 // 100 feet radius
        )

        distanceFromProperty = locationCheck.distanceFeet

        if (!locationCheck.isValid) {
          verificationWarnings.push(locationCheck.error || 'Location verification failed')
        }
      }
    } else {
      verificationWarnings.push('No GPS data found in photo EXIF')
    }

    // Verify timestamp
    if (exifData.hasTimestamp && exifData.timestamp) {
      photoTimestamp = exifData.timestamp

      const timestampCheck = verifyTimestamp(photoTimestamp, 30)

      if (!timestampCheck.isValid) {
        verificationWarnings.push(timestampCheck.error || 'Timestamp verification failed')
      }
    } else {
      verificationWarnings.push('No timestamp found in photo EXIF')
    }

    // Upload photos to storage
    const photoUrls: string[] = []
    for (const photo of photos) {
      const fileName = `${params.id}/${user.id}/${Date.now()}-${photo.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('field-verifications')
        .upload(fileName, photo, {
          contentType: photo.type,
          upsert: false
        })

      if (uploadError) {
        console.error('Photo upload error:', uploadError)
        // Clean up already uploaded files
        for (const url of photoUrls) {
          const path = url.split('/field-verifications/')[1]
          await supabase.storage.from('field-verifications').remove([path])
        }
        return NextResponse.json(
          { error: 'Failed to upload photo' },
          { status: 500 }
        )
      }

      const { data: { publicUrl } } = supabase.storage
        .from('field-verifications')
        .getPublicUrl(fileName)

      photoUrls.push(publicUrl)
    }

    // Upload videos to storage
    const videoUrls: string[] = []
    for (const video of videos) {
      const fileName = `${params.id}/${user.id}/${Date.now()}-${video.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('field-verifications')
        .upload(fileName, video, {
          contentType: video.type,
          upsert: false
        })

      if (uploadError) {
        console.error('Video upload error:', uploadError)
        continue // Don't fail entire request if video upload fails
      }

      const { data: { publicUrl } } = supabase.storage
        .from('field-verifications')
        .getPublicUrl(fileName)

      videoUrls.push(publicUrl)
    }

    // Create verification record
    const { data: verification, error: insertError } = await supabase
      .from('marketplace_field_verifications')
      .insert({
        listing_id: params.id,
        contributor_id: user.id,
        status: 'pending',
        gps_latitude: gpsLat,
        gps_longitude: gpsLon,
        photo_timestamp: photoTimestamp?.toISOString(),
        distance_from_property_feet: distanceFromProperty,
        photo_urls: photoUrls,
        video_urls: videoUrls,
        admin_notes: verificationWarnings.length > 0
          ? `Verification warnings: ${verificationWarnings.join('; ')}`
          : null
      })
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      // Clean up uploaded files
      for (const url of [...photoUrls, ...videoUrls]) {
        const path = url.split('/field-verifications/')[1]
        await supabase.storage.from('field-verifications').remove([path])
      }
      return NextResponse.json(
        { error: 'Failed to create verification record' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      verification: {
        id: verification.id,
        status: verification.status,
        warnings: verificationWarnings,
        message: 'Verification submitted! Admin will review within 24 hours.'
      }
    }, { status: 201 })

  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'You must be logged in to submit field verification' },
        { status: 401 }
      )
    }

    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper: Check if user can view verification content
async function checkViewAccess(
  verification: any,
  userId: string | undefined,
  supabase: any
): Promise<boolean> {
  // Not approved yet - only admin and contributor can see
  if (verification.status !== 'approved') {
    if (!userId) return false

    // Check if admin
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()

    if (userData?.role === 'admin' || userData?.role === 'superadmin') {
      return true
    }

    // Check if contributor
    return verification.contributor_id === userId
  }

  // Approved content

  // Contributor can always see
  if (userId && verification.contributor_id === userId) {
    return true
  }

  // Admin can always see
  if (userId) {
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()

    if (userData?.role === 'admin' || userData?.role === 'superadmin') {
      return true
    }
  }

  // Check exclusivity period (3 days)
  if (verification.exclusivity_expires_at) {
    const expiresAt = new Date(verification.exclusivity_expires_at)
    if (new Date() < expiresAt) {
      return false // Still in exclusivity period
    }
  }

  // After exclusivity: Pro/Elite users can see
  if (userId) {
    const { data: userData } = await supabase
      .from('users')
      .select('subscription_tier')
      .eq('id', userId)
      .single()

    if (userData?.subscription_tier === 'pro' || userData?.subscription_tier === 'elite') {
      return true
    }
  }

  return false
}
