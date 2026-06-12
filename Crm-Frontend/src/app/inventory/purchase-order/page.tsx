'use client'

import { useState } from 'react'
import { ShoppingCart, Plus, Trash2, Package } from 'lucide-react'

const SUPPLIERS = [
  'Beauty Supplies Co',
  'Professional Hair Ltd',
  'Skincare Distributors',
  'Nail Art Supplies',
]

const PRODUCTS = [
  { id: 1, name: 'Shampoo - Loreal Pro', unit: 'bottles' },
  { id: 2, name: 'Hair Color - Schwarzkopf', unit: 'tubes' },
  { id: 3, name: 'Conditioner - Kerastase', unit: 'bottles' },
  { id: 4, name: 'Face Mask - Olay', unit: 'packs' },
  { id: 5, name: 'Nail Polish - OPI', unit: 'bottles' },
]

export default function PurchaseOrderPage() {
  const [supplier, setSupplier] = useState('')
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0])
  const [items, setItems] = useState([{ product: '', quantity: '', price: '' }])

  const addItem = () => {
    setItems([...items, { product: '', quantity: '', price: '' }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0
      const price = parseFloat(item.price) || 0
      return sum + (qty * price)
    }, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ supplier, orderDate, items, total: calculateTotal() })
    alert('Purchase order created successfully!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Create Purchase Order</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Order new inventory items</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Order Details */}
        <div className="rounded-2xl p-6" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Order Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Supplier *</label>
              <select
                required
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm"
                style={{ background: 'var(--hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              >
                <option value="">Select supplier</option>
                {SUPPLIERS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Order Date *</label>
              <input
                required
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm"
                style={{ background: 'var(--hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="rounded-2xl p-6" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Order Items</h2>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white transition"
              style={{ background: '#9D679F' }}
            >
              <Plus size={14} /> Add Item
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-5">
                  {index === 0 && <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Product</label>}
                  <select
                    required
                    value={item.product}
                    onChange={(e) => updateItem(index, 'product', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm"
                    style={{ background: 'var(--hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  >
                    <option value="">Select product</option>
                    {PRODUCTS.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                </div>
                <div className="col-span-3">
                  {index === 0 && <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Quantity</label>}
                  <input
                    required
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-lg text-sm"
                    style={{ background: 'var(--hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div className="col-span-3">
                  {index === 0 && <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Price (₹)</label>}
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => updateItem(index, 'price', e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 rounded-lg text-sm"
                    style={{ background: 'var(--hover)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div className="col-span-1">
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="w-full flex items-center justify-center p-2 rounded-lg transition"
                      style={{ background: '#D8838518', color: '#D88385' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Total Amount:</span>
              <span className="text-2xl font-bold" style={{ color: '#9D679F' }}>₹{calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition"
            style={{ background: '#9D679F' }}
          >
            <ShoppingCart size={16} /> Create Order
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded-xl font-semibold transition"
            style={{ background: 'var(--hover)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
