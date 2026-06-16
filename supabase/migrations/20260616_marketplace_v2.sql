-- =====================================================
-- WEALTHFLOW AI - TAX LIEN/DEED MARKETPLACE V2
-- Migration: 20260616_marketplace_v2
-- =====================================================
-- Complete marketplace for tax liens and tax deeds with:
-- - Listings, bids, purchases, transactions, audit logs
-- - Media and document support
-- - Saved listings
-- - Live purchase tracking
-- - Race-safe RPC functions
-- =====================================================

-- Drop old tables if they exist (from previous implementation)
DROP TABLE IF EXISTS marketplace_saved CASCADE;
DROP TABLE IF EXISTS marketplace_transactions CASCADE;
DROP TABLE IF EXISTS marketplace_purchases CASCADE;
DROP TABLE IF EXISTS marketplace_bids CASCADE;
DROP TABLE IF EXISTS marketplace_listings CASCADE;

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE marketplace_listing_type AS ENUM ('tax_lien', 'tax_deed');
CREATE TYPE marketplace_listing_status AS ENUM ('draft', 'active', 'pending', 'sold', 'expired', 'cancelled');
CREATE TYPE marketplace_payment_status AS ENUM ('pending', 'processing', 'paid', 'failed', 'refunded', 'cancelled');

-- =====================================================
-- 1. MARKETPLACE_LISTINGS
-- =====================================================

CREATE TABLE marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Core listing info
  title TEXT NOT NULL,
  listing_type marketplace_listing_type NOT NULL,

  -- Property details
  property_address TEXT NOT NULL,
  parcel_apn TEXT NOT NULL,
  county TEXT NOT NULL,
  state TEXT NOT NULL,

  -- Auction details
  auction_name TEXT,
  auction_date_time TIMESTAMPTZ,
  redemption_period TEXT,

  -- Pricing
  starting_bid NUMERIC(12,2),
  current_bid NUMERIC(12,2),
  buy_now_price NUMERIC(12,2),
  estimated_value NUMERIC(12,2),

  -- Status and lifecycle
  status marketplace_listing_status NOT NULL DEFAULT 'draft',

  -- Content
  notes TEXT,
  legal_disclaimer TEXT NOT NULL DEFAULT 'Tax liens and tax deeds involve substantial risk. Information is provided for research and marketplace facilitation only and is not financial, legal, tax, or investment advice. Returns are not guaranteed. Buyers must perform independent due diligence, verify all property and auction information with official county sources, and consult qualified professionals before bidding or purchasing.',

  -- Source tracking
  source TEXT,
  source_metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  sold_at TIMESTAMPTZ,

  -- Constraints
  CONSTRAINT require_price CHECK (starting_bid IS NOT NULL OR buy_now_price IS NOT NULL)
);

-- =====================================================
-- 2. MARKETPLACE_LISTING_MEDIA
-- =====================================================

CREATE TABLE marketplace_listing_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES marketplace_listings(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  media_type TEXT DEFAULT 'photo',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. MARKETPLACE_LISTING_DOCUMENTS
-- =====================================================

CREATE TABLE marketplace_listing_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES marketplace_listings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  document_type TEXT,
  file_size_bytes BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. SAVED_LISTINGS
-- =====================================================

CREATE TABLE saved_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES marketplace_listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- =====================================================
-- 5. MARKETPLACE_BIDS
-- =====================================================

CREATE TABLE marketplace_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES marketplace_listings(id) ON DELETE CASCADE,
  bidder_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bid_amount NUMERIC(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT positive_bid CHECK (bid_amount > 0)
);

-- =====================================================
-- 6. MARKETPLACE_PURCHASES
-- =====================================================

CREATE TABLE marketplace_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES marketplace_listings(id) ON DELETE RESTRICT,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  purchase_price NUMERIC(12,2) NOT NULL,
  payment_status marketplace_payment_status NOT NULL DEFAULT 'pending',
  transaction_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT positive_price CHECK (purchase_price > 0)
);

