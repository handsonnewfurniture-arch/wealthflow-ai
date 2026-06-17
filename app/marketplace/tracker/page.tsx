'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  MapPin,
  DollarSign,
  FileText,
  ExternalLink,
  TrendingUp
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import type { PurchaseTrackerItem } from '@/lib/marketplace/types'
import { supabase } from '@/lib/supabase'

type UserRole = 'buyer' | 'seller'

interface PurchaseWithRole extends PurchaseTrackerItem {
  user_role: UserRole
}

function PurchaseTrackerContent() {
  const searchParams = useSearchParams()
  const highlightId = searchParams.get('highlight')

  const [purchases, setPurchases] = useState<PurchaseWithRole[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'buying' | 'selling'>('all')

  useEffect(() => {
    fetchPurchases()
    setupRealtimeSubscription()
  }, [])

  const fetchPurchases = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/marketplace/purchase-tracker')

      if (!response.ok) {
        if (response.status === 401) {
          setError('Please log in to view your purchases')
        } else {
          throw new Error('Failed to fetch purchases')
        }
        return
      }

      const data = await response.json()
      setPurchases(data.purchases || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const setupRealtimeSubscription = () => {
    // Subscribe to marketplace_purchases table for real-time updates
    const channel = supabase
      .channel('purchase-tracker')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'marketplace_purchases'
        },
        (payload) => {
          console.log('Purchase update:', payload)

          if (payload.eventType === 'INSERT') {
            // New purchase - fetch full details
            fetchPurchases()
          } else if (payload.eventType === 'UPDATE') {
            // Update existing purchase
            setPurchases(prevPurchases =>
              prevPurchases.map(p =>
                p.id === payload.new.id
                  ? { ...p, ...payload.new }
                  : p
              )
            )
          }
        }
      )
      .subscribe()

    // Cleanup on unmount
    return () => {
      channel.unsubscribe()
    }
  }

  const getStatusIcon = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />
      case 'failed':
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-400" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'paid':
        return <Badge variant="emerald">Paid</Badge>
      case 'processing':
        return <Badge variant="blue">Processing</Badge>
      case 'pending':
        return <Badge variant="gold">Pending</Badge>
      case 'failed':
        return <Badge variant="red">Failed</Badge>
      case 'refunded':
        return <Badge variant="gray">Refunded</Badge>
      case 'cancelled':
        return <Badge variant="gray">Cancelled</Badge>
      default:
        return <Badge variant="gray">{paymentStatus}</Badge>
    }
  }

  const filteredPurchases = purchases.filter(p => {
    if (filter === 'all') return true
    if (filter === 'buying') return p.user_role === 'buyer'
    if (filter === 'selling') return p.user_role === 'seller'
    return true
  })

  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />

      <div className="pt-20 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
              <Package className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400 font-semibold">Live Tracker</span>
            </div>
            <h1 className="page-header mb-4">Purchase Tracker</h1>
            <p className="text-xl text-gray-300">
              Track your purchases and sales in real-time. Assignment status updates automatically.
            </p>
          </div>

          {/* Filter Tabs */}
          <Card className="p-4 mb-8">
            <div className="flex space-x-2">
              <Button
                variant={filter === 'all' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All ({purchases.length})
              </Button>
              <Button
                variant={filter === 'buying' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter('buying')}
              >
                Buying ({purchases.filter(p => p.user_role === 'buyer').length})
              </Button>
              <Button
                variant={filter === 'selling' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter('selling')}
              >
                Selling ({purchases.filter(p => p.user_role === 'seller').length})
              </Button>
            </div>
          </Card>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
              <span className="ml-3 text-gray-400">Loading purchases...</span>
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

          {/* Purchases */}
          {!loading && !error && (
            <>
              {filteredPurchases.length === 0 ? (
                <Card className="p-12 text-center">
                  <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">No Purchases Yet</h2>
                  <p className="text-gray-400 mb-6">
                    {filter === 'all'
                      ? "You haven't made any purchases or sales yet."
                      : filter === 'buying'
                      ? "You haven't purchased any listings yet."
                      : "You haven't sold any listings yet."}
                  </p>
                  <Button variant="primary">
                    <Link href="/marketplace">
                      Browse Marketplace
                    </Link>
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredPurchases.map((purchase) => (
                    <Card
                      key={purchase.id}
                      hover
                      className={`p-6 relative ${
                        highlightId === purchase.id
                          ? 'ring-2 ring-emerald-500 bg-emerald-500/5'
                          : ''
                      }`}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left: Property & Transaction Info */}
                        <div className="lg:col-span-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                {getStatusIcon(purchase.payment_status)}
                                <Badge variant={purchase.user_role === 'buyer' ? 'blue' : 'gold'}>
                                  {purchase.user_role === 'buyer' ? 'Buying' : 'Selling'}
                                </Badge>
                              </div>

                              {purchase.listing && (
                                <>
                                  <h3 className="font-bold text-lg mb-1">
                                    {purchase.listing.property_address}
                                  </h3>
                                  <p className="text-sm text-gray-400">
                                    {purchase.listing.county}, {purchase.listing.state}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Parcel: {purchase.listing.parcel_apn}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mt-4">
                            <div>
                              <div className="text-xs text-gray-400">Purchase Price</div>
                              <div className="text-lg font-bold text-gold-400">
                                ${purchase.purchase_price.toLocaleString()}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-400">Transaction ID</div>
                              <div className="text-xs font-mono text-gray-300">
                                {purchase.transaction_id}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Middle: Status Timeline */}
                        <div className="lg:col-span-4">
                          <div className="space-y-3">
                            {/* Payment Status */}
                            <div className="flex items-center space-x-3">
                              <div className={`w-2 h-2 rounded-full ${
                                purchase.payment_status === 'paid' ? 'bg-emerald-400' :
                                purchase.payment_status === 'processing' ? 'bg-blue-400 animate-pulse' :
                                purchase.payment_status === 'pending' ? 'bg-yellow-400' :
                                'bg-red-400'
                              }`} />
                              <div className="flex-1">
                                <div className="text-xs text-gray-400">Payment</div>
                                {getStatusBadge(purchase.payment_status)}
                              </div>
                            </div>

                            {/* Assignment Status */}
                            <div className="flex items-center space-x-3">
                              <div className={`w-2 h-2 rounded-full ${
                                purchase.assignment_status === 'completed' ? 'bg-emerald-400' :
                                purchase.assignment_status === 'in_progress' ? 'bg-blue-400 animate-pulse' :
                                purchase.assignment_status === 'pending' ? 'bg-gray-400' :
                                'bg-red-400'
                              }`} />
                              <div className="flex-1">
                                <div className="text-xs text-gray-400">Assignment</div>
                                <Badge variant={
                                  purchase.assignment_status === 'completed' ? 'emerald' :
                                  purchase.assignment_status === 'in_progress' ? 'blue' :
                                  'gray'
                                } className="capitalize">
                                  {purchase.assignment_status.replace('_', ' ')}
                                </Badge>
                              </div>
                            </div>

                            {/* Completion Date */}
                            {purchase.assignment_completed_date && (
                              <div className="pt-2 border-t border-white/10">
                                <div className="text-xs text-gray-400">Completed</div>
                                <div className="text-sm text-emerald-400">
                                  {new Date(purchase.assignment_completed_date).toLocaleDateString()}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="lg:col-span-2 flex flex-col justify-between space-y-2">
                          {purchase.listing && (
                            <Button variant="secondary" size="sm" className="w-full">
                              <Link href={`/marketplace/${purchase.listing.id}`}>
                                <FileText className="w-4 h-4 mr-2" />
                                View Listing
                              </Link>
                            </Button>
                          )}

                          {purchase.assignment_document_url && (
                            <Button variant="secondary" size="sm" className="w-full">
                              <a href={purchase.assignment_document_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Assignment Doc
                              </a>
                            </Button>
                          )}

                          {purchase.purchase_receipt_url && (
                            <Button variant="secondary" size="sm" className="w-full">
                              <a href={purchase.purchase_receipt_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Receipt
                              </a>
                            </Button>
                          )}

                          <div className="text-xs text-gray-500 pt-2">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {new Date(purchase.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {/* County Confirmation Number */}
                      {purchase.county_confirmation_number && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <div className="text-xs text-gray-400">County Confirmation Number</div>
                          <div className="text-sm font-mono text-emerald-400">
                            {purchase.county_confirmation_number}
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Realtime Indicator */}
          {!loading && !error && purchases.length > 0 && (
            <Card className="p-4 mt-8 bg-emerald-500/5 border-emerald-500/20">
              <div className="flex items-center justify-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-400">Live updates enabled</span>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}


export default function PurchaseTracker() {
  return (
    <Suspense fallback={
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-20 px-4 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="ml-3 text-gray-600">Loading tracker...</span>
            </div>
          </div>
        </div>
      </div>
    }>
      <PurchaseTrackerContent />
    </Suspense>
  )
}
