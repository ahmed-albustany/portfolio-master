import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useFirestore } from '@/hooks/useFirestore';
import { getCertifications } from '@/firebase/firestore';
import { fallbackCertifications } from '@/data/fallbackData';

/* ================================================================
   CERT FILE ENTRY
   Renders one certification as a file readout:
   [CERT-001] AWS Solutions Architect
   Status: VERIFIED
   Issued: 2024 | Credential: ABC-123
   ================================================================ */

function CertEntry({ cert, index, isVisible }) {
  const [typed, setTyped] = useState('');
  const [showBody, setShowBody] = useState(false);

  const certId = `CERT-${String(index + 1).padStart(3, '0')}`;
  const header = `[${certId}] ${cert.name || 'Unknown Certification'}`;

  useEffect(() => {
    if (!isVisible) return;
    let i = 0;
    const delay = 400 + index * 300;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < header.length) {
          setTyped(header.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          setTimeout(() => setShowBody(true), 150);
        }
      }, 18);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [isVisible, header, index]);

  const categoryColor = {
    cloud: '#00D4FF',
    it: '#00FF41',
    security: '#FF3B3B',
    development: '#FFB800',
  }[cert.category] || '#00FF88';

  return (
    <motion.div
      className="font-mono mb-4 last:mb-0"
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : {}}
      transition={{ delay: 0.1 + index * 0.15, duration: 0.3 }}
    >
      {/* Certificate header */}
      <div className="px-3 py-2 rounded-t"
        style={{ backgroundColor: 'rgba(0,255,65,0.03)', borderLeft: `2px solid ${categoryColor}40` }}>
        <span className="text-xs sm:text-sm font-bold" style={{ color: categoryColor }}>
          {typed}
          {typed.length < header.length && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.4, repeat: Infinity }}
              style={{ color: '#00FF41' }}
            >_</motion.span>
          )}
        </span>
      </div>

      {/* Certificate body */}
      {showBody && (
        <motion.div
          className="px-3 py-2 rounded-b space-y-1"
          style={{ backgroundColor: 'rgba(0,255,65,0.015)', borderLeft: `2px solid ${categoryColor}20` }}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Issuer */}
          {cert.issuer && (
            <p className="text-[10px]" style={{ color: '#00FF4150' }}>
              Issuer: <span style={{ color: '#00FF4180' }}>{cert.issuer}</span>
            </p>
          )}

          {/* Status */}
          <p className="text-[10px]" style={{ color: '#00FF4150' }}>
            Status: <span className="font-bold" style={{ color: '#00FF41' }}>VERIFIED</span>
          </p>

          {/* Date & credential */}
          <div className="flex flex-wrap gap-x-4">
            {cert.date && (
              <p className="text-[10px]" style={{ color: '#00FF4150' }}>
                Issued: <span style={{ color: '#00FF4170' }}>{cert.date}</span>
              </p>
            )}
            {cert.credentialID && (
              <p className="text-[10px]" style={{ color: '#00FF4150' }}>
                Credential: <span style={{ color: '#00D4FF80' }}>{cert.credentialID}</span>
              </p>
            )}
          </div>

          {/* Category tag */}
          {cert.category && (
            <p className="text-[9px] uppercase tracking-wider" style={{ color: `${categoryColor}50` }}>
              [{cert.category}]
            </p>
          )}

          {/* Verify link */}
          {cert.verifyURL && (
            <a
              href={cert.verifyURL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[9px] font-bold uppercase tracking-wider mt-1 hover:brightness-125 transition-all"
              style={{ color: '#00D4FF60' }}
            >
              [./verify_credential]
            </a>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

/* ================================================================
   DEEP CERTIFICATIONS SECTION
   ================================================================ */

export default function DeepCertifications() {
  const { data: certifications, loading } = useFirestore(getCertifications, fallbackCertifications);
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  const certs = useMemo(() => {
    if (!certifications) return [];
    return Array.isArray(certifications) ? certifications : [certifications];
  }, [certifications]);

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-[#00FF41] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono" style={{ color: '#00FF4140' }}>Loading clearance files...</span>
          </div>
        </div>
      </section>
    );
  }

  if (!certs.length) return null;

  return (
    <section id="certifications" className="py-16 sm:py-20 px-4" ref={ref}>
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: '#00FF4130' }}>
            {'// CLEARANCE FILES'}
          </p>

          <div className="flex items-center gap-2 px-4 py-2.5 rounded-t-lg"
            style={{ backgroundColor: 'rgba(0,255,65,0.05)', borderBottom: '1px solid rgba(0,255,65,0.1)' }}>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF3B3B]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFB800]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#00FF88]" />
            <span className="flex-1 text-center text-[9px] font-mono uppercase tracking-widest" style={{ color: '#00FF4140' }}>
              deep_system@mainframe ~ cat ./clearances.txt
            </span>
          </div>
        </motion.div>

        {/* Terminal body */}
        <div
          className="p-5 sm:p-6 rounded-b-lg"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(0,255,65,0.08)', borderTop: 'none' }}
        >
          {/* Command echo */}
          <motion.p
            className="text-[11px] font-mono mb-1"
            style={{ color: '#00FF4150' }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.3 }}
          >
            {'>'} cat ./clearances.txt
          </motion.p>

          <motion.p
            className="text-[10px] font-mono mb-4"
            style={{ color: '#00FF4125' }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.15, duration: 0.3 }}
          >
            {'---'} BEGIN CLEARANCE MANIFEST {'---'}
          </motion.p>

          {/* Cert entries */}
          {certs.map((cert, i) => (
            <CertEntry
              key={cert.id || i}
              cert={cert}
              index={i}
              isVisible={inView}
            />
          ))}

          {/* EOF */}
          <motion.div
            className="mt-6 pt-4"
            style={{ borderTop: '1px solid rgba(0,255,65,0.06)' }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 2, duration: 0.5 }}
          >
            <p className="text-[10px] font-mono" style={{ color: '#00FF4125' }}>
              {'---'} END CLEARANCE MANIFEST {'---'}
            </p>
            <p className="text-[10px] font-mono mt-2" style={{ color: '#00FF4140' }}>
              {'>'} {certs.length} clearance{certs.length !== 1 ? 's' : ''} on file. All credentials verified.
            </p>
          </motion.div>
        </div>

        {/* Bottom data flow */}
        <motion.div
          className="h-px mt-8"
          style={{ background: 'linear-gradient(90deg, transparent, #00FF4120, transparent)' }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ delay: 2.5, duration: 1 }}
        />
      </div>
    </section>
  );
}
