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

function statusVariant(status) {
  const map = {
    confirmed: 'success',
    pending: 'warning',
    completed: 'info',
    cancelled: 'danger',
  };
  return map[status] || 'default';
}

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await appointmentsApi.getMine();
        setAppointments(res.data);
      } catch (err) {
        toast.error(parseError(err));
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  const upcoming = appointments.filter(
    (a) => a.status === 'pending' || a.status === 'confirmed'
  );
  const completed = appointments.filter((a) => a.status === 'completed');

  return (
    <DashboardLayout allowedRoles={['patient']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage your health appointments</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Total Appointments', value: appointments.length, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Upcoming', value: upcoming.length, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Completed', value: completed.length, color: 'text-gray-600', bg: 'bg-gray-50' },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.bg} rounded-xl p-6`}>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className={`text-3xl font-bold mt-1 ${stat.color}`}>
                {isLoading ? '—' : stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="flex gap-3 flex-wrap">
          <Link href="/patient/doctors"
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium
              rounded-lg hover:bg-blue-700 transition-colors">
            + Book Appointment
          </Link>
          <Link href="/patient/appointments"
            className="px-5 py-2.5 bg-white text-gray-700 text-sm font-medium
              rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
            View All Appointments
          </Link>
        </div>

        {/* Upcoming list */}
        <Card title={`Upcoming Appointments (${upcoming.length})`}>
          {isLoading ? (
            <div className="space-y-3"><SkeletonCard /><SkeletonCard /></div>
          ) : upcoming.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-3">📅</p>
              <p className="text-gray-500 text-sm">No upcoming appointments</p>
              <Link href="/patient/doctors"
                className="text-blue-600 text-sm font-medium mt-2 inline-block hover:underline">
                Find a doctor →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((apt) => (
                <div key={apt.id}
                  className="flex items-center justify-between p-4 bg-gray-50
                    rounded-xl border border-gray-100">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Dr. {apt.doctor?.doctor?.fullName}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {apt.doctor?.specialization} · {apt.date} at {apt.timeSlot}
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