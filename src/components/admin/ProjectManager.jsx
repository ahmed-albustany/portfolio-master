import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiRefresh,
  HiPhotograph,
  HiX,
  HiExclamationCircle,
  HiCheckCircle,
} from 'react-icons/hi';
import { getDocuments, addDocument, updateDocument, deleteDocument } from '@/firebase/firestore';
import { uploadFile, deleteFile } from '@/firebase/storage';

/* ================================================================
   CATEGORIES
   ================================================================ */

const CATEGORIES = [
  { key: 'web-apps', label: 'Web Apps' },
  { key: 'systems', label: 'Systems' },
  { key: 'tools', label: 'Tools' },
];

/* ================================================================
   PROJECT FORM (Add / Edit)
   ================================================================ */

function ProjectForm({ project, onSave, onCancel }) {
  const isEditing = !!project;
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(project?.image || '');
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: project?.title || '',
      description: project?.description || '',
      longDescription: project?.longDescription || '',
      category: project?.category || 'web-apps',
      tags: project?.tags?.join(', ') || '',
      liveUrl: project?.liveUrl || '',
      githubUrl: project?.githubUrl || '',
      featured: project?.featured || false,
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5 MB.');
      return;
    }
    setError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    setError('');
    try {
      let imageUrl = project?.image || '';

      // Upload image if new file selected
      if (imageFile) {
        setUploading(true);
        const path = `projects/${Date.now()}_${imageFile.name}`;
        imageUrl = await uploadFile(imageFile, path);
        setUploading(false);
      }

      const payload = {
        title: data.title.trim(),
        description: data.description.trim(),
        longDescription: data.longDescription.trim(),
        category: data.category,
        tags: data.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        liveUrl: data.liveUrl.trim(),
        githubUrl: data.githubUrl.trim(),
        featured: data.featured,
        image: imageUrl,
      };

      if (isEditing) {
        await updateDocument('projects', project.id, payload);
      } else {
        await addDocument('projects', payload);
      }

      onSave();
    } catch {
      setError('Failed to save project. Please try again.');
      setUploading(false);
    }
  };

  return (
    <div
      className="rounded-xl p-5 sm:p-6"
      style={{ backgroundColor: '#111118', border: '1px solid #1e1e2e' }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-display font-bold text-white">
          {isEditing ? 'Edit Project' : 'New Project'}
        </h3>
        <button
          onClick={onCancel}
          className="p-2 rounded-lg hover:bg-[#1e1e2e] transition-colors"
        >
          <HiX className="w-4 h-4 text-[#666]" />
        </button>
      </div>

      {error && (
        <div
          className="flex items-center gap-2 px-4 py-3 mb-4 rounded-lg text-sm"
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Image upload */}
        <div>
          <label className="block text-xs font-mono font-medium text-[#888] uppercase tracking-wider mb-2">
            Image
          </label>
          <div className="flex items-center gap-4">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-14 object-cover rounded-lg border border-[#1e1e2e]"
              />
            ) : (
              <div className="w-20 h-14 rounded-lg bg-[#1e1e2e] flex items-center justify-center">
                <HiPhotograph className="w-6 h-6 text-[#444]" />
              </div>
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="px-4 py-2 text-xs font-mono font-medium rounded-lg
                         transition-colors hover:bg-[#1e1e2e]"
              style={{ color: '#888', border: '1px solid #1e1e2e' }}
            >
              {imagePreview ? 'Change' : 'Upload'}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Title */}
        <InputField
          label="Title"
          error={errors.title}
          {...register('title', { required: 'Title is required' })}
        />

        {/* Short description */}
        <InputField
          label="Short Description"
          error={errors.description}
          {...register('description', { required: 'Description is required' })}
        />

        {/* Long description */}
        <div>
          <label className="block text-xs font-mono font-medium text-[#888] uppercase tracking-wider mb-2">
            Long Description
          </label>
          <textarea
            rows={3}
            className="admin-input resize-none"
            {...register('longDescription')}
          />
        </div>

        {/* Category + Tags row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-medium text-[#888] uppercase tracking-wider mb-2">
              Category
            </label>
            <select className="admin-input" {...register('category')}>
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </div>
          <InputField
            label="Tags (comma-separated)"
            error={errors.tags}
            {...register('tags')}
          />
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Live URL" {...register('liveUrl')} />
          <InputField label="GitHub URL" {...register('githubUrl')} />
        </div>

        {/* Featured toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-[#1e1e2e] bg-[#111118]
                       text-[#00D4FF] focus:ring-[#00D4FF]/40"
            {...register('featured')}
          />
          <span className="text-sm text-[#888]">Featured project</span>
        </label>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold
                       rounded-lg transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
            style={{ backgroundColor: '#00D4FF', color: '#0a0a0f' }}
          >
            {isSubmitting || uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                {uploading ? 'Uploading...' : 'Saving...'}
              </>
            ) : (
              <>
                <HiCheckCircle className="w-4 h-4" />
                {isEditing ? 'Update' : 'Create'}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-sm font-semibold rounded-lg
                       transition-colors duration-200"
            style={{ color: '#888', backgroundColor: '#1e1e2e' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

/* ================================================================
   INPUT FIELD (reusable within admin forms)
   ================================================================ */

function InputField({ label, error, ...rest }) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-mono font-medium text-[#888] uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <input className="admin-input" {...rest} />
      {error && (
        <p className="text-xs text-red-500 mt-1">{error.message}</p>
      )}
    </div>
  );
}

/* ================================================================
   PROJECT MANAGER
   ================================================================ */

export default function ProjectManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formMode, setFormMode] = useState(null); // null | 'add' | project object

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const docs = await getDocuments('projects');
      setProjects(docs);
    } catch {
      setError('Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (project) => {
    if (!window.confirm(`Delete "${project.title}"?`)) return;
    try {
      // Attempt to delete storage image if it's a Firebase URL
      if (project.image && project.image.includes('firebasestorage')) {
        try {
          const path = decodeURIComponent(
            project.image.split('/o/')[1]?.split('?')[0] || '',
          );
          if (path) await deleteFile(path);
        } catch {
          /* image cleanup is best-effort */
        }
      }
      await deleteDocument('projects', project.id);
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
    } catch {
      setError('Failed to delete project.');
    }
  };

  const handleSave = () => {
    setFormMode(null);
    fetchProjects();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-display font-bold text-white">Projects</h2>
          <p className="text-sm text-[#666] font-mono">{projects.length} projects</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchProjects}
            className="flex items-center gap-2 px-3 py-2 text-xs font-mono font-medium
                       rounded-lg transition-colors duration-200 hover:bg-[#1e1e2e]"
            style={{ color: '#888', border: '1px solid #1e1e2e' }}
          >
            <HiRefresh className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setFormMode('add')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold
                       rounded-lg transition-all duration-200 hover:brightness-110"
            style={{ backgroundColor: '#00D4FF', color: '#0a0a0f' }}
          >
            <HiPlus className="w-3.5 h-3.5" />
            Add Project
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className="flex items-center gap-2 px-4 py-3 mb-4 rounded-lg text-sm"
          style={{
            color: '#ef4444',
            backgroundColor: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
          }}
        >
          <HiExclamationCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Form */}
      {formMode && (
        <div className="mb-6">
          <ProjectForm
            project={formMode === 'add' ? null : formMode}
            onSave={handleSave}
            onCancel={() => setFormMode(null)}
          />
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Project list */}
      {!loading && projects.length === 0 && !formMode && (
        <div className="text-center py-16">
          <HiPhotograph className="w-12 h-12 mx-auto mb-3 text-[#333]" />
          <p className="text-sm text-[#666] font-mono">No projects yet</p>
        </div>
      )}

      {!loading && projects.length > 0 && (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center gap-4 p-4 rounded-xl transition-colors duration-200"
              style={{
                backgroundColor: '#0e0e16',
                border: '1px solid #1e1e2e',
              }}
            >
              {/* Thumbnail */}
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-14 h-10 object-cover rounded-lg border border-[#1e1e2e] flex-shrink-0"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <div className="w-14 h-10 rounded-lg bg-[#1e1e2e] flex items-center justify-center flex-shrink-0">
                  <HiPhotograph className="w-5 h-5 text-[#444]" />
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-white truncate">
                    {project.title}
                  </h4>
                  {project.featured && (
                    <span className="px-1.5 py-0.5 text-[9px] font-mono font-semibold uppercase
                                     rounded bg-[#00D4FF]/10 text-[#00D4FF]">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#666] truncate">{project.description}</p>
              </div>

              {/* Category badge */}
              <span className="hidden sm:block px-2 py-1 text-[10px] font-mono uppercase
                               rounded-md bg-[#1e1e2e] text-[#666]">
                {project.category}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => setFormMode(project)}
                  className="p-2 rounded-lg hover:bg-[#1e1e2e] transition-colors"
                  title="Edit"
                >
                  <HiPencil className="w-4 h-4 text-[#888]" />
                </button>
                <button
                  onClick={() => handleDelete(project)}
                  className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                  title="Delete"
                >
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
