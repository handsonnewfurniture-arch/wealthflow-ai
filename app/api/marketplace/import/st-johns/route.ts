import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/marketplace/api'
import { LEGAL_DISCLAIMER, LISTING_TYPES } from '@/lib/marketplace/constants'
import * as fs from 'fs'
import * as path from 'path'

// POST /api/marketplace/import/st-johns - Import St Johns County data
// This endpoint is idempotent based on parcel_apn
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { seller_id, dry_run = false } = body

    if (!seller_id) {
      return NextResponse.json(
        { error: 'seller_id is required' },
        { status: 400 }
      )
    }

    // Read St Johns data file
    const dataPath = path.join(process.cwd(), 'scrapers/data/fl/st_johns.json')

    if (!fs.existsSync(dataPath)) {
      return NextResponse.json(
        { error: 'St Johns data file not found' },
        { status: 404 }
      )
    }

    const fileContent = fs.readFileSync(dataPath, 'utf-8')
    const stJohnsData = JSON.parse(fileContent)

    if (!Array.isArray(stJohnsData)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Transform and prepare listings
    const listings = stJohnsData.map(item => {
      // Calculate current value with accrued interest
      const purchaseDate = new Date(item.original_lien_date || item.certificate_date)
      const today = new Date()
      const yearsHeld = (today.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
      const interestRate = parseFloat(item.interest_rate) || 18
      const originalAmount = parseFloat(item.face_value) || parseFloat(item.lien_amount) || 0
      const accruedValue = originalAmount * Math.pow(1 + (interestRate / 100), yearsHeld)

      // Calculate buy now price (15% markup on accrued value)
      const buyNowPrice = Math.round(accruedValue * 1.15 * 100) / 100

      // Calculate redemption deadline (typically 2 years from purchase)
      const redemptionDeadline = new Date(purchaseDate)
      redemptionDeadline.setFullYear(redemptionDeadline.getFullYear() + 2)

      return {
        seller_id,
        title: `${item.property_address || item.address} - Tax Lien Certificate`,
        listing_type: LISTING_TYPES.TAX_LIEN,
        property_address: item.property_address || item.address || 'Address not available',
        parcel_apn: item.parcel_id || item.parcel_apn || item.account_number,
        county: 'St. Johns',
        state: 'FL',
        auction_name: item.auction_name || null,
        auction_date_time: item.auction_date ? new Date(item.auction_date).toISOString() : null,
        redemption_period: '2 years',
        buy_now_price: buyNowPrice,
        estimated_value: parseFloat(item.assessed_value) || parseFloat(item.property_value) || null,
        notes: [
          `Original Certificate: ${item.certificate_number || 'N/A'}`,
          `Interest Rate: ${interestRate}%`,
          `Original Amount: $${originalAmount.toFixed(2)}`,
          `Current Value: $${accruedValue.toFixed(2)}`
        ].join('\n'),
        legal_disclaimer: LEGAL_DISCLAIMER,
        source: 'st_johns_import',
        source_metadata: {
          certificate_number: item.certificate_number,
          original_face_value: originalAmount,
          accrued_value: accruedValue,
          years_held: yearsHeld,
          redemption_deadline: redemptionDeadline.toISOString()
        },
        status: 'active',
        published_at: new Date().toISOString()
      }
    })

    if (dry_run) {
      return NextResponse.json({
        message: 'Dry run - no data imported',
        count: listings.length,
        sample: listings.slice(0, 3)
      })
    }

    // Import listings using upsert to make it idempotent
    // Upsert based on parcel_apn + county + state
    const { data, error } = await supabase
      .from('marketplace_listings')
      .upsert(listings, {
        onConflict: 'parcel_apn,county,state',
        ignoreDuplicates: false
      })
      .select()

    if (error) {
      console.error('Error importing listings:', error)
      return NextResponse.json(
        { error: 'Failed to import listings', details: error.message },
        { status: 500 }
      )
    }

    // Create audit log
    await supabase
      .from('marketplace_audit_logs')
      .insert({
        listing_id: null,
        actor_id: seller_id,
        action: 'bulk_import',
        metadata: {
          source: 'st_johns',
          count: listings.length,
          imported_at: new Date().toISOString()
        }
      })

    return NextResponse.json({
      message: 'Import successful',
      imported: data?.length || 0,
      total: listings.length
    }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
