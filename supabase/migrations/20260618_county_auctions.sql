-- =====================================================
-- WEALTHFLOW AI - COUNTY AUCTIONS (PRIMARY MARKET)
-- Migration: 20260618_county_auctions
-- =====================================================
-- This table stores tax liens/deeds available directly
-- from county auctions (primary market), NOT secondary
-- marketplace sales between investors.
-- =====================================================

CREATE TABLE IF NOT EXISTS county_auctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- County/State Info
  county TEXT NOT NULL,
  state TEXT NOT NULL,

  -- Property Details
  property_address TEXT NOT NULL,
  parcel_apn TEXT NOT NULL,
  property_type TEXT,

  -- Auction Details
  auction_type TEXT NOT NULL, -- 'tax_lien' or 'tax_deed'
  auction_name TEXT,
  auction_date TIMESTAMPTZ,
  auction_platform TEXT, -- 'online', 'in-person', 'hybrid'
  auction_url TEXT, -- Link to county auction site

  -- Financial Details
  opening_bid NUMERIC(12,2),
  current_bid NUMERIC(12,2),
  assessed_value NUMERIC(12,2),
  estimated_value NUMERIC(12,2),

  -- Lien-specific
  lien_amount NUMERIC(12,2), -- Total owed
  interest_rate NUMERIC(5,2), -- 18.00 = 18%
  redemption_period TEXT, -- "24 months", "2 years", etc.
  prior_year_taxes NUMERIC(12,2),

  -- Status
  status TEXT NOT NULL DEFAULT 'available', -- available, sold, cancelled, pending

  -- Content
  description TEXT,
  notes TEXT,

  -- Data Source Tracking
  source TEXT NOT NULL, -- 'st_johns_scraper', 'maricopa_scraper', etc.
  source_url TEXT, -- Original county data URL
  source_metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_scraped_at TIMESTAMPTZ,

  -- Constraints
  CONSTRAINT valid_auction_type CHECK (auction_type IN ('tax_lien', 'tax_deed')),
  CONSTRAINT valid_status CHECK (status IN ('available', 'sold', 'cancelled', 'pending')),
  CONSTRAINT positive_values CHECK (
    (opening_bid IS NULL OR opening_bid >= 0) AND
    (current_bid IS NULL OR current_bid >= 0) AND
    (assessed_value IS NULL OR assessed_value >= 0)
  )
);

-- Indexes for performance
CREATE INDEX idx_auctions_county_state ON county_auctions(county, state);
CREATE INDEX idx_auctions_status ON county_auctions(status);
CREATE INDEX idx_auctions_type ON county_auctions(auction_type);
CREATE INDEX idx_auctions_date ON county_auctions(auction_date);
CREATE INDEX idx_auctions_parcel ON county_auctions(parcel_apn);
CREATE INDEX idx_auctions_created ON county_auctions(created_at DESC);

-- Full-text search index
CREATE INDEX idx_auctions_search ON county_auctions
  USING GIN (to_tsvector('english',
    COALESCE(property_address, '') || ' ' ||
    COALESCE(county, '') || ' ' ||
    COALESCE(parcel_apn, '')
  ));

-- Unique constraint to prevent duplicate imports
CREATE UNIQUE INDEX idx_auctions_unique_parcel ON county_auctions(parcel_apn, county, state)
  WHERE status = 'available';

-- Enable Row Level Security (RLS)
ALTER TABLE county_auctions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view available auctions
CREATE POLICY "Public can view available auctions"
  ON county_auctions
  FOR SELECT
  USING (status = 'available');

-- Policy: Service role can manage all auctions (for scrapers)
CREATE POLICY "Service role can manage auctions"
  ON county_auctions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_county_auctions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_county_auctions_updated_at
  BEFORE UPDATE ON county_auctions
  FOR EACH ROW
  EXECUTE FUNCTION update_county_auctions_updated_at();

-- Comments
COMMENT ON TABLE county_auctions IS 'Primary market: Tax liens/deeds available directly from county auctions';
COMMENT ON COLUMN county_auctions.source IS 'Identifies which scraper/data source populated this record';
COMMENT ON COLUMN county_auctions.source_metadata IS 'Additional data from county (opportunity scores, flood zones, etc.)';
