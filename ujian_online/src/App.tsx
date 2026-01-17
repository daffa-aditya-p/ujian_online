import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, AdminDashboard, GuruDashboard, SiswaDashboard, UjianPage } from './pages';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  if (!user || !token) {
    return <Navigate to="/" replace />;
  }

  const userRole = user.is_admin ? 'admin' : user.is_guru ? 'guru' : 'siswa';
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guru/*"
          element={
            <ProtectedRoute allowedRoles={['guru']}>
              <GuruDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/siswa"
          element={
            <ProtectedRoute allowedRoles={['siswa']}>
              <SiswaDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/siswa/ujian/:id"
          element={
            <ProtectedRoute allowedRoles={['siswa']}>
              <UjianPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
