import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsLoading() {
  return (
    <div className="pt-28 md:pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-5 w-96 mb-8" />
        <div className="flex gap-2 mb-8">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass rounded-xl p-6">
              <Skeleton className="h-4 w-20 mb-3" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <div className="flex gap-1.5">
                <Skeleton className="h-5 w-14" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
