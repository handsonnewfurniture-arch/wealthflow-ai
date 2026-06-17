'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  TrendingUp,
  FileText,
  AlertTriangle,
  Heart,
  Share2,
  Gavel,
  ShoppingCart,
  Loader2,
  Info
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import MediaGallery from '@/components/MediaGallery'
import type { MarketplaceListing } from '@/lib/marketplace/types'
import { LEGAL_DISCLAIMER } from '@/lib/marketplace/constants'

export default function ListingDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [listing, setListing] = useState<MarketplaceListing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bidAmount, setBidAmount] = useState('')
  const [bidding, setBidding] = useState(false)
  const [purchasing, setPurchasing] = useState(false)
  const [saved, setSaved] = useState(false)

  // Fetch listing
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/marketplace/listings/${params.id}`)

        if (!response.ok) {
          if (response.status === 404) {
            setError('Listing not found')
          } else {
            setError('Failed to load listing')
          }
          return
        }

        const data = await response.json()
        setListing(data)

        // Set initial bid amount if auction
        if (data.current_bid) {
          setBidAmount((data.current_bid + 100).toString())
        } else if (data.starting_bid) {
          setBidAmount(data.starting_bid.toString())
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchListing()
  }, [params.id])

  const handlePlaceBid = async () => {
    if (!listing || !bidAmount) return

    setBidding(true)
    try {
      const response = await fetch(`/api/marketplace/listings/${listing.id}/bid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bid_amount: parseFloat(bidAmount) })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to place bid')
      }

      // Refresh listing to show new bid
      const refreshResponse = await fetch(`/api/marketplace/listings/${params.id}`)
      const refreshedListing = await refreshResponse.json()
      setListing(refreshedListing)

      alert('Bid placed successfully!')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to place bid')
    } finally {
      setBidding(false)
    }
  }

  const handlePurchase = async () => {
    if (!listing) return

    if (!confirm(`Confirm purchase of ${listing.property_address} for $${listing.buy_now_price?.toLocaleString()}?`)) {
      return
    }

    setPurchasing(true)
    try {
      const response = await fetch(`/api/marketplace/listings/${listing.id}/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to purchase')
      }

      const purchase = await response.json()

      // Redirect to purchase tracker
      router.push(`/marketplace/tracker?highlight=${purchase.id}`)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to complete purchase')
    } finally {
      setPurchasing(false)
    }
  }

  const handleSave = async () => {
    if (!listing) return

    try {
      const method = saved ? 'DELETE' : 'POST'
      const response = await fetch(`/api/marketplace/listings/${listing.id}/save`, {
        method
      })

      if (!response.ok) {
        throw new Error('Failed to save listing')
      }

      setSaved(!saved)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save listing')
    }
  }

  const getDaysUntilRedemption = () => {
    if (!listing) return null

    if (listing.source_metadata?.redemption_deadline) {
      const deadlineDate = new Date(listing.source_metadata.redemption_deadline)
      const today = new Date()
      const diffTime = deadlineDate.getTime() - today.getTime()
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <span className="ml-3 text-gray-400">Loading listing...</span>
        </div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-navy-950">
        <Navbar />
        <div className="pt-20 px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="p-12 text-center bg-red-500/10 border-red-500/20">
              <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Listing Not Found</h2>
              <p className="text-gray-400 mb-6">{error || 'This listing does not exist or has been removed.'}</p>
              <Link href="/marketplace">
                <Button variant="secondary">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Marketplace
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const daysRemaining = getDaysUntilRedemption()
  const isAuction = listing.starting_bid !== null && listing.buy_now_price === null
  const isBuyNow = listing.buy_now_price !== null

  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />

      <div className="pt-20 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link href="/marketplace">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketplace
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Badge variant={listing.listing_type === 'tax_lien' ? 'emerald' : 'gold'} className="mb-3">
                      {listing.listing_type === 'tax_lien' ? 'Tax Lien Certificate' : 'Tax Deed'}
                    </Badge>
                    <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
                    <div className="flex items-center text-gray-400 space-x-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {listing.county}, {listing.state}
                      </div>
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        {listing.parcel_apn}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={handleSave}>
                      <Heart className={`w-5 h-5 ${saved ? 'fill-red-400 text-red-400' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <h2 className="font-bold mb-2">{listing.property_address}</h2>
                  <p className="text-sm text-gray-400">Full property address as recorded in county records</p>
                </div>
              </Card>

              {/* Property Media Gallery */}
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">Property Media</h3>
                <MediaGallery listingId={params.id} />
              </Card>

              {/* Key Details */}
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">Investment Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {listing.buy_now_price && (
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Buy Now Price</div>
                      <div className="text-2xl font-bold text-gold-400">
                        ${listing.buy_now_price.toLocaleString()}
                      </div>
                    </div>
                  )}

                  {listing.starting_bid && (
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Starting Bid</div>
                      <div className="text-xl font-bold">
                        ${listing.starting_bid.toLocaleString()}
                      </div>
                    </div>
                  )}

                  {listing.current_bid && (
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Current Bid</div>
                      <div className="text-xl font-bold text-emerald-400">
                        ${listing.current_bid.toLocaleString()}
                      </div>
                    </div>
                  )}

                  {listing.estimated_value && (
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Estimated Property Value</div>
                      <div className="text-lg font-semibold">
                        ${listing.estimated_value.toLocaleString()}
                      </div>
                    </div>
                  )}

                  {listing.redemption_period && (
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Redemption Period</div>
                      <div className="text-lg font-semibold">
                        {listing.redemption_period}
                      </div>
                    </div>
                  )}

                  {daysRemaining !== null && (
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Days Until Redemption</div>
                      <Badge
                        variant={daysRemaining < 180 ? 'red' : daysRemaining < 365 ? 'gold' : 'emerald'}
                      >
                        {daysRemaining} days
                      </Badge>
                    </div>
                  )}

                  {listing.auction_date_time && (
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Original Auction Date</div>
                      <div className="text-sm font-semibold">
                        {new Date(listing.auction_date_time).toLocaleDateString()}
                      </div>
                    </div>
                  )}

                  {listing.auction_name && (
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Auction Name</div>
                      <div className="text-sm font-semibold">
                        {listing.auction_name}
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Notes */}
              {listing.notes && (
                <Card className="p-6">
                  <h3 className="font-bold text-lg mb-4">Additional Information</h3>
                  <div className="text-sm text-gray-300 whitespace-pre-line">
                    {listing.notes}
                  </div>
                </Card>
              )}

              {/* Source Metadata */}
              {listing.source_metadata && Object.keys(listing.source_metadata).length > 0 && (
                <Card className="p-6">
                  <h3 className="font-bold text-lg mb-4">Certificate Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {listing.source_metadata.certificate_number && (
                      <div>
                        <div className="text-xs text-gray-400">Certificate Number</div>
                        <div className="font-semibold">{listing.source_metadata.certificate_number}</div>
                      </div>
                    )}
                    {listing.source_metadata.original_face_value && (
                      <div>
                        <div className="text-xs text-gray-400">Original Face Value</div>
                        <div className="font-semibold">${Number(listing.source_metadata.original_face_value).toLocaleString()}</div>
                      </div>
                    )}
                    {listing.source_metadata.accrued_value && (
                      <div>
                        <div className="text-xs text-gray-400">Accrued Value</div>
                        <div className="font-semibold text-emerald-400">${Number(listing.source_metadata.accrued_value).toLocaleString()}</div>
                      </div>
                    )}
                    {listing.source_metadata.years_held && (
                      <div>
                        <div className="text-xs text-gray-400">Years Held</div>
                        <div className="font-semibold">{Number(listing.source_metadata.years_held).toFixed(2)} years</div>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Legal Disclaimer */}
              <Card className="p-6 bg-yellow-500/5 border-yellow-500/20">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-yellow-400 mb-2">Important Legal Disclaimer</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {listing.legal_disclaimer || LEGAL_DISCLAIMER}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar - Purchase/Bid Controls */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                {/* Buy Now */}
                {isBuyNow && (
                  <Card className="p-6">
                    <h3 className="font-bold mb-4">Purchase Instantly</h3>
                    <div className="mb-4">
                      <div className="text-sm text-gray-400 mb-1">Buy Now Price</div>
                      <div className="text-3xl font-bold text-gold-400">
                        ${listing.buy_now_price?.toLocaleString()}
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      className="w-full"
                      size="lg"
                      onClick={handlePurchase}
                      disabled={purchasing || listing.status !== 'active'}
                    >
                      {purchasing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          Buy Now
                        </>
                      )}
                    </Button>
                    {listing.status !== 'active' && (
                      <p className="text-xs text-red-400 mt-2 text-center">
                        This listing is no longer available
                      </p>
                    )}
                  </Card>
                )}

                {/* Bidding */}
                {isAuction && (
                  <Card className="p-6">
                    <h3 className="font-bold mb-4">Place Your Bid</h3>

                    {listing.current_bid && (
                      <div className="mb-4">
                        <div className="text-sm text-gray-400 mb-1">Current Bid</div>
                        <div className="text-2xl font-bold text-emerald-400">
                          ${listing.current_bid.toLocaleString()}
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <label className="text-sm text-gray-400 mb-2 block">Your Bid Amount</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          className="input-glass pl-10 w-full text-lg font-semibold"
                          placeholder="Enter bid amount"
                          min={listing.current_bid || listing.starting_bid || 0}
                          step="100"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Minimum bid: ${((listing.current_bid || listing.starting_bid || 0) + 1).toLocaleString()}
                      </p>
                    </div>

                    <Button
                      variant="primary"
                      className="w-full"
                      size="lg"
                      onClick={handlePlaceBid}
                      disabled={bidding || !bidAmount || listing.status !== 'active'}
                    >
                      {bidding ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Placing Bid...
                        </>
                      ) : (
                        <>
                          <Gavel className="w-5 h-5 mr-2" />
                          Place Bid
                        </>
                      )}
                    </Button>
                  </Card>
                )}

                {/* Listing Info */}
                <Card className="p-6">
                  <h3 className="font-bold mb-4">Listing Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status</span>
                      <Badge variant={listing.status === 'active' ? 'emerald' : 'gray'} className="capitalize">
                        {listing.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Listed</span>
                      <span>{new Date(listing.created_at).toLocaleDateString()}</span>
                    </div>
                    {listing.published_at && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Published</span>
                        <span>{new Date(listing.published_at).toLocaleDateString()}</span>
                      </div>
                    )}
                    {listing.source && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Source</span>
                        <span className="capitalize">{listing.source.replace('_', ' ')}</span>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Help */}
                <Card className="p-6 bg-blue-500/5 border-blue-500/20">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-blue-400 mb-2">Need Help?</h4>
                      <p className="text-sm text-gray-300 mb-3">
                        Questions about this listing or the purchase process?
                      </p>
                      <Button variant="secondary" size="sm" className="w-full">
                        Contact Support
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
