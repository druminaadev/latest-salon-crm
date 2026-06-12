'use client'

import { useState } from 'react'
import { BadgePercent, Plus, Edit2, Trash2, X } from 'lucide-react'

const MOCK_DISCOUNTS = [
  { id: 1, name: 'Threshold Discount', type: 'threshold',  value: 10, minAmount: 1500, isActive: true  },
  { id: 2, name: 'Weekend Special',    type: 'timeperiod', value: 20, minAmount: 0,    isActive: true  },
  { id: 3, name: 'VIP Membership',     type: 'membership', value: 20, minAmount: 0,    isActive: true  },
]

export default function DiscountsPage() {
  const [showForm, setShowForm] = useState(false)
  const [discounts, setDiscounts] = useState(MOCK_DISCOUNTS)
  const [formData, setFormData] = useState({
    name: '', type: 'threshold', discountType: 'percentage',
    discountValue: '', minAmount: '', code: '',
    validFrom: '', validUntil: '', isActive: true,
  })

  const [editId, setEditId] = useState<number | null>(null)

  const openEdit = (d: typeof MOCK_DISCOUNTS[number]) => {
    setEditId(d.id)
    setFormData({ name: d.name, type: d.type, discountType: 'percentage', discountValue: String(d.value), minAmount: String(d.minAmount), code: '', validFrom: '', validUntil: '', isActive: d.isActive })
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const entry = { id: editId ?? Date.now(), name: formData.name, type: formData.type, value: Number(formData.discountValue), minAmount: Number(formData.minAmount), isActive: formData.isActive }
    if (editId !== null) {
      setDiscounts(p => p.map(d => d.id === editId ? entry : d))
    } else {
      setDiscounts(p => [...p, entry])
    }
    setFormData({ name: '', type: 'threshold', discountType: 'percentage', discountValue: '', minAmount: '', code: '', validFrom: '', validUntil: '', isActive: true })
    setEditId(null)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BadgePercent size={18} style={{ color: '#9D679F' }} />
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Discounts & Offers</h1>
        </div>
        <button onClick={() => { setEditId(null); setFormData({ name: '', type: 'threshold', discountType: 'percentage', discountValue: '', minAmount: '', code: '', validFrom: '', validUntil: '', isActive: true }); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition" style={{ background: '#9D679F' }}>
          <Plus size={16} /> Create Discount
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{editId !== null ? 'Edit Discount' : 'Create Discount'}</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg flex items-center justify-center transition" style={{ background: 'var(--hover)' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Discount Name *</label>
                  <input type="text" required placeholder="e.g., Weekend Special" value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }} />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Discount Type *</label>
                  <select required value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }}>
                    <option value="threshold">Threshold (e.g., 10% off &gt; Rs. 1500)</option>
                    <option value="bundle">Bundle (Get A+B+C at discount)</option>
                    <option value="service">Service-based</option>
                    <option value="category">Category-based</option>
                    <option value="timeperiod">Time Period</option>
                    <option value="membership">Membership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Discount Code</label>
                  <input type="text" placeholder="WEEKEND20" value={formData.code}
                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }} />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Value Type *</label>
                  <select required value={formData.discountType} onChange={e => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    Discount Value * {formData.discountType === 'percentage' ? '(%)' : '(₹)'}
                  </label>
                  <input type="number" required placeholder="10" value={formData.discountValue}
                    onChange={e => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }} />
                </div>

                {formData.type === 'threshold' && (
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Minimum Amount (₹)</label>
                    <input type="number" placeholder="1500" value={formData.minAmount}
                      onChange={e => setFormData({ ...formData, minAmount: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                      style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }} />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Valid From</label>
                  <input type="date" value={formData.validFrom} onChange={e => setFormData({ ...formData, validFrom: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }} />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Valid Until</label>
                  <input type="date" value={formData.validUntil} onChange={e => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                    style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="active" checked={formData.isActive}
                  onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded" />
                <label htmlFor="active" className="text-sm" style={{ color: 'var(--text-primary)' }}>Active</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition" style={{ background: '#9D679F' }}>
                  {editId !== null ? 'Update' : 'Create Discount'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Discounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {discounts.map(discount => (
          <div key={discount.id} className="rounded-2xl p-5 hover:shadow-md transition group"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{discount.name}</h3>
                <span className="text-xs px-2 py-1 rounded-full capitalize" style={{ background: 'var(--hover)', color: 'var(--text-secondary)' }}>
                  {discount.type}
                </span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${discount.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
                {discount.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="mb-4">
              <div className="text-3xl font-bold" style={{ color: '#9D679F' }}>{discount.value}%</div>
              {discount.minAmount > 0 && (
                <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Min. purchase: ₹{discount.minAmount}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
              <button className="flex-1 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1"
                style={{ background: 'var(--hover)', color: 'var(--text-primary)' }}
                onClick={() => openEdit(discount)}>
                <Edit2 size={12} /> Edit
              </button>
              <button onClick={() => { if (confirm(`Delete "${discount.name}"?`)) setDiscounts(d => d.filter(x => x.id !== discount.id)) }}
                className="flex-1 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1 text-red-500"
                onMouseEnter={e => (e.currentTarget.style.background = '#F9EEF4')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
