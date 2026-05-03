import { Skeleton } from "@/components/dashboard/Skeleton";

export default function Loading() {
  return (
    <div>
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-3 h-9 w-48" />
      <div className="mt-8 flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 flex-1" />
        ))}
      </div>
      <Skeleton className="mt-8 h-96 rounded-3xl" />
    </div>
  );
}
