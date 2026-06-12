'use client'

import Link from 'next/link'
import { AlertTriangle, Package, ShoppingCart, Plus } from 'lucide-react'

const lowStockItems = [
  { id: 1, name: 'Shampoo - Loreal Pro',        current: 3,  reorder: 10, unit: 'bottles', supplier: 'Beauty Supplies Co',     lastOrder: '2024-01-05' },
  { id: 2, name: 'Hair Color - Schwarzkopf',    current: 2,  reorder: 8,  unit: 'tubes',   supplier: 'Professional Hair Ltd',  lastOrder: '2024-01-08' },
  { id: 3, name: 'Conditioner - Kerastase',     current: 4,  reorder: 12, unit: 'bottles', supplier: 'Beauty Supplies Co',     lastOrder: '2024-01-10' },
  { id: 4, name: 'Face Mask - Olay',            current: 1,  reorder: 6,  unit: 'packs',   supplier: 'Skincare Distributors',  lastOrder: '2024-01-03' },
  { id: 5, name: 'Nail Polish - OPI',           current: 5,  reorder: 15, unit: 'bottles', supplier: 'Nail Art Supplies',      lastOrder: '2024-01-12' },
]

export default function ReorderPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Reorder Items</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Products below reorder level</p>
        </div>
        <Link href="/inventory/purchase-order" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition" style={{ background: '#9D679F' }}>
          <ShoppingCart size={15} /> Create Purchase Order
        </Link>
      </div>

      <div className="rounded-2xl p-4" style={{ background: '#D8838518', border: '1px solid #D88385' }}>
        <div className="flex items-center gap-2">
          <AlertTriangle size={18} style={{ color: '#D88385' }} />
          <span className="text-sm font-semibold" style={{ color: '#D88385' }}>{lowStockItems.length} items need reordering</span>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase" style={{ background: 'var(--hover)', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                {['Product', 'Current Stock', 'Reorder Level', 'Supplier', 'Last Order', 'Action'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lowStockItems.map(item => (
                <tr key={item.id} className="transition" style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#9D679F18' }}>
                        <Package size={16} style={{ color: '#9D679F' }} />
                      </div>
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: '#D8838518', color: '#D88385' }}>
                      {item.current} {item.unit}
                    </span>
                  </td>
                  <td className="px-5 py-4" style={{ color: 'var(--text-secondary)' }}>{item.reorder} {item.unit}</td>
                  <td className="px-5 py-4" style={{ color: 'var(--text-secondary)' }}>{item.supplier}</td>
                  <td className="px-5 py-4 text-xs" style={{ color: 'var(--text-secondary)' }}>{item.lastOrder}</td>
                  <td className="px-5 py-4">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                      style={{ background: '#9D679F', color: '#fff' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#6F5AA3')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#9D679F')}>
                      <Plus size={12} /> Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
