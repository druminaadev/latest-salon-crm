'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, ChevronLeft, ChevronRight, Clock, User, Scissors, Phone, MapPin, Plus, Filter } from 'lucide-react'

const STAFF = [
  { id: 1, name: 'Priya Kumar', color: '#6F5AA3', role: 'Senior Stylist' },
  { id: 2, name: 'Rahul Verma', color: '#6D91BF', role: 'Hair Specialist' },
  { id: 3, name: 'Sonal Patel', color: '#6F9F8F', role: 'Beautician' },
  { id: 4, name: 'Ritu Joshi',  color: '#C7923E', role: 'Nail Artist' },
]

const HOURS = Array.from({ length: 12 }, (_, i) => i + 9) // 9 AM to 8 PM
const SLOT_HEIGHT = 96 // Height per hour slot
const HEADER_HEIGHT = 64

const MOCK_BOOKINGS = [
  { id: 1, staffId: 1, hour: 9, duration: 1, client: 'Anjali Sharma', service: 'Haircut', phone: '+91 98765 43210', status: 'confirmed' },
  { id: 2, staffId: 1, hour: 11, duration: 1.5, client: 'Priya Gupta', service: 'Cut + Color', phone: '+91 98765 43211', status: 'in-progress' },
  { id: 3, staffId: 2, hour: 10, duration: 1.5, client: 'Rahul Singh', service: 'Hair Coloring', phone: '+91 98765 43212', status: 'confirmed' },
  { id: 4, staffId: 3, hour: 14, duration: 0.75, client: 'Neha Patel', service: 'Manicure', phone: '+91 98765 43213', status: 'pending' },
  { id: 5, staffId: 3, hour: 15, duration: 0.75, client: 'Sonal Kumar', service: 'Pedicure', phone: '+91 98765 43214', status: 'confirmed' },
  { id: 6, staffId: 2, hour: 13.5, duration: 0.5, client: 'Kavita Reddy', service: 'Quick Trim', phone: '+91 98765 43215', status: 'confirmed' },
  { id: 7, staffId: 4, hour: 11.25, duration: 0.75, client: 'Deepa Shah', service: 'Nail Art', phone: '+91 98765 43216', status: 'pending' },
]

