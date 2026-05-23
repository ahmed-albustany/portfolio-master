import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CircuitBackground from '@/components/ui/CircuitBackground';

/* ================================================================
   GLITCH TEXT
   ================================================================ */

function GlitchText({ text, className = '' }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      <motion.span
        className="absolute top-0 left-0 z-20"
        style={{ color: '#FF3B3B', clipPath: 'inset(0 0 60% 0)' }}
        animate={{ x: [0, -3, 4, -2, 0], opacity: [1, 0.7, 1, 0.8, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
        aria-hidden
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute top-0 left-0 z-20"
        style={{ color: '#00D4FF', clipPath: 'inset(55% 0 0 0)' }}
        animate={{ x: [0, 3, -4, 2, 0], opacity: [1, 0.6, 1, 0.75, 1] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        aria-hidden
      >
        {text}
      </motion.span>
    </span>
  );
}

/* ================================================================
   404 PAGE
   ================================================================ */

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* Circuit background */}
      <CircuitBackground />

      {/* Scanline overlay */}
      <div className="scan-line-effect absolute inset-0 pointer-events-none" />

      {/* Radial gradient vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, var(--color-bg-primary) 80%)' }}
      />

      <div className="relative z-10 text-center px-6 max-w-lg">
        {/* 404 with glitch */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h1
            className="text-[100px] sm:text-[140px] md:text-[180px] font-heading font-black leading-none mb-2"
            style={{
              background: 'linear-gradient(135deg, #0066FF, #00D4FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            <GlitchText text="404" />
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Error status */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF3B3B] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF3B3B]" />
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color: '#FF3B3B' }}>
              System Error
            </span>
          </div>

          <h2
            className="text-lg sm:text-xl font-heading font-bold mb-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            PAGE NOT FOUND
          </h2>

          <p
            className="text-xs sm:text-sm font-mono mb-8 max-w-sm mx-auto"
            style={{ color: 'var(--color-text-muted)' }}
          >
            System cannot locate the requested module. The resource may have been moved or does not exist.
          </p>

          {/* Terminal readout */}
          <div
            className="inline-block w-full max-w-xs px-5 py-4 rounded-lg text-left font-mono text-[11px] mb-8 space-y-1"
            style={{
              backgroundColor: 'var(--color-bg-card)',
              border: '1px solid var(--color-border-primary)',
              color: 'var(--color-text-muted)',
            }}
          >
            <p>
              <span style={{ color: '#FF3B3B' }}>ERR</span>{' '}
              route.resolve() failed
            </p>
            <p>
              <span style={{ color: '#FFB800' }}>REF</span>{' '}
              path=&quot;{typeof window !== 'undefined' ? window.location.pathname : '/unknown'}&quot;
            </p>
            <p>
              <span style={{ color: '#00FF88' }}>FIX</span>{' '}
              redirect → /
            </p>
          </div>

          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 text-[11px] font-mono font-bold
                         uppercase tracking-widest rounded-lg transition-all duration-300
                         hover:scale-105 hover:brightness-110"
              style={{
                backgroundColor: '#0066FF',
                color: '#FFFFFF',
                boxShadow: '0 0 20px rgba(0,102,255,0.3)',
              }}
            >
              Return to Home Base
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
