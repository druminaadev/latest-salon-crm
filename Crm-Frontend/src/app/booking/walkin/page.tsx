'use client'

import { useMemo, useState } from 'react'
import {
  AlertCircle,
  BadgeIndianRupee,
  CheckCircle2,
  Clock,
  Coins,
  CreditCard,
  Globe,
  Minus,
  Phone,
  Plus,
  QrCode,
  ReceiptText,
  Scissors,
  Sparkles,
  Trash2,
  User,
  UserCheck,
  UserPlus,
  CircleEllipsis,
} from 'lucide-react'
import { BookingWorkflowEngine, getStatusBadge } from '@/lib/bookingWorkflow'
import type { PaymentModel } from '@/types'

const SERVICES = [
  { id: '1', name: 'Signature Haircut', category: 'Hair', price: 500, duration: 30, note: 'Consultation, cut, finish' },
  { id: '2', name: 'Global Hair Color', category: 'Hair Color', price: 2000, duration: 90, note: 'Shade consultation included' },
  { id: '3', name: 'Express Manicure', category: 'Nails', price: 400, duration: 45, note: 'Shape, buff, polish' },
  { id: '4', name: 'Classic Pedicure', category: 'Nails', price: 500, duration: 45, note: 'Foot soak and polish' },
  { id: '5', name: 'Glow Facial', category: 'Skin', price: 800, duration: 60, note: 'Cleanse, massage, mask' },
]

const STAFF = [
  { id: '1', name: 'Priya Kumar', speciality: 'Senior Hair Stylist', load: 'Available now' },
  { id: '2', name: 'Rahul Verma', speciality: 'Color Specialist', load: 'Next chair open' },
  { id: '3', name: 'Sonal Patel', speciality: 'Nail Artist', load: 'Available in 10 min' },
]



interface CartItem {
  service: (typeof SERVICES)[0]
  quantity: number
  staffId: string
  staffName: string
}

