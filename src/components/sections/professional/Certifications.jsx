import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { HiExternalLink, HiShieldCheck, HiBadgeCheck } from 'react-icons/hi';
import { useFirestore } from '@/hooks/useFirestore';
import { getCertifications } from '@/firebase/firestore';
import { fallbackCertifications } from '@/data/fallbackData';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import EmptyState from '@/components/ui/EmptyState';

/* ================================================================
   CATEGORY COLORS
   ================================================================ */

const CATEGORY_COLORS = {
  cloud:    '#00D4FF',
  dev:      '#0066FF',
  development: '#0066FF',
  security: '#FF3B3B',
  network:  '#00FF88',
  it:       '#FFB800',
};

function getCatColor(category) {
  return CATEGORY_COLORS[(category || '').toLowerCase()] || '#A855F7';
}

/* ================================================================
   ANIMATION VARIANTS
   ================================================================ */

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
};

const cardReveal = {
  hidden: { opacity: 0, y: 35, scale: 0.94 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

/* ================================================================
   FLIP CARD
   ================================================================ */

function FlipCard({ cert }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const accent = getCatColor(cert.category);

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
        {/* ── FRONT ── */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden flex flex-col items-center justify-center
                     p-6 sm:p-8 text-center"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-border-primary)',
          }}
        >
          {/* Category color header bar */}
          <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: accent }} />

          {/* Badge image or fallback */}
          <div
            className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28
                       mb-5 rounded-xl overflow-hidden transition-transform duration-300
                       group-hover:scale-105"
            style={{ backgroundColor: `${accent}10` }}
          >
            {(cert.imageURL || cert.badgeImage) ? (
              <img
                src={cert.imageURL || cert.badgeImage}
                alt={cert.name}
                className="w-full h-full object-contain p-3"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.nextElementSibling) {
                    e.currentTarget.nextElementSibling.classList.remove('hidden');
                  }
                }}
              />
            ) : null}
            <HiShieldCheck
              className={`w-12 h-12 sm:w-14 sm:h-14 absolute ${(cert.imageURL || cert.badgeImage) ? 'hidden' : ''}`}
              style={{ color: accent }}
            />
          </div>

          {/* Issuer */}
          <p className="text-[10px] font-mono font-semibold uppercase tracking-widest mb-1.5"
             style={{ color: accent }}>
            {cert.issuer}
          </p>

          {/* Name */}
          <h3 className="text-sm sm:text-base font-heading font-bold leading-snug"
              style={{ color: 'var(--color-text-primary)' }}>
            {cert.name}
          </h3>

          {/* Category badge */}
          {cert.category && (
            <span
              className="mt-3 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded"
              style={{
                color: accent,
                backgroundColor: `${accent}10`,
                border: `1px solid ${accent}20`,
              }}
            >
              {cert.category}
            </span>
          )}

          {/* Flip hint */}
          <span
            className="absolute bottom-3 text-[9px] font-mono uppercase tracking-widest
                       opacity-30 group-hover:opacity-60 transition-opacity duration-300"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Hover to flip
          </span>
        </div>

        {/* ── BACK ── */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden flex flex-col items-center
                     justify-center p-6 sm:p-8 text-center"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            backgroundColor: 'var(--color-bg-card)',
            border: '1px solid var(--color-border-primary)',
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: accent }} />

          {/* Glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${accent}08, transparent 70%)` }}
          />

          {/* Verified icon */}
          <div className="flex items-center justify-center w-14 h-14 mb-5 rounded-full"
               style={{ backgroundColor: `${accent}15` }}>
            <HiBadgeCheck className="w-8 h-8" style={{ color: accent }} />
          </div>

          {/* Details */}
          <div className="space-y-2.5 mb-5 w-full">
            {cert.date && (
              <div className="flex items-center justify-between px-3 py-2 rounded-lg text-xs"
                   style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
                <span className="font-mono font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--color-text-muted)' }}>Issued</span>
                <span className="font-mono font-semibold" style={{ color: accent }}>{cert.date}</span>
              </div>
            )}
            {cert.credentialID && (
              <div className="flex items-center justify-between px-3 py-2 rounded-lg text-xs"
                   style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
                <span className="font-mono font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--color-text-muted)' }}>ID</span>
                <span className="font-mono font-semibold text-[10px]"
                      style={{ color: 'var(--color-text-secondary)' }}>{cert.credentialID}</span>
              </div>
            )}
            {cert.category && (
              <div className="flex items-center justify-between px-3 py-2 rounded-lg text-xs"
                   style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
                <span className="font-mono font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--color-text-muted)' }}>Category</span>
                <span className="font-mono font-bold uppercase" style={{ color: accent }}>{cert.category}</span>
              </div>
            )}
          </div>

          {/* Verify / Classified */}
          {cert.verifyURL || cert.credentialUrl ? (
            <a
              href={cert.verifyURL || cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[10px] font-mono
                         font-bold uppercase tracking-widest rounded-lg transition-all
                         duration-200 hover:scale-105"
              style={{
                color: '#060B14',
                backgroundColor: accent,
                boxShadow: `0 0 15px ${accent}30`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <HiExternalLink className="w-3.5 h-3.5" />
              Authenticate
            </a>
          ) : (
            <span
              className="inline-flex items-center gap-2 px-4 py-2 text-[10px] font-mono
                         font-bold uppercase tracking-widest rounded-lg border"
              style={{
                color: '#0066FF',
                borderColor: 'rgba(0,102,255,0.3)',
                backgroundColor: 'rgba(0,102,255,0.05)',
              }}
            >
              <HiShieldCheck className="w-3.5 h-3.5" />
              Classified
            </span>
          )}

          {/* Tap hint mobile */}
          <span
            className="absolute bottom-3 text-[9px] font-mono uppercase tracking-widest opacity-30 sm:hidden"
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
   CERTIFICATIONS SECTION
   ================================================================ */

export default function Certifications() {
  const { data: certs, loading } = useFirestore(getCertifications, fallbackCertifications);
  const [headerRef, headerInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [gridRef, gridInView] = useInView({ threshold: 0.05, triggerOnce: true });

  if (loading) {
    return (
      <section id="certifications" className="section-padding" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
        <div className="section-container"><SkeletonLoader variant="card" count={6} /></div>
      </section>
    );
  }

  return (
    <section
      id="certifications"
      className="section-padding relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-secondary)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 50% 35% at 80% 0%, rgba(0,212,255,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 50% 35% at 20% 100%, rgba(168,85,247,0.03) 0%, transparent 60%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div
          ref={headerRef}
          variants={container}
          initial="hidden"
          animate={headerInView ? 'visible' : 'hidden'}
          className="text-center mb-10 sm:mb-14"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 text-[10px] font-mono
                       font-semibold uppercase tracking-widest rounded-md border"
            style={{
              color: 'var(--color-text-muted)',
              borderColor: 'var(--color-border-primary)',
              backgroundColor: 'var(--color-bg-card)',
            }}
          >
            <HiShieldCheck className="w-3 h-3" style={{ color: '#A855F7' }} />
            Verified Authorizations
          </motion.span>

          <motion.h2 variants={fadeUp} className="heading-secondary mb-3"
                     style={{ color: 'var(--color-text-primary)' }}>
            Clearances & <span style={{ color: '#A855F7' }}>Credentials</span>
          </motion.h2>

          <motion.p variants={fadeUp} className="text-sm sm:text-base max-w-md mx-auto"
                    style={{ color: 'var(--color-text-muted)' }}>
            Industry-recognized certifications across development, cloud, and IT systems.
          </motion.p>
        </motion.div>

        {/* Grid */}
        {(!certs || certs.length === 0) ? (
          <EmptyState
            icon={HiShieldCheck}
            title="No Credentials on File"
            description="No certifications yet — add from admin panel."
            color="#A855F7"
          />
        ) : (
          <div ref={gridRef}>
            <motion.div
              variants={container}
              initial="hidden"
              animate={gridInView ? 'visible' : 'hidden'}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto"
            >
              {certs.map((cert) => (
                <FlipCard key={cert.id} cert={cert} />
              ))}
            </motion.div>
          </div>
        )}

        {/* Bottom accent */}
        {certs && certs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={gridInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center justify-center gap-3 mt-10"
          >
            <div className="h-px w-12" style={{ backgroundColor: 'var(--color-border-primary)' }} />
            <span className="text-[10px] font-mono uppercase tracking-widest"
                  style={{ color: 'var(--color-text-muted)' }}>
              {certs.length} Credentials Verified
            </span>
            <div className="h-px w-12" style={{ backgroundColor: 'var(--color-border-primary)' }} />
          </motion.div>
        )}
      </div>
    </section>
  );
}
