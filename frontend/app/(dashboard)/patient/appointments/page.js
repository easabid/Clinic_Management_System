'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import Card from '../../../../components/ui/Card';
import Badge from '../../../../components/ui/Badge';
import Button from '../../../../components/ui/Button';
import Modal from '../../../../components/ui/Modal';
import { SkeletonTable } from '../../../../components/ui/Skeleton';
import { appointmentsApi } from '../../../../lib/api';
import { parseError } from '../../../../lib/parseError';

function statusVariant(status) {
  const map = { confirmed: 'success', pending: 'warning', completed: 'info', cancelled: 'danger' };
  return map[status] || 'default';
}

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelId, setCancelId] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const load = async () => {
    try {
      const res = await appointmentsApi.getMine();
      setAppointments(res.data);
    } catch (err) {
      toast.error(parseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async () => {
    if (!cancelId) return;
    setIsCancelling(true);
    try {
      await appointmentsApi.cancel(cancelId);
      toast.success('Appointment cancelled. Cancellation email sent.');
      setCancelId(null);
      load();
    } catch (err) {
      toast.error(parseError(err));
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <DashboardLayout allowedRoles={['patient']}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>

        <Card>
          {isLoading ? (
            <SkeletonTable rows={5} />
          ) : appointments.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📅</p>
              <p className="text-gray-500">No appointments yet</p>
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
                    <th className="pb-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 font-medium text-gray-900">
                        Dr. {apt.doctor?.doctor?.fullName}
                      </td>
                      <td className="py-4 text-gray-500">{apt.doctor?.specialization}</td>
                      <td className="py-4 text-gray-500">{apt.date} at {apt.timeSlot}</td>
                      <td className="py-4">
                        <Badge label={apt.status} variant={statusVariant(apt.status)} />
                      </td>
                      <td className="py-4">
                        {(apt.status === 'pending' || apt.status === 'confirmed') && (
                          <Button variant="danger" size="sm"
                            onClick={() => setCancelId(apt.id)}>
                            Cancel
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <Modal
        isOpen={!!cancelId}
        onClose={() => setCancelId(null)}
        title="Cancel Appointment"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCancelId(null)}>Keep it</Button>
            <Button variant="danger" isLoading={isCancelling} onClick={handleCancel}>
              Yes, cancel
            </Button>
          </>
        }
      >
        <p className="text-gray-600 text-sm">
          Are you sure you want to cancel this appointment? You will receive a
          cancellation email and can rebook anytime.
        </p>
      </Modal>
    </DashboardLayout>
  );
}