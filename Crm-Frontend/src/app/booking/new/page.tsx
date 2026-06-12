'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Check, Calendar, User, Scissors, Clock } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { formatCurrency, formatTime, validatePhone, sanitizeInput } from '@/utils/helpers'
import api from '@/lib/api'
import type { Customer, Service, Staff } from '@/types'

export default function NewBookingPage() {
  const [step, setStep] = useState(1)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    isNewCustomer: false,
    serviceIds: [] as string[],
    staffId: '',
    date: '',
    startTime: '',
    notes: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [customersRes, servicesRes, staffRes] = await Promise.all([
        api.get('/customers'),
        api.get('/services?isActive=true'),
        api.get('/staff?isActive=true'),
      ])
      setCustomers(customersRes.data.data || customersRes.data || [])
      setServices(servicesRes.data.data || servicesRes.data || [])
      setStaff(staffRes.data.data || staffRes.data || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  const selectedServices = services.filter(s => formData.serviceIds.includes(s.id))
  const totalAmount = selectedServices.reduce((sum, s) => sum + s.price, 0)
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0)

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        if (formData.isNewCustomer) {
          return formData.customerName.trim() !== '' && validatePhone(formData.customerPhone)
        }
        return formData.customerId !== ''
      case 2:
        return formData.serviceIds.length > 0
      case 3:
        return formData.staffId !== '' && formData.date !== '' && formData.startTime !== ''
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    } else {
      alert('Please fill all required fields')
    }
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      alert('Please fill all required fields')
      return
    }

    setLoading(true)
    try {
      const bookingData = {
        customerId: formData.isNewCustomer ? undefined : formData.customerId,
        customerName: formData.isNewCustomer ? sanitizeInput(formData.customerName) : undefined,
        customerPhone: formData.isNewCustomer ? formData.customerPhone : undefined,
        customerEmail: formData.isNewCustomer ? formData.customerEmail : undefined,
        staffId: formData.staffId,
        services: selectedServices.map(s => ({
          serviceId: s.id,
          serviceName: s.name,
          price: s.price,
          duration: s.duration,
        })),
        date: formData.date,
        startTime: formData.startTime,
        totalAmount,
        notes: sanitizeInput(formData.notes),
        status: 'confirmed',
        paymentStatus: 'unpaid',
      }

      await api.post('/bookings', bookingData)
      alert('Booking created successfully!')
      window.location.href = '/booking'
    } catch (error) {
      console.error('Failed to create booking:', error)
      alert('Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { number: 1, title: 'Customer', icon: User },
    { number: 2, title: 'Services', icon: Scissors },
    { number: 3, title: 'Schedule', icon: Calendar },
    { number: 4, title: 'Review', icon: Check },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => window.history.back()}
          className="w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">New Booking</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create a new appointment
          </p>
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, index) => (
            <div key={s.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    step >= s.number
                      ? 'bg-violet-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}
                >
                  <s.icon size={20} />
                </div>
                <span
                  className={`text-sm font-medium mt-2 ${
                    step >= s.number
                      ? 'text-violet-600 dark:text-violet-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {s.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 rounded transition-all ${
                    step > s.number
                      ? 'bg-violet-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="min-h-[400px]">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setFormData({ ...formData, isNewCustomer: false, customerId: '', customerName: '', customerPhone: '', customerEmail: '' })}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    !formData.isNewCustomer
                      ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="font-semibold text-gray-900 dark:text-white">Existing Customer</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Select from database</div>
                </button>
                <button
                  onClick={() => setFormData({ ...formData, isNewCustomer: true, customerId: '' })}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    formData.isNewCustomer
                      ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="font-semibold text-gray-900 dark:text-white">New Customer</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Add new customer</div>
                </button>
              </div>

              {formData.isNewCustomer ? (
                <div className="space-y-4">
                  <Input
                    label="Customer Name"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Enter full name"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Phone Number"
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      placeholder="10-digit number"
                      required
                    />
                    <Input
                      label="Email (Optional)"
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Select Customer *
                  </label>
                  <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                    {customers.map((customer) => (
                      <button
                        key={customer.id}
                        onClick={() => setFormData({ ...formData, customerId: customer.id })}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          formData.customerId === customer.id
                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {customer.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {customer.phone} {customer.email && `• ${customer.email}`}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-violet-600 dark:text-violet-400 font-semibold">
                              {customer.loyaltyPoints} pts
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {customer.totalVisits} visits
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Select Services *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {services.map((service) => {
                    const isSelected = formData.serviceIds.includes(service.id)
                    return (
                      <button
                        key={service.id}
                        onClick={() => {
                          if (isSelected) {
                            setFormData({
                              ...formData,
                              serviceIds: formData.serviceIds.filter(id => id !== service.id),
                            })
                          } else {
                            setFormData({
                              ...formData,
                              serviceIds: [...formData.serviceIds, service.id],
                            })
                          }
                        }}
                        className={`p-4 rounded-xl border-2 transition-all text-left relative ${
                          isSelected
                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center">
                            <Check size={14} className="text-white" />
                          </div>
                        )}
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {service.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {service.category}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-violet-600 dark:text-violet-400 font-semibold">
                            {formatCurrency(service.price)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {service.duration} min
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {selectedServices.length > 0 && (
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Selected Services ({selectedServices.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedServices.map((service) => (
                      <div key={service.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300">{service.name}</span>
                        <span className="text-gray-900 dark:text-white font-semibold">
                          {formatCurrency(service.price)}
                        </span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between font-semibold">
                      <span className="text-gray-900 dark:text-white">Total</span>
                      <span className="text-violet-600 dark:text-violet-400">
                        {formatCurrency(totalAmount)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <Clock size={12} className="inline mr-1" />
                      Total duration: {totalDuration} minutes
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Select Staff Member *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {staff.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => setFormData({ ...formData, staffId: member.id })}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        formData.staffId === member.id
                          ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {member.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {member.role}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                <Input
                  label="Start Time"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                  placeholder="Any special requests or notes..."
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/20 flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-violet-600 dark:text-violet-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Review Booking Details
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Please review the booking information before confirming
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Customer</h3>
                  <div className="text-sm space-y-1">
                    <div className="text-gray-700 dark:text-gray-300">
                      {formData.isNewCustomer ? formData.customerName : customers.find(c => c.id === formData.customerId)?.name}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {formData.isNewCustomer ? formData.customerPhone : customers.find(c => c.id === formData.customerId)?.phone}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Services</h3>
                  <div className="space-y-2">
                    {selectedServices.map((service) => (
                      <div key={service.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300">{service.name}</span>
                        <span className="text-gray-900 dark:text-white font-semibold">
                          {formatCurrency(service.price)}
                        </span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between font-semibold">
                      <span className="text-gray-900 dark:text-white">Total Amount</span>
                      <span className="text-violet-600 dark:text-violet-400 text-lg">
                        {formatCurrency(totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Schedule</h3>
                  <div className="text-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Staff</span>
                      <span className="text-gray-900 dark:text-white font-semibold">
                        {staff.find(s => s.id === formData.staffId)?.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Date</span>
                      <span className="text-gray-900 dark:text-white font-semibold">
                        {new Date(formData.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Time</span>
                      <span className="text-gray-900 dark:text-white font-semibold">
                        {formatTime(formData.startTime)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Duration</span>
                      <span className="text-gray-900 dark:text-white font-semibold">
                        {totalDuration} minutes
                      </span>
                    </div>
                  </div>
                </div>

                {formData.notes && (
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Notes</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{formData.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="secondary"
            onClick={handleBack}
            disabled={step === 1}
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </Button>

          {step < 4 ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight size={20} className="ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} isLoading={loading}>
              <Check size={20} className="mr-2" />
              Confirm Booking
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
