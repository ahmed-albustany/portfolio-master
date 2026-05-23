import { useState, useEffect, useRef, useCallback } from 'react';

export function useScrollSpy(sectionIds, options = {}) {
  const { offset = 120 } = options;
  const [activeSection, setActiveSection] = useState(sectionIds[0] || '');
  const rafId = useRef(null);

  const compute = useCallback(() => {
    const scrollY = window.scrollY + offset;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    /* If scrolled to the very bottom, activate the last section */
    if (scrollY + windowHeight >= docHeight - 2) {
      setActiveSection(sectionIds[sectionIds.length - 1]);
      return;
    }

    /* Walk sections bottom-up and pick the first one whose top is above the offset line */
    for (let i = sectionIds.length - 1; i >= 0; i--) {
      const el = document.getElementById(sectionIds[i]);
      if (el) {
        const rect = el.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY;
        if (sectionTop <= scrollY) {
          setActiveSection(sectionIds[i]);
          return;
        }
      }
    }

    /* Nothing matched — default to first */
    setActiveSection(sectionIds[0]);
  }, [sectionIds, offset]);

  useEffect(() => {
    const handleScroll = () => {
      if (rafId.current) return;
      rafId.current = requestAnimationFrame(() => {
        compute();
        rafId.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    /* Run once on mount */
    compute();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [compute]);

  return activeSection;
}
