-- Premium Features Migration
-- Adds premium content support with subscription-based access control

-- ============================================================================
-- 1. Add premium flag to listings
-- ============================================================================

ALTER TABLE marketplace_listings
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;

-- Index for querying premium listings
CREATE INDEX IF NOT EXISTS idx_ml_is_premium
ON marketplace_listings(is_premium)
WHERE is_premium = TRUE;

-- ============================================================================
-- 2. Add role column to users table for admin access
-- ============================================================================

ALTER TABLE users
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Constraint to ensure valid roles
ALTER TABLE users
ADD CONSTRAINT valid_user_role
CHECK (role IN ('user', 'admin', 'superadmin'));

-- Index for role queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============================================================================
-- 3. Helper function to check if current user is admin
-- ============================================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('admin', 'superadmin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 4. Update RLS policies for marketplace_listing_media
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Media viewable with listing" ON marketplace_listing_media;
DROP POLICY IF EXISTS "Anyone can view media" ON marketplace_listing_media;

-- New tiered access policy for SELECT
CREATE POLICY "Media access based on subscription tier"
ON marketplace_listing_media
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM marketplace_listings ml
    WHERE ml.id = marketplace_listing_media.listing_id
    AND (
      -- Listing must be active or user is the seller
      ml.status = 'active' OR ml.seller_id = auth.uid()
    )
    AND (
      -- Free users: max 2 photos, only on non-premium listings
      (
        ml.is_premium = FALSE AND
        marketplace_listing_media.sort_order < 2
      ) OR
      -- Pro/Elite users: full access to premium content
      (
        auth.uid() IS NOT NULL AND
        EXISTS (
          SELECT 1 FROM users u
          WHERE u.id = auth.uid()
          AND u.subscription_tier IN ('pro', 'elite')
        )
      ) OR
      -- Sellers: always see their own content
      ml.seller_id = auth.uid()
    )
  )
);

-- Admin-only INSERT policy
CREATE POLICY "Admins can insert media"
ON marketplace_listing_media
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('admin', 'superadmin')
  )
);

-- Admin-only UPDATE policy
CREATE POLICY "Admins can update media"
ON marketplace_listing_media
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('admin', 'superadmin')
  )
);

-- Admin-only DELETE policy
CREATE POLICY "Admins can delete media"
ON marketplace_listing_media
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('admin', 'superadmin')
  )
);

-- ============================================================================
-- 5. Update RLS policies for marketplace_listing_documents
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Documents viewable with listing" ON marketplace_listing_documents;
DROP POLICY IF EXISTS "Anyone can view documents" ON marketplace_listing_documents;

-- New tiered access policy for SELECT
CREATE POLICY "Documents access based on subscription tier"
ON marketplace_listing_documents
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM marketplace_listings ml
    WHERE ml.id = marketplace_listing_documents.listing_id
    AND (
      -- Listing must be active or user is the seller
      ml.status = 'active' OR ml.seller_id = auth.uid()
    )
    AND (
      -- Free users: NO document access for premium listings
      ml.is_premium = FALSE OR
      -- Pro/Elite users: full access
      (
        auth.uid() IS NOT NULL AND
        EXISTS (
          SELECT 1 FROM users u
          WHERE u.id = auth.uid()
          AND u.subscription_tier IN ('pro', 'elite')
        )
      ) OR
      -- Sellers: always see own documents
      ml.seller_id = auth.uid()
    )
  )
);

-- Admin-only INSERT policy
CREATE POLICY "Admins can insert documents"
ON marketplace_listing_documents
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('admin', 'superadmin')
  )
);

-- Admin-only UPDATE policy
CREATE POLICY "Admins can update documents"
ON marketplace_listing_documents
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('admin', 'superadmin')
  )
);

-- Admin-only DELETE policy
CREATE POLICY "Admins can delete documents"
ON marketplace_listing_documents
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('admin', 'superadmin')
  )
);

-- ============================================================================
-- 6. Grant necessary permissions
-- ============================================================================

-- Ensure authenticated users can query the tables
GRANT SELECT ON marketplace_listing_media TO authenticated;
GRANT SELECT ON marketplace_listing_documents TO authenticated;

-- Admins get full CRUD via policies
GRANT ALL ON marketplace_listing_media TO authenticated;
GRANT ALL ON marketplace_listing_documents TO authenticated;

-- ============================================================================
-- NOTES:
-- ============================================================================
-- After running this migration:
-- 1. Manually create storage buckets in Supabase dashboard:
--    - listings-media (50MB limit, private)
--    - listings-documents (20MB limit, private)
-- 2. Run 20260617_storage_policies.sql to apply bucket RLS policies
-- 3. Set at least one user's role to 'admin' for testing:
--    UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
