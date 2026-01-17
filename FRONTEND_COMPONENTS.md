# 🎨 Frontend Component Documentation

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Sidebar.tsx
│   └── DashboardLayout.tsx
├── styles/              # Component-specific CSS
│   ├── Button.css
│   ├── Input.css
│   ├── Sidebar.css
│   └── DashboardLayout.css
├── pages/               # Page components
│   ├── LoginPage.tsx
│   ├── AdminDashboard.tsx
│   ├── GuruDashboard.tsx
│   ├── SiswaDashboard.tsx
│   └── UjianPage.tsx
├── api/                 # API integration
│   ├── client.ts
│   ├── auth.ts
│   ├── admin.ts
│   ├── guru.ts
│   ├── siswa.ts
│   └── index.ts
├── types/              # TypeScript interfaces
│   └── index.ts
├── theme/              # Design system
│   └── index.ts
├── App.tsx             # Root component
├── App.css
├── main.tsx            # Entry point
├── index.css           # Global styles
└── globals.css         # Global utilities
```

## Design System

### Colors

```typescript
const colors = {
  primary: '#FF6B35',      // Orange
  primaryDark: '#E85A2B',  // Dark Orange
  secondary: '#FFA726',    // Light Orange
  background: '#FFFFFF',  // White
  surface: '#F5F5F5',      // Light Gray
  text: '#333333',         // Dark Gray
  textMuted: '#666666',    // Muted Gray
  border: '#E2E8F0',       // Border Gray
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
};
```

### Typography

```typescript
const typography = {
  fontFamily: {
    primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};
```

### Spacing

- Base unit: 8px
- Sizes: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 56px, 64px

### Shadows

```typescript
const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
};
```

### Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Reusable Components

### Button Component

**File**: [src/components/Button.tsx](src/components/Button.tsx)

**Usage**:
```tsx
import Button from '@/components/Button';

<Button>Click me</Button>

// With variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="success">Success</Button>
<Button variant="error">Error</Button>
<Button variant="outline">Outline</Button>

// With sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Loading state
<Button isLoading>Processing...</Button>

// Disabled state
<Button disabled>Disabled</Button>

// With onClick handler
<Button onClick={() => console.log('clicked')}>
  Click me
</Button>
```

**Props**:
```typescript
interface ButtonProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}
```

### Input Component

**File**: [src/components/Input.tsx](src/components/Input.tsx)

**Usage**:
```tsx
import Input from '@/components/Input';

// Basic input
<Input
  label="Username"
  placeholder="Enter username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>

// With error
<Input
  label="Email"
  type="email"
  error="Please enter valid email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// With icon
<Input
  label="Search"
  placeholder="Search..."
  icon={<SearchIcon />}
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

// Password input
<Input
  label="Password"
  type="password"
  placeholder="Enter password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
```

**Props**:
```typescript
interface InputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}
```

### Sidebar Component

**File**: [src/components/Sidebar.tsx](src/components/Sidebar.tsx)

**Usage**:
```tsx
import Sidebar from '@/components/Sidebar';
import { useNavigate } from 'react-router-dom';

const SidebarUsage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const menuItems = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Kelola User', path: '/admin/users' },
    { label: 'Kelola Nilai', path: '/admin/nilai' },
  ];

  return (
    <Sidebar
      user={user}
      menuItems={menuItems}
      onLogout={() => {
        localStorage.removeItem('token');
        navigate('/login');
      }}
    />
  );
};
```

**Props**:
```typescript
interface MenuItem {
  label: string;
  path: string;
}

interface SidebarProps {
  user: any;
  menuItems: MenuItem[];
  onLogout: () => void;
}
```

### DashboardLayout Component

**File**: [src/components/DashboardLayout.tsx](src/components/DashboardLayout.tsx)

**Usage**:
```tsx
import DashboardLayout from '@/components/DashboardLayout';

const MyDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const menuItems = [
    { label: 'Dashboard', path: '/guru' },
    { label: 'Kelola Ujian', path: '/guru/ujians' },
  ];

  return (
    <DashboardLayout
      title="Guru Dashboard"
      user={user}
      menuItems={menuItems}
    >
      <div>Your dashboard content here</div>
    </DashboardLayout>
  );
};
```

**Props**:
```typescript
interface DashboardLayoutProps {
  title: string;
  user: any;
  menuItems: MenuItem[];
  children: React.ReactNode;
}
```

## Pages

### LoginPage

**File**: [src/pages/LoginPage.tsx](src/pages/LoginPage.tsx)

**Features**:
- Form validation
- Error messaging with shake animation
- Loading state
- Role-based redirection (admin/guru/siswa)
- Password visibility toggle

**State Management**:
```typescript
const [nis, setNis] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const [isLoading, setIsLoading] = useState(false);
```

### AdminDashboard

**File**: [src/pages/AdminDashboard.tsx](src/pages/AdminDashboard.tsx)

**Features**:
- Statistics cards (total siswa, guru, ujian)
- User table with pagination
- Create/Edit user modals
- Delete confirmation
- Lock/Unlock user status
- Search functionality

**Key Methods**:
```typescript
// Load users
loadUsers()

