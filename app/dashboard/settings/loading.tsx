import { PageHeaderSkeleton, Skeleton } from "@/components/dashboard/Skeleton";

export default function Loading() {
  return (
    <div>
      <PageHeaderSkeleton />
      <div className="mt-8 grid gap-4 lg:grid-cols-[280px_1fr]">
        <Skeleton className="h-72" />
        <Skeleton className="h-96" />
      </div>
    </div>
  );
}
