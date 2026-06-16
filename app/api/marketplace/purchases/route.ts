import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/marketplace/purchases - Get user's purchases
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')
    const role = searchParams.get('role') // 'buyer' or 'seller'

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      )
    }

    let query = supabase
      .from('marketplace_purchases')
      .select(`
        *,
        listing:marketplace_listings(*)
      `)
      .order('purchased_at', { ascending: false })

    if (role === 'buyer') {
      query = query.eq('buyer_id', user_id)
    } else if (role === 'seller') {
      query = query.eq('seller_id', user_id)
    } else {
      // Get both buyer and seller purchases
      query = query.or(`buyer_id.eq.${user_id},seller_id.eq.${user_id}`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching purchases:', error)
      return NextResponse.json(
        { error: 'Failed to fetch purchases' },
        { status: 500 }
      )
    }

    return NextResponse.json({ purchases: data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/marketplace/purchases - Initiate a purchase
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.listing_id || !body.buyer_id || !body.purchase_price) {
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

    // Validate listing is available
    if (listing.status !== 'active' && listing.status !== 'pending') {
      return NextResponse.json(
        { error: 'Listing is no longer available' },
        { status: 400 }
      )
    }

    // Validate purchase price
    const purchasePrice = parseFloat(body.purchase_price)
    if (listing.listing_type === 'fixed_price' && purchasePrice !== listing.asking_price) {
      return NextResponse.json(
        { error: 'Purchase price must match asking price' },
        { status: 400 }
      )
    }

    // Calculate fees (5% marketplace fee)
    const marketplaceFee = purchasePrice * 0.05
    const sellerPayout = purchasePrice - marketplaceFee

    // Use Supabase RPC to complete purchase (ensures atomicity)
    const { data, error } = await supabase.rpc('complete_marketplace_purchase', {
      p_listing_id: body.listing_id,
      p_buyer_id: body.buyer_id,
      p_purchase_price: purchasePrice,
      p_payment_intent_id: body.payment_intent_id || null
    })

    if (error) {
      console.error('Error completing purchase:', error)
      return NextResponse.json(
        { error: 'Failed to complete purchase' },
        { status: 500 }
      )
    }

    // Fetch the created purchase
    const { data: purchase } = await supabase
      .from('marketplace_purchases')
      .select('*')
      .eq('id', data)
      .single()

    return NextResponse.json(purchase, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
