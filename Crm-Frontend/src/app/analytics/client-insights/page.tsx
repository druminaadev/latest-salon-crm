'use client'

import { Users, UserPlus, UserCheck, TrendingUp, ArrowUpRight, Star } from 'lucide-react'

const clientSegments = [
  { segment: 'VIP Members', count: 124, revenue: 285000, avgSpend: 2298, color: '#6F5AA3' },
  { segment: 'Regular Clients', count: 856, revenue: 412000, avgSpend: 481, color: '#6D91BF' },
  { segment: 'New Clients', count: 68, revenue: 28000, avgSpend: 412, color: '#6F9F8F' },
  { segment: 'Dormant (3+ months)', count: 142, revenue: 0, avgSpend: 0, color: '#D88385' },
]

const topClients = [
  { name: 'Priya Sharma', visits: 24, spent: 42800, lastVisit: '2024-01-15' },
  { name: 'Anita Verma', visits: 32, spent: 38200, lastVisit: '2024-01-14' },
  { name: 'Sunita Rao', visits: 28, spent: 35600, lastVisit: '2024-01-13' },
  { name: 'Riya Patel', visits: 18, spent: 29800, lastVisit: '2024-01-12' },
  { name: 'Kavita Singh', visits: 22, spent: 28400, lastVisit: '2024-01-11' },
]

const retentionData = [
  { month: 'Jan', new: 68, returning: 222, retention: 76.5 },
  { month: 'Feb', new: 74, returning: 236, retention: 78.2 },
  { month: 'Mar', new: 55, returning: 245, retention: 81.7 },
  { month: 'Apr', new: 61, returning: 251, retention: 80.4 },
  { month: 'May', new: 82, returning: 268, retention: 76.6 },
  { month: 'Jun', new: 68, returning: 274, retention: 80.1 },
]

export default function ClientInsightsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Client Insights</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Analyze client behavior and retention</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Clients', value: '1,340', change: '+5.2%', icon: Users, color: '#6F5AA3' },
          { label: 'New This Month', value: '68', change: '+12.8%', icon: UserPlus, color: '#6F9F8F' },
          { label: 'Retention Rate', value: '80.1%', change: '+2.3%', icon: UserCheck, color: '#6D91BF' },
          { label: 'Avg Lifetime Value', value: '₹8,420', change: '+15.4%', icon: TrendingUp, color: '#C7923E' },
        ].map(({ label, value, change, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
                <Icon size={17} style={{ color }} />
              </div>
              <span className="flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <ArrowUpRight size={11} />{change}
              </span>
            </div>
            <div className="text-2xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{value}</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl p-6" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <h3 className="font-bold text-lg mb-5" style={{ color: 'var(--text-primary)' }}>Client Segments</h3>
          <div className="space-y-4">
            {clientSegments.map(seg => (
              <div key={seg.segment} className="p-4 rounded-xl" style={{ background: 'var(--hover)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{seg.segment}</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${seg.color}18`, color: seg.color }}>
                    {seg.count}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span>Revenue: ₹{(seg.revenue / 1000).toFixed(0)}k</span>
                  <span>Avg: ₹{seg.avgSpend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-6" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <h3 className="font-bold text-lg mb-5" style={{ color: 'var(--text-primary)' }}>Top Clients</h3>
          <div className="space-y-3">
            {topClients.map((client, i) => (
              <div key={client.name} className="flex items-center gap-3 p-3 rounded-xl transition"
                style={{ background: 'var(--hover)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background: i === 0 ? '#6F5AA3' : i === 1 ? '#6D91BF' : '#6F9F8F' }}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{client.name}</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{client.visits} visits</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold" style={{ color: '#6F5AA3' }}>₹{(client.spent / 1000).toFixed(1)}k</div>
                  <div className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{client.lastVisit}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-6" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <h3 className="font-bold text-lg mb-5" style={{ color: 'var(--text-primary)' }}>Client Retention Trend</h3>
        <div className="flex items-end gap-4 h-48">
          {retentionData.map(m => {
            const total = m.new + m.returning
            const maxTotal = Math.max(...retentionData.map(x => x.new + x.returning))
            const h = (total / maxTotal) * 160
            const newH = (m.new / total) * h
            const retH = (m.returning / total) * h
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-semibold" style={{ color: '#6F9F8F' }}>{m.retention}%</span>
                <div className="w-full flex flex-col rounded-t-lg overflow-hidden">
                  <div style={{ height: `${newH}px`, background: '#6F9F8F' }} />
                  <div style={{ height: `${retH}px`, background: '#6F5AA3' }} />
                </div>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{m.month}</span>
              </div>
            )
          })}
        </div>
        <div className="flex items-center justify-center gap-4 mt-4 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background: '#6F9F8F' }} />New</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background: '#6F5AA3' }} />Returning</span>
        </div>
      </div>
    </div>
  )
}
