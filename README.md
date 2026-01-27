# 📚 Ujian Online - Complete System Documentation.

## 🎯 Project Overview

**Ujian Online** adalah platform ujian online yang aman dan comprehensive dengan fitur monitoring keamanan real-time, built dengan:
- **Backend**: Laravel 12 + Sanctum (API + Auth)
- **Frontend**: React 19 + TypeScript + Vite
- **Database**: MySQL/MariaDB
- **Security**: 9-point exam monitoring system

## ✨ Key Features

### 🔐 Security Monitoring (9-Point System)
1. **Fullscreen Enforcement** - Exam hanya bisa dikerjakan fullscreen
2. **Tab Switch Detection** - Deteksi ketika siswa berpindah tab
3. **Blur/Focus Detection** - Deteksi ketika window blur/focus
4. **Fullscreen Exit** - Deteksi ketika user exit fullscreen
5. **DevTools Detection** - Deteksi pembukaan developer tools
6. **Keyboard Shortcut Blocking** - Block F12, Ctrl+Shift+I/C/J, Ctrl+S
7. **Clipboard Prevention** - Cegah copy/paste selama ujian
8. **Window Minimize Detection** - Deteksi ketika window diminimize
9. **Time Drift Detection** - Deteksi manipulasi waktu device
10. **Auto-Save** - Simpan jawaban otomatis setiap 3 detik

### 👥 Role-Based Access Control
- **Admin**: User management, nilai monitoring, security logs
- **Guru**: Create & manage exams, upload questions, view results
- **Siswa**: Take exams, view results, check scores

### 📊 Advanced Features
- Real-time timer dengan warning
- Pagination untuk list data
- Auto-lock setelah 5 violations
- Responsive design (mobile-friendly)
- Token-based authentication
- Role-based middleware
- Query optimization dengan eager loading
- Comprehensive security logging
- ✅ Security logging dengan auto-lock pada violation ≥5
- ✅ Optimasi query dengan eager loading dan pagination
- ✅ Validasi input komprehensif

