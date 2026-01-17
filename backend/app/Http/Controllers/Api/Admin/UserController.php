<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // Daftar semua user
    public function index()
    {
        $users = User::select('id', 'nis', 'nama', 'is_admin', 'is_guru', 'is_locked')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($users);
    }

    // Tambah siswa
    public function storeSiswa(Request $request)
    {
        $request->validate([
            'nis' => 'required|string|unique:users,nis',
            'nama' => 'required|string',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'nis' => $request->nis,
            'nama' => $request->nama,
            'password' => Hash::make($request->password),
            'is_admin' => false,
            'is_guru' => false,
        ]);

        return response()->json([
            'message' => 'Siswa berhasil ditambahkan',
            'user' => $user
        ], 201);
    }

    // Tambah guru
    public function storeGuru(Request $request)
    {
        $request->validate([
            'nis' => 'required|string|unique:users,nis',
            'nama' => 'required|string',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'nis' => $request->nis,
            'nama' => $request->nama,
            'password' => Hash::make($request->password),
            'is_admin' => false,
            'is_guru' => true,
        ]);

        return response()->json([
            'message' => 'Guru berhasil ditambahkan',
            'user' => $user
        ], 201);
    }

    // Update user
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'nis' => 'required|string|unique:users,nis,' . $id,
            'nama' => 'required|string',
        ]);

        $user->update([
            'nis' => $request->nis,
            'nama' => $request->nama,
        ]);

        if ($request->filled('password')) {
            $user->update([
                'password' => Hash::make($request->password)
            ]);
        }

        return response()->json([
            'message' => 'User berhasil diupdate',
            'user' => $user
        ]);
    }

    // Hapus user
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->is_admin) {
            return response()->json([
                'message' => 'Tidak dapat menghapus admin'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'User berhasil dihapus'
        ]);
    }

    // Lock/Unlock user
    public function toggleLock($id)
    {
        $user = User::findOrFail($id);

        $user->update([
            'is_locked' => !$user->is_locked
        ]);

        return response()->json([
            'message' => $user->is_locked ? 'User berhasil dikunci' : 'User berhasil dibuka',
            'user' => $user
        ]);
    }
}