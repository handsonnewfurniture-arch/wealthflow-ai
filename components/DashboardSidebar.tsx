/**
 * Collapsible Dashboard Sidebar
 * Enterprise navigation for tax lien/deed platform with mobile support
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Store,
  FileText,
  Landmark,
  Gavel,
  Activity,
  Bookmark,
  CreditCard,
  GraduationCap,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Menu,
  X
} from 'lucide-react'

interface NavItem {
  label: string
  icon: React.ElementType
  href: string
  badge?: string
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Marketplace', icon: Store, href: '/marketplace' },
  { label: 'Tax Liens', icon: FileText, href: '/dashboard/tax-liens' },
  { label: 'Tax Deeds', icon: Landmark, href: '/dashboard/tax-deeds' },
  { label: 'Auctions', icon: Gavel, href: '/dashboard/auctions' },
  { label: 'Live Tracker', icon: Activity, href: '/dashboard/live-tracker', badge: 'Live' },
  { label: 'Saved Deals', icon: Bookmark, href: '/dashboard/saved' },
  { label: 'Transactions', icon: CreditCard, href: '/dashboard/transactions' },
  { label: 'Education', icon: GraduationCap, href: '/academy' },
  { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
]

export default function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-white border border-slate-200 rounded-lg shadow-lg hover:bg-slate-50 transition-colors"
      >
        <Menu className="w-6 h-6 text-slate-900" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r border-slate-200 transition-all duration-300 z-50 ${
          collapsed ? 'w-16' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-slate-900">WealthFlow</span>
            </div>
          )}

          {/* Desktop collapse button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:block p-1.5 hover:bg-slate-100 rounded-lg transition-colors ml-auto"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5 text-slate-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            )}
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 hover:bg-slate-100 rounded-lg transition-colors ml-auto"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
                title={collapsed ? item.label : ''}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${
                  isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'
                }`} />

                {!collapsed && (
                  <>
                    <span className="flex-1 font-medium text-sm">{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}

                {/* Tooltip for collapsed state on desktop */}
                {collapsed && (
                  <div className="hidden lg:block absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap">
                    {item.label}
                    {item.badge && (
                      <span className="ml-2 px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Profile (bottom) */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-200 bg-slate-50">
          {!collapsed ? (
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                TM
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">Tiger McBride</p>
                <p className="text-xs text-slate-500 truncate">Pro Plan</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                TM
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Spacer to prevent content from going under sidebar - only on desktop */}
      <div className={`hidden lg:block transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`} />
    </>
  )
}
