/**
 * Subscribe Section
 * Newsletter signup embedded in article feed
 */

'use client'

import { useState } from 'react'
import { Mail, ArrowRight, Check } from 'lucide-react'

export default function SubscribeSection() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    setSubscribed(true)

    // Reset after 3 seconds
    setTimeout(() => {
      setSubscribed(false)
      setEmail('')
    }, 3000)
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 md:p-12 text-white shadow-xl border border-slate-700">
      <div className="max-w-2xl mx-auto text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-orange-500/20">
          <Mail className="w-8 h-8 text-orange-400" />
        </div>

        {/* Heading */}
        <h3 className="font-serif text-3xl md:text-4xl font-bold mb-4">
          Stay Informed on Tax Lien Investing
        </h3>

        {/* Description */}
        <p className="text-slate-300 text-lg mb-8 leading-relaxed">
          Get weekly insights, case studies, and market analysis delivered to your inbox.
          Join 12,000+ investors who trust our research.
        </p>

        {/* Subscribe form */}
        {!subscribed ? (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-5 py-3.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                'Subscribing...'
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-center gap-2 text-emerald-400 text-lg font-medium">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            Successfully subscribed!
          </div>
        )}

        {/* Privacy note */}
        <p className="text-slate-400 text-sm mt-6">
          No spam. Unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </div>
  )
}
