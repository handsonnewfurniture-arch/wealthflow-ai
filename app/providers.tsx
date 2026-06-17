'use client'

// import { AuthProvider } from '@/lib/auth-context'

export function Providers({ children }: { children: React.ReactNode }) {
  // Auth temporarily disabled - Supabase configuration issue
  // return <AuthProvider>{children}</AuthProvider>
  return <>{children}</>
}
