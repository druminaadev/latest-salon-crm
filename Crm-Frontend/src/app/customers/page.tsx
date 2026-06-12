'use client'

import { useState } from 'react'
import { Plus, Search, Phone, Mail, X, MapPin } from 'lucide-react'
import ClientForm from '@/components/forms/ClientForm'
import { useLocationStore, BRANCHES, type BranchId } from '@/store/locationStore'

interface Client {
  id: number
  name: string
  email: string
  phone: string
  visits: number
  lastVisit: string
  spent: string
}

const SEED: Record<BranchId, Client[]> = {
  main: [
    { id: 1, name: 'Priya Sharma', email: 'priya@example.com',  phone: '+91 98765 43210', visits: 24, lastVisit: '2024-01-10', spent: '₹12,400' },
    { id: 2, name: 'Riya Patel',   email: 'riya@example.com',   phone: '+91 98765 43211', visits: 18, lastVisit: '2024-01-12', spent: '₹9,800'  },
    { id: 3, name: 'Anita Verma',  email: 'anita@example.com',  phone: '+91 98765 43212', visits: 32, lastVisit: '2024-01-14', spent: '₹18,200' },
    { id: 4, name: 'Meena Joshi',  email: 'meena@example.com',  phone: '+91 98765 43213', visits: 15, lastVisit: '2024-01-08', spent: '₹7,500'  },
    { id: 5, name: 'Sunita Rao',   email: 'sunita@example.com', phone: '+91 98765 43214', visits: 28, lastVisit: '2024-01-13', spent: '₹15,600' },
  ],
  satellite: [
    { id: 1, name: 'Kavita Singh', email: 'kavita@example.com', phone: '+91 91234 56780', visits: 10, lastVisit: '2024-01-15', spent: '₹6,200'  },
    { id: 2, name: 'Deepa Mehta',  email: 'deepa@example.com',  phone: '+91 91234 56781', visits: 7,  lastVisit: '2024-01-11', spent: '₹4,100'  },
    { id: 3, name: 'Pooja Desai',  email: 'pooja@example.com',  phone: '+91 91234 56782', visits: 20, lastVisit: '2024-01-09', spent: '₹11,000' },
  ],
  sghighway: [
    { id: 1, name: 'Nisha Kapoor',  email: 'nisha@example.com',  phone: '+91 99887 76650', visits: 14, lastVisit: '2024-01-16', spent: '₹8,800'  },
    { id: 2, name: 'Rekha Trivedi', email: 'rekha@example.com',  phone: '+91 99887 76651', visits: 9,  lastVisit: '2024-01-12', spent: '₹5,400'  },
    { id: 3, name: 'Alka Bhat',     email: 'alka@example.com',   phone: '+91 99887 76652', visits: 22, lastVisit: '2024-01-14', spent: '₹14,200' },
    { id: 4, name: 'Jyoti Pillai',  email: 'jyoti@example.com',  phone: '+91 99887 76653', visits: 5,  lastVisit: '2024-01-07', spent: '₹2,900'  },
  ],
}

export default function ClientsPage() {
  const { branchId } = useLocationStore()
  const activeBranch = BRANCHES.find(b => b.id === branchId) ?? BRANCHES[0]

  const [allClients, setAllClients] = useState<Record<BranchId, Client[]>>({
    main:      [...SEED.main],
    satellite: [...SEED.satellite],
    sghighway: [...SEED.sghighway],
  })

  const [search,    setSearch]    = useState('')
  const [showModal, setShowModal] = useState(false)

  const clients  = allClients[branchId]
  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  const setClients = (updater: (prev: Client[]) => Client[]) =>
    setAllClients(prev => ({ ...prev, [branchId]: updater(prev[branchId]) }))

  const handleSave = (data: any) =>
    setClients(p => [...p, { id: Date.now(), ...data, visits: 0, lastVisit: '-', spent: '₹0' }])

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Clients</h1>
            <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
              style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
              <MapPin size={10} />{activeBranch.short}
            </span>
          </div>
          <p className="mt-0.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{clients.length} clients · {activeBranch.address}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative max-w-md flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
            <input type="text" placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9D679F]"
              style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }} />
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold shrink-0"
            style={{ background: 'linear-gradient(135deg,#6F5AA3,#9D679F)' }}>
            <Plus size={15} /> Add Client
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--bg)' }}>
        <div className="h-0.5 bg-gradient-to-r from-[#6F5AA3] via-[#9D679F] to-[#C96F9B]" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase"
                style={{ background: 'var(--hover)', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                {['Name', 'Contact', 'Visits', 'Last Visit', 'Total Spent', 'Actions'].map(h => (
                  <th key={h} className="text-left px-6 py-3.5 font-semibold tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="transition" style={{ borderBottom: '1px solid var(--border)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs"
                        style={{ background: 'linear-gradient(135deg,#9D679F,#6F5AA3)' }}>
                        {c.name.charAt(0)}
                      </div>
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{c.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        <Mail size={12} />{c.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        <Phone size={12} />{c.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4" style={{ color: 'var(--text-secondary)' }}>{c.visits}</td>
                  <td className="px-6 py-4" style={{ color: 'var(--text-secondary)' }}>{c.lastVisit}</td>
                  <td className="px-6 py-4 font-semibold" style={{ color: '#6F5AA3' }}>{c.spent}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button className="text-xs font-medium hover:underline" style={{ color: '#9D679F' }}>View</button>
                      <button onClick={() => { if (confirm(`Delete ${c.name}?`)) setClients(p => p.filter(x => x.id !== c.id)) }}
                        className="text-xs font-medium text-red-500 hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                    No clients found for {activeBranch.short}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl shadow-2xl"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <div className="h-1 bg-gradient-to-r from-[#6F5AA3] via-[#9D679F] to-[#C96F9B]" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Add New Client</h2>
                  <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                    <MapPin size={9} />{activeBranch.short}
                  </span>
                </div>
                <button onClick={() => setShowModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <X size={18} />
                </button>
              </div>
              <ClientForm onClose={() => setShowModal(false)} onSave={handleSave} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
