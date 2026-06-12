'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LifeBuoy, Plus, Search, AlertCircle, Clock, CheckCircle, XCircle, MessageSquare, Calendar, Loader } from 'lucide-react'
import api from '@/lib/api'
import type { SupportTicket, TicketStats } from '@/types'

const statusConfig = {
  open: { label: 'Open', color: '#D88385', bg: '#D8838518', icon: AlertCircle },
  'in-progress': { label: 'In Progress', color: '#C7923E', bg: '#C7923E18', icon: Clock },
  resolved: { label: 'Resolved', color: '#6F9F8F', bg: '#6F9F8F18', icon: CheckCircle },
  closed: { label: 'Closed', color: '#9D679F', bg: '#9D679F18', icon: XCircle },
}

const priorityConfig = {
  critical: { label: 'Critical', color: '#D88385' },
  high: { label: 'High', color: '#C7923E' },
  medium: { label: 'Medium', color: '#6D91BF' },
  low: { label: 'Low', color: '#6F9F8F' },
}

const categoryConfig = {
  billing: { label: 'Billing', color: '#9D679F', bg: '#9D679F18' },
  technical: { label: 'Technical', color: '#6D91BF', bg: '#6D91BF18' },
  feature: { label: 'Feature Request', color: '#6F9F8F', bg: '#6F9F8F18' },
  bug: { label: 'Bug Report', color: '#D88385', bg: '#D8838518' },
  question: { label: 'Question', color: '#C7923E', bg: '#C7923E18' },
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [stats, setStats] = useState<TicketStats | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTickets()
    fetchStats()
  }, [statusFilter, searchQuery])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const params: any = {}
      if (statusFilter !== 'all') params.status = statusFilter
      if (searchQuery) params.search = searchQuery
      
      const response = await api.get('/support/tickets', { params })
      setTickets(response.data.data)
    } catch (error) {
      console.error('Failed to fetch tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await api.get('/support/tickets/stats')
      setStats(response.data.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  return (
    <div className="min-h-full space-y-6 bg-[#FBF4F8] pb-6 text-gray-950 dark:bg-transparent dark:text-white">
      
      {/* Header with gradient card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#6F5AA3] via-[#9D679F] to-[#C96F9B] px-6 py-6 shadow-[0_20px_50px_rgba(111,90,163,0.35)]">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-8 left-1/3 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              <LifeBuoy size={12} />
              Support & Help
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">Support Tickets</h1>
            <p className="mt-1 text-sm text-white/70">Manage and track your support requests</p>
          </div>

          <Link href="/support/new" className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl border border-white/30 bg-white/20 px-5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/30 sm:self-auto">
            <Plus size={16} />
            New Ticket
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Open Tickets', value: stats.open, color: '#D88385', icon: AlertCircle },
            { label: 'In Progress', value: stats.inProgress, color: '#C7923E', icon: Clock },
            { label: 'Resolved', value: stats.resolved, color: '#6F9F8F', icon: CheckCircle },
            { label: 'Total Tickets', value: stats.total, color: '#9D679F', icon: MessageSquare },
          ].map((stat, idx) => (
            <div key={idx} className="rounded-2xl border border-white/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{stat.label}</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${stat.color}18` }}>
                  <stat.icon size={18} style={{ color: stat.color }} />
                </div>
              </div>
              <div className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search tickets by ID or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm transition focus:border-[#6F5AA3] focus:outline-none dark:border-white/10 dark:bg-white/[0.04]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold transition dark:border-white/10 dark:bg-white/[0.04]"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Tickets List */}
      {loading ? (
        <div className="rounded-2xl border border-white/80 bg-white p-12 text-center shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <Loader size={48} className="mx-auto mb-4 animate-spin text-[#6F5AA3]" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading tickets...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.length === 0 ? (
            <div className="rounded-2xl border border-white/80 bg-white p-12 text-center shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
              <MessageSquare size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No tickets found</p>
            </div>
          ) : (
            tickets.map(ticket => {
              const status = statusConfig[ticket.status as keyof typeof statusConfig]
              const priority = priorityConfig[ticket.priority as keyof typeof priorityConfig]
              const category = categoryConfig[ticket.category as keyof typeof categoryConfig]
              const StatusIcon = status.icon

              return (
                <Link
                  key={ticket._id}
                  href={`/support/${ticket.ticketId}`}
                  className="block rounded-2xl border border-white/80 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/[0.04]"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Ticket Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: status.bg }}>
                          <StatusIcon size={18} style={{ color: status.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{ticket.subject}</h3>
                            <span className="shrink-0 text-xs font-semibold text-gray-500 dark:text-gray-400">#{ticket.ticketId}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold" style={{ background: category.bg || `${category.color}18`, color: category.color }}>
                              {category.label}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold" style={{ background: `${priority.color}18`, color: priority.color }}>
                              {priority.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <MessageSquare size={14} />
                        <span className="font-semibold">{ticket.messages?.length || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold" style={{ background: status.bg, color: status.color }}>
                      <StatusIcon size={14} />
                      {status.label}
                    </div>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
