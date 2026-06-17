/**
 * Media Upload API Routes
 *
 * Handles upload, retrieval, and deletion of media files (images and videos)
 * for marketplace listings
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAuthClient } from '@/lib/marketplace/api'
import { requireAdmin } from '@/lib/marketplace/auth'
import {
  validateMediaFile,
  generateUniqueFilename,
  getMediaType,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE
} from '@/lib/marketplace/upload-validation'

// ============================================================================
// POST - Upload Media File
// ============================================================================

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Verify admin access
    await requireAdmin()

    const supabase = createAuthClient()
    const listingId = params.id

    // 2. Verify listing exists
    const { data: listing, error: listingError } = await supabase
      .from('marketplace_listings')
      .select('id, title')
      .eq('id', listingId)
      .single()

    if (listingError || !listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // 3. Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const altText = formData.get('alt_text') as string || file?.name || ''

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // 4. Validate file
    const validation = validateMediaFile(file)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // 5. Additional server-side validation
    const allowedTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}` },
        { status: 400 }
      )
    }

    const maxSize = file.type.startsWith('video/') ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB` },
        { status: 400 }
      )
    }

    // 6. Get current media count for sort order
    const { count } = await supabase
      .from('marketplace_listing_media')
      .select('*', { count: 'exact', head: true })
      .eq('listing_id', listingId)

    const sortOrder = count || 0

    // 7. Generate unique filename and upload to Supabase Storage
    const fileName = generateUniqueFilename(file.name, listingId)

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('listings-media')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
        cacheControl: '3600' // Cache for 1 hour
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file to storage', details: uploadError.message },
        { status: 500 }
      )
    }

    // 8. Get public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('listings-media')
      .getPublicUrl(fileName)

    // 9. Insert media record into database
    const mediaType = getMediaType(file)

    const { data: mediaRecord, error: insertError } = await supabase
      .from('marketplace_listing_media')
      .insert({
        listing_id: listingId,
        url: publicUrl,
        alt_text: altText,
        media_type: mediaType,
        sort_order: sortOrder
      })
      .select()
      .single()

    if (insertError) {
      console.error('Database insert error:', insertError)

      // Cleanup: Delete uploaded file if database insert fails
      await supabase.storage
        .from('listings-media')
        .remove([fileName])

      return NextResponse.json(
        { error: 'Failed to save media record', details: insertError.message },
        { status: 500 }
      )
    }

    // 10. Return success response
    return NextResponse.json(
      {
        success: true,
        media: mediaRecord,
        warnings: validation.warnings
      },
      { status: 201 }
    )

  } catch (error: any) {
    console.error('Media upload error:', error)

    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (error.message === 'Admin access required') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// ============================================================================
// GET - List Media with Access Control
// ============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAuthClient()
    const listingId = params.id

    // 1. Get current user (may be null for unauthenticated requests)
    const { data: { user } } = await supabase.auth.getUser()

    // 2. Fetch listing to check premium status and seller
    const { data: listing, error: listingError } = await supabase
      .from('marketplace_listings')
      .select('is_premium, seller_id, status, title')
      .eq('id', listingId)
      .single()

    if (listingError || !listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // 3. Fetch media (RLS policies will filter based on user's subscription tier)
    const { data: media, error: mediaError } = await supabase
      .from('marketplace_listing_media')
      .select('*')
      .eq('listing_id', listingId)
      .order('sort_order', { ascending: true })

    if (mediaError) {
      console.error('Media fetch error:', mediaError)
      return NextResponse.json(
        { error: 'Failed to fetch media' },
        { status: 500 }
      )
    }

    // 4. Determine user's subscription tier
    let userTier = 'free'
    let isListingSeller = false

    if (user) {
      const { data: userData } = await supabase
        .from('users')
        .select('subscription_tier')
        .eq('id', user.id)
        .single()

      userTier = userData?.subscription_tier || 'free'
      isListingSeller = listing.seller_id === user.id
    }

    // 5. Add access metadata to each media item
    const mediaWithAccess = media.map((item, index) => {
      // Determine if user has access to this media item
      const hasAccess =
        !listing.is_premium || // Non-premium listings are always accessible
        ['pro', 'elite'].includes(userTier) || // Pro/Elite users get full access
        isListingSeller || // Sellers see their own content
        index < 2 // Free users get first 2 preview photos

      return {
        ...item,
        has_access: hasAccess,
        requires_upgrade: listing.is_premium && userTier === 'free' && index >= 2,
        preview_only: !hasAccess
      }
    })

    // 6. Return media array with metadata
    return NextResponse.json({
      media: mediaWithAccess,
      listing: {
        id: listing.id,
        title: listing.title,
        is_premium: listing.is_premium,
        status: listing.status
      },
      user_tier: userTier,
      is_seller: isListingSeller,
      total_count: media.length,
      accessible_count: mediaWithAccess.filter(m => m.has_access).length
    })

  } catch (error: any) {
    console.error('Media list error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// ============================================================================
// DELETE - Remove Media File
// ============================================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Verify admin access
    await requireAdmin()

    const supabase = createAuthClient()
    const listingId = params.id

    // 2. Get media ID from query params
    const { searchParams } = new URL(request.url)
    const mediaId = searchParams.get('mediaId')

    if (!mediaId) {
      return NextResponse.json(
        { error: 'Media ID required' },
        { status: 400 }
      )
    }

    // 3. Fetch media record to get storage path
    const { data: media, error: fetchError } = await supabase
      .from('marketplace_listing_media')
      .select('*')
      .eq('id', mediaId)
      .eq('listing_id', listingId)
      .single()

    if (fetchError || !media) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      )
    }

    // 4. Extract file path from URL
    // URL format: https://{project}.supabase.co/storage/v1/object/public/listings-media/{path}
    const urlParts = media.url.split('/listings-media/')
    if (urlParts.length < 2) {
      console.error('Invalid media URL format:', media.url)
      return NextResponse.json(
        { error: 'Invalid media URL format' },
        { status: 500 }
      )
    }

    const filePath = urlParts[1]

    // 5. Delete from Supabase Storage
    const { error: storageError } = await supabase.storage
      .from('listings-media')
      .remove([filePath])

    if (storageError) {
      console.error('Storage deletion error:', storageError)
      // Continue anyway - may already be deleted
    }

    // 6. Delete database record
    const { error: deleteError } = await supabase
      .from('marketplace_listing_media')
      .delete()
      .eq('id', mediaId)

    if (deleteError) {
      console.error('Database deletion error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete media record' },
        { status: 500 }
      )
    }

    // 7. Reorder remaining media items
    const { data: remainingMedia } = await supabase
      .from('marketplace_listing_media')
      .select('id')
      .eq('listing_id', listingId)
      .order('sort_order', { ascending: true })

    if (remainingMedia && remainingMedia.length > 0) {
      // Update sort_order to close gaps
      for (let i = 0; i < remainingMedia.length; i++) {
        await supabase
          .from('marketplace_listing_media')
          .update({ sort_order: i })
          .eq('id', remainingMedia[i].id)
      }
    }

    return NextResponse.json({ success: true, deleted_id: mediaId })

  } catch (error: any) {
    console.error('Media deletion error:', error)

    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (error.message === 'Admin access required') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
