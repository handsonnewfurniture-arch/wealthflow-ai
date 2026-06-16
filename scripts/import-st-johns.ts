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

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

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

  const { data, error } = await supabase
    .from('marketplace_listings')
    .upsert(listings, {
      onConflict: 'parcel_apn,county,state',
      ignoreDuplicates: false
    })
    .select('id')

  if (error) {
    console.error('❌ Import failed:', error.message)
    process.exit(1)
  }

  console.log(`\n✅ Import successful!`)
  console.log(`   Imported: ${data?.length || 0} listings`)
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
