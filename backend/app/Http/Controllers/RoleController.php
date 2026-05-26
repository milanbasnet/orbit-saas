<?php

namespace App\Http\Controllers;

use App\Http\Requests\Role\StoreRoleRequest;
use App\Http\Requests\Role\UpdateRoleRequest;
use App\Http\Resources\RoleResource;
use App\Services\RoleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function __construct(private RoleService $roleService) {}

    public function index(): AnonymousResourceCollection
    {
        return RoleResource::collection($this->roleService->all());
    }

    public function store(StoreRoleRequest $request): JsonResponse
    {
        $role = $this->roleService->create($request->validated());

        return response()->json(new RoleResource($role), 201);
    }

    public function show(Role $role): RoleResource
    {
        $role->load('permissions');

        return new RoleResource($role);
    }

    public function update(UpdateRoleRequest $request, Role $role): RoleResource
    {
        $role = $this->roleService->update($role, $request->validated());

        return new RoleResource($role);
    }

    public function destroy(Role $role): JsonResponse
    {
        $this->roleService->delete($role);

        return response()->json(null, 204);
    }

    public function permissions(): JsonResponse
    {
        return response()->json($this->roleService->allPermissions()->pluck('name'));
    }
}
