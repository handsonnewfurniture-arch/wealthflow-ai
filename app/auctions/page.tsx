'use client'

export const dynamic = 'force-dynamic'

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

export default function CountyAuctions() {
  const [searchQuery, setSearchQuery] = useState('')
  const [stateFilter, setStateFilter] = useState('all')
  const [countyFilter, setCountyFilter] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [listings, setListings] = useState<MarketplaceListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [savedListings, setSavedListings] = useState<Set<string>>(new Set())
  const [mounted, setMounted] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [stateFilter, countyFilter, sortBy, searchQuery])

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
        params.append('page', currentPage.toString())
        params.append('pageSize', '20')

        console.log('Fetching auctions from:', `/api/marketplace/listings?${params}`)
        // Using marketplace listings for now until we migrate to county_auctions table
        const response = await fetch(`/api/marketplace/listings?${params}`)
        console.log('Response status:', response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.error('Error response:', errorText)
          throw new Error(`Failed to fetch listings: ${response.status} - ${errorText}`)
        }

        const data = await response.json()
        console.log('Received listings:', data.listings?.length || 0)
        setListings(data.listings || [])

        // Update pagination info
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1)
          setTotalCount(data.pagination.total || 0)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred'
        setError(errorMessage)
        console.error('Error fetching listings:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [stateFilter, countyFilter, sortBy, searchQuery, currentPage])

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

  // Render loading state instead of null to prevent blank page
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading marketplace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Info Banner */}
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 mb-6 rounded-r-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-emerald-700">
                  <span className="font-semibold">Primary Market</span> - These are tax liens and deeds available directly from county auctions. You're buying from the government, not other investors.
                </p>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">County Auctions - Buy Direct</h1>
            <p className="text-gray-600">
              {totalCount > 0 ? `${totalCount.toLocaleString()} tax liens & deeds from county auctions` : 'Loading auctions...'}
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[250px] relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search address, county, or parcel"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">All States</option>
                <option value="FL">Florida</option>
                <option value="AZ">Arizona</option>
                <option value="IA">Iowa</option>
                <option value="IL">Illinois</option>
                <option value="IN">Indiana</option>
              </select>

              <input
                type="text"
                placeholder="County"
                value={countyFilter}
                onChange={(e) => setCountyFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-40"
              />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="auction_date">Auction Date</option>
              </select>
            </div>
          </div>

          {/* Loading & Error States */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="ml-3 text-gray-600">Loading properties...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
              <p className="text-red-600">Error: {error}</p>
              <Button
                variant="secondary"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          )}

          {/* Marketplace Listings - Zillow Style Grid */}
          {!loading && !error && (
            <>
              {listings.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <p className="text-gray-600 text-lg">No properties found matching your criteria.</p>
                  <p className="text-sm text-gray-500 mt-2">Try adjusting your filters or search.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.map((listing) => {
                    const price = getListingPrice(listing)
                    const daysRemaining = getDaysUntilRedemption(listing)

                    return (
                      <Link
                        key={listing.id}
                        href={`/marketplace/${listing.id}`}
                        className="group"
                      >
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                          {/* Property Image Placeholder */}
                          <div className="relative h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                            <MapPin className="w-12 h-12 text-blue-300" />
                            <div className="absolute top-3 right-3">
                              <Badge variant={listing.listing_type === 'tax_lien' ? 'emerald' : 'gold'} className="text-xs bg-white">
                                {listing.listing_type === 'tax_lien' ? 'Tax Lien' : 'Tax Deed'}
                              </Badge>
                            </div>
                            {daysRemaining && daysRemaining < 365 && (
                              <div className="absolute bottom-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                                {daysRemaining} days left
                              </div>
                            )}
                          </div>

                          {/* Property Details */}
                          <div className="p-4">
                            {/* Price */}
                            <div className="text-2xl font-bold text-gray-900 mb-2">
                              ${price.toLocaleString()}
                            </div>

                            {/* Address */}
                            <div className="text-gray-700 font-medium mb-1 group-hover:text-blue-600 transition-colors">
                              {listing.property_address}
                            </div>
                            <div className="text-sm text-gray-500 mb-3">
                              {listing.county}, {listing.state} • {listing.parcel_apn}
                            </div>

                            {/* Property Stats */}
                            <div className="flex items-center text-sm text-gray-600 space-x-3 mb-3">
                              {listing.estimated_value && (
                                <div className="flex items-center">
                                  <span className="font-semibold">Est. Value:</span>
                                  <span className="ml-1">${(listing.estimated_value / 1000).toFixed(0)}K</span>
                                </div>
                              )}
                              {listing.redemption_period && (
                                <div className="flex items-center">
                                  <span>{listing.redemption_period}</span>
                                </div>
                              )}
                            </div>

                            {/* Auction Date if applicable */}
                            {mounted && listing.auction_date_time && (
                              <div className="text-xs text-gray-500 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                Auction: {new Date(listing.auction_date_time).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}

              {/* Pagination Controls */}
              {!loading && !error && listings.length > 0 && totalPages > 1 && (
                <div className="mt-12 flex items-center justify-between border-t border-gray-200 pt-8">
                  <div className="text-sm text-gray-600">
                    Showing page {currentPage} of {totalPages} ({totalCount.toLocaleString()} total properties)
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setCurrentPage(prev => Math.max(1, prev - 1))
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>

                    {/* Page numbers */}
                    <div className="flex gap-1">
                      {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                        let pageNum
                        if (totalPages <= 5) {
                          pageNum = idx + 1
                        } else if (currentPage <= 3) {
                          pageNum = idx + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + idx
                        } else {
                          pageNum = currentPage - 2 + idx
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => {
                              setCurrentPage(pageNum)
                              window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}
                            className={`px-3 py-2 text-sm font-medium rounded ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                    </div>

                    <Button
                      variant="secondary"
                      onClick={() => {
                        setCurrentPage(prev => Math.min(totalPages, prev + 1))
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Learn More CTA */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">New to County Tax Auctions?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Learn the ins and outs of buying tax liens and tax deeds directly from county auctions. Our academy covers due diligence, bidding strategies, and redemption processes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link href="/academy">
                <Button variant="primary" size="lg">
                  Start Learning
                </Button>
              </Link>
              <Link href="/counties">
                <Button variant="secondary" size="lg">
                  Research Counties
                </Button>
              </Link>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Free educational resources · County guides · Investment calculators
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
