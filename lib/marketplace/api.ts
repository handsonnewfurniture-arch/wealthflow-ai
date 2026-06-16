// Marketplace API Helpers

import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

/**
 * Create Supabase client for server-side API routes
 * Uses service role key for admin operations
 */
export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

/**
 * Create Supabase client for authenticated API routes
 * Uses anon key with user session
 */
export function createAuthClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

/**
 * Get current authenticated user from request
 * Returns null if no auth session
 */
export async function getCurrentUser(client: ReturnType<typeof createAuthClient>) {
  const { data: { user }, error } = await client.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

/**
 * Require authentication for API route
 * Throws error with proper response if not authenticated
 */
export async function requireAuth(client: ReturnType<typeof createAuthClient>) {
  const user = await getCurrentUser(client)

  if (!user) {
    throw new Error('Authentication required')
  }

  return user
}
