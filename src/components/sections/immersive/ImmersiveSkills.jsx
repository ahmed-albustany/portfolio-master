import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { skills } from '@/data/portfolioData';

/* ================================================================
   CONSTANTS
   ================================================================ */

/* Category colour palette
   Blue  = Development
   Purple = Engineering
   Cyan  = IT & Systems                                           */
const CATEGORY_META = {
  Development:    { color: '#00D4FF', bg: 'rgba(0,212,255,0.08)',   border: 'rgba(0,212,255,0.2)',   code: 'DEV' },
  Engineering:    { color: '#A855F7', bg: 'rgba(168,85,247,0.08)',  border: 'rgba(168,85,247,0.2)',  code: 'ENG' },
  'IT & Systems': { color: '#10B981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', code: 'SYS' },
};

/* Two-to-three letter element symbols for each skill */
const SYMBOL_MAP = {
  'React':            'Re',
  'JavaScript':       'Js',
  'HTML / CSS':       'Hc',
  'Tailwind CSS':     'Tw',
  'Firebase':         'Fb',
  'REST APIs':        'Ra',
  'Git':              'Gt',
  'OOP':              'Op',
  'System Design':    'Sd',
  'CI / CD':          'Ci',
  'Architecture':     'Ar',
  'Python':           'Py',
  'Data Structures':  'Ds',
  'Domain Admin':     'Da',
  'Active Directory': 'Ad',
  'Helpdesk':         'Hd',
  'OS Management':    'Os',
  'Networking':       'Nw',
  'Security':         'Se',
};

/* Fake "electron config" details for the card back */
const ELECTRON_DATA = {
  'React':            { shells: '2-8-18-1', period: 'Since 2021',  group: 'UI Library' },
  'JavaScript':       { shells: '2-8-18-2', period: 'Since 2020',  group: 'Language' },
  'HTML / CSS':       { shells: '2-8-18-3', period: 'Since 2019',  group: 'Markup' },
  'Tailwind CSS':     { shells: '2-8-8-2',  period: 'Since 2021',  group: 'CSS Framework' },
  'Firebase':         { shells: '2-8-12-1', period: 'Since 2022',  group: 'BaaS' },
  'REST APIs':        { shells: '2-8-14-2', period: 'Since 2020',  group: 'Protocol' },
  'Git':              { shells: '2-8-10-1', period: 'Since 2020',  group: 'VCS' },
  'OOP':              { shells: '2-8-8-1',  period: 'Since 2020',  group: 'Paradigm' },
  'System Design':    { shells: '2-8-6-1',  period: 'Since 2022',  group: 'Architecture' },
  'CI / CD':          { shells: '2-8-6-2',  period: 'Since 2022',  group: 'Pipeline' },
  'Architecture':     { shells: '2-8-4-1',  period: 'Since 2023',  group: 'Design' },
  'Python':           { shells: '2-8-10-2', period: 'Since 2021',  group: 'Language' },
  'Data Structures':  { shells: '2-8-10-3', period: 'Since 2020',  group: 'Fundamentals' },
  'Domain Admin':     { shells: '2-8-12-2', period: 'Since 2021',  group: 'Identity' },
  'Active Directory': { shells: '2-8-12-3', period: 'Since 2021',  group: 'Directory' },
  'Helpdesk':         { shells: '2-8-18-4', period: 'Since 2020',  group: 'Support' },
  'OS Management':    { shells: '2-8-14-1', period: 'Since 2020',  group: 'Sysadmin' },
  'Networking':       { shells: '2-8-6-3',  period: 'Since 2021',  group: 'Infra' },
  'Security':         { shells: '2-8-4-2',  period: 'Since 2022',  group: 'InfoSec' },
};

/* ================================================================
   BUILD ELEMENT DATA
   Merge skills data with symbols, electron configs, and
   sequential atomic numbers.
   ================================================================ */

function buildElements() {
  const elements = [];
  let atomicNumber = 1;

  Object.entries(skills).forEach(([, lane]) => {
    lane.items.forEach((skill) => {
      elements.push({
        ...skill,
        atomicNumber,
        symbol: SYMBOL_MAP[skill.name] || skill.name.slice(0, 2),
        category: lane.title,
        catMeta: CATEGORY_META[lane.title] || CATEGORY_META.Development,
        electron: ELECTRON_DATA[skill.name] || { shells: '2-8-1', period: '—', group: '—' },
      });
      atomicNumber++;
    });
  });

  return elements;
}

/* ================================================================
   ANIMATION VARIANTS
   ================================================================ */

const gridContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.15 },
  },
};

const elementReveal = {
  hidden: { opacity: 0, scale: 0.4, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 22,
      mass: 0.8,
    },
  },
};

