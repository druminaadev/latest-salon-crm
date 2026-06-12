'use client'

import { useEffect, useState } from 'react'
import { Star, TrendingUp, TrendingDown, Users, DollarSign, Award, Medal, Trophy, Crown, Scissors, ChevronDown } from 'lucide-react'

const stylists = [
  { name: 'Neha Sharma',  role: 'Senior Stylist', revenue: 48200, services: 142, rating: 4.9, clients: 98,  color: '#6F5AA3', trend: [38, 42, 45, 48, 52, 48] },
  { name: 'Pooja Verma',  role: 'Beautician',     revenue: 32100, services: 98,  rating: 4.7, clients: 72,  color: '#6D91BF', trend: [28, 30, 32, 35, 33, 32] },
  { name: 'Sonal Patel',  role: 'Nail Artist',    revenue: 24800, services: 76,  rating: 4.8, clients: 58,  color: '#6F9F8F', trend: [20, 22, 24, 26, 25, 25] },
  { name: 'Ritu Joshi',   role: 'Makeup Artist',  revenue: 18600, services: 54,  rating: 4.6, clients: 44,  color: '#C7923E', trend: [15, 16, 18, 20, 19, 19] },
  { name: 'Kavita Singh', role: 'Junior Stylist',  revenue: 12400, services: 38,  rating: 4.5, clients: 32,  color: '#C96F9B', trend: [10, 11, 12, 13, 12, 12] },
]

const rankIcons  = [Crown, Trophy, Medal, Award, Award]
const rankColors = ['#C7923E', '#8A7D8E', '#C7923E', '#6F5AA3', '#C96F9B']
const months     = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan']

function useMount() {
  const [m, setM] = useState(false)
  useEffect(() => { const t = setTimeout(() => setM(true), 50); return () => clearTimeout(t) }, [])
  return m
}

function Sparkline({ data, color, mounted, delay }: { data: number[]; color: string; mounted: boolean; delay: number }) {
  const w = 100, h = 32
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 6) - 3
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        style={{ strokeDasharray: 300, strokeDashoffset: mounted ? 0 : 300, transition: `stroke-dashoffset 1.2s ease ${delay}ms` }}
      />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * w
        const y = h - ((v - min) / range) * (h - 6) - 3
        return (
          <circle key={i} cx={x} cy={y} r={i === data.length - 1 ? 3.5 : 2}
            fill={i === data.length - 1 ? color : 'var(--bg)'} stroke={color} strokeWidth="1.5"
            style={{ opacity: mounted ? 1 : 0, transition: `opacity .3s ease ${delay + 700 + i * 60}ms` }}
          />
        )
      })}
    </svg>
  )
}

function StatBox({ label, value, color }: { label: string; value: React.ReactNode; color?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl py-3 px-2" style={{ background: 'var(--hover)' }}>
      <div className="text-sm font-bold leading-tight" style={{ color: color || 'var(--text-primary)' }}>{value}</div>
      <div className="text-[10px] mt-0.5 font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</div>
    </div>
  )
}

