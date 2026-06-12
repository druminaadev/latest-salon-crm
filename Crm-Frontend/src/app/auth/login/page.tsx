'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Scissors } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { validateEmail, sanitizeInput } from '@/utils/helpers'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading, error, clearError } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    clearError()

    if (!validateForm()) return

    try {
      await login({
        email: sanitizeInput(formData.email.trim()),
        password: formData.password,
      })
      router.push('/dashboard')
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  const handleDemoLogin = async () => {
    clearError()
    try {
      await login({
        email: 'admin@hairahmedabad.com',
        password: 'Admin@123',
      })
      router.push('/dashboard')
    } catch (err) {
      console.error('Demo login failed:', err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-salon-100/30 to-salon-400/20 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-salon-400 to-salon-600 flex items-center justify-center mb-4">
              <Scissors className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">SalonPro CRM</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="admin@hairahmedabad.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              required
              autoComplete="email"
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-salon-600 focus:ring-salon-400"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-salon-600 hover:text-salon-900 dark:text-salon-100 font-medium"
              >
                Forgot password?
              </button>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={handleDemoLogin}
              isLoading={isLoading}
            >
              Demo Quick Login
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Default credentials: admin@hairahmedabad.com / Admin@123
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© 2024 Hair Ahmedabad. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
