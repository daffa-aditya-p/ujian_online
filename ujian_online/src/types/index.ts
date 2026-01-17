export interface User {
  id: number;
  nis: string;
  nama: string;
  is_admin: boolean;
  is_guru: boolean;
  is_locked?: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface Ujian {
  id: number;
  guru_id: number;
  jenis_ujian: string;
  nama_ujian: string;
  waktu_mulai: string;
  waktu_selesai: string;
  durasi_menit: number;
  token: string;
  is_active: boolean;
  soals_count?: number;
}

export interface Soal {
  id: number;
  ujian_id: number;
  nomor_soal: number;
  jenis_soal: 'pilihan_ganda' | 'pilihan_ganda_kompleks';
  pertanyaan: string;
  pilihan: Record<string, string>;
  jawaban_benar?: string[];
  poin: number;
}

export interface JawabanSiswa {
  id?: number;
  siswa_id: number;
  soal_id: number;
  ujian_id: number;
  jawaban: string[];
  is_correct?: boolean;
}

export interface HasilUjian {
  id: number;
  siswa_id: number;
  ujian_id: number;
  waktu_mulai: string;
  waktu_selesai?: string;
  total_soal: number;
  benar: number;
  salah: number;
  nilai: number;
  violation_count: number;
  status: 'ongoing' | 'completed' | 'locked';
  ujian?: Ujian;
  siswa?: User;
}

export interface SecurityLog {
  id: number;
  siswa_id: number;
  ujian_id: number;
  event_type: string;
  event_data?: string;
  created_at: string;
  siswa?: User;
  ujian?: Ujian;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
