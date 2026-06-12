'use client'

import { useState } from 'react'
import { Calendar, Clock, Phone, User, CheckCircle2, BadgeIndianRupee, CreditCard, Coins, Globe, QrCode, CircleEllipsis } from 'lucide-react'

const SERVICES = [
  { id: 1, name: 'Haircut', price: 500, duration: 30 },
  { id: 2, name: 'Hair Coloring', price: 2000, duration: 90 },
  { id: 3, name: 'Facial', price: 800, duration: 60 },
  { id: 4, name: 'Manicure', price: 400, duration: 45 },
]

const STAFF = [
  { id: 1, name: 'Rahul Kumar', role: 'Senior Stylist' },
  { id: 2, name: 'Sonal Patel', role: 'Stylist' },
  { id: 3, name: 'Ritu Shah', role: 'Beautician' },
  { id: 4, name: 'Priya Mehta', role: 'Stylist' },
]

type WorkflowState = 'Draft' | 'Partially_Paid' | 'Booked' | 'In_Service' | 'Paid' | 'Completed'

interface ActiveBooking {
  id: string
  client: string
  phone: string
  services: string[]
  time: string
  staff: string
  totalAmount: number
  paidAmount: number
  status: WorkflowState
}

const TODAY_BOOKINGS: ActiveBooking[] = [
  { id: '1', client: 'Priya Sharma', phone: '9876543210', services: ['Haircut'], time: '10:00 AM', staff: 'Rahul Kumar', totalAmount: 500, paidAmount: 50, status: 'Booked' },
  { id: '2', client: 'Amit Kumar', phone: '9876543211', services: ['Hair Coloring'], time: '11:30 AM', staff: 'Sonal Patel', totalAmount: 2000, paidAmount: 200, status: 'Booked' },
  { id: '3', client: 'Neha Patel', phone: '9876543212', services: ['Facial'], time: '02:00 PM', staff: 'Ritu Shah', totalAmount: 800, paidAmount: 800, status: 'In_Service' },
]

