-- Storage RLS Policies for Premium Features
-- Controls access to listings-media and listings-documents storage buckets

-- ============================================================================
-- IMPORTANT: This migration assumes the following storage buckets exist:
-- - listings-media (50MB max file size, private)
-- - listings-documents (20MB max file size, private)
--
-- Create these buckets manually in the Supabase Dashboard first:
-- Storage > Create new bucket > Name: listings-media, Public: OFF
-- Storage > Create new bucket > Name: listings-documents, Public: OFF
-- ============================================================================

-- ============================================================================
-- 1. listings-media bucket policies
-- ============================================================================

-- Allow admins to upload media files
CREATE POLICY "Admins can upload media files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'listings-media' AND
  auth.uid() IN (
    SELECT id FROM users
    WHERE role IN ('admin', 'superadmin')
  )
);

-- Allow admins to update media files (replace)
CREATE POLICY "Admins can update media files"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'listings-media' AND
  auth.uid() IN (
    SELECT id FROM users
    WHERE role IN ('admin', 'superadmin')
  )
);

-- Allow admins to delete media files
CREATE POLICY "Admins can delete media files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'listings-media' AND
  auth.uid() IN (
    SELECT id FROM users
    WHERE role IN ('admin', 'superadmin')
  )
);

-- Allow authenticated users to view/download media files
-- (Actual access control is enforced by marketplace_listing_media table RLS policies)
CREATE POLICY "Authenticated users can view media files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'listings-media' AND
  auth.uid() IS NOT NULL
);

-- ============================================================================
-- 2. listings-documents bucket policies
-- ============================================================================

-- Allow admins to upload document files
CREATE POLICY "Admins can upload document files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'listings-documents' AND
  auth.uid() IN (
    SELECT id FROM users
    WHERE role IN ('admin', 'superadmin')
  )
);

-- Allow admins to update document files (replace)
CREATE POLICY "Admins can update document files"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'listings-documents' AND
  auth.uid() IN (
    SELECT id FROM users
    WHERE role IN ('admin', 'superadmin')
  )
);

-- Allow admins to delete document files
CREATE POLICY "Admins can delete document files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'listings-documents' AND
  auth.uid() IN (
    SELECT id FROM users
    WHERE role IN ('admin', 'superadmin')
  )
);

-- Allow authenticated users to view/download document files
-- (Actual access control is enforced by marketplace_listing_documents table RLS policies)
CREATE POLICY "Authenticated users can view document files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'listings-documents' AND
  auth.uid() IS NOT NULL
);

-- ============================================================================
-- NOTES:
-- ============================================================================
-- After running this migration:
--
-- 1. Test bucket creation:
--    - Go to Supabase Dashboard > Storage
--    - Verify listings-media and listings-documents buckets exist
--    - Check that "Public" is set to OFF for both
--
-- 2. Configure bucket settings:
--    - listings-media: File size limit = 52428800 (50MB)
--    - listings-media: Allowed MIME types = image/*, video/*
--    - listings-documents: File size limit = 20971520 (20MB)
--    - listings-documents: Allowed MIME types = application/pdf, application/msword, etc.
--
-- 3. Set at least one user to admin role for testing:
--    UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
--
-- 4. Test upload permissions:
--    - Admin user should be able to upload to both buckets
--    - Regular users should NOT be able to upload
--    - All authenticated users can view files (but table RLS controls actual data access)
