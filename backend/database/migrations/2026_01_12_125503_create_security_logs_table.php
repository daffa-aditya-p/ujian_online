<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('security_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('ujian_id')->constrained('ujians')->onDelete('cascade');
            $table->enum('event_type', [
                'tab_switch',
                'blur_focus',
                'exit_fullscreen',
                'devtools_detected',
                'keyboard_shortcut',
                'clipboard_attempt',
                'refresh_attempt',
                'time_manipulation',
                'window_minimize'
            ]);
            $table->json('event_data')->nullable();
            $table->timestamp('event_time');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('security_logs');
    }
};