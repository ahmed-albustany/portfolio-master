import { useRef, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ReactCountUp from 'react-countup';

const CountUp = typeof ReactCountUp === 'function'
  ? ReactCountUp
  : ReactCountUp?.default ?? ReactCountUp;
import { personalInfo, stats } from '@/data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

/* ================================================================
   CONSTANTS
   ================================================================ */

const TRAITS = [
  'Creative',
  'Analytical',
  'Systematic',
  'Curious',
  'Reliable',
  'Builder',
  'Problem-Solver',
  'Innovator',
];

const HELIX_COLORS = {
  strand1: '#00D4FF',
  strand2: '#7C3AED',
  basePair: 'rgba(0,212,255,0.25)',
  traitText: '#00D4FF',
  glow: 'rgba(0,212,255,0.15)',
};

/* ================================================================
   DNA HELIX CANVAS
   Lightweight canvas-based double helix. GSAP ScrollTrigger
   modulates the rotation speed based on scroll velocity.
   ================================================================ */

function DnaHelix({ traits }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const scrollSpeedRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let animId;
    let time = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    /* GSAP ScrollTrigger — scrub a proxy that controls speed */
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        scrollSpeedRef.current = Math.abs(self.getVelocity()) / 1000;
      },
    });

    /* ---- Draw loop ---- */
    const draw = () => {
      const w = canvas.width / (Math.min(window.devicePixelRatio || 1, 2));
      const h = canvas.height / (Math.min(window.devicePixelRatio || 1, 2));

      ctx.clearRect(0, 0, w, h);

      // Speed: base + scroll boost (capped)
      const scrollBoost = Math.min(scrollSpeedRef.current * 0.4, 2);
      const speed = 0.008 + scrollBoost * 0.006;
      time += speed;

      // Dampen scroll speed over time
      scrollSpeedRef.current *= 0.95;

      const centerX = w / 2;
      const amplitude = Math.min(w * 0.32, 90);
      const verticalSpacing = h / (traits.length + 1);

      // Draw base pairs and trait labels
      for (let i = 0; i < traits.length; i++) {
        const y = verticalSpacing * (i + 1);
        const phase = time + (i * Math.PI * 2) / traits.length;

        const x1 = centerX + Math.sin(phase) * amplitude;
        const x2 = centerX + Math.sin(phase + Math.PI) * amplitude;

        const z1 = Math.cos(phase);
        const z2 = Math.cos(phase + Math.PI);

        // Base pair line (connecting strand1 ↔ strand2)
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.strokeStyle = HELIX_COLORS.basePair;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Trait label — positioned at the midpoint, offset slightly
        const midX = (x1 + x2) / 2;
        const labelOffset = (x1 > x2 ? 1 : -1) * 4;
        const depth = (z1 + z2) / 2;
        const labelOpacity = 0.3 + Math.max(0, depth) * 0.7;

        ctx.fillStyle = `rgba(0,212,255,${labelOpacity * 0.9})`;
        ctx.font = `${Math.max(10, 11)}px "JetBrains Mono", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(traits[i], midX + labelOffset, y);

        // Strand 1 node (cyan)
        const nodeSize1 = 3 + Math.max(0, z1) * 3;
        ctx.beginPath();
        ctx.arc(x1, y, nodeSize1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,212,255,${0.4 + Math.max(0, z1) * 0.6})`;
        ctx.fill();

        // Glow for strand 1
        if (z1 > 0.3) {
          ctx.beginPath();
          ctx.arc(x1, y, nodeSize1 + 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,212,255,${z1 * 0.15})`;
          ctx.fill();
        }

        // Strand 2 node (purple)
        const nodeSize2 = 3 + Math.max(0, z2) * 3;
        ctx.beginPath();
        ctx.arc(x2, y, nodeSize2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124,58,237,${0.4 + Math.max(0, z2) * 0.6})`;
        ctx.fill();

        // Glow for strand 2
        if (z2 > 0.3) {
          ctx.beginPath();
          ctx.arc(x2, y, nodeSize2 + 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(124,58,237,${z2 * 0.15})`;
          ctx.fill();
        }
      }

      // Draw smooth strand curves (connecting nodes along each strand)
      drawStrand(ctx, traits.length, time, centerX, amplitude, verticalSpacing, 0, HELIX_COLORS.strand1);
      drawStrand(ctx, traits.length, time, centerX, amplitude, verticalSpacing, Math.PI, HELIX_COLORS.strand2);

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      trigger.kill();
      window.removeEventListener('resize', resize);
    };
  }, [traits]);

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[400px]">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}

/* Helper: draw a smooth bezier curve through all strand points */
function drawStrand(ctx, count, time, centerX, amplitude, spacing, phaseOffset, color) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.4;

  for (let i = 0; i <= count + 1; i++) {
    const y = spacing * i;
    const phase = time + (i * Math.PI * 2) / count + phaseOffset;
    const x = centerX + Math.sin(phase) * amplitude;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      const prevY = spacing * (i - 1);
      const prevPhase = time + ((i - 1) * Math.PI * 2) / count + phaseOffset;
      const prevX = centerX + Math.sin(prevPhase) * amplitude;
      const cpY = (prevY + y) / 2;
      ctx.quadraticCurveTo(prevX, cpY, x, y);
    }
  }

  ctx.stroke();
  ctx.globalAlpha = 1;
}

/* ================================================================
   WORD-BY-WORD BIO REVEAL
   Each word fades in via intersection observer stagger.
   ================================================================ */

function BioReveal({ text }) {
  const words = useMemo(() => text.split(/\s+/), [text]);
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <p ref={ref} className="text-base sm:text-lg leading-relaxed">
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.3em]"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.35,
            delay: i * 0.04,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          style={{ color: '#94a3b8' }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}

/* ================================================================
   GENOMIC STAT READOUT
   Stats styled as data readouts with monospace font.
   ================================================================ */

function GenomicStat({ stat, index, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className="relative p-4 sm:p-5 rounded-xl overflow-hidden group"
      style={{
        backgroundColor: 'rgba(14,14,22,0.8)',
        border: '1px solid #1e1e2e',
      }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px]"
        style={{
          background: `linear-gradient(180deg, #00D4FF, #7C3AED)`,
        }}
      />

      {/* Scan-line hover effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, transparent 40%, rgba(0,212,255,0.03) 50%, transparent 60%)',
          backgroundSize: '100% 200%',
          animation: 'genomicScan 2s linear infinite',
        }}
      />

      <div className="relative z-10 flex items-baseline gap-3 sm:gap-4">
        {/* Data label */}
        <span className="text-[10px] sm:text-xs font-mono font-medium uppercase tracking-widest"
              style={{ color: '#555', minWidth: '80px' }}>
          {stat.label}
        </span>

        {/* Separator dots */}
        <span className="flex-1 border-b border-dotted opacity-20" style={{ borderColor: '#00D4FF' }} />

        {/* Value */}
        <span className="text-xl sm:text-2xl font-mono font-bold tabular-nums"
              style={{ color: '#00D4FF' }}>
          {inView && typeof CountUp === 'function' ? (
            <CountUp
              end={stat.value}
              duration={2}
              suffix={stat.suffix}
              useEasing
              easingFn={(t, b, c, d) => {
                const x = t / d - 1;
                return c * (x * x * x + 1) + b;
              }}
            />
          ) : (
            <span>{stat.value}{stat.suffix}</span>
          )}
        </span>
      </div>
    </motion.div>
  );
}

/* ================================================================
   IMMERSIVE ABOUT SECTION
   ================================================================ */

export default function ImmersiveAbout() {
  const [headerRef, headerInView] = useInView({
    threshold: 0.15,
    triggerOnce: true,
  });

  const [statsRef, statsInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section
      id="about"
      className="relative overflow-hidden"
      style={{
        backgroundColor: '#0a0a0f',
        paddingTop: 'clamp(4rem, 8vw, 8rem)',
        paddingBottom: 'clamp(4rem, 8vw, 8rem)',
      }}
    >
      {/* Subtle background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,212,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="section-container relative z-10">

        {/* ===== Section badge ===== */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-2 mb-5 text-xs font-mono
                       font-medium uppercase tracking-widest rounded-full border"
            style={{
              color: '#00D4FF',
              backgroundColor: 'rgba(0,212,255,0.06)',
              borderColor: 'rgba(0,212,255,0.15)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF]" />
            // genome.decode()
          </span>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-3"
              style={{ color: '#f1f5f9' }}>
            The{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #00D4FF, #7C3AED)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Observer
            </span>
          </h2>

          <p className="text-sm sm:text-base max-w-md mx-auto font-mono" style={{ color: '#555' }}>
            Decoding the building blocks that define my approach to engineering
          </p>
        </motion.div>

        {/* ===== Two columns: Helix + Bio ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16 sm:mb-20">

          {/* Left: DNA Helix */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[420px] sm:h-[500px] lg:h-[560px]"
          >
            {/* Helix glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,212,255,0.04) 0%, transparent 70%)',
              }}
            />
            <DnaHelix traits={TRAITS} />

            {/* Helix label */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
              <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#333' }}>
                trait.helix &mdash; base pairs
              </span>
            </div>
          </motion.div>

          {/* Right: Bio text (word-by-word reveal) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={headerInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Terminal-style header */}
            <div className="flex items-center gap-2 mb-6">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <span className="w-3 h-3 rounded-full bg-[#28c840]" />
              <span className="ml-2 text-xs font-mono" style={{ color: '#444' }}>
                about.read()
              </span>
            </div>

            {/* Bio — word by word */}
            <div className="mb-6">
              <BioReveal text={personalInfo.bio} />
            </div>

            {/* Bridge paragraph */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={headerInView ? { opacity: 1 } : {}}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="text-base sm:text-lg leading-relaxed"
              style={{ color: '#64748b' }}
            >
              I bridge the gap between{' '}
              <span className="font-semibold" style={{ color: '#00D4FF' }}>
                web development
              </span>
              ,{' '}
              <span className="font-semibold" style={{ color: '#7C3AED' }}>
                software engineering
              </span>
              , and{' '}
              <span className="font-semibold" style={{ color: '#10B981' }}>
                IT systems administration
              </span>
              &mdash;delivering solutions that are built well, deployed right,
              and supported end to end.
            </motion.p>

            {/* Trait tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="flex flex-wrap gap-2 mt-6"
            >
              {TRAITS.map((trait, i) => (
                <span
                  key={trait}
                  className="px-2.5 py-1 text-[10px] font-mono font-medium uppercase tracking-wider rounded-md"
                  style={{
                    color: i % 2 === 0 ? '#00D4FF' : '#7C3AED',
                    backgroundColor: i % 2 === 0
                      ? 'rgba(0,212,255,0.08)'
                      : 'rgba(124,58,237,0.08)',
                    border: `1px solid ${i % 2 === 0
                      ? 'rgba(0,212,255,0.15)'
                      : 'rgba(124,58,237,0.15)'}`,
                  }}
                >
                  {trait}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ===== Genomic Data Readout (Stats) ===== */}
        <div ref={statsRef}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={statsInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs font-mono font-medium uppercase tracking-widest"
                    style={{ color: '#00D4FF' }}>
                Genomic Data Readout
              </span>
              <div className="flex-1 h-[1px]" style={{ backgroundColor: '#1e1e2e' }} />
              <span className="text-[10px] font-mono" style={{ color: '#333' }}>
                {stats.length} metrics
              </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((stat, index) => (
              <GenomicStat
                key={stat.label}
                stat={stat}
                index={index}
                inView={statsInView}
              />
            ))}
          </div>
        </div>

        {/* ===== Bottom DNA strand decoration ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={statsInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex items-center justify-center gap-3 mt-12 sm:mt-16"
        >
          <div className="h-[1px] w-12 sm:w-20" style={{ backgroundColor: '#1e1e2e' }} />

          {/* Stylized DNA icon */}
          <svg viewBox="0 0 24 24" className="w-5 h-5" style={{ color: '#333' }} fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M4 4c0 0 4 3 8 3s8-3 8-3" strokeLinecap="round" />
            <path d="M4 12c0 0 4 3 8 3s8-3 8-3" strokeLinecap="round" />
            <path d="M4 20c0 0 4 3 8 3s8-3 8-3" strokeLinecap="round" />
            <path d="M7 4v16" strokeLinecap="round" opacity={0.4} />
            <path d="M17 4v16" strokeLinecap="round" opacity={0.4} />
          </svg>

          <div className="h-[1px] w-12 sm:w-20" style={{ backgroundColor: '#1e1e2e' }} />
        </motion.div>
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes genomicScan {
          0%   { background-position: 0% 0%; }
          100% { background-position: 0% 200%; }
        }
      `}</style>
    </section>
  );
}
