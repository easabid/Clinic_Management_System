'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import Button from '../../../../components/ui/Button';
import { SkeletonCard } from '../../../../components/ui/Skeleton';
import { doctorsApi } from '../../../../lib/api';
import { parseError } from '../../../../lib/parseError';

export default function FindDoctorsPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await doctorsApi.getAll();
        setDoctors(res.data);
        setFiltered(res.data);
      } catch (err) {
        toast.error(parseError(err));
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      doctors.filter(
        (d) =>
          d.doctor?.fullName?.toLowerCase().includes(q) ||
          d.specialization?.toLowerCase().includes(q)
      )
    );
  }, [search, doctors]);

  return (
    <DashboardLayout allowedRoles={['patient']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Find Doctors</h1>
          <p className="text-gray-500 mt-1 text-sm">Browse and book from our specialists</p>
        </div>

        <input
          type="text"
          placeholder="Search by name or specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 rounded-xl border border-gray-200
            text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">👨‍⚕️</p>
            <p className="text-gray-500">No doctors found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((doctor) => (
              <div key={doctor.id}
                className="bg-white rounded-xl border border-gray-100 p-6
                  hover:shadow-md hover:border-blue-100 transition-all duration-200">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center
                  justify-center text-2xl mb-4">
                  👨‍⚕️
                </div>
                <h3 className="text-base font-semibold text-gray-900">
                  Dr. {doctor.doctor?.fullName}
                </h3>
                <p className="text-sm text-blue-600 font-medium">{doctor.specialization}</p>
                <p className="text-xs text-gray-400 mt-1">{doctor.qualification}</p>
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-1">
                  <p className="text-xs text-gray-500">💰 ৳{doctor.consultationFee} consultation fee</p>
                  <p className="text-xs text-gray-500">📅 {doctor.availableDays?.join(', ')}</p>
                </div>
                <Button
                  className="w-full mt-4"
                  size="sm"
                  onClick={() => router.push(`/patient/book/${doctor.id}`)}
                >
                  Book Appointment
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}