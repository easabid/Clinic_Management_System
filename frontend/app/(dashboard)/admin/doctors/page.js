'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import Modal from '../../../../components/ui/Modal';
import { SkeletonTable } from '../../../../components/ui/Skeleton';
import { doctorsApi, usersApi } from '../../../../lib/api';
import { parseError } from '../../../../lib/parseError';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [doctorUsers, setDoctorUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [form, setForm] = useState({
    userId: '', specialization: '', qualification: '',
    consultationFee: '', availableDays: [],
  });
  const [formErrors, setFormErrors] = useState({});

  const load = async () => {
    try {
      const [docRes, userRes] = await Promise.all([
        doctorsApi.getAll(),
        usersApi.getAll(),
      ]);
      setDoctors(docRes.data);
      // Only show doctor users without a profile
      const available = userRes.data.filter(
        (u) => u.role === 'doctor' &&
          !docRes.data.find((d) => d.doctor?.id === u.id)
      );
      setDoctorUsers(available);
    } catch (err) {
      toast.error(parseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const validate = () => {
    const e = {};
    if (!form.userId) e.userId = 'Please select a doctor user';
    if (!form.specialization.trim()) e.specialization = 'Required';
    if (!form.qualification.trim()) e.qualification = 'Required';
    if (!form.consultationFee || isNaN(Number(form.consultationFee)))
      e.consultationFee = 'Enter a valid fee';
    if (form.availableDays.length === 0)
      e.availableDays = 'Select at least one day';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await doctorsApi.create({
        userId: form.userId,
        specialization: form.specialization,
        qualification: form.qualification,
        consultationFee: Number(form.consultationFee),
        availableDays: form.availableDays,
      });
      toast.success('Doctor profile created!');
      setShowCreate(false);
      setForm({ userId: '', specialization: '', qualification: '', consultationFee: '', availableDays: [] });
      load();
    } catch (err) {
      toast.error(parseError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await doctorsApi.delete(deleteId);
      toast.success('Doctor profile deleted');
      setDeleteId(null);
      load();
    } catch (err) {
      toast.error(parseError(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleDay = (day) => {
    setForm((f) => ({
      ...f,
      availableDays: f.availableDays.includes(day)
        ? f.availableDays.filter((d) => d !== day)
        : [...f.availableDays, day],
    }));
  };

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Manage Doctors</h1>
          <Button onClick={() => setShowCreate(true)}>+ Create Doctor Profile</Button>
        </div>

        <Card>
          {isLoading ? <SkeletonTable rows={5} /> : doctors.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">👨‍⚕️</p>
              <p className="text-gray-500">No doctor profiles yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                    <th className="pb-3 font-medium">Doctor</th>
                    <th className="pb-3 font-medium">Specialization</th>
                    <th className="pb-3 font-medium">Qualification</th>
                    <th className="pb-3 font-medium">Fee</th>
                    <th className="pb-3 font-medium">Available Days</th>
                    <th className="pb-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {doctors.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="py-4 font-medium text-gray-900">
                        Dr. {d.doctor?.fullName}
                      </td>
                      <td className="py-4 text-blue-600 font-medium">{d.specialization}</td>
                      <td className="py-4 text-gray-500">{d.qualification}</td>
                      <td className="py-4 text-gray-700">৳{d.consultationFee}</td>
                      <td className="py-4 text-gray-500 text-xs max-w-xs">
                        {d.availableDays?.join(', ')}
                      </td>
                      <td className="py-4">
                        <Button size="sm" variant="danger"
                          onClick={() => setDeleteId(d.id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Create modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create Doctor Profile"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button isLoading={isSubmitting} onClick={handleCreate}>Create Profile</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Select Doctor User
            </label>
            <select
              value={form.userId}
              onChange={(e) => setForm((f) => ({ ...f, userId: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">— Select a doctor user —</option>
              {doctorUsers.map((u) => (
                <option key={u.id} value={u.id}>{u.fullName} ({u.email})</option>
              ))}
            </select>
            {formErrors.userId && (
              <p className="text-xs text-red-600 mt-1">{formErrors.userId}</p>
            )}
          </div>

          <Input label="Specialization" placeholder="e.g. Cardiology"
            value={form.specialization}
            onChange={(e) => setForm((f) => ({ ...f, specialization: e.target.value }))}
            error={formErrors.specialization} />

          <Input label="Qualification" placeholder="e.g. MBBS, MD"
            value={form.qualification}
            onChange={(e) => setForm((f) => ({ ...f, qualification: e.target.value }))}
            error={formErrors.qualification} />

          <Input label="Consultation Fee (৳)" type="number" placeholder="e.g. 500"
            value={form.consultationFee}
            onChange={(e) => setForm((f) => ({ ...f, consultationFee: e.target.value }))}
            error={formErrors.consultationFee} />

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Available Days
            </label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => (
                <button key={day} type="button" onClick={() => toggleDay(day)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                    ${form.availableDays.includes(day)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
            {formErrors.availableDays && (
              <p className="text-xs text-red-600 mt-1">{formErrors.availableDays}</p>
            )}
          </div>
        </div>
      </Modal>

      {/* Delete modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Doctor Profile"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" isLoading={isDeleting} onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-gray-600 text-sm">
          This will permanently delete the doctor profile. This action cannot be undone.
        </p>
      </Modal>
    </DashboardLayout>
  );
}