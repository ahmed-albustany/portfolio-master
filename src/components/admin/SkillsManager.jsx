import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  HiPlus, HiPencil, HiTrash, HiRefresh, HiX,
  HiExclamationCircle, HiCheckCircle, HiAcademicCap,
} from 'react-icons/hi';
import { getSkills, addSkill, updateSkill, deleteSkill } from '@/firebase/firestore';

const CATEGORIES = ['development', 'infrastructure', 'engineering', 'tools', 'languages'];

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

function AdminField({ label, error, ...rest }) {
  return (
    <div>
      {label && <label className="block text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest mb-2">{label}</label>}
      <input className="admin-input" {...rest} />
      {error && <p className="text-[10px] font-mono text-[#FF3B3B] mt-1">{error.message}</p>}
    </div>
  );
}

function SkillForm({ skill, onSave, onCancel }) {
  const isEditing = !!skill;
  const [error, setError] = useState('');

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: skill?.name || '',
      level: skill?.level || 50,
      category: skill?.category || 'development',
      icon: skill?.icon || '',
      yearsUsed: skill?.yearsUsed || '',
    },
  });

  const levelVal = watch('level');

  const onSubmit = async (data) => {
    setError('');
    try {
      const payload = {
        name: data.name.trim(),
        level: Number(data.level) || 50,
        category: data.category,
        icon: data.icon.trim(),
        yearsUsed: data.yearsUsed.trim(),
      };
      if (isEditing) await updateSkill(skill.id, payload);
      else await addSkill(payload);
      onSave();
    } catch {
      setError('OPERATION FAILED \u2014 RETRY');
    }
  };

  const levelColor = levelVal >= 80 ? '#00FF88' : levelVal >= 60 ? '#00D4FF' : levelVal >= 40 ? '#FFB800' : '#FF6B35';

  return (
    <div className="rounded-xl p-5 sm:p-6" style={{ backgroundColor: '#0D1520', border: '1px solid #1A2840' }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-heading font-bold text-white">{isEditing ? 'Edit Skill' : 'New Skill'}</h3>
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
          <AdminField label="Skill Name" error={errors.name} {...register('name', { required: 'Required' })} />
          <AdminField label="Icon (react-icons name)" placeholder="e.g. SiReact" {...register('icon')} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest mb-2">
              Level: <span style={{ color: levelColor }}>{levelVal}%</span>
            </label>
            <input type="range" min="0" max="100" className="w-full accent-[#00D4FF]" {...register('level')} />
            <div className="w-full h-1.5 rounded-full mt-2" style={{ backgroundColor: '#1A2840' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${levelVal}%`, backgroundColor: levelColor }} />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest mb-2">Category</label>
            <select className="admin-input" {...register('category')}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <AdminField label="Years Used" placeholder="e.g. 3" {...register('yearsUsed')} />
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

export default function SkillsManager() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [formMode, setFormMode] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSkills = async () => {
    setLoading(true);
    try { setSkills(await getSkills()); } catch { showToast('Failed to load skills', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSkills(); }, []);

  const handleDelete = async (skill) => {
    if (!window.confirm(`Delete "${skill.name}"?`)) return;
    try {
      await deleteSkill(skill.id);
      setSkills((prev) => prev.filter((s) => s.id !== skill.id));
      showToast('Skill deleted');
    } catch { showToast('Failed to delete', 'error'); }
  };

  const handleSave = () => {
    setFormMode(null);
    fetchSkills();
    showToast(formMode === 'add' ? 'Skill created' : 'Skill updated');
  };

  const levelColor = (l) => l >= 80 ? '#00FF88' : l >= 60 ? '#00D4FF' : l >= 40 ? '#FFB800' : '#FF6B35';

  return (
    <div>
      <Toast toast={toast} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-heading font-bold text-white">Skills</h2>
          <p className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider">{skills.length} skills</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchSkills} className="flex items-center gap-2 px-3 py-2 text-[10px] font-mono font-semibold uppercase tracking-wider rounded-lg hover:bg-[#1A2840]" style={{ color: '#64748B', border: '1px solid #1A2840' }}>
            <HiRefresh className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => setFormMode('add')} className="flex items-center gap-2 px-4 py-2 text-[11px] font-mono font-bold uppercase tracking-wider rounded-lg hover:brightness-110" style={{ backgroundColor: '#A855F7', color: '#fff' }}>
            <HiPlus className="w-3.5 h-3.5" /> Add Skill
          </button>
        </div>
      </div>

      {formMode && (
        <div className="mb-6">
          <SkillForm skill={formMode === 'add' ? null : formMode} onSave={handleSave} onCancel={() => setFormMode(null)} />
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#A855F7] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && skills.length === 0 && !formMode && (
        <div className="text-center py-16">
          <HiAcademicCap className="w-12 h-12 mx-auto mb-3 text-[#1A2840]" />
          <p className="text-xs font-mono text-[#334155]">No skills registered</p>
        </div>
      )}

      {!loading && skills.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {skills.map((skill) => (
            <div key={skill.id} className="p-4 rounded-xl" style={{ backgroundColor: '#0D1520', border: '1px solid #1A2840' }}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-white truncate">{skill.name}</h4>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => setFormMode(skill)} className="p-1.5 rounded-lg hover:bg-[#1A2840]"><HiPencil className="w-3.5 h-3.5 text-[#64748B]" /></button>
                  <button onClick={() => handleDelete(skill)} className="p-1.5 rounded-lg hover:bg-red-500/10"><HiTrash className="w-3.5 h-3.5 text-red-500/70" /></button>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: '#1A2840' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${skill.level}%`, backgroundColor: levelColor(skill.level) }} />
                </div>
                <span className="text-[10px] font-mono font-bold" style={{ color: levelColor(skill.level) }}>{skill.level}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded" style={{ color: '#A855F7', backgroundColor: 'rgba(168,85,247,0.1)' }}>{skill.category}</span>
                {skill.yearsUsed && <span className="text-[10px] font-mono text-[#334155]">{skill.yearsUsed}y</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
