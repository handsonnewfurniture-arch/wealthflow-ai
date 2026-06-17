/**
 * Main Dashboard Page
 * Enterprise tax lien/deed investment dashboard
 */

'use client'

import DashboardSidebar from '@/components/DashboardSidebar'
import MetricCards from '@/components/dashboard/MetricCards'
import PortfolioChart from '@/components/dashboard/PortfolioChart'
import LiveAuctionTracker from '@/components/dashboard/LiveAuctionTracker'
import ActivityTable from '@/components/dashboard/ActivityTable'
import { Bell, Search } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="lg:ml-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Page title */}
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-sm text-slate-600 mt-1">
                  Welcome back! Here's what's happening with your portfolio.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {/* Search */}
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <Search className="w-5 h-5 text-slate-600" />
                </button>

                {/* Notifications */}
                <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <Bell className="w-5 h-5 text-slate-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
                </button>

                {/* User avatar */}
                <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm cursor-pointer">
                  TM
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 space-y-6">
          {/* Metrics Overview */}
          <section>
            <MetricCards />
          </section>

          {/* Portfolio Growth Chart */}
          <section>
            <PortfolioChart />
          </section>

          {/* Live Tracker & Quick Stats Row */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Auction Tracker - Takes 2 columns */}
            <div className="lg:col-span-2">
              <LiveAuctionTracker limit={5} />
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors text-sm">
                  Browse Marketplace
                </button>
                <button className="w-full px-4 py-3 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors text-sm">
                  View Upcoming Auctions
                </button>
                <button className="w-full px-4 py-3 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors text-sm">
                  Manage Saved Deals
                </button>
                <button className="w-full px-4 py-3 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors text-sm">
                  Portfolio Analytics
                </button>
              </div>

              {/* Upcoming Deadlines */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Upcoming Deadlines</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">Redemption Expires</p>
                      <p className="text-xs text-slate-500">Parcel #456789 - 3 days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gold-500 rounded-full mt-1.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">Auction Registration</p>
                      <p className="text-xs text-slate-500">Maricopa County - 5 days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">Payment Due</p>
                      <p className="text-xs text-slate-500">Parcel #123456 - 7 days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Activity Table */}
          <section>
            <ActivityTable />
          </section>
        </main>
      </div>
    </div>
  )
}
