-- =====================================================
-- WEALTHFLOW AI - MARKETPLACE DATABASE SCHEMA
-- =====================================================
-- This schema extends the existing database with marketplace functionality
-- for buying/selling tax liens between investors.
--
-- Tables:
-- 1. marketplace_listings - Tax liens listed for sale
-- 2. marketplace_bids - Bids placed on listings
-- 3. marketplace_purchases - Completed purchases
-- 4. marketplace_transactions - Transaction history/audit log
-- 5. marketplace_saved - User saved/watched listings
-- =====================================================

-- =====================================================
-- 1. MARKETPLACE LISTINGS
-- =====================================================

CREATE TABLE IF NOT EXISTS marketplace_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Seller Info
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_name TEXT, -- Cached for performance
  seller_rating DECIMAL(3,2), -- 0.00 to 5.00

  -- Property/Lien Info (from opportunities table or scraper data)
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL, -- Link to original opportunity if exists
  county TEXT NOT NULL,
  state TEXT NOT NULL,
  property_address TEXT NOT NULL,
  parcel_id TEXT NOT NULL,
  property_type TEXT, -- Residential, Commercial, Land, etc.
  assessed_value DECIMAL(12,2) NOT NULL,

  -- Lien Financial Details
  original_purchase_price DECIMAL(12,2) NOT NULL, -- What seller originally paid
  original_purchase_date DATE NOT NULL,
  current_value DECIMAL(12,2) NOT NULL, -- Principal + accrued interest
  asking_price DECIMAL(12,2) NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL, -- 18.00 = 18%
  days_held INTEGER NOT NULL, -- Days since purchase
  redemption_deadline DATE NOT NULL, -- When lien expires

  -- Listing Details
  status TEXT NOT NULL DEFAULT 'active', -- active, pending, sold, cancelled, expired
  listing_type TEXT NOT NULL DEFAULT 'fixed_price', -- fixed_price, auction, best_offer
  featured BOOLEAN DEFAULT FALSE,
  description TEXT,

  -- Auction-specific (if listing_type = 'auction')
  auction_start_date TIMESTAMP WITH TIME ZONE,
  auction_end_date TIMESTAMP WITH TIME ZONE,
  starting_bid DECIMAL(12,2),
  reserve_price DECIMAL(12,2), -- Minimum acceptable price
  current_bid DECIMAL(12,2),
  bid_count INTEGER DEFAULT 0,

  -- Metadata
  views_count INTEGER DEFAULT 0,
  saves_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sold_at TIMESTAMP WITH TIME ZONE,

  CONSTRAINT valid_listing_status CHECK (status IN ('active', 'pending', 'sold', 'cancelled', 'expired')),
  CONSTRAINT valid_listing_type CHECK (listing_type IN ('fixed_price', 'auction', 'best_offer')),
  CONSTRAINT positive_prices CHECK (
    asking_price > 0 AND
    original_purchase_price > 0 AND
    current_value > 0
  ),
  CONSTRAINT valid_interest_rate CHECK (interest_rate >= 0 AND interest_rate <= 50),
  CONSTRAINT future_redemption CHECK (redemption_deadline > original_purchase_date)
);

-- Indexes for performance
CREATE INDEX idx_listings_seller ON marketplace_listings(seller_id);
CREATE INDEX idx_listings_status ON marketplace_listings(status);
CREATE INDEX idx_listings_state ON marketplace_listings(state);
CREATE INDEX idx_listings_county ON marketplace_listings(county, state);
CREATE INDEX idx_listings_created ON marketplace_listings(created_at DESC);
CREATE INDEX idx_listings_featured ON marketplace_listings(featured) WHERE featured = TRUE;
CREATE INDEX idx_listings_auction_end ON marketplace_listings(auction_end_date)
  WHERE listing_type = 'auction' AND status = 'active';

-- Full-text search index
CREATE INDEX idx_listings_search ON marketplace_listings
  USING GIN (to_tsvector('english', property_address || ' ' || county || ' ' || parcel_id));

-- =====================================================
-- 2. MARKETPLACE BIDS
-- =====================================================

CREATE TABLE IF NOT EXISTS marketplace_bids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- References
  listing_id UUID NOT NULL REFERENCES marketplace_listings(id) ON DELETE CASCADE,
  bidder_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Bid Details
  bid_amount DECIMAL(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- active, outbid, won, cancelled
  auto_bid_enabled BOOLEAN DEFAULT FALSE,
  max_auto_bid DECIMAL(12,2), -- Maximum amount for auto-bidding

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT positive_bid CHECK (bid_amount > 0),
  CONSTRAINT valid_bid_status CHECK (status IN ('active', 'outbid', 'won', 'cancelled')),
  CONSTRAINT valid_auto_bid CHECK (
    (auto_bid_enabled = FALSE) OR
    (auto_bid_enabled = TRUE AND max_auto_bid >= bid_amount)
  )
);

