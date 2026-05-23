import { useContext } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  HiCode, HiServer, HiDatabase, HiShieldCheck, HiDesktopComputer, HiSupport,
  HiLocationMarker, HiStatusOnline, HiGlobe,
} from 'react-icons/hi';
import { ThemeContext } from '@/context/ThemeContext';
import { useFirestore } from '@/hooks/useFirestore';
import { getPersonalInfo } from '@/firebase/firestore';
import { fallbackPersonalInfo } from '@/data/fallbackData';
import SkeletonLoader from '@/components/ui/SkeletonLoader';

/* ================================================================
   SPECIALIZATIONS
   ================================================================ */

const specializations = [
  {
    icon: HiCode,
    title: 'Web Development',
    desc: 'React, Next.js, modern frontend & backend',
    color: '#0066FF',
  },
  {
    icon: HiServer,
    title: 'Software Engineering',
    desc: 'APIs, CI/CD, scalable architectures',
    color: '#A855F7',
  },
  {
    icon: HiDesktopComputer,
    title: 'Systems Admin',
    desc: 'Active Directory, Windows Server, GPO',
    color: '#00D4FF',
  },
  {
    icon: HiGlobe,
    title: 'Network Admin',
    desc: 'Cisco, VLANs, firewall management',
    color: '#00FF88',
  },
  {
    icon: HiDatabase,
    title: 'Database Admin',
    desc: 'SQL Server, MySQL, backup & recovery',
    color: '#FFB800',
  },
  {
    icon: HiSupport,
    title: 'IT Support',
    desc: 'Helpdesk, troubleshooting, end-user training',
    color: '#FF6B35',
  },
];

/* Department tags for ID card */
const deptTags = [
  { label: 'DEV', color: '#0066FF' },
  { label: 'SYSADMIN', color: '#00D4FF' },
  { label: 'NETWORK', color: '#00FF88' },
  { label: 'DB', color: '#FFB800' },
  { label: 'SECURITY', color: '#FF3B3B' },
];

/* ================================================================
   ANIMATION VARIANTS
   ================================================================ */

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

/* ================================================================
   ID CARD — LEFT COLUMN
   ================================================================ */

