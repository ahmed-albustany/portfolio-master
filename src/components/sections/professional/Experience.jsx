import { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { HiCode, HiServer, HiDesktopComputer } from 'react-icons/hi';
import { experience } from '@/data/portfolioData';

/* ================================================================
   CONSTANTS
   ================================================================ */

const TYPE_META = {
  dev: { icon: HiCode, accent: '#00D4FF', label: 'Development' },
  eng: { icon: HiServer, accent: '#A855F7', label: 'Engineering' },
  it:  { icon: HiDesktopComputer, accent: '#10B981', label: 'IT & Systems' },
};

/* ================================================================
   ANIMATION VARIANTS
   ================================================================ */

const sectionHeader = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] },
  },
};

/* ================================================================
   TIMELINE LINE
   A vertical line that fills from top to bottom as the user
   scrolls through the timeline, using Framer Motion's
   useScroll + useTransform for a pure-React approach.
   ================================================================ */

function ScrollLine({ containerRef }) {
  const [height, setHeight] = useState(0);

  /* ── Measure container height after mount + on resize ── */
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef?.current) {
        setHeight(containerRef.current.scrollHeight);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [containerRef]);

  /* ── Framer Motion scroll-linked scale ── */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  /* ── Only render after height is measured ── */
  if (height === 0) return null;

  return (
    <div
      className="absolute left-5 lg:left-1/2 lg:-translate-x-1/2 top-0 z-0 pointer-events-none"
      aria-hidden="true"
    >
      {/* Static track */}
      <div
        style={{
          width: 2,
          height,
          backgroundColor: 'var(--color-border-primary)',
        }}
      />
      {/* Animated fill — scales from top */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 2,
          height,
          background: 'linear-gradient(to bottom, var(--color-accent), #A855F7)',
          transformOrigin: 'top',
          scaleY,
        }}
      />
    </div>
  );
}

/* ================================================================
   TIMELINE DOT
   Glows when its card is in the viewport.
   ================================================================ */

function TimelineDot({ type, isVisible, index }) {
  const meta = TYPE_META[type] || TYPE_META.dev;
  const Icon = meta.icon;

  return (
    <div
      className={`absolute top-6 z-10
        left-5 -translate-x-1/2
        lg:left-1/2 lg:-translate-x-1/2`}
    >
      {/* Ping ring */}
      {isVisible && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: meta.accent }}
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* Dot */}
      <motion.div
        className="relative flex items-center justify-center w-10 h-10 rounded-full
                   border-[3px] transition-all duration-300"
        style={{
          borderColor: isVisible ? meta.accent : 'var(--color-border-primary)',
          backgroundColor: isVisible ? `${meta.accent}20` : 'var(--color-bg-primary)',
          boxShadow: isVisible ? `0 0 16px ${meta.accent}40` : 'none',
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
          delay: 0.15 + index * 0.1,
        }}
      >
        <Icon
          className="w-4 h-4 transition-colors duration-300"
          style={{ color: isVisible ? meta.accent : 'var(--color-text-muted)' }}
        />
      </motion.div>
    </div>
  );
}

/* ================================================================
   TIMELINE CARD
   Each card has its own IntersectionObserver so it independently
   triggers its entrance animation and lights up its dot.
   ================================================================ */

