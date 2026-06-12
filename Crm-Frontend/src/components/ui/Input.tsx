import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/helpers'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-3 py-2 rounded-xl border transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-salon-400 focus:border-transparent',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            'dark:bg-gray-800 dark:border-gray-700 dark:text-white',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
