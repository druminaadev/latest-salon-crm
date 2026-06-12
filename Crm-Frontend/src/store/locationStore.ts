import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type BranchId = 'main' | 'satellite' | 'sghighway'

export interface Branch {
  id: BranchId
  name: string
  short: string
  address: string
}

export const BRANCHES: Branch[] = [
  { id: 'main',      name: 'Main Branch',       short: 'Main',       address: 'C.G. Road, Navrangpura, Ahmedabad' },
  { id: 'satellite', name: 'Satellite Branch',  short: 'Satellite',  address: 'Satellite Road, Ahmedabad'          },
  { id: 'sghighway', name: 'SG Highway Branch', short: 'SG Highway', address: 'SG Highway, Ahmedabad'              },
]

export interface BranchDashboardData {
  metrics: { label: string; value: string; helper: string }[]
  timeline: { time: string; client: string; service: string; stylist: string; status: string; amount: string }[]
  staff: { name: string; role: string; state: string; next: string; load: number }[]
  weeklyPerformance: { day: string; revenue: number; bookings: number; height: number; isToday?: boolean }[]
  topProducts: { name: string; sales: number; revenue: string; trend: string; stock: number }[]
  reviews: { client: string; rating: number; comment: string; time: string; service: string }[]
  notifications: { type: string; message: string; time: string }[]
  services: { name: string; value: number }[]
}

