'use client'

import { useState } from 'react'
import { Scissors, Plus, Search, Clock, Star, Edit2, Trash2, X, Save } from 'lucide-react'

const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  Hair:   { bg: '#9D679F18', text: '#9D679F', dot: 'bg-rose-500' },
  Skin:   { bg: '#6D91BF18', text: '#6D91BF', dot: 'bg-sky-500' },
  Nails:  { bg: '#6F9F8F18', text: '#6F9F8F', dot: 'bg-emerald-500' },
  Body:   { bg: '#C7923E18', text: '#C7923E', dot: 'bg-amber-500' },
  Makeup: { bg: '#C96F9B18', text: '#C96F9B', dot: 'bg-pink-500' },
}

const CATEGORIES = ['All', 'Hair', 'Skin', 'Nails', 'Body', 'Makeup']

const initialServices = [
  { id: 1, name: 'Hair Cut',      duration: 30,  price: 300,  category: 'Hair',   rating: 4.8, bookings: 84 },
  { id: 2, name: 'Hair Color',    duration: 90,  price: 1500, category: 'Hair',   rating: 4.9, bookings: 62 },
  { id: 3, name: 'Hair Spa',      duration: 60,  price: 1200, category: 'Hair',   rating: 4.7, bookings: 48 },
  { id: 4, name: 'Facial',        duration: 60,  price: 800,  category: 'Skin',   rating: 4.8, bookings: 55 },
  { id: 5, name: 'Manicure',      duration: 45,  price: 400,  category: 'Nails',  rating: 4.6, bookings: 44 },
  { id: 6, name: 'Pedicure',      duration: 45,  price: 500,  category: 'Nails',  rating: 4.7, bookings: 38 },
  { id: 7, name: 'Waxing (Full)', duration: 60,  price: 1000, category: 'Body',   rating: 4.5, bookings: 32 },
  { id: 8, name: 'Bridal Makeup', duration: 120, price: 5000, category: 'Makeup', rating: 5.0, bookings: 12 },
]

export default function ServicesPage() {
  const [services, setServices] = useState(initialServices)
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', duration: '', price: '', category: 'Hair' })

  const filtered = services.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
    const matchCat    = category === 'All' || s.category === category
    return matchSearch && matchCat
  })

  const handleSave = () => {
    if (!form.name || !form.price) return
    setServices(p => [...p, {
      id: Date.now(), name: form.name, duration: Number(form.duration) || 30,
      price: Number(form.price), category: form.category, rating: 0, bookings: 0,
    }])
    setForm({ name: '', duration: '', price: '', category: 'Hair' })
    setShowModal(false)
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search services…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold transition"
              style={{
                background: category === cat ? '#9D679F' : 'transparent',
                color: category === cat ? '#fff' : 'var(--text-secondary)',
                border: category === cat ? 'none' : '1px solid var(--border)',
              }}>
              {cat}
            </button>
          ))}
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition shadow-sm shrink-0" style={{ background: '#9D679F' }}>
          <Plus size={15} /> Add Service
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(s => {
          const cc = CATEGORY_COLORS[s.category] ?? CATEGORY_COLORS.Hair
          return (
            <div key={s.id} className="rounded-2xl p-5 transition hover:shadow-md group"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: cc.bg }}>
                  <Scissors size={18} style={{ color: cc.text }} />
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: cc.bg, color: cc.text }}>
                  {s.category}
                </span>
              </div>
              <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{s.name}</h3>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <Clock size={11} />{s.duration} min
                </span>
                {s.rating > 0 && (
                  <span className="flex items-center gap-0.5 text-xs text-amber-500">
                    <Star size={10} fill="currentColor" />{s.rating}
                  </span>
                )}
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.bookings} bookings</span>
              </div>
              <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                <span className="text-xl font-bold" style={{ color: cc.text }}>₹{s.price}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => alert(`Edit service: ${s.name}`)}
                    className="p-1.5 rounded-lg transition"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--hover)'; e.currentTarget.style.color = '#9D679F' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}>
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete service: ${s.name}?`)) {
                        setServices(services.filter(x => x.id !== s.id))
                      }
                    }}
                    className="p-1.5 rounded-lg transition"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#F9EEF4'; e.currentTarget.style.color = '#D88385' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-16 gap-2">
          <Scissors size={36} style={{ color: 'var(--border)' }} />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No services found</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Add New Service</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg transition" style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Service Name', key: 'name', placeholder: 'e.g. Deep Conditioning', type: 'text' },
                { label: 'Duration (min)', key: 'duration', placeholder: '60', type: 'number' },
                { label: 'Price (₹)', key: 'price', placeholder: '800', type: 'number' },
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
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                  style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }}>
                  {['Hair', 'Skin', 'Nails', 'Body', 'Makeup'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition"
                style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>Cancel</button>
              <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold transition" style={{ background: '#9D679F' }}>
                <Save size={14} /> Save Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
