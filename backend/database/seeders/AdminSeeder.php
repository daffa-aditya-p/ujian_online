<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'nis' => 'admin',
            'nama' => 'Administrator',
            'is_admin' => true,
            'is_guru' => false,
            'password' => Hash::make('adminsija262626'),
        ]);
    }
}
