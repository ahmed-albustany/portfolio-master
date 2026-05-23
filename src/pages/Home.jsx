import { useContext, lazy, Suspense } from 'react';
import { ModeContext } from '@/context/ModeContext';
import TransitionOverlay from '@/components/immersive/TransitionOverlay';

/* ================================================================
   PROFESSIONAL SECTIONS — each lazy-loaded for code splitting
   ================================================================ */

const ProfessionalHero = lazy(() => import('@/components/sections/professional/Hero'));
const ProfessionalAbout = lazy(() => import('@/components/sections/professional/About'));
const ProfessionalSkills = lazy(() => import('@/components/sections/professional/Skills'));
const ProfessionalProjects = lazy(() => import('@/components/sections/professional/Projects'));
const ProfessionalExperience = lazy(() => import('@/components/sections/professional/Experience'));
const ProfessionalCertifications = lazy(() => import('@/components/sections/professional/Certifications'));
const ProfessionalContact = lazy(() => import('@/components/sections/professional/Contact'));

/* ================================================================
   IMMERSIVE SHELL — lazy loaded, only fetched when mode activates
   (ImmersiveShell internally lazy-loads all 7 immersive sections
    + tsparticles, so nothing is loaded until the user clicks
    "Enter Singularity")
   ================================================================ */

const ImmersiveShell = lazy(() => import('@/components/immersive/ImmersiveShell'));

/* ================================================================
   SECTION LOADER — lightweight skeleton while chunks stream in
   ================================================================ */

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>
          Loading section...
        </p>
      </div>
    </div>
  );
}

/* ================================================================
   HOME PAGE
   Renders either Professional or Immersive mode based on context.
   TransitionOverlay sits on top for the mode-switch animation.
   ================================================================ */

export default function Home() {
  const { isProfessional } = useContext(ModeContext);

  return (
    <>
      {/* Transition overlay (renders during mode switch) */}
      <TransitionOverlay />

      <main>
        <Suspense fallback={<SectionLoader />}>
          {isProfessional ? (
            <>
              <ProfessionalHero />
              <ProfessionalAbout />
              <ProfessionalSkills />
              <ProfessionalProjects />
              <ProfessionalExperience />
              <ProfessionalCertifications />
              <ProfessionalContact />
            </>
          ) : (
            <ImmersiveShell />
          )}
        </Suspense>
      </main>
    </>
  );
}
