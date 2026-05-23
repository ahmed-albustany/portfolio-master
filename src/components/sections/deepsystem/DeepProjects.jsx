import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useFirestore } from '@/hooks/useFirestore';
import { getProjects } from '@/firebase/firestore';
import { fallbackProjects } from '@/data/fallbackData';

/* ================================================================
   DEEP PROJECTS — Terminal-styled mission log
   ================================================================ */

function MissionEntry({ project, index, isVisible }) {
  const [expanded, setExpanded] = useState(false);
  const techStack = project.techStack || [];
  const status = project.status || 'completed';

  const statusColor = status === 'completed' ? '#00FF41' : status === 'in-progress' ? '#FFB800' : '#00D4FF';

  return (
    <motion.div
      className="py-3 font-mono text-xs"
      style={{ borderBottom: '1px solid rgba(0,255,65,0.05)' }}
      initial={{ opacity: 0, x: -10 }}
      animate={isVisible ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.3 }}
    >
      {/* Main line */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left flex items-start gap-2 group"
      >
        <span style={{ color: '#00FF4130' }}>[{String(index + 1).padStart(3, '0')}]</span>
        <span style={{ color: '#00FF41' }} className="flex-1 group-hover:underline">
          {project.title}
        </span>
        <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded"
          style={{ color: statusColor, backgroundColor: `${statusColor}10` }}>
          {status}
        </span>
        <span style={{ color: '#00FF4120' }}>{expanded ? '[-]' : '[+]'}</span>
      </button>

      {/* Expanded details */}
      {expanded && (
        <motion.div
          className="ml-8 mt-2 space-y-1.5"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.2 }}
        >
          {project.description && (
            <p style={{ color: '#00FF4150' }}>
              <span style={{ color: '#00FF4130' }}>DESC:</span> {project.description}
            </p>
          )}
          {project.category && (
            <p style={{ color: '#00FF4140' }}>
              <span style={{ color: '#00FF4130' }}>TYPE:</span> {project.category.toUpperCase()}
            </p>
          )}
          {project.impact && (
            <p style={{ color: '#00FF88' }}>
              <span style={{ color: '#00FF4130' }}>IMPACT:</span> {project.impact}
            </p>
          )}
          {techStack.length > 0 && (
            <p style={{ color: '#00D4FF80' }}>
              <span style={{ color: '#00FF4130' }}>STACK:</span> {techStack.join(' | ')}
            </p>
          )}
          <div className="flex gap-3 mt-1">
            {project.liveDemo && (
              <a href={project.liveDemo} target="_blank" rel="noopener noreferrer"
                className="hover:underline" style={{ color: '#00FF41' }}>
                [./live_demo]
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                className="hover:underline" style={{ color: '#00D4FF80' }}>
                [./source_code]
              </a>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function DeepProjects() {
  const { data: projects, loading } = useFirestore(getProjects, fallbackProjects);
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  const sortedProjects = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    return [...projects].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [projects]);

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#00FF41] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono" style={{ color: '#00FF4140' }}>Loading mission log...</span>
        </div>
      </section>
    );
  }

  if (!sortedProjects.length) return null;

  return (
    <section className="py-16 sm:py-20 px-4" ref={ref}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: '#00FF4130' }}>
            {'// MISSION LOG'}
          </p>

          <div className="flex items-center gap-2 px-4 py-2.5 rounded-t-lg"
            style={{ backgroundColor: 'rgba(0,255,65,0.05)', borderBottom: '1px solid rgba(0,255,65,0.1)' }}>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF3B3B]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFB800]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#00FF88]" />
            <span className="flex-1 text-center text-[9px] font-mono uppercase tracking-widest" style={{ color: '#00FF4140' }}>
              deep_system@mainframe ~ ls -la ./missions
            </span>
          </div>
        </motion.div>

        {/* Terminal body */}
        <div
          className="p-5 sm:p-6 rounded-b-lg"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0,255,65,0.08)', borderTop: 'none' }}
        >
          <motion.p
            className="text-[11px] font-mono mb-4"
            style={{ color: '#00FF4150' }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
          >
            {'>'} Found {sortedProjects.length} mission records. Listing...
          </motion.p>

          {/* Header row */}
          <div className="flex items-center gap-2 text-[9px] font-mono font-bold uppercase tracking-widest pb-2 mb-2"
            style={{ color: '#00FF4125', borderBottom: '1px solid rgba(0,255,65,0.06)' }}>
            <span className="w-10">IDX</span>
            <span className="flex-1">MISSION</span>
            <span>STATUS</span>
            <span className="w-8" />
          </div>

          {sortedProjects.map((project, i) => (
            <MissionEntry key={project.id} project={project} index={i} isVisible={inView} />
          ))}

          <motion.p
            className="text-[10px] font-mono mt-4"
            style={{ color: '#00FF4125' }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            {'>'} End of mission log.
          </motion.p>
        </div>

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
