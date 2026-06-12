'use client'

import { useState } from 'react'
import { Settings, Save, Building, Clock, DollarSign, Bell, CheckCircle2 } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    salon: {
      name: 'Hair Ahmedabad',
      address: '123 MG Road, Ahmedabad, Gujarat 380001',
      phone: '+91 79 1234 5678',
      email: 'info@hairahmedabad.com',
      gst: '24XXXXX1234X1ZX',
      logo: ''
    },
    business: {
      openTime: '09:00',
      closeTime: '20:00',
      slotDuration: 30,
      currency: 'INR',
      taxRate: 18,
      timezone: 'Asia/Kolkata'
    },
    loyalty: {
      enabled: true,
      pointsPerRupee: 1,
      pointsValue: 1,
      minRedemption: 100
    },
    notifications: {
      whatsappEnabled: true,
      emailEnabled: false,
      smsEnabled: false,
      reminderHours: 24
    },
    booking: {
      advanceBookingDays: 30,
      cancellationHours: 24,
      allowOnlineBooking: true,
      requireDeposit: false,
      depositAmount: 0
    }
  })

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings size={18} className="text-rose-500" />
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h1>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition hover:opacity-90"
          style={{ background: '#6F5AA3' }}
        >
          <Save size={16} />
          Save Changes
        </button>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-900/50 dark:text-emerald-400">
          <CheckCircle2 size={16} /> Settings saved successfully.
        </div>
      )}

      {/* Salon Information */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Building size={16} className="text-rose-500" />
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Salon Information</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Salon Name</label>
            <input
              type="text"
              value={settings.salon.name}
              onChange={e => setSettings({ ...settings, salon: { ...settings.salon, name: e.target.value } })}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>GST Number</label>
            <input
              type="text"
              value={settings.salon.gst}
              onChange={e => setSettings({ ...settings, salon: { ...settings.salon, gst: e.target.value } })}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Address</label>
            <textarea
              value={settings.salon.address}
              onChange={e => setSettings({ ...settings, salon: { ...settings.salon, address: e.target.value } })}
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Phone</label>
            <input
              type="tel"
              value={settings.salon.phone}
              onChange={e => setSettings({ ...settings, salon: { ...settings.salon, phone: e.target.value } })}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
            <input
              type="email"
              value={settings.salon.email}
              onChange={e => setSettings({ ...settings, salon: { ...settings.salon, email: e.target.value } })}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} className="text-rose-500" />
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Business Hours &amp; Pricing</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Opening Time</label>
            <input
              type="time"
              value={settings.business.openTime}
              onChange={e => setSettings({ ...settings, business: { ...settings.business, openTime: e.target.value } })}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Closing Time</label>
            <input
              type="time"
              value={settings.business.closeTime}
              onChange={e => setSettings({ ...settings, business: { ...settings.business, closeTime: e.target.value } })}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Slot Duration (min)</label>
            <input
              type="number"
              value={settings.business.slotDuration}
              onChange={e => setSettings({ ...settings, business: { ...settings.business, slotDuration: Number(e.target.value) } })}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Tax Rate (%)</label>
            <input
              type="number"
              value={settings.business.taxRate}
              onChange={e => setSettings({ ...settings, business: { ...settings.business, taxRate: Number(e.target.value) } })}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Currency</label>
            <select
              value={settings.business.currency}
              onChange={e => setSettings({ ...settings, business: { ...settings.business, currency: e.target.value } })}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }}
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loyalty Program */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 mb-4">
          <DollarSign size={16} className="text-rose-500" />
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Loyalty Program</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="loyaltyEnabled"
              checked={settings.loyalty.enabled}
              onChange={e => setSettings({ ...settings, loyalty: { ...settings.loyalty, enabled: e.target.checked } })}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="loyaltyEnabled" className="text-sm" style={{ color: 'var(--text-primary)' }}>
              Enable Loyalty Program
            </label>
          </div>
          {settings.loyalty.enabled && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Points per ₹100</label>
                <input
                  type="number"
                  value={settings.loyalty.pointsPerRupee}
                  onChange={e => setSettings({ ...settings, loyalty: { ...settings.loyalty, pointsPerRupee: Number(e.target.value) } })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                  style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Point Value (₹)</label>
                <input
                  type="number"
                  value={settings.loyalty.pointsValue}
                  onChange={e => setSettings({ ...settings, loyalty: { ...settings.loyalty, pointsValue: Number(e.target.value) } })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                  style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Min Redemption</label>
                <input
                  type="number"
                  value={settings.loyalty.minRedemption}
                  onChange={e => setSettings({ ...settings, loyalty: { ...settings.loyalty, minRedemption: Number(e.target.value) } })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                  style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Bell size={16} className="text-rose-500" />
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Notifications</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="whatsapp"
              checked={settings.notifications.whatsappEnabled}
              onChange={e => setSettings({ ...settings, notifications: { ...settings.notifications, whatsappEnabled: e.target.checked } })}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="whatsapp" className="text-sm" style={{ color: 'var(--text-primary)' }}>
              WhatsApp Notifications
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="email"
              checked={settings.notifications.emailEnabled}
              onChange={e => setSettings({ ...settings, notifications: { ...settings.notifications, emailEnabled: e.target.checked } })}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="email" className="text-sm" style={{ color: 'var(--text-primary)' }}>
              Email Notifications
            </label>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Reminder Before (hours)</label>
            <input
              type="number"
              value={settings.notifications.reminderHours}
              onChange={e => setSettings({ ...settings, notifications: { ...settings.notifications, reminderHours: Number(e.target.value) } })}
              className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
