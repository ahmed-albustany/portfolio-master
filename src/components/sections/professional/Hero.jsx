import { useState, useEffect, useContext, useRef, useCallback, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { ModeContext } from '@/context/ModeContext';
import { personalInfo } from '@/data/portfolioData';

/* ================================================================
   CONSTANTS
   ================================================================ */

const ROLES = [
  'Full-Stack Developer',
  'Software Engineer',
  'IT Systems Administrator',
  'Domain Admin & Helpdesk Expert',
];

const TYPING_SPEED   = 70;
const DELETING_SPEED = 40;
const PAUSE_AFTER    = 2200;
const PAUSE_BEFORE   = 400;

const STAR_COUNT = 80;

/* ================================================================
   CSS-ONLY STAR BACKGROUND
   Pure CSS — zero runtime cost, no canvas, no libs.
   Stars are absolutely-positioned <div>s with randomised
   positions, sizes, opacities and CSS animation delays.
   ================================================================ */

function generateStars(count) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    const size = Math.random() * 2.5 + 0.5;
    stars.push({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: size,
      height: size,
      opacity: Math.random() * 0.6 + 0.15,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 3 + 2}s`,
    });
  }
  return stars;
}

function StarField() {
  const stars = useMemo(() => generateStars(STAR_COUNT), []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: star.left,
            top: star.top,
            width: star.width,
            height: star.height,
            backgroundColor: 'var(--color-accent)',
            opacity: star.opacity,
            animation: `heroStarTwinkle ${star.duration} ease-in-out ${star.delay} infinite alternate`,
          }}
        />
      ))}

      {/* Inline keyframes so the component is self-contained */}
      <style>{`
        @keyframes heroStarTwinkle {
          0%   { opacity: 0.1; transform: scale(1); }
          100% { opacity: 0.8; transform: scale(1.6); }
        }
      `}</style>
    </div>
  );
}

/* ================================================================
   TYPEWRITER HOOK
   Cycles through an array of strings with a typing / deleting
   loop and blinking cursor.
   ================================================================ */

function useTypewriter(strings) {
  const [display, setDisplay] = useState('');
  const [stringIndex, setStringIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState('typing');      // typing | pausing | deleting | waiting

  useEffect(() => {
    const current = strings[stringIndex];
    let timeout;

    switch (phase) {
      case 'typing':
        if (charIndex < current.length) {
          timeout = setTimeout(() => {
            setDisplay(current.slice(0, charIndex + 1));
            setCharIndex((c) => c + 1);
          }, TYPING_SPEED);
        } else {
          setPhase('pausing');
        }
        break;

      case 'pausing':
        timeout = setTimeout(() => setPhase('deleting'), PAUSE_AFTER);
        break;

      case 'deleting':
        if (charIndex > 0) {
          timeout = setTimeout(() => {
            setCharIndex((c) => c - 1);
            setDisplay(current.slice(0, charIndex - 1));
          }, DELETING_SPEED);
        } else {
          setPhase('waiting');
        }
        break;

      case 'waiting':
        timeout = setTimeout(() => {
          setStringIndex((i) => (i + 1) % strings.length);
          setPhase('typing');
        }, PAUSE_BEFORE);
        break;
    }

    return () => clearTimeout(timeout);
  }, [charIndex, phase, stringIndex, strings]);

  return display;
}

/* ================================================================
   MAGNETIC BUTTON
   Buttons whose content follows the cursor within a bounded
   radius. Uses Framer Motion springs for silky response.
   ================================================================ */

function MagneticButton({ children, className, style, as: Tag = 'button', ...props }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 250, damping: 18, mass: 0.5 };
  const sx = useSpring(x, springConfig);
  const sy = useSpring(y, springConfig);

  const handleMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.3);
    y.set((e.clientY - cy) * 0.3);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const MotionTag = motion[Tag] || motion.button;

  return (
    <MotionTag
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ ...style, x: sx, y: sy }}
      className={className}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </MotionTag>
  );
}

/* ================================================================
   FLOATING SOCIAL LINK
   ================================================================ */

function SocialLink({ href, label, children, index }) {
  return (
    <motion.a
      href={href}
      target={href.startsWith('mailto:') ? undefined : '_blank'}
      rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
      aria-label={label}
      className="group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12
                 rounded-xl border transition-all duration-300"
      style={{
        color: 'var(--color-text-muted)',
        borderColor: 'var(--color-border-primary)',
        backgroundColor: 'var(--color-bg-card)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.0 + index * 0.1, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{
        y: -4,
        borderColor: 'var(--color-accent)',
        color: 'var(--color-accent)',
        boxShadow: '0 8px 24px rgba(0,212,255,0.15)',
      }}
      whileTap={{ scale: 0.9 }}
    >
      {children}

      {/* Tooltip */}
      <span
        className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2
                   px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          backgroundColor: 'var(--color-bg-elevated)',
          color: 'var(--color-text-secondary)',
          border: '1px solid var(--color-border-subtle)',
        }}
      >
        {label}
      </span>
    </motion.a>
  );
}

/* ================================================================
   HERO SECTION
   ================================================================ */

/* Stagger container */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

/* Each child fades up from 40px */
const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function Hero() {
  const { enterImmersive, preloadImmersiveLibs } = useContext(ModeContext);
  const typedRole = useTypewriter(ROLES);

  /* Parallax: background grid shifts slightly with mouse */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const gridX = useTransform(mouseX, [-1, 1], [8, -8]);
  const gridY = useTransform(mouseY, [-1, 1], [8, -8]);
  const springGridX = useSpring(gridX, { stiffness: 60, damping: 20 });
  const springGridY = useSpring(gridY, { stiffness: 60, damping: 20 });

  const handleMouseMove = useCallback(
    (e) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set((e.clientX / innerWidth) * 2 - 1);
      mouseY.set((e.clientY / innerHeight) * 2 - 1);
    },
    [mouseX, mouseY],
  );

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  return (
    <section
      id="hero"
      className="relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: '100vh' }}
      onMouseMove={handleMouseMove}
    >
      {/* ---- Layer 1: Gradient background ---- */}
      <div
        className="absolute inset-0 transition-theme"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% -10%, var(--color-accent-muted) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 100%, rgba(168,85,247,0.08) 0%, transparent 50%),
            var(--color-bg-primary)
          `,
        }}
      />

      {/* ---- Layer 2: Subtle grid (parallax) ---- */}
      <motion.div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
        style={{
          x: springGridX,
          y: springGridY,
          backgroundImage: `
            linear-gradient(var(--color-accent) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-accent) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />

      {/* ---- Layer 3: CSS star field (dark mode only) ---- */}
      <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500">
        <StarField />
      </div>

      {/* ---- Layer 4: Floating orbs ---- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <motion.div
          className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)',
            top: '10%',
            left: '-5%',
          }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)',
            bottom: '5%',
            right: '-5%',
          }}
          animate={{ x: [0, -25, 0], y: [0, 20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* ---- Content ---- */}
      <motion.div
        className="section-container relative z-10 py-24 sm:py-28 md:py-32"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-4xl mx-auto text-center">

          {/* Status badge */}
          <motion.div variants={itemVariants}>
            <span
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 sm:mb-8 text-xs sm:text-sm
                         font-mono font-medium rounded-full border"
              style={{
                color: 'var(--color-accent)',
                backgroundColor: 'var(--color-accent-muted)',
                borderColor: 'rgba(0,212,255,0.2)',
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Available for opportunities
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            variants={itemVariants}
            className="heading-primary mb-3 sm:mb-4"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Hi, I&apos;m{' '}
            <span className="text-gradient">{personalInfo.name}</span>
          </motion.h1>

          {/* Typewriter */}
          <motion.div
            variants={itemVariants}
            className="mb-6 sm:mb-8 h-10 sm:h-12 md:h-14 flex items-center justify-center"
          >
            <span
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-display font-semibold"
              style={{ color: 'var(--color-accent)' }}
            >
              <AnimatePresence mode="popLayout">
                {typedRole.split('').map((char, i) => (
                  <motion.span
                    key={`${typedRole.length}-${i}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.08 }}
                    className="inline-block"
                    style={{ whiteSpace: 'pre' }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </AnimatePresence>
              <motion.span
                className="inline-block w-[3px] h-[1em] ml-0.5 align-middle rounded-full"
                style={{ backgroundColor: 'var(--color-accent)' }}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'steps(2)' }}
              />
            </span>
          </motion.div>

          {/* Bio */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl leading-relaxed mb-8 sm:mb-10
                       max-w-2xl mx-auto"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {personalInfo.bio}
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col xs:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-14"
          >
            {/* 1. View My Work */}
            <MagneticButton
              onClick={() => scrollTo('projects')}
              className="btn-primary gap-2.5 px-7 py-3.5 text-sm sm:text-base w-full xs:w-auto"
            >
              View My Work
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z"
                  clipRule="evenodd"
                />
              </svg>
            </MagneticButton>

            {/* 2. Download CV */}
            <MagneticButton
              as="a"
              href={personalInfo.resumeUrl}
              download
              className="btn-secondary gap-2.5 px-7 py-3.5 text-sm sm:text-base w-full xs:w-auto"
            >
              Download CV
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
                <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
              </svg>
            </MagneticButton>

            {/* 3. Enter the Universe */}
            <MagneticButton
              onClick={enterImmersive}
              onMouseEnter={preloadImmersiveLibs}
              className="group relative inline-flex items-center justify-center gap-2.5
                         px-7 py-3.5 text-sm sm:text-base font-semibold rounded-xl
                         border overflow-hidden transition-all duration-400
                         active:scale-95 w-full xs:w-auto"
              style={{
                color: '#A855F7',
                borderColor: 'rgba(168,85,247,0.3)',
                backgroundColor: 'rgba(168,85,247,0.06)',
              }}
            >
              {/* Shimmer sweep on hover */}
              <span
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full
                           transition-transform duration-700 ease-in-out"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(168,85,247,0.08), transparent)',
                }}
              />

              <span className="relative z-10 flex items-center gap-2.5">
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-base"
                >
                  &#10022;
                </motion.span>
                Enter the Universe
              </span>
            </MagneticButton>
          </motion.div>

          {/* Social links */}
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <SocialLink
              href={personalInfo.socialLinks.github}
              label="GitHub"
              index={0}
            >
              <FaGithub className="w-5 h-5" />
            </SocialLink>

            <SocialLink
              href={personalInfo.socialLinks.linkedin}
              label="LinkedIn"
              index={1}
            >
              <FaLinkedin className="w-5 h-5" />
            </SocialLink>

            <SocialLink
              href={`mailto:${personalInfo.email}`}
              label="Email"
              index={2}
            >
              <HiOutlineMail className="w-5 h-5" />
            </SocialLink>
          </div>
        </div>
      </motion.div>

      {/* ---- Scroll indicator ---- */}
      <motion.button
        onClick={() => scrollTo('about')}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10
                   flex flex-col items-center gap-2 cursor-pointer group"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        aria-label="Scroll to About section"
      >
        <span
          className="text-xs font-mono tracking-widest uppercase
                     group-hover:text-primary transition-colors duration-200"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Scroll
        </span>

        <motion.div
          className="w-6 h-10 rounded-full border-2 flex justify-center pt-2"
          style={{ borderColor: 'var(--color-border-primary)' }}
          whileHover={{ borderColor: 'var(--color-accent)' }}
        >
          <motion.div
            className="w-1 h-2.5 rounded-full bg-primary"
            animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.button>
    </section>
  );
}
