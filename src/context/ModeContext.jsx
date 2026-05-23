import { createContext, useState, useCallback, useMemo, useRef } from 'react';

export const ModeContext = createContext(null);

/* ================================================================
   Immersive module preloaders.
   Called ahead-of-time on hover or when the user triggers the
   transition so the chunks are warm by the time we render.
   ================================================================ */

const immersiveModules = {
  particles: () => import('react-tsparticles'),
  particlesSlim: () => import('tsparticles-slim'),
};

/* ================================================================
   Transition timing (ms)
   ================================================================ */

const VOID_EXPAND_MS = 800;    // black circle expands to cover viewport
const HOLD_LOADING_MS = 1600;  // "Initializing Singularity…" text visible
const FADE_OUT_MS = 600;       // overlay fades out revealing immersive sections

export const TRANSITION_TOTAL_MS = VOID_EXPAND_MS + HOLD_LOADING_MS + FADE_OUT_MS;

/* ================================================================
   ModeProvider
   ================================================================ */

export function ModeProvider({ children }) {
  const [mode, setMode] = useState('professional');

  // Transition phases: null → 'void' → 'loading' → 'reveal' → null
  const [transitionPhase, setTransitionPhase] = useState(null);

  const preloadedRef = useRef(false);

  /* ---- Preload heavy libs (idempotent) ---- */
  const preloadImmersiveLibs = useCallback(() => {
    if (preloadedRef.current) return;
    preloadedRef.current = true;
    Object.values(immersiveModules).forEach((loader) => {
      loader().catch(() => {});
    });
  }, []);

  /* ---- Enter immersive with full transition ---- */
  const enterImmersive = useCallback(() => {
    if (mode === 'immersive' || transitionPhase) return;

    preloadImmersiveLibs();

    // Phase 1 — void circle expands
    setTransitionPhase('void');

    setTimeout(() => {
      // Phase 2 — swap mode under the overlay, show loading text
      setMode('immersive');
      setTransitionPhase('loading');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, VOID_EXPAND_MS);

    setTimeout(() => {
      // Phase 3 — fade-out reveal
      setTransitionPhase('reveal');
    }, VOID_EXPAND_MS + HOLD_LOADING_MS);

    setTimeout(() => {
      // Done
      setTransitionPhase(null);
    }, VOID_EXPAND_MS + HOLD_LOADING_MS + FADE_OUT_MS);
  }, [mode, transitionPhase, preloadImmersiveLibs]);

  /* ---- Exit immersive (instant, no heavy transition) ---- */
  const exitImmersive = useCallback(() => {
    setMode('professional');
    setTransitionPhase(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  /* ---- Toggle (convenience) ---- */
  const toggleMode = useCallback(() => {
    if (mode === 'professional') {
      enterImmersive();
    } else {
      exitImmersive();
    }
  }, [mode, enterImmersive, exitImmersive]);

  /* ---- Stable context value ---- */
  const value = useMemo(
    () => ({
      mode,
      setMode,
      toggleMode,
      enterImmersive,
      exitImmersive,
      isProfessional: mode === 'professional',
      isImmersive: mode === 'immersive',
      preloadImmersiveLibs,
      transitionPhase,      // 'void' | 'loading' | 'reveal' | null
      isTransitioning: transitionPhase !== null,
    }),
    [mode, toggleMode, enterImmersive, exitImmersive, preloadImmersiveLibs, transitionPhase],
  );

  return (
    <ModeContext.Provider value={value}>
      {children}
    </ModeContext.Provider>
  );
}