// Create new user
handleCreateUser()

// Update user
handleEditUser()

// Delete user
handleDeleteUser()

// Lock/Unlock user
handleToggleLock()

// Handle pagination
handlePageChange()
```

### GuruDashboard

**File**: [src/pages/GuruDashboard.tsx](src/pages/GuruDashboard.tsx)

**Features**:
- Exam card grid
- Create/Edit exam modals
- Delete exam confirmation
- Token display
- Exam statistics (soal count, participant count)
- Time display (start, end, duration)

**Key Methods**:
```typescript
// Load exams
loadUjians()

// Create exam
handleCreateUjian()

// Update exam
handleEditUjian()

// Delete exam
handleDeleteUjian()

// Copy token to clipboard
handleCopyToken()
```

### SiswaDashboard

**File**: [src/pages/SiswaDashboard.tsx](src/pages/SiswaDashboard.tsx)

**Features**:
- Profile section
- Statistics cards (ujian selesai, rata-rata nilai, total ujian)
- Exam history table
- Status badges
- Token input modal for starting exam
- Password change modal
- Real-time dashboard

**Key Methods**:
```typescript
// Load dashboard data
loadDashboard()

// Load exam history
loadHasilUjians()

// Start new exam
handleStartExam()

// Change password
handleChangePassword()
```

### UjianPage

**File**: [src/pages/UjianPage.tsx](src/pages/UjianPage.tsx)

**Features**:
- ✅ **9-Point Security Monitoring**:
  1. Fullscreen enforcement (exit re-request)
  2. Tab switch detection
  3. Blur/focus detection
  4. Fullscreen exit detection
  5. DevTools detection (F12, Ctrl+Shift+I/C/J)
  6. Keyboard shortcut blocking
  7. Clipboard prevention (copy/paste)
  8. Window minimize detection
  9. Page refresh detection
  10. Server time drift detection (5s threshold)

- **Exam Features**:
  - Real-time countdown timer (color warning < 5min)
  - Auto-save every 3 seconds
  - Question navigation sidebar
  - Multiple choice + complex multiple choice support
  - Violation logging
  - Auto-lock after 5 violations
  - Responsive layout

**Security Implementation**:
```typescript
// Fullscreen enforcement
document.documentElement.requestFullscreen()
document.addEventListener('fullscreenchange', handleFullscreenChange)

// Tab switch detection
document.addEventListener('visibilitychange', handleVisibilityChange)

// Blur/focus detection
window.addEventListener('blur', handleBlur)
window.addEventListener('focus', handleFocus)

// DevTools detection
setInterval(() => { debugger; }, 100)

// Keyboard blocking
document.addEventListener('keydown', handleKeyDown)

// Clipboard prevention
document.addEventListener('copy', handleCopy)
document.addEventListener('paste', handlePaste)

// Time drift detection
setInterval(checkServerTime, 5000)

// Auto-save
setTimeout(() => submitJawaban(), 3000)
```

## Type Definitions

**File**: [src/types/index.ts](src/types/index.ts)

```typescript
// User type
interface User {
  id: number;
  nis: string;
  nama: string;
  email: string;
  role: 'admin' | 'guru' | 'siswa';
  status_keamanan: 'aktif' | 'terkunci';
  created_at: string;
}

// Ujian type
interface Ujian {
  id: number;
  guru_id: number;
  nama: string;
  jenis: string;
  waktu_mulai: string;
  waktu_selesai: string;
  durasi_menit: number;
  token: string;
  deskripsi?: string;
  soal_count?: number;
  hasil_ujians_count?: number;
  created_at: string;
}

// Soal type
interface Soal {
  id: number;
  ujian_id: number;
  nomor: number;
  pertanyaan: string;
  tipe: 'pilihan_ganda' | 'pilihan_ganda_kompleks' | 'essay';
  pilihan_a?: string;
  pilihan_b?: string;
  pilihan_c?: string;
  pilihan_d?: string;
  pilihan_e?: string;
  jawaban_benar: string;
  poin: number;
  created_at: string;
}

// JawabanSiswa type
interface JawabanSiswa {
  id: number;
  hasil_ujian_id: number;
  soal_id: number;
  jawaban_siswa: string;
  poin_diperoleh: number;
  created_at: string;
  soal?: Soal;
}

// HasilUjian type
interface HasilUjian {
  id: number;
  siswa_id: number;
  ujian_id: number;
  nilai: number;
  status: 'sedang_dikerjakan' | 'selesai' | 'terkunci';
  violation_count: number;
  waktu_mulai: string;
  waktu_selesai?: string;
  created_at: string;
  siswa?: User;
  ujian?: Ujian;
  jawabanSiswas?: JawabanSiswa[];
  securityLogs?: SecurityLog[];
}

