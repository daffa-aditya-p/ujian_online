# 🚀 Setup Final & Deployment Guide

## ✅ Checklist Pengembangan

### Backend (Laravel 12)
- ✅ Models lengkap: User, Ujian, Soal, JawabanSiswa, HasilUjian, SecurityLog
- ✅ Controllers dengan business logic lengkap
- ✅ Routes dengan middleware authentication & authorization
- ✅ Query optimization dengan eager loading & pagination
- ✅ Security logging dengan auto-lock mechanism
- ✅ Server time endpoint untuk security check

### Frontend (React + TypeScript)
- ✅ TypeScript strict mode enabled
- ✅ Design system dengan orange modern theme
- ✅ Responsive design (mobile-first)
- ✅ 5 pages: Login, Admin Dashboard, Guru Dashboard, Siswa Dashboard, Ujian Page
- ✅ API client dengan error handling
- ✅ Real-time security monitoring dengan 9 detection types
- ✅ Auto-save functionality
- ✅ Fullscreen enforcement
- ✅ Timer countdown dengan server sync

## 🔧 Setup Sebelum Deploy

### 1. Backend Setup

```bash
cd backend

# Install Composer dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Setup database (MySQL/MariaDB)
# Edit .env dengan database credentials Anda:
# DB_DATABASE=ujian_online
# DB_USERNAME=root
# DB_PASSWORD=your_password

# Run migrations
php artisan migrate

# (Optional) Seed database dengan data demo
php artisan db:seed

# Start server
php artisan serve
# Server akan berjalan di http://localhost:8000
```

### 2. Frontend Setup

```bash
cd ujian_online

# Dependencies sudah ter-install (npm install sudah dijalankan)

# Development mode
npm run dev
# Frontend akan berjalan di http://localhost:5173

# Atau build untuk production
npm run build
# Output akan ada di dist/
```

### 3. CORS Configuration (Backend)

Jika frontend dan backend di URL berbeda, setup CORS di `config/cors.php`:

```php
'allowed_origins' => ['http://localhost:5173', 'your-frontend-url'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true,
```

### 4. Sanctum Configuration (Backend)

Di `.env`:
```
SANCTUM_STATEFUL_DOMAINS=localhost:5173,your-frontend-domain.com
SESSION_DOMAIN=localhost
```

## 🏃 Running Aplikasi

### Development

**Terminal 1 - Backend:**
```bash
cd backend
php artisan serve
```

**Terminal 2 - Frontend:**
```bash
cd ujian_online
npm run dev
```

Akses: `http://localhost:5173`

### Production

**1. Build Frontend:**
```bash
cd ujian_online
npm run build
```

**2. Deploy Backend:**
- Push ke production server
- Update `.env` dengan production database & APP_KEY
- Run migrations: `php artisan migrate --force`
- Optimize: `php artisan optimize`
- Set proper permissions untuk `storage/` dan `bootstrap/cache/`

**3. Deploy Frontend:**
- Copy `dist/` folder ke production
- Serve dengan web server (Nginx, Apache)
- Update API base URL jika backend di domain berbeda

## 🔐 Default Test Credentials

Setelah seed database:

### Admin
- NIS: `admin001`
- Password: `password`

### Guru
- NIS: `guru001`
- Password: `password`

### Siswa
- NIS: `siswa001`
- Password: `password`

## 📝 Membuat Ujian (Step by Step)

### 1. Login sebagai Guru
- Akses `/login`
- Masukkan NIS guru dan password
- Redirect ke `/guru`

### 2. Buat Ujian
- Klik "Buat Ujian Baru"
- Isi form: nama, jenis, waktu mulai, waktu selesai, durasi
- Token otomatis di-generate
- Klik "Simpan"

### 3. Kelola Soal
- Di dashboard, klik "Kelola Soal" pada ujian
- Klik "Tambah Soal"
- Isi pertanyaan, pilihan A-E, jawaban benar, poin
- Bisa pilih "Pilihan Ganda" atau "Pilihan Ganda Kompleks" (multiple choice)
- Repeat untuk soal lainnya

### 4. Bagikan Token ke Siswa
- Token ujian ada di card ujian (contoh: `ABC123XY`)
- Beritahu siswa token ini

### 5. Siswa Mengerjakan Ujian
- Login sebagai siswa
- Klik "Mulai Ujian Baru" atau FAB button
- Masukkan token ujian
- Kerjakan soal (auto-save setiap 3 detik)
- Selesaikan sebelum waktu habis

### 6. Admin Lihat Hasil
- Login sebagai admin
- Ke "Kelola Nilai"
- Pilih ujian → lihat hasil siswa
- Klik siswa → lihat jawaban detail + security logs
- Bisa unlock ujian jika ada violation

## 🛡️ Security Best Practices

### Backend
```php
// Validate ALL input
$request->validate([
    'nama_ujian' => 'required|string|max:255',
    'durasi_menit' => 'required|integer|min:1|max:480',
    // ... etc
]);

// Use parameterized queries (Eloquent by default)
// Rate limiting
// CORS configuration
// CSRF protection
```

### Frontend
```typescript
// Security monitoring active by default
// All events logged to backend
// Auto-lock after 5 violations
// Token stored securely in localStorage (can upgrade to sessionStorage)
// Sensitive data never logged to console
```

## 📊 Monitoring & Analytics

### Admin Panel - Kelola Nilai
- Total ujian dan peserta
- Rata-rata nilai per ujian
- Security logs per siswa
- Violation tracking

### Metrics to Track
- Completion rate
- Average score
- Security violations
- Time taken per exam
- Question difficulty analysis

## 🐛 Troubleshooting

### Frontend tidak bisa connect ke backend
1. Pastikan backend running: `php artisan serve`
2. Check CORS configuration
3. Check API base URL di `src/api/client.ts`

### Ujian tidak bisa di-submit
1. Check violation_count di HasilUjian table
2. Jika locked, admin perlu unlock dulu

### Security monitoring tidak logging
1. Check backend `/security/log` endpoint
2. Verify student is authenticated
3. Check browser console untuk errors

### Build error
1. `npm install` untuk install dependencies
2. `npm run build` untuk rebuild
3. Check TypeScript errors: `tsc`

## 📈 Performance Tips

- Use pagination untuk list ujian & nilai
- Enable gzip compression di web server
- Implement caching untuk static assets
- Monitor database query performance
- Use CDN untuk static files

## 🚀 Skalabilitas

Untuk production besar:
1. **Database**: Tambah indexes, optimize queries
2. **Caching**: Redis untuk session & queries
3. **Load Balancing**: Nginx reverse proxy
4. **Monitoring**: Laravel Horizon untuk jobs, monitoring tools
5. **Real-time**: WebSocket untuk live features

## 📚 Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Vite Documentation](https://vitejs.dev)

## ✨ Next Steps untuk Enhancement

1. **Email Notifications**: Kirim notifikasi hasil ujian ke email siswa
2. **PDF Export**: Generate report ujian ke PDF
3. **Question Bank**: Upload soal dari file Excel
4. **Blind Review**: Mode review ulang tanpa melihat jawaban
5. **Analitik Lanjutan**: Difficulty index, discrimination index
6. **Mobile App**: Develop mobile version dengan React Native
7. **Live Proctoring**: Integrasi video conferencing
8. **Adaptive Testing**: Difficulty sesuai performance

---

**Happy Testing! 🎓**
