/**
 * Base shimmer block — any shape, any size
 */
export function Skeleton({ className = '' }) {
  return (
    <div
      className={`rounded-lg bg-gray-100 dark:bg-surface-border-dark animate-pulse ${className}`}
    />
  );
}

/**
 * Summary stat card skeleton (matches SummaryCards layout)
 */
export function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-surface-card-dark rounded-2xl shadow-card p-5 space-y-4">
      <div className="flex items-start justify-between">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <Skeleton className="w-14 h-6 rounded-lg" />
      </div>
      <div className="space-y-1.5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-7 w-32" />
      </div>
    </div>
  );
}

/**
 * Chart card skeleton
 */
export function ChartSkeleton({ height = 'h-64', className = '' }) {
  return (
    <div className={`bg-white dark:bg-surface-card-dark rounded-2xl shadow-card p-5 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-5 w-24 rounded-lg" />
      </div>
      <Skeleton className={`${height} rounded-xl`} />
    </div>
  );
}

/**
 * Insight card skeleton
 */
export function InsightCardSkeleton() {
  return (
    <div className="bg-white dark:bg-surface-card-dark rounded-2xl shadow-card p-4 flex items-start gap-3">
      <Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  );
}

/**
 * Table row skeleton
 */
export function TableRowSkeleton({ cols = 5 }) {
  const widths = ['w-24', 'w-32', 'w-20', 'w-16', 'w-20'];
  return (
    <tr className="border-b border-surface dark:border-surface-border-dark">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 pr-4">
          <Skeleton className={`h-4 ${widths[i] ?? 'w-20'}`} />
        </td>
      ))}
    </tr>
  );
}

/**
 * Full transaction table skeleton
 */
export function TransactionTableSkeleton({ rows = 6, cols = 5 }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-surface dark:border-surface-border-dark">
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="pb-3 pr-4 text-left">
                <Skeleton className="h-3 w-16" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} cols={cols} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
