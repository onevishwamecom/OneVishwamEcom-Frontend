import { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../../store/authSlice';
import { navigateTo } from '../../config/navigation';

const menuItems = [
  { label: 'My Profile', icon: 'fa-user', href: '/profile/settings' },
  { label: 'Settings', icon: 'fa-gear', href: '/profile/settings' },
];

function UserDropdown() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const displayName = user?.fullName || user?.name;
  const initial = displayName ? displayName.charAt(0).toUpperCase() : 'U';

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="h-8 w-8 rounded-full bg-brand-blue flex items-center justify-center text-white text-sm font-bold">
          {initial}
        </div>
        <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.fullName || user?.name || 'User'}</span>
        <i className={`fa-solid fa-chevron-down text-[10px] text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full pt-2 w-56 z-50">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-2">
            <div className="px-4 py-2 border-b border-gray-100 mb-1">
              <p className="text-sm font-medium text-brand-charcoal">{user?.fullName || user?.name}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
            {menuItems.map((item) => (
              <button key={item.label} onClick={() => {
                setOpen(false);
                if (item.href) navigateTo(item.href);
              }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-brand-blue/5 hover:text-brand-blue transition-colors"
              >
                <i className={`fa-solid ${item.icon} w-4 text-center text-gray-400`} />
                {item.label}
              </button>
            ))}
            <hr className="my-1.5 border-gray-100" />
            <button onClick={async () => {
              setOpen(false);
              const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'You will be logged out of your account.',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#1a4b8c',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, logout',
                cancelButtonText: 'Cancel',
              });
              if (result.isConfirmed) {
                logout();
                Swal.fire({ icon: 'success', title: 'Logged out', timer: 1200, showConfirmButton: false, toast: true, position: 'top-end' });
              }
            }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <i className="fa-solid fa-right-from-bracket w-4 text-center" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDropdown;
