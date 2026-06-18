/**
 * Verify St Johns County import
 */

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://cljadnzzbhekjfwbzzrz.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsamFkbnp6Ymhla2pmd2J6enJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTY0MjMxNCwiZXhwIjoyMDk3MjE4MzE0fQ.lzkjK9aSdrMQ1GbCNmr8ntELU_YuDNUOAOHlFJH7Htk'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function main() {
  console.log('📊 Verifying St Johns County Import\n')
  console.log('='.repeat(60))

  // Get total count
  const { count, error: countError } = await supabase
    .from('marketplace_listings')
    .select('*', { count: 'exact', head: true })
    .eq('county', 'St Johns')
    .eq('state', 'Florida')

  if (countError) {
    console.error('Error:', countError)
    return
  }

  console.log(`\n✅ Total St Johns County Listings: ${count}`)

  // Get stats
  const { data: listings, error } = await supabase
    .from('marketplace_listings')
    .select('id, property_address, buy_now_price, estimated_value, source_metadata')
    .eq('county', 'St Johns')
    .eq('state', 'Florida')
    .order('buy_now_price', { ascending: false })
    .limit(1000)

  if (error) {
    console.error('Error fetching listings:', error)
    return
  }

  // Calculate stats
  const totalValue = listings.reduce((sum, l) => sum + (parseFloat(l.buy_now_price) || 0), 0)
  const totalEstimated = listings.reduce((sum, l) => sum + (parseFloat(l.estimated_value) || 0), 0)
  const avgPrice = totalValue / listings.length
  const avgEstimated = totalEstimated / listings.length

  console.log(`\n💰 Financial Overview:`)
  console.log(`   Total Lien Value: $${totalValue.toLocaleString()}`)
  console.log(`   Total Estimated Property Value: $${totalEstimated.toLocaleString()}`)
  console.log(`   Average Lien: $${avgPrice.toLocaleString()}`)
  console.log(`   Average Property Value: $${avgEstimated.toLocaleString()}`)

  // Top 10 opportunities
  console.log(`\n🏆 Top 10 Highest Value Properties:`)
  listings.slice(0, 10).forEach((listing, idx) => {
    const score = listing.source_metadata?.opportunity_score || 'N/A'
    console.log(`   ${idx + 1}. ${listing.property_address}`)
    console.log(`      Lien: $${parseFloat(listing.buy_now_price).toLocaleString()} | Est. Value: $${parseFloat(listing.estimated_value).toLocaleString()} | Score: ${score}/100`)
  })

  console.log(`\n✅ Import verification complete!`)
  console.log(`📍 View marketplace: http://localhost:3000/marketplace`)
}

main().catch(console.error)
