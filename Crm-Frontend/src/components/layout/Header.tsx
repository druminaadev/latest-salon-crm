'use client'

import { Bell, Search, Moon, Sun, User, LogOut, MapPin, ChevronDown, Check } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'
import { useAuthStore } from '@/store/authStore'
import { useLocationStore, BRANCHES } from '@/store/locationStore'
import { useState } from 'react'

export default function Header() {
  const { theme, toggleTheme }   = useThemeStore()
  const { user, logout }         = useAuthStore()
  const { branchId, setBranch }  = useLocationStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showLocMenu,  setShowLocMenu]  = useState(false)

  const activeBranch = BRANCHES.find(b => b.id === branchId) ?? BRANCHES[0]

  return (
    <header className="h-16 px-6 flex items-center justify-between sticky top-0 z-40"
      style={{ background: 'var(--header-bg)', borderBottom: '1px solid var(--header-border)' }}>

      {/* Search */}
      <div className="relative max-w-xs w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={16}
          style={{ color: 'var(--text-secondary)' }} />
        <input
          type="text"
          placeholder="Search clients, bookings…"
          className="w-full pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2"
          style={{
            border: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            '--tw-ring-color': '#9D679F',
          } as React.CSSProperties}
        />
      </div>

      {/* Location picker */}
      <div className="relative">
        <button
          onClick={() => setShowLocMenu(p => !p)}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition"
          style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
        >
          <MapPin size={14} />
          <span className="hidden max-w-[160px] truncate sm:block">{activeBranch.name}</span>
          <ChevronDown size={13} className={`transition-transform duration-200 ${showLocMenu ? 'rotate-180' : ''}`} />
        </button>

        {showLocMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowLocMenu(false)} />
            <div className="absolute left-0 z-50 mt-2 w-72 overflow-hidden rounded-2xl shadow-xl"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <div className="h-1 w-full bg-gradient-to-r from-[#6F5AA3] via-[#9D679F] to-[#C96F9B]" />
              <div className="px-4 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Select Branch</p>
              </div>
              <div className="pb-1.5">
                {BRANCHES.map(branch => (
                  <button key={branch.id}
                    onClick={() => { setBranch(branch.id); setShowLocMenu(false) }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition"
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: branchId === branch.id ? 'linear-gradient(135deg,#6F5AA3,#9D679F)' : 'var(--accent-light)' }}>
                      <MapPin size={13} style={{ color: branchId === branch.id ? '#fff' : 'var(--accent)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{branch.name}</div>
                      <div className="text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>{branch.address}</div>
                    </div>
                    {branchId === branch.id && <Check size={14} style={{ color: 'var(--accent)' }} />}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">

        {/* Theme toggle */}
        <button onClick={toggleTheme}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
          style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
          aria-label="Toggle theme">
          {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
        </button>

        {/* Bell */}
        <button
          className="w-9 h-9 rounded-xl flex items-center justify-center relative transition-colors"
          style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
          aria-label="Notifications">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2"
            style={{ background: '#9D679F', borderColor: 'var(--header-bg)' }} />
        </button>

        {/* User menu */}
        <div className="relative">
          <button onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-colors"
            style={{ background: 'var(--accent-light)' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #9D679F, #6F5AA3)' }}>
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="text-left hidden md:block">
              <div className="text-xs font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                {user?.name || 'Admin'}
              </div>
              <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                {user?.role || 'Administrator'}
              </div>
            </div>
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 mt-2 w-44 rounded-2xl shadow-lg py-1.5 z-50"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                <button
                  onClick={() => { setShowUserMenu(false); window.location.href = '/profile' }}
                  className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-sm font-medium transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <User size={14} />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => { logout(); window.location.href = '/auth/login' }}
                  className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-sm font-medium transition-colors"
                  style={{ color: '#9D679F' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
