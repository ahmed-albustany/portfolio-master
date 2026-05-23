import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthChange, logoutAdmin } from '@/firebase/auth';
import {
  HiHome,
  HiCode,
  HiShieldCheck,
  HiMail,
  HiLogout,
  HiExternalLink,
  HiMenuAlt2,
  HiX,
} from 'react-icons/hi';
import Login from '@/components/admin/Login';
import Dashboard from '@/components/admin/Dashboard';
import ProjectManager from '@/components/admin/ProjectManager';
import CertManager from '@/components/admin/CertManager';
import MessageViewer from '@/components/admin/MessageViewer';

/* ================================================================
   NAV ITEMS
   ================================================================ */

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: HiHome, accent: '#00D4FF' },
  { key: 'projects', label: 'Projects', icon: HiCode, accent: '#00D4FF' },
  { key: 'certs', label: 'Certifications', icon: HiShieldCheck, accent: '#A855F7' },
  { key: 'messages', label: 'Messages', icon: HiMail, accent: '#10B981' },
];

/* ================================================================
   ADMIN PAGE
   Protected route — shows Login when unauthenticated,
   full admin shell when authenticated.
   ================================================================ */

export default function Admin() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser || null);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      setUser(null);
    } catch {
      setUser(null);
    }
  };

  const handleNavigate = (view) => {
    setActiveView(view);
    setSidebarOpen(false);
  };

  /* ---- Loading spinner ---- */
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="w-10 h-10 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ---- Not authenticated → Login ---- */
  if (!user) {
    return <Login onSuccess={() => {}} />;
  }

  /* ---- Authenticated → Admin Shell ---- */
  return (
    <div className="min-h-screen flex bg-[#0a0a0f]">
      {/* ======== Sidebar (desktop) + overlay (mobile) ======== */}

      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 flex flex-col
          transition-transform duration-300 lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          backgroundColor: '#0e0e16',
          borderRight: '1px solid #1e1e2e',
        }}
      >
        {/* Sidebar header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid #1e1e2e' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00D4FF]" />
            <span className="text-sm font-display font-bold text-white tracking-wide">
              Admin
            </span>
            <span className="text-xs font-mono text-[#555]">v1.0</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg hover:bg-[#1e1e2e] lg:hidden transition-colors"
          >
            <HiX className="w-4 h-4 text-[#666]" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.key;
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => handleNavigate(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium
                  rounded-lg transition-all duration-200
                  ${isActive ? '' : 'hover:bg-[#15151f]'}`}
                style={{
                  backgroundColor: isActive ? `${item.accent}10` : 'transparent',
                  color: isActive ? item.accent : '#888',
                }}
              >
                <Icon className="w-4 h-4" />
                {item.label}
                {isActive && (
                  <div
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: item.accent }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div
          className="px-4 py-4 space-y-2"
          style={{ borderTop: '1px solid #1e1e2e' }}
        >
          {/* User */}
          <div className="flex items-center gap-3 px-2 mb-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center
                         text-xs font-bold text-[#00D4FF]"
              style={{ backgroundColor: 'rgba(0,212,255,0.1)' }}
            >
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user.email}</p>
              <p className="text-[10px] font-mono text-[#555]">Administrator</p>
            </div>
          </div>

          {/* Back to site */}
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium
                       rounded-lg transition-colors hover:bg-[#15151f]"
            style={{ color: '#666' }}
          >
            <HiExternalLink className="w-3.5 h-3.5" />
            Back to Site
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium
                       rounded-lg transition-colors hover:bg-red-500/10"
            style={{ color: '#ef4444' }}
          >
            <HiLogout className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ======== Main content ======== */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        {/* Top bar (mobile) */}
        <div
          className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 lg:hidden"
          style={{
            backgroundColor: '#0e0e16',
            borderBottom: '1px solid #1e1e2e',
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-[#1e1e2e] transition-colors"
          >
            <HiMenuAlt2 className="w-5 h-5 text-[#888]" />
          </button>
          <span className="text-sm font-display font-bold text-white">
            {NAV_ITEMS.find((n) => n.key === activeView)?.label || 'Admin'}
          </span>
        </div>

        {/* Content area */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
          {activeView === 'dashboard' && (
            <Dashboard onNavigate={handleNavigate} />
          )}
          {activeView === 'projects' && <ProjectManager />}
          {activeView === 'certs' && <CertManager />}
          {activeView === 'messages' && <MessageViewer />}
        </div>
      </main>
    </div>
  );
}
