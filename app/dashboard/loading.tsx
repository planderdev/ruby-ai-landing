import { PageHeaderSkeleton, CardGridSkeleton } from "@/components/dashboard/Skeleton";

export default function Loading() {
  return (
    <div>
      <PageHeaderSkeleton />
      <CardGridSkeleton count={3} />
    </div>
  );
}
