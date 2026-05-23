import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HiExternalLink, HiX } from 'react-icons/hi';
import { certifications } from '@/data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

/* ================================================================
   CATEGORY → STAR COLOUR
   ================================================================ */

const CATEGORY_COLORS = {
  cloud: '#00D4FF',
  dev: '#A855F7',
  security: '#EF4444',
  it: '#10B981',
};

function getStarColor(category) {
  return CATEGORY_COLORS[category] || '#00D4FF';
}

/* ================================================================
   CONSTELLATION LAYOUT
   Positions for stars on the sky canvas (desktop).
   Designed to look like a meaningful constellation when connected.
   ================================================================ */

function useStarPositions(count) {
  return useMemo(() => {
    const positions = [
      { x: 15, y: 20 },
      { x: 42, y: 12 },
      { x: 70, y: 25 },
      { x: 85, y: 15 },
      { x: 28, y: 50 },
      { x: 58, y: 45 },
      { x: 78, y: 55 },
      { x: 18, y: 75 },
      { x: 45, y: 78 },
      { x: 72, y: 80 },
    ];
    return positions.slice(0, count);
  }, [count]);
}

/* ================================================================
   CONSTELLATION LINES
   Pairs of star indices that form connection lines.
   ================================================================ */

function getConstellationLines(count) {
  const lines = [
    [0, 1], [1, 2], [2, 3],
    [0, 4], [1, 5], [2, 5], [3, 6],
    [4, 5], [5, 6],
    [4, 7], [5, 8], [6, 9],
    [7, 8], [8, 9],
  ];
  return lines.filter(([a, b]) => a < count && b < count);
}

/* ================================================================
   CERT DETAIL PANEL
   Appears when a star is clicked.
   ================================================================ */

function CertDetail({ cert, onClose }) {
  const color = getStarColor(cert.category);

  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[150] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        className="relative w-full max-w-sm rounded-2xl border border-white/10 overflow-hidden"
        style={{ backgroundColor: '#111118' }}
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Top glow */}
        <div className="h-1 w-full" style={{ backgroundColor: color }} />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/5 border border-white/10
                     flex items-center justify-center text-white/60 hover:text-white transition-colors"
        >
          <HiX className="w-3.5 h-3.5" />
        </button>

        <div className="p-6 text-center">
          {/* Star icon */}
          <div className="relative w-16 h-16 mx-auto mb-4">
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: `${color}15` }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div
              className="relative w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: `radial-gradient(circle at 40% 40%, ${color}, ${color}44)`,
                boxShadow: `0 0 20px ${color}40`,
              }}
            >
              <span className="text-xl font-bold text-white">
                {cert.name.charAt(0)}
              </span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-white mb-1 font-display">{cert.name}</h3>
          <p className="text-sm font-mono mb-1" style={{ color }}>{cert.issuer}</p>

          {/* Details */}
          <div className="mt-4 space-y-2 text-left">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#64748b] font-mono text-xs">Date</span>
              <span className="text-[#94a3b8] font-mono text-xs">{cert.date}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#64748b] font-mono text-xs">Credential ID</span>
              <span className="text-[#94a3b8] font-mono text-xs">{cert.credentialId}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#64748b] font-mono text-xs">Category</span>
              <span
                className="px-2 py-0.5 text-[10px] font-mono rounded-md uppercase tracking-wider"
                style={{ color, backgroundColor: `${color}15` }}
              >
                {cert.category}
              </span>
            </div>
          </div>

          {/* Verify link */}
          <a
            href={cert.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold
                       rounded-lg transition-all duration-200"
            style={{
              backgroundColor: color,
              color: '#0a0a0f',
            }}
          >
            <HiExternalLink className="w-4 h-4" />
            Verify Credential
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ================================================================
   DESKTOP STAR (on the sky canvas)
   ================================================================ */

function Star({ cert, position, index, onSelect }) {
  const color = getStarColor(cert.category);

  return (
    <motion.button
      className="absolute group cursor-pointer z-10"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: 0.3 + index * 0.12,
        type: 'spring',
        stiffness: 200,
      }}
      onClick={() => onSelect(cert)}
      whileHover={{ scale: 1.3 }}
      whileTap={{ scale: 0.9 }}
    >
      {/* Twinkle animation */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          width: 40,
          height: 40,
          marginLeft: -12,
          marginTop: -12,
          backgroundColor: `${color}10`,
        }}
        animate={{
          scale: [1, 1.8, 1],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{
          duration: 2 + index * 0.3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Star core */}
      <div
        className="relative w-4 h-4 rounded-full"
        style={{
          background: `radial-gradient(circle at 40% 40%, white, ${color})`,
          boxShadow: `0 0 8px ${color}80, 0 0 20px ${color}30`,
        }}
      />

      {/* Star cross spikes */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 2,
          height: 20,
          background: `linear-gradient(transparent, ${color}60, transparent)`,
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 20,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${color}60, transparent)`,
        }}
      />

      {/* Label */}
      <div
        className="absolute top-full mt-3 left-1/2 -translate-x-1/2 whitespace-nowrap
                   text-center opacity-60 group-hover:opacity-100 transition-opacity duration-300"
      >
        <p className="text-[11px] font-mono text-white/80">{cert.name}</p>
        <p className="text-[9px] font-mono" style={{ color: `${color}99` }}>
          {cert.issuer}
        </p>
      </div>
    </motion.button>
  );
}

/* ================================================================
   MOBILE CERT CARD
   ================================================================ */

function MobileCertCard({ cert, index, onSelect }) {
  const color = getStarColor(cert.category);

  return (
    <motion.button
      onClick={() => onSelect(cert)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="relative w-full rounded-xl border border-white/8 p-5 text-center
                 group hover:border-white/15 transition-all duration-300 overflow-hidden"
      style={{ backgroundColor: '#111118' }}
    >
      {/* Top glow */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${color}50, transparent)` }}
      />

      {/* Star icon */}
      <div className="relative w-12 h-12 mx-auto mb-3">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: `${color}10` }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.1, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        <div
          className="relative w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${color}cc, ${color}44)`,
            boxShadow: `0 0 15px ${color}30`,
          }}
        >
          <span className="text-base font-bold text-white">{cert.name.charAt(0)}</span>
        </div>
      </div>

      <h3 className="text-sm font-semibold text-white mb-0.5">{cert.name}</h3>
      <p className="text-xs font-mono" style={{ color: `${color}aa` }}>{cert.issuer}</p>
      <p className="text-[10px] text-[#64748b] mt-1">{cert.date}</p>
    </motion.button>
  );
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

