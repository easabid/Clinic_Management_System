'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../../../components/layout/DashboardLayout';
import Card from '../../../../../components/ui/Card';
import Button from '../../../../../components/ui/Button';
import Input from '../../../../../components/ui/Input';
import { doctorsApi, appointmentsApi } from '../../../../../lib/api';
import { parseError } from '../../../../../lib/parseError';

const TIME_SLOTS = [
  '09:00 AM','09:30 AM','10:00 AM','10:30 AM',
  '11:00 AM','11:30 AM','02:00 PM','02:30 PM',
  '03:00 PM','03:30 PM','04:00 PM','04:30 PM',
];

export default function BookAppointmentPage() {
  const { doctorId } = useParams();
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await doctorsApi.getOne(doctorId);
        setDoctor(res.data);
      } catch (err) {
        toast.error(parseError(err));
        router.push('/patient/doctors');
      } finally {
        setIsFetching(false);
      }
    };
    fetch();
  }, [doctorId, router]);

  const handleBook = async () => {
    if (!date) { toast.error('Please select a date'); return; }
    if (!timeSlot) { toast.error('Please select a time slot'); return; }

    setIsLoading(true);
    try {
      await appointmentsApi.book({ doctorId, date, timeSlot });
      toast.success('Appointment booked! Check your email for confirmation.');
      router.push('/patient/appointments');
    } catch (err) {
      toast.error(parseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <DashboardLayout allowedRoles={['patient']}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout allowedRoles={['patient']}>
      <div className="max-w-2xl space-y-6">
        <div>
          <button onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-gray-700 mb-4
              flex items-center gap-1">
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
        </div>

        {/* Doctor info card */}
        {doctor && (
          <Card>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center
                justify-center text-3xl flex-shrink-0">
                👨‍⚕️
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Dr. {doctor.doctor?.fullName}
                </h2>
                <p className="text-blue-600 font-medium text-sm">{doctor.specialization}</p>
                <p className="text-xs text-gray-400 mt-0.5">{doctor.qualification}</p>
                <div className="mt-3 flex gap-4 text-xs text-gray-500">
                  <span>💰 ৳{doctor.consultationFee}</span>
                  <span>📅 {doctor.availableDays?.join(', ')}</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Booking form */}
        <Card title="Select Date & Time">
          <div className="space-y-6">
            <Input
              label="Appointment Date"
              type="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
            />

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-3">
                Select Time Slot
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTimeSlot(slot)}
                    className={`py-2.5 px-3 rounded-lg text-sm font-medium border
                      transition-all duration-150
                      ${timeSlot === slot
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleBook}
              isLoading={isLoading}
              size="lg"
              className="w-full"
              disabled={!date || !timeSlot}
            >
              {isLoading ? 'Booking...' : 'Confirm Appointment'}
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}