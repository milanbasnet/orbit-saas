<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\AssignRoleRequest;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class UserController extends Controller
{
    public function __construct(private UserService $userService) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $users = $this->userService->paginate(
            $request->only(['search', 'per_page'])
        );

        return UserResource::collection($users);
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = $this->userService->create($request->validated());

        return response()->json(new UserResource($user), 201);
    }

    public function show(User $user): UserResource
    {
        return new UserResource($user->load('roles'));
    }

    public function syncRoles(AssignRoleRequest $request, User $user): UserResource
    {
        $user = $this->userService->syncRoles($user, $request->validated()['roles']);

        return new UserResource($user);
    }
}
