import { createContext, useEffect, useMemo } from 'react';

export const ThemeContext = createContext({
  theme: 'dark',
  isDark: true,
});

export function ThemeProvider({ children }) {
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', 'dark');
    root.classList.remove('light');
    root.classList.add('dark');
    localStorage.removeItem('portfolio-theme');

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', '#060B14');
    }
  }, []);

  const value = useMemo(() => ({ theme: 'dark', isDark: true }), []);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
