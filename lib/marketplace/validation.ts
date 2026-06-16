// Marketplace Validation

import type { CreateListingRequest, UpdateListingRequest, ListingType, ListingStatus } from './types'
import { LISTING_TYPES, LISTING_STATUSES } from './constants'

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

/**
 * Validate listing creation request
 */
export function validateCreateListing(data: CreateListingRequest): ValidationResult {
  const errors: ValidationError[] = []

  // Required fields
  if (!data.title || data.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Title is required' })
  }

  if (!data.listing_type || ![LISTING_TYPES.TAX_LIEN, LISTING_TYPES.TAX_DEED].includes(data.listing_type)) {
    errors.push({ field: 'listing_type', message: 'Valid listing type is required' })
  }

  if (!data.property_address || data.property_address.trim().length === 0) {
    errors.push({ field: 'property_address', message: 'Property address is required' })
  }

  if (!data.parcel_apn || data.parcel_apn.trim().length === 0) {
    errors.push({ field: 'parcel_apn', message: 'Parcel/APN is required' })
  }

  if (!data.county || data.county.trim().length === 0) {
    errors.push({ field: 'county', message: 'County is required' })
  }

  if (!data.state || data.state.trim().length === 0) {
    errors.push({ field: 'state', message: 'State is required' })
  }

  // At least one price required
  if (!data.starting_bid && !data.buy_now_price) {
    errors.push({ field: 'pricing', message: 'Either starting bid or buy now price is required' })
  }

  // Validate numeric fields
  if (data.starting_bid !== undefined && data.starting_bid !== null) {
    if (data.starting_bid <= 0) {
      errors.push({ field: 'starting_bid', message: 'Starting bid must be greater than 0' })
    }
  }

  if (data.buy_now_price !== undefined && data.buy_now_price !== null) {
    if (data.buy_now_price <= 0) {
      errors.push({ field: 'buy_now_price', message: 'Buy now price must be greater than 0' })
    }
  }

  if (data.estimated_value !== undefined && data.estimated_value !== null) {
    if (data.estimated_value < 0) {
      errors.push({ field: 'estimated_value', message: 'Estimated value cannot be negative' })
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate listing update request
 */
export function validateUpdateListing(data: UpdateListingRequest): ValidationResult {
  const errors: ValidationError[] = []

  // Validate only provided fields
  if (data.title !== undefined && data.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Title cannot be empty' })
  }

  if (data.listing_type !== undefined && ![LISTING_TYPES.TAX_LIEN, LISTING_TYPES.TAX_DEED].includes(data.listing_type)) {
    errors.push({ field: 'listing_type', message: 'Invalid listing type' })
  }

  if (data.status !== undefined) {
    const validStatuses = Object.values(LISTING_STATUSES)
    if (!validStatuses.includes(data.status)) {
      errors.push({ field: 'status', message: 'Invalid status' })
    }
  }

  if (data.starting_bid !== undefined && data.starting_bid !== null && data.starting_bid <= 0) {
    errors.push({ field: 'starting_bid', message: 'Starting bid must be greater than 0' })
  }

  if (data.buy_now_price !== undefined && data.buy_now_price !== null && data.buy_now_price <= 0) {
    errors.push({ field: 'buy_now_price', message: 'Buy now price must be greater than 0' })
  }

  if (data.estimated_value !== undefined && data.estimated_value !== null && data.estimated_value < 0) {
    errors.push({ field: 'estimated_value', message: 'Estimated value cannot be negative' })
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate listing can be published
 */
export function validatePublishListing(listing: any): ValidationResult {
  const errors: ValidationError[] = []

  // All required fields for publishing
  const requiredFields = [
    'title',
    'listing_type',
    'property_address',
    'parcel_apn',
    'county',
    'state',
    'legal_disclaimer'
  ]

  for (const field of requiredFields) {
    if (!listing[field] || (typeof listing[field] === 'string' && listing[field].trim().length === 0)) {
      errors.push({ field, message: `${field} is required for publishing` })
    }
  }

  // Must have at least one price
  if (!listing.starting_bid && !listing.buy_now_price) {
    errors.push({ field: 'pricing', message: 'Starting bid or buy now price is required' })
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate bid amount
 */
export function validateBidAmount(bidAmount: number, currentBid: number | null, startingBid: number | null): ValidationResult {
  const errors: ValidationError[] = []

  if (bidAmount <= 0) {
    errors.push({ field: 'bid_amount', message: 'Bid amount must be greater than 0' })
  }

  const minBid = currentBid ?? startingBid ?? 0
  if (bidAmount <= minBid) {
    errors.push({
      field: 'bid_amount',
      message: `Bid must be greater than ${currentBid ? 'current bid' : 'starting bid'} of $${minBid.toFixed(2)}`
    })
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Format validation errors for API response
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  if (errors.length === 0) return ''
  if (errors.length === 1) return errors[0].message
  return errors.map(e => `${e.field}: ${e.message}`).join('; ')
}
