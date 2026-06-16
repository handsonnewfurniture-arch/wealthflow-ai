-- WealthFlow AI Database Schema
-- Created: 2026-06-16

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  xp_points INTEGER DEFAULT 0,
  xp_level INTEGER DEFAULT 1,
  subscription_tier TEXT DEFAULT 'free', -- free, starter, pro, elite
  subscription_status TEXT DEFAULT 'inactive', -- inactive, active, cancelled, past_due
  stripe_customer_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe_customer ON users(stripe_customer_id);

-- =====================================================
-- SUBSCRIPTIONS TABLE
-- =====================================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_price_id TEXT NOT NULL,
  tier TEXT NOT NULL, -- starter, pro, elite
  status TEXT NOT NULL, -- active, cancelled, past_due, unpaid
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);

-- =====================================================
-- COUNTIES TABLE
-- =====================================================
CREATE TABLE counties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  state TEXT NOT NULL,
  county_name TEXT NOT NULL,
  auction_type TEXT, -- tax_lien, tax_deed, hybrid
  next_auction_date DATE,
  auction_website TEXT,
  auction_format TEXT, -- online, in_person, hybrid
  max_interest_rate DECIMAL(5,2), -- e.g., 18.00 for 18%
  redemption_period_months INTEGER,
  median_home_value INTEGER,
  population INTEGER,
  crime_risk_score INTEGER, -- 0-100, lower is better
  population_trend TEXT, -- growing, stable, declining
  competition_level TEXT, -- low, medium, high
  investor_score INTEGER, -- 0-100 calculated score
  notes TEXT,
  treasurer_url TEXT,
  assessor_url TEXT,
  gis_url TEXT,
  last_scraped_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(state, county_name)
);

CREATE INDEX idx_counties_state ON counties(state);
CREATE INDEX idx_counties_score ON counties(investor_score DESC);
CREATE INDEX idx_counties_auction_date ON counties(next_auction_date);

-- =====================================================
-- AUCTIONS TABLE
-- =====================================================
CREATE TABLE auctions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  county_id UUID REFERENCES counties(id) ON DELETE CASCADE,
  auction_date DATE NOT NULL,
  registration_deadline DATE,
  deposit_required INTEGER,
  total_parcels INTEGER,
  total_value INTEGER,
  auction_url TEXT,
  status TEXT DEFAULT 'upcoming', -- upcoming, in_progress, completed, cancelled
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_auctions_county ON auctions(county_id);
CREATE INDEX idx_auctions_date ON auctions(auction_date);
CREATE INDEX idx_auctions_status ON auctions(status);

-- =====================================================
-- OPPORTUNITIES TABLE
-- =====================================================
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  county_id UUID REFERENCES counties(id) ON DELETE CASCADE,
  auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,
  parcel_id TEXT,
  address TEXT,
  property_type TEXT, -- residential, commercial, land, industrial
  assessed_value INTEGER,
  lien_amount INTEGER,
  opening_bid INTEGER,
  interest_rate DECIMAL(5,2),
  property_condition TEXT, -- owner_occupied, vacant, unknown
  flood_zone BOOLEAN DEFAULT false,
  environmental_risk BOOLEAN DEFAULT false,

  -- Risk factors
  is_rural BOOLEAN DEFAULT false,
  is_vacant_land BOOLEAN DEFAULT false,
  is_high_crime BOOLEAN DEFAULT false,
  lien_to_value_ratio DECIMAL(5,2), -- calculated: lien_amount / assessed_value

  -- Scoring
  yield_score INTEGER, -- 0-25
  value_score INTEGER, -- 0-20
  crime_score INTEGER, -- 0-20
  redemption_score INTEGER, -- 0-15
  competition_score INTEGER, -- 0-10
  accessibility_score INTEGER, -- 0-10
  total_score INTEGER, -- 0-100

  avoid_reason TEXT, -- if flagged to avoid
  status TEXT DEFAULT 'available', -- available, watchlist, acquired, passed

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_opportunities_county ON opportunities(county_id);
CREATE INDEX idx_opportunities_auction ON opportunities(auction_id);
CREATE INDEX idx_opportunities_score ON opportunities(total_score DESC);
CREATE INDEX idx_opportunities_status ON opportunities(status);

