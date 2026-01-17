import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { siswaApi, authApi } from '../api';
import type { Ujian, HasilUjian } from '../types';

export default function SiswaDashboard() {
  const [ujianAktif, setUjianAktif] = useState<Ujian[]>([]);
  const [riwayat, setRiwayat] = useState<HasilUjian[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const data = await siswaApi.getDashboard();
      setUjianAktif(data.ujian_aktif || []);
      setRiwayat(data.riwayat || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleLogout = async () => { await authApi.logout(); navigate('/'); };

  const handleStartUjian = (ujianId: number) => {
    if (confirm('Setelah mulai, mode fullscreen WAJIB dan aktivitas dipantau. 3 pelanggaran = auto submit. Lanjut?')) {
      navigate(`/siswa/ujian/${ujianId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-orange-500 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Siswa Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">Halo, {user.nama}</span>
            <button onClick={handleLogout} className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg text-sm">Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? <p className="text-center py-8 text-gray-500">Loading...</p> : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-6">Ujian Tersedia</h2>
              {ujianAktif.length === 0 ? <p className="text-center py-8 text-gray-500">Tidak ada ujian aktif</p> : (
                <div className="space-y-4">{ujianAktif.map((u) => (
                  <div key={u.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">{u.nama_ujian}</h3>
                        <p className="text-sm text-gray-500 mt-1">{u.jenis_ujian}</p>
                        <div className="flex gap-4 mt-2 text-xs text-gray-500">
                          <span>⏱ {u.durasi_menit} menit</span>
                          <span>📅 {new Date(u.waktu_mulai).toLocaleDateString('id-ID')}</span>
                        </div>
                      </div>
                      <button onClick={() => handleStartUjian(u.id)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Mulai</button>
                    </div>
                  </div>
                ))}</div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-6">Riwayat Ujian</h2>
              {riwayat.length === 0 ? <p className="text-center py-8 text-gray-500">Belum ada riwayat</p> : (
                <div className="space-y-4">{riwayat.map((h) => (
                  <div key={h.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">{h.ujian?.nama_ujian || 'Ujian'}</h3>
                        <p className="text-sm text-gray-500 mt-1">{h.ujian?.jenis_ujian}</p>
                        <p className="text-xs text-gray-400 mt-2">{h.waktu_selesai ? new Date(h.waktu_selesai).toLocaleString('id-ID') : '-'}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${h.nilai >= 75 ? 'text-green-600' : h.nilai >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>{h.nilai}</div>
                        <p className="text-xs text-gray-500">Nilai</p>
                      </div>
                    </div>
                  </div>
                ))}</div>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Peraturan Keamanan Ujian</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Mode fullscreen WAJIB selama ujian</li>
            <li>• Keluar fullscreen = pelanggaran</li>
            <li>• Pindah tab/window = pelanggaran</li>
            <li>• Copy/paste/klik kanan diblokir</li>
            <li>• DevTools terdeteksi = pelanggaran</li>
            <li>• <strong>3 pelanggaran = ujian otomatis dikumpulkan!</strong></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
