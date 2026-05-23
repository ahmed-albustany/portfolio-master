import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ReactCountUp from 'react-countup';
import { HiCode, HiServer, HiDesktopComputer } from 'react-icons/hi';
import { personalInfo, stats } from '@/data/portfolioData';

/* ================================================================
   CJS INTEROP GUARD
   react-countup is CJS-only. In some ESM environments the default
   import resolves to the module wrapper object instead of the
   component function. This guard unwraps it safely.
   ================================================================ */

const CountUp =
  typeof ReactCountUp === 'function'
    ? ReactCountUp
    : ReactCountUp?.default ?? ReactCountUp;

/* ================================================================
   CONSTANTS
   ================================================================ */

const STAT_ICONS = [
  /* Years Experience */
  <svg key="cal" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z" clipRule="evenodd"/>
  </svg>,
  /* Projects Completed */
  <svg key="rocket" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M4.606 12.97a.75.75 0 0 1-.134 1.051 2.494 2.494 0 0 0-.93 2.437 2.494 2.494 0 0 0 2.437-.93.75.75 0 1 1 1.186.918 3.995 3.995 0 0 1-4.482 1.332.75.75 0 0 1-.461-.461 3.994 3.994 0 0 1 1.332-4.482.75.75 0 0 1 1.052.134Z" clipRule="evenodd"/>
    <path fillRule="evenodd" d="M13.703 2.59a.75.75 0 0 1 .166.076c1.327.98 2.394 2.232 3.122 3.66a.75.75 0 0 1-.07.818l-2.045 2.556a10.462 10.462 0 0 1-1.591 3.07l-1.974 2.63a.75.75 0 0 1-1.119.098L7.83 13.144a.75.75 0 0 1 0-1.06l.291-.292-1.591-1.59a.75.75 0 0 1 0-1.062l.291-.29a.75.75 0 0 1-.22-.533V6.856a.75.75 0 0 1 .22-.532l2.63-1.974a10.462 10.462 0 0 1 3.07-1.591l2.556-2.045a.75.75 0 0 1 .646-.124ZM9 9.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z" clipRule="evenodd"/>
  </svg>,
  /* Users Managed */
  <svg key="users" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z"/>
  </svg>,
  /* Certifications */
  <svg key="cert" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 0 0 1.075.676L10 15.082l5.925 2.844A.75.75 0 0 0 17 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0 0 10 2Z" clipRule="evenodd"/>
  </svg>,
];

const DISCIPLINES = [
  {
    icon: HiCode,
    title: 'Web Development',
    description:
      'Building responsive, performant web applications with React, Next.js, and modern front-end tooling. Pixel-perfect UI meets clean architecture.',
    accent: '#00D4FF',
  },
  {
    icon: HiServer,
    title: 'Software Engineering',
    description:
      'Designing scalable back-end systems, REST APIs, and CI/CD pipelines. From database design to cloud deployment, end to end.',
    accent: '#A855F7',
  },
  {
    icon: HiDesktopComputer,
    title: 'IT Systems & Admin',
    description:
      'Managing Active Directory, Windows Server, networking infrastructure, and providing enterprise-level helpdesk support.',
    accent: '#10B981',
  },
];

/* ================================================================
   ANIMATION VARIANTS
   ================================================================ */

const sectionVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] },
  },
};

/* ================================================================
   PROFILE IMAGE WITH ANIMATED BORDER RING
   ================================================================ */

function ProfileImage() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow */}
      <div
        className="absolute w-56 h-56 xs:w-64 xs:h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full"
        style={{
          background:
            'radial-gradient(circle, var(--color-accent-muted) 0%, transparent 70%)',
        }}
      />

      {/* Spinning gradient ring */}
      <motion.div
        className="absolute w-52 h-52 xs:w-60 xs:h-60 sm:w-68 sm:h-68 md:w-72 md:h-72 rounded-full"
        style={{
          background:
            'conic-gradient(from 0deg, #00D4FF, #A855F7, #EC4899, #00D4FF)',
          padding: '3px',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{ backgroundColor: 'var(--color-bg-primary)' }}
        />
      </motion.div>

      {/* Pulsing ring */}
      <motion.div
        className="absolute w-52 h-52 xs:w-60 xs:h-60 sm:w-68 sm:h-68 md:w-72 md:h-72 rounded-full
                   border-2"
        style={{ borderColor: 'var(--color-accent-muted)' }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.15, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Image container */}
      <div
        className="relative w-48 h-48 xs:w-56 xs:h-56 sm:w-64 sm:h-64 md:w-[17rem] md:h-[17rem]
                   rounded-full overflow-hidden border-4"
        style={{
          borderColor: 'var(--color-bg-primary)',
          backgroundColor: 'var(--color-bg-secondary)',
        }}
      >
        {/* Placeholder gradient — swap with <img> when you have a real photo */}
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            background:
              'linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-tertiary) 100%)',
          }}
        >
          <span
            className="text-5xl xs:text-6xl sm:text-7xl font-display font-bold"
            style={{ color: 'var(--color-accent)' }}
          >
            {personalInfo.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2) || '?'}
          </span>
        </div>

        {/* Replace the div above with this when you have a photo:
        <img
          src="/profile.webp"
          alt={personalInfo.name}
          className="w-full h-full object-cover"
          loading="eager"
        />
        */}
      </div>
    </div>
  );
}

