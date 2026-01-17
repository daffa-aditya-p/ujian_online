<?php

namespace App\Http\Controllers\Api\Guru;

use App\Http\Controllers\Controller;
use App\Models\Ujian;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UjianController extends Controller
{
    // Daftar ujian guru
    public function index(Request $request)
    {
        $ujians = Ujian::where('guru_id', $request->user()->id)
            ->withCount(['soals', 'hasilUjians'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($ujians);
    }

    // Buat ujian baru
    public function store(Request $request)
    {
        $request->validate([
            'jenis_ujian' => 'required|string',
            'nama_ujian' => 'required|string',
            'waktu_mulai' => 'required|date',
            'waktu_selesai' => 'required|date|after:waktu_mulai',
            'durasi_menit' => 'required|integer|min:1',
        ]);

        $ujian = Ujian::create([
            'guru_id' => $request->user()->id,
            'jenis_ujian' => $request->jenis_ujian,
            'nama_ujian' => $request->nama_ujian,
            'waktu_mulai' => $request->waktu_mulai,
            'waktu_selesai' => $request->waktu_selesai,
            'durasi_menit' => $request->durasi_menit,
            'token' => strtoupper(Str::random(8)),
        ]);

        return response()->json([
            'message' => 'Ujian berhasil dibuat',
            'ujian' => $ujian
        ], 201);
    }

    // Detail ujian
    public function show(Request $request, $id)
    {
        $ujian = Ujian::with('soals')
            ->where('id', $id)
            ->firstOrFail();

        if ($ujian->guru_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($ujian);
    }

    // Update ujian
    public function update(Request $request, $id)
    {
        $ujian = Ujian::findOrFail($id);

        if ($ujian->guru_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'jenis_ujian' => 'required|string',
            'nama_ujian' => 'required|string',
            'waktu_mulai' => 'required|date',
            'waktu_selesai' => 'required|date|after:waktu_mulai',
            'durasi_menit' => 'required|integer|min:1',
        ]);

        $ujian->update($request->only([
            'jenis_ujian',
            'nama_ujian',
            'waktu_mulai',
            'waktu_selesai',
            'durasi_menit'
        ]));

        return response()->json([
            'message' => 'Ujian berhasil diupdate',
            'ujian' => $ujian
        ]);
    }

    // Hapus ujian
    public function destroy(Request $request, $id)
    {
        $ujian = Ujian::findOrFail($id);

        if ($ujian->guru_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $ujian->delete();

        return response()->json([
            'message' => 'Ujian berhasil dihapus'
        ]);
    }

    // Generate ulang token
    public function regenerateToken(Request $request, $id)
    {
        $ujian = Ujian::findOrFail($id);

        if ($ujian->guru_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $ujian->update([
            'token' => strtoupper(Str::random(8))
        ]);

        return response()->json([
            'message' => 'Token berhasil digenerate ulang',
            'token' => $ujian->token
        ]);
    }
}