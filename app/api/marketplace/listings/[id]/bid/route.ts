import { NextRequest, NextResponse } from 'next/server'
import { createAuthClient, requireAuth } from '@/lib/marketplace/api'
import type { PlaceBidRequest } from '@/lib/marketplace/types'
import { validateBidAmount } from '@/lib/marketplace/validation'

// POST /api/marketplace/listings/[id]/bid - Place bid on listing (auth required)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const supabase = createAuthClient()
    const user = await requireAuth(supabase)

    const body: PlaceBidRequest = await request.json()

    // Fetch listing to validate bid
    const { data: listing, error: fetchError } = await supabase
      .from('marketplace_listings')
      .select('current_bid, starting_bid, listing_type, status')
      .eq('id', id)
      .single()

    if (fetchError || !listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Validate bid amount
    const validation = validateBidAmount(
      body.bid_amount,
      listing.current_bid,
      listing.starting_bid
    )

    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid bid amount', errors: validation.errors },
        { status: 400 }
      )
    }

    // Call RPC function for race-safe bid placement
    const { data, error } = await supabase
      .rpc('place_marketplace_bid', {
        p_listing_id: id,
        p_bid_amount: body.bid_amount
      })

    if (error) {
      console.error('Error placing bid:', error)

      // Handle specific error messages from RPC function
      if (error.message) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: 'Failed to place bid' },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })
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
