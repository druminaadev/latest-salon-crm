'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2, Receipt } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Loader from '@/components/ui/Loader'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import { formatCurrency, formatDate, debounce, sanitizeInput } from '@/utils/helpers'
import api from '@/lib/api'
import type { Expense } from '@/types'

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)

  useEffect(() => { fetchExpenses() }, [categoryFilter])

  const fetchExpenses = async (search?: string) => {
    try {
      let params = '?'
      if (search) params += `search=${encodeURIComponent(search)}&`
      if (categoryFilter !== 'all') params += `category=${categoryFilter}&`
      const response = await api.get(`/expenses${params}`)
      setExpenses(response.data.data || response.data || [])
    } catch (error) {
      console.error('Failed to fetch expenses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = debounce((value: string) => fetchExpenses(value), 500)

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this expense?')) return
    try {
      await api.delete(`/expenses/${id}`)
      setExpenses(expenses.filter(e => e.id !== id))
    } catch (error) {
      alert('Failed to delete expense')
    }
  }

  if (loading) return <div className="flex items-center justify-center h-96"><Loader size="lg" /></div>

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const categories = Array.from(new Set(expenses.map(e => e.category)))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Expenses</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track business expenses</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={20} className="mr-2" />
          Add Expense
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{expenses.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Entries</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Expenses</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-violet-600">{categories.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Categories</div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); handleSearch(e.target.value) }}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                {['Date', 'Category', 'Description', 'Amount', 'Payment', 'Actions'].map(h => (
                  <th key={h} className={`px-6 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider ${h === 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <Receipt size={48} className="mx-auto text-gray-400 mb-4" />
                    No expenses found
                  </td>
                </tr>
              ) : expenses.map(expense => (
                <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{formatDate(expense.date)}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-violet-100 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{expense.description}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-red-600 dark:text-red-400">{formatCurrency(expense.amount)}</td>
                  <td className="px-6 py-4"><Badge status="active">{expense.paymentMethod}</Badge></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setSelectedExpense(expense); setShowModal(true) }} className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center">
                        <Edit size={16} className="text-gray-600 dark:text-gray-400" />
                      </button>
                      <button onClick={() => handleDelete(expense.id)} className="w-8 h-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center">
                        <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setSelectedExpense(null) }}
        title={selectedExpense ? 'Edit Expense' : 'Add Expense'}
        size="md"
      >
        <ExpenseForm
          expense={selectedExpense}
          onSuccess={() => { setShowModal(false); setSelectedExpense(null); fetchExpenses() }}
        />
      </Modal>
    </div>
  )
}

function ExpenseForm({ expense, onSuccess }: { expense: Expense | null; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    category: expense?.category || '',
    description: expense?.description || '',
    amount: expense?.amount || 0,
    paymentMethod: expense?.paymentMethod || 'cash',
    date: expense?.date || new Date().toISOString().split('T')[0],
    notes: expense?.notes || '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.category || !formData.description || formData.amount <= 0) {
      alert('Please fill all required fields')
      return
    }
    setLoading(true)
    try {
      const data = { ...formData, description: sanitizeInput(formData.description), category: sanitizeInput(formData.category) }
      if (expense) {
        await api.put(`/expenses/${expense.id}`, data)
      } else {
        await api.post('/expenses', data)
      }
      onSuccess()
    } catch (error) {
      alert('Failed to save expense')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="e.g., Rent, Utilities" required />
        <Input label="Amount (₹)" type="number" value={formData.amount} onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })} min="0" step="0.01" required />
      </div>
      <Input label="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Brief description" required />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Payment Method</label>
          <select value={formData.paymentMethod} onChange={e => setFormData({ ...formData, paymentMethod: e.target.value as any })} className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
            <option value="bank-transfer">Bank Transfer</option>
          </select>
        </div>
        <Input label="Date" type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Notes</label>
        <textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
      </div>
      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="secondary" onClick={onSuccess}>Cancel</Button>
        <Button type="submit" isLoading={loading}>{expense ? 'Update' : 'Add'} Expense</Button>
      </div>
    </form>
  )
}
