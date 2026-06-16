# WealthFlow AI - Marketplace Setup Guide

## Overview

The WealthFlow AI Marketplace allows investors to buy and sell tax lien certificates on a secondary market, providing liquidity and enabling instant portfolio adjustments.

## Database Setup

### 1. Run the Marketplace Schema

Execute the marketplace database schema in your Supabase SQL Editor:

```bash
# Copy the contents of supabase/marketplace_schema.sql
# Paste into Supabase SQL Editor
# Run the script
```

Or using Supabase CLI:

```bash
supabase db push
```

### 2. Verify Tables Created

Check that these tables exist in your Supabase dashboard:
- `marketplace_listings`
- `marketplace_bids`
- `marketplace_purchases`
- `marketplace_transactions`
- `marketplace_saved`

## Importing Scraper Data

### Prerequisites

1. **Supabase Service Role Key**: Required for importing data
   - Get from: Supabase Dashboard → Settings → API → Service Role Key
   - Add to `.env.local`:
     ```
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
     ```

2. **User Account**: You need a seller user ID
   - Create a test user in Supabase Dashboard → Authentication → Users
   - Or use an existing user ID

### Import Real Tax Lien Data

The St Johns County scraper has already collected **1,000 real tax liens**. Import them:

#### Dry Run (Test First)

```bash
npx ts-node scripts/import-scraper-data.ts \
  scrapers/data/fl/st_johns.json \
  <your-seller-user-id> \
  --dry-run
```

This will show you what would be imported without actually writing to the database.

#### Actual Import

```bash
npx ts-node scripts/import-scraper-data.ts \
  scrapers/data/fl/st_johns.json \
  <your-seller-user-id>
```

**Options:**

- `--dry-run` - Preview import without writing to database
- `--featured` - Mark first 5 listings as featured
- `--auction` - Create as auction listings (default: fixed_price)
- `--markup=1.20` - Set price markup to 20% (default: 15%)

**Example with all options:**

```bash
npx ts-node scripts/import-scraper-data.ts \
  scrapers/data/fl/st_johns.json \
  abc123-seller-id \
  --featured \
  --markup=1.12
```

### Import Results

After import, you should see:
- ✅ 1,000 marketplace listings created
- ✅ All from St Johns County, Florida
- ✅ Real addresses, parcel IDs, and financial data
- ✅ Asking prices set at 15% markup over current value
- ✅ First 5 marked as "featured" (if --featured flag used)

## API Routes

All marketplace API routes are available at `/api/marketplace/`:

### Listings

- `GET /api/marketplace/listings` - List all active listings
  - Query params: `state`, `county`, `status`, `listing_type`, `sort`, `search`, `min_price`, `max_price`, `featured`
- `POST /api/marketplace/listings` - Create new listing
- `GET /api/marketplace/listings/[id]` - Get single listing
- `PUT /api/marketplace/listings/[id]` - Update listing
- `DELETE /api/marketplace/listings/[id]` - Delete listing

### Bids

- `GET /api/marketplace/bids` - Get bids (filter by `listing_id` or `bidder_id`)
- `POST /api/marketplace/bids` - Place a bid

### Purchases

- `GET /api/marketplace/purchases` - Get user's purchases (filter by `role`: buyer/seller)
- `POST /api/marketplace/purchases` - Complete a purchase

### Saved Listings

- `GET /api/marketplace/saved` - Get user's saved listings
- `POST /api/marketplace/saved` - Save a listing
- `DELETE /api/marketplace/saved` - Unsave a listing

### Stats

- `GET /api/marketplace/stats` - Get marketplace statistics
  - Returns: active listings count, 30-day volume, average ROI, 24h sales

## Frontend Pages

### Available Pages

1. **`/marketplace`** - Browse and search listings
2. **`/marketplace/[id]`** - Listing details page (TODO)
3. **`/marketplace/saved`** - User's saved listings (TODO)
4. **`/marketplace/purchases`** - User's purchase history (TODO)
5. **`/marketplace/tracker`** - Live auction purchase tracker (TODO)
6. **`/marketplace/sell`** - Create new listing (TODO)

### Using the Marketplace

#### Browse Listings

Navigate to `/marketplace` to see all active listings:
- Search by address or county
- Filter by state
- Sort by price, ROI, expiration date
- View featured listings

#### Save Listings

Click the "Save" button to add to watchlist:
- Get notified on price changes
- Get notified on new bids
- Get notified before expiration

#### Place Bids (Auction Listings)

For auction-style listings:
1. Click "View Details"
2. Enter bid amount (minimum increment: $100)
3. Optional: Enable auto-bidding with max amount
4. Submit bid

#### Purchase (Fixed Price)