/* ================================================================
   ELEMENT CARD
   Front: atomic number, symbol, skill name, category colour
   Back:  electron configuration, usage period, group
   ================================================================ */

function ElementCard({ el }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { catMeta } = el;

  return (
    <motion.div
      variants={elementReveal}
      className="group cursor-pointer"
      style={{ perspective: 800 }}
      onHoverStart={() => setIsFlipped(true)}
      onHoverEnd={() => setIsFlipped(false)}
      onTap={() => setIsFlipped((p) => !p)}
    >
      <motion.div
        className="relative w-full aspect-square"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* ---- FRONT ---- */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden flex flex-col items-center justify-center p-1.5 sm:p-2"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            backgroundColor: '#0e0e16',
            border: `1px solid ${catMeta.border}`,
          }}
        >
          {/* Top accent */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ backgroundColor: catMeta.color }}
          />

          {/* Atomic number */}
          <span
            className="absolute top-1.5 left-2 text-[9px] sm:text-[10px] font-mono font-bold"
            style={{ color: catMeta.color }}
          >
            {el.atomicNumber}
          </span>

          {/* Category code */}
          <span
            className="absolute top-1.5 right-2 text-[7px] sm:text-[8px] font-mono font-medium uppercase"
            style={{ color: `${catMeta.color}80` }}
          >
            {catMeta.code}
          </span>

          {/* Level bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: '#1a1a2e' }}>
            <div
              className="h-full"
              style={{
                width: `${el.level}%`,
                backgroundColor: catMeta.color,
                opacity: 0.6,
              }}
            />
          </div>

          {/* Symbol */}
          <span
            className="text-xl sm:text-2xl md:text-3xl font-display font-bold leading-none mt-2"
            style={{ color: catMeta.color }}
          >
            {el.symbol}
          </span>

          {/* Name */}
          <span
            className="text-[8px] sm:text-[9px] md:text-[10px] font-mono font-medium text-center leading-tight mt-1 px-1 truncate w-full"
            style={{ color: '#888' }}
          >
            {el.name}
          </span>

          {/* Level percentage */}
          <span
            className="text-[8px] font-mono mt-0.5"
            style={{ color: '#444' }}
          >
            {el.level}%
          </span>
        </div>

        {/* ---- BACK ---- */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden flex flex-col items-center justify-center p-2 sm:p-3"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            backgroundColor: '#0e0e16',
            border: `1px solid ${catMeta.border}`,
          }}
        >
          {/* Top accent */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ backgroundColor: catMeta.color }}
          />

          {/* Electron shell visualization */}
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 mb-1.5">
            {/* Orbit rings */}
            {[0.85, 0.6, 0.35].map((scale, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border"
                style={{
                  borderColor: `${catMeta.color}${i === 0 ? '30' : i === 1 ? '20' : '15'}`,
                  transform: `scale(${scale})`,
                }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 4 + i * 2,
                  repeat: Infinity,
                  ease: 'linear',
                  direction: i % 2 === 0 ? 'normal' : 'reverse',
                }}
              />
            ))}
            {/* Nucleus */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
              style={{
                backgroundColor: catMeta.color,
                boxShadow: `0 0 8px ${catMeta.color}60`,
              }}
            />
          </div>

          {/* Config details */}
          <div className="w-full space-y-0.5 text-center">
            <p className="text-[8px] sm:text-[9px] font-mono" style={{ color: '#555' }}>
              <span style={{ color: catMeta.color }}>{el.electron.shells}</span>
            </p>
            <p className="text-[8px] sm:text-[9px] font-mono font-medium" style={{ color: '#888' }}>
              {el.electron.group}
            </p>
            <p className="text-[7px] sm:text-[8px] font-mono" style={{ color: '#444' }}>
              {el.electron.period}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ================================================================
   LEGEND ITEM
   ================================================================ */

function LegendItem({ label, color }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-3 h-3 rounded-[3px]"
        style={{ backgroundColor: `${color}25`, border: `1px solid ${color}50` }}
      />
      <span className="text-[10px] sm:text-xs font-mono font-medium" style={{ color: '#666' }}>
        {label}
      </span>
    </div>
  );
}

/* ================================================================
   IMMERSIVE SKILLS SECTION
   ================================================================ */

