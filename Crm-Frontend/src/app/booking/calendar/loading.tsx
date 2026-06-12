import { Skeleton } from '@/components/ui/skeleton'

export default function CalendarLoading() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-6" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-11 w-32 rounded-xl" />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-10 w-20 rounded-xl" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-20 rounded-xl" />
        </div>
      </div>

      <div className="rounded-2xl p-6" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-20 w-20" />
              {[...Array(4)].map((_, j) => (
                <Skeleton key={j} className="h-20 flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
