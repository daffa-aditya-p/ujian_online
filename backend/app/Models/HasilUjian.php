<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HasilUjian extends Model
{
    use HasFactory;

    protected $fillable = [
        'siswa_id',
        'ujian_id',
        'waktu_mulai',
        'waktu_selesai',
        'total_soal',
        'benar',
        'salah',
        'nilai',
        'violation_count',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'waktu_mulai' => 'datetime',
            'waktu_selesai' => 'datetime',
            'nilai' => 'decimal:2',
        ];
    }

    // Relasi
    public function siswa()
    {
        return $this->belongsTo(User::class, 'siswa_id');
    }

    public function ujian()
    {
        return $this->belongsTo(Ujian::class);
    }
}