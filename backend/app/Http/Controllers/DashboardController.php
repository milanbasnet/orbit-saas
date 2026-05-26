<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(private DashboardService $dashboardService) {}

    public function __invoke(Request $request): JsonResponse
    {
        $data = $this->dashboardService->summary();

        return response()->json([
            'stats'         => $data['stats'],
            'recent_orders' => OrderResource::collection($data['recent_orders']),
        ]);
    }
}
