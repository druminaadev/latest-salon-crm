'use client'

import { useState, useEffect, useMemo } from 'react'
import {
 Search,
 Phone,
 Mail,
 X,
 MapPin,
 Loader2,
 Calendar,
 Clock,
 User,
 Scissors,
 CheckCircle2,
 AlertCircle,
 FileText,
 BadgeIndianRupee,
 Trash2,
 List,
 Filter,
 DollarSign,
 CalendarDays,
 UserCheck
} from 'lucide-react'
import api from '@/lib/api'
import Modal from '@/components/ui/Modal'
import { useLocationStore, BRANCHES } from '@/store/locationStore'
import { formatCurrency, formatDate, formatTime } from '@/utils/helpers'

interface ServiceItem {
 name: string
 price: number
 duration: number
 quantity: number
 _id?: string
}

interface Booking {
 _id: string
 customer: {
 _id: string
 name: string
 phone: string
 email?: string
 }
 service: string
 services: ServiceItem[]
 staff?: {
 _id: string
 name: string
 } | string
 date: string
 duration: number
 status: string
 amount: number
 paidAmount: number
 paymentStatus: string
 bookingType: 'walk-in' | 'scheduled'
 notes?: string
 startTime?: string
 createdAt: string
}

const MOCK_BOOKINGS: Booking[] = [
 {
 _id: 'mock-1',
 customer: {
 _id: 'cust-mock-1',
 name: 'Anjali Sharma',
 phone: '9876543210',
 email: 'anjali@example.com'
 },
 service: 'Signature Haircut',
 services: [
 { name: 'Signature Haircut', price: 500, duration: 30, quantity: 1 }
 ],
 staff: {
 _id: 'staff-mock-1',
 name: 'Priya Kumar'
 },
 date: new Date().toISOString(),
 duration: 30,
 status: 'Completed',
 amount: 500,
 paidAmount: 500,
 paymentStatus: 'paid',
 bookingType: 'scheduled',
 notes: 'Needs quick styling',
 startTime: '10:00',
 createdAt: new Date().toISOString()
 },
 {
 _id: 'mock-2',
 customer: {
 _id: 'cust-mock-2',
 name: 'Priya Gupta',
 phone: '9876543211',
 email: 'priya@example.com'
 },
 service: 'Global Hair Color, Glow Facial',
 services: [
 { name: 'Global Hair Color', price: 2000, duration: 90, quantity: 1 },
 { name: 'Glow Facial', price: 800, duration: 60, quantity: 1 }
 ],
 staff: {
 _id: 'staff-mock-2',
 name: 'Rahul Verma'
 },
 date: new Date().toISOString(),
 duration: 150,
 status: 'Booked',
 amount: 2800,
 paidAmount: 280,
 paymentStatus: 'partially_paid',
 bookingType: 'scheduled',
 startTime: '11:30',
 createdAt: new Date().toISOString()
 },
 {
 _id: 'mock-3',
 customer: {
 _id: 'cust-mock-3',
 name: 'Neha Patel',
 phone: '9876543213'
 },
 service: 'Express Manicure',
 services: [
 { name: 'Express Manicure', price: 400, duration: 45, quantity: 1 }
 ],
 staff: {
 _id: 'staff-mock-3',
 name: 'Sonal Patel'
 },
 date: new Date().toISOString(),
 duration: 45,
 status: 'In_Service',
 amount: 400,
 paidAmount: 0,
 paymentStatus: 'pending',
 bookingType: 'walk-in',
 startTime: '14:00',
 createdAt: new Date().toISOString()
 }
]

