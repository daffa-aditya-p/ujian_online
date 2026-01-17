# 📡 API Documentation

## Base URL
- Development: `http://localhost:8000/api`
- Production: `https://your-domain.com/api`

## Authentication

### Login
```
POST /auth/login
Content-Type: application/json

{
  "nis": "siswa001",
  "password": "password"
}

Response (200 OK):
{
  "status": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": 1,
      "nis": "siswa001",
      "nama": "John Doe",
      "email": "john@example.com",
      "role": "siswa",
      "status_keamanan": "aktif"
    },
    "token": "2|XXXX...",
    "token_type": "Bearer"
  }
}
```

### Logout
```
POST /auth/logout
Authorization: Bearer {token}

Response (200 OK):
{
  "status": true,
  "message": "Logout berhasil"
}
```

### Change Password
```
POST /auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "current_password": "old_password",
  "new_password": "new_password",
  "new_password_confirmation": "new_password"
}

Response (200 OK):
{
  "status": true,
  "message": "Password berhasil diubah"
}
```

## Admin Endpoints

### User Management

**Get All Users**
```
GET /admin/users?per_page=10&page=1
Authorization: Bearer {admin_token}

Response:
{
  "status": true,
  "data": {
    "data": [
      {
        "id": 1,
        "nis": "siswa001",
        "nama": "John Doe",
        "email": "john@example.com",
        "role": "siswa",
        "status_keamanan": "aktif"
      }
    ],
    "current_page": 1,
    "per_page": 10,
    "total": 25
  }
}
```

**Create User**
```
POST /admin/users
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "nis": "siswa002",
  "nama": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "siswa"
}

Response (201):
{
  "status": true,
  "data": {
    "id": 2,
    "nis": "siswa002",
    "nama": "Jane Doe",
    ...
  }
}
```

**Update User**
```
PUT /admin/users/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "nama": "Jane Smith",
  "email": "jane.smith@example.com"
}
```

**Delete User**
```
DELETE /admin/users/{id}
Authorization: Bearer {admin_token}
```

**Lock/Unlock User**
```
PUT /admin/users/{id}/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status_keamanan": "aktif" | "terkunci"
}
```

### Nilai (Grades) Management

**Get All Hasil Ujian**
```
GET /admin/nilai?per_page=10&page=1
Authorization: Bearer {admin_token}

Response:
{
  "status": true,
  "data": {
    "data": [
      {
        "id": 1,
        "siswa": { "id": 1, "nama": "John Doe", "nis": "siswa001" },
        "ujian": { "id": 1, "nama": "Ujian Tengah Semester" },
        "nilai": 85,
        "status": "selesai",
        "violation_count": 0,
        "waktu_mulai": "2024-01-12T10:00:00Z",
        "waktu_selesai": "2024-01-12T11:30:00Z"
      }
    ],
    "current_page": 1,
    "per_page": 10,
    "total": 50
  }
}
```

**Detail Nilai Siswa**
```
GET /admin/nilai/{hasil_ujian_id}
Authorization: Bearer {admin_token}

Response:
{
  "status": true,
  "data": {
    "id": 1,
    "siswa": { ... },
    "ujian": { ... },
    "nilai": 85,
    "jawaban_siswas": [
      {
        "id": 1,
        "soal": {
          "id": 1,
          "pertanyaan": "Apa itu...",
          "poin": 10
        },
        "jawaban_siswa": "A",
        "jawaban_benar": "A",
        "benar": true,
        "poin_diperoleh": 10
      }
    ],
    "security_logs": [
      {
        "id": 1,
        "jenis_pelanggaran": "tab_switch",
        "deskripsi": "Siswa beralih tab",
        "waktu": "2024-01-12T10:05:30Z"
      }
    ]
  }
}
```

**Unlock Hasil Ujian**
```
PUT /admin/nilai/{hasil_ujian_id}/unlock
Authorization: Bearer {admin_token}

Response:
{
  "status": true,
  "message": "Ujian berhasil di-unlock"
}
```

## Guru Endpoints

### Exam Management

