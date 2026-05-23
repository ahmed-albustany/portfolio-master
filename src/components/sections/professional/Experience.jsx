import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  HiCode, HiServer, HiDesktopComputer, HiCheckCircle, HiBriefcase,
} from 'react-icons/hi';
import { useFirestore } from '@/hooks/useFirestore';
import { getExperience } from '@/firebase/firestore';
import { fallbackExperience } from '@/data/fallbackData';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import EmptyState from '@/components/ui/EmptyState';

/* ================================================================
   DEPARTMENT COLORS & ICONS
   ================================================================ */

const DEPT_META = {
  dev:        { icon: HiCode, color: '#0066FF', label: 'Development' },
  development:{ icon: HiCode, color: '#0066FF', label: 'Development' },
  it:         { icon: HiDesktopComputer, color: '#00D4FF', label: 'IT & Systems' },
  admin:      { icon: HiServer, color: '#00FF88', label: 'Admin' },
  sysadmin:   { icon: HiServer, color: '#00D4FF', label: 'SysAdmin' },
  'full-stack':{ icon: HiCode, color: '#A855F7', label: 'Full-Stack' },
  fullstack:  { icon: HiCode, color: '#A855F7', label: 'Full-Stack' },
};

function getDeptMeta(dept) {
  return DEPT_META[(dept || 'dev').toLowerCase()] || DEPT_META.dev;
}

/* ================================================================
   ANIMATION VARIANTS
   ================================================================ */

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
};

/* ================================================================
   SCROLL-DRAW TIMELINE LINE
   ================================================================ */

function ScrollLine({ containerRef }) {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const update = () => {
      if (containerRef?.current) setHeight(containerRef.current.scrollHeight);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [containerRef]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  if (height === 0) return null;

  return (
    <div
      className="absolute left-5 lg:left-1/2 lg:-translate-x-1/2 top-0 z-0 pointer-events-none"
      aria-hidden="true"
    >
      <div style={{ width: 2, height, backgroundColor: 'var(--color-border-primary)' }} />
      <motion.div
        style={{
          position: 'absolute', top: 0, left: 0, width: 2, height,
          background: 'linear-gradient(to bottom, #0066FF, #00D4FF)',
          transformOrigin: 'top', scaleY,
        }}
      />
    </div>
  );
}

/* ================================================================
   TIMELINE DOT
   ================================================================ */

function TimelineDot({ department, isVisible, index }) {
  const meta = getDeptMeta(department);
  const Icon = meta.icon;

  return (
    <div className="absolute top-6 z-10 left-5 -translate-x-1/2 lg:left-1/2 lg:-translate-x-1/2">
      {isVisible && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: meta.color }}
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      <motion.div
        className="relative flex items-center justify-center w-10 h-10 rounded-full border-[3px] transition-all duration-300"
        style={{
          borderColor: isVisible ? meta.color : 'var(--color-border-primary)',
          backgroundColor: isVisible ? `${meta.color}20` : 'var(--color-bg-primary)',
          boxShadow: isVisible ? `0 0 16px ${meta.color}40` : 'none',
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 + index * 0.08 }}
      >
        <Icon className="w-4 h-4" style={{ color: isVisible ? meta.color : 'var(--color-text-muted)' }} />
      </motion.div>
    </div>
  );
}

/* ================================================================
   TIMELINE CARD
   ================================================================ */

