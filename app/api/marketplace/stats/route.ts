import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/marketplace/stats - Get marketplace statistics
export async function GET(request: NextRequest) {
  try {
    // Use the stored procedure for optimized stats
    const { data, error } = await supabase.rpc('get_marketplace_stats')

    if (error) {
      console.error('Error fetching marketplace stats:', error)
      return NextResponse.json(
        { error: 'Failed to fetch stats' },
        { status: 500 }
      )
    }

    // Data is returned as an array with a single object
    const stats = data?.[0] || {
      active_listings_count: 0,
      total_volume_30d: 0,
      avg_roi: 0,
      sales_24h: 0
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
