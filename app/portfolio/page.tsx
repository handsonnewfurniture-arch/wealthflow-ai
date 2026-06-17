'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Filter
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import AddLienModal from '@/components/AddLienModal'

export default function Portfolio() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  // Mock portfolio data
  const portfolioSummary = {
    totalInvested: 100000,
    activeValue: 116500,
    totalProfit: 16500,
    avgReturn: 16.5,
    activeLiens: 8,
    redemptions: 3,
    capitalAvailable: 25000
  }

  const liens = [
    {
      id: 1,
      parcelId: 'SR-2024-1234',
      address: '123 Palm Ave, Sarasota, FL',
      county: 'Sarasota, FL',
      purchaseAmount: 8500,
      interestRate: 18.0,
      purchaseDate: '2025-08-15',
      redemptionDeadline: '2027-08-15',
      status: 'active',
      daysHeld: 305,
      currentValue: 9965,
      profit: 1465
    },
    {
      id: 2,
      parcelId: 'SJ-2024-9876',
      address: '789 Ocean View Dr, St Augustine, FL',
      county: 'St Johns, FL',
      purchaseAmount: 9200,
      interestRate: 18.0,
      purchaseDate: '2025-09-10',
      redemptionDeadline: '2027-09-10',
      status: 'active',
      daysHeld: 279,
      currentValue: 10584,
      profit: 1384
    },
    {
      id: 3,
      parcelId: 'PK-IA-2024-3333',
      address: '1234 Oak St, Des Moines, IA',
      county: 'Polk, IA',
      purchaseAmount: 5200,
      interestRate: 24.0,
      purchaseDate: '2026-02-20',
      status: 'redeemed',
      redemptionDate: '2026-05-15',
      daysHeld: 84,
      redemptionAmount: 6032,
      profit: 832,
      reinvested: true
    },
    {
      id: 4,
      parcelId: 'YV-2024-5551',
      address: '555 Prescott Valley Pkwy, Prescott Valley, AZ',
      county: 'Yavapai, AZ',
      purchaseAmount: 6500,
      interestRate: 16.0,
      purchaseDate: '2025-10-01',
      status: 'redeemed',
      redemptionDate: '2026-04-01',
      daysHeld: 182,
      redemptionAmount: 6980,
      profit: 480,
      reinvested: false
    },
    {
      id: 5,
      parcelId: 'LK-FL-2024-8888',
      address: '999 Lakeside Dr, Leesburg, FL',
      county: 'Lake, FL',
      purchaseAmount: 4800,
      interestRate: 18.0,
      purchaseDate: '2026-01-15',
      redemptionDeadline: '2028-01-15',
      status: 'active',
      daysHeld: 152,
      currentValue: 5184,
      profit: 384
    }
  ]

  const filteredLiens = statusFilter === 'all'
    ? liens
    : liens.filter(lien => lien.status === statusFilter)

  const activeLiens = liens.filter(l => l.status === 'active')
  const redeemedLiens = liens.filter(l => l.status === 'redeemed')

  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />

      {/* Modern Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12 pt-32 pb-12">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-400">Active Investments</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight">
                Portfolio <span className="gradient-text">Tracker</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300">
                Track your liens, monitor returns, and maximize capital velocity
              </p>
            </div>
            <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Add Lien
            </Button>
          </div>
        </div>
      </div>
    </div>

    {/* Portfolio Content */}
    <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 pb-24">

          {/* Portfolio Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            <Card className="p-4">
              <div className="text-xs text-gray-400 mb-1">Total Invested</div>
              <div className="text-xl font-bold">
                ${(portfolioSummary.totalInvested / 1000).toFixed(0)}k
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-xs text-gray-400 mb-1">Current Value</div>
              <div className="text-xl font-bold text-emerald-400">
                ${(portfolioSummary.activeValue / 1000).toFixed(1)}k
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-xs text-gray-400 mb-1">Total Profit</div>
              <div className="text-xl font-bold text-gold-400">
                ${(portfolioSummary.totalProfit / 1000).toFixed(1)}k
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-xs text-gray-400 mb-1">Avg Return</div>
              <div className="text-xl font-bold text-emerald-400">
                {portfolioSummary.avgReturn}%
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-xs text-gray-400 mb-1">Active Liens</div>
              <div className="text-xl font-bold">
                {portfolioSummary.activeLiens}
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-xs text-gray-400 mb-1">Redemptions</div>
              <div className="text-xl font-bold text-emerald-400">
                {portfolioSummary.redemptions}
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-xs text-gray-400 mb-1">Cash Available</div>
              <div className="text-xl font-bold">
                ${(portfolioSummary.capitalAvailable / 1000).toFixed(0)}k
              </div>
            </Card>
          </div>

          {/* Capital Velocity Alert */}
          {portfolioSummary.capitalAvailable > 0 && (
            <Card className="p-6 mb-8 border-2 border-emerald-500/30">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="bg-emerald-500/20 p-3 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Deploy Within 48 Hours</h3>
                    <p className="text-gray-400">
                      You have ${(portfolioSummary.capitalAvailable / 1000).toFixed(0)}k available from recent redemptions.
                      Keep your capital working to maximize returns!
                    </p>
                  </div>
                </div>
                <Link href="/counties">
                  <Button variant="primary">Find Opportunities</Button>
                </Link>
              </div>
            </Card>
          )}

          {/* Status Filters */}
          <div className="flex items-center space-x-3 mb-6">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg transition-all ${
                statusFilter === 'all'
                  ? 'bg-emerald-500 text-white'
                  : 'glass-card text-gray-400 hover:text-white'
              }`}
            >
              All ({liens.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-4 py-2 rounded-lg transition-all ${
                statusFilter === 'active'
                  ? 'bg-emerald-500 text-white'
                  : 'glass-card text-gray-400 hover:text-white'
              }`}
            >
              Active ({activeLiens.length})
            </button>
            <button
              onClick={() => setStatusFilter('redeemed')}
              className={`px-4 py-2 rounded-lg transition-all ${
                statusFilter === 'redeemed'
                  ? 'bg-emerald-500 text-white'
                  : 'glass-card text-gray-400 hover:text-white'
              }`}
            >
              Redeemed ({redeemedLiens.length})
            </button>
          </div>

          {/* Liens Table */}
          <div className="space-y-4">
            {filteredLiens.map((lien) => (
              <Card key={lien.id} hover className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Property Info */}
                  <div className="lg:col-span-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg mb-1">{lien.address}</h3>
                        <p className="text-sm text-gray-400">{lien.county}</p>
                        <p className="text-xs text-gray-500 mt-1">Parcel: {lien.parcelId}</p>
                      </div>
                      <Badge
                        variant={lien.status === 'active' ? 'emerald' : 'gold'}
                        className="capitalize"
                      >
                        {lien.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Purchase Amount</div>
                      <div className="font-semibold">
                        ${lien.purchaseAmount.toLocaleString()}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-400 mb-1">Interest Rate</div>
                      <div className="font-semibold text-gold-400">
                        {lien.interestRate}%
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-400 mb-1">Days Held</div>
                      <div className="font-semibold">
                        {lien.daysHeld}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-400 mb-1">
                        {lien.status === 'active' ? 'Current Value' : 'Redemption Amount'}
                      </div>
                      <div className="font-semibold text-emerald-400">
                        ${(lien.status === 'active' ? lien.currentValue : lien.redemptionAmount)?.toLocaleString()}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-400 mb-1">Profit</div>
                      <div className="font-semibold text-gold-400">
                        ${lien.profit.toLocaleString()}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-400 mb-1">Return</div>
                      <div className="font-semibold text-emerald-400">
                        {((lien.profit / lien.purchaseAmount) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {/* Actions & Timeline */}
                  <div className="lg:col-span-3 space-y-3">
                    {lien.status === 'active' ? (
                      <>
                        <div className="text-xs text-gray-400">
                          <div className="flex items-center mb-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            Purchased: {new Date(lien.purchaseDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            Deadline: {new Date(lien.redemptionDeadline!).toLocaleDateString()}
                          </div>
                        </div>
                        <Link href="/portfolio">
                          <Button variant="secondary" size="sm" className="w-full">
                            View Details
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <>
                        <div className="text-xs text-gray-400">
                          <div className="flex items-center mb-1">
                            <CheckCircle className="w-3 h-3 mr-1 text-emerald-400" />
                            Redeemed: {new Date(lien.redemptionDate!).toLocaleDateString()}
                          </div>
                          {lien.reinvested && (
                            <div className="flex items-center text-emerald-400">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Reinvested
                            </div>
                          )}
                        </div>
                        {!lien.reinvested && (
                          <Link href="/counties">
                            <Button variant="primary" size="sm" className="w-full">
                              Reinvest Funds
                            </Button>
                          </Link>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredLiens.length === 0 && (
            <Card className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                No liens found in this category
              </div>
              <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
                Add Your First Lien
              </Button>
            </Card>
          )}
        </div>
      </div>

      {/* Add Lien Modal */}
      <AddLienModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setRefreshKey(prev => prev + 1)
          // In production, this would refresh the liens list from Supabase
        }}
      />
    </div>
  )
}
