'use client'

import { useState } from 'react'
import { UserPlus, Save, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const SPECIALITIES = ['Hair', 'Skin', 'Nails', 'Body', 'Makeup']
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function AddStaffPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '', role: '', speciality: 'Hair', phone: '', email: '',
    workingHours: { start: '09:00', end: '18:00' },
    workingDays: [] as string[],
  })

  const toggleDay = (day: string) =>
    setFormData(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day],
    }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/staff')
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserPlus size={20} style={{ color: '#9D679F' }} />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Staff Member</h1>
        </div>
        <Link href="/staff"
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
          <X size={15} /> Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { label: 'Full Name *', key: 'name', placeholder: 'e.g. Priya Kumar',     type: 'text' },
            { label: 'Role *',      key: 'role', placeholder: 'e.g. Senior Stylist',  type: 'text' },
            { label: 'Phone *',     key: 'phone', placeholder: '+91 98765 43210',      type: 'tel'  },
            { label: 'Email',       key: 'email', placeholder: 'email@example.com',    type: 'email'},
          ].map(({ label, key, placeholder, type }) => (
            <div key={key}>
              <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">{label}</label>
              <input type={type} placeholder={placeholder} value={(formData as any)[key]}
                required={label.includes('*')}
                onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>
          ))}

          <div>
            <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">Speciality *</label>
            <select value={formData.speciality}
              onChange={e => setFormData({ ...formData, speciality: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-400">
              {SPECIALITIES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Working Days *</label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map(day => (
              <button key={day} type="button" onClick={() => toggleDay(day)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                style={{
                  background: formData.workingDays.includes(day) ? '#9D679F' : 'transparent',
                  color: formData.workingDays.includes(day) ? '#fff' : '',
                  border: formData.workingDays.includes(day) ? 'none' : '1px solid #d1d5db',
                }}>
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Start Time', key: 'start' },
            { label: 'End Time',   key: 'end'   },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">{label}</label>
              <input type="time" value={(formData.workingHours as any)[key]}
                onChange={e => setFormData({ ...formData, workingHours: { ...formData.workingHours, [key]: e.target.value } })}
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link href="/staff"
            className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            Cancel
          </Link>
          <button type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition" style={{ background: '#9D679F' }}>
            <Save size={15} /> Save Staff
          </button>
        </div>
      </form>
    </div>
  )
}
