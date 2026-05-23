import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { loginAdmin } from '@/firebase/auth';
import { HiLockClosed, HiMail, HiExclamationCircle, HiShieldCheck } from 'react-icons/hi';

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
        setError('ACCESS DENIED \u2014 CHECK CREDENTIALS');
      } else if (code === 'auth/user-not-found') {
        setError('ACCESS DENIED \u2014 NO OPERATOR FOUND');
      } else if (code === 'auth/too-many-requests') {
        setError('LOCKOUT \u2014 TOO MANY ATTEMPTS');
      } else {
        setError('AUTHENTICATION FAILED \u2014 RETRY');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#060B14' }}>
      {/* Grid background */}
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
          className="flex items-center gap-2 px-4 py-3 rounded-t-xl"
          style={{ backgroundColor: '#0A1628', border: '1px solid #1A2840', borderBottom: 'none' }}
        >
          <span className="w-3 h-3 rounded-full bg-[#FF3B3B]" />
          <span className="w-3 h-3 rounded-full bg-[#FFB800]" />
          <span className="w-3 h-3 rounded-full bg-[#00FF88]" />
          <span className="flex-1 text-center text-[10px] font-mono text-[#64748B] uppercase tracking-widest">
            admin@command-center ~ auth
          </span>
        </div>

        {/* Form body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 sm:p-8 rounded-b-xl"
          style={{ backgroundColor: '#0D1520', border: '1px solid #1A2840' }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
              style={{ backgroundColor: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)' }}
            >
              <HiShieldCheck className="w-8 h-8 text-[#00D4FF]" />
            </div>
            <h1 className="text-lg font-heading font-bold text-white tracking-wide mb-1">
              COMMAND CENTER ACCESS
            </h1>
            <p className="text-[11px] font-mono text-[#64748B] uppercase tracking-widest">
              Authentication Required
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div
              className="flex items-center gap-2 px-4 py-3 mb-6 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider"
              style={{
                color: '#FF3B3B',
                backgroundColor: 'rgba(255,59,59,0.08)',
                border: '1px solid rgba(255,59,59,0.2)',
              }}
            >
              <HiExclamationCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="block text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest mb-2">
              Operator Email
            </label>
            <div className="relative">
              <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#334155]" />
              <input
                type="email"
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 text-sm font-mono text-white rounded-lg
                           outline-none transition-all duration-200
                           focus:ring-2 focus:ring-[#00D4FF]/30"
                style={{ backgroundColor: '#0A1628', border: '1px solid #1A2840' }}
                placeholder="admin@command-center.io"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                })}
              />
            </div>
            {errors.email && (
              <p className="text-[10px] font-mono text-[#FF3B3B] mt-1.5">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest mb-2">
              Access Code
            </label>
            <div className="relative">
              <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#334155]" />
              <input
                type="password"
                autoComplete="current-password"
                className="w-full pl-10 pr-4 py-3 text-sm font-mono text-white rounded-lg
                           outline-none transition-all duration-200
                           focus:ring-2 focus:ring-[#00D4FF]/30"
                style={{ backgroundColor: '#0A1628', border: '1px solid #1A2840' }}
                placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Min 6 characters' },
                })}
              />
            </div>
            {errors.password && (
              <p className="text-[10px] font-mono text-[#FF3B3B] mt-1.5">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3
                       text-[11px] font-mono font-bold uppercase tracking-widest rounded-lg
                       transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                       hover:brightness-110"
            style={{ backgroundColor: '#00D4FF', color: '#060B14' }}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Verifying Clearance...
              </>
            ) : (
              <>
                <HiLockClosed className="w-4 h-4" />
                Authenticate
              </>
            )}
          </button>

          <p className="text-center text-[10px] text-[#334155] font-mono uppercase tracking-widest mt-6">
            Restricted Area &middot; Authorized Personnel Only
          </p>
        </form>
      </div>
    </div>
  );
}