-- =====================================================
-- 7. MARKETPLACE_TRANSACTIONS
-- =====================================================

CREATE TABLE marketplace_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES marketplace_listings(id) ON DELETE SET NULL,
  purchase_id UUID REFERENCES marketplace_purchases(id) ON DELETE SET NULL,
  bid_id UUID REFERENCES marketplace_bids(id) ON DELETE SET NULL,
  transaction_type TEXT NOT NULL,
  amount NUMERIC(12,2),
  status TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 8. MARKETPLACE_AUDIT_LOGS
-- =====================================================

CREATE TABLE marketplace_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES marketplace_listings(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  before_data JSONB,
  after_data JSONB,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

-- marketplace_listings indexes
CREATE INDEX idx_ml_status ON marketplace_listings(status);
CREATE INDEX idx_ml_state ON marketplace_listings(state);
CREATE INDEX idx_ml_county ON marketplace_listings(county);
CREATE INDEX idx_ml_listing_type ON marketplace_listings(listing_type);
CREATE INDEX idx_ml_auction_date ON marketplace_listings(auction_date_time);
CREATE INDEX idx_ml_parcel_apn ON marketplace_listings(parcel_apn);
CREATE INDEX idx_ml_seller_id ON marketplace_listings(seller_id);
CREATE INDEX idx_ml_created_at ON marketplace_listings(created_at DESC);
CREATE INDEX idx_ml_published_at ON marketplace_listings(published_at DESC) WHERE published_at IS NOT NULL;

-- Full-text search
CREATE INDEX idx_ml_search ON marketplace_listings
  USING GIN (to_tsvector('english', title || ' ' || property_address || ' ' || parcel_apn || ' ' || county));

-- marketplace_bids indexes
CREATE INDEX idx_mb_listing_bid ON marketplace_bids(listing_id, bid_amount DESC);
CREATE INDEX idx_mb_bidder ON marketplace_bids(bidder_id, created_at DESC);

-- marketplace_purchases indexes
CREATE INDEX idx_mp_buyer ON marketplace_purchases(buyer_id, created_at DESC);
CREATE INDEX idx_mp_listing ON marketplace_purchases(listing_id);
CREATE INDEX idx_mp_transaction_id ON marketplace_purchases(transaction_id);
CREATE INDEX idx_mp_created_at ON marketplace_purchases(created_at DESC);

-- saved_listings indexes
CREATE INDEX idx_sl_user ON saved_listings(user_id);
CREATE INDEX idx_sl_listing ON saved_listings(listing_id);

-- marketplace_transactions indexes
CREATE INDEX idx_mt_user ON marketplace_transactions(user_id, created_at DESC);
CREATE INDEX idx_mt_listing ON marketplace_transactions(listing_id);

-- marketplace_audit_logs indexes
CREATE INDEX idx_mal_listing ON marketplace_audit_logs(listing_id, created_at DESC);
CREATE INDEX idx_mal_actor ON marketplace_audit_logs(actor_id);

-- =====================================================
-- UPDATED_AT TRIGGER
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_marketplace_listings_updated_at
  BEFORE UPDATE ON marketplace_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_listing_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_listing_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_audit_logs ENABLE ROW LEVEL SECURITY;

-- marketplace_listings policies
CREATE POLICY "Active listings are viewable by everyone"
  ON marketplace_listings FOR SELECT
  USING (status = 'active' OR (auth.uid() = seller_id));

CREATE POLICY "Sellers can view their own listings"
  ON marketplace_listings FOR SELECT
  USING (auth.uid() = seller_id);

CREATE POLICY "Authenticated users can create listings"
  ON marketplace_listings FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their own listings"
  ON marketplace_listings FOR UPDATE
  USING (auth.uid() = seller_id)
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete their own listings"
  ON marketplace_listings FOR DELETE
  USING (auth.uid() = seller_id AND status != 'sold');

-- marketplace_listing_media policies
CREATE POLICY "Media viewable with listing"
  ON marketplace_listing_media FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM marketplace_listings
      WHERE id = listing_id
      AND (status = 'active' OR seller_id = auth.uid())
    )
  );

