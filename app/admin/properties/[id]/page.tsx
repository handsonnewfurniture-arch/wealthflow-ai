/**
 * Admin Upload Interface
 *
 * Page for admins to upload and manage media for a specific listing
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import MediaUploader from '@/components/MediaUploader'
import MediaGallery from '@/components/MediaGallery'
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Star,
  Image,
  FileText,
  Upload
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
  listing_type: string
}

export default function AdminUploadPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'photos' | 'videos' | 'documents'>('photos')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    fetchListing()
  }, [params.id])

  const fetchListing = async () => {
    try {
      const response = await fetch(`/api/marketplace/listings/${params.id}`)
      const data = await response.json()

      setListing(data.listing || data)
    } catch (error) {
      console.error('Failed to fetch listing:', error)
    } finally {
      setLoading(false)
    }
  }

  // Toggle premium status
  const togglePremium = async () => {
    if (!listing) return

    try {
      const response = await fetch(`/api/marketplace/listings/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_premium: !listing.is_premium })
      })

      if (response.ok) {
        await fetchListing()
      } else {
        alert('Failed to update premium status')
      }
    } catch (error) {
      console.error('Update error:', error)
      alert('Failed to update premium status')
    }
  }

  // Handle upload complete
  const handleUploadComplete = () => {
    // Refresh the media gallery
    setRefreshKey(prev => prev + 1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950">
        <Navbar />
        <div className="pt-20 px-4 pb-12">
          <div className="max-w-6xl mx-auto">
            <div className="animate-spin w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full mx-auto" />
          </div>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-navy-950">
        <Navbar />
        <div className="pt-20 px-4 pb-12">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-gray-400">Listing not found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />

      <div className="pt-20 px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link href="/admin/properties">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Properties
            </Button>
          </Link>

          {/* Property Header */}
          <Card className="p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">{listing.title}</h1>
                  <Badge variant={listing.status === 'active' ? 'emerald' : 'gray'} className="capitalize">
                    {listing.status}
                  </Badge>
                  {listing.is_premium && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gold-400/10 border border-gold-400/30">
                      <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
                      <span className="text-xs font-semibold text-gold-400 uppercase">Premium</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {listing.property_address}
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Parcel: {listing.parcel_apn}</span>
                  </div>
                  {(listing.buy_now_price || listing.starting_bid) && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {listing.buy_now_price
                        ? `$${listing.buy_now_price.toLocaleString()}`
                        : `$${listing.starting_bid?.toLocaleString()} (starting bid)`
                      }
                    </div>
                  )}
                </div>
              </div>

              {/* Premium Toggle */}
              <button
                onClick={togglePremium}
                className={`
                  px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2
                  ${listing.is_premium
                    ? 'bg-gold-400/20 text-gold-400 hover:bg-gold-400/30 border border-gold-400/30'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                  }
                `}
              >
                <Star className={`w-4 h-4 ${listing.is_premium ? 'fill-gold-400' : ''}`} />
                {listing.is_premium ? 'Premium Listing' : 'Make Premium'}
              </button>
            </div>
          </Card>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-white/10">
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-4 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === 'photos'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Image className="w-4 h-4 inline mr-2" />
              Photos & Videos
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-4 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === 'documents'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Documents
            </button>
          </div>

          {/* Photos & Videos Tab */}
          {activeTab === 'photos' && (
            <div className="space-y-6">
              {/* Upload Section */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-emerald-400" />
                  Upload Photos & Videos
                </h2>
                <MediaUploader
                  listingId={params.id}
                  type="media"
                  onUploadComplete={handleUploadComplete}
                />
              </Card>

              {/* Existing Media Gallery */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Image className="w-5 h-5 text-emerald-400" />
                  Existing Media
                </h2>
                <MediaGallery
                  key={refreshKey}
                  listingId={params.id}
                  adminMode={true}
                  onMediaDeleted={() => setRefreshKey(prev => prev + 1)}
                />
              </Card>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              {/* Upload Section */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-emerald-400" />
                  Upload Documents
                </h2>
                <p className="text-sm text-gray-400 mb-4">
                  Upload property documents such as title reports, tax certificates, legal notices, etc.
                </p>
                <MediaUploader
                  listingId={params.id}
                  type="document"
                  accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onUploadComplete={handleUploadComplete}
                />
              </Card>

              {/* Existing Documents List */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  Existing Documents
                </h2>
                <DocumentsList
                  key={refreshKey}
                  listingId={params.id}
                  onDocumentDeleted={() => setRefreshKey(prev => prev + 1)}
                />
              </Card>
            </div>
          )}

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card className="p-6 bg-emerald-400/5 border-emerald-400/20">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Star className="w-4 h-4 text-emerald-400" />
                Premium Content Tips
              </h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Upload 10+ high-quality photos for premium listings</li>
                <li>• Include video tours and drone footage</li>
                <li>• Add legal documents and property reports</li>
                <li>• Premium listings attract more serious investors</li>
              </ul>
            </Card>

            <Card className="p-6 bg-gold-400/5 border-gold-400/20">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Image className="w-4 h-4 text-gold-400" />
                File Requirements
              </h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Images: JPEG, PNG, WebP (max 10MB)</li>
                <li>• Videos: MP4, MOV (max 50MB)</li>
                <li>• Documents: PDF, DOC, DOCX (max 20MB)</li>
                <li>• Maximum 10 files per upload batch</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Documents List Component
function DocumentsList({
  listingId,
  onDocumentDeleted
}: {
  listingId: string
  onDocumentDeleted: () => void
}) {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDocuments()
  }, [listingId])

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`/api/marketplace/listings/${listingId}/documents`)
      const data = await response.json()
      setDocuments(data.documents || [])
    } catch (error) {
      console.error('Failed to fetch documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      const response = await fetch(
        `/api/marketplace/listings/${listingId}/documents?documentId=${documentId}`,
        { method: 'DELETE' }
      )

      if (response.ok) {
        await fetchDocuments()
        onDocumentDeleted()
      } else {
        alert('Failed to delete document')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete document')
    }
  }

  if (loading) {
    return <div className="text-center py-4 text-gray-400">Loading documents...</div>
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <FileText className="w-12 h-12 mx-auto mb-2 text-gray-500" />
        <p>No documents uploaded yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-400" />
            <div>
              <p className="font-medium">{doc.name}</p>
              <p className="text-xs text-gray-400">
                {doc.file_size_bytes
                  ? `${(doc.file_size_bytes / 1024).toFixed(0)} KB`
                  : 'Unknown size'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-emerald-400 hover:text-emerald-300"
            >
              Download
            </a>
            <button
              onClick={() => handleDelete(doc.id)}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
