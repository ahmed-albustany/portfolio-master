import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { HiExternalLink, HiShieldCheck, HiBadgeCheck } from 'react-icons/hi';
import { certifications as staticCerts } from '@/data/portfolioData';
import { getDocuments } from '@/firebase/firestore';

/* ================================================================
   CONSTANTS
   ================================================================ */

const CATEGORY_ACCENT = {
  cloud:    '#00D4FF',
  dev:      '#A855F7',
  security: '#EF4444',
  it:       '#10B981',
};

const DEFAULT_ACCENT = '#00D4FF';

/* ================================================================
   ANIMATION VARIANTS
   ================================================================ */

const sectionHeader = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const gridContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const cardReveal = {
  hidden: { opacity: 0, y: 40, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] },
  },
};

/* ================================================================
   HOOK: useFirestoreCerts
   Loads from Firestore, falls back to static data.
   ================================================================ */

function useFirestoreCerts() {
  const [certs, setCerts] = useState(staticCerts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const docs = await getDocuments('certificates', 'date');
        if (!cancelled && docs.length > 0) {
          setCerts(docs);
        }
      } catch {
        /* Firestore unavailable — keep static data */
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { certs, loading };
}

/* ================================================================
   FLIP CARD
   Uses CSS perspective + Framer Motion rotateY for the flip.
   Hover on desktop, tap toggles on mobile.
   ================================================================ */

function FlipCard({ cert }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const accent = CATEGORY_ACCENT[cert.category] || DEFAULT_ACCENT;

  return (
    <motion.div
      variants={cardReveal}
      className="group h-[320px] sm:h-[340px] cursor-pointer"
      style={{ perspective: 1000 }}
      onHoverStart={() => setIsFlipped(true)}
      onHoverEnd={() => setIsFlipped(false)}
      onTap={() => setIsFlipped((prev) => !prev)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* ---- FRONT ---- */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden
                     flex flex-col items-center justify-center p-6 sm:p-8 text-center"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-border-primary)',
          }}
        >
          {/* Top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            }}
          />

          {/* Badge image / Fallback icon */}
          <div
            className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28
                       mb-5 rounded-2xl overflow-hidden transition-transform duration-300
                       group-hover:scale-105"
            style={{ backgroundColor: `${accent}10` }}
          >
            {cert.badgeImage ? (
              <img
                src={cert.badgeImage}
                alt={cert.name}
                className="w-full h-full object-contain p-3"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            {/* Fallback icon — shown if no image or image fails */}
            <HiShieldCheck
              className={`w-12 h-12 sm:w-14 sm:h-14 absolute ${cert.badgeImage ? 'hidden' : ''}`}
              style={{ color: accent }}
            />
          </div>

          {/* Issuer */}
          <p
            className="text-xs font-mono font-medium uppercase tracking-wider mb-1.5"
            style={{ color: accent }}
          >
            {cert.issuer}
          </p>

          {/* Cert name */}
          <h3
            className="text-sm sm:text-base font-display font-bold leading-snug"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {cert.name}
          </h3>

          {/* Flip hint */}
          <span
            className="absolute bottom-4 text-[10px] font-mono uppercase tracking-widest
                       transition-opacity duration-300 opacity-40 group-hover:opacity-70"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Hover to flip
          </span>
        </div>

        {/* ---- BACK ---- */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden
                     flex flex-col items-center justify-center p-6 sm:p-8 text-center"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-border-primary)',
          }}
        >
          {/* Top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            }}
          />

          {/* Accent glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${accent}08 0%, transparent 70%)`,
            }}
          />

          {/* Verified badge */}
          <div
            className="flex items-center justify-center w-14 h-14 mb-5 rounded-full"
            style={{ backgroundColor: `${accent}15` }}
          >
            <HiBadgeCheck className="w-8 h-8" style={{ color: accent }} />
          </div>

          {/* Details */}
          <div className="space-y-3 mb-6 w-full">
            <DetailRow label="Issued" value={cert.date} accent={accent} />
            {cert.credentialId && (
              <DetailRow label="Credential ID" value={cert.credentialId} accent={accent} />
            )}
          </div>

          {/* Verify link */}
          {cert.credentialUrl && cert.credentialUrl !== '#' && (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold
                         font-mono uppercase tracking-wider rounded-xl
                         transition-all duration-200 hover:scale-105"
              style={{
                color: accent,
                backgroundColor: `${accent}12`,
                border: `1px solid ${accent}30`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <HiExternalLink className="w-4 h-4" />
              Verify
            </a>
          )}

          {/* Tap hint (mobile) */}
          <span
            className="absolute bottom-4 text-[10px] font-mono uppercase tracking-widest
                       opacity-40 sm:hidden"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Tap to flip back
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ================================================================
   DETAIL ROW (back of card)
   ================================================================ */

function DetailRow({ label, value, accent }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm"
      style={{ backgroundColor: 'var(--color-bg-secondary)' }}
    >
      <span
        className="text-xs font-mono font-medium uppercase tracking-wider"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {label}
      </span>
      <span
        className="font-semibold text-xs sm:text-sm font-mono"
        style={{ color: accent }}
      >
        {value}
      </span>
    </div>
  );
}

/* ================================================================
   CERTIFICATIONS SECTION
   ================================================================ */

export default function Certifications() {
  const { certs, loading } = useFirestoreCerts();

  const [headerRef, headerInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [gridRef, gridInView] = useInView({
    threshold: 0.05,
    triggerOnce: true,
  });

  return (
    <section
      id="certifications"
      className="section-padding relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-secondary)' }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(ellipse 50% 35% at 80% 0%, rgba(0,212,255,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 50% 35% at 20% 100%, rgba(168,85,247,0.03) 0%, transparent 60%)
          `,
        }}
      />

      <div className="section-container relative z-10">
        {/* ===== Header ===== */}
        <motion.div
          ref={headerRef}
          variants={sectionHeader}
          initial="hidden"
          animate={headerInView ? 'visible' : 'hidden'}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <motion.span
            variants={fadeUp}
            className="inline-block px-3 py-1.5 mb-4 text-xs font-mono font-medium
                       rounded-full border"
            style={{
              color: 'var(--color-accent)',
              backgroundColor: 'var(--color-accent-muted)',
              borderColor: 'rgba(0,212,255,0.15)',
            }}
          >
            {certs.length} certifications earned
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="heading-secondary mb-3 sm:mb-4"
            style={{ color: 'var(--color-text-primary)' }}
          >
            My <span className="text-gradient">Credentials</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-sm sm:text-base max-w-xl mx-auto"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Industry-recognised certifications that validate my skills
            across development, cloud, and IT systems.
          </motion.p>
        </motion.div>

        {/* ===== Loading state ===== */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* ===== Flip Cards Grid ===== */}
        {!loading && (
          <div ref={gridRef}>
            <motion.div
              variants={gridContainer}
              initial="hidden"
              animate={gridInView ? 'visible' : 'hidden'}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6
                         max-w-5xl mx-auto"
            >
              {certs.map((cert) => (
                <FlipCard key={cert.id} cert={cert} />
              ))}
            </motion.div>

            {/* Empty state */}
            {certs.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p
                  className="text-base"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  No certifications to display yet.
                </p>
              </motion.div>
            )}
          </div>
        )}

        {/* ===== Bottom accent ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={gridInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex items-center justify-center gap-2 mt-10 sm:mt-14"
        >
          <div
            className="h-[1px] w-12 sm:w-16"
            style={{ backgroundColor: 'var(--color-border-primary)' }}
          />
          <HiShieldCheck
            className="w-5 h-5"
            style={{ color: 'var(--color-text-muted)', opacity: 0.5 }}
          />
          <div
            className="h-[1px] w-12 sm:w-16"
            style={{ backgroundColor: 'var(--color-border-primary)' }}
          />
        </motion.div>
      </div>
    </section>
  );
}
