import type { Metadata } from 'next'
import { Inter, Merriweather } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import LienBot from '@/components/LienBot'

const inter = Inter({ subsets: ['latin'] })
const merriweather = Merriweather({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['300', '400', '700', '900']
})

export const metadata: Metadata = {
  title: 'WealthFlow AI - Tax Lien Investment Platform',
  description: 'Find hidden real estate opportunities before other investors.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${merriweather.variable}`}>
        <Providers>
          {children}
          <LienBot />
        </Providers>
      </body>
    </html>
  )
}
