<?php

namespace App\Http\Controllers;

use App\Http\Requests\File\UploadFileRequest;
use App\Http\Resources\FileResource;
use App\Models\File;
use App\Services\FileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FileController extends Controller
{
    public function __construct(private FileService $fileService) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $files = $this->fileService->paginate(
            $request->only(['search', 'mime', 'per_page'])
        );

        return FileResource::collection($files);
    }

    public function store(UploadFileRequest $request): JsonResponse
    {
        $file = $this->fileService->upload(
            $request->file('file'),
            $request->user()->id
        );

        return response()->json(new FileResource($file), 201);
    }

    public function download(File $file): StreamedResponse
    {
        $this->authorizeAccess($file);

        return $this->fileService->download($file);
    }

    public function destroy(File $file): JsonResponse
    {
        $this->authorizeAccess($file);

        $this->fileService->delete($file);

        return response()->json(null, 204);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private function authorizeAccess(File $file): void
    {
        $user = auth()->user();

        if ($file->uploaded_by !== $user->id && ! $user->hasRole('Admin')) {
            abort(403, 'You do not have permission to access this file.');
        }
    }
}
