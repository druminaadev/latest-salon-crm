'use client'

import { useState } from 'react'
import { User, Mail, Phone, Lock, Save, Eye, EyeOff } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useAuthStore } from '@/store/authStore'
import { validateEmail, validatePhone, sanitizeInput } from '@/utils/helpers'
import api from '@/lib/api'

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    if (!profileData.name.trim()) newErrors.name = 'Name is required'
    if (!validateEmail(profileData.email)) newErrors.email = 'Invalid email'
    if (profileData.phone && !validatePhone(profileData.phone)) newErrors.phone = 'Invalid phone number'
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setLoading(true)
    try {
      await updateProfile({
        name: sanitizeInput(profileData.name),
        email: sanitizeInput(profileData.email),
        phone: profileData.phone,
      })
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      alert('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    if (!passwordData.currentPassword) newErrors.currentPassword = 'Current password is required'
    if (passwordData.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters'
    if (passwordData.newPassword !== passwordData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setLoading(true)
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      setSuccess('Password changed successfully!')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setSuccess(''), 3000)
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account settings</p>
      </div>

      <Card>
        <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white text-3xl font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name || 'Admin'}</h2>
            <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
            <span className="mt-1 inline-block px-3 py-1 rounded-full text-xs font-semibold bg-violet-100 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 capitalize">
              {user?.role || 'Administrator'}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {(['profile', 'password'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setErrors({}); setSuccess('') }}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all capitalize ${
                activeTab === tab
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {tab === 'profile' ? 'Profile Info' : 'Change Password'}
            </button>
          ))}
        </div>

        {success && (
          <div className="mb-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <p className="text-sm text-emerald-600 dark:text-emerald-400">{success}</p>
          </div>
        )}

        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="relative">
              <Input
                label="Full Name"
                value={profileData.name}
                onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                error={errors.name}
                required
              />
              <User size={16} className="absolute right-3 top-10 text-gray-400" />
            </div>
            <div className="relative">
              <Input
                label="Email Address"
                type="email"
                value={profileData.email}
                onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                error={errors.email}
                required
              />
              <Mail size={16} className="absolute right-3 top-10 text-gray-400" />
            </div>
            <div className="relative">
              <Input
                label="Phone Number"
                type="tel"
                value={profileData.phone}
                onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                error={errors.phone}
                placeholder="10-digit number"
              />
              <Phone size={16} className="absolute right-3 top-10 text-gray-400" />
            </div>
            <div className="pt-2">
              <Button type="submit" isLoading={loading}>
                <Save size={20} className="mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        )}

        {activeTab === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {(['currentPassword', 'newPassword', 'confirmPassword'] as const).map(field => {
              const labels = { currentPassword: 'Current Password', newPassword: 'New Password', confirmPassword: 'Confirm New Password' }
              const showKey = field === 'currentPassword' ? 'current' : field === 'newPassword' ? 'new' : 'confirm'
              return (
                <div key={field} className="relative">
                  <Input
                    label={labels[field]}
                    type={showPasswords[showKey as keyof typeof showPasswords] ? 'text' : 'password'}
                    value={passwordData[field]}
                    onChange={e => setPasswordData({ ...passwordData, [field]: e.target.value })}
                    error={errors[field]}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, [showKey]: !showPasswords[showKey as keyof typeof showPasswords] })}
                    className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                  >
                    {showPasswords[showKey as keyof typeof showPasswords] ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              )
            })}
            <div className="pt-2">
              <Button type="submit" isLoading={loading}>
                <Lock size={20} className="mr-2" />
                Change Password
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  )
}
