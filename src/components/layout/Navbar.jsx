import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';
import { ThemeContext } from '@/context/ThemeContext';
import { ModeContext } from '@/context/ModeContext';
import { navLinks } from '@/data/portfolioData';
import { useScrollSpy } from '@/hooks/useScrollSpy';

/* ================================================================
   ANIMATED ICON COMPONENTS
   ================================================================ */

function SunMoonToggle({ isDark, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="relative flex items-center justify-center w-10 h-10 rounded-xl
                 hover:bg-primary/10 transition-colors duration-200"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      whileTap={{ scale: 0.85 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.svg
            key="sun"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 text-amber-400"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <circle cx="12" cy="12" r="5" />
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.2 }}
            >
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </motion.g>
          </motion.svg>
        ) : (
          <motion.svg
            key="moon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 text-indigo-500"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function HamburgerToggle({ isOpen, onClick }) {
  const barBase = 'absolute left-[3px] h-[2.5px] rounded-full';

  return (
    <motion.button
      onClick={onClick}
      className="relative flex items-center justify-center w-10 h-10 rounded-xl
                 lg:hidden hover:bg-primary/10 transition-colors duration-200"
      style={{ color: 'var(--color-text-muted)' }}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      whileTap={{ scale: 0.85 }}
    >
      <div className="relative w-[22px] h-[22px]">
        {/* Top bar */}
        <motion.div
          className={barBase}
          style={{ width: 16, backgroundColor: 'currentColor' }}
          animate={isOpen
            ? { top: 10, left: 3, rotate: 45, width: 16 }
            : { top: 5, left: 2, rotate: 0, width: 16 }
          }
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        />
        {/* Middle bar */}
        <motion.div
          className={barBase}
          style={{ top: 10, width: 16, backgroundColor: 'currentColor' }}
          animate={isOpen
            ? { opacity: 0, width: 0 }
            : { opacity: 1, width: 16 }
          }
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        />
        {/* Bottom bar */}
        <motion.div
          className={barBase}
          style={{ width: 16, backgroundColor: 'currentColor' }}
          animate={isOpen
            ? { top: 10, left: 3, rotate: -45, width: 16 }
            : { top: 15, left: 2, rotate: 0, width: 16 }
          }
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </motion.button>
  );
}

/* ================================================================
   HOOK: useScrollDirection — hide on down, show on up
   ================================================================ */

function useScrollDirection(threshold = 10) {
  const [visible, setVisible] = useState(true);
  const [atTop, setAtTop] = useState(true);
  const { scrollY } = useScroll();
  const lastY = useRef(0);
  const ticking = useRef(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (ticking.current) return;
    ticking.current = true;

    requestAnimationFrame(() => {
      const diff = latest - lastY.current;

      setAtTop(latest < 20);

      if (Math.abs(diff) > threshold) {
        setVisible(diff < 0 || latest < 20);
        lastY.current = latest;
      }

      ticking.current = false;
    });
  });

  return { visible, atTop };
}

