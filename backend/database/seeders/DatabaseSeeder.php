<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Buat Admin
        User::create([
            'nis' => 'admin001',
            'nama' => 'Administrator',
            'password' => Hash::make('admin123'),
            'is_admin' => true,
            'is_guru' => false,
            'is_locked' => false,
        ]);

        // Buat Guru
        User::create([
            'nis' => 'guru001',
            'nama' => 'Guru Matematika',
            'password' => Hash::make('guru123'),
            'is_admin' => false,
            'is_guru' => true,
            'is_locked' => false,
        ]);

        // Buat Siswa
        User::create([
            'nis' => 'siswa001',
            'nama' => 'Siswa Pertama',
            'password' => Hash::make('siswa123'),
            'is_admin' => false,
            'is_guru' => false,
            'is_locked' => false,
        ]);

        User::create([
            'nis' => 'siswa002',
            'nama' => 'Siswa Kedua',
            'password' => Hash::make('siswa123'),
            'is_admin' => false,
            'is_guru' => false,
            'is_locked' => false,
        ]);

        $this->command->info('Demo users created successfully!');
        $this->command->info('Admin: admin001 / admin123');
        $this->command->info('Guru: guru001 / guru123');
        $this->command->info('Siswa: siswa001 / siswa123');
    }
}
