export function SkeletonLine({ className = '' }) {
  return <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-3">
      <SkeletonLine className="h-4 w-1/3" />
      <SkeletonLine className="h-3 w-2/3" />
      <SkeletonLine className="h-3 w-1/2" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <SkeletonLine className="h-4 flex-1" />
          <SkeletonLine className="h-4 flex-1" />
          <SkeletonLine className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
}