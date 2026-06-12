// Currency formatting
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount)
}

// Date formatting
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export const formatDateTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

// Phone number formatting
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
  }
  return phone
}

// Validation functions
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length === 10
}

export const validateRequired = (value: any): boolean => {
  if (typeof value === 'string') return value.trim().length > 0
  return value !== null && value !== undefined
}

// String utilities
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const truncate = (str: string, length: number): string => {
  return str.length > length ? `${str.substring(0, length)}...` : str
}

// Number utilities
export const calculatePercentage = (value: number, total: number): number => {
  return total === 0 ? 0 : Math.round((value / total) * 100)
}

export const calculateGrowth = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

// Date utilities
export const isToday = (date: string | Date): boolean => {
  const today = new Date()
  const checkDate = new Date(date)
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  )
}

export const isFuture = (date: string | Date): boolean => {
  return new Date(date) > new Date()
}

export const isPast = (date: string | Date): boolean => {
  return new Date(date) < new Date()
}

export const getDaysDifference = (date1: string | Date, date2: string | Date): number => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Status badge colors
export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    completed: 'bg-emerald-100 text-emerald-700',
    confirmed: 'bg-blue-100 text-blue-700',
    pending: 'bg-amber-100 text-amber-700',
    cancelled: 'bg-red-100 text-red-700',
    'in-progress': 'bg-salon-100/40 text-salon-600',
    'no-show': 'bg-gray-100 text-gray-700',
    paid: 'bg-emerald-100 text-emerald-700',
    unpaid: 'bg-red-100 text-red-700',
    partial: 'bg-amber-100 text-amber-700',
    active: 'bg-emerald-100 text-emerald-700',
    inactive: 'bg-gray-100 text-gray-700',
    expired: 'bg-red-100 text-red-700',
  }
  return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-700'
}

// Sanitize input (XSS protection)
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// Generate unique ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Class name merger
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ')
}
