'use client'

import { useState } from 'react'
import { X, Plus, Calendar, DollarSign, MapPin } from 'lucide-react'
import Button from './ui/Button'
import Input from './ui/Input'
import Badge from './ui/Badge'

interface AddLienModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AddLienModal({ isOpen, onClose, onSuccess }: AddLienModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    parcelId: '',
    address: '',
    county: '',
    state: '',
    purchaseAmount: '',
    interestRate: '',
    purchaseDate: '',
    redemptionDeadline: '',
    propertyType: 'residential',
    notes: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const calculateDaysUntilExpiration = () => {
    if (!formData.redemptionDeadline) return null
    const deadline = new Date(formData.redemptionDeadline)
    const today = new Date()
    const diffTime = deadline.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validate required fields
      if (!formData.address || !formData.county || !formData.state ||
          !formData.purchaseAmount || !formData.interestRate || !formData.purchaseDate) {
        setError('Please fill in all required fields')
        setLoading(false)
        return
      }

      // In production, this would call your API route
      const response = await fetch('/api/portfolio/add-lien', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          purchaseAmount: parseFloat(formData.purchaseAmount),
          interestRate: parseFloat(formData.interestRate),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add lien')
      }

      // Reset form
      setFormData({
        parcelId: '',
        address: '',
        county: '',
        state: '',
        purchaseAmount: '',
        interestRate: '',
        purchaseDate: '',
        redemptionDeadline: '',
        propertyType: 'residential',
        notes: ''
      })

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to add lien. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const daysUntilExpiration = calculateDaysUntilExpiration()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Add Tax Lien to Portfolio</h2>
            <p className="text-gray-400">Track your lien investment and monitor redemption deadlines</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Property Information */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-emerald-400" />
              Property Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Property Address *"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main St, City, State ZIP"
                  required
                />
              </div>

              <Input
                label="Parcel ID / Certificate Number"
                name="parcelId"
                value={formData.parcelId}
                onChange={handleChange}
                placeholder="SR-2024-1234"
              />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Property Type *
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className="input-glass w-full"
                  required
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                  <option value="industrial">Industrial</option>
                </select>
              </div>

              <Input
                label="County *"
                name="county"
                value={formData.county}
                onChange={handleChange}
                placeholder="Sarasota"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  State *
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="input-glass w-full"
                  required
                >
                  <option value="">Select State</option>
                  <option value="FL">Florida</option>
                  <option value="AZ">Arizona</option>
                  <option value="IA">Iowa</option>
                  <option value="IL">Illinois</option>
                  <option value="IN">Indiana</option>
                  <option value="MD">Maryland</option>
                  <option value="NJ">New Jersey</option>
                  <option value="OH">Ohio</option>
                  <option value="TX">Texas</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-gold-400" />
              Financial Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Purchase Amount *"
                name="purchaseAmount"
                type="number"
                step="0.01"
                value={formData.purchaseAmount}
                onChange={handleChange}
                placeholder="8500.00"
                required
              />

              <Input
                label="Interest Rate (%) *"
                name="interestRate"
                type="number"
                step="0.1"
                value={formData.interestRate}
                onChange={handleChange}
                placeholder="18.0"
                required
              />
            </div>
          </div>

          {/* Timeline Information */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-emerald-400" />
              Important Dates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Purchase Date *"
                name="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={handleChange}
                required
              />

              <div>
                <Input
                  label="Redemption Deadline *"
                  name="redemptionDeadline"
                  type="date"
                  value={formData.redemptionDeadline}
                  onChange={handleChange}
                  required
                />
                {daysUntilExpiration !== null && (
                  <div className="mt-2">
                    <Badge
                      variant={
                        daysUntilExpiration < 30
                          ? 'red'
                          : daysUntilExpiration < 90
                          ? 'gold'
                          : 'emerald'
                      }
                      className="text-xs"
                    >
                      {daysUntilExpiration > 0
                        ? `${daysUntilExpiration} days until expiration`
                        : 'EXPIRED'}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional information about this lien..."
              rows={3}
              className="input-glass w-full resize-none"
            />
          </div>

          {/* Preview Summary */}
          {formData.purchaseAmount && formData.interestRate && formData.purchaseDate && (
            <div className="glass-card p-4 bg-emerald-500/5 border border-emerald-500/20">
              <h4 className="text-sm font-semibold text-emerald-400 mb-2">Investment Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">Principal</div>
                  <div className="font-semibold">${parseFloat(formData.purchaseAmount).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-400">Rate</div>
                  <div className="font-semibold text-gold-400">{formData.interestRate}%</div>
                </div>
                <div>
                  <div className="text-gray-400">Days Held</div>
                  <div className="font-semibold">
                    {formData.purchaseDate
                      ? Math.floor(
                          (new Date().getTime() - new Date(formData.purchaseDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )
                      : 0}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Est. Value</div>
                  <div className="font-semibold text-emerald-400">
                    ${formData.purchaseAmount && formData.purchaseDate
                      ? (
                          parseFloat(formData.purchaseAmount) *
                          (1 +
                            (parseFloat(formData.interestRate) / 100) *
                              (Math.floor(
                                (new Date().getTime() - new Date(formData.purchaseDate).getTime()) /
                                  (1000 * 60 * 60 * 24)
                              ) /
                                365))
                        ).toLocaleString(undefined, { maximumFractionDigits: 0 })
                      : '0'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                'Adding...'
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Portfolio
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
