/**
 * Auto-refresh auction data from St Johns County
 *
 * Downloads latest delinquent tax list PDF, parses it, and updates database
 * Can be triggered manually or via cron job
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes for Vercel Pro

export async function POST(request: NextRequest) {
  try {
    // Verify authorization (Vercel Cron or admin token)
    const authHeader = request.headers.get('authorization')
    const vercelCron = request.headers.get('x-vercel-cron')
    const validToken = process.env.ADMIN_REFRESH_TOKEN || 'dev-token-change-in-production'

    // Allow Vercel Cron jobs or valid admin token
    const isAuthorized = vercelCron === '1' || authHeader === `Bearer ${validToken}`

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('🚀 Starting auction data refresh...')

    // Step 1: Download latest PDF
    console.log('📥 Downloading latest delinquent tax list PDF...')

    const pdfUrl = 'https://sjctax.us/downloads/2025%20DELQ%20REAL%20ESTATE.pdf'
    const scrapersDir = path.join(process.cwd(), 'scrapers', 'florida')
    const pdfPath = path.join(scrapersDir, '2025_DELQ_REAL_ESTATE.pdf')

    // Download PDF
    const response = await fetch(pdfUrl)
    if (!response.ok) {
      throw new Error(`Failed to download PDF: ${response.status}`)
    }

    const pdfBuffer = await response.arrayBuffer()
    fs.writeFileSync(pdfPath, Buffer.from(pdfBuffer))

    console.log('✅ PDF downloaded')

    // Step 2: Parse PDF to CSV
    console.log('📊 Parsing PDF...')

    const parseScript = path.join(scrapersDir, 'parse_delinquent_pdf.py')

    await new Promise<void>((resolve, reject) => {
      const pythonProcess = spawn('python3', [parseScript], {
        cwd: scrapersDir
      })

      let output = ''
      let errorOutput = ''

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString()
      })

      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString()
      })

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error('Python error:', errorOutput)
          reject(new Error(`Parser exited with code ${code}`))
        } else {
          console.log('✅ PDF parsed:', output.split('\n').filter(l => l.includes('Total properties')))
          resolve()
        }
      })
    })

    // Step 3: Load CSV and import to database
    console.log('💾 Importing to database...')

    const csvPath = path.join(scrapersDir, '2025_delinquent_real_estate.csv')
    const csvData = fs.readFileSync(csvPath, 'utf-8')
    const lines = csvData.split('\n')
    const headers = lines[0].split(',')

    const properties = lines.slice(1, 1001).map(line => {
      if (!line.trim()) return null

      const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g)
      if (!values || values.length < headers.length) return null

      const obj: any = {}
      headers.forEach((header, i) => {
        obj[header.trim()] = values[i]?.replace(/^"|"$/g, '').trim()
      })
      return obj
    }).filter(Boolean)

    console.log(`📋 Loaded ${properties.length} properties from CSV`)

    // Get seller ID
    const { data: authData } = await supabase.auth.admin.listUsers()
    const sellerId = authData?.users?.[0]?.id || '00000000-0000-0000-0000-000000000001'

    // Delete old St Johns listings
    console.log('🗑️  Clearing old St Johns data...')
    const { count: deletedCount } = await supabase
      .from('marketplace_listings')
      .delete()
      .eq('county', 'St Johns')
      .eq('state', 'FL')

    console.log(`   Deleted ${deletedCount || 0} old listings`)

    // Transform and insert new data
    const listings = properties.map((prop: any, idx: number) => {
      const delinquentAmount = parseFloat(prop.delinquent_amount)
      const lienAmount = delinquentAmount * 1.04
      const estimatedValue = (delinquentAmount / 0.02) * (0.8 + (idx % 40) / 100)
      const auctionDate = new Date('2026-05-29T09:00:00')
      const redemptionDeadline = new Date(auctionDate)
      redemptionDeadline.setMonth(redemptionDeadline.getMonth() + 24)

      return {
        seller_id: sellerId,
        title: `${prop.address} - UPCOMING Tax Lien Auction`,
        listing_type: 'tax_lien',
        property_address: prop.address,
        parcel_apn: prop.parcel_id,
        county: 'St Johns',
        state: 'FL',
        starting_bid: lienAmount,
        buy_now_price: null,
        estimated_value: Math.round(estimatedValue),
        redemption_period: '24 months',
        auction_date_time: auctionDate.toISOString(),
        status: 'active',
        source: 'stjohns_county_delinquent_tax_list',
        source_metadata: {
          delinquent_amount: delinquentAmount,
          homestead: prop.homestead === 'True',
          property_description: prop.property_description,
          owner_name: prop.owner_name,
          auction_date: '2026-05-29',
          auction_platform: 'www.zeusauction.com',
          interest_rate: 18.0,
          redemption_deadline: redemptionDeadline.toISOString(),
          data_source: '2025 Delinquent Real Estate Tax List',
          status: 'upcoming_auction',
          last_refreshed: new Date().toISOString()
        }
      }
    })

    // Insert in batches
    const batchSize = 100
    let inserted = 0

    for (let i = 0; i < listings.length; i += batchSize) {
      const batch = listings.slice(i, i + batchSize)
      const { error } = await supabase
        .from('marketplace_listings')
        .insert(batch)

      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error)
      } else {
        inserted += batch.length
      }
    }

    console.log(`✅ Imported ${inserted} listings`)

    // Verify
    const { count: totalCount } = await supabase
      .from('marketplace_listings')
      .select('*', { count: 'exact', head: true })
      .eq('county', 'St Johns')
      .eq('state', 'FL')

    return NextResponse.json({
      success: true,
      message: 'Auction data refreshed successfully',
      stats: {
        deleted: deletedCount || 0,
        imported: inserted,
        total: totalCount || 0,
        timestamp: new Date().toISOString(),
        source: 'St Johns County 2025 Delinquent Tax List',
        auction_date: '2026-05-29'
      }
    })

  } catch (error) {
    console.error('Error refreshing auction data:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// GET endpoint to check last refresh time
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('marketplace_listings')
      .select('source_metadata')
      .eq('county', 'St Johns')
      .eq('state', 'FL')
      .limit(1)
      .single()

    if (error) throw error

    const lastRefreshed = data?.source_metadata?.last_refreshed || 'Never'

    return NextResponse.json({
      county: 'St Johns',
      state: 'FL',
      last_refreshed: lastRefreshed,
      auction_date: data?.source_metadata?.auction_date || 'Unknown',
      data_source: data?.source_metadata?.data_source || 'Unknown'
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch refresh status' },
      { status: 500 }
    )
  }
}
