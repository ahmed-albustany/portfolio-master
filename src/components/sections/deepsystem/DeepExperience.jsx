import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useFirestore } from '@/hooks/useFirestore';
import { getExperience } from '@/firebase/firestore';
import { fallbackExperience } from '@/data/fallbackData';

/* ================================================================
   DIRECTORY ENTRY
   Renders one experience as a Unix directory listing line:
   drwxr-xr-x  IT Officer  Organization  2023-Present
   ================================================================ */

function DirectoryEntry({ exp, index, isVisible }) {
  const [typed, setTyped] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const perms = exp.type === 'Full-time' ? 'drwxr-xr-x' : exp.type === 'Part-time' ? 'drwxr--r--' : 'drwx------';
  const title = (exp.title || 'Unknown Role').padEnd(22);
  const org = (exp.organization || 'Unknown').padEnd(20);
  const duration = exp.duration || 'N/A';
  const line = `${perms}  ${title} ${org} ${duration}`;

  useEffect(() => {
    if (!isVisible) return;
    let i = 0;
    const delay = 300 + index * 150;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < line.length) {
          setTyped(line.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          setTimeout(() => setShowDetails(true), 200);
        }
      }, 12);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [isVisible, line, index]);

  const typeColor = exp.duration?.includes('Present') ? '#00FF41' : '#00FF4180';

  return (
    <motion.div
      className="font-mono text-xs sm:text-sm"
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : {}}
      transition={{ delay: 0.1 + index * 0.1, duration: 0.3 }}
    >
      {/* Main listing line */}
      <div
        className="py-1.5 px-2 rounded cursor-pointer transition-colors hover:bg-[rgba(0,255,65,0.05)]"
        onClick={() => setExpanded(!expanded)}
      >
        <span style={{ color: typeColor }}>
          {typed}
          {typed.length < line.length && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.4, repeat: Infinity }}
              style={{ color: '#00FF41' }}
            >_</motion.span>
          )}
        </span>
      </div>

      {/* Expanded details */}
      {expanded && showDetails && (
        <motion.div
          className="ml-6 sm:ml-10 mb-3 space-y-1"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          {exp.department && (
            <p className="text-[10px] font-mono" style={{ color: '#00D4FF80' }}>
              dept: {exp.department.toUpperCase()}
            </p>
          )}
          {exp.description && (
            <p className="text-[10px] font-mono leading-relaxed" style={{ color: '#00FF4140' }}>
              {exp.description}
            </p>
          )}
          {exp.achievements?.length > 0 && (
            <div className="space-y-0.5 mt-1">
              {exp.achievements.map((a, i) => (
                <p key={i} className="text-[10px] font-mono" style={{ color: '#00FF4150' }}>
                  {' '}+ {a}
                </p>
              ))}
            </div>
          )}
          {exp.technologies?.length > 0 && (
            <p className="text-[10px] font-mono mt-1" style={{ color: '#00FF8840' }}>
              stack: [{exp.technologies.join(', ')}]
            </p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

/* ================================================================
   DEEP EXPERIENCE SECTION
   ================================================================ */

export default function DeepExperience() {
  const { data: experience, loading } = useFirestore(getExperience, fallbackExperience);
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  const sortedExp = useMemo(() => {
    if (!experience) return [];
    const list = Array.isArray(experience) ? experience : [experience];
    return [...list].sort((a, b) => {
      const aPresent = a.duration?.includes('Present') ? 1 : 0;
      const bPresent = b.duration?.includes('Present') ? 1 : 0;
      return bPresent - aPresent;
    });
  }, [experience]);

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-[#00FF41] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono" style={{ color: '#00FF4140' }}>Loading deployment history...</span>
          </div>
        </div>
      </section>
    );
  }

  if (!sortedExp.length) return null;

  return (
    <section id="experience" className="py-16 sm:py-20 px-4" ref={ref}>
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: '#00FF4130' }}>
            {'// DEPLOYMENT HISTORY'}
          </p>

          <div className="flex items-center gap-2 px-4 py-2.5 rounded-t-lg"
            style={{ backgroundColor: 'rgba(0,255,65,0.05)', borderBottom: '1px solid rgba(0,255,65,0.1)' }}>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF3B3B]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFB800]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#00FF88]" />
            <span className="flex-1 text-center text-[9px] font-mono uppercase tracking-widest" style={{ color: '#00FF4140' }}>
              deep_system@mainframe ~ ls -la ./deployments
            </span>
          </div>
        </motion.div>

        {/* Terminal body */}
        <div
          className="p-5 sm:p-6 rounded-b-lg"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0,255,65,0.08)', borderTop: 'none' }}
        >
          {/* Command echo */}
          <motion.p
            className="text-[11px] font-mono mb-2"
            style={{ color: '#00FF4150' }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.3 }}
          >
            {'>'} ls -la ./deployments/
          </motion.p>

          {/* Column header */}
          <motion.p
            className="text-[10px] font-mono mb-1 px-2"
            style={{ color: '#00FF4125' }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.15, duration: 0.3 }}
          >
            {'permissions    role                   organization          duration'}
          </motion.p>

          <motion.div
            className="h-px mb-2"
            style={{ background: 'rgba(0,255,65,0.08)' }}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.4 }}
          />

          {/* Directory entries */}
          {sortedExp.map((exp, i) => (
            <DirectoryEntry
              key={exp.id || i}
              exp={exp}
              index={i}
              isVisible={inView}
            />
          ))}

          {/* Summary */}
          <motion.div
            className="mt-6 pt-4"
            style={{ borderTop: '1px solid rgba(0,255,65,0.06)' }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <p className="text-[10px] font-mono" style={{ color: '#00FF4140' }}>
              {'>'} {sortedExp.length} deployment{sortedExp.length !== 1 ? 's' : ''} found. Click entry to expand.
            </p>
            <p className="text-[10px] font-mono mt-1" style={{ color: '#00FF4125' }}>
              {'>'} All deployments verified. Personnel file intact.
            </p>
          </motion.div>
        </div>

        {/* Bottom data flow */}
        <motion.div
          className="h-px mt-8"
          style={{ background: 'linear-gradient(90deg, transparent, #00FF4120, transparent)' }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ delay: 2, duration: 1 }}
        />
      </div>
    </section>
  );
}
