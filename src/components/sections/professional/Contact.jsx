import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useForm } from 'react-hook-form';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import {
  HiMail,
  HiLocationMarker,
  HiDownload,
  HiArrowRight,
  HiCheckCircle,
  HiExclamationCircle,
} from 'react-icons/hi';
import { saveMessage } from '@/firebase/firestore';
import { personalInfo } from '@/data/portfolioData';

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

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const fieldReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const infoCardReveal = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

/* ================================================================
   FLOATING-LABEL INPUT
   The label lifts above the input when focused or filled.
   ================================================================ */

function FloatingField({
  id,
  label,
  type = 'text',
  isTextarea = false,
  rows = 5,
  register,
  error,
  ...rest
}) {
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
        className={`peer w-full px-4 pt-6 pb-2 text-sm font-medium rounded-xl
                   outline-none transition-all duration-300
                   ${isTextarea ? 'resize-none min-h-[140px]' : 'h-[56px]'}
                   ${error
                     ? 'ring-2 ring-red-500/50'
                     : isFocused
                       ? 'ring-2 ring-[var(--color-accent)]/40'
                       : 'ring-1 ring-[var(--color-border-primary)]'
                   }`}
        style={{
          backgroundColor: 'var(--color-bg-card)',
          color: 'var(--color-text-primary)',
        }}
        {...register}
        onFocus={(e) => {
          setIsFocused(true);
          register?.onBlur?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          setHasValue(!!e.target.value);
          register?.onBlur?.(e);
        }}
        onChange={(e) => {
          setHasValue(!!e.target.value);
          register?.onChange?.(e);
        }}
        {...rest}
      />

      {/* Floating label */}
      <label
        htmlFor={id}
        className="absolute left-4 transition-all duration-200 pointer-events-none
                   font-medium"
        style={{
          top: isLifted ? '8px' : '16px',
          fontSize: isLifted ? '10px' : '14px',
          color: error
            ? '#ef4444'
            : isLifted
              ? 'var(--color-accent)'
              : 'var(--color-text-muted)',
          letterSpacing: isLifted ? '0.05em' : '0',
          textTransform: isLifted ? 'uppercase' : 'none',
          fontFamily: isLifted ? 'var(--font-mono, monospace)' : 'inherit',
        }}
      >
        {label}
      </label>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1 mt-1.5 text-xs font-medium text-red-500"
          >
            <HiExclamationCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ================================================================
   ANIMATED CHECKMARK SVG
   Draws a circle then a tick after the form succeeds.
   ================================================================ */

function AnimatedCheckmark() {
  return (
    <motion.svg
      viewBox="0 0 52 52"
      className="w-16 h-16 mx-auto mb-4"
      initial="hidden"
      animate="visible"
    >
      <motion.circle
        cx="26"
        cy="26"
        r="24"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
      <motion.path
        d="M15 27l7 7 15-15"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.45, ease: 'easeOut' }}
      />
    </motion.svg>
  );
}

/* ================================================================
   SOCIAL / INFO LINK
   ================================================================ */

