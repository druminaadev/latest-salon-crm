'use client'

import { useState, type ElementType } from 'react'
import {
  Search,
  Download,
  Send,
  FileText,
  Filter,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle2,
  Receipt,
} from 'lucide-react'

import { useLocationStore, BRANCHES, BRANCH_INVOICES, type BranchId } from '@/store/locationStore'
import { downloadInvoicePDF } from '@/utils/invoicePDF'

const avatarColors = ['bg-salon-600', 'bg-salon-400', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-pink-500']

const statusConfig: Record<string, { cls: string; icon: ElementType }> = {
  Paid:    { cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400', icon: CheckCircle2 },
  Pending: { cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',       icon: Clock },
}

export default function InvoicesPage() {
  const { branchId } = useLocationStore()
  const activeBranch = BRANCHES.find(b => b.id === branchId) ?? BRANCHES[0]
  const [allInvoices, setAllInvoices] = useState<Record<BranchId, typeof BRANCH_INVOICES.main>>({
    main:      [...BRANCH_INVOICES.main],
    satellite: [...BRANCH_INVOICES.satellite],
    sghighway: [...BRANCH_INVOICES.sghighway],
  })
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const invoices = allInvoices[branchId]
  const setInvoices = (updater: (prev: typeof BRANCH_INVOICES.main) => typeof BRANCH_INVOICES.main) =>
    setAllInvoices(prev => ({ ...prev, [branchId]: updater(prev[branchId]) }))

  const filteredInvoices = invoices.filter(invoice => {
    const query = search.toLowerCase()
    return (invoice.client.toLowerCase().includes(query) || invoice.id.toLowerCase().includes(query))
      && (statusFilter === 'All' || invoice.status === statusFilter)
  })

  const total     = invoices.reduce((s, i) => s + i.amount, 0)
  const paid      = invoices.filter(i => i.status === 'Paid').length
  const pending   = invoices.filter(i => i.status === 'Pending').length
  const thisMonth = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0)

  const stats = [
    { label: 'Total Invoiced', value: `₹${total.toLocaleString()}`, icon: DollarSign,   color: '#6F5AA3', bg: '#6F5AA318' },
    { label: 'Paid',           value: String(paid),                  icon: CheckCircle2, color: '#6F9F8F', bg: '#6F9F8F18' },
    { label: 'Pending',        value: String(pending),               icon: Clock,        color: '#C7923E', bg: '#C7923E18' },
    { label: 'This Month',     value: `₹${thisMonth.toLocaleString()}`, icon: TrendingUp, color: '#9D679F', bg: '#9D679F18' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Receipt size={20} className="text-salon-600 dark:text-salon-100" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoices</h1>
          <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
             {activeBranch.short}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Search invoices, track payments, and send billing updates.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: bg }}>
              <Icon size={17} style={{ color }} />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">{value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative max-w-md flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by client or invoice ID..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-salon-400 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['All', 'Paid', 'Pending'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                statusFilter === status
                  ? 'bg-salon-600 text-white'
                  : 'border border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
            >
              {status}
            </button>
          ))}
          <button className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-900 transition hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800">
            <Filter size={14} /> Date
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <th className="px-5 py-3.5 text-left font-semibold">Invoice</th>
                <th className="px-5 py-3.5 text-left font-semibold">Client</th>
                <th className="px-5 py-3.5 text-left font-semibold">Date</th>
                <th className="px-5 py-3.5 text-left font-semibold">Services</th>
                <th className="px-5 py-3.5 text-left font-semibold">Phone</th>
                <th className="px-5 py-3.5 text-left font-semibold">Email</th>
                <th className="px-5 py-3.5 text-left font-semibold">Total</th>
                <th className="px-5 py-3.5 text-left font-semibold">Status</th>
                <th className="px-5 py-3.5 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice, index) => {
                const status = statusConfig[invoice.status]
                const StatusIcon = status.icon

                return (
                  <tr key={invoice.id} className="group border-b border-gray-200 transition last:border-b-0 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-salon-100/25 dark:bg-salon-900/40">
                          <FileText size={13} className="text-salon-600 dark:text-salon-100" />
                        </div>
                        <span className="text-xs font-bold text-salon-600 dark:text-salon-100">{invoice.id}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${avatarColors[index % avatarColors.length]}`}>
                          {invoice.avatar}
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{invoice.client}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500 dark:text-gray-400">{invoice.date}</td>
                    <td className="max-w-[160px] truncate px-5 py-4 text-xs text-gray-500 dark:text-gray-400">{invoice.services}</td>
                    <td className="px-5 py-4 text-xs text-gray-500 dark:text-gray-400">{invoice.phone}</td>
                    <td className="px-5 py-4 text-xs text-gray-500 dark:text-gray-400">{invoice.email}</td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold text-salon-600 dark:text-salon-100">₹{invoice.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${status.cls}`}>
                        <StatusIcon size={10} />{invoice.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          title="Download PDF"
                          onClick={() => downloadInvoicePDF(invoice, activeBranch.name, activeBranch.address)}
                          className="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-salon-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-salon-100"
                        >
                          <Download size={14} />
                        </button>
                        <button
                          title="Send via WhatsApp"
                          onClick={() => {
                          setInvoices(current => current.map(item => item.id === invoice.id ? { ...item, whatsapp: true } : item))
                            alert(`Invoice ${invoice.id} sent via WhatsApp to ${invoice.client}`)
                          }}
                          className={`rounded-lg p-1.5 transition hover:bg-gray-100 dark:hover:bg-gray-700 ${invoice.whatsapp ? 'text-emerald-500' : 'text-gray-500 dark:text-gray-400'}`}
                        >
                          <Send size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-12">
            <FileText size={32} className="text-gray-300 dark:text-gray-700" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No invoices found</p>
          </div>
        )}
      </div>
    </div>
  )
}
