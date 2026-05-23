import { useState, useEffect, useContext, useRef, useCallback, useMemo, lazy, Suspense } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import gsap from 'gsap';
import { ModeContext } from '@/context/ModeContext';
import { personalInfo } from '@/data/portfolioData';

const NeuralParticlesLazy = lazy(() => import('@/components/ui/NeuralParticles'));

/* ================================================================
   CONSTANTS
   ================================================================ */

const QUANTUM_ROLES = [
  { state: '|dev⟩',  label: 'Full-Stack Developer' },
  { state: '|eng⟩',  label: 'Software Engineer' },
  { state: '|sys⟩',  label: 'IT Systems Administrator' },
  { state: '|ops⟩',  label: 'Domain Admin & Helpdesk Expert' },
];

const TYPING_SPEED   = 55;
const DELETING_SPEED = 30;
const PAUSE_AFTER    = 2400;
const PAUSE_BEFORE   = 500;

/* ================================================================
   TYPEWRITER HOOK
   Same proven hook from professional hero, adapted for quantum
   state labels: returns { stateLabel, roleText }.
   ================================================================ */

function useQuantumTypewriter(roles) {
  const [display, setDisplay] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState('typing');

  useEffect(() => {
    const current = roles[roleIndex].label;
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
          setRoleIndex((i) => (i + 1) % roles.length);
          setPhase('typing');
        }, PAUSE_BEFORE);
        break;
    }

    return () => clearTimeout(timeout);
  }, [charIndex, phase, roleIndex, roles]);

  return {
    stateLabel: roles[roleIndex].state,
    roleText: display,
  };
}

/* ================================================================
   MAGNETIC BUTTON (stronger pull for immersive mode)
   ================================================================ */

function MagneticButton({ children, className, style, as: Tag = 'button', ...props }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 200, damping: 14, mass: 0.4 };
  const sx = useSpring(x, springConfig);
  const sy = useSpring(y, springConfig);

  const handleMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    // 0.5 multiplier = stronger pull than professional's 0.3
    x.set((e.clientX - cx) * 0.5);
    y.set((e.clientY - cy) * 0.5);
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
      whileTap={{ scale: 0.92 }}
      {...props}
    >
      {children}
    </MotionTag>
  );
}

/* ================================================================
   SOCIAL LINK (cosmic variant)
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
        color: '#888',
        borderColor: '#1e1e2e',
        backgroundColor: 'rgba(14,14,22,0.8)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 2.4 + index * 0.1, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{
        y: -5,
        borderColor: '#00D4FF',
        color: '#00D4FF',
        boxShadow: '0 8px 30px rgba(0,212,255,0.2)',
      }}
      whileTap={{ scale: 0.9 }}
    >
      {children}

      <span
        className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2
                   px-2.5 py-1 text-xs font-mono font-medium rounded-lg whitespace-nowrap
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          backgroundColor: '#111118',
          color: '#00D4FF',
          border: '1px solid #1e1e2e',
        }}
      >
        {label}
      </span>
    </motion.a>
  );
}

/* ================================================================
   IMMERSIVE HERO
   ================================================================ */

