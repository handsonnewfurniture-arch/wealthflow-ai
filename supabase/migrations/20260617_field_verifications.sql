-- Field Verification System for User-Generated Content
-- Contributors upload photos/videos from property locations and earn rewards

-- ==================================================
-- FIELD VERIFICATIONS TABLE
-- ==================================================

CREATE TABLE IF NOT EXISTS marketplace_field_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES marketplace_listings(id) ON DELETE CASCADE NOT NULL,
  contributor_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,

  -- Status workflow: pending → approved/rejected
  status TEXT NOT NULL DEFAULT 'pending',
  CONSTRAINT valid_verification_status CHECK (status IN ('pending', 'approved', 'rejected')),

  -- Verification metadata
  gps_latitude DECIMAL(10, 8), -- Extracted from photo EXIF
  gps_longitude DECIMAL(11, 8),
  photo_timestamp TIMESTAMP WITH TIME ZONE, -- When photo was actually taken
  distance_from_property_feet INTEGER, -- Calculated distance from property address

  -- Media storage URLs
  photo_urls TEXT[] DEFAULT '{}', -- Array of Supabase Storage URLs
  video_urls TEXT[] DEFAULT '{}',

  -- Exclusivity tracking
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  rejected_at TIMESTAMP WITH TIME ZONE,
  exclusivity_expires_at TIMESTAMP WITH TIME ZONE, -- Contributor gets 3-day exclusive access

  -- Admin review
  reviewed_by UUID REFERENCES users(id),
  admin_notes TEXT,
  rejection_reason TEXT,

  -- Rewards
  reward_granted BOOLEAN DEFAULT FALSE,
  reward_premium_days INTEGER DEFAULT 0, -- How many days of premium subscription earned

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- One verification per property (first contributor gets exclusive rights)
  UNIQUE(listing_id)
);

-- Indexes for performance
CREATE INDEX idx_field_verif_listing ON marketplace_field_verifications(listing_id);
CREATE INDEX idx_field_verif_contributor ON marketplace_field_verifications(contributor_id);
CREATE INDEX idx_field_verif_status ON marketplace_field_verifications(status);
CREATE INDEX idx_field_verif_exclusivity ON marketplace_field_verifications(exclusivity_expires_at);

-- ==================================================
-- UPDATE USERS TABLE - Track earned premium days
-- ==================================================

ALTER TABLE users
ADD COLUMN IF NOT EXISTS premium_days_earned INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS premium_earned_expires_at TIMESTAMP WITH TIME ZONE;

-- Index for users with earned premium
CREATE INDEX IF NOT EXISTS idx_users_premium_earned ON users(premium_earned_expires_at)
WHERE premium_earned_expires_at IS NOT NULL;

-- ==================================================
-- HELPER FUNCTIONS
-- ==================================================

-- Function to check if user can view field verification content
CREATE OR REPLACE FUNCTION can_view_field_verification(
  verification_id UUID,
  user_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_contributor_id UUID;
  v_status TEXT;
  v_exclusivity_expires TIMESTAMP WITH TIME ZONE;
  v_user_tier TEXT;
  v_user_role TEXT;
BEGIN
  -- Get verification details
  SELECT contributor_id, status, exclusivity_expires_at
  INTO v_contributor_id, v_status, v_exclusivity_expires
  FROM marketplace_field_verifications
  WHERE id = verification_id;

  -- Get user details
  SELECT subscription_tier, role
  INTO v_user_tier, v_user_role
  FROM users
  WHERE id = user_id;

  -- Only approved verifications can be viewed
  IF v_status != 'approved' THEN
    -- Admins can see pending/rejected
    IF v_user_role IN ('admin', 'superadmin') THEN
      RETURN TRUE;
    END IF;
    RETURN FALSE;
  END IF;

  -- Contributor can always see their own content
  IF v_contributor_id = user_id THEN
    RETURN TRUE;
  END IF;

  -- Admins can always see
  IF v_user_role IN ('admin', 'superadmin') THEN
    RETURN TRUE;
  END IF;

  -- During exclusivity period: only contributor
  IF v_exclusivity_expires IS NOT NULL AND NOW() < v_exclusivity_expires THEN
    RETURN FALSE;
  END IF;

  -- After exclusivity: Pro/Elite users can see
  IF v_user_tier IN ('pro', 'elite') THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to grant premium days reward
CREATE OR REPLACE FUNCTION grant_field_verification_reward(
  verification_id UUID,
  days_to_grant INTEGER DEFAULT 7
) RETURNS BOOLEAN AS $$
DECLARE
  v_contributor_id UUID;
  v_current_expires TIMESTAMP WITH TIME ZONE;
  v_new_expires TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get contributor
  SELECT contributor_id INTO v_contributor_id
  FROM marketplace_field_verifications
  WHERE id = verification_id;

  -- Get current premium expiration (or start from now)
  SELECT premium_earned_expires_at INTO v_current_expires
  FROM users
  WHERE id = v_contributor_id;

  -- Calculate new expiration
  IF v_current_expires IS NULL OR v_current_expires < NOW() THEN
    v_new_expires := NOW() + (days_to_grant || ' days')::INTERVAL;
  ELSE
    v_new_expires := v_current_expires + (days_to_grant || ' days')::INTERVAL;
  END IF;

  -- Update user record
  UPDATE users
  SET
    premium_days_earned = premium_days_earned + days_to_grant,
    premium_earned_expires_at = v_new_expires,
    subscription_tier = CASE
      WHEN subscription_tier = 'free' THEN 'pro'
      ELSE subscription_tier
    END,
    updated_at = NOW()
  WHERE id = v_contributor_id;

  -- Mark reward as granted
  UPDATE marketplace_field_verifications
  SET
    reward_granted = TRUE,
    reward_premium_days = days_to_grant,
    updated_at = NOW()
  WHERE id = verification_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==================================================
-- ROW LEVEL SECURITY POLICIES
-- ==================================================

ALTER TABLE marketplace_field_verifications ENABLE ROW LEVEL SECURITY;

-- Contributors can insert their own verifications
CREATE POLICY "Users can submit field verifications"
ON marketplace_field_verifications FOR INSERT
WITH CHECK (
  contributor_id = auth.uid() AND
  status = 'pending'
);

-- Users can view verifications based on access control function
CREATE POLICY "View field verifications with access control"
ON marketplace_field_verifications FOR SELECT
USING (can_view_field_verification(id, auth.uid()));

-- Contributors can update their own pending verifications
CREATE POLICY "Contributors can update pending verifications"
ON marketplace_field_verifications FOR UPDATE
USING (
  contributor_id = auth.uid() AND
  status = 'pending'
);

-- Admins can update any verification (for approval/rejection)
CREATE POLICY "Admins can update all verifications"
ON marketplace_field_verifications FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON marketplace_field_verifications TO authenticated;
