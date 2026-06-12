// User & Authentication Types
export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'admin' | 'manager' | 'receptionist' | 'stylist'
  avatar?: string
  gender?: 'male' | 'female' | 'other'
  dateOfBirth?: string
  address?: string
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

// Customer Types
export interface Customer {
  id: string
  name: string
  email?: string
  phone: string
  gender: 'male' | 'female' | 'other'
  dateOfBirth?: string
  address?: string
  loyaltyPoints: number
  totalVisits: number
  totalSpent: number
  membershipTier?: 'silver' | 'gold' | 'platinum'
  notes?: string
  createdAt: string
  updatedAt: string
}

// Service Types
export interface Service {
  id: string
  name: string
  category: string
  price: number
  duration: number
  description?: string
  isActive: boolean
  createdAt: string
}

// Staff Types
export interface Staff {
  id: string
  name: string
  email: string
  phone: string
  role: 'stylist' | 'assistant' | 'manager'
  specialization?: string[]
  commissionRate: number
  isActive: boolean
  schedule?: StaffSchedule[]
  createdAt: string
}

export interface StaffSchedule {
  day: string
  startTime: string
  endTime: string
  isAvailable: boolean
}

// Booking Workflow Types
export type BookingType = 'Scheduled' | 'Walk_In'
export type PaymentStatus = 'Unpaid' | 'Paid'
export type AttendanceStatus = 'Booked' | 'Checked_In' | 'In_Service' | 'Completed'
export type PaymentModel = 'Pre-Paid' | 'Post-Paid'

export interface BookingWorkflow {
  id: string
  bookingType: BookingType
  paymentStatus: PaymentStatus
  attendanceStatus: AttendanceStatus
  paymentModel: PaymentModel
  canComplete: boolean
  requiresCheckout: boolean
}

// Booking Types
export interface Booking {
  id: string
  customerId: string
  customerName: string
  customerPhone: string
  staffId: string
  staffName: string
  services: BookingService[]
  date: string
  startTime: string
  endTime: string
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show'
  totalAmount: number
  paidAmount: number
  paymentStatus: 'unpaid' | 'partial' | 'paid'
  paymentMethod?: 'cash' | 'card' | 'upi' | 'wallet'
  notes?: string
  createdAt: string
  updatedAt: string
  bookingType: BookingType
  attendanceStatus: AttendanceStatus
  paymentModel: PaymentModel
}

export interface BookingService {
  serviceId: string
  serviceName: string
  price: number
  duration: number
  quantity?: number
  staffIds?: string[]
  staffNames?: string[]
  isCombo?: boolean
  originalPrice?: number
}

// Payment Types
export interface Payment {
  id: string
  bookingId: string
  customerId: string
  amount: number
  method: 'cash' | 'card' | 'upi' | 'wallet'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  transactionId?: string
  notes?: string
  createdAt: string
}

// Inventory Types
export interface InventoryItem {
  id: string
  name: string
  category: string
  brand?: string
  quantity: number
  unit: string
  minStockLevel: number
  price: number
  supplier?: string
  lastRestocked?: string
  expiryDate?: string
  createdAt: string
}

// Expense Types
export interface Expense {
  id: string
  category: string
  description: string
  amount: number
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank-transfer'
  date: string
  receipt?: string
  notes?: string
  createdAt: string
}

// Membership Types
export interface Membership {
  id: string
  name: string
  tier: 'silver' | 'gold' | 'platinum'
  price: number
  duration: number
  benefits: string[]
  discount: number
  isActive: boolean
  createdAt: string
}

export interface CustomerMembership {
  id: string
  customerId: string
  membershipId: string
  startDate: string
  endDate: string
  status: 'active' | 'expired' | 'cancelled'
  autoRenew: boolean
}

// Package Types
export interface Package {
  id: string
  name: string
  services: PackageService[]
  totalValue: number
  sellingPrice: number
  validityDays: number
  isActive: boolean
  createdAt: string
}

export interface PackageService {
  serviceId: string
  serviceName: string
  quantity: number
}

export interface CustomerPackage {
  id: string
  customerId: string
  packageId: string
  packageName: string
  purchaseDate: string
  expiryDate: string
  servicesRemaining: PackageService[]
  status: 'active' | 'expired' | 'exhausted'
}

// Discount Types
export interface Discount {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minPurchase?: number
  maxDiscount?: number
  validFrom: string
  validTo: string
  usageLimit?: number
  usedCount: number
  isActive: boolean
  createdAt: string
}

// Notification Types
export interface Notification {
  id: string
  type: 'booking' | 'payment' | 'reminder' | 'birthday' | 'system'
  title: string
  message: string
  recipient: string
  channel: 'whatsapp' | 'sms' | 'email' | 'push'
  status: 'pending' | 'sent' | 'failed'
  sentAt?: string
  createdAt: string
}

// Support Ticket Types
export interface SupportTicket {
  _id: string
  ticketId: string
  subject: string
  category: 'billing' | 'technical' | 'feature' | 'bug' | 'question'
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  description: string
  adminEmail: string
  attachments: TicketAttachment[]
  messages: TicketMessage[]
  assignedTo?: string
  resolvedAt?: string
  emailSent: boolean
  emailSentAt?: string
  createdAt: string
  updatedAt: string
}

export interface TicketAttachment {
  fileName: string
  fileUrl: string
  uploadedAt: string
}

export interface TicketMessage {
  sender: string
  message: string
  isAdmin: boolean
  createdAt: string
}

export interface TicketFormData {
  subject: string
  category: 'billing' | 'technical' | 'feature' | 'bug' | 'question'
  priority: 'low' | 'medium' | 'high' | 'critical'
  description: string
  adminEmail: string
  attachments?: TicketAttachment[]
}

export interface TicketStats {
  total: number
  open: number
  inProgress: number
  resolved: number
  closed: number
  byCategory: Array<{ _id: string; count: number }>
  byPriority: Array<{ _id: string; count: number }>
}

// Report Types
export interface DailyReport {
  date: string
  totalRevenue: number
  totalBookings: number
  completedBookings: number
  cancelledBookings: number
  cashPayments: number
  cardPayments: number
  upiPayments: number
  expenses: number
  netRevenue: number
}

export interface StylistReport {
  staffId: string
  staffName: string
  totalBookings: number
  completedBookings: number
  totalRevenue: number
  commission: number
  rating: number
}

// Dashboard Types
export interface DashboardStats {
  todayRevenue: number
  todayBookings: number
  todayCustomers: number
  monthRevenue: number
  monthBookings: number
  monthCustomers: number
  revenueGrowth: number
  bookingGrowth: number
  customerGrowth: number
}

export interface RevenueData {
  date: string
  revenue: number
  bookings: number
}

// Form Types
export interface BookingFormData {
  customerId?: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  staffId: string
  services: string[]
  date: string
  startTime: string
  notes?: string
}

export interface CustomerFormData {
  name: string
  email?: string
  phone: string
  gender: 'male' | 'female' | 'other'
  dateOfBirth?: string
  address?: string
  notes?: string
}

export interface ServiceFormData {
  name: string
  category: string
  price: number
  duration: number
  description?: string
  isActive: boolean
}

export interface StaffFormData {
  name: string
  email: string
  phone: string
  role: 'stylist' | 'assistant' | 'manager'
  specialization?: string[]
  commissionRate: number
  isActive: boolean
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Filter & Sort Types
export interface FilterOptions {
  search?: string
  status?: string
  dateFrom?: string
  dateTo?: string
  category?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}
