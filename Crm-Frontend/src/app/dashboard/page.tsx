'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowUpRight, CalendarCheck, Clock, DollarSign, Plus,
  Scissors, Sparkles, Users, TrendingUp, Star, Package,
  Bell, MessageSquare, MapPin,
} from 'lucide-react'
import { useLocationStore, BRANCHES, BRANCH_DATA } from '@/store/locationStore'

const palette = {
  rose:  '#6F5AA3',
  coral: '#9D679F',
  sage:  '#6F9F8F',
  amber: '#C7923E',
  sky:   '#6D91BF',
  plum:  '#5F4C86',
  pink:  '#C96F9B',
}

const METRIC_META = [
  { icon: DollarSign,   color: palette.rose,  gradient: 'from-[#6F5AA3] to-[#9D679F]' },
  { icon: CalendarCheck,color: palette.sky,   gradient: 'from-[#6D91BF] to-[#5F4C86]' },
  { icon: Users,        color: palette.sage,  gradient: 'from-[#6F9F8F] to-[#6D91BF]' },
  { icon: Sparkles,     color: palette.pink,  gradient: 'from-[#C96F9B] to-[#D88385]' },
]

const SERVICE_META = [
  { color: palette.rose,  gradient: 'from-[#6F5AA3] to-[#9D679F]' },
  { color: palette.pink,  gradient: 'from-[#C96F9B] to-[#D88385]' },
  { color: palette.sage,  gradient: 'from-[#6F9F8F] to-[#6D91BF]' },
  { color: palette.amber, gradient: 'from-[#C7923E] to-[#D88385]' },
]

const NOTIF_COLORS: Record<string, string> = {
  booking:   palette.sky,
  inventory: palette.amber,
  review:    palette.pink,
}

const statusStyles: Record<string, string> = {
  Done:   'bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400',
  Active: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  Next:   'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  Booked: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300',
}

const statusBorder: Record<string, string> = {
  Done:   'border-l-gray-300',
  Active: 'border-l-emerald-400',
  Next:   'border-l-blue-400',
  Booked: 'border-l-purple-400',
}

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function avatarColor(name: string) {
  const colors = ['#6F5AA3', '#9D679F', '#6F9F8F', '#6D91BF', '#C7923E', '#C96F9B']
  return colors[name.charCodeAt(0) % colors.length]
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-white/80 bg-white shadow-[0_18px_45px_rgba(36,21,26,0.07)] dark:border-white/10 dark:bg-white/[0.04] ${className}`}>
      {children}
    </section>
  )
}

function StaffLoadBar({ load, active }: { load: number; active: boolean }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
      <div className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${active ? 'from-[#6F9F8F] to-[#6D91BF]' : 'from-[#C7923E] to-[#D88385]'}`}
        style={{ width: visible ? `${load}%` : '0%' }} />
    </div>
  )
}

