<?php

namespace App\Services;

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleService
{
    public function all(): \Illuminate\Database\Eloquent\Collection
    {
        return Role::with('permissions')->orderBy('name')->get();
    }

    public function allPermissions(): \Illuminate\Database\Eloquent\Collection
    {
        return Permission::orderBy('name')->get();
    }

    public function create(array $data): Role
    {
        $role = Role::create(['name' => $data['name'], 'guard_name' => 'web']);

        if (! empty($data['permissions'])) {
            $role->syncPermissions($data['permissions']);
        }

        return $role->load('permissions');
    }

    public function update(Role $role, array $data): Role
    {
        if (! empty($data['name'])) {
            $role->update(['name' => $data['name']]);
        }

        if (array_key_exists('permissions', $data)) {
            $role->syncPermissions($data['permissions']);
        }

        return $role->fresh('permissions');
    }

    public function delete(Role $role): void
    {
        $role->delete();
    }
}
