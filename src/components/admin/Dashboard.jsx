import { useState, useEffect } from 'react';
import {
  HiCode, HiShieldCheck, HiMail, HiRefresh, HiUser, HiChartBar,
  HiBriefcase, HiAcademicCap, HiServer, HiGlobe, HiDatabase,
  HiLockClosed, HiSupport, HiArrowRight, HiClock,
} from 'react-icons/hi';
import { getDocuments, getPersonalInfo, getStats } from '@/firebase/firestore';

const COLLECTIONS = [
  { key: 'personalInfo', label: 'Personal Info', icon: HiUser, accent: '#0066FF', nav: 'personal', singleton: true },
  { key: 'stats', label: 'Stats', icon: HiChartBar, accent: '#00D4FF', nav: 'stats', singleton: true },
  { key: 'projects', label: 'Projects', icon: HiCode, accent: '#0066FF', nav: 'projects' },
  { key: 'experience', label: 'Experience', icon: HiBriefcase, accent: '#00D4FF', nav: 'experience' },
  { key: 'skills', label: 'Skills', icon: HiAcademicCap, accent: '#A855F7', nav: 'skills' },
  { key: 'sysadmin', label: 'SysAdmin', icon: HiServer, accent: '#00D4FF', nav: 'sysadmin' },
  { key: 'network', label: 'Network', icon: HiGlobe, accent: '#00FF88', nav: 'network' },
  { key: 'database', label: 'Database', icon: HiDatabase, accent: '#FFB800', nav: 'database' },
  { key: 'security', label: 'Security', icon: HiLockClosed, accent: '#FF3B3B', nav: 'security' },
  { key: 'helpdesk', label: 'Helpdesk', icon: HiSupport, accent: '#FF6B35', nav: 'helpdesk' },
  { key: 'certifications', label: 'Certifications', icon: HiShieldCheck, accent: '#A855F7', nav: 'certs' },
  { key: 'messages', label: 'Messages', icon: HiMail, accent: '#00FF88', nav: 'messages' },
];

