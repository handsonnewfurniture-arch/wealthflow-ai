import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      parcelId,
      address,
      county,
      state,
      purchaseAmount,
      interestRate,
      purchaseDate,
      redemptionDeadline,
      propertyType,
      notes,
      userId // In production, get this from auth session
    } = body

    // Validate required fields
    if (!address || !county || !state || !purchaseAmount || !interestRate || !purchaseDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate days held
    const purchaseDateObj = new Date(purchaseDate)
    const today = new Date()
    const daysHeld = Math.floor(
      (today.getTime() - purchaseDateObj.getTime()) / (1000 * 60 * 60 * 24)
    )

    // Calculate current value (simple interest)
    const currentValue = purchaseAmount * (1 + (interestRate / 100) * (daysHeld / 365))
    const profit = currentValue - purchaseAmount

    // In production, you would get userId from the authenticated session
    // For now, using a mock user ID
    const mockUserId = userId || 'demo-user-id'

    // Insert into portfolios table
    const { data, error } = await supabase
      .from('portfolios')
      .insert({
        user_id: mockUserId,
        parcel_id: parcelId,
        address,
        county_id: null, // Optional: lookup county by name/state
        purchase_amount: purchaseAmount,
        interest_rate: interestRate,
        purchase_date: purchaseDate,
        redemption_deadline: redemptionDeadline,
        status: 'active',
        notes,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to add lien to database' },
        { status: 500 }
      )
    }

    // Award XP for adding a lien
    // In production, call update_user_xp function
    // await supabase.rpc('update_user_xp', { p_user_id: mockUserId, p_xp_amount: 25 })

    return NextResponse.json({
      success: true,
      lien: data,
      message: 'Lien added successfully! +25 XP'
    })

  } catch (error: any) {
    console.error('Error adding lien:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