const statusStyles: Record<string, { bg: string; border: string; dot: string }> = {
  confirmed: { bg: 'rgba(111, 90, 163, 0.08)', border: '#6F5AA3', dot: '#6F5AA3' },
  'in-progress': { bg: 'rgba(111, 159, 143, 0.08)', border: '#6F9F8F', dot: '#6F9F8F' },
  pending: { bg: 'rgba(199, 146, 62, 0.08)', border: '#C7923E', dot: '#C7923E' },
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedBooking, setSelectedBooking] = useState<typeof MOCK_BOOKINGS[0] | null>(null)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  }

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + days)
    setSelectedDate(newDate)
  }

  const isToday = selectedDate.toDateString() === new Date().toDateString()

  return (
    <div className="min-h-full space-y-6 bg-[#FBF4F8] pb-6 text-gray-950 dark:bg-transparent dark:text-white">
      
      {/* Header with gradient card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#6F5AA3] via-[#9D679F] to-[#C96F9B] px-6 py-6 shadow-[0_20px_50px_rgba(111,90,163,0.35)]">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-8 left-1/3 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              <Calendar size={12} />
              Booking Calendar
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">Schedule Management</h1>
            <p className="mt-1 text-sm text-white/70">Manage appointments across all stylists</p>
          </div>

          <Link href="/booking/new" className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl border border-white/30 bg-white/20 px-5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/30 sm:self-auto">
            <Plus size={16} />
            New Booking
          </Link>
        </div>
      </div>

      {/* Date Navigation + Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeDate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white transition-all hover:border-[#6F5AA3] hover:bg-[#6F5AA3] hover:text-white dark:border-white/10 dark:bg-white/[0.04]"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 font-semibold shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <Calendar size={16} className="text-[#6F5AA3]" />
            <span className="text-sm">{formatDate(selectedDate)}</span>
            {isToday && (
              <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                TODAY
              </span>
            )}
          </div>
          <button
            onClick={() => changeDate(1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white transition-all hover:border-[#6F5AA3] hover:bg-[#6F5AA3] hover:text-white dark:border-white/10 dark:bg-white/[0.04]"
          >
            <ChevronRight size={18} />
          </button>
          <button
            onClick={() => setSelectedDate(new Date())}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold transition-all hover:border-[#6F5AA3] hover:bg-[#6F5AA3] hover:text-white dark:border-white/10 dark:bg-white/[0.04]"
          >
            Today
          </button>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-3">
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-2 dark:border-white/10 dark:bg-white/[0.04]">
            <div className="text-xs text-gray-500 dark:text-gray-400">Total Bookings</div>
            <div className="text-lg font-bold text-[#24151A] dark:text-white">{MOCK_BOOKINGS.length}</div>
          </div>
          <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold transition-all hover:border-[#6F5AA3] dark:border-white/10 dark:bg-white/[0.04]">
            <Filter size={14} />
            Filter
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_18px_45px_rgba(36,21,26,0.07)] dark:border-white/10 dark:bg-white/[0.04]">
        <div className="grid grid-cols-5 divide-x divide-gray-100 dark:divide-white/10">
          {/* Time Column */}
          <div className="col-span-1 bg-gray-50/50 dark:bg-white/[0.02]">
            <div className="flex h-16 items-center justify-center border-b border-gray-100 font-semibold text-xs text-gray-500 dark:border-white/10 dark:text-gray-400">
              Time
            </div>
            {HOURS.map(hour => {
              const displayHour = hour > 12 ? hour - 12 : hour
              const period = hour >= 12 ? 'PM' : 'AM'
              return (
                <div
                  key={hour}
                  className="flex h-24 items-center justify-center border-b border-gray-100 dark:border-white/10"
                >
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">{displayHour}:00</div>
                    <div className="text-[10px] text-gray-400 dark:text-gray-500">{period}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Staff Columns */}
          {STAFF.map(staff => (
            <div key={staff.id} className="relative col-span-1">
              {/* Staff Header */}
              <div
                className="flex h-16 flex-col items-center justify-center gap-1 border-b border-gray-100 dark:border-white/10"
                style={{ background: `${staff.color}08` }}
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shadow-md"
                  style={{ background: `linear-gradient(135deg, ${staff.color}, ${staff.color}dd)` }}
                >
                  {staff.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold" style={{ color: staff.color }}>
                    {staff.name.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400">{staff.role}</div>
                </div>
              </div>

              {/* Time Slots */}
              <div className="relative">
                {HOURS.map(hour => (
                  <div
                    key={hour}
                    className="group relative h-24 cursor-pointer border-b border-gray-100 transition hover:bg-[#FBF4F8] dark:border-white/10 dark:hover:bg-white/[0.04]"
                  >
                    {/* 30-minute divider line */}
                    <div className="absolute left-0 right-0 border-t border-dashed border-gray-200 dark:border-white/5" style={{ top: '50%' }} />
                    <div className="flex h-full items-center justify-center opacity-0 transition group-hover:opacity-100">
                      <Plus size={14} className="text-gray-400" />
                    </div>
                  </div>
                ))}

                {/* Booking Cards */}
                {MOCK_BOOKINGS.filter(b => b.staffId === staff.id).map(booking => {
                  const styles = statusStyles[booking.status] || statusStyles.confirmed
                  const startMinutes = (booking.hour % 1) * 60
                  const formattedTime = `${Math.floor(booking.hour)}:${startMinutes.toString().padStart(2, '0')}`
                  const durationHours = Math.floor(booking.duration)
                  const durationMinutes = Math.round((booking.duration % 1) * 60)
                  const durationText = durationHours > 0 
                    ? durationMinutes > 0 
                      ? `${durationHours}h ${durationMinutes}m` 
                      : `${durationHours}h`
                    : `${durationMinutes}m`
                  
                  // Calculate precise positioning
                  const topPosition = HEADER_HEIGHT + (booking.hour - 9) * SLOT_HEIGHT + 4
                  const cardHeight = booking.duration * SLOT_HEIGHT - 8
                  const minHeight = 60 // Minimum height for readability
                  
                  return (
                    <button
                      key={booking.id}
                      onClick={() => setSelectedBooking(booking)}
                      className="absolute left-1 right-1 overflow-hidden rounded-xl p-2.5 text-left shadow-md transition-all hover:scale-[1.02] hover:shadow-xl hover:z-50"
                      style={{
                        top: `${topPosition}px`,
                        height: `${Math.max(cardHeight, minHeight)}px`,
                        background: styles.bg,
                        border: `2px solid ${styles.border}`,
                        zIndex: 20,
                      }}
                    >
                      {/* Status dot */}
                      <div className="mb-1.5 flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          {booking.status === 'in-progress' && (
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: styles.dot }} />
                          )}
                          <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: styles.dot }} />
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: styles.border }}>
                          {booking.status}
                        </span>
                      </div>

                      <div className="truncate text-sm font-bold text-[#24151A] dark:text-white">{booking.client}</div>
                      <div className="mt-0.5 flex items-center gap-1.5 truncate text-[11px] text-gray-600 dark:text-gray-300">
                        <Scissors size={10} />
                        <span className="truncate">{booking.service}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                        <Clock size={10} />
                        {formattedTime} · {durationText}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="relative mx-4 w-full max-w-md space-y-5 rounded-2xl border border-white/80 bg-white p-6 shadow-[0_30px_80px_rgba(0,0,0,0.3)] dark:border-white/10 dark:bg-gray-900"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#24151A] dark:text-white">Booking Details</h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">View and manage appointment</p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-xl font-bold text-gray-600 transition hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20"
              >
                ×
              </button>
            </div>

            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold uppercase" style={{ background: statusStyles[selectedBooking.status].bg, color: statusStyles[selectedBooking.status].border }}>
              <span className="h-2 w-2 rounded-full" style={{ background: statusStyles[selectedBooking.status].dot }} />
              {selectedBooking.status}
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#6F5AA3] to-[#9D679F]">
                  <User size={18} className="text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Client</div>
                  <div className="text-sm font-semibold text-[#24151A] dark:text-white">{selectedBooking.client}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#C96F9B] to-[#D88385]">
                  <Scissors size={18} className="text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Service</div>
                  <div className="text-sm font-semibold text-[#24151A] dark:text-white">{selectedBooking.service}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#6D91BF] to-[#5F4C86]">
                  <Clock size={18} className="text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Time & Duration</div>
                  <div className="text-sm font-semibold text-[#24151A] dark:text-white">
                    {(() => {
                      const startMinutes = (selectedBooking.hour % 1) * 60
                      const formattedTime = `${Math.floor(selectedBooking.hour)}:${startMinutes.toString().padStart(2, '0')}`
                      const durationHours = Math.floor(selectedBooking.duration)
                      const durationMinutes = Math.round((selectedBooking.duration % 1) * 60)
                      const durationText = durationHours > 0 
                        ? durationMinutes > 0 
                          ? `${durationHours}h ${durationMinutes}m` 
                          : `${durationHours}h`
                        : `${durationMinutes}m`
                      return `${formattedTime} (${durationText})`
                    })()}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white"
                  style={{ background: STAFF.find(s => s.id === selectedBooking.staffId)?.color }}
                >
                  {STAFF.find(s => s.id === selectedBooking.staffId)?.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Stylist</div>
                  <div className="text-sm font-semibold text-[#24151A] dark:text-white">
                    {STAFF.find(s => s.id === selectedBooking.staffId)?.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {STAFF.find(s => s.id === selectedBooking.staffId)?.role}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#6F9F8F] to-[#6D91BF]">
                  <Phone size={18} className="text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Contact</div>
                  <div className="text-sm font-semibold text-[#24151A] dark:text-white">{selectedBooking.phone}</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button className="flex-1 rounded-xl bg-gradient-to-r from-[#6F5AA3] to-[#9D679F] py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl">
                Edit Booking
              </button>
              <button className="flex-1 rounded-xl border-2 border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-300">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
