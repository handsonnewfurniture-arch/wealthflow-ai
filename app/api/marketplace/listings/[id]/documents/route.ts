/**
 * Documents Upload API Routes
 *
 * Handles upload, retrieval, and deletion of document files (PDFs, DOC, etc.)
 * for marketplace listings
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAuthClient } from '@/lib/marketplace/api'
import { requireAdmin } from '@/lib/marketplace/auth'
import {
  validateDocumentFile,
  generateUniqueFilename,
  ALLOWED_DOCUMENT_TYPES,
  MAX_DOCUMENT_SIZE
} from '@/lib/marketplace/upload-validation'

// ============================================================================
// POST - Upload Document File
// ============================================================================

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Verify admin access
    await requireAdmin()

    const supabase = createAuthClient()
    const listingId = params.id

    // 2. Verify listing exists
    const { data: listing, error: listingError } = await supabase
      .from('marketplace_listings')
      .select('id, title')
      .eq('id', listingId)
      .single()

    if (listingError || !listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // 3. Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const documentName = formData.get('name') as string || file?.name || 'Untitled Document'
    const documentType = formData.get('document_type') as string || 'other'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // 4. Validate file
    const validation = validateDocumentFile(file)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // 5. Additional server-side validation
    if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Allowed: PDF, DOC, DOCX, XLS, XLSX` },
        { status: 400 }
      )
    }

    if (file.size > MAX_DOCUMENT_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size: ${MAX_DOCUMENT_SIZE / (1024 * 1024)}MB` },
        { status: 400 }
      )
    }

    // 6. Generate unique filename and upload to Supabase Storage
    const fileName = generateUniqueFilename(file.name, listingId)

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('listings-documents')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
        cacheControl: '3600' // Cache for 1 hour
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload document to storage', details: uploadError.message },
        { status: 500 }
      )
    }

    // 7. Get public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('listings-documents')
      .getPublicUrl(fileName)

    // 8. Insert document record into database
    const { data: documentRecord, error: insertError } = await supabase
      .from('marketplace_listing_documents')
      .insert({
        listing_id: listingId,
        name: documentName,
        url: publicUrl,
        document_type: documentType,
        file_size_bytes: file.size
      })
      .select()
      .single()

    if (insertError) {
      console.error('Database insert error:', insertError)

      // Cleanup: Delete uploaded file if database insert fails
      await supabase.storage
        .from('listings-documents')
        .remove([fileName])

      return NextResponse.json(
        { error: 'Failed to save document record', details: insertError.message },
        { status: 500 }
      )
    }

    // 9. Return success response
    return NextResponse.json(
      {
        success: true,
        document: documentRecord,
        warnings: validation.warnings
      },
      { status: 201 }
    )

  } catch (error: any) {
    console.error('Document upload error:', error)

    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (error.message === 'Admin access required') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// ============================================================================
// GET - List Documents with Access Control
// ============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAuthClient()
    const listingId = params.id

    // 1. Get current user (may be null for unauthenticated requests)
    const { data: { user } } = await supabase.auth.getUser()

    // 2. Fetch listing to check premium status and seller
    const { data: listing, error: listingError } = await supabase
      .from('marketplace_listings')
      .select('is_premium, seller_id, status, title')
      .eq('id', listingId)
      .single()

    if (listingError || !listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // 3. Fetch documents (RLS policies will filter based on user's subscription tier)
    const { data: documents, error: documentsError } = await supabase
      .from('marketplace_listing_documents')
      .select('*')
      .eq('listing_id', listingId)
      .order('created_at', { ascending: false })

    if (documentsError) {
      console.error('Documents fetch error:', documentsError)
      return NextResponse.json(
        { error: 'Failed to fetch documents' },
        { status: 500 }
      )
    }

    // 4. Determine user's subscription tier
    let userTier = 'free'
    let isListingSeller = false

    if (user) {
      const { data: userData } = await supabase
        .from('users')
        .select('subscription_tier')
        .eq('id', user.id)
        .single()

      userTier = userData?.subscription_tier || 'free'
      isListingSeller = listing.seller_id === user.id
    }

    // 5. Add access metadata to each document
    const documentsWithAccess = documents.map((doc) => {
      // For premium listings, only Pro/Elite users and sellers can access documents
      const hasAccess =
        !listing.is_premium || // Non-premium listings: everyone can access
        ['pro', 'elite'].includes(userTier) || // Pro/Elite users
        isListingSeller // Sellers see their own content

      return {
        ...doc,
        has_access: hasAccess,
        requires_upgrade: listing.is_premium && !hasAccess,
        // Don't expose URL if user doesn't have access
        url: hasAccess ? doc.url : null
      }
    })

    // 6. Return documents array with metadata
    return NextResponse.json({
      documents: documentsWithAccess,
      listing: {
        id: listing.id,
        title: listing.title,
        is_premium: listing.is_premium,
        status: listing.status
      },
      user_tier: userTier,
      is_seller: isListingSeller,
      total_count: documents.length,
      accessible_count: documentsWithAccess.filter(d => d.has_access).length
    })

  } catch (error: any) {
    console.error('Documents list error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// ============================================================================
// DELETE - Remove Document File
// ============================================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Verify admin access
    await requireAdmin()

    const supabase = createAuthClient()
    const listingId = params.id

    // 2. Get document ID from query params
    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('documentId')

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID required' },
        { status: 400 }
      )
    }

    // 3. Fetch document record to get storage path
    const { data: document, error: fetchError } = await supabase
      .from('marketplace_listing_documents')
      .select('*')
      .eq('id', documentId)
      .eq('listing_id', listingId)
      .single()

    if (fetchError || !document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // 4. Extract file path from URL
    // URL format: https://{project}.supabase.co/storage/v1/object/public/listings-documents/{path}
    const urlParts = document.url.split('/listings-documents/')
    if (urlParts.length < 2) {
      console.error('Invalid document URL format:', document.url)
      return NextResponse.json(
        { error: 'Invalid document URL format' },
        { status: 500 }
      )
    }

    const filePath = urlParts[1]

    // 5. Delete from Supabase Storage
    const { error: storageError } = await supabase.storage
      .from('listings-documents')
      .remove([filePath])

    if (storageError) {
      console.error('Storage deletion error:', storageError)
      // Continue anyway - may already be deleted
    }

    // 6. Delete database record
    const { error: deleteError } = await supabase
      .from('marketplace_listing_documents')
      .delete()
      .eq('id', documentId)

    if (deleteError) {
      console.error('Database deletion error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete document record' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, deleted_id: documentId })

  } catch (error: any) {
    console.error('Document deletion error:', error)

    if (error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (error.message === 'Admin access required') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