export default function BookingListPage() {
 const { branchId } = useLocationStore()
 const activeBranch = BRANCHES.find(b => b.id === branchId) ?? BRANCHES[0]

 const [bookings, setBookings] = useState<Booking[]>([])
 const [loading, setLoading] = useState(true)
 const [search, setSearch] = useState('')
 const [filterType, setFilterType] = useState<'all' | 'walk-in' | 'scheduled'>('all')
 const [filterStatus, setFilterStatus] = useState<string>('all')
 const [filterDate, setFilterDate] = useState<'all' | 'today' | 'week'>('all')
 const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
 const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<'cash' | 'card' | 'upi'>('cash')
 const [isProcessingCheckout, setIsProcessingCheckout] = useState(false)

 // Fetch bookings from backend
 const fetchBookings = async (showLoadingState = true) => {
 if (showLoadingState) setLoading(true)
 try {
 const res = await api.get('/bookings')
 if (res.data && res.data.length > 0) {
 setBookings(res.data)
 } else {
 setBookings(MOCK_BOOKINGS)
 }
 } catch (error) {
 console.error('Failed to load bookings:', error)
 setBookings(MOCK_BOOKINGS)
 } finally {
 if (showLoadingState) setLoading(false)
 }
 }

 // Real-time synchronization
 useEffect(() => {
 fetchBookings(true)
 const interval = setInterval(() => {
 fetchBookings(false)
 }, 5000)
 return () => clearInterval(interval)
 }, [])

 // Filter bookings logic
 const filteredBookings = useMemo(() => {
 return bookings.filter(b => {
 // 1. Search filter
 const clientName = b.customer?.name || 'Walk-in Client'
 const clientPhone = b.customer?.phone || ''
 const servicesStr = b.services ? b.services.map(s => s.name).join(' ') : b.service || ''
 const staffName = typeof b.staff === 'object' && b.staff ? b.staff.name : ''
 
 const matchesSearch =
 clientName.toLowerCase().includes(search.toLowerCase()) ||
 clientPhone.includes(search) ||
 servicesStr.toLowerCase().includes(search.toLowerCase()) ||
 staffName.toLowerCase().includes(search.toLowerCase())

 // 2. Type filter
 const matchesType = filterType === 'all' || b.bookingType === filterType

 // 3. Status filter
 const matchesStatus = filterStatus === 'all' || b.status.toLowerCase() === filterStatus.toLowerCase()

 // 4. Date filter
 let matchesDate = true
 const bDate = new Date(b.date)
 const today = new Date()
 
 if (filterDate === 'today') {
 matchesDate =
 bDate.getDate() === today.getDate() &&
 bDate.getMonth() === today.getMonth() &&
 bDate.getFullYear() === today.getFullYear()
 } else if (filterDate === 'week') {
 const oneWeekAgo = new Date()
 oneWeekAgo.setDate(today.getDate() - 7)
 matchesDate = bDate >= oneWeekAgo && bDate <= today
 }

 return matchesSearch && matchesType && matchesStatus && matchesDate
 })
 }, [bookings, search, filterType, filterStatus, filterDate])

 // Count/Metric calculations
 const metrics = useMemo(() => {
 const totalCount = bookings.length
 const scheduledCount = bookings.filter(b => b.bookingType === 'scheduled').length
 const walkinCount = bookings.filter(b => b.bookingType === 'walk-in').length
 const totalRev = bookings.reduce((sum, b) => sum + (b.amount || 0), 0)

 return { totalCount, scheduledCount, walkinCount, totalRev }
 }, [bookings])

 // Helper styles for badges
 const getStatusBadge = (status: string) => {
 const s = (status || '').toLowerCase()
 if (s === 'completed' || s === 'done') return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
 if (s === 'paid') return 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800'
 if (s === 'booked' || s === 'confirmed') return 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
 if (s === 'in_service' || s === 'in-progress') return 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
 if (s === 'checked_in') return 'bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-900/30 dark:text-fuchsia-300 border border-fuchsia-200 dark:border-fuchsia-800'
 if (s === 'partially_paid') return 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800'
 if (s === 'cancelled') return 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800'
 return 'bg-gray-50 text-gray-500 dark:bg-white/5 dark:text-gray-400 border border-gray-200 dark:border-gray-800'
 }

 const getBookingTypeBadge = (type: string) => {
 const t = (type || 'scheduled').toLowerCase()
 if (t === 'walk-in') {
 return 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
 }
 return 'bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
 }

 // Handle workflow transitions
 const updateStatus = async (bookingId: string, payload: any) => {
 try {
 const res = await api.put(`/bookings/${bookingId}`, payload)
 // Update local state
 setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, ...res.data } : b))
 if (selectedBooking && selectedBooking._id === bookingId) {
 setSelectedBooking({ ...selectedBooking, ...res.data })
 }
 alert('Status updated successfully!')
 } catch (err: any) {
 console.error('Failed to update booking status:', err)
 alert(err.response?.data?.message || 'Update failed')
 }
 }

 const handleDelete = async (bookingId: string) => {
 if (confirm('Are you sure you want to delete this booking history? This action is permanent.')) {
 try {
 await api.delete(`/bookings/${bookingId}`)
 setBookings(prev => prev.filter(b => b._id !== bookingId))
 setSelectedBooking(null)
 alert('Booking deleted successfully!')
 } catch (err: any) {
 console.error('Failed to delete booking:', err)
 alert('Failed to delete booking')
 }
 }
 }

 const handleCheckoutPayment = async (bookingId: string) => {
 setIsProcessingCheckout(true)
 const booking = bookings.find(b => b._id === bookingId)
 if (!booking) return

 try {
 await api.put(`/bookings/${bookingId}`, {
 status: 'Completed',
 paymentStatus: 'paid',
 paidAmount: booking.amount
 })
 fetchBookings(false)
 setSelectedBooking(null)
 setIsProcessingCheckout(false)
 alert('Checkout completed! Payment confirmed.')
 } catch (err) {
 console.error('Failed to checkout:', err)
 alert('Failed to complete checkout')
 setIsProcessingCheckout(false)
 }
 }

 return (
 <div className="space-y-6">
 {/* Header with Title and Branch Info */}
 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 <div>
 <div className="flex items-center gap-2">
 <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Booking Directory</h1>
 <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
 style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
 <MapPin size={10} />{activeBranch.short}
 </span>
 </div>
 <p className="mt-0.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
 Overview of all scheduled appointments and walk-in customers
 </p>
 </div>
 </div>

 {/* Metrics Dashboard Cards */}
 <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
 <div className="rounded-2xl border p-4" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
 <div className="flex items-center justify-between">
 <span className="text-xs font-semibold uppercase" style={{ color: 'var(--text-secondary)' }}>Total Bookings</span>
 <div className="h-7 w-7 rounded-lg bg-[#9D679F]/10 flex items-center justify-center text-[#9D679F]">
 <List size={14} />
 </div>
 </div>
 <p className="mt-2 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{metrics.totalCount}</p>
 </div>

 <div className="rounded-2xl border p-4" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
 <div className="flex items-center justify-between">
 <span className="text-xs font-semibold uppercase" style={{ color: 'var(--text-secondary)' }}>Scheduled Visits</span>
 <div className="h-7 w-7 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-500">
 <CalendarDays size={14} />
 </div>
 </div>
 <p className="mt-2 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{metrics.scheduledCount}</p>
 </div>

 <div className="rounded-2xl border p-4" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
 <div className="flex items-center justify-between">
 <span className="text-xs font-semibold uppercase" style={{ color: 'var(--text-secondary)' }}>Walk-in Guests</span>
 <div className="h-7 w-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
 <UserCheck size={14} />
 </div>
 </div>
 <p className="mt-2 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{metrics.walkinCount}</p>
 </div>

 <div className="rounded-2xl border p-4" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
 <div className="flex items-center justify-between">
 <span className="text-xs font-semibold uppercase" style={{ color: 'var(--text-secondary)' }}>Total Booked Volume</span>
 <div className="h-7 w-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
 <DollarSign size={14} />
 </div>
 </div>
 <p className="mt-2 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
 {formatCurrency(metrics.totalRev)}
 </p>
 </div>
 </div>

 {/* Advanced Filters */}
 <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
 {/* Search */}
 <div className="relative max-w-md flex-1">
 <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
 <input
 type="text"
 placeholder="Search customer, phone, service, stylist..."
 value={search}
 onChange={e => setSearch(e.target.value)}
 className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9D679F]"
 style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }}
 />
 </div>

 {/* Dropdowns */}
 <div className="flex flex-wrap gap-2">
 {/* Date Filter */}
 <div className="relative">
 <select
 value={filterDate}
 onChange={e => setFilterDate(e.target.value as any)}
 className="pl-3 pr-8 py-2 rounded-xl text-xs font-semibold outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-[#9D679F]"
 style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }}
 >
 <option value="all"> Date: All Time</option>
 <option value="today"> Date: Today</option>
 <option value="week"> Date: Last 7 Days</option>
 </select>
 <Filter size={11} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-secondary)' }} />
 </div>

 {/* Type Filter */}
 <div className="relative">
 <select
 value={filterType}
 onChange={e => setFilterType(e.target.value as any)}
 className="pl-3 pr-8 py-2 rounded-xl text-xs font-semibold outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-[#9D679F]"
 style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }}
 >
 <option value="all"> Type: All Bookings</option>
 <option value="walk-in"> Type: Walk-in</option>
 <option value="scheduled"> Type: Scheduled</option>
 </select>
 <Filter size={11} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-secondary)' }} />
 </div>

 {/* Status Filter */}
 <div className="relative">
 <select
 value={filterStatus}
 onChange={e => setFilterStatus(e.target.value)}
 className="pl-3 pr-8 py-2 rounded-xl text-xs font-semibold outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-[#9D679F]"
 style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }}
 >
 <option value="all"> Status: All</option>
 <option value="booked"> Status: Booked</option>
 <option value="checked_in"> Status: Checked In</option>
 <option value="in_service"> Status: In Service</option>
 <option value="completed"> Status: Completed</option>
 <option value="cancelled"> Status: Cancelled</option>
 </select>
 <Filter size={11} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-secondary)' }} />
 </div>
 </div>
 </div>

 {/* Main Table / Grid list */}
 <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}>
 <div className="h-0.5 bg-gradient-to-r from-[#6F5AA3] via-[#9D679F] to-[#C96F9B]" />

 {loading && bookings.length === 0 ? (
 <div className="flex flex-col items-center justify-center py-20 gap-3">
 <Loader2 className="h-8 w-8 animate-spin text-[#9D679F]" />
 <span className="text-sm font-medium text-gray-500">Loading booking records...</span>
 </div>
 ) : (
 <div className="overflow-x-auto">
 {/* Desktop Table */}
 <table className="hidden md:table w-full text-sm">
 <thead>
 <tr className="text-[11px] uppercase"
 style={{ background: 'var(--hover)', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}
 >
 <th className="text-left px-6 py-3.5 font-semibold tracking-wider">Customer</th>
 <th className="text-left px-6 py-3.5 font-semibold tracking-wider">Service</th>
 <th className="text-left px-6 py-3.5 font-semibold tracking-wider">Stylist</th>
 <th className="text-left px-6 py-3.5 font-semibold tracking-wider">Date & Time</th>
 <th className="text-left px-6 py-3.5 font-semibold tracking-wider">Type</th>
 <th className="text-left px-6 py-3.5 font-semibold tracking-wider">Status</th>
 <th className="text-left px-6 py-3.5 font-semibold tracking-wider">Bill Amount</th>
 <th className="text-left px-6 py-3.5 font-semibold tracking-wider">Actions</th>
 </tr>
 </thead>
 <tbody>
 {filteredBookings.map(b => {
 const clientName = b.customer?.name || 'Walk-in Client'
 const clientPhone = b.customer?.phone || ''
 const staffName = typeof b.staff === 'object' && b.staff ? b.staff.name : 'Unassigned'
 const formattedDate = formatDate(b.date)
 const displayTime = b.startTime || new Date(b.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

 return (
 <tr key={b._id} className="transition" style={{ borderBottom: '1px solid var(--border)' }}
 onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
 onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
 >
 <td className="px-6 py-4">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
 style={{ background: b.bookingType === 'walk-in' ? 'linear-gradient(135deg, #6F5AA3, #4C3A76)' : 'linear-gradient(135deg, #9D679F, #C96F9B)' }}>
 {clientName.charAt(0)}
 </div>
 <div>
 <span className="font-semibold text-gray-900 dark:text-white block">{clientName}</span>
 <span className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
 <Phone size={10} />{clientPhone}
 </span>
 </div>
 </div>
 </td>

 <td className="px-6 py-4">
 <div className="max-w-[180px]">
 <p className="font-medium text-gray-900 dark:text-white truncate" title={b.service}>
 {b.service || (b.services && b.services.map(s => s.name).join(', '))}
 </p>
 {b.services && b.services.length > 1 && (
 <span className="text-[10px] text-gray-500">+{b.services.length - 1} more services</span>
 )}
 </div>
 </td>

 <td className="px-6 py-4">
 <span className="text-gray-700 dark:text-gray-300 font-medium">{staffName}</span>
 </td>

 <td className="px-6 py-4">
 <div className="text-xs text-gray-600 dark:text-gray-300 space-y-0.5">
 <p className="font-semibold">{formattedDate}</p>
 <p className="flex items-center gap-1"><Clock size={11} />{displayTime}</p>
 </div>
 </td>

 <td className="px-6 py-4">
 <span className={`px-2 py-0.5 text-[10px] font-bold rounded-lg capitalize ${getBookingTypeBadge(b.bookingType)}`}>
 {b.bookingType || 'scheduled'}
 </span>
 </td>

 <td className="px-6 py-4">
 <div className="flex flex-col gap-1 items-start">
 <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full uppercase tracking-wider ${getStatusBadge(b.status)}`}>
 {b.status.replace('_', ' ')}
 </span>
 <span className={`px-1.5 py-0.5 text-[8px] font-bold text-gray-500 dark:text-gray-400 capitalize`}>
 Pay: {b.paymentStatus}
 </span>
 </div>
 </td>

 <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
 {formatCurrency(b.amount)}
 </td>

 <td className="px-6 py-4">
 <div className="flex items-center gap-2">
 <button
 onClick={() => setSelectedBooking(b)}
 className="text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
 style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
 >
 Manage
 </button>
 <button
 onClick={() => handleDelete(b._id)}
 className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
 aria-label="Delete booking"
 >
 <Trash2 size={15} />
 </button>
 </div>
 </td>
 </tr>
 )
 })}
 </tbody>
 </table>

 {/* Mobile Cards Layout */}
 <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
 {filteredBookings.map(b => {
 const clientName = b.customer?.name || 'Walk-in Client'
 const displayTime = b.startTime || new Date(b.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

 return (
 <div key={b._id} className="p-4 space-y-3">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <span className={`px-2 py-0.5 text-[9px] font-bold rounded-lg capitalize ${getBookingTypeBadge(b.bookingType)}`}>
 {b.bookingType || 'scheduled'}
 </span>
 <span className={`px-2 py-0.5 text-[8px] font-extrabold rounded-full uppercase tracking-wider ${getStatusBadge(b.status)}`}>
 {b.status.replace('_', ' ')}
 </span>
 </div>
 <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(b.amount)}</span>
 </div>

 <div>
 <h4 className="font-bold text-gray-900 dark:text-white text-sm">{clientName}</h4>
 <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 flex items-center gap-1">
 <Scissors size={11} />
 {b.service || (b.services && b.services.map(s => s.name).join(', '))}
 </p>
 </div>

 <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
 <span className="flex items-center gap-1">
 <Calendar size={12} /> {formatDate(b.date)} at {displayTime}
 </span>
 <span>Stylist: {typeof b.staff === 'object' && b.staff ? b.staff.name : 'Unassigned'}</span>
 </div>

 <div className="flex gap-2 pt-1">
 <button
 onClick={() => setSelectedBooking(b)}
 className="flex-1 text-center py-2 rounded-xl text-xs font-semibold border"
 style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
 >
 Manage Booking
 </button>
 <button
 onClick={() => handleDelete(b._id)}
 className="px-3 rounded-xl border border-red-200 text-red-500 hover:bg-red-50"
 >
 <Trash2 size={14} />
 </button>
 </div>
 </div>
 )
 })}
 </div>

 {filteredBookings.length === 0 && (
 <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
 <AlertCircle className="h-8 w-8 text-gray-400" />
 <div>
 <h3 className="text-sm font-bold text-gray-900 dark:text-white">No bookings found</h3>
 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
 Try adjusting your search criteria or filters.
 </p>
 </div>
 </div>
 )}
 </div>
 )}
 </div>

 {/* Booking Management & Transition Modal */}
 {selectedBooking && (
 <Modal
 isOpen={true}
 onClose={() => setSelectedBooking(null)}
 title="Manage Booking Details"
 size="lg"
 >
 <div className="space-y-6">
 {/* Status overview badges */}
 <div className="flex flex-wrap items-center gap-3 bg-gray-50 dark:bg-white/5 p-4 rounded-xl">
 <div>
 <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase block font-semibold">Booking Type</span>
 <span className={`mt-0.5 inline-block px-2.5 py-0.5 text-[11px] font-bold rounded-lg capitalize ${getBookingTypeBadge(selectedBooking.bookingType)}`}>
 {selectedBooking.bookingType}
 </span>
 </div>
 <div>
 <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase block font-semibold">Attendance Status</span>
 <span className={`mt-0.5 inline-block px-2.5 py-0.5 text-[10px] font-extrabold rounded-full uppercase tracking-wider ${getStatusBadge(selectedBooking.status)}`}>
 {selectedBooking.status.replace('_', ' ')}
 </span>
 </div>
 <div>
 <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase block font-semibold">Payment Status</span>
 <span className={`mt-0.5 inline-block px-2.5 py-0.5 text-[10px] font-extrabold rounded-full uppercase tracking-wider ${getStatusBadge(selectedBooking.paymentStatus)}`}>
 {selectedBooking.paymentStatus}
 </span>
 </div>
 </div>

 {/* Grid details */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {/* Customer Column */}
 <div className="space-y-4">
 <h3 className="text-sm font-bold text-gray-900 dark:text-white border-b pb-1">Client Profile</h3>
 
 <div className="space-y-3">
 <div className="flex items-start gap-3">
 <User className="text-gray-400 shrink-0 mt-0.5" size={16} />
 <div>
 <span className="text-xs text-gray-400 block">Name</span>
 <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedBooking.customer?.name || 'Walk-in Client'}</span>
 </div>
 </div>
 <div className="flex items-start gap-3">
 <Phone className="text-gray-400 shrink-0 mt-0.5" size={16} />
 <div>
 <span className="text-xs text-gray-400 block">Phone</span>
 <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedBooking.customer?.phone}</span>
 </div>
 </div>
 {selectedBooking.customer?.email && (
 <div className="flex items-start gap-3">
 <Mail className="text-gray-400 shrink-0 mt-0.5" size={16} />
 <div>
 <span className="text-xs text-gray-400 block">Email Address</span>
 <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedBooking.customer.email}</span>
 </div>
 </div>
 )}
 {selectedBooking.notes && (
 <div className="flex items-start gap-3">
 <FileText className="text-gray-400 shrink-0 mt-0.5" size={16} />
 <div>
 <span className="text-xs text-gray-400 block">Notes</span>
 <span className="text-xs text-gray-700 dark:text-gray-300 italic">"{selectedBooking.notes}"</span>
 </div>
 </div>
 )}
 </div>
 </div>

 {/* Service Column */}
 <div className="space-y-4">
 <h3 className="text-sm font-bold text-gray-900 dark:text-white border-b pb-1">Booked Services</h3>
 
 <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
 {selectedBooking.services && selectedBooking.services.length > 0 ? (
 selectedBooking.services.map((item, idx) => (
 <div key={item._id || idx} className="flex justify-between items-center bg-gray-50 dark:bg-white/5 p-2 rounded-lg text-xs">
 <div>
 <p className="font-bold text-gray-900 dark:text-white">{item.name}</p>
 <p className="text-[10px] text-gray-500">{item.duration} min · Qty: {item.quantity}</p>
 </div>
 <span className="font-semibold text-gray-800 dark:text-gray-200">₹{item.price * item.quantity}</span>
 </div>
 ))
 ) : (
 <div className="flex justify-between items-center bg-gray-50 dark:bg-white/5 p-2 rounded-lg text-xs">
 <div>
 <p className="font-bold text-gray-900 dark:text-white">{selectedBooking.service}</p>
 <p className="text-[10px] text-gray-500">{selectedBooking.duration} min</p>
 </div>
 <span className="font-semibold text-gray-800 dark:text-gray-200">₹{selectedBooking.amount}</span>
 </div>
 )}
 </div>

 <div className="border-t pt-2 flex items-center justify-between">
 <span className="text-xs font-bold text-gray-500">Total Price:</span>
 <span className="text-base font-extrabold text-[#6F5AA3] dark:text-[#D88385]">
 {formatCurrency(selectedBooking.amount)}
 </span>
 </div>
 </div>
 </div>

 {/* Workflow Control panel */}
 <div className="border-t border-gray-200 dark:border-gray-700 pt-5 space-y-4">
 <h3 className="text-sm font-bold text-gray-900 dark:text-white">Workflow Operations</h3>
 
 <div className="flex flex-wrap gap-2">
 {/* Check In action (if state is booked/pending) */}
 {(selectedBooking.status.toLowerCase() === 'booked' || selectedBooking.status.toLowerCase() === 'pending') && (
 <button
 onClick={() => updateStatus(selectedBooking._id, { status: 'Checked_In' })}
 className="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
 >
 Check In Guest
 </button>
 )}

 {/* Start Service action (if status is checked_in / booked) */}
 {(selectedBooking.status.toLowerCase() === 'checked_in' || selectedBooking.status.toLowerCase() === 'booked' || selectedBooking.status.toLowerCase() === 'pending') && (
 <button
 onClick={() => updateStatus(selectedBooking._id, { status: 'In_Service' })}
 className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
 >
 Start Service
 </button>
 )}

 {/* Complete Service & Checkout trigger */}
 {selectedBooking.status.toLowerCase() === 'in_service' && (
 <>
 {selectedBooking.paymentStatus !== 'paid' ? (
 <button
 onClick={() => {
 if (confirm(`Collect outstanding amount ${formatCurrency(selectedBooking.amount)} from client?`)) {
 handleCheckoutPayment(selectedBooking._id)
 }
 }}
 className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
 >
 <BadgeIndianRupee size={14} /> Collect Payment & Close Visit
 </button>
 ) : (
 <button
 onClick={() => updateStatus(selectedBooking._id, { status: 'Completed' })}
 className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
 >
 Complete Visit
 </button>
 )}
 </>
 )}

 {/* Cancel Booking option */}
 {selectedBooking.status.toLowerCase() !== 'completed' && selectedBooking.status.toLowerCase() !== 'cancelled' && (
 <button
 onClick={() => updateStatus(selectedBooking._id, { status: 'cancelled' })}
 className="px-4 py-2 border border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl text-xs font-bold transition-all"
 >
 Cancel Booking
 </button>
 )}
 
 {/* Delete Booking backup option */}
 <button
 onClick={() => handleDelete(selectedBooking._id)}
 className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl text-xs font-bold transition-all ml-auto"
 >
 Delete Record
 </button>
 </div>
 </div>

 {/* Close footer */}
 <div className="flex justify-end pt-4 border-t">
 <button
 onClick={() => setSelectedBooking(null)}
 className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-800"
 >
 Close View
 </button>
 </div>
 </div>
 </Modal>
 )}
 </div>
 )
}
