import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  HiSupport, HiChevronDown, HiChevronUp,
  HiCheckCircle, HiTicket,
} from 'react-icons/hi';
import { useFirestore } from '@/hooks/useFirestore';
import { getHelpdesk } from '@/firebase/firestore';
import { fallbackHelpdesk } from '@/data/fallbackData';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import EmptyState from '@/components/ui/EmptyState';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
};

const DEPT_COLOR = '#FF6B35';

/* ================================================================
   HELPDESK CARD
   ================================================================ */

function HelpdeskCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const hardwareSupported = item.hardwareSupported || [];
  const softwareSupported = item.softwareSupported || [];
  const osSupported = item.osSupported || [];
  const achievements = item.achievements || [];
  const tools = item.tools || [];

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
      <div className="h-0.5" style={{ backgroundColor: DEPT_COLOR, opacity: 0.5 }} />

      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${DEPT_COLOR}12`, border: `1px solid ${DEPT_COLOR}20` }}
            >
              <HiSupport className="w-5 h-5" style={{ color: DEPT_COLOR }} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-heading font-bold"
                  style={{ color: 'var(--color-text-primary)' }}>
                {item.organization || item.title || 'IT Support'}
              </h3>
              {item.duration && (
                <span className="text-[11px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
                  {item.duration}
                </span>
              )}
            </div>
          </div>
          <span className="flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded"
                style={{ color: '#00FF88', backgroundColor: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)' }}>
            <span className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: '#00FF88', boxShadow: '0 0 4px rgba(0,255,136,0.6)', animation: 'status-blink 2s ease-in-out infinite' }} />
            Active
          </span>
        </div>

        {/* Ticket resolution — big metric */}
        {item.avgTicketsResolved && (
          <div
            className="px-4 py-3 rounded-lg mb-4 flex items-center gap-3"
            style={{ backgroundColor: `${DEPT_COLOR}08`, border: `1px solid ${DEPT_COLOR}15` }}
          >
            <HiTicket className="w-6 h-6" style={{ color: DEPT_COLOR }} />
            <div>
              <span className="block text-xl sm:text-2xl font-heading font-bold" style={{ color: DEPT_COLOR }}>
                {item.avgTicketsResolved}
              </span>
              <span className="text-[9px] font-mono font-semibold uppercase tracking-widest"
                    style={{ color: 'var(--color-text-muted)' }}>
                Tickets Resolved
              </span>
            </div>
          </div>
        )}

        {/* Support scope */}
        {item.supportScope && (
          <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            {item.supportScope}
          </p>
        )}

        {/* Hardware / Software / OS tags */}
        {(hardwareSupported.length > 0 || softwareSupported.length > 0 || osSupported.length > 0) && (
          <div className="space-y-3 mb-4">
            {hardwareSupported.length > 0 && (
              <div>
                <span className="block text-[9px] font-mono font-semibold uppercase tracking-widest mb-1.5"
                      style={{ color: 'var(--color-text-muted)' }}>Hardware</span>
                <div className="flex flex-wrap gap-1.5">
                  {hardwareSupported.map((h) => (
                    <span key={h} className="px-1.5 py-0.5 text-[10px] font-mono rounded"
                          style={{ color: DEPT_COLOR, backgroundColor: `${DEPT_COLOR}10`, border: `1px solid ${DEPT_COLOR}18` }}>
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {softwareSupported.length > 0 && (
              <div>
                <span className="block text-[9px] font-mono font-semibold uppercase tracking-widest mb-1.5"
                      style={{ color: 'var(--color-text-muted)' }}>Software</span>
                <div className="flex flex-wrap gap-1.5">
                  {softwareSupported.map((s) => (
                    <span key={s} className="px-1.5 py-0.5 text-[10px] font-mono rounded"
                          style={{ color: '#0066FF', backgroundColor: 'rgba(0,102,255,0.08)', border: '1px solid rgba(0,102,255,0.15)' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {osSupported.length > 0 && (
              <div>
                <span className="block text-[9px] font-mono font-semibold uppercase tracking-widest mb-1.5"
                      style={{ color: 'var(--color-text-muted)' }}>Operating Systems</span>
                <div className="flex flex-wrap gap-1.5">
                  {osSupported.map((o) => (
                    <span key={o} className="px-1.5 py-0.5 text-[10px] font-mono rounded"
                          style={{ color: '#00D4FF', backgroundColor: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)' }}>
                      {o}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tools */}
        {tools.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tools.map((tool) => (
              <span key={tool} className="px-1.5 py-0.5 text-[10px] font-mono rounded"
                    style={{ color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-primary)' }}>
                {tool}
              </span>
            ))}
          </div>
        )}

        {/* Expand — achievements */}
        {achievements.length > 0 && (
          <>
            <button onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider"
                    style={{ color: DEPT_COLOR }}>
              {expanded ? 'Hide Achievements' : 'View Achievements'}
              {expanded ? <HiChevronUp className="w-3.5 h-3.5" /> : <HiChevronDown className="w-3.5 h-3.5" />}
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4">
                    <span className="block text-[9px] font-mono font-semibold uppercase tracking-widest mb-2"
                          style={{ color: 'var(--color-text-muted)' }}>Achievements</span>
                    <ul className="space-y-1.5">
                      {achievements.map((a, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs" style={{ color: '#00FF88' }}>
                          <HiCheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#00FF88' }} />
                          {a}
                        </li>
                      ))}
                    </ul>
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
   HELPDESK SECTION
   ================================================================ */

export default function Helpdesk() {
  const { data: items, loading } = useFirestore(getHelpdesk, fallbackHelpdesk);
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  if (loading) {
    return (
      <section id="helpdesk" className="section-padding" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
        <div className="section-container"><SkeletonLoader variant="department" count={3} /></div>
      </section>
    );
  }

  return (
    <section id="helpdesk" className="section-padding relative overflow-hidden"
             style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <div className="section-container relative z-10">
        <motion.div ref={ref} variants={container} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <motion.div variants={fadeUp} className="text-center mb-10 sm:mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 text-[10px] font-mono font-semibold uppercase tracking-widest rounded-md border"
                  style={{ color: DEPT_COLOR, borderColor: `${DEPT_COLOR}30`, backgroundColor: `${DEPT_COLOR}08` }}>
              <HiSupport className="w-3 h-3" />
              Technical Support Operations
            </span>
            <h2 className="heading-secondary mb-3" style={{ color: 'var(--color-text-primary)' }}>
              IT Helpdesk & <span style={{ color: DEPT_COLOR }}>Support</span>
            </h2>
          </motion.div>

          {(!items || items.length === 0) ? (
            <EmptyState icon={HiSupport} title="No Helpdesk Data"
                        description="No helpdesk & support data yet — add from admin panel." color={DEPT_COLOR} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {items.map((item) => <HelpdeskCard key={item.id} item={item} />)}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
