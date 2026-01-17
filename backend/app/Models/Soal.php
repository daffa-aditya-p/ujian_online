<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Soal extends Model
{
    use HasFactory;

    protected $fillable = [
        'ujian_id',
        'nomor_soal',
        'jenis_soal',
        'pertanyaan',
        'pilihan',
        'jawaban_benar',
        'poin',
    ];

    protected function casts(): array
    {
        return [
            'pilihan' => 'array',
            'jawaban_benar' => 'array',
        ];
    }

    // Relasi
    public function ujian()
    {
        return $this->belongsTo(Ujian::class);
    }

    public function jawabanSiswas()
    {
        return $this->hasMany(JawabanSiswa::class);
    }
}