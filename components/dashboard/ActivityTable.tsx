/**
 * Recent Activity Table
 * Sortable, filterable table of user's tax lien/deed activity
 */

'use client'

import { useState, useMemo } from 'react'
import { ChevronDown, ChevronUp, Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import Badge from '../ui/Badge'

interface Activity {
  id: string
  parcelApn: string
  county: string
  state: string
  assetType: 'Tax Lien' | 'Tax Deed'
  purchasePrice: number
  redemptionPeriod: string
  status: 'active' | 'pending' | 'redeemed' | 'sold' | 'watching' | 'requires_review'
  date: string
}

type SortColumn = keyof Activity | null
type SortDirection = 'asc' | 'desc'

interface ActivityTableProps {
  data?: Activity[]
  loading?: boolean
}

// Generate sample activity data
const generateSampleData = (count: number): Activity[] => {
  const counties = ['Maricopa', 'Pinal', 'Pima', 'Yavapai', 'Coconino', 'Mohave', 'Yuma']
  const states = ['AZ', 'FL', 'TX', 'CA', 'NV']
  const assetTypes: ('Tax Lien' | 'Tax Deed')[] = ['Tax Lien', 'Tax Deed']
  const statuses: Activity['status'][] = ['active', 'pending', 'redeemed', 'sold', 'watching', 'requires_review']
  const redemptionPeriods = ['6 months', '12 months', '18 months', '24 months', '36 months']

  return Array.from({ length: count }, (_, i) => ({
    id: `activity-${i}`,
    parcelApn: `${Math.floor(Math.random() * 900000 + 100000)}-${Math.floor(Math.random() * 9000 + 1000)}`,
    county: counties[Math.floor(Math.random() * counties.length)],
    state: states[Math.floor(Math.random() * states.length)],
    assetType: assetTypes[Math.floor(Math.random() * assetTypes.length)],
    purchasePrice: Math.floor(Math.random() * 100000 + 1000),
    redemptionPeriod: redemptionPeriods[Math.floor(Math.random() * redemptionPeriods.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
  }))
}

export default function ActivityTable({ data = generateSampleData(50), loading = false }: ActivityTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [filterState, setFilterState] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterAssetType, setFilterAssetType] = useState<string>('all')

  const itemsPerPage = 10

  // Sort and filter data
  const filteredAndSortedData = useMemo(() => {
    let filtered = [...data]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.parcelApn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.county.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.state.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply state filter
    if (filterState !== 'all') {
      filtered = filtered.filter(item => item.state === filterState)
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => item.status === filterStatus)
    }

    // Apply asset type filter
    if (filterAssetType !== 'all') {
      filtered = filtered.filter(item => item.assetType === filterAssetType)
    }

    // Sort
    if (sortColumn) {
      filtered.sort((a, b) => {
        const aVal = a[sortColumn]
        const bVal = b[sortColumn]

        let comparison = 0
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          comparison = aVal - bVal
        } else {
          comparison = String(aVal).localeCompare(String(bVal))
        }

        return sortDirection === 'asc' ? comparison : -comparison
      })
    }

    return filtered
  }, [data, searchQuery, filterState, filterStatus, filterAssetType, sortColumn, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const getStatusBadge = (status: Activity['status']) => {
    const badges = {
      active: <Badge variant="emerald">Active</Badge>,
      pending: <Badge variant="gold">Pending</Badge>,
      redeemed: <Badge variant="blue">Redeemed</Badge>,
      sold: <Badge variant="gray">Sold</Badge>,
      watching: <Badge variant="blue">Watching</Badge>,
      requires_review: <Badge variant="red">Requires Review</Badge>
    }
    return badges[status]
  }

  // Get unique states for filter
  const uniqueStates = Array.from(new Set(data.map(item => item.state))).sort()

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="h-8 w-48 bg-slate-100 rounded mb-6 animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 bg-slate-50 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      {/* Header with filters */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
            <p className="text-sm text-slate-500">{filteredAndSortedData.length} total items</p>
          </div>

          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search parcels, counties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
            </div>

            {/* State filter */}
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="all">All States</option>
              {uniqueStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>

            {/* Asset type filter */}
            <select
              value={filterAssetType}
              onChange={(e) => setFilterAssetType(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="all">All Types</option>
              <option value="Tax Lien">Tax Lien</option>
              <option value="Tax Deed">Tax Deed</option>
            </select>

            {/* Status filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="redeemed">Redeemed</option>
              <option value="sold">Sold</option>
              <option value="watching">Watching</option>
              <option value="requires_review">Requires Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {[
                { key: 'parcelApn', label: 'Parcel/APN' },
                { key: 'county', label: 'County' },
                { key: 'state', label: 'State' },
                { key: 'assetType', label: 'Asset Type' },
                { key: 'purchasePrice', label: 'Purchase Price' },
                { key: 'redemptionPeriod', label: 'Redemption Period' },
                { key: 'status', label: 'Status' },
                { key: 'date', label: 'Date' }
              ].map(column => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column.key as SortColumn)}
                  className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {sortColumn === column.key && (
                      sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {paginatedData.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                <td className="px-6 py-4 text-sm font-mono font-semibold text-slate-900">
                  {item.parcelApn}
                </td>
                <td className="px-6 py-4 text-sm text-slate-700">{item.county}</td>
                <td className="px-6 py-4 text-sm text-slate-700">{item.state}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    item.assetType === 'Tax Lien'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-purple-50 text-purple-700'
                  }`}>
                    {item.assetType}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                  ${item.purchasePrice.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-slate-700">{item.redemptionPeriod}</td>
                <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                <td className="px-6 py-4 text-sm text-slate-700">
                  {new Date(item.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {paginatedData.length === 0 && (
        <div className="p-12 text-center">
          <Filter className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No activity found matching your filters</p>
          <button
            onClick={() => {
              setSearchQuery('')
              setFilterState('all')
              setFilterStatus('all')
              setFilterAssetType('all')
            }}
            className="mt-4 text-sm text-slate-700 hover:text-slate-900 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of {filteredAndSortedData.length} results
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === pageNum
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
