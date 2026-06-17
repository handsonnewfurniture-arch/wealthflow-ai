/**
 * Authentication and Authorization Middleware for Marketplace
 *
 * Provides helper functions for:
 * - Admin role verification
 * - Subscription tier checking
 * - User authentication
 */

import { createAuthClient } from './api'

/**
 * Require admin role for the current user
 * Throws error if user is not authenticated or not an admin
 *
 * @throws Error if not authenticated or not admin
 * @returns User object if admin
 */
export async function requireAdmin() {
  const supabase = createAuthClient()

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('Authentication required')
  }

  // Check if user has admin role
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userError || !userData) {
    throw new Error('User not found')
  }

  if (!['admin', 'superadmin'].includes(userData.role)) {
    throw new Error('Admin access required')
  }

  return user
}

/**
 * Check if a user has one of the required subscription tiers
 *
 * @param userId - The user ID to check
 * @param requiredTiers - Array of acceptable subscription tiers (e.g., ['pro', 'elite'])
 * @returns true if user has required tier, false otherwise
 */
export async function checkSubscriptionTier(
  userId: string,
  requiredTiers: string[]
): Promise<boolean> {
  const supabase = createAuthClient()

  const { data, error } = await supabase
    .from('users')
    .select('subscription_tier')
    .eq('id', userId)
    .single()

  if (error || !data) {
    return false
  }

  return requiredTiers.includes(data.subscription_tier)
}

/**
 * Check if current user is admin (returns boolean instead of throwing)
 *
 * @returns true if current user is admin, false otherwise
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const supabase = createAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return false

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!userData) return false

    return ['admin', 'superadmin'].includes(userData.role)
  } catch {
    return false
  }
}

/**
 * Get current user's subscription tier
 *
 * @returns Subscription tier or 'free' if not authenticated
 */
export async function getUserSubscriptionTier(): Promise<string> {
  try {
    const supabase = createAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return 'free'

    const { data: userData } = await supabase
      .from('users')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()

    return userData?.subscription_tier || 'free'
  } catch {
    return 'free'
  }
}

/**
 * Check if user can access premium content
 *
 * @param userId - User ID to check
 * @param isListingPremium - Whether the listing is marked as premium
 * @param sellerId - ID of the listing seller (sellers always have access)
 * @returns true if user can access premium content
 */
export async function canAccessPremiumContent(
  userId: string | null,
  isListingPremium: boolean,
  sellerId?: string
): Promise<boolean> {
  // Non-premium content is always accessible
  if (!isListingPremium) return true

  // No user = no access to premium
  if (!userId) return false

  // Sellers can always see their own content
  if (sellerId && userId === sellerId) return true

  // Check subscription tier
  const hasRequiredTier = await checkSubscriptionTier(userId, ['pro', 'elite'])
  return hasRequiredTier
}

/**
 * Validate user has permission to modify a listing
 *
 * @param listingId - ID of the listing to check
 * @param userId - ID of user attempting modification
 * @returns true if user is admin or listing owner
 */
export async function canModifyListing(
  listingId: string,
  userId: string
): Promise<boolean> {
  const supabase = createAuthClient()

  // Check if user is admin
  const adminCheck = await isAdmin()
  if (adminCheck) return true

  // Check if user is the listing seller
  const { data: listing } = await supabase
    .from('marketplace_listings')
    .select('seller_id')
    .eq('id', listingId)
    .single()

  return listing?.seller_id === userId
}
