import { useState, useEffect } from 'react';
import {
  HiCode,
  HiShieldCheck,
  HiMail,
  HiEye,
  HiRefresh,
} from 'react-icons/hi';
import { getDocuments } from '@/firebase/firestore';

/* ================================================================
   STAT CARD
   ================================================================ */

function StatCard({ icon: Icon, label, value, accent, loading, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative overflow-hidden p-5 sm:p-6 rounded-xl text-left
                 transition-all duration-200 hover:translate-y-[-2px] group"
      style={{
        backgroundColor: '#111118',
        border: '1px solid #1e1e2e',
      }}
    >
      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />

      <div className="flex items-start justify-between mb-4">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl"
          style={{ backgroundColor: `${accent}15` }}
        >
          <Icon className="w-5 h-5" style={{ color: accent }} />
        </div>
        <HiEye
          className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity duration-200"
          style={{ color: '#666' }}
        />
      </div>

      <p className="text-xs font-mono font-medium uppercase tracking-wider text-[#666] mb-1">
        {label}
      </p>

      {loading ? (
        <div className="w-8 h-6 rounded bg-[#1e1e2e] animate-pulse" />
      ) : (
        <p className="text-2xl font-display font-bold text-white">
          {value}
        </p>
      )}
    </button>
  );
}

/* ================================================================
   DASHBOARD
   ================================================================ */

export default function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState({
    projects: 0,
    certs: 0,
    messages: 0,
    unread: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [projects, certs, messages] = await Promise.all([
        getDocuments('projects').catch(() => []),
        getDocuments('certificates', 'date').catch(() => []),
        getDocuments('messages').catch(() => []),
      ]);
      setStats({
        projects: projects.length,
        certs: certs.length,
        messages: messages.length,
        unread: messages.filter((m) => !m.read).length,
      });
    } catch (error) {
      console.error('[Dashboard] Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-display font-bold text-white">Dashboard</h2>
          <p className="text-sm text-[#666] font-mono">Overview of your portfolio data</p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-3 py-2 text-xs font-mono font-medium
                     rounded-lg transition-colors duration-200 hover:bg-[#1e1e2e]"
          style={{ color: '#888', border: '1px solid #1e1e2e' }}
        >
          <HiRefresh className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={HiCode}
          label="Projects"
          value={stats.projects}
          accent="#00D4FF"
          loading={loading}
          onClick={() => onNavigate('projects')}
        />
        <StatCard
          icon={HiShieldCheck}
          label="Certifications"
          value={stats.certs}
          accent="#A855F7"
          loading={loading}
          onClick={() => onNavigate('certs')}
        />
        <StatCard
          icon={HiMail}
          label="Messages"
          value={stats.messages}
          accent="#10B981"
          loading={loading}
          onClick={() => onNavigate('messages')}
        />
        <StatCard
          icon={HiMail}
          label="Unread"
          value={stats.unread}
          accent="#EF4444"
          loading={loading}
          onClick={() => onNavigate('messages')}
        />
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h3 className="text-sm font-mono font-medium text-[#666] uppercase tracking-wider mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Add Project', view: 'projects', accent: '#00D4FF' },
            { label: 'Add Certificate', view: 'certs', accent: '#A855F7' },
            { label: 'View Messages', view: 'messages', accent: '#10B981' },
          ].map((action) => (
            <button
              key={action.view}
              onClick={() => onNavigate(action.view)}
              className="px-4 py-3 text-sm font-semibold rounded-lg
                         transition-all duration-200 hover:brightness-110"
              style={{
                color: action.accent,
                backgroundColor: `${action.accent}10`,
                border: `1px solid ${action.accent}25`,
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
