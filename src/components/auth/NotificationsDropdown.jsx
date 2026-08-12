import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { markRead, markAllRead, fetchNotifications } from '../../store/notificationsSlice';

function timeAgo(iso) {
  const d = new Date(iso);
  const s = Math.max(0, Math.floor((Date.now() - d.getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return `${days}d ago`;
}

export default function NotificationsDropdown() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector((s) => s.notifications.items);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) {
      document.addEventListener('mousedown', onDoc);
      return () => document.removeEventListener('mousedown', onDoc);
    }
  }, [open]);

  const unread = items.filter((i) => !i.read).length;
  const recent = items.slice(0, 6);

  const handleOpen = () => {
    setOpen(true);
    dispatch(markAllRead());
  };

  const goToInbox = () => {
    setOpen(false);
    navigate('/notifications');
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={open ? () => setOpen(false) : handleOpen}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl text-brand-navy hover:bg-brand-blue/5 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-colors"
        aria-label="Notifications"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <i className="fa-solid fa-bell text-lg" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-orange text-[9px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 z-50 mt-3 w-80 max-w-[calc(100vw-1rem)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg animate-fade-in"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-bold text-brand-charcoal">Notifications</h3>
            {items.length > 0 && unread > 0 && (
              <button
                onClick={() => dispatch(markAllRead())}
                className="text-xs font-bold text-brand-accent hover:text-brand-blue"
              >
                Mark all read
              </button>
            )}
          </div>

          {recent.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              <i className="fa-solid fa-bell-slash mb-1" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {recent.map((n) => (
                <div
                  key={n.id}
                  className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors ${
                    n.read ? 'bg-white' : 'bg-brand-accent/5'
                  } hover:bg-gray-50`}
                  onClick={() => {
                    dispatch(markRead(n.id));
                    if (n.href) navigate(n.href);
                  }}
                  role="menuitem"
                >
                  <div className="mt-0.5 shrink-0">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs ${
                        n.type === 'success'
                          ? 'bg-brand-navy text-white'
                          : n.type === 'warning'
                            ? 'bg-brand-orange/10 text-brand-orange'
                            : 'bg-brand-accent/10 text-brand-accent'
                      }`}
                    >
                      <i className={n.icon || 'fa-solid fa-info'} />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-2">{n.message}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{timeAgo(n.createdAt)}</p>
                  </div>
                  {!n.read && <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-accent shrink-0" />}
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-gray-100 p-2">
            <button
              onClick={() => {
                dispatch(markAllRead());
                goToInbox();
              }}
              className="w-full rounded-lg px-3 py-2 text-center text-sm font-bold text-brand-accent hover:bg-brand-accent/5 transition-colors"
              role="menuitem"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
