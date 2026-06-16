'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Receipt,
  Loader2,
  AlertCircle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  Clock
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import type { MarketplaceTransaction } from '@/lib/marketplace/types'

export default function Transactions() {
  const [transactions, setTransactions] = useState<MarketplaceTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    fetchTransactions()
  }, [page])

  const fetchTransactions = async () => {
    setLoading(true)
    setError(null)

    try {
      const limit = 20
      const offset = (page - 1) * limit

      const response = await fetch(
        `/api/marketplace/transactions?limit=${limit}&offset=${offset}`
      )

      if (!response.ok) {
        if (response.status === 401) {
          setError('Please log in to view transactions')
        } else {
          throw new Error('Failed to fetch transactions')
        }
        return
      }

      const data = await response.json()
      setTransactions(data.transactions || [])
      setHasMore(data.pagination.total > offset + limit)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'bid_placed':
        return <TrendingUp className="w-5 h-5 text-blue-400" />
      case 'purchase_initiated':
      case 'purchase_completed':
        return <DollarSign className="w-5 h-5 text-emerald-400" />
      case 'purchase_failed':
        return <AlertCircle className="w-5 h-5 text-red-400" />
      case 'refund_issued':
        return <TrendingDown className="w-5 h-5 text-yellow-400" />
      default:
        return <FileText className="w-5 h-5 text-gray-400" />
    }
  }

  const getTransactionBadge = (type: string) => {
    switch (type) {
      case 'bid_placed':
        return <Badge variant="blue">Bid Placed</Badge>
      case 'purchase_initiated':
        return <Badge variant="gold">Purchase Started</Badge>
      case 'purchase_completed':
        return <Badge variant="emerald">Purchase Complete</Badge>
      case 'purchase_failed':
        return <Badge variant="red">Purchase Failed</Badge>
      case 'refund_issued':
        return <Badge variant="gray">Refund Issued</Badge>
      default:
        return <Badge variant="gray">{type.replace(/_/g, ' ')}</Badge>
    }
  }

  const formatTransactionDescription = (transaction: MarketplaceTransaction) => {
    if (transaction.metadata?.property_address) {
      return transaction.metadata.property_address
    }
    return 'Transaction activity'
  }

  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />

      <div className="pt-20 px-4 pb-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
              <Receipt className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-400 font-semibold">Transaction History</span>
            </div>
            <h1 className="page-header mb-4">Your Transactions</h1>
            <p className="text-xl text-gray-300">
              Complete history of all marketplace activity including bids, purchases, and refunds.
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
              <span className="ml-3 text-gray-400">Loading transactions...</span>
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

          {/* Transactions */}
          {!loading && !error && (
            <>
              {transactions.length === 0 ? (
                <Card className="p-12 text-center">
                  <Receipt className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">No Transactions Yet</h2>
                  <p className="text-gray-400 mb-6">
                    Your marketplace activity will appear here once you start bidding or purchasing.
                  </p>
                  <Button variant="primary" asChild>
                    <Link href="/marketplace">
                      Browse Marketplace
                    </Link>
                  </Button>
                </Card>
              ) : (
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <Card key={transaction.id} hover className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="bg-gray-800/50 p-3 rounded-lg">
                            {getTransactionIcon(transaction.transaction_type)}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              {getTransactionBadge(transaction.transaction_type)}
                              <span className="text-xs text-gray-500">
                                {new Date(transaction.created_at).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400">
                              {formatTransactionDescription(transaction)}
                            </p>

                            {/* Transaction Metadata */}
                            {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
                              <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                                {transaction.metadata.listing_id && (
                                  <Link
                                    href={`/marketplace/${transaction.metadata.listing_id}`}
                                    className="hover:text-emerald-400 transition-colors"
                                  >
                                    <FileText className="w-3 h-3 inline mr-1" />
                                    View Listing
                                  </Link>
                                )}
                                {transaction.metadata.purchase_id && (
                                  <Link
                                    href={`/marketplace/tracker?highlight=${transaction.metadata.purchase_id}`}
                                    className="hover:text-emerald-400 transition-colors"
                                  >
                                    <Clock className="w-3 h-3 inline mr-1" />
                                    Track Purchase
                                  </Link>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Amount */}
                        {transaction.amount !== null && (
                          <div className="text-right">
                            <div className={`text-lg font-bold ${
                              transaction.transaction_type.includes('refund') ||
                              transaction.transaction_type.includes('failed')
                                ? 'text-red-400'
                                : 'text-emerald-400'
                            }`}>
                              {transaction.transaction_type.includes('refund') ? '+' : '-'}
                              ${Math.abs(transaction.amount).toLocaleString()}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {transactions.length > 0 && (
                <div className="flex items-center justify-between mt-8">
                  <Button
                    variant="secondary"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-400">
                    Page {page}
                  </span>
                  <Button
                    variant="secondary"
                    onClick={() => setPage(p => p + 1)}
                    disabled={!hasMore}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
