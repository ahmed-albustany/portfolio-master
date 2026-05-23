import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { HiExternalLink, HiX } from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';
import { projects } from '@/data/portfolioData';

/* ================================================================
   CATEGORY → PLANET STYLE
   Each project category gets a unique planet colour + ring style.
   ================================================================ */

const PLANET_STYLES = {
  'web-apps': { bg: 'bg-cyan-500', glow: '#00D4FF', ring: 'border-cyan-400/30' },
  tools: { bg: 'bg-purple-500', glow: '#A855F7', ring: 'border-purple-400/30' },
  systems: { bg: 'bg-emerald-500', glow: '#10B981', ring: 'border-emerald-400/30' },
};

function getPlanetStyle(category) {
  return PLANET_STYLES[category] || PLANET_STYLES['web-apps'];
}

/* ================================================================
   ORBIT RADII + SPEEDS
   Assigns each project a unique orbit radius & rotation speed.
   ================================================================ */

const ORBITS = [
  { radius: 130, duration: 28, startAngle: 0 },
  { radius: 130, duration: 28, startAngle: 180 },
  { radius: 200, duration: 38, startAngle: 60 },
  { radius: 200, duration: 38, startAngle: 240 },
  { radius: 270, duration: 50, startAngle: 120 },
  { radius: 270, duration: 50, startAngle: 300 },
];

/* ================================================================
   PROJECT MODAL
   Full-screen overlay with project details.
   ================================================================ */

