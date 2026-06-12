'use client'

import { useState } from 'react'
import { Bell, MessageSquare, Mail, Save, Check } from 'lucide-react'

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState({
    whatsapp: {
      bookingConfirmation: true,
      reminder24h: true,
      birthdayWishes: true,
      anniversaryWishes: true,
      dormantReengagement: true,
      invoiceDelivery: true,
    },
    email: {
      dailyReport: true,
      weeklyReport: true,
      lowStockAlert: true,
      newBooking: false,
    },
    push: {
      newBooking: true,
      cancellation: true,
      payment: true,
    }
  })

  const toggle = (category: 'whatsapp' | 'email' | 'push', key: string) => {
    setSettings(s => ({
      ...s,
      [category]: { ...s[category], [key]: !s[category][key as keyof typeof s[typeof category]] }
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Notification Settings</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Configure WhatsApp, email, and push notifications</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-transparent hover:opacity-90 text-white text-sm font-semibold transition">
          <Save size={15} /> Save Changes
        </button>
      </div>

      <div className="space-y-5">
        {/* WhatsApp */}
        <div className="rounded-2xl p-6" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#6F9F8F18' }}>
              <MessageSquare size={18} style={{ color: '#6F9F8F' }} />
            </div>
            <div>
              <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>WhatsApp Notifications</h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Automated messages via WhatsApp Business API</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { key: 'bookingConfirmation', label: 'Booking Confirmation', desc: 'Send confirmation when booking is created' },
              { key: 'reminder24h', label: '24-Hour Reminder', desc: 'Remind clients 24 hours before appointment' },
              { key: 'birthdayWishes', label: 'Birthday Wishes', desc: 'Send birthday greetings with special offer' },
              { key: 'anniversaryWishes', label: 'Anniversary Wishes', desc: 'Send anniversary greetings' },
              { key: 'dormantReengagement', label: 'Dormant Re-engagement', desc: 'Re-engage clients inactive for 3+ months' },
              { key: 'invoiceDelivery', label: 'Invoice Delivery', desc: 'Send invoice after service completion' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--hover)' }}>
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{desc}</div>
                </div>
                <button onClick={() => toggle('whatsapp', key)}
                  className="w-12 h-6 rounded-full transition-colors relative"
                  style={{ background: settings.whatsapp[key as keyof typeof settings.whatsapp] ? '#6F9F8F' : 'var(--border)' }}>
                  <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                    style={{ left: settings.whatsapp[key as keyof typeof settings.whatsapp] ? '26px' : '2px' }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Email */}
        <div className="rounded-2xl p-6" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#6D91BF18' }}>
              <Mail size={18} style={{ color: '#6D91BF' }} />
            </div>
            <div>
              <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Email Notifications</h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Reports and alerts via email</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { key: 'dailyReport', label: 'Daily Report', desc: 'Daily summary of bookings and revenue' },
              { key: 'weeklyReport', label: 'Weekly Report', desc: 'Weekly performance summary' },
              { key: 'lowStockAlert', label: 'Low Stock Alert', desc: 'Alert when inventory is low' },
              { key: 'newBooking', label: 'New Booking Alert', desc: 'Instant alert for new bookings' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--hover)' }}>
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{desc}</div>
                </div>
                <button onClick={() => toggle('email', key)}
                  className="w-12 h-6 rounded-full transition-colors relative"
                  style={{ background: settings.email[key as keyof typeof settings.email] ? '#6D91BF' : 'var(--border)' }}>
                  <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                    style={{ left: settings.email[key as keyof typeof settings.email] ? '26px' : '2px' }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Push */}
        <div className="rounded-2xl p-6" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#6F5AA318' }}>
              <Bell size={18} style={{ color: '#6F5AA3' }} />
            </div>
            <div>
              <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Push Notifications</h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Real-time alerts in the app</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { key: 'newBooking', label: 'New Booking', desc: 'Alert when new booking is created' },
              { key: 'cancellation', label: 'Cancellation', desc: 'Alert when booking is cancelled' },
              { key: 'payment', label: 'Payment Received', desc: 'Alert when payment is completed' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--hover)' }}>
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{label}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{desc}</div>
                </div>
                <button onClick={() => toggle('push', key)}
                  className="w-12 h-6 rounded-full transition-colors relative"
                  style={{ background: settings.push[key as keyof typeof settings.push] ? '#6F5AA3' : 'var(--border)' }}>
                  <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                    style={{ left: settings.push[key as keyof typeof settings.push] ? '26px' : '2px' }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
