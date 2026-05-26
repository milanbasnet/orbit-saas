<?php

use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Guest routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me',      [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/dashboard', DashboardController::class);

    Route::apiResource('products',  ProductController::class);
    Route::apiResource('customers', CustomerController::class);
    Route::apiResource('orders',    OrderController::class);

    // Users — Admin & Manager can list; only Admin can create/sync roles
    Route::middleware('role:Admin|Manager')->group(function () {
        Route::get('/users',        [UserController::class, 'index']);
        Route::get('/users/{user}', [UserController::class, 'show']);
    });
    Route::middleware('role:Admin')->group(function () {
        Route::post('/users',             [UserController::class, 'store']);
        Route::put('/users/{user}/roles', [UserController::class, 'syncRoles']);
    });

    // Audit Logs — Admin only
    Route::get('/audit-logs', [AuditLogController::class, 'index'])->middleware('role:Admin');

    // Files — all authenticated users
    Route::get('/files',                    [FileController::class, 'index']);
    Route::post('/files',                   [FileController::class, 'store']);
    Route::get('/files/{file}/download',    [FileController::class, 'download']);
    Route::delete('/files/{file}',          [FileController::class, 'destroy']);

    // Roles — read for Admin & Manager, write for Admin only
    Route::get('/roles',              [RoleController::class, 'index'])->middleware('role:Admin|Manager');
    Route::get('/roles/permissions',  [RoleController::class, 'permissions'])->middleware('role:Admin');
    Route::get('/roles/{role}',       [RoleController::class, 'show'])->middleware('role:Admin|Manager');
    Route::post('/roles',             [RoleController::class, 'store'])->middleware('role:Admin');
    Route::put('/roles/{role}',       [RoleController::class, 'update'])->middleware('role:Admin');
    Route::delete('/roles/{role}',    [RoleController::class, 'destroy'])->middleware('role:Admin');
});

Route::get('/test', function () {
    return response()->json([
        'status'  => 'OK',
        'message' => 'Laravel API working',
    ]);
});