export default function SchedulePage() {
  const [bookings, setBookings] = useState<ActiveBooking[]>(TODAY_BOOKINGS)
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [checkoutBookingId, setCheckoutBookingId] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'online' | 'upi' | 'other'>('cash')

  const handleStatusTransition = (bookingId: string, newStatus: WorkflowState) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        if (newStatus === 'In_Service') {
          return { ...b, status: 'In_Service' }
        }
        if (newStatus === 'Paid') {
          return { ...b, paidAmount: b.totalAmount, status: 'Paid' }
        }
        if (newStatus === 'Completed' && b.paidAmount === b.totalAmount) {
          return { ...b, status: 'Completed' }
        }
      }
      return b
    }))
  }

  const handleUpsell = (bookingId: string, service: typeof SERVICES[number]) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId && (b.status === 'Booked' || b.status === 'In_Service')) {
        return {
          ...b,
          services: [...b.services, service.name],
          totalAmount: b.totalAmount + service.price
        }
      }
      return b
    }))
    alert(`${service.name} added! New total: ₹${bookings.find(b => b.id === bookingId)?.totalAmount! + service.price}`)
  }

  const handleFinalCheckout = (bookingId: string) => {
    setCheckoutBookingId(bookingId)
    setShowCheckout(true)
  }

  const processPayment = () => {
    if (!checkoutBookingId) return

    handleStatusTransition(checkoutBookingId, 'Paid')
    setTimeout(() => handleStatusTransition(checkoutBookingId, 'Completed'), 100)
    alert('Payment received! Status: Paid → Completed')
    setShowCheckout(false)
    setCheckoutBookingId(null)
  }

  const getStatusColor = (status: WorkflowState) => {
    const colors = {
      Draft: 'bg-gray-100 text-gray-700',
      Partially_Paid: 'bg-yellow-100 text-yellow-700',
      Booked: 'bg-blue-100 text-blue-700',
      In_Service: 'bg-purple-100 text-purple-700',
      Paid: 'bg-green-100 text-green-700',
      Completed: 'bg-emerald-100 text-emerald-700'
    }
    return colors[status]
  }

  return (
    <div className="space-y-6">
      {/* Active Bookings - Workflow Management */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Master Calendar - Active Bookings</h2>
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div key={booking.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{booking.client}</div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1"><Phone size={10} />{booking.phone}</span>
                    <span className="flex items-center gap-1"><Clock size={10} />{booking.time}</span>
                    <span className="flex items-center gap-1"><User size={10} />{booking.staff}</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">Services: {booking.services.join(', ')}</div>
                  <div className="mt-1 text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Paid: ₹{booking.paidAmount} / ₹{booking.totalAmount}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {(booking.status === 'Booked' || booking.status === 'In_Service') && (
                    <button onClick={() => setSelectedBooking(selectedBooking === booking.id ? null : booking.id)} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700">
                      {selectedBooking === booking.id ? 'Hide Upsells' : 'Add Upsell'}
                    </button>
                  )}
                  
                  {booking.status === 'Booked' && (
                    <button onClick={() => handleStatusTransition(booking.id, 'In_Service')} className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-700">
                      Start Service
                    </button>
                  )}
                  
                  {booking.status === 'In_Service' && (
                    <button onClick={() => handleFinalCheckout(booking.id)} className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700">
                      Checkout (₹{booking.totalAmount - booking.paidAmount})
                    </button>
                  )}
                  
                  {booking.status === 'Completed' && (
                    <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 size={16} />Done</span>
                  )}
                </div>
              </div>
              
              {/* Upsell Section */}
              {selectedBooking === booking.id && (booking.status === 'Booked' || booking.status === 'In_Service') && (
                <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-700">
                  <div className="mb-2 text-xs font-semibold text-gray-700 dark:text-gray-300">Add Upsell Service:</div>
                  <div className="flex flex-wrap gap-2">
                    {SERVICES.map(service => (
                      <button key={service.id} onClick={() => handleUpsell(booking.id, service)} className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                        {service.name} (+₹{service.price})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showCheckout && checkoutBookingId && (() => {
        const booking = bookings.find(b => b.id === checkoutBookingId)
        if (!booking) return null
        const remaining = booking.totalAmount - booking.paidAmount

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => { setShowCheckout(false); setCheckoutBookingId(null); }}>
            <div
              className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-500">Checkout</p>
                  <h3 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">Process Payment</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Client: {booking.client}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  <BadgeIndianRupee size={21} />
                </div>
              </div>

              <div className="mb-5 rounded-xl bg-gray-900 p-4 text-white">
                <p className="text-xs font-semibold uppercase text-white/60">Amount to pay</p>
                <p className="mt-1 text-3xl font-bold">Rs. {remaining}</p>
              </div>

              <label className="mb-2 block text-xs font-semibold text-gray-600 dark:text-gray-400">Payment method</label>
              <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {(['cash', 'card', 'online', 'upi', 'other'] as const).map((method) => {
                  const isSelected = paymentMethod === method
                  return (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 text-xs font-bold uppercase transition ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                          : 'border-gray-200 bg-gray-50 text-gray-900 hover:border-indigo-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200'
                      } ${method === 'other' ? 'col-span-2 sm:col-span-1' : ''}`}
                    >
                      {method === 'cash' && <Coins size={14} />}
                      {method === 'card' && <CreditCard size={14} />}
                      {method === 'online' && <Globe size={14} />}
                      {method === 'upi' && <QrCode size={14} />}
                      {method === 'other' && <CircleEllipsis size={14} />}
                      <span>{method}</span>
                    </button>
                  )
                })}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={processPayment}
                  className="rounded-lg bg-indigo-600 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
                >
                  Confirm
                </button>
                <button
                  onClick={() => { setShowCheckout(false); setCheckoutBookingId(null); }}
                  className="rounded-lg border border-gray-200 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