function ProjectModal({ project, onClose }) {
  const style = getPlanetStyle(project.category);

  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[150] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Card */}
      <motion.div
        className="relative w-full max-w-lg rounded-2xl border border-white/10 overflow-hidden"
        style={{ backgroundColor: '#111118' }}
        initial={{ scale: 0.8, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 40 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Top glow bar */}
        <div className="h-1 w-full" style={{ backgroundColor: style.glow }} />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10
                     flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10
                     transition-all duration-200"
        >
          <HiX className="w-4 h-4" />
        </button>

        <div className="p-6 pt-5">
          {/* Index badge */}
          <span
            className="inline-block px-2 py-0.5 text-[10px] font-mono rounded-md mb-3 border"
            style={{
              color: style.glow,
              borderColor: `${style.glow}33`,
              backgroundColor: `${style.glow}10`,
            }}
          >
            MISSION-{String(projects.indexOf(project) + 1).padStart(2, '0')}
          </span>

          <h3 className="text-xl font-bold text-white mb-2 font-display">
            {project.title}
          </h3>
          <p className="text-sm text-[#94a3b8] mb-4 leading-relaxed">
            {project.longDescription || project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-[11px] font-mono rounded-md border"
                style={{
                  color: style.glow,
                  borderColor: `${style.glow}25`,
                  backgroundColor: `${style.glow}08`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex items-center gap-4">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200"
              style={{
                backgroundColor: style.glow,
                color: '#0a0a0f',
              }}
            >
              <HiExternalLink className="w-4 h-4" /> Live Demo
            </a>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg
                         border border-white/15 text-white/80 hover:text-white hover:border-white/30
                         transition-all duration-200"
            >
              <FaGithub className="w-4 h-4" /> Source
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ================================================================
   ORBIT PLANET (Desktop)
   A single planet orbiting the central star via CSS animation.
   ================================================================ */

function OrbitPlanet({ project, orbit, index, onSelect }) {
  const style = getPlanetStyle(project.category);

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        animation: `immersive-orbit ${orbit.duration}s linear infinite`,
        animationDelay: `${-(orbit.duration * orbit.startAngle) / 360}s`,
      }}
    >
      {/* Planet positioned at orbit.radius from center */}
      <motion.button
        onClick={() => onSelect(project)}
        className="absolute pointer-events-auto cursor-pointer group"
        style={{
          top: '50%',
          left: '50%',
          marginTop: -24,
          marginLeft: -24,
          transform: `translateX(${orbit.radius}px)`,
        }}
        whileHover={{ scale: 1.25 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Planet body */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center relative"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${style.glow}cc, ${style.glow}55)`,
            boxShadow: `0 0 20px ${style.glow}40, inset 0 -3px 6px ${style.glow}30`,
          }}
        >
          {/* Counter-rotate label so text stays upright */}
          <span
            className="text-[11px] font-bold text-white"
            style={{
              animation: `immersive-counter-orbit ${orbit.duration}s linear infinite`,
              animationDelay: `${-(orbit.duration * orbit.startAngle) / 360}s`,
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Label tooltip */}
        <div
          className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap
                     px-2 py-1 text-[10px] font-mono rounded-md opacity-0 group-hover:opacity-100
                     transition-opacity duration-200 pointer-events-none"
          style={{
            backgroundColor: '#111118',
            border: `1px solid ${style.glow}33`,
            color: style.glow,
            animation: `immersive-counter-orbit ${orbit.duration}s linear infinite`,
            animationDelay: `${-(orbit.duration * orbit.startAngle) / 360}s`,
          }}
        >
          {project.title}
        </div>
      </motion.button>
    </div>
  );
}

/* ================================================================
   MOBILE PROJECT CARD
   Card-based fallback for small screens.
   ================================================================ */

function MobileProjectCard({ project, index, onSelect }) {
  const style = getPlanetStyle(project.category);

  return (
    <motion.button
      onClick={() => onSelect(project)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="relative w-full rounded-xl border border-white/8 p-5 text-left
                 group hover:border-white/15 transition-all duration-300 overflow-hidden"
      style={{ backgroundColor: '#111118' }}
    >
      {/* Glow accent */}
      <div
        className="absolute top-0 left-0 w-full h-0.5"
        style={{ backgroundColor: `${style.glow}60` }}
      />
      <div
        className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-3xl opacity-0
                   group-hover:opacity-100 transition-opacity duration-500"
        style={{ backgroundColor: `${style.glow}15` }}
      />

      <div className="relative z-10 flex items-start gap-4">
        {/* Planet icon */}
        <div
          className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${style.glow}cc, ${style.glow}44)`,
            boxShadow: `0 0 12px ${style.glow}30`,
          }}
        >
          <span className="text-xs font-bold text-white">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white mb-1">{project.title}</h3>
          <p className="text-xs text-[#64748b] mb-2 line-clamp-2">{project.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 text-[10px] font-mono rounded"
                style={{
                  color: `${style.glow}cc`,
                  backgroundColor: `${style.glow}10`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.button>
  );
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

export default function ImmersiveProjects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="projects" className="relative py-20 md:py-28 overflow-hidden">
      {/* Inject keyframes */}
      <style>{`
        @keyframes immersive-orbit {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes immersive-counter-orbit {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
      `}</style>

      <div className="section-container" ref={ref}>
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1 text-[11px] font-mono tracking-widest uppercase
                          text-[#00D4FF] border border-[#00D4FF]/20 rounded-full mb-4
                          bg-[#00D4FF]/5">
            // orbital_system.map()
          </span>
          <h2 className="heading-secondary text-white mb-3">
            Orbital <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-[#64748b] font-mono text-sm max-w-md mx-auto">
            Each mission orbiting the development universe
          </p>
        </motion.div>

        {/* ── DESKTOP: Orbital system ── */}
        <motion.div
          className="hidden md:block relative mx-auto"
          style={{ width: 600, height: 600 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Orbit rings */}
          {[130, 200, 270].map((r) => (
            <div
              key={r}
              className="absolute rounded-full border border-white/[0.04]"
              style={{
                width: r * 2,
                height: r * 2,
                top: '50%',
                left: '50%',
                marginTop: -r,
                marginLeft: -r,
              }}
            />
          ))}

          {/* Central star */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="relative w-20 h-20 rounded-full flex items-center justify-center">
              {/* Pulsing glow */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(0,212,255,0.3) 0%, transparent 70%)',
                }}
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.3, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Core */}
              <div
                className="relative w-14 h-14 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(circle at 35% 35%, #00D4FF, #0a0a0f)',
                  boxShadow: '0 0 30px rgba(0,212,255,0.4), 0 0 60px rgba(0,212,255,0.15)',
                }}
              >
                <span className="text-[9px] font-mono font-bold text-white/90 tracking-wider">
                  WORK
                </span>
              </div>
            </div>
          </div>

          {/* Orbiting planets */}
          {projects.map((project, i) => (
            <OrbitPlanet
              key={project.id}
              project={project}
              orbit={ORBITS[i] || ORBITS[ORBITS.length - 1]}
              index={i}
              onSelect={setSelectedProject}
            />
          ))}

          {/* Legend */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-5">
            {Object.entries(PLANET_STYLES).map(([category, s]) => (
              <div key={category} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: s.glow, boxShadow: `0 0 6px ${s.glow}50` }}
                />
                <span className="text-[10px] font-mono text-[#64748b] capitalize">
                  {category.replace('-', ' ')}
                </span>
              </div>
            ))}
          </div>

          {/* Instruction */}
          <p className="absolute -bottom-9 left-1/2 -translate-x-1/2 text-[10px] font-mono text-[#475569]">
            Click any planet to view mission details
          </p>
        </motion.div>

        {/* ── MOBILE: Card grid ── */}
        <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
          {projects.map((project, i) => (
            <MobileProjectCard
              key={project.id}
              project={project}
              index={i}
              onSelect={setSelectedProject}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
