import { PageHeaderSkeleton, Skeleton } from "@/components/dashboard/Skeleton";

export default function Loading() {
  return (
    <div>
      <Skeleton className="h-3 w-24" />
      <div className="mt-3">
        <PageHeaderSkeleton />
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-3xl" />
        ))}
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Skeleton className="h-32" />
          <Skeleton className="h-48" />
          <Skeleton className="h-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    </div>
  );
}
