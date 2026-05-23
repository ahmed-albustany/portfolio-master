import { createContext, useState, useCallback, useMemo, useRef } from 'react';

export const ModeContext = createContext({
  mode: 'professional',
  isDeepSystem: false,
  isTransitioning: false,
  hasPlayedIntro: false,
  enterDeepSystem: () => {},
  exitDeepSystem: () => {},
});

export function ModeProvider({ children }) {
  const [mode, setMode] = useState('professional');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const preloadedRef = useRef(false);

  const enterDeepSystem = useCallback(() => {
    setIsTransitioning(true);

    // Lazy-load DeepSystemShell on first activation
    if (!preloadedRef.current) {
      import('@/components/sections/deepsystem/DeepSystemShell').catch(() => {});
      preloadedRef.current = true;
    }

    setTimeout(() => {
      setMode('deepsystem');
      setIsTransitioning(false);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 300);
  }, []);

  const exitDeepSystem = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setMode('professional');
      setIsTransitioning(false);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 600);
  }, []);

  // Check sessionStorage for intro played status
  const hasPlayedIntro = useMemo(() => {
    try {
      return sessionStorage.getItem('deep_system_intro_played') === 'true';
    } catch {
      return false;
    }
  }, []);

  const value = useMemo(
    () => ({
      mode,
      isDeepSystem: mode === 'deepsystem',
      isTransitioning,
      hasPlayedIntro,
      enterDeepSystem,
      exitDeepSystem,
    }),
    [mode, isTransitioning, hasPlayedIntro, enterDeepSystem, exitDeepSystem],
  );

  return (
    <ModeContext.Provider value={value}>
      {children}
    </ModeContext.Provider>
  );
}
