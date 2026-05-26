<?php

namespace App\Http\Controllers;

use App\Http\Resources\AuditLogResource;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AuditLogController extends Controller
{
    public function __construct(private AuditLogService $auditLogService) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $logs = $this->auditLogService->paginate(
            $request->only(['search', 'module', 'user_id', 'action', 'from', 'to', 'per_page'])
        );

        return AuditLogResource::collection($logs);
    }
}
