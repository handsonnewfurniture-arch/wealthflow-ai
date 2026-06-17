# 🗄️ Database Setup Guide

## What's Been Built

✅ **Authentication System**
- Supabase Auth integration
- Login/Signup pages
- Auth context provider
- Protected routes
- User menu in navbar

✅ **Database Schema Ready**
- Users table (linked to Supabase auth.users)
- Subscriptions table
- Counties, auctions, opportunities
- Marketplace v2 (listings, bids, purchases)
- Portfolio tracking
- Lessons & gamification

✅ **Stripe Integration**
- Payment processing
- 3 subscription tiers
- Webhook handling

---

## 📋 Run Database Migrations

You need to run 3 SQL migrations in the Supabase dashboard:

### Step 1: Auth Integration (Required First)

1. **Open Supabase SQL Editor:**
   ```
   https://supabase.com/dashboard/project/cljadnzzbhekjfwbzzrz/sql/new
   ```

2. **Copy the migration file:**
   ```
   supabase/migrations/20260616_fix_auth_integration.sql
   ```

3. **Paste into SQL Editor and click "Run"**

This creates:
- `users` table (linked to auth.users)
- `subscriptions` table
- Auto-profile creation trigger
- Row Level Security policies

---

### Step 2: Core Schema

1. **Open new SQL Editor tab**

2. **Copy the schema file:**
   ```
   supabase/schema.sql
   ```

3. **Remove the users and subscriptions sections** (already created in Step 1)
   - Delete lines 8-46 (users and subscriptions tables)
   - Keep everything from line 47 onwards (counties, auctions, etc.)

4. **Paste edited SQL and click "Run"**

This creates:
- Counties, auctions, opportunities
- Portfolio tracking
- Watchlists
- Lessons, badges, XP system

---

### Step 3: Marketplace V2

1. **Open new SQL Editor tab**

2. **Copy the migration file:**
   ```
   supabase/migrations/20260616_marketplace_v2.sql
   ```

3. **Paste into SQL Editor and click "Run"**

This creates:
- Marketplace listings
- Bidding system
- Purchase tracking
- Transaction logs
- Saved listings

---

## ✅ Verify Migrations

After running all migrations, verify in Supabase:

1. **Go to Table Editor:**
   ```
   https://supabase.com/dashboard/project/cljadnzzbhekjfwbzzrz/editor
   ```

2. **You should see these tables:**
   - `users`
   - `subscriptions`
   - `counties`
   - `auctions`
   - `opportunities`
   - `portfolios`
   - `watchlists`
   - `lessons`
   - `badges`
   - `user_badges`
   - `user_lessons`
   - `xp_events`
   - `marketplace_listings`
   - `marketplace_bids`
   - `marketplace_purchases`
   - `marketplace_transactions`
   - `marketplace_listing_media`
   - `marketplace_listing_documents`
   - `marketplace_saved`

---

## 🧪 Test the Complete Flow

Once migrations are done:

### 1. Start Dev Server
```bash
npm run dev
```

### 2. Test Authentication
1. Go to http://localhost:3001/signup
2. Create account (uses real Supabase Auth)
3. Should redirect to dashboard
4. Check Supabase Auth dashboard to see user

### 3. Test Payments
1. Go to http://localhost:3001/pricing
2. Click "Start Free Trial" on any tier
3. Use test card: `4242 4242 4242 4242`
4. Complete checkout
5. Check Stripe dashboard for subscription

### 4. Verify Database
1. Check Supabase `users` table - your profile should be there
2. Check `subscriptions` table after payment

---

## 🚀 Production Deployment Checklist

Before deploying:

### 1. Environment Variables
Make sure these are set in your hosting platform:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://cljadnzzbhekjfwbzzrz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs (use live price IDs)
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_ELITE=price_...

# App URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 2. Switch to Stripe Live Mode
1. Get live API keys from https://dashboard.stripe.com/apikeys
2. Create live products/prices
3. Update env vars

### 3. Set Up Production Webhook
1. Add webhook endpoint:
   ```
   https://yourdomain.com/api/webhooks/stripe
   ```
2. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
3. Copy signing secret to env vars

### 4. Deploy
```bash
# Vercel
vercel --prod

# Or Netlify
netlify deploy --prod
```

---

## 🎯 What's Working Now

- ✅ User signup/login (Supabase Auth)
- ✅ Auto-profile creation
- ✅ Protected routes
- ✅ Stripe payments (test mode)
- ✅ Subscription tracking
- ✅ User menu/logout
- ✅ Database ready for all features

---

## 🔜 Next Steps (Optional)

1. **Add more protected routes** - Wrap dashboard/marketplace pages with auth checks
2. **Add subscription gates** - Check user tier before showing premium features
3. **Seed data** - Add counties and opportunities to test marketplace
4. **Build marketplace UI** - Connect frontend to marketplace tables
5. **Deploy to production** - Use Vercel/Netlify

---

**Need help?** Check the migration files in `supabase/migrations/` for details on what each creates.
