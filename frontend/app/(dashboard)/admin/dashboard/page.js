'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import Card from '../../../../components/ui/Card';
import { usersApi, doctorsApi, appointmentsApi } from '../../../../lib/api';
import { parseError } from '../../../../lib/parseError';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, doctors: 0, appointments: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [users, doctors, apts] = await Promise.all([
          usersApi.getAll(),
          doctorsApi.getAll(),
          appointmentsApi.getAll(),
        ]);
        setStats({
          users: users.data.length,
          doctors: doctors.data.length,
          appointments: apts.data.length,
        });
      } catch (err) {
        toast.error(parseError(err));
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  const cards = [
    { label: 'Total Users', value: stats.users, icon: '👥', color: 'text-blue-600', bg: 'bg-blue-50', href: '/admin/users' },
    { label: 'Doctors', value: stats.doctors, icon: '👨‍⚕️', color: 'text-green-600', bg: 'bg-green-50', href: '/admin/doctors' },
    { label: 'Appointments', value: stats.appointments, icon: '📅', color: 'text-purple-600', bg: 'bg-purple-50', href: '/admin/appointments' },
  ];

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">System overview and management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((c) => (
            <Link key={c.label} href={c.href}
              className={`${c.bg} rounded-xl p-6 hover:opacity-90 transition-opacity block`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{c.label}</p>
                  <p className={`text-3xl font-bold mt-1 ${c.color}`}>
                    {isLoading ? '—' : c.value}
                  </p>
                </div>
                <span className="text-4xl">{c.icon}</span>
              </div>
            </Link>
          ))}
        </div>

        <Card title="Quick Actions">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { href: '/admin/doctors', label: 'Create Doctor Profile', desc: 'Add a new doctor to the system' },
              { href: '/admin/users', label: 'Manage Users', desc: 'View and manage all accounts' },
              { href: '/admin/appointments', label: 'All Appointments', desc: 'Monitor all bookings' },
            ].map((action) => (
              <Link key={action.href} href={action.href}
                className="p-4 rounded-xl border border-gray-100 hover:border-blue-200
                  hover:bg-blue-50 transition-all duration-150">
                <p className="text-sm font-semibold text-gray-900">{action.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{action.desc}</p>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}