'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Heart,
  MapPin,
  DollarSign,
  Clock,
  Trash2,
  Loader2,
  ShoppingCart,
  FileText,
  AlertCircle
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import type { MarketplaceListing, SavedListing } from '@/lib/marketplace/types'

interface SavedListingWithDetails extends SavedListing {
  listing: MarketplaceListing | null
}

export default function SavedListings() {
  const [saved, setSaved] = useState<SavedListingWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSavedListings()
  }, [])

  const fetchSavedListings = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/marketplace/saved')

      if (!response.ok) {
        if (response.status === 401) {
          setError('Please log in to view saved listings')
        } else {
          throw new Error('Failed to fetch saved listings')
        }
        return
      }

      const data = await response.json()
      setSaved(data.saved || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleUnsave = async (listingId: string) => {
    try {
      const response = await fetch(`/api/marketplace/listings/${listingId}/save`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to unsave listing')
      }

      // Remove from list
      setSaved(saved.filter(item => item.listing?.id !== listingId))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to unsave listing')
    }
  }

  const getListingPrice = (listing: MarketplaceListing) => {
    return listing.buy_now_price || listing.starting_bid || 0
  }

  const getDaysUntilRedemption = (listing: MarketplaceListing) => {
    if (listing.source_metadata?.redemption_deadline) {
      const deadlineDate = new Date(listing.source_metadata.redemption_deadline)
      const today = new Date()
      const diffTime = deadlineDate.getTime() - today.getTime()
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }
    return null
  }

  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />

      <div className="pt-20 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-2 mb-6">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400 font-semibold">Saved Listings</span>
            </div>
            <h1 className="page-header mb-4">Your Saved Listings</h1>
            <p className="text-xl text-gray-300">
              Tax liens and deeds you've saved for later review. Track price changes and availability.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
              <span className="ml-3 text-gray-400">Loading saved listings...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="p-12 text-center bg-red-500/10 border-red-500/20">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <p className="text-red-400 text-lg mb-4">{error}</p>
              <Button variant="secondary" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </Card>
          )}

          {/* Saved Listings */}
          {!loading && !error && (
            <>
              {saved.length === 0 ? (
                <Card className="p-12 text-center">
                  <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">No Saved Listings</h2>
                  <p className="text-gray-400 mb-6">
                    You haven't saved any listings yet. Browse the marketplace to find opportunities.
                  </p>
                  <Button variant="primary">
                    <Link href="/marketplace">
                      Browse Marketplace
                    </Link>
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-400">
                      {saved.length} {saved.length === 1 ? 'listing' : 'listings'} saved
                    </p>
                  </div>

                  {saved.map((item) => {
                    if (!item.listing) return null

                    const listing = item.listing
                    const price = getListingPrice(listing)
                    const daysRemaining = getDaysUntilRedemption(listing)

                    return (
                      <Card key={item.id} hover className="p-6 relative">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                          {/* Property Info */}
                          <div className="lg:col-span-4">
                            <div className="flex items-start space-x-3">
                              <div className="bg-emerald-500/20 p-2 rounded-lg">
                                <MapPin className="w-5 h-5 text-emerald-400" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-bold text-lg mb-1">{listing.property_address}</h3>
                                <p className="text-sm text-gray-400">{listing.county}, {listing.state}</p>
                                <p className="text-xs text-gray-500 mt-1">Parcel: {listing.parcel_apn}</p>
                              </div>
                            </div>

                            <div className="mt-3">
                              <Badge variant={listing.listing_type === 'tax_lien' ? 'emerald' : 'gold'} className="text-xs">
                                {listing.listing_type === 'tax_lien' ? 'Tax Lien' : 'Tax Deed'}
                              </Badge>
                            </div>
                          </div>

                          {/* Metrics */}
                          <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                              <div className="text-xs text-gray-400 mb-1">
                                {listing.buy_now_price ? 'Buy Now' : 'Starting Bid'}
                              </div>
                              <div className="text-lg font-bold text-gold-400">
                                ${price.toLocaleString()}
                              </div>
                            </div>

                            {listing.current_bid && (
                              <div>
                                <div className="text-xs text-gray-400 mb-1">Current Bid</div>
                                <div className="text-sm font-semibold text-emerald-400">
                                  ${listing.current_bid.toLocaleString()}
                                </div>
                              </div>
                            )}

                            {listing.estimated_value && (
                              <div>
                                <div className="text-xs text-gray-400 mb-1">Estimated Value</div>
                                <div className="text-sm font-semibold">
                                  ${listing.estimated_value.toLocaleString()}
                                </div>
                              </div>
                            )}

                            {daysRemaining !== null && (
                              <div>
                                <div className="text-xs text-gray-400 mb-1">Days Left</div>
                                <Badge
                                  variant={daysRemaining < 180 ? 'red' : daysRemaining < 365 ? 'gold' : 'emerald'}
                                  className="text-xs"
                                >
                                  {daysRemaining} days
                                </Badge>
                              </div>
                            )}

                            <div>
                              <div className="text-xs text-gray-400 mb-1">Status</div>
                              <Badge variant={listing.status === 'active' ? 'emerald' : 'gray'} className="text-xs capitalize">
                                {listing.status}
                              </Badge>
                            </div>

                            <div>
                              <div className="text-xs text-gray-400 mb-1">Saved</div>
                              <div className="text-xs text-gray-500">
                                {new Date(item.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="lg:col-span-3 flex flex-col justify-between space-y-2">
                            <div className="space-y-2">
                              <Button variant="primary" size="sm" className="w-full">
                                <Link href={`/marketplace/${listing.id}`}>
                                  <FileText className="w-4 h-4 mr-2" />
                                  View Details
                                </Link>
                              </Button>
                              {listing.status === 'active' && listing.buy_now_price && (
                                <Button variant="secondary" size="sm" className="w-full">
                                  <Link href={`/marketplace/${listing.id}`}>
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    Buy Now
                                  </Link>
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-red-400 hover:bg-red-500/10"
                                onClick={() => handleUnsave(listing.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
