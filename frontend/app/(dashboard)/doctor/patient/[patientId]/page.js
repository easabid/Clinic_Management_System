'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../../../components/layout/DashboardLayout';
import Card from '../../../../../components/ui/Card';
import Badge from '../../../../../components/ui/Badge';
import { SkeletonTable } from '../../../../../components/ui/Skeleton';
import { appointmentsApi } from '../../../../../lib/api';
import { parseError } from '../../../../../lib/parseError';

function statusVariant(status) {
  const map = { confirmed: 'success', pending: 'warning', completed: 'info', cancelled: 'danger' };
  return map[status] || 'default';
}

export default function PatientHistoryPage() {
  const { patientId } = useParams();
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await appointmentsApi.getPatientHistory(patientId);
        setAppointments(res.data);
      } catch (err) {
        toast.error(parseError(err));
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [patientId]);

  const patientName = appointments[0]?.patient?.fullName;

  return (
    <DashboardLayout allowedRoles={['doctor', 'admin']}>
      <div className="space-y-6">
        <div>
          <button onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1">
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {patientName ? `${patientName}'s History` : 'Patient History'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Full appointment history for this patient</p>
        </div>

        <Card>
          {isLoading ? <SkeletonTable rows={5} /> : appointments.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-gray-500">No history found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                    <th className="pb-3 font-medium">Doctor</th>
                    <th className="pb-3 font-medium">Specialization</th>
                    <th className="pb-3 font-medium">Date & Time</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-50">
                      <td className="py-4 font-medium text-gray-900">Dr. {apt.doctor?.doctor?.fullName}</td>
                      <td className="py-4 text-gray-500">{apt.doctor?.specialization}</td>
                      <td className="py-4 text-gray-500">{apt.date} · {apt.timeSlot}</td>
                      <td className="py-4">
                        <Badge label={apt.status} variant={statusVariant(apt.status)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}