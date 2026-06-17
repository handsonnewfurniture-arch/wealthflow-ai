import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hands On Tax Liens - Tax Lien & Deed Investment Platform',
  description: 'Find hidden real estate opportunities before other investors. Track tax lien auctions, analyze counties, discover undervalued properties.',
  keywords: 'tax lien, tax deed, real estate investing, auction, county, investment, portfolio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-navy-950">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
