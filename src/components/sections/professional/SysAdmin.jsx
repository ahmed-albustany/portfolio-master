import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  HiDesktopComputer, HiChevronDown, HiChevronUp,
  HiCheckCircle, HiStatusOnline,
} from 'react-icons/hi';
import { useFirestore } from '@/hooks/useFirestore';
import { getSysAdmin } from '@/firebase/firestore';
import { fallbackSysAdmin } from '@/data/fallbackData';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import EmptyState from '@/components/ui/EmptyState';
import StatusBadge from '@/components/ui/StatusBadge';

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

const DEPT_COLOR = '#00D4FF';

/* ================================================================
   SYSADMIN CARD
   ================================================================ */

function SysAdminCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const tasks = item.tasks || [];
  const tools = item.tools || [];
  const achievements = item.achievements || [];
  const status = (item.status || 'active').toLowerCase();

  return (
    <motion.div
      variants={fadeUp}
      className="rounded-xl overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        border: '1px solid var(--color-border-primary)',
      }}
      whileHover={{ borderColor: `${DEPT_COLOR}30` }}
    >
      {/* Top accent */}
      <div className="h-0.5" style={{ backgroundColor: DEPT_COLOR, opacity: 0.5 }} />

      <div className="p-5 sm:p-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: `${DEPT_COLOR}12`,
                border: `1px solid ${DEPT_COLOR}20`,
              }}
            >
              <HiDesktopComputer className="w-5 h-5" style={{ color: DEPT_COLOR }} />
            </div>
            <div>
              <h3
                className="text-sm sm:text-base font-heading font-bold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {item.systemName || item.title}
              </h3>
              {item.organization && (
                <span className="text-[11px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
                  {item.organization}
                </span>
              )}
            </div>
          </div>
          <StatusBadge status={status === 'active' ? 'online' : 'offline'} label={status.toUpperCase()} />
        </div>

        {/* Role badge */}
        {item.role && (
          <div
            className="inline-block px-2.5 py-1 text-[10px] font-mono font-semibold uppercase
                       tracking-wider rounded-md mb-3"
            style={{
              color: DEPT_COLOR,
              backgroundColor: `${DEPT_COLOR}10`,
              border: `1px solid ${DEPT_COLOR}20`,
            }}
          >
            {item.role}
          </div>
        )}

        {/* Scope metric */}
        {item.scope && (
          <div className="flex items-center gap-2 mb-3">
            <HiStatusOnline className="w-3.5 h-3.5" style={{ color: '#FFB800' }} />
            <span className="text-xs font-mono font-semibold" style={{ color: '#FFB800' }}>
              {item.scope}
            </span>
          </div>
        )}

        {/* Duration */}
        {item.duration && (
          <p className="text-[11px] font-mono mb-4" style={{ color: 'var(--color-text-muted)' }}>
            Duration: {item.duration}
          </p>
        )}

        {/* Tools tags */}
        {tools.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tools.map((tool) => (
              <span
                key={tool}
                className="px-1.5 py-0.5 text-[10px] font-mono rounded"
                style={{
                  color: 'var(--color-text-secondary)',
                  backgroundColor: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border-primary)',
                }}
              >
                {tool}
              </span>
            ))}
          </div>
        )}

        {/* Expand toggle */}
        {(tasks.length > 0 || achievements.length > 0) && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase
                         tracking-wider transition-colors duration-200"
              style={{ color: DEPT_COLOR }}
            >
              {expanded ? 'Hide Details' : 'View Details'}
              {expanded ? <HiChevronUp className="w-3.5 h-3.5" /> : <HiChevronDown className="w-3.5 h-3.5" />}
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 space-y-3">
                    {tasks.length > 0 && (
                      <div>
                        <span className="block text-[9px] font-mono font-semibold uppercase tracking-widest mb-2"
                              style={{ color: 'var(--color-text-muted)' }}>
                          Responsibilities
                        </span>
                        <ul className="space-y-1.5">
                          {tasks.map((task, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs"
                                style={{ color: 'var(--color-text-secondary)' }}>
                              <HiCheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: DEPT_COLOR }} />
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {achievements.length > 0 && (
                      <div>
                        <span className="block text-[9px] font-mono font-semibold uppercase tracking-widest mb-2"
                              style={{ color: 'var(--color-text-muted)' }}>
                          Achievements
                        </span>
                        <ul className="space-y-1.5">
                          {achievements.map((a, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs"
                                style={{ color: '#00FF88' }}>
                              <span>▸</span> {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </motion.div>
  );
}

/* ================================================================
   SYSADMIN SECTION
   ================================================================ */

export default function SysAdmin() {
  const { data: items, loading } = useFirestore(getSysAdmin, fallbackSysAdmin);
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  if (loading) {
    return (
      <section id="sysadmin" className="section-padding" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="section-container">
          <SkeletonLoader variant="department" count={3} />
        </div>
      </section>
    );
  }

  return (
    <section
      id="sysadmin"
      className="section-padding relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <div className="section-container relative z-10">
        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-10 sm:mb-12">
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 text-[10px] font-mono
                         font-semibold uppercase tracking-widest rounded-md border"
              style={{
                color: DEPT_COLOR,
                borderColor: `${DEPT_COLOR}30`,
                backgroundColor: `${DEPT_COLOR}08`,
              }}
            >
              <HiDesktopComputer className="w-3 h-3" />
              Platform & Infrastructure Control
            </span>
            <h2 className="heading-secondary mb-3" style={{ color: 'var(--color-text-primary)' }}>
              Systems <span style={{ color: DEPT_COLOR }}>Administration</span>
            </h2>
          </motion.div>

          {/* Cards */}
          {(!items || items.length === 0) ? (
            <EmptyState
              icon={HiDesktopComputer}
              title="No Systems Data"
              description="No systems administration data yet — add from admin panel."
              color={DEPT_COLOR}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {items.map((item) => (
                <SysAdminCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
