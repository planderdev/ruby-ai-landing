import { PageHeaderSkeleton, CardGridSkeleton, Skeleton } from "@/components/dashboard/Skeleton";

export default function Loading() {
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <PageHeaderSkeleton />
        <Skeleton className="h-12 w-32 rounded-full" />
      </div>
      <div className="mt-8 flex gap-2">
        <Skeleton className="h-11 flex-1 rounded-full" />
        <Skeleton className="h-11 w-32 rounded-full" />
        <Skeleton className="h-11 w-24 rounded-full" />
      </div>
      <CardGridSkeleton />
    </div>
  );
}
