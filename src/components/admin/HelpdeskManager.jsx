import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  HiPlus, HiPencil, HiTrash, HiRefresh, HiX,
  HiExclamationCircle, HiCheckCircle, HiSupport,
} from 'react-icons/hi';
import { getHelpdesk, addHelpdesk, updateHelpdesk, deleteHelpdesk } from '@/firebase/firestore';

const ACCENT = '#FF6B35';

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
  const [hardwareSupported, setHardwareSupported] = useState(item?.hardwareSupported || []);
  const [softwareSupported, setSoftwareSupported] = useState(item?.softwareSupported || []);
  const [osSupported, setOsSupported] = useState(item?.osSupported || []);
  const [tools, setTools] = useState(item?.tools || []);
  const [achievements, setAchievements] = useState(item?.achievements || []);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      title: item?.title || '',
      organization: item?.organization || '',
      duration: item?.duration || '',
      avgTicketsResolved: item?.avgTicketsResolved || '',
      supportScope: item?.supportScope || '',
    },
  });

  const onSubmit = async (data) => {
    setError('');
    try {
      const payload = {
        title: data.title.trim(), organization: data.organization.trim(),
        duration: data.duration.trim(), avgTicketsResolved: data.avgTicketsResolved.trim(),
        supportScope: data.supportScope.trim(),
        hardwareSupported, softwareSupported, osSupported, tools, achievements,
      };
      if (isEditing) await updateHelpdesk(item.id, payload);
      else await addHelpdesk(payload);
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
          <AdminField label="Duration" {...register('duration')} />
          <AdminField label="Avg Tickets Resolved" placeholder="e.g. 500+" {...register('avgTicketsResolved')} />
          <AdminField label="Support Scope" placeholder="e.g. 200+ employees" {...register('supportScope')} />
        </div>
        <div>
          <label className="block text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest mb-2">Hardware Supported</label>
          <TagInput value={hardwareSupported} onChange={setHardwareSupported} accent={ACCENT} placeholder="e.g. Printers, Laptops..." />
        </div>
        <div>
          <label className="block text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest mb-2">Software Supported</label>
          <TagInput value={softwareSupported} onChange={setSoftwareSupported} accent="#0066FF" placeholder="e.g. Office 365, SAP..." />
        </div>
        <div>
          <label className="block text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest mb-2">OS Supported</label>
          <TagInput value={osSupported} onChange={setOsSupported} accent="#00D4FF" placeholder="e.g. Windows 11, macOS..." />
        </div>
        <div>
          <label className="block text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest mb-2">Tools</label>
          <TagInput value={tools} onChange={setTools} accent="#A855F7" placeholder="e.g. TeamViewer, JIRA..." />
        </div>
        <div>
          <label className="block text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest mb-2">Achievements</label>
          <TagInput value={achievements} onChange={setAchievements} accent="#00FF88" placeholder="Add achievement..." />
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

export default function HelpdeskManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [formMode, setFormMode] = useState(null);

  const showToast = (msg, type = 'success') => { setToast({ message: msg, type }); setTimeout(() => setToast(null), 3000); };
  const fetchItems = async () => { setLoading(true); try { setItems(await getHelpdesk()); } catch { showToast('Failed to load', 'error'); } finally { setLoading(false); } };
  useEffect(() => { fetchItems(); }, []);

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.title || item.organization}"?`)) return;
    try { await deleteHelpdesk(item.id); setItems((p) => p.filter((i) => i.id !== item.id)); showToast('Deleted'); }
    catch { showToast('Failed to delete', 'error'); }
  };
  const handleSave = () => { setFormMode(null); fetchItems(); showToast(formMode === 'add' ? 'Created' : 'Updated'); };

  return (
    <div>
      <Toast toast={toast} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-heading font-bold text-white">Helpdesk</h2>
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
        <div className="text-center py-16"><HiSupport className="w-12 h-12 mx-auto mb-3 text-[#1A2840]" /><p className="text-xs font-mono text-[#334155]">No entries</p></div>
      )}
      {!loading && items.length > 0 && (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: '#0D1520', border: '1px solid #1A2840' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${ACCENT}15` }}>
                <HiSupport className="w-4 h-4" style={{ color: ACCENT }} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white truncate">{item.title || item.organization || 'IT Support'}</h4>
                <p className="text-[11px] font-mono text-[#64748B] truncate">{item.avgTicketsResolved && `${item.avgTicketsResolved} tickets`} {item.duration && `\u2022 ${item.duration}`}</p>
              </div>
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
