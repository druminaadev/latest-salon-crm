import { Skeleton, TableSkeleton } from '@/components/ui/skeleton'

export default function StaffLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-11 w-32 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl p-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <Skeleton className="h-20 w-20 rounded-full mx-auto mb-3" />
            <Skeleton className="h-5 w-32 mx-auto mb-2" />
            <Skeleton className="h-4 w-24 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}
