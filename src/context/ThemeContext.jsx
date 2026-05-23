import { createContext, useState, useEffect, useCallback, useMemo } from 'react';

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('portfolio-theme');
      if (stored === 'dark' || stored === 'light') return stored;
    } catch {
      /* localStorage unavailable */
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove('dark', 'light');
    root.classList.add(theme);

    root.setAttribute('data-theme', theme);

    try {
      localStorage.setItem('portfolio-theme', theme);
    } catch {
      /* localStorage unavailable */
    }

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        theme === 'dark' ? '#0a0a0f' : '#f8fafc'
      );
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      isDark: theme === 'dark',
      isLight: theme === 'light',
    }),
    [theme, setTheme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
