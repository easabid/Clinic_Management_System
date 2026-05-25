'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const navLinks = {
  patient: [
    { href: '/patient/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/patient/doctors', label: 'Find Doctors', icon: '👨‍⚕️' },
    { href: '/patient/appointments', label: 'My Appointments', icon: '📅' },
    { href: '/change-password', label: 'Change Password', icon: '🔑' },
  ],
  doctor: [
    { href: '/doctor/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/doctor/appointments', label: 'Appointments', icon: '📅' },
    { href: '/change-password', label: 'Change Password', icon: '🔑' },
  ],
  admin: [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/admin/users', label: 'Users', icon: '👥' },
    { href: '/admin/doctors', label: 'Doctors', icon: '👨‍⚕️' },
    { href: '/admin/appointments', label: 'Appointments', icon: '📅' },
    { href: '/change-password', label: 'Change Password', icon: '🔑' },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const links = navLinks[user?.role] || [];

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏥</span>
          <span className="text-lg font-bold text-blue-700">ClinicMS</span>
        </div>
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b border-gray-100 bg-blue-50">
        <p className="text-sm font-semibold text-gray-900 truncate">{user?.fullName}</p>
        <p className="text-xs text-blue-600 capitalize">{user?.role}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-colors duration-150
                ${isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
              `}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
            text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  );
}