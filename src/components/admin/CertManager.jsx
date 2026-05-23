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
  HiShieldCheck,
} from 'react-icons/hi';
import { getDocuments, addDocument, updateDocument, deleteDocument } from '@/firebase/firestore';
import { uploadFile, deleteFile } from '@/firebase/storage';

/* ================================================================
   CATEGORIES
   ================================================================ */

const CERT_CATEGORIES = [
  { key: 'cloud', label: 'Cloud' },
  { key: 'dev', label: 'Development' },
  { key: 'security', label: 'Security' },
  { key: 'it', label: 'IT' },
];

/* ================================================================
   CERT FORM
   ================================================================ */

function CertForm({ cert, onSave, onCancel }) {
  const isEditing = !!cert;
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(cert?.badgeImage || '');
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: cert?.name || '',
      issuer: cert?.issuer || '',
      date: cert?.date || '',
      credentialId: cert?.credentialId || '',
      credentialUrl: cert?.credentialUrl || '',
      category: cert?.category || 'cloud',
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
      let badgeImage = cert?.badgeImage || '';

      if (imageFile) {
        setUploading(true);
        const path = `certs/${Date.now()}_${imageFile.name}`;
        badgeImage = await uploadFile(imageFile, path);
        setUploading(false);
      }

      const payload = {
        name: data.name.trim(),
        issuer: data.issuer.trim(),
        date: data.date.trim(),
        credentialId: data.credentialId.trim(),
        credentialUrl: data.credentialUrl.trim(),
        category: data.category,
        badgeImage,
      };

      if (isEditing) {
        await updateDocument('certificates', cert.id, payload);
      } else {
        await addDocument('certificates', payload);
      }

      onSave();
    } catch {
      setError('Failed to save certificate. Please try again.');
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
          {isEditing ? 'Edit Certificate' : 'New Certificate'}
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
        {/* Badge image */}
        <div>
          <label className="block text-xs font-mono font-medium text-[#888] uppercase tracking-wider mb-2">
            Badge Image
          </label>
          <div className="flex items-center gap-4">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-16 h-16 object-contain rounded-lg border border-[#1e1e2e] bg-[#1e1e2e] p-1"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-[#1e1e2e] flex items-center justify-center">
                <HiShieldCheck className="w-6 h-6 text-[#444]" />
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

        {/* Name + Issuer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminInput
            label="Cert Name"
            error={errors.name}
            {...register('name', { required: 'Name is required' })}
          />
          <AdminInput
            label="Issuer"
            error={errors.issuer}
            {...register('issuer', { required: 'Issuer is required' })}
          />
        </div>

        {/* Date + Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminInput
            label="Date (e.g. 2024)"
            error={errors.date}
            {...register('date', { required: 'Date is required' })}
          />
          <div>
            <label className="block text-xs font-mono font-medium text-[#888] uppercase tracking-wider mb-2">
              Category
            </label>
            <select className="admin-input" {...register('category')}>
              {CERT_CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Credential ID + URL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminInput label="Credential ID" {...register('credentialId')} />
          <AdminInput label="Verify URL" {...register('credentialUrl')} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold
                       rounded-lg transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
            style={{ backgroundColor: '#A855F7', color: '#fff' }}
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
   ADMIN INPUT
   ================================================================ */

function AdminInput({ label, error, ...rest }) {
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
   CERT MANAGER
   ================================================================ */

export default function CertManager() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formMode, setFormMode] = useState(null);

  const fetchCerts = async () => {
    setLoading(true);
    setError('');
    try {
      const docs = await getDocuments('certificates', 'date');
      setCerts(docs);
    } catch {
      setError('Failed to load certifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const handleDelete = async (cert) => {
    if (!window.confirm(`Delete "${cert.name}"?`)) return;
    try {
      if (cert.badgeImage && cert.badgeImage.includes('firebasestorage')) {
        try {
          const path = decodeURIComponent(
            cert.badgeImage.split('/o/')[1]?.split('?')[0] || '',
          );
          if (path) await deleteFile(path);
        } catch {
          /* best-effort */
        }
      }
      await deleteDocument('certificates', cert.id);
      setCerts((prev) => prev.filter((c) => c.id !== cert.id));
    } catch {
      setError('Failed to delete certificate.');
    }
  };

  const handleSave = () => {
    setFormMode(null);
    fetchCerts();
  };

  const ACCENT = {
    cloud: '#00D4FF',
    dev: '#A855F7',
    security: '#EF4444',
    it: '#10B981',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-display font-bold text-white">Certifications</h2>
          <p className="text-sm text-[#666] font-mono">{certs.length} certificates</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchCerts}
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
            style={{ backgroundColor: '#A855F7', color: '#fff' }}
          >
            <HiPlus className="w-3.5 h-3.5" />
            Add Certificate
          </button>
        </div>
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
          <HiExclamationCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {formMode && (
        <div className="mb-6">
          <CertForm
            cert={formMode === 'add' ? null : formMode}
            onSave={handleSave}
            onCancel={() => setFormMode(null)}
          />
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#A855F7] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && certs.length === 0 && !formMode && (
        <div className="text-center py-16">
          <HiShieldCheck className="w-12 h-12 mx-auto mb-3 text-[#333]" />
          <p className="text-sm text-[#666] font-mono">No certifications yet</p>
        </div>
      )}

      {!loading && certs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {certs.map((cert) => {
            const accent = ACCENT[cert.category] || '#00D4FF';
            return (
              <div
                key={cert.id}
                className="relative p-4 rounded-xl group"
                style={{
                  backgroundColor: '#0e0e16',
                  border: '1px solid #1e1e2e',
                }}
              >
                {/* Top accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                  }}
                />

                <div className="flex items-start gap-3">
                  {cert.badgeImage ? (
                    <img
                      src={cert.badgeImage}
                      alt={cert.name}
                      className="w-12 h-12 object-contain rounded-lg bg-[#1e1e2e] p-1 flex-shrink-0"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${accent}15` }}
                    >
                      <HiShieldCheck className="w-6 h-6" style={{ color: accent }} />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">{cert.name}</h4>
                    <p className="text-xs text-[#888] truncate">{cert.issuer}</p>
                    <p className="text-[10px] font-mono text-[#555] mt-1">{cert.date}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 mt-3 pt-3 border-t border-[#1e1e2e]">
                  <span
                    className="px-2 py-0.5 text-[9px] font-mono uppercase rounded"
                    style={{
                      color: accent,
                      backgroundColor: `${accent}10`,
                    }}
                  >
                    {cert.category}
                  </span>
                  <div className="ml-auto flex items-center gap-1">
                    <button
                      onClick={() => setFormMode(cert)}
                      className="p-1.5 rounded-lg hover:bg-[#1e1e2e] transition-colors"
                      title="Edit"
                    >
                      <HiPencil className="w-3.5 h-3.5 text-[#888]" />
                    </button>
                    <button
                      onClick={() => handleDelete(cert)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                      title="Delete"
                    >
                      <HiTrash className="w-3.5 h-3.5 text-red-500/70" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
