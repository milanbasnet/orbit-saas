<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

class UserService
{
    private const PER_PAGE = 15;

    public function __construct(private AuditLogService $auditLog) {}

    public function paginate(array $filters = []): LengthAwarePaginator
    {
        $query = User::with('roles');

        if (! empty($filters['search'])) {
            $term = '%' . $filters['search'] . '%';
            $query->where(function ($q) use ($term) {
                $q->where('name', 'like', $term)
                  ->orWhere('email', 'like', $term);
            });
        }

        $perPage = min((int) ($filters['per_page'] ?? self::PER_PAGE), 100);

        return $query->latest()->paginate($perPage);
    }

    public function create(array $data): User
    {
        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        if (! empty($data['roles'])) {
            $user->syncRoles($data['roles']);
        }

        $user->load('roles');

        $this->auditLog->log('users', 'created', $user->id, [], [
            'name'  => $user->name,
            'email' => $user->email,
            'roles' => $user->roles->pluck('name')->toArray(),
        ]);

        return $user;
    }

    public function assignRole(User $user, string $role): User
    {
        $user->assignRole($role);

        return $user->load('roles');
    }

    public function removeRole(User $user, string $role): User
    {
        $user->removeRole($role);

        return $user->load('roles');
    }

    public function syncRoles(User $user, array $roles): User
    {
        $old = $user->getRoleNames()->toArray();

        $user->syncRoles($roles);

        $user->load('roles');

        $this->auditLog->log('users', 'roles_updated', $user->id,
            ['roles' => $old],
            ['roles' => $user->roles->pluck('name')->toArray()]
        );

        return $user;
    }
}
