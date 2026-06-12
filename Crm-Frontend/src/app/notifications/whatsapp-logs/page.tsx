'use client'

import { useState } from 'react'
import { Bell, CheckCircle2, XCircle, Clock, Search, MessageSquare } from 'lucide-react'

const logs = [
  { id: 1, type: 'Booking Confirmation', client: 'Priya Sharma',  avatar: 'PS', color: 'bg-rose-500', phone: '+91 98765 43210', sentAt: '2024-01-15 10:05', status: 'Delivered', template: 'booking_confirm' },
  { id: 2, type: '24h Reminder',         client: 'Riya Patel',    avatar: 'RP', color: 'bg-sky-500',    phone: '+91 98765 43211', sentAt: '2024-01-14 11:00', status: 'Delivered', template: 'reminder_24h' },
  { id: 3, type: 'Birthday Benefit',     client: 'Anita Verma',   avatar: 'AV', color: 'bg-emerald-500',phone: '+91 98765 43212', sentAt: '2024-01-01 09:00', status: 'Delivered', template: 'birthday_offer' },
  { id: 4, type: 'Re-engagement',        client: 'Meena Joshi',   avatar: 'MJ', color: 'bg-amber-500',  phone: '+91 98765 43213', sentAt: '2024-01-08 10:00', status: 'Failed',    template: 'dormant_reengagement' },
  { id: 5, type: 'Invoice PDF',          client: 'Sunita Rao',    avatar: 'SR', color: 'bg-rose-500',   phone: '+91 98765 43214', sentAt: '2024-01-13 16:30', status: 'Delivered', template: 'invoice_pdf' },
  { id: 6, type: 'Booking Confirmation', client: 'Kavita Singh',  avatar: 'KS', color: 'bg-pink-500',   phone: '+91 98765 43215', sentAt: '2024-01-13 14:00', status: 'Pending',   template: 'booking_confirm' },
]

const typeColors: Record<string, { bg: string; text: string }> = {
  'Booking Confirmation': { bg: '#6D91BF18', text: '#6D91BF' },
  '24h Reminder':         { bg: '#C7923E18', text: '#C7923E' },
  'Birthday Benefit':     { bg: '#C96F9B18', text: '#C96F9B' },
  'Re-engagement':        { bg: '#D8838518', text: '#D88385' },
  'Invoice PDF':          { bg: '#6F5AA318', text: '#6F5AA3' },
}

const statusCfg: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  Delivered: { icon: CheckCircle2, color: '#6F9F8F', bg: '#6F9F8F18' },
  Failed:    { icon: XCircle,      color: '#D88385', bg: '#D8838518' },
  Pending:   { icon: Clock,        color: '#C7923E', bg: '#C7923E18' },
}

const stats = [
  { label: 'Sent Today',  value: '48',  color: '#6F5AA3' },
  { label: 'Delivered',   value: '45',  color: '#6F9F8F' },
  { label: 'Failed',      value: '3',   color: '#D88385' },
  { label: 'This Month',  value: '842', color: '#6D91BF' },
]

export default function WhatsAppLogsPage() {
  const [search, setSearch]             = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const filtered = logs.filter(l => {
    const matchSearch = l.client.toLowerCase().includes(search.toLowerCase()) || l.type.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || l.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl p-4 flex items-center gap-3" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
              <MessageSquare size={16} style={{ color }} />
            </div>
            <div>
              <div className="text-xl font-bold" style={{ color }}>{value}</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by client or type…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }} />
        </div>
        <div className="flex gap-2">
          {['All', 'Delivered', 'Pending', 'Failed'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold transition"
              style={{
                background: statusFilter === s ? '#6F5AA3' : 'transparent',
                color: statusFilter === s ? '#fff' : 'var(--text-secondary)',
                border: statusFilter === s ? 'none' : '1px solid var(--border)',
              }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Log table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <Bell size={15} className="text-rose-500" />
          <h2 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>WhatsApp Message Log</h2>
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400 font-semibold">
            {filtered.length} messages
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase" style={{ background: 'var(--hover)', color: 'var(--text-secondary)' }}>
                <th className="text-left px-5 py-3.5 font-semibold">Type</th>
                <th className="text-left px-5 py-3.5 font-semibold">Client</th>
                <th className="text-left px-5 py-3.5 font-semibold">Phone</th>
                <th className="text-left px-5 py-3.5 font-semibold">Template</th>
                <th className="text-left px-5 py-3.5 font-semibold">Sent At</th>
                <th className="text-left px-5 py-3.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => {
                const tc = typeColors[log.type] ?? { bg: '#8A7D8E18', text: '#8A7D8E' }
                const sc = statusCfg[log.status]
                const StatusIcon = sc.icon
                return (
                  <tr key={log.id} className="transition" style={{ borderTop: '1px solid var(--border)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: tc.bg, color: tc.text }}>{log.type}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-full ${log.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                          {log.avatar}
                        </div>
                        <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{log.client}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs" style={{ color: 'var(--text-secondary)' }}>{log.phone}</td>
                    <td className="px-5 py-3.5">
                      <code className="text-xs px-2 py-0.5 rounded-lg" style={{ background: 'var(--hover)', color: 'var(--text-secondary)' }}>{log.template}</code>
                    </td>
                    <td className="px-5 py-3.5 text-xs" style={{ color: 'var(--text-secondary)' }}>{log.sentAt}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: sc.bg }}>
                          <StatusIcon size={11} style={{ color: sc.color }} />
                        </div>
                        <span className="text-xs font-semibold" style={{ color: sc.color }}>{log.status}</span>
                      </div>
                    </td>
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
