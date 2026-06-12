'use client'

import { DollarSign, TrendingUp, TrendingDown, Calendar, ArrowUpRight } from 'lucide-react'

const monthlyRevenue = [
  { month: 'Jan', revenue: 118000, target: 120000, growth: 12.5 },
  { month: 'Feb', revenue: 125000, target: 120000, growth: 15.2 },
  { month: 'Mar', revenue: 132000, target: 130000, growth: 18.8 },
  { month: 'Apr', revenue: 128000, target: 130000, growth: 14.3 },
  { month: 'May', revenue: 145000, target: 140000, growth: 22.1 },
  { month: 'Jun', revenue: 152000, target: 150000, growth: 25.6 },
]

const revenueByService = [
  { category: 'Hair Services', revenue: 285000, pct: 42, color: '#6F5AA3' },
  { category: 'Skin Care', revenue: 195000, pct: 29, color: '#6D91BF' },
  { category: 'Nail Services', revenue: 125000, pct: 18, color: '#6F9F8F' },
  { category: 'Body Treatments', revenue: 75000, pct: 11, color: '#C7923E' },
]

const maxRev = Math.max(...monthlyRevenue.map(m => m.revenue))

export default function RevenueAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Revenue Analytics</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Track revenue performance and trends</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '₹6.8L', change: '+18.5%', icon: DollarSign, color: '#6F5AA3' },
          { label: 'Avg Monthly', value: '₹1.13L', change: '+12.3%', icon: Calendar, color: '#6D91BF' },
          { label: 'This Month', value: '₹1.52L', change: '+25.6%', icon: TrendingUp, color: '#6F9F8F' },
          { label: 'Target Achievement', value: '101%', change: '+1.3%', icon: ArrowUpRight, color: '#C7923E' },
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

      <div className="rounded-2xl p-6" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Monthly Revenue Trend</h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background: '#6F5AA3' }} />Revenue</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background: 'var(--border)' }} />Target</span>
          </div>
        </div>
        <div className="flex items-end gap-3 h-64">
          {monthlyRevenue.map(m => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-semibold" style={{ color: '#6F5AA3' }}>₹{(m.revenue / 1000).toFixed(0)}k</span>
              <div className="w-full flex flex-col gap-1">
                <div className="w-full rounded-t-lg transition-all duration-500"
                  style={{ height: `${(m.revenue / maxRev) * 200}px`, background: 'linear-gradient(to top, #6F5AA3, #B784B7)' }} />
                <div className="w-full h-1 rounded" style={{ background: m.revenue >= m.target ? '#6F9F8F' : '#D88385' }} />
              </div>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{m.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl p-6" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <h3 className="font-bold text-lg mb-5" style={{ color: 'var(--text-primary)' }}>Revenue by Service Category</h3>
        <div className="space-y-5">
          {revenueByService.map(s => (
            <div key={s.category}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{s.category}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.pct}%</span>
                  <span className="text-sm font-bold" style={{ color: s.color }}>₹{(s.revenue / 1000).toFixed(0)}k</span>
                </div>
              </div>
              <div className="h-3 rounded-full" style={{ background: 'var(--hover)' }}>
                <div className="h-3 rounded-full transition-all duration-700" style={{ width: `${s.pct}%`, background: s.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
