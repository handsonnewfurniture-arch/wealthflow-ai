'use client'

import { useState } from 'react'
import {
  Search,
  Filter,
  MapPin,
  DollarSign,
  Calendar,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
  Star,
  ChevronDown
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

export default function Counties() {
  const [searchQuery, setSearchQuery] = useState('')
  const [stateFilter, setStateFilter] = useState('all')
  const [sortBy, setSortBy] = useState('score')

  // Mock counties data
  const counties = [
    {
      id: 1,
      state: 'FL',
      county: 'Sarasota',
      auctionType: 'Tax Lien',
      auctionDate: '2026-07-25',
      auctionFormat: 'Online',
      maxInterestRate: 18.0,
      redemptionMonths: 24,
      medianHomeValue: 465000,
      population: 434000,
      crimeScore: 30,
      competitionLevel: 'medium',
      investorScore: 98,
      auctionWebsite: 'https://www.sarasotataxcollector.com'
    },
    {
      id: 2,
      state: 'FL',
      county: 'St Johns',
      auctionType: 'Tax Lien',
      auctionDate: '2026-07-28',
      auctionFormat: 'Online',
      maxInterestRate: 18.0,
      redemptionMonths: 24,
      medianHomeValue: 425000,
      population: 273000,
      crimeScore: 18,
      competitionLevel: 'medium',
      investorScore: 98,
      auctionWebsite: 'https://www.sjctax.us'
    },
    {
      id: 3,
      state: 'IA',
      county: 'Polk',
      auctionType: 'Tax Deed',
      auctionDate: '2026-10-15',
      auctionFormat: 'In-Person',
      maxInterestRate: 24.0,
      redemptionMonths: 18,
      medianHomeValue: 245000,
      population: 490000,
      crimeScore: 38,
      competitionLevel: 'medium',
      investorScore: 94,
      auctionWebsite: 'https://www.polkcountyiowa.gov'
    },
    {
      id: 4,
      state: 'AZ',
      county: 'Yavapai',
      auctionType: 'Tax Lien',
      auctionDate: '2026-09-10',
      auctionFormat: 'In-Person',
      maxInterestRate: 16.0,
      redemptionMonths: 36,
      medianHomeValue: 385000,
      population: 234000,
      crimeScore: 25,
      competitionLevel: 'low',
      investorScore: 92,
      auctionWebsite: 'https://www.yavapai.us'
    },
    {
      id: 5,
      state: 'FL',
      county: 'Lake',
      auctionType: 'Tax Lien',
      auctionDate: '2026-07-18',
      auctionFormat: 'Online',
      maxInterestRate: 18.0,
      redemptionMonths: 24,
      medianHomeValue: 285000,
      population: 367000,
      crimeScore: 35,
      competitionLevel: 'low',
      investorScore: 85,
      auctionWebsite: 'https://www.laketax.com'
    },
    {
      id: 6,
      state: 'IN',
      county: 'Hamilton',
      auctionType: 'Tax Lien',
      auctionDate: '2026-10-05',
      auctionFormat: 'Online',
      maxInterestRate: 15.0,
      redemptionMonths: 12,
      medianHomeValue: 395000,
      population: 347000,
      crimeScore: 15,
      competitionLevel: 'medium',
      investorScore: 88,
      auctionWebsite: 'https://www.hamiltoncounty.in.gov'
    }
  ]

  const getCrimeLevel = (score: number) => {
    if (score <= 25) return { label: 'Very Low', variant: 'emerald' as const }
    if (score <= 40) return { label: 'Low', variant: 'emerald' as const }
    if (score <= 60) return { label: 'Moderate', variant: 'gold' as const }
    return { label: 'High', variant: 'red' as const }
  }

  const getCompetitionColor = (level: string) => {
    if (level === 'low') return 'emerald'
    if (level === 'medium') return 'gold'
    return 'red'
  }

  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />

      <div className="pt-20 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="page-header mb-4">County Database</h1>
            <p className="text-xl text-gray-300">
              Explore 20+ high-yield counties with auction dates, interest rates, and investor scores
            </p>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search counties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-glass pl-10 w-full"
                />
              </div>

              <div className="relative">
                <select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="input-glass w-full appearance-none pr-10"
                >
                  <option value="all">All States</option>
                  <option value="FL">Florida</option>
                  <option value="AZ">Arizona</option>
                  <option value="IA">Iowa</option>
                  <option value="IL">Illinois</option>
                  <option value="IN">Indiana</option>
                  <option value="OH">Ohio</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-glass w-full appearance-none pr-10"
                >
                  <option value="score">Highest Score</option>
                  <option value="interest">Highest Interest</option>
                  <option value="date">Next Auction</option>
                  <option value="value">Median Value</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              <Button variant="secondary" className="flex items-center justify-center">
                <Filter className="w-5 h-5 mr-2" />
                More Filters
              </Button>
            </div>
          </Card>

          {/* Top Counties Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Highest Yield</div>
                  <div className="text-2xl font-bold">Polk, IA</div>
                </div>
                <Badge variant="gold">24%</Badge>
              </div>
              <p className="text-sm text-gray-400">
                Des Moines metro. Tax deed state with exceptional interest rates.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Lowest Crime</div>
                  <div className="text-2xl font-bold">Hamilton, IN</div>
                </div>
                <Badge variant="emerald">Score: 15</Badge>
              </div>
              <p className="text-sm text-gray-400">
                Carmel/Fishers area. Extremely safe, high-value properties.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Next Auction</div>
                  <div className="text-2xl font-bold">Lake, FL</div>
                </div>
                <Badge>Jul 18</Badge>
              </div>
              <p className="text-sm text-gray-400">
                Upcoming auction with 189 parcels available online.
              </p>
            </Card>
          </div>

          {/* Counties Grid */}
          <div className="space-y-4">
            {counties.map((county) => {
              const crimeLevel = getCrimeLevel(county.crimeScore)

              return (
                <Card key={county.id} hover className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* County Info */}
                    <div className="lg:col-span-3">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <MapPin className="w-4 h-4 text-emerald-400" />
                            <h3 className="text-xl font-bold">{county.county}, {county.state}</h3>
                          </div>
                          <p className="text-sm text-gray-400">{county.auctionType}</p>
                        </div>
                        <button className="text-gray-400 hover:text-gold-400 transition-colors">
                          <Star className="w-5 h-5" />
                        </button>
                      </div>
                      <Badge
                        variant={county.investorScore >= 95 ? 'emerald' : county.investorScore >= 85 ? 'gold' : 'gray'}
                        className="text-sm"
                      >
                        Score: {county.investorScore}
                      </Badge>
                    </div>

                    {/* Metrics Grid */}
                    <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs text-gray-400 mb-1 flex items-center">
                          <DollarSign className="w-3 h-3 mr-1" />
                          Interest Rate
                        </div>
                        <div className="text-lg font-bold text-gold-400">
                          {county.maxInterestRate}%
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-400 mb-1 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Next Auction
                        </div>
                        <div className="text-sm font-semibold">
                          {new Date(county.auctionDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-400 mb-1">Format</div>
                        <Badge variant="blue" className="text-xs">
                          {county.auctionFormat}
                        </Badge>
                      </div>

                      <div>
                        <div className="text-xs text-gray-400 mb-1">Median Value</div>
                        <div className="text-sm font-semibold">
                          ${(county.medianHomeValue / 1000).toFixed(0)}k
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-400 mb-1">Crime Risk</div>
                        <Badge variant={crimeLevel.variant} className="text-xs">
                          {crimeLevel.label}
                        </Badge>
                      </div>

                      <div>
                        <div className="text-xs text-gray-400 mb-1">Competition</div>
                        <Badge variant={getCompetitionColor(county.competitionLevel)} className="text-xs capitalize">
                          {county.competitionLevel}
                        </Badge>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:col-span-3 flex flex-col justify-between space-y-3">
                      <Button variant="primary" size="sm" className="w-full">
                        View Opportunities
                      </Button>
                      <a
                        href={county.auctionWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary text-center text-sm flex items-center justify-center"
                      >
                        Auction Website
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div>
                        Population: {(county.population / 1000).toFixed(0)}k
                        {' · '}
                        Redemption: {county.redemptionMonths} months
                      </div>
                      {county.investorScore >= 90 && (
                        <div className="flex items-center text-emerald-400">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Top Opportunity
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <Button variant="secondary">Load More Counties</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