export default function ImmersiveCertifications() {
  const [selectedCert, setSelectedCert] = useState(null);
  const [headerRef, headerInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const sectionRef = useRef(null);
  const linesRef = useRef(null);

  const starPositions = useStarPositions(certifications.length);
  const constellationLines = useMemo(
    () => getConstellationLines(certifications.length),
    []
  );

  /* ── GSAP: Draw constellation lines on scroll ── */
  useEffect(() => {
    const lines = linesRef.current;
    if (!lines) return;

    const paths = lines.querySelectorAll('line');
    if (paths.length === 0) return;

    // Set initial state: fully transparent
    gsap.set(paths, { opacity: 0 });

    const tween = gsap.to(paths, {
      opacity: 0.35,
      duration: 0.3,
      stagger: 0.12,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 50%',
        end: 'center center',
        scrub: 1,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section
      id="certifications"
      ref={sectionRef}
      className="relative py-20 md:py-28 overflow-hidden"
    >
      {/* Animated background stars (pure CSS) */}
      <style>{`
        @keyframes immersive-twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50%      { opacity: 0.8; transform: scale(1.5); }
        }
        .immersive-bg-star {
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          background: white;
          animation: immersive-twinkle var(--dur) ease-in-out infinite;
          animation-delay: var(--delay);
        }
      `}</style>

      {/* Scattered CSS background stars */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="immersive-bg-star"
            style={{
              left: `${(i * 17 + 7) % 100}%`,
              top: `${(i * 23 + 13) % 100}%`,
              '--dur': `${2 + (i % 5) * 0.8}s`,
              '--delay': `${(i % 7) * 0.4}s`,
            }}
          />
        ))}
      </div>

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1 text-[11px] font-mono tracking-widest uppercase
                          text-[#00D4FF] border border-[#00D4FF]/20 rounded-full mb-4
                          bg-[#00D4FF]/5">
            // constellation.render()
          </span>
          <h2 className="heading-secondary text-white mb-3">
            Constellation <span className="text-gradient">Certifications</span>
          </h2>
          <p className="text-[#64748b] font-mono text-sm max-w-md mx-auto">
            Stars in my professional night sky
          </p>
        </motion.div>

        {/* ── DESKTOP: Star sky canvas ── */}
        <div
          className="hidden md:block relative mx-auto rounded-2xl border border-white/[0.04] overflow-hidden"
          style={{
            backgroundColor: '#08080e',
            height: 500,
            maxWidth: 900,
          }}
        >
          {/* Nebula glow */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 40% 50% at 30% 40%, rgba(0,212,255,0.04) 0%, transparent 70%),
                radial-gradient(ellipse 40% 50% at 70% 60%, rgba(168,85,247,0.04) 0%, transparent 70%)
              `,
            }}
          />

          {/* Constellation connection lines (SVG) */}
          <svg
            ref={linesRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {constellationLines.map(([a, b], i) => {
              const pA = starPositions[a];
              const pB = starPositions[b];
              if (!pA || !pB) return null;
              // Blend the two star colors
              const colorA = getStarColor(certifications[a]?.category);
              return (
                <line
                  key={i}
                  x1={pA.x}
                  y1={pA.y}
                  x2={pB.x}
                  y2={pB.y}
                  stroke={colorA}
                  strokeWidth="0.15"
                  opacity="0"
                />
              );
            })}
          </svg>

          {/* Stars */}
          {certifications.map((cert, i) => {
            const pos = starPositions[i];
            if (!pos) return null;
            return (
              <Star
                key={cert.id}
                cert={cert}
                position={pos}
                index={i}
                onSelect={setSelectedCert}
              />
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-5">
            {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
              <div key={cat} className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}50` }}
                />
                <span className="text-[10px] font-mono text-[#64748b] capitalize">{cat}</span>
              </div>
            ))}
          </div>

          {/* Instruction */}
          <p className="absolute bottom-4 right-5 text-[10px] font-mono text-[#475569]">
            Click a star to view details
          </p>
        </div>

        {/* ── MOBILE: Glowing cert cards ── */}
        <div className="md:hidden grid grid-cols-2 gap-3">
          {certifications.map((cert, i) => (
            <MobileCertCard
              key={cert.id}
              cert={cert}
              index={i}
              onSelect={setSelectedCert}
            />
          ))}
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedCert && (
          <CertDetail cert={selectedCert} onClose={() => setSelectedCert(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
