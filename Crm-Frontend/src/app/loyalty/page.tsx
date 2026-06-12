'use client'

import { useEffect, useState } from 'react'
import { Search, Gift, Star, TrendingUp } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Loader from '@/components/ui/Loader'
import { formatCurrency, formatDate, debounce } from '@/utils/helpers'
import api from '@/lib/api'
import type { Customer } from '@/types'

export default function LoyaltyPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => { fetchCustomers() }, [])

  const fetchCustomers = async (search?: string) => {
    try {
      const params = search ? `?search=${encodeURIComponent(search)}&sortBy=loyaltyPoints&sortOrder=desc` : '?sortBy=loyaltyPoints&sortOrder=desc'
      const res = await api.get(`/customers${params}`)
      setCustomers(res.data.data || res.data || [])
    } catch (error) {
      console.error('Failed to fetch customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = debounce((value: string) => fetchCustomers(value), 500)

  const adjustPoints = async (customerId: string, points: number, action: 'add' | 'redeem') => {
    try {
      await api.post(`/customers/${customerId}/loyalty`, { points, action })
      fetchCustomers()
    } catch (error) {
      alert('Failed to update loyalty points')
    }
  }

  if (loading) return <div className="flex items-center justify-center h-96"><Loader size="lg" /></div>

  const totalPoints = customers.reduce((sum, c) => sum + c.loyaltyPoints, 0)
  const topCustomers = [...customers].sort((a, b) => b.loyaltyPoints - a.loyaltyPoints).slice(0, 3)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Loyalty Program</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage customer loyalty points and rewards</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Points Issued</div>
              <div className="text-3xl font-bold text-violet-600">{totalPoints.toLocaleString()}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/20 flex items-center justify-center">
              <Star className="text-violet-600" size={24} />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Members</div>
              <div className="text-3xl font-bold text-emerald-600">{customers.filter(c => c.loyaltyPoints > 0).length}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
              <Gift className="text-emerald-600" size={24} />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Points/Customer</div>
              <div className="text-3xl font-bold text-amber-600">
                {customers.length > 0 ? Math.round(totalPoints / customers.length) : 0}
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
              <TrendingUp className="text-amber-600" size={24} />
            </div>
          </div>
        </Card>
      </div>

      {topCustomers.length > 0 && (
        <Card>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Top Loyalty Members</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topCustomers.map((customer, index) => (
              <div key={customer.id} className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20 border border-violet-200 dark:border-violet-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-700'
                  }`}>
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{customer.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{customer.phone}</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                  {customer.loyaltyPoints.toLocaleString()} pts
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); handleSearch(e.target.value) }}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                {['Customer', 'Phone', 'Loyalty Points', 'Total Spent', 'Visits', 'Membership', 'Actions'].map(h => (
                  <th key={h} className={`px-6 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider ${h === 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {customers.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No customers found</td></tr>
              ) : customers.map(customer => (
                <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/20 flex items-center justify-center">
                        <span className="text-violet-600 font-semibold">{customer.name.charAt(0)}</span>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{customer.phone}</td>
                  <td className="px-6 py-4">
                    <span className="text-lg font-bold text-violet-600 dark:text-violet-400">{customer.loyaltyPoints.toLocaleString()}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">pts</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(customer.totalSpent)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{customer.totalVisits}</td>
                  <td className="px-6 py-4">
                    {customer.membershipTier ? (
                      <Badge status="active">{customer.membershipTier}</Badge>
                    ) : (
                      <span className="text-sm text-gray-400">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          const pts = prompt('Add points (enter negative to deduct):')
                          if (pts && !isNaN(Number(pts))) {
                            const n = Number(pts)
                            adjustPoints(customer.id, Math.abs(n), n >= 0 ? 'add' : 'redeem')
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 hover:bg-violet-100 font-medium text-xs transition-colors"
                      >
                        Adjust Points
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
