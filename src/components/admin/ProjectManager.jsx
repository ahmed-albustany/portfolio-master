import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  HiPlus, HiPencil, HiTrash, HiRefresh, HiX,
  HiExclamationCircle, HiCheckCircle, HiPhotograph,
  HiStar, HiArrowUp, HiArrowDown,
} from 'react-icons/hi';
import {
  getProjects, addProject, updateProject, deleteProject,
} from '@/firebase/firestore';

const CATEGORIES = [
  { key: 'web', label: 'Web' },
  { key: 'system', label: 'System' },
  { key: 'ai', label: 'AI' },
  { key: 'algorithm', label: 'Algorithm' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'database', label: 'Database' },
];

const STATUSES = ['completed', 'in-progress', 'classified'];

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

function TagInput({ value = [], onChange, accent = '#00D4FF' }) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const tag = input.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInput('');
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono rounded"
            style={{ color: accent, backgroundColor: `${accent}15`, border: `1px solid ${accent}25` }}>
            {tag}
            <button type="button" onClick={() => onChange(value.filter((t) => t !== tag))}
              className="hover:text-white">
              <HiX className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="admin-input flex-1" value={input} onChange={(e) => setInput(e.target.value)}
          placeholder="Add tag..." onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} />
        <button type="button" onClick={addTag}
          className="px-3 py-2 text-[10px] font-mono font-semibold rounded-lg"
          style={{ backgroundColor: `${accent}15`, color: accent, border: `1px solid ${accent}25` }}>
          Add
        </button>
      </div>
    </div>
  );
}

