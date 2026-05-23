import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { skills } from '@/data/portfolioData';

/* ================================================================
   CONSTANTS & HELPERS
   ================================================================ */

const LANES = Object.entries(skills); // [['development', {...}], ...]
const LANE_KEYS = LANES.map(([key]) => key);

/* ================================================================
   ANIMATION VARIANTS
   ================================================================ */

const sectionVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] },
  },
};

/* Grid cards: pop-in with stagger */
const gridContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
  exit: {
    transition: { staggerChildren: 0.03, staggerDirection: -1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
};

/* Progress bar fill */
const barVariants = {
  hidden: { scaleX: 0 },
  visible: (level) => ({
    scaleX: level / 100,
    transition: { duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

/* ================================================================
   TAB BUTTON
   ================================================================ */

function TabButton({ laneKey, lane, isActive, onClick }) {
  const Icon = lane.icon;

  return (
    <button
      onClick={onClick}
      className="relative flex items-center gap-2 px-4 sm:px-5 py-2.5
                 text-sm font-semibold rounded-xl transition-colors duration-200"
      style={{
        color: isActive ? 'var(--color-text-inverted)' : 'var(--color-text-muted)',
        backgroundColor: isActive ? 'transparent' : 'transparent',
      }}
      aria-pressed={isActive}
    >
      {/* Active background pill (shared layout) */}
      {isActive && (
        <motion.div
          layoutId="skills-tab-pill"
          className="absolute inset-0 rounded-xl"
          style={{ backgroundColor: lane.accent }}
          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
        />
      )}

      <span className="relative z-10 flex items-center gap-2">
        <Icon className="w-4 h-4" />
        <span className="hidden xs:inline">{lane.title}</span>
        <span className="xs:hidden">{lane.shortTitle}</span>
      </span>
    </button>
  );
}

/* ================================================================
   SKILL CARD
   ================================================================ */

function SkillCard({ skill, index, barsTriggered, laneAccent }) {
  const Icon = skill.icon;

  return (
    <motion.div
      variants={cardVariants}
      layout
      className="card-glow relative overflow-hidden p-4 sm:p-5 group"
    >
      {/* Hover glow overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100
                   transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${skill.color}12 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10">
        {/* Icon + Name row */}
        <div className="flex items-center gap-3 mb-3 sm:mb-4">
          <div
            className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11
                       rounded-xl transition-transform duration-300
                       group-hover:scale-110"
            style={{ backgroundColor: `${skill.color}15` }}
          >
            <Icon
              className="w-5 h-5 sm:w-[22px] sm:h-[22px]"
              style={{ color: skill.color }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <span
              className="block text-sm sm:text-base font-semibold truncate"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {skill.name}
            </span>
            <span
              className="block text-xs font-mono"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {skill.level}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div
          className="w-full h-1.5 sm:h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: 'var(--color-border-primary)' }}
        >
          <motion.div
            className="h-full rounded-full origin-left"
            style={{
              background: `linear-gradient(90deg, ${skill.color}, ${laneAccent})`,
            }}
            variants={barVariants}
            initial="hidden"
            animate={barsTriggered ? 'visible' : 'hidden'}
            custom={skill.level}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================
   SKILLS SECTION
   ================================================================ */

export default function Skills() {
  const [activeLane, setActiveLane] = useState(LANE_KEYS[0]);

  const [headerRef, headerInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [gridRef, gridInView] = useInView({
    threshold: 0.05,
    triggerOnce: true,
  });

  const handleTabClick = useCallback((key) => {
    setActiveLane(key);
  }, []);

  const activeLaneData = skills[activeLane];
  const totalSkills = LANES.reduce((sum, [, lane]) => sum + lane.items.length, 0);

  return (
    <section
      id="skills"
      className="section-padding relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(ellipse 50% 40% at 0% 50%, ${activeLaneData.accent}08 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 100% 50%, ${activeLaneData.accent}05 0%, transparent 70%)
          `,
        }}
      />

      <div className="section-container relative z-10">
        {/* ===== Header ===== */}
        <motion.div
          ref={headerRef}
          variants={sectionVariants}
          initial="hidden"
          animate={headerInView ? 'visible' : 'hidden'}
          className="text-center mb-10 sm:mb-14"
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
            {totalSkills} technologies &amp; tools
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="heading-secondary mb-3 sm:mb-4"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Tech <span className="text-gradient">Arsenal</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-sm sm:text-base max-w-xl mx-auto"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Three disciplines, one toolkit. Switch lanes to explore
            the technologies I work with.
          </motion.p>
        </motion.div>

        {/* ===== Tab Switcher ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mb-8 sm:mb-10"
        >
          <div
            className="inline-flex items-center gap-1 p-1.5 rounded-2xl"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border-primary)',
            }}
          >
            {LANES.map(([key, lane]) => (
              <TabButton
                key={key}
                laneKey={key}
                lane={lane}
                isActive={activeLane === key}
                onClick={() => handleTabClick(key)}
              />
            ))}
          </div>
        </motion.div>

        {/* ===== Lane description ===== */}
        <AnimatePresence mode="wait">
          <motion.p
            key={activeLane + '-desc'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="text-center text-sm mb-8 sm:mb-10 max-w-md mx-auto"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {activeLaneData.description}
          </motion.p>
        </AnimatePresence>

        {/* ===== Skill Cards Grid ===== */}
        <div ref={gridRef}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLane}
              variants={gridContainerVariants}
              initial="hidden"
              animate={gridInView ? 'visible' : 'hidden'}
              exit="exit"
              className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
            >
              {activeLaneData.items.map((skill, index) => (
                <SkillCard
                  key={skill.name}
                  skill={skill}
                  index={index}
                  barsTriggered={gridInView}
                  laneAccent={activeLaneData.accent}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ===== Bottom stat line ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={gridInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex items-center justify-center gap-6 sm:gap-8 mt-10 sm:mt-14
                     flex-wrap"
        >
          {LANES.map(([key, lane]) => {
            const Icon = lane.icon;
            const isActive = activeLane === key;
            return (
              <button
                key={key}
                onClick={() => handleTabClick(key)}
                className="flex items-center gap-2 text-sm font-medium
                           transition-all duration-200 group"
                style={{
                  color: isActive ? lane.accent : 'var(--color-text-muted)',
                  opacity: isActive ? 1 : 0.6,
                }}
              >
                <Icon className="w-4 h-4" />
                <span>{lane.title}</span>
                <span
                  className="px-1.5 py-0.5 text-xs font-mono rounded-md"
                  style={{
                    backgroundColor: isActive
                      ? `${lane.accent}20`
                      : 'var(--color-bg-secondary)',
                    color: isActive ? lane.accent : 'var(--color-text-muted)',
                  }}
                >
                  {lane.items.length}
                </span>
              </button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
