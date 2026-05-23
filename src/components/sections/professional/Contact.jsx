import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useForm } from 'react-hook-form';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import {
  HiMail, HiLocationMarker, HiStatusOnline,
  HiExclamationCircle, HiClock,
} from 'react-icons/hi';
import { saveMessage } from '@/firebase/firestore';
import { fallbackPersonalInfo as info } from '@/data/fallbackData';

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

const fieldReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
};

/* ================================================================
   FLOATING LABEL INPUT
   ================================================================ */

function FloatingField({ id, label, type = 'text', isTextarea = false, rows = 5, register, error }) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const isLifted = isFocused || hasValue;
  const Tag = isTextarea ? 'textarea' : 'input';

  return (
    <motion.div variants={fieldReveal} className="relative">
      <Tag
        id={id}
        type={isTextarea ? undefined : type}
        rows={isTextarea ? rows : undefined}
        className={`peer w-full px-4 pt-6 pb-2 text-sm font-mono rounded-lg outline-none
                   transition-all duration-300
                   ${isTextarea ? 'resize-none min-h-[140px]' : 'h-[56px]'}`}
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          color: 'var(--color-text-primary)',
          border: error
            ? '1px solid #FF3B3B'
            : isFocused
              ? '1px solid #0066FF'
              : '1px solid var(--color-border-primary)',
          boxShadow: isFocused ? '0 0 0 3px rgba(0,102,255,0.1)' : 'none',
        }}
        {...register}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          setHasValue(!!e.target.value);
          register?.onBlur?.(e);
        }}
        onChange={(e) => {
          setHasValue(!!e.target.value);
          register?.onChange?.(e);
        }}
      />

      <label
        htmlFor={id}
        className="absolute left-4 transition-all duration-200 pointer-events-none"
        style={{
          top: isLifted ? '6px' : '16px',
          fontSize: isLifted ? '9px' : '13px',
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: isLifted ? 700 : 400,
          color: error ? '#FF3B3B' : isLifted ? '#0066FF' : 'var(--color-text-muted)',
          letterSpacing: isLifted ? '0.1em' : '0',
          textTransform: isLifted ? 'uppercase' : 'none',
        }}
      >
        {label}
      </label>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1 mt-1.5 text-[10px] font-mono"
            style={{ color: '#FF3B3B' }}
          >
            <HiExclamationCircle className="w-3 h-3 flex-shrink-0" />
            {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ================================================================
   ANIMATED CHECKMARK
   ================================================================ */

function AnimatedCheckmark() {
  return (
    <motion.svg viewBox="0 0 52 52" className="w-16 h-16 mx-auto mb-4" initial="hidden" animate="visible">
      <motion.circle
        cx="26" cy="26" r="24" fill="none" stroke="#00FF88" strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.path
        d="M15 27l7 7 15-15" fill="none" stroke="#00FF88" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.45 }}
      />
    </motion.svg>
  );
}

/* ================================================================
   CONTACT SECTION
   ================================================================ */

