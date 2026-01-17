<?php

namespace App\Http\Controllers\Api\Guru;

use App\Http\Controllers\Controller;
use App\Models\Soal;
use App\Models\Ujian;
use Illuminate\Http\Request;

class SoalController extends Controller
{
    // Daftar soal per ujian
    public function index($ujianId)
    {
        $soals = Soal::where('ujian_id', $ujianId)
            ->orderBy('nomor_soal')
            ->get();

        return response()->json($soals);
    }

    // Tambah soal
    public function store(Request $request, $ujianId)
    {
        $ujian = Ujian::findOrFail($ujianId);

        if ($ujian->guru_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'nomor_soal' => 'required|integer',
            'jenis_soal' => 'required|in:pilihan_ganda,pilihan_ganda_kompleks',
            'pertanyaan' => 'required|string',
            'pilihan' => 'required|array',
            'jawaban_benar' => 'required|array',
            'poin' => 'required|integer|min:1',
        ]);

        $soal = Soal::create([
            'ujian_id' => $ujianId,
            'nomor_soal' => $request->nomor_soal,
            'jenis_soal' => $request->jenis_soal,
            'pertanyaan' => $request->pertanyaan,
            'pilihan' => $request->pilihan,
            'jawaban_benar' => $request->jawaban_benar,
            'poin' => $request->poin,
        ]);

        return response()->json([
            'message' => 'Soal berhasil ditambahkan',
            'soal' => $soal
        ], 201);
    }

    // Update soal
    public function update(Request $request, $ujianId, $id)
    {
        $ujian = Ujian::findOrFail($ujianId);

        if ($ujian->guru_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $soal = Soal::where('ujian_id', $ujianId)->findOrFail($id);

        $request->validate([
            'nomor_soal' => 'required|integer',
            'jenis_soal' => 'required|in:pilihan_ganda,pilihan_ganda_kompleks',
            'pertanyaan' => 'required|string',
            'pilihan' => 'required|array',
            'jawaban_benar' => 'required|array',
            'poin' => 'required|integer|min:1',
        ]);

        $soal->update($request->all());

        return response()->json([
            'message' => 'Soal berhasil diupdate',
            'soal' => $soal
        ]);
    }

    // Hapus soal
    public function destroy(Request $request, $ujianId, $id)
    {
        $ujian = Ujian::findOrFail($ujianId);

        if ($ujian->guru_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $soal = Soal::where('ujian_id', $ujianId)->findOrFail($id);
        $soal->delete();

        return response()->json([
            'message' => 'Soal berhasil dihapus'
        ]);
    }
}