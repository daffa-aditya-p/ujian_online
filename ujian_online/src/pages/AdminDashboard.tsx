import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi, authApi } from '../api';
import type { User, SecurityLog } from '../types';

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [tab, setTab] = useState<'users' | 'logs'>('users');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState({ nis: '', nama: '', password: '', is_admin: false, is_guru: false });
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    loadData();
  }, [tab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (tab === 'users') {
        const res = await adminApi.getUsers();
        setUsers(res.data || []);
      } else {
        const res = await adminApi.getSecurityLogs();
        setLogs(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await authApi.logout();
    navigate('/');
  };

  const handleSaveUser = async () => {
    try {
      if (editUser) {
        await adminApi.updateUser(editUser.id, form);
      } else {
        await adminApi.createUser(form as User & { password: string });
      }
      setShowModal(false);
      setEditUser(null);
      setForm({ nis: '', nama: '', password: '', is_admin: false, is_guru: false });
      loadData();
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan user');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Yakin hapus user ini?')) return;
    try {
      await adminApi.deleteUser(id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleLock = async (id: number) => {
    try {
      await adminApi.toggleLock(id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (u: User) => {
    setEditUser(u);
    setForm({ nis: u.nis, nama: u.nama, password: '', is_admin: u.is_admin, is_guru: u.is_guru });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-orange-500 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">Halo, {user.nama}</span>
            <button onClick={handleLogout} className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg text-sm">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('users')}
            className={`px-6 py-2 rounded-lg font-medium transition ${tab === 'users' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            Kelola User
          </button>
          <button
            onClick={() => setTab('logs')}
            className={`px-6 py-2 rounded-lg font-medium transition ${tab === 'logs' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
          >
            Security Logs
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {tab === 'users' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Daftar User</h2>
                <button
                  onClick={() => { setEditUser(null); setForm({ nis: '', nama: '', password: '', is_admin: false, is_guru: false }); setShowModal(true); }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  + Tambah User
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">NIS</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Nama</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{u.nis}</td>
                          <td className="py-3 px-4">{u.nama}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${u.is_admin ? 'bg-purple-100 text-purple-700' : u.is_guru ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                              {u.is_admin ? 'Admin' : u.is_guru ? 'Guru' : 'Siswa'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${u.is_locked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                              {u.is_locked ? 'Terkunci' : 'Aktif'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button onClick={() => openEditModal(u)} className="text-blue-500 hover:text-blue-700 mr-3">Edit</button>
                            <button onClick={() => handleToggleLock(u.id)} className="text-yellow-500 hover:text-yellow-700 mr-3">
                              {u.is_locked ? 'Unlock' : 'Lock'}
                            </button>
                            <button onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:text-red-700">Hapus</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {tab === 'logs' && (
            <>
              <h2 className="text-lg font-semibold mb-6">Security Logs</h2>
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Waktu</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Siswa</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Event</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Detail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm">{new Date(log.created_at).toLocaleString('id-ID')}</td>
                          <td className="py-3 px-4">{log.siswa?.nama || '-'}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">
                              {log.event_type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{log.event_data || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{editUser ? 'Edit User' : 'Tambah User'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIS</label>
                <input
                  type="text"
                  value={form.nis}
                  onChange={(e) => setForm({ ...form, nis: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password {editUser && '(kosongkan jika tidak diubah)'}</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.is_admin}
                    onChange={(e) => setForm({ ...form, is_admin: e.target.checked, is_guru: false })}
                    className="rounded"
                  />
                  <span className="text-sm">Admin</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.is_guru}
                    onChange={(e) => setForm({ ...form, is_guru: e.target.checked, is_admin: false })}
                    className="rounded"
                  />
                  <span className="text-sm">Guru</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">
                Batal
              </button>
              <button onClick={handleSaveUser} className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