-- =====================================================
-- WATCHLISTS TABLE
-- =====================================================
CREATE TABLE watchlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  notes TEXT,
  priority INTEGER DEFAULT 5, -- 1-10 scale
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, opportunity_id)
);

CREATE INDEX idx_watchlists_user ON watchlists(user_id);
CREATE INDEX idx_watchlists_opportunity ON watchlists(opportunity_id);

-- =====================================================
-- PORTFOLIOS TABLE
-- =====================================================
CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,
  county_id UUID REFERENCES counties(id) ON DELETE SET NULL,

  -- Lien details
  parcel_id TEXT,
  address TEXT,
  purchase_amount INTEGER NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  purchase_date DATE NOT NULL,
  redemption_deadline DATE,

  -- Status tracking
  status TEXT DEFAULT 'active', -- active, redeemed, foreclosed, acquired
  redemption_date DATE,
  redemption_amount INTEGER,
  profit_amount INTEGER,

  -- Reinvestment tracking
  reinvested BOOLEAN DEFAULT false,
  reinvestment_date DATE,
  days_to_reinvest INTEGER,

  -- Property acquisition (if lien not redeemed)
  acquired_property BOOLEAN DEFAULT false,
  acquisition_date DATE,
  acquisition_cost INTEGER,
  estimated_arv INTEGER, -- after repair value

  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_portfolios_user ON portfolios(user_id);
CREATE INDEX idx_portfolios_status ON portfolios(status);
CREATE INDEX idx_portfolios_redemption_deadline ON portfolios(redemption_deadline);

-- =====================================================
-- REDEMPTIONS TABLE
-- =====================================================
CREATE TABLE redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  principal_amount INTEGER NOT NULL,
  interest_amount INTEGER NOT NULL,
  fees_amount INTEGER DEFAULT 0,
  total_amount INTEGER NOT NULL,

  redemption_date DATE NOT NULL,
  hold_period_days INTEGER NOT NULL,
  annualized_return DECIMAL(5,2),

  -- Reinvestment tracking
  funds_available INTEGER NOT NULL,
  funds_deployed INTEGER DEFAULT 0,
  funds_remaining INTEGER,
  reinvested BOOLEAN DEFAULT false,
  reinvestment_target_date DATE, -- should be within 48 hours

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_redemptions_user ON redemptions(user_id);
CREATE INDEX idx_redemptions_portfolio ON redemptions(portfolio_id);
CREATE INDEX idx_redemptions_date ON redemptions(redemption_date);

-- =====================================================
-- LESSONS TABLE
-- =====================================================
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- basics, strategy, research, portfolio, advanced
  difficulty TEXT DEFAULT 'beginner', -- beginner, intermediate, advanced
  xp_reward INTEGER DEFAULT 50,
  order_index INTEGER DEFAULT 0,
  content TEXT NOT NULL, -- markdown or JSON content
  duration_minutes INTEGER,
  tier_required TEXT DEFAULT 'free', -- free, starter, pro, elite
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_lessons_category ON lessons(category);
CREATE INDEX idx_lessons_slug ON lessons(slug);

-- Track user lesson progress
CREATE TABLE user_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started', -- not_started, in_progress, completed
  progress_percent INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_user_lessons_user ON user_lessons(user_id);
CREATE INDEX idx_user_lessons_lesson ON user_lessons(lesson_id);

-- =====================================================
-- XP EVENTS TABLE
-- =====================================================
CREATE TABLE xp_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- research_county, save_opportunity, complete_lesson, etc.
  xp_earned INTEGER NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_xp_events_user ON xp_events(user_id);
CREATE INDEX idx_xp_events_created ON xp_events(created_at DESC);

-- =====================================================
-- BADGES TABLE
-- =====================================================
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT, -- icon name or emoji
  xp_required INTEGER,
  tier TEXT, -- bronze, silver, gold, platinum
  criteria JSONB, -- JSON defining unlock criteria
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Track user badges
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges_user ON user_badges(user_id);
CREATE INDEX idx_user_badges_badge ON user_badges(badge_id);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to calculate investor score for counties
CREATE OR REPLACE FUNCTION calculate_county_score(
  max_rate DECIMAL,
  median_value INTEGER,
  crime_score INTEGER,
  competition TEXT
) RETURNS INTEGER AS $$
DECLARE
  yield_pts INTEGER := 0;
  value_pts INTEGER := 0;
  crime_pts INTEGER := 0;
  comp_pts INTEGER := 0;
