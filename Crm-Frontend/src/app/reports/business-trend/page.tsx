'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, ArrowUpRight, BarChart2, Layers } from 'lucide-react'

const periods = ['This Month', 'Last Month', 'Last 3 Months', 'Last 6 Months', 'This Year']

const trendData = [
  { period: 'Aug', revenue: 82000  },
  { period: 'Sep', revenue: 91000  },
  { period: 'Oct', revenue: 88000  },
  { period: 'Nov', revenue: 105000 },
  { period: 'Dec', revenue: 124000 },
  { period: 'Jan', revenue: 118000 },
]
const maxRevenue = Math.max(...trendData.map(d => d.revenue))

const categories = [
  { name: 'Hair Services', revenue: 52000, pct: 44, change: +12, color: '#9D679F' },
  { name: 'Skin & Facial', revenue: 28000, pct: 24, change: +8,  color: '#6D91BF' },
  { name: 'Nail Services', revenue: 18000, pct: 15, change: -3,  color: '#6F9F8F' },
  { name: 'Memberships',   revenue: 12000, pct: 10, change: +22, color: '#C7923E' },
  { name: 'Body & Waxing', revenue: 8000,  pct: 7,  change: +5,  color: '#C96F9B' },
]

const kpis = [
  { label: 'Revenue',     value: '₹1,18,000', change: '+12.5%', up: true  },
  { label: 'Services',    value: '290',        change: '+8.2%',  up: true  },
  { label: 'New Members', value: '22',         change: '+22%',   up: true  },
  { label: 'Avg Ticket',  value: '₹407',       change: '-2.3%',  up: false },
]

const comparison = [
  { label: 'Revenue',  p1: 450000, p2: 380000 },
  { label: 'Bookings', p1: 450,    p2: 380    },
  { label: 'Services', p1: 520,    p2: 440    },
  { label: 'Products', p1: 70000,  p2: 60000  },
]

function useMount() {
  const [m, setM] = useState(false)
  useEffect(() => { const t = setTimeout(() => setM(true), 50); return () => clearTimeout(t) }, [])
  return m
}

function Bar({ value, max, color, delay, mounted }: { value: number; max: number; color: string; delay: number; mounted: boolean }) {
  const h = Math.round((value / max) * 160)
  return (
    <div className="rounded-t-xl w-full"
      style={{ height: mounted ? `${h}px` : '4px', background: color, transition: `height .8s cubic-bezier(.34,1.56,.64,1) ${delay}ms` }} />
  )
}

