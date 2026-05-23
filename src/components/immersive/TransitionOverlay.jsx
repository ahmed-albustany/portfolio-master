import { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModeContext } from '@/context/ModeContext';

/* ================================================================
   TRANSITION OVERLAY
   Three-phase animation when entering immersive mode:

   1. "void"    — A black circle expands from the centre to cover
                   the entire viewport.
   2. "loading" — Full-screen dark backdrop with the
                   "Initializing Singularity…" text + spinner.
   3. "reveal"  — Overlay fades out revealing the immersive sections
                   that were mounted underneath.

   The component renders nothing when `transitionPhase` is null.
   ================================================================ */

export default function TransitionOverlay() {
  const { transitionPhase } = useContext(ModeContext);

  return (
    <AnimatePresence>
      {transitionPhase && (
        <motion.div
          key="transition-overlay"
          className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-auto"
          style={{ backgroundColor: '#0a0a0f' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: transitionPhase === 'reveal' ? 0.6 : 0.1,
            ease: 'easeInOut',
          }}
        >
          {/* ---- Phase 1: Void circle expanding ---- */}
          {transitionPhase === 'void' && (
            <motion.div
              className="absolute rounded-full"
              style={{ backgroundColor: '#0a0a0f' }}
              initial={{
                width: 0,
                height: 0,
              }}
              animate={{
                width: '300vmax',
                height: '300vmax',
              }}
              transition={{
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1],
              }}
            />
          )}

          {/* ---- Phase 2: Loading text ---- */}
          {transitionPhase === 'loading' && (
            <div className="relative z-10 flex flex-col items-center gap-6">
              {/* Spinning ring */}
              <motion.div
                className="relative w-20 h-20"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                {/* Outer ring */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: '2px solid transparent',
                    borderTopColor: '#00D4FF',
                    borderRightColor: 'rgba(0,212,255,0.3)',
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                />

                {/* Inner ring */}
                <motion.div
                  className="absolute inset-2 rounded-full"
                  style={{
                    border: '2px solid transparent',
                    borderBottomColor: '#7C3AED',
                    borderLeftColor: 'rgba(124,58,237,0.3)',
                  }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                />

                {/* Center dot */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, #00D4FF, #7C3AED)',
                      boxShadow: '0 0 16px rgba(0,212,255,0.5)',
                    }}
                  />
                </motion.div>
              </motion.div>

              {/* Text */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                <p
                  className="text-sm sm:text-base font-mono font-medium tracking-wider mb-2"
                  style={{ color: '#00D4FF' }}
                >
                  Initializing Singularity
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                  >
                    ...
                  </motion.span>
                </p>
                <p className="text-xs font-mono" style={{ color: '#444' }}>
                  Loading immersive experience
                </p>
              </motion.div>

              {/* Progress bar */}
              <motion.div
                className="w-48 h-[2px] rounded-full overflow-hidden"
                style={{ backgroundColor: '#1e1e2e' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #00D4FF, #7C3AED)',
                  }}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
                />
              </motion.div>
            </div>
          )}

          {/* ---- Phase 3: Reveal (overlay fades via AnimatePresence exit) ---- */}
          {transitionPhase === 'reveal' && (
            <motion.div
              className="absolute inset-0"
              style={{ backgroundColor: '#0a0a0f' }}
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
