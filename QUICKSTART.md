# ⚡ Quick Start Guide (5 Minutes)

## 🚀 Get Running in 5 Minutes

### Terminal 1: Backend Setup

```bash
cd /workspaces/ujian_online/backend

# 1. Install PHP dependencies
composer install

# 2. Setup environment
cp .env.example .env

# 3. Generate app key
php artisan key:generate

# 4. Configure database (edit .env)
# DB_DATABASE=ujian_online
# DB_USERNAME=root
# DB_PASSWORD=your_password

# 5. Setup database
php artisan migrate
php artisan db:seed

# 6. Start server
php artisan serve
# → Backend runs at http://localhost:8000
```

### Terminal 2: Frontend Setup

```bash
cd /workspaces/ujian_online/ujian_online

# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
# → Frontend runs at http://localhost:5173
```

### Terminal 3: Access Application

```bash
# Open browser and go to:
http://localhost:5173

# Login with:
# NIS: admin001
# Password: password
```

---

## 🔐 What to Try First

### As Admin
1. Login with `admin001` / `password`
2. Go to "Kelola User" → add a new siswa
3. Go to "Kelola Nilai" → view exam results

### As Guru
1. Login with `guru001` / `password`
2. Click "Buat Ujian Baru"
3. Fill form and save (token auto-generates)
4. Add questions to exam

### As Siswa
1. Login with `siswa001` / `password`
2. Click "Mulai Ujian Baru"
3. Enter token from guru
4. Answer questions (auto-saves every 3 sec)
5. Submit exam

---

## 📚 Documentation

| What? | Where? | Read Time |
|-------|--------|-----------|
| Full overview | [README.md](README.md) | 5 min |
| Setup & deploy | [SETUP.md](SETUP.md) | 10 min |
| API reference | [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | 15 min |
| Components | [FRONTEND_COMPONENTS.md](FRONTEND_COMPONENTS.md) | 15 min |
| Testing | [TESTING_GUIDE.md](TESTING_GUIDE.md) | 20 min |
| Summary | [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | 10 min |

---

## ❌ Having Issues?

### Backend won't start
```bash
# Check if port 8000 is free
lsof -i :8000

# Check database connection in .env
php artisan tinker

# Run migrations
php artisan migrate
```

### Frontend won't load
```bash
# Port 5173 might be taken
# Try: npm run dev -- --port 3000

# Clear node_modules
rm -rf node_modules
npm install
npm run dev
```

### Can't login
```bash
# Check if database seeded
php artisan db:seed

# Check users in database
php artisan tinker
>>> User::all()
```

---

## ✨ Key Features to Explore

- ✅ **Real-time timer** on exam page
- ✅ **Auto-save** every 3 seconds (try taking exam)
- ✅ **Fullscreen** enforcement (exam requires fullscreen)
- ✅ **Security monitoring** (9 detection types)
- ✅ **Responsive design** (try resizing window)
- ✅ **Pagination** (create multiple exams/users)
- ✅ **Token system** (copy/paste token between roles)

---

## 🚀 Production Build

When ready for production:

```bash
# Build frontend
cd ujian_online
npm run build

# Output goes to dist/
# Can be served by nginx/apache

# Backend production checklist
cd backend
# Set APP_DEBUG=false in .env
# Set APP_ENV=production
php artisan optimize
```

---

## 📞 Need Help?

1. **Read docs first** - Start with [README.md](README.md)
2. **Check [SETUP.md](SETUP.md)** - Has troubleshooting section
3. **Review [TESTING_GUIDE.md](TESTING_GUIDE.md)** - Has common issues
4. **Check browser console** - Look for JavaScript errors
5. **Check Laravel logs** - `backend/storage/logs/laravel.log`

---

## 🎓 Next Steps

1. ✅ Get system running (you just did!)
2. ✅ Try all features
3. ✅ Read [TESTING_GUIDE.md](TESTING_GUIDE.md)
4. ✅ Follow [SETUP.md](SETUP.md) for production
5. ✅ Deploy to your server

---

**You're all set! Start exploring! 🚀**
