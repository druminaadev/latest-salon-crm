import { Skeleton, TableSkeleton } from '@/components/ui/skeleton'

export default function ReorderLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-11 w-48 rounded-xl" />
      </div>

      <Skeleton className="h-16 w-full rounded-2xl" />

      <TableSkeleton />
    </div>
  )
}
