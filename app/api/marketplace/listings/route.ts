import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient, createAuthClient, requireAuth } from '@/lib/marketplace/api'
import { validateCreateListing } from '@/lib/marketplace/validation'
import type { CreateListingRequest, ListingFilters } from '@/lib/marketplace/types'
import { LISTING_STATUSES } from '@/lib/marketplace/constants'

// GET /api/marketplace/listings - List listings with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse filters from query params
    const filters: ListingFilters = {
      query: searchParams.get('query') || undefined,
      state: searchParams.get('state') || undefined,
      county: searchParams.get('county') || undefined,
      listing_type: searchParams.get('listing_type') as any || undefined,
      status: searchParams.get('status') as any || undefined,
      parcel_apn: searchParams.get('parcel_apn') || undefined,
      auction_date_from: searchParams.get('auction_date_from') || undefined,
      auction_date_to: searchParams.get('auction_date_to') || undefined,
      min_price: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined,
      max_price: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined,
      sort: (searchParams.get('sort') as any) || 'newest',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      pageSize: searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 20,
    }

    const supabase = createServiceClient()

    // Build query - default to active listings only
    let query = supabase
      .from('marketplace_listings')
      .select('*', { count: 'exact' })

    // Apply status filter (default to active only)
    if (filters.status) {
      query = query.eq('status', filters.status)
    } else {
      query = query.eq('status', 'active')
    }

    // Apply filters
    if (filters.state) {
      query = query.eq('state', filters.state)
    }

    if (filters.county) {
      query = query.ilike('county', `%${filters.county}%`)
    }

    if (filters.listing_type) {
      query = query.eq('listing_type', filters.listing_type)
    }

    if (filters.parcel_apn) {
      query = query.eq('parcel_apn', filters.parcel_apn)
    }

    if (filters.auction_date_from) {
      query = query.gte('auction_date_time', filters.auction_date_from)
    }

    if (filters.auction_date_to) {
      query = query.lte('auction_date_time', filters.auction_date_to)
    }

    // Price filtering (check both starting_bid and buy_now_price)
    if (filters.min_price !== undefined) {
      query = query.or(`starting_bid.gte.${filters.min_price},buy_now_price.gte.${filters.min_price}`)
    }

    if (filters.max_price !== undefined) {
      query = query.or(`starting_bid.lte.${filters.max_price},buy_now_price.lte.${filters.max_price}`)
    }

    // Full-text search
    if (filters.query) {
      query = query.textSearch(
        'fts',
        filters.query.split(' ').map(term => term + ':*').join(' & '),
        { type: 'websearch' }
      )
    }

    // Sorting
    switch (filters.sort) {
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'oldest':
        query = query.order('created_at', { ascending: true })
        break
      case 'price_low':
        query = query.order('buy_now_price', { ascending: true, nullsFirst: false })
        break
      case 'price_high':
        query = query.order('buy_now_price', { ascending: false, nullsFirst: false })
        break
      case 'auction_date':
        query = query.order('auction_date_time', { ascending: true, nullsFirst: false })
        break
      default:
        query = query.order('published_at', { ascending: false, nullsFirst: false })
    }

    // Pagination
    const page = filters.page || 1
    const pageSize = Math.min(filters.pageSize || 20, 100) // Cap at 100
    const offset = (page - 1) * pageSize

    query = query.range(offset, offset + pageSize - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching listings:', error)
      return NextResponse.json(
        { error: 'Failed to fetch listings' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      listings: data || [],
      pagination: {
        page,
        pageSize,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize)
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

// POST /api/marketplace/listings - Create new listing (auth required)
export async function POST(request: NextRequest) {
  try {
    const supabase = createAuthClient()
    const user = await requireAuth(supabase)

    const body: CreateListingRequest = await request.json()

    // Validate request
    const validation = validateCreateListing(body)
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      )
    }

    // Prepare listing data
    const listingData = {
      seller_id: user.id,
      title: body.title,
      listing_type: body.listing_type,
      property_address: body.property_address,
      parcel_apn: body.parcel_apn,
      county: body.county,
      state: body.state,
      auction_name: body.auction_name || null,
      auction_date_time: body.auction_date_time || null,
      redemption_period: body.redemption_period || null,
      starting_bid: body.starting_bid || null,
      buy_now_price: body.buy_now_price || null,
      estimated_value: body.estimated_value || null,
      notes: body.notes || null,
      source: body.source || null,
      source_metadata: body.source_metadata || {},
      status: 'draft' as const,
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
