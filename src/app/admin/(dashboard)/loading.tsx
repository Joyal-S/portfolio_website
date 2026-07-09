import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div>
      <div className="mb-8">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="glass rounded-xl p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-7 w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
