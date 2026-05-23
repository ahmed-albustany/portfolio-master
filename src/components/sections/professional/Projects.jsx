import { useState, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaGithub } from 'react-icons/fa';
import {
  HiExternalLink, HiX, HiOutlineFolder, HiStatusOnline,
  HiChevronLeft, HiChevronRight,
} from 'react-icons/hi';
import { useFirestore } from '@/hooks/useFirestore';
import { getProjects } from '@/firebase/firestore';
import { fallbackProjects } from '@/data/fallbackData';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import EmptyState from '@/components/ui/EmptyState';

/* ================================================================
   FILTER TABS
   ================================================================ */

const FILTERS = [
  { key: 'all', label: 'ALL MISSIONS' },
  { key: 'web', label: 'WEB' },
  { key: 'system', label: 'SYSTEM' },
  { key: 'ai', label: 'AI' },
  { key: 'algorithm', label: 'ALGORITHM' },
  { key: 'mobile', label: 'MOBILE' },
  { key: 'database', label: 'DATABASE' },
];

/* ================================================================
   STATUS CONFIG
   ================================================================ */

const statusColors = {
  deployed: { color: '#00FF88', label: 'DEPLOYED' },
  active: { color: '#00FF88', label: 'ACTIVE' },
  live: { color: '#00FF88', label: 'LIVE' },
  development: { color: '#FFB800', label: 'IN DEV' },
  archived: { color: '#64748B', label: 'ARCHIVED' },
  classified: { color: '#0066FF', label: 'CLASSIFIED' },
};

function getStatus(project) {
  const key = (project.status || 'deployed').toLowerCase();
  return statusColors[key] || statusColors.deployed;
}

/* ================================================================
   ANIMATION VARIANTS
   ================================================================ */

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 25, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.25 } },
};

/* ================================================================
   3D TILT WRAPPER
   ================================================================ */

function TiltCard({ children, className }) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const cfg = { stiffness: 250, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), cfg);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), cfg);

  const handleMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }, [mx, my]);

  const handleLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800, transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ================================================================
   PROJECT CARD
   ================================================================ */