function TimelineCard({ item, index }) {
  const [cardRef, isVisible] = useInView({
    threshold: 0.3,
    triggerOnce: false,
  });

  const [hasEntered, setHasEntered] = useState(false);
  useEffect(() => {
    if (isVisible && !hasEntered) setHasEntered(true);
  }, [isVisible, hasEntered]);

  const isLeft = index % 2 === 0;
  const meta = TYPE_META[item.type] || TYPE_META.dev;

  return (
    <div
      ref={cardRef}
      className={`relative mb-12 sm:mb-16 lg:mb-20
        pl-14 lg:pl-0
        lg:w-[calc(50%-28px)]
        ${isLeft ? 'lg:mr-auto lg:pr-2' : 'lg:ml-auto lg:pl-2'}
      `}
    >
      {/* Timeline dot */}
      <TimelineDot type={item.type} isVisible={isVisible} index={index} />

      {/* Connector arm (desktop only) */}
      <div
        className="hidden lg:block absolute top-[1.85rem] w-6 h-[2px]"
        style={{
          backgroundColor: isVisible
            ? meta.accent
            : 'var(--color-border-primary)',
          transition: 'background-color 0.3s ease',
          ...(isLeft
            ? { right: '-28px' }
            : { left: '-28px' }),
        }}
      />

      {/* Card */}
      <motion.div
        className="card-glow relative overflow-hidden p-5 sm:p-6"
        initial={{
          opacity: 0,
          x: isLeft ? -50 : 50,
        }}
        animate={
          hasEntered
            ? { opacity: 1, x: 0 }
            : { opacity: 0, x: isLeft ? -50 : 50 }
        }
        transition={{
          duration: 0.6,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${meta.accent}, transparent)`,
            opacity: isVisible ? 0.8 : 0.2,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* Header row: period + type badge */}
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono
                       font-medium rounded-full border"
            style={{
              color: meta.accent,
              backgroundColor: `${meta.accent}12`,
              borderColor: `${meta.accent}25`,
            }}
          >
            {item.period}
          </span>

          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px]
                       font-mono uppercase tracking-wider rounded-md"
            style={{
              color: meta.accent,
              backgroundColor: `${meta.accent}10`,
            }}
          >
            <meta.icon className="w-3 h-3" />
            {meta.label}
          </span>
        </div>

        {/* Role & company */}
        <h3
          className="text-base sm:text-lg font-display font-bold mb-1"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {item.role}
        </h3>
        <p
          className="text-sm font-medium mb-4"
          style={{ color: meta.accent }}
        >
          {item.company}
        </p>

        {/* Impact bullets */}
        <ul className="space-y-2 mb-4">
          {item.achievements.map((point, i) => (
            <motion.li
              key={i}
              className="flex items-start gap-2.5 text-sm leading-relaxed"
              style={{ color: 'var(--color-text-muted)' }}
              initial={{ opacity: 0, x: -10 }}
              animate={hasEntered ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.4,
                delay: 0.3 + i * 0.1,
                ease: 'easeOut',
              }}
            >
              <svg
                viewBox="0 0 6 6"
                className="w-1.5 h-1.5 mt-[7px] flex-shrink-0"
                aria-hidden="true"
              >
                <circle cx="3" cy="3" r="3" fill={meta.accent} />
              </svg>
              {point}
            </motion.li>
          ))}
        </ul>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5">
          {item.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-[11px] font-mono font-medium rounded-md"
              style={{
                color: 'var(--color-text-secondary)',
                backgroundColor: 'var(--color-bg-secondary)',
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ================================================================
   EXPERIENCE SECTION
   ================================================================ */

export default function Experience() {
  const timelineRef = useRef(null);

  const [headerRef, headerInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  /* Summary stats derived from data */
  const summary = useMemo(() => {
    const years = experience.length;
    const roles = new Set(experience.map((e) => e.type)).size;
    return { years, roles };
  }, []);

  return (
    <section
      id="experience"
      className="section-padding relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(ellipse 50% 35% at 20% 0%, rgba(0,212,255,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 50% 35% at 80% 100%, rgba(168,85,247,0.03) 0%, transparent 60%)
          `,
        }}
      />

      <div className="section-container relative z-10">
        {/* ===== Header ===== */}
        <motion.div
          ref={headerRef}
          variants={sectionHeader}
          initial="hidden"
          animate={headerInView ? 'visible' : 'hidden'}
          className="text-center mb-14 sm:mb-18 lg:mb-20"
        >
          <motion.span
            variants={fadeUp}
            className="inline-block px-3 py-1.5 mb-4 text-xs font-mono font-medium
                       rounded-full border"
            style={{
              color: 'var(--color-accent)',
              backgroundColor: 'var(--color-accent-muted)',
              borderColor: 'rgba(0,212,255,0.15)',
            }}
          >
            {summary.years} roles &middot; {summary.roles} disciplines
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="heading-secondary mb-3 sm:mb-4"
            style={{ color: 'var(--color-text-primary)' }}
          >
            My <span className="text-gradient">Journey</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-sm sm:text-base max-w-xl mx-auto"
            style={{ color: 'var(--color-text-muted)' }}
          >
            From helpdesk tickets to distributed systems &mdash; each role
            sharpened a different edge of my skill set.
          </motion.p>
        </motion.div>

        {/* ===== Timeline ===== */}
        <div ref={timelineRef} className="relative max-w-4xl mx-auto">
          {/* SVG scroll-draw centre line */}
          <ScrollLine containerRef={timelineRef} />

          {/* Cards */}
          {experience.map((item, index) => (
            <TimelineCard key={item.id} item={item} index={index} />
          ))}
        </div>

        {/* ===== Bottom legend ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={headerInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex items-center justify-center gap-5 sm:gap-8 mt-6
                     flex-wrap"
        >
          {Object.entries(TYPE_META).map(([key, meta]) => {
            const Icon = meta.icon;
            return (
              <div
                key={key}
                className="flex items-center gap-2 text-xs sm:text-sm font-medium"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <div
                  className="flex items-center justify-center w-6 h-6 rounded-md"
                  style={{ backgroundColor: `${meta.accent}15` }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: meta.accent }} />
                </div>
                {meta.label}
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
