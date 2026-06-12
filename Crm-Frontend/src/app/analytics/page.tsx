'use client'

import { useState, useEffect, useRef } from 'react'
import { TrendingUp, TrendingDown, Users, DollarSign, Calendar, ArrowUpRight, Star, Scissors } from 'lucide-react'

const revenueData = [
  { month: 'Aug', value: 82 }, { month: 'Sep', value: 91 }, { month: 'Oct', value: 78 },
  { month: 'Nov', value: 105 }, { month: 'Dec', value: 124 }, { month: 'Jan', value: 118 },
]
const maxRev = Math.max(...revenueData.map(d => d.value))

const clientGrowth2026 = [
  { month: 'Jan', new: 85, returning: 278 }, { month: 'Feb', new: 72, returning: 265 },
  { month: 'Mar', new: 91, returning: 295 }, { month: 'Apr', new: 88, returning: 287 },
  { month: 'May', new: 95, returning: 312 },
]

const clientGrowth2025 = [
  { month: 'Jan', new: 68, returning: 222 }, { month: 'Feb', new: 52, returning: 198 },
  { month: 'Mar', new: 71, returning: 245 }, { month: 'Apr', new: 64, returning: 231 },
  { month: 'May', new: 78, returning: 256 }, { month: 'Jun', new: 82, returning: 268 },
  { month: 'Jul', new: 89, returning: 275 }, { month: 'Aug', new: 76, returning: 261 },
  { month: 'Sep', new: 83, returning: 280 }, { month: 'Oct', new: 91, returning: 293 },
  { month: 'Nov', new: 87, returning: 285 }, { month: 'Dec', new: 94, returning: 301 },
]

const topServices = [
  { name: 'Hair Cut & Color', revenue: 42000, pct: 90, color: '#6F5AA3' },
  { name: 'Facial',           revenue: 24800, pct: 59, color: '#6D91BF' },
  { name: 'Hair Spa',         revenue: 28800, pct: 69, color: '#6F9F8F' },
  { name: 'Manicure',         revenue: 8800,  pct: 21, color: '#C7923E' },
  { name: 'Waxing',           revenue: 19000, pct: 45, color: '#C96F9B' },
]

const SERVICE_META = [
  { color: '#6F5AA3', gradient: 'from-[#6F5AA3] to-[#9D679F]' },
  { color: '#C96F9B', gradient: 'from-[#C96F9B] to-[#D88385]' },
  { color: '#6F9F8F', gradient: 'from-[#6F9F8F] to-[#6D91BF]' },
  { color: '#C7923E', gradient: 'from-[#C7923E] to-[#D88385]' },
  { color: '#6D91BF', gradient: 'from-[#6D91BF] to-[#5F4C86]' },
]