-- Indexes
CREATE INDEX idx_bids_listing ON marketplace_bids(listing_id, created_at DESC);
CREATE INDEX idx_bids_bidder ON marketplace_bids(bidder_id, created_at DESC);
CREATE INDEX idx_bids_status ON marketplace_bids(status);

-- Prevent duplicate active bids from same user on same listing
CREATE UNIQUE INDEX idx_unique_active_bid ON marketplace_bids(listing_id, bidder_id)
  WHERE status = 'active';

-- =====================================================
-- 3. MARKETPLACE PURCHASES
-- =====================================================

CREATE TABLE IF NOT EXISTS marketplace_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- References
  listing_id UUID NOT NULL REFERENCES marketplace_listings(id) ON DELETE RESTRICT,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  winning_bid_id UUID REFERENCES marketplace_bids(id) ON DELETE SET NULL, -- If purchased via auction

  -- Purchase Details
  purchase_price DECIMAL(12,2) NOT NULL,
  marketplace_fee DECIMAL(12,2) NOT NULL, -- Platform fee (5%)
  seller_payout DECIMAL(12,2) NOT NULL, -- purchase_price - marketplace_fee

  -- Payment Status
  payment_status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, paid, failed, refunded
  payment_intent_id TEXT, -- Stripe payment intent ID

  -- Assignment Status (legal transfer of lien)
  assignment_status TEXT NOT NULL DEFAULT 'pending', -- pending, in_progress, completed, failed
  assignment_filed_date DATE,
  assignment_completed_date DATE,
  county_confirmation_number TEXT,

  -- Documents
  assignment_document_url TEXT,
  purchase_receipt_url TEXT,

  -- Metadata
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,

  CONSTRAINT positive_purchase_price CHECK (purchase_price > 0),
  CONSTRAINT valid_payment_status CHECK (payment_status IN ('pending', 'processing', 'paid', 'failed', 'refunded')),
  CONSTRAINT valid_assignment_status CHECK (assignment_status IN ('pending', 'in_progress', 'completed', 'failed')),
  CONSTRAINT valid_fee_calculation CHECK (seller_payout = purchase_price - marketplace_fee)
);

-- Indexes
CREATE INDEX idx_purchases_buyer ON marketplace_purchases(buyer_id, purchased_at DESC);
CREATE INDEX idx_purchases_seller ON marketplace_purchases(seller_id, purchased_at DESC);
CREATE INDEX idx_purchases_listing ON marketplace_purchases(listing_id);
CREATE INDEX idx_purchases_payment_status ON marketplace_purchases(payment_status);
CREATE INDEX idx_purchases_assignment_status ON marketplace_purchases(assignment_status);

-- =====================================================
-- 4. MARKETPLACE TRANSACTIONS (Audit Log)
-- =====================================================

CREATE TABLE IF NOT EXISTS marketplace_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- References (nullable to support various transaction types)
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  listing_id UUID REFERENCES marketplace_listings(id) ON DELETE SET NULL,
  bid_id UUID REFERENCES marketplace_bids(id) ON DELETE SET NULL,
  purchase_id UUID REFERENCES marketplace_purchases(id) ON DELETE SET NULL,

  -- Transaction Details
  transaction_type TEXT NOT NULL, -- listing_created, listing_updated, bid_placed, bid_withdrawn, purchase_completed, etc.
  description TEXT NOT NULL,
  amount DECIMAL(12,2), -- If financial transaction

  -- Metadata
  metadata JSONB, -- Additional transaction-specific data
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_transaction_type CHECK (transaction_type IN (
    'listing_created', 'listing_updated', 'listing_cancelled', 'listing_expired', 'listing_sold',
    'bid_placed', 'bid_updated', 'bid_withdrawn', 'bid_won',
    'purchase_initiated', 'purchase_completed', 'purchase_cancelled',
    'payment_received', 'payment_refunded',
    'assignment_started', 'assignment_completed'
  ))
);

-- Indexes
CREATE INDEX idx_transactions_user ON marketplace_transactions(user_id, created_at DESC);
CREATE INDEX idx_transactions_listing ON marketplace_transactions(listing_id, created_at DESC);
CREATE INDEX idx_transactions_type ON marketplace_transactions(transaction_type, created_at DESC);
CREATE INDEX idx_transactions_created ON marketplace_transactions(created_at DESC);

-- =====================================================
-- 5. MARKETPLACE SAVED (Watchlist)
-- =====================================================

CREATE TABLE IF NOT EXISTS marketplace_saved (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- References
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES marketplace_listings(id) ON DELETE CASCADE,

  -- Notification Preferences
  notify_on_price_change BOOLEAN DEFAULT TRUE,
  notify_on_bid BOOLEAN DEFAULT TRUE,
  notify_before_expiration BOOLEAN DEFAULT TRUE,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, listing_id)
);

