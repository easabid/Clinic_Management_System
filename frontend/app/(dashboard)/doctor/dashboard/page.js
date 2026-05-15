'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import Card from '../../../../components/ui/Card';
import Badge from '../../../../components/ui/Badge';
import { SkeletonCard } from '../../../../components/ui/Skeleton';
import { appointmentsApi } from '../../../../lib/api';
import { parseError } from '../../../../lib/parseError';
import { useAuth } from '../../../../context/AuthContext';

function statusVariant(status) {
  const map = { confirmed: 'success', pending: 'warning', completed: 'info', cancelled: 'danger' };
  return map[status] || 'default';
}

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await appointmentsApi.getDoctorMine();
        setAppointments(res.data);
      } catch (err) {
        toast.error(parseError(err));
      } finally {
        setIsLoading(false);
      }
    };
    if (user) fetch();
  }, [user]);

  const today = new Date().toISOString().split('T')[0];
  const todayApts = appointments.filter((a) => a.date === today);
  const pending = appointments.filter((a) => a.status === 'pending');

  return (
    <DashboardLayout allowedRoles={['doctor']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">Welcome back, Dr. {user?.fullName}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Today's Appointments", value: todayApts.length, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Pending Confirmations', value: pending.length, color: 'text-yellow-600', bg: 'bg-yellow-50' },
            { label: 'Total Appointments', value: appointments.length, color: 'text-gray-700', bg: 'bg-gray-50' },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-xl p-6`}>
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className={`text-3xl font-bold mt-1 ${s.color}`}>{isLoading ? '—' : s.value}</p>
            </div>
          ))}
        </div>

        <Link href="/doctor/appointments"
          className="inline-flex px-5 py-2.5 bg-blue-600 text-white text-sm
            font-medium rounded-lg hover:bg-blue-700 transition-colors">
          View All Appointments
        </Link>

        <Card title={`Today's Schedule (${todayApts.length})`}>
          {isLoading ? (
            <SkeletonCard />
          ) : todayApts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-3">🎉</p>
              <p className="text-gray-500 text-sm">No appointments scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayApts.map((apt) => (
                <div key={apt.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{apt.patient?.fullName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {apt.timeSlot} · {apt.patient?.email}
                    </p>
                  </div>
                  <Badge label={apt.status} variant={statusVariant(apt.status)} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}