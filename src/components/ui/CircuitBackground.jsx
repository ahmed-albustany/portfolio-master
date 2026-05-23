import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';

export default function CircuitBackground({ className = '' }) {
  const { isDark } = useContext(ThemeContext);

  const strokeColor = isDark ? '#1A2840' : '#CBD5E1';
  const nodeColor = isDark ? '#0066FF' : '#0066FF';
  const opacity = isDark ? 0.03 : 0.02;

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="circuit-pattern"
            x="0" y="0"
            width="120" height="120"
            patternUnits="userSpaceOnUse"
          >
            {/* Horizontal lines */}
            <line x1="0" y1="30" x2="40" y2="30" stroke={strokeColor} strokeWidth="0.5" />
            <line x1="80" y1="30" x2="120" y2="30" stroke={strokeColor} strokeWidth="0.5" />
            <line x1="20" y1="90" x2="100" y2="90" stroke={strokeColor} strokeWidth="0.5" />

            {/* Vertical lines */}
            <line x1="60" y1="0" x2="60" y2="30" stroke={strokeColor} strokeWidth="0.5" />
            <line x1="60" y1="30" x2="60" y2="60" stroke={strokeColor} strokeWidth="0.5" />
            <line x1="30" y1="60" x2="30" y2="90" stroke={strokeColor} strokeWidth="0.5" />
            <line x1="90" y1="60" x2="90" y2="120" stroke={strokeColor} strokeWidth="0.5" />

            {/* Diagonal connectors */}
            <line x1="40" y1="30" x2="60" y2="60" stroke={strokeColor} strokeWidth="0.5" />
            <line x1="80" y1="30" x2="60" y2="60" stroke={strokeColor} strokeWidth="0.5" />

            {/* Nodes */}
            <circle cx="60" cy="30" r="2.5" fill={nodeColor} opacity="0.6" />
            <circle cx="60" cy="60" r="2" fill={nodeColor} opacity="0.4" />
            <circle cx="30" cy="90" r="2" fill={nodeColor} opacity="0.5" />
            <circle cx="100" cy="90" r="1.5" fill={nodeColor} opacity="0.3" />
            <circle cx="40" cy="30" r="1.5" fill={strokeColor} />
            <circle cx="80" cy="30" r="1.5" fill={strokeColor} />
            <circle cx="90" cy="60" r="1.5" fill={strokeColor} />

            {/* Small IC chip shapes */}
            <rect x="55" y="55" width="10" height="10" rx="1" fill="none" stroke={strokeColor} strokeWidth="0.5" />
            <rect x="25" y="85" width="10" height="10" rx="1" fill="none" stroke={strokeColor} strokeWidth="0.5" />
          </pattern>

          {/* Animated pulse for a few nodes */}
          <style>{`
            @keyframes circuit-pulse {
              0%, 100% { opacity: 0.3; }
              50% { opacity: 0.8; }
            }
            .circuit-node-pulse {
              animation: circuit-pulse 4s ease-in-out infinite;
            }
          `}</style>
        </defs>

        <rect width="100%" height="100%" fill="url(#circuit-pattern)" />

        {/* A few extra accent nodes that pulse */}
        <circle className="circuit-node-pulse" cx="15%" cy="25%" r="3" fill={nodeColor} opacity="0.15" />
        <circle className="circuit-node-pulse" cx="70%" cy="60%" r="2" fill={nodeColor} opacity="0.1" style={{ animationDelay: '1s' }} />
        <circle className="circuit-node-pulse" cx="40%" cy="80%" r="2.5" fill={nodeColor} opacity="0.12" style={{ animationDelay: '2s' }} />
      </svg>
    </div>
  );
}
