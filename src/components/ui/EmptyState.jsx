import { HiOutlineInbox } from 'react-icons/hi';

export default function EmptyState({
  icon: Icon = HiOutlineInbox,
  title = 'No Data Available',
  description = 'No data yet — add from admin panel.',
  color = 'var(--color-accent)',
}) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-6 rounded-xl text-center"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        border: '1px solid var(--color-border-primary)',
      }}
    >
      {/* Icon container */}
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
        style={{
          backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)`,
          border: `1px solid color-mix(in srgb, ${color} 20%, transparent)`,
        }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>

      {/* Title */}
      <h3
        className="text-sm font-heading font-semibold mb-1"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className="text-xs font-mono max-w-xs"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {description}
      </p>

      {/* Decorative dots */}
      <div className="flex items-center gap-1.5 mt-5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1 h-1 rounded-full"
            style={{
              backgroundColor: 'var(--color-border-primary)',
              opacity: 1 - i * 0.25,
            }}
          />
        ))}
      </div>
    </div>
  );
}
