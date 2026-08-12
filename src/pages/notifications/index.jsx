import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  fetchNotifications,
  markRead,
  markAllRead,
  removeNotification,
  clearAll,
} from '../../store/notificationsSlice';

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

const TYPE_COLORS = {
  success: 'bg-brand-navy text-white',
  warning: 'bg-brand-orange/10 text-brand-orange',
  info: 'bg-brand-accent/10 text-brand-accent',
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector((s) => s.notifications.items);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const unreadCount = items.filter((i) => !i.read).length;

  const visible = (tab === 'all' ? items : items.filter((i) => !i.read)).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const handleClearRead = () => {
    items.filter((i) => i.read).forEach((i) => dispatch(removeNotification(i.id)));
  };

  const handleClearAll = () => {
    if (window.confirm('Remove all notifications? This action cannot be undone.')) {
      dispatch(clearAll());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-charcoal">Notifications</h1>
            <p className="text-sm text-gray-500 mt-1">{unreadCount} unread of {items.length} total</p>
          </div>
          <Link to="/profile/settings" className="text-sm font-bold text-brand-accent hover:text-brand-blue">
            Notification Settings
          </Link>
        </div>

        <div className="mb-6 flex items-center gap-4 border-b border-gray-200">
          <button
            onClick={() => setTab('all')}
            className={`pb-3 text-sm font-bold transition-colors ${
              tab === 'all' ? 'border-b-2 border-brand-accent text-brand-accent' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setTab('unread')}
            className={`pb-3 text-sm font-bold transition-colors ${
              tab === 'unread' ? 'border-b-2 border-brand-accent text-brand-accent' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Unread
          </button>
        </div>

        {items.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
              <i className="fa-solid fa-bell-slash text-2xl text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-700">No notifications yet</h3>
            <p className="text-sm text-gray-500 mt-1">We will notify you when something important happens.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {visible.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">
                No unread notifications.
              </div>
            ) : (
              visible.map((n) => (
                <div
                  key={n.id}
                  className={`flex gap-3 rounded-xl border p-4 transition-colors ${
                    n.read ? 'bg-white border-gray-200' : 'bg-brand-accent/5 border-brand-accent/20'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${TYPE_COLORS[n.type] || TYPE_COLORS.info}`}>
                      <i className={n.icon || 'fa-solid fa-info'} />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                      <span className="text-[10px] font-medium text-gray-400 uppercase">{timeAgo(n.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">{n.message}</p>
                    {n.href && (
                      <button
                        onClick={() => navigate(n.href)}
                        className="mt-2 text-xs font-bold text-brand-accent hover:underline"
                      >
                        View details
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    {!n.read && <span className="h-2 w-2 rounded-full bg-brand-accent" />}
                    <button
                      onClick={() => dispatch(markRead(n.id))}
                      className="text-xs text-gray-400 hover:text-gray-700"
                      aria-label="Mark as read"
                    >
                      <i className="fa-solid fa-check" />
                    </button>
                    <button
                      onClick={() => dispatch(removeNotification(n.id))}
                      className="text-xs text-gray-400 hover:text-red-500"
                      aria-label="Remove"
                    >
                      <i className="fa-solid fa-xmark" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {items.length > 0 && (
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={handleClearRead}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
            >
              Clear read
            </button>
            <button
              onClick={handleClearAll}
              className="rounded-xl bg-brand-orange px-4 py-2 text-sm font-bold text-white hover:bg-brand-orange/90"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