export default function StylistProgressPage() {
  const mounted  = useMount()
  const [expanded, setExpanded] = useState<string | null>(null)
  const totalRevenue  = stylists.reduce((s, x) => s + x.revenue, 0)
  const totalServices = stylists.reduce((s, x) => s + x.services, 0)
  const avgRating     = (stylists.reduce((s, x) => s + x.rating, 0) / stylists.length).toFixed(1)

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(10px)', transition: 'all .4s ease' }}
        className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#C7923E18' }}>
          <Users size={17} style={{ color: '#C7923E' }} />
        </div>
        <div>
          <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Stylist Progress</h1>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Individual performance &amp; commission tracking</p>
        </div>
      </div>

      {/* ── Team KPIs ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(14px)', transition: 'all .4s ease .05s' }}>
        {[
          { label: 'Team Revenue',  value: `₹${(totalRevenue / 1000).toFixed(0)}k`, icon: DollarSign, color: '#6F5AA3' },
          { label: 'Services Done', value: totalServices,                            icon: Scissors,   color: '#6D91BF' },
          { label: 'Avg Rating',    value: avgRating,                                icon: Star,       color: '#C7923E' },
          { label: 'Top Earner',    value: stylists[0].name.split(' ')[0],           icon: Crown,      color: '#6F9F8F' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
              <Icon size={16} style={{ color }} />
            </div>
            <div>
              <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{value}</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Stylist Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {stylists.map((s, rank) => {
          const RankIcon   = rankIcons[rank]
          const isExpanded = expanded === s.name
          const lastChange = s.trend[s.trend.length - 1] - s.trend[s.trend.length - 2]
          const sharePct   = Math.round((s.revenue / totalRevenue) * 100)
          const commission = Math.round(s.revenue * 0.1)
          const avgTicket  = Math.round(s.revenue / s.services)

          return (
            <div
              key={s.name}
              className="rounded-2xl overflow-hidden flex flex-col"
              style={{
                background: 'var(--bg)',
                border: `1.5px solid ${isExpanded ? s.color : 'var(--border)'}`,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'none' : 'translateY(20px)',
                transition: `opacity .45s ease ${rank * .08}s, transform .45s ease ${rank * .08}s, border-color .2s`,
                boxShadow: isExpanded ? `0 0 0 3px ${s.color}22` : 'none',
              }}
            >
              {/* Colored top bar */}
              <div className="h-1.5 w-full shrink-0" style={{ background: `linear-gradient(90deg, ${s.color}, ${s.color}88)` }} />

              {/* Card body */}
              <div className="p-5 flex flex-col gap-4 flex-1">

                {/* ── Avatar + name + rank badge ── */}
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-sm"
                      style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}bb)` }}
                    >
                      {s.name[0]}
                    </div>
                    {/* Rank badge */}
                    <div
                      className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center shadow"
                      style={{ background: rankColors[rank] }}
                    >
                      <RankIcon size={11} color="#fff" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm leading-tight truncate" style={{ color: 'var(--text-primary)' }}>{s.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{s.role}</div>
                    {/* Star rating inline */}
                    <div className="flex items-center gap-1 mt-1.5">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={10}
                          fill={i <= Math.round(s.rating) ? '#C7923E' : 'none'}
                          stroke="#C7923E" strokeWidth={1.5}
                        />
                      ))}
                      <span className="text-[10px] font-bold ml-0.5" style={{ color: '#C7923E' }}>{s.rating}</span>
                    </div>
                  </div>

                  {/* Trend badge */}
                  <div
                    className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full shrink-0"
                    style={{
                      background: lastChange > 0 ? '#6F9F8F18' : lastChange < 0 ? '#D8838518' : 'var(--hover)',
                      color: lastChange > 0 ? '#6F9F8F' : lastChange < 0 ? '#D88385' : 'var(--text-secondary)',
                    }}
                  >
                    {lastChange > 0
                      ? <TrendingUp size={11} />
                      : lastChange < 0
                        ? <TrendingDown size={11} />
                        : null}
                    {lastChange > 0 ? '+' : ''}{lastChange}
                  </div>
                </div>

                {/* ── 4 stat boxes ── */}
                <div className="grid grid-cols-4 gap-2">
                  <StatBox label="Revenue"  value={`₹${(s.revenue / 1000).toFixed(1)}k`} color={s.color} />
                  <StatBox label="Services" value={s.services} />
                  <StatBox label="Clients"  value={s.clients} />
                  <StatBox label="Comm."    value={`₹${(commission / 1000).toFixed(1)}k`} color="#6F9F8F" />
                </div>

                {/* ── Revenue share bar ── */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span style={{ color: 'var(--text-secondary)' }}>Revenue share</span>
                    <span className="font-bold" style={{ color: s.color }}>{sharePct}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--hover)' }}>
                    <div className="h-2 rounded-full"
                      style={{
                        width: mounted ? `${sharePct}%` : '0%',
                        background: `linear-gradient(90deg, ${s.color}, ${s.color}88)`,
                        transition: `width 1s ease ${.3 + rank * .1}s`,
                      }}
                    />
                  </div>
                </div>

                {/* ── Sparkline ── */}
                <div className="rounded-xl p-3" style={{ background: 'var(--hover)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold" style={{ color: 'var(--text-secondary)' }}>6-month bookings</span>
                    <span className="text-[10px] font-bold" style={{ color: s.color }}>
                      {s.trend[s.trend.length - 1]} this month
                    </span>
                  </div>
                  <Sparkline data={s.trend} color={s.color} mounted={mounted} delay={200 + rank * 100} />
                  <div className="flex justify-between mt-1.5">
                    {months.map((m, mi) => (
                      <span key={m} className="text-[9px] font-medium"
                        style={{ color: mi === months.length - 1 ? s.color : 'var(--text-secondary)' }}>
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* ── Expand toggle ── */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : s.name)}
                  className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-semibold transition-colors"
                  style={{
                    background: isExpanded ? `${s.color}18` : 'var(--hover)',
                    color: isExpanded ? s.color : 'var(--text-secondary)',
                  }}
                >
                  {isExpanded ? 'Hide details' : 'View details'}
                  <ChevronDown size={13} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
                </button>

                {/* ── Expanded detail ── */}
                {isExpanded && (
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {[
                      { label: 'Avg Ticket',    value: `₹${avgTicket.toLocaleString()}` },
                      { label: 'Commission',    value: `₹${commission.toLocaleString()}` },
                      { label: 'Clients/Month', value: Math.round(s.clients / 6) },
                    ].map(({ label, value }) => (
                      <div key={label} className="rounded-xl p-3 text-center" style={{ border: `1px solid ${s.color}33`, background: `${s.color}08` }}>
                        <div className="text-sm font-bold" style={{ color: s.color }}>{value}</div>
                        <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
