<?php

namespace App\Http\Controllers\Api\Siswa;

use App\Http\Controllers\Controller;
use App\Models\HasilUjian;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $siswa = $request->user();

        // Ambil riwayat ujian siswa
        $riwayatUjian = HasilUjian::where('siswa_id', $siswa->id)
            ->with('ujian:id,nama_ujian,jenis_ujian')
            ->orderBy('created_at', 'desc')
            ->get();

        // Statistik
        $totalUjian = $riwayatUjian->count();
        $ujianSelesai = $riwayatUjian->where('status', 'completed')->count();
        $rataRataNilai = $riwayatUjian->where('status', 'completed')->avg('nilai');

        return response()->json([
            'siswa' => [
                'id' => $siswa->id,
                'nis' => $siswa->nis,
                'nama' => $siswa->nama,
            ],
            'statistik' => [
                'total_ujian' => $totalUjian,
                'ujian_selesai' => $ujianSelesai,
                'rata_rata_nilai' => round($rataRataNilai, 2) ?? 0,
            ],
            'riwayat_ujian' => $riwayatUjian
        ]);
    }
}