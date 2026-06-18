/**
 * Import St Johns County tax lien data into marketplace
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Supabase credentials
const supabaseUrl = 'https://cljadnzzbhekjfwbzzrz.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsamFkbnp6Ymhla2pmd2J6enJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTY0MjMxNCwiZXhwIjoyMDk3MjE4MzE0fQ.lzkjK9aSdrMQ1GbCNmr8ntELU_YuDNUOAOHlFJH7Htk'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function main() {
  console.log('🚀 Starting St Johns County data import...\n')

  // Step 1: Check for existing auth users
  console.log('📋 Step 1: Checking for existing auth users...')
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers()

  let sellerId

  if (authError) {
    console.error('Error checking auth users:', authError)
    console.log('⚠️  Will use system placeholder UUID')
    sellerId = '00000000-0000-0000-0000-000000000001'
  } else if (authData && authData.users && authData.users.length > 0) {
    sellerId = authData.users[0].id
    console.log(`✅ Found existing auth user: ${authData.users[0].email || 'No email'} (${sellerId})`)
  } else {
    console.log('⚠️  No auth users found.')
    console.log('Creating system user via auth API...')

    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: 'system@wealthflow.ai',
      email_confirm: true,
      user_metadata: {
        full_name: 'WealthFlow AI System'
      }
    })

    if (createError) {
      console.error('Error creating auth user:', createError)
      console.log('\n⚠️  Using placeholder UUID for seller_id')
      sellerId = '00000000-0000-0000-0000-000000000001'
    } else {
      sellerId = newUser.user.id
      console.log(`✅ Created system user: ${sellerId}`)
    }
  }

  // Step 2: Load St Johns data
  console.log('\n📥 Step 2: Loading St Johns County data...')
  const dataPath = path.join(__dirname, '../scrapers/data/fl/st_johns.json')

  if (!fs.existsSync(dataPath)) {
    console.error(`❌ Data file not found: ${dataPath}`)
    console.log('Please run the scraper first: cd scrapers && python3 -m florida.st_johns')
    process.exit(1)
  }

  const rawData = fs.readFileSync(dataPath, 'utf-8')
  const liens = JSON.parse(rawData)

  console.log(`✅ Loaded ${liens.length} tax liens from file`)

  // Step 3: Transform to marketplace listings
  console.log('\n🔄 Step 3: Transforming data to marketplace format...')

  const listings = liens.map((lien, idx) => {
    // Calculate redemption deadline (2 years from auction date)
    const auctionDate = new Date(lien.auction_date)
    const redemptionDeadline = new Date(auctionDate)
    redemptionDeadline.setMonth(redemptionDeadline.getMonth() + (lien.redemption_period_months || 24))

    return {
      seller_id: sellerId,
      title: `${lien.property_address} - Tax Lien Certificate`,
      listing_type: 'tax_lien',

      property_address: lien.property_address,
      parcel_apn: lien.parcel_id,
      county: lien.county,
      state: lien.state,

      auction_name: null,
      auction_date_time: lien.auction_date,
      redemption_period: `${lien.redemption_period_months || 24} months`,

      buy_now_price: Math.round(lien.lien_amount * 1.15 * 100) / 100, // 15% markup
      starting_bid: null,
      current_bid: null,

      estimated_value: lien.assessed_value,

      notes: lien.notes || `Certificate from St Johns County. Interest rate: ${lien.interest_rate}%. Redemption period: ${lien.redemption_period_months || 24} months.`,

      legal_disclaimer: 'This listing is for informational and investment purposes only. Tax lien certificates are sold "as-is" without warranties. Buyer is responsible for all due diligence, title research, and property inspection. Redemption periods vary by state. Properties may be subject to other liens, environmental issues, or title defects. Past performance does not guarantee future results. Consult with legal and tax professionals before investing.',

      source: 'st_johns_scraper',
      source_metadata: {
        parcel_id: lien.parcel_id,
        original_lien_amount: lien.lien_amount,
        prior_year_taxes: lien.prior_year_taxes,
        opportunity_score: lien.opportunity_score,
        redemption_deadline: redemptionDeadline.toISOString(),
        data_source: lien.data_source,
        last_updated: lien.last_updated,
        latitude: lien.latitude,
        longitude: lien.longitude,
        flood_zone: lien.flood_zone,
        school_district: lien.school_district,
        interest_rate: lien.interest_rate
      },

      status: 'active',
      published_at: new Date().toISOString()
    }
  })

  console.log(`✅ Transformed ${listings.length} listings`)

  // Step 4: Clear existing St Johns listings and import fresh
  console.log('\n💾 Step 4: Clearing existing St Johns listings...')

  const { error: deleteError } = await supabase
    .from('marketplace_listings')
    .delete()
    .eq('county', 'St Johns')
    .eq('state', 'Florida')

  if (deleteError) {
    console.log(`⚠️  Could not clear existing listings: ${deleteError.message}`)
  } else {
    console.log('✅ Cleared existing St Johns listings')
  }

  console.log('\n💾 Step 5: Importing into database...')

  const batchSize = 100
  let imported = 0
  let errors = 0

  for (let i = 0; i < listings.length; i += batchSize) {
    const batch = listings.slice(i, i + batchSize)

    const { data, error } = await supabase
      .from('marketplace_listings')
      .insert(batch)
      .select('id')

    if (error) {
      console.error(`❌ Error importing batch ${i / batchSize + 1}:`, error.message)
      errors += batch.length
    } else {
      imported += (data?.length || 0)
      process.stdout.write(`\r   Imported: ${imported}/${listings.length} listings`)
    }
  }

  console.log(`\n\n✅ Import complete!`)
  console.log(`   Successfully imported: ${imported}`)
  console.log(`   Errors: ${errors}`)

  // Step 6: Verify import
  console.log('\n🔍 Step 6: Verifying import...')

  const { data: verifyListings, error: verifyError } = await supabase
    .from('marketplace_listings')
    .select('id, title, property_address, buy_now_price, status')
    .eq('county', 'St Johns')
    .eq('state', 'Florida')
    .limit(5)

  if (verifyError) {
    console.error('Error verifying:', verifyError)
  } else {
    console.log(`✅ Found ${verifyListings.length} St Johns listings in database\n`)
    console.log('Sample listings:')
    verifyListings.forEach((listing, idx) => {
      console.log(`   ${idx + 1}. ${listing.property_address}`)
      console.log(`      Price: $${listing.buy_now_price.toLocaleString()} | Status: ${listing.status}`)
    })
  }

  console.log('\n🎉 St Johns County data successfully imported!')
  console.log(`   View marketplace: http://localhost:3000/marketplace`)
}

main().catch(console.error)
