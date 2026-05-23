import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaGithub } from 'react-icons/fa';
import { HiExternalLink } from 'react-icons/hi';
import { projects as staticProjects } from '@/data/portfolioData';
import { getDocuments } from '@/firebase/firestore';

/* ================================================================
   CONSTANTS
   ================================================================ */

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'web-apps', label: 'Web Apps' },
  { key: 'systems', label: 'Systems' },
  { key: 'tools', label: 'Tools' },
];

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

const cardEnter = {
  hidden: { opacity: 0, y: 30, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    transition: { duration: 0.3, ease: 'easeIn' },
  },
};

/* ================================================================
   HOOK: useFirestoreProjects
   Loads from Firestore, falls back to static data.
   ================================================================ */

function useFirestoreProjects() {
  const [projects, setProjects] = useState(staticProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const docs = await getDocuments('projects', 'createdAt');
        if (!cancelled && docs.length > 0) {
          setProjects(docs);
        }
      } catch {
        /* Firestore unavailable — keep static data */
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { projects, loading };
}

/* ================================================================
   3D TILT CARD WRAPPER
   Tracks mouse position over the card and applies rotateX/Y
   via spring-driven motion values.
   ================================================================ */

function TiltCard({ children, className }) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const springCfg = { stiffness: 250, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), springCfg);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), springCfg);

  const handleMouseMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      mx.set((e.clientX - rect.left) / rect.width - 0.5);
      my.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [mx, my],
  );

  const handleMouseLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 800,
        transformStyle: 'preserve-3d',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ================================================================
   PROJECT CARD
   ================================================================ */

function ProjectCard({ project, index }) {
  return (
    <motion.article
      variants={cardEnter}
      layout
      layoutId={project.id}
      className="group"
    >
      <TiltCard className="h-full card-glow overflow-hidden flex flex-col">
        {/* ---- Image / Thumbnail area ---- */}
        <div className="relative h-48 sm:h-52 overflow-hidden">
          {/* Background gradient placeholder */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg,
                var(--color-bg-tertiary) 0%,
                var(--color-bg-secondary) 100%)`,
            }}
          />

          {/* Project image — falls back to gradient if missing */}
          {project.image && (
            <img
              src={project.image}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover opacity-90
                         group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}

          {/* Index number watermark */}
          <span
            className="absolute top-3 left-4 text-5xl font-display font-bold
                       pointer-events-none select-none"
            style={{ color: 'var(--color-accent)', opacity: 0.08 }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>

          {/* Featured badge */}
          {project.featured && (
            <span
              className="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-mono
                         font-semibold uppercase tracking-wider rounded-full"
              style={{
                color: 'var(--color-accent)',
                backgroundColor: 'var(--color-accent-muted)',
                border: '1px solid rgba(0,212,255,0.2)',
              }}
            >
              Featured
            </span>
          )}

          {/* ---- Hover overlay — description + buttons ---- */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4
                       p-5 text-center opacity-0 group-hover:opacity-100
                       translate-y-3 group-hover:translate-y-0
                       transition-all duration-400"
            style={{ backgroundColor: 'rgba(10,10,15,0.85)' }}
          >
            <p className="text-sm leading-relaxed text-light-300 max-w-[90%]">
              {project.longDescription || project.description}
            </p>

            <div className="flex items-center gap-3">
              {project.liveUrl && project.liveUrl !== '#' && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold
                             rounded-lg bg-primary text-dark hover:bg-primary-400
                             transition-colors duration-200"
                >
                  <HiExternalLink className="w-3.5 h-3.5" />
                  Live Demo
                </a>
              )}
              {project.githubUrl && project.githubUrl !== '#' && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold
                             rounded-lg border text-light-200 hover:border-primary
                             hover:text-primary transition-colors duration-200"
                  style={{ borderColor: 'var(--color-border-primary)' }}
                >
                  <FaGithub className="w-3.5 h-3.5" />
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ---- Card body ---- */}
        <div className="flex-1 flex flex-col p-5 sm:p-6">
          <h3
            className="text-base sm:text-lg font-display font-bold mb-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {project.title}
          </h3>

          <p
            className="text-sm leading-relaxed mb-4 flex-1"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {project.description}
          </p>

          {/* Tech stack tags */}
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[11px] font-mono font-medium rounded-md"
                style={{
                  color: 'var(--color-accent)',
                  backgroundColor: 'var(--color-accent-muted)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Bottom action buttons — always visible on mobile */}
          <div className="flex items-center gap-2 mt-4 sm:mt-5 pt-4 sm:pt-5"
               style={{ borderTop: '1px solid var(--color-border-primary)' }}>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-medium
                           transition-colors duration-200 hover:text-primary"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <HiExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            )}

            {project.liveUrl && project.githubUrl && (
              <span style={{ color: 'var(--color-border-primary)' }}>|</span>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-medium
                           transition-colors duration-200 hover:text-primary"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <FaGithub className="w-4 h-4" />
                Source
              </a>
            )}
          </div>
        </div>
      </TiltCard>
    </motion.article>
  );
}

/* ================================================================
   PROJECTS SECTION
   ================================================================ */

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('all');
  const { projects, loading } = useFirestoreProjects();

  const [headerRef, headerInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [gridRef, gridInView] = useInView({
    threshold: 0.05,
    triggerOnce: true,
  });

  const filtered =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  const filterCounts = FILTERS.map((f) => ({
    ...f,
    count:
      f.key === 'all'
        ? projects.length
        : projects.filter((p) => p.category === f.key).length,
  }));

  return (
    <section
      id="projects"
      className="section-padding relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-secondary)' }}
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 50% 0%, var(--color-accent-muted) 0%, transparent 50%),
            radial-gradient(ellipse 40% 30% at 80% 100%, rgba(168,85,247,0.04) 0%, transparent 50%)
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
            Portfolio
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="heading-secondary mb-3 sm:mb-4"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Featured <span className="text-gradient">Work</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-sm sm:text-base max-w-xl mx-auto"
            style={{ color: 'var(--color-text-muted)' }}
          >
            A selection of projects across web development, IT infrastructure,
            and developer tooling.
          </motion.p>
        </motion.div>

        {/* ===== Filter Tabs ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mb-8 sm:mb-10"
        >
          <div
            className="inline-flex items-center gap-1 p-1.5 rounded-2xl flex-wrap justify-center"
            style={{
              backgroundColor: 'var(--color-bg-card)',
              border: '1px solid var(--color-border-primary)',
            }}
          >
            {filterCounts.map((filter) => {
              const isActive = activeFilter === filter.key;
              return (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className="relative flex items-center gap-1.5 px-3.5 sm:px-4 py-2
                             text-sm font-semibold rounded-xl transition-colors duration-200"
                  style={{
                    color: isActive
                      ? 'var(--color-text-inverted)'
                      : 'var(--color-text-muted)',
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="projects-filter-pill"
                      className="absolute inset-0 rounded-xl bg-primary"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{filter.label}</span>
                  <span
                    className="relative z-10 text-[10px] font-mono px-1.5 py-0.5 rounded-md"
                    style={{
                      backgroundColor: isActive
                        ? 'rgba(0,0,0,0.15)'
                        : 'var(--color-bg-secondary)',
                    }}
                  >
                    {filter.count}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ===== Loading state ===== */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* ===== Project Cards Grid ===== */}
        {!loading && (
          <div ref={gridRef}>
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeFilter}
                variants={sectionVariants}
                initial="hidden"
                animate={gridInView ? 'visible' : 'hidden'}
                exit="exit"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
              >
                {filtered.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                  />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Empty state */}
            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p
                  className="text-base"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  No projects in this category yet.
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
