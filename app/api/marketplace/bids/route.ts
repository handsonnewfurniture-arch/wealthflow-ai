import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { MarketplaceBid } from '@/lib/supabase'

// GET /api/marketplace/bids - Get bids (filtered by user or listing)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const listing_id = searchParams.get('listing_id')
    const bidder_id = searchParams.get('bidder_id')
    const status = searchParams.get('status')

    let query = supabase.from('marketplace_bids').select('*')

    if (listing_id) {
      query = query.eq('listing_id', listing_id)
    }

    if (bidder_id) {
      query = query.eq('bidder_id', bidder_id)
    }

    if (status) {
      query = query.eq('status', status)
    }

    query = query.order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error('Error fetching bids:', error)
      return NextResponse.json(
        { error: 'Failed to fetch bids' },
        { status: 500 }
      )
    }

    return NextResponse.json({ bids: data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/marketplace/bids - Place a new bid
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.listing_id || !body.bidder_id || !body.bid_amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get listing details
    const { data: listing, error: listingError } = await supabase
      .from('marketplace_listings')
      .select('*')
      .eq('id', body.listing_id)
      .single()

    if (listingError || !listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Validate listing is active auction
    if (listing.status !== 'active') {
      return NextResponse.json(
        { error: 'Listing is not active' },
        { status: 400 }
      )
    }

    if (listing.listing_type !== 'auction') {
      return NextResponse.json(
        { error: 'Listing is not an auction' },
        { status: 400 }
      )
    }

    // Validate bid amount
    const bidAmount = parseFloat(body.bid_amount)
    const minBid = listing.current_bid
      ? listing.current_bid + 100 // $100 minimum increment
      : listing.starting_bid || listing.asking_price

    if (bidAmount < minBid) {
      return NextResponse.json(
        { error: `Bid must be at least $${minBid}` },
        { status: 400 }
      )
    }

    // Validate auction hasn't ended
    if (listing.auction_end_date && new Date(listing.auction_end_date) < new Date()) {
      return NextResponse.json(
        { error: 'Auction has ended' },
        { status: 400 }
      )
    }

    // Check if user already has an active bid on this listing
    const { data: existingBid } = await supabase
      .from('marketplace_bids')
      .select('*')
      .eq('listing_id', body.listing_id)
      .eq('bidder_id', body.bidder_id)
      .eq('status', 'active')
      .single()

    if (existingBid) {
      // Update existing bid
      const { data, error } = await supabase
        .from('marketplace_bids')
        .update({
          bid_amount: bidAmount,
          auto_bid_enabled: body.auto_bid_enabled || false,
          max_auto_bid: body.max_auto_bid ? parseFloat(body.max_auto_bid) : null,
        })
        .eq('id', existingBid.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating bid:', error)
        return NextResponse.json(
          { error: 'Failed to update bid' },
          { status: 500 }
        )
      }

      return NextResponse.json(data)
    } else {
      // Create new bid
      const bidData: Partial<MarketplaceBid> = {
        listing_id: body.listing_id,
        bidder_id: body.bidder_id,
        bid_amount: bidAmount,
        status: 'active',
        auto_bid_enabled: body.auto_bid_enabled || false,
        max_auto_bid: body.max_auto_bid ? parseFloat(body.max_auto_bid) : null,
      }

      const { data, error } = await supabase
        .from('marketplace_bids')
        .insert([bidData])
        .select()
        .single()

      if (error) {
        console.error('Error creating bid:', error)
        return NextResponse.json(
          { error: 'Failed to create bid' },
          { status: 500 }
        )
      }

      return NextResponse.json(data, { status: 201 })
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