function DonutChart({ services }: { services: typeof topServices }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const size = 200, radius = 70, stroke = 22
  const circumference = 2 * Math.PI * radius
  let offset = 0

  useEffect(() => {
    setVisible(false)
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.35 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [services])

  const totalRevenue = services.reduce((sum, s) => sum + s.revenue, 0)

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <div className="absolute inset-0 rounded-full opacity-20 blur-xl" style={{ background: 'radial-gradient(circle, #6F5AA3 0%, transparent 70%)' }} />
        <svg width={size} height={size} className="-rotate-90 relative">
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#F4E7E9" strokeWidth={stroke} />
          {services.map((s, i) => {
            const meta = SERVICE_META[i % SERVICE_META.length]
            const dash = (s.pct / 100) * circumference
            const seg = (
              <circle key={s.name}
                className="transition-[stroke-dasharray,stroke-dashoffset] duration-1000 ease-out"
                cx={size/2} cy={size/2} r={radius} fill="none"
                stroke={s.color}
                strokeDasharray={visible ? `${dash} ${circumference - dash}` : `0 ${circumference}`}
                strokeDashoffset={visible ? -offset : 0}
                strokeLinecap="round" strokeWidth={stroke}
                style={{ transitionDelay: `${i * 140}ms` }}
              />
            )
            offset += dash
            return seg
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>₹{visible ? (totalRevenue / 1000).toFixed(0) : '0'}k</span>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Total Revenue</span>
        </div>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue',   value: '₹1,24,500', change: '+12.5%', icon: DollarSign, color: '#6F5AA3', bg: '#6F5AA318' },
          { label: 'Total Clients',   value: '1,340',      change: '+5.1%',  icon: Users,      color: '#6D91BF', bg: '#6D91BF18' },
          { label: 'Appointments',    value: '284',        change: '+8.2%',  icon: Calendar,   color: '#6F9F8F', bg: '#6F9F8F18' },
          { label: 'Avg Ticket',      value: '₹438',       change: '-2.3%',  icon: TrendingUp, color: '#C7923E', bg: '#C7923E18' },
        ].map(({ label, value, change, icon: Icon, color, bg }) => {
          const up = change.startsWith('+')
          return (
            <div key={label} className="rounded-2xl p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                  <Icon size={17} style={{ color }} />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${up ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400'}`}>
                  {up ? <ArrowUpRight size={11} /> : <TrendingDown size={11} />}{change}
                </span>
              </div>
              <div className="text-2xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{value}</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Revenue Bar Chart */}
        <div className="rounded-2xl p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <DollarSign size={15} className="text-rose-500" />
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Revenue Trend</h3>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <ArrowUpRight size={11} />+12.5%
            </span>
          </div>
          <div className="flex items-end gap-2 h-36">
            {revenueData.map((d, i) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-semibold" style={{ color: '#6F5AA3' }}>₹{d.value}k</span>
                <div className="w-full rounded-t-lg transition-all duration-500"
                  style={{ height: `${(d.value / maxRev) * 100}px`, background: i === revenueData.length - 1 ? 'linear-gradient(to top, #6F5AA3, #B784B7)' : 'var(--border)' }} />
                <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Client Growth - 2026 */}
        <div className="rounded-2xl p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-5">
            <Users size={15} className="text-sky-500" />
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Client Growth - 2026</h3>
            <div className="ml-auto flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: '#6D91BF' }} />New</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: '#C96F9B' }} />Returning</span>
            </div>
          </div>
          <div className="flex items-end gap-3 h-36">
            {clientGrowth2026.map(d => {
              const maxVal = Math.max(...clientGrowth2026.map(x => Math.max(x.new, x.returning)))
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                  <div className="w-full flex items-end justify-center gap-1">
                    <div className="flex-1 rounded-t-lg transition-all duration-500 relative" 
                      style={{ height: `${(d.new / maxVal) * 120}px`, background: '#6D91BF' }}>
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{d.new}</span>
                    </div>
                    <div className="flex-1 rounded-t-lg transition-all duration-500 relative" 
                      style={{ height: `${(d.returning / maxVal) * 120}px`, background: '#C96F9B' }}>
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{d.returning}</span>
                    </div>
                  </div>
                  <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{d.month}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Client Growth - 2025 */}
        <div className="rounded-2xl p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-5">
            <Users size={15} className="text-purple-500" />
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Client Growth - 2025</h3>
            <div className="ml-auto flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: '#6D91BF' }} />New</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: '#C96F9B' }} />Returning</span>
            </div>
          </div>
          <div className="flex items-end gap-3 h-36">
            {clientGrowth2025.map(d => {
              const maxVal = Math.max(...clientGrowth2025.map(x => Math.max(x.new, x.returning)))
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                  <div className="w-full flex items-end justify-center gap-1">
                    <div className="flex-1 rounded-t-lg transition-all duration-500 relative" 
                      style={{ height: `${(d.new / maxVal) * 120}px`, background: '#6D91BF' }}>
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{d.new}</span>
                    </div>
                    <div className="flex-1 rounded-t-lg transition-all duration-500 relative" 
                      style={{ height: `${(d.returning / maxVal) * 120}px`, background: '#C96F9B' }}>
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{d.returning}</span>
                    </div>
                  </div>
                  <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{d.month}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Top Services with Donut Chart */}
      <div className="rounded-2xl p-6" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Scissors size={15} className="text-rose-500" />
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Top Services by Revenue</h3>
            </div>
            <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>Popular services by booking share</p>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[16rem_1fr] lg:items-center">
          <DonutChart services={topServices} />
          <div className="grid gap-3 sm:grid-cols-2">
            {topServices.map((service, i) => {
              const meta = SERVICE_META[i % SERVICE_META.length]
              return (
                <div key={service.name} className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/[0.03]">
                  <div className={`absolute inset-y-0 left-0 w-1 rounded-l-xl bg-gradient-to-b ${meta.gradient}`} />
                  <div className="mb-3 flex items-center justify-between pl-2">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full shadow-sm" style={{ background: meta.color }} />
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{service.name}</span>
                    </div>
                    <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: `${meta.color}18`, color: meta.color }}>{service.pct}%</span>
                  </div>
                  <div className="mb-2 pl-2">
                    <div className="text-lg font-bold" style={{ color: meta.color }}>₹{service.revenue.toLocaleString()}</div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100 pl-2 dark:bg-white/10">
                    <div className={`h-full rounded-full bg-gradient-to-r ${meta.gradient} transition-all duration-700`} style={{ width: `${service.pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
