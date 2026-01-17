import axios from 'axios';
import type { User, LoginResponse, Ujian, Soal, HasilUjian, SecurityLog, JawabanSiswa, PaginatedResponse } from '../types';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (nis: string, password: string): Promise<LoginResponse> => {
    const res = await api.post('/login', { nis, password });
    return res.data;
  },
  logout: async () => {
    await api.post('/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const adminApi = {
  getUsers: async (page = 1): Promise<PaginatedResponse<User>> => (await api.get(`/admin/users?page=${page}`)).data,
  createUser: async (data: Partial<User> & { password: string }): Promise<User> => (await api.post('/admin/users', data)).data,
  updateUser: async (id: number, data: Partial<User>): Promise<User> => (await api.put(`/admin/users/${id}`, data)).data,
  deleteUser: async (id: number) => api.delete(`/admin/users/${id}`),
  toggleLock: async (id: number): Promise<User> => (await api.patch(`/admin/users/${id}/toggle-lock`)).data,
  getSecurityLogs: async (page = 1): Promise<PaginatedResponse<SecurityLog>> => (await api.get(`/admin/security-logs?page=${page}`)).data,
};

export const guruApi = {
  getUjian: async (): Promise<Ujian[]> => (await api.get('/guru/ujian')).data,
  createUjian: async (data: Partial<Ujian>): Promise<Ujian> => (await api.post('/guru/ujian', data)).data,
  updateUjian: async (id: number, data: Partial<Ujian>): Promise<Ujian> => (await api.put(`/guru/ujian/${id}`, data)).data,
  deleteUjian: async (id: number) => api.delete(`/guru/ujian/${id}`),
  getSoal: async (ujianId: number): Promise<Soal[]> => (await api.get(`/guru/ujian/${ujianId}/soal`)).data,
  createSoal: async (ujianId: number, data: Partial<Soal>): Promise<Soal> => (await api.post(`/guru/ujian/${ujianId}/soal`, data)).data,
  updateSoal: async (ujianId: number, soalId: number, data: Partial<Soal>): Promise<Soal> => (await api.put(`/guru/ujian/${ujianId}/soal/${soalId}`, data)).data,
  deleteSoal: async (ujianId: number, soalId: number) => api.delete(`/guru/ujian/${ujianId}/soal/${soalId}`),
  getNilai: async (ujianId: number): Promise<HasilUjian[]> => (await api.get(`/guru/ujian/${ujianId}/nilai`)).data,
};

export const siswaApi = {
  getDashboard: async (): Promise<{ ujian_aktif: Ujian[]; riwayat: HasilUjian[] }> => (await api.get('/siswa/dashboard')).data,
  getUjian: async (id: number): Promise<{ ujian: Ujian; soal: Soal[]; jawaban: JawabanSiswa[] }> => (await api.get(`/siswa/ujian/${id}`)).data,
  submitJawaban: async (ujianId: number, soalId: number, jawaban: string) => api.post(`/siswa/ujian/${ujianId}/jawaban`, { soal_id: soalId, jawaban }),
  submitUjian: async (ujianId: number): Promise<HasilUjian> => (await api.post(`/siswa/ujian/${ujianId}/submit`)).data,
  logSecurity: async (ujianId: number, eventType: string, eventData?: string) => api.post(`/siswa/ujian/${ujianId}/security-log`, { event_type: eventType, event_data: eventData }),
  getServerTime: async (): Promise<{ server_time: string; timestamp: number }> => (await api.get('/siswa/server-time')).data,
};

export default api;
