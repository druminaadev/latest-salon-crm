'use client'

import { Star, Gift, TrendingUp } from 'lucide-react'

const topClients = [
  { id: 1, name: 'Anita Verma',  avatar: 'AV', points: 1820, tier: 'Platinum', visits: 32, spent: '₹18,200' },
  { id: 2, name: 'Sunita Rao',   avatar: 'SR', points: 1560, tier: 'Gold',     visits: 28, spent: '₹15,600' },
  { id: 3, name: 'Priya Sharma', avatar: 'PS', points: 1240, tier: 'Gold',     visits: 24, spent: '₹12,400' },
  { id: 4, name: 'Riya Patel',   avatar: 'RP', points: 980,  tier: 'Silver',   visits: 18, spent: '₹9,800'  },
  { id: 5, name: 'Meena Joshi',  avatar: 'MJ', points: 750,  tier: 'Silver',   visits: 15, spent: '₹7,500'  },
]

const tiers = [
  { name: 'Silver',   minPoints: 0,    maxPoints: 999,  color: '#8A7D8E', perks: '5% discount on all services'    },
  { name: 'Gold',     minPoints: 1000, maxPoints: 1999, color: '#C7923E', perks: '10% discount + priority booking' },
  { name: 'Platinum', minPoints: 2000, maxPoints: null, color: '#9D679F', perks: '20% discount + free monthly spa' },
]

const tierColors: Record<string, string> = {
  Silver:   'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  Gold:     'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  Platinum: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
}

const avatarColors = ['bg-salon-600', 'bg-rose-500', 'bg-emerald-500', 'bg-amber-500', 'bg-sky-500']

export default function LoyaltyPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Star size={20} className="text-salon-600 dark:text-salon-100" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Loyalty Program</h1>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-900/20 px-4 py-2.5">
          <Star size={14} className="text-amber-500" fill="currentColor" />
          <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">1 Point = ₹1 &nbsp;·&nbsp; Earn 1 pt per ₹100 spent &nbsp;·&nbsp; Min 100 pts to redeem</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Points Issued', value: '6,350',  icon: Star,       color: 'text-amber-500',   bg: 'bg-amber-50 dark:bg-amber-900/20'    },
          { label: 'Active Members',      value: '5',      icon: Gift,       color: 'text-rose-500',    bg: 'bg-rose-50 dark:bg-rose-900/20'      },
          { label: 'Points Redeemed',     value: '1,200',  icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bg}`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tiers */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 p-5">
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Loyalty Tiers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {tiers.map(tier => (
            <div key={tier.name} className="rounded-xl p-4" style={{ background: `${tier.color}10`, border: `1px solid ${tier.color}30` }}>
              <div className="flex items-center gap-2 mb-2">
                <Star size={14} style={{ color: tier.color }} fill="currentColor" />
                <span className="font-bold text-sm" style={{ color: tier.color }}>{tier.name}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{tier.perks}</p>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                {tier.maxPoints ? `${tier.minPoints} – ${tier.maxPoints} pts` : `${tier.minPoints}+ pts`}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Top clients */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Top Loyalty Members</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
              {['Client', 'Tier', 'Points', 'Redeemable', 'Visits', 'Total Spent'].map(h => (
                <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {topClients.map((c, i) => (
              <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${avatarColors[i % avatarColors.length]}`}>{c.avatar}</div>
                    <span className="font-medium text-gray-900 dark:text-white">{c.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tierColors[c.tier]}`}>{c.tier}</span>
                </td>
                <td className="px-5 py-3.5 font-bold text-amber-500">{c.points.toLocaleString()}</td>
                <td className="px-5 py-3.5 font-semibold text-emerald-600 dark:text-emerald-400">₹{c.points.toLocaleString()}</td>
                <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{c.visits}</td>
                <td className="px-5 py-3.5 font-semibold text-salon-600 dark:text-salon-100">{c.spent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
