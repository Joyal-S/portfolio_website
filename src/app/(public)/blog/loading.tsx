import { Skeleton } from "@/components/ui/skeleton";

export default function BlogLoading() {
  return (
    <div className="pt-28 md:pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-10 w-32 mb-4" />
        <Skeleton className="h-5 w-96 mb-12" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass rounded-xl p-6">
              <div className="flex gap-1.5 mb-3">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
