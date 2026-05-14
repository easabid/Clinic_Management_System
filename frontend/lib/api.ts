import api from './axios';
import {
  AuthResponse,
  User,
  DoctorProfile,
  Appointment,
  AppointmentStatus,
} from '../types';

//auth

export const authApi = {
  register: (data: {
    email: string;
    password: string;
    fullName: string;
    role: string;
    phone?: string;
  }) => api.post<AuthResponse>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),

  getMe: () => api.get<User>('/auth/me'),
};

//doctors

export const doctorsApi = {
  getAll: () => api.get<DoctorProfile[]>('/doctors'),

  getOne: (id: string) => api.get<DoctorProfile>(`/doctors/${id}`),

  create: (data: {
    userId: string;
    specialization: string;
    qualification: string;
    consultationFee: number;
    availableDays: string[];
  }) => api.post<DoctorProfile>('/doctors', data),

  update: (id: string, data: Partial<{
    specialization: string;
    qualification: string;
    consultationFee: number;
    availableDays: string[];
  }>) => api.patch<DoctorProfile>(`/doctors/${id}`, data),

  delete: (id: string) => api.delete(`/doctors/${id}`),
};

//appointments

export const appointmentsApi = {
  book: (data: { doctorId: string; date: string; timeSlot: string }) =>
    api.post<Appointment>('/appointments', data),

  getAll: () => api.get<Appointment[]>('/appointments'),

  getMine: () => api.get<Appointment[]>('/appointments/mine'),

  updateStatus: (
    id: string,
    data: { status: AppointmentStatus; cancellationReason?: string }
  ) => api.patch<Appointment>(`/appointments/${id}/status`, data),

  cancel: (id: string) => api.delete<Appointment>(`/appointments/${id}`),

  getPatientHistory: (patientId: string) =>
    api.get<Appointment[]>(`/patients/${patientId}/history`),
};

//users

export const usersApi = {
  getAll: () => api.get<User[]>('/users'),
  getOne: (id: string) => api.get<User>(`/users/${id}`),
  delete: (id: string) => api.delete(`/users/${id}`),
};