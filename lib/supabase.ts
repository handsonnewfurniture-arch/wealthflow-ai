import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type County = {
  id: string
  state: string
  county_name: string
  auction_type: string | null
  next_auction_date: string | null
  auction_website: string | null
  auction_format: string | null
  max_interest_rate: number | null
  redemption_period_months: number | null
  median_home_value: number | null
  population: number | null
  crime_risk_score: number | null
  population_trend: string | null
  competition_level: string | null
  investor_score: number | null
  notes: string | null
  treasurer_url: string | null
  assessor_url: string | null
  gis_url: string | null
  last_scraped_at: string | null
  created_at: string
  updated_at: string
}

export type Opportunity = {
  id: string
  county_id: string
  auction_id: string | null
  parcel_id: string | null
  address: string | null
  property_type: string | null
  assessed_value: number | null
  lien_amount: number | null
  opening_bid: number | null
  interest_rate: number | null
  property_condition: string | null
  flood_zone: boolean
  environmental_risk: boolean
  is_rural: boolean
  is_vacant_land: boolean
  is_high_crime: boolean
  lien_to_value_ratio: number | null
  yield_score: number | null
  value_score: number | null
  crime_score: number | null
  redemption_score: number | null
  competition_score: number | null
  accessibility_score: number | null
  total_score: number | null
  avoid_reason: string | null
  status: string
  created_at: string
  updated_at: string
}

export type Portfolio = {
  id: string
  user_id: string
  opportunity_id: string | null
  county_id: string | null
  parcel_id: string | null
  address: string | null
  purchase_amount: number
  interest_rate: number
  purchase_date: string
  redemption_deadline: string | null
  status: string
  redemption_date: string | null
  redemption_amount: number | null
  profit_amount: number | null
  reinvested: boolean
  reinvestment_date: string | null
  days_to_reinvest: number | null
  acquired_property: boolean
  acquisition_date: string | null
  acquisition_cost: number | null
  estimated_arv: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type User = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  xp_points: number
  xp_level: number
  subscription_tier: string
  subscription_status: string
  stripe_customer_id: string | null
  created_at: string
  updated_at: string
}

export type Lesson = {
  id: string
  title: string
  slug: string
  description: string | null
  category: string
  difficulty: string
  xp_reward: number
  order_index: number
  content: string
  duration_minutes: number | null
  tier_required: string
  created_at: string
  updated_at: string
}

export type Badge = {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  xp_required: number | null
  tier: string | null
  criteria: any
  created_at: string
}

// Marketplace types
export type MarketplaceListing = {
  id: string
  seller_id: string
  seller_name: string | null
  seller_rating: number | null
  opportunity_id: string | null
  county: string
  state: string
  property_address: string
  parcel_id: string
  property_type: string | null
  assessed_value: number
  original_purchase_price: number
  original_purchase_date: string
  current_value: number
  asking_price: number
  interest_rate: number
  days_held: number
  redemption_deadline: string
  status: 'active' | 'pending' | 'sold' | 'cancelled' | 'expired'
  listing_type: 'fixed_price' | 'auction' | 'best_offer'
  featured: boolean
  description: string | null
  auction_start_date: string | null
  auction_end_date: string | null
  starting_bid: number | null
  reserve_price: number | null
  current_bid: number | null
  bid_count: number
  views_count: number
  saves_count: number
  created_at: string
  updated_at: string
  sold_at: string | null
}

export type MarketplaceBid = {
  id: string
  listing_id: string
  bidder_id: string
  bid_amount: number
  status: 'active' | 'outbid' | 'won' | 'cancelled'
  auto_bid_enabled: boolean
  max_auto_bid: number | null
  created_at: string
  updated_at: string
}

export type MarketplacePurchase = {
  id: string
  listing_id: string
  seller_id: string
  buyer_id: string
  winning_bid_id: string | null
  purchase_price: number
  marketplace_fee: number
  seller_payout: number
  payment_status: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded'
  payment_intent_id: string | null
  assignment_status: 'pending' | 'in_progress' | 'completed' | 'failed'
  assignment_filed_date: string | null
  assignment_completed_date: string | null
  county_confirmation_number: string | null
  assignment_document_url: string | null
  purchase_receipt_url: string | null
  purchased_at: string
  updated_at: string
  completed_at: string | null
}

export type MarketplaceTransaction = {
  id: string
  user_id: string | null
  listing_id: string | null
  bid_id: string | null
  purchase_id: string | null
  transaction_type: string
  description: string
  amount: number | null
  metadata: any | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

export type MarketplaceSaved = {
  id: string
  user_id: string
  listing_id: string
  notify_on_price_change: boolean
  notify_on_bid: boolean
  notify_before_expiration: boolean
  created_at: string
}