function ProjectForm({ project, onSave, onCancel }) {
  const isEditing = !!project;
  const [error, setError] = useState('');
  const [techStack, setTechStack] = useState(project?.techStack || []);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      title: project?.title || '',
      category: project?.category || 'web',
      status: project?.status || 'completed',
      description: project?.description || '',
      fullDescription: project?.fullDescription || '',
      imageURL: project?.imageURL || '',
      liveDemo: project?.liveDemo || '',
      github: project?.github || '',
      impact: project?.impact || '',
      missionNumber: project?.missionNumber || '',
      problemSolved: project?.problemSolved || '',
      featured: project?.featured || false,
      order: project?.order || 0,
    },
  });

  const onSubmit = async (data) => {
    setError('');
    try {
      const payload = {
        title: data.title.trim(),
        category: data.category,
        status: data.status,
        description: data.description.trim(),
        fullDescription: data.fullDescription.trim(),
        imageURL: data.imageURL.trim(),
        techStack,
        liveDemo: data.liveDemo.trim(),
        github: data.github.trim(),
        impact: data.impact.trim(),
        missionNumber: data.missionNumber.trim(),
        problemSolved: data.problemSolved.trim(),
        featured: data.featured,
        order: Number(data.order) || 0,
      };
      if (isEditing) {
        await updateProject(project.id, payload);
      } else {
        await addProject(payload);
      }
      onSave();
    } catch {
      setError('OPERATION FAILED \u2014 RETRY');
    }
  };

  return (
    <div className="rounded-xl p-5 sm:p-6" style={{ backgroundColor: '#0D1520', border: '1px solid #1A2840' }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-heading font-bold text-white">
          {isEditing ? 'Edit Mission' : 'New Mission'}
        </h3>
        <button onClick={onCancel} className="p-2 rounded-lg hover:bg-[#1A2840]">
          <HiX className="w-4 h-4 text-[#64748B]" />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-lg text-[11px] font-mono font-bold"
          style={{ color: '#FF3B3B', backgroundColor: 'rgba(255,59,59,0.08)', border: '1px solid rgba(255,59,59,0.2)' }}>
          <HiExclamationCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AdminField label="Image URL" placeholder="https://..." {...register('imageURL')} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Title" error={errors.title} {...register('title', { required: 'Required' })} />
          <AdminField label="Mission Number" placeholder="e.g. MSN-001" {...register('missionNumber')} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest mb-2">Category</label>
            <select className="admin-input" {...register('category')}>
              {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest mb-2">Status</label>
            <select className="admin-input" {...register('status')}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <AdminField label="Order" type="number" {...register('order')} />
        </div>

        <AdminField label="Short Description" error={errors.description}
          {...register('description', { required: 'Required' })} />

        <div>
          <label className="block text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest mb-2">Full Description</label>
          <textarea rows={3} className="admin-input resize-none" {...register('fullDescription')} />
        </div>

        <AdminField label="Problem Solved" {...register('problemSolved')} />
        <AdminField label="Impact" placeholder="e.g. 40% faster deployment" {...register('impact')} />

        <div>
          <label className="block text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest mb-2">Tech Stack</label>
          <TagInput value={techStack} onChange={setTechStack} accent="#0066FF" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Live Demo URL" {...register('liveDemo')} />
          <AdminField label="GitHub URL" {...register('github')} />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-[#1A2840] bg-[#0A1628] text-[#00D4FF] focus:ring-[#00D4FF]/40"
            {...register('featured')} />
          <span className="text-xs text-[#94A3B8] font-mono">Featured Mission</span>
        </label>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 text-[11px] font-mono font-bold uppercase tracking-widest
                       rounded-lg disabled:opacity-50 hover:brightness-110"
            style={{ backgroundColor: '#00D4FF', color: '#060B14' }}>
            {isSubmitting ? (
              <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Saving...</>
            ) : (
              <><HiCheckCircle className="w-4 h-4" /> {isEditing ? 'Update' : 'Create'}</>
            )}
          </button>
          <button type="button" onClick={onCancel}
            className="px-5 py-2.5 text-[11px] font-mono font-semibold rounded-lg"
            style={{ color: '#64748B', backgroundColor: '#1A2840' }}>
            Cancel
          </button>
        </div>
      </form>
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

export default function ProjectManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [formMode, setFormMode] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const docs = await getProjects();
      setProjects(docs.sort((a, b) => (a.order || 0) - (b.order || 0)));
    } catch {
      showToast('Failed to load projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async (project) => {
    if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) return;
    try {
      await deleteProject(project.id);
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      showToast('Project deleted');
    } catch {
      showToast('Failed to delete project', 'error');
    }
  };

  const handleSave = () => {
    setFormMode(null);
    fetchProjects();
    showToast(formMode === 'add' ? 'Project created' : 'Project updated');
  };

  return (
    <div>
      <Toast toast={toast} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-heading font-bold text-white">Projects</h2>
          <p className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider">{projects.length} missions</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchProjects}
            className="flex items-center gap-2 px-3 py-2 text-[10px] font-mono font-semibold uppercase tracking-wider rounded-lg hover:bg-[#1A2840]"
            style={{ color: '#64748B', border: '1px solid #1A2840' }}>
            <HiRefresh className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => setFormMode('add')}
            className="flex items-center gap-2 px-4 py-2 text-[11px] font-mono font-bold uppercase tracking-wider rounded-lg hover:brightness-110"
            style={{ backgroundColor: '#0066FF', color: '#fff' }}>
            <HiPlus className="w-3.5 h-3.5" /> Add Mission
          </button>
        </div>
      </div>

      {formMode && (
        <div className="mb-6">
          <ProjectForm project={formMode === 'add' ? null : formMode} onSave={handleSave} onCancel={() => setFormMode(null)} />
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && projects.length === 0 && !formMode && (
        <div className="text-center py-16">
          <HiPhotograph className="w-12 h-12 mx-auto mb-3 text-[#1A2840]" />
          <p className="text-xs font-mono text-[#334155]">No missions on record</p>
        </div>
      )}

      {!loading && projects.length > 0 && (
        <div className="space-y-2">
          {projects.map((project) => (
            <div key={project.id}
              className="flex items-center gap-4 p-4 rounded-xl transition-colors hover:border-[#1A2840]"
              style={{ backgroundColor: '#0D1520', border: '1px solid #1A2840' }}>
              {project.imageURL ? (
                <img src={project.imageURL} alt={project.title} loading="lazy"
                  className="w-14 h-10 object-cover rounded-lg border border-[#1A2840] flex-shrink-0"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              ) : (
                <div className="w-14 h-10 rounded-lg bg-[#1A2840] flex items-center justify-center flex-shrink-0">
                  <HiPhotograph className="w-5 h-5 text-[#334155]" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-white truncate">{project.title}</h4>
                  {project.featured && (
                    <HiStar className="w-3.5 h-3.5 text-[#FFB800] flex-shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-[#64748B] truncate">{project.description}</p>
              </div>

              <span className="hidden sm:block px-2 py-1 text-[9px] font-mono font-bold uppercase rounded"
                style={{ color: '#0066FF', backgroundColor: 'rgba(0,102,255,0.1)' }}>
                {project.category}
              </span>

              <span className="hidden sm:block px-2 py-1 text-[9px] font-mono font-bold uppercase rounded"
                style={{
                  color: project.status === 'completed' ? '#00FF88' : project.status === 'in-progress' ? '#FFB800' : '#0066FF',
                  backgroundColor: project.status === 'completed' ? 'rgba(0,255,136,0.1)' : project.status === 'in-progress' ? 'rgba(255,184,0,0.1)' : 'rgba(0,102,255,0.1)',
                }}>
                {project.status}
              </span>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => setFormMode(project)} className="p-2 rounded-lg hover:bg-[#1A2840]" title="Edit">
                  <HiPencil className="w-4 h-4 text-[#64748B]" />
                </button>
                <button onClick={() => handleDelete(project)} className="p-2 rounded-lg hover:bg-red-500/10" title="Delete">
                  <HiTrash className="w-4 h-4 text-red-500/70" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