function InfoLink({ href, icon: Icon, label, value, download }) {
  const props = download
    ? { download: true }
    : { target: '_blank', rel: 'noopener noreferrer' };

  return (
    <a
      href={href}
      className="group flex items-center gap-4 p-4 rounded-xl
                 transition-all duration-300 hover:translate-x-1"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        border: '1px solid var(--color-border-primary)',
      }}
      {...props}
    >
      <div
        className="flex items-center justify-center w-10 h-10 rounded-xl
                   transition-colors duration-300"
        style={{ backgroundColor: 'var(--color-accent-muted)' }}
      >
        <Icon
          className="w-5 h-5 transition-colors duration-300"
          style={{ color: 'var(--color-accent)' }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <span
          className="block text-xs font-mono font-medium uppercase tracking-wider mb-0.5"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {label}
        </span>
        <span
          className="block text-sm font-semibold truncate"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {value}
        </span>
      </div>
      <HiArrowRight
        className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-60
                   group-hover:translate-x-0 transition-all duration-300"
        style={{ color: 'var(--color-text-muted)' }}
      />
    </a>
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

  const [headerRef, headerInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [formRef, formInView] = useInView({
    threshold: 0.05,
    triggerOnce: true,
  });

  const [infoRef, infoInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  /* ---- Submit handler ---- */
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

  const resetStatus = () => setSubmitStatus(null);

  return (
    <section
      id="contact"
      className="section-padding relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(ellipse 50% 40% at 30% 0%, rgba(0,212,255,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 70% 100%, rgba(168,85,247,0.03) 0%, transparent 60%)
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
            Get in touch
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="heading-secondary mb-3 sm:mb-4"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Let&rsquo;s <span className="text-gradient">Connect</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-sm sm:text-base max-w-xl mx-auto"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Have a project in mind, a question, or just want to say hello?
            I&rsquo;d love to hear from you.
          </motion.p>
        </motion.div>

        {/* ===== Two-column layout ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 max-w-5xl mx-auto">
          {/* ---- LEFT: Form (3 cols) ---- */}
          <div className="lg:col-span-3" ref={formRef}>
            <AnimatePresence mode="wait">
              {submitStatus === 'success' ? (
                /* ---- Success state ---- */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  className="card-glow p-8 sm:p-12 text-center"
                >
                  <AnimatedCheckmark />

                  <h3
                    className="text-lg sm:text-xl font-display font-bold mb-2"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    Message Sent!
                  </h3>
                  <p
                    className="text-sm mb-6 max-w-xs mx-auto"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    Thank you for reaching out. I&rsquo;ll get back to you as
                    soon as possible.
                  </p>

                  <button
                    type="button"
                    onClick={resetStatus}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm
                               font-semibold rounded-xl transition-all duration-200
                               hover:scale-105"
                    style={{
                      color: 'var(--color-accent)',
                      backgroundColor: 'var(--color-accent-muted)',
                      border: '1px solid rgba(0,212,255,0.15)',
                    }}
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                /* ---- Form ---- */
                <motion.form
                  key="form"
                  variants={staggerContainer}
                  initial="hidden"
                  animate={formInView ? 'visible' : 'hidden'}
                  exit={{ opacity: 0, y: 20, transition: { duration: 0.25 } }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="card-glow p-6 sm:p-8 space-y-5"
                  noValidate
                >
                  {/* Name + Email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FloatingField
                      id={`${formId}-name`}
                      label="Name"
                      register={register('name', {
                        required: 'Name is required',
                        minLength: { value: 2, message: 'At least 2 characters' },
                      })}
                      error={errors.name}
                    />
                    <FloatingField
                      id={`${formId}-email`}
                      label="Email"
                      type="email"
                      register={register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Invalid email address',
                        },
                      })}
                      error={errors.email}
                    />
                  </div>

                  {/* Subject */}
                  <FloatingField
                    id={`${formId}-subject`}
                    label="Subject"
                    register={register('subject', {
                      required: 'Subject is required',
                    })}
                    error={errors.subject}
                  />

                  {/* Message */}
                  <FloatingField
                    id={`${formId}-message`}
                    label="Message"
                    isTextarea
                    rows={5}
                    register={register('message', {
                      required: 'Message is required',
                      minLength: {
                        value: 10,
                        message: 'At least 10 characters',
                      },
                    })}
                    error={errors.message}
                  />

                  {/* Error banner */}
                  <AnimatePresence>
                    {submitStatus === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm
                                   font-medium"
                        style={{
                          color: '#ef4444',
                          backgroundColor: 'rgba(239,68,68,0.08)',
                          border: '1px solid rgba(239,68,68,0.2)',
                        }}
                      >
                        <HiExclamationCircle className="w-5 h-5 flex-shrink-0" />
                        <span>
                          Something went wrong. Please try again or email me
                          directly.
                        </span>
                        <button
                          type="button"
                          onClick={resetStatus}
                          className="ml-auto text-xs underline opacity-70 hover:opacity-100"
                        >
                          Dismiss
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit button */}
                  <motion.div variants={fieldReveal}>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative w-full flex items-center justify-center gap-2
                                 px-6 py-3.5 text-sm font-semibold rounded-xl
                                 transition-all duration-300 overflow-hidden
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        color: 'var(--color-text-inverted)',
                        backgroundColor: 'var(--color-accent)',
                      }}
                    >
                      {/* Hover shimmer */}
                      <div
                        className="absolute inset-0 -translate-x-full group-hover:translate-x-full
                                   transition-transform duration-700 pointer-events-none"
                        style={{
                          background:
                            'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                        }}
                      />

                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent
                                          rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <HiArrowRight className="w-4 h-4 group-hover:translate-x-1
                                                   transition-transform duration-200" />
                        </>
                      )}
                    </button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* ---- RIGHT: Info panel (2 cols) ---- */}
          <motion.div
            ref={infoRef}
            className="lg:col-span-2 space-y-4"
            variants={staggerContainer}
            initial="hidden"
            animate={infoInView ? 'visible' : 'hidden'}
          >
            {/* Availability badge */}
            <motion.div
              variants={infoCardReveal}
              className="flex items-center gap-3 p-4 rounded-xl"
              style={{
                backgroundColor: 'var(--color-bg-card)',
                border: '1px solid var(--color-border-primary)',
              }}
            >
              <span className="relative flex h-3 w-3">
                <span
                  className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
                  style={{ backgroundColor: '#10B981' }}
                />
                <span
                  className="relative inline-flex h-3 w-3 rounded-full"
                  style={{ backgroundColor: '#10B981' }}
                />
              </span>
              <span
                className="text-sm font-semibold"
                style={{ color: '#10B981' }}
              >
                Available for opportunities
              </span>
            </motion.div>

            {/* Location */}
            <motion.div variants={infoCardReveal}>
              <InfoLink
                href={`https://maps.google.com/?q=${encodeURIComponent(personalInfo.location)}`}
                icon={HiLocationMarker}
                label="Location"
                value={personalInfo.location}
              />
            </motion.div>

            {/* Email */}
            <motion.div variants={infoCardReveal}>
              <InfoLink
                href={`mailto:${personalInfo.email}`}
                icon={HiMail}
                label="Email"
                value={personalInfo.email}
              />
            </motion.div>

            {/* GitHub */}
            {personalInfo.socialLinks?.github && (
              <motion.div variants={infoCardReveal}>
                <InfoLink
                  href={personalInfo.socialLinks.github}
                  icon={FaGithub}
                  label="GitHub"
                  value={personalInfo.socialLinks.github.replace(
                    /^https?:\/\/(www\.)?github\.com\//,
                    '@',
                  )}
                />
              </motion.div>
            )}

            {/* LinkedIn */}
            {personalInfo.socialLinks?.linkedin && (
              <motion.div variants={infoCardReveal}>
                <InfoLink
                  href={personalInfo.socialLinks.linkedin}
                  icon={FaLinkedinIn}
                  label="LinkedIn"
                  value={personalInfo.socialLinks.linkedin.replace(
                    /^https?:\/\/(www\.)?linkedin\.com\/in\//,
                    '',
                  )}
                />
              </motion.div>
            )}

            {/* CV Download */}
            {personalInfo.resumeUrl && (
              <motion.div variants={infoCardReveal}>
                <InfoLink
                  href={personalInfo.resumeUrl}
                  icon={HiDownload}
                  label="Resume"
                  value="Download CV"
                  download
                />
              </motion.div>
            )}

            {/* Decorative divider */}
            <motion.div
              variants={infoCardReveal}
              className="pt-2"
            >
              <div
                className="h-[1px] w-full"
                style={{ backgroundColor: 'var(--color-border-primary)' }}
              />
              <p
                className="text-xs font-mono text-center mt-4 leading-relaxed"
                style={{ color: 'var(--color-text-muted)', opacity: 0.6 }}
              >
                Typically respond within 24 hours
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
