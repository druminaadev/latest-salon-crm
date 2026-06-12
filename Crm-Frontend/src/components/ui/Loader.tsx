import { cn } from '@/utils/helpers'

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Loader({ size = 'md', className }: LoaderProps) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
  }

  return (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          'rounded-full border-gray-200 border-t-salon-600 animate-spin',
          sizes[size],
          className
        )}
      />
    </div>
  )
}
