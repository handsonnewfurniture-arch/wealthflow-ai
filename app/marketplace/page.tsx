'use client'

import { useState } from 'react'
import {
  Search,
  Filter,
  ShoppingCart,
  TrendingUp,
  Clock,
  DollarSign,
  MapPin,
  ChevronDown,
  Star
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('')
  const [stateFilter, setStateFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  // Mock marketplace listings
  const listings = [
    {
      id: 1,
      seller: 'John D.',
      sellerRating: 4.8,
      address: '456 Sunset Blvd, Sarasota, FL 34231',
      county: 'Sarasota',
      state: 'FL',
      parcelId: 'SR-2024-5678',
      originalPurchase: 9200,
      currentValue: 10580,
      askingPrice: 10200,
      interestRate: 18.0,
      daysHeld: 289,
      redemptionDeadline: '2027-09-15',
      propertyType: 'Residential',
      assessedValue: 425000,
      roi: 10.87,
      listedDate: '2026-06-10',
      featured: true
    },
    {
      id: 2,
      seller: 'Sarah M.',
      sellerRating: 5.0,
      address: '789 Main St, Des Moines, IA 50310',
      county: 'Polk',
      state: 'IA',
      parcelId: 'PK-IA-2024-9999',
      originalPurchase: 6800,
      currentValue: 8024,
      askingPrice: 7650,
      interestRate: 24.0,
      daysHeld: 215,
      redemptionDeadline: '2027-11-20',
      propertyType: 'Residential',
      assessedValue: 285000,
      roi: 12.5,
      listedDate: '2026-06-12',
      featured: false
    },
    {
      id: 3,
      seller: 'Mike T.',
      sellerRating: 4.6,
      address: '321 Ocean Ave, St Augustine, FL 32080',
      county: 'St Johns',
      state: 'FL',
      parcelId: 'SJ-2024-4321',
      originalPurchase: 11500,
      currentValue: 13225,
      askingPrice: 12800,
      interestRate: 18.0,
      daysHeld: 310,
      redemptionDeadline: '2027-08-01',
      propertyType: 'Residential',
      assessedValue: 495000,
      roi: 11.3,
      listedDate: '2026-06-14',
      featured: false
    },
    {
      id: 4,
      seller: 'Lisa K.',
      sellerRating: 4.9,
      address: '555 Highland Dr, Prescott Valley, AZ 86314',
      county: 'Yavapai',
      state: 'AZ',
      parcelId: 'YV-2024-7777',
      originalPurchase: 7200,
      currentValue: 7992,
      askingPrice: 7500,
      interestRate: 16.0,
      daysHeld: 198,
      redemptionDeadline: '2028-01-15',
      propertyType: 'Residential',
      assessedValue: 365000,
      roi: 4.17,
      listedDate: '2026-06-13',
      featured: false
    }
  ]

  const filteredListings = listings.filter(listing => {
    if (stateFilter !== 'all' && listing.state !== stateFilter) return false
    if (searchQuery && !listing.address.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !listing.county.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

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
              <div className="text-2xl font-bold text-emerald-400">127</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-gray-400 mb-1">Total Volume (30d)</div>
              <div className="text-2xl font-bold text-gold-400">$2.4M</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-gray-400 mb-1">Avg ROI</div>
              <div className="text-2xl font-bold text-emerald-400">8.5%</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-gray-400 mb-1">Sales (24h)</div>
              <div className="text-2xl font-bold">23</div>
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

          {/* Marketplace Listings */}
          <div className="space-y-4">
            {filteredListings.map((listing) => {
              const daysRemaining = getDaysUntilExpiration(listing.redemptionDeadline)
              const profit = listing.currentValue - listing.originalPurchase
              const discount = ((listing.currentValue - listing.askingPrice) / listing.currentValue) * 100

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
                          <h3 className="font-bold text-lg mb-1">{listing.address}</h3>
                          <p className="text-sm text-gray-400">{listing.county}, {listing.state}</p>
                          <p className="text-xs text-gray-500 mt-1">Parcel: {listing.parcelId}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mt-3">
                        <div className="flex items-center text-xs text-gray-400">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(listing.sellerRating)
                                    ? 'text-gold-400 fill-gold-400'
                                    : 'text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2">{listing.sellerRating} · {listing.seller}</span>
                        </div>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Asking Price</div>
                        <div className="text-lg font-bold text-gold-400">
                          ${listing.askingPrice.toLocaleString()}
                        </div>
                        {discount > 0 && (
                          <div className="text-xs text-emerald-400">
                            {discount.toFixed(1)}% below value
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="text-xs text-gray-400 mb-1">Current Value</div>
                        <div className="text-sm font-semibold">
                          ${listing.currentValue.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          Orig: ${listing.originalPurchase.toLocaleString()}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-400 mb-1">Interest Rate</div>
                        <div className="text-sm font-semibold text-gold-400">
                          {listing.interestRate}%
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-400 mb-1">Days Held</div>
                        <div className="text-sm font-semibold">
                          {listing.daysHeld}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-400 mb-1">ROI at Purchase</div>
                        <div className="text-sm font-semibold text-emerald-400">
                          {listing.roi}%
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
                          Listed {new Date(listing.listedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Tags */}
                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="blue" className="text-xs capitalize">
                        {listing.propertyType}
                      </Badge>
                      <Badge variant="gray" className="text-xs">
                        Assessed: ${(listing.assessedValue / 1000).toFixed(0)}k
                      </Badge>
                    </div>
                    <div className="text-xs text-emerald-400 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      ${profit.toLocaleString()} seller profit
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

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
