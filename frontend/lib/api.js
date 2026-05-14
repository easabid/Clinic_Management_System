import api from './axios';


export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const doctorsApi = {
  getAll: () => api.get('/doctors'),
  getOne: (id) => api.get(`/doctors/${id}`),
  create: (data) => api.post('/doctors', data),
  update: (id, data) => api.patch(`/doctors/${id}`, data),
  delete: (id) => api.delete(`/doctors/${id}`),
};

export const appointmentsApi = {
  book: (data) => api.post('/appointments', data),
  getAll: () => api.get('/appointments'),
  getMine: () => api.get('/appointments/mine'),
  updateStatus: (id, data) => api.patch(`/appointments/${id}/status`, data),
  cancel: (id) => api.delete(`/appointments/${id}`),
  getPatientHistory: (patientId) => api.get(`/patients/${patientId}/history`),
};

export const usersApi = {
  getAll: () => api.get('/users'),
  getOne: (id) => api.get(`/users/${id}`),
  delete: (id) => api.delete(`/users/${id}`),
};
