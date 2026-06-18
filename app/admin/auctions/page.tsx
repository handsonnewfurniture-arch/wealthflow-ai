'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, Database, Calendar, AlertCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

interface RefreshStatus {
  county: string
  state: string
  last_refreshed: string
  auction_date: string
  data_source: string
}

interface RefreshResult {
  success: boolean
  message?: string
  error?: string
  stats?: {
    deleted: number
    imported: number
    total: number
    timestamp: string
    source: string
    auction_date: string
  }
}

export default function AdminAuctionsPage() {
  const [status, setStatus] = useState<RefreshStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [result, setResult] = useState<RefreshResult | null>(null)

  useEffect(() => {
    fetchStatus()
  }, [])

  const fetchStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/refresh-auctions')
      if (response.ok) {
        const data = await response.json()
        setStatus(data)
      }
    } catch (error) {
      console.error('Error fetching status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    setResult(null)

    try {
      const token = prompt('Enter admin token:')
      if (!token) {
        setRefreshing(false)
        return
      }

      const response = await fetch('/api/admin/refresh-auctions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      setResult(data)

      if (data.success) {
        // Refresh status after successful update
        await fetchStatus()
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Auction Data Management
            </h1>
            <p className="text-gray-600">
              Manage and refresh auction listings from county sources
            </p>
          </div>

          {/* Current Status Card */}
          <Card className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Database className="w-5 h-5 mr-2 text-blue-600" />
                Current Status
              </h2>
              <Button
                variant="secondary"
                size="sm"
                onClick={fetchStatus}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh Status
              </Button>
            </div>

            {status ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">County:</span>
                  <span className="font-semibold">{status.county}, {status.state}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Last Refreshed:</span>
                  <span className="font-semibold">
                    {status.last_refreshed === 'Never'
                      ? 'Never'
                      : new Date(status.last_refreshed).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Auction Date:</span>
                  <span className="font-semibold">{status.auction_date}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Data Source:</span>
                  <span className="font-semibold text-sm">{status.data_source}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {loading ? 'Loading status...' : 'No status available'}
              </div>
            )}
          </Card>

          {/* Refresh Action Card */}
          <Card className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <RefreshCw className="w-5 h-5 mr-2 text-green-600" />
              Manual Refresh
            </h2>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                <div className="text-sm text-blue-700">
                  <p className="font-semibold mb-1">Before refreshing:</p>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>This will download the latest PDF from St Johns County</li>
                    <li>Parse ~4,500 properties (takes 2-3 minutes)</li>
                    <li>Delete old auction listings</li>
                    <li>Import new listings to database</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={handleRefresh}
              disabled={refreshing}
              className="w-full"
            >
              {refreshing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Refreshing... (2-3 minutes)
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Auction Data Now
                </>
              )}
            </Button>

            {/* Result Display */}
            {result && (
              <div className={`mt-4 p-4 rounded-lg ${
                result.success
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                {result.success ? (
                  <div>
                    <div className="flex items-center mb-3">
                      <Badge variant="emerald" className="text-sm">
                        ✓ Success
                      </Badge>
                      <span className="ml-3 text-sm text-gray-600">
                        {result.message}
                      </span>
                    </div>
                    {result.stats && (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Deleted:</span>
                          <span className="font-semibold">{result.stats.deleted} old listings</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Imported:</span>
                          <span className="font-semibold">{result.stats.imported} new listings</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total:</span>
                          <span className="font-semibold">{result.stats.total} active listings</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Completed:</span>
                          <span className="font-semibold">
                            {new Date(result.stats.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <Badge variant="red" className="text-sm mb-2">
                      ✗ Error
                    </Badge>
                    <p className="text-sm text-red-700">{result.error}</p>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Automated Schedule Card */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
              Automated Schedule
            </h2>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-purple-600 mt-0.5 mr-3" />
                <div className="text-sm text-purple-700">
                  <p className="font-semibold mb-2">Vercel Cron Job Configured</p>
                  <p className="mb-2">
                    Auction data automatically refreshes on the <strong>1st of every month at 2:00 AM UTC</strong>
                  </p>
                  <p className="text-xs">
                    This ensures the latest delinquent tax lists are imported before auction season.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