function IDCard({ info }) {
  const { isDark } = useContext(ThemeContext);
  const initials = (info.name || 'AA')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <motion.div
      variants={fadeUp}
      className="relative rounded-xl overflow-hidden"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        border: '1px solid var(--color-border-primary)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Top accent stripe */}
      <div
        className="h-1"
        style={{ background: 'linear-gradient(90deg, #0066FF, #00D4FF, #00FF88)' }}
      />

      <div className="p-6 sm:p-8">
        {/* Header label */}
        <div className="flex items-center justify-between mb-6">
          <span
            className="text-[10px] font-mono font-semibold uppercase tracking-widest"
            style={{ color: 'var(--color-text-muted)' }}
          >
            OPERATOR ID CARD
          </span>
          <HiShieldCheck className="w-5 h-5" style={{ color: '#0066FF' }} />
        </div>

        {/* Photo / Initials */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {info.photoURL ? (
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden scan-line-effect">
                <img
                  src={info.photoURL}
                  alt={info.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : (
              <div
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl flex items-center justify-center
                           scan-line-effect"
                style={{
                  backgroundColor: isDark ? '#0D1520' : '#E2E8F0',
                  border: '2px solid var(--color-border-primary)',
                }}
              >
                <span
                  className="text-3xl sm:text-4xl font-heading font-bold"
                  style={{ color: '#0066FF' }}
                >
                  {initials}
                </span>
              </div>
            )}

            {/* Online indicator */}
            <span
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 flex items-center justify-center"
              style={{
                backgroundColor: '#00FF88',
                borderColor: 'var(--color-bg-card)',
                boxShadow: '0 0 8px rgba(0,255,136,0.4)',
              }}
            />
          </div>
        </div>

        {/* Name */}
        <h3
          className="text-center text-lg sm:text-xl font-heading font-bold mb-1"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {info.name || 'Ahmed Albustany'}
        </h3>

        {/* Clearance badge */}
        <div className="flex justify-center mb-4">
          <span
            className="px-3 py-1 text-[10px] font-mono font-semibold uppercase tracking-widest
                       rounded-md"
            style={{
              color: '#00D4FF',
              backgroundColor: 'rgba(0,212,255,0.1)',
              border: '1px solid rgba(0,212,255,0.2)',
            }}
          >
            Full-Spectrum Technologist
          </span>
        </div>

        {/* Divider */}
        <div
          className="h-px w-full mb-4"
          style={{ backgroundColor: 'var(--color-border-primary)' }}
        />

        {/* Status */}
        <div className="space-y-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <HiStatusOnline className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#00FF88' }} />
            <span style={{ color: 'var(--color-text-muted)' }}>STATUS:</span>
            <span
              className="flex items-center gap-1.5 font-semibold"
              style={{ color: '#00FF88' }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: '#00FF88',
                  boxShadow: '0 0 6px rgba(0,255,136,0.5)',
                  animation: 'status-blink 2s ease-in-out infinite',
                }}
              />
              {info.availability || 'AVAILABLE FOR DEPLOYMENT'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <HiLocationMarker className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#0066FF' }} />
            <span style={{ color: 'var(--color-text-muted)' }}>LOCATION:</span>
            <span style={{ color: 'var(--color-text-secondary)' }}>
              {info.location || 'Amman, Jordan'}
            </span>
          </div>
        </div>

        {/* Department tags */}
        <div className="flex flex-wrap gap-1.5 mt-5">
          {deptTags.map((dept) => (
            <span
              key={dept.label}
              className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded"
              style={{
                color: dept.color,
                backgroundColor: `${dept.color}12`,
                border: `1px solid ${dept.color}25`,
              }}
            >
              {dept.label}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================
   SPECIALIZATION CARD
   ================================================================ */

function SpecCard({ spec, index }) {
  const Icon = spec.icon;

  return (
    <motion.div
      variants={fadeUp}
      className="flex items-start gap-3 p-3 rounded-lg transition-all duration-200 group"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        border: '1px solid var(--color-border-primary)',
      }}
      whileHover={{
        borderColor: `${spec.color}40`,
        boxShadow: `0 0 15px ${spec.color}10`,
      }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
                   transition-transform duration-200 group-hover:scale-110"
        style={{
          backgroundColor: `${spec.color}12`,
          border: `1px solid ${spec.color}20`,
        }}
      >
        <Icon className="w-4 h-4" style={{ color: spec.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span
            className="text-xs font-heading font-semibold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {spec.title}
          </span>
          <span
            className="flex items-center gap-1 text-[9px] font-mono font-semibold uppercase"
            style={{ color: '#00FF88' }}
          >
            <span
              className="w-1 h-1 rounded-full"
              style={{
                backgroundColor: '#00FF88',
                boxShadow: '0 0 4px rgba(0,255,136,0.4)',
              }}
            />
            Active
          </span>
        </div>
        <p
          className="text-[11px] font-mono leading-relaxed"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {spec.desc}
        </p>
      </div>
    </motion.div>
  );
}

/* ================================================================
   ABOUT SECTION
   ================================================================ */

export default function About() {
  const { data: info, loading } = useFirestore(getPersonalInfo, fallbackPersonalInfo);
  const displayInfo = info || fallbackPersonalInfo;

  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  if (loading) {
    return (
      <section id="about" className="section-padding" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
        <div className="section-container">
          <SkeletonLoader variant="card" count={2} />
        </div>
      </section>
    );
  }

  return (
    <section
      id="about"
      className="section-padding relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-secondary)' }}
    >
      {/* Subtle dot background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(var(--color-border-primary) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.3,
        }}
        aria-hidden="true"
      />

      <div className="section-container relative z-10">
        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10"
        >
          {/* ── LEFT COLUMN: ID Card ── */}
          <div className="lg:col-span-4">
            <IDCard info={displayInfo} />
          </div>

          {/* ── RIGHT COLUMN: Operator Brief ── */}
          <div className="lg:col-span-8">
            {/* Section label */}
            <motion.div variants={fadeUp} className="mb-6">
              <span
                className="inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-mono
                           font-semibold uppercase tracking-widest rounded-md border"
                style={{
                  color: 'var(--color-text-muted)',
                  borderColor: 'var(--color-border-primary)',
                  backgroundColor: 'var(--color-bg-card)',
                }}
              >
                <HiShieldCheck className="w-3 h-3" style={{ color: '#0066FF' }} />
                Operator Profile
              </span>
            </motion.div>

            {/* Bio */}
            <motion.h2
              variants={fadeUp}
              className="heading-secondary mb-4"
              style={{ color: 'var(--color-text-primary)' }}
            >
              About <span className="text-gradient">Me</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-sm sm:text-base leading-relaxed mb-8"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {displayInfo.bio || fallbackPersonalInfo.bio}
            </motion.p>

            {/* Specializations header */}
            <motion.div variants={fadeUp} className="mb-4">
              <span
                className="text-[10px] font-mono font-semibold uppercase tracking-widest"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Specializations
              </span>
            </motion.div>

            {/* Specialization cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {specializations.map((spec, i) => (
                <SpecCard key={spec.title} spec={spec} index={i} />
              ))}
            </div>

            {/* Current Mission card */}
            <motion.div
              variants={fadeUp}
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: 'var(--color-bg-card)',
                border: '1px solid var(--color-border-primary)',
              }}
            >
              {/* Card top accent */}
              <div
                className="h-0.5"
                style={{
                  background: 'linear-gradient(90deg, #0066FF, #00D4FF)',
                }}
              />

              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="text-[10px] font-mono font-semibold uppercase tracking-widest"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    Current Mission
                  </span>
                  <span
                    className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded"
                    style={{
                      color: '#FFB800',
                      backgroundColor: 'rgba(255,184,0,0.1)',
                      border: '1px solid rgba(255,184,0,0.2)',
                    }}
                  >
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div>
                    <span className="block mb-1" style={{ color: 'var(--color-text-muted)' }}>
                      LOOKING FOR
                    </span>
                    <span style={{ color: 'var(--color-text-primary)' }}>
                      Senior role in tech
                    </span>
                  </div>
                  <div>
                    <span className="block mb-1" style={{ color: 'var(--color-text-muted)' }}>
                      AVAILABLE
                    </span>
                    <span style={{ color: '#00FF88' }}>Immediately</span>
                  </div>
                  <div>
                    <span className="block mb-1" style={{ color: 'var(--color-text-muted)' }}>
                      LOCATION
                    </span>
                    <span style={{ color: 'var(--color-text-primary)' }}>
                      Amman / Remote / Relocation
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
