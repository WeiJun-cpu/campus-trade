import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Skeleton className="mb-6 h-64 w-full rounded-lg" />
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-48 w-full lg:w-72 rounded-lg" />
      </div>
    </div>
  );
}
