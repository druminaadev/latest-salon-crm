'use client'

import { useEffect, useState } from 'react'
import { Search, Download, FileText, CheckCircle2, XCircle, IndianRupee, Filter, X } from 'lucide-react'

const ALL_TXN = [
  { id: 'TXN-001', date: '2024-01-15', client: 'Priya Sharma',  service: 'Hair Cut & Color', stylist: 'Neha',  method: 'UPI',  amount: 1888, status: 'Completed' },
  { id: 'TXN-002', date: '2024-01-15', client: 'Riya Patel',    service: 'Facial',           stylist: 'Pooja', method: 'Cash', amount: 944,  status: 'Completed' },
  { id: 'TXN-003', date: '2024-01-14', client: 'Anita Verma',   service: 'Manicure',         stylist: 'Sonal', method: 'Card', amount: 472,  status: 'Completed' },
  { id: 'TXN-004', date: '2024-01-14', client: 'Meena Joshi',   service: 'Hair Spa',         stylist: 'Neha',  method: 'UPI',  amount: 1416, status: 'Refunded'  },
  { id: 'TXN-005', date: '2024-01-13', client: 'Sunita Rao',    service: 'Waxing (Full)',    stylist: 'Pooja', method: 'Cash', amount: 1180, status: 'Completed' },
  { id: 'TXN-006', date: '2024-01-13', client: 'Kavita Singh',  service: 'Pedicure',         stylist: 'Sonal', method: 'UPI',  amount: 590,  status: 'Completed' },
  { id: 'TXN-007', date: '2024-01-12', client: 'Deepa Mehta',   service: 'Hair Coloring',    stylist: 'Neha',  method: 'Card', amount: 2360, status: 'Completed' },
  { id: 'TXN-008', date: '2024-01-12', client: 'Nisha Gupta',   service: 'Bridal Makeup',    stylist: 'Pooja', method: 'UPI',  amount: 5900, status: 'Completed' },
]

const statusCfg: Record<string, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
  Completed: { bg: '#6F9F8F18', text: '#6F9F8F', icon: CheckCircle2 },
  Refunded:  { bg: '#D8838518', text: '#D88385', icon: XCircle },
}
const methodCfg: Record<string, { bg: string; text: string }> = {
  UPI:  { bg: '#9D679F18', text: '#9D679F' },
  Cash: { bg: '#6F9F8F18', text: '#6F9F8F' },
  Card: { bg: '#6D91BF18', text: '#6D91BF' },
}

function useMount() {
  const [m, setM] = useState(false)
  useEffect(() => { const t = setTimeout(() => setM(true), 50); return () => clearTimeout(t) }, [])
  return m
}

