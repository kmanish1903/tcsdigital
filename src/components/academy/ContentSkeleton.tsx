import { Skeleton } from "@/components/ui/skeleton";

export function ContentSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}
