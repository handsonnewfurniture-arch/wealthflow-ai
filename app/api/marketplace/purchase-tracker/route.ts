import { NextRequest, NextResponse } from 'next/server'
import { createAuthClient, requireAuth } from '@/lib/marketplace/api'

// GET /api/marketplace/purchase-tracker - Get user's purchases (auth required)
// This endpoint supports both REST and realtime usage
export async function GET(request: NextRequest) {
  try {
    const supabase = createAuthClient()
    const user = await requireAuth(supabase)

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // Filter by payment_status

    // Build query to get purchases where user is buyer or seller
    let query = supabase
      .from('marketplace_purchases')
      .select(`
        *,
        listing:marketplace_listings (*)
      `)
      .or(`buyer_id.eq.${user.id},listing_id.in.(select id from marketplace_listings where seller_id = ${user.id})`)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('payment_status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching purchases:', error)
      return NextResponse.json(
        { error: 'Failed to fetch purchases' },
        { status: 500 }
      )
    }

    // Transform data to include role (buyer or seller)
    const purchases = (data || []).map(purchase => ({
      ...purchase,
      user_role: purchase.buyer_id === user.id ? 'buyer' : 'seller'
    }))

    return NextResponse.json({ purchases })
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
