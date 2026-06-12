import React from 'react'

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  className?: string
  label?: string
}

export default function PhoneInput({
  value,
  onChange,
  placeholder = '98765 43210',
  required = false,
  className = '',
  label,
}: PhoneInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    // Remove +91 prefix if user tries to type it
    const cleanValue = input.replace(/^\+91\s*/, '')
    // Keep only digits
    const numbers = cleanValue.replace(/\D/g, '')
    // Limit to 10 digits
    const limited = numbers.slice(0, 10)
    onChange(limited)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, arrows, home, end
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End'
    ]
    
    // Allow Ctrl/Cmd shortcuts
    if (e.ctrlKey || e.metaKey) {
      return
    }

    // Block if not allowed key and not a number
    if (!allowedKeys.includes(e.key) && !/^\d$/.test(e.key)) {
      e.preventDefault()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData('text')
    // Remove +91 and any non-digits
    const cleanValue = pastedText.replace(/^\+91\s*/, '').replace(/\D/g, '')
    const limited = cleanValue.slice(0, 10)
    onChange(limited)
  }

  return (
    <div className={className}>
      {label && (
        <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-medium text-gray-600 dark:text-gray-400">
          +91
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 pl-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-salon-400 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
      </div>
    </div>
  )
}
