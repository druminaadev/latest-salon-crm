'use client'

import { useState } from 'react'
import { CreditCard, Plus, Edit2, Trash2, X, Save } from 'lucide-react'

const initialPlans = [
  { id: 1, name: 'Silver',   price: 999,  duration: '1 Month',  services: 5,  discount: 10, color: '#8A7D8E' },
  { id: 2, name: 'Gold',     price: 2499, duration: '3 Months', services: 15, discount: 20, color: '#C7923E' },
  { id: 3, name: 'Platinum', price: 4999, duration: '6 Months', services: 35, discount: 30, color: '#8E7AB5' },
]

export default function PlansPage() {
  const [plans, setPlans] = useState(initialPlans)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', price: '', duration: '', services: '', discount: '' })

  const handleSave = () => {
    if (!form.name || !form.price) return
    setPlans(p => [...p, { id: Date.now(), name: form.name, price: Number(form.price), duration: form.duration || '1 Month', services: Number(form.services) || 0, discount: Number(form.discount) || 0, color: '#6D91BF' }])
    setForm({ name: '', price: '', duration: '', services: '', discount: '' })
    setShowModal(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard size={20} className="text-salon-600 dark:text-salon-100" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Plans</h1>
          <span className="rounded-full bg-salon-100/25 px-2 py-0.5 text-xs font-semibold text-salon-600 dark:bg-salon-900/40 dark:text-salon-100">{plans.length}</span>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-salon-600 hover:bg-salon-900 text-white text-sm font-semibold transition">
          <Plus size={15} /> Add Plan
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map(plan => (
          <div key={plan.id} className="rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 p-6 hover:shadow-md transition group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${plan.color}18` }}>
                <CreditCard size={20} style={{ color: plan.color }} />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button className="p-1.5 rounded-lg text-gray-400 hover:text-salon-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"><Edit2 size={13} /></button>
                <button onClick={() => setPlans(p => p.filter(x => x.id !== plan.id))} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"><Trash2 size={13} /></button>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{plan.name}</h3>
            <p className="text-3xl font-bold mb-4" style={{ color: plan.color }}>₹{plan.price}<span className="text-sm font-normal text-gray-500 dark:text-gray-400">/{plan.duration}</span></p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between"><span>Services</span><span className="font-semibold text-gray-900 dark:text-white">{plan.services}</span></div>
              <div className="flex justify-between"><span>Discount</span><span className="font-semibold text-gray-900 dark:text-white">{plan.discount}%</span></div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Add Plan</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"><X size={16} /></button>
            </div>
            <div className="space-y-3">
              {[{ label: 'Plan Name', key: 'name', placeholder: 'e.g. Gold' }, { label: 'Price (₹)', key: 'price', placeholder: '999' }, { label: 'Duration', key: 'duration', placeholder: '1 Month' }, { label: 'No. of Services', key: 'services', placeholder: '10' }, { label: 'Discount (%)', key: 'discount', placeholder: '15' }].map(({ label, key, placeholder }) => (
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
