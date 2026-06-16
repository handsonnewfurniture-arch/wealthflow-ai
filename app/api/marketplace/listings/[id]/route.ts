import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient, createAuthClient, requireAuth } from '@/lib/marketplace/api'
import { validateUpdateListing } from '@/lib/marketplace/validation'
import type { UpdateListingRequest } from '@/lib/marketplace/types'

// GET /api/marketplace/listings/[id] - Get single listing
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from('marketplace_listings')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Listing not found' },
          { status: 404 }
        )
      }
      console.error('Error fetching listing:', error)
      return NextResponse.json(
        { error: 'Failed to fetch listing' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/marketplace/listings/[id] - Update listing (auth required)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const supabase = createAuthClient()
    const user = await requireAuth(supabase)

    const body: UpdateListingRequest = await request.json()

    // Validate request
    const validation = validateUpdateListing(body)
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      )
    }

    // Check ownership
    const { data: existing } = await supabase
      .from('marketplace_listings')
      .select('seller_id, status')
      .eq('id', id)
      .single()

    if (!existing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    if (existing.seller_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Cannot update sold listings
    if (existing.status === 'sold') {
      return NextResponse.json(
        { error: 'Cannot update sold listings' },
        { status: 400 }
      )
    }

    // Update listing
    const { data, error } = await supabase
      .from('marketplace_listings')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating listing:', error)
      return NextResponse.json(
        { error: 'Failed to update listing' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
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

// DELETE /api/marketplace/listings/[id] - Delete listing (auth required)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const supabase = createAuthClient()
    const user = await requireAuth(supabase)

    // Check ownership and status
    const { data: existing } = await supabase
      .from('marketplace_listings')
      .select('seller_id, status')
      .eq('id', id)
      .single()

    if (!existing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    if (existing.seller_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Cannot delete sold listings
    if (existing.status === 'sold') {
      return NextResponse.json(
        { error: 'Cannot delete sold listings' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('marketplace_listings')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting listing:', error)
      return NextResponse.json(
        { error: 'Failed to delete listing' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
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
