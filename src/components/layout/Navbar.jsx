import { useState, useContext, useCallback, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { ModeContext } from '@/context/ModeContext';
import { navLinks, fallbackPersonalInfo } from '@/data/fallbackData';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { useFirestore } from '@/hooks/useFirestore';
import { getPersonalInfo } from '@/firebase/firestore';
import { HiMenu, HiX } from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';

/* ------------------------------------------------------------------ */
/*  Systems dropdown items                                             */
/* ------------------------------------------------------------------ */
const systemsSubItems = [
  { id: 'sysadmin', label: 'Systems Administration', icon: '\u2B21' },
  { id: 'network', label: 'Network Administration', icon: '\u25C8' },
  { id: 'database', label: 'Database Administration', icon: '\u25C9' },
  { id: 'security', label: 'Security & Surveillance', icon: '\u25CE' },
  { id: 'helpdesk', label: 'IT Helpdesk & Support', icon: '\u25F7' },
];

/* ------------------------------------------------------------------ */
/*  Desktop nav structure                                              */
/* ------------------------------------------------------------------ */
const desktopNav = [
  { label: 'PROFILE', scrollTo: 'hero', activeIds: ['hero', 'skills'] },
  { label: 'OPERATOR', scrollTo: 'about', activeIds: ['about'] },
  { label: 'OPERATIONS', scrollTo: 'projects', activeIds: ['projects', 'experience', 'certifications'] },
  { label: 'SYSTEMS', scrollTo: 'sysadmin', activeIds: ['sysadmin', 'network', 'database', 'security', 'helpdesk'], hasDropdown: true },
  { label: 'CONTACT', scrollTo: 'contact', activeIds: ['contact'] },
];

/* ------------------------------------------------------------------ */
/*  Mobile nav links (flat, with systems sub-items indented)           */
/* ------------------------------------------------------------------ */
const mobileNavLinks = [
  { id: 'hero', label: 'Profile', indent: false },
  { id: 'about', label: 'Operator', indent: false },
  { id: 'projects', label: 'Operations', indent: false },
  { id: 'experience', label: 'Experience', indent: true },
  { id: 'certifications', label: 'Certifications', indent: true },
  { id: 'sysadmin', label: '\u2B21 Systems Administration', indent: false, isSystem: true },
  { id: 'network', label: '\u25C8 Network Administration', indent: true, isSystem: true },
  { id: 'database', label: '\u25C9 Database Administration', indent: true, isSystem: true },
  { id: 'security', label: '\u25CE Security & Surveillance', indent: true, isSystem: true },
  { id: 'helpdesk', label: '\u25F7 IT Helpdesk & Support', indent: true, isSystem: true },
  { id: 'contact', label: 'Contact', indent: false },
];

const sectionIds = navLinks.map((l) => l.id);

/* ------------------------------------------------------------------ */
/*  Systems Dropdown                                                   */
/* ------------------------------------------------------------------ */
function SystemsDropdown({ onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.18 }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 rounded-lg overflow-hidden z-50
                 border font-mono"
      style={{
        backgroundColor: '#0D1520',
        borderColor: 'rgba(0,212,255,0.2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 16px rgba(0,212,255,0.08)',
      }}
    >
      <div className="py-1.5">
        {systemsSubItems.map((item, i) => (
          <motion.button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className="w-full text-left px-4 py-2.5 text-[11px] font-mono tracking-wide
                       transition-colors duration-150 flex items-center gap-2.5"
            style={{ color: 'var(--color-text-secondary)' }}
            whileHover={{ color: '#00D4FF', backgroundColor: 'rgba(0,212,255,0.06)', x: 4 }}
            transition={{ duration: 0.15 }}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
          >
            <span className="text-sm opacity-60">{item.icon}</span>
            {item.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Navbar                                                             */
/* ------------------------------------------------------------------ */
export default function Navbar() {
  const { isDeepSystem, enterDeepSystem } = useContext(ModeContext);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const activeId = useScrollSpy(isHome ? sectionIds : []);
  const { data: personalInfo } = useFirestore(getPersonalInfo, fallbackPersonalInfo);

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [systemsOpen, setSystemsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const lastScrollY = useRef(0);
  const systemsTimeoutRef = useRef(null);
  const { scrollY } = useScroll();

  const isAvailable = personalInfo?.availability
    ? /available/i.test(personalInfo.availability)
    : true;

  const githubUrl = personalInfo?.socialLinks?.github || 'https://github.com/ahmed-albustany';

  useMotionValueEvent(scrollY, 'change', (v) => {
    setIsScrolled(v > 50);
    if (v > lastScrollY.current && v > 100) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
    lastScrollY.current = v;
  });

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const scrollToSection = useCallback((id) => {
    setIsOpen(false);
    setSystemsOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const isGroupActive = (ids) => ids.includes(activeId);

  const handleSystemsEnter = () => {
    if (systemsTimeoutRef.current) clearTimeout(systemsTimeoutRef.current);
    setSystemsOpen(true);
  };

  const handleSystemsLeave = () => {
    systemsTimeoutRef.current = setTimeout(() => setSystemsOpen(false), 150);
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -80 }}
      animate={{ y: isHidden && !isOpen ? -80 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glassmorphism bar */}
      <div
        className="transition-all duration-300"
        style={{
          backgroundColor: isScrolled ? 'rgba(6,11,20,0.8)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(12px) saturate(1.2)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(12px) saturate(1.2)' : 'none',
          borderBottom: isScrolled
            ? '1px solid var(--color-border-primary)'
            : '1px solid transparent',
        }}
      >
        <nav className="section-container flex items-center justify-between h-16">
          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              className="w-9 h-9 rounded-lg flex items-center justify-center font-heading font-bold text-xs
                         transition-all duration-300"
              style={{
                backgroundColor: 'rgba(0,212,255,0.12)',
                color: '#00D4FF',
                border: '1px solid rgba(0,212,255,0.3)',
                boxShadow: '0 0 12px rgba(0,212,255,0.15)',
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              AC
            </motion.div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span
                className="text-[11px] font-heading font-bold tracking-wide"
                style={{ color: 'var(--color-text-primary)' }}
              >
                AHMED ALBUSTANY
              </span>
              <span
                className="text-[9px] font-mono tracking-wider uppercase"
                style={{ color: 'var(--color-text-muted)' }}
              >
                IT Officer &amp; Full-Stack Developer
              </span>
              {isAvailable && (
                <span className="flex items-center gap-1 mt-0.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: '#00FF88',
                      boxShadow: '0 0 6px rgba(0,255,136,0.6)',
                      animation: 'pulse-dot 2s ease-in-out infinite',
                    }}
                  />
                  <span
                    className="text-[9px] font-mono font-semibold tracking-widest uppercase"
                    style={{ color: '#00FF88' }}
                  >
                    Available
                  </span>
                </span>
              )}
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden lg:flex items-center gap-1">
            {desktopNav.map((item) => {
              const active = isGroupActive(item.activeIds);

              if (item.hasDropdown) {
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={handleSystemsEnter}
                    onMouseLeave={handleSystemsLeave}
                  >
                    <button
                      onClick={() => scrollToSection(item.scrollTo)}
                      className="relative px-4 py-2 text-[11px] font-mono font-semibold tracking-wider
                                 rounded-md transition-all duration-200"
                      style={{
                        color: active ? '#0066FF' : 'var(--color-text-muted)',
                        backgroundColor: active ? 'rgba(0,102,255,0.08)' : 'transparent',
                      }}
                    >
                      <span className="flex items-center gap-2">
                        {active && (
                          <motion.span
                            layoutId="nav-indicator"
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                              backgroundColor: '#00D4FF',
                              boxShadow: '0 0 8px rgba(0,212,255,0.6)',
                            }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        )}
                        {item.label}
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" className="opacity-50">
                          <path d="M1 3L4 6L7 3" stroke="currentColor" strokeWidth="1.2" fill="none" />
                        </svg>
                      </span>
                    </button>

                    <AnimatePresence>
                      {systemsOpen && (
                        <SystemsDropdown onSelect={scrollToSection} />
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.scrollTo)}
                  className="relative px-4 py-2 text-[11px] font-mono font-semibold tracking-wider
                             rounded-md transition-all duration-200"
                  style={{
                    color: active ? '#0066FF' : 'var(--color-text-muted)',
                    backgroundColor: active ? 'rgba(0,102,255,0.08)' : 'transparent',
                  }}
                >
                  <span className="flex items-center gap-2">
                    {active && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: '#00D4FF',
                          boxShadow: '0 0 8px rgba(0,212,255,0.6)',
                        }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── Right side controls ── */}
          <div className="flex items-center gap-2">
            {/* GitHub icon */}
            <motion.a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg transition-colors duration-200"
              style={{
                color: 'var(--color-text-muted)',
                backgroundColor: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border-primary)',
              }}
              aria-label="GitHub profile"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaGithub className="w-4 h-4" />
            </motion.a>

            {/* Deep System button */}
            <div
              className="relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <button
                onClick={enterDeepSystem}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-[10px] font-mono font-semibold
                           uppercase tracking-wider rounded-md border transition-all duration-300 hover:scale-105"
                style={{
                  color: isDeepSystem ? '#060B14' : '#00FF88',
                  borderColor: 'rgba(0,255,136,0.3)',
                  backgroundColor: isDeepSystem ? '#00FF88' : 'rgba(0,255,136,0.05)',
                  boxShadow: isDeepSystem
                    ? '0 0 20px rgba(0,255,136,0.4)'
                    : '0 0 10px rgba(0,255,136,0.1)',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: '#00FF88',
                    boxShadow: '0 0 6px rgba(0,255,136,0.6)',
                    animation: 'pulse-dot 2s ease-in-out infinite',
                  }}
                />
                Deep System
              </button>

              {/* Tooltip */}
              <AnimatePresence>
                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 px-3 py-1.5 rounded-md text-[10px] font-mono
                               whitespace-nowrap pointer-events-none hidden sm:block"
                    style={{
                      backgroundColor: '#0D1520',
                      color: '#00FF88',
                      border: '1px solid rgba(0,255,136,0.2)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                    }}
                  >
                    Enter immersive experience
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg lg:hidden transition-colors duration-200"
              style={{
                color: 'var(--color-text-muted)',
                backgroundColor: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border-primary)',
              }}
              aria-label="Toggle menu"
            >
              {isOpen ? <HiX className="w-4 h-4" /> : <HiMenu className="w-4 h-4" />}
            </button>
          </div>
        </nav>
      </div>

      {/* ── Mobile full-screen overlay ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-16 lg:hidden z-40"
            style={{
              backgroundColor: 'rgba(6,11,20,0.95)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            <nav className="section-container py-8 space-y-1 overflow-y-auto max-h-[calc(100vh-4rem)]">
              {/* Availability badge on mobile */}
              {isAvailable && (
                <div className="flex items-center gap-2 px-4 py-2 mb-4">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: '#00FF88',
                      boxShadow: '0 0 6px rgba(0,255,136,0.6)',
                      animation: 'pulse-dot 2s ease-in-out infinite',
                    }}
                  />
                  <span
                    className="text-[10px] font-mono font-semibold tracking-widest uppercase"
                    style={{ color: '#00FF88' }}
                  >
                    Available for opportunities
                  </span>
                </div>
              )}

              {mobileNavLinks.map((link, i) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                  onClick={() => scrollToSection(link.id)}
                  className="w-full text-left py-3 text-sm font-mono rounded-lg
                             transition-colors duration-200 flex items-center gap-3"
                  style={{
                    paddingLeft: link.indent ? '2.5rem' : '1rem',
                    paddingRight: '1rem',
                    color: activeId === link.id
                      ? (link.isSystem ? '#00D4FF' : '#0066FF')
                      : 'var(--color-text-secondary)',
                    backgroundColor: activeId === link.id ? 'rgba(0,102,255,0.08)' : 'transparent',
                    fontSize: link.indent ? '13px' : '14px',
                  }}
                >
                  {activeId === link.id && (
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: '#00D4FF',
                        boxShadow: '0 0 8px rgba(0,212,255,0.6)',
                      }}
                    />
                  )}
                  {link.label}
                </motion.button>
              ))}

              {/* GitHub link in mobile */}
              <motion.a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: mobileNavLinks.length * 0.04, duration: 0.2 }}
                className="w-full text-left px-4 py-3 text-sm font-mono rounded-lg flex items-center gap-3
                           mt-2 border"
                style={{
                  color: 'var(--color-text-secondary)',
                  borderColor: 'var(--color-border-primary)',
                  backgroundColor: 'var(--color-bg-secondary)',
                }}
              >
                <FaGithub className="w-4 h-4" />
                GitHub Profile
              </motion.a>

              {/* Deep System entry in mobile menu */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: (mobileNavLinks.length + 1) * 0.04, duration: 0.2 }}
                onClick={() => { enterDeepSystem(); setIsOpen(false); }}
                className="w-full text-left px-4 py-3 text-sm font-mono rounded-lg flex items-center gap-3
                           mt-2 border"
                style={{
                  color: '#00FF88',
                  borderColor: 'rgba(0,255,136,0.2)',
                  backgroundColor: 'rgba(0,255,136,0.05)',
                }}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: '#00FF88',
                    boxShadow: '0 0 6px rgba(0,255,136,0.6)',
                    animation: 'pulse-dot 2s ease-in-out infinite',
                  }}
                />
                Enter Deep System
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
