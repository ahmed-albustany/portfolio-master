import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  HiPlus, HiPencil, HiTrash, HiRefresh, HiX,
  HiExclamationCircle, HiCheckCircle, HiShieldCheck,
} from 'react-icons/hi';
import {
  getCertifications, addCertification, updateCertification, deleteCertification,
} from '@/firebase/firestore';

const ACCENT = '#A855F7';
const CATEGORIES = [
  { key: 'cloud', label: 'Cloud', color: '#00D4FF' },
  { key: 'dev', label: 'Development', color: '#0066FF' },
  { key: 'development', label: 'Development', color: '#0066FF' },
  { key: 'security', label: 'Security', color: '#FF3B3B' },
  { key: 'network', label: 'Network', color: '#00FF88' },
  { key: 'it', label: 'IT', color: '#FFB800' },
];

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

function CertForm({ cert, onSave, onCancel }) {
  const isEditing = !!cert;
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: cert?.name || '',
      issuer: cert?.issuer || '',
      date: cert?.date || '',
      credentialID: cert?.credentialID || cert?.credentialId || '',
      verifyURL: cert?.verifyURL || cert?.credentialUrl || '',
      category: cert?.category || 'cloud',
      imageURL: cert?.imageURL || cert?.badgeImage || '',
    },
  });

  const onSubmit = async (data) => {
    setError('');
    try {
      const payload = {
        name: data.name.trim(),
        issuer: data.issuer.trim(),
        date: data.date.trim(),
        credentialID: data.credentialID.trim(),
        verifyURL: data.verifyURL.trim(),
        category: data.category,
        imageURL: data.imageURL.trim(),
      };
      if (isEditing) await updateCertification(cert.id, payload);
      else await addCertification(payload);
      onSave();
    } catch { setError('OPERATION FAILED'); }
  };

  return (
    <div className="rounded-xl p-5 sm:p-6" style={{ backgroundColor: '#0D1520', border: '1px solid #1A2840' }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-heading font-bold text-white">{isEditing ? 'Edit Certification' : 'New Certification'}</h3>
        <button onClick={onCancel} className="p-2 rounded-lg hover:bg-[#1A2840]"><HiX className="w-4 h-4 text-[#64748B]" /></button>
      </div>
      {error && <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-lg text-[11px] font-mono font-bold" style={{ color: '#FF3B3B', backgroundColor: 'rgba(255,59,59,0.08)', border: '1px solid rgba(255,59,59,0.2)' }}><HiExclamationCircle className="w-4 h-4" /> {error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AdminField label="Badge Image URL" placeholder="https://..." {...register('imageURL')} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Certification Name" error={errors.name} {...register('name', { required: 'Required' })} />
          <AdminField label="Issuer" error={errors.issuer} {...register('issuer', { required: 'Required' })} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Date" placeholder="e.g. 2024" error={errors.date} {...register('date', { required: 'Required' })} />
          <div>
            <label className="block text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest mb-2">Category</label>
            <select className="admin-input" {...register('category')}>
              {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Credential ID" {...register('credentialID')} />
          <AdminField label="Verify URL" placeholder="https://..." {...register('verifyURL')} />
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

export default function CertManager() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [formMode, setFormMode] = useState(null);

  const showToast = (msg, type = 'success') => { setToast({ message: msg, type }); setTimeout(() => setToast(null), 3000); };

  const fetchCerts = async () => {
    setLoading(true);
    try { setCerts(await getCertifications()); }
    catch { showToast('Failed to load certifications', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCerts(); }, []);

  const handleDelete = async (cert) => {
    if (!window.confirm(`Delete "${cert.name}"?`)) return;
    try { await deleteCertification(cert.id); setCerts((p) => p.filter((c) => c.id !== cert.id)); showToast('Certification deleted'); }
    catch { showToast('Failed to delete', 'error'); }
  };

  const handleSave = () => { setFormMode(null); fetchCerts(); showToast(formMode === 'add' ? 'Certification created' : 'Certification updated'); };

  const getCatColor = (cat) => CATEGORIES.find((c) => c.key === cat)?.color || ACCENT;

  return (
    <div>
      <Toast toast={toast} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-heading font-bold text-white">Certifications</h2>
          <p className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider">{certs.length} credentials</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchCerts} className="flex items-center px-3 py-2 text-[10px] font-mono font-semibold uppercase tracking-wider rounded-lg hover:bg-[#1A2840]" style={{ color: '#64748B', border: '1px solid #1A2840' }}>
            <HiRefresh className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => setFormMode('add')} className="flex items-center gap-2 px-4 py-2 text-[11px] font-mono font-bold uppercase tracking-wider rounded-lg hover:brightness-110" style={{ backgroundColor: ACCENT, color: '#fff' }}>
            <HiPlus className="w-3.5 h-3.5" /> Add Cert
          </button>
        </div>
      </div>

      {formMode && <div className="mb-6"><CertForm cert={formMode === 'add' ? null : formMode} onSave={handleSave} onCancel={() => setFormMode(null)} /></div>}

      {loading && <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: ACCENT }} /></div>}

      {!loading && certs.length === 0 && !formMode && (
        <div className="text-center py-16"><HiShieldCheck className="w-12 h-12 mx-auto mb-3 text-[#1A2840]" /><p className="text-xs font-mono text-[#334155]">No certifications</p></div>
      )}

      {!loading && certs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {certs.map((cert) => {
            const catColor = getCatColor(cert.category);
            return (
              <div key={cert.id} className="relative p-4 rounded-xl" style={{ backgroundColor: '#0D1520', border: '1px solid #1A2840' }}>
                <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl" style={{ background: `linear-gradient(90deg, transparent, ${catColor}, transparent)` }} />
                <div className="flex items-start gap-3">
                  {(cert.imageURL || cert.badgeImage) ? (
                    <img src={cert.imageURL || cert.badgeImage} alt={cert.name} loading="lazy"
                      className="w-12 h-12 object-contain rounded-lg bg-[#1A2840] p-1 flex-shrink-0"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  ) : (
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${catColor}15` }}>
                      <HiShieldCheck className="w-6 h-6" style={{ color: catColor }} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">{cert.name}</h4>
                    <p className="text-[11px] text-[#64748B] truncate">{cert.issuer}</p>
                    <p className="text-[10px] font-mono text-[#334155] mt-0.5">{cert.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3 pt-3 border-t border-[#1A2840]">
                  <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded" style={{ color: catColor, backgroundColor: `${catColor}10` }}>{cert.category}</span>
                  <div className="ml-auto flex items-center gap-1">
                    <button onClick={() => setFormMode(cert)} className="p-1.5 rounded-lg hover:bg-[#1A2840]"><HiPencil className="w-3.5 h-3.5 text-[#64748B]" /></button>
                    <button onClick={() => handleDelete(cert)} className="p-1.5 rounded-lg hover:bg-red-500/10"><HiTrash className="w-3.5 h-3.5 text-red-500/70" /></button>
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
