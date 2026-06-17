/**
 * MediaGallery Component
 *
 * Displays property media (photos and videos) with lightbox modal
 * Integrates with PremiumGate for subscription-based access control
 */

'use client'

import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, Lock, Play, Image as ImageIcon } from 'lucide-react'
import PremiumGate, { PremiumBadge } from './PremiumGate'
import Button from './ui/Button'
import Link from 'next/link'

interface MediaItem {
  id: string
  url: string
  alt_text: string | null
  media_type: string
  sort_order: number
  has_access: boolean
  requires_upgrade: boolean
  preview_only: boolean
}

interface MediaGalleryProps {
  /** Listing ID to fetch media for */
  listingId: string
  /** Show admin controls (delete button) */
  adminMode?: boolean
  /** Callback when media is deleted (admin only) */
  onMediaDeleted?: () => void
}

export default function MediaGallery({
  listingId,
  adminMode = false,
  onMediaDeleted
}: MediaGalleryProps) {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [userTier, setUserTier] = useState('free')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [isPremiumListing, setIsPremiumListing] = useState(false)

  // Fetch media
  useEffect(() => {
    fetchMedia()
  }, [listingId])

  const fetchMedia = async () => {
    try {
      const response = await fetch(`/api/marketplace/listings/${listingId}/media`)
      const data = await response.json()

      setMedia(data.media || [])
      setUserTier(data.user_tier || 'free')
      setIsPremiumListing(data.listing?.is_premium || false)
    } catch (error) {
      console.error('Failed to fetch media:', error)
    } finally {
      setLoading(false)
    }
  }

  // Delete media (admin only)
  const handleDelete = async (mediaId: string) => {
    if (!confirm('Are you sure you want to delete this media?')) return

    try {
      const response = await fetch(
        `/api/marketplace/listings/${listingId}/media?mediaId=${mediaId}`,
        { method: 'DELETE' }
      )

      if (response.ok) {
        await fetchMedia()
        if (onMediaDeleted) onMediaDeleted()
      } else {
        alert('Failed to delete media')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete media')
    }
  }

  // Open lightbox
  const openLightbox = (index: number) => {
    const item = media[index]
    if (!item.has_access && !adminMode) {
      // Don't open lightbox for locked content
      return
    }
    setLightboxIndex(index)
  }

  // Close lightbox
  const closeLightbox = () => {
    setLightboxIndex(null)
  }

  // Navigate lightbox
  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (lightboxIndex === null) return

    const newIndex = direction === 'prev'
      ? (lightboxIndex - 1 + media.length) % media.length
      : (lightboxIndex + 1) % media.length

    setLightboxIndex(newIndex)
  }

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="aspect-video bg-white/5 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  // Empty state
  if (media.length === 0) {
    return (
      <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
        <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-500" />
        <p className="text-gray-400">No media available for this property</p>
      </div>
    )
  }

  // Accessible media (what user can actually see)
  const accessibleMedia = media.filter(m => m.has_access || adminMode)
  const lockedCount = media.length - accessibleMedia.length

  return (
    <>
      {/* Gallery Grid */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item, index) => {
            const isLocked = !item.has_access && !adminMode
            const isVideo = item.media_type === 'video'

            return (
              <div
                key={item.id}
                className="relative aspect-video group cursor-pointer"
                onClick={() => !isLocked && openLightbox(index)}
              >
                {/* Media Item */}
                <div className={`
                  relative w-full h-full rounded-lg overflow-hidden bg-navy-800
                  ${isLocked ? 'blur-md' : ''}
                  ${!isLocked ? 'hover:ring-2 hover:ring-emerald-400 transition-all' : ''}
                `}>
                  {isVideo ? (
                    <div className="w-full h-full bg-gradient-to-br from-blue-900/50 to-purple-900/50 flex items-center justify-center">
                      <Play className="w-12 h-12 text-white/80" />
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={item.alt_text || 'Property image'}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Video Badge */}
                  {isVideo && !isLocked && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 rounded text-xs font-semibold text-white">
                      VIDEO
                    </div>
                  )}

                  {/* Hover Overlay */}
                  {!isLocked && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                </div>

                {/* Lock Overlay */}
                {isLocked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy-900/90 rounded-lg">
                    <Lock className="w-6 h-6 text-gold-400 mb-2" />
                    <PremiumBadge />
                  </div>
                )}

                {/* Admin Delete Button */}
                {adminMode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(item.id)
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-red-500/90 hover:bg-red-600 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* Premium Upsell Banner */}
        {lockedCount > 0 && !adminMode && (
          <div className="mt-6 p-4 bg-gradient-to-r from-gold-500/10 to-emerald-500/10 border border-gold-400/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-gold-400" />
                <div>
                  <p className="font-semibold text-white">
                    {lockedCount} more {lockedCount === 1 ? 'photo' : 'photos'} available
                  </p>
                  <p className="text-sm text-gray-400">
                    Upgrade to Pro to view all property media and documents
                  </p>
                </div>
              </div>
              <Link href="/pricing">
                <Button variant="primary" size="sm">
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Buttons */}
          {media.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigateLightbox('prev')
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigateLightbox('next')
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Media Content */}
          <div
            className="max-w-6xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {media[lightboxIndex].media_type === 'video' ? (
              <video
                src={media[lightboxIndex].url}
                controls
                autoPlay
                className="w-full h-full rounded-lg"
              />
            ) : (
              <img
                src={media[lightboxIndex].url}
                alt={media[lightboxIndex].alt_text || 'Property image'}
                className="w-full h-full object-contain rounded-lg"
              />
            )}

            {/* Caption */}
            {media[lightboxIndex].alt_text && (
              <p className="mt-4 text-center text-gray-300">
                {media[lightboxIndex].alt_text}
              </p>
            )}

            {/* Counter */}
            <p className="mt-2 text-center text-sm text-gray-500">
              {lightboxIndex + 1} / {media.length}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
