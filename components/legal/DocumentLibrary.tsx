/**
 * Document Library
 * Legal document templates and generated documents
 */

'use client'

import { useState } from 'react'
import { FileText, Download, Eye, Edit, Trash2, Plus, Search, Filter } from 'lucide-react'

interface Document {
  id: string
  name: string
  type: 'template' | 'generated' | 'filed'
  category: 'foreclosure' | 'redemption' | 'filing' | 'compliance' | 'contract'
  status: 'draft' | 'ready' | 'filed' | 'archived'
  createdAt: Date
  updatedAt: Date
  property?: string
}

const sampleDocuments: Document[] = [
  {
    id: '1',
    name: 'Foreclosure Notice - 1234 Oak Street',
    type: 'generated',
    category: 'foreclosure',
    status: 'ready',
    createdAt: new Date('2026-06-15'),
    updatedAt: new Date('2026-06-17'),
    property: '1234 Oak Street, Maricopa County'
  },
  {
    id: '2',
    name: 'Redemption Demand Letter Template',
    type: 'template',
    category: 'redemption',
    status: 'ready',
    createdAt: new Date('2026-05-01'),
    updatedAt: new Date('2026-05-01')
  },
  {
    id: '3',
    name: 'County Tax Deed Filing - APN 123-456-789',
    type: 'filed',
    category: 'filing',
    status: 'filed',
    createdAt: new Date('2026-06-10'),
    updatedAt: new Date('2026-06-12'),
    property: '5678 Pine Avenue, Pinal County'
  },
  {
    id: '4',
    name: 'Due Diligence Checklist',
    type: 'template',
    category: 'compliance',
    status: 'ready',
    createdAt: new Date('2026-04-15'),
    updatedAt: new Date('2026-04-15')
  },
  {
    id: '5',
    name: 'Purchase Agreement Draft',
    type: 'generated',
    category: 'contract',
    status: 'draft',
    createdAt: new Date('2026-06-16'),
    updatedAt: new Date('2026-06-17'),
    property: '9012 Maple Drive, Pima County'
  }
]

export default function DocumentLibrary() {
  const [documents, setDocuments] = useState<Document[]>(sampleDocuments)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.property?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusBadge = (status: Document['status']) => {
    const styles = {
      draft: 'bg-slate-100 text-slate-700 border-slate-300',
      ready: 'bg-emerald-100 text-emerald-700 border-emerald-300',
      filed: 'bg-blue-100 text-blue-700 border-blue-300',
      archived: 'bg-slate-100 text-slate-500 border-slate-200'
    }

    const labels = {
      draft: 'Draft',
      ready: 'Ready',
      filed: 'Filed',
      archived: 'Archived'
    }

    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const getCategoryBadge = (category: Document['category']) => {
    const styles = {
      foreclosure: 'bg-red-50 text-red-700',
      redemption: 'bg-purple-50 text-purple-700',
      filing: 'bg-blue-50 text-blue-700',
      compliance: 'bg-emerald-50 text-emerald-700',
      contract: 'bg-orange-50 text-orange-700'
    }

    const labels = {
      foreclosure: 'Foreclosure',
      redemption: 'Redemption',
      filing: 'County Filing',
      compliance: 'Compliance',
      contract: 'Contract'
    }

    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[category]}`}>
        {labels[category]}
      </span>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Document Library</h3>
            <p className="text-sm text-slate-600 mt-1">Templates, generated documents, and filed paperwork</p>
          </div>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Document
          </button>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
          >
            <option value="all">All Categories</option>
            <option value="foreclosure">Foreclosure</option>
            <option value="redemption">Redemption</option>
            <option value="filing">County Filing</option>
            <option value="compliance">Compliance</option>
            <option value="contract">Contract</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="ready">Ready</option>
            <option value="filed">Filed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Documents List */}
      <div className="divide-y divide-slate-100">
        {filteredDocuments.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No documents found</p>
          </div>
        ) : (
          filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="px-6 py-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                {/* Document Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-slate-400" />
                    <h4 className="font-semibold text-slate-900">{doc.name}</h4>
                    {getCategoryBadge(doc.category)}
                    {getStatusBadge(doc.status)}
                  </div>

                  {doc.property && (
                    <p className="text-sm text-slate-600 mb-2 ml-8">
                      Property: {doc.property}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-slate-500 ml-8">
                    <span>Created {doc.createdAt.toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Updated {doc.updatedAt.toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="capitalize">{doc.type}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                  <button
                    className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                    title="View"
                  >
                    <Eye className="w-4 h-4 text-slate-600" />
                  </button>
                  <button
                    className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4 text-slate-600" />
                  </button>
                  {doc.status === 'draft' && (
                    <button
                      className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4 text-slate-600" />
                    </button>
                  )}
                  <button
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Stats */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center justify-between text-sm">
          <p className="text-slate-600">
            Showing {filteredDocuments.length} of {documents.length} documents
          </p>
          <div className="flex gap-4">
            <span className="text-slate-600">
              <strong>{documents.filter(d => d.status === 'draft').length}</strong> Drafts
            </span>
            <span className="text-slate-600">
              <strong>{documents.filter(d => d.status === 'ready').length}</strong> Ready
            </span>
            <span className="text-slate-600">
              <strong>{documents.filter(d => d.status === 'filed').length}</strong> Filed
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