For fixed-price listings:
1. Click "Buy Now"
2. Review purchase details
3. Complete payment via Stripe
4. Assignment process begins automatically

## Testing

### Manual Testing Checklist

- [ ] Navigate to `/marketplace`
- [ ] Verify 1,000 St Johns County listings appear
- [ ] Test search functionality
- [ ] Test state/county filters
- [ ] Test sorting (newest, price, ROI, expiring)
- [ ] Click "View Details" on a listing
- [ ] Save a listing to watchlist
- [ ] Unsave a listing
- [ ] Create a new listing (seller flow)
- [ ] Place a bid on auction listing
- [ ] Purchase a fixed-price listing
- [ ] View purchase history
- [ ] Check marketplace stats update

### API Testing

Test API endpoints using curl or Postman:

```bash
# Get all listings
curl http://localhost:3000/api/marketplace/listings

# Search Florida listings under $15,000
curl "http://localhost:3000/api/marketplace/listings?state=FL&max_price=15000"

# Get marketplace stats
curl http://localhost:3000/api/marketplace/stats
```

## Compliance & Legal

### Legal Disclaimers

The marketplace includes the following disclaimers:

1. **Secondary Market Risks**
   - Liens may not redeem
   - Property values can decline
   - Assignment process may fail
   - No guaranteed returns

2. **Platform Role**
   - WealthFlow AI is a marketplace facilitator only
   - Not financial, legal, or investment advice
   - Users must perform their own due diligence
   - Consult licensed professionals

3. **Data Accuracy**
   - Data sourced from county records
   - Updated periodically (not real-time)
   - Users must verify with county
   - No warranty on data accuracy

### Assignment Process

When a purchase completes:

1. **Payment Processed** - Buyer pays via Stripe
2. **Seller Notified** - Seller receives 95% payout (5% platform fee)
3. **Assignment Filed** - Legal assignment paperwork filed with county
4. **County Confirmation** - County confirms transfer
5. **Completion** - Buyer receives assignment documents

Typical timeline: 2-4 weeks

## Troubleshooting

### Import Script Fails

**Error: "File not found"**
- Ensure you're running from project root
- Use relative path: `scrapers/data/fl/st_johns.json`

**Error: "Missing environment variables"**
- Check `.env.local` has `NEXT_PUBLIC_SUPABASE_URL`
- Check `.env.local` has `SUPABASE_SERVICE_ROLE_KEY`
- Restart dev server after adding env vars

**Error: "Failed to create listing"**
- Verify seller user ID exists in `users` table
- Check Supabase RLS policies allow insert
- Review Supabase logs for detailed error

### No Listings Showing on Frontend

1. Check data imported: Supabase Dashboard → Table Editor → marketplace_listings
2. Check API response: `curl http://localhost:3000/api/marketplace/listings`
3. Check browser console for errors
4. Verify `/marketplace` page is using API (not mock data)

### RLS Policy Errors

If you get "permission denied" errors:

1. Verify RLS policies created: `supabase/marketplace_schema.sql`
2. Check user authentication state
3. Use service role key for admin operations
4. Review Supabase logs for policy violations

## Monitoring

### Marketplace Metrics

Track these KPIs:

- **Active Listings**: Total listings available for purchase
- **30-Day Volume**: Dollar amount of completed sales
- **Average ROI**: Average return on marketplace purchases
- **24-Hour Sales**: Number of sales in last 24 hours

Access via API: `GET /api/marketplace/stats`

### Transaction Logs

All marketplace activity is logged to `marketplace_transactions`:
- Listing created/updated/cancelled/sold
- Bid placed/withdrawn/won
- Purchase initiated/completed/cancelled
- Payment received/refunded
- Assignment started/completed

Query logs:
```sql
SELECT * FROM marketplace_transactions
WHERE user_id = 'user-id-here'
ORDER BY created_at DESC
LIMIT 50;
```

## Next Steps

1. ✅ **Import St Johns County data** (1,000 real liens)
2. ⏳ **Import Maricopa County data** (20,000+ liens after $25 purchase)
3. ⏳ **Build listing detail page** (`/marketplace/[id]`)
4. ⏳ **Add Stripe payment integration**
5. ⏳ **Implement realtime bid updates** (Supabase Realtime)
6. ⏳ **Create live auction tracker**
7. ⏳ **Add email notifications** (price changes, outbid alerts)
8. ⏳ **Build seller dashboard**
9. ⏳ **Add assignment workflow tracking**
10. ⏳ **Implement automated tests**

## Support

For issues or questions:
- GitHub Issues: `https://github.com/yourusername/wealthflow-ai/issues`
- Discord: `https://discord.gg/wealthflow`
- Email: `support@wealthflow.ai`

---

**Last Updated**: 2026-06-16
**Version**: 1.0.0
