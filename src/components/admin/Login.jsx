import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { loginAdmin } from '@/firebase/auth';
import { HiLockClosed, HiMail, HiExclamationCircle } from 'react-icons/hi';

/* ================================================================
   ADMIN LOGIN
   Full-screen dark terminal-style login form.
   ================================================================ */

export default function Login({ onSuccess }) {
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setError('');
    try {
      await loginAdmin(data.email.trim(), data.password);
      onSuccess?.();
    } catch (err) {
      const code = err?.code || '';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else if (code === 'auth/user-not-found') {
        setError('No admin account found.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Try again later.');
      } else {
        setError('Authentication failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a0f]">
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Terminal header */}
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-t-xl border border-b-0"
          style={{
            backgroundColor: '#111118',
            borderColor: '#1e1e2e',
          }}
        >
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          <span className="flex-1 text-center text-xs font-mono text-[#555] tracking-wider">
            admin@portfolio ~ login
          </span>
        </div>

        {/* Form body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 sm:p-8 rounded-b-xl border"
          style={{
            backgroundColor: '#0e0e16',
            borderColor: '#1e1e2e',
          }}
        >
          {/* Logo / title */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
              style={{ backgroundColor: 'rgba(0,212,255,0.08)' }}
            >
              <HiLockClosed className="w-7 h-7 text-[#00D4FF]" />
            </div>
            <h1 className="text-xl font-display font-bold text-white mb-1">
              Admin Panel
            </h1>
            <p className="text-sm text-[#666] font-mono">
              Authenticate to continue
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div
              className="flex items-center gap-2 px-4 py-3 mb-6 rounded-lg text-sm font-medium"
              style={{
                color: '#ef4444',
                backgroundColor: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
              }}
            >
              <HiExclamationCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="block text-xs font-mono font-medium text-[#888] uppercase tracking-wider mb-2">
              Email
            </label>
            <div className="relative">
              <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
              <input
                type="email"
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 text-sm font-mono text-white rounded-lg
                           outline-none transition-all duration-200
                           focus:ring-2 focus:ring-[#00D4FF]/40"
                style={{
                  backgroundColor: '#111118',
                  border: '1px solid #1e1e2e',
                }}
                placeholder="admin@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email',
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1.5">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-xs font-mono font-medium text-[#888] uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
              <input
                type="password"
                autoComplete="current-password"
                className="w-full pl-10 pr-4 py-3 text-sm font-mono text-white rounded-lg
                           outline-none transition-all duration-200
                           focus:ring-2 focus:ring-[#00D4FF]/40"
                style={{
                  backgroundColor: '#111118',
                  border: '1px solid #1e1e2e',
                }}
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Min 6 characters' },
                })}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1.5">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3
                       text-sm font-semibold rounded-lg transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed
                       hover:brightness-110"
            style={{
              backgroundColor: '#00D4FF',
              color: '#0a0a0f',
            }}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Authenticating...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Footer */}
          <p className="text-center text-xs text-[#444] font-mono mt-6">
            Protected area &middot; Authorized personnel only
          </p>
        </form>
      </div>
    </div>
  );
}