export default function ImmersiveSkills() {
  const elements = useMemo(() => buildElements(), []);

  const [headerRef, headerInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [gridRef, gridInView] = useInView({
    threshold: 0.05,
    triggerOnce: true,
  });

  // Group by category for periodic table rows
  const grouped = useMemo(() => {
    const map = {};
    elements.forEach((el) => {
      if (!map[el.category]) map[el.category] = [];
      map[el.category].push(el);
    });
    return map;
  }, [elements]);

  return (
    <section
      id="skills"
      className="relative overflow-hidden"
      style={{
        backgroundColor: '#0a0a0f',
        paddingTop: 'clamp(4rem, 8vw, 8rem)',
        paddingBottom: 'clamp(4rem, 8vw, 8rem)',
      }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,212,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial accents */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 40% 30% at 20% 20%, rgba(0,212,255,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 80% 80%, rgba(168,85,247,0.03) 0%, transparent 60%)
          `,
        }}
      />

      <div className="section-container relative z-10">

        {/* ===== Header ===== */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-2 mb-5 text-xs font-mono
                       font-medium uppercase tracking-widest rounded-full border"
            style={{
              color: '#00D4FF',
              backgroundColor: 'rgba(0,212,255,0.06)',
              borderColor: 'rgba(0,212,255,0.15)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF]" />
            {elements.length} elements discovered
          </span>

          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-3"
            style={{ color: '#f1f5f9' }}
          >
            Periodic Table of{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #00D4FF, #7C3AED)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Skills
            </span>
          </h2>

          <p className="text-sm sm:text-base max-w-lg mx-auto font-mono" style={{ color: '#555' }}>
            Each element represents a technology in my arsenal.
            Hover to inspect the electron configuration.
          </p>
        </motion.div>

        {/* ===== Legend ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={headerInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center justify-center gap-4 sm:gap-6 mb-8 sm:mb-10 flex-wrap"
        >
          <LegendItem label="Development" color="#00D4FF" />
          <LegendItem label="Engineering" color="#A855F7" />
          <LegendItem label="IT & Systems" color="#10B981" />
        </motion.div>

        {/* ===== Periodic Table Grid ===== */}
        <div ref={gridRef}>
          {/* Desktop: grouped rows like periodic table periods */}
          <div className="hidden md:block space-y-6">
            {Object.entries(grouped).map(([category, categoryElements]) => {
              const meta = CATEGORY_META[category] || CATEGORY_META.Development;
              return (
                <div key={category}>
                  {/* Period label */}
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="text-[10px] font-mono font-bold uppercase tracking-widest"
                      style={{ color: meta.color }}
                    >
                      {meta.code}
                    </span>
                    <span className="text-[10px] font-mono" style={{ color: '#444' }}>
                      {category}
                    </span>
                    <div className="flex-1 h-[1px]" style={{ backgroundColor: `${meta.color}15` }} />
                    <span className="text-[10px] font-mono" style={{ color: '#333' }}>
                      {categoryElements.length} elements
                    </span>
                  </div>

                  {/* Elements row */}
                  <motion.div
                    variants={gridContainer}
                    initial="hidden"
                    animate={gridInView ? 'visible' : 'hidden'}
                    className="grid gap-3"
                    style={{
                      gridTemplateColumns: `repeat(${Math.min(categoryElements.length, 7)}, minmax(0, 1fr))`,
                    }}
                  >
                    {categoryElements.map((el) => (
                      <ElementCard key={el.name} el={el} />
                    ))}
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Mobile: flat grid */}
          <motion.div
            variants={gridContainer}
            initial="hidden"
            animate={gridInView ? 'visible' : 'hidden'}
            className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3 md:hidden"
          >
            {elements.map((el) => (
              <ElementCard key={el.name} el={el} />
            ))}
          </motion.div>
        </div>

        {/* ===== Bottom: element count + table key ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={gridInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-10 sm:mt-14"
        >
          {/* Reading guide */}
          <div
            className="max-w-xs mx-auto p-4 rounded-xl"
            style={{
              backgroundColor: 'rgba(14,14,22,0.8)',
              border: '1px solid #1e1e2e',
            }}
          >
            <p className="text-[10px] font-mono uppercase tracking-widest text-center mb-3" style={{ color: '#555' }}>
              How to read an element
            </p>
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[10px] font-mono">
              <span style={{ color: '#00D4FF' }}>top-left</span>
              <span style={{ color: '#666' }}>Atomic number (index)</span>
              <span style={{ color: '#00D4FF' }}>top-right</span>
              <span style={{ color: '#666' }}>Category code</span>
              <span style={{ color: '#00D4FF' }}>center</span>
              <span style={{ color: '#666' }}>Element symbol</span>
              <span style={{ color: '#00D4FF' }}>bottom bar</span>
              <span style={{ color: '#666' }}>Proficiency level</span>
              <span style={{ color: '#00D4FF' }}>hover</span>
              <span style={{ color: '#666' }}>Electron configuration</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
