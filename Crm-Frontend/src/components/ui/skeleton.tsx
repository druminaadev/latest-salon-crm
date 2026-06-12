export const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-white/10 rounded ${className}`} />
)

export const CardSkeleton = () => (
  <div className="rounded-2xl p-6" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
    <Skeleton className="h-6 w-32 mb-4" />
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-3/4" />
  </div>
)

export const TableSkeleton = () => (
  <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
    <div className="p-4 space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  </div>
)

export const StatCardSkeleton = () => (
  <div className="rounded-2xl p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
    <div className="flex items-center justify-between mb-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
    <Skeleton className="h-8 w-32 mb-1" />
    <Skeleton className="h-3 w-20" />
  </div>
)
