/**
 * Legal Services Dashboard
 * Harvey & Mike AI Legal Team for tax lien/deed paperwork and filings
 */

'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import LegalDuo from '@/components/legal/LegalDuo'
import DocumentLibrary from '@/components/legal/DocumentLibrary'
import FilingTracker from '@/components/legal/FilingTracker'
import { Scale, FileText, Calendar, BookOpen, AlertTriangle, CheckCircle } from 'lucide-react'

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState<'duo' | 'documents' | 'filings'>('duo')

  const stats = [
    {
      label: 'Documents Generated',
      value: '47',
      icon: FileText,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: 'Pending Filings',
      value: '3',
      icon: Calendar,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    {
      label: 'Filed This Month',
      value: '12',
      icon: CheckCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      label: 'Urgent Deadlines',
      value: '1',
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50'
    }
  ]

  const services = [
    {
      title: 'Foreclosure Process',
      description: 'Complete foreclosure documentation and county filing assistance',
      features: ['Foreclosure notices', 'Title research', 'County filings', 'Court documents']
    },
    {
      title: 'Redemption Rights',
      description: 'Manage redemption periods and demand letter generation',
      features: ['Demand letters', 'Deadline tracking', 'Payment processing', 'Release forms']
    },
    {
      title: 'County Filings',
      description: 'Automated preparation and filing of county-required documents',
      features: ['Tax deed transfers', 'Notice of sale', 'Certificate assignments', 'Recording fees']
    },
    {
      title: 'Due Diligence',
      description: 'Legal compliance checklists and risk assessment documentation',
      features: ['Title searches', 'Lien reports', 'Property surveys', 'Compliance audits']
    }
  ]

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Navbar />

      <div className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                <Scale className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Legal Services</h1>
                <p className="text-slate-300 text-lg">
                  Harvey Specter & Mike Ross - Your AI Legal Team for Tax Lien Documentation
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-3xl font-bold">{stat.value}</span>
                    </div>
                    <p className="text-sm text-slate-300">{stat.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">What We Can Help With</h2>
              <p className="text-lg text-slate-600">
                Complete legal documentation and filing support for tax lien and deed investors
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all"
                >
                  <h3 className="font-bold text-slate-900 mb-2">{service.title}</h3>
                  <p className="text-sm text-slate-600 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            {/* Tabs */}
            <div className="flex gap-3 mb-8 border-b border-slate-200 pb-4">
              <button
                onClick={() => setActiveTab('duo')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === 'duo'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4" />
                  Ask Harvey & Mike
                </div>
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === 'documents'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Documents
                </div>
              </button>
              <button
                onClick={() => setActiveTab('filings')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === 'filings'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Filing Tracker
                </div>
              </button>
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === 'duo' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Legal Duo Chat */}
                  <div className="lg:col-span-2">
                    <div className="h-[700px]">
                      <LegalDuo />
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Quick Tips */}
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <div className="flex items-start gap-3 mb-4">
                        <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-bold text-blue-900 mb-2">Quick Tips</h3>
                          <ul className="space-y-2 text-sm text-blue-800">
                            <li>• Harvey handles strategy & complex legal issues</li>
                            <li>• Mike drafts documents & keeps you organized</li>
                            <li>• Ask about foreclosure paperwork, county filings, or compliance</li>
                            <li>• Upload property details for customized documents</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Recent Documents */}
                    <div className="bg-white rounded-xl p-6 border border-slate-200">
                      <h3 className="font-bold text-slate-900 mb-4">Recent Documents</h3>
                      <div className="space-y-3">
                        {[
                          { name: 'Foreclosure Notice', date: 'Today' },
                          { name: 'Redemption Demand', date: 'Yesterday' },
                          { name: 'County Filing Form', date: '2 days ago' }
                        ].map((doc, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-slate-400" />
                              <span className="text-slate-700">{doc.name}</span>
                            </div>
                            <span className="text-slate-500">{doc.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <DocumentLibrary />
              )}

              {activeTab === 'filings' && (
                <FilingTracker />
              )}
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="bg-slate-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Need Help With Legal Documentation?</h2>
            <p className="text-slate-300 text-lg mb-8">
              Our AI legal team is available 24/7 to assist with foreclosure paperwork, county filings,
              and legal compliance for your tax lien and deed investments.
            </p>
            <button className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-colors">
              Start a Conversation with Harvey & Mike
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
