<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\NilaiController;
use App\Http\Controllers\Api\Guru\UjianController;
use App\Http\Controllers\Api\Guru\SoalController;
use App\Http\Controllers\Api\Siswa\DashboardController;
use App\Http\Controllers\Api\Siswa\UjianSiswaController;
use App\Http\Controllers\Api\SecurityLogController;

// Auth Routes
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    // Admin Routes
    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users/siswa', [UserController::class, 'storeSiswa']);
        Route::post('/users/guru', [UserController::class, 'storeGuru']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        Route::post('/users/{id}/toggle-lock', [UserController::class, 'toggleLock']);

        // Kelola Nilai
        Route::get('/nilai', [NilaiController::class, 'index']);
        Route::get('/nilai/ujian/{ujianId}', [NilaiController::class, 'show']);
        Route::get('/nilai/detail/{hasilUjianId}', [NilaiController::class, 'detailSiswa']);

        // Unlock ujian
        Route::post('/unlock-ujian/{hasilUjianId}', [SecurityLogController::class, 'unlockUjian']);
    });

    // Guru Routes
    Route::prefix('guru')->middleware('guru')->group(function () {
        Route::apiResource('ujian', UjianController::class);
        Route::post('/ujian/{id}/regenerate-token', [UjianController::class, 'regenerateToken']);

        // Soal
        Route::get('/ujian/{ujianId}/soal', [SoalController::class, 'index']);
        Route::post('/ujian/{ujianId}/soal', [SoalController::class, 'store']);
        Route::put('/ujian/{ujianId}/soal/{id}', [SoalController::class, 'update']);
        Route::delete('/ujian/{ujianId}/soal/{id}', [SoalController::class, 'destroy']);
    });

    // Siswa Routes
    Route::prefix('siswa')->middleware('siswa')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);
        
        // Ujian
        Route::post('/ujian/access', [UjianSiswaController::class, 'accessWithToken']);
        Route::post('/ujian/{ujianId}/start', [UjianSiswaController::class, 'startUjian']);
        Route::post('/ujian/{ujianId}/submit-jawaban', [UjianSiswaController::class, 'submitJawaban']);
        Route::post('/ujian/{ujianId}/submit', [UjianSiswaController::class, 'submitUjian']);
        Route::get('/ujian/{ujianId}/status', [UjianSiswaController::class, 'getStatus']);
    });

    // Security Logs (untuk siswa saat ujian)
    Route::post('/security/log', [SecurityLogController::class, 'logEvent']);
    Route::get('/security/logs/{ujianId}/{siswaId}', [SecurityLogController::class, 'getLogs']);
});