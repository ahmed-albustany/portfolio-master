import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { HiUser, HiCheckCircle, HiExclamationCircle, HiRefresh } from 'react-icons/hi';
import { getPersonalInfo, updatePersonalInfo } from '@/firebase/firestore';

export default function PersonalInfoManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getPersonalInfo();
      if (data) {
        reset({
          name: data.name || '',
          title: data.title || '',
          subtitle: data.subtitle || '',
          bio: data.bio || '',
          email: data.email || '',
          location: data.location || '',
          availability: data.availability || '',
          photoURL: data.photoURL || '',
          resumeUrl: data.resumeUrl || '',
          github: data.socialLinks?.github || '',
          linkedin: data.socialLinks?.linkedin || '',
        });
      }
    } catch {
      showToast('Failed to load personal info', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await updatePersonalInfo({
        name: data.name.trim(),
        title: data.title.trim(),
        subtitle: data.subtitle.trim(),
        bio: data.bio.trim(),
        email: data.email.trim(),
        location: data.location.trim(),
        availability: data.availability.trim(),
        photoURL: data.photoURL.trim(),
        resumeUrl: data.resumeUrl.trim(),
        socialLinks: {
          github: data.github.trim(),
          linkedin: data.linkedin.trim(),
        },
      });
      showToast('Personal info updated successfully');
    } catch {
      showToast('Failed to save changes', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-mono font-semibold shadow-lg"
          style={{
            backgroundColor: toast.type === 'error' ? 'rgba(255,59,59,0.15)' : 'rgba(0,255,136,0.15)',
            color: toast.type === 'error' ? '#FF3B3B' : '#00FF88',
            border: `1px solid ${toast.type === 'error' ? 'rgba(255,59,59,0.3)' : 'rgba(0,255,136,0.3)'}`,
          }}
        >
          {toast.type === 'error' ? <HiExclamationCircle className="w-4 h-4" /> : <HiCheckCircle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-heading font-bold text-white">Personal Info</h2>
          <p className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider">Operator profile data</p>
        </div>
        <button onClick={fetchData}
          className="flex items-center gap-2 px-3 py-2 text-[10px] font-mono font-semibold uppercase tracking-wider rounded-lg hover:bg-[#1A2840]"
          style={{ color: '#64748B', border: '1px solid #1A2840' }}>
          <HiRefresh className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl p-5 sm:p-6 space-y-4"
            style={{ backgroundColor: '#0D1520', border: '1px solid #1A2840' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Full Name" error={errors.name}
            {...register('name', { required: 'Name is required' })} />
          <AdminField label="Title" error={errors.title}
            {...register('title', { required: 'Title is required' })} />
        </div>

        <AdminField label="Subtitle" {...register('subtitle')} />

        <div>
          <label className="block text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest mb-2">Bio</label>
          <textarea rows={4} className="admin-input resize-none" {...register('bio')} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Email" type="email" {...register('email')} />
          <AdminField label="Location" {...register('location')} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Availability" placeholder="e.g. Available for opportunities" {...register('availability')} />
          <AdminField label="Photo URL" placeholder="https://..." {...register('photoURL')} />
        </div>

        <AdminField label="Resume URL" placeholder="/resume.pdf or https://..." {...register('resumeUrl')} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="GitHub URL" placeholder="https://github.com/..." {...register('github')} />
          <AdminField label="LinkedIn URL" placeholder="https://linkedin.com/in/..." {...register('linkedin')} />
        </div>

        <div className="pt-2">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 text-[11px] font-mono font-bold uppercase tracking-widest
                       rounded-lg transition-all duration-200 disabled:opacity-50 hover:brightness-110"
            style={{ backgroundColor: '#00D4FF', color: '#060B14' }}>
            {saving ? (
              <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Saving...</>
            ) : (
              <><HiCheckCircle className="w-4 h-4" /> Save Changes</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function AdminField({ label, error, ...rest }) {
  return (
    <div>
      {label && (
        <label className="block text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest mb-2">
          {label}
        </label>
      )}
      <input className="admin-input" {...rest} />
      {error && <p className="text-[10px] font-mono text-[#FF3B3B] mt-1">{error.message}</p>}
    </div>
  );
}
