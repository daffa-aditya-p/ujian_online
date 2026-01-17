<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ujian extends Model
{
    use HasFactory;

    protected $fillable = [
        'guru_id',
        'jenis_ujian',
        'nama_ujian',
        'waktu_mulai',
        'waktu_selesai',
        'durasi_menit',
        'token',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'waktu_mulai' => 'datetime',
            'waktu_selesai' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    // Relasi
    public function guru()
    {
        return $this->belongsTo(User::class, 'guru_id');
    }

    public function soals()
    {
        return $this->hasMany(Soal::class);
    }

    public function jawabanSiswas()
    {
        return $this->hasMany(JawabanSiswa::class);
    }

    public function hasilUjians()
    {
        return $this->hasMany(HasilUjian::class);
    }

    public function securityLogs()
    {
        return $this->hasMany(SecurityLog::class);
    }
}