export default function TransactionsPage() {
  const mounted = useMount()
  const [search, setSearch]     = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate]     = useState('')
  const [method, setMethod]     = useState('All')
  const [status, setStatus]     = useState('All')

  const filtered = ALL_TXN.filter(t => {
    const q = search.toLowerCase()
    const matchSearch = !q || t.client.toLowerCase().includes(q) || t.service.toLowerCase().includes(q) || t.stylist.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)
    const matchMethod = method === 'All' || t.method === method
    const matchStatus = status === 'All' || t.status === status
    const matchFrom   = !fromDate || t.date >= fromDate
    const matchTo     = !toDate   || t.date <= toDate
    return matchSearch && matchMethod && matchStatus && matchFrom && matchTo
  })

  const net = filtered.filter(t => t.status === 'Completed').reduce((s, t) => s + t.amount, 0)
  const hasFilters = search || fromDate || toDate || method !== 'All' || status !== 'All'

  const clearFilters = () => { setSearch(''); setFromDate(''); setToDate(''); setMethod('All'); setStatus('All') }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div
        className="flex items-center gap-3"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(10px)', transition: 'all .4s ease' }}
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#6D91BF18' }}>
          <FileText size={17} style={{ color: '#6D91BF' }} />
        </div>
        <div>
          <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Transaction History</h1>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Full audit trail with advanced filters</p>
        </div>
        <button
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{ background: '#6D91BF', color: '#fff' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#54749C')}
          onMouseLeave={e => (e.currentTarget.style.background = '#6D91BF')}
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(14px)', transition: 'all .4s ease .05s' }}
      >
        {[
          { label: 'Total',       value: filtered.length,                                       color: '#9D679F', suffix: '',  format: false },
          { label: 'Completed',   value: filtered.filter(t => t.status === 'Completed').length,  color: '#6F9F8F', suffix: '',  format: false },
          { label: 'Refunded',    value: filtered.filter(t => t.status === 'Refunded').length,   color: '#D88385', suffix: '',  format: false },
          { label: 'Net Revenue', value: net,                                                    color: '#C7923E', suffix: '₹', format: true  },
        ].map(({ label, value, color, suffix, format }) => (
          <div key={label} className="rounded-2xl p-4" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>{label}</div>
            <div className="text-2xl font-bold" style={{ color }}>
              {suffix}{format ? (value as number).toLocaleString() : value}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        className="rounded-2xl p-4 space-y-3"
        style={{
          background: 'var(--bg)', border: '1px solid var(--border)',
          opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(14px)',
          transition: 'all .4s ease .1s',
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Filter size={13} style={{ color: 'var(--text-secondary)' }} />
          <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Filters</span>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full transition-colors"
              style={{ background: '#D8838518', color: '#D88385' }}
            >
              <X size={10} /> Clear all
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-52">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search client, service, stylist, ID…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              style={{ border: '1px solid var(--border)', background: 'var(--hover)', color: 'var(--text-primary)' }}
            />
          </div>

          {/* Date range */}
          <div className="flex items-center gap-2">
            <input
              type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
              className="px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              style={{ border: '1px solid var(--border)', background: 'var(--hover)', color: 'var(--text-primary)' }}
            />
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>to</span>
            <input
              type="date" value={toDate} onChange={e => setToDate(e.target.value)}
              className="px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              style={{ border: '1px solid var(--border)', background: 'var(--hover)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Method pills */}
          <div className="flex gap-1.5">
            {['All', 'UPI', 'Cash', 'Card'].map(m => (
              <button
                key={m} onClick={() => setMethod(m)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: method === m ? '#6F5AA3' : 'var(--hover)',
                  color: method === m ? '#fff' : 'var(--text-secondary)',
                  border: method === m ? 'none' : '1px solid var(--border)',
                }}
              >{m}</button>
            ))}
          </div>
          <div className="w-px self-stretch" style={{ background: 'var(--border)' }} />
          {/* Status pills */}
          <div className="flex gap-1.5">
            {['All', 'Completed', 'Refunded'].map(s => (
              <button
                key={s} onClick={() => setStatus(s)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: status === s ? (s === 'Refunded' ? '#D88385' : '#6F9F8F') : 'var(--hover)',
                  color: status === s ? '#fff' : 'var(--text-secondary)',
                  border: status === s ? 'none' : '1px solid var(--border)',
                }}
              >{s}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'var(--bg)', border: '1px solid var(--border)',
          opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(14px)',
          transition: 'all .4s ease .15s',
        }}
      >
        <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <IndianRupee size={14} style={{ color: '#6D91BF' }} />
          <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Transactions</span>
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: '#6D91BF18', color: '#6D91BF' }}>
            {filtered.length} records
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Search size={32} style={{ color: 'var(--text-secondary)', opacity: .4 }} />
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No transactions match your filters</p>
            <button onClick={clearFilters} className="text-xs font-semibold px-3 py-1.5 rounded-xl" style={{ background: '#9D679F18', color: '#9D679F' }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs uppercase" style={{ background: 'var(--hover)', color: 'var(--text-secondary)' }}>
                  {['TXN ID', 'Date', 'Client', 'Service', 'Stylist', 'Method', 'Amount', 'Status'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => {
                  const sc = statusCfg[t.status]
                  const mc = methodCfg[t.method]
                  const StatusIcon = sc.icon
                  return (
                    <tr
                      key={t.id}
                      className="transition-colors"
                      style={{
                        borderTop: '1px solid var(--border)',
                        opacity: mounted ? 1 : 0,
                        transition: `opacity .3s ease ${.2 + i * .04}s`,
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-bold" style={{ color: '#9D679F' }}>{t.id}</span>
                      </td>
                      <td className="px-5 py-3.5 text-xs whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>{t.date}</td>
                      <td className="px-5 py-3.5 font-semibold whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>{t.client}</td>
                      <td className="px-5 py-3.5 text-xs whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>{t.service}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0" style={{ background: '#9D679F' }}>
                            {t.stylist[0]}
                          </div>
                          <span className="text-xs whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>{t.stylist}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: mc.bg, color: mc.text }}>{t.method}</span>
                      </td>
                      <td className="px-5 py-3.5 font-bold whitespace-nowrap" style={{ color: '#9D679F' }}>₹{t.amount.toLocaleString()}</td>
                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full w-fit" style={{ background: sc.bg, color: sc.text }}>
                          <StatusIcon size={10} />{t.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
