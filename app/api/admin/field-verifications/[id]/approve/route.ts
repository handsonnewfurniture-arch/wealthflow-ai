/**
 * Admin Field Verification Approval
 * Approve user-submitted field verifications and grant rewards
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
    const { premiumDays = 7, adminNotes } = body

    // Update verification status to approved
    const exclusivityExpires = new Date()
    exclusivityExpires.setDate(exclusivityExpires.getDate() + 3) // 3-day exclusivity

    const { error: updateError } = await supabase
      .from('marketplace_field_verifications')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        reviewed_by: user.id,
        exclusivity_expires_at: exclusivityExpires.toISOString(),
        admin_notes: adminNotes || verification.admin_notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to approve verification' },
        { status: 500 }
      )
    }

    // Grant reward using database function
    const { error: rewardError } = await supabase.rpc('grant_field_verification_reward', {
      verification_id: params.id,
      days_to_grant: premiumDays
    })

    if (rewardError) {
      console.error('Reward error:', rewardError)
      // Don't fail the approval, just log the error
    }

    // Get contributor details for response
    const { data: contributor } = await supabase
      .from('users')
      .select('id, email, full_name, premium_days_earned')
      .eq('id', verification.contributor_id)
      .single()

    return NextResponse.json({
      success: true,
      message: `Verification approved! Contributor earned ${premiumDays} days of premium access.`,
      contributor: {
        id: contributor?.id,
        name: contributor?.full_name,
        email: contributor?.email,
        totalPremiumDays: contributor?.premium_days_earned
      }
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
