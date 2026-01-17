<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('soals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ujian_id')->constrained('ujians')->onDelete('cascade');
            $table->integer('nomor_soal');
            $table->enum('jenis_soal', ['pilihan_ganda', 'pilihan_ganda_kompleks']);
            $table->text('pertanyaan');
            $table->json('pilihan'); // ["A" => "text", "B" => "text", ...]
            $table->json('jawaban_benar'); // ["A"] atau ["A", "C"] untuk kompleks
            $table->integer('poin')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('soals');
    }
};