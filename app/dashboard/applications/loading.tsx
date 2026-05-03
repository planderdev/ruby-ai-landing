import { PageHeaderSkeleton, RowListSkeleton } from "@/components/dashboard/Skeleton";

export default function Loading() {
  return (
    <div>
      <PageHeaderSkeleton />
      <RowListSkeleton count={6} />
    </div>
  );
}
