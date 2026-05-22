import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 animate-fade-in">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="lg:w-[55%]">
          <Skeleton className="w-full aspect-[4/3] rounded-2xl" />
        </div>
        <div className="lg:w-[45%] space-y-5">
          <Skeleton className="h-8 w-1/3 rounded-xl" />
          <Skeleton className="h-9 w-2/3 rounded-xl" />
          <Skeleton className="h-11 w-40 rounded-xl" />
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4 rounded-lg" />
          <Skeleton className="h-56 w-full rounded-2xl mt-4" />
        </div>
      </div>
    </div>
  );
}
