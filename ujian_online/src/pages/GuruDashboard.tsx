import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { guruApi, authApi } from '../api';
import type { Ujian, Soal } from '../types';

export default function GuruDashboard() {
  const [ujianList, setUjianList] = useState<Ujian[]>([]);
  const [soalList, setSoalList] = useState<Soal[]>([]);
  const [selectedUjian, setSelectedUjian] = useState<Ujian | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUjianModal, setShowUjianModal] = useState(false);
  const [showSoalModal, setShowSoalModal] = useState(false);
  const [editUjian, setEditUjian] = useState<Ujian | null>(null);
  const [editSoal, setEditSoal] = useState<Soal | null>(null);
  const [ujianForm, setUjianForm] = useState({ nama_ujian: '', jenis_ujian: 'UTS', durasi_menit: 60, waktu_mulai: '', waktu_selesai: '', is_active: true });
  const [soalForm, setSoalForm] = useState({ pertanyaan: '', pilihan: { A: '', B: '', C: '', D: '', E: '' }, jawaban_benar: 'A', poin: 1 });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => { loadUjian(); }, []);

  const loadUjian = async () => {
    setLoading(true);
    try { const data = await guruApi.getUjian(); setUjianList(Array.isArray(data) ? data : []); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const loadSoal = async (ujian: Ujian) => {
    setSelectedUjian(ujian);
    try { const data = await guruApi.getSoal(ujian.id); setSoalList(Array.isArray(data) ? data : []); }
    catch (err) { console.error(err); }
  };

  const handleLogout = async () => { await authApi.logout(); navigate('/'); };

  const handleSaveUjian = async () => {
    try {
      if (editUjian) await guruApi.updateUjian(editUjian.id, ujianForm);
      else await guruApi.createUjian(ujianForm);
      setShowUjianModal(false); setEditUjian(null); loadUjian();
    } catch (err) { console.error(err); alert('Gagal menyimpan ujian'); }
  };

  const handleDeleteUjian = async (id: number) => {
    if (!confirm('Yakin hapus?')) return;
    try { await guruApi.deleteUjian(id); if (selectedUjian?.id === id) { setSelectedUjian(null); setSoalList([]); } loadUjian(); }
    catch (err) { console.error(err); }
  };

  const handleSaveSoal = async () => {
    if (!selectedUjian) return;
    try {
      const data = { ...soalForm, pilihan: soalForm.pilihan, jawaban_benar: [soalForm.jawaban_benar], nomor_soal: soalList.length + 1, jenis_soal: 'pilihan_ganda' as const };
      if (editSoal) await guruApi.updateSoal(selectedUjian.id, editSoal.id, data);
      else await guruApi.createSoal(selectedUjian.id, data);
      setShowSoalModal(false); setEditSoal(null); loadSoal(selectedUjian);
    } catch (err) { console.error(err); alert('Gagal menyimpan soal'); }
  };

  const handleDeleteSoal = async (id: number) => {
    if (!selectedUjian || !confirm('Yakin hapus?')) return;
    try { await guruApi.deleteSoal(selectedUjian.id, id); loadSoal(selectedUjian); }
    catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-orange-500 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Guru Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">Halo, {user.nama}</span>
            <button onClick={handleLogout} className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg text-sm">Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Daftar Ujian</h2>
            <button onClick={() => { setEditUjian(null); setUjianForm({ nama_ujian: '', jenis_ujian: 'UTS', durasi_menit: 60, waktu_mulai: '', waktu_selesai: '', is_active: true }); setShowUjianModal(true); }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm">+ Tambah</button>
          </div>
          {loading ? <p className="text-center py-8 text-gray-500">Loading...</p> : ujianList.length === 0 ? <p className="text-center py-8 text-gray-500">Belum ada ujian</p> : (
            <div className="space-y-3">{ujianList.map((u) => (
              <div key={u.id} className={`p-4 border rounded-lg cursor-pointer ${selectedUjian?.id === u.id ? 'border-orange-500 bg-orange-50' : 'hover:bg-gray-50'}`} onClick={() => loadSoal(u)}>
                <div className="flex justify-between">
                  <div><h3 className="font-medium">{u.nama_ujian}</h3><p className="text-sm text-gray-500">{u.jenis_ujian} • {u.durasi_menit} menit</p></div>
                  <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); setEditUjian(u); setUjianForm({ nama_ujian: u.nama_ujian, jenis_ujian: u.jenis_ujian, durasi_menit: u.durasi_menit, waktu_mulai: u.waktu_mulai.slice(0,16), waktu_selesai: u.waktu_selesai.slice(0,16), is_active: u.is_active }); setShowUjianModal(true); }} className="text-blue-500 text-sm">Edit</button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteUjian(u.id); }} className="text-red-500 text-sm">Hapus</button>
                  </div>
                </div>
              </div>
            ))}</div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">{selectedUjian ? `Soal: ${selectedUjian.nama_ujian}` : 'Pilih ujian'}</h2>
            {selectedUjian && <button onClick={() => { setEditSoal(null); setSoalForm({ pertanyaan: '', pilihan: { A: '', B: '', C: '', D: '', E: '' }, jawaban_benar: 'A', poin: 1 }); setShowSoalModal(true); }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm">+ Tambah</button>}
          </div>
          {!selectedUjian ? <p className="text-center py-8 text-gray-500">Pilih ujian</p> : soalList.length === 0 ? <p className="text-center py-8 text-gray-500">Belum ada soal</p> : (
            <div className="space-y-3 max-h-96 overflow-y-auto">{soalList.map((s, i) => (
              <div key={s.id} className="p-4 border rounded-lg">
                <div className="flex justify-between">
                  <div><p className="font-medium text-sm">Soal {i + 1}</p><p className="text-gray-700">{s.pertanyaan}</p><p className="text-xs text-gray-500 mt-1">Kunci: {s.jawaban_benar?.join(', ')} • Poin: {s.poin}</p></div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditSoal(s); setSoalForm({ pertanyaan: s.pertanyaan, pilihan: s.pilihan as typeof soalForm.pilihan, jawaban_benar: s.jawaban_benar?.[0] || 'A', poin: s.poin }); setShowSoalModal(true); }} className="text-blue-500 text-sm">Edit</button>
                    <button onClick={() => handleDeleteSoal(s.id)} className="text-red-500 text-sm">Hapus</button>
                  </div>
                </div>
              </div>
            ))}</div>
          )}
        </div>
      </div>

      {showUjianModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">{editUjian ? 'Edit' : 'Tambah'} Ujian</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Nama Ujian" value={ujianForm.nama_ujian} onChange={(e) => setUjianForm({ ...ujianForm, nama_ujian: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              <select value={ujianForm.jenis_ujian} onChange={(e) => setUjianForm({ ...ujianForm, jenis_ujian: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                <option>UTS</option><option>UAS</option><option>Quiz</option>
              </select>
              <input type="number" placeholder="Durasi (menit)" value={ujianForm.durasi_menit} onChange={(e) => setUjianForm({ ...ujianForm, durasi_menit: +e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              <input type="datetime-local" value={ujianForm.waktu_mulai} onChange={(e) => setUjianForm({ ...ujianForm, waktu_mulai: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              <input type="datetime-local" value={ujianForm.waktu_selesai} onChange={(e) => setUjianForm({ ...ujianForm, waktu_selesai: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowUjianModal(false)} className="flex-1 px-4 py-2 border rounded-lg">Batal</button>
              <button onClick={handleSaveUjian} className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {showSoalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">{editSoal ? 'Edit' : 'Tambah'} Soal</h3>
            <div className="space-y-4">
              <textarea placeholder="Pertanyaan" value={soalForm.pertanyaan} onChange={(e) => setSoalForm({ ...soalForm, pertanyaan: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded-lg" />
              {['A','B','C','D','E'].map(o => <input key={o} type="text" placeholder={`Opsi ${o}`} value={soalForm.pilihan[o as keyof typeof soalForm.pilihan]} onChange={(e) => setSoalForm({ ...soalForm, pilihan: { ...soalForm.pilihan, [o]: e.target.value } })} className="w-full px-3 py-2 border rounded-lg" />)}
              <div className="grid grid-cols-2 gap-4">
                <select value={soalForm.jawaban_benar} onChange={(e) => setSoalForm({ ...soalForm, jawaban_benar: e.target.value })} className="px-3 py-2 border rounded-lg">
                  {['A','B','C','D','E'].map(o => <option key={o}>{o}</option>)}
                </select>
                <input type="number" placeholder="Poin" value={soalForm.poin} onChange={(e) => setSoalForm({ ...soalForm, poin: +e.target.value })} className="px-3 py-2 border rounded-lg" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowSoalModal(false)} className="flex-1 px-4 py-2 border rounded-lg">Batal</button>
              <button onClick={handleSaveSoal} className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