function ProjectCard({ project, index, onOpenModal }) {
  const status = getStatus(project);
  const missionNum = project.missionNumber || index + 1;
  const techStack = project.techStack || project.tags || [];

  return (
    <motion.article variants={cardVariant} layout className="group">
      <TiltCard className="h-full">
        <div
          className="h-full rounded-xl overflow-hidden flex flex-col transition-all duration-300
                     cursor-pointer"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-border-primary)',
          }}
          onClick={() => onOpenModal(project)}
          onKeyDown={(e) => e.key === 'Enter' && onOpenModal(project)}
          role="button"
          tabIndex={0}
        >
          {/* ── Header row ── */}
          <div
            className="flex items-center justify-between px-4 py-2.5"
            style={{ borderBottom: '1px solid var(--color-border-primary)' }}
          >
            <span
              className="text-[10px] font-mono font-semibold uppercase tracking-widest"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Mission #{String(missionNum).padStart(3, '0')}
            </span>
            <span
              className="flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-mono font-bold
                         uppercase tracking-wider rounded"
              style={{
                color: status.color,
                backgroundColor: `${status.color}12`,
                border: `1px solid ${status.color}25`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: status.color,
                  boxShadow: `0 0 4px ${status.color}60`,
                  animation: status.color !== '#64748B' ? 'status-blink 2s ease-in-out infinite' : 'none',
                }}
              />
              {status.label}
            </span>
          </div>

          {/* ── Image area ── */}
          <div className="relative h-44 sm:h-48 overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-card) 100%)',
              }}
            />

            {(project.imageURL || project.image) && (
              <img
                src={project.imageURL || project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover
                           group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            )}

            {/* Mission number watermark */}
            <span
              className="absolute bottom-2 right-3 text-4xl font-heading font-bold
                         pointer-events-none select-none"
              style={{ color: 'var(--color-text-primary)', opacity: 0.04 }}
            >
              {String(missionNum).padStart(3, '0')}
            </span>

            {/* Hover overlay */}
            <div
              className="absolute inset-0 flex items-center justify-center
                         opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ backgroundColor: 'rgba(6,11,20,0.8)' }}
            >
              <span
                className="text-xs font-mono font-semibold uppercase tracking-widest"
                style={{ color: '#00D4FF' }}
              >
                View Briefing
              </span>
            </div>
          </div>

          {/* ── Card body ── */}
          <div className="flex-1 flex flex-col p-4 sm:p-5">
            {/* Title */}
            <h3
              className="text-sm sm:text-base font-heading font-bold mb-1"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {project.title}
            </h3>

            {/* Category */}
            {project.category && (
              <span
                className="inline-block text-[10px] font-mono font-semibold uppercase tracking-wider mb-2"
                style={{ color: '#0066FF' }}
              >
                {project.category}
              </span>
            )}

            {/* Description */}
            <p
              className="text-xs leading-relaxed mb-3 flex-1 line-clamp-3"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {project.description}
            </p>

            {/* Tech stack tags */}
            {techStack.length > 0 && (
              <div className="mb-3">
                <span
                  className="block text-[9px] font-mono font-semibold uppercase tracking-widest mb-1.5"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Equipment
                </span>
                <div className="flex flex-wrap gap-1">
                  {techStack.slice(0, 5).map((tech) => (
                    <span
                      key={tech}
                      className="px-1.5 py-0.5 text-[10px] font-mono rounded"
                      style={{
                        color: 'var(--color-text-secondary)',
                        backgroundColor: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border-primary)',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                  {techStack.length > 5 && (
                    <span
                      className="px-1.5 py-0.5 text-[10px] font-mono rounded"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      +{techStack.length - 5}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Impact */}
            {project.impact && (
              <div
                className="text-[10px] font-mono mb-3"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <span style={{ color: '#FFB800' }}>IMPACT:</span> {project.impact}
              </div>
            )}

            {/* Action buttons */}
            <div
              className="flex items-center gap-2 pt-3"
              style={{ borderTop: '1px solid var(--color-border-primary)' }}
            >
              {(project.liveDemo || project.liveUrl) && (
                <a
                  href={project.liveDemo || project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono
                             font-semibold uppercase tracking-wider rounded-md
                             transition-all duration-200 hover:scale-105"
                  style={{
                    color: '#060B14',
                    backgroundColor: '#0066FF',
                  }}
                >
                  <HiExternalLink className="w-3 h-3" />
                  Live Demo
                </a>
              )}
              {(project.github || project.githubUrl) && (
                <a
                  href={project.github || project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono
                             font-semibold uppercase tracking-wider rounded-md border
                             transition-all duration-200 hover:scale-105"
                  style={{
                    color: 'var(--color-text-secondary)',
                    borderColor: 'var(--color-border-primary)',
                  }}
                >
                  <FaGithub className="w-3 h-3" />
                  Source
                </a>
              )}
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.article>
  );
}

/* ================================================================
   PROJECT MODAL
   ================================================================ */

function ProjectModal({ project, onClose }) {
  if (!project) return null;

  const status = getStatus(project);
  const techStack = project.techStack || project.tags || [];
  const missionNum = project.missionNumber || 1;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal content */}
      <motion.div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl scrollbar-hide"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-border-primary)',
          boxShadow: '0 0 40px rgba(0,102,255,0.1)',
        }}
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent */}
        <div
          className="h-0.5"
          style={{ background: 'linear-gradient(90deg, #0066FF, #00D4FF, #00FF88)' }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors duration-200 z-10"
          style={{
            color: 'var(--color-text-muted)',
            backgroundColor: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border-primary)',
          }}
          aria-label="Close modal"
        >
          <HiX className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className="text-[10px] font-mono font-semibold uppercase tracking-widest"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Mission #{String(missionNum).padStart(3, '0')}
            </span>
            <span
              className="flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-mono font-bold
                         uppercase tracking-wider rounded"
              style={{
                color: status.color,
                backgroundColor: `${status.color}12`,
                border: `1px solid ${status.color}25`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: status.color }}
              />
              {status.label}
            </span>
          </div>

          {/* Title */}
          <h2
            className="text-xl sm:text-2xl font-heading font-bold mb-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {project.title}
          </h2>

          {project.category && (
            <span
              className="inline-block text-[10px] font-mono font-semibold uppercase tracking-wider mb-4"
              style={{ color: '#0066FF' }}
            >
              {project.category}
            </span>
          )}

          {/* Image */}
          {(project.imageURL || project.image) && (
            <div className="rounded-lg overflow-hidden mb-6"
                 style={{ border: '1px solid var(--color-border-primary)' }}>
              <img
                src={project.imageURL || project.image}
                alt={project.title}
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          )}

          {/* Full description */}
          <div className="space-y-4 mb-6">
            {project.fullDescription && (
              <div>
                <span
                  className="block text-[10px] font-mono font-semibold uppercase tracking-widest mb-2"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Mission Brief
                </span>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {project.fullDescription}
                </p>
              </div>
            )}

            {!project.fullDescription && project.description && (
              <div>
                <span
                  className="block text-[10px] font-mono font-semibold uppercase tracking-widest mb-2"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Mission Brief
                </span>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {project.description}
                </p>
              </div>
            )}

            {project.problemSolved && (
              <div>
                <span
                  className="block text-[10px] font-mono font-semibold uppercase tracking-widest mb-2"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Problem Solved
                </span>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {project.problemSolved}
                </p>
              </div>
            )}
          </div>

          {/* Tech stack */}
          {techStack.length > 0 && (
            <div className="mb-6">
              <span
                className="block text-[10px] font-mono font-semibold uppercase tracking-widest mb-2"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Full Equipment List
              </span>
              <div className="flex flex-wrap gap-1.5">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-[10px] font-mono font-semibold rounded-md"
                    style={{
                      color: '#00D4FF',
                      backgroundColor: 'rgba(0,212,255,0.08)',
                      border: '1px solid rgba(0,212,255,0.15)',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Impact */}
          {project.impact && (
            <div
              className="p-4 rounded-lg mb-6"
              style={{
                backgroundColor: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border-primary)',
              }}
            >
              <span
                className="block text-[10px] font-mono font-semibold uppercase tracking-widest mb-1"
                style={{ color: '#FFB800' }}
              >
                Impact / Results
              </span>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {project.impact}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            {(project.liveDemo || project.liveUrl) && (
              <a
                href={project.liveDemo || project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-semibold
                           uppercase tracking-wider rounded-lg transition-all duration-200 hover:scale-105"
                style={{
                  color: '#FFFFFF',
                  backgroundColor: '#0066FF',
                  boxShadow: '0 0 15px rgba(0,102,255,0.3)',
                }}
              >
                <HiExternalLink className="w-3.5 h-3.5" />
                Live Demo
              </a>
            )}
            {(project.github || project.githubUrl) && (
              <a
                href={project.github || project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-semibold
                           uppercase tracking-wider rounded-lg border
                           transition-all duration-200 hover:scale-105"
                style={{
                  color: 'var(--color-text-primary)',
                  borderColor: 'var(--color-border-primary)',
                  backgroundColor: 'var(--color-bg-secondary)',
                }}
              >
                <FaGithub className="w-3.5 h-3.5" />
                Source Code
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ================================================================
   PROJECTS SECTION
   ================================================================ */

export default function Projects() {
  const { data: projects, loading } = useFirestore(getProjects, fallbackProjects);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  const [headerRef, headerInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [gridRef, gridInView] = useInView({ threshold: 0.05, triggerOnce: true });

  // Filter projects
  const filtered = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    if (activeFilter === 'all') return projects;
    return projects.filter((p) => {
      const cat = (p.category || '').toLowerCase();
      return cat.includes(activeFilter);
    });
  }, [projects, activeFilter]);

  // Loading
  if (loading) {
    return (
      <section id="projects" className="section-padding" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
        <div className="section-container">
          <div className="text-center mb-10">
            <div className="skeleton h-8 w-48 rounded mx-auto mb-3" />
            <div className="skeleton h-4 w-72 rounded mx-auto" />
          </div>
          <SkeletonLoader variant="card" count={6} />
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        id="projects"
        className="section-padding relative overflow-hidden"
        style={{ backgroundColor: 'var(--color-bg-secondary)' }}
      >
        {/* Background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 50% 30% at 50% 0%, rgba(0,102,255,0.04) 0%, transparent 60%),
              radial-gradient(ellipse 40% 25% at 80% 100%, rgba(0,212,255,0.03) 0%, transparent 50%)
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
              <HiOutlineFolder className="w-3 h-3" style={{ color: '#0066FF' }} />
              Operational Project History
            </motion.span>

            <motion.h2
              variants={fadeUp}
              className="heading-secondary mb-3"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Mission <span className="text-gradient">Log</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-sm sm:text-base max-w-md mx-auto"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Classified project briefings across all operational departments.
            </motion.p>
          </motion.div>

          {/* ── Filter tabs ── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex justify-center mb-8 sm:mb-10"
          >
            <div
              className="inline-flex items-center gap-1 p-1 rounded-xl overflow-x-auto
                         scrollbar-hide max-w-full"
              style={{
                backgroundColor: 'var(--color-bg-card)',
                border: '1px solid var(--color-border-primary)',
              }}
            >
              {FILTERS.map((filter) => {
                const isActive = activeFilter === filter.key;
                return (
                  <button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key)}
                    className="relative px-3 sm:px-4 py-2 text-[10px] sm:text-xs font-mono
                               font-semibold tracking-wider rounded-lg transition-colors
                               duration-200 whitespace-nowrap"
                    style={{
                      color: isActive ? '#FFFFFF' : 'var(--color-text-muted)',
                    }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="projects-tab-bg"
                        className="absolute inset-0 rounded-lg"
                        style={{ backgroundColor: '#0066FF' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{filter.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* ── Cards grid ── */}
          <div ref={gridRef}>
            {filtered.length === 0 ? (
              <EmptyState
                icon={HiOutlineFolder}
                title="No Missions Found"
                description={
                  activeFilter === 'all'
                    ? 'No projects yet — add from admin panel.'
                    : `No missions in "${activeFilter}" category. Try a different filter.`
                }
              />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFilter}
                  variants={container}
                  initial="hidden"
                  animate={gridInView ? 'visible' : 'hidden'}
                  exit="exit"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
                >
                  {filtered.map((project, index) => (
                    <ProjectCard
                      key={project.id || index}
                      project={project}
                      index={index}
                      onOpenModal={setSelectedProject}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Count */}
          {projects && projects.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={gridInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center justify-center gap-2 mt-10"
            >
              <span
                className="text-[10px] font-mono uppercase tracking-widest"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {filtered.length} of {projects.length} missions
              </span>
              <HiStatusOnline className="w-3 h-3" style={{ color: '#00FF88' }} />
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Modal ── */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
