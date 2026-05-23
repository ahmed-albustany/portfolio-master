import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { experience } from '@/data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

/* ================================================================
   TYPE → STATION COLOURS
   ================================================================ */

const TYPE_COLORS = {
  dev: { primary: '#00D4FF', label: 'DEV' },
  eng: { primary: '#A855F7', label: 'ENG' },
  it: { primary: '#10B981', label: 'SYS' },
};

function getStationColor(type) {
  return TYPE_COLORS[type] || TYPE_COLORS.dev;
}

/* ================================================================
   LIGHT-YEAR DATE FORMATTER
   Converts "2024 – Present" → "LY 2024 — PRESENT"
   ================================================================ */

function formatCosmicDate(period) {
  return period
    .replace(/(\d{4})/g, 'LY $1')
    .replace('–', '—')
    .replace('Present', 'PRESENT')
    .toUpperCase();
}

/* ================================================================
   SPACE STATION CARD
   ================================================================ */

function StationCard({ item, index, side }) {
  const color = getStationColor(item.type);
  const isLeft = side === 'left';

  return (
    <motion.div
      className={`relative w-full md:w-[calc(50%-40px)] ${
        isLeft ? 'md:mr-auto' : 'md:ml-auto'
      }`}
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <div
        className="relative rounded-xl border border-white/8 p-5 group
                   hover:border-white/15 transition-all duration-400 overflow-hidden"
        style={{ backgroundColor: '#0d0d14' }}
      >
        {/* Top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${color.primary}60, transparent)`,
          }}
        />

        {/* Corner glow on hover */}
        <div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl
                     opacity-0 group-hover:opacity-100 transition-opacity duration-600"
          style={{ backgroundColor: `${color.primary}08` }}
        />

        <div className="relative z-10">
          {/* Date + type badge row */}
          <div className="flex items-center justify-between mb-3">
            <span
              className="px-2 py-0.5 text-[10px] font-mono tracking-wider rounded-md border"
              style={{
                color: color.primary,
                borderColor: `${color.primary}25`,
                backgroundColor: `${color.primary}08`,
              }}
            >
              {formatCosmicDate(item.period)}
            </span>
            <span
              className="text-[9px] font-mono font-bold tracking-widest"
              style={{ color: `${color.primary}80` }}
            >
              [{color.label}]
            </span>
          </div>

          {/* Role + Company */}
          <h3 className="text-base font-bold text-white mb-0.5 font-display">
            {item.role}
          </h3>
          <p
            className="text-sm font-mono mb-3"
            style={{ color: color.primary }}
          >
            {item.company}
          </p>

          {/* Achievements */}
          <ul className="space-y-2 mb-4">
            {item.achievements.map((achievement, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#94a3b8]">
                <span
                  className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color.primary }}
                />
                {achievement}
              </li>
            ))}
          </ul>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5">
            {item.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-[10px] font-mono rounded-md
                           bg-white/[0.03] text-[#64748b] border border-white/[0.05]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

export default function ImmersiveExperience() {
  const sectionRef = useRef(null);
  const pathRef = useRef(null);
  const [headerRef, headerInView] = useInView({ threshold: 0.3, triggerOnce: true });

  /* ── GSAP: Draw the travel path on scroll ── */
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

    const tween = gsap.to(path, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        end: 'bottom 30%',
        scrub: 1.5,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  /* ── Build the SVG curved path ── */
  const stationCount = experience.length;
  const svgHeight = stationCount * 280 + 80;
  const midX = 300;
  const curveAmplitude = 50;

  let pathD = `M ${midX} 0`;
  for (let i = 0; i < stationCount; i++) {
    const y1 = i * 280 + 100;
    const y2 = i * 280 + 240;
    const cx = midX + (i % 2 === 0 ? curveAmplitude : -curveAmplitude);
    pathD += ` Q ${cx} ${y1}, ${midX} ${y2}`;
  }
  pathD += ` L ${midX} ${svgHeight}`;

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-20 md:py-28 overflow-hidden"
    >
      {/* Spacetime fabric: grid warp effect */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,212,255,0.6) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,212,255,0.6) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            perspective: '600px',
            transform: 'rotateX(45deg) scale(2.5)',
            transformOrigin: 'center 20%',
          }}
        />
        {/* Radial fade so grid doesn't have hard edges */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% 30%, transparent 40%, #0a0a0f 80%)',
          }}
        />
      </div>

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1 text-[11px] font-mono tracking-widest uppercase
                          text-[#A855F7] border border-[#A855F7]/20 rounded-full mb-4
                          bg-[#A855F7]/5">
            // spacetime.traverse()
          </span>
          <h2 className="heading-secondary text-white mb-3">
            Spacetime <span className="text-gradient">Timeline</span>
          </h2>
          <p className="text-[#64748b] font-mono text-sm max-w-md mx-auto">
            Journey through the light-years of my career
          </p>
        </motion.div>

        {/* Timeline area */}
        <div className="relative max-w-4xl mx-auto">
          {/* SVG path — hidden on mobile, visible md+ */}
          <svg
            className="absolute left-1/2 -translate-x-1/2 top-0 w-[600px] hidden md:block pointer-events-none"
            viewBox={`0 0 600 ${svgHeight}`}
            style={{ height: svgHeight }}
            fill="none"
            aria-hidden="true"
          >
            {/* Ghost path (background track) */}
            <path
              d={pathD}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="2"
              fill="none"
            />
            {/* Animated path */}
            <path
              ref={pathRef}
              d={pathD}
              stroke="url(#immersive-exp-gradient)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="immersive-exp-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00D4FF" />
                <stop offset="50%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>

            {/* Station dots along the path */}
            {experience.map((item, i) => {
              const y = i * 280 + 240;
              const color = getStationColor(item.type);
              return (
                <g key={item.id}>
                  {/* Outer pulse */}
                  <circle cx={midX} cy={y} r="8" fill="none" stroke={`${color.primary}30`} strokeWidth="1">
                    <animate
                      attributeName="r"
                      values="8;16;8"
                      dur="3s"
                      repeatCount="indefinite"
                      begin={`${i * 0.5}s`}
                    />
                    <animate
                      attributeName="opacity"
                      values="1;0;1"
                      dur="3s"
                      repeatCount="indefinite"
                      begin={`${i * 0.5}s`}
                    />
                  </circle>
                  {/* Core dot */}
                  <circle cx={midX} cy={y} r="5" fill={color.primary} />
                  <circle cx={midX} cy={y} r="2.5" fill="#0a0a0f" />
                </g>
              );
            })}
          </svg>

          {/* Mobile vertical line */}
          <div
            className="absolute left-5 top-0 bottom-0 w-px md:hidden"
            style={{
              background: 'linear-gradient(180deg, #00D4FF, #A855F7, #10B981)',
            }}
          />

          {/* Station cards */}
          <div className="relative space-y-8 md:space-y-16">
            {experience.map((item, index) => (
              <div key={item.id} className="relative pl-12 md:pl-0">
                {/* Mobile station dot */}
                <div className="absolute left-3.5 top-6 md:hidden">
                  <div
                    className="w-3.5 h-3.5 rounded-full border-2"
                    style={{
                      borderColor: getStationColor(item.type).primary,
                      backgroundColor: '#0a0a0f',
                    }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full m-auto mt-[3px]"
                      style={{ backgroundColor: getStationColor(item.type).primary }}
                    />
                  </div>
                </div>

                <StationCard
                  item={item}
                  index={index}
                  side={index % 2 === 0 ? 'left' : 'right'}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
