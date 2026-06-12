'use client'

import { useEffect, useState } from 'react'
import {
  Activity, Banknote, CreditCard, DollarSign, Download,
  Receipt, RefreshCw, Smartphone, SplitSquareHorizontal, TrendingUp,
} from 'lucide-react'
import { useLocationStore, BRANCHES, BRANCH_TRANSACTIONS } from '@/store/locationStore'

const METHOD_META: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  UPI:  { icon: Smartphone, color: '#9D679F', bg: '#9D679F18' },
  Cash: { icon: Banknote,   color: '#6F9F8F', bg: '#6F9F8F18' },
  Card: { icon: CreditCard, color: '#6D91BF', bg: '#6D91BF18' },
}

const methodStyle: Record<string, { bg: string; text: string }> = {
  UPI:  { bg: '#9D679F18', text: '#9D679F' },
  Cash: { bg: '#6F9F8F18', text: '#6F9F8F' },
  Card: { bg: '#6D91BF18', text: '#6D91BF' },
}

function useMount() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t) }, [])
  return mounted
}

function AnimatedNumber({ target }: { target: number }) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let start = 0
    const step = target / 40
    const interval = setInterval(() => {
      start += step
      if (start >= target) { setValue(target); clearInterval(interval) }
      else setValue(Math.floor(start))
    }, 20)
    return () => clearInterval(interval)
  }, [target])
  return <>{value.toLocaleString()}</>
}

