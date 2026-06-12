'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Calendar,
  CalendarCheck,
  ShoppingBag,
  CalendarDays,
  ChevronDown,
  Users,
  UserPlus,
  UserCog,
  Scissors,
  Package,
  Receipt,
  TrendingUp,
  BarChart2,
  CreditCard,
  Tag,
  Bell,
  Settings,
  List,
  LayoutGrid,
  FileText,
  UserCircle,
  Gift,
  Star,
  PieChart,
  UserSearch,
  MessageCircle,
  Wallet,
  LifeBuoy,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/utils/helpers'

type SubItem = { name: string; href: string; icon: LucideIcon }
type NavItem = { name: string; icon: LucideIcon; prefix: string; items: SubItem[] }

const navItems: NavItem[] = [
  {
    name: 'Bookings', icon: Calendar, prefix: '/booking',
    items: [
      { name: 'Walk-In',  href: '/booking/walkin',   icon: UserPlus     },
      { name: 'Schedule', href: '/booking/schedule', icon: CalendarDays },
      { name: 'Calendar', href: '/booking/calendar', icon: CalendarDays },
      { name: 'Booking List', href: '/booking/list', icon: List         },
    ],
  },
  {
    name: 'Invoice', icon: Receipt, prefix: '/invoices',
    items: [
      { name: 'All Invoices', href: '/invoices',        icon: FileText },
    ],
  },
  {
    name: 'Service', icon: Scissors, prefix: '/services',
    items: [
      { name: 'All Services', href: '/services', icon: List },
    ],
  },
  {
    name: 'Staff', icon: UserCog, prefix: '/staff',
    items: [
      { name: 'Staff List', href: '/staff',     icon: UserCog    },
      { name: 'Add Staff',  href: '/staff/add', icon: UserCircle },
    ],
  },
  {
    name: 'Client', icon: Users, prefix: '/customers',
    items: [
      { name: 'Client List', href: '/customers',     icon: Users    },
      { name: 'Add Client',  href: '/customers/add', icon: UserPlus },
    ],
  },
  {
    name: 'Membership', icon: CreditCard, prefix: '/membership',
    items: [
      { name: 'Plans',    href: '/membership/plans',    icon: CreditCard },
      { name: 'Packages', href: '/membership/packages', icon: Gift       },
      { name: 'Loyalty',  href: '/membership/loyalty',  icon: Star       },
    ],
  },
  {
    name: 'Discount', icon: Tag, prefix: '/discounts',
    items: [
      { name: 'All Discounts', href: '/discounts', icon: Tag },
    ],
  },
  {
    name: 'Inventory', icon: Package, prefix: '/inventory',
    items: [
      { name: 'Stock',   href: '/inventory',        icon: Package  },
      { name: 'Reorder', href: '/inventory/reorder', icon: List    },
    ],
  },
  {
    name: 'Expense', icon: Wallet, prefix: '/expense',
    items: [
      { name: 'All Expenses', href: '/expense',        icon: Wallet   },
      { name: 'Add Expense',  href: '/expense/add',    icon: FileText },
    ],
  },
  {
    name: 'Report', icon: TrendingUp, prefix: '/reports',
    items: [
      { name: 'Daily Reconciliation', href: '/reports',                    icon: TrendingUp },
      { name: 'Transactions',         href: '/reports/transactions',        icon: FileText   },
      { name: 'Business Trend',       href: '/reports/business-trend',      icon: BarChart2  },
      { name: 'Stylist Progress',     href: '/reports/stylist-progress',    icon: UserCog    },
    ],
  },
  {
    name: 'Analytics', icon: BarChart2, prefix: '/analytics',
    items: [
      { name: 'Overview',        href: '/analytics',                 icon: BarChart2    },
      { name: 'Revenue',         href: '/analytics/revenue',         icon: TrendingUp   },
      { name: 'Client Insights', href: '/analytics/client-insights', icon: UserSearch   },
    ],
  },
  {
    name: 'Notification', icon: Bell, prefix: '/notifications',
    items: [
      { name: 'All Notifications', href: '/notifications',             icon: Bell        },
      { name: 'WhatsApp Logs',     href: '/notifications/whatsapp-logs', icon: MessageCircle },
    ],
  },
  {
    name: 'Setting', icon: Settings, prefix: '/settings',
    items: [
      { name: 'General',       href: '/settings',               icon: Settings },
      { name: 'Notifications', href: '/settings/notifications', icon: Bell     },
    ],
  },
  {
    name: 'Support', icon: LifeBuoy, prefix: '/support',
    items: [
      { name: 'Support Tickets', href: '/support',     icon: LifeBuoy    },
      { name: 'New Ticket',      href: '/support/new', icon: HelpCircle  },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [openMap, setOpenMap] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(navItems.map((n) => [n.name, pathname.startsWith(n.prefix)]))
  )

  const toggle = (name: string) =>
    setOpenMap((prev) => ({ ...prev, [name]: !prev[name] }))

  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col z-50"
      style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)' }}>

      {/* Logo */}
      <div className="h-16 flex items-center px-5 shrink-0"
        style={{ borderBottom: '1px solid var(--sidebar-border)' }}>
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #9D679F, #6F5AA3)' }}>
            <Scissors className="text-white" size={17} />
          </div>
          <div>
            <h1 className="text-base font-bold" style={{ color: 'var(--sidebar-active-text)' }}>SalonPro</h1>
            <p className="text-[10px] font-medium" style={{ color: 'var(--text-secondary)' }}>Salon Management</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2.5">
        <div className="space-y-0.5">

          {/* Dashboard */}
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all text-sm"
            style={{
              background: pathname === '/dashboard' ? 'var(--sidebar-active-bg)' : 'transparent',
              color: pathname === '/dashboard' ? 'var(--sidebar-active-text)' : 'var(--sidebar-text)',
            }}
            onMouseEnter={e => { if (pathname !== '/dashboard') (e.currentTarget as HTMLElement).style.background = 'var(--sidebar-hover)' }}
            onMouseLeave={e => { if (pathname !== '/dashboard') (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
            {pathname === '/dashboard' && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
            )}
          </Link>

          {/* All dropdowns */}
          {navItems.map((nav) => {
            const isActive = pathname.startsWith(nav.prefix)
            const isOpen = openMap[nav.name]
            return (
              <div key={nav.name}>
                <button
                  type="button"
                  onClick={() => toggle(nav.name)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all text-sm"
                  style={{
                    background: isActive ? 'var(--sidebar-active-bg)' : 'transparent',
                    color: isActive ? 'var(--sidebar-active-text)' : 'var(--sidebar-text)',
                  }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--sidebar-hover)' }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  <nav.icon size={18} />
                  <span className="flex-1 text-left">{nav.name}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />}
                  <ChevronDown
                    size={14}
                    className={cn('transition-transform duration-200 ml-1', isOpen && 'rotate-180')}
                    style={{ color: 'var(--text-secondary)' }}
                  />
                </button>

                {isOpen && (
                  <div className="mt-0.5 ml-4 pl-3 space-y-0.5"
                    style={{ borderLeft: '2px solid var(--border)' }}>
                    {nav.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                        style={{
                          background: pathname === item.href ? 'var(--sidebar-active-bg)' : 'transparent',
                          color: pathname === item.href ? 'var(--sidebar-active-text)' : 'var(--sidebar-text)',
                        }}
                        onMouseEnter={e => { if (pathname !== item.href) (e.currentTarget as HTMLElement).style.background = 'var(--sidebar-hover)' }}
                        onMouseLeave={e => { if (pathname !== item.href) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                      >
                        <item.icon size={14} />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

        </div>
      </nav>

      {/* Bottom brand strip */}
      <div className="px-4 py-3 shrink-0" style={{ borderTop: '1px solid var(--sidebar-border)' }}>
        <p className="text-[10px] text-center font-medium" style={{ color: 'var(--text-secondary)' }}>
          © 2024 SalonPro · All rights reserved
        </p>
      </div>
    </aside>
  )
}
