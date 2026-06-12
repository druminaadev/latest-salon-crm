'use client'

import { useState } from 'react'
import { Gift, Plus, Edit2, Trash2, X, Save, Scissors } from 'lucide-react'

const initialPackages = [
  { id: 1, name: 'Bridal Package',    price: 8999,  services: ['Hair Color', 'Bridal Makeup', 'Facial', 'Manicure', 'Pedicure'], validity: '1 Day',    color: '#C96F9B' },
  { id: 2, name: 'Hair Care Bundle',  price: 2999,  services: ['Hair Cut', 'Hair Spa', 'Hair Color'],                             validity: '1 Month',  color: '#8E7AB5' },
  { id: 3, name: 'Skin Glow Pack',    price: 1999,  services: ['Facial', 'Face Massage', 'Clean-up'],                            validity: '2 Months', color: '#6D91BF' },
]

export default function PackagesPage() {
  const [packages, setPackages] = useState(initialPackages)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', price: '', validity: '' })

  const handleSave = () => {
    if (!form.name || !form.price) return
    setPackages(p => [...p, { id: Date.now(), name: form.name, price: Number(form.price), services: [], validity: form.validity || '1 Month', color: '#6D91BF' }])
    setForm({ name: '', price: '', validity: '' })
    setShowModal(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gift size={20} className="text-salon-600 dark:text-salon-100" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Packages</h1>
          <span className="rounded-full bg-salon-100/25 px-2 py-0.5 text-xs font-semibold text-salon-600 dark:bg-salon-900/40 dark:text-salon-100">{packages.length}</span>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-salon-600 hover:bg-salon-900 text-white text-sm font-semibold transition">
          <Plus size={15} /> Add Package
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.map(pkg => (
          <div key={pkg.id} className="rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 p-6 hover:shadow-md transition group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${pkg.color}18` }}>
                <Gift size={20} style={{ color: pkg.color }} />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button className="p-1.5 rounded-lg text-gray-400 hover:text-salon-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"><Edit2 size={13} /></button>
                <button onClick={() => setPackages(p => p.filter(x => x.id !== pkg.id))} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"><Trash2 size={13} /></button>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{pkg.name}</h3>
            <p className="text-2xl font-bold mb-3" style={{ color: pkg.color }}>₹{pkg.price.toLocaleString()}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {pkg.services.map(s => (
                <span key={s} className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  <Scissors size={9} />{s}
                </span>
              ))}
            </div>
            <div className="flex justify-between text-sm pt-3 border-t border-gray-100 dark:border-gray-800">
              <span className="text-gray-500 dark:text-gray-400">Validity</span>
              <span className="font-semibold text-gray-900 dark:text-white">{pkg.validity}</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Add Package</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"><X size={16} /></button>
            </div>
            <div className="space-y-3">
              {[{ label: 'Package Name', key: 'name', placeholder: 'e.g. Bridal Package' }, { label: 'Price (₹)', key: 'price', placeholder: '4999' }, { label: 'Validity', key: 'validity', placeholder: '1 Month' }].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400">{label}</label>
                  <input placeholder={placeholder} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-salon-400" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition">Cancel</button>
              <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-salon-600 hover:bg-salon-900 text-white text-sm font-semibold transition"><Save size={14} /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
