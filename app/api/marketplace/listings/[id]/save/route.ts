import { NextRequest, NextResponse } from 'next/server'
import { createAuthClient, requireAuth } from '@/lib/marketplace/api'

// POST /api/marketplace/listings/[id]/save - Save listing (auth required)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const supabase = createAuthClient()
    const user = await requireAuth(supabase)

    // Check if listing exists
    const { data: listing } = await supabase
      .from('marketplace_listings')
      .select('id')
      .eq('id', id)
      .single()

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Insert or ignore if already saved
    const { data, error } = await supabase
      .from('saved_listings')
      .upsert({
        user_id: user.id,
        listing_id: id
      }, {
        onConflict: 'user_id,listing_id',
        ignoreDuplicates: false
      })
      .select()
      .single()

    if (error) {
      // If it's a unique constraint violation, that's fine - already saved
      if (error.code === '23505') {
        return NextResponse.json({ message: 'Listing already saved' })
      }

      console.error('Error saving listing:', error)
      return NextResponse.json(
        { error: 'Failed to save listing' },
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

// DELETE /api/marketplace/listings/[id]/save - Unsave listing (auth required)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const supabase = createAuthClient()
    const user = await requireAuth(supabase)

    const { error } = await supabase
      .from('saved_listings')
      .delete()
      .eq('user_id', user.id)
      .eq('listing_id', id)

    if (error) {
      console.error('Error unsaving listing:', error)
      return NextResponse.json(
        { error: 'Failed to unsave listing' },
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
