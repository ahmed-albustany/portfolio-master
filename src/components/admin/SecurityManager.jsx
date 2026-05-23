import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  HiPlus, HiPencil, HiTrash, HiRefresh, HiX,
  HiExclamationCircle, HiCheckCircle, HiLockClosed,
} from 'react-icons/hi';
import { getSecurity, addSecurity, updateSecurity, deleteSecurity } from '@/firebase/firestore';

const ACCENT = '#FF3B3B';
const SYSTEM_TYPES = ['CCTV', 'Access Control', 'Alarm', 'Firewall', 'Physical Security'];

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-mono font-semibold shadow-lg"
      style={{
        backgroundColor: toast.type === 'error' ? 'rgba(255,59,59,0.15)' : 'rgba(0,255,136,0.15)',
        color: toast.type === 'error' ? '#FF3B3B' : '#00FF88',
        border: `1px solid ${toast.type === 'error' ? 'rgba(255,59,59,0.3)' : 'rgba(0,255,136,0.3)'}`,
      }}>
      {toast.type === 'error' ? <HiExclamationCircle className="w-4 h-4" /> : <HiCheckCircle className="w-4 h-4" />}
      {toast.message}
    </div>
  );
}

function TagInput({ value = [], onChange, accent = ACCENT, placeholder = 'Add item...' }) {
  const [input, setInput] = useState('');
  const addTag = () => { const t = input.trim(); if (t && !value.includes(t)) onChange([...value, t]); setInput(''); };
  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono rounded"
            style={{ color: accent, backgroundColor: `${accent}15`, border: `1px solid ${accent}25` }}>
            {tag}<button type="button" onClick={() => onChange(value.filter((x) => x !== tag))} className="hover:text-white"><HiX className="w-3 h-3" /></button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="admin-input flex-1" value={input} onChange={(e) => setInput(e.target.value)} placeholder={placeholder}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} />
        <button type="button" onClick={addTag} className="px-3 py-2 text-[10px] font-mono font-semibold rounded-lg"
          style={{ backgroundColor: `${accent}15`, color: accent, border: `1px solid ${accent}25` }}>Add</button>
      </div>
    </div>
  );
}

function AdminField({ label, error, ...rest }) {
  return (
    <div>
      {label && <label className="block text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest mb-2">{label}</label>}
      <input className="admin-input" {...rest} />
      {error && <p className="text-[10px] font-mono text-[#FF3B3B] mt-1">{error.message}</p>}
    </div>
  );
}

