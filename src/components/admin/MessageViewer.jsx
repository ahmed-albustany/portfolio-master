import { useState, useEffect } from 'react';
import {
  HiMail,
  HiMailOpen,
  HiTrash,
  HiRefresh,
  HiChevronLeft,
  HiExclamationCircle,
} from 'react-icons/hi';
import { getDocuments, updateDocument, deleteDocument } from '@/firebase/firestore';

/* ================================================================
   MESSAGE VIEWER
   Lists contact-form messages with read/unread + delete.
   ================================================================ */

export default function MessageViewer() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');

  const fetchMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const docs = await getDocuments('messages');
      setMessages(docs);
    } catch {
      setError('Failed to load messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (msg) => {
    try {
      await updateDocument('messages', msg.id, { read: true });
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m)),
      );
      if (selected?.id === msg.id) {
        setSelected({ ...selected, read: true });
      }
    } catch {
      setError('Failed to update message.');
    }
  };

  const markAsUnread = async (msg) => {
    try {
      await updateDocument('messages', msg.id, { read: false });
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, read: false } : m)),
      );
      if (selected?.id === msg.id) {
        setSelected({ ...selected, read: false });
      }
    } catch {
      setError('Failed to update message.');
    }
  };

  const handleDelete = async (msg) => {
    if (!window.confirm(`Delete message from "${msg.name}"?`)) return;
    try {
      await deleteDocument('messages', msg.id);
      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
      if (selected?.id === msg.id) setSelected(null);
    } catch {
      setError('Failed to delete message.');
    }
  };

  const openMessage = async (msg) => {
    setSelected(msg);
    if (!msg.read) {
      await markAsRead(msg);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '—';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-display font-bold text-white">Messages</h2>
          <p className="text-sm text-[#666] font-mono">
            {messages.length} total &middot; {unreadCount} unread
          </p>
        </div>
        <button
          onClick={fetchMessages}
          className="flex items-center gap-2 px-3 py-2 text-xs font-mono font-medium
                     rounded-lg transition-colors duration-200 hover:bg-[#1e1e2e]"
          style={{ color: '#888', border: '1px solid #1e1e2e' }}
        >
          <HiRefresh className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
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

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty */}
      {!loading && messages.length === 0 && (
        <div className="text-center py-16">
          <HiMail className="w-12 h-12 mx-auto mb-3 text-[#333]" />
          <p className="text-sm text-[#666] font-mono">No messages yet</p>
        </div>
      )}

      {!loading && messages.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* ---- Message list ---- */}
          <div className={`lg:col-span-2 space-y-2 ${selected ? 'hidden lg:block' : ''}`}>
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => openMessage(msg)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200
                  ${selected?.id === msg.id ? 'ring-1 ring-[#00D4FF]/50' : 'hover:bg-[#15151f]'}`}
                style={{
                  backgroundColor: selected?.id === msg.id ? '#111118' : '#0e0e16',
                  border: '1px solid #1e1e2e',
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  {!msg.read && (
                    <span className="w-2 h-2 rounded-full bg-[#00D4FF] flex-shrink-0" />
                  )}
                  <span className="text-sm font-semibold text-white truncate">
                    {msg.name}
                  </span>
                  <span className="ml-auto text-[10px] font-mono text-[#555] flex-shrink-0">
                    {formatDate(msg.createdAt)}
                  </span>
                </div>
                <p className="text-xs font-medium text-[#888] truncate">{msg.subject}</p>
                <p className="text-xs text-[#555] truncate mt-0.5">{msg.message}</p>
              </button>
            ))}
          </div>

          {/* ---- Message detail ---- */}
          <div className={`lg:col-span-3 ${!selected ? 'hidden lg:block' : ''}`}>
            {selected ? (
              <div
                className="rounded-xl p-5 sm:p-6"
                style={{
                  backgroundColor: '#111118',
                  border: '1px solid #1e1e2e',
                }}
              >
                {/* Back button (mobile) */}
                <button
                  onClick={() => setSelected(null)}
                  className="flex items-center gap-1 text-xs font-mono text-[#666]
                             mb-4 lg:hidden hover:text-white transition-colors"
                >
                  <HiChevronLeft className="w-4 h-4" />
                  Back to list
                </button>

                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-base font-display font-bold text-white mb-1">
                      {selected.subject}
                    </h3>
                    <p className="text-sm text-[#888]">
                      From <span className="text-[#00D4FF] font-medium">{selected.name}</span>
                      {' '}&lt;{selected.email}&gt;
                    </p>
                    <p className="text-xs font-mono text-[#555] mt-1">
                      {formatDate(selected.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div
                  className="p-4 rounded-lg mb-6 text-sm leading-relaxed text-[#ccc] whitespace-pre-wrap"
                  style={{ backgroundColor: '#0a0a0f', border: '1px solid #1a1a2e' }}
                >
                  {selected.message}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold
                               rounded-lg transition-all duration-200 hover:brightness-110"
                    style={{ backgroundColor: '#00D4FF', color: '#0a0a0f' }}
                  >
                    <HiMail className="w-3.5 h-3.5" />
                    Reply
                  </a>

                  {selected.read ? (
                    <button
                      onClick={() => markAsUnread(selected)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold
                                 rounded-lg transition-colors duration-200"
                      style={{
                        color: '#888',
                        backgroundColor: '#1e1e2e',
                      }}
                    >
                      <HiMail className="w-3.5 h-3.5" />
                      Mark Unread
                    </button>
                  ) : (
                    <button
                      onClick={() => markAsRead(selected)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold
                                 rounded-lg transition-colors duration-200"
                      style={{
                        color: '#888',
                        backgroundColor: '#1e1e2e',
                      }}
                    >
                      <HiMailOpen className="w-3.5 h-3.5" />
                      Mark Read
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(selected)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold
                               rounded-lg transition-colors duration-200 ml-auto"
                    style={{
                      color: '#ef4444',
                      backgroundColor: 'rgba(239,68,68,0.08)',
                      border: '1px solid rgba(239,68,68,0.15)',
                    }}
                  >
                    <HiTrash className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="rounded-xl p-12 text-center"
                style={{ backgroundColor: '#111118', border: '1px solid #1e1e2e' }}
              >
                <HiMailOpen className="w-12 h-12 mx-auto mb-3 text-[#333]" />
                <p className="text-sm text-[#555] font-mono">Select a message to read</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
