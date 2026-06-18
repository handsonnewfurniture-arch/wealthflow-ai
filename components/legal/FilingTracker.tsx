/**
 * Filing Tracker
 * Track legal filings and deadlines
 */

'use client'

import { useState } from 'react'
import { Calendar, AlertTriangle, CheckCircle, Clock, MapPin } from 'lucide-react'

interface Filing {
  id: string
  type: 'foreclosure_notice' | 'redemption_demand' | 'county_filing' | 'court_filing' | 'title_transfer'
  property: string
  county: string
  deadline: Date
  status: 'pending' | 'filed' | 'overdue' | 'completed'
  filedDate?: Date
  confirmationNumber?: string
  notes?: string
}

const sampleFilings: Filing[] = [
  {
    id: '1',
    type: 'foreclosure_notice',
    property: '1234 Oak Street, Maricopa County',
    county: 'Maricopa',
    deadline: new Date('2026-06-25'),
    status: 'pending',
    notes: 'Redemption period expires 6/23. Must file by 6/25.'
  },
  {
    id: '2',
    type: 'redemption_demand',
    property: '5678 Pine Avenue, Pinal County',
    county: 'Pinal',
    deadline: new Date('2026-06-20'),
    status: 'filed',
    filedDate: new Date('2026-06-17'),
    confirmationNumber: 'RD-2026-001234'
  },
  {
    id: '3',
    type: 'county_filing',
    property: '9012 Maple Drive, Pima County',
    county: 'Pima',
    deadline: new Date('2026-06-18'),
    status: 'overdue',
    notes: 'URGENT: Deadline passed. Contact county clerk immediately.'
  },
  {
    id: '4',
    type: 'title_transfer',
    property: '3456 Cedar Lane, Yavapai County',
    county: 'Yavapai',
    deadline: new Date('2026-07-01'),
    status: 'completed',
    filedDate: new Date('2026-06-15'),
    confirmationNumber: 'TT-2026-005678'
  }
]

export default function FilingTracker() {
  const [filings, setFilings] = useState<Filing[]>(sampleFilings)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filteredFilings = filterStatus === 'all'
    ? filings
    : filings.filter(f => f.status === filterStatus)

  const getFilingTypeLabel = (type: Filing['type']) => {
    const labels = {
      foreclosure_notice: 'Foreclosure Notice',
      redemption_demand: 'Redemption Demand',
      county_filing: 'County Filing',
      court_filing: 'Court Filing',
      title_transfer: 'Title Transfer'
    }
    return labels[type]
  }

  const getStatusBadge = (filing: Filing) => {
    const daysUntilDeadline = Math.ceil(
      (filing.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )

    if (filing.status === 'completed') {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
          <CheckCircle className="w-4 h-4" />
          Completed
        </div>
      )
    }

    if (filing.status === 'filed') {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
          <CheckCircle className="w-4 h-4" />
          Filed
        </div>
      )
    }

    if (filing.status === 'overdue') {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold animate-pulse">
          <AlertTriangle className="w-4 h-4" />
          Overdue
        </div>
      )
    }

    // Pending with deadline approaching
    if (daysUntilDeadline <= 3) {
      return (
        <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
          <Clock className="w-4 h-4" />
          {daysUntilDeadline} days left
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-semibold">
        <Clock className="w-4 h-4" />
        {daysUntilDeadline} days left
      </div>
    )
  }

  const urgentFilings = filings.filter(f => {
    const daysUntil = Math.ceil((f.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return f.status === 'pending' && daysUntil <= 7
  }).length

  const overdueFilings = filings.filter(f => f.status === 'overdue').length

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Filing Tracker</h3>
            <p className="text-sm text-slate-600 mt-1">Monitor deadlines and filing statuses</p>
          </div>

          {/* Alert Summary */}
          {(urgentFilings > 0 || overdueFilings > 0) && (
            <div className="flex gap-3">
              {overdueFilings > 0 && (
                <div className="px-4 py-2 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-semibold text-sm">{overdueFilings} Overdue</span>
                </div>
              )}
              {urgentFilings > 0 && (
                <div className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-semibold text-sm">{urgentFilings} Urgent</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {['all', 'pending', 'filed', 'overdue', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Filings List */}
      <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
        {filteredFilings.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No filings to display</p>
          </div>
        ) : (
          filteredFilings.map((filing) => (
            <div
              key={filing.id}
              className={`px-6 py-5 hover:bg-slate-50 transition-colors ${
                filing.status === 'overdue' ? 'bg-red-50/50' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-slate-900">
                      {getFilingTypeLabel(filing.type)}
                    </h4>
                    {getStatusBadge(filing)}
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-sm text-slate-700 font-medium">
                      {filing.property}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span>{filing.county} County</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Deadline: {filing.deadline.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    {filing.filedDate && (
                      <div className="text-sm text-slate-600">
                        Filed: {filing.filedDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                        {filing.confirmationNumber && (
                          <span className="ml-2 font-mono text-xs text-slate-500">
                            #{filing.confirmationNumber}
                          </span>
                        )}
                      </div>
                    )}

                    {filing.notes && (
                      <div className={`text-sm mt-2 p-3 rounded-lg ${
                        filing.status === 'overdue'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        <p>{filing.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="ml-4">
                  {filing.status === 'pending' && (
                    <button className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
                      File Now
                    </button>
                  )}
                  {filing.status === 'filed' && (
                    <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium">
                      View Filing
                    </button>
                  )}
                  {filing.status === 'overdue' && (
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                      Urgent: File
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <p>Total filings: <strong className="text-slate-900">{filings.length}</strong></p>
          <div className="flex gap-4">
            <span>
              <strong className="text-slate-900">{filings.filter(f => f.status === 'pending').length}</strong> Pending
            </span>
            <span>
              <strong className="text-slate-900">{filings.filter(f => f.status === 'filed').length}</strong> Filed
            </span>
            <span>
              <strong className="text-slate-900">{filings.filter(f => f.status === 'completed').length}</strong> Completed
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
