interface SkeletonProps {
  className?: string;
  rounded?: string;
}

export function Skeleton({ className = '', rounded = 'rounded-lg' }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-gradient-to-l from-stone-100 via-stone-200 to-stone-100 ${rounded} ${className}`}
    />
  );
}

export function WorkCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-[4/5] w-full" rounded="rounded-[2rem]" />
      <div className="px-2 space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

export function BentoSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:grid-rows-2 mb-40">
      <Skeleton className="md:col-span-2 md:row-span-2 min-h-[400px] md:min-h-[500px]" rounded="rounded-[2.5rem]" />
      <Skeleton className="md:col-span-2 min-h-[240px]" rounded="rounded-[2.5rem]" />
      <Skeleton className="md:col-span-1 min-h-[240px]" rounded="rounded-[2.5rem]" />
      <Skeleton className="md:col-span-1 min-h-[240px]" rounded="rounded-[2.5rem]" />
    </div>
  );
}
