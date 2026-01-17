<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\HasilUjian;
use App\Models\Ujian;
use Illuminate\Http\Request;

class NilaiController extends Controller
{
    // Daftar semua ujian untuk kelola nilai
    public function index()
    {
        $ujians = Ujian::with('guru:id,nama')
            ->withCount('hasilUjians')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($ujians);
    }

    // Detail nilai per ujian
    public function show($ujianId)
    {
        $ujian = Ujian::with('guru:id,nama')->findOrFail($ujianId);

        $hasilUjians = HasilUjian::where('ujian_id', $ujianId)
            ->with('siswa:id,nis,nama')
            ->orderBy('nilai', 'desc')
            ->get();

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
            'ujian:id,nama_ujian'
        ])->findOrFail($hasilUjianId);

        $securityLogs = $hasilUjian->siswa
            ->securityLogs()
            ->where('ujian_id', $hasilUjian->ujian_id)
            ->orderBy('event_time', 'desc')
            ->get();

        return response()->json([
            'hasil' => $hasilUjian,
            'security_logs' => $securityLogs
        ]);
    }
}