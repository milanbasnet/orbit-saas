<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Pagination\LengthAwarePaginator;

class AuditLogService
{
    private const PER_PAGE = 20;

    public function log(
        string $module,
        string $action,
        ?int   $recordId,
        array  $oldValues = [],
        array  $newValues = []
    ): void {
        AuditLog::create([
            'user_id'    => auth()->id(),
            'module'     => $module,
            'action'     => $action,
            'record_id'  => $recordId,
            'old_values' => empty($oldValues) ? null : $oldValues,
            'new_values' => empty($newValues) ? null : $newValues,
            'ip_address' => request()->ip(),
        ]);
    }

    public function paginate(array $filters = []): LengthAwarePaginator
    {
        $query = AuditLog::with('user')->latest('audit_logs.created_at');

        if (! empty($filters['module'])) {
            $query->where('module', $filters['module']);
        }

        if (! empty($filters['user_id'])) {
            $query->where('user_id', (int) $filters['user_id']);
        }

        if (! empty($filters['action'])) {
            $query->where('action', $filters['action']);
        }

        if (! empty($filters['from'])) {
            $query->whereDate('created_at', '>=', $filters['from']);
        }

        if (! empty($filters['to'])) {
            $query->whereDate('created_at', '<=', $filters['to']);
        }

        if (! empty($filters['search'])) {
            $term = $filters['search'];
            $query->where(function ($q) use ($term) {
                $q->where('action', 'like', "%{$term}%")
                  ->orWhere('module', 'like', "%{$term}%")
                  ->orWhere('record_id', $term);
            });
        }

        $perPage = min((int) ($filters['per_page'] ?? self::PER_PAGE), 100);

        return $query->paginate($perPage);
    }
}