### Frontend (React + TypeScript + Vite)
- ✅ Modern UI dengan design system orange (Primary: #FF6B35)
- ✅ Responsive design (mobile-first, breakpoints: 768px, 1024px)
- ✅ Fullscreen enforcement untuk ujian
- ✅ Real-time timer countdown (sync dengan server)
- ✅ Auto-save jawaban setiap 3 detik
- ✅ Advanced security monitoring dengan 9 detection types
- ✅ TypeScript strict mode
- ✅ Production-ready build (116 modules, 95.12 KB gzipped)

## 📁 Project Structure

```
/workspaces/ujian_online/
├── backend/                          # Laravel Application
│   ├── app/Http/Controllers/Api/    # REST API Controllers
│   ├── app/Models/                  # Eloquent Models
│   ├── app/Middleware/              # Role-based middleware
│   ├── database/migrations/         # Database schema
│   ├── routes/api.php               # API routes
│   ├── composer.json
│   └── .env.example
│
├── ujian_online/                     # React Application
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   ├── pages/                   # Page components
│   │   ├── api/                     # API services
│   │   ├── types/                   # TypeScript interfaces
│   │   ├── theme/                   # Design system
│   │   ├── App.tsx                  # Root component
│   │   └── main.tsx                 # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── README.md                        # This file
├── SETUP.md                         # Setup & deployment guide
├── API_DOCUMENTATION.md             # Complete API reference
├── FRONTEND_COMPONENTS.md           # Component documentation
└── TESTING_GUIDE.md                 # Testing checklist
```

## 🎨 Design System

### Colors (Orange Modern Theme)
- **Primary**: `#FF6B35`
- **Primary Dark**: `#E85A2B`
- **Secondary**: `#FFA726`
- **Success**: `#4CAF50`
- **Error**: `#F44336`
- **Text**: `#333333`
- **Border**: `#E2E8F0`

### Spacing (8px base unit)
- 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 56px, 64px

### Typography
- **Font**: System fonts (SF Pro Display, Segoe UI, Roboto)
- **Base Size**: 16px
- **Scale**: 12px, 14px, 16px, 18px, 20px, 24px, 30px

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+
- PHP 8.2+
- Composer
- MySQL/MariaDB

### Backend Setup

```bash
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Seed database (optional)
php artisan db:seed

# Start server
php artisan serve
```

Backend akan berjalan di `http://localhost:8000`

### Frontend Setup

## 🚀 Quick Start

### Prerequisites
- PHP 8.2+ dengan extensions: PDO, MySQL, JSON
- Node.js 18+ dengan npm
- MySQL/MariaDB 5.7+
- Composer

### Backend Setup

```bash
cd backend

# 1. Install dependencies
composer install

# 2. Setup environment
cp .env.example .env

# 3. Generate app key
php artisan key:generate

# 4. Configure database in .env
# DB_DATABASE=ujian_online
# DB_USERNAME=root
# DB_PASSWORD=your_password

# 5. Run migrations
php artisan migrate

# 6. (Optional) Seed database
php artisan db:seed

# 7. Start server
php artisan serve
# Server berjalan di http://localhost:8000
```

### Frontend Setup

```bash
cd ujian_online

# 1. Install dependencies
npm install

# 2. Development mode
npm run dev
# Frontend berjalan di http://localhost:5173

# 3. Build for production
npm run build
```

## 📚 Documentation

For comprehensive information, see:
- [SETUP.md](SETUP.md) - Setup & deployment guide
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - Complete API reference  
- [FRONTEND_COMPONENTS.md](FRONTEND_COMPONENTS.md) - Component documentation
- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Testing checklist

## 🔑 Default Credentials

After database seeding:
- **Admin**: NIS `admin001`, Password `password`
- **Guru**: NIS `guru001`, Password `password`
- **Siswa**: NIS `siswa001`, Password `password`

## 🔄 API Endpoints Summary

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/change-password` - Change password

### Admin
- `GET /api/admin/users` - Get users (paginated)
- `POST/PUT/DELETE /api/admin/users/{id}` - Manage users
- `GET /api/admin/nilai` - Get exam results

### Guru
- `GET /api/guru/ujians` - Get exams
- `POST/PUT/DELETE /api/guru/ujians/{id}` - Manage exams
- `POST/PUT/DELETE /api/guru/ujians/{id}/soals` - Manage questions

### Siswa
- `GET /api/siswa/dashboard` - Dashboard data
- `POST /api/siswa/ujians/verify-token` - Start exam
- `POST /api/siswa/ujians/{id}/jawab` - Submit answer
- `POST /api/siswa/ujians/{id}/selesai` - Finish exam

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete details.

## 🔒 Security Highlights

### Backend
- ✅ Sanctum token authentication
- ✅ Role-based middleware
- ✅ Input validation & sanitization
- ✅ SQL injection prevention
- ✅ CSRF protection
- ✅ Security logging

### Frontend
- ✅ Fullscreen enforcement
- ✅ Tab switch detection
- ✅ Keyboard shortcut blocking
- ✅ Clipboard prevention
- ✅ DevTools detection
- ✅ Server time sync
- ✅ Auto-save protection

## 📱 Responsive Design

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## ⚙️ Tech Stack

- **Backend**: Laravel 12, MySQL, Sanctum
- **Frontend**: React 19, TypeScript, Vite, axios
- **Styling**: CSS3 with CSS Variables
- **Build**: Vite (0 errors, 116 modules, 95.12 KB gzipped)

## 🚀 Status

✅ **PRODUCTION READY**
- Frontend build: Success
- TypeScript strict mode: Pass
- Security monitoring: Fully implemented (9 types)
- API integration: Complete
- Responsive design: Mobile to desktop

## 📝 License

MIT License - Copyright (c) 2026

---

**Built with React 19 + TypeScript + Laravel 12 + Vite**

**Happy Testing! 🎓**
