'use client'

import { useState } from 'react'
import { Lock, Eye, EyeOff, Check, X, ShieldCheck } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import api from '@/lib/api'

export default function SecuritySettingsPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Calculate password strength score (0 to 4)
  const getPasswordStrength = (pwd: string) => {
    let score = 0
    if (!pwd) return score
    if (pwd.length >= 6) score += 1
    if (/[A-Z]/.test(pwd)) score += 1
    if (/[a-z]/.test(pwd)) score += 1
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score += 1
    return score
  }

  const strengthScore = getPasswordStrength(newPassword)

  const getStrengthLabel = () => {
    if (!newPassword) return { label: 'None', color: 'bg-gray-200 dark:bg-gray-700', text: 'text-gray-400' }
    if (strengthScore <= 1) return { label: 'Weak', color: 'bg-red-500', text: 'text-red-500' }
    if (strengthScore === 2) return { label: 'Medium', color: 'bg-amber-500', text: 'text-amber-500' }
    if (strengthScore === 3) return { label: 'Strong', color: 'bg-blue-500', text: 'text-blue-500' }
    return { label: 'Excellent', color: 'bg-emerald-500', text: 'text-emerald-500' }
  }

  const handleCancel = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setErrors({})
    setSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required'
    }
    if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters'
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setLoading(true)
    setSuccess('')

    try {
      // old logic inside profile/page.tsx called put('/auth/change-password')
      await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      })
      setSuccess('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setSuccess(''), 4000)
    } catch (err: any) {
      console.error(err)
      const serverMessage = err.response?.data?.message || 'Failed to change password. Please verify current credentials.'
      setErrors({ currentPassword: serverMessage })
    } finally {
      setLoading(false)
    }
  }

  const strengthInfo = getStrengthLabel()

  return (
    <div className="max-w-2xl">
      {/* Alert Banner */}
      {success && (
        <div className="mb-6 flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-400 animate-fadeIn shadow-sm">
          <Check size={18} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
          <p className="text-sm font-semibold">{success}</p>
        </div>
      )}

      <Card>
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <ShieldCheck size={18} className="text-salon-600" />
          Password Credentials
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Password */}
          <div className="relative">
            <Input
              label="Current Password"
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              error={errors.currentPassword}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3.5 top-9.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* New Password */}
          <div className="relative">
            <Input
              label="New Password"
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              error={errors.newPassword}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3.5 top-9.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {newPassword && (
            <div className="space-y-1.5 animate-fadeIn">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span style={{ color: 'var(--text-secondary)' }}>Password Strength:</span>
                <span className={`${strengthInfo.text} font-bold`}>{strengthInfo.label}</span>
              </div>
              <div className="h-1.5 w-full bg-gray-150 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${strengthInfo.color}`} 
                  style={{ width: `${(strengthScore / 4) * 100}%` }}
                />
              </div>
              <ul className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold grid grid-cols-2 gap-x-2 gap-y-1 pt-1.5">
                <li className="flex items-center gap-1">
                  {newPassword.length >= 6 ? <Check size={10} className="text-emerald-500" /> : <X size={10} className="text-red-400" />}
                  At least 6 characters
                </li>
                <li className="flex items-center gap-1">
                  {/[A-Z]/.test(newPassword) ? <Check size={10} className="text-emerald-500" /> : <X size={10} className="text-red-400" />}
                  Uppercase letters
                </li>
                <li className="flex items-center gap-1">
                  {/[a-z]/.test(newPassword) ? <Check size={10} className="text-emerald-500" /> : <X size={10} className="text-red-400" />}
                  Lowercase letters
                </li>
                <li className="flex items-center gap-1">
                  {(/[0-9]/.test(newPassword) || /[^A-Za-z0-9]/.test(newPassword)) ? <Check size={10} className="text-emerald-500" /> : <X size={10} className="text-red-400" />}
                  Numbers / Special symbols
                </li>
              </ul>
            </div>
          )}

          {/* Confirm New Password */}
          <div className="relative">
            <Input
              label="Confirm New Password"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3.5 top-9.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={loading || (!currentPassword && !newPassword && !confirmPassword)}
              className="px-5 py-2.5 text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={loading}
              className="px-6 py-2.5 text-sm"
            >
              Change Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
