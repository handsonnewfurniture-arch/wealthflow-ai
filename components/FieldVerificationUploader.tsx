/**
 * Field Verification Uploader
 * Contributors upload photos/videos from property locations
 */

'use client'

import { useState, useCallback } from 'react'
import { Upload, MapPin, Calendar, Camera, Video, X, AlertCircle, CheckCircle } from 'lucide-react'
import Button from './ui/Button'
import Card from './ui/Card'

interface FieldVerificationUploaderProps {
  listingId: string
  onUploadComplete?: () => void
}

interface UploadFile {
  file: File
  preview: string
  type: 'photo' | 'video'
}

export default function FieldVerificationUploader({
  listingId,
  onUploadComplete
}: FieldVerificationUploaderProps) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [warnings, setWarnings] = useState<string[]>([])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    addFiles(selectedFiles)
  }, [])

  const addFiles = (newFiles: File[]) => {
    const uploadFiles: UploadFile[] = newFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'photo'
    }))

    setFiles(prev => [...prev, ...uploadFiles])
    setError(null)
  }

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev]
      URL.revokeObjectURL(newFiles[index].preview)
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)
    addFiles(droppedFiles)
  }, [])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select at least one photo')
      return
    }

    const photos = files.filter(f => f.type === 'photo')
    if (photos.length === 0) {
      setError('At least one photo is required (videos are optional)')
      return
    }

    setUploading(true)
    setError(null)
    setWarnings([])

    try {
      const formData = new FormData()

      // Add photos
      photos.forEach(({ file }) => {
        formData.append('photos', file)
      })

      // Add videos
      files.filter(f => f.type === 'video').forEach(({ file }) => {
        formData.append('videos', file)
      })

      const response = await fetch(`/api/marketplace/listings/${listingId}/field-verification`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setSuccess(true)
      setWarnings(data.verification?.warnings || [])
      setFiles([])

      if (onUploadComplete) {
        onUploadComplete()
      }

    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const photoCount = files.filter(f => f.type === 'photo').length
  const videoCount = files.filter(f => f.type === 'video').length

  if (success) {
    return (
      <Card className="p-8 text-center">
        <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-3">Verification Submitted!</h3>
        <p className="text-gray-300 mb-4">
          Your field verification is under review. You'll earn <span className="text-gold-400 font-semibold">7 days of Pro access</span> when approved!
        </p>

        {warnings.length > 0 && (
          <Card className="p-4 bg-yellow-500/10 border-yellow-500/20 mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="font-semibold text-yellow-400 mb-2">Verification Warnings:</p>
                <ul className="text-sm text-yellow-200 space-y-1">
                  {warnings.map((warning, i) => (
                    <li key={i}>• {warning}</li>
                  ))}
                </ul>
                <p className="text-xs text-yellow-300 mt-2">
                  Admin will manually review these issues. Your submission may still be approved.
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="text-sm text-gray-400 space-y-2">
          <p>✓ GPS location extracted from photos</p>
          <p>✓ Timestamp verified</p>
          <p>✓ Admin will review within 24 hours</p>
        </div>

        <Button
          variant="ghost"
          onClick={() => setSuccess(false)}
          className="mt-6"
        >
          Upload Another Property
        </Button>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Upload Field Verification</h3>
        <p className="text-gray-400 text-sm">
          Visit the property, take photos/videos, and earn <span className="text-gold-400 font-semibold">7 days of Pro access!</span>
        </p>
      </div>

      {/* Requirements */}
      <Card className="p-4 bg-blue-500/10 border-blue-500/20 mb-6">
        <h4 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Requirements for Approval
        </h4>
        <ul className="text-sm text-gray-300 space-y-2">
          <li className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>Photos must be taken <strong>at the property location</strong> (GPS verified within 100ft)</span>
          </li>
          <li className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>Photos must be <strong>recent</strong> (within last 30 days)</span>
          </li>
          <li className="flex items-start gap-2">
            <Camera className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>Include <strong>street address</strong> visible in at least one photo</span>
          </li>
        </ul>
      </Card>

      {/* Drag-drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-600 hover:border-emerald-400 rounded-xl p-8 text-center transition-colors cursor-pointer mb-4"
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-semibold mb-2">Drop photos & videos here</p>
        <p className="text-sm text-gray-400 mb-4">or click to browse</p>
        <input
          id="file-input"
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <p className="text-xs text-gray-500">
          Max 10 photos, 3 videos • Photos must have GPS metadata
        </p>
      </div>

      {/* File preview */}
      {files.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">
              {photoCount} {photoCount === 1 ? 'photo' : 'photos'}
              {videoCount > 0 && `, ${videoCount} ${videoCount === 1 ? 'video' : 'videos'}`}
            </p>
            <button
              onClick={() => setFiles([])}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-navy-800">
                  {file.type === 'photo' ? (
                    <img
                      src={file.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(index)
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <Card className="p-4 bg-red-500/10 border-red-500/20 mb-4">
          <p className="text-red-400 text-sm">{error}</p>
        </Card>
      )}

      {/* Upload button */}
      <Button
        onClick={handleUpload}
        disabled={uploading || files.length === 0}
        variant="primary"
        className="w-full"
      >
        {uploading ? 'Uploading...' : 'Submit Verification'}
      </Button>

      <p className="text-xs text-gray-500 text-center mt-4">
        First contributor gets exclusive access. One verification per property.
      </p>
    </Card>
  )
}
