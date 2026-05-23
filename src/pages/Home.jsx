import { useContext, lazy, Suspense } from 'react';
import { ModeContext } from '@/context/ModeContext';
import SkeletonLoader from '@/components/ui/SkeletonLoader';

/* ================================================================
   LAZY LOAD — Professional sections
   ================================================================ */

const Hero = lazy(() => import('@/components/sections/professional/Hero'));
const About = lazy(() => import('@/components/sections/professional/About'));
const Skills = lazy(() => import('@/components/sections/professional/Skills'));
const Projects = lazy(() => import('@/components/sections/professional/Projects'));
const Experience = lazy(() => import('@/components/sections/professional/Experience'));
const SysAdmin = lazy(() => import('@/components/sections/professional/SysAdmin'));
const Network = lazy(() => import('@/components/sections/professional/Network'));
const Database = lazy(() => import('@/components/sections/professional/Database'));
const Security = lazy(() => import('@/components/sections/professional/Security'));
const Helpdesk = lazy(() => import('@/components/sections/professional/Helpdesk'));
const Certifications = lazy(() => import('@/components/sections/professional/Certifications'));
const Contact = lazy(() => import('@/components/sections/professional/Contact'));

/* ================================================================
   LAZY LOAD — Deep System
   ================================================================ */

const DeepSystemShell = lazy(() => import('@/components/sections/deepsystem/DeepSystemShell'));

/* ================================================================
   SECTION FALLBACK
   ================================================================ */

function SectionFallback({ variant = 'card', count = 3 }) {
  return (
    <div className="section-padding">
      <div className="section-container">
        <SkeletonLoader variant={variant} count={count} />
      </div>
    </div>
  );
}

/* ================================================================
   HOME PAGE
   ================================================================ */

export default function Home() {
  const { isDeepSystem } = useContext(ModeContext);

  if (isDeepSystem) {
    return (
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#000' }}>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-[#00FF41] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono" style={{ color: '#00FF4160' }}>Initializing deep system...</span>
          </div>
        </div>
      }>
        <DeepSystemShell />
      </Suspense>
    );
  }

  return (
    <main>
      {/* 1. Hero — full bleed, no skeleton needed (has own boot sequence) */}
      <Suspense fallback={<SectionFallback variant="list" count={1} />}>
        <Hero />
      </Suspense>

      {/* 2. About */}
      <Suspense fallback={<SectionFallback variant="card" count={2} />}>
        <About />
      </Suspense>

      {/* 3. Skills */}
      <Suspense fallback={<SectionFallback variant="card" count={6} />}>
        <Skills />
      </Suspense>

      {/* 4. Projects (Mission Log) */}
      <Suspense fallback={<SectionFallback variant="card" count={4} />}>
        <Projects />
      </Suspense>

      {/* 5. Experience */}
      <Suspense fallback={<SectionFallback variant="list" count={3} />}>
        <Experience />
      </Suspense>

      {/* 6. SysAdmin */}
      <Suspense fallback={<SectionFallback variant="department" count={2} />}>
        <SysAdmin />
      </Suspense>

      {/* 7. Network */}
      <Suspense fallback={<SectionFallback variant="department" count={2} />}>
        <Network />
      </Suspense>

      {/* 8. Database */}
      <Suspense fallback={<SectionFallback variant="department" count={2} />}>
        <Database />
      </Suspense>

      {/* 9. Security */}
      <Suspense fallback={<SectionFallback variant="department" count={2} />}>
        <Security />
      </Suspense>

      {/* 10. Helpdesk */}
      <Suspense fallback={<SectionFallback variant="department" count={2} />}>
        <Helpdesk />
      </Suspense>

      {/* 11. Certifications */}
      <Suspense fallback={<SectionFallback variant="card" count={6} />}>
        <Certifications />
      </Suspense>

      {/* 12. Contact */}
      <Suspense fallback={<SectionFallback variant="card" count={2} />}>
        <Contact />
      </Suspense>
    </main>
  );
}
