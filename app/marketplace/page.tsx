'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Search,
  Filter,
  ShoppingCart,
  TrendingUp,
  Clock,
  DollarSign,
  MapPin,
  ChevronDown,
  Star,
  Heart,
  Loader2,
  FileText
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import type { MarketplaceListing } from '@/lib/marketplace/types'

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('')
  const [stateFilter, setStateFilter] = useState('all')
  const [countyFilter, setCountyFilter] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [listings, setListings] = useState<MarketplaceListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [savedListings, setSavedListings] = useState<Set<string>>(new Set())

  // Fetch listings
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()

        if (stateFilter !== 'all') {
          params.append('state', stateFilter)
        }

        if (countyFilter) {
          params.append('county', countyFilter)
        }

        if (sortBy) {
          params.append('sort', sortBy)
        }

        if (searchQuery) {
          params.append('query', searchQuery)
        }

        params.append('status', 'active')

        const response = await fetch(`/api/marketplace/listings?${params}`)

        if (!response.ok) {
          throw new Error('Failed to fetch listings')
        }

        const data = await response.json()
        setListings(data.listings || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching listings:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [stateFilter, countyFilter, sortBy, searchQuery])

  const handleSaveListing = async (listingId: string) => {
    // TODO: Implement save/unsave with user authentication
    const newSaved = new Set(savedListings)
    if (savedListings.has(listingId)) {
      newSaved.delete(listingId)
    } else {
      newSaved.add(listingId)
    }
    setSavedListings(newSaved)
  }

  const getDaysUntilRedemption = (listing: MarketplaceListing) => {
    // Try to parse from source_metadata first
    if (listing.source_metadata?.redemption_deadline) {
      const deadlineDate = new Date(listing.source_metadata.redemption_deadline)
      const today = new Date()
      const diffTime = deadlineDate.getTime() - today.getTime()
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    // Fallback: estimate based on redemption_period
    if (listing.redemption_period) {
      const years = parseInt(listing.redemption_period)
      return years * 365 // Rough estimate
    }

    return null
  }

  const getListingPrice = (listing: MarketplaceListing) => {
    return listing.buy_now_price || listing.starting_bid || 0
  }

  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />

      <div className="pt-20 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-gold-500/10 border border-gold-500/30 rounded-full px-4 py-2 mb-6">
              <ShoppingCart className="w-4 h-4 text-gold-400" />
              <span className="text-sm text-gold-400 font-semibold">Secondary Market</span>
            </div>
            <h1 className="page-header mb-4">Tax Lien & Deed Marketplace</h1>
            <p className="text-xl text-gray-300">
              Buy and sell tax liens and tax deeds with other investors. Instant liquidity for your portfolio.
            </p>
          </div>

          {/* Stats Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <div className="text-xs text-gray-400 mb-1">Active Listings</div>
              <div className="text-2xl font-bold text-emerald-400">
                {listings.length.toLocaleString()}
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-gray-400 mb-1">Avg Price</div>
              <div className="text-2xl font-bold text-gold-400">
                ${listings.length > 0
                  ? (listings.reduce((sum, l) => sum + getListingPrice(l), 0) / listings.length).toLocaleString(undefined, { maximumFractionDigits: 0 })
                  : '—'}
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-gray-400 mb-1">States</div>
              <div className="text-2xl font-bold text-emerald-400">
                {new Set(listings.map(l => l.state)).size}
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-gray-400 mb-1">Counties</div>
              <div className="text-2xl font-bold">
                {new Set(listings.map(l => l.county)).size}
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by address, county, or parcel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-glass pl-10 w-full"
                />
              </div>

              <div className="relative">
                <select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="input-glass w-full appearance-none pr-10"
                >
                  <option value="all">All States</option>
                  <option value="FL">Florida</option>
                  <option value="AZ">Arizona</option>
                  <option value="IA">Iowa</option>
                  <option value="IL">Illinois</option>
                  <option value="IN">Indiana</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter by county..."
                  value={countyFilter}
                  onChange={(e) => setCountyFilter(e.target.value)}
                  className="input-glass w-full"
                />
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-glass w-full appearance-none pr-10"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="auction_date">Auction Date</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </Card>

          {/* How It Works */}
          <Card className="p-6 mb-8 bg-emerald-500/5 border-emerald-500/20">
            <h3 className="font-bold mb-3">💡 How the Marketplace Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
              <div>
                <strong className="text-emerald-400">1. Browse Listings</strong>
                <p className="text-xs text-gray-400 mt-1">Find liens and deeds that match your investment criteria</p>
              </div>
              <div>
                <strong className="text-emerald-400">2. Purchase or Bid</strong>
                <p className="text-xs text-gray-400 mt-1">Buy instantly or place bids on auction listings</p>
              </div>
              <div>
                <strong className="text-emerald-400">3. Assignment Process</strong>
                <p className="text-xs text-gray-400 mt-1">We handle the legal assignment paperwork with the county</p>
              </div>
            </div>
          </Card>

          {/* Loading & Error States */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
              <span className="ml-3 text-gray-400">Loading listings...</span>
            </div>
          )}

          {error && (
            <Card className="p-8 text-center bg-red-500/10 border-red-500/20">
              <p className="text-red-400">Error: {error}</p>
              <Button
                variant="secondary"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </Card>
          )}

          {/* Marketplace Listings */}
          {!loading && !error && (
            <div className="space-y-4">
              {listings.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-gray-400 text-lg">No listings found matching your criteria.</p>
                  <p className="text-sm text-gray-500 mt-2">Try adjusting your filters or search.</p>
                </Card>
              ) : (
                listings.map((listing) => {
                  const price = getListingPrice(listing)
                  const daysRemaining = getDaysUntilRedemption(listing)
                  const isSaved = savedListings.has(listing.id)

                  return (
                    <Card key={listing.id} hover className="p-6 relative overflow-hidden">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Property Info */}
                        <div className="lg:col-span-4">
                          <div className="flex items-start space-x-3 mb-3">
                            <div className="bg-emerald-500/20 p-2 rounded-lg">
                              <MapPin className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-lg mb-1">{listing.property_address}</h3>
                              <p className="text-sm text-gray-400">{listing.county}, {listing.state}</p>
                              <p className="text-xs text-gray-500 mt-1">Parcel: {listing.parcel_apn}</p>
                            </div>
                          </div>

                          <Badge variant={listing.listing_type === 'tax_lien' ? 'emerald' : 'gold'} className="text-xs">
                            {listing.listing_type === 'tax_lien' ? 'Tax Lien' : 'Tax Deed'}
                          </Badge>
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

                          {listing.estimated_value && (
                            <div>
                              <div className="text-xs text-gray-400 mb-1">Estimated Value</div>
                              <div className="text-sm font-semibold">
                                ${listing.estimated_value.toLocaleString()}
                              </div>
                            </div>
                          )}

                          {listing.current_bid && (
                            <div>
                              <div className="text-xs text-gray-400 mb-1">Current Bid</div>
                              <div className="text-sm font-semibold text-emerald-400">
                                ${listing.current_bid.toLocaleString()}
                              </div>
                            </div>
                          )}

                          {listing.redemption_period && (
                            <div>
                              <div className="text-xs text-gray-400 mb-1">Redemption</div>
                              <div className="text-sm font-semibold">
                                {listing.redemption_period}
                              </div>
                            </div>
                          )}

                          {daysRemaining && (
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

                          {listing.auction_date_time && (
                            <div>
                              <div className="text-xs text-gray-400 mb-1">Auction Date</div>
                              <div className="text-sm font-semibold">
                                {new Date(listing.auction_date_time).toLocaleDateString()}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="lg:col-span-3 flex flex-col justify-between space-y-3">
                          <div className="space-y-2">
                            {listing.buy_now_price ? (
                              <Button variant="primary" className="w-full" asChild>
                                <Link href={`/marketplace/${listing.id}`}>
                                  <ShoppingCart className="w-4 h-4 mr-2" />
                                  Buy Now
                                </Link>
                              </Button>
                            ) : (
                              <Button variant="primary" className="w-full" asChild>
                                <Link href={`/marketplace/${listing.id}`}>
                                  <DollarSign className="w-4 h-4 mr-2" />
                                  Place Bid
                                </Link>
                              </Button>
                            )}
                            <Button variant="secondary" size="sm" className="w-full" asChild>
                              <Link href={`/marketplace/${listing.id}`}>
                                <FileText className="w-4 h-4 mr-2" />
                                View Details
                              </Link>
                            </Button>
                          </div>

                          <div className="text-xs text-gray-500">
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              Listed {new Date(listing.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Notes Preview */}
                      {listing.notes && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <p className="text-sm text-gray-400 line-clamp-2">
                            {listing.notes}
                          </p>
                        </div>
                      )}
                    </Card>
                  )
                })}
              </div>
            )}
          </div>

          {/* Want to Sell CTA */}
          <Card className="p-8 mt-12 text-center bg-gradient-to-br from-emerald-500/10 to-gold-500/10 border-emerald-500/20">
            <h2 className="text-2xl font-bold mb-3">Want to Sell Your Tax Liens or Deeds?</h2>
            <p className="text-gray-300 mb-6">
              List your investments on the marketplace and get instant liquidity. No waiting for redemption.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Button variant="primary" size="lg" asChild>
                <Link href="/marketplace/seller/listings/new">
                  List Your Investments
                </Link>
              </Button>
              <Button variant="secondary" size="lg">
                Learn More
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              5% marketplace fee · Instant payments · Legal assignment handled
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
