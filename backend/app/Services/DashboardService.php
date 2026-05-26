<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;

class DashboardService
{
    public function summary(): array
    {
        $month = now()->month;
        $year  = now()->year;

        return [
            'stats'         => $this->buildStats($month, $year),
            'recent_orders' => $this->recentOrders(),
        ];
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private function buildStats(int $month, int $year): array
    {
        return [
            'total_products'     => Product::count(),
            'total_customers'    => Customer::count(),
            'total_orders'       => Order::count(),
            'orders_this_month'  => Order::whereMonth('created_at', $month)
                ->whereYear('created_at', $year)
                ->count(),
            'revenue_this_month' => Order::whereMonth('created_at', $month)
                ->whereYear('created_at', $year)
                ->whereNotIn('status', ['cancelled'])
                ->sum('total'),
        ];
    }

    private function recentOrders(): Collection
    {
        return Order::with('customer')
            ->latest()
            ->limit(10)
            ->get();
    }
}
