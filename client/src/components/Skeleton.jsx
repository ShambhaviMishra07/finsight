export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 animate-pulse">
      <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
      <div className="h-7 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
      <div className="h-5 w-16 bg-gray-100 dark:bg-gray-800 rounded-full" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div>
          <div className="h-3 w-28 bg-gray-200 dark:bg-gray-700 rounded mb-1.5" />
          <div className="h-2.5 w-20 bg-gray-100 dark:bg-gray-800 rounded" />
        </div>
      </div>
      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 animate-pulse">
      <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
      <div className="flex items-end gap-2 h-48">
        {[60, 85, 45, 70, 90, 55, 75].map((h, i) => (
          <div key={i} className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-t" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}