BEGIN
  -- Yield potential (0-35 points)
  IF max_rate >= 18 THEN yield_pts := 35;
  ELSIF max_rate >= 16 THEN yield_pts := 30;
  ELSIF max_rate >= 12 THEN yield_pts := 25;
  ELSIF max_rate >= 10 THEN yield_pts := 20;
  ELSIF max_rate >= 8 THEN yield_pts := 15;
  ELSE yield_pts := 10;
  END IF;

  -- Property value (0-25 points)
  IF median_value >= 400000 THEN value_pts := 25;
  ELSIF median_value >= 300000 THEN value_pts := 20;
  ELSIF median_value >= 200000 THEN value_pts := 15;
  ELSIF median_value >= 150000 THEN value_pts := 10;
  ELSE value_pts := 5;
  END IF;

  -- Crime score (0-25 points) - lower crime = more points
  IF crime_score <= 20 THEN crime_pts := 25;
  ELSIF crime_score <= 40 THEN crime_pts := 20;
  ELSIF crime_score <= 60 THEN crime_pts := 15;
  ELSIF crime_score <= 80 THEN crime_pts := 10;
  ELSE crime_pts := 5;
  END IF;

  -- Competition (0-15 points)
  IF competition = 'low' THEN comp_pts := 15;
  ELSIF competition = 'medium' THEN comp_pts := 10;
  ELSE comp_pts := 5;
  END IF;

  RETURN yield_pts + value_pts + crime_pts + comp_pts;
END;
$$ LANGUAGE plpgsql;

-- Function to update XP and level
CREATE OR REPLACE FUNCTION update_user_xp(
  p_user_id UUID,
  p_xp_amount INTEGER
) RETURNS TABLE(new_xp INTEGER, new_level INTEGER) AS $$
DECLARE
  current_xp INTEGER;
  new_total_xp INTEGER;
  calculated_level INTEGER;
BEGIN
  -- Get current XP
  SELECT xp_points INTO current_xp FROM users WHERE id = p_user_id;

  -- Calculate new total
  new_total_xp := current_xp + p_xp_amount;

  -- Calculate level (every 1000 XP = 1 level)
  calculated_level := FLOOR(new_total_xp / 1000) + 1;

  -- Update user
  UPDATE users
  SET xp_points = new_total_xp,
      xp_level = calculated_level,
      updated_at = NOW()
  WHERE id = p_user_id;

  RETURN QUERY SELECT new_total_xp, calculated_level;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Watchlists policies
CREATE POLICY "Users can manage own watchlists" ON watchlists
  FOR ALL USING (auth.uid() = user_id);

-- Portfolios policies
CREATE POLICY "Users can manage own portfolios" ON portfolios
  FOR ALL USING (auth.uid() = user_id);

-- Redemptions policies
CREATE POLICY "Users can view own redemptions" ON redemptions
  FOR SELECT USING (auth.uid() = user_id);

-- User lessons policies
CREATE POLICY "Users can manage own lesson progress" ON user_lessons
  FOR ALL USING (auth.uid() = user_id);

-- XP events policies
CREATE POLICY "Users can view own XP events" ON xp_events
  FOR SELECT USING (auth.uid() = user_id);

-- User badges policies
CREATE POLICY "Users can view own badges" ON user_badges
  FOR SELECT USING (auth.uid() = user_id);

-- Public read access to reference tables
CREATE POLICY "Anyone can view counties" ON counties FOR SELECT USING (true);
CREATE POLICY "Anyone can view auctions" ON auctions FOR SELECT USING (true);
CREATE POLICY "Anyone can view opportunities" ON opportunities FOR SELECT USING (true);
CREATE POLICY "Anyone can view lessons" ON lessons FOR SELECT USING (true);
CREATE POLICY "Anyone can view badges" ON badges FOR SELECT USING (true);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_counties_updated_at BEFORE UPDATE ON counties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_auctions_updated_at BEFORE UPDATE ON auctions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON opportunities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_redemptions_updated_at BEFORE UPDATE ON redemptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_lessons_updated_at BEFORE UPDATE ON user_lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
