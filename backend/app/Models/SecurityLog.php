<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SecurityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'siswa_id',
        'ujian_id',
        'event_type',
        'event_data',
        'event_time',
    ];

    protected function casts(): array
    {
        return [
            'event_data' => 'array',
            'event_time' => 'datetime',
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