/* ================================================================
   STAT CARD
   ================================================================ */

function StatCard({ stat, icon, index, inView }) {
  return (
    <motion.div
      variants={scaleIn}
      custom={index}
      className="card-glow relative overflow-hidden p-5 sm:p-6 text-center group"
    >
      {/* Hover shimmer */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100
                   transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 0%, var(--color-accent-muted) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10">
        {/* Icon */}
        <div
          className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3"
          style={{
            color: 'var(--color-accent)',
            backgroundColor: 'var(--color-accent-muted)',
          }}
        >
          {icon}
        </div>

        {/* Number */}
        <div
          className="text-3xl sm:text-4xl font-bold font-display mb-1"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {inView && typeof CountUp === 'function' ? (
            <CountUp
              end={stat.value}
              duration={2.5}
              suffix={stat.suffix}
              useEasing
              easingFn={(t, b, c, d) => {
                const x = t / d - 1;
                return c * (x * x * x + 1) + b;
              }}
            />
          ) : (
            <span>
              {stat.value}
              {stat.suffix}
            </span>
          )}
        </div>

        {/* Label */}
        <p
          className="text-xs sm:text-sm font-medium"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {stat.label}
        </p>
      </div>
    </motion.div>
  );
}

/* ================================================================
   DISCIPLINE CARD
   ================================================================ */

function DisciplineCard({ discipline, index }) {
  const Icon = discipline.icon;

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      className="card-glow relative overflow-hidden p-6 sm:p-8 group"
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-60
                   group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${discipline.accent}, transparent)`,
        }}
      />

      {/* Icon */}
      <div
        className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14
                   rounded-2xl mb-4 sm:mb-5 transition-transform duration-300
                   group-hover:scale-110"
        style={{
          color: discipline.accent,
          backgroundColor: `${discipline.accent}15`,
        }}
      >
        <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>

      {/* Title */}
      <h3
        className="text-lg sm:text-xl font-display font-bold mb-2 sm:mb-3"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {discipline.title}
      </h3>

      {/* Description */}
      <p
        className="text-sm sm:text-base leading-relaxed"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {discipline.description}
      </p>
    </motion.div>
  );
}

/* ================================================================
   ABOUT SECTION
   ================================================================ */

export default function About() {
  const [headerRef, headerInView] = useInView({
    threshold: 0.15,
    triggerOnce: true,
  });

  const [statsRef, statsInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [cardsRef, cardsInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section
      id="about"
      className="section-padding relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-secondary)' }}
    >
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(var(--color-accent) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      <div className="section-container relative z-10">

        {/* ===== HEADER: Two-column — photo + bio ===== */}
        <motion.div
          ref={headerRef}
          variants={sectionVariants}
          initial="hidden"
          animate={headerInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16 sm:mb-20"
        >
          {/* Column 1: Profile image */}
          <motion.div
            variants={fadeUp}
            className="flex justify-center lg:justify-center"
          >
            <ProfileImage />
          </motion.div>

          {/* Column 2: Text content */}
          <div className="text-center lg:text-left">
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
              Get to know me
            </motion.span>

            <motion.h2
              variants={fadeUp}
              className="heading-secondary mb-5 sm:mb-6"
              style={{ color: 'var(--color-text-primary)' }}
            >
              About <span className="text-gradient">Me</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg leading-relaxed mb-4"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {personalInfo.bio}
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg leading-relaxed"
              style={{ color: 'var(--color-text-muted)' }}
            >
              I bridge the gap between{' '}
              <span style={{ color: '#00D4FF' }} className="font-semibold">
                web development
              </span>
              ,{' '}
              <span style={{ color: '#A855F7' }} className="font-semibold">
                software engineering
              </span>
              , and{' '}
              <span style={{ color: '#10B981' }} className="font-semibold">
                IT systems administration
              </span>
              &mdash;delivering solutions that are built well, deployed right,
              and supported end to end.
            </motion.p>
          </div>
        </motion.div>

        {/* ===== STATS ROW ===== */}
        <motion.div
          ref={statsRef}
          variants={sectionVariants}
          initial="hidden"
          animate={statsInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-16 sm:mb-20"
        >
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              icon={STAT_ICONS[index]}
              index={index}
              inView={statsInView}
            />
          ))}
        </motion.div>

        {/* ===== WHAT I BRING — 3 DISCIPLINE CARDS ===== */}
        <motion.div
          ref={cardsRef}
          variants={sectionVariants}
          initial="hidden"
          animate={cardsInView ? 'visible' : 'hidden'}
        >
          <motion.div variants={fadeUp} className="text-center mb-10 sm:mb-12">
            <h3
              className="heading-tertiary mb-3"
              style={{ color: 'var(--color-text-primary)' }}
            >
              What I <span className="text-gradient">Bring</span>
            </h3>
            <p
              className="text-sm sm:text-base max-w-lg mx-auto"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Three disciplines, one developer. I build, engineer, and maintain
              the full stack.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {DISCIPLINES.map((discipline, index) => (
              <DisciplineCard
                key={discipline.title}
                discipline={discipline}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
