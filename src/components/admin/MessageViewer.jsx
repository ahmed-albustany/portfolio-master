import { useState, useEffect } from 'react';
import {
  HiMail, HiMailOpen, HiTrash, HiRefresh, HiChevronLeft,
  HiExclamationCircle, HiCheckCircle, HiReply,
} from 'react-icons/hi';
import { getMessages, markAsRead, deleteMessage, updateDocument } from '@/firebase/firestore';

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

export default function MessageViewer() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => { setToast({ message: msg, type }); setTimeout(() => setToast(null), 3000); };

  const fetchMessages = async () => {
    setLoading(true);
    try { setMessages(await getMessages()); }
    catch { showToast('Failed to load messages', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleMarkRead = async (msg) => {
    try {
      await markAsRead(msg.id);
      setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, read: true } : m));
      if (selected?.id === msg.id) setSelected({ ...msg, read: true });
    } catch { showToast('Failed to update', 'error'); }
  };

  const handleMarkUnread = async (msg) => {
    try {
      await updateDocument('messages', msg.id, { read: false });
      setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, read: false } : m));
      if (selected?.id === msg.id) setSelected({ ...msg, read: false });
    } catch { showToast('Failed to update', 'error'); }
  };

  const handleDelete = async (msg) => {
    if (!window.confirm(`Delete message from "${msg.name}"?`)) return;
    try {
      await deleteMessage(msg.id);
      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
      if (selected?.id === msg.id) setSelected(null);
      showToast('Message deleted');
    } catch { showToast('Failed to delete', 'error'); }
  };

  const openMessage = async (msg) => {
    setSelected(msg);
    if (!msg.read) await handleMarkRead(msg);
  };

  const formatDate = (ts) => {
    if (!ts) return '\u2014';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div>
      <Toast toast={toast} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-heading font-bold text-white flex items-center gap-2">
            Messages
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-[#FF3B3B]/15 text-[#FF3B3B]">
                {unreadCount}
              </span>
            )}
          </h2>
          <p className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider">
            {messages.length} total &middot; {unreadCount} unread
          </p>
        </div>
        <button onClick={fetchMessages}
          className="flex items-center gap-2 px-3 py-2 text-[10px] font-mono font-semibold uppercase tracking-wider rounded-lg hover:bg-[#1A2840]"
          style={{ color: '#64748B', border: '1px solid #1A2840' }}>
          <HiRefresh className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#00FF88] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && messages.length === 0 && (
        <div className="text-center py-16">
          <HiMail className="w-12 h-12 mx-auto mb-3 text-[#1A2840]" />
          <p className="text-xs font-mono text-[#334155]">No transmissions received</p>
        </div>
      )}

      {!loading && messages.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Message list */}
          <div className={`lg:col-span-2 space-y-2 ${selected ? 'hidden lg:block' : ''}`}>
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => openMessage(msg)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200
                  ${selected?.id === msg.id ? 'ring-1 ring-[#00D4FF]/40' : 'hover:border-[#1A2840]'}`}
                style={{
                  backgroundColor: selected?.id === msg.id ? '#0D1520' : '#0A1628',
                  border: `1px solid ${selected?.id === msg.id ? '#00D4FF30' : '#1A2840'}`,
                }}>
                <div className="flex items-center gap-2 mb-1">
                  {!msg.read && <span className="w-2 h-2 rounded-full bg-[#00D4FF] flex-shrink-0" />}
                  <span className={`text-sm font-semibold truncate ${!msg.read ? 'text-white' : 'text-[#94A3B8]'}`}>
                    {msg.name}
                  </span>
                  <span className="ml-auto text-[10px] font-mono text-[#334155] flex-shrink-0">
                    {formatDate(msg.createdAt)}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-[#64748B] truncate">{msg.subject}</p>
                <p className="text-[11px] text-[#334155] truncate mt-0.5">{msg.message}</p>
              </button>
            ))}
          </div>

          {/* Message detail */}
          <div className={`lg:col-span-3 ${!selected ? 'hidden lg:block' : ''}`}>
            {selected ? (
              <div className="rounded-xl p-5 sm:p-6" style={{ backgroundColor: '#0D1520', border: '1px solid #1A2840' }}>
                {/* Back (mobile) */}
                <button onClick={() => setSelected(null)}
                  className="flex items-center gap-1 text-[11px] font-mono text-[#64748B] mb-4 lg:hidden hover:text-white transition-colors">
                  <HiChevronLeft className="w-4 h-4" /> Back
                </button>

                {/* Header */}
                <div className="mb-6">
                  <h3 className="text-base font-heading font-bold text-white mb-1">{selected.subject}</h3>
                  <p className="text-sm text-[#94A3B8]">
                    From <span className="text-[#00D4FF] font-semibold">{selected.name}</span>
                    {' '}&lt;{selected.email}&gt;
                  </p>
                  <p className="text-[10px] font-mono text-[#334155] mt-1">{formatDate(selected.createdAt)}</p>
                </div>

                {/* Body */}
                <div className="p-4 rounded-lg mb-6 text-sm leading-relaxed text-[#CBD5E1] whitespace-pre-wrap font-mono"
                  style={{ backgroundColor: '#0A1628', border: '1px solid #1A2840' }}>
                  {selected.message}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                    className="flex items-center gap-2 px-4 py-2 text-[11px] font-mono font-bold uppercase tracking-wider rounded-lg hover:brightness-110"
                    style={{ backgroundColor: '#00D4FF', color: '#060B14' }}>
                    <HiReply className="w-3.5 h-3.5" /> Reply
                  </a>

                  {selected.read ? (
                    <button onClick={() => handleMarkUnread(selected)}
                      className="flex items-center gap-2 px-4 py-2 text-[11px] font-mono font-semibold rounded-lg"
                      style={{ color: '#64748B', backgroundColor: '#1A2840' }}>
                      <HiMail className="w-3.5 h-3.5" /> Mark Unread
                    </button>
                  ) : (
                    <button onClick={() => handleMarkRead(selected)}
                      className="flex items-center gap-2 px-4 py-2 text-[11px] font-mono font-semibold rounded-lg"
                      style={{ color: '#64748B', backgroundColor: '#1A2840' }}>
                      <HiMailOpen className="w-3.5 h-3.5" /> Mark Read
                    </button>
                  )}

                  <button onClick={() => handleDelete(selected)}
                    className="flex items-center gap-2 px-4 py-2 text-[11px] font-mono font-semibold rounded-lg ml-auto"
                    style={{ color: '#FF3B3B', backgroundColor: 'rgba(255,59,59,0.08)', border: '1px solid rgba(255,59,59,0.15)' }}>
                    <HiTrash className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl p-12 text-center" style={{ backgroundColor: '#0D1520', border: '1px solid #1A2840' }}>
                <HiMailOpen className="w-12 h-12 mx-auto mb-3 text-[#1A2840]" />
                <p className="text-xs font-mono text-[#334155] uppercase tracking-wider">Select a transmission to read</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
