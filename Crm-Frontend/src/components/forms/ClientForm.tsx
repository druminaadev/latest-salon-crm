'use client'

import { useState } from 'react'
import { Save } from 'lucide-react'

export default function ClientForm({ onClose, onSave }: { onClose: () => void; onSave: (data: any) => void }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', gender: 'Female', dob: '', address: '', notes: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone) return
    onSave(form)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: 'Full Name *',   key: 'name',  placeholder: 'Priya Sharma',       type: 'text'  },
          { label: 'Phone *',       key: 'phone', placeholder: '+91 98765 43210',     type: 'tel'   },
          { label: 'Email',         key: 'email', placeholder: 'client@example.com',  type: 'email' },
          { label: 'Date of Birth', key: 'dob',   placeholder: '',                    type: 'date'  },
        ].map(({ label, key, placeholder, type }) => (
          <div key={key}>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>{label}</label>
            <input type={type} placeholder={placeholder} value={(form as any)[key]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }} />
          </div>
        ))}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Gender</label>
          <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }}>
            <option>Female</option><option>Male</option><option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Address</label>
          <input placeholder="Client address" value={form.address}
            onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Notes</label>
        <textarea rows={3} placeholder="Preferences, allergies, special notes..." value={form.notes}
          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
          style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }} />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition"
          style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
          Cancel
        </button>
        <button type="submit"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition">
          <Save size={14} /> Save Client
        </button>
      </div>
    </form>
  )
}
