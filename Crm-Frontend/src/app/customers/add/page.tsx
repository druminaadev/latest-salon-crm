'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, UserPlus } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

type Gender = 'male' | 'female' | 'other'

export default function AddCustomerPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'female' as Gender,
    dateOfBirth: '',
    address: '',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSaved(true)
      setFormData({ name: '', email: '', phone: '', gender: 'female', dateOfBirth: '', address: '', notes: '' })
    }, 800)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <UserPlus size={20} className="text-salon-600 dark:text-salon-100" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Client</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Create a new client profile for bookings and invoices.</p>
        </div>
        <Link href="/customers" className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
          <ArrowLeft size={16} />
          Client List
        </Link>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400">
          <CheckCircle2 size={16} />
          Client saved successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <Input
          label="Full Name"
          value={formData.name}
          onChange={(event) => setFormData({ ...formData, name: event.target.value })}
          placeholder="Enter client name"
          required
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
            placeholder="+91 98765 43210"
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(event) => setFormData({ ...formData, email: event.target.value })}
            placeholder="client@example.com"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Gender</label>
            <select
              value={formData.gender}
              onChange={(event) => setFormData({ ...formData, gender: event.target.value as Gender })}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-salon-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>
          <Input
            label="Date of Birth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(event) => setFormData({ ...formData, dateOfBirth: event.target.value })}
          />
        </div>

        <Input
          label="Address"
          value={formData.address}
          onChange={(event) => setFormData({ ...formData, address: event.target.value })}
          placeholder="Client address"
        />

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(event) => setFormData({ ...formData, notes: event.target.value })}
            rows={3}
            className="w-full resize-none rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-salon-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder="Preferences, allergies, or special notes"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link href="/customers" className="rounded-xl border border-gray-300 px-4 py-2 font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
            Cancel
          </Link>
          <Button type="submit" isLoading={loading}>
            Save Client
{/*  */}          </Button>
        </div>
      </form>
    </div>
  )
}
