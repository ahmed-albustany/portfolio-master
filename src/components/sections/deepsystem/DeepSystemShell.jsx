import { useState, useEffect, useContext, useRef, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModeContext } from '@/context/ModeContext';

const DeepHero = lazy(() => import('./DeepHero'));
const DeepSkills = lazy(() => import('./DeepSkills'));
const DeepExperience = lazy(() => import('./DeepExperience'));
const DeepCertifications = lazy(() => import('./DeepCertifications'));
const DeepProjects = lazy(() => import('./DeepProjects'));

/* ================================================================
   MATRIX RAIN — Canvas 2D
   ================================================================ */

function MatrixRain() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w, h, columns, drops;
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';
    const isMobile = window.innerWidth < 768;
    const fontSize = isMobile ? 12 : 14;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      columns = Math.floor(w / fontSize);
      // Reduce density on mobile
      const density = isMobile ? 3 : 1;
      const effectiveCols = Math.floor(columns / density);
      drops = new Array(effectiveCols).fill(1);
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#00FF4120';
      ctx.font = `${fontSize}px monospace`;

      const density = isMobile ? 3 : 1;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize * density;
        const y = drops[i] * fontSize;

        // Brighter for leading char
        if (Math.random() > 0.95) {
          ctx.fillStyle = '#00FF8860';
        } else {
          ctx.fillStyle = '#00FF4118';
        }

        ctx.fillText(char, x, y);

        if (y > h && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

/* ================================================================
   SCANLINE OVERLAY
   ================================================================ */

function ScanlineOverlay() {
  return (
    <div
      className="fixed inset-0 z-[1] pointer-events-none"
      style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.015) 2px, rgba(0,255,65,0.015) 4px)',
      }}
    />
  );
}

/* ================================================================
   ACTIVATION SEQUENCE
   ================================================================ */

const BOOT_LINES = [
  { text: '> BYPASSING SECURITY PROTOCOLS...', delay: 0 },
  { text: '> DECRYPTING ACCESS LAYER...........[OK]', delay: 400 },
  { text: '> INJECTING DEEP SYSTEM MODULES....[OK]', delay: 800 },
  { text: '> DISABLING SURFACE INTERFACE.......[OK]', delay: 1200 },
  { text: '> MOUNTING RAW DATA STREAMS.........[OK]', delay: 1600 },
  { text: '> ACCESSING DEEP SYSTEM............', delay: 2000, isAccess: true },
];

