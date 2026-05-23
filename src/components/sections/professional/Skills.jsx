import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useFirestore } from '@/hooks/useFirestore';
import { getSkills } from '@/firebase/firestore';
import { fallbackSkills } from '@/data/fallbackData';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import EmptyState from '@/components/ui/EmptyState';
import { HiChip } from 'react-icons/hi';

/* ================================================================
   TABS
   ================================================================ */

const TABS = [
  { key: 'all', label: 'ALL' },
  { key: 'development', label: 'DEVELOPMENT' },
  { key: 'infrastructure', label: 'INFRASTRUCTURE' },
  { key: 'engineering', label: 'ENGINEERING' },
];

/* ================================================================
   HELPERS
   ================================================================ */

function getBarColor(level) {
  if (level >= 90) return '#00D4FF';   // cyan
  if (level >= 70) return '#0066FF';   // blue
  if (level >= 50) return '#FFB800';   // amber
  return '#64748B';                     // gray
}

/* ================================================================
   ANIMATION VARIANTS
   ================================================================ */

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

const barVariant = {
  hidden: { scaleX: 0 },
  visible: (level) => ({
    scaleX: level / 100,
    transition: { duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

/* ================================================================
   SKILL CARD
   ================================================================ */

function SkillCard({ skill, barsTriggered }) {
  const level = skill.level || skill.proficiency || 0;
  const barColor = getBarColor(level);

  return (
    <motion.div
      variants={cardVariant}
      layout
      className="group relative overflow-hidden rounded-xl p-4 sm:p-5 transition-all duration-200"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        border: '1px solid var(--color-border-primary)',
      }}
      whileHover={{
        borderColor: `${barColor}40`,
        boxShadow: `0 0 15px ${barColor}10`,
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100
                   transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${barColor}, transparent)` }}
      />

      {/* Icon + Name row */}
      <div className="flex items-center gap-3 mb-3">
        {/* Icon */}
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
                     text-sm font-mono font-bold transition-transform duration-200
                     group-hover:scale-110"
          style={{
            backgroundColor: `${barColor}12`,
            border: `1px solid ${barColor}20`,
            color: barColor,
          }}
        >
          {skill.icon || skill.name?.charAt(0) || '?'}
        </div>

        <div className="flex-1 min-w-0">
          <span
            className="block text-sm font-heading font-semibold truncate"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {skill.name}
          </span>
          {skill.category && (
            <span
              className="text-[10px] font-mono uppercase tracking-wider"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {skill.category}
            </span>
          )}
        </div>

        {/* Status dot */}
        <span className="flex items-center gap-1">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: '#00FF88',
              boxShadow: '0 0 4px rgba(0,255,136,0.4)',
              animation: 'status-blink 2s ease-in-out infinite',
            }}
          />
          <span
            className="text-[9px] font-mono font-semibold uppercase hidden sm:inline"
            style={{ color: '#00FF88' }}
          >
            Active
          </span>
        </span>
      </div>

      {/* Proficiency bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span
            className="text-[10px] font-mono"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Proficiency
          </span>
          <span
            className="text-[10px] font-mono font-semibold"
            style={{ color: barColor }}
          >
            {level}%
          </span>
        </div>
        <div
          className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: 'var(--color-border-primary)' }}
        >
          <motion.div
            className="h-full rounded-full origin-left"
            style={{ backgroundColor: barColor }}
            variants={barVariant}
            initial="hidden"
            animate={barsTriggered ? 'visible' : 'hidden'}
            custom={level}
          />
        </div>
      </div>

      {/* Years used */}
      {skill.yearsUsed != null && (
        <div className="flex items-center justify-between">
          <span
            className="text-[10px] font-mono"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Experience
          </span>
          <span
            className="text-[10px] font-mono font-semibold"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {skill.yearsUsed} {skill.yearsUsed === 1 ? 'year' : 'years'}
          </span>
        </div>
      )}
    </motion.div>
  );
}

/* ================================================================
   SKILLS SECTION
   ================================================================ */

export default function Skills() {
  const { data: skills, loading } = useFirestore(getSkills, fallbackSkills);
  const [activeTab, setActiveTab] = useState('all');

  const [headerRef, headerInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [gridRef, gridInView] = useInView({ threshold: 0.05, triggerOnce: true });

  // Filter skills by active tab
  const filtered = useMemo(() => {
    if (!skills || skills.length === 0) return [];
    if (activeTab === 'all') return skills;
    return skills.filter((s) => {
      const cat = (s.category || '').toLowerCase();
      return cat.includes(activeTab);
    });
  }, [skills, activeTab]);

  const handleTab = useCallback((key) => setActiveTab(key), []);

  // Loading state
  if (loading) {
    return (
      <section id="skills" className="section-padding" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="section-container">
          <div className="text-center mb-10">
            <div className="skeleton h-8 w-48 rounded mx-auto mb-3" />
            <div className="skeleton h-4 w-64 rounded mx-auto" />
          </div>
          <SkeletonLoader variant="card" count={8} />
        </div>
      </section>
    );
  }

  return (
    <section
      id="skills"
      className="section-padding relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* Subtle background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 50% 30% at 0% 50%, rgba(0,102,255,0.04) 0%, transparent 70%),
            radial-gradient(ellipse 50% 30% at 100% 50%, rgba(0,212,255,0.03) 0%, transparent 70%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="section-container relative z-10">
        {/* ── Header ── */}
        <motion.div
          ref={headerRef}
          variants={container}
          initial="hidden"
          animate={headerInView ? 'visible' : 'hidden'}
          className="text-center mb-10 sm:mb-12"
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
            <HiChip className="w-3 h-3" style={{ color: '#0066FF' }} />
            Full Operational Capability
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="heading-secondary mb-3"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Tech <span className="text-gradient">Arsenal</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-sm sm:text-base max-w-md mx-auto"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Technologies and tools across all operational departments.
          </motion.p>
        </motion.div>

        {/* ── Tab switcher ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex justify-center mb-8 sm:mb-10"
        >
          <div
            className="inline-flex items-center gap-1 p-1 rounded-xl overflow-x-auto scrollbar-hide"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border-primary)',
            }}
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTab(tab.key)}
                  className="relative px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-mono font-semibold
                             tracking-wider rounded-lg transition-colors duration-200 whitespace-nowrap"
                  style={{
                    color: isActive ? '#FFFFFF' : 'var(--color-text-muted)',
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="skills-tab-bg"
                      className="absolute inset-0 rounded-lg"
                      style={{ backgroundColor: '#0066FF' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Skills grid ── */}
        <div ref={gridRef}>
          {filtered.length === 0 ? (
            <EmptyState
              icon={HiChip}
              title="No Skills Found"
              description={
                activeTab === 'all'
                  ? 'No skills yet — add from admin panel.'
                  : `No skills in "${activeTab}" category. Try a different filter.`
              }
            />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={container}
                initial="hidden"
                animate={gridInView ? 'visible' : 'hidden'}
                exit="exit"
                className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
              >
                {filtered.map((skill) => (
                  <SkillCard
                    key={skill.id || skill.name}
                    skill={skill}
                    barsTriggered={gridInView}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* ── Bottom count ── */}
        {skills && skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={gridInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex items-center justify-center gap-2 mt-10"
          >
            <span
              className="text-[10px] font-mono uppercase tracking-widest"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Showing {filtered.length} of {skills.length} skills
            </span>
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: '#00FF88',
                boxShadow: '0 0 6px rgba(0,255,136,0.4)',
              }}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}
