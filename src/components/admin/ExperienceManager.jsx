import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  HiPlus, HiPencil, HiTrash, HiRefresh, HiX,
  HiExclamationCircle, HiCheckCircle, HiBriefcase,
} from 'react-icons/hi';
import {
  getExperience, addExperience, updateExperience, deleteExperience,
} from '@/firebase/firestore';

const DEPARTMENTS = ['dev', 'development', 'it', 'admin', 'sysadmin', 'full-stack', 'fullstack'];
const TYPES = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Volunteer'];

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

function TagInput({ value = [], onChange, accent = '#00D4FF', placeholder = 'Add item...' }) {
  const [input, setInput] = useState('');
  const addTag = () => {
    const tag = input.trim();
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    setInput('');
  };
  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono rounded"
            style={{ color: accent, backgroundColor: `${accent}15`, border: `1px solid ${accent}25` }}>
            {tag}
            <button type="button" onClick={() => onChange(value.filter((t) => t !== tag))} className="hover:text-white">
              <HiX className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="admin-input flex-1" value={input} onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} />
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

function ExperienceForm({ item, onSave, onCancel }) {
  const isEditing = !!item;
  const [error, setError] = useState('');
  const [achievements, setAchievements] = useState(item?.achievements || []);
  const [technologies, setTechnologies] = useState(item?.technologies || item?.techStack || []);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      title: item?.title || item?.role || '',
      organization: item?.organization || item?.company || '',
      duration: item?.duration || item?.period || '',
      type: item?.type || 'Full-time',
      department: item?.department || 'dev',
      description: item?.description || '',
    },
  });

  const onSubmit = async (data) => {
    setError('');
    try {
      const payload = {
        title: data.title.trim(),
        organization: data.organization.trim(),
        duration: data.duration.trim(),
        type: data.type,
        department: data.department,
        description: data.description.trim(),
        achievements,
        technologies,
      };
      if (isEditing) {
        await updateExperience(item.id, payload);
      } else {
        await addExperience(payload);
      }
      onSave();
    } catch {
      setError('OPERATION FAILED \u2014 RETRY');
    }
  };

  return (
    <div className="rounded-xl p-5 sm:p-6" style={{ backgroundColor: '#0D1520', border: '1px solid #1A2840' }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-heading font-bold text-white">{isEditing ? 'Edit Entry' : 'New Entry'}</h3>
        <button onClick={onCancel} className="p-2 rounded-lg hover:bg-[#1A2840]"><HiX className="w-4 h-4 text-[#64748B]" /></button>
      </div>

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-lg text-[11px] font-mono font-bold"
          style={{ color: '#FF3B3B', backgroundColor: 'rgba(255,59,59,0.08)', border: '1px solid rgba(255,59,59,0.2)' }}>
          <HiExclamationCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Title / Role" error={errors.title} {...register('title', { required: 'Required' })} />
          <AdminField label="Organization" error={errors.organization} {...register('organization', { required: 'Required' })} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AdminField label="Duration" placeholder="e.g. 2022 - Present" {...register('duration')} />
          <div>
            <label className="block text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest mb-2">Type</label>
            <select className="admin-input" {...register('type')}>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest mb-2">Department</label>
            <select className="admin-input" {...register('department')}>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest mb-2">Description</label>
          <textarea rows={3} className="admin-input resize-none" {...register('description')} />
        </div>

        <div>
          <label className="block text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest mb-2">Achievements</label>
          <TagInput value={achievements} onChange={setAchievements} accent="#00FF88" placeholder="Add achievement..." />
        </div>

        <div>
          <label className="block text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest mb-2">Technologies</label>
          <TagInput value={technologies} onChange={setTechnologies} accent="#0066FF" placeholder="Add technology..." />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 text-[11px] font-mono font-bold uppercase tracking-widest rounded-lg disabled:opacity-50 hover:brightness-110"
            style={{ backgroundColor: '#00D4FF', color: '#060B14' }}>
            {isSubmitting ? (<><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Saving...</>) : (<><HiCheckCircle className="w-4 h-4" /> {isEditing ? 'Update' : 'Create'}</>)}
          </button>
          <button type="button" onClick={onCancel} className="px-5 py-2.5 text-[11px] font-mono font-semibold rounded-lg" style={{ color: '#64748B', backgroundColor: '#1A2840' }}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default function ExperienceManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [formMode, setFormMode] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const docs = await getExperience();
      setItems(docs);
    } catch {
      showToast('Failed to load experience', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.title || item.role}"? This cannot be undone.`)) return;
    try {
      await deleteExperience(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      showToast('Entry deleted');
    } catch {
      showToast('Failed to delete', 'error');
    }
  };

  const handleSave = () => {
    setFormMode(null);
    fetchItems();
    showToast(formMode === 'add' ? 'Entry created' : 'Entry updated');
  };

  return (
    <div>
      <Toast toast={toast} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-heading font-bold text-white">Experience</h2>
          <p className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider">{items.length} entries</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchItems} className="flex items-center gap-2 px-3 py-2 text-[10px] font-mono font-semibold uppercase tracking-wider rounded-lg hover:bg-[#1A2840]" style={{ color: '#64748B', border: '1px solid #1A2840' }}>
            <HiRefresh className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => setFormMode('add')} className="flex items-center gap-2 px-4 py-2 text-[11px] font-mono font-bold uppercase tracking-wider rounded-lg hover:brightness-110" style={{ backgroundColor: '#00D4FF', color: '#060B14' }}>
            <HiPlus className="w-3.5 h-3.5" /> Add Entry
          </button>
        </div>
      </div>

      {formMode && (
        <div className="mb-6">
          <ExperienceForm item={formMode === 'add' ? null : formMode} onSave={handleSave} onCancel={() => setFormMode(null)} />
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && items.length === 0 && !formMode && (
        <div className="text-center py-16">
          <HiBriefcase className="w-12 h-12 mx-auto mb-3 text-[#1A2840]" />
          <p className="text-xs font-mono text-[#334155]">No experience entries</p>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl"
              style={{ backgroundColor: '#0D1520', border: '1px solid #1A2840' }}>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white truncate">{item.title || item.role}</h4>
                <p className="text-[11px] text-[#00D4FF] font-mono truncate">{item.organization || item.company}</p>
                <p className="text-[10px] text-[#334155] font-mono">{item.duration || item.period}</p>
              </div>
              <span className="hidden sm:block px-2 py-1 text-[9px] font-mono font-bold uppercase rounded"
                style={{ color: '#00D4FF', backgroundColor: 'rgba(0,212,255,0.1)' }}>
                {item.department || item.type}
              </span>
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
