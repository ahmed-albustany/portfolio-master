import { useState, useEffect, useContext, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTerminal } from 'react-icons/fa';
import { HiOutlineMail, HiDownload, HiChevronDown } from 'react-icons/hi';
import { ModeContext } from '@/context/ModeContext';
import { useFirestore } from '@/hooks/useFirestore';
import { getPersonalInfo, getStats } from '@/firebase/firestore';
import { fallbackPersonalInfo, fallbackStats } from '@/data/fallbackData';
import CircuitBackground from '@/components/ui/CircuitBackground';

/* ================================================================
   BOOT SEQUENCE LINES
   ================================================================ */

const bootLines = [
  { text: '> INITIALIZING AHMED ALBUSTANY...', delay: 500 },
  { text: '> LOADING PROFILE................[OK]', delay: 350 },
  { text: '> VERIFYING CLEARANCE............[OK]', delay: 350 },
  { text: '> MOUNTING SYSTEMS...............[OK]', delay: 350 },
  { text: '> STATUS: ALL SYSTEMS ONLINE', delay: 300, isStatus: true },
];

/* ================================================================
   ROLE TITLES
   ================================================================ */

const ROLES = [
  'IT OFFICER',
  'FULL-STACK DEVELOPER',
  'SYSTEMS ADMINISTRATOR',
  'DATABASE ADMINISTRATOR',
  'NETWORK ADMINISTRATOR',
];

/* ================================================================
   DEPARTMENT STATUS INDICATORS
   ================================================================ */

const departments = [
  { label: 'DEV', color: '#0066FF' },
  { label: 'SYSADMIN', color: '#00D4FF' },
  { label: 'NETWORK', color: '#00FF88' },
  { label: 'DB', color: '#FFB800' },
];

/* ================================================================
   TYPEWRITER HOOK — cycles through role titles
   ================================================================ */

function useRoleCycle(roles, intervalMs = 3000) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [roles.length, intervalMs]);

  return roles[index];
}

/* ================================================================
   BOOT SEQUENCE COMPONENT
   ================================================================ */

function BootSequence({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState([]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const completedRef = useRef(false);

  // Cursor blink
  useEffect(() => {
    const blink = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 530);
    return () => clearInterval(blink);
  }, []);

  // Type lines sequentially
  useEffect(() => {
    let totalDelay = 500; // initial dark pause

    bootLines.forEach((line, i) => {
      const lineDelay = totalDelay;
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, line]);
      }, lineDelay);
      totalDelay += line.delay;

      // After last line, wait then call onComplete
      if (i === bootLines.length - 1) {
        setTimeout(() => {
          if (!completedRef.current) {
            completedRef.current = true;
            onComplete();
          }
        }, lineDelay + 600);
      }
    });
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-start justify-start p-6 sm:p-10"
      style={{ backgroundColor: '#060B14' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="font-mono text-xs sm:text-sm space-y-1 max-w-xl">
        {visibleLines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.05 }}
            style={{
              color: line.isStatus ? '#00FF88' : 'var(--color-text-muted, #64748B)',
            }}
          >
            {line.text}
          </motion.div>
        ))}

        {/* Blinking cursor */}
        <span
          className="inline-block w-2 h-4 mt-1"
          style={{
            backgroundColor: '#0066FF',
            opacity: cursorVisible ? 1 : 0,
          }}
        />
      </div>
    </motion.div>
  );
}

/* ================================================================
   STAT NUMBER — animated count-up without external dependency
   ================================================================ */

function StatNumber({ stat }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = null;
          const end = stat.value;
          const duration = 2000;

          const animate = (ts) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, [stat.value]);

  return (
    <div
      ref={ref}
      className="px-4 py-3 rounded-lg text-center"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        border: '1px solid var(--color-border-primary)',
      }}
    >
      <div
        className="text-xl sm:text-2xl md:text-3xl font-heading font-bold mb-1"
        style={{ color: '#0066FF' }}
      >
        {count.toLocaleString()}{stat.suffix || ''}
      </div>
      <div
        className="text-[9px] sm:text-[10px] font-mono font-semibold uppercase tracking-widest"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {stat.label}
      </div>
    </div>
  );
}