/* ================================================================
   NAVBAR COMPONENT
   ================================================================ */

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const { isProfessional, toggleMode, preloadImmersiveLibs } = useContext(ModeContext);
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  const sectionIds = navLinks.map((link) => link.id);
  const activeSection = useScrollSpy(sectionIds, { offset: 120 });
  const { visible, atTop } = useScrollDirection(8);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  /* Close mobile menu on route change */
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  /* Close mobile menu on resize past breakpoint */
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const handler = (e) => { if (e.matches) setMobileOpen(false); };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      const navHeight = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setMobileOpen(false);
  }, []);

  /* ---- Animation Variants ---- */

  const navbarVariants = {
    visible: {
      y: 0,
      transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
    },
    hidden: {
      y: '-100%',
      transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
    },
  };

  const overlayVariants = {
    closed: {
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
    open: {
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  };

  const menuVariants = {
    closed: {
      x: '100%',
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    },
    open: {
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.06,
        delayChildren: 0.1,
      },
    },
  };

  const menuItemVariants = {
    closed: { opacity: 0, x: 40 },
    open: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
    },
  };

  const logoLetters = 'Portfolio'.split('');

  return (
    <>
      {/* ===== NAVBAR BAR ===== */}
      <motion.nav
        variants={navbarVariants}
        animate={visible || mobileOpen ? 'visible' : 'hidden'}
        initial="visible"
        className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${
          atTop && !mobileOpen
            ? 'shadow-none'
            : 'shadow-lg shadow-black/5 dark:shadow-black/20'
        }`}
        style={{
          backgroundColor: atTop && !mobileOpen
            ? 'transparent'
            : 'var(--color-surface-glass)',
          borderBottom: atTop && !mobileOpen
            ? '1px solid transparent'
            : '1px solid var(--color-border-subtle)',
          backdropFilter: atTop && !mobileOpen ? 'none' : 'blur(20px) saturate(1.8)',
          WebkitBackdropFilter: atTop && !mobileOpen ? 'none' : 'blur(20px) saturate(1.8)',
        }}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">

            {/* ---- Logo ---- */}
            <Link
              to="/"
              className="relative flex items-center gap-0.5 group"
              aria-label="Home"
            >
              <motion.span
                className="text-xl sm:text-2xl font-bold font-display tracking-tight flex"
                style={{ color: 'var(--color-text-primary)' }}
                initial="hidden"
                animate="visible"
              >
                {logoLetters.map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.1 + i * 0.04,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    className="inline-block group-hover:text-primary transition-colors duration-200"
                    style={{ transitionDelay: `${i * 20}ms` }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.span>
              <motion.span
                className="text-xl sm:text-2xl font-bold text-primary"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.5,
                  type: 'spring',
                  stiffness: 400,
                  damping: 12,
                }}
              >
                .
              </motion.span>
            </Link>

            {/* ---- Desktop Nav Links ---- */}
            {isHomePage && (
              <div className="hidden lg:flex items-center gap-0.5">
                {navLinks.map((link, i) => {
                  const isActive = activeSection === link.id;
                  return (
                    <motion.button
                      key={link.id}
                      onClick={() => scrollTo(link.id)}
                      className="relative px-3 xl:px-4 py-2 text-sm font-medium rounded-lg
                                 transition-colors duration-200"
                      style={{
                        color: isActive
                          ? 'var(--color-accent)'
                          : 'var(--color-text-muted)',
                      }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 + i * 0.04 }}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-10">{link.label}</span>

                      {/* Active indicator pill */}
                      {isActive && (
                        <motion.div
                          layoutId="nav-active-pill"
                          className="absolute inset-0 rounded-lg"
                          style={{ backgroundColor: 'var(--color-accent-muted)' }}
                          transition={{
                            type: 'spring',
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}

                      {/* Active bottom dot */}
                      {isActive && (
                        <motion.div
                          layoutId="nav-active-dot"
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                          transition={{
                            type: 'spring',
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* ---- Right Controls ---- */}
            <div className="flex items-center gap-1 sm:gap-2">

              {/* Theme Toggle */}
              <SunMoonToggle isDark={isDark} onClick={toggleTheme} />

              {/* Enter the Universe / Professional Mode — desktop */}
              {isHomePage && (
                <motion.button
                  onClick={toggleMode}
                  onMouseEnter={isProfessional ? preloadImmersiveLibs : undefined}
                  className="hidden sm:inline-flex items-center gap-2 px-3 lg:px-4 py-2
                             text-sm font-semibold rounded-xl border transition-all duration-300
                             active:scale-95"
                  style={{
                    color: isProfessional ? '#A855F7' : 'var(--color-accent)',
                    borderColor: isProfessional
                      ? 'rgba(168, 85, 247, 0.3)'
                      : 'var(--color-accent-muted)',
                    backgroundColor: isProfessional
                      ? 'rgba(168, 85, 247, 0.08)'
                      : 'var(--color-accent-muted)',
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  whileHover={{
                    scale: 1.04,
                    boxShadow: isProfessional
                      ? '0 0 20px rgba(168, 85, 247, 0.3)'
                      : '0 0 20px rgba(0, 212, 255, 0.3)',
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Rocket icon */}
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                    animate={isProfessional
                      ? { rotate: [0, -10, 10, 0] }
                      : { rotate: 0 }
                    }
                    transition={{
                      duration: 2,
                      repeat: isProfessional ? Infinity : 0,
                      repeatDelay: 3,
                    }}
                  >
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                  </motion.svg>

                  <span className="hidden lg:inline">
                    {isProfessional ? 'Enter the Universe' : 'Professional'}
                  </span>
                  <span className="lg:hidden">
                    {isProfessional ? 'Universe' : 'Pro'}
                  </span>
                </motion.button>
              )}

              {/* Hamburger — mobile/tablet */}
              <HamburgerToggle
                isOpen={mobileOpen}
                onClick={() => setMobileOpen((prev) => !prev)}
              />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ===== MOBILE FULL-SCREEN OVERLAY MENU ===== */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-0 z-40 lg:hidden"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Slide-in Panel */}
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 bottom-0 z-40 w-full xs:w-80 sm:w-96 lg:hidden
                         flex flex-col overflow-y-auto"
              style={{
                backgroundColor: 'var(--color-bg-primary)',
                borderLeft: '1px solid var(--color-border-subtle)',
              }}
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between h-16 sm:h-18 px-6 sm:px-8"
                   style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                <motion.span
                  className="text-lg font-bold font-display"
                  style={{ color: 'var(--color-text-primary)' }}
                  variants={menuItemVariants}
                >
                  Navigation
                </motion.span>
                <HamburgerToggle
                  isOpen={mobileOpen}
                  onClick={() => setMobileOpen(false)}
                />
              </div>

              {/* Menu Links */}
              <nav className="flex-1 flex flex-col justify-center px-6 sm:px-8 py-8 gap-1">
                {isHomePage && navLinks.map((link, i) => {
                  const isActive = activeSection === link.id;
                  return (
                    <motion.button
                      key={link.id}
                      variants={menuItemVariants}
                      onClick={() => scrollTo(link.id)}
                      className="group relative flex items-center gap-4 w-full text-left px-4 py-4
                                 rounded-xl transition-colors duration-200"
                      style={{
                        color: isActive
                          ? 'var(--color-accent)'
                          : 'var(--color-text-secondary)',
                        backgroundColor: isActive
                          ? 'var(--color-accent-muted)'
                          : 'transparent',
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Number */}
                      <span
                        className="w-8 text-xs font-mono"
                        style={{
                          color: isActive
                            ? 'var(--color-accent)'
                            : 'var(--color-text-muted)',
                        }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>

                      {/* Label */}
                      <span className="text-lg font-display font-semibold">
                        {link.label}
                      </span>

                      {/* Active bar */}
                      {isActive && (
                        <motion.div
                          layoutId="mobile-active-bar"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-primary"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  );
                })}

                {!isHomePage && (
                  <motion.div variants={menuItemVariants}>
                    <Link
                      to="/"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-4 w-full px-4 py-4 rounded-xl text-lg
                                 font-display font-semibold"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      <span className="w-8 text-xs font-mono"
                            style={{ color: 'var(--color-text-muted)' }}>01</span>
                      Home
                    </Link>
                  </motion.div>
                )}
              </nav>

              {/* Menu Footer — Mode Switch */}
              {isHomePage && (
                <div className="px-6 sm:px-8 pb-8">
                  <motion.button
                    variants={menuItemVariants}
                    onClick={() => { toggleMode(); setMobileOpen(false); }}
                    onMouseEnter={isProfessional ? preloadImmersiveLibs : undefined}
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-xl
                               text-base font-semibold border transition-all duration-300
                               active:scale-95"
                    style={{
                      color: isProfessional ? '#A855F7' : 'var(--color-accent)',
                      borderColor: isProfessional
                        ? 'rgba(168, 85, 247, 0.3)'
                        : 'var(--color-accent-muted)',
                      backgroundColor: isProfessional
                        ? 'rgba(168, 85, 247, 0.08)'
                        : 'var(--color-accent-muted)',
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Rocket icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                    </svg>
                    {isProfessional ? 'Enter the Universe' : 'Professional Mode'}
                  </motion.button>

                  {/* Subtle branding */}
                  <motion.p
                    variants={menuItemVariants}
                    className="text-center text-xs mt-6 font-mono"
                    style={{ color: 'var(--color-text-muted)', opacity: 0.5 }}
                  >
                    &copy; {new Date().getFullYear()} Portfolio
                  </motion.p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
