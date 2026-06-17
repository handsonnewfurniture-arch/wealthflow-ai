/**
 * MediaUploader Component
 *
 * Drag-and-drop file upload component for images and videos
 * Supports multiple files, client-side validation, and progress tracking
 */

'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Video, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import Button from './ui/Button'
import { validateMediaFile, formatFileSize, MAX_FILES_PER_UPLOAD } from '@/lib/marketplace/upload-validation'

interface MediaUploaderProps {
  /** Listing ID to upload media for */
  listingId: string
  /** Callback when upload completes */
  onUploadComplete?: () => void
  /** Maximum number of files (default: 10) */
  maxFiles?: number
  /** Accepted file types (default: images and videos) */
  accept?: string
  /** Upload type: 'media' or 'document' */
  type?: 'media' | 'document'
}

interface UploadFile {
  file: File
  id: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  error?: string
  preview?: string
}

export default function MediaUploader({
  listingId,
  onUploadComplete,
  maxFiles = MAX_FILES_PER_UPLOAD,
  accept = 'image/*,video/*',
  type = 'media'
}: MediaUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<UploadFile[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  // Handle drop event
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    addFiles(droppedFiles)
  }, [files])

  // Handle file input change
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      addFiles(selectedFiles)
    }
  }

  // Add files to upload queue
  const addFiles = (newFiles: File[]) => {
    // Check total file count
    if (files.length + newFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed. Please remove some files first.`)
      return
    }

    // Validate and add files
    const validatedFiles: UploadFile[] = []

    for (const file of newFiles) {
      const validation = validateMediaFile(file)

      if (!validation.valid) {
        alert(`${file.name}: ${validation.error}`)
        continue
      }

      // Create preview for images
      let preview: string | undefined
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file)
      }

      validatedFiles.push({
        file,
        id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
        status: 'pending',
        progress: 0,
        preview
      })
    }

    setFiles(prev => [...prev, ...validatedFiles])
  }

  // Remove file from queue
  const removeFile = (id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id)
      if (file?.preview) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter(f => f.id !== id)
    })
  }

  // Upload single file
  const uploadFile = async (uploadFile: UploadFile): Promise<void> => {
    const formData = new FormData()
    formData.append('file', uploadFile.file)
    formData.append('alt_text', uploadFile.file.name)

    // Update status to uploading
    setFiles(prev => prev.map(f =>
      f.id === uploadFile.id ? { ...f, status: 'uploading' as const, progress: 0 } : f
    ))

    try {
      const endpoint = type === 'media'
        ? `/api/marketplace/listings/${listingId}/media`
        : `/api/marketplace/listings/${listingId}/documents`

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      // Mark as success
      setFiles(prev => prev.map(f =>
        f.id === uploadFile.id ? { ...f, status: 'success' as const, progress: 100 } : f
      ))

    } catch (error: any) {
      console.error('Upload error:', error)

      // Mark as error
      setFiles(prev => prev.map(f =>
        f.id === uploadFile.id
          ? { ...f, status: 'error' as const, error: error.message }
          : f
      ))
    }
  }

  // Upload all pending files
  const handleUploadAll = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending')

    if (pendingFiles.length === 0) {
      alert('No files to upload')
      return
    }

    setUploading(true)

    // Upload files sequentially
    for (const file of pendingFiles) {
      await uploadFile(file)
    }

    setUploading(false)

    // Check if all successful
    const allSuccess = files.every(f => f.status === 'success' || f.status === 'pending')
    if (allSuccess && onUploadComplete) {
      onUploadComplete()
    }
  }

  // Clear completed files
  const clearCompleted = () => {
    setFiles(prev => {
      prev.forEach(f => {
        if (f.preview && (f.status === 'success' || f.status === 'error')) {
          URL.revokeObjectURL(f.preview)
        }
      })
      return prev.filter(f => f.status === 'pending' || f.status === 'uploading')
    })
  }

  // Get status counts
  const counts = {
    pending: files.filter(f => f.status === 'pending').length,
    uploading: files.filter(f => f.status === 'uploading').length,
    success: files.filter(f => f.status === 'success').length,
    error: files.filter(f => f.status === 'error').length
  }

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all
          ${dragActive
            ? 'border-emerald-400 bg-emerald-400/10 scale-[1.02]'
            : 'border-white/20 hover:border-white/30 hover:bg-white/5'
          }
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          id="file-upload"
          className="hidden"
          multiple
          accept={accept}
          onChange={handleFileInput}
          disabled={uploading}
        />

        <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors ${dragActive ? 'text-emerald-400' : 'text-gray-400'}`} />

        <h3 className="text-lg font-semibold mb-2">
          {dragActive ? 'Drop files here' : 'Upload Media Files'}
        </h3>

        <p className="text-sm text-gray-400 mb-4">
          Drag and drop files here, or click to browse
        </p>

        <Button
          variant="secondary"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          Select Files
        </Button>

        <p className="text-xs text-gray-500 mt-4">
          Max {maxFiles} files • Images up to 10MB • Videos up to 50MB
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm text-gray-300">
              Files ({files.length}/{maxFiles})
            </h4>
            <div className="flex items-center gap-2">
              {counts.success > 0 && (
                <Button variant="ghost" size="sm" onClick={clearCompleted}>
                  Clear Completed
                </Button>
              )}
              {counts.pending > 0 && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleUploadAll}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    `Upload ${counts.pending} File${counts.pending > 1 ? 's' : ''}`
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* File Items */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {files.map((uploadFile) => (
              <div
                key={uploadFile.id}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
              >
                {/* Preview/Icon */}
                <div className="w-12 h-12 flex-shrink-0 rounded bg-navy-800 flex items-center justify-center overflow-hidden">
                  {uploadFile.preview ? (
                    <img
                      src={uploadFile.preview}
                      alt={uploadFile.file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : uploadFile.file.type.startsWith('video/') ? (
                    <Video className="w-6 h-6 text-blue-400" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-emerald-400" />
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{uploadFile.file.name}</p>
                  <p className="text-xs text-gray-400">
                    {formatFileSize(uploadFile.file.size)}
                    {uploadFile.status === 'error' && uploadFile.error && (
                      <span className="text-red-400 ml-2">• {uploadFile.error}</span>
                    )}
                  </p>

                  {/* Progress Bar */}
                  {uploadFile.status === 'uploading' && (
                    <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 transition-all duration-300"
                        style={{ width: `${uploadFile.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {uploadFile.status === 'pending' && (
                    <button
                      onClick={() => removeFile(uploadFile.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                  {uploadFile.status === 'uploading' && (
                    <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                  )}
                  {uploadFile.status === 'success' && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  )}
                  {uploadFile.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Status Summary */}
          {(counts.success > 0 || counts.error > 0) && (
            <div className="flex items-center gap-4 text-sm pt-2 border-t border-white/10">
              {counts.success > 0 && (
                <span className="text-emerald-400">
                  ✓ {counts.success} uploaded
                </span>
              )}
              {counts.error > 0 && (
                <span className="text-red-400">
                  ✗ {counts.error} failed
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
