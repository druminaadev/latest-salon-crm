'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus, Search, Wallet, Trash2, TrendingDown, ShoppingCart,
  Zap, Wrench, MoreHorizontal, ArrowUpRight, Receipt, MapPin,
} from 'lucide-react'
import { useLocationStore, BRANCHES, type BranchId } from '@/store/locationStore'

interface Expense {
  id: number
  title: string
  category: string
  amount: number
  paymentMethod: string
  date: string
  notes?: string
}

const SEED: Record<BranchId, Expense[]> = {
  main: [
    { id: 1, title: 'Hair Color Products',   category: 'Products',    amount: 4500,  paymentMethod: 'Cash', date: '2024-01-18', notes: 'Monthly stock'     },
    { id: 2, title: 'Electricity Bill',       category: 'Utilities',   amount: 2200,  paymentMethod: 'UPI',  date: '2024-01-15'                              },
    { id: 3, title: 'Shampoo & Conditioner', category: 'Products',    amount: 3200,  paymentMethod: 'Card', date: '2024-01-14'                              },
    { id: 4, title: 'AC Servicing',           category: 'Maintenance', amount: 1500,  paymentMethod: 'Cash', date: '2024-01-12', notes: 'Annual maintenance' },
    { id: 5, title: 'Staff Salary',           category: 'Salary',      amount: 45000, paymentMethod: 'Bank', date: '2024-01-01'                              },
  ],
  satellite: [
    { id: 1, title: 'Nail Art Supplies',      category: 'Products',    amount: 1800,  paymentMethod: 'Cash', date: '2024-01-08'                              },
    { id: 2, title: 'Water Bill',             category: 'Utilities',   amount: 600,   paymentMethod: 'UPI',  date: '2024-01-10'                              },
    { id: 3, title: 'Staff Salary',           category: 'Salary',      amount: 32000, paymentMethod: 'Bank', date: '2024-01-01'                              },
    { id: 4, title: 'Facial Supplies',        category: 'Products',    amount: 2400,  paymentMethod: 'Card', date: '2024-01-13'                              },
  ],
  sghighway: [
    { id: 1, title: 'Electricity Bill',       category: 'Utilities',   amount: 3100,  paymentMethod: 'UPI',  date: '2024-01-15'                              },
    { id: 2, title: 'Staff Salary',           category: 'Salary',      amount: 38000, paymentMethod: 'Bank', date: '2024-01-01'                              },
    { id: 3, title: 'Wax & Supplies',         category: 'Products',    amount: 2800,  paymentMethod: 'Cash', date: '2024-01-11', notes: 'Restock'            },
    { id: 4, title: 'Plumbing Repair',        category: 'Maintenance', amount: 2500,  paymentMethod: 'Cash', date: '2024-01-09', notes: 'Washroom pipe'      },
    { id: 5, title: 'Water Bill',             category: 'Utilities',   amount: 950,   paymentMethod: 'UPI',  date: '2024-01-10'                              },
  ],
}

const CATEGORIES = ['All', 'Products', 'Utilities', 'Maintenance', 'Salary', 'Other']

const CAT_META: Record<string, { icon: React.ElementType; gradient: string; color: string; light: string }> = {
  Products:    { icon: ShoppingCart,  gradient: 'from-[#6D91BF] to-[#5F4C86]', color: '#6D91BF', light: '#6D91BF18' },
  Utilities:   { icon: Zap,           gradient: 'from-[#C7923E] to-[#D88385]', color: '#C7923E', light: '#C7923E18' },
  Maintenance: { icon: Wrench,        gradient: 'from-[#6F9F8F] to-[#6D91BF]', color: '#6F9F8F', light: '#6F9F8F18' },
  Salary:      { icon: Wallet,        gradient: 'from-[#6F5AA3] to-[#9D679F]', color: '#6F5AA3', light: '#6F5AA318' },
  Other:       { icon: MoreHorizontal, gradient: 'from-[#C96F9B] to-[#D88385]', color: '#C96F9B', light: '#C96F9B18' },
}

const METHOD_COLOR: Record<string, string> = {
  Cash: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  UPI:  'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Card: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  Bank: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
}