export const BRANCH_DATA: Record<BranchId, BranchDashboardData> = {
  main: {
    metrics: [
      { label: 'Revenue',        value: 'Rs.18,450', helper: '+14% vs yesterday'  },
      { label: 'Bookings',       value: '26',        helper: '8 walk-ins today'   },
      { label: 'Occupancy Rate', value: '82%',       helper: '6 chairs active'    },
      { label: 'New Customers',  value: '12',        helper: '5 first-time visits'},
    ],
    timeline: [
      { time: '10:00', client: 'Priya Sharma', service: 'Hair Cut & Color', stylist: 'Neha',  status: 'Done',   amount: 'Rs.1,800' },
      { time: '11:30', client: 'Riya Patel',   service: 'Facial',           stylist: 'Pooja', status: 'Active', amount: 'Rs.800'   },
      { time: '13:00', client: 'Anita Verma',  service: 'Manicure',         stylist: 'Sonal', status: 'Next',   amount: 'Rs.400'   },
      { time: '14:30', client: 'Meena Joshi',  service: 'Hair Spa',         stylist: 'Neha',  status: 'Booked', amount: 'Rs.1,200' },
      { time: '16:00', client: 'Sunita Rao',   service: 'Waxing',           stylist: 'Pooja', status: 'Booked', amount: 'Rs.1,000' },
    ],
    staff: [
      { name: 'Neha',  role: 'Senior Stylist', state: 'Active', next: '02:30 PM', load: 78 },
      { name: 'Pooja', role: 'Beautician',     state: 'Active', next: '04:00 PM', load: 70 },
      { name: 'Sonal', role: 'Nail Artist',    state: 'Active', next: '01:00 PM', load: 58 },
      { name: 'Ritu',  role: 'Makeup Artist',  state: 'Break',  next: '03:30 PM', load: 34 },
    ],
    weeklyPerformance: [
      { day: 'Mon',   revenue: 15200, bookings: 22, height: 62 },
      { day: 'Tue',   revenue: 18900, bookings: 28, height: 78 },
      { day: 'Wed',   revenue: 16400, bookings: 24, height: 68 },
      { day: 'Thu',   revenue: 21300, bookings: 32, height: 88 },
      { day: 'Fri',   revenue: 24100, bookings: 38, height: 100 },
      { day: 'Sat',   revenue: 19700, bookings: 30, height: 82 },
      { day: 'Today', revenue: 18450, bookings: 26, height: 76, isToday: true },
    ],
    topProducts: [
      { name: 'Keratin Smooth Shampoo', sales: 42, revenue: 'Rs.12,600', trend: '+18%', stock: 34 },
      { name: 'Anti-Aging Serum',       sales: 38, revenue: 'Rs.19,000', trend: '+22%', stock: 21 },
      { name: 'Argan Oil Treatment',    sales: 29, revenue: 'Rs.8,700',  trend: '+12%', stock: 47 },
    ],
    reviews: [
      { client: 'Priya Sharma', rating: 5, comment: 'Amazing service! Neha is so talented.',      time: '2h ago', service: 'Hair Color' },
      { client: 'Anita Verma',  rating: 5, comment: 'Best facial experience ever!',                time: '5h ago', service: 'Facial'     },
      { client: 'Meena Joshi',  rating: 4, comment: 'Great ambience and professional staff.',      time: '1d ago', service: 'Spa'        },
    ],
    notifications: [
      { type: 'booking',   message: 'New booking from Riya Patel for tomorrow',    time: '5m ago'  },
      { type: 'inventory', message: 'Low stock alert: Hair Serum (8 units left)',   time: '1h ago'  },
      { type: 'review',    message: 'New 5-star review from Priya Sharma',          time: '2h ago'  },
    ],
    services: [
      { name: 'Hair',   value: 36 },
      { name: 'Facial', value: 25 },
      { name: 'Spa',    value: 21 },
      { name: 'Nails',  value: 18 },
    ],
  },

  satellite: {
    metrics: [
      { label: 'Revenue',        value: 'Rs.11,200', helper: '+8% vs yesterday'   },
      { label: 'Bookings',       value: '17',        helper: '4 walk-ins today'   },
      { label: 'Occupancy Rate', value: '65%',       helper: '4 chairs active'    },
      { label: 'New Customers',  value: '6',         helper: '2 first-time visits'},
    ],
    timeline: [
      { time: '10:30', client: 'Kavita Singh', service: 'Hair Coloring',  stylist: 'Rahul', status: 'Done',   amount: 'Rs.2,000' },
      { time: '12:00', client: 'Deepa Mehta',  service: 'Facial',         stylist: 'Neha',  status: 'Active', amount: 'Rs.800'   },
      { time: '13:30', client: 'Pooja Desai',  service: 'Manicure',       stylist: 'Neha',  status: 'Next',   amount: 'Rs.400'   },
      { time: '15:00', client: 'Sanya Shah',   service: 'Waxing (Full)',  stylist: 'Rahul', status: 'Booked', amount: 'Rs.1,000' },
    ],
    staff: [
      { name: 'Rahul', role: 'Color Expert',   state: 'Active', next: '03:00 PM', load: 65 },
      { name: 'Neha',  role: 'Beautician',     state: 'Active', next: '01:30 PM', load: 55 },
      { name: 'Priya', role: 'Nail Technician',state: 'Break',  next: '02:00 PM', load: 30 },
    ],
    weeklyPerformance: [
      { day: 'Mon',   revenue: 8900,  bookings: 13, height: 52 },
      { day: 'Tue',   revenue: 11200, bookings: 17, height: 65 },
      { day: 'Wed',   revenue: 9800,  bookings: 14, height: 57 },
      { day: 'Thu',   revenue: 13100, bookings: 19, height: 76 },
      { day: 'Fri',   revenue: 15400, bookings: 23, height: 90 },
      { day: 'Sat',   revenue: 12700, bookings: 18, height: 74 },
      { day: 'Today', revenue: 11200, bookings: 17, height: 65, isToday: true },
    ],
    topProducts: [
      { name: 'Hair Color Pro Kit',    sales: 28, revenue: 'Rs.8,400',  trend: '+14%', stock: 18 },
      { name: 'Nourishing Face Cream', sales: 22, revenue: 'Rs.7,700',  trend: '+9%',  stock: 30 },
      { name: 'Nail Polish Set',       sales: 19, revenue: 'Rs.3,800',  trend: '+7%',  stock: 52 },
    ],
    reviews: [
      { client: 'Kavita Singh', rating: 5, comment: 'Rahul did an amazing color job!',           time: '1h ago', service: 'Hair Color' },
      { client: 'Deepa Mehta',  rating: 4, comment: 'Very relaxing facial, will come again.',    time: '4h ago', service: 'Facial'     },
      { client: 'Pooja Desai',  rating: 5, comment: 'Love the nail art, super clean salon.',     time: '1d ago', service: 'Nails'      },
    ],
    notifications: [
      { type: 'booking',   message: 'Kavita Singh rescheduled to tomorrow 11am',   time: '10m ago' },
      { type: 'inventory', message: 'Low stock: Color Developer (5 units left)',    time: '2h ago'  },
      { type: 'review',    message: 'New 5-star review from Kavita Singh',          time: '1h ago'  },
    ],
    services: [
      { name: 'Hair',   value: 40 },
      { name: 'Nails',  value: 28 },
      { name: 'Facial', value: 20 },
      { name: 'Waxing', value: 12 },
    ],
  },

  sghighway: {
    metrics: [
      { label: 'Revenue',        value: 'Rs.22,800', helper: '+19% vs yesterday'  },
      { label: 'Bookings',       value: '34',        helper: '11 walk-ins today'  },
      { label: 'Occupancy Rate', value: '91%',       helper: '8 chairs active'    },
      { label: 'New Customers',  value: '18',        helper: '7 first-time visits'},
    ],
    timeline: [
      { time: '09:30', client: 'Nisha Kapoor',  service: 'Bridal Makeup', stylist: 'Sima',  status: 'Done',   amount: 'Rs.5,000' },
      { time: '11:00', client: 'Rekha Trivedi', service: 'Hair Spa',      stylist: 'Amit',  status: 'Active', amount: 'Rs.1,200' },
      { time: '13:00', client: 'Alka Bhat',     service: 'Pedicure',      stylist: 'Sima',  status: 'Next',   amount: 'Rs.500'   },
      { time: '14:30', client: 'Jyoti Pillai',  service: 'Facial',        stylist: 'Amit',  status: 'Booked', amount: 'Rs.800'   },
      { time: '16:00', client: 'Mira Desai',    service: 'Hair Coloring', stylist: 'Rohan', status: 'Booked', amount: 'Rs.2,000' },
    ],
    staff: [
      { name: 'Sima',  role: 'Makeup Artist',  state: 'Active', next: '01:00 PM', load: 90 },
      { name: 'Amit',  role: 'Senior Stylist', state: 'Active', next: '02:30 PM', load: 85 },
      { name: 'Rohan', role: 'Color Expert',   state: 'Active', next: '04:00 PM', load: 72 },
      { name: 'Divya', role: 'Beautician',     state: 'Break',  next: '02:00 PM', load: 45 },
    ],
    weeklyPerformance: [
      { day: 'Mon',   revenue: 18400, bookings: 27, height: 66 },
      { day: 'Tue',   revenue: 22100, bookings: 33, height: 79 },
      { day: 'Wed',   revenue: 19800, bookings: 29, height: 71 },
      { day: 'Thu',   revenue: 25600, bookings: 38, height: 92 },
      { day: 'Fri',   revenue: 27800, bookings: 42, height: 100 },
      { day: 'Sat',   revenue: 24300, bookings: 36, height: 87 },
      { day: 'Today', revenue: 22800, bookings: 34, height: 82, isToday: true },
    ],
    topProducts: [
      { name: 'Bridal Glow Kit',         sales: 55, revenue: 'Rs.27,500', trend: '+31%', stock: 12 },
      { name: 'Premium Hair Serum',      sales: 47, revenue: 'Rs.23,500', trend: '+25%', stock: 8  },
      { name: 'Luxury Body Scrub',       sales: 36, revenue: 'Rs.14,400', trend: '+17%', stock: 24 },
    ],
    reviews: [
      { client: 'Nisha Kapoor',  rating: 5, comment: 'Sima made me look stunning on my wedding!', time: '30m ago', service: 'Bridal Makeup' },
      { client: 'Rekha Trivedi', rating: 5, comment: 'Best hair spa I have ever had, very soothing.', time: '3h ago', service: 'Hair Spa' },
      { client: 'Alka Bhat',     rating: 4, comment: 'Great service, very professional team.',    time: '6h ago', service: 'Pedicure'    },
    ],
    notifications: [
      { type: 'booking',   message: 'Bridal package booked for next Saturday',      time: '2m ago'  },
      { type: 'inventory', message: 'Critical: Premium Hair Serum only 8 units left', time: '30m ago' },
      { type: 'review',    message: '5-star bridal review from Nisha Kapoor',         time: '30m ago' },
    ],
    services: [
      { name: 'Makeup', value: 35 },
      { name: 'Hair',   value: 30 },
      { name: 'Spa',    value: 22 },
      { name: 'Facial', value: 13 },
    ],
  },
}

