import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/marketplace/saved - Get user's saved listings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('marketplace_saved')
      .select(`
        *,
        listing:marketplace_listings(*)
      `)
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching saved listings:', error)
      return NextResponse.json(
        { error: 'Failed to fetch saved listings' },
        { status: 500 }
      )
    }

    return NextResponse.json({ saved: data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/marketplace/saved - Save a listing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.user_id || !body.listing_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('marketplace_saved')
      .insert([{
        user_id: body.user_id,
        listing_id: body.listing_id,
        notify_on_price_change: body.notify_on_price_change ?? true,
        notify_on_bid: body.notify_on_bid ?? true,
        notify_before_expiration: body.notify_before_expiration ?? true,
      }])
      .select()
      .single()

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { error: 'Listing already saved' },
          { status: 409 }
        )
      }
      console.error('Error saving listing:', error)
      return NextResponse.json(
        { error: 'Failed to save listing' },
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

// DELETE /api/marketplace/saved - Unsave a listing
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')
    const listing_id = searchParams.get('listing_id')

    if (!user_id || !listing_id) {
      return NextResponse.json(
        { error: 'user_id and listing_id are required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('marketplace_saved')
      .delete()
      .eq('user_id', user_id)
      .eq('listing_id', listing_id)

    if (error) {
      console.error('Error unsaving listing:', error)
      return NextResponse.json(
        { error: 'Failed to unsave listing' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
