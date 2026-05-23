/**
 * SkeletonLoader — animated placeholder for loading states.
 *
 * Variants:
 *   "card"       — rectangular card with title + body lines
 *   "list"       — stacked list items
 *   "department" — department-style card with badge + lines
 */
export default function SkeletonLoader({ variant = 'card', count = 1 }) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === 'list') {
    return (
      <div className="space-y-3">
        {items.map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{
              backgroundColor: 'var(--color-bg-card)',
              border: '1px solid var(--color-border-primary)',
            }}
          >
            <div className="skeleton w-10 h-10 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-3 w-2/5 rounded" />
              <div className="skeleton h-2.5 w-4/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'department') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((i) => (
          <div
            key={i}
            className="p-5 rounded-xl"
            style={{
              backgroundColor: 'var(--color-bg-card)',
              border: '1px solid var(--color-border-primary)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="skeleton w-16 h-5 rounded-md" />
              <div className="skeleton w-2 h-2 rounded-full" />
            </div>
            <div className="skeleton h-4 w-3/4 rounded mb-3" />
            <div className="space-y-2">
              <div className="skeleton h-2.5 w-full rounded" />
              <div className="skeleton h-2.5 w-5/6 rounded" />
              <div className="skeleton h-2.5 w-2/3 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default: card variant
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((i) => (
        <div
          key={i}
          className="p-5 rounded-xl"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-border-primary)',
          }}
        >
          <div className="skeleton h-40 w-full rounded-lg mb-4" />
          <div className="skeleton h-4 w-3/4 rounded mb-3" />
          <div className="space-y-2">
            <div className="skeleton h-2.5 w-full rounded" />
            <div className="skeleton h-2.5 w-5/6 rounded" />
          </div>
          <div className="flex gap-2 mt-4">
            <div className="skeleton h-5 w-14 rounded-md" />
            <div className="skeleton h-5 w-14 rounded-md" />
            <div className="skeleton h-5 w-14 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
