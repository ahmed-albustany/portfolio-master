import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useFirestore } from '@/hooks/useFirestore';
import { getSkills } from '@/firebase/firestore';
import { fallbackSkills } from '@/data/fallbackData';

/* ================================================================
   TERMINAL SKILL BAR
   Each skill types in like terminal output:
   LOADING React.............[████████░░] 95%
   ================================================================ */

function TerminalSkillBar({ skill, index, isVisible }) {
  const [progress, setProgress] = useState(0);
  const [typed, setTyped] = useState('');
  const timerRef = useRef(null);

  const label = `LOADING ${skill.name}`;
  const dots = '.'.repeat(Math.max(1, 22 - skill.name.length));
  const fullLabel = `${label}${dots}`;

  useEffect(() => {
    if (!isVisible) return;

    // Type the label
    let i = 0;
    const delay = 200 + index * 120;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < fullLabel.length) {
          setTyped(fullLabel.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          // Then animate progress
          animateProgress();
        }
      }, 15);
      timerRef.current = interval;
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isVisible, fullLabel, index]);

  const animateProgress = () => {
    let p = 0;
    const target = skill.level || 50;
    const interval = setInterval(() => {
      p += 3;
      if (p >= target) {
        p = target;
        clearInterval(interval);
      }
      setProgress(p);
    }, 20);
    timerRef.current = interval;
  };

  const barWidth = 10;
  const filled = Math.round((progress / 100) * barWidth);
  const empty = barWidth - filled;
  const bar = '\u2588'.repeat(filled) + '\u2591'.repeat(empty);

  const barColor = progress >= 80 ? '#00FF41' : progress >= 60 ? '#00FF88' : progress >= 40 ? '#00D4FF' : '#FFB800';

  return (
    <motion.div
      className="font-mono text-xs sm:text-sm py-1"
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : {}}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.3 }}
    >
      <div className="flex items-center gap-1 flex-wrap">
        <span style={{ color: '#00FF4160' }}>{typed}</span>
        {typed.length >= fullLabel.length && (
          <>
            <span style={{ color: '#00FF4130' }}>[</span>
            <span style={{ color: barColor, letterSpacing: '1px' }}>{bar}</span>
            <span style={{ color: '#00FF4130' }}>]</span>
            <span className="font-bold ml-1" style={{ color: barColor }}>{progress}%</span>
          </>
        )}
        {typed.length < fullLabel.length && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.4, repeat: Infinity }}
            style={{ color: '#00FF41' }}
          >
            _
          </motion.span>
        )}
      </div>

      {/* Extra info line */}
      {typed.length >= fullLabel.length && progress >= (skill.level || 50) && (
        <motion.div
          className="flex items-center gap-3 ml-4 mt-0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          {skill.category && (
            <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: '#00FF4130' }}>
              [{skill.category}]
            </span>
          )}
          {skill.yearsUsed && (
            <span className="text-[9px] font-mono" style={{ color: '#00FF4120' }}>
              {skill.yearsUsed}y exp
            </span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

/* ================================================================
   DEEP SKILLS SECTION
   ================================================================ */

export default function DeepSkills() {
  const { data: skills, loading } = useFirestore(getSkills, fallbackSkills);
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  const sortedSkills = useMemo(() => {
    if (!skills || skills.length === 0) return [];
    return [...skills].sort((a, b) => (b.level || 0) - (a.level || 0));
  }, [skills]);

  const categories = useMemo(() => {
    if (!sortedSkills.length) return {};
    return sortedSkills.reduce((acc, s) => {
      const cat = s.category || 'other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(s);
      return acc;
    }, {});
  }, [sortedSkills]);

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-[#00FF41] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono" style={{ color: '#00FF4140' }}>Loading skill modules...</span>
          </div>
        </div>
      </section>
    );
  }

  if (!sortedSkills.length) return null;

  return (
    <section id="skills" className="py-16 sm:py-20 px-4" ref={ref}>
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          {/* Terminal prompt */}
          <p className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: '#00FF4130' }}>
            {'// SKILL MODULES'}
          </p>

          <div className="flex items-center gap-2 px-4 py-2.5 rounded-t-lg"
            style={{ backgroundColor: 'rgba(0,255,65,0.05)', borderBottom: '1px solid rgba(0,255,65,0.1)' }}>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF3B3B]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFB800]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#00FF88]" />
            <span className="flex-1 text-center text-[9px] font-mono uppercase tracking-widest" style={{ color: '#00FF4140' }}>
              deep_system@mainframe ~ skills --scan
            </span>
          </div>
        </motion.div>

        {/* Terminal body */}
        <div
          className="p-5 sm:p-6 rounded-b-lg"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0,255,65,0.08)', borderTop: 'none' }}
        >
          {/* Init line */}
          <motion.p
            className="text-[11px] font-mono mb-4"
            style={{ color: '#00FF4150' }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.3 }}
          >
            {'>'} Scanning {sortedSkills.length} skill modules...
          </motion.p>

          {/* Skills by category */}
          {Object.entries(categories).map(([cat, catSkills], catIdx) => (
            <div key={cat} className="mb-6 last:mb-0">
              <motion.p
                className="text-[9px] font-mono font-bold uppercase tracking-widest mb-2 pl-2"
                style={{ color: '#00FF4130', borderLeft: '2px solid #00FF4120' }}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.2 + catIdx * 0.1, duration: 0.3 }}
              >
                [{cat}]
              </motion.p>

              {catSkills.map((skill, i) => (
                <TerminalSkillBar
                  key={skill.id || skill.name}
                  skill={skill}
                  index={catIdx * 10 + i}
                  isVisible={inView}
                />
              ))}
            </div>
          ))}

          {/* Complete line */}
          <motion.div
            className="mt-6 pt-4"
            style={{ borderTop: '1px solid rgba(0,255,65,0.06)' }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 2, duration: 0.5 }}
          >
            <p className="text-[10px] font-mono" style={{ color: '#00FF4140' }}>
              {'>'} Scan complete. {sortedSkills.length} modules loaded.
            </p>
            <p className="text-[10px] font-mono mt-1" style={{ color: '#00FF4125' }}>
              {'>'} All systems operational. Ready for deployment.
            </p>
          </motion.div>
        </div>

        {/* Bottom data flow */}
        <motion.div
          className="h-px mt-8"
          style={{ background: 'linear-gradient(90deg, transparent, #00FF4120, transparent)' }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ delay: 2.5, duration: 1 }}
        />
      </div>
    </section>
  );
}
