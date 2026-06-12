'use client'

import { useState } from 'react'
import { Package, Plus, AlertTriangle, TrendingDown, Search, Edit2, Trash2, X, Save } from 'lucide-react'
import { useLocationStore, BRANCHES, BRANCH_INVENTORY, type BranchId } from '@/store/locationStore'

export default function InventoryPage() {
  const { branchId }  = useLocationStore()
  const activeBranch  = BRANCHES.find(b => b.id === branchId) ?? BRANCHES[0]

  const [allProducts, setAllProducts] = useState<Record<BranchId, typeof BRANCH_INVENTORY.main>>({
    main:      [...BRANCH_INVENTORY.main],
    satellite: [...BRANCH_INVENTORY.satellite],
    sghighway: [...BRANCH_INVENTORY.sghighway],
  })
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all')

  const products   = allProducts[branchId]
  const setProducts = (updater: (prev: typeof BRANCH_INVENTORY.main) => typeof BRANCH_INVENTORY.main) =>
    setAllProducts(prev => ({ ...prev, [branchId]: updater(prev[branchId]) }))

  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', sku: '', category: '', stock: '', minThreshold: '', unit: 'bottle', costPrice: '', sellingPrice: '' })

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    setProducts(prev => [...prev, {
      id: Date.now(),
      name: form.name, sku: form.sku, category: form.category,
      stock: Number(form.stock), minThreshold: Number(form.minThreshold),
      unit: form.unit, costPrice: Number(form.costPrice),
      sellingPrice: Number(form.sellingPrice),
      isConsumable: false, usagePerService: 0,
    }])
    setForm({ name: '', sku: '', category: '', stock: '', minThreshold: '', unit: 'bottle', costPrice: '', sellingPrice: '' })
    setShowModal(false)
  }
  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
    if (!matchSearch) return false
    if (filter === 'low') return p.stock <= p.minThreshold && p.stock > 0
    if (filter === 'out') return p.stock === 0
    return true
  })

  const lowStock   = products.filter(p => p.stock <= p.minThreshold && p.stock > 0).length
  const outOfStock = products.filter(p => p.stock === 0).length
  const totalValue = products.reduce((s, p) => s + p.stock * p.costPrice, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package size={18} style={{ color: '#9D679F' }} />
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Inventory</h1>
          <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
             {activeBranch.short}
          </span>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold" style={{ background: 'linear-gradient(135deg,#6F5AA3,#9D679F)' }}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl shadow-xl overflow-hidden" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="h-1 bg-gradient-to-r from-[#6F5AA3] to-[#9D679F]" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Add Product</h2>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg" style={{ color: 'var(--text-secondary)' }}><X size={16} /></button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[['Product Name *', 'name', 'text', 'e.g. Argan Shampoo'],['SKU *', 'sku', 'text', 'SHP001'],['Category *', 'category', 'text', 'Shampoo'],['Unit', 'unit', 'text', 'bottle'],['Stock *', 'stock', 'number', '10'],['Min Threshold', 'minThreshold', 'number', '5'],['Cost Price (₹) *', 'costPrice', 'number', '200'],['Selling Price (₹) *', 'sellingPrice', 'number', '350']].map(([label, key, type, placeholder]) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>{label}</label>
                      <input type={type} placeholder={placeholder} required={String(label).includes('*')} value={(form as any)[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9D679F]"
                        style={{ border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                    style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}>Cancel</button>
                  <button type="submit"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold"
                    style={{ background: '#6F5AA3' }}><Save size={13} /> Add Product</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-2xl p-4" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Total Products</div>
          <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{products.length}</div>
        </div>
        <div className="rounded-2xl p-4" style={{ background: 'var(--bg)', border: '1px solid #C7923E' }}>
          <div className="flex items-center gap-1.5 text-xs font-semibold mb-1 text-amber-600"><AlertTriangle size={12} />Low Stock</div>
          <div className="text-2xl font-bold text-amber-600">{lowStock}</div>
        </div>
        <div className="rounded-2xl p-4" style={{ background: 'var(--bg)', border: '1px solid #D88385' }}>
          <div className="flex items-center gap-1.5 text-xs font-semibold mb-1 text-red-600"><TrendingDown size={12} />Out of Stock</div>
          <div className="text-2xl font-bold text-red-600">{outOfStock}</div>
        </div>
        <div className="rounded-2xl p-4" style={{ background: 'var(--bg)', border: '1px solid #6F9F8F' }}>
          <div className="text-xs font-semibold mb-1 text-emerald-600">Inventory Value</div>
          <div className="text-2xl font-bold text-emerald-600">₹{totalValue.toLocaleString()}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9D679F]"
            style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }} />
        </div>
        <div className="flex gap-2">
          {[{ key: 'all', label: 'All' }, { key: 'low', label: 'Low Stock' }, { key: 'out', label: 'Out of Stock' }].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key as 'all' | 'low' | 'out')}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition"
              style={{
                background: filter === f.key ? 'linear-gradient(135deg,#6F5AA3,#9D679F)' : 'var(--hover)',
                color:      filter === f.key ? '#fff' : 'var(--text-secondary)',
                border:     filter === f.key ? 'none' : '1px solid var(--border)',
              }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="h-0.5 bg-gradient-to-r from-[#6F5AA3] via-[#9D679F] to-[#C96F9B]" />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--hover)' }}>
                {['Product', 'SKU', 'Category', 'Stock', 'Cost', 'Selling', 'Consumable', 'Actions'].map((h, i) => (
                  <th key={h} className={`px-4 py-3 text-xs font-semibold ${i >= 3 ? 'text-center' : 'text-left'}`}
                    style={{ color: 'var(--text-secondary)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => {
                const isLow = product.stock <= product.minThreshold && product.stock > 0
                const isOut = product.stock === 0
                return (
                  <tr key={product.id} style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#9D679F18' }}>
                          <Package size={14} style={{ color: '#9D679F' }} />
                        </div>
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>{product.sku}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--hover)', color: 'var(--text-secondary)' }}>{product.category}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className={`text-sm font-bold ${isOut ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-emerald-600'}`}>{product.stock}</span>
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{product.unit}</span>
                        {isLow && <AlertTriangle size={12} className="text-amber-500" />}
                        {isOut && <TrendingDown size={12} className="text-red-500" />}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-sm" style={{ color: 'var(--text-secondary)' }}>₹{product.costPrice}</td>
                    <td className="px-4 py-3 text-right text-sm font-semibold" style={{ color: '#9D679F' }}>₹{product.sellingPrice}</td>
                    <td className="px-4 py-3 text-center">
                      {product.isConsumable
                        ? <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">Yes ({product.usagePerService}/svc)</span>
                        : <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>No</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 rounded-lg transition" style={{ background: 'var(--hover)' }}>
                          <Edit2 size={14} style={{ color: 'var(--text-secondary)' }} />
                        </button>
                        <button onClick={() => { if (confirm(`Delete ${product.name}?`)) setProducts(prev => prev.filter(p => p.id !== product.id)) }}
                          className="p-1.5 rounded-lg transition hover:bg-red-100 dark:hover:bg-red-900/20">
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>No products found for {activeBranch.short}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

