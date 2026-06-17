/**
 * Field Verification Gallery
 * Displays contributor-uploaded field photos/videos with access control
 */

'use client'

import { useState, useEffect } from 'react'
import { MapPin, Calendar, Lock, Star, CheckCircle, Clock, Eye } from 'lucide-react'
import Card from './ui/Card'
import Badge from './ui/Badge'
import Button from './ui/Button'

interface FieldVerificationGalleryProps {
  listingId: string
}

interface Verification {
  id: string
  status: string
  photoUrls: string[]
  videoUrls: string[]
  uploadedAt: string
  approvedAt: string | null
  exclusivityExpiresAt: string | null
  contributor: {
    id: string
    name: string
    isYou: boolean
  }
  gps: {
    latitude: number
    longitude: number
    distanceFromProperty: number
  } | null
  photoTimestamp: string | null
}

export default function FieldVerificationGallery({ listingId }: FieldVerificationGalleryProps) {
  const [verification, setVerification] = useState<Verification | null>(null)
  const [canView, setCanView] = useState(false)
  const [loading, setLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchVerification()
  }, [listingId])

  const fetchVerification = async () => {
    try {
      const response = await fetch(`/api/marketplace/listings/${listingId}/field-verification`)
      const data = await response.json()

      if (!data.exists) {
        // No verification for this property
        setVerification(null)
        setCanView(false)
        setMessage(null)
      } else if (!data.canView) {
        // Verification exists but user can't view
        setVerification(null)
        setCanView(false)
        setMessage(data.message || 'Field verification is in exclusivity period')
      } else {
        // User can view verification
        setVerification(data.verification)
        setCanView(true)
        setMessage(null)
      }
    } catch (error) {
      console.error('Failed to fetch verification:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-700 rounded"></div>
        </div>
      </Card>
    )
  }

  // No verification exists
  if (!verification && !message) {
    return (
      <Card className="p-6 text-center">
        <MapPin className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Field Verification Yet</h3>
        <p className="text-gray-400 text-sm mb-4">
          Be the first to verify this property! Visit the location, take photos, and earn <span className="text-gold-400 font-semibold">7 days of Pro access</span>.
        </p>
        <Badge variant="gold" className="inline-flex items-center gap-1">
          <Star className="w-4 h-4" />
          First Contributor Reward
        </Badge>
      </Card>
    )
  }

  // Verification exists but user can't view
  if (!canView && message) {
    const isExclusivity = message.includes('exclusivity')
    const isPending = message.includes('pending')

    return (
      <Card className="p-6 text-center">
        <Lock className="w-12 h-12 text-gold-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          {isPending ? 'Verification Pending Review' : 'Exclusive Content'}
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          {message}
        </p>
        {isExclusivity && (
          <>
            <p className="text-sm text-gray-500 mb-4">
              This content will be available to Pro/Elite users after the contributor's 3-day exclusive access period.
            </p>
            <Button variant="primary" size="sm">
              Upgrade to Pro
            </Button>
          </>
        )}
      </Card>
    )
  }

  // User can view verification
  if (!verification) return null

  const allMedia = [
    ...verification.photoUrls.map(url => ({ type: 'photo' as const, url })),
    ...verification.videoUrls.map(url => ({ type: 'video' as const, url }))
  ]

  const isExclusivePeriod = verification.exclusivityExpiresAt &&
    new Date(verification.exclusivityExpiresAt) > new Date()

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">Field Verification</h3>
              {verification.status === 'approved' && (
                <Badge variant="emerald" className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </Badge>
              )}
              {verification.contributor.isYou && (
                <Badge variant="gold">Your Contribution</Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>Verified by {verification.contributor.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(verification.uploadedAt).toLocaleDateString()}</span>
              </div>
            </div>

            {verification.gps && (
              <div className="flex items-center gap-1 text-sm text-emerald-400 mt-2">
                <MapPin className="w-4 h-4" />
                <span>{verification.gps.distanceFromProperty}ft from property</span>
              </div>
            )}
          </div>

          {isExclusivePeriod && verification.contributor.isYou && (
            <Badge variant="gold" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Exclusive Access
            </Badge>
          )}
        </div>
      </Card>

      {/* Media Gallery */}
      <Card className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {allMedia.map((media, index) => (
            <div
              key={index}
              className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity bg-navy-800"
              onClick={() => setLightboxIndex(index)}
            >
              {media.type === 'photo' ? (
                <img
                  src={media.url}
                  alt={`Field verification ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={media.url}
                  className="w-full h-full object-cover"
                  controls
                />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
            onClick={() => setLightboxIndex(null)}
          >
            ✕
          </button>

          <div className="max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            {allMedia[lightboxIndex].type === 'photo' ? (
              <img
                src={allMedia[lightboxIndex].url}
                alt={`Full size ${lightboxIndex + 1}`}
                className="max-w-full max-h-screen object-contain"
              />
            ) : (
              <video
                src={allMedia[lightboxIndex].url}
                className="max-w-full max-h-screen"
                controls
                autoPlay
              />
            )}
          </div>

          {/* Navigation */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {lightboxIndex > 0 && (
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxIndex(lightboxIndex - 1)
                }}
                variant="ghost"
              >
                ← Previous
              </Button>
            )}
            <span className="text-white px-4 py-2">
              {lightboxIndex + 1} / {allMedia.length}
            </span>
            {lightboxIndex < allMedia.length - 1 && (
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxIndex(lightboxIndex + 1)
                }}
                variant="ghost"
              >
                Next →
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
