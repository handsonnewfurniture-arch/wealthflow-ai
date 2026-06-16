import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { MarketplaceListing } from '@/lib/supabase'

// GET /api/marketplace/listings - Get all listings with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Extract query parameters
    const state = searchParams.get('state')
    const county = searchParams.get('county')
    const status = searchParams.get('status') || 'active'
    const listing_type = searchParams.get('listing_type')
    const sort = searchParams.get('sort') || 'newest'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const search = searchParams.get('search')
    const min_price = searchParams.get('min_price')
    const max_price = searchParams.get('max_price')
    const featured_only = searchParams.get('featured') === 'true'

    // Build query
    let query = supabase
      .from('marketplace_listings')
      .select('*', { count: 'exact' })

    // Apply filters
    if (state) {
      query = query.eq('state', state)
    }

    if (county) {
      query = query.eq('county', county)
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (listing_type) {
      query = query.eq('listing_type', listing_type)
    }

    if (featured_only) {
      query = query.eq('featured', true)
    }

    if (min_price) {
      query = query.gte('asking_price', parseFloat(min_price))
    }

    if (max_price) {
      query = query.lte('asking_price', parseFloat(max_price))
    }

    // Full-text search
    if (search) {
      query = query.textSearch('property_address', search, {
        type: 'websearch',
        config: 'english'
      })
    }

    // Sorting
    switch (sort) {
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'price_low':
        query = query.order('asking_price', { ascending: true })
        break
      case 'price_high':
        query = query.order('asking_price', { ascending: false })
        break
      case 'roi':
        query = query.order('interest_rate', { ascending: false })
        break
      case 'expiring':
        query = query.order('redemption_deadline', { ascending: true })
        break
      default:
        query = query.order('created_at', { ascending: false })
    }

    // Pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching listings:', error)
      return NextResponse.json(
        { error: 'Failed to fetch listings' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      listings: data,
      count,
      limit,
      offset
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/marketplace/listings - Create new listing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = [
      'seller_id',
      'county',
      'state',
      'property_address',
      'parcel_id',
      'assessed_value',
      'original_purchase_price',
      'original_purchase_date',
      'current_value',
      'asking_price',
      'interest_rate',
      'redemption_deadline'
    ]

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Calculate days held
    const purchaseDate = new Date(body.original_purchase_date)
    const today = new Date()
    const daysHeld = Math.floor((today.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24))

    // Prepare listing data
    const listingData: Partial<MarketplaceListing> = {
      seller_id: body.seller_id,
      seller_name: body.seller_name,
      seller_rating: body.seller_rating,
      opportunity_id: body.opportunity_id,
      county: body.county,
      state: body.state,
      property_address: body.property_address,
      parcel_id: body.parcel_id,
      property_type: body.property_type || 'Residential',
      assessed_value: parseFloat(body.assessed_value),
      original_purchase_price: parseFloat(body.original_purchase_price),
      original_purchase_date: body.original_purchase_date,
      current_value: parseFloat(body.current_value),
      asking_price: parseFloat(body.asking_price),
      interest_rate: parseFloat(body.interest_rate),
      days_held: daysHeld,
      redemption_deadline: body.redemption_deadline,
      status: 'active',
      listing_type: body.listing_type || 'fixed_price',
      featured: body.featured || false,
      description: body.description,
      auction_start_date: body.auction_start_date,
      auction_end_date: body.auction_end_date,
      starting_bid: body.starting_bid ? parseFloat(body.starting_bid) : null,
      reserve_price: body.reserve_price ? parseFloat(body.reserve_price) : null,
    }

    const { data, error } = await supabase
      .from('marketplace_listings')
      .insert([listingData])
      .select()
      .single()

    if (error) {
      console.error('Error creating listing:', error)
      return NextResponse.json(
        { error: 'Failed to create listing' },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
