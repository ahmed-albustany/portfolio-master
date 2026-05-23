import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/* ================================================================
   FLOATING DEBRIS — small animated shapes in the background
   ================================================================ */

const DEBRIS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  size: 2 + (i % 4),
  x: (i * 19 + 5) % 100,
  y: (i * 23 + 11) % 100,
  duration: 4 + (i % 5) * 1.5,
  delay: i * 0.3,
}));

export default function NotFound() {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden"
      style={{ backgroundColor: '#0a0a0f' }}
    >
      {/* Star field */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(1px 1px at 15% 25%, rgba(255,255,255,0.35), transparent),
              radial-gradient(1px 1px at 35% 65%, rgba(255,255,255,0.25), transparent),
              radial-gradient(1.5px 1.5px at 55% 15%, rgba(0,212,255,0.4), transparent),
              radial-gradient(1px 1px at 75% 45%, rgba(255,255,255,0.3), transparent),
              radial-gradient(1px 1px at 90% 80%, rgba(124,58,237,0.35), transparent),
              radial-gradient(1px 1px at 10% 85%, rgba(255,255,255,0.2), transparent),
              radial-gradient(1.5px 1.5px at 60% 90%, rgba(0,212,255,0.3), transparent),
              radial-gradient(1px 1px at 45% 35%, rgba(255,255,255,0.15), transparent)
            `,
          }}
        />

        {/* Nebula glow */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 50% 40% at 30% 50%, rgba(0,212,255,0.05) 0%, transparent 70%),
              radial-gradient(ellipse 50% 40% at 70% 50%, rgba(124,58,237,0.04) 0%, transparent 70%)
            `,
          }}
        />
      </div>

      {/* Floating debris */}
      {DEBRIS.map((d) => (
        <motion.div
          key={d.id}
          className="absolute rounded-full"
          style={{
            width: d.size,
            height: d.size,
            left: `${d.x}%`,
            top: `${d.y}%`,
            backgroundColor: d.id % 3 === 0 ? '#00D4FF' : d.id % 3 === 1 ? '#A855F7' : '#ffffff',
            opacity: 0.15,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: d.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: d.delay,
          }}
        />
      ))}

      {/* Content */}
      <motion.div
        className="relative z-10 text-center max-w-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Glitch 404 */}
        <div className="relative mb-6">
          <motion.h1
            className="text-[120px] sm:text-[160px] font-bold font-display leading-none tracking-tighter"
            style={{
              background: 'linear-gradient(135deg, #00D4FF, #A855F7, #EC4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            animate={{
              textShadow: [
                '0 0 20px rgba(0,212,255,0.3)',
                '0 0 40px rgba(124,58,237,0.3)',
                '0 0 20px rgba(0,212,255,0.3)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            404
          </motion.h1>

          {/* Orbit ring around 404 */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-56 sm:h-56
                       rounded-full border border-[#00D4FF]/10"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <div
              className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#00D4FF]"
              style={{ boxShadow: '0 0 8px #00D4FF' }}
            />
          </motion.div>
        </div>

        {/* Message */}
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 font-display">
          Lost in Space
        </h2>
        <p className="text-[#94a3b8] mb-2 text-sm sm:text-base leading-relaxed">
          The coordinates you entered don't match any known destination
          in this universe.
        </p>
        <p className="text-[#475569] font-mono text-xs mb-8">
          Error: ROUTE_NOT_FOUND — sector undefined
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl
                       bg-[#00D4FF] text-[#0a0a0f] hover:brightness-110 transition-all duration-200
                       hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
            </svg>
            Return Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl
                       border border-white/15 text-white/70 hover:text-white hover:border-white/30
                       transition-all duration-200 active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back
          </button>
        </div>

        {/* Terminal-style coordinates */}
        <div
          className="mt-10 inline-block px-4 py-2 rounded-lg border border-white/5 text-[11px] font-mono text-[#475569]"
          style={{ backgroundColor: '#0d0d14' }}
        >
          <span className="text-[#00D4FF]/50">$</span> location.resolve(<span className="text-[#EF4444]/60">"{typeof window !== 'undefined' ? 'unknown' : ''}"</span>) → <span className="text-[#EF4444]/60">null</span>
        </div>
      </motion.div>
    </div>
  );
}
