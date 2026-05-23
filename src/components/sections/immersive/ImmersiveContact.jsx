import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useForm } from 'react-hook-form';
import { HiMail, HiLocationMarker } from 'react-icons/hi';
import { addDocument } from '@/firebase/firestore';
import { personalInfo } from '@/data/portfolioData';

export default function ImmersiveContact() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [submitStatus, setSubmitStatus] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await addDocument('messages', {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      });
      setSubmitStatus('success');
      reset();
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  return (
    <section id="contact" className="section-padding bg-dark-100">
      <div className="section-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="heading-secondary text-center text-light-200 mb-4">
            Transmit a <span className="text-gradient">Signal</span>
          </h2>
          <p className="text-center text-light-400 mb-12 max-w-xl mx-auto font-mono">
            Send a message across the digital cosmos
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="rounded-2xl border border-primary/10 bg-dark-50/50 p-6 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                <HiMail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-light-200 mb-1">Frequency</h3>
                <p className="text-sm text-light-400 font-mono">{personalInfo.email}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-dark-50/50 p-6 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                <HiLocationMarker className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-light-200 mb-1">Coordinates</h3>
                <p className="text-sm text-light-400 font-mono">{personalInfo.location}</p>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            onSubmit={handleSubmit(onSubmit)}
            className="lg:col-span-3 rounded-2xl border border-primary/10 bg-dark-50/50 p-6 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  {...register('name', { required: 'Name is required' })}
                  placeholder="Sender Identity"
                  className="w-full px-4 py-3 bg-dark-200 border border-primary/10 rounded-xl text-light-200
                             placeholder:text-light-600 focus:outline-none focus:ring-2 focus:ring-primary/50
                             focus:border-primary transition-all duration-200 font-mono text-sm"
                />
                {errors.name && (
                  <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                  })}
                  placeholder="Return Frequency"
                  className="w-full px-4 py-3 bg-dark-200 border border-primary/10 rounded-xl text-light-200
                             placeholder:text-light-600 focus:outline-none focus:ring-2 focus:ring-primary/50
                             focus:border-primary transition-all duration-200 font-mono text-sm"
                />
                {errors.email && (
                  <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <input
                {...register('subject', { required: 'Subject is required' })}
                placeholder="Signal Subject"
                className="w-full px-4 py-3 bg-dark-200 border border-primary/10 rounded-xl text-light-200
                           placeholder:text-light-600 focus:outline-none focus:ring-2 focus:ring-primary/50
                           focus:border-primary transition-all duration-200 font-mono text-sm"
              />
              {errors.subject && (
                <p className="text-xs text-red-400 mt-1">{errors.subject.message}</p>
              )}
            </div>

            <div>
              <textarea
                {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'At least 10 characters' } })}
                placeholder="Transmission Content"
                rows={5}
                className="w-full px-4 py-3 bg-dark-200 border border-primary/10 rounded-xl text-light-200
                           placeholder:text-light-600 focus:outline-none focus:ring-2 focus:ring-primary/50
                           focus:border-primary transition-all duration-200 resize-none font-mono text-sm"
              />
              {errors.message && (
                <p className="text-xs text-red-400 mt-1">{errors.message.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-primary text-dark font-semibold rounded-xl
                         hover:bg-primary-400 transition-all duration-300 hover:shadow-glow-md
                         active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-mono"
            >
              {isSubmitting ? 'Transmitting...' : 'Transmit Signal'}
            </button>

            {submitStatus === 'success' && (
              <p className="text-sm text-green-400 text-center font-mono">Signal received!</p>
            )}
            {submitStatus === 'error' && (
              <p className="text-sm text-red-400 text-center font-mono">Transmission failed. Retry.</p>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