CREATE POLICY "Sellers can manage their listing media"
  ON marketplace_listing_media FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM marketplace_listings
      WHERE id = listing_id AND seller_id = auth.uid()
    )
  );

-- marketplace_listing_documents policies (same as media)
CREATE POLICY "Documents viewable with listing"
  ON marketplace_listing_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM marketplace_listings
      WHERE id = listing_id
      AND (status = 'active' OR seller_id = auth.uid())
    )
  );

CREATE POLICY "Sellers can manage their listing documents"
  ON marketplace_listing_documents FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM marketplace_listings
      WHERE id = listing_id AND seller_id = auth.uid()
    )
  );

-- saved_listings policies
CREATE POLICY "Users can view their own saved listings"
  ON saved_listings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save listings"
  ON saved_listings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave their listings"
  ON saved_listings FOR DELETE
  USING (auth.uid() = user_id);

-- marketplace_bids policies
CREATE POLICY "Users can view bids on listings they're involved with"
  ON marketplace_bids FOR SELECT
  USING (
    auth.uid() = bidder_id OR
    EXISTS (
      SELECT 1 FROM marketplace_listings
      WHERE id = listing_id AND seller_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can place bids"
  ON marketplace_bids FOR INSERT
  WITH CHECK (auth.uid() = bidder_id);

-- marketplace_purchases policies
CREATE POLICY "Users can view their own purchases"
  ON marketplace_purchases FOR SELECT
  USING (
    auth.uid() = buyer_id OR
    EXISTS (
      SELECT 1 FROM marketplace_listings
      WHERE id = listing_id AND seller_id = auth.uid()
    )
  );

-- marketplace_transactions policies
CREATE POLICY "Users can view their own transactions"
  ON marketplace_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- marketplace_audit_logs policies
CREATE POLICY "Sellers can view audit logs for their listings"
  ON marketplace_audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM marketplace_listings
      WHERE id = listing_id AND seller_id = auth.uid()
    )
  );

-- =====================================================
-- RPC FUNCTIONS
-- =====================================================

-- Function: place_marketplace_bid
-- Race-safe bid placement with validation
CREATE OR REPLACE FUNCTION place_marketplace_bid(
  p_listing_id UUID,
  p_bid_amount NUMERIC
)
RETURNS marketplace_bids AS $$
DECLARE
  v_listing marketplace_listings;
  v_bid marketplace_bids;
  v_user_id UUID;
BEGIN
  -- Get current user
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Lock and fetch listing
  SELECT * INTO v_listing
  FROM marketplace_listings
  WHERE id = p_listing_id
  FOR UPDATE;

  -- Validation
  IF v_listing IS NULL THEN
    RAISE EXCEPTION 'Listing not found';
  END IF;

  IF v_listing.status != 'active' THEN
    RAISE EXCEPTION 'Listing is not active';
  END IF;

  IF v_listing.listing_type != 'tax_lien' THEN
    RAISE EXCEPTION 'Bidding only allowed on tax lien auctions';
  END IF;

  IF v_listing.starting_bid IS NULL THEN
    RAISE EXCEPTION 'Listing does not accept bids';
  END IF;

  IF p_bid_amount <= COALESCE(v_listing.current_bid, v_listing.starting_bid) THEN
    RAISE EXCEPTION 'Bid must be higher than current bid';
  END IF;

  -- Create bid
  INSERT INTO marketplace_bids (listing_id, bidder_id, bid_amount, status)
  VALUES (p_listing_id, v_user_id, p_bid_amount, 'active')
  RETURNING * INTO v_bid;

  -- Update listing current_bid
  UPDATE marketplace_listings
  SET current_bid = p_bid_amount
  WHERE id = p_listing_id;

  -- Create transaction record
  INSERT INTO marketplace_transactions (
    user_id, listing_id, bid_id, transaction_type, amount, status
  ) VALUES (
    v_user_id, p_listing_id, v_bid.id, 'bid_placed', p_bid_amount, 'completed'
  );

  -- Create audit log
  INSERT INTO marketplace_audit_logs (
    listing_id, actor_id, action, after_data
  ) VALUES (
    p_listing_id, v_user_id, 'bid_placed',
    jsonb_build_object('bid_id', v_bid.id, 'bid_amount', p_bid_amount)
  );

  RETURN v_bid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: purchase_marketplace_listing
