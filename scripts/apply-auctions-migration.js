/**
 * Apply county_auctions table migration
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = 'https://cljadnzzbhekjfwbzzrz.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsamFkbnp6Ymhla2pmd2J6enJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTY0MjMxNCwiZXhwIjoyMDk3MjE4MzE0fQ.lzkjK9aSdrMQ1GbCNmr8ntELU_YuDNUOAOHlFJH7Htk'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function main() {
  console.log('🚀 Applying county_auctions migration...\n')

  // Read migration file
  const migrationPath = path.join(__dirname, '../supabase/migrations/20260618_county_auctions.sql')
  const sql = fs.readFileSync(migrationPath, 'utf-8')

  console.log('📄 Migration file loaded')
  console.log('📊 Creating county_auctions table for primary market data...\n')

  // Execute migration
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql }).catch(async (err) => {
    // If rpc doesn't exist, try direct query
    console.log('⚠️  RPC not available, using direct query method...')
    return await supabase.from('_migrations').insert({ sql })
  })

  // Since RPC might not be available, let's use a different approach
  // We'll create the table using the REST API
  console.log('Creating table via direct SQL execution...')

  try {
    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`Found ${statements.length} SQL statements to execute\n`)

    // Note: Supabase JS client doesn't support arbitrary SQL execution
    // This needs to be run via Supabase dashboard or CLI
    console.log('⚠️  This migration needs to be run via Supabase Dashboard or CLI')
    console.log('')
    console.log('To apply this migration:')
    console.log('1. Go to: https://supabase.com/dashboard/project/cljadnzzbhekjfwbzzrz/sql/new')
    console.log('2. Copy the SQL from: supabase/migrations/20260618_county_auctions.sql')
    console.log('3. Paste and run it')
    console.log('')
    console.log('OR use Supabase CLI:')
    console.log('  supabase db push')
    console.log('')

  } catch (err) {
    console.error('Error:', err.message)
  }
}

main()
