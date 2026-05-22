import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 animate-fade-in">
      {/* Hero skeleton */}
      <div className="mb-10 flex flex-col items-center gap-3">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-4 w-64 rounded-lg" />
        <Skeleton className="h-11 w-full max-w-md rounded-xl mt-3" />
      </div>

      {/* Category skeleton */}
      <div className="mb-8 flex justify-center gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-20 rounded-full" />
        ))}
      </div>

      {/* Product grid skeleton */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="space-y-2 animate-fade-in-up"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <Skeleton className="h-4 w-3/4 rounded-lg" />
            <Skeleton className="h-5 w-1/2 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