function TimelineCard({ item, index }) {
  const [cardRef, isVisible] = useInView({ threshold: 0.3, triggerOnce: false });
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (isVisible && !hasEntered) setHasEntered(true);
  }, [isVisible, hasEntered]);

  const isLeft = index % 2 === 0;
  const meta = getDeptMeta(item.department || item.type);
  const achievements = item.achievements || [];
  const technologies = item.technologies || item.techStack || [];

  return (
    <div
      ref={cardRef}
      className={`relative mb-12 sm:mb-16 lg:mb-20 pl-14 lg:pl-0 lg:w-[calc(50%-28px)]
        ${isLeft ? 'lg:mr-auto lg:pr-2' : 'lg:ml-auto lg:pl-2'}`}
    >
      <TimelineDot department={item.department || item.type} isVisible={isVisible} index={index} />

      {/* Connector arm (desktop) */}
      <div
        className="hidden lg:block absolute top-[1.85rem] w-6 h-[2px]"
        style={{
          backgroundColor: isVisible ? meta.color : 'var(--color-border-primary)',
          transition: 'background-color 0.3s ease',
          ...(isLeft ? { right: '-28px' } : { left: '-28px' }),
        }}
      />

      {/* Card */}
      <motion.div
        className="rounded-xl overflow-hidden p-5 sm:p-6"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-border-primary)',
        }}
        initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
        animate={hasEntered ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -40 : 40 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${meta.color}, transparent)`,
            opacity: isVisible ? 0.6 : 0.15,
          }}
        />

        {/* Header: duration + department badge */}
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono
                       font-semibold uppercase tracking-wider rounded-md"
            style={{
              color: meta.color,
              backgroundColor: `${meta.color}10`,
              border: `1px solid ${meta.color}20`,
            }}
          >
            {item.duration || item.period}
          </span>

          <div className="flex items-center gap-2">
            {item.type && (
              <span
                className="px-2 py-0.5 text-[9px] font-mono font-semibold uppercase tracking-wider rounded"
                style={{
                  color: 'var(--color-text-muted)',
                  backgroundColor: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border-primary)',
                }}
              >
                {item.type}
              </span>
            )}
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-mono
                         uppercase tracking-wider rounded"
              style={{ color: meta.color, backgroundColor: `${meta.color}08` }}
            >
              <meta.icon className="w-3 h-3" />
              {meta.label}
            </span>
          </div>
        </div>

        {/* Title + organization */}
        <h3
          className="text-sm sm:text-base font-heading font-bold mb-1"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {item.title || item.role}
        </h3>
        <p className="text-xs font-mono font-semibold mb-4" style={{ color: meta.color }}>
          {item.organization || item.company}
        </p>

        {/* Description */}
        {item.description && (
          <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--color-text-secondary)' }}>
            {item.description}
          </p>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <ul className="space-y-1.5 mb-4">
            {achievements.map((point, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-2 text-xs"
                style={{ color: 'var(--color-text-muted)' }}
                initial={{ opacity: 0, x: -8 }}
                animate={hasEntered ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
              >
                <HiCheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: meta.color }} />
                {point}
              </motion.li>
            ))}
          </ul>
        )}

        {/* Tech tags */}
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="px-1.5 py-0.5 text-[10px] font-mono rounded"
                style={{
                  color: 'var(--color-text-secondary)',
                  backgroundColor: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border-primary)',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ================================================================
   EXPERIENCE SECTION
   ================================================================ */

export default function Experience() {
  const { data: items, loading } = useFirestore(getExperience, fallbackExperience);
  const timelineRef = useRef(null);
  const [headerRef, headerInView] = useInView({ threshold: 0.2, triggerOnce: true });

  if (loading) {
    return (
      <section id="experience" className="section-padding" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="section-container"><SkeletonLoader variant="list" count={3} /></div>
      </section>
    );
  }

  return (
    <section
      id="experience"
      className="section-padding relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 50% 35% at 20% 0%, rgba(0,102,255,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 50% 35% at 80% 100%, rgba(0,212,255,0.03) 0%, transparent 60%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div
          ref={headerRef}
          variants={container}
          initial="hidden"
          animate={headerInView ? 'visible' : 'hidden'}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 text-[10px] font-mono
                       font-semibold uppercase tracking-widest rounded-md border"
            style={{
              color: 'var(--color-text-muted)',
              borderColor: 'var(--color-border-primary)',
              backgroundColor: 'var(--color-bg-card)',
            }}
          >
            <HiBriefcase className="w-3 h-3" style={{ color: '#0066FF' }} />
            Operational Service Record
          </motion.span>

          <motion.h2 variants={fadeUp} className="heading-secondary mb-3"
                     style={{ color: 'var(--color-text-primary)' }}>
            Deployment <span className="text-gradient">History</span>
          </motion.h2>

          <motion.p variants={fadeUp} className="text-sm sm:text-base max-w-md mx-auto"
                    style={{ color: 'var(--color-text-muted)' }}>
            Each deployment sharpened a different edge of the operational toolkit.
          </motion.p>
        </motion.div>

        {/* Timeline */}
        {(!items || items.length === 0) ? (
          <EmptyState
            icon={HiBriefcase}
            title="No Deployment Records"
            description="No experience data yet — add from admin panel."
          />
        ) : (
          <div ref={timelineRef} className="relative max-w-4xl mx-auto">
            <ScrollLine containerRef={timelineRef} />
            {items.map((item, index) => (
              <TimelineCard key={item.id || index} item={item} index={index} />
            ))}
          </div>
        )}

        {/* Legend */}
        {items && items.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center justify-center gap-5 sm:gap-8 mt-8 flex-wrap"
          >
            {Object.entries(DEPT_META).slice(0, 4).map(([key, meta]) => {
              const Icon = meta.icon;
              return (
                <div key={key} className="flex items-center gap-2 text-xs font-mono"
                     style={{ color: 'var(--color-text-muted)' }}>
                  <div className="w-6 h-6 rounded-md flex items-center justify-center"
                       style={{ backgroundColor: `${meta.color}12` }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: meta.color }} />
                  </div>
                  {meta.label}
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
