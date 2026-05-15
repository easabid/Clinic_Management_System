'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import Card from '../../../../components/ui/Card';
import Badge from '../../../../components/ui/Badge';
import Button from '../../../../components/ui/Button';
import Modal from '../../../../components/ui/Modal';
import { SkeletonTable } from '../../../../components/ui/Skeleton';
import { appointmentsApi } from '../../../../lib/api';
import { parseError } from '../../../../lib/parseError';
import { useAuth } from '../../../../context/AuthContext';

const STATUS_OPTIONS = ['confirmed', 'completed', 'cancelled'];

function statusVariant(status) {
  const map = { confirmed: 'success', pending: 'warning', completed: 'info', cancelled: 'danger' };
  return map[status] || 'default';
}

export default function DoctorAppointmentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApt, setSelectedApt] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const load = async () => {
    try {
      const res = await appointmentsApi.getAll();
      const mine = res.data.filter((a) => a.doctor?.doctor?.id === user?.id);
      setAppointments(mine);
    } catch (err) {
      toast.error(parseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { if (user) load(); }, [user]);

  const handleUpdate = async () => {
    if (!selectedApt || !newStatus) return;
    setIsUpdating(true);
    try {
      await appointmentsApi.updateStatus(selectedApt.id, { status: newStatus });
      toast.success('Appointment status updated');
      setSelectedApt(null);
      setNewStatus('');
      load();
    } catch (err) {
      toast.error(parseError(err));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <DashboardLayout allowedRoles={['doctor']}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">All Appointments</h1>

        <Card>
          {isLoading ? <SkeletonTable rows={6} /> : appointments.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📅</p>
              <p className="text-gray-500">No appointments yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                    <th className="pb-3 font-medium">Patient</th>
                    <th className="pb-3 font-medium">Date & Time</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-50">
                      <td className="py-4">
                        <p className="font-medium text-gray-900">{apt.patient?.fullName}</p>
                        <p className="text-xs text-gray-400">{apt.patient?.email}</p>
                      </td>
                      <td className="py-4 text-gray-500">{apt.date} · {apt.timeSlot}</td>
                      <td className="py-4">
                        <Badge label={apt.status} variant={statusVariant(apt.status)} />
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                            <Button size="sm" variant="secondary"
                              onClick={() => { setSelectedApt(apt); setNewStatus(''); }}>
                              Update Status
                            </Button>
                          )}
                          <Button size="sm" variant="ghost"
                            onClick={() => router.push(`/doctor/patient/${apt.patient?.id}`)}>
                            History
                          </Button>
                        </div>
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
        isOpen={!!selectedApt}
        onClose={() => setSelectedApt(null)}
        title="Update Appointment Status"
        footer={
          <>
            <Button variant="ghost" onClick={() => setSelectedApt(null)}>Cancel</Button>
            <Button isLoading={isUpdating} onClick={handleUpdate} disabled={!newStatus}>
              Update
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
            <p className="text-gray-500">Patient: <span className="font-medium text-gray-800">{selectedApt?.patient?.fullName}</span></p>
            <p className="text-gray-500">Time: <span className="font-medium text-gray-800">{selectedApt?.date} at {selectedApt?.timeSlot}</span></p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">New Status</label>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((opt) => (
                <label key={opt} className="flex items-center gap-3 p-3 rounded-lg
                  border cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="radio" name="status" value={opt}
                    checked={newStatus === opt}
                    onChange={() => setNewStatus(opt)}
                    className="text-blue-600" />
                  <span className="text-sm font-medium capitalize text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}