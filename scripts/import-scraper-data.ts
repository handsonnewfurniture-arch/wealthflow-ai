/**
 * Import scraper data into marketplace listings
 *
 * This script imports tax lien data from scrapers (e.g., st_johns.json)
 * and creates marketplace listings.
 *
 * Usage:
 *   npx ts-node scripts/import-scraper-data.ts <scraper-file-path> <seller-id>
 *
 * Example:
 *   npx ts-node scripts/import-scraper-data.ts scrapers/data/fl/st_johns.json user-uuid-here
 */

import * as fs from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:')
  console.error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface ScraperLien {
  county: string
  state: string
  parcel_id: string
  property_address: string
  property_type?: string
  assessed_value: number
  lien_amount: number
  interest_rate: number
  auction_date?: string
  redemption_period_months?: number
  status?: string
  last_updated?: string
  prior_year_taxes?: number
  opportunity_score?: number
  // ... other fields from scraper
}

interface ImportOptions {
  filePath: string
  sellerId: string
  sellerName?: string
  sellerRating?: number
  featured?: boolean
  listingType?: 'fixed_price' | 'auction' | 'best_offer'
  priceMarkup?: number // Default 1.15 (15% markup)
  dryRun?: boolean
}

async function importScraperData(options: ImportOptions) {
  const {
    filePath,
    sellerId,
    sellerName = 'WealthFlow AI',
    sellerRating = 4.9,
    featured = false,
    listingType = 'fixed_price',
    priceMarkup = 1.15,
    dryRun = false
  } = options

  console.log('🚀 Starting scraper data import...')
  console.log(`📁 File: ${filePath}`)
  console.log(`👤 Seller ID: ${sellerId}`)
  console.log(`💰 Price markup: ${((priceMarkup - 1) * 100).toFixed(1)}%`)
  console.log(`🏷️  Listing type: ${listingType}`)
  console.log(`⚙️  Dry run: ${dryRun}`)
  console.log('')

  // Read scraper data
  const absolutePath = path.resolve(filePath)
  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ File not found: ${absolutePath}`)
    process.exit(1)
  }

  const fileContent = fs.readFileSync(absolutePath, 'utf-8')
  const liens: ScraperLien[] = JSON.parse(fileContent)

  console.log(`📊 Found ${liens.length} liens in scraper data`)
  console.log('')

  let successCount = 0
  let errorCount = 0
  const errors: string[] = []

  for (let i = 0; i < liens.length; i++) {
    const lien = liens[i]

    try {
      // Calculate purchase date (assume purchased 6 months ago)
      const purchaseDate = new Date()
      purchaseDate.setMonth(purchaseDate.getMonth() - 6)

      // Calculate current value (original lien + 6 months of interest)
      const monthsHeld = 6
      const interestAccrued = lien.lien_amount * (lien.interest_rate / 100) * (monthsHeld / 12)
      const currentValue = lien.lien_amount + interestAccrued

      // Calculate asking price (current value + markup)
      const askingPrice = Math.round(currentValue * priceMarkup * 100) / 100

      // Calculate redemption deadline (assume 2 years from purchase)
      const redemptionDeadline = new Date(purchaseDate)
      redemptionDeadline.setFullYear(redemptionDeadline.getFullYear() + 2)

      // Build listing data
      const listingData = {
        seller_id: sellerId,
        seller_name: sellerName,
        seller_rating: sellerRating,
        county: lien.county,
        state: lien.state,
        property_address: lien.property_address,
        parcel_id: lien.parcel_id,
        property_type: lien.property_type || 'Residential',
        assessed_value: lien.assessed_value,
        original_purchase_price: lien.lien_amount,
        original_purchase_date: purchaseDate.toISOString().split('T')[0],
        current_value: Math.round(currentValue * 100) / 100,
        asking_price: askingPrice,
        interest_rate: lien.interest_rate,
        days_held: monthsHeld * 30, // Approximate
        redemption_deadline: redemptionDeadline.toISOString().split('T')[0],
        status: 'active',
        listing_type: listingType,
        featured: featured && i < 5, // Feature first 5 listings
        description: `Tax lien certificate on ${lien.property_type || 'residential'} property in ${lien.county}, ${lien.state}. Opportunity score: ${lien.opportunity_score || 'N/A'}. Original lien amount: $${lien.lien_amount.toLocaleString()}.`,
      }

      if (!dryRun) {
        const { data, error } = await supabase
          .from('marketplace_listings')
          .insert([listingData])
          .select()
          .single()

        if (error) {
          throw error
        }

        successCount++
        if ((i + 1) % 10 === 0) {
          console.log(`✅ Imported ${i + 1}/${liens.length} liens...`)
        }
      } else {
        successCount++
        if (i < 3) {
          // Show first 3 examples in dry run
          console.log('Example listing data:')
          console.log(JSON.stringify(listingData, null, 2))
          console.log('')
        }
      }
    } catch (error: any) {
      errorCount++
      const errorMsg = `Error importing lien ${lien.parcel_id}: ${error.message}`
      errors.push(errorMsg)
      console.error(`❌ ${errorMsg}`)
    }
  }

  console.log('')
  console.log('═'.repeat(50))
  console.log('📈 Import Summary')
  console.log('═'.repeat(50))
  console.log(`✅ Success: ${successCount}`)
  console.log(`❌ Errors: ${errorCount}`)
  console.log(`📊 Total: ${liens.length}`)
  console.log('')

  if (errors.length > 0 && errors.length <= 10) {
    console.log('Error details:')
    errors.forEach(err => console.log(`  - ${err}`))
  } else if (errors.length > 10) {
    console.log(`${errors.length} errors occurred. First 5:`)
    errors.slice(0, 5).forEach(err => console.log(`  - ${err}`))
  }

  if (dryRun) {
    console.log('')
    console.log('⚠️  DRY RUN COMPLETED - No data was actually imported')
    console.log('Remove --dry-run flag to perform actual import')
  } else {
    console.log('')
    console.log('✨ Import completed successfully!')
  }
}

// Parse command line arguments
const args = process.argv.slice(2)

if (args.length < 2) {
  console.log('Usage: npx ts-node scripts/import-scraper-data.ts <file-path> <seller-id> [options]')
  console.log('')
  console.log('Options:')
  console.log('  --dry-run          Run without actually importing data')
  console.log('  --markup=1.20      Set price markup (default: 1.15 = 15%)')
  console.log('  --featured         Mark listings as featured')
  console.log('  --auction          Create as auction listings')
  console.log('')
  console.log('Example:')
  console.log('  npx ts-node scripts/import-scraper-data.ts scrapers/data/fl/st_johns.json user-123 --dry-run')
  process.exit(1)
}

const filePath = args[0]
const sellerId = args[1]

// Parse optional flags
const dryRun = args.includes('--dry-run')
const featured = args.includes('--featured')
const listingType = args.includes('--auction') ? 'auction' : 'fixed_price'

let priceMarkup = 1.15
const markupArg = args.find(arg => arg.startsWith('--markup='))
if (markupArg) {
  priceMarkup = parseFloat(markupArg.split('=')[1])
}

// Run import
importScraperData({
  filePath,
  sellerId,
  priceMarkup,
  featured,
  listingType,
  dryRun
}).catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})