export default function Contact() {
  const formId = useId();
  const [submitStatus, setSubmitStatus] = useState(null); // null | 'success' | 'error'

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onBlur' });

  const [headerRef, headerInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [contentRef, contentInView] = useInView({ threshold: 0.05, triggerOnce: true });

  const onSubmit = async (data) => {
    try {
      await saveMessage({
        name: data.name.trim(),
        email: data.email.trim(),
        subject: data.subject.trim(),
        message: data.message.trim(),
      });
      setSubmitStatus('success');
      reset();
    } catch {
      setSubmitStatus('error');
    }
  };

  return (
    <section
      id="contact"
      className="section-padding relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 50% 40% at 30% 0%, rgba(0,102,255,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 70% 100%, rgba(0,212,255,0.03) 0%, transparent 60%)
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
            <HiMail className="w-3 h-3" style={{ color: '#0066FF' }} />
            Establish Secure Connection
          </motion.span>

          <motion.h2 variants={fadeUp} className="heading-secondary mb-3"
                     style={{ color: 'var(--color-text-primary)' }}>
            Open <span className="text-gradient">Channel</span>
          </motion.h2>

          <motion.p variants={fadeUp} className="text-sm sm:text-base max-w-md mx-auto"
                    style={{ color: 'var(--color-text-muted)' }}>
            Have a project, question, or want to establish contact? Transmit below.
          </motion.p>
        </motion.div>

        {/* Two columns */}
        <div
          ref={contentRef}
          className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 max-w-5xl mx-auto"
        >
          {/* ── LEFT: Connection Info (2 cols) ── */}
          <motion.div
            className="lg:col-span-2 space-y-4"
            variants={container}
            initial="hidden"
            animate={contentInView ? 'visible' : 'hidden'}
          >
            {/* Label */}
            <motion.div variants={fadeUp}>
              <span className="text-[10px] font-mono font-semibold uppercase tracking-widest"
                    style={{ color: 'var(--color-text-muted)' }}>
                Operator Contact
              </span>
            </motion.div>

            {/* Email */}
            <motion.a
              variants={fadeUp}
              href={`mailto:${info.email}`}
              className="flex items-center gap-3 p-4 rounded-lg transition-all duration-200 hover:translate-x-1"
              style={{
                backgroundColor: 'var(--color-bg-card)',
                border: '1px solid var(--color-border-primary)',
              }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                   style={{ backgroundColor: 'rgba(0,102,255,0.1)' }}>
                <HiMail className="w-4 h-4" style={{ color: '#0066FF' }} />
              </div>
              <div>
                <span className="block text-[9px] font-mono font-semibold uppercase tracking-widest"
                      style={{ color: 'var(--color-text-muted)' }}>Email</span>
                <span className="text-xs font-mono" style={{ color: 'var(--color-text-primary)' }}>
                  {info.email}
                </span>
              </div>
            </motion.a>

            {/* LinkedIn */}
            <motion.a
              variants={fadeUp}
              href={info.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-lg transition-all duration-200 hover:translate-x-1"
              style={{
                backgroundColor: 'var(--color-bg-card)',
                border: '1px solid var(--color-border-primary)',
              }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                   style={{ backgroundColor: 'rgba(0,102,255,0.1)' }}>
                <FaLinkedinIn className="w-4 h-4" style={{ color: '#0066FF' }} />
              </div>
              <div>
                <span className="block text-[9px] font-mono font-semibold uppercase tracking-widest"
                      style={{ color: 'var(--color-text-muted)' }}>LinkedIn</span>
                <span className="text-xs font-mono" style={{ color: 'var(--color-text-primary)' }}>
                  Ahmed Albustany
                </span>
              </div>
            </motion.a>

            {/* GitHub */}
            <motion.a
              variants={fadeUp}
              href={info.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-lg transition-all duration-200 hover:translate-x-1"
              style={{
                backgroundColor: 'var(--color-bg-card)',
                border: '1px solid var(--color-border-primary)',
              }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                   style={{ backgroundColor: 'rgba(0,102,255,0.1)' }}>
                <FaGithub className="w-4 h-4" style={{ color: '#0066FF' }} />
              </div>
              <div>
                <span className="block text-[9px] font-mono font-semibold uppercase tracking-widest"
                      style={{ color: 'var(--color-text-muted)' }}>GitHub</span>
                <span className="text-xs font-mono" style={{ color: 'var(--color-text-primary)' }}>
                  @ahmed-albustany
                </span>
              </div>
            </motion.a>

            {/* Location */}
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-3 p-4 rounded-lg"
              style={{
                backgroundColor: 'var(--color-bg-card)',
                border: '1px solid var(--color-border-primary)',
              }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                   style={{ backgroundColor: 'rgba(0,102,255,0.1)' }}>
                <HiLocationMarker className="w-4 h-4" style={{ color: '#0066FF' }} />
              </div>
              <div>
                <span className="block text-[9px] font-mono font-semibold uppercase tracking-widest"
                      style={{ color: 'var(--color-text-muted)' }}>Location</span>
                <span className="text-xs font-mono" style={{ color: 'var(--color-text-primary)' }}>
                  {info.location}
                </span>
              </div>
            </motion.div>

            {/* Availability */}
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-3 p-4 rounded-lg"
              style={{
                backgroundColor: 'rgba(0,255,136,0.04)',
                border: '1px solid rgba(0,255,136,0.15)',
              }}
            >
              <HiStatusOnline className="w-4 h-4" style={{ color: '#00FF88' }} />
              <span className="text-xs font-mono font-semibold" style={{ color: '#00FF88' }}>
                {info.availability || 'Available for Deployment'}
              </span>
            </motion.div>

            {/* Response time */}
            <motion.div variants={fadeUp} className="flex items-center gap-2 px-4 py-2">
              <HiClock className="w-3.5 h-3.5" style={{ color: 'var(--color-text-muted)' }} />
              <span className="text-[10px] font-mono uppercase tracking-widest"
                    style={{ color: 'var(--color-text-muted)' }}>
                Response Time: &lt; 24 Hours
              </span>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Transmission Form (3 cols) ── */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {submitStatus === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="rounded-xl p-8 sm:p-12 text-center"
                  style={{
                    backgroundColor: 'var(--color-bg-card)',
                    border: '1px solid var(--color-border-primary)',
                  }}
                >
                  <AnimatedCheckmark />
                  <h3 className="text-lg font-heading font-bold mb-2"
                      style={{ color: '#00FF88' }}>
                    TRANSMISSION RECEIVED
                  </h3>
                  <p className="text-xs font-mono mb-6" style={{ color: 'var(--color-text-muted)' }}>
                    Response incoming. Stand by for contact.
                  </p>
                  <button
                    onClick={() => setSubmitStatus(null)}
                    className="px-5 py-2.5 text-[10px] font-mono font-semibold uppercase tracking-widest
                               rounded-lg transition-all duration-200 hover:scale-105"
                    style={{
                      color: '#0066FF',
                      backgroundColor: 'rgba(0,102,255,0.08)',
                      border: '1px solid rgba(0,102,255,0.2)',
                    }}
                  >
                    New Transmission
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  variants={container}
                  initial="hidden"
                  animate={contentInView ? 'visible' : 'hidden'}
                  exit={{ opacity: 0, y: 20 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="rounded-xl p-6 sm:p-8 space-y-5"
                  style={{
                    backgroundColor: 'var(--color-bg-card)',
                    border: '1px solid var(--color-border-primary)',
                  }}
                  noValidate
                >
                  {/* Form header */}
                  <motion.div variants={fadeUp} className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-widest"
                          style={{ color: 'var(--color-text-muted)' }}>
                      Secure Transmission
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: '#00FF88', boxShadow: '0 0 6px rgba(0,255,136,0.5)',
                                   animation: 'status-blink 2s ease-in-out infinite' }} />
                  </motion.div>

                  {/* Name + Email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FloatingField
                      id={`${formId}-name`}
                      label="Operator Name"
                      register={register('name', {
                        required: 'Name is required',
                        minLength: { value: 2, message: 'Min 2 characters' },
                      })}
                      error={errors.name}
                    />
                    <FloatingField
                      id={`${formId}-email`}
                      label="Signal Origin (Email)"
                      type="email"
                      register={register('email', {
                        required: 'Email is required',
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                      })}
                      error={errors.email}
                    />
                  </div>

                  {/* Subject */}
                  <FloatingField
                    id={`${formId}-subject`}
                    label="Subject"
                    register={register('subject', { required: 'Subject is required' })}
                    error={errors.subject}
                  />

                  {/* Message */}
                  <FloatingField
                    id={`${formId}-message`}
                    label="Transmission"
                    isTextarea
                    rows={5}
                    register={register('message', {
                      required: 'Message is required',
                      minLength: { value: 10, message: 'Min 10 characters' },
                    })}
                    error={errors.message}
                  />

                  {/* Error */}
                  <AnimatePresence>
                    {submitStatus === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono"
                        style={{
                          color: '#FF3B3B',
                          backgroundColor: 'rgba(255,59,59,0.06)',
                          border: '1px solid rgba(255,59,59,0.15)',
                        }}
                      >
                        <HiExclamationCircle className="w-4 h-4 flex-shrink-0" />
                        <span>TRANSMISSION FAILED — Retry or email directly.</span>
                        <button
                          type="button"
                          onClick={() => setSubmitStatus(null)}
                          className="ml-auto text-[10px] underline opacity-70 hover:opacity-100"
                        >
                          Dismiss
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <motion.div variants={fadeUp}>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative w-full flex items-center justify-center gap-2
                                 px-6 py-3.5 text-xs font-mono font-bold uppercase tracking-widest
                                 rounded-lg transition-all duration-300 overflow-hidden
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        color: '#FFFFFF',
                        backgroundColor: '#0066FF',
                        boxShadow: '0 0 20px rgba(0,102,255,0.3)',
                      }}
                    >
                      {/* Shimmer */}
                      <div
                        className="absolute inset-0 -translate-x-full group-hover:translate-x-full
                                   transition-transform duration-700 pointer-events-none"
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
                        }}
                      />

                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          TRANSMITTING...
                        </>
                      ) : (
                        'TRANSMIT MESSAGE'
                      )}
                    </button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