function ItemForm({ item, onSave, onCancel }) {
  const isEditing = !!item;
  const [error, setError] = useState('');
  const [coverageAreas, setCoverageAreas] = useState(item?.coverageAreas || []);
  const [responsibilities, setResponsibilities] = useState(item?.responsibilities || []);
  const [improvements, setImprovements] = useState(item?.improvements || []);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      title: item?.title || '',
      organization: item?.organization || '',
      systemType: item?.systemType || 'CCTV',
      scale: item?.scale || '',
      duration: item?.duration || '',
      software: item?.software || '',
      hardware: item?.hardware || '',
    },
  });

  const onSubmit = async (data) => {
    setError('');
    try {
      const payload = {
        title: data.title.trim(), organization: data.organization.trim(),
        systemType: data.systemType, scale: data.scale.trim(),
        duration: data.duration.trim(), software: data.software.trim(),
        hardware: data.hardware.trim(),
        coverageAreas, responsibilities, improvements,
      };
      if (isEditing) await updateSecurity(item.id, payload);
      else await addSecurity(payload);
      onSave();
    } catch { setError('OPERATION FAILED'); }
  };

  return (
    <div className="rounded-xl p-5 sm:p-6" style={{ backgroundColor: '#0D1520', border: '1px solid #1A2840' }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-heading font-bold text-white">{isEditing ? 'Edit Entry' : 'New Entry'}</h3>
        <button onClick={onCancel} className="p-2 rounded-lg hover:bg-[#1A2840]"><HiX className="w-4 h-4 text-[#64748B]" /></button>
      </div>
      {error && <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-lg text-[11px] font-mono font-bold" style={{ color: '#FF3B3B', backgroundColor: 'rgba(255,59,59,0.08)', border: '1px solid rgba(255,59,59,0.2)' }}><HiExclamationCircle className="w-4 h-4" /> {error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Title" error={errors.title} {...register('title', { required: 'Required' })} />
          <AdminField label="Organization" {...register('organization')} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest mb-2">System Type</label>
            <select className="admin-input" {...register('systemType')}>
              {SYSTEM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <AdminField label="Scale" placeholder="e.g. 64 cameras" {...register('scale')} />
          <AdminField label="Duration" {...register('duration')} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Software" placeholder="e.g. Hikvision iVMS" {...register('software')} />
          <AdminField label="Hardware" placeholder="e.g. Hikvision DS-7600" {...register('hardware')} />
        </div>
        <div>
          <label className="block text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest mb-2">Coverage Areas</label>
          <TagInput value={coverageAreas} onChange={setCoverageAreas} accent={ACCENT} placeholder="e.g. Entrance, Parking..." />
        </div>
        <div>
          <label className="block text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest mb-2">Responsibilities</label>
          <TagInput value={responsibilities} onChange={setResponsibilities} accent="#0066FF" placeholder="Add responsibility..." />
        </div>
        <div>
          <label className="block text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest mb-2">Improvements</label>
          <TagInput value={improvements} onChange={setImprovements} accent="#00FF88" placeholder="Add improvement..." />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-5 py-2.5 text-[11px] font-mono font-bold uppercase tracking-widest rounded-lg disabled:opacity-50 hover:brightness-110" style={{ backgroundColor: ACCENT, color: '#fff' }}>
            {isSubmitting ? (<><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Saving...</>) : (<><HiCheckCircle className="w-4 h-4" /> {isEditing ? 'Update' : 'Create'}</>)}
          </button>
          <button type="button" onClick={onCancel} className="px-5 py-2.5 text-[11px] font-mono font-semibold rounded-lg" style={{ color: '#64748B', backgroundColor: '#1A2840' }}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default function SecurityManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [formMode, setFormMode] = useState(null);

  const showToast = (msg, type = 'success') => { setToast({ message: msg, type }); setTimeout(() => setToast(null), 3000); };
  const fetchItems = async () => { setLoading(true); try { setItems(await getSecurity()); } catch { showToast('Failed to load', 'error'); } finally { setLoading(false); } };
  useEffect(() => { fetchItems(); }, []);

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    try { await deleteSecurity(item.id); setItems((p) => p.filter((i) => i.id !== item.id)); showToast('Deleted'); }
    catch { showToast('Failed to delete', 'error'); }
  };
  const handleSave = () => { setFormMode(null); fetchItems(); showToast(formMode === 'add' ? 'Created' : 'Updated'); };

  return (
    <div>
      <Toast toast={toast} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-heading font-bold text-white">Security</h2>
          <p className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider">{items.length} entries</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchItems} className="flex items-center px-3 py-2 text-[10px] font-mono font-semibold uppercase tracking-wider rounded-lg hover:bg-[#1A2840]" style={{ color: '#64748B', border: '1px solid #1A2840' }}>
            <HiRefresh className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => setFormMode('add')} className="flex items-center gap-2 px-4 py-2 text-[11px] font-mono font-bold uppercase tracking-wider rounded-lg hover:brightness-110" style={{ backgroundColor: ACCENT, color: '#fff' }}>
            <HiPlus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </div>
      {formMode && <div className="mb-6"><ItemForm item={formMode === 'add' ? null : formMode} onSave={handleSave} onCancel={() => setFormMode(null)} /></div>}
      {loading && <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: ACCENT }} /></div>}
      {!loading && items.length === 0 && !formMode && (
        <div className="text-center py-16"><HiLockClosed className="w-12 h-12 mx-auto mb-3 text-[#1A2840]" /><p className="text-xs font-mono text-[#334155]">No entries</p></div>
      )}
      {!loading && items.length > 0 && (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: '#0D1520', border: '1px solid #1A2840' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${ACCENT}15` }}>
                <HiLockClosed className="w-4 h-4" style={{ color: ACCENT }} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white truncate">{item.title}</h4>
                <p className="text-[11px] font-mono text-[#64748B] truncate">{item.organization}</p>
              </div>
              {item.systemType && <span className="hidden sm:block px-2 py-1 text-[9px] font-mono font-bold uppercase rounded" style={{ color: ACCENT, backgroundColor: `${ACCENT}10` }}>{item.systemType}</span>}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => setFormMode(item)} className="p-2 rounded-lg hover:bg-[#1A2840]"><HiPencil className="w-4 h-4 text-[#64748B]" /></button>
                <button onClick={() => handleDelete(item)} className="p-2 rounded-lg hover:bg-red-500/10"><HiTrash className="w-4 h-4 text-red-500/70" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
