import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  HiShieldCheck, HiChevronDown, HiChevronUp,
  HiCheckCircle, HiEye,
} from 'react-icons/hi';
import { useFirestore } from '@/hooks/useFirestore';
import { getSecurity } from '@/firebase/firestore';
import { fallbackSecurity } from '@/data/fallbackData';
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

const DEPT_COLOR = '#FF3B3B';

/* ================================================================
   SECURITY CARD
   ================================================================ */

function SecurityCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const coverageAreas = item.coverageAreas || [];
  const responsibilities = item.responsibilities || [];
  const improvements = item.improvements || [];

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
              {(item.systemType || '').toLowerCase().includes('cctv')
                ? <HiEye className="w-5 h-5" style={{ color: DEPT_COLOR }} />
                : <HiShieldCheck className="w-5 h-5" style={{ color: DEPT_COLOR }} />}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-heading font-bold"
                  style={{ color: 'var(--color-text-primary)' }}>
                {item.title || item.systemType || 'Security System'}
              </h3>
              {item.organization && (
                <span className="text-[11px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
                  {item.organization}
                </span>
              )}
            </div>
          </div>
          {item.systemType && (
            <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded"
                  style={{ color: DEPT_COLOR, backgroundColor: `${DEPT_COLOR}12`, border: `1px solid ${DEPT_COLOR}25` }}>
              {item.systemType}
            </span>
          )}
        </div>

        {/* Scale — cameras/devices */}
        {item.scale && (
          <div
            className="px-3 py-2 rounded-lg mb-4 flex items-center gap-2"
            style={{ backgroundColor: `${DEPT_COLOR}08`, border: `1px solid ${DEPT_COLOR}15` }}
          >
            <HiEye className="w-4 h-4" style={{ color: DEPT_COLOR }} />
            <div>
              <span className="block text-[9px] font-mono font-semibold uppercase tracking-widest"
                    style={{ color: 'var(--color-text-muted)' }}>Scale</span>
              <span className="text-xs font-mono font-bold" style={{ color: DEPT_COLOR }}>
                {item.scale}
              </span>
            </div>
          </div>
        )}

        {/* Duration */}
        {item.duration && (
          <p className="text-[11px] font-mono mb-3" style={{ color: 'var(--color-text-muted)' }}>
            Duration: {item.duration}
          </p>
        )}

        {/* Coverage areas */}
        {coverageAreas.length > 0 && (
          <div className="mb-4">
            <span className="block text-[9px] font-mono font-semibold uppercase tracking-widest mb-1.5"
                  style={{ color: 'var(--color-text-muted)' }}>Coverage Areas</span>
            <div className="flex flex-wrap gap-1.5">
              {coverageAreas.map((area) => (
                <span key={area} className="px-1.5 py-0.5 text-[10px] font-mono rounded"
                      style={{ color: DEPT_COLOR, backgroundColor: `${DEPT_COLOR}10`, border: `1px solid ${DEPT_COLOR}18` }}>
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Software / Hardware tags */}
        {(item.software || item.hardware) && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.software && (
              <span className="px-1.5 py-0.5 text-[10px] font-mono rounded"
                    style={{ color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-primary)' }}>
                SW: {item.software}
              </span>
            )}
            {item.hardware && (
              <span className="px-1.5 py-0.5 text-[10px] font-mono rounded"
                    style={{ color: 'var(--color-text-secondary)', backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-primary)' }}>
                HW: {item.hardware}
              </span>
            )}
          </div>
        )}

        {/* Expand */}
        {(responsibilities.length > 0 || improvements.length > 0) && (
          <>
            <button onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider"
                    style={{ color: DEPT_COLOR }}>
              {expanded ? 'Hide Details' : 'View Details'}
              {expanded ? <HiChevronUp className="w-3.5 h-3.5" /> : <HiChevronDown className="w-3.5 h-3.5" />}
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 space-y-3">
                    {responsibilities.length > 0 && (
                      <div>
                        <span className="block text-[9px] font-mono font-semibold uppercase tracking-widest mb-2"
                              style={{ color: 'var(--color-text-muted)' }}>Responsibilities</span>
                        <ul className="space-y-1.5">
                          {responsibilities.map((r, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs"
                                style={{ color: 'var(--color-text-secondary)' }}>
                              <HiCheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: DEPT_COLOR }} />
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {improvements.length > 0 && (
                      <div>
                        <span className="block text-[9px] font-mono font-semibold uppercase tracking-widest mb-2"
                              style={{ color: 'var(--color-text-muted)' }}>Improvements Made</span>
                        <ul className="space-y-1.5">
                          {improvements.map((a, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs" style={{ color: '#00FF88' }}>
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
   SECURITY SECTION
   ================================================================ */

export default function Security() {
  const { data: items, loading } = useFirestore(getSecurity, fallbackSecurity);
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  if (loading) {
    return (
      <section id="security" className="section-padding" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
        <div className="section-container"><SkeletonLoader variant="department" count={3} /></div>
      </section>
    );
  }

  return (
    <section id="security" className="section-padding relative overflow-hidden"
             style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      <div className="section-container relative z-10">
        <motion.div ref={ref} variants={container} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <motion.div variants={fadeUp} className="text-center mb-10 sm:mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 text-[10px] font-mono font-semibold uppercase tracking-widest rounded-md border"
                  style={{ color: DEPT_COLOR, borderColor: `${DEPT_COLOR}30`, backgroundColor: `${DEPT_COLOR}08` }}>
              <HiShieldCheck className="w-3 h-3" />
              Facility Protection & Access Control
            </span>
            <h2 className="heading-secondary mb-3" style={{ color: 'var(--color-text-primary)' }}>
              Security & <span style={{ color: DEPT_COLOR }}>Surveillance</span>
            </h2>
          </motion.div>

          {(!items || items.length === 0) ? (
            <EmptyState icon={HiShieldCheck} title="No Security Data"
                        description="No security & surveillance data yet — add from admin panel." color={DEPT_COLOR} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {items.map((item) => <SecurityCard key={item.id} item={item} />)}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
