'use client'

import { useState } from 'react'
import { Check, X, Zap, Crown, Rocket } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for beginners',
      icon: Rocket,
      monthlyPrice: 29,
      annualPrice: 290, // ~17% discount
      features: [
        'County database access',
        'Auction calendar',
        'Beginner lessons',
        'Weekly newsletter',
        'Basic opportunity feed',
        'Community forum access'
      ],
      notIncluded: [
        'Investor scores',
        'Portfolio tracking',
        'AI opportunity finder',
        'Advanced analytics'
      ],
      cta: 'Start Free Trial',
      popular: false,
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER
    },
    {
      name: 'Pro',
      description: 'For serious investors',
      icon: Zap,
      monthlyPrice: 79,
      annualPrice: 790, // ~17% discount
      features: [
        'Everything in Starter',
        'Investor scores (0-100)',
        'County rankings',
        'Portfolio turnover tracker',
        'Downloadable spreadsheets',
        'Monthly opportunity reports',
        'Crime risk analysis',
        'Advanced lessons',
        'Email support'
      ],
      notIncluded: [
        'AI opportunity finder',
        'Priority support',
        'Capital deployment tools'
      ],
      cta: 'Start Free Trial',
      popular: true,
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO
    },
    {
      name: 'Elite',
      description: 'Maximum intelligence',
      icon: Crown,
      monthlyPrice: 199,
      annualPrice: 1990, // ~17% discount
      features: [
        'Everything in Pro',
        'AI opportunity finder',
        'Advanced analytics dashboard',
        'Capital deployment tools',
        'Institutional-style reports',
        'Priority support',
        'Custom county research',
        'Early access to new features',
        'One-on-one strategy session'
      ],
      notIncluded: [],
      cta: 'Start Free Trial',
      popular: false,
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ELITE
    }
  ]

  const handleCheckout = async (stripePriceId: string | undefined) => {
    if (!stripePriceId) {
      alert('Stripe integration not configured. Please set up your Stripe price IDs in .env')
      return
    }

    try {
      // Call our checkout API endpoint
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: stripePriceId,
          // In production, get userId from auth session
          userId: undefined,
        }),
      })

      const data = await response.json()

      if (data.error) {
        alert('Error creating checkout session: ' + data.error)
        return
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />

      <div className="pt-20 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="page-header mb-4">Simple, Transparent Pricing</h1>
            <p className="text-xl text-gray-300 mb-8">
              Choose the plan that fits your investment goals
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-navy-900/50 border border-white/10 rounded-xl p-1">
              <button
                className={`px-6 py-2 rounded-lg transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-emerald-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setBillingCycle('monthly')}
              >
                Monthly
              </button>
              <button
                className={`px-6 py-2 rounded-lg transition-all ${
                  billingCycle === 'annual'
                    ? 'bg-emerald-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setBillingCycle('annual')}
              >
                Annual
                <Badge variant="gold" className="ml-2 text-xs">
                  Save 17%
                </Badge>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan) => {
              const Icon = plan.icon
              const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice

              return (
                <Card
                  key={plan.name}
                  className={`p-8 space-y-6 relative ${
                    plan.popular ? 'border-2 border-emerald-500/50' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge variant="emerald" className="px-4 py-1">
                        MOST POPULAR
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-3 rounded-xl ${
                        plan.popular
                          ? 'bg-emerald-500/20'
                          : plan.name === 'Elite'
                          ? 'bg-gold-500/20'
                          : 'bg-navy-800'
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          plan.popular
                            ? 'text-emerald-400'
                            : plan.name === 'Elite'
                            ? 'text-gold-400'
                            : 'text-gray-400'
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{plan.name}</h3>
                      <p className="text-sm text-gray-400">{plan.description}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-5xl font-bold">
                        ${price}
                      </span>
                      <span className="text-gray-400">
                        /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                      </span>
                    </div>
                    {billingCycle === 'annual' && (
                      <p className="text-sm text-emerald-400 mt-2">
                        ${(price / 12).toFixed(0)}/month billed annually
                      </p>
                    )}
                  </div>

                  <Button
                    variant={plan.popular ? 'primary' : plan.name === 'Elite' ? 'gold' : 'secondary'}
                    className="w-full"
                    onClick={() => handleCheckout(plan.stripePriceId)}
                  >
                    {plan.cta}
                  </Button>

                  <div className="space-y-3 pt-6 border-t border-white/10">
                    <p className="text-sm font-semibold text-gray-300">
                      What's included:
                    </p>
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check
                          className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                            plan.popular
                              ? 'text-emerald-400'
                              : plan.name === 'Elite'
                              ? 'text-gold-400'
                              : 'text-gray-400'
                          }`}
                        />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}

                    {plan.notIncluded.length > 0 && (
                      <>
                        <div className="pt-4">
                          <p className="text-sm font-semibold text-gray-500 mb-3">
                            Not included:
                          </p>
                          {plan.notIncluded.map((feature, index) => (
                            <div key={index} className="flex items-start space-x-3 mb-2">
                              <X className="w-5 h-5 flex-shrink-0 mt-0.5 text-gray-600" />
                              <span className="text-sm text-gray-500">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Feature Comparison Table */}
          <div className="mb-16">
            <h2 className="section-title text-center mb-8">Feature Comparison</h2>
            <Card className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 font-semibold">Feature</th>
                    <th className="text-center p-4 font-semibold">Starter</th>
                    <th className="text-center p-4 font-semibold">Pro</th>
                    <th className="text-center p-4 font-semibold">Elite</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-white/10">
                    <td className="p-4">County Database</td>
                    <td className="text-center p-4">
                      <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-4">Auction Calendar</td>
                    <td className="text-center p-4">
                      <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-4">Investor Scores (0-100)</td>
                    <td className="text-center p-4">
                      <X className="w-5 h-5 text-gray-600 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-4">Portfolio Tracking</td>
                    <td className="text-center p-4">
                      <X className="w-5 h-5 text-gray-600 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-4">Crime Risk Analysis</td>
                    <td className="text-center p-4">
                      <X className="w-5 h-5 text-gray-600 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-4">AI Opportunity Finder</td>
                    <td className="text-center p-4">
                      <X className="w-5 h-5 text-gray-600 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <X className="w-5 h-5 text-gray-600 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <Check className="w-5 h-5 text-gold-400 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-4">Capital Deployment Tools</td>
                    <td className="text-center p-4">
                      <X className="w-5 h-5 text-gray-600 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <X className="w-5 h-5 text-gray-600 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <Check className="w-5 h-5 text-gold-400 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4">Priority Support</td>
                    <td className="text-center p-4">
                      <X className="w-5 h-5 text-gray-600 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <X className="w-5 h-5 text-gray-600 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <Check className="w-5 h-5 text-gold-400 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="section-title text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-bold mb-2">Do you offer a free trial?</h3>
                <p className="text-gray-400">
                  Yes! All plans include a 14-day free trial. No credit card required to start.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">Can I cancel anytime?</h3>
                <p className="text-gray-400">
                  Absolutely. You can cancel your subscription at any time from your account settings. No questions asked.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-400">
                  We accept all major credit cards (Visa, Mastercard, American Express) through our secure Stripe integration.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">Can I upgrade or downgrade my plan?</h3>
                <p className="text-gray-400">
                  Yes. You can upgrade or downgrade your plan at any time. Changes are prorated automatically.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">Is my data secure?</h3>
                <p className="text-gray-400">
                  Yes. We use industry-standard encryption and security practices. All payment processing is handled securely by Stripe. We never store your credit card information.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold mb-2">Do you offer refunds?</h3>
                <p className="text-gray-400">
                  We offer a 30-day money-back guarantee. If you're not satisfied with Hands On Tax Liens within the first 30 days, contact support for a full refund.
                </p>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <Card className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Build Your Tax Lien Portfolio?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join investors earning 12-24% returns on secured real estate liens
            </p>
            <Button variant="gold" size="lg" onClick={() => window.location.href = '/dashboard'}>
              Start Your Free Trial
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required · 14-day free trial · Cancel anytime
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
