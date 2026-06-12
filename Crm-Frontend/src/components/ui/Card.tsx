import { ReactNode } from 'react'
import { cn } from '@/utils/helpers'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export default function Card({ children, className, hover = false, onClick }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
        'shadow-sm transition-all',
        hover && 'hover:shadow-md cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