export default function WalkInBookingPage() {
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [paymentModel, setPaymentModel] = useState<PaymentModel>('Post-Paid')
  const [cart, setCart] = useState<CartItem[]>([])
  const [workflow, setWorkflow] = useState<BookingWorkflowEngine | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'online' | 'upi' | 'other'>('cash')
  const [showCheckout, setShowCheckout] = useState(false)

  const total = cart.reduce((sum, item) => sum + item.service.price * item.quantity, 0)
  const totalDuration = cart.reduce((sum, item) => sum + item.service.duration * item.quantity, 0)
  const assignedCount = cart.filter((item) => item.staffId).length
  const state = workflow?.getState()
  const attendanceBadge = state ? getStatusBadge(state.attendanceStatus) : null
  const paymentBadge = state ? getStatusBadge(state.paymentStatus) : null

  const visitSummary = useMemo(
    () => [
      { label: 'Services', value: cart.length.toString() },
      { label: 'Duration', value: `${totalDuration || 0} min` },
      { label: 'Total', value: `Rs. ${total}` },
    ],
    [cart.length, total, totalDuration]
  )

  const addService = (service: (typeof SERVICES)[0]) => {
    const existing = cart.find((item) => item.service.id === service.id)

    if (!existing) {
      setCart([...cart, { service, quantity: 1, staffId: '', staffName: '' }])
    }
  }

  const updateQuantity = (serviceId: string, delta: number) => {
    setCart(
      cart.map((item) =>
        item.service.id === serviceId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    )
  }

  const removeItem = (serviceId: string) => {
    setCart(cart.filter((item) => item.service.id !== serviceId))
  }

  const handlePhoneChange = (value: string) => {
    const clean = value.replace(/\D/g, '')
    setCustomerPhone(clean.slice(0, 10))
  }

  const createBooking = () => {
    if (!customerName || !customerPhone || cart.length === 0) {
      alert('Please complete customer details and add at least one service.')
      return
    }

    if (customerPhone.length !== 10) {
      alert('Phone number must be exactly 10 digits.')
      return
    }

    const newWorkflow = BookingWorkflowEngine.createWalkIn(paymentModel)
    setWorkflow(newWorkflow)
  }

  const startService = () => {
    if (!workflow) return

    const result = workflow.transitionAttendance('In_Service')

    if (result.success) {
      setWorkflow(
        new BookingWorkflowEngine(
          workflow.getState().bookingType,
          workflow.getState().paymentModel,
          workflow.getState().paymentStatus,
          'In_Service'
        )
      )
    } else {
      alert(result.error)
    }
  }

  const processPayment = () => {
    if (!workflow) return

    workflow.updatePaymentStatus('Paid')
    const result = workflow.transitionAttendance('Completed')

    if (result.success) {
      alert('Service completed successfully.')
      resetForm()
    } else {
      alert(result.error || 'Failed to complete service.')
    }
  }

  const completeService = () => {
    if (!workflow) return

    const activeState = workflow.getState()

    if (activeState.requiresCheckout) {
      setShowCheckout(true)
      return
    }

    const result = workflow.transitionAttendance('Completed')

    if (result.success) {
      alert('Service completed successfully.')
      resetForm()
    } else {
      alert(result.error)
    }
  }

  const resetForm = () => {
    setCustomerName('')
    setCustomerPhone('')
    setCart([])
    setWorkflow(null)
    setShowCheckout(false)
    setPaymentModel('Post-Paid')
  }

  return (
    <div className="min-h-screen space-y-6 bg-[var(--bg-secondary)] p-1 text-[var(--text-primary)]">
      <section className="overflow-hidden rounded-lg border border-[var(--border)] bg-white shadow-sm dark:bg-[var(--bg)]">
        <div className="grid gap-6 p-5 lg:grid-cols-[1.4fr_1fr] lg:p-6">
          <div className="flex flex-col justify-between gap-6">
            <div>
              <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-salon-100/60 bg-salon-50 px-3 py-1 text-xs font-semibold text-salon-900 dark:border-salon-400/30 dark:bg-white/5 dark:text-salon-100">
                <Sparkles size={14} />
                Front desk express flow
              </div>
              <h1 className="text-2xl font-bold tracking-normal text-[var(--text-primary)] sm:text-3xl">
                Walk-In Booking
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
                Register the guest, assign the right professional, and move the visit from check-in to payment without leaving this page.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {visitSummary.map((item) => (
                <div key={item.label} className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
                  <p className="text-xs font-semibold uppercase text-[var(--text-secondary)]">{item.label}</p>
                  <p className="mt-1 text-lg font-bold text-[var(--text-primary)]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--text-secondary)]">Current Status</p>
                <p className="mt-1 text-lg font-bold text-[var(--text-primary)]">
                  {state ? state.attendanceStatus.replace('_', ' ') : 'Ready for check-in'}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-salon-600 text-white">
                <UserCheck size={22} />
              </div>
            </div>

            {state ? (
              <div className="mt-4 flex flex-wrap gap-2">
                <div className={`rounded-full border px-3 py-1 text-xs font-semibold ${attendanceBadge?.bg} ${attendanceBadge?.text} ${attendanceBadge?.border}`}>
                  {state.attendanceStatus.replace('_', ' ')}
                </div>
                <div className={`rounded-full border px-3 py-1 text-xs font-semibold ${paymentBadge?.bg} ${paymentBadge?.text} ${paymentBadge?.border}`}>
                  {state.paymentStatus}
                </div>
              </div>
            ) : (
              <div className="mt-4 text-sm">
                <div className="rounded-lg bg-white p-3 dark:bg-white/5">
                  <p className="text-xs text-[var(--text-secondary)]">Staff assigned</p>
                  <p className="font-bold">{assignedCount}/{cart.length}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {!workflow ? (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-5">
            <section className="rounded-lg border border-[var(--border)] bg-white p-5 shadow-sm dark:bg-[var(--bg)]">
              <div className="mb-4 flex items-center gap-2">
                <UserPlus size={18} className="text-salon-600" />
                <h2 className="text-base font-bold">Guest Information</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-semibold text-[var(--text-secondary)]">Customer name *</span>
                  <div className="relative mt-1.5">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                    <input
                      value={customerName}
                      onChange={(event) => setCustomerName(event.target.value)}
                      placeholder="Enter full name"
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] py-3 pl-9 pr-3 text-sm outline-none transition focus:border-salon-400 focus:ring-2 focus:ring-salon-400/20"
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-[var(--text-secondary)]">Phone number *</span>
                  <div className="relative mt-1.5">
                    <div className="absolute left-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5 text-sm font-semibold text-[var(--text-secondary)]">
                      <Phone size={15} />
                      <span>+91</span>
                      <span className="h-4 w-[1px] bg-[var(--border)]"></span>
                    </div>
                    <input
                      value={customerPhone}
                      onChange={(event) => handlePhoneChange(event.target.value)}
                      placeholder="98765 43210"
                      className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] py-3 pl-16 pr-3 text-sm outline-none transition focus:border-salon-400 focus:ring-2 focus:ring-salon-400/20"
                    />
                  </div>
                </label>
              </div>
            </section>

            <section className="rounded-lg border border-[var(--border)] bg-white p-5 shadow-sm dark:bg-[var(--bg)]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Scissors size={18} className="text-salon-600" />
                  <h2 className="text-base font-bold">Service Menu</h2>
                </div>
                <span className="rounded-full bg-[var(--bg-secondary)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)]">
                  {SERVICES.length} available
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {SERVICES.map((service) => {
                  const inCart = cart.some((item) => item.service.id === service.id)

                  return (
                    <button
                      key={service.id}
                      onClick={() => addService(service)}
                      className={`rounded-lg border p-4 text-left transition ${
                        inCart
                          ? 'border-salon-600 bg-salon-50 shadow-sm dark:bg-salon-900/30'
                          : 'border-[var(--border)] bg-[var(--bg-secondary)] hover:border-salon-400'
                      }`}
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span>
                          <span className="block text-sm font-bold">{service.name}</span>
                          <span className="mt-1 block text-xs font-semibold text-support-plum dark:text-salon-100">{service.category}</span>
                        </span>
                        <span className="text-sm font-bold text-salon-600">Rs. {service.price}</span>
                      </span>
                      <span className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[var(--text-secondary)]">
                        <span className="inline-flex items-center gap-1">
                          <Clock size={13} />
                          {service.duration} min
                        </span>
                        <span>{service.note}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>

            {cart.length > 0 && (
              <section className="rounded-lg border border-[var(--border)] bg-white p-5 shadow-sm dark:bg-[var(--bg)]">
                <div className="mb-4 flex items-center gap-2">
                  <UserCheck size={18} className="text-salon-600" />
                  <h2 className="text-base font-bold">Assign Professional</h2>
                </div>
                <div className="space-y-3">
                  {cart.map((item, index) => (
                    <div key={`${item.service.id}-${index}`} className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold">{item.service.name}</p>
                          <p className="text-xs text-[var(--text-secondary)]">{item.service.duration} min service</p>
                        </div>
                        {item.staffName && (
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-salon-600 dark:bg-white/5">
                            {item.staffName}
                          </span>
                        )}
                      </div>
                      <div className="grid gap-2 md:grid-cols-3">
                        {STAFF.map((staff) => {
                          const selected = item.staffId === staff.id

                          return (
                            <button
                              key={staff.id}
                              onClick={() => {
                                setCart(
                                  cart.map((cartItem, cartIndex) =>
                                    cartIndex === index ? { ...cartItem, staffId: staff.id, staffName: staff.name } : cartItem
                                  )
                                )
                              }}
                              className={`rounded-lg border px-3 py-3 text-left text-xs transition ${
                                selected
                                  ? 'border-salon-600 bg-salon-600 text-white shadow-sm'
                                  : 'border-[var(--border)] bg-white hover:border-salon-400 dark:bg-white/5'
                              }`}
                            >
                              <span className="block font-bold">{staff.name}</span>
                              <span className={selected ? 'text-white/80' : 'text-[var(--text-secondary)]'}>{staff.speciality}</span>
                              <span className={selected ? 'mt-1 block text-white/80' : 'mt-1 block text-support-sage'}>{staff.load}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="h-fit rounded-lg border border-[var(--border)] bg-white p-5 shadow-sm dark:bg-[var(--bg)] xl:sticky xl:top-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ReceiptText size={18} className="text-salon-600" />
                <h3 className="text-base font-bold">Visit Summary</h3>
              </div>
              <span className="rounded-full bg-salon-50 px-3 py-1 text-xs font-semibold text-salon-900 dark:bg-white/5 dark:text-salon-100">
                Walk-in
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-10 text-center">
                <Scissors size={26} className="mx-auto text-[var(--text-secondary)]" />
                <p className="mt-3 text-sm font-semibold">No services added</p>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">Choose a service to build this visit.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-3">
                  {cart.map((item, index) => (
                    <div key={`${item.service.id}-${index}`} className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold">{item.service.name}</p>
                          <p className="mt-1 text-xs text-[var(--text-secondary)]">
                            {item.staffName || 'Staff not assigned'}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.service.id)}
                          className="rounded-md p-1 text-red-500 transition hover:bg-red-50 hover:text-red-600"
                          aria-label={`Remove ${item.service.name}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-white p-1 dark:bg-white/5">
                          <button
                            onClick={() => updateQuantity(item.service.id, -1)}
                            className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-[var(--bg-secondary)]"
                            aria-label={`Decrease ${item.service.name}`}
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-7 text-center text-sm font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.service.id, 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-[var(--bg-secondary)]"
                            aria-label={`Increase ${item.service.name}`}
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <span className="text-sm font-bold">Rs. {item.service.price * item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg bg-salon-900 p-4 text-white shadow-sm">
                  <div className="flex items-center justify-between text-sm text-white/70">
                    <span>Estimated time</span>
                    <span>{totalDuration} min</span>
                  </div>
                  <div className="mt-2 flex items-end justify-between gap-3">
                    <span className="text-sm text-white/70">Total payable</span>
                    <span className="text-2xl font-bold">Rs. {total}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-end text-xs text-white/70">
                    <span>{assignedCount}/{cart.length} assigned</span>
                  </div>
                </div>

                <button
                  onClick={createBooking}
                  disabled={cart.some((item) => !item.staffId)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-salon-600 py-3 text-sm font-bold text-white transition hover:bg-salon-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CheckCircle2 size={17} />
                  Check In Customer
                </button>
                {cart.some((item) => !item.staffId) && (
                  <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                    <AlertCircle size={15} />
                    Assign a professional to every selected service.
                  </div>
                )}
              </div>
            )}
          </aside>
        </div>
      ) : (
        <section className="mx-auto max-w-4xl space-y-5">
          <div className="rounded-lg border border-[var(--border)] bg-white p-5 shadow-sm dark:bg-[var(--bg)]">
            <div className="flex flex-col justify-between gap-4 border-b border-[var(--border)] pb-5 md:flex-row md:items-start">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--text-secondary)]">Active visit</p>
                <h2 className="mt-1 text-2xl font-bold">{customerName}</h2>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">+91 {customerPhone}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-[var(--bg-secondary)] p-3">
                  <p className="text-xs text-[var(--text-secondary)]">Type</p>
                  <p className="font-bold">{state?.bookingType.replace('_', ' ')}</p>
                </div>
                <div className="rounded-lg bg-[var(--bg-secondary)] p-3">
                  <p className="text-xs text-[var(--text-secondary)]">Amount</p>
                  <p className="font-bold text-salon-600">Rs. {total}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {['Checked In', 'In Service', 'Completed'].map((label, index) => {
                const activeIndex = state?.attendanceStatus === 'Checked_In' ? 0 : state?.attendanceStatus === 'In_Service' ? 1 : 2
                const isActive = activeIndex === index
                const isDone = activeIndex > index

                return (
                  <div
                    key={label}
                    className={`rounded-lg border p-4 ${
                      isActive || isDone
                        ? 'border-salon-600 bg-salon-50 dark:bg-salon-900/30'
                        : 'border-[var(--border)] bg-[var(--bg-secondary)] opacity-70'
                    }`}
                  >
                    <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${isActive || isDone ? 'bg-salon-600 text-white' : 'bg-white text-[var(--text-secondary)] dark:bg-white/5'}`}>
                      {isDone ? <CheckCircle2 size={18} /> : index + 1}
                    </div>
                    <p className="text-sm font-bold">{label}</p>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">
                      {index === 0 ? 'Guest is registered' : index === 1 ? 'Service is in progress' : 'Visit is closed'}
                    </p>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 space-y-3">
              {state?.attendanceStatus === 'Checked_In' && (
                <button
                  onClick={startService}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-salon-600 py-3 text-sm font-bold text-white transition hover:bg-salon-900"
                >
                  <Scissors size={17} />
                  Start Service
                </button>
              )}

              {state?.attendanceStatus === 'In_Service' && (
                <button
                  onClick={completeService}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-salon-600 py-3 text-sm font-bold text-white transition hover:bg-salon-900"
                >
                  <BadgeIndianRupee size={17} />
                  Proceed to Checkout
                </button>
              )}

              {state?.requiresCheckout && (
                <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                  <AlertCircle size={16} />
                  Payment is required before the service can be completed.
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setShowCheckout(false)}>
          <div
            className="w-full max-w-md rounded-lg border border-[var(--border)] bg-white p-6 shadow-2xl dark:bg-[var(--bg)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--text-secondary)]">Checkout</p>
                <h3 className="mt-1 text-xl font-bold">Process Payment</h3>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-salon-50 text-salon-600 dark:bg-white/5">
                <BadgeIndianRupee size={21} />
              </div>
            </div>

            <div className="mb-5 rounded-lg bg-salon-900 p-4 text-white">
              <p className="text-xs font-semibold uppercase text-white/60">Amount to pay</p>
              <p className="mt-1 text-3xl font-bold">Rs. {total}</p>
            </div>

            <label className="mb-2 block text-xs font-semibold text-[var(--text-secondary)]">Payment method</label>
            <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {(['cash', 'card', 'online', 'upi', 'other'] as const).map((method) => {
                const isSelected = paymentMethod === method
                return (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 text-xs font-bold uppercase transition ${
                      isSelected
                        ? 'border-salon-600 bg-salon-600 text-white shadow-sm'
                        : 'border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:border-salon-400'
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
                className="rounded-lg bg-salon-600 py-3 text-sm font-bold text-white transition hover:bg-salon-900"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowCheckout(false)}
                className="rounded-lg border border-[var(--border)] py-3 text-sm font-bold text-[var(--text-primary)] transition hover:bg-[var(--bg-secondary)]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