-- Indexes
CREATE INDEX idx_saved_user ON marketplace_saved(user_id, created_at DESC);
CREATE INDEX idx_saved_listing ON marketplace_saved(listing_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_saved ENABLE ROW LEVEL SECURITY;

-- ===== MARKETPLACE LISTINGS POLICIES =====

-- Anyone can view active listings
CREATE POLICY "Anyone can view active listings"
  ON marketplace_listings FOR SELECT
  USING (status = 'active' OR status = 'pending');

-- Sellers can view their own listings (any status)
CREATE POLICY "Sellers can view their own listings"
  ON marketplace_listings FOR SELECT
  USING (auth.uid() = seller_id);

-- Authenticated users can create listings
CREATE POLICY "Users can create listings"
  ON marketplace_listings FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

-- Sellers can update their own listings
CREATE POLICY "Sellers can update own listings"
  ON marketplace_listings FOR UPDATE
  USING (auth.uid() = seller_id)
  WITH CHECK (auth.uid() = seller_id);

-- Sellers can delete their own listings (if not sold)
CREATE POLICY "Sellers can delete own unsold listings"
  ON marketplace_listings FOR DELETE
  USING (auth.uid() = seller_id AND status != 'sold');

-- ===== MARKETPLACE BIDS POLICIES =====

-- Users can view bids on listings they're watching or their own bids
CREATE POLICY "Users can view relevant bids"
  ON marketplace_bids FOR SELECT
  USING (
    auth.uid() = bidder_id OR
    EXISTS (SELECT 1 FROM marketplace_listings WHERE id = listing_id AND seller_id = auth.uid())
  );

-- Users can place bids
CREATE POLICY "Users can place bids"
  ON marketplace_bids FOR INSERT
  WITH CHECK (auth.uid() = bidder_id);

-- Users can update their own bids
CREATE POLICY "Users can update own bids"
  ON marketplace_bids FOR UPDATE
  USING (auth.uid() = bidder_id)
  WITH CHECK (auth.uid() = bidder_id);

-- ===== MARKETPLACE PURCHASES POLICIES =====

-- Buyers and sellers can view their purchases
CREATE POLICY "Users can view their purchases"
  ON marketplace_purchases FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- System creates purchases (handled via service role in API)
-- No INSERT policy for regular users

-- ===== MARKETPLACE TRANSACTIONS POLICIES =====

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions"
  ON marketplace_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- ===== MARKETPLACE SAVED POLICIES =====

-- Users can view their saved listings
CREATE POLICY "Users can view own saved listings"
  ON marketplace_saved FOR SELECT
  USING (auth.uid() = user_id);

-- Users can save listings
CREATE POLICY "Users can save listings"
  ON marketplace_saved FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their saved listing preferences
CREATE POLICY "Users can update own saved listings"
  ON marketplace_saved FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their saved listings
CREATE POLICY "Users can delete own saved listings"
  ON marketplace_saved FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update updated_at timestamp on listings
CREATE OR REPLACE FUNCTION update_marketplace_listings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER marketplace_listings_updated_at
  BEFORE UPDATE ON marketplace_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_marketplace_listings_updated_at();

-- Update updated_at timestamp on bids
CREATE OR REPLACE FUNCTION update_marketplace_bids_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER marketplace_bids_updated_at
  BEFORE UPDATE ON marketplace_bids
  FOR EACH ROW
  EXECUTE FUNCTION update_marketplace_bids_updated_at();

-- Update updated_at timestamp on purchases
CREATE OR REPLACE FUNCTION update_marketplace_purchases_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER marketplace_purchases_updated_at
  BEFORE UPDATE ON marketplace_purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_marketplace_purchases_updated_at();

-- Increment saves_count on listings when saved
CREATE OR REPLACE FUNCTION increment_listing_saves()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE marketplace_listings
  SET saves_count = saves_count + 1
  WHERE id = NEW.listing_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_saves_on_insert
  AFTER INSERT ON marketplace_saved
  FOR EACH ROW
  EXECUTE FUNCTION increment_listing_saves();

-- Decrement saves_count on listings when unsaved
CREATE OR REPLACE FUNCTION decrement_listing_saves()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE marketplace_listings
  SET saves_count = saves_count - 1
  WHERE id = OLD.listing_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER decrement_saves_on_delete
  AFTER DELETE ON marketplace_saved
  FOR EACH ROW
  EXECUTE FUNCTION decrement_listing_saves();

-- Log transaction on listing creation
CREATE OR REPLACE FUNCTION log_listing_created()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO marketplace_transactions (
    user_id, listing_id, transaction_type, description, amount
  ) VALUES (
    NEW.seller_id,
    NEW.id,
    'listing_created',
    'Listed ' || NEW.property_address || ' for $' || NEW.asking_price,
    NEW.asking_price
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_listing_creation
  AFTER INSERT ON marketplace_listings
  FOR EACH ROW
  EXECUTE FUNCTION log_listing_created();

-- Update bid count on listings
CREATE OR REPLACE FUNCTION update_listing_bid_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE marketplace_listings
  SET
    bid_count = (SELECT COUNT(*) FROM marketplace_bids WHERE listing_id = NEW.listing_id AND status = 'active'),
    current_bid = GREATEST(current_bid, NEW.bid_amount)
  WHERE id = NEW.listing_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bid_count_on_insert
  AFTER INSERT ON marketplace_bids
  FOR EACH ROW
  EXECUTE FUNCTION update_listing_bid_count();

-- Mark old bids as outbid when new higher bid placed
CREATE OR REPLACE FUNCTION mark_previous_bids_outbid()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE marketplace_bids
  SET status = 'outbid'
  WHERE listing_id = NEW.listing_id
    AND bidder_id != NEW.bidder_id
    AND status = 'active'
    AND bid_amount < NEW.bid_amount;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mark_outbid_on_new_bid
  AFTER INSERT ON marketplace_bids
  FOR EACH ROW
  EXECUTE FUNCTION mark_previous_bids_outbid();

-- =====================================================
-- FUNCTIONS / STORED PROCEDURES
-- =====================================================

-- Function to complete a purchase (called by API after payment confirmed)
CREATE OR REPLACE FUNCTION complete_marketplace_purchase(
  p_listing_id UUID,
  p_buyer_id UUID,
  p_purchase_price DECIMAL,
  p_payment_intent_id TEXT
)
RETURNS UUID AS $$
DECLARE
  v_purchase_id UUID;
  v_seller_id UUID;
  v_marketplace_fee DECIMAL;
  v_seller_payout DECIMAL;
BEGIN
  -- Get seller from listing
  SELECT seller_id INTO v_seller_id
  FROM marketplace_listings
  WHERE id = p_listing_id;

  IF v_seller_id IS NULL THEN
    RAISE EXCEPTION 'Listing not found';
  END IF;

  -- Calculate fees (5% marketplace fee)
  v_marketplace_fee := p_purchase_price * 0.05;
  v_seller_payout := p_purchase_price - v_marketplace_fee;

  -- Create purchase record
  INSERT INTO marketplace_purchases (
    listing_id, seller_id, buyer_id, purchase_price,
    marketplace_fee, seller_payout, payment_intent_id,
    payment_status
  ) VALUES (
    p_listing_id, v_seller_id, p_buyer_id, p_purchase_price,
    v_marketplace_fee, v_seller_payout, p_payment_intent_id,
    'paid'
  )
  RETURNING id INTO v_purchase_id;

  -- Update listing status
  UPDATE marketplace_listings
  SET status = 'sold', sold_at = NOW()
  WHERE id = p_listing_id;

  -- Log transaction
  INSERT INTO marketplace_transactions (
    user_id, listing_id, purchase_id, transaction_type, description, amount
  ) VALUES (
    p_buyer_id, p_listing_id, v_purchase_id, 'purchase_completed',
    'Purchased tax lien for $' || p_purchase_price, p_purchase_price
  );

  RETURN v_purchase_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get marketplace stats
CREATE OR REPLACE FUNCTION get_marketplace_stats()
RETURNS TABLE (
  active_listings_count BIGINT,
  total_volume_30d DECIMAL,
  avg_roi DECIMAL,
  sales_24h BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) FILTER (WHERE l.status = 'active') AS active_listings_count,
    COALESCE(SUM(p.purchase_price) FILTER (WHERE p.purchased_at > NOW() - INTERVAL '30 days'), 0) AS total_volume_30d,
    COALESCE(AVG((p.purchase_price - l.original_purchase_price) / l.original_purchase_price * 100) FILTER (WHERE p.purchased_at > NOW() - INTERVAL '30 days'), 0) AS avg_roi,
    COUNT(*) FILTER (WHERE p.purchased_at > NOW() - INTERVAL '24 hours') AS sales_24h
  FROM marketplace_listings l
  LEFT JOIN marketplace_purchases p ON p.listing_id = l.id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE marketplace_listings IS 'Tax lien listings available for purchase on the secondary marketplace';
COMMENT ON TABLE marketplace_bids IS 'Bids placed on auction-style marketplace listings';
COMMENT ON TABLE marketplace_purchases IS 'Completed marketplace purchases with payment and assignment tracking';
COMMENT ON TABLE marketplace_transactions IS 'Audit log of all marketplace activities';
COMMENT ON TABLE marketplace_saved IS 'User watchlist for marketplace listings';
