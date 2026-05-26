<?php

namespace App\Services;

use App\Models\File;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FileService
{
    private const PER_PAGE = 20;
    private const DISK     = 'local';

    public function __construct(private AuditLogService $auditLog) {}

    public function paginate(array $filters = []): LengthAwarePaginator
    {
        $query = File::with('uploader')->latest();

        if (! empty($filters['search'])) {
            $term = '%' . $filters['search'] . '%';
            $query->where('original_name', 'like', $term);
        }

        if (! empty($filters['mime'])) {
            $query->where('mime_type', 'like', '%' . $filters['mime'] . '%');
        }

        $perPage = min((int) ($filters['per_page'] ?? self::PER_PAGE), 100);

        return $query->paginate($perPage);
    }

    public function upload(UploadedFile $file, int $userId): File
    {
        $ext      = $file->getClientOriginalExtension();
        $fileName = Str::uuid() . ($ext ? '.' . $ext : '');
        $path     = Storage::disk(self::DISK)->putFileAs('uploads', $file, $fileName);

        $model = File::create([
            'file_name'     => $fileName,
            'original_name' => $file->getClientOriginalName(),
            'mime_type'     => $file->getMimeType(),
            'size'          => $file->getSize(),
            'path'          => $path,
            'uploaded_by'   => $userId,
        ]);

        $this->auditLog->log('files', 'uploaded', $model->id, [], [
            'name' => $model->original_name,
            'size' => $model->size,
            'mime' => $model->mime_type,
        ]);

        return $model->load('uploader');
    }

    public function download(File $file): StreamedResponse
    {
        return Storage::disk(self::DISK)->download($file->path, $file->original_name);
    }

    public function delete(File $file): void
    {
        $this->auditLog->log('files', 'deleted', $file->id, [
            'name' => $file->original_name,
            'size' => $file->size,
        ], []);

        Storage::disk(self::DISK)->delete($file->path);

        $file->delete();
    }
}
