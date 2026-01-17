import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { siswaApi } from '../api';
import { useSecurityMonitor } from '../hooks/useSecurityMonitor';
import { useTimer } from '../hooks/useTimer';
import type { Ujian, Soal, JawabanSiswa } from '../types';

export default function UjianPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ujianId = parseInt(id || '0');

  const [ujian, setUjian] = useState<Ujian | null>(null);
  const [soalList, setSoalList] = useState<Soal[]>([]);
  const [jawaban, setJawaban] = useState<Record<number, string[]>>({});
  const [currentSoal, setCurrentSoal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [violations, setViolations] = useState<Array<{ type: string; message: string }>>([]);
  const [started, setStarted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const loadUjian = async () => {
      try {
        const data = await siswaApi.getUjian(ujianId);
        setUjian(data.ujian);
        setSoalList(data.soal || []);
        const existing: Record<number, string[]> = {};
        (data.jawaban || []).forEach((j: JawabanSiswa) => { existing[j.soal_id] = j.jawaban; });
        setJawaban(existing);
      } catch (err) { console.error(err); alert('Gagal memuat ujian'); navigate('/siswa'); }
      finally { setLoading(false); }
    };
    if (ujianId) loadUjian();
  }, [ujianId, navigate]);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await siswaApi.submitUjian(ujianId);
      if (document.fullscreenElement) await document.exitFullscreen();
      alert('Ujian berhasil dikumpulkan!');
      navigate('/siswa');
    } catch (err) { console.error(err); alert('Gagal mengumpulkan ujian'); }
    finally { setSubmitting(false); }
  }, [ujianId, navigate, submitting]);

  const handleViolation = useCallback((type: string, message: string) => {
    setViolations((prev) => [...prev, { type, message }]);
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 3000);
  }, []);

  const { enterFullscreen } = useSecurityMonitor({
    ujianId,
    onViolation: handleViolation,
    onForceSubmit: handleSubmit,
    maxViolations: 3,
  });

  const { formatWaktu, isWarning, isDanger } = useTimer({
    durasiMenit: ujian?.durasi_menit || 60,
    onTimeUp: handleSubmit,
  });

  const handleStart = async () => {
    await enterFullscreen();
    setStarted(true);
    document.body.classList.add('exam-mode');
  };

  const handleJawab = async (soalId: number, jawab: string) => {
    const newJawaban = jawaban[soalId]?.includes(jawab)
      ? jawaban[soalId].filter(j => j !== jawab)
      : [...(jawaban[soalId] || []), jawab];
    
    // For pilihan_ganda, only allow single answer
    const soal = soalList.find(s => s.id === soalId);
    const finalJawaban = soal?.jenis_soal === 'pilihan_ganda' ? [jawab] : newJawaban;
    
    setJawaban((prev) => ({ ...prev, [soalId]: finalJawaban }));
    try { await siswaApi.submitJawaban(ujianId, soalId, finalJawaban.join(',')); }
    catch (err) { console.error(err); }
  };

  useEffect(() => { return () => { document.body.classList.remove('exam-mode'); }; }, []);

  if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>;

  if (!started) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{ujian?.nama_ujian}</h1>
          <p className="text-gray-500 mb-6">{ujian?.jenis_ujian}</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="flex justify-between mb-2"><span className="text-gray-600">Durasi:</span><span className="font-medium">{ujian?.durasi_menit} menit</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Jumlah Soal:</span><span className="font-medium">{soalList.length} soal</span></div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-red-700 mb-2">⚠️ PERINGATAN KEAMANAN</h3>
            <ul className="text-sm text-red-600 space-y-1">
              <li>• Mode fullscreen WAJIB</li>
              <li>• Jangan pindah tab/window</li>
              <li>• Copy/paste diblokir</li>
              <li>• <strong>3 pelanggaran = AUTO SUBMIT!</strong></li>
            </ul>
          </div>
          <button onClick={handleStart} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg">Mulai Ujian</button>
        </div>
      </div>
    );
  }

  const soalSekarang = soalList[currentSoal];

  return (
    <div className="min-h-screen bg-gray-100 select-none">
      {showWarning && <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">⚠️ Pelanggaran! ({violations.length}/3)</div>}

      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div><h1 className="font-semibold text-gray-800">{ujian?.nama_ujian}</h1><p className="text-sm text-gray-500">{ujian?.jenis_ujian}</p></div>
          <div className="flex items-center gap-6">
            <div className={`px-3 py-1 rounded-lg text-sm font-medium ${violations.length > 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>Pelanggaran: {violations.length}/3</div>
            <div className={`px-4 py-2 rounded-lg font-mono font-bold ${isDanger ? 'bg-red-500 text-white animate-pulse' : isWarning ? 'bg-yellow-500 text-white' : 'bg-orange-500 text-white'}`}>⏱ {formatWaktu}</div>
            <button onClick={() => confirm('Yakin kumpulkan?') && handleSubmit()} disabled={submitting} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50">{submitting ? 'Mengirim...' : 'Kumpulkan'}</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-4 sticky top-20">
            <h3 className="font-semibold mb-4">Navigasi</h3>
            <div className="grid grid-cols-5 gap-2">
              {soalList.map((s, idx) => (
                <button key={s.id} onClick={() => setCurrentSoal(idx)}
                  className={`w-10 h-10 rounded-lg font-medium text-sm ${currentSoal === idx ? 'bg-orange-500 text-white' : jawaban[s.id]?.length ? 'bg-green-100 text-green-700 border-2 border-green-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{idx + 1}</button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t text-sm"><p className="text-gray-600">Terjawab: <span className="font-semibold">{Object.values(jawaban).filter(j => j?.length).length}</span> / {soalList.length}</p></div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm p-6">
            {soalSekarang && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm text-gray-500">Soal {currentSoal + 1} dari {soalList.length}</span>
                  <span className="text-sm text-gray-500">Poin: {soalSekarang.poin}</span>
                </div>
                <div className="mb-8"><p className="text-lg text-gray-800 leading-relaxed">{soalSekarang.pertanyaan}</p></div>
                <div className="space-y-3">
                  {Object.entries(soalSekarang.pilihan || {}).map(([key, text]) => {
                    if (!text) return null;
                    const isSelected = jawaban[soalSekarang.id]?.includes(key);
                    return (
                      <button key={key} onClick={() => handleJawab(soalSekarang.id, key)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition ${isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 font-medium ${isSelected ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}>{key}</span>
                        <span className="text-gray-800">{text}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <button onClick={() => setCurrentSoal((p) => Math.max(0, p - 1))} disabled={currentSoal === 0} className="px-6 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50">← Sebelumnya</button>
                  <button onClick={() => setCurrentSoal((p) => Math.min(soalList.length - 1, p + 1))} disabled={currentSoal === soalList.length - 1} className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50">Selanjutnya →</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