function ActivationSequence({ onComplete }) {
  const [phase, setPhase] = useState(0);
  const [visibleLines, setVisibleLines] = useState([]);
  const [glitch, setGlitch] = useState(true);

  useEffect(() => {
    // Phase 0: Glitch (0-1s)
    const t1 = setTimeout(() => { setPhase(1); setGlitch(false); }, 1000);
    // Phase 1: Matrix rain + boot text (1-3s)
    // Phase 2: "ACCESSING DEEP SYSTEM" (3-4s)
    const t3 = setTimeout(() => setPhase(2), 3200);
    // Phase 3: Content assembles (4s+)
    const t4 = setTimeout(() => {
      setPhase(3);
      onComplete();
    }, 4200);

    return () => { clearTimeout(t1); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  useEffect(() => {
    if (phase < 1) return;
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, line]);
      }, line.delay);
    });
  }, [phase]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: '#000' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Glitch phase */}
      {glitch && (
        <div className="absolute inset-0 z-10">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-full"
              style={{
                height: `${Math.random() * 5 + 1}px`,
                top: `${Math.random() * 100}%`,
                backgroundColor: `rgba(0,255,65,${Math.random() * 0.3})`,
              }}
              animate={{
                x: [0, Math.random() * 40 - 20, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 0.15,
                repeat: Infinity,
                delay: Math.random() * 0.5,
              }}
            />
          ))}
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: [0, 0.1, 0, 0.15, 0] }}
            transition={{ duration: 0.3, repeat: Infinity }}
            style={{ backgroundColor: '#00FF41' }}
          />
        </div>
      )}

      {/* Matrix rain during boot */}
      {phase >= 1 && <MatrixRain />}

      {/* Boot text */}
      {phase >= 1 && phase < 3 && (
        <div className="relative z-20 max-w-lg w-full px-6">
          <div className="font-mono text-xs space-y-1.5">
            {visibleLines.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                style={{ color: line.isAccess ? '#00FF41' : '#00FF4180' }}
                className={line.isAccess ? 'text-sm font-bold mt-4' : ''}
              >
                {line.text}
                {line.isAccess && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    _
                  </motion.span>
                )}
              </motion.p>
            ))}
          </div>
        </div>
      )}

      {/* "ACCESS GRANTED" flash */}
      {phase >= 2 && (
        <motion.div
          className="absolute inset-0 z-30 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1, times: [0, 0.1, 0.7, 1] }}
        >
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-mono font-bold tracking-widest"
              style={{ color: '#00FF41', textShadow: '0 0 20px rgba(0,255,65,0.5), 0 0 40px rgba(0,255,65,0.3)' }}>
              ACCESS GRANTED
            </p>
            <p className="text-[10px] font-mono tracking-[0.3em] mt-2" style={{ color: '#00FF4160' }}>
              DEEP SYSTEM INITIALIZED
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ================================================================
   SECTION LOADER
   ================================================================ */

function DeepLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 border-2 border-[#00FF41] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono" style={{ color: '#00FF4160' }}>
          Loading module...
        </span>
      </div>
    </div>
  );
}

/* ================================================================
   DEEP SYSTEM SHELL
   ================================================================ */

export default function DeepSystemShell() {
  const { exitDeepSystem } = useContext(ModeContext);
  const [introComplete, setIntroComplete] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const played = sessionStorage.getItem('deep_system_intro_played');
    if (played) {
      setIntroComplete(true);
    } else {
      setShowIntro(true);
    }
  }, []);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
    setShowIntro(false);
    sessionStorage.setItem('deep_system_intro_played', 'true');
  }, []);

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#000' }}>
      {/* Activation sequence */}
      <AnimatePresence>
        {showIntro && !introComplete && (
          <ActivationSequence onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      {/* Main deep system content */}
      {introComplete && (
        <>
          {/* Matrix rain background */}
          <MatrixRain />

          {/* Scanline overlay */}
          <ScanlineOverlay />

          {/* Circuit overlay */}
          <div
            className="fixed inset-0 z-[1] pointer-events-none opacity-[0.02]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0,255,65,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.2) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />

          {/* EXIT button — always visible, highest z-index */}
          <motion.button
            onClick={exitDeepSystem}
            className="fixed top-4 right-4 z-[100] flex items-center gap-2 px-4 py-2.5
                       text-[10px] font-mono font-bold uppercase tracking-widest rounded-lg
                       transition-all duration-200 hover:brightness-125"
            style={{
              backgroundColor: 'rgba(255,59,59,0.15)',
              color: '#FF3B3B',
              border: '1px solid rgba(255,59,59,0.3)',
              backdropFilter: 'blur(8px)',
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B3B]"
              style={{ animation: 'status-blink 1.5s ease-in-out infinite' }} />
            Exit Deep System
          </motion.button>

          {/* Top bar */}
          <motion.div
            className="fixed top-0 left-0 right-0 z-[90] h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #00FF41, transparent)' }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1 }}
          />

          {/* Content */}
          <main className="relative z-[2]">
            <Suspense fallback={<DeepLoader />}>
              <DeepHero />
            </Suspense>

            <Suspense fallback={<DeepLoader />}>
              <DeepSkills />
            </Suspense>

            <Suspense fallback={<DeepLoader />}>
              <DeepExperience />
            </Suspense>

            <Suspense fallback={<DeepLoader />}>
              <DeepCertifications />
            </Suspense>

            <Suspense fallback={<DeepLoader />}>
              <DeepProjects />
            </Suspense>

            {/* Terminal footer */}
            <div className="py-12 text-center">
              <p className="text-[10px] font-mono tracking-widest" style={{ color: '#00FF4130' }}>
                {'// END OF DEEP SYSTEM STREAM'}
              </p>
              <button
                onClick={exitDeepSystem}
                className="mt-4 text-[10px] font-mono font-bold uppercase tracking-widest
                           px-6 py-2 rounded-lg transition-all hover:brightness-125"
                style={{
                  color: '#00FF41',
                  backgroundColor: 'rgba(0,255,65,0.08)',
                  border: '1px solid rgba(0,255,65,0.2)',
                }}
              >
                [./exit_deep_system]
              </button>
            </div>
          </main>
        </>
      )}
    </div>
  );
}
