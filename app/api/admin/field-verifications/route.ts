/**
 * Admin Field Verifications List
 * List all field verifications for admin review
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAuthClient, requireAuth } from '@/lib/marketplace/api'

export async function GET(request: NextRequest) {
  try {
    const supabase = createAuthClient()
    const user = await requireAuth(supabase)

    // Check if user is admin
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!userData || !['admin', 'superadmin'].includes(userData.role)) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'pending'

    // Fetch verifications
    let query = supabase
      .from('marketplace_field_verifications')
      .select(`
        *,
        contributor:users!contributor_id(id, email, full_name),
        listing:marketplace_listings!listing_id(id, title, property_address, county, state),
        reviewer:users!reviewed_by(id, full_name)
      `)
      .order('created_at', { ascending: false })

    if (status !== 'all') {
      query = query.eq('status', status)
    }

    const { data: verifications, error } = await query

    if (error) {
      console.error('Error fetching verifications:', error)
      return NextResponse.json(
        { error: 'Failed to fetch verifications' },
        { status: 500 }
      )
    }

    // Calculate stats
    const stats = {
      pending: verifications?.filter(v => v.status === 'pending').length || 0,
      approved: verifications?.filter(v => v.status === 'approved').length || 0,
      rejected: verifications?.filter(v => v.status === 'rejected').length || 0,
      total: verifications?.length || 0
    }

    return NextResponse.json({
      verifications: verifications || [],
      stats
    })

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
