'use client'

import { usePathname, useRouter } from 'next/navigation'
import { User, Lock, Bell, Settings } from 'lucide-react'
import { cn } from '@/utils/helpers'

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const tabs = [
    { id: 'profile', name: 'Profile Settings', href: '/settings/profile', icon: User },
    { id: 'security', name: 'Security & Password', href: '/settings/security', icon: Lock },
    { id: 'general', name: 'General / Salon', href: '/settings', icon: Settings },
    { id: 'notifications', name: 'Notifications', href: '/settings/notifications', icon: Bell },
  ]

  const getActiveTab = () => {
    if (pathname === '/settings') return 'general'
    if (pathname?.startsWith('/settings/profile')) return 'profile'
    if (pathname?.startsWith('/settings/security')) return 'security'
    if (pathname?.startsWith('/settings/notifications')) return 'notifications'
    return 'general'
  }

  const activeTab = getActiveTab()

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Settings Title Header */}
      <div className="pb-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Account Settings
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Manage your personal identity, login credentials, message setups, and business salon parameters.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar (Desktop) / Tab Bar (Mobile) */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="lg:sticky lg:top-20 space-y-1">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:flex-col gap-1 p-2.5 rounded-2xl border" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => router.push(tab.href)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all w-full text-left",
                      isActive
                        ? "text-white shadow-md shadow-salon-600/10"
                        : "hover:bg-salon-50 dark:hover:bg-salon-900/10"
                    )}
                    style={{
                      background: isActive ? 'var(--salon-600)' : 'transparent',
                      color: isActive ? '#fff' : 'var(--text-secondary)',
                    }}
                  >
                    <tab.icon size={18} strokeWidth={isActive ? 2.5 : 2} style={{ color: isActive ? '#fff' : 'var(--accent)' }} />
                    <span className="flex-1" style={{ color: isActive ? '#fff' : 'var(--text-primary)' }}>{tab.name}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Mobile / Tablet Horizontal Navigation */}
            <div className="lg:hidden flex overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none gap-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => router.push(tab.href)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border shrink-0",
                      isActive
                        ? "text-white border-transparent shadow-sm"
                        : "border-gray-200 dark:border-gray-800"
                    )}
                    style={{
                      background: isActive ? 'var(--salon-600)' : 'var(--bg)',
                      color: isActive ? '#fff' : 'var(--text-primary)',
                      borderColor: isActive ? 'transparent' : 'var(--border)'
                    }}
                  >
                    <tab.icon size={14} strokeWidth={isActive ? 2.5 : 2} style={{ color: isActive ? '#fff' : 'var(--accent)' }} />
                    <span style={{ color: isActive ? '#fff' : 'var(--text-primary)' }}>{tab.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  )
}
