/**
 * File Upload Validation
 *
 * Client-side and server-side validation for media and document uploads
 */

// ============================================================================
// Constants
// ============================================================================

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg', // Some browsers report jpg as separate MIME type
]

export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/quicktime', // .mov files
  'video/x-m4v', // Some browsers report m4v
]

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.ms-excel', // .xls
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
]

// File size limits (in bytes)
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
export const MAX_VIDEO_SIZE = 50 * 1024 * 1024 // 50MB
export const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024 // 20MB

// Max files per upload batch
export const MAX_FILES_PER_UPLOAD = 10

// ============================================================================
// Validation Result Types
// ============================================================================

export interface ValidationResult {
  valid: boolean
  error?: string
  warnings?: string[]
}

// ============================================================================
// Media File Validation (Images & Videos)
// ============================================================================

/**
 * Validate a media file (image or video)
 *
 * @param file - File to validate
 * @returns Validation result with error message if invalid
 */
export function validateMediaFile(file: File): ValidationResult {
  const warnings: string[] = []

  // Check if file exists
  if (!file) {
    return { valid: false, error: 'No file provided' }
  }

  // Validate file type
  if (file.type.startsWith('image/')) {
    // Image validation
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid image format: ${file.type}. Allowed formats: JPEG, PNG, WebP`
      }
    }

    // Check image size
    if (file.size > MAX_IMAGE_SIZE) {
      return {
        valid: false,
        error: `Image too large: ${formatFileSize(file.size)}. Maximum size: ${formatFileSize(MAX_IMAGE_SIZE)}`
      }
    }

    // Warning for small images
    if (file.size < 50 * 1024) { // Less than 50KB
      warnings.push('Image file is quite small. Consider uploading higher quality images.')
    }

  } else if (file.type.startsWith('video/')) {
    // Video validation
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid video format: ${file.type}. Allowed formats: MP4, MOV`
      }
    }

    // Check video size
    if (file.size > MAX_VIDEO_SIZE) {
      return {
        valid: false,
        error: `Video too large: ${formatFileSize(file.size)}. Maximum size: ${formatFileSize(MAX_VIDEO_SIZE)}`
      }
    }

    // Warning for very large videos
    if (file.size > 40 * 1024 * 1024) { // Over 40MB
      warnings.push('Large video files may take longer to upload. Consider compressing the video.')
    }

  } else {
    return {
      valid: false,
      error: `Invalid file type: ${file.type}. Only images and videos are allowed.`
    }
  }

  // Check filename
  if (file.name.length > 255) {
    return {
      valid: false,
      error: 'Filename too long. Maximum 255 characters.'
    }
  }

  // Warn about special characters in filename
  if (/[^a-zA-Z0-9._-]/.test(file.name)) {
    warnings.push('Filename contains special characters. They will be sanitized during upload.')
  }

  return {
    valid: true,
    warnings: warnings.length > 0 ? warnings : undefined
  }
}

// ============================================================================
// Document File Validation
// ============================================================================

/**
 * Validate a document file (PDF, DOC, etc.)
 *
 * @param file - File to validate
 * @returns Validation result with error message if invalid
 */
export function validateDocumentFile(file: File): ValidationResult {
  const warnings: string[] = []

  // Check if file exists
  if (!file) {
    return { valid: false, error: 'No file provided' }
  }

  // Validate file type
  if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid document format: ${file.type}. Allowed formats: PDF, DOC, DOCX, XLS, XLSX`
    }
  }

  // Check file size
  if (file.size > MAX_DOCUMENT_SIZE) {
    return {
      valid: false,
      error: `Document too large: ${formatFileSize(file.size)}. Maximum size: ${formatFileSize(MAX_DOCUMENT_SIZE)}`
    }
  }

  // Check filename
  if (file.name.length > 255) {
    return {
      valid: false,
      error: 'Filename too long. Maximum 255 characters.'
    }
  }

  // Warning for very small documents
  if (file.size < 10 * 1024) { // Less than 10KB
    warnings.push('Document file is unusually small. Please verify the file is complete.')
  }

  return {
    valid: true,
    warnings: warnings.length > 0 ? warnings : undefined
  }
}

// ============================================================================
// Batch Validation
// ============================================================================

/**
 * Validate multiple files for upload
 *
 * @param files - Array of files to validate
 * @param type - Type of files ('media' or 'document')
 * @returns Validation result for the batch
 */
export function validateFileBatch(
  files: File[],
  type: 'media' | 'document'
): ValidationResult {
  if (!files || files.length === 0) {
    return { valid: false, error: 'No files selected' }
  }

  if (files.length > MAX_FILES_PER_UPLOAD) {
    return {
      valid: false,
      error: `Too many files. Maximum ${MAX_FILES_PER_UPLOAD} files per upload.`
    }
  }

  const validateFn = type === 'media' ? validateMediaFile : validateDocumentFile
  const allWarnings: string[] = []

  // Validate each file
  for (const file of files) {
    const result = validateFn(file)

    if (!result.valid) {
      return {
        valid: false,
        error: `${file.name}: ${result.error}`
      }
    }

    if (result.warnings) {
      allWarnings.push(...result.warnings.map(w => `${file.name}: ${w}`))
    }
  }

  // Calculate total size
  const totalSize = files.reduce((sum, file) => sum + file.size, 0)
  const maxBatchSize = 100 * 1024 * 1024 // 100MB total

  if (totalSize > maxBatchSize) {
    return {
      valid: false,
      error: `Total file size too large: ${formatFileSize(totalSize)}. Maximum batch size: ${formatFileSize(maxBatchSize)}`
    }
  }

  return {
    valid: true,
    warnings: allWarnings.length > 0 ? allWarnings : undefined
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format file size in human-readable format
 *
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Sanitize filename for storage
 *
 * @param filename - Original filename
 * @returns Sanitized filename safe for storage
 */
export function sanitizeFilename(filename: string): string {
  // Get file extension
  const parts = filename.split('.')
  const ext = parts.length > 1 ? parts.pop() : ''
  const name = parts.join('.')

  // Remove special characters, keep alphanumeric, dash, underscore
  const sanitized = name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .toLowerCase()

  return ext ? `${sanitized}.${ext}` : sanitized
}

/**
 * Generate unique filename with timestamp
 *
 * @param originalFilename - Original filename
 * @param prefix - Optional prefix (e.g., listing ID)
 * @returns Unique filename
 */
export function generateUniqueFilename(originalFilename: string, prefix?: string): string {
  const sanitized = sanitizeFilename(originalFilename)
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(7)

  if (prefix) {
    return `${prefix}/${timestamp}-${random}-${sanitized}`
  }

  return `${timestamp}-${random}-${sanitized}`
}

/**
 * Check if file is an image
 *
 * @param file - File to check
 * @returns true if file is an image
 */
export function isImageFile(file: File): boolean {
  return ALLOWED_IMAGE_TYPES.includes(file.type)
}

/**
 * Check if file is a video
 *
 * @param file - File to check
 * @returns true if file is a video
 */
export function isVideoFile(file: File): boolean {
  return ALLOWED_VIDEO_TYPES.includes(file.type)
}

/**
 * Get media type from file
 *
 * @param file - File to check
 * @returns 'photo' or 'video'
 */
export function getMediaType(file: File): 'photo' | 'video' {
  return isVideoFile(file) ? 'video' : 'photo'
}
