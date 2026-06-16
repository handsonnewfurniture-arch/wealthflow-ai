// Marketplace Types

export type ListingType = 'tax_lien' | 'tax_deed'
export type ListingStatus = 'draft' | 'active' | 'pending' | 'sold' | 'expired' | 'cancelled'
export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'refunded' | 'cancelled'

export interface MarketplaceListing {
  id: string
  seller_id: string
  title: string
  listing_type: ListingType
  property_address: string
  parcel_apn: string
  county: string
  state: string
  auction_name: string | null
  auction_date_time: string | null
  redemption_period: string | null
  starting_bid: number | null
  current_bid: number | null
  buy_now_price: number | null
  estimated_value: number | null
  status: ListingStatus
  notes: string | null
  legal_disclaimer: string
  source: string | null
  source_metadata: Record<string, any>
  created_at: string
  updated_at: string
  published_at: string | null
  sold_at: string | null
}

export interface MarketplaceListingMedia {
  id: string
  listing_id: string
  url: string
  alt_text: string | null
  media_type: string
  sort_order: number
  created_at: string
}

export interface MarketplaceListingDocument {
  id: string
  listing_id: string
  name: string
  url: string
  document_type: string | null
  file_size_bytes: number | null
  created_at: string
}

export interface SavedListing {
  id: string
  user_id: string
  listing_id: string
  created_at: string
}

export interface MarketplaceBid {
  id: string
  listing_id: string
  bidder_id: string
  bid_amount: number
  status: string
  created_at: string
}

export interface MarketplacePurchase {
  id: string
  listing_id: string
  buyer_id: string
  purchase_price: number
  payment_status: PaymentStatus
  transaction_id: string
  created_at: string
}

export interface MarketplaceTransaction {
  id: string
  user_id: string
  listing_id: string | null
  purchase_id: string | null
  bid_id: string | null
  transaction_type: string
  amount: number | null
  status: string
  metadata: Record<string, any>
  created_at: string
}

export interface MarketplaceAuditLog {
  id: string
  listing_id: string | null
  actor_id: string | null
  action: string
  before_data: Record<string, any> | null
  after_data: Record<string, any> | null
  metadata: Record<string, any>
  created_at: string
}

// API request/response types
export interface CreateListingRequest {
  title: string
  listing_type: ListingType
  property_address: string
  parcel_apn: string
  county: string
  state: string
  auction_name?: string
  auction_date_time?: string
  redemption_period?: string
  starting_bid?: number
  buy_now_price?: number
  estimated_value?: number
  notes?: string
  source?: string
  source_metadata?: Record<string, any>
}

export interface UpdateListingRequest extends Partial<CreateListingRequest> {
  status?: ListingStatus
}

export interface ListingFilters {
  query?: string
  state?: string
  county?: string
  listing_type?: ListingType
  status?: ListingStatus
  parcel_apn?: string
  auction_date_from?: string
  auction_date_to?: string
  min_price?: number
  max_price?: number
  sort?: 'newest' | 'oldest' | 'price_low' | 'price_high' | 'auction_date'
  page?: number
  pageSize?: number
}

export interface PlaceBidRequest {
  bid_amount: number
}

export interface PurchaseTrackerItem extends MarketplacePurchase {
  listing?: MarketplaceListing
}
