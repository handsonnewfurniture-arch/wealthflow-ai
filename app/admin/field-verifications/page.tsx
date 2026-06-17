/**
 * Admin Field Verification Queue
 * Review and approve/reject user-submitted field verifications
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import {
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  AlertCircle,
  Eye,
  Clock,
  Award
} from 'lucide-react'

interface Verification {
  id: string
  status: string
  photo_urls: string[]
  video_urls: string[]
  uploaded_at: string
  approved_at: string | null
  rejected_at: string | null
  gps_latitude: number | null
  gps_longitude: number | null
  photo_timestamp: string | null
  distance_from_property_feet: number | null
  admin_notes: string | null
  rejection_reason: string | null
  contributor: {
    id: string
    email: string
    full_name: string
  }
  listing: {
    id: string
    title: string
    property_address: string
    county: string
    state: string
  }
  reviewer: {
    id: string
    full_name: string
  } | null
}

interface Stats {
  pending: number
  approved: number
  rejected: number
  total: number
}

export default function AdminFieldVerificationsPage() {
  const router = useRouter()
  const [verifications, setVerifications] = useState<Verification[]>([])
  const [stats, setStats] = useState<Stats>({ pending: 0, approved: 0, rejected: 0, total: 0 })
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('pending')
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [premiumDays, setPremiumDays] = useState(7)
  const [adminNotes, setAdminNotes] = useState('')

  useEffect(() => {
    fetchVerifications()
  }, [statusFilter])

  const fetchVerifications = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/field-verifications?status=${statusFilter}`)
      const data = await response.json()

      setVerifications(data.verifications || [])
      setStats(data.stats || { pending: 0, approved: 0, rejected: 0, total: 0 })
    } catch (error) {
      console.error('Failed to fetch verifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (verificationId: string) => {
    if (!confirm(`Approve verification and grant ${premiumDays} days of premium access?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/field-verifications/${verificationId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ premiumDays, adminNotes })
      })

      const data = await response.json()

      if (response.ok) {
        alert(data.message)
        setSelectedVerification(null)
        fetchVerifications()
      } else {
        alert(data.error || 'Approval failed')
      }
    } catch (error) {
      console.error('Approval error:', error)
      alert('Approval failed')
    }
  }

  const handleReject = async (verificationId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason')
      return
    }

    if (!confirm('Reject this verification? Contributor will not earn rewards.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/field-verifications/${verificationId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectionReason })
      })

      const data = await response.json()

      if (response.ok) {
        alert(data.message)
        setSelectedVerification(null)
        setRejectionReason('')
        fetchVerifications()
      } else {
        alert(data.error || 'Rejection failed')
      }
    } catch (error) {
      console.error('Rejection error:', error)
      alert('Rejection failed')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="emerald">Approved</Badge>
      case 'rejected':
        return <Badge variant="red">Rejected</Badge>
      case 'pending':
        return <Badge variant="gold">Pending Review</Badge>
      default:
        return <Badge variant="gray">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />

      <div className="pt-20 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Field Verification Queue</h1>
            <p className="text-gray-400">
              Review user-submitted property verifications and grant rewards
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <p className="text-sm text-gray-400 mb-1">Pending Review</p>
              <p className="text-2xl font-bold text-gold-400">{stats.pending}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-400 mb-1">Approved</p>
              <p className="text-2xl font-bold text-emerald-400">{stats.approved}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-400 mb-1">Rejected</p>
              <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-gray-400 mb-1">Total Submissions</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-4 mb-6">
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'pending' ? 'primary' : 'ghost'}
                onClick={() => setStatusFilter('pending')}
                size="sm"
              >
                Pending ({stats.pending})
              </Button>
              <Button
                variant={statusFilter === 'approved' ? 'primary' : 'ghost'}
                onClick={() => setStatusFilter('approved')}
                size="sm"
              >
                Approved ({stats.approved})
              </Button>
              <Button
                variant={statusFilter === 'rejected' ? 'primary' : 'ghost'}
                onClick={() => setStatusFilter('rejected')}
                size="sm"
              >
                Rejected ({stats.rejected})
              </Button>
              <Button
                variant={statusFilter === 'all' ? 'primary' : 'ghost'}
                onClick={() => setStatusFilter('all')}
                size="sm"
              >
                All ({stats.total})
              </Button>
            </div>
          </Card>

          {/* Verifications List */}
          {loading ? (
            <Card className="p-12 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-400">Loading verifications...</p>
            </Card>
          ) : verifications.length === 0 ? (
            <Card className="p-12 text-center">
              <CheckCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No {statusFilter} verifications</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {verifications.map((verification) => (
                <Card key={verification.id} className="p-6">
                  <div className="flex gap-6">
                    {/* Photos Preview */}
                    <div className="flex-shrink-0">
                      <div className="grid grid-cols-3 gap-2 w-48">
                        {verification.photo_urls.slice(0, 3).map((url, i) => (
                          <img
                            key={i}
                            src={url}
                            alt={`Preview ${i + 1}`}
                            className="w-14 h-14 object-cover rounded"
                          />
                        ))}
                      </div>
                      {verification.photo_urls.length > 3 && (
                        <p className="text-xs text-gray-500 mt-1">
                          +{verification.photo_urls.length - 3} more
                        </p>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-grow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">
                            {verification.listing.title}
                          </h3>
                          <div className="flex items-center gap-1 text-sm text-gray-400 mb-2">
                            <MapPin className="w-4 h-4" />
                            {verification.listing.property_address}, {verification.listing.county}, {verification.listing.state}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {verification.contributor.full_name} ({verification.contributor.email})
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(verification.uploaded_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        {getStatusBadge(verification.status)}
                      </div>

                      {/* Verification Metadata */}
                      <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                        {verification.gps_latitude && verification.gps_longitude && (
                          <div>
                            <p className="text-gray-500">GPS Coordinates</p>
                            <p className="font-mono text-emerald-400">
                              {verification.gps_latitude.toFixed(6)}, {verification.gps_longitude.toFixed(6)}
                            </p>
                          </div>
                        )}
                        {verification.distance_from_property_feet !== null && (
                          <div>
                            <p className="text-gray-500">Distance from Property</p>
                            <p className={verification.distance_from_property_feet <= 100 ? 'text-emerald-400' : 'text-yellow-400'}>
                              {verification.distance_from_property_feet}ft
                            </p>
                          </div>
                        )}
                        {verification.photo_timestamp && (
                          <div>
                            <p className="text-gray-500">Photo Taken</p>
                            <p>{new Date(verification.photo_timestamp).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>

                      {/* Admin Notes */}
                      {verification.admin_notes && (
                        <Card className="p-3 bg-yellow-500/10 border-yellow-500/20 text-sm mb-3">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-yellow-400 mb-1">Warnings:</p>
                              <p className="text-yellow-200">{verification.admin_notes}</p>
                            </div>
                          </div>
                        </Card>
                      )}

                      {/* Rejection Reason */}
                      {verification.rejection_reason && (
                        <Card className="p-3 bg-red-500/10 border-red-500/20 text-sm mb-3">
                          <p className="font-semibold text-red-400 mb-1">Rejection Reason:</p>
                          <p className="text-red-200">{verification.rejection_reason}</p>
                        </Card>
                      )}

                      {/* Actions */}
                      {verification.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setSelectedVerification(verification)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/marketplace/${verification.listing.id}`)}
                          >
                            View Listing
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedVerification && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Review Field Verification</h2>

            {/* Photo Gallery */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {selectedVerification.photo_urls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Photo ${i + 1}`}
                  className="w-full aspect-square object-cover rounded-lg cursor-pointer hover:opacity-80"
                  onClick={() => window.open(url, '_blank')}
                />
              ))}
            </div>

            {/* Video Gallery */}
            {selectedVerification.video_urls.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-6">
                {selectedVerification.video_urls.map((url, i) => (
                  <video key={i} src={url} controls className="w-full rounded-lg" />
                ))}
              </div>
            )}

            {/* Approval Form */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Premium Days to Grant</label>
                <input
                  type="number"
                  value={premiumDays}
                  onChange={(e) => setPremiumDays(Number(e.target.value))}
                  className="input-glass w-32"
                  min={1}
                  max={30}
                />
                <p className="text-xs text-gray-500 mt-1">Recommended: 7 days</p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Admin Notes (Optional)</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="input-glass w-full"
                  rows={2}
                  placeholder="Any notes about this verification..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Rejection Reason (if rejecting)</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="input-glass w-full"
                  rows={2}
                  placeholder="Why is this verification being rejected?"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={() => handleApprove(selectedVerification.id)}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Approve & Grant {premiumDays} Days
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleReject(selectedVerification.id)}
                className="flex items-center gap-2 text-red-400 hover:text-red-300"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedVerification(null)
                  setRejectionReason('')
                  setAdminNotes('')
                }}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