function DonutChart({ services }: { services: { name: string; value: number }[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const size = 168, radius = 58, stroke = 18
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

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <div className="absolute inset-0 rounded-full opacity-20 blur-xl" style={{ background: 'radial-gradient(circle, #6F5AA3 0%, transparent 70%)' }} />
        <svg width={size} height={size} className="-rotate-90 relative">
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#F4E7E9" strokeWidth={stroke} />
          {services.map((s, i) => {
            const meta = SERVICE_META[i % SERVICE_META.length]
            const dash = (s.value / 100) * circumference
            const seg = (
              <circle key={s.name}
                className="transition-[stroke-dasharray,stroke-dashoffset] duration-1000 ease-out"
                cx={size/2} cy={size/2} r={radius} fill="none"
                stroke={meta.color}
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
          <span className="text-2xl font-bold text-gray-950 dark:text-white">{visible ? '100%' : '0%'}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">services</span>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { branchId }   = useLocationStore()
  const activeBranch   = BRANCHES.find(b => b.id === branchId) ?? BRANCHES[0]
  const data           = BRANCH_DATA[branchId]

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  return (
    <main className="min-h-full space-y-6 bg-[#FBF4F8] pb-6 text-gray-950 dark:bg-transparent dark:text-white">

      {/* ── Header ── */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white pl-8 pr-6 py-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        {/* Left purple brand stripe */}
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#9D679F]" />
        
        {/* Subtle dot pattern background */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#9D679F 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{getGreeting()}, Admin!</h1>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                Live System Connected
              </div>
            </div>
            <p className="text-md font-medium text-gray-500 dark:text-gray-400">
              Welcome back to SalonPro. Here is your business activity overview for today,
            </p>
            <p className="text-sm font-bold text-[#9D679F] mt-1">
              {today}
            </p>
          </div>
          <Link href="/booking/new"
            className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-[#9D679F] px-5 text-sm font-semibold text-white transition hover:bg-[#8A568C] sm:self-auto shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
            <Plus size={16} /> New Booking
          </Link>
        </div>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.metrics.map(({ label, value, helper }, i) => {
          const { icon: Icon, color, gradient } = METRIC_META[i]
          return (
            <div key={label} className="group relative overflow-hidden rounded-2xl border border-white/80 bg-white p-5 shadow-[0_18px_45px_rgba(36,21,26,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(36,21,26,0.13)] dark:border-white/10 dark:bg-white/[0.04]">
              <div className={`absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r ${gradient}`} />
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-[0.06]" style={{ background: color }} />
              <div className="flex items-start justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
                  <Icon size={19} className="text-white" />
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#F2FBF6] px-2 py-1 text-xs font-semibold text-[#34835B]">
                  <ArrowUpRight size={12} /> Live
                </span>
              </div>
              <p className="mt-5 text-3xl font-bold tracking-tight text-[#24151A] dark:text-white">{value}</p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{label}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{helper}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Timeline + Staff ── */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#6F5AA3] to-[#9D679F]">
                  <Clock size={13} className="text-white" />
                </div>
                <h2 className="text-base font-semibold text-[#24151A] dark:text-white">Today&apos;s Timeline</h2>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Scannable client appointments for the day</p>
            </div>
            <span className="rounded-full bg-gradient-to-r from-[#6F5AA3] to-[#9D679F] px-3 py-1 text-xs font-semibold text-white shadow-sm">
              {data.timeline.length} visits
            </span>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-white/10">
            {data.timeline.map(item => (
              <div key={`${item.time}-${item.client}`}
                className={`grid gap-3 border-l-4 px-5 py-4 transition hover:bg-[#FBF4F8] dark:hover:bg-white/[0.04] sm:grid-cols-[4.5rem_1fr_auto] sm:items-center ${statusBorder[item.status] ?? 'border-l-transparent'}`}>
                <div className="text-sm font-bold text-[#24151A] dark:text-white">{item.time}</div>
                <div className="flex min-w-0 items-center gap-3">
                  <div className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm sm:flex"
                    style={{ background: avatarColor(item.client) }}>
                    {initials(item.client)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-[#24151A] dark:text-white">{item.client}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusStyles[item.status]}`}>{item.status}</span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">{item.service} · {item.stylist}</p>
                  </div>
                </div>
                <div className="text-sm font-bold text-[#6F5AA3] dark:text-[#C9A8F5]">{item.amount}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#6F9F8F] to-[#6D91BF]">
              <Users size={13} className="text-white" />
            </div>
            <h2 className="text-base font-semibold text-[#24151A] dark:text-white">Staff Tracker</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {data.staff.map(member => {
              const active = member.state === 'Active'
              return (
                <div key={member.name} className="rounded-xl border border-gray-100 bg-[#FFFDFC] p-3 transition hover:shadow-md dark:border-white/10 dark:bg-white/[0.03]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm"
                      style={{ background: avatarColor(member.name) }}>
                      {initials(member.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#24151A] dark:text-white">{member.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${active ? 'bg-[#F2FBF6] text-[#34835B]' : 'bg-[#FFF4E6] text-[#9A641F]'}`}>
                      {member.state}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <StaffLoadBar load={member.load} active={active} />
                    <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{member.next}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* ── Weekly Performance ── */}
      <Card className="overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#6F5AA3] to-[#9D679F]">
                  <TrendingUp size={13} className="text-white" />
                </div>
                <h2 className="text-base font-semibold text-[#24151A] dark:text-white">Weekly Performance</h2>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Revenue & bookings trend · {activeBranch.short}</p>
            </div>
            <span className="rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
              +12% vs last week
            </span>
          </div>
        </div>
        <div className="px-5 py-6">
          <div className="flex items-end justify-between gap-2">
            {data.weeklyPerformance.map(day => (
              <div key={day.day} className="group flex flex-1 flex-col items-center gap-2">
                <div className="relative w-full">
                  <div className="pointer-events-none absolute -top-20 left-1/2 z-10 -translate-x-1/2 rounded-lg border border-gray-200 bg-white px-3 py-2 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 dark:border-white/20 dark:bg-gray-900">
                    <p className="whitespace-nowrap text-xs font-semibold text-[#24151A] dark:text-white">Rs.{day.revenue.toLocaleString()}</p>
                    <p className="whitespace-nowrap text-[10px] text-gray-500 dark:text-gray-400">{day.bookings} bookings</p>
                  </div>
                  <div className={`relative mx-auto w-full rounded-t-lg transition-all duration-700 ${day.isToday ? 'bg-gradient-to-t from-[#6F5AA3] to-[#9D679F] shadow-lg' : 'bg-gradient-to-t from-gray-200 to-gray-300 dark:from-white/10 dark:to-white/20'}`}
                    style={{ height: `${day.height}px` }}>
                    {day.isToday && <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />}
                  </div>
                </div>
                <span className={`text-xs font-semibold ${day.isToday ? 'text-[#6F5AA3] dark:text-[#C9A8F5]' : 'text-gray-500 dark:text-gray-400'}`}>
                  {day.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* ── Top Products + Reviews ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <div className="border-b border-gray-100 px-5 py-4 dark:border-white/10">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#C7923E] to-[#D88385]">
                <Package size={13} className="text-white" />
              </div>
              <h2 className="text-base font-semibold text-[#24151A] dark:text-white">Top Products</h2>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Best-selling retail items this week</p>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-white/10">
            {data.topProducts.map((product, idx) => (
              <div key={product.name} className="flex items-center gap-4 px-5 py-4 transition hover:bg-[#FBF4F8] dark:hover:bg-white/[0.04]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#C7923E] to-[#D88385] text-sm font-bold text-white shadow-sm">
                  {idx + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#24151A] dark:text-white">{product.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{product.sales} sold · {product.stock} in stock</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#24151A] dark:text-white">{product.revenue}</p>
                  <p className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <TrendingUp size={10} />{product.trend}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="border-b border-gray-100 px-5 py-4 dark:border-white/10">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#C96F9B] to-[#6F5AA3]">
                <Star size={13} className="text-white" />
              </div>
              <h2 className="text-base font-semibold text-[#24151A] dark:text-white">Recent Reviews</h2>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Latest customer feedback</p>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-white/10">
            {data.reviews.map(review => (
              <div key={`${review.client}-${review.time}`} className="px-5 py-4 transition hover:bg-[#FBF4F8] dark:hover:bg-white/[0.04]">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#C96F9B] to-[#6F5AA3] text-xs font-bold text-white shadow-sm">
                      {initials(review.client)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#24151A] dark:text-white">{review.client}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{review.service} · {review.time}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Live Activity ── */}
      <Card className="overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-4 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#6D91BF] to-[#5F4C86]">
                  <Bell size={13} className="text-white" />
                </div>
                <h2 className="text-base font-semibold text-[#24151A] dark:text-white">Live Activity</h2>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Real-time salon updates · {activeBranch.short}</p>
            </div>
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
            </span>
          </div>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-white/10">
          {data.notifications.map((notif, idx) => {
            const color = NOTIF_COLORS[notif.type] ?? palette.sky
            return (
              <div key={idx} className="flex items-start gap-4 px-5 py-4 transition hover:bg-[#FBF4F8] dark:hover:bg-white/[0.04]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ background: `${color}20` }}>
                  <MessageSquare size={14} style={{ color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[#24151A] dark:text-white">{notif.message}</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{notif.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* ── Service Analytics ── */}
      <Card className="p-5">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#C96F9B] to-[#6F5AA3]">
                <Scissors size={13} className="text-white" />
              </div>
              <h2 className="text-base font-semibold text-[#24151A] dark:text-white">Service Analytics</h2>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Popular treatments by booking share · {activeBranch.short}</p>
          </div>
          <Link href="/services" className="text-xs font-semibold text-salon-600 hover:underline dark:text-salon-100">
            Manage services →
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-[14rem_1fr] lg:items-center">
          <DonutChart services={data.services} />
          <div className="grid gap-3 sm:grid-cols-2">
            {data.services.map((service, i) => {
              const meta = SERVICE_META[i % SERVICE_META.length]
              return (
                <div key={service.name} className="group relative overflow-hidden rounded-xl border border-gray-100 bg-[#FFFDFC] p-4 transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/[0.03]">
                  <div className={`absolute inset-y-0 left-0 w-1 rounded-l-xl bg-gradient-to-b ${meta.gradient}`} />
                  <div className="mb-3 flex items-center justify-between pl-2">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full shadow-sm" style={{ background: meta.color }} />
                      <span className="text-sm font-semibold text-[#24151A] dark:text-white">{service.name}</span>
                    </div>
                    <span className="rounded-full px-2 py-0.5 text-sm font-bold" style={{ background: `${meta.color}18`, color: meta.color }}>{service.value}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100 pl-2 dark:bg-white/10">
                    <div className={`h-full rounded-full bg-gradient-to-r ${meta.gradient}`} style={{ width: `${service.value}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Card>
    </main>
  )
}
