import { NextRequest, NextResponse } from 'next/server'
import { createAuthClient, requireAuth } from '@/lib/marketplace/api'
import { validatePublishListing } from '@/lib/marketplace/validation'

// POST /api/marketplace/listings/[id]/publish - Publish listing (auth required)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const supabase = createAuthClient()
    const user = await requireAuth(supabase)

    // Fetch listing
    const { data: listing, error: fetchError } = await supabase
      .from('marketplace_listings')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Check ownership
    if (listing.seller_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Validate listing can be published
    const validation = validatePublishListing(listing)
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Listing cannot be published', errors: validation.errors },
        { status: 400 }
      )
    }

    // Update status to active and set published_at
    const { data, error } = await supabase
      .from('marketplace_listings')
      .update({
        status: 'active',
        published_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error publishing listing:', error)
      return NextResponse.json(
        { error: 'Failed to publish listing' },
        { status: 500 }
      )
    }

    // Create audit log
    await supabase
      .from('marketplace_audit_logs')
      .insert({
        listing_id: id,
        actor_id: user.id,
        action: 'listing_published',
        after_data: { status: 'active', published_at: data.published_at }
      })

    return NextResponse.json(data)
  } catch (error: any) {
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
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
