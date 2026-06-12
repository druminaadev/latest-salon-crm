'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Wallet, ChevronDown, CheckCircle2, ArrowLeft, Receipt, Tag, CreditCard, CalendarDays, FileText } from 'lucide-react'

const CATEGORIES      = ['Products', 'Utilities', 'Maintenance', 'Salary', 'Other']
const PAYMENT_METHODS = ['Cash', 'Card', 'UPI', 'Bank Transfer']

const CAT_META: Record<string, { gradient: string; color: string }> = {
  Products:    { gradient: 'from-[#6D91BF] to-[#5F4C86]', color: '#6D91BF' },
  Utilities:   { gradient: 'from-[#C7923E] to-[#D88385]', color: '#C7923E' },
  Maintenance: { gradient: 'from-[#6F9F8F] to-[#6D91BF]', color: '#6F9F8F' },
  Salary:      { gradient: 'from-[#6F5AA3] to-[#9D679F]', color: '#6F5AA3' },
  Other:       { gradient: 'from-[#C96F9B] to-[#D88385]', color: '#C96F9B' },
}

export default function AddExpensePage() {
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({ title: '', category: '', amount: '', paymentMethod: '', date: '', notes: '' })

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))
  const isValid = form.title && form.category && form.amount && form.date

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    setSaved(true)
    setTimeout(() => router.push('/expense'), 1800)
  }

  const selectedMeta = form.category ? CAT_META[form.category] : null

  if (saved) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#6F5AA3] to-[#9D679F] shadow-[0_0_40px_rgba(111,90,163,0.4)]">
          <div className="absolute inset-0 animate-ping rounded-full bg-[#9D679F] opacity-20" />
          <CheckCircle2 size={36} className="relative text-white" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#24151A] dark:text-white">Expense Saved!</h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>Redirecting to expense list...</p>
        </div>
        <div className="h-1.5 w-48 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
          <div className="h-full animate-[fill_1.8s_ease-in-out_forwards] rounded-full bg-gradient-to-r from-[#6F5AA3] to-[#9D679F]"
            style={{ animation: 'width 1.8s ease-in-out forwards', width: '100%' }} />
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-full space-y-6 pb-6">

      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#6F5AA3] via-[#9D679F] to-[#C96F9B] px-6 py-7 shadow-[0_20px_50px_rgba(111,90,163,0.35)]">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-8 left-1/3 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center gap-4">
          <button onClick={() => router.push('/expense')}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/30 bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30">
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              <Wallet size={12} /> Add New Expense
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">Record Expense</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── Title ── */}
          <div className="overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_18px_45px_rgba(36,21,26,0.07)] dark:border-white/10 dark:bg-white/[0.04]">
            <div className="h-0.5 bg-gradient-to-r from-[#6F5AA3] via-[#9D679F] to-[#C96F9B]" />
            <div className="p-5">
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                <Receipt size={12} /> Expense Title *
              </label>
              <input
                placeholder="e.g. Hair Color Products"
                value={form.title} onChange={e => set('title', e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#9D679F]"
                style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          {/* ── Category + Amount ── */}
          <div className="overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_18px_45px_rgba(36,21,26,0.07)] dark:border-white/10 dark:bg-white/[0.04]">
            <div className="h-0.5 bg-gradient-to-r from-[#6D91BF] to-[#5F4C86]" />
            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  <Tag size={12} /> Category *
                </label>
                <div className="relative">
                  <select value={form.category} onChange={e => set('category', e.target.value)}
                    className="w-full appearance-none rounded-xl px-4 py-3 pr-9 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#9D679F]"
                    style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                </div>
                {/* category preview pill */}
                {selectedMeta && (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm"
                    style={{ background: `linear-gradient(135deg, ${selectedMeta.color}cc, ${selectedMeta.color})` }}>
                    {form.category}
                  </div>
                )}
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  <Wallet size={12} /> Amount (₹) *
                </label>
                <input type="number" placeholder="0"
                  value={form.amount} onChange={e => set('amount', e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#9D679F]"
                  style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                />
                {form.amount && (
                  <p className="mt-1.5 text-lg font-bold" style={{ color: '#6F5AA3' }}>
                    ₹{Number(form.amount).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Payment + Date ── */}
          <div className="overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_18px_45px_rgba(36,21,26,0.07)] dark:border-white/10 dark:bg-white/[0.04]">
            <div className="h-0.5 bg-gradient-to-r from-[#C7923E] to-[#D88385]" />
            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  <CreditCard size={12} /> Payment Method
                </label>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {PAYMENT_METHODS.map(m => (
                    <button type="button" key={m} onClick={() => set('paymentMethod', m)}
                      className="rounded-xl py-2 text-xs font-semibold transition"
                      style={form.paymentMethod === m
                        ? { background: 'linear-gradient(135deg,#6F5AA3,#9D679F)', color: '#fff', boxShadow: '0 4px 12px rgba(111,90,163,0.3)' }
                        : { border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  <CalendarDays size={12} /> Date *
                </label>
                <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#9D679F]"
                  style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>
          </div>

          {/* ── Notes ── */}
          <div className="overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_18px_45px_rgba(36,21,26,0.07)] dark:border-white/10 dark:bg-white/[0.04]">
            <div className="h-0.5 bg-gradient-to-r from-[#6F9F8F] to-[#6D91BF]" />
            <div className="p-5">
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                <FileText size={12} /> Notes (optional)
              </label>
              <textarea rows={3} placeholder="Any additional details..."
                value={form.notes} onChange={e => set('notes', e.target.value)}
                className="w-full resize-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#9D679F]"
                style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex gap-3">
            <button type="button" onClick={() => router.push('/expense')}
              className="flex-1 rounded-xl py-3 text-sm font-semibold transition"
              style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }}>
              Cancel
            </button>
            <button type="submit" disabled={!isValid}
              className="flex-1 rounded-xl py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(111,90,163,0.35)] transition hover:opacity-90 disabled:opacity-40 disabled:shadow-none"
              style={{ background: 'linear-gradient(135deg,#6F5AA3,#9D679F)' }}>
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
