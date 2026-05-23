import { useContext, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ModeContext } from '@/context/ModeContext';
import { HiX } from 'react-icons/hi';

const ImmersiveHero = lazy(() => import('@/components/sections/immersive/ImmersiveHero'));
const ImmersiveAbout = lazy(() => import('@/components/sections/immersive/ImmersiveAbout'));
const ImmersiveSkills = lazy(() => import('@/components/sections/immersive/ImmersiveSkills'));
const ImmersiveProjects = lazy(() => import('@/components/sections/immersive/ImmersiveProjects'));
const ImmersiveExperience = lazy(() => import('@/components/sections/immersive/ImmersiveExperience'));
const ImmersiveCertifications = lazy(() => import('@/components/sections/immersive/ImmersiveCertifications'));
const ImmersiveContact = lazy(() => import('@/components/sections/immersive/ImmersiveContact'));

/* ================================================================
   SECTION LOADER
   ================================================================ */

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

/* ================================================================
   EXIT BUTTON
   Fixed top-right, always accessible during immersive mode.
   ================================================================ */

function ExitButton() {
  const { exitImmersive } = useContext(ModeContext);

  return (
    <motion.button
      onClick={exitImmersive}
      className="fixed top-5 right-5 z-[100] flex items-center gap-2 px-4 py-2.5
                 text-xs font-mono font-semibold uppercase tracking-wider rounded-xl
                 border backdrop-blur-md transition-all duration-300
                 hover:scale-105 active:scale-95 group"
      style={{
        color: '#A855F7',
        borderColor: 'rgba(168, 85, 247, 0.3)',
        backgroundColor: 'rgba(168, 85, 247, 0.08)',
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      whileHover={{
        boxShadow: '0 0 24px rgba(168, 85, 247, 0.3)',
        borderColor: 'rgba(168, 85, 247, 0.6)',
      }}
    >
      <HiX className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-300" />
      <span className="hidden sm:inline">Exit Universe</span>
    </motion.button>
  );
}

/* ================================================================
   COSMIC BACKGROUND
   Fixed star-like dots + gradient nebulae behind all sections.
   ================================================================ */

function CosmicBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      {/* Base black */}
      <div className="absolute inset-0 bg-[#0a0a0f]" />

      {/* Nebula gradients */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 20% 20%, rgba(0,212,255,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 80% 80%, rgba(124,58,237,0.05) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 50% 50%, rgba(0,212,255,0.03) 0%, transparent 50%)
          `,
        }}
      />

      {/* Static stars via box-shadow (lightweight) */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(1px 1px at 10% 15%, rgba(255,255,255,0.4), transparent),
            radial-gradient(1px 1px at 25% 35%, rgba(255,255,255,0.3), transparent),
            radial-gradient(1.5px 1.5px at 40% 10%, rgba(0,212,255,0.5), transparent),
            radial-gradient(1px 1px at 55% 45%, rgba(255,255,255,0.25), transparent),
            radial-gradient(1px 1px at 70% 20%, rgba(255,255,255,0.35), transparent),
            radial-gradient(1.5px 1.5px at 85% 65%, rgba(124,58,237,0.4), transparent),
            radial-gradient(1px 1px at 15% 70%, rgba(255,255,255,0.3), transparent),
            radial-gradient(1px 1px at 30% 85%, rgba(255,255,255,0.2), transparent),
            radial-gradient(1.5px 1.5px at 60% 75%, rgba(0,212,255,0.35), transparent),
            radial-gradient(1px 1px at 90% 30%, rgba(255,255,255,0.3), transparent),
            radial-gradient(1px 1px at 5% 50%, rgba(255,255,255,0.2), transparent),
            radial-gradient(1px 1px at 45% 60%, rgba(255,255,255,0.15), transparent),
            radial-gradient(1.5px 1.5px at 75% 90%, rgba(0,212,255,0.3), transparent),
            radial-gradient(1px 1px at 95% 10%, rgba(255,255,255,0.25), transparent),
            radial-gradient(1px 1px at 35% 95%, rgba(124,58,237,0.3), transparent),
            radial-gradient(1px 1px at 50% 25%, rgba(255,255,255,0.2), transparent)
          `,
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,212,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.5) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />
    </div>
  );
}

/* ================================================================
   IMMERSIVE SHELL
   Wraps all immersive-mode sections with cosmic background,
   exit button, and forced dark palette.
   ================================================================ */

export default function ImmersiveShell() {
  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#0a0a0f' }}>
      <CosmicBackground />
      <ExitButton />

      <Suspense fallback={<SectionLoader />}>
        <div className="relative z-10">
          <ImmersiveHero />
          <ImmersiveAbout />
          <ImmersiveSkills />
          <ImmersiveProjects />
          <ImmersiveExperience />
          <ImmersiveCertifications />
          <ImmersiveContact />
        </div>
      </Suspense>
    </div>
  );
}
