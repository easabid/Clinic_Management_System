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

const STATUS_OPTIONS = ['pending', 'confirmed', 'completed', 'cancelled'];

function statusVariant(status) {
  const map = { confirmed: 'success', pending: 'warning', completed: 'info', cancelled: 'danger' };
  return map[status] || 'default';
}

export default function AdminAppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApt, setSelectedApt] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const load = async () => {
    try {
      const res = await appointmentsApi.getAll();
      setAppointments(res.data);
    } catch (err) {
      toast.error(parseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleUpdate = async () => {
    if (!selectedApt || !newStatus) return;
    setIsUpdating(true);
    try {
      await appointmentsApi.updateStatus(selectedApt.id, { status: newStatus });
      toast.success('Status updated');
      setSelectedApt(null);
      load();
    } catch (err) {
      toast.error(parseError(err));
    } finally {
      setIsUpdating(false);
    }
  };

  const filtered = filterStatus === 'all'
    ? appointments
    : appointments.filter((a) => a.status === filterStatus);

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-gray-900">All Appointments</h1>
          <div className="flex gap-2 flex-wrap">
            {['all', ...STATUS_OPTIONS].map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                  ${filterStatus === s
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <Card>
          {isLoading ? <SkeletonTable rows={8} /> : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📅</p>
              <p className="text-gray-500">No appointments found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                    <th className="pb-3 font-medium">Patient</th>
                    <th className="pb-3 font-medium">Doctor</th>
                    <th className="pb-3 font-medium">Date & Time</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((apt) => (
                    <tr key={apt.id} className="hover:bg-gray-50">
                      <td className="py-4">
                        <p className="font-medium text-gray-900">{apt.patient?.fullName}</p>
                        <p className="text-xs text-gray-400">{apt.patient?.email}</p>
                      </td>
                      <td className="py-4">
                        <p className="text-gray-700">Dr. {apt.doctor?.doctor?.fullName}</p>
                        <p className="text-xs text-blue-500">{apt.doctor?.specialization}</p>
                      </td>
                      <td className="py-4 text-gray-500">{apt.date} · {apt.timeSlot}</td>
                      <td className="py-4">
                        <Badge label={apt.status} variant={statusVariant(apt.status)} />
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary"
                            onClick={() => { setSelectedApt(apt); setNewStatus(''); }}>
                            Update
                          </Button>
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
            <p className="text-gray-500">Doctor: <span className="font-medium text-gray-800">Dr. {selectedApt?.doctor?.doctor?.fullName}</span></p>
            <p className="text-gray-500">Time: <span className="font-medium text-gray-800">{selectedApt?.date} at {selectedApt?.timeSlot}</span></p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">New Status</label>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((opt) => (
                <label key={opt} className="flex items-center gap-3 p-3 rounded-lg border
                  cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="radio" name="admin-status" value={opt}
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