function StatCard({ icon: Icon, label, value, accent, loading, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative overflow-hidden p-4 rounded-xl text-left w-full
                 transition-all duration-200 hover:translate-y-[-2px] group"
      style={{ backgroundColor: '#0D1520', border: '1px solid #1A2840' }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0"
          style={{ backgroundColor: `${accent}15` }}
        >
          <Icon className="w-4 h-4" style={{ color: accent }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#64748B] truncate">
            {label}
          </p>
          {loading ? (
            <div className="w-8 h-5 rounded bg-[#1A2840] animate-pulse mt-0.5" />
          ) : (
            <p className="text-lg font-heading font-bold text-white">{value}</p>
          )}
        </div>
        <HiArrowRight className="w-3.5 h-3.5 text-[#334155] opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </button>
  );
}

export default function Dashboard({ onNavigate }) {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [recentMessages, setRecentMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled(
        COLLECTIONS.map(async (col) => {
          if (col.singleton) {
            const data = col.key === 'personalInfo' ? await getPersonalInfo() : await getStats();
            return { key: col.key, count: data ? 1 : 0 };
          }
          const docs = await getDocuments(col.key);
          return { key: col.key, count: docs.length, docs };
        }),
      );

      const newCounts = {};
      results.forEach((r) => {
        if (r.status === 'fulfilled') {
          newCounts[r.value.key] = r.value.count;
          if (r.value.key === 'messages' && r.value.docs) {
            setRecentMessages(r.value.docs.slice(0, 5));
            setUnreadCount(r.value.docs.filter((m) => !m.read).length);
          }
        } else {
          newCounts['_error'] = true;
        }
      });
      setCounts(newCounts);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const formatDate = (ts) => {
    if (!ts) return '\u2014';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-heading font-bold text-white">System Dashboard</h2>
          <p className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider">
            Real-time collection overview
          </p>
        </div>
        <button
          onClick={fetchAll}
          className="flex items-center gap-2 px-3 py-2 text-[10px] font-mono font-semibold
                     uppercase tracking-wider rounded-lg transition-colors hover:bg-[#1A2840]"
          style={{ color: '#64748B', border: '1px solid #1A2840' }}
        >
          <HiRefresh className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* System status */}
      <div className="flex items-center gap-3 mb-6 px-4 py-3 rounded-lg"
           style={{ backgroundColor: '#0D1520', border: '1px solid #1A2840' }}>
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF88] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00FF88]" />
        </span>
        <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[#00FF88]">
          All Systems Operational
        </span>
        <span className="ml-auto text-[10px] font-mono text-[#334155]">
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      {/* 12 stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
        {COLLECTIONS.map((col) => (
          <StatCard
            key={col.key}
            icon={col.icon}
            label={col.label}
            value={counts[col.key] ?? 0}
            accent={col.accent}
            loading={loading}
            onClick={() => onNavigate(col.nav)}
          />
        ))}
      </div>

      {/* Recent messages + Quick actions row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Recent messages */}
        <div className="lg:col-span-3 rounded-xl p-5" style={{ backgroundColor: '#0D1520', border: '1px solid #1A2840' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HiMail className="w-4 h-4 text-[#00FF88]" />
              <h3 className="text-sm font-heading font-bold text-white">Recent Messages</h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-[#FF3B3B]/15 text-[#FF3B3B]">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <button
              onClick={() => onNavigate('messages')}
              className="text-[10px] font-mono text-[#00D4FF] hover:underline uppercase tracking-wider"
            >
              View All
            </button>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 rounded-lg bg-[#1A2840] animate-pulse" />
              ))}
            </div>
          ) : recentMessages.length === 0 ? (
            <p className="text-xs font-mono text-[#334155] text-center py-8">No messages yet</p>
          ) : (
            <div className="space-y-2">
              {recentMessages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => onNavigate('messages')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg text-left
                             transition-colors hover:bg-[#0A1628]"
                  style={{ border: '1px solid #1A2840' }}
                >
                  {!msg.read && (
                    <span className="w-2 h-2 rounded-full bg-[#00D4FF] flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white truncate">{msg.name}</span>
                      <span className="text-[10px] font-mono text-[#334155] flex-shrink-0">
                        {formatDate(msg.createdAt)}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] truncate">{msg.subject}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions + Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl p-5" style={{ backgroundColor: '#0D1520', border: '1px solid #1A2840' }}>
            <h3 className="text-sm font-heading font-bold text-white mb-4 flex items-center gap-2">
              <HiArrowRight className="w-4 h-4 text-[#0066FF]" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                { label: 'Add Project', view: 'projects', accent: '#0066FF' },
                { label: 'Add Certification', view: 'certs', accent: '#A855F7' },
                { label: 'Edit Personal Info', view: 'personal', accent: '#00D4FF' },
                { label: 'Update Stats', view: 'stats', accent: '#00FF88' },
                { label: 'View Messages', view: 'messages', accent: '#FF6B35' },
              ].map((action) => (
                <button
                  key={action.view}
                  onClick={() => onNavigate(action.view)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-mono font-semibold
                             uppercase tracking-wider rounded-lg transition-all duration-200 hover:brightness-125"
                  style={{
                    color: action.accent,
                    backgroundColor: `${action.accent}08`,
                    border: `1px solid ${action.accent}20`,
                  }}
                >
                  {action.label}
                  <HiArrowRight className="w-3 h-3 ml-auto" />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-5" style={{ backgroundColor: '#0D1520', border: '1px solid #1A2840' }}>
            <h3 className="text-sm font-heading font-bold text-white mb-3 flex items-center gap-2">
              <HiClock className="w-4 h-4 text-[#FFB800]" />
              System Info
            </h3>
            <div className="space-y-2">
              {[
                { label: 'Platform', value: 'Firebase + React' },
                { label: 'Collections', value: '12 Active' },
                { label: 'Auth', value: 'Email / Password' },
                { label: 'Version', value: 'v2.0' },
              ].map((info) => (
                <div key={info.label} className="flex items-center justify-between py-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B]">{info.label}</span>
                  <span className="text-[11px] font-mono font-semibold text-[#94A3B8]">{info.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