/* ================================================================
   HERO SECTION
   ================================================================ */

export default function Hero() {
  const { enterDeepSystem } = useContext(ModeContext);
  const { data: info } = useFirestore(getPersonalInfo, fallbackPersonalInfo);
  const { data: stats } = useFirestore(getStats, fallbackStats);

  const [bootDone, setBootDone] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const currentRole = useRoleCycle(ROLES, 3000);

  const handleBootComplete = useCallback(() => {
    setBootDone(true);
    // Small delay before content fades in
    setTimeout(() => setShowContent(true), 200);
  }, []);

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Use personalInfo from Firestore or fallback
  const displayInfo = info || fallbackPersonalInfo;
  const displayStats = stats || fallbackStats;

  const bio = displayInfo.bio ||
    'Full-spectrum technologist building systems, managing infrastructure, and solving operational problems end to end.';

  // Stat items
  const statItems = useMemo(() => [
    { value: displayStats.systems || displayStats.projects || 0, label: 'SYSTEMS BUILT' },
    { value: displayStats.years || 0, label: 'YEARS ACTIVE' },
    { value: displayStats.users || 0, suffix: '+', label: 'USERS MANAGED' },
    { value: displayStats.certifications || 0, label: 'CERTIFICATIONS' },
  ], [displayStats]);

  /* Stagger animation variants */
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* ── Boot sequence overlay ── */}
      <AnimatePresence>
        {!bootDone && <BootSequence onComplete={handleBootComplete} />}
      </AnimatePresence>

      {/* ── Background layers ── */}
      <CircuitBackground />

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,102,255,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 100%, rgba(0,212,255,0.04) 0%, transparent 50%)
          `,
        }}
        aria-hidden="true"
      />

      {/* ── Main content ── */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            className="section-container relative z-10 py-24 sm:py-28 md:py-32 lg:py-36 w-full"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            <div className="max-w-5xl mx-auto">

              {/* Command Center label */}
              <motion.div variants={item} className="mb-6 sm:mb-8">
                <span
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-mono
                             font-semibold uppercase tracking-widest rounded-md border"
                  style={{
                    color: 'var(--color-text-muted)',
                    borderColor: 'var(--color-border-primary)',
                    backgroundColor: 'var(--color-bg-card)',
                  }}
                >
                  <FaTerminal className="w-2.5 h-2.5" style={{ color: '#0066FF' }} />
                  Command Center v2.0
                </span>
              </motion.div>

              {/* Name — large with scan-line */}
              <motion.h1
                variants={item}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl
                           font-heading font-bold tracking-tight mb-4 sm:mb-5
                           scan-line-effect"
                style={{ color: 'var(--color-text-primary)' }}
              >
                AHMED{' '}
                <span className="text-gradient">ALBUSTANY</span>
              </motion.h1>

              {/* Cycling role in brackets */}
              <motion.div variants={item} className="mb-6 sm:mb-8 h-10 sm:h-12">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentRole}
                    className="inline-block text-lg sm:text-xl md:text-2xl font-mono font-semibold"
                    style={{ color: '#00D4FF' }}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                  >
                    [ {currentRole} ]
                  </motion.span>
                </AnimatePresence>
              </motion.div>

              {/* Department status indicators */}
              <motion.div
                variants={item}
                className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 sm:mb-8"
              >
                {departments.map((dept, i) => (
                  <motion.span
                    key={dept.label}
                    className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono font-semibold
                               uppercase tracking-wider"
                    style={{ color: dept.color }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: dept.color,
                        boxShadow: `0 0 8px ${dept.color}60`,
                        animation: 'status-blink 2s ease-in-out infinite',
                        animationDelay: `${i * 0.3}s`,
                      }}
                    />
                    {dept.label} ONLINE
                  </motion.span>
                ))}
              </motion.div>

              {/* Bio */}
              <motion.p
                variants={item}
                className="text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mb-8 sm:mb-10"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {bio}
              </motion.p>

              {/* Stats row */}
              <motion.div
                variants={item}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10"
              >
                {statItems.map((stat) => (
                  <StatNumber key={stat.label} stat={stat} />
                ))}
              </motion.div>

              {/* Buttons */}
              <motion.div
                variants={item}
                className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 mb-10 sm:mb-12"
              >
                {/* View Operations */}
                <button
                  onClick={() => scrollTo('projects')}
                  className="group flex items-center gap-2 px-6 py-3 text-sm font-mono font-semibold
                             rounded-lg transition-all duration-300 hover:scale-105"
                  style={{
                    color: '#FFFFFF',
                    backgroundColor: '#0066FF',
                    boxShadow: '0 0 20px rgba(0,102,255,0.3)',
                  }}
                >
                  VIEW OPERATIONS
                  <HiChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                </button>

                {/* Download CV */}
                <a
                  href={displayInfo.resumeUrl || '/resume.pdf'}
                  download
                  className="flex items-center gap-2 px-6 py-3 text-sm font-mono font-semibold
                             rounded-lg border transition-all duration-300 hover:scale-105"
                  style={{
                    color: 'var(--color-text-primary)',
                    borderColor: 'var(--color-border-primary)',
                    backgroundColor: 'var(--color-bg-card)',
                  }}
                >
                  <HiDownload className="w-4 h-4" />
                  DOWNLOAD CV
                </a>

                {/* Deep System Mode */}
                <button
                  onClick={enterDeepSystem}
                  className="flex items-center gap-2 px-6 py-3 text-sm font-mono font-semibold
                             rounded-lg border transition-all duration-300 hover:scale-105"
                  style={{
                    color: '#00FF88',
                    borderColor: 'rgba(0,255,136,0.3)',
                    backgroundColor: 'rgba(0,255,136,0.05)',
                    boxShadow: '0 0 15px rgba(0,255,136,0.1)',
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: '#00FF88',
                      boxShadow: '0 0 8px rgba(0,255,136,0.5)',
                      animation: 'status-blink 2s ease-in-out infinite',
                    }}
                  />
                  DEEP SYSTEM MODE
                </button>
              </motion.div>

              {/* Social links — terminal style */}
              <motion.div
                variants={item}
                className="flex flex-wrap items-center gap-3"
              >
                {[
                  {
                    href: displayInfo.socialLinks?.github || '#',
                    icon: FaGithub,
                    label: '~/github',
                    external: true,
                  },
                  {
                    href: displayInfo.socialLinks?.linkedin || '#',
                    icon: FaLinkedin,
                    label: '~/linkedin',
                    external: true,
                  },
                  {
                    href: `mailto:${displayInfo.email || 'ahmed.albustany@outlook.com'}`,
                    icon: HiOutlineMail,
                    label: '~/email',
                    external: false,
                  },
                ].map(({ href, icon: Icon, label, external }) => (
                  <a
                    key={label}
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className="group flex items-center gap-2 px-3 py-2 rounded-lg
                               text-xs font-mono transition-all duration-200 hover:scale-105"
                    style={{
                      color: 'var(--color-text-muted)',
                      backgroundColor: 'var(--color-bg-card)',
                      border: '1px solid var(--color-border-primary)',
                    }}
                  >
                    <Icon className="w-3.5 h-3.5 group-hover:text-[#0066FF] transition-colors" />
                    <span className="group-hover:text-[#0066FF] transition-colors">{label}</span>
                  </a>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Scroll indicator ── */}
      <AnimatePresence>
        {showContent && (
          <motion.button
            onClick={() => scrollTo('about')}
            className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10
                       flex flex-col items-center gap-2 group"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            aria-label="Scroll to explore"
          >
            <span
              className="text-[10px] font-mono tracking-widest uppercase
                         group-hover:text-[#0066FF] transition-colors duration-200"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Scroll to Explore
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <HiChevronDown
                className="w-5 h-5"
                style={{ color: 'var(--color-text-muted)' }}
              />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
}
