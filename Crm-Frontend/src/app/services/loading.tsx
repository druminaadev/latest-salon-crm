import { Skeleton, TableSkeleton } from '@/components/ui/skeleton'

export default function ServicesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-11 w-32 rounded-xl" />
      </div>

      <div className="flex gap-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-xl" />
        ))}
      </div>

      <TableSkeleton />
    </div>
  )
}
