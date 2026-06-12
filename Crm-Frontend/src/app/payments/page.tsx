'use client'

import { useEffect, useState } from 'react'
import { Search, DollarSign, CreditCard, Smartphone, Wallet, TrendingUp } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Loader from '@/components/ui/Loader'
import { formatCurrency, formatDate, debounce } from '@/utils/helpers'
import api from '@/lib/api'
import type { Payment } from '@/types'

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [methodFilter, setMethodFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFrom, setDateFrom] = useState(new Date(new Date().setDate(1)).toISOString().split('T')[0])
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => { fetchPayments() }, [methodFilter, statusFilter, dateFrom, dateTo])

  const fetchPayments = async (search?: string) => {
    try {
      let params = `?dateFrom=${dateFrom}&dateTo=${dateTo}&`
      if (search) params += `search=${encodeURIComponent(search)}&`
      if (methodFilter !== 'all') params += `method=${methodFilter}&`
      if (statusFilter !== 'all') params += `status=${statusFilter}&`
      const res = await api.get(`/payments${params}`)
      setPayments(res.data.data || res.data || [])
    } catch (error) {
      console.error('Failed to fetch payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = debounce((value: string) => fetchPayments(value), 500)

  if (loading) return <div className="flex items-center justify-center h-96"><Loader size="lg" /></div>

  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)
  const methodTotals = {
    cash: payments.filter(p => p.method === 'cash' && p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    card: payments.filter(p => p.method === 'card' && p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    upi: payments.filter(p => p.method === 'upi' && p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    wallet: payments.filter(p => p.method === 'wallet' && p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payments</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Track all payment transactions</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: TrendingUp, color: 'text-violet-600', bg: 'bg-violet-100 dark:bg-violet-900/20' },
          { label: 'Cash', value: formatCurrency(methodTotals.cash), icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/20' },
          { label: 'Card', value: formatCurrency(methodTotals.card), icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20' },
          { label: 'UPI', value: formatCurrency(methodTotals.upi), icon: Smartphone, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/20' },
        ].map(stat => (
          <Card key={stat.label}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</span>
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon size={20} className={stat.color} />
              </div>
            </div>
            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); handleSearch(e.target.value) }}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
            <option value="all">All Methods</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
            <option value="wallet">Wallet</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <div className="flex items-center gap-2">
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
            <span className="text-gray-500">–</span>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                {['Date', 'Booking ID', 'Amount', 'Method', 'Status', 'Transaction ID'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <DollarSign size={48} className="mx-auto text-gray-400 mb-4" />
                    No payments found
                  </td>
                </tr>
              ) : payments.map(payment => (
                <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{formatDate(payment.createdAt)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 font-mono">{payment.bookingId?.slice(-8) || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(payment.amount)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {payment.method === 'cash' && <DollarSign size={14} className="text-emerald-600" />}
                      {payment.method === 'card' && <CreditCard size={14} className="text-blue-600" />}
                      {payment.method === 'upi' && <Smartphone size={14} className="text-amber-600" />}
                      {payment.method === 'wallet' && <Wallet size={14} className="text-violet-600" />}
                      <span className="text-sm capitalize text-gray-900 dark:text-white">{payment.method}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><Badge status={payment.status}>{payment.status}</Badge></td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-mono">{payment.transactionId || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