**Get All Ujian (Guru's Exams)**
```
GET /guru/ujians
Authorization: Bearer {guru_token}

Response:
{
  "status": true,
  "data": [
    {
      "id": 1,
      "nama": "Ujian Tengah Semester",
      "jenis": "essay",
      "waktu_mulai": "2024-01-15T10:00:00Z",
      "waktu_selesai": "2024-01-15T12:00:00Z",
      "durasi_menit": 120,
      "token": "ABC123XY",
      "soal_count": 5,
      "hasil_ujians_count": 12
    }
  ]
}
```

**Create Ujian**
```
POST /guru/ujians
Authorization: Bearer {guru_token}
Content-Type: application/json

{
  "nama": "Ujian Akhir Semester",
  "jenis": "pilihan_ganda",
  "waktu_mulai": "2024-01-20T09:00:00Z",
  "waktu_selesai": "2024-01-20T11:00:00Z",
  "durasi_menit": 120,
  "deskripsi": "Ujian akhir semester mata pelajaran..."
}

Response (201):
{
  "status": true,
  "data": {
    "id": 2,
    "nama": "Ujian Akhir Semester",
    "token": "XYZ789AB",
    ...
  }
}
```

**Update Ujian**
```
PUT /guru/ujians/{id}
Authorization: Bearer {guru_token}
Content-Type: application/json

{
  "nama": "Ujian Akhir Semester (Updated)",
  "durasi_menit": 150
}
```

**Delete Ujian**
```
DELETE /guru/ujians/{id}
Authorization: Bearer {guru_token}
```

**Get Ujian Detail (with Soal)**
```
GET /guru/ujians/{id}
Authorization: Bearer {guru_token}

Response:
{
  "status": true,
  "data": {
    "id": 1,
    "nama": "Ujian Tengah Semester",
    ...
    "soals": [
      {
        "id": 1,
        "nomor": 1,
        "pertanyaan": "Apa itu...",
        "tipe": "pilihan_ganda",
        "pilihan_a": "Option A",
        "pilihan_b": "Option B",
        ...
        "jawaban_benar": "A",
        "poin": 10
      }
    ]
  }
}
```

### Question Management

**Create Soal**
```
POST /guru/ujians/{ujian_id}/soals
Authorization: Bearer {guru_token}
Content-Type: application/json

{
  "nomor": 1,
  "pertanyaan": "Apa itu...",
  "tipe": "pilihan_ganda",
  "pilihan_a": "Option A",
  "pilihan_b": "Option B",
  "pilihan_c": "Option C",
  "pilihan_d": "Option D",
  "pilihan_e": "Option E",
  "jawaban_benar": "A",
  "poin": 10
}

Response (201):
{
  "status": true,
  "data": {
    "id": 1,
    "ujian_id": 1,
    ...
  }
}
```

**Update Soal**
```
PUT /guru/soals/{id}
Authorization: Bearer {guru_token}
Content-Type: application/json

{
  "pertanyaan": "Apa itu... (updated)",
  "poin": 15
}
```

**Delete Soal**
```
DELETE /guru/soals/{id}
Authorization: Bearer {guru_token}
```

## Siswa Endpoints

### Dashboard

**Get Siswa Dashboard**
```
GET /siswa/dashboard
Authorization: Bearer {siswa_token}

Response:
{
  "status": true,
  "data": {
    "siswa": {
      "id": 1,
      "nama": "John Doe",
      "nis": "siswa001",
      "email": "john@example.com"
    },
    "total_ujian": 10,
    "ujian_selesai": 8,
    "rata_rata_nilai": 82.5
  }
}
```

**Get Ujian History**
```
GET /siswa/ujians
Authorization: Bearer {siswa_token}

Response:
{
  "status": true,
  "data": [
    {
      "id": 1,
      "ujian_id": 1,
      "ujian_nama": "Ujian Tengah Semester",
      "status": "selesai",
      "nilai": 85,
      "waktu_mulai": "2024-01-12T10:00:00Z",
      "waktu_selesai": "2024-01-12T11:30:00Z"
    }
  ]
}
```

### Exam Taking

**Start Ujian (Verify Token)**
```
POST /siswa/ujians/verify-token
Authorization: Bearer {siswa_token}
Content-Type: application/json

{
  "token": "ABC123XY"
}

Response (200):
{
  "status": true,
  "data": {
    "hasil_ujian_id": 1,
    "ujian": {
      "id": 1,
      "nama": "Ujian Tengah Semester",
      "durasi_menit": 120,
      "waktu_mulai": "2024-01-12T10:00:00Z",
      "waktu_selesai": "2024-01-12T11:30:00Z"
    },
    "soals": [
      {
        "id": 1,
        "nomor": 1,
        "pertanyaan": "Apa itu...",
        "tipe": "pilihan_ganda",
        "pilihan_a": "Option A",
        ...
      }
    ]
  }
}
```

**Submit Answer**
```
POST /siswa/ujians/{hasil_ujian_id}/jawab
Authorization: Bearer {siswa_token}
Content-Type: application/json

{
  "soal_id": 1,
  "jawaban": "A"
}

Response (200):
{
  "status": true,
  "message": "Jawaban tersimpan"
}
```

**Get Server Time (for security sync)**
```
GET /siswa/server-time
Authorization: Bearer {siswa_token}

Response:
{
  "status": true,
  "data": {
    "server_time": "2024-01-12T10:15:30Z"
  }
}
```

**Log Security Event**
```
POST /siswa/ujians/{hasil_ujian_id}/security-log
Authorization: Bearer {siswa_token}
Content-Type: application/json

{
  "jenis_pelanggaran": "tab_switch",
  "deskripsi": "Siswa beralih tab"
}

Response (200):
{
  "status": true,
  "message": "Event terlogger"
}
```

**Finish Exam**
```
POST /siswa/ujians/{hasil_ujian_id}/selesai
Authorization: Bearer {siswa_token}

Response (200):
{
  "status": true,
  "data": {
    "nilai": 85,
    "total_poin": 100,
    "soal_dijawab": 10,
    "soal_benar": 8.5
  }
}
```

## Security Endpoints

**Log Security Violation**
```
POST /security/log
Authorization: Bearer {token}
Content-Type: application/json

{
  "hasil_ujian_id": 1,
  "jenis_pelanggaran": "fullscreen_exit",
  "deskripsi": "Siswa keluar dari mode fullscreen"
}

Response (200):
{
  "status": true,
  "violation_count": 1
}
```

**Get Security Logs**
```
GET /security/logs/{hasil_ujian_id}
Authorization: Bearer {guru_token}

Response:
{
  "status": true,
  "data": [
    {
      "id": 1,
      "jenis_pelanggaran": "tab_switch",
      "deskripsi": "Siswa beralih tab",
      "waktu": "2024-01-12T10:05:30Z"
    }
  ]
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "status": false,
  "message": "Token tidak valid atau expired"
}
```

### 403 Forbidden
```json
{
  "status": false,
  "message": "Anda tidak memiliki akses ke resource ini"
}
```

### 404 Not Found
```json
{
  "status": false,
  "message": "Resource tidak ditemukan"
}
```

### 422 Validation Error
```json
{
  "status": false,
  "message": "Validasi gagal",
  "errors": {
    "nama": ["Nama harus diisi"],
    "email": ["Email harus valid"]
  }
}
```

### 429 Rate Limited
```json
{
  "status": false,
  "message": "Terlalu banyak request. Coba lagi nanti."
}
```

### 500 Server Error
```json
{
  "status": false,
  "message": "Terjadi kesalahan di server"
}
```

## Rate Limiting

- Login: 5 attempts per minute
- API calls: 60 requests per minute (authenticated)
- File uploads: 5 MB max per file

## Pagination

All list endpoints support pagination:
```
GET /endpoint?page=1&per_page=10

Response includes:
{
  "data": [...],
  "current_page": 1,
  "per_page": 10,
  "total": 100,
  "last_page": 10
}
```

## Sorting & Filtering

Some endpoints support sorting:
```
GET /endpoint?sort_by=name&sort_order=asc
```

Supported sort fields per endpoint:
- Users: name, nis, created_at
- Ujians: nama, created_at, waktu_mulai
- Hasil Ujians: nilai, waktu_selesai, nama_siswa

---

**Last Updated**: 2024-01-12
**API Version**: 1.0
**Status**: Production Ready ✅
