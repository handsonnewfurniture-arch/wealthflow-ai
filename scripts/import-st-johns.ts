#!/usr/bin/env ts-node
/**
 * St Johns County Tax Lien Import Script
 *
 * Usage:
 *   npm run import:st-johns <seller_id> [--dry-run]
 *
 * Example:
 *   npm run import:st-johns "123e4567-e89b-12d3-a456-426614174000"
 *   npm run import:st-johns "123e4567-e89b-12d3-a456-426614174000" --dry-run
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables from .env.local
config({ path: path.join(process.cwd(), '.env.local') })

// Config
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase environment variables')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const LEGAL_DISCLAIMER = 'Tax liens and tax deeds involve substantial risk. Information is provided for research and marketplace facilitation only and is not financial, legal, tax, or investment advice. Returns are not guaranteed. Buyers must perform independent due diligence, verify all property and auction information with official county sources, and consult qualified professionals before bidding or purchasing.'

async function importStJohns(sellerId: string, dryRun: boolean = false) {
  console.log('🚀 St Johns County Tax Lien Import')
  console.log('=====================================')
  console.log(`Seller ID: ${sellerId}`)
  console.log(`Dry Run: ${dryRun ? 'YES' : 'NO'}`)
  console.log('')

  // Read data file
  const dataPath = path.join(process.cwd(), 'scrapers/data/fl/st_johns.json')

  if (!fs.existsSync(dataPath)) {
    console.error(`❌ Error: Data file not found at ${dataPath}`)
    process.exit(1)
  }

  console.log(`📁 Reading data from: ${dataPath}`)
  const fileContent = fs.readFileSync(dataPath, 'utf-8')
  const stJohnsData = JSON.parse(fileContent)

  if (!Array.isArray(stJohnsData)) {
    console.error('❌ Error: Invalid data format - expected array')
    process.exit(1)
  }

  console.log(`✅ Found ${stJohnsData.length} tax liens`)
  console.log('')

  // Initialize Supabase client
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  // Transform data
  console.log('🔄 Transforming data...')
  const listings = stJohnsData.map((item, index) => {
    // Calculate current value with accrued interest
    // Use auction_date as reference since we don't have original purchase date
    const auctionDateStr = item.auction_date || item.original_lien_date || item.certificate_date
    const purchaseDate = auctionDateStr ? new Date(auctionDateStr) : new Date()
    const today = new Date()

    // Validate the date
    if (isNaN(purchaseDate.getTime())) {
      throw new Error(`Invalid date for item ${index}: ${auctionDateStr}`)
    }

    const yearsHeld = (today.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
    const interestRate = parseFloat(item.interest_rate) || 0.18 // Convert to decimal if needed
    const originalAmount = parseFloat(item.face_value) || parseFloat(item.lien_amount) || 0
    const accruedValue = originalAmount * Math.pow(1 + interestRate, yearsHeld)

    // Database limit for NUMERIC(12,2) is 9,999,999,999.99
    const MAX_NUMERIC = 9999999999.99

    // Calculate buy now price (15% markup on accrued value)
    // Cap at MAX_NUMERIC to prevent overflow
    const buyNowPrice = Math.min(
      Math.round(accruedValue * 1.15 * 100) / 100,
      MAX_NUMERIC
    )

    // Cap estimated value as well
    const estimatedValue = parseFloat(item.assessed_value) || parseFloat(item.property_value) || null
    const cappedEstimatedValue = estimatedValue ? Math.min(estimatedValue, MAX_NUMERIC) : null

    // Calculate redemption deadline (use redemption_period_months if available)
    const redemptionMonths = parseInt(item.redemption_period_months) || 24
    const redemptionDeadline = new Date(purchaseDate)
    redemptionDeadline.setMonth(redemptionDeadline.getMonth() + redemptionMonths)

    if ((index + 1) % 100 === 0) {
      process.stdout.write(`  Processed ${index + 1}/${stJohnsData.length}...\r`)
    }

    return {
      seller_id: sellerId,
      title: `${item.property_address || item.address} - Tax Lien Certificate`,
      listing_type: 'tax_lien',
      property_address: item.property_address || item.address || 'Address not available',
      parcel_apn: item.parcel_id || item.parcel_apn || item.account_number,
      county: 'St. Johns',
      state: 'FL',
      auction_name: item.auction_name || null,
      auction_date_time: item.auction_date ? new Date(item.auction_date).toISOString() : null,
      redemption_period: `${redemptionMonths} months`,
      buy_now_price: buyNowPrice,
      estimated_value: cappedEstimatedValue,
      notes: [
        item.notes || '',
        `Interest Rate: ${(interestRate * 100).toFixed(2)}%`,
        `Lien Amount: $${originalAmount.toFixed(2)}`,
        `Accrued Value: $${accruedValue.toFixed(2)}`,
        item.property_type ? `Property Type: ${item.property_type}` : '',
        item.flood_zone ? `Flood Zone: ${item.flood_zone}` : ''
      ].filter(Boolean).join('\n'),
      legal_disclaimer: LEGAL_DISCLAIMER,
      source: 'st_johns_import',
      source_metadata: {
        certificate_number: item.certificate_number,
        original_face_value: originalAmount,
        accrued_value: accruedValue,
        years_held: yearsHeld,
        redemption_deadline: redemptionDeadline.toISOString(),
        latitude: item.latitude,
        longitude: item.longitude,
        property_type: item.property_type,
        flood_zone: item.flood_zone,
        market_value: parseFloat(item.market_value) || null
      },
      status: 'active',
      published_at: new Date().toISOString()
    }
  })

  console.log(`\n✅ Transformed ${listings.length} listings`)
  console.log('')

  // Show sample
  console.log('📋 Sample listing:')
  console.log('---')
  const sample = listings[0]
  console.log(`Title: ${sample.title}`)
  console.log(`Address: ${sample.property_address}`)
  console.log(`Parcel: ${sample.parcel_apn}`)
  console.log(`Buy Now Price: $${sample.buy_now_price}`)
  console.log(`Estimated Value: $${sample.estimated_value}`)
  console.log('---')
  console.log('')

  if (dryRun) {
    console.log('🏁 Dry run complete - no data imported')
    console.log(`Would have imported ${listings.length} listings`)
    return
  }

  // Import to database
  console.log('📥 Importing to database...')
  console.log('(This may take a minute...)')

  // Insert listings in batches to avoid timeouts
  const batchSize = 100
  let imported = 0
  const errors = []

  for (let i = 0; i < listings.length; i += batchSize) {
    const batch = listings.slice(i, i + batchSize)

    const { data, error } = await supabase
      .from('marketplace_listings')
      .insert(batch)
      .select('id')

    if (error) {
      errors.push({ batch: i / batchSize + 1, error: error.message })
      console.error(`\n❌ Batch ${i / batchSize + 1} failed:`, error.message)
    } else {
      imported += data?.length || 0
      process.stdout.write(`  Imported ${imported}/${listings.length}...\r`)
    }
  }

  if (errors.length > 0) {
    console.error(`\n❌ Import completed with ${errors.length} errors`)
    console.error('First error:', errors[0])
    process.exit(1)
  }

  console.log(`\n✅ Import successful!`)
  console.log(`   Imported: ${imported} listings`)
  console.log('')

  // Create audit log
  await supabase
    .from('marketplace_audit_logs')
    .insert({
      listing_id: null,
      actor_id: sellerId,
      action: 'bulk_import',
      metadata: {
        source: 'st_johns',
        count: listings.length,
        imported_at: new Date().toISOString()
      }
    })

  console.log('📝 Audit log created')
  console.log('')
  console.log('🎉 All done!')
}

// Parse command line arguments
const args = process.argv.slice(2)

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log('Usage: npm run import:st-johns <seller_id> [--dry-run]')
  console.log('')
  console.log('Arguments:')
  console.log('  seller_id    UUID of the seller (required)')
  console.log('  --dry-run    Preview import without saving to database')
  console.log('')
  console.log('Example:')
  console.log('  npm run import:st-johns "123e4567-e89b-12d3-a456-426614174000"')
  console.log('  npm run import:st-johns "123e4567-e89b-12d3-a456-426614174000" --dry-run')
  process.exit(0)
}

const sellerId = args[0]
const dryRun = args.includes('--dry-run')

// Validate UUID format
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
if (!uuidRegex.test(sellerId)) {
  console.error('❌ Error: Invalid seller_id format (must be a valid UUID)')
  process.exit(1)
}

// Run import
importStJohns(sellerId, dryRun)
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
  })
