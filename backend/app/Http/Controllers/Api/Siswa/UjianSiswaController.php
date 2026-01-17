<?php

namespace App\Http\Controllers\Api\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Ujian;
use App\Models\HasilUjian;
use App\Models\JawabanSiswa;
use App\Models\Soal;
use Illuminate\Http\Request;
use Carbon\Carbon;

class UjianSiswaController extends Controller
{
    // Akses ujian dengan token
    public function accessWithToken(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        $ujian = Ujian::where('token', strtoupper($request->token))
            ->where('is_active', true)
            ->first();

        if (!$ujian) {
            return response()->json([
                'message' => 'Token ujian tidak valid atau ujian sudah tidak aktif'
            ], 404);
        }

        // Cek apakah ujian sudah dimulai
        if (Carbon::now()->lt($ujian->waktu_mulai)) {
            return response()->json([
                'message' => 'Ujian belum dimulai',
                'waktu_mulai' => $ujian->waktu_mulai
            ], 403);
        }

        // Cek apakah ujian sudah selesai
        if (Carbon::now()->gt($ujian->waktu_selesai)) {
            return response()->json([
                'message' => 'Ujian sudah berakhir'
            ], 403);
        }

        // Cek apakah siswa sudah pernah mengerjakan
        $hasilUjian = HasilUjian::where('siswa_id', $request->user()->id)
            ->where('ujian_id', $ujian->id)
            ->first();

        if ($hasilUjian && $hasilUjian->status === 'completed') {
            return response()->json([
                'message' => 'Anda sudah menyelesaikan ujian ini',
                'hasil' => $hasilUjian
            ], 403);
        }

        if ($hasilUjian && $hasilUjian->status === 'locked') {
            return response()->json([
                'message' => 'Ujian Anda terkunci. Hubungi admin untuk membuka.'
            ], 403);
        }

        return response()->json([
            'message' => 'Token valid',
            'ujian' => [
                'id' => $ujian->id,
                'nama_ujian' => $ujian->nama_ujian,
                'jenis_ujian' => $ujian->jenis_ujian,
                'durasi_menit' => $ujian->durasi_menit,
                'waktu_selesai' => $ujian->waktu_selesai,
            ]
        ]);
    }

    // Mulai ujian
    public function startUjian(Request $request, $ujianId)
    {
        $ujian = Ujian::with('soals')->findOrFail($ujianId);
        $siswa = $request->user();

        // Cek apakah sudah ada hasil ujian
        $hasilUjian = HasilUjian::where('siswa_id', $siswa->id)
            ->where('ujian_id', $ujianId)
            ->first();

        if ($hasilUjian && $hasilUjian->status === 'completed') {
            return response()->json([
                'message' => 'Anda sudah menyelesaikan ujian ini'
            ], 403);
        }

        if ($hasilUjian && $hasilUjian->status === 'locked') {
            return response()->json([
                'message' => 'Ujian Anda terkunci. Hubungi admin untuk membuka.'
            ], 403);
        }

        // Buat atau update hasil ujian
        if (!$hasilUjian) {
            $hasilUjian = HasilUjian::create([
                'siswa_id' => $siswa->id,
                'ujian_id' => $ujianId,
                'waktu_mulai' => Carbon::now(),
                'total_soal' => $ujian->soals->count(),
                'status' => 'ongoing',
            ]);
        }

        // Ambil soal tanpa jawaban benar
        $soals = $ujian->soals->map(function ($soal) {
            return [
                'id' => $soal->id,
                'nomor_soal' => $soal->nomor_soal,
                'jenis_soal' => $soal->jenis_soal,
                'pertanyaan' => $soal->pertanyaan,
                'pilihan' => $soal->pilihan,
                'poin' => $soal->poin,
            ];
        });

        return response()->json([
            'message' => 'Ujian dimulai',
            'ujian' => [
                'id' => $ujian->id,
                'nama_ujian' => $ujian->nama_ujian,
                'durasi_menit' => $ujian->durasi_menit,
                'waktu_mulai' => $hasilUjian->waktu_mulai,
                'waktu_selesai' => $ujian->waktu_selesai,
            ],
            'soals' => $soals,
            'server_time' => Carbon::now()->toIso8601String(),
        ]);
    }

    // Simpan jawaban
    public function submitJawaban(Request $request, $ujianId)
    {
        $request->validate([
            'soal_id' => 'required|exists:soals,id',
            'jawaban' => 'required|array',
        ]);

        $siswa = $request->user();
        $soal = Soal::findOrFail($request->soal_id);

        // Cek status ujian
        $hasilUjian = HasilUjian::where('siswa_id', $siswa->id)
            ->where('ujian_id', $ujianId)
            ->first();

        if (!$hasilUjian || $hasilUjian->status !== 'ongoing') {
            return response()->json([
                'message' => 'Ujian tidak dapat diakses'
            ], 403);
        }

        // Cek apakah jawaban benar
        $isCorrect = $this->checkAnswer($soal->jawaban_benar, $request->jawaban);

        // Simpan atau update jawaban
        JawabanSiswa::updateOrCreate(
            [
                'siswa_id' => $siswa->id,
                'soal_id' => $request->soal_id,
            ],
            [
                'ujian_id' => $ujianId,
                'jawaban' => $request->jawaban,
                'is_correct' => $isCorrect,
            ]
        );

        return response()->json([
            'message' => 'Jawaban berhasil disimpan'
        ]);
    }

    // Submit ujian
    public function submitUjian(Request $request, $ujianId)
    {
        $siswa = $request->user();

        $hasilUjian = HasilUjian::where('siswa_id', $siswa->id)
            ->where('ujian_id', $ujianId)
            ->firstOrFail();

        if ($hasilUjian->status !== 'ongoing') {
            return response()->json([
                'message' => 'Ujian tidak dapat disubmit'
            ], 403);
        }

        // Hitung nilai
        $jawabans = JawabanSiswa::where('siswa_id', $siswa->id)
            ->where('ujian_id', $ujianId)
            ->get();

        $benar = $jawabans->where('is_correct', true)->count();
        $salah = $jawabans->where('is_correct', false)->count();
        $totalSoal = $hasilUjian->total_soal;

        $nilai = ($totalSoal > 0) ? ($benar / $totalSoal) * 100 : 0;

        // Update hasil ujian
        $hasilUjian->update([
            'waktu_selesai' => Carbon::now(),
            'benar' => $benar,
            'salah' => $salah,
            'nilai' => $nilai,
            'status' => 'completed',
        ]);

        return response()->json([
            'message' => 'Ujian berhasil disubmit',
            'hasil' => $hasilUjian
        ]);
    }

    // Helper: Cek jawaban
    private function checkAnswer($jawabanBenar, $jawabanSiswa)
    {
        sort($jawabanBenar);
        sort($jawabanSiswa);

        return $jawabanBenar === $jawabanSiswa;
    }

    // Get server time untuk security check
    public function getServerTime()
    {
        return response()->json([
            'server_time' => Carbon::now()->toIso8601String()
        ]);
    }

    // Get status ujian siswa
    public function getStatus(Request $request, $ujianId)
    {
        $hasilUjian = HasilUjian::where('siswa_id', $request->user()->id)
            ->where('ujian_id', $ujianId)
            ->first();

        if (!$hasilUjian) {
            return response()->json([
                'status' => 'not_started'
            ]);
        }

        return response()->json([
            'status' => $hasilUjian->status,
            'hasil' => $hasilUjian
        ]);
    }
}