<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hasil_ujians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('ujian_id')->constrained('ujians')->onDelete('cascade');
            $table->dateTime('waktu_mulai');
            $table->dateTime('waktu_selesai')->nullable();
            $table->integer('total_soal');
            $table->integer('benar')->default(0);
            $table->integer('salah')->default(0);
            $table->decimal('nilai', 5, 2)->default(0);
            $table->integer('violation_count')->default(0);
            $table->enum('status', ['ongoing', 'completed', 'locked'])->default('ongoing');
            $table->timestamps();
            
            $table->unique(['siswa_id', 'ujian_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hasil_ujians');
    }
};