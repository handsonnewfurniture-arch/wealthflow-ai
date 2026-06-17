/**
 * Admin Properties List Page
 *
 * Dashboard for admins to manage marketplace listings and upload media
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import {
  Upload,
  Image,
  FileText,
  Edit,
  Star,
  MapPin,
  DollarSign,
  Search,
  Filter
} from 'lucide-react'

interface Listing {
  id: string
  title: string
  property_address: string
  county: string
  state: string
  parcel_apn: string
  status: string
  is_premium: boolean
  starting_bid: number | null
  buy_now_price: number | null
  created_at: string
}

export default function AdminPropertiesPage() {
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      console.log('Fetching listings...')
      // Fetch all listings (admin should see all statuses)
      const response = await fetch('/api/marketplace/listings')
      console.log('Response status:', response.status)

      if (!response.ok) {
        console.error('Response not OK:', response.status, response.statusText)
        return
      }

      const data = await response.json()
      console.log('Received data:', data)
      console.log('Listings count:', data.listings?.length || 0)

      setListings(data.listings || [])
      console.log('State updated with listings:', data.listings?.length || 0)
    } catch (error) {
      console.error('Failed to fetch listings:', error)
    } finally {
      console.log('Setting loading to false')
      setLoading(false)
    }
  }

  // Toggle premium status
  const togglePremium = async (listingId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/marketplace/listings/${listingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_premium: !currentStatus })
      })

      if (response.ok) {
        await fetchListings()
      } else {
        alert('Failed to update premium status')
      }
    } catch (error) {
      console.error('Update error:', error)
      alert('Failed to update premium status')
    }
  }

  // Filter listings
  const filteredListings = listings.filter(listing => {
    const matchesSearch = searchQuery === '' ||
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.property_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.county.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.parcel_apn.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'emerald'
      case 'pending': return 'gold'
      case 'sold': return 'blue'
      case 'draft': return 'gray'
      default: return 'gray'
    }
  }

  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />

      <div className="pt-20 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Property Management</h1>
              <p className="text-gray-400">
                Manage listings, upload media, and configure premium access
              </p>
            </div>
            <Link href="/marketplace/create">
              <Button variant="primary">
                + New Listing
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <Card className="p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-glass pl-10 w-full"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-glass"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <p className="text-sm text-gray-400 mb-1">Total Listings</p>
              <p className="text-2xl font-bold">{listings.length}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-400 mb-1">Active</p>
              <p className="text-2xl font-bold text-emerald-400">
                {listings.filter(l => l.status === 'active').length}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-400 mb-1">Premium</p>
              <p className="text-2xl font-bold text-gold-400">
                {listings.filter(l => l.is_premium).length}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-400 mb-1">Draft</p>
              <p className="text-2xl font-bold text-gray-400">
                {listings.filter(l => l.status === 'draft').length}
              </p>
            </Card>
          </div>

          {/* Listings Table */}
          <Card className="overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-400">Loading properties...</p>
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="p-12 text-center">
                <MapPin className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No properties found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className="py-4 px-6 text-sm font-semibold text-gray-400">Property</th>
                      <th className="py-4 px-6 text-sm font-semibold text-gray-400">Location</th>
                      <th className="py-4 px-6 text-sm font-semibold text-gray-400">Price</th>
                      <th className="py-4 px-6 text-sm font-semibold text-gray-400">Status</th>
                      <th className="py-4 px-6 text-sm font-semibold text-gray-400">Premium</th>
                      <th className="py-4 px-6 text-sm font-semibold text-gray-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredListings.map((listing) => (
                      <tr
                        key={listing.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-semibold text-white mb-1">{listing.title}</p>
                            <p className="text-sm text-gray-400">{listing.parcel_apn}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1 text-sm text-gray-300">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            {listing.county}, {listing.state}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm">
                            {listing.buy_now_price ? (
                              <span className="text-emerald-400 font-semibold">
                                ${listing.buy_now_price.toLocaleString()}
                              </span>
                            ) : listing.starting_bid ? (
                              <span className="text-gray-300">
                                ${listing.starting_bid.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-gray-500">—</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <Badge variant={getStatusVariant(listing.status)} className="capitalize">
                            {listing.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => togglePremium(listing.id, listing.is_premium)}
                            className="flex items-center gap-1 hover:scale-110 transition-transform"
                            title={listing.is_premium ? 'Remove premium status' : 'Make premium'}
                          >
                            <Star
                              className={`w-5 h-5 ${
                                listing.is_premium
                                  ? 'fill-gold-400 text-gold-400'
                                  : 'text-gray-500'
                              }`}
                            />
                          </button>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/admin/properties/${listing.id}`)}
                            >
                              <Upload className="w-4 h-4 mr-1" />
                              Upload
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/marketplace/${listing.id}`)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
