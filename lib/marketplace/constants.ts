// Marketplace Constants

export const LEGAL_DISCLAIMER = 'Tax liens and tax deeds involve substantial risk. Information is provided for research and marketplace facilitation only and is not financial, legal, tax, or investment advice. Returns are not guaranteed. Buyers must perform independent due diligence, verify all property and auction information with official county sources, and consult qualified professionals before bidding or purchasing.'

export const LISTING_TYPES = {
  TAX_LIEN: 'tax_lien' as const,
  TAX_DEED: 'tax_deed' as const,
}

export const LISTING_STATUSES = {
  DRAFT: 'draft' as const,
  ACTIVE: 'active' as const,
  PENDING: 'pending' as const,
  SOLD: 'sold' as const,
  EXPIRED: 'expired' as const,
  CANCELLED: 'cancelled' as const,
}

export const PAYMENT_STATUSES = {
  PENDING: 'pending' as const,
  PROCESSING: 'processing' as const,
  PAID: 'paid' as const,
  FAILED: 'failed' as const,
  REFUNDED: 'refunded' as const,
  CANCELLED: 'cancelled' as const,
}

export const TRANSACTION_TYPES = {
  BID_PLACED: 'bid_placed',
  PURCHASE_INITIATED: 'purchase_initiated',
  PURCHASE_COMPLETED: 'purchase_completed',
  PURCHASE_FAILED: 'purchase_failed',
  REFUND_ISSUED: 'refund_issued',
}

export const AUDIT_ACTIONS = {
  LISTING_CREATED: 'listing_created',
  LISTING_UPDATED: 'listing_updated',
  LISTING_PUBLISHED: 'listing_published',
  LISTING_CANCELLED: 'listing_cancelled',
  LISTING_SOLD: 'listing_sold',
  BID_PLACED: 'bid_placed',
  LISTING_PURCHASED: 'listing_purchased',
}

export const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
]

export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'auction_date', label: 'Auction Date' },
]
