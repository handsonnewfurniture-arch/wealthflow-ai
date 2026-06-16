import { NextRequest, NextResponse } from 'next/server'
import { createAuthClient, requireAuth } from '@/lib/marketplace/api'

// POST /api/marketplace/listings/[id]/cancel - Cancel listing (auth required)
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
      .select('seller_id, status')
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

    // Cannot cancel sold listings
    if (listing.status === 'sold') {
      return NextResponse.json(
        { error: 'Cannot cancel sold listings' },
        { status: 400 }
      )
    }

    // Update status to cancelled
    const { data, error } = await supabase
      .from('marketplace_listings')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error cancelling listing:', error)
      return NextResponse.json(
        { error: 'Failed to cancel listing' },
        { status: 500 }
      )
    }

    // Create audit log
    await supabase
      .from('marketplace_audit_logs')
      .insert({
        listing_id: id,
        actor_id: user.id,
        action: 'listing_cancelled',
        before_data: { status: listing.status },
        after_data: { status: 'cancelled' }
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
