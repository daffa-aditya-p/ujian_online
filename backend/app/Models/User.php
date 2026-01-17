<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'nis',
        'nama',
        'is_admin',
        'is_guru',
        'password',
        'is_locked',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'is_admin' => 'boolean',
            'is_guru' => 'boolean',
            'is_locked' => 'boolean',
        ];
    }

    // Relasi
    public function ujians()
    {
        return $this->hasMany(Ujian::class, 'guru_id');
    }

    public function jawabanSiswas()
    {
        return $this->hasMany(JawabanSiswa::class, 'siswa_id');
    }

    public function securityLogs()
    {
        return $this->hasMany(SecurityLog::class, 'siswa_id');
    }

    public function hasilUjians()
    {
        return $this->hasMany(HasilUjian::class, 'siswa_id');
    }
}