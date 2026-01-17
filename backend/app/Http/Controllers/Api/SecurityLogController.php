<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SecurityLog;
use App\Models\HasilUjian;
use Illuminate\Http\Request;
use Carbon\Carbon;

class SecurityLogController extends Controller
{
    // Catat security event
    public function logEvent(Request $request)
    {
        $request->validate([
            'ujian_id' => 'required|exists:ujians,id',
            'event_type' => 'required|in:tab_switch,blur_focus,exit_fullscreen,devtools_detected,keyboard_shortcut,clipboard_attempt,refresh_attempt,time_manipulation,window_minimize',
            'event_data' => 'nullable|array',
        ]);

        $siswa = $request->user();

        // Catat log
        SecurityLog::create([
            'siswa_id' => $siswa->id,
            'ujian_id' => $request->ujian_id,
            'event_type' => $request->event_type,
            'event_data' => $request->event_data,
            'event_time' => Carbon::now(),
        ]);

        // Update violation count
        $hasilUjian = HasilUjian::where('siswa_id', $siswa->id)
            ->where('ujian_id', $request->ujian_id)
            ->first();

        if ($hasilUjian) {
            $hasilUjian->increment('violation_count');

            // Auto-lock jika violation >= 5 (konfigurasi bisa diubah)
            if ($hasilUjian->violation_count >= 5) {
                $hasilUjian->update(['status' => 'locked']);
            }
        }

        return response()->json([
            'message' => 'Event logged',
            'violation_count' => $hasilUjian ? $hasilUjian->violation_count : 0,
            'is_locked' => $hasilUjian && $hasilUjian->status === 'locked'
        ]);
    }

    // Get logs untuk admin/guru
    public function getLogs(Request $request, $ujianId, $siswaId)
    {
        $logs = SecurityLog::where('ujian_id', $ujianId)
            ->where('siswa_id', $siswaId)
            ->orderBy('event_time', 'desc')
            ->get();

        return response()->json($logs);
    }

    // Unlock ujian siswa (admin only)
    public function unlockUjian(Request $request, $hasilUjianId)
    {
        if (!$request->user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $hasilUjian = HasilUjian::findOrFail($hasilUjianId);

        $hasilUjian->update([
            'status' => 'ongoing',
            'violation_count' => 0,
        ]);

        return response()->json([
            'message' => 'Ujian berhasil dibuka kembali'
        ]);
    }
}