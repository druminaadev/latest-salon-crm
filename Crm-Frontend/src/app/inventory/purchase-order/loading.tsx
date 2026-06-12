import { Skeleton, CardSkeleton } from '@/components/ui/skeleton'

export default function PurchaseOrderLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      <CardSkeleton />
      <CardSkeleton />

      <div className="flex gap-3">
        <Skeleton className="h-12 w-32 rounded-xl" />
        <Skeleton className="h-12 w-24 rounded-xl" />
      </div>
    </div>
  )
}
