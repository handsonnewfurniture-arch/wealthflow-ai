require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

console.log('🔧 Connecting to Supabase...\n');
console.log(`   Project: ${supabaseUrl.split('.')[0].split('//')[1]}\n`);

async function runMigration(filepath, description) {
  console.log(`📄 Running: ${description}`);
  console.log(`   File: ${path.basename(filepath)}`);

  try {
    const sql = fs.readFileSync(filepath, 'utf8');

    // Use psql via command line (more reliable for complex migrations)
    const { execSync } = require('child_process');

    // Save SQL to temp file
    const tempFile = `/tmp/migration-${Date.now()}.sql`;
    fs.writeFileSync(tempFile, sql);

    console.log('   ⏳ Executing SQL...');

    // Build connection string
    // Format: postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
    const projectRef = supabaseUrl.split('.')[0].split('//')[1];

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  MANUAL MIGRATION REQUIRED');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log(`Please run this migration manually in Supabase SQL Editor:\n`);
    console.log(`1. Go to: https://supabase.com/dashboard/project/${projectRef}/sql/new\n`);
    console.log(`2. Copy and paste the contents of:`);
    console.log(`   ${filepath}\n`);
    console.log(`3. Click "Run"\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Cleanup
    fs.unlinkSync(tempFile);

    return true;
  } catch (error) {
    console.error(`\n❌ Migration failed: ${error.message}\n`);
    return false;
  }
}

async function runAllMigrations() {
  console.log('🚀 WealthFlow AI - Database Setup\n');
  console.log('Running all migrations in order...\n');

  const migrations = [
    {
      file: 'supabase/migrations/20260616_fix_auth_integration.sql',
      description: 'Auth Integration (users + subscriptions)'
    },
    {
      file: 'supabase/schema.sql',
      description: 'Core Schema (counties, auctions, opportunities, etc.)'
    },
    {
      file: 'supabase/migrations/20260616_marketplace_v2.sql',
      description: 'Marketplace V2 (listings, bids, purchases)'
    }
  ];

  for (const migration of migrations) {
    const filepath = path.join(process.cwd(), migration.file);

    if (!fs.existsSync(filepath)) {
      console.log(`⚠️  Skipping ${migration.description} - file not found\n`);
      continue;
    }

    await runMigration(filepath, migration.description);
    console.log('');
  }

  console.log('\n✅ Migration instructions printed above');
  console.log('\n📝 After running migrations, you can test with:');
  console.log('   npm run dev');
  console.log('   Open http://localhost:3001/signup\n');
}

runAllMigrations();