export default function ExpensePage() {
  const { branchId }  = useLocationStore()
  const activeBranch  = BRANCHES.find(b => b.id === branchId) ?? BRANCHES[0]

  const [allExpenses, setAllExpenses] = useState<Record<BranchId, Expense[]>>({
    main:      [...SEED.main],
    satellite: [...SEED.satellite],
    sghighway: [...SEED.sghighway],
  })
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('All')

  const expenses = allExpenses[branchId]

  const filtered = expenses.filter(e => {
    const q = search.toLowerCase()
    return (e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q))
      && (category === 'All' || e.category === category)
  })

  const total     = expenses.reduce((s, e) => s + e.amount, 0)
  const thisMonth = expenses.filter(e => e.date.startsWith('2024-01')).reduce((s, e) => s + e.amount, 0)
  const avg       = expenses.length ? Math.round(total / expenses.length) : 0

  const catTotals = CATEGORIES.slice(1).map(c => ({
    name: c,
    amount: expenses.filter(e => e.category === c).reduce((s, e) => s + e.amount, 0),
  })).filter(c => c.amount > 0).sort((a, b) => b.amount - a.amount)

  const setExpenses = (updater: (prev: Expense[]) => Expense[]) =>
    setAllExpenses(prev => ({ ...prev, [branchId]: updater(prev[branchId]) }))

  const handleDelete = (id: number) => {
    if (confirm('Delete this expense?')) setExpenses(prev => prev.filter(e => e.id !== id))
  }

  return (
    <main className="min-h-full space-y-6 pb-6">

      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#6F5AA3] via-[#9D679F] to-[#C96F9B] px-6 py-7 shadow-[0_20px_50px_rgba(111,90,163,0.35)]">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-8 left-1/3 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              <Wallet size={12} className="animate-pulse" />
              Expense Tracker
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">Expenses</h1>
            <p className="mt-1 text-sm font-medium text-white/80">{expenses.length} records · {activeBranch.short}</p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <Link href="/expense/add"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/30 bg-white/20 px-5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/30">
              <Plus size={16} /> Add Expense
            </Link>
            <span className="flex items-center gap-1 rounded-full border border-white/30 bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white/80">
              <MapPin size={10} />{activeBranch.name}
            </span>
          </div>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Total Expenses',  value: `₹${total.toLocaleString()}`,     sub: 'All records',     gradient: 'from-[#6F5AA3] to-[#9D679F]', icon: TrendingDown },
          { label: 'This Month',      value: `₹${thisMonth.toLocaleString()}`, sub: 'January 2024',    gradient: 'from-[#C7923E] to-[#D88385]', icon: Receipt      },
          { label: 'Avg per Expense', value: `₹${avg.toLocaleString()}`,       sub: 'Per transaction', gradient: 'from-[#6F9F8F] to-[#6D91BF]', icon: ArrowUpRight },
        ].map(({ label, value, sub, gradient, icon: Icon }) => (
          <div key={label} className="group relative overflow-hidden rounded-2xl border border-white/80 bg-white p-5 shadow-[0_18px_45px_rgba(36,21,26,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(36,21,26,0.13)] dark:border-white/10 dark:bg-white/[0.04]">
            <div className={`absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r ${gradient}`} />
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
              <Icon size={19} className="text-white" />
            </div>
            <p className="mt-5 text-3xl font-bold tracking-tight text-[#24151A] dark:text-white">{value}</p>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{label}</p>
              <p className="text-xs text-gray-400">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Category Breakdown ── */}
      <div className="rounded-2xl border border-white/80 bg-white p-5 shadow-[0_18px_45px_rgba(36,21,26,0.07)] dark:border-white/10 dark:bg-white/[0.04]">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#6F5AA3] to-[#9D679F]">
            <TrendingDown size={13} className="text-white" />
          </div>
          <h2 className="text-base font-semibold text-[#24151A] dark:text-white">Category Breakdown</h2>
          <span className="ml-auto flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
            style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
            <MapPin size={9} />{activeBranch.short}
          </span>
        </div>
        {catTotals.length === 0 ? (
          <p className="py-4 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>No data for this branch yet</p>
        ) : (
          <div className="space-y-3">
            {catTotals.map(cat => {
              const meta = CAT_META[cat.name] ?? CAT_META.Other
              const pct  = total ? Math.round((cat.amount / total) * 100) : 0
              const Icon = meta.icon
              return (
                <div key={cat.name} className="relative overflow-hidden rounded-xl border border-gray-100 bg-[#FFFDFC] p-3 dark:border-white/10 dark:bg-white/[0.03]">
                  <div className={`absolute inset-y-0 left-0 w-1 rounded-l-xl bg-gradient-to-b ${meta.gradient}`} />
                  <div className="flex items-center gap-3 pl-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: meta.light }}>
                      <Icon size={14} style={{ color: meta.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-semibold text-[#24151A] dark:text-white">{cat.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold" style={{ color: meta.color }}>₹{cat.amount.toLocaleString()}</span>
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: meta.light, color: meta.color }}>{pct}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                        <div className={`h-full rounded-full bg-gradient-to-r ${meta.gradient} transition-all duration-700`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search expenses..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#9D679F]"
            style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className="rounded-full px-3.5 py-1.5 text-xs font-semibold transition"
              style={category === c
                ? { background: 'linear-gradient(135deg,#6F5AA3,#9D679F)', color: '#fff' }
                : { border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-secondary)' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_18px_45px_rgba(36,21,26,0.07)] dark:border-white/10 dark:bg-white/[0.04]">
        <div className="h-0.5 w-full bg-gradient-to-r from-[#6F5AA3] via-[#9D679F] to-[#C96F9B]" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--hover)' }}>
                {['Expense', 'Category', 'Amount', 'Method', 'Date', 'Notes', ''].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => {
                const meta = CAT_META[e.category] ?? CAT_META.Other
                const Icon = meta.icon
                const mCls = METHOD_COLOR[e.paymentMethod] ?? METHOD_COLOR.Cash
                return (
                  <tr key={e.id} className="group transition"
                    style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={el => (el.currentTarget.style.background = 'var(--hover)')}
                    onMouseLeave={el => (el.currentTarget.style.background = 'transparent')}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${meta.gradient} shadow-sm`}>
                          <Icon size={14} className="text-white" />
                        </div>
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{e.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ background: meta.light, color: meta.color }}>
                        {e.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-base font-bold" style={{ color: '#6F5AA3' }}>₹{e.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${mCls}`}>{e.paymentMethod}</span>
                    </td>
                    <td className="px-5 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{e.date}</td>
                    <td className="px-5 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{e.notes || '—'}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => handleDelete(e.id)}
                        className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20">
                        <Trash2 size={12} /> Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <Wallet size={28} className="mx-auto mb-2 opacity-20" />
                    No expenses found for {activeBranch.short}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
