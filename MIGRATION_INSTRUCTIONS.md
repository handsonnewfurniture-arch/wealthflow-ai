# Migration Instructions

## The database tables haven't been created yet. Here's how to fix it:

### Option 1: Run in Supabase Dashboard (Recommended)

1. **Open the SQL Editor:**
   ```
   https://supabase.com/dashboard/project/cljadnzzbhekjfwbzzrz/sql/new
   ```

2. **Copy the migration SQL:**
   ```bash
   cat supabase/migrations/20260616_marketplace_v2.sql | pbcopy
   ```

3. **Paste into SQL Editor and click "Run"**

4. **Once complete, run the import:**
   ```bash
   npm run import:st-johns aff4985f-819a-4a5a-ae0c-9876edc69220
   ```

### Option 2: Use psql (Advanced)

If you have the database password, you can run the migration directly:

```bash
# Get the connection string from Supabase dashboard:
# Settings → Database → Connection string → URI

psql "postgresql://postgres:[PASSWORD]@db.cljadnzzbhekjfwbzzrz.supabase.co:5432/postgres" \
  -f supabase/migrations/20260616_marketplace_v2.sql
```

### What the migration creates:

- ✅ 8 database tables (marketplace_listings, bids, purchases, etc.)
- ✅ RLS policies for security
- ✅ RPC functions for race-safe operations
- ✅ Indexes for performance

### After migration is complete:

The import script will load **1,000 tax lien listings** from St Johns County, FL.

---

**Created test user for marketplace:**
- Email: marketplace-seller@wealthflow.ai
- Password: marketplace123
- ID: aff4985f-819a-4a5a-ae0c-9876edc69220