// SecurityLog type
interface SecurityLog {
  id: number;
  hasil_ujian_id: number;
  jenis_pelanggaran: string;
  deskripsi: string;
  waktu: string;
  created_at: string;
}

// API Response type
interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

// Paginated Response type
interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}
```

## API Services

### Authentication Service

**File**: [src/api/auth.ts](src/api/auth.ts)

```typescript
// Login
login(nis: string, password: string): Promise<ApiResponse<any>>

// Logout
logout(): Promise<ApiResponse<any>>

// Get current user
getCurrentUser(): User | null

// Change password
changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<any>>

// Persist token
setToken(token: string): void

// Get token
getToken(): string | null

// Clear token
clearToken(): void
```

### Admin Service

**File**: [src/api/admin.ts](src/api/admin.ts)

```typescript
// Users
getUsers(page?: number, perPage?: number): Promise<ApiResponse<PaginatedResponse<User>>>
createUser(data: any): Promise<ApiResponse<User>>
updateUser(id: number, data: any): Promise<ApiResponse<User>>
deleteUser(id: number): Promise<ApiResponse<any>>
toggleUserStatus(id: number, status: string): Promise<ApiResponse<any>>

// Nilai
getNilai(page?: number, perPage?: number): Promise<ApiResponse<PaginatedResponse<HasilUjian>>>
getDetailSiswa(id: number): Promise<ApiResponse<HasilUjian>>
unlockNilai(id: number): Promise<ApiResponse<any>>
```

### Guru Service

**File**: [src/api/guru.ts](src/api/guru.ts)

```typescript
// Ujians
getUjians(): Promise<ApiResponse<Ujian[]>>
createUjian(data: any): Promise<ApiResponse<Ujian>>
updateUjian(id: number, data: any): Promise<ApiResponse<Ujian>>
deleteUjian(id: number): Promise<ApiResponse<any>>
getUjianDetail(id: number): Promise<ApiResponse<Ujian>>

// Soals
createSoal(ujianId: number, data: any): Promise<ApiResponse<Soal>>
updateSoal(id: number, data: any): Promise<ApiResponse<Soal>>
deleteSoal(id: number): Promise<ApiResponse<any>>
```

### Siswa Service

**File**: [src/api/siswa.ts](src/api/siswa.ts)

```typescript
// Dashboard
getDashboard(): Promise<ApiResponse<any>>
getHasilUjians(): Promise<ApiResponse<HasilUjian[]>>

// Exam
verifyToken(token: string): Promise<ApiResponse<any>>
getSoals(hasilUjianId: number): Promise<ApiResponse<Soal[]>>
submitJawaban(hasilUjianId: number, soalId: number, jawaban: string): Promise<ApiResponse<any>>
finishExam(hasilUjianId: number): Promise<ApiResponse<any>>

// Security
getServerTime(): Promise<ApiResponse<any>>
logSecurityEvent(hasilUjianId: number, jenisPerlanggaran: string, deskripsi: string): Promise<ApiResponse<any>>
```

## Development Workflow

### 1. Creating a New Page

```tsx
// src/pages/MyPage.tsx
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Button from '@/components/Button';
import '@/styles/MyPage.css';

export default function MyPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // API call here
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout title="My Page">
      <div className="page-content">
        {/* Your content here */}
      </div>
    </DashboardLayout>
  );
}
```

### 2. Creating a New Component

```tsx
// src/components/MyComponent.tsx
import '@/styles/MyComponent.css';

interface MyComponentProps {
  title: string;
  children?: React.ReactNode;
}

export default function MyComponent({ title, children }: MyComponentProps) {
  return (
    <div className="my-component">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
```

### 3. Creating Component Styles

```css
/* src/styles/MyComponent.css */
.my-component {
  padding: 16px;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.my-component h2 {
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}
```

### 4. Using TypeScript Strict Mode

```tsx
// ✅ Correct: type-only import
import type { User } from '@/types';

// ✅ Correct: destructured import with proper types
import { apiClient } from '@/api/client';

// ❌ Incorrect: mixing type and value imports
import { User } from '@/types'; // This causes issues

// ✅ Solution: use separate imports
import type { User } from '@/types';
import { useUser } from '@/api/user';
```

## Testing

### Unit Testing

```bash
npm run test:unit
```

### Integration Testing

```bash
npm run test:integration
```

### E2E Testing

```bash
npm run test:e2e
```

## Performance Tips

1. **Code Splitting**: Use React.lazy() for page components
2. **Memoization**: Use React.memo() for expensive components
3. **Image Optimization**: Use WebP format where possible
4. **Bundle Analysis**: Use `npm run analyze`
5. **Caching**: Leverage browser caching with proper headers

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

---

**Component Development Guide Ready! 🚀**
