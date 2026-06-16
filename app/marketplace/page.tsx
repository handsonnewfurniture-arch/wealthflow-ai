'use client'

import { useState, useEffect } from 'react'
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
  Loader2
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import type { MarketplaceListing } from '@/lib/supabase'

interface MarketplaceStats {
  active_listings_count: number
  total_volume_30d: number
  avg_roi: number
  sales_24h: number
}

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('')
  const [stateFilter, setStateFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [listings, setListings] = useState<MarketplaceListing[]>([])
  const [stats, setStats] = useState<MarketplaceStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [savedListings, setSavedListings] = useState<Set<string>>(new Set())

  // Fetch marketplace stats
  useEffect(() => {
    fetch('/api/marketplace/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Failed to load stats:', err))
  }, [])

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

        if (sortBy) {
          params.append('sort', sortBy)
        }

        if (searchQuery) {
          params.append('search', searchQuery)
        }

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
  }, [stateFilter, sortBy, searchQuery])

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

  // Format listing for display
  const formatListing = (listing: MarketplaceListing) => {
    const profit = listing.current_value - listing.original_purchase_price
    const discount = ((listing.current_value - listing.asking_price) / listing.current_value) * 100
    const roi = (profit / listing.original_purchase_price) * 100

    return {
      ...listing,
      profit,
      discount,
      roi
    }
  }

  const getDaysUntilExpiration = (deadline: string) => {
    const deadlineDate = new Date(deadline)
    const today = new Date()
    const diffTime = deadlineDate.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
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
            <h1 className="page-header mb-4">Tax Lien Marketplace</h1>
            <p className="text-xl text-gray-300">
              Buy and sell tax liens with other investors. Instant liquidity for your portfolio.
            </p>
          </div>

          {/* Stats Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <div className="text-xs text-gray-400 mb-1">Active Listings</div>
              <div className="text-2xl font-bold text-emerald-400">
                {stats ? stats.active_listings_count.toLocaleString() : '—'}
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-gray-400 mb-1">Total Volume (30d)</div>
              <div className="text-2xl font-bold text-gold-400">
                {stats ? `$${(stats.total_volume_30d / 1000000).toFixed(1)}M` : '—'}
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-gray-400 mb-1">Avg ROI</div>
              <div className="text-2xl font-bold text-emerald-400">
                {stats ? `${stats.avg_roi.toFixed(1)}%` : '—'}
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-gray-400 mb-1">Sales (24h)</div>
              <div className="text-2xl font-bold">
                {stats ? stats.sales_24h : '—'}
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
                  placeholder="Search by address or county..."
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
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-glass w-full appearance-none pr-10"
                >
                  <option value="newest">Newest First</option>
                  <option value="roi">Highest ROI</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="expiring">Expiring Soon</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              <Button variant="secondary" className="flex items-center justify-center">
                <Filter className="w-5 h-5 mr-2" />
                More Filters
              </Button>
            </div>
          </Card>

          {/* How It Works */}
          <Card className="p-6 mb-8 bg-emerald-500/5 border-emerald-500/20">
            <h3 className="font-bold mb-3">💡 How the Marketplace Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
              <div>
                <strong className="text-emerald-400">1. Browse Listings</strong>
                <p className="text-xs text-gray-400 mt-1">Find liens that match your investment criteria and due diligence standards</p>
              </div>
              <div>
                <strong className="text-emerald-400">2. Purchase Instantly</strong>
                <p className="text-xs text-gray-400 mt-1">Buy liens from other investors at market prices with secure escrow</p>
              </div>
              <div>
                <strong className="text-emerald-400">3. Assignment Process</strong>
                <p className="text-xs text-gray-400 mt-1">We handle the legal assignment paperwork with the county treasurer</p>
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
                listings.map((listingData) => {
                  const listing = formatListing(listingData)
                  const daysRemaining = getDaysUntilExpiration(listing.redemption_deadline)
                  const isSaved = savedListings.has(listing.id)

                  return (
                    <Card key={listing.id} hover className="p-6 relative overflow-hidden">
                      {listing.featured && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-gradient-to-br from-gold-500 to-gold-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                        FEATURED
                      </div>
                    </div>
                  )}

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
                          <p className="text-xs text-gray-500 mt-1">Parcel: {listing.parcel_id}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mt-3">
                        <div className="flex items-center text-xs text-gray-400">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(listing.seller_name || 'Seller'_rating || 0)
                                    ? 'text-gold-400 fill-gold-400'
                                    : 'text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2">{listing.seller_name || 'Seller'_rating || 0} · {listing.seller_name || 'Seller'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Asking Price</div>
                        <div className="text-lg font-bold text-gold-400">
                          ${listing.asking_price.toLocaleString()}
                        </div>
                        {listing.discount > 0 && (
                          <div className="text-xs text-emerald-400">
                            {listing.discount.toFixed(1)}% below value
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="text-xs text-gray-400 mb-1">Current Value</div>
                        <div className="text-sm font-semibold">
                          ${listing.current_value.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          Orig: ${listing.original_purchase_price.toLocaleString()}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-400 mb-1">Interest Rate</div>
                        <div className="text-sm font-semibold text-gold-400">
                          {listing.interest_rate}%
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-400 mb-1">Days Held</div>
                        <div className="text-sm font-semibold">
                          {listing.days_held}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-400 mb-1">ROI at Purchase</div>
                        <div className="text-sm font-semibold text-emerald-400">
                          {listing.roi.toFixed(1)}%
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-400 mb-1">Expires In</div>
                        <Badge
                          variant={daysRemaining < 180 ? 'red' : daysRemaining < 365 ? 'gold' : 'emerald'}
                          className="text-xs"
                        >
                          {daysRemaining} days
                        </Badge>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:col-span-3 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <Button variant="primary" className="w-full">
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Buy Now
                        </Button>
                        <Button variant="secondary" size="sm" className="w-full">
                          View Details
                        </Button>
                      </div>

                      <div className="text-xs text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          Listed {new Date(listing.created_at.split('T')[0]).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Tags */}
                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="blue" className="text-xs capitalize">
                        {listing.property_type}
                      </Badge>
                      <Badge variant="gray" className="text-xs">
                        Assessed: ${(listing.assessed_value / 1000).toFixed(0)}k
                      </Badge>
                    </div>
                    <div className="text-xs text-emerald-400 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      ${listing.profit.toLocaleString()} seller profit
                    </div>
                  </div>
                </Card>
              )
            })}
            </div>
          )}

          {/* Want to Sell CTA */}
          <Card className="p-8 mt-12 text-center bg-gradient-to-br from-emerald-500/10 to-gold-500/10 border-emerald-500/20">
            <h2 className="text-2xl font-bold mb-3">Want to Sell Your Tax Liens?</h2>
            <p className="text-gray-300 mb-6">
              List your liens on the marketplace and get instant liquidity. No waiting for redemption.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Button variant="primary" size="lg">
                List Your Liens
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
