<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class OrderService
{
    private const PER_PAGE = 15;

    public function __construct(private AuditLogService $auditLog) {}

    public function paginate(array $filters = []): LengthAwarePaginator
    {
        $query = Order::query()->with('customer');

        if (! empty($filters['search'])) {
            $term = '%' . $filters['search'] . '%';
            $query->where(function ($q) use ($term) {
                $q->where('order_number', 'like', $term)
                  ->orWhereHas('customer', fn ($c) => $c->where('name', 'like', $term));
            });
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->latest()->paginate(self::PER_PAGE);
    }

    public function findWithItems(Order $order): Order
    {
        return $order->load(['customer', 'items']);
    }

    public function create(array $data): Order
    {
        return DB::transaction(function () use ($data) {
            $order = Order::create([
                'order_number' => $this->generateOrderNumber(),
                'customer_id'  => $data['customer_id'],
                'status'       => $data['status'],
                'notes'        => $data['notes'] ?? null,
                'subtotal'     => 0,
                'total'        => 0,
            ]);

            $subtotal = $this->createItems($order, $data['items']);

            $order->update(['subtotal' => $subtotal, 'total' => $subtotal]);

            $order->load(['customer', 'items']);

            $this->auditLog->log('orders', 'created', $order->id, [], [
                'order_number' => $order->order_number,
                'customer_id'  => $order->customer_id,
                'status'       => $order->status,
                'total'        => $order->total,
            ]);

            return $order;
        });
    }

    public function update(Order $order, array $data): Order
    {
        return DB::transaction(function () use ($order, $data) {
            $old = [
                'customer_id' => $order->customer_id,
                'status'      => $order->status,
                'notes'       => $order->notes,
                'total'       => $order->total,
            ];

            $order->update([
                'customer_id' => $data['customer_id'],
                'status'      => $data['status'],
                'notes'       => $data['notes'] ?? null,
            ]);

            // Replace all items — simplest correct approach for an order editor
            $order->items()->delete();

            $subtotal = $this->createItems($order, $data['items']);

            $order->update(['subtotal' => $subtotal, 'total' => $subtotal]);

            $order->load(['customer', 'items']);

            $this->auditLog->log('orders', 'updated', $order->id, $old, [
                'customer_id' => $order->customer_id,
                'status'      => $order->status,
                'notes'       => $order->notes,
                'total'       => $order->total,
            ]);

            return $order;
        });
    }

    public function delete(Order $order): void
    {
        $this->auditLog->log('orders', 'deleted', $order->id, [
            'order_number' => $order->order_number,
            'status'       => $order->status,
            'total'        => $order->total,
        ], []);

        $order->delete();
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private function createItems(Order $order, array $items): float
    {
        $subtotal = 0;

        foreach ($items as $item) {
            $product   = Product::findOrFail($item['product_id']);
            $lineTotal = $product->price * $item['quantity'];

            $order->items()->create([
                'product_id'   => $product->id,
                'product_name' => $product->name,
                'product_sku'  => $product->sku,
                'unit_price'   => $product->price,
                'quantity'     => $item['quantity'],
                'line_total'   => $lineTotal,
            ]);

            $subtotal += $lineTotal;
        }

        return $subtotal;
    }

    private function generateOrderNumber(): string
    {
        $date  = now()->format('Ymd');
        $count = Order::whereDate('created_at', today())->count() + 1;

        return sprintf('ORD-%s-%04d', $date, $count);
    }
}