export default function BusinessTrendPage() {
  const mounted = useMount()
  const [activePeriod, setActivePeriod] = useState('This Month')
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(10px)', transition: 'all .4s ease' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#6F9F8F18' }}>
          <TrendingUp size={17} style={{ color: '#6F9F8F' }} />
        </div>
        <div>
          <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Business Trends</h1>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Month-over-month growth & revenue analysis</p>
        </div>
      </div>

      {/* Period selector */}
      <div className="flex flex-wrap gap-2"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(10px)', transition: 'all .4s ease .05s' }}>
        {periods.map(p => (
          <button key={p} onClick={() => setActivePeriod(p)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: activePeriod === p ? '#6F9F8F' : 'var(--hover)',
              color: activePeriod === p ? '#fff' : 'var(--text-secondary)',
              border: activePeriod === p ? 'none' : '1px solid var(--border)',
              transform: activePeriod === p ? 'scale(1.03)' : 'scale(1)',
            }}>
            {p}
          </button>
        ))}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(14px)', transition: 'all .4s ease .1s' }}>
        {kpis.map(({ label, value, change, up }) => (
          <div key={label} className="rounded-2xl p-4" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</span>
              <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: up ? '#6F9F8F18' : '#D8838518', color: up ? '#6F9F8F' : '#D88385' }}>
                {up ? <ArrowUpRight size={9} /> : <TrendingDown size={9} />}{change}
              </span>
            </div>
            <div className="text-xl font-bold" style={{ color: up ? '#6F9F8F' : '#D88385' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="rounded-2xl p-6"
        style={{ background: 'var(--bg)', border: '1px solid var(--border)', opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(14px)', transition: 'all .4s ease .15s' }}>
        <div className="flex items-center gap-2 mb-6">
          <BarChart2 size={15} style={{ color: '#6F9F8F' }} />
          <h2 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Revenue Trend</h2>
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: '#6F9F8F18', color: '#6F9F8F' }}>6 months</span>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col justify-between text-[10px] pb-6" style={{ color: 'var(--text-secondary)', height: '176px' }}>
            {[125, 100, 75, 50, 25, 0].map(v => <span key={v} className="leading-none">₹{v}k</span>)}
          </div>
          <div className="flex-1">
            <div className="relative" style={{ height: '160px' }}>
              {[0, 25, 50, 75, 100].map(pct => (
                <div key={pct} className="absolute w-full" style={{ bottom: `${pct}%`, borderTop: '1px dashed var(--border)', opacity: .6 }} />
              ))}
              <div className="flex items-end gap-3 h-full">
                {trendData.map((d, i) => {
                  const isLast = i === trendData.length - 1
                  const isHovered = hoveredBar === i
                  return (
                    <div key={d.period} className="flex-1 flex flex-col items-center gap-0 relative cursor-pointer"
                      onMouseEnter={() => setHoveredBar(i)} onMouseLeave={() => setHoveredBar(null)}>
                      {isHovered && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg text-[11px] font-bold text-white whitespace-nowrap z-10 shadow-lg"
                          style={{ background: '#4C3A76' }}>
                          ₹{(d.revenue / 1000).toFixed(0)}k
                        </div>
                      )}
                      <Bar value={d.revenue} max={maxRevenue}
                        color={isLast ? 'linear-gradient(to top,#9D679F,#D88385)' : isHovered ? '#9D679F60' : 'var(--hover)'}
                        delay={i * 80} mounted={mounted} />
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="flex gap-3 mt-2">
              {trendData.map((d, i) => (
                <div key={d.period} className="flex-1 text-center">
                  <span className="text-[11px] font-semibold"
                    style={{ color: i === trendData.length - 1 ? '#9D679F' : 'var(--text-secondary)' }}>
                    {d.period}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="rounded-2xl p-6"
        style={{ background: 'var(--bg)', border: '1px solid var(--border)', opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(14px)', transition: 'all .4s ease .2s' }}>
        <div className="flex items-center gap-2 mb-5">
          <Layers size={15} style={{ color: '#9D679F' }} />
          <h2 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Revenue by Category</h2>
        </div>
        <div className="space-y-5">
          {categories.map((c, i) => (
            <div key={c.name}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{c.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>₹{c.revenue.toLocaleString()}</span>
                  <span className="flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: c.change > 0 ? '#6F9F8F18' : '#D8838518', color: c.change > 0 ? '#6F9F8F' : '#D88385' }}>
                    {c.change > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}{Math.abs(c.change)}%
                  </span>
                </div>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--hover)' }}>
                <div className="h-2.5 rounded-full"
                  style={{ width: mounted ? `${c.pct}%` : '0%', background: c.color, transition: `width .9s cubic-bezier(.34,1.56,.64,1) ${.3 + i * .1}s` }} />
              </div>
              <div className="text-[10px] mt-1 text-right" style={{ color: 'var(--text-secondary)' }}>{c.pct}% of total</div>
            </div>
          ))}
        </div>
      </div>

      {/* Period comparison */}
      <div className="rounded-2xl p-6"
        style={{ background: 'var(--bg)', border: '1px solid var(--border)', opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(14px)', transition: 'all .4s ease .25s' }}>
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={15} style={{ color: '#9D679F' }} />
          <h2 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Period Comparison</h2>
          <div className="ml-auto flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: '#9D679F' }} />Jan 2024</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: '#9D679F40' }} />Dec 2023</span>
          </div>
        </div>
        <div className="space-y-4">
          {comparison.map((c, i) => {
            const maxVal = Math.max(c.p1, c.p2)
            const growth = (((c.p1 - c.p2) / c.p2) * 100).toFixed(1)
            return (
              <div key={c.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{c.label}</span>
                  <span className="text-xs font-bold" style={{ color: '#6F9F8F' }}>+{growth}%</span>
                </div>
                <div className="space-y-1.5">
                  {[{ val: c.p1, color: '#9D679F' }, { val: c.p2, color: '#9D679F40' }].map(({ val, color }) => (
                    <div key={color} className="flex items-center gap-2">
                      <div className="w-16 text-[10px] text-right" style={{ color: 'var(--text-secondary)' }}>
                        {val > 1000 ? `₹${(val / 1000).toFixed(0)}k` : val}
                      </div>
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--hover)' }}>
                        <div className="h-2 rounded-full"
                          style={{ width: mounted ? `${(val / maxVal) * 100}%` : '0%', background: color, transition: `width .9s ease ${.3 + i * .08}s` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
