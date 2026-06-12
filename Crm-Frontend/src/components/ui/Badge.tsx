import { ReactNode } from 'react'
import { cn, getStatusColor } from '@/utils/helpers'

interface BadgeProps {
  children: ReactNode
  status?: string
  className?: string
}

export default function Badge({ children, status, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'px-2 py-1 rounded-full text-xs font-semibold inline-block',
        status ? getStatusColor(status) : 'bg-gray-100 text-gray-700',
        className
      )}
    >
      {children}
    </span>
  )
}
