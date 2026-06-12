'use client'

import { useState } from 'react'
import { Users, Plus, Edit2, Trash2, X, Phone, Mail, Award, Save } from 'lucide-react'
import { useLocationStore, BRANCHES, BRANCH_STAFF, type BranchId } from '@/store/locationStore'

const SPECIALITIES = ['Hair', 'Skin', 'Nails', 'Body', 'Makeup']
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const BLANK = { name: '', role: '', speciality: 'Hair', phone: '', email: '', workingDays: [] as string[], isActive: true }

export default function StaffPage() {
  const { branchId } = useLocationStore()
  const activeBranch = BRANCHES.find(b => b.id === branchId) ?? BRANCHES[0]

  const [allStaff, setAllStaff] = useState<Record<BranchId, typeof BRANCH_STAFF.main>>({
    main:      [...BRANCH_STAFF.main],
    satellite: [...BRANCH_STAFF.satellite],
    sghighway: [...BRANCH_STAFF.sghighway],
  })
  const [showForm, setShowForm]   = useState(false)
  const [editId,   setEditId]     = useState<number | null>(null)
  const [form,     setForm]       = useState(BLANK)

  const staff    = allStaff[branchId]
  const setStaff = (fn: (p: typeof BRANCH_STAFF.main) => typeof BRANCH_STAFF.main) =>
    setAllStaff(prev => ({ ...prev, [branchId]: fn(prev[branchId]) }))

  const openAdd = () => { setEditId(null); setForm(BLANK); setShowForm(true) }

  const openEdit = (member: typeof BRANCH_STAFF.main[number]) => {
    setEditId(member.id)
    setForm({ name: member.name, role: member.role, speciality: member.speciality, phone: member.phone, email: member.email, workingDays: [...member.workingDays], isActive: member.isActive })
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editId !== null) {
      setStaff(prev => prev.map(s => s.id === editId ? { ...s, ...form } : s))
    } else {
      setStaff(prev => [...prev, { id: Date.now(), ...form }])
    }
    setShowForm(false)
  }

  const toggleDay = (day: string) =>
    setForm(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day],
    }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={18} style={{ color: '#9D679F' }} />
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Staff Management</h1>
          <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
             {activeBranch.short}
          </span>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition" style={{ background: '#9D679F' }}>
          <Plus size={16} /> Add Staff
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {editId !== null ? 'Edit Staff Member' : 'Add Staff Member'}
              </h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--hover)' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {([
                  { label: 'Name *',  key: 'name',  type: 'text',  placeholder: 'Full name' },
                  { label: 'Role *',  key: 'role',  type: 'text',  placeholder: 'e.g. Senior Stylist' },
                  { label: 'Phone *', key: 'phone', type: 'tel',   placeholder: '+91 98765 43210' },
                  { label: 'Email',   key: 'email', type: 'email', placeholder: 'email@example.com' },
                ] as const).map(({ label, key, type, placeholder }) => (
                  <div key={key} className={key === 'email' ? 'col-span-2' : ''}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>{label}</label>
                    <input type={type} required={label.includes('*')} placeholder={placeholder} value={(form as any)[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9D679F]"
                      style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Speciality</label>
                  <select value={form.speciality} onChange={e => setForm(f => ({ ...f, speciality: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9D679F]"
                    style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                    {SPECIALITIES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 rounded" />
                  <label htmlFor="isActive" className="text-sm" style={{ color: 'var(--text-primary)' }}>Active</label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Working Days</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map(day => (
                    <button key={day} type="button" onClick={() => toggleDay(day)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                      style={{
                        background: form.workingDays.includes(day) ? '#9D679F' : 'var(--hover)',
                        color:      form.workingDays.includes(day) ? '#fff' : 'var(--text-secondary)',
                        border:     form.workingDays.includes(day) ? 'none' : '1px solid var(--border)',
                      }}>
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold" style={{ background: '#9D679F' }}>
                  <Save size={14} /> {editId !== null ? 'Update Staff' : 'Add Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map(member => (
          <div key={member.id} className="rounded-2xl p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold" style={{ background: 'linear-gradient(135deg,#9D679F,#6F5AA3)' }}>
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{member.name}</h3>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{member.role}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${member.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-red-100 text-red-700'}`}>
                {member.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}><Award size={12} />{member.speciality}</div>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}><Phone size={12} />{member.phone}</div>
              <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}><Mail size={12} />{member.email}</div>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {member.workingDays.map(day => (
                <span key={day} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#9D679F18', color: '#9D679F' }}>
                  {day.slice(0, 3)}
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <button onClick={() => openEdit(member)}
                className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold transition"
                style={{ background: 'var(--hover)', color: 'var(--text-primary)' }}>
                <Edit2 size={12} /> Edit
              </button>
              <button onClick={() => { if (confirm(`Remove ${member.name}?`)) setStaff(prev => prev.filter(s => s.id !== member.id)) }}
                className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold text-red-500 transition hover:bg-red-50 dark:hover:bg-red-900/20">
                <Trash2 size={12} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
