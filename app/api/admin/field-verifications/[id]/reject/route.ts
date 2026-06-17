/**
 * Admin Field Verification Rejection
 * Reject user-submitted field verifications
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAuthClient, requireAuth } from '@/lib/marketplace/api'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get verification
    const { data: verification, error: fetchError } = await supabase
      .from('marketplace_field_verifications')
      .select('*')
      .eq('id', params.id)
      .single()

    if (fetchError || !verification) {
      return NextResponse.json(
        { error: 'Verification not found' },
        { status: 404 }
      )
    }

    if (verification.status !== 'pending') {
      return NextResponse.json(
        { error: 'Verification already processed' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { reason } = body

    if (!reason) {
      return NextResponse.json(
        { error: 'Rejection reason is required' },
        { status: 400 }
      )
    }

    // Update verification status to rejected
    const { error: updateError } = await supabase
      .from('marketplace_field_verifications')
      .update({
        status: 'rejected',
        rejected_at: new Date().toISOString(),
        reviewed_by: user.id,
        rejection_reason: reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to reject verification' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Verification rejected'
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