-- Race-safe purchase with validation
CREATE OR REPLACE FUNCTION purchase_marketplace_listing(
  p_listing_id UUID
)
RETURNS marketplace_purchases AS $$
DECLARE
  v_listing marketplace_listings;
  v_purchase marketplace_purchases;
  v_user_id UUID;
  v_transaction_id TEXT;
BEGIN
  -- Get current user
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Lock and fetch listing
  SELECT * INTO v_listing
  FROM marketplace_listings
  WHERE id = p_listing_id
  FOR UPDATE;

  -- Validation
  IF v_listing IS NULL THEN
    RAISE EXCEPTION 'Listing not found';
  END IF;

  IF v_listing.status != 'active' THEN
    RAISE EXCEPTION 'Listing is not available for purchase';
  END IF;

  IF v_listing.buy_now_price IS NULL THEN
    RAISE EXCEPTION 'Listing does not have a buy now price';
  END IF;

  -- Check for existing purchase
  IF EXISTS (
    SELECT 1 FROM marketplace_purchases
    WHERE listing_id = p_listing_id
    AND payment_status IN ('paid', 'processing')
  ) THEN
    RAISE EXCEPTION 'Listing already purchased';
  END IF;

  -- Generate transaction ID
  v_transaction_id := 'WFA-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || SUBSTRING(gen_random_uuid()::text, 1, 8);

  -- Create purchase
  INSERT INTO marketplace_purchases (
    listing_id, buyer_id, purchase_price, payment_status, transaction_id
  ) VALUES (
    p_listing_id, v_user_id, v_listing.buy_now_price, 'pending', v_transaction_id
  )
  RETURNING * INTO v_purchase;

  -- Mark listing as sold
  UPDATE marketplace_listings
  SET status = 'sold', sold_at = NOW()
  WHERE id = p_listing_id;

  -- Create transaction record
  INSERT INTO marketplace_transactions (
    user_id, listing_id, purchase_id, transaction_type, amount, status
  ) VALUES (
    v_user_id, p_listing_id, v_purchase.id, 'purchase_initiated',
    v_listing.buy_now_price, 'pending'
  );

  -- Create audit log
  INSERT INTO marketplace_audit_logs (
    listing_id, actor_id, action, after_data
  ) VALUES (
    p_listing_id, v_user_id, 'listing_purchased',
    jsonb_build_object(
      'purchase_id', v_purchase.id,
      'transaction_id', v_transaction_id,
      'purchase_price', v_listing.buy_now_price
    )
  );

  RETURN v_purchase;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- REALTIME PUBLICATION
-- =====================================================

-- Enable realtime for purchase tracker
ALTER PUBLICATION supabase_realtime ADD TABLE marketplace_purchases;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE marketplace_listings IS 'Tax lien and tax deed listings for marketplace';
COMMENT ON TABLE marketplace_bids IS 'Bids placed on marketplace listings';
COMMENT ON TABLE marketplace_purchases IS 'Purchase records for marketplace transactions';
COMMENT ON TABLE saved_listings IS 'User-saved listings for later viewing';
COMMENT ON TABLE marketplace_transactions IS 'Transaction history for marketplace activity';
COMMENT ON TABLE marketplace_audit_logs IS 'Audit trail for all marketplace actions';
