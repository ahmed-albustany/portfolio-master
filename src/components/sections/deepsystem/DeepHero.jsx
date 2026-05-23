import { useState, useEffect, useContext, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ModeContext } from '@/context/ModeContext';
import { useFirestore } from '@/hooks/useFirestore';
import { getPersonalInfo, getStats } from '@/firebase/firestore';
import { fallbackPersonalInfo, fallbackStats } from '@/data/fallbackData';

/* ================================================================
   GLITCH TEXT
   ================================================================ */

function GlitchText({ text, className = '' }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      <motion.span
        className="absolute top-0 left-0 z-20"
        style={{ color: '#00FF88', clipPath: 'inset(0 0 65% 0)' }}
        animate={{ x: [0, -2, 3, 0, -1, 0], opacity: [1, 0.8, 1, 0.9, 1] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        aria-hidden
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute top-0 left-0 z-20"
        style={{ color: '#00D4FF', clipPath: 'inset(60% 0 0 0)' }}
        animate={{ x: [0, 2, -3, 0, 1, 0], opacity: [1, 0.7, 1, 0.85, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4 }}
        aria-hidden
      >
        {text}
      </motion.span>
    </span>
  );
}

/* ================================================================
   TYPING EFFECT
   ================================================================ */

function TypeLine({ text, delay = 0, style = {} }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 25);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);

  return (
    <p className="text-xs sm:text-sm font-mono" style={style}>
      {displayed}
      {displayed.length < text.length && (
        <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>_</motion.span>
      )}
    </p>
  );
}

/* ================================================================
   DATA READOUT
   ================================================================ */

function DataReadout({ label, value, accent = '#00FF41', delay = 0 }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (!show) return null;

  return (
    <motion.div
      className="flex items-center justify-between px-4 py-2.5 rounded-lg"
      style={{ backgroundColor: 'rgba(0,255,65,0.03)', border: '1px solid rgba(0,255,65,0.08)' }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <span className="text-[10px] font-mono font-semibold uppercase tracking-widest" style={{ color: '#00FF4160' }}>
        {label}
      </span>
      <span className="text-sm font-mono font-bold" style={{ color: accent }}>
        {value}
      </span>
    </motion.div>
  );
}

/* ================================================================
   DEEP HERO
   ================================================================ */

export default function DeepHero() {
  const { exitDeepSystem } = useContext(ModeContext);
  const { data: info } = useFirestore(getPersonalInfo, fallbackPersonalInfo);
  const { data: stats } = useFirestore(getStats, fallbackStats);

  const statItems = useMemo(() => [
    { label: 'Projects Built', value: stats?.projects || 0 },
    { label: 'Years Active', value: stats?.years || 0 },
    { label: 'Users Managed', value: stats?.users || 0 },
    { label: 'Certifications', value: stats?.certifications || 0 },
    { label: 'Systems Deployed', value: stats?.systems || 0 },
    { label: 'Tickets Resolved', value: stats?.tickets || 0 },
  ], [stats]);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)' }} />

      <div className="relative z-10 max-w-5xl w-full">
        {/* Terminal header */}
        <motion.div
          className="flex items-center gap-2 px-4 py-2.5 rounded-t-lg"
          style={{ backgroundColor: 'rgba(0,255,65,0.05)', borderBottom: '1px solid rgba(0,255,65,0.1)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF3B3B]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFB800]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#00FF88]" />
          <span className="flex-1 text-center text-[9px] font-mono uppercase tracking-widest" style={{ color: '#00FF4140' }}>
            deep_system@mainframe ~ profile
          </span>
        </motion.div>

        {/* Terminal body */}
        <div
          className="p-6 sm:p-8 rounded-b-lg"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', border: '1px solid rgba(0,255,65,0.08)', borderTop: 'none' }}
        >
          {/* Access lines */}
          <div className="space-y-1.5 mb-8">
            <TypeLine text={`> ACCESSING PROFILE: ${(info?.name || 'AHMED_ALBUSTANY').toUpperCase().replace(/ /g, '_')}`}
              delay={200} style={{ color: '#00FF41' }} />
            <TypeLine text="> CLEARANCE: MAXIMUM" delay={1200} style={{ color: '#00FF88' }} />
            <TypeLine text="> STATUS: ONLINE" delay={2000} style={{ color: '#00FF88' }} />
          </div>

          {/* Name with glitch */}
          <motion.div
            className="mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight"
              style={{ color: '#FFFFFF', textShadow: '0 0 30px rgba(255,255,255,0.2), 0 0 60px rgba(0,255,136,0.15)' }}>
              <GlitchText text={info?.name || 'AHMED ALBUSTANY'} />
            </h1>
          </motion.div>

          {/* Role */}
          <motion.p
            className="text-sm sm:text-base font-mono font-semibold mb-6"
            style={{ color: '#00FF4180' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8, duration: 0.5 }}
          >
            {'>'} {info?.title || 'IT OFFICER'} <span style={{ color: '#00FF4140' }}>@</span> {info?.location || 'AMMAN, JORDAN'}
          </motion.p>

          {/* Bio */}
          {info?.bio && (
            <motion.p
              className="text-xs leading-relaxed font-mono mb-8 max-w-xl"
              style={{ color: '#00FF4150' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3, duration: 0.5 }}
            >
              {info.bio}
            </motion.p>
          )}

          {/* Stats readout */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2, duration: 0.5 }}
          >
            <p className="text-[9px] font-mono font-semibold uppercase tracking-widest mb-3"
              style={{ color: '#00FF4140' }}>
              {'// SYSTEM METRICS'}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {statItems.map((stat, i) => (
                <DataReadout
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  delay={3400 + i * 100}
                />
              ))}
            </div>
          </motion.div>

          {/* Command buttons */}
          <motion.div
            className="flex flex-wrap gap-3 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4, duration: 0.5 }}
          >
            <a
              href="#skills"
              className="px-5 py-2.5 text-[10px] font-mono font-bold uppercase tracking-widest rounded-lg
                         transition-all hover:brightness-125"
              style={{
                color: '#00FF41',
                backgroundColor: 'rgba(0,255,65,0.1)',
                border: '1px solid rgba(0,255,65,0.25)',
                textShadow: '0 0 10px rgba(0,255,65,0.3)',
              }}
            >
              [./view_operations]
            </a>
            {info?.resumeUrl && (
              <a
                href={info.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 text-[10px] font-mono font-bold uppercase tracking-widest rounded-lg
                           transition-all hover:brightness-125"
                style={{
                  color: '#00D4FF',
                  backgroundColor: 'rgba(0,212,255,0.08)',
                  border: '1px solid rgba(0,212,255,0.2)',
                }}
              >
                [./download_cv]
              </a>
            )}
            <button
              onClick={exitDeepSystem}
              className="px-5 py-2.5 text-[10px] font-mono font-bold uppercase tracking-widest rounded-lg
                         transition-all hover:brightness-125"
              style={{
                color: '#FF3B3B',
                backgroundColor: 'rgba(255,59,59,0.08)',
                border: '1px solid rgba(255,59,59,0.2)',
              }}
            >
              [./exit_deep_system]
            </button>
          </motion.div>
        </div>

        {/* Data flow line */}
        <motion.div
          className="h-px mt-8 mx-auto"
          style={{ background: 'linear-gradient(90deg, transparent, #00FF4130, transparent)' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 4.2, duration: 1 }}
        />
      </div>
    </section>
  );
}
