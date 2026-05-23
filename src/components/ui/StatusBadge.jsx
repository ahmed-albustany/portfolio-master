const statusConfig = {
  online: {
    color: '#00FF88',
    bg: 'rgba(0,255,136,0.1)',
    border: 'rgba(0,255,136,0.25)',
    glow: 'rgba(0,255,136,0.4)',
    label: 'Online',
  },
  offline: {
    color: '#FF3B3B',
    bg: 'rgba(255,59,59,0.1)',
    border: 'rgba(255,59,59,0.25)',
    glow: 'rgba(255,59,59,0.4)',
    label: 'Offline',
  },
  pending: {
    color: '#FFB800',
    bg: 'rgba(255,184,0,0.1)',
    border: 'rgba(255,184,0,0.25)',
    glow: 'rgba(255,184,0,0.4)',
    label: 'Pending',
  },
  classified: {
    color: '#0066FF',
    bg: 'rgba(0,102,255,0.1)',
    border: 'rgba(0,102,255,0.25)',
    glow: 'rgba(0,102,255,0.4)',
    label: 'Classified',
  },
};

export default function StatusBadge({ status = 'online', label }) {
  const config = statusConfig[status] || statusConfig.online;
  const displayLabel = label || config.label;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-semibold
                 uppercase tracking-widest rounded-md"
      style={{
        color: config.color,
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{
          backgroundColor: config.color,
          boxShadow: `0 0 6px ${config.glow}`,
          animation: status !== 'offline' ? 'status-blink 2s ease-in-out infinite' : 'none',
        }}
      />
      {displayLabel}
    </span>
  );
}
