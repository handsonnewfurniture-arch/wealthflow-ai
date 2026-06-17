'use client'

// import { AuthProvider } from '@/lib/auth-context'

export function Providers({ children }: { children: React.ReactNode }) {
  // Temporarily disabled AuthProvider for debugging
  // return <AuthProvider>{children}</AuthProvider>
  return <>{children}</>
}