export default function DailyReconciliationPage() {
  const mounted = useMount()
  const { branchId }  = useLocationStore()
  const activeBranch  = BRANCHES.find(b => b.id === branchId) ?? BRANCHES[0]
  const transactions  = BRANCH_TRANSACTIONS[branchId]
  const [date, setDate]           = useState('2024-01-15')
  const [refreshing, setRefreshing] = useState(false)

  // compute summary from branch transactions
  const summaryMap: Record<string, { amount: number; txns: number }> = {}
  transactions.forEach(t => {
    if (!summaryMap[t.method]) summaryMap[t.method] = { amount: 0, txns: 0 }
    summaryMap[t.method].amount += t.amount
    summaryMap[t.method].txns  += 1
  })
  const summary = Object.entries(summaryMap).map(([method, data]) => ({
    method, ...data, ...(METHOD_META[method] ?? METHOD_META.UPI),
  }))
  const total     = summary.reduce((s, m) => s + m.amount, 0)
  const totalTxns = summary.reduce((s, m) => s + m.txns, 0)
  const gst       = Math.round(total * 0.15)

  const splitPayments = [
    { booking: `BK-${branchId.toUpperCase().slice(0,3)}01`, client: `${activeBranch.short} Client A`, total: 1200, parts: [{ m: 'UPI', a: 500 }, { m: 'Cash', a: 700 }] },
    { booking: `BK-${branchId.toUpperCase().slice(0,3)}02`, client: `${activeBranch.short} Client B`, total: 2400, parts: [{ m: 'Card', a: 1500 }, { m: 'UPI', a: 900 }] },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(10px)', transition: 'all .4s ease' }}>
        <div>
          <div className="mb-0.5 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: '#9D679F18' }}>
              <DollarSign size={16} style={{ color: '#9D679F' }} />
            </div>
            <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Daily Reconciliation</h1>
            <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
               {activeBranch.short}
            </span>
          </div>
          <p className="ml-10 text-xs" style={{ color: 'var(--text-secondary)' }}>End-of-day payment breakdown & audit</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
          <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}>
            <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="bg-transparent text-sm focus:outline-none" style={{ color: 'var(--text-primary)' }} />
          </div>
          <button onClick={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000) }}
            className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors"
            style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          </button>
          <button className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"
            style={{ background: '#9D679F', color: '#fff' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#6F5AA3')}
            onMouseLeave={e => (e.currentTarget.style.background = '#9D679F')}>
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Hero total */}
      <div className="flex flex-col gap-5 rounded-2xl p-6 sm:flex-row sm:items-center"
        style={{ background: 'linear-gradient(135deg,#9D679F 0%,#6F5AA3 100%)', opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(14px)', transition: 'all .45s ease .05s' }}>
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20">
          <Activity size={24} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="mb-1 text-sm font-semibold text-white/70">Total Collections — {date} · {activeBranch.short}</div>
          <div className="text-4xl font-bold text-white">Rs <AnimatedNumber target={total} /></div>
        </div>
        <div className="flex flex-col gap-1 sm:items-end">
          <div className="text-sm text-white/70">{totalTxns} transactions</div>
          <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white">
            <TrendingUp size={13} /> +8.4% vs yesterday
          </div>
        </div>
      </div>

      {/* Summary mini cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(14px)', transition: 'all .45s ease .1s' }}>
        {[
          { label: 'Subtotal',      value: total,              prefix: 'Rs ', color: '#9D679F', icon: Receipt              },
          { label: 'GST Collected', value: gst,                prefix: 'Rs ', color: '#6D91BF', icon: Receipt              },
          { label: 'Discounts',     value: 0,                  prefix: 'Rs ', color: '#C7923E', icon: Receipt              },
          { label: 'Split Payments',value: splitPayments.length,prefix: '',   color: '#C96F9B', icon: SplitSquareHorizontal},
        ].map(({ label, value, prefix, color, icon: Icon }) => (
          <div key={label} className="rounded-2xl p-4" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: `${color}18` }}>
                <Icon size={13} style={{ color }} />
              </div>
              <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{label}</span>
            </div>
            <div className="text-2xl font-bold" style={{ color }}>{prefix}<AnimatedNumber target={value} /></div>
          </div>
        ))}
      </div>

      {/* Payment method breakdown */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(14px)', transition: 'all .45s ease .15s' }}>
        {summary.map(({ method, icon: Icon, amount, txns, color, bg }) => {
          const pct = Math.round((amount / total) * 100)
          return (
            <div key={method} className="group rounded-2xl p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110" style={{ background: bg }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{method}</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{txns} transactions</div>
                </div>
                <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: bg, color }}>{pct}%</span>
              </div>
              <div className="mb-3 text-2xl font-bold" style={{ color }}>Rs {amount.toLocaleString()}</div>
              <div className="h-2 overflow-hidden rounded-full" style={{ background: 'var(--hover)' }}>
                <div className="h-2 rounded-full" style={{ width: mounted ? `${pct}%` : '0%', background: color, transition: 'width 1s ease .3s' }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Split payments */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)', opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(14px)', transition: 'all .45s ease .2s' }}>
        <div className="mb-4 flex items-center gap-2">
          <SplitSquareHorizontal size={15} style={{ color: '#C96F9B' }} />
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Split Payments</h2>
          <span className="ml-auto rounded-full px-2 py-0.5 text-xs font-semibold" style={{ background: '#C96F9B18', color: '#C96F9B' }}>{splitPayments.length} entries</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {splitPayments.map(payment => (
            <div key={payment.booking} className="rounded-xl p-4" style={{ background: 'var(--hover)' }}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{payment.client}</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{payment.booking}</div>
                </div>
                <div className="text-sm font-bold" style={{ color: '#9D679F' }}>Rs {payment.total.toLocaleString()}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {payment.parts.map((part, i) => (
                  <span key={i} className="rounded-full px-2.5 py-1 text-xs font-semibold"
                    style={{ background: methodStyle[part.m]?.bg, color: methodStyle[part.m]?.text }}>
                    {part.m}: Rs {part.a.toLocaleString()}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions table */}
      <div className="overflow-hidden rounded-2xl" style={{ background: 'var(--bg)', border: '1px solid var(--border)', opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(14px)', transition: 'all .45s ease .25s' }}>
        <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <Activity size={15} style={{ color: '#9D679F' }} />
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Today's Transactions</h2>
          <span className="ml-auto rounded-full px-2 py-0.5 text-xs font-semibold" style={{ background: '#9D679F18', color: '#9D679F' }}>{transactions.length} entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase" style={{ background: 'var(--hover)', color: 'var(--text-secondary)' }}>
                {['Time', 'Client', 'Service', 'Staff', 'Method', 'Amount'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => {
                const mc = methodStyle[t.method] ?? methodStyle.UPI
                return (
                  <tr key={`${t.time}-${t.client}`} className="transition-colors"
                    style={{ borderTop: '1px solid var(--border)', opacity: mounted ? 1 : 0, transition: `opacity .3s ease ${0.3 + i * 0.05}s` }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td className="px-5 py-3.5">
                      <span className="rounded-md px-2 py-0.5 text-xs font-bold" style={{ background: 'var(--hover)', color: 'var(--text-secondary)' }}>{t.time}</span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold" style={{ color: 'var(--text-primary)' }}>{t.client}</td>
                    <td className="px-5 py-3.5 text-xs" style={{ color: 'var(--text-secondary)' }}>{t.service}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ background: '#9D679F' }}>{t.staff[0]}</div>
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t.staff}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: mc.bg, color: mc.text }}>{t.method}</span>
                    </td>
                    <td className="px-5 py-3.5 font-bold" style={{ color: '#9D679F' }}>Rs {t.amount.toLocaleString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
