<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('files', function (Blueprint $table) {
            $table->id();
            $table->string('file_name');                    // stored name (uuid.ext)
            $table->string('original_name');                // original client filename
            $table->string('mime_type', 100);
            $table->unsignedBigInteger('size');             // bytes
            $table->string('path');                         // relative storage path
            $table->foreignId('uploaded_by')->constrained('users')->cascadeOnDelete();
            // Ready for future association with Products / Customers / Orders
            $table->nullableMorphs('fileable');
            $table->timestamps();

            $table->index('uploaded_by');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('files');
    }
};