// ── Per-page data seeds ──────────────────────────────────────────────────────

export interface StaffMember {
  id: number; name: string; role: string; speciality: string
  phone: string; email: string; isActive: boolean; workingDays: string[]
}

export interface InvoiceItem {
  id: string; client: string; avatar: string; date: string
  services: string; amount: number; gst: number; status: string; whatsapp: boolean
  phone: string; email: string
}

export interface Transaction {
  time: string; client: string; service: string; staff: string; method: string; amount: number
}

export interface InventoryProduct {
  id: number; name: string; sku: string; category: string; stock: number
  minThreshold: number; unit: string; costPrice: number; sellingPrice: number
  isConsumable: boolean; usagePerService: number
}

export const BRANCH_STAFF: Record<BranchId, StaffMember[]> = {
  main: [
    { id: 1, name: 'Priya Kumar', role: 'Senior Stylist', speciality: 'Hair',   phone: '+91 98765 11111', email: 'priya@salon.com',  isActive: true, workingDays: ['Monday','Tuesday','Wednesday','Thursday','Friday'] },
    { id: 2, name: 'Rahul Verma', role: 'Color Expert',   speciality: 'Hair',   phone: '+91 98765 22222', email: 'rahul@salon.com',  isActive: true, workingDays: ['Tuesday','Wednesday','Thursday','Friday','Saturday'] },
    { id: 3, name: 'Sonal Patel', role: 'Nail Artist',    speciality: 'Nails',  phone: '+91 98765 33333', email: 'sonal@salon.com',  isActive: true, workingDays: ['Monday','Wednesday','Friday','Saturday'] },
    { id: 4, name: 'Ritu Joshi',  role: 'Makeup Artist',  speciality: 'Makeup', phone: '+91 98765 44444', email: 'ritu@salon.com',   isActive: true, workingDays: ['Thursday','Friday','Saturday','Sunday'] },
  ],
  satellite: [
    { id: 1, name: 'Rahul Verma', role: 'Color Expert',    speciality: 'Hair',  phone: '+91 91234 11111', email: 'rahul.s@salon.com', isActive: true, workingDays: ['Monday','Tuesday','Wednesday','Thursday','Friday'] },
    { id: 2, name: 'Neha Shah',   role: 'Beautician',      speciality: 'Skin',  phone: '+91 91234 22222', email: 'neha.s@salon.com',  isActive: true, workingDays: ['Monday','Wednesday','Thursday','Friday','Saturday'] },
    { id: 3, name: 'Priya Kumar', role: 'Nail Technician', speciality: 'Nails', phone: '+91 91234 33333', email: 'priya.s@salon.com', isActive: false,workingDays: ['Tuesday','Thursday','Saturday'] },
  ],
  sghighway: [
    { id: 1, name: 'Sima Rao',    role: 'Makeup Artist',  speciality: 'Makeup', phone: '+91 99887 11111', email: 'sima@salon.com',  isActive: true, workingDays: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'] },
    { id: 2, name: 'Amit Joshi',  role: 'Senior Stylist', speciality: 'Hair',   phone: '+91 99887 22222', email: 'amit@salon.com',  isActive: true, workingDays: ['Monday','Tuesday','Thursday','Friday','Saturday'] },
    { id: 3, name: 'Rohan Mehta', role: 'Color Expert',   speciality: 'Hair',   phone: '+91 99887 33333', email: 'rohan@salon.com', isActive: true, workingDays: ['Wednesday','Thursday','Friday','Saturday','Sunday'] },
    { id: 4, name: 'Divya Nair',  role: 'Beautician',     speciality: 'Skin',   phone: '+91 99887 44444', email: 'divya@salon.com', isActive: true, workingDays: ['Monday','Wednesday','Friday'] },
  ],
}

export const BRANCH_INVOICES: Record<BranchId, InvoiceItem[]> = {
  main: [
    { id: 'INV-001', client: 'Priya Sharma',  avatar: 'PS', date: '2024-01-20', services: 'Hair Cut & Color', amount: 1888, gst: 288, status: 'Paid',    whatsapp: true,  phone: '+91 98765 11001', email: 'priya.sharma@example.com'  },
    { id: 'INV-002', client: 'Riya Patel',    avatar: 'RP', date: '2024-01-20', services: 'Facial',           amount: 944,  gst: 144, status: 'Paid',    whatsapp: true,  phone: '+91 98765 11002', email: 'riya.patel@example.com'    },
    { id: 'INV-003', client: 'Anita Verma',   avatar: 'AV', date: '2024-01-19', services: 'Manicure',         amount: 472,  gst: 72,  status: 'Pending', whatsapp: false, phone: '+91 98765 11003', email: 'anita.verma@example.com'   },
    { id: 'INV-004', client: 'Meena Joshi',   avatar: 'MJ', date: '2024-01-18', services: 'Hair Spa',         amount: 1416, gst: 216, status: 'Paid',    whatsapp: true,  phone: '+91 98765 11004', email: 'meena.joshi@example.com'   },
    { id: 'INV-005', client: 'Sunita Rao',    avatar: 'SR', date: '2024-01-17', services: 'Waxing (Full)',    amount: 1180, gst: 180, status: 'Paid',    whatsapp: false, phone: '+91 98765 11005', email: 'sunita.rao@example.com'    },
  ],
  satellite: [
    { id: 'INV-101', client: 'Kavita Singh',  avatar: 'KS', date: '2024-01-20', services: 'Hair Coloring',    amount: 2360, gst: 360, status: 'Paid',    whatsapp: true,  phone: '+91 91234 10101', email: 'kavita.singh@example.com'  },
    { id: 'INV-102', client: 'Deepa Mehta',   avatar: 'DM', date: '2024-01-20', services: 'Facial + Mani',    amount: 1416, gst: 216, status: 'Pending', whatsapp: false, phone: '+91 91234 10102', email: 'deepa.mehta@example.com'   },
    { id: 'INV-103', client: 'Pooja Desai',   avatar: 'PD', date: '2024-01-19', services: 'Waxing (Full)',    amount: 1180, gst: 180, status: 'Paid',    whatsapp: true,  phone: '+91 91234 10103', email: 'pooja.desai@example.com'   },
  ],
  sghighway: [
    { id: 'INV-201', client: 'Nisha Kapoor',  avatar: 'NK', date: '2024-01-20', services: 'Bridal Makeup',    amount: 5900, gst: 900, status: 'Paid',    whatsapp: true,  phone: '+91 99887 20101', email: 'nisha.kapoor@example.com'  },
    { id: 'INV-202', client: 'Rekha Trivedi', avatar: 'RT', date: '2024-01-20', services: 'Hair Spa',         amount: 1416, gst: 216, status: 'Paid',    whatsapp: true,  phone: '+91 99887 20102', email: 'rekha.trivedi@example.com' },
    { id: 'INV-203', client: 'Alka Bhat',     avatar: 'AB', date: '2024-01-21', services: 'Pedicure',         amount: 590,  gst: 90,  status: 'Pending', whatsapp: false, phone: '+91 99887 20103', email: 'alka.bhat@example.com'     },
    { id: 'INV-204', client: 'Jyoti Pillai',  avatar: 'JP', date: '2024-01-20', services: 'Facial',           amount: 944,  gst: 144, status: 'Paid',    whatsapp: false, phone: '+91 99887 20104', email: 'jyoti.pillai@example.com'  },
  ],
}

export const BRANCH_TRANSACTIONS: Record<BranchId, Transaction[]> = {
  main: [
    { time: '09:15', client: 'Priya Sharma',  service: 'Hair Cut & Color', staff: 'Neha',  method: 'UPI',  amount: 1888 },
    { time: '10:30', client: 'Riya Patel',    service: 'Facial',           staff: 'Pooja', method: 'Cash', amount: 944  },
    { time: '11:45', client: 'Anita Verma',   service: 'Manicure',         staff: 'Sonal', method: 'Card', amount: 472  },
    { time: '13:00', client: 'Meena Joshi',   service: 'Hair Spa',         staff: 'Neha',  method: 'UPI',  amount: 1416 },
    { time: '14:30', client: 'Sunita Rao',    service: 'Waxing (Full)',    staff: 'Pooja', method: 'Cash', amount: 1180 },
  ],
  satellite: [
    { time: '10:00', client: 'Kavita Singh',  service: 'Hair Coloring',    staff: 'Rahul', method: 'UPI',  amount: 2360 },
    { time: '12:00', client: 'Deepa Mehta',   service: 'Facial',           staff: 'Neha',  method: 'Cash', amount: 944  },
    { time: '13:30', client: 'Pooja Desai',   service: 'Waxing (Full)',    staff: 'Rahul', method: 'Card', amount: 1180 },
    { time: '15:00', client: 'Sanya Shah',    service: 'Manicure',         staff: 'Neha',  method: 'UPI',  amount: 472  },
  ],
  sghighway: [
    { time: '09:30', client: 'Nisha Kapoor',  service: 'Bridal Makeup',    staff: 'Sima',  method: 'Card', amount: 5900 },
    { time: '11:00', client: 'Rekha Trivedi', service: 'Hair Spa',         staff: 'Amit',  method: 'UPI',  amount: 1416 },
    { time: '13:00', client: 'Alka Bhat',     service: 'Pedicure',         staff: 'Sima',  method: 'Cash', amount: 590  },
    { time: '14:30', client: 'Jyoti Pillai',  service: 'Facial',           staff: 'Amit',  method: 'UPI',  amount: 944  },
    { time: '16:00', client: 'Mira Desai',    service: 'Hair Coloring',    staff: 'Rohan', method: 'Card', amount: 2360 },
  ],
}

export const BRANCH_INVENTORY: Record<BranchId, InventoryProduct[]> = {
  main: [
    { id: 1, name: 'ABC Shampoo',         sku: 'SHP001', category: 'Shampoo',     stock: 15, minThreshold: 10, unit: 'bottle', costPrice: 200, sellingPrice: 350,  isConsumable: true,  usagePerService: 1 },
    { id: 2, name: 'XYZ Hair Color',      sku: 'CLR001', category: 'Color',       stock: 3,  minThreshold: 5,  unit: 'bottle', costPrice: 800, sellingPrice: 1200, isConsumable: true,  usagePerService: 1 },
    { id: 3, name: 'Premium Conditioner', sku: 'CND001', category: 'Conditioner', stock: 25, minThreshold: 10, unit: 'bottle', costPrice: 150, sellingPrice: 280,  isConsumable: true,  usagePerService: 1 },
    { id: 4, name: 'Hair Treatment Oil',  sku: 'TRT001', category: 'Treatment',   stock: 0,  minThreshold: 5,  unit: 'bottle', costPrice: 300, sellingPrice: 500,  isConsumable: false, usagePerService: 0 },
    { id: 5, name: 'Styling Gel',         sku: 'STY001', category: 'Styling',     stock: 18, minThreshold: 8,  unit: 'bottle', costPrice: 180, sellingPrice: 320,  isConsumable: true,  usagePerService: 1 },
  ],
  satellite: [
    { id: 1, name: 'Nail Color Set',      sku: 'NCL001', category: 'Nails',       stock: 22, minThreshold: 8,  unit: 'set',    costPrice: 300, sellingPrice: 550,  isConsumable: true,  usagePerService: 1 },
    { id: 2, name: 'Face Serum',          sku: 'FSR001', category: 'Skincare',    stock: 4,  minThreshold: 6,  unit: 'bottle', costPrice: 600, sellingPrice: 950,  isConsumable: true,  usagePerService: 1 },
    { id: 3, name: 'Color Developer',     sku: 'CDV001', category: 'Color',       stock: 5,  minThreshold: 5,  unit: 'bottle', costPrice: 500, sellingPrice: 800,  isConsumable: true,  usagePerService: 1 },
    { id: 4, name: 'Wax Strips',          sku: 'WXS001', category: 'Waxing',      stock: 80, minThreshold: 20, unit: 'pack',   costPrice: 120, sellingPrice: 200,  isConsumable: true,  usagePerService: 5 },
  ],
  sghighway: [
    { id: 1, name: 'Bridal Makeup Kit',   sku: 'BMK001', category: 'Makeup',      stock: 8,  minThreshold: 3,  unit: 'kit',    costPrice: 2500,sellingPrice: 4000, isConsumable: false, usagePerService: 0 },
    { id: 2, name: 'Premium Hair Serum',  sku: 'PHS001', category: 'Treatment',   stock: 8,  minThreshold: 10, unit: 'bottle', costPrice: 800, sellingPrice: 1400, isConsumable: true,  usagePerService: 1 },
    { id: 3, name: 'Luxury Body Scrub',   sku: 'LBS001', category: 'Body',        stock: 24, minThreshold: 8,  unit: 'jar',    costPrice: 400, sellingPrice: 700,  isConsumable: true,  usagePerService: 1 },
    { id: 4, name: 'Keratin Treatment',   sku: 'KTR001', category: 'Hair',        stock: 0,  minThreshold: 4,  unit: 'bottle', costPrice: 1200,sellingPrice: 2000, isConsumable: true,  usagePerService: 1 },
    { id: 5, name: 'Nail Extension Kit',  sku: 'NEK001', category: 'Nails',       stock: 12, minThreshold: 5,  unit: 'kit',    costPrice: 600, sellingPrice: 1000, isConsumable: true,  usagePerService: 1 },
  ],
}

// ── Zustand store ─────────────────────────────────────────────────────────────
interface LocationState {
  branchId: BranchId
  setBranch: (id: BranchId) => void
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      branchId: 'main',
      setBranch: (id) => set({ branchId: id }),
    }),
    { name: 'location-storage' }
  )
)
