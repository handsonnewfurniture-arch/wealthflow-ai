'use client'

import Link from 'next/link'
import { TrendingUp, ArrowLeft } from 'lucide-react'

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-xl">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">WealthFlow AI</span>
        </Link>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Get Started</h1>
            <p className="text-gray-300">Authentication Coming Soon</p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 mb-6">
            <p className="text-blue-300 text-center">
              User authentication is currently being configured. Please check back soon to create your account!
            </p>
          </div>

          <Link
            href="/"
            className="flex items-center justify-center space-x-2 w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Already have an account?{' '}
              <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-gray-400 text-sm mt-8">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-gray-300">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-gray-300">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
