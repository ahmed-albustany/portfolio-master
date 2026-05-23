import { useState, useEffect, lazy, Suspense } from 'react';
import { onAuthChange, logoutAdmin } from '@/firebase/auth';
import {
  HiHome,
  HiCode,
  HiShieldCheck,
  HiMail,
  HiLogout,
  HiUser,
  HiChartBar,
  HiBriefcase,
  HiAcademicCap,
  HiServer,
  HiGlobe,
  HiDatabase,
  HiLockClosed,
  HiSupport,
} from 'react-icons/hi';

const Login = lazy(() => import('@/components/admin/Login'));
const Dashboard = lazy(() => import('@/components/admin/Dashboard'));
const PersonalInfoManager = lazy(() => import('@/components/admin/PersonalInfoManager'));
const StatsManager = lazy(() => import('@/components/admin/StatsManager'));
const ProjectManager = lazy(() => import('@/components/admin/ProjectManager'));
const ExperienceManager = lazy(() => import('@/components/admin/ExperienceManager'));
const SkillsManager = lazy(() => import('@/components/admin/SkillsManager'));
const SysAdminManager = lazy(() => import('@/components/admin/SysAdminManager'));
const NetworkManager = lazy(() => import('@/components/admin/NetworkManager'));
const DatabaseManager = lazy(() => import('@/components/admin/DatabaseManager'));
const SecurityManager = lazy(() => import('@/components/admin/SecurityManager'));
const HelpdeskManager = lazy(() => import('@/components/admin/HelpdeskManager'));
const CertManager = lazy(() => import('@/components/admin/CertManager'));
const MessageViewer = lazy(() => import('@/components/admin/MessageViewer'));

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: HiHome },
  { key: 'personal', label: 'Personal Info', icon: HiUser },
  { key: 'stats', label: 'Stats', icon: HiChartBar },
  { key: 'projects', label: 'Projects', icon: HiCode },
  { key: 'experience', label: 'Experience', icon: HiBriefcase },
  { key: 'skills', label: 'Skills', icon: HiAcademicCap },
  { key: 'sysadmin', label: 'SysAdmin', icon: HiServer },
  { key: 'network', label: 'Network', icon: HiGlobe },
  { key: 'database', label: 'Database', icon: HiDatabase },
  { key: 'security', label: 'Security', icon: HiLockClosed },
  { key: 'helpdesk', label: 'Helpdesk', icon: HiSupport },
  { key: 'certs', label: 'Certifications', icon: HiShieldCheck },
  { key: 'messages', label: 'Messages', icon: HiMail },
];

function AdminLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-electric border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function renderView(view, onNavigate) {
  switch (view) {
    case 'dashboard': return <Dashboard onNavigate={onNavigate} />;
    case 'personal': return <PersonalInfoManager />;
    case 'stats': return <StatsManager />;
    case 'projects': return <ProjectManager />;
    case 'experience': return <ExperienceManager />;
    case 'skills': return <SkillsManager />;
    case 'sysadmin': return <SysAdminManager />;
    case 'network': return <NetworkManager />;
    case 'database': return <DatabaseManager />;
    case 'security': return <SecurityManager />;
    case 'helpdesk': return <HelpdeskManager />;
    case 'certs': return <CertManager />;
    case 'messages': return <MessageViewer />;
    default: return <Dashboard onNavigate={onNavigate} />;
  }
}

export default function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthChange((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      setUser(null);
    } catch {
      setUser(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#060B14' }}>
        <div className="w-10 h-10 border-2 border-electric border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <Suspense fallback={<AdminLoader />}>
        <Login onSuccess={() => {}} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#060B14' }}>
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg lg:hidden"
        style={{ backgroundColor: '#0D1520', border: '1px solid #1A2840' }}
      >
        <div className="w-5 h-0.5 bg-white mb-1" />
        <div className="w-5 h-0.5 bg-white mb-1" />
        <div className="w-5 h-0.5 bg-white" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 flex flex-col
                    transform transition-transform duration-300 lg:translate-x-0 lg:static
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ backgroundColor: '#0A1628', borderRight: '1px solid #1A2840' }}
      >
        <div className="p-5 border-b" style={{ borderColor: '#1A2840' }}>
          <h1 className="text-sm font-heading font-bold text-white">Command Center</h1>
          <p className="text-[10px] font-mono text-[#64748B] mt-1">Admin Panel v2.0</p>
        </div>

        <nav className="flex-1 py-3 overflow-y-auto scrollbar-hide">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = view === item.key;
            return (
              <button
                key={item.key}
                onClick={() => { setView(item.key); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-5 py-2.5 text-xs font-medium
                           transition-all duration-200 ${isActive ? 'border-r-2' : ''}`}
                style={{
                  color: isActive ? '#0066FF' : '#94A3B8',
                  backgroundColor: isActive ? 'rgba(0,102,255,0.08)' : 'transparent',
                  borderColor: isActive ? '#0066FF' : 'transparent',
                }}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t" style={{ borderColor: '#1A2840' }}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium
                       rounded-lg transition-colors duration-200 hover:bg-red-500/10"
            style={{ color: '#FF3B3B' }}
          >
            <HiLogout className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 min-h-screen p-6 lg:p-8 pt-16 lg:pt-8 overflow-y-auto">
        <Suspense fallback={<AdminLoader />}>
          {renderView(view, setView)}
        </Suspense>
      </main>
    </div>
  );
}
