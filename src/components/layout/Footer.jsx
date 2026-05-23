import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { HiMail } from 'react-icons/hi';
import { fallbackPersonalInfo as info } from '@/data/fallbackData';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      {/* Top gradient border */}
      <div
        className="h-px w-full"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--color-cyan), var(--color-accent), var(--color-cyan), transparent)',
          opacity: 0.4,
        }}
      />

      <div className="section-container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left — Copyright */}
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-heading font-bold"
              style={{
                backgroundColor: 'rgba(0,102,255,0.15)',
                color: '#0066FF',
                border: '1px solid rgba(0,102,255,0.3)',
              }}
            >
              AC
            </div>
            <p className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>
              &copy; {currentYear} {info.name}
            </p>
          </div>

          {/* Center — System status */}
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: '#00FF88',
                boxShadow: '0 0 8px rgba(0,255,136,0.4)',
                animation: 'status-blink 2s ease-in-out infinite',
              }}
            />
            <span
              className="text-[10px] font-mono font-semibold uppercase tracking-widest"
              style={{ color: 'var(--color-text-muted)' }}
            >
              System Status
            </span>
            <span className="text-[10px] font-mono" style={{ color: '#00FF88' }}>
              — All Systems Operational
            </span>
          </div>

          {/* Right — Social links */}
          <div className="flex items-center gap-2">
            {[
              { href: info.socialLinks.github, icon: FaGithub, label: 'GitHub' },
              { href: info.socialLinks.linkedin, icon: FaLinkedin, label: 'LinkedIn' },
              { href: `mailto:${info.email}`, icon: HiMail, label: 'Email' },
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target={label !== 'Email' ? '_blank' : undefined}
                rel={label !== 'Email' ? 'noopener noreferrer' : undefined}
                className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                style={{
                  color: 'var(--color-text-muted)',
                  backgroundColor: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border-primary)',
                }}
                aria-label={label}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
