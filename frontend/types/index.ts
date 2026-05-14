export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  ADMIN = 'admin',
}

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  dateOfBirth?: string;
  createdAt: string;
}

export interface DoctorProfile {
  id: string;
  specialization: string;
  qualification: string;
  consultationFee: number;
  availableDays: string[];
  appointmentCount?: number;
  doctor: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
  };
}

export interface Appointment {
  id: string;
  date: string;
  timeSlot: string;
  status: AppointmentStatus;
  cancellationReason?: string;
  createdAt: string;
  patient: User;
  doctor: DoctorProfile;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface ApiError {
  message: string | string[];
  statusCode: number;
}