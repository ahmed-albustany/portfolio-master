import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { HiChartBar, HiCheckCircle, HiExclamationCircle, HiRefresh } from 'react-icons/hi';
import { getStats, updateStats } from '@/firebase/firestore';

const STAT_FIELDS = [
  { key: 'projects', label: 'Projects Built', accent: '#0066FF' },
  { key: 'years', label: 'Years Experience', accent: '#00D4FF' },
  { key: 'users', label: 'Users Managed', accent: '#00FF88' },
  { key: 'certifications', label: 'Certifications', accent: '#A855F7' },
  { key: 'systems', label: 'Systems Deployed', accent: '#FFB800' },
  { key: 'tickets', label: 'Tickets Resolved', accent: '#FF6B35' },
];

export default function StatsManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getStats();
      if (data) {
        const defaults = {};
        STAT_FIELDS.forEach((f) => { defaults[f.key] = data[f.key] || 0; });
        reset(defaults);
      }
    } catch {
      showToast('Failed to load stats', 'error');
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
      const payload = {};
      STAT_FIELDS.forEach((f) => { payload[f.key] = Number(data[f.key]) || 0; });
      await updateStats(payload);
      showToast('Stats updated successfully');
    } catch {
      showToast('Failed to save stats', 'error');
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
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-mono font-semibold shadow-lg"
          style={{
            backgroundColor: toast.type === 'error' ? 'rgba(255,59,59,0.15)' : 'rgba(0,255,136,0.15)',
            color: toast.type === 'error' ? '#FF3B3B' : '#00FF88',
            border: `1px solid ${toast.type === 'error' ? 'rgba(255,59,59,0.3)' : 'rgba(0,255,136,0.3)'}`,
          }}>
          {toast.type === 'error' ? <HiExclamationCircle className="w-4 h-4" /> : <HiCheckCircle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-heading font-bold text-white">Stats</h2>
          <p className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider">Hero section counters</p>
        </div>
        <button onClick={fetchData}
          className="flex items-center gap-2 px-3 py-2 text-[10px] font-mono font-semibold uppercase tracking-wider rounded-lg hover:bg-[#1A2840]"
          style={{ color: '#64748B', border: '1px solid #1A2840' }}>
          <HiRefresh className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl p-5 sm:p-6"
            style={{ backgroundColor: '#0D1520', border: '1px solid #1A2840' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {STAT_FIELDS.map((field) => (
            <div key={field.key} className="p-4 rounded-lg" style={{ backgroundColor: '#0A1628', border: '1px solid #1A2840' }}>
              <label className="block text-[10px] font-mono font-semibold uppercase tracking-widest mb-2"
                     style={{ color: field.accent }}>
                {field.label}
              </label>
              <input
                type="number"
                min="0"
                className="admin-input text-center text-lg font-heading font-bold"
                {...register(field.key)}
              />
            </div>
          ))}
        </div>

        <button type="submit" disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 text-[11px] font-mono font-bold uppercase tracking-widest
                     rounded-lg transition-all duration-200 disabled:opacity-50 hover:brightness-110"
          style={{ backgroundColor: '#00D4FF', color: '#060B14' }}>
          {saving ? (
            <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Saving...</>
          ) : (
            <><HiCheckCircle className="w-4 h-4" /> Save Stats</>
          )}
        </button>
      </form>
    </div>
  );
}
