'use client'

import { useState, useEffect, useRef } from 'react'
import { User, Mail, Phone, MapPin, Calendar, Check, Camera, RefreshCw, X } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { validateEmail, validatePhone, sanitizeInput } from '@/utils/helpers'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const GRADIENTS = [
  { name: 'Sunset Orchid', class: 'from-[#9D679F] to-[#6F5AA3]' },
  { name: 'Sage Garden', class: 'from-[#6F9F8F] to-[#5a8274]' },
  { name: 'Ocean Mist', class: 'from-[#6D91BF] to-[#4f719c]' },
  { name: 'Autumn Gold', class: 'from-[#C7923E] to-[#a3752c]' },
  { name: 'Warm Velvet', class: 'from-[#C96F9B] to-[#9c4d72]' },
]

export default function ProfileSettingsPage() {
  const { user, updateProfile } = useAuthStore()
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // State variables for form fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | 'other' | undefined>(undefined)
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [address, setAddress] = useState('')
  const [avatar, setAvatar] = useState('')
  
  // Modal states for avatar editor
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Populate local states from store when user loaded
  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
      setPhone(user.phone || '')
      setGender(user.gender)
      setDateOfBirth(user.dateOfBirth || '')
      setAddress(user.address || '')
      setAvatar(user.avatar || '')
    }
  }, [user])

  // Check if form is dirty (has changes compared to original state)
  const isDirty = user && (
    name !== (user.name || '') ||
    email !== (user.email || '') ||
    phone !== (user.phone || '') ||
    gender !== user.gender ||
    dateOfBirth !== (user.dateOfBirth || '') ||
    address !== (user.address || '') ||
    avatar !== (user.avatar || '')
  )

  const handleCancel = () => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
      setPhone(user.phone || '')
      setGender(user.gender)
      setDateOfBirth(user.dateOfBirth || '')
      setAddress(user.address || '')
      setAvatar(user.avatar || '')
      setErrors({})
      setSuccess('')
    }
  }

  // Handle local image uploads via base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit. Please upload a smaller image.')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result as string)
        setShowAvatarModal(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    
    if (!name.trim()) newErrors.name = 'Full name is required'
    if (!validateEmail(email)) newErrors.email = 'Please enter a valid email address'
    if (phone && !validatePhone(phone)) newErrors.phone = 'Please enter a valid phone number'

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setLoading(true)
    setSuccess('')
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800)) // Simulate network delay
      await updateProfile({
        name: sanitizeInput(name),
        email: sanitizeInput(email),
        phone: phone.trim(),
        gender,
        dateOfBirth: dateOfBirth || undefined,
        address: sanitizeInput(address),
        avatar: avatar || undefined
      })
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      console.error(err)
      alert('Failed to update profile changes.')
    } finally {
      setLoading(false)
    }
  }

  // Generate a premium background based on selected gradient or avatar
  const getAvatarStyle = () => {
    if (avatar && !avatar.startsWith('from-')) {
      return { backgroundImage: `url(${avatar})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    }
    // If it's a gradient class
    return {}
  }

  const getGradientClass = () => {
    if (avatar && avatar.startsWith('from-')) {
      return avatar
    }
    return 'from-[#9D679F] to-[#6F5AA3]' // default Sunset Orchid
  }

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      {success && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-400 animate-fadeIn shadow-sm">
          <Check size={18} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
          <p className="text-sm font-semibold">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Left Column: Avatar & Account Metadata Card */}
        <div className="xl:col-span-1 space-y-6">
          <Card className="text-center relative overflow-hidden flex flex-col items-center py-8">
            {/* Header background accents */}
            <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${getGradientClass()}`} />
            
            {/* Circular Avatar */}
            <div className="relative group mt-2 mb-4">
              <div 
                className={`w-28 h-28 rounded-full flex items-center justify-center text-white text-4xl font-extrabold shadow-lg transition-transform duration-300 group-hover:scale-102 bg-gradient-to-br ${getGradientClass()}`}
                style={getAvatarStyle()}
              >
                {(!avatar || avatar.startsWith('from-')) && (name ? name.charAt(0).toUpperCase() : 'A')}
              </div>
              <button
                type="button"
                onClick={() => setShowAvatarModal(true)}
                className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-salon-600 hover:bg-salon-900 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-gray-800 transition-colors"
                aria-label="Change Profile Photo"
              >
                <Camera size={16} />
              </button>
            </div>

            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{name || 'User Profile'}</h2>
            <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--text-secondary)' }}>{email}</p>
            
            <div className="mt-3.5">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold capitalize bg-salon-50 dark:bg-salon-900/20 text-salon-600 dark:text-salon-200 border border-salon-100/50 dark:border-salon-800/30">
                {user?.role || 'Staff Member'}
              </span>
            </div>

            {/* Read-Only Account Details */}
            <div className="w-full mt-8 pt-6 border-t border-gray-100 dark:border-gray-700/50 space-y-3.5 text-left text-xs font-semibold">
              <div className="flex justify-between items-center">
                <span style={{ color: 'var(--text-secondary)' }}>Account Status</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 text-[10px] font-extrabold uppercase tracking-wide">
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: 'var(--text-secondary)' }}>Member Since</span>
                <span style={{ color: 'var(--text-primary)' }}>
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Jan 15, 2024'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: 'var(--text-secondary)' }}>Staff ID Reference</span>
                <code className="text-[10px] font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-750 px-1.5 py-0.5 rounded">
                  USR-{user?.id || '1'}
                </code>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Editable Profile Fields Form */}
        <div className="xl:col-span-2">
          <Card>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <User size={18} className="text-salon-600" />
              Personal Information
            </h3>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="relative">
                  <Input
                    label="Full Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    error={errors.name}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Email Address */}
                <div className="relative">
                  <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    error={errors.email}
                    placeholder="example@hairahmedabad.com"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div className="relative">
                  <Input
                    label="Phone Number"
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    error={errors.phone}
                    placeholder="10-digit number"
                  />
                </div>

                {/* Date of Birth */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={e => setDateOfBirth(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-salon-400 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* Gender Radio Card Grid */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Gender Identification
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['male', 'female', 'other'] as const).map(option => {
                    const isSelected = gender === option
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setGender(option)}
                        className={`py-3 px-4 rounded-xl border-2 text-center text-sm font-bold capitalize transition-all select-none focus:outline-none`}
                        style={{
                          background: isSelected ? 'var(--accent-light)' : 'var(--bg)',
                          borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
                          color: isSelected ? 'var(--sidebar-active-text)' : 'var(--text-secondary)'
                        }}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Home Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Permanent Address
                </label>
                <textarea
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Enter your current residential address..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-salon-400 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                />
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3.5">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={loading || !isDirty}
                  className="px-5 py-2.5 text-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={loading}
                  disabled={!isDirty}
                  className="px-6 py-2.5 text-sm flex items-center gap-2"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>

      {/* Avatar Presets / Custom Upload Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-700">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
              <h4 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Customize Profile Photo</h4>
              <button 
                type="button" 
                onClick={() => setShowAvatarModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-6">
              {/* Option 1: File Upload */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: 'var(--text-secondary)' }}>Upload Custom Photo</span>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden" 
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3.5 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 hover:bg-salon-50 dark:hover:bg-salon-900/10 text-sm font-bold transition-all"
                  style={{ borderColor: 'var(--border)', color: 'var(--accent)' }}
                >
                  <Camera size={16} />
                  Choose Image File
                </button>
                <p className="text-[10px] text-center" style={{ color: 'var(--text-secondary)' }}>JPG, PNG or GIF up to 2MB capacity.</p>
              </div>

              {/* Option 2: Select Gradient */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: 'var(--text-secondary)' }}>Or Select Initial Colors</span>
                <div className="grid grid-cols-5 gap-3">
                  {GRADIENTS.map((g) => {
                    const presetClass = `from-${g.class.split(' ')[0].split('-')[1]} to-${g.class.split(' ')[1].split('-')[1]}`
                    const fullClass = g.class
                    const isSelected = avatar === fullClass
                    return (
                      <button
                        key={g.name}
                        type="button"
                        onClick={() => { setAvatar(fullClass); setShowAvatarModal(false) }}
                        title={g.name}
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${fullClass} hover:scale-105 transition-all relative flex items-center justify-center border-2 border-transparent`}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
                            <Check size={18} className="text-white" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-2">
              {avatar && (
                <button
                  type="button"
                  onClick={() => { setAvatar(''); setShowAvatarModal(false) }}
                  className="px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors"
                >
                  Remove Photo
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="px-4 py-2 text-xs font-bold rounded-xl hover:bg-gray-150 dark:hover:bg-gray-700"
                style={{ color: 'var(--text-primary)' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
