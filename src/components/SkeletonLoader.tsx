export function SkeletonPulse() {
  return (
    <div className="animate-pulse bg-slate-200 dark:bg-slate-800 rounded" />
  );
}

export function CardSkeleton() {
  return (
    <div className="flex flex-col h-full rounded-3xl bg-white/20 dark:bg-slate-900/20 border border-slate-200/5 dark:border-slate-800/40 p-4 space-y-4">
      {/* Aspect-ratio image shimmer */}
      <div className="aspect-[16/10] w-full bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl" />
      {/* Title shimmer */}
      <div className="h-5 w-2/3 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-full" />
      {/* Capital shimmer */}
      <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-full" />
      {/* Pop shimmer */}
      <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-full" />
      {/* Action line shimmer */}
      <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="h-3 w-10 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-full" />
        <div className="h-3 w-12 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-full" />
      </div>
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div className="space-y-12">
      {/* Hero section skeleton */}
      <div className="h-80 md:h-96 w-full rounded-3xl bg-slate-200 dark:bg-slate-900/40 animate-pulse flex flex-col justify-end p-8 space-y-4">
        <div className="h-10 w-1/3 bg-slate-300 dark:bg-slate-800 rounded-full" />
        <div className="h-4 w-1/2 bg-slate-300 dark:bg-slate-800 rounded-full" />
        <div className="h-12 w-96 max-w-full bg-slate-300 dark:bg-slate-800 rounded-2xl" />
      </div>

      {/* Grid skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <CardSkeleton key={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ExploreSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header and filters shimmer */}
      <div className="space-y-4">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-full" />
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-10 w-28 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>

      {/* Grid of cards shimmer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <CardSkeleton key={idx} />
        ))}
      </div>
    </div>
  );
}

export function DetailsSkeleton() {
  return (
    <div className="space-y-8">
      {/* Banner / Flag overlay shimmer */}
      <div className="aspect-[21/9] w-full rounded-3xl bg-slate-200 dark:bg-slate-900 animate-pulse flex flex-col justify-end p-8 space-y-4">
        <div className="h-12 w-40 bg-slate-300 dark:bg-slate-800 rounded-3xl shadow" />
        <div className="h-8 w-72 bg-slate-300 dark:bg-slate-800 rounded-full" />
      </div>

      {/* Grid of detail boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="h-40 bg-slate-200 dark:bg-slate-900 animate-pulse rounded-3xl" />
          <div className="h-40 bg-slate-200 dark:bg-slate-900 animate-pulse rounded-3xl" />
        </div>
        <div className="h-96 bg-slate-200 dark:bg-slate-900 animate-pulse rounded-3xl" />
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="h-32 bg-slate-200 dark:bg-slate-900 animate-pulse rounded-3xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-80 bg-slate-200 dark:bg-slate-900 animate-pulse rounded-3xl" />
        <div className="h-80 bg-slate-200 dark:bg-slate-900 animate-pulse rounded-3xl" />
      </div>
    </div>
  );
}