export default function ImmersiveHero() {
  const { exitImmersive } = useContext(ModeContext);
  const { stateLabel, roleText } = useQuantumTypewriter(QUANTUM_ROLES);

  /* Refs for GSAP entrance timeline */
  const sectionRef = useRef(null);
  const particlesRef = useRef(null);
  const nameRef = useRef(null);
  const roleRef = useRef(null);
  const buttonsRef = useRef(null);
  const scrollRef = useRef(null);
  const socialsRef = useRef(null);

  /* ---- GSAP entrance sequence ---- */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. Particles fade in
      tl.fromTo(
        particlesRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.2 },
        0,
      );

      // 2. Name assembles (letter-by-letter via stagger)
      const letters = nameRef.current?.querySelectorAll('.hero-letter');
      if (letters?.length) {
        tl.fromTo(
          letters,
          { opacity: 0, y: 60, scale: 0.3, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.6,
            stagger: 0.05,
          },
          0.4,
        );
      }

      // Also animate the "greeting" line
      const greeting = nameRef.current?.querySelector('.hero-greeting');
      if (greeting) {
        tl.fromTo(
          greeting,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 },
          0.3,
        );
      }

      // 3. Role text fades in
      tl.fromTo(
        roleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        1.2,
      );

      // 4. Buttons fade in
      const buttons = buttonsRef.current?.children;
      if (buttons?.length) {
        tl.fromTo(
          buttons,
          { opacity: 0, y: 30, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1 },
          1.5,
        );
      }

      // 5. Social links
      tl.fromTo(
        socialsRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        1.9,
      );

      // 6. Scroll indicator pulses in
      tl.fromTo(
        scrollRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        2.2,
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ---- Scroll helper ---- */
  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  /* ---- Name letters for stagger ---- */
  const nameLetters = useMemo(
    () => (personalInfo.name || 'Developer').split(''),
    [],
  );

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: '100vh', backgroundColor: '#0a0a0f' }}
    >
      {/* ---- Layer 1: tsparticles neural-network background ---- */}
      <div ref={particlesRef} className="absolute inset-0 opacity-0">
        <Suspense fallback={null}>
          <NeuralParticlesLazy />
        </Suspense>
      </div>

      {/* ---- Layer 2: Radial vignette ---- */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, #0a0a0f 100%)
          `,
        }}
      />

      {/* ---- Layer 3: Cosmic nebula accents ---- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <motion.div
          className="absolute w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)',
            top: '-10%',
            left: '-15%',
          }}
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)',
            bottom: '-15%',
            right: '-10%',
          }}
          animate={{ x: [0, -35, 0], y: [0, 25, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* ---- Content ---- */}
      <div className="section-container relative z-10 py-24 sm:py-28 md:py-32">
        <div className="max-w-4xl mx-auto text-center">

          {/* Quantum state badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <span
              className="inline-flex items-center gap-2.5 px-4 py-2 mb-6 sm:mb-8 text-xs sm:text-sm
                         font-mono font-medium rounded-full border"
              style={{
                color: '#7C3AED',
                backgroundColor: 'rgba(124,58,237,0.08)',
                borderColor: 'rgba(124,58,237,0.25)',
              }}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: '#7C3AED' }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ backgroundColor: '#7C3AED' }}
                />
              </span>
              Singularity Mode Active
            </span>
          </motion.div>

          {/* Name — letter-by-letter with GSAP */}
          <div ref={nameRef} className="mb-3 sm:mb-4">
            <p
              className="hero-greeting text-base sm:text-lg font-mono font-medium mb-2 opacity-0"
              style={{ color: '#888' }}
            >
              // welcome to my universe
            </p>

            <h1 className="heading-primary leading-tight">
              <span style={{ color: '#f1f5f9' }}>Hi, I&apos;m </span>
              <span className="inline-flex flex-wrap justify-center">
                {nameLetters.map((char, i) => (
                  <span
                    key={i}
                    className="hero-letter inline-block opacity-0"
                    style={{
                      background: 'linear-gradient(135deg, #00D4FF, #7C3AED)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      whiteSpace: 'pre',
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </span>
            </h1>
          </div>

          {/* Quantum role typewriter */}
          <div
            ref={roleRef}
            className="mb-6 sm:mb-8 h-12 sm:h-14 md:h-16 flex items-center justify-center gap-3 opacity-0"
          >
            {/* Quantum state label */}
            <motion.span
              key={stateLabel}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden sm:inline-block px-2.5 py-1 text-xs font-mono font-bold rounded-lg"
              style={{
                color: '#7C3AED',
                backgroundColor: 'rgba(124,58,237,0.12)',
                border: '1px solid rgba(124,58,237,0.2)',
              }}
            >
              {stateLabel}
            </motion.span>

            {/* Typed role text */}
            <span
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-display font-semibold"
              style={{ color: '#00D4FF' }}
            >
              <AnimatePresence mode="popLayout">
                {roleText.split('').map((char, i) => (
                  <motion.span
                    key={`${roleText.length}-${i}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.06 }}
                    className="inline-block"
                    style={{ whiteSpace: 'pre' }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </AnimatePresence>

              {/* Blinking cursor */}
              <motion.span
                className="inline-block w-[3px] h-[1em] ml-0.5 align-middle rounded-full"
                style={{ backgroundColor: '#00D4FF' }}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'steps(2)' }}
              />
            </span>
          </div>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="text-base sm:text-lg md:text-xl leading-relaxed mb-8 sm:mb-10
                       max-w-2xl mx-auto"
            style={{ color: '#94a3b8' }}
          >
            {personalInfo.bio}
          </motion.p>

          {/* CTA Buttons */}
          <div
            ref={buttonsRef}
            className="flex flex-col xs:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-14"
          >
            {/* 1. View My Work */}
            <MagneticButton
              onClick={() => scrollTo('projects')}
              className="group relative inline-flex items-center justify-center gap-2.5
                         px-7 py-3.5 text-sm sm:text-base font-semibold rounded-xl
                         overflow-hidden transition-all duration-300 w-full xs:w-auto"
              style={{
                color: '#0a0a0f',
                backgroundColor: '#00D4FF',
              }}
            >
              {/* Shimmer */}
              <span
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full
                           transition-transform duration-700"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                }}
              />
              <span className="relative z-10 flex items-center gap-2.5">
                View My Work
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path
                    fillRule="evenodd"
                    d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </MagneticButton>

            {/* 2. Download CV */}
            <MagneticButton
              as="a"
              href={personalInfo.resumeUrl}
              download
              className="group inline-flex items-center justify-center gap-2.5
                         px-7 py-3.5 text-sm sm:text-base font-semibold rounded-xl
                         border-2 transition-all duration-300 w-full xs:w-auto"
              style={{
                color: '#00D4FF',
                borderColor: '#00D4FF',
                backgroundColor: 'transparent',
              }}
            >
              Download CV
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
                <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
              </svg>
            </MagneticButton>

            {/* 3. Exit Universe */}
            <MagneticButton
              onClick={exitImmersive}
              className="group relative inline-flex items-center justify-center gap-2.5
                         px-7 py-3.5 text-sm sm:text-base font-semibold rounded-xl
                         border overflow-hidden transition-all duration-300 w-full xs:w-auto"
              style={{
                color: '#A855F7',
                borderColor: 'rgba(168,85,247,0.3)',
                backgroundColor: 'rgba(168,85,247,0.06)',
              }}
            >
              <span
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full
                           transition-transform duration-700"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.08), transparent)',
                }}
              />
              <span className="relative z-10 flex items-center gap-2.5">
                <motion.span
                  animate={{ rotate: [0, 180, 360] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                  className="text-base"
                >
                  &#10022;
                </motion.span>
                Professional Mode
              </span>
            </MagneticButton>
          </div>

          {/* Social links */}
          <div ref={socialsRef} className="flex items-center justify-center gap-3 sm:gap-4">
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
      </div>

      {/* ---- Scroll indicator ---- */}
      <div
        ref={scrollRef}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 opacity-0"
      >
        <button
          onClick={() => scrollTo('about')}
          className="flex flex-col items-center gap-2 cursor-pointer group"
          aria-label="Scroll to explore"
        >
          <span className="text-xs font-mono tracking-widest uppercase group-hover:text-[#00D4FF] transition-colors"
                style={{ color: '#555' }}>
            Explore
          </span>

          <motion.div
            className="w-6 h-10 rounded-full border-2 flex justify-center pt-2"
            style={{ borderColor: '#1e1e2e' }}
            whileHover={{ borderColor: '#00D4FF' }}
          >
            <motion.div
              className="w-1 h-2.5 rounded-full"
              style={{ backgroundColor: '#00D4FF' }}
              animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </button>
      </div>

      {/* Inline keyframes for scan-line effect */}
      <style>{`
        @keyframes immersiveScanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </section>
  );
}

/* ================================================================
   NEURAL NETWORK PARTICLES
   Separate component so we can lazy-load it cleanly.
   Created as its own file to avoid require() in ESM.
   ================================================================ */

/* Inline — uses the already-lazy-loaded ParticleBackground
   pattern but renders from a dedicated NeuralParticles component */
