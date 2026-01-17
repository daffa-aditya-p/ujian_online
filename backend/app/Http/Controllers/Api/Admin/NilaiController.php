<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\HasilUjian;
use App\Models\Ujian;
use App\Models\SecurityLog;
use Illuminate\Http\Request;

class NilaiController extends Controller
{
    // Daftar semua ujian untuk kelola nilai
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 15);
        $ujians = Ujian::with('guru:id,nama')
            ->withCount('hasilUjians')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json($ujians);
    }

    // Detail nilai per ujian
    public function show(Request $request, $ujianId)
    {
        $perPage = $request->query('per_page', 15);
        $ujian = Ujian::with('guru:id,nama')->findOrFail($ujianId);

        $hasilUjians = HasilUjian::where('ujian_id', $ujianId)
            ->with('siswa:id,nis,nama')
            ->orderBy('nilai', 'desc')
            ->paginate($perPage);

        return response()->json([
            'ujian' => $ujian,
            'hasil' => $hasilUjians
        ]);
    }

    // Detail nilai siswa dengan log keamanan
    public function detailSiswa($hasilUjianId)
    {
        $hasilUjian = HasilUjian::with([
            'siswa:id,nis,nama',
            'ujian:id,nama_ujian',
            'jawabanSiswas.soal:id,pertanyaan,jawaban_benar,poin'
        ])->findOrFail($hasilUjianId);

        $securityLogs = SecurityLog::where('ujian_id', $hasilUjian->ujian_id)
            ->where('siswa_id', $hasilUjian->siswa_id)
            ->orderBy('event_time', 'desc')
            ->get();

        return response()->json([
            'hasil' => $hasilUjian,
            'jawaban' => $hasilUjian->jawabanSiswas,
            'security_logs' => $securityLogs
        ]);
    }
}