import { Skeleton, StatCardSkeleton, TableSkeleton } from '@/components/ui/skeleton'

export default function ExpenseLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-11 w-32 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => <StatCardSkeleton key={i} />)}
      </div>

      <TableSkeleton />
    </div>
  )
}
