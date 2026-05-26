<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductService
{
    private const PER_PAGE = 15;

    public function __construct(private AuditLogService $auditLog) {}

    public function paginate(array $filters = []): LengthAwarePaginator
    {
        $query = Product::query();

        if (! empty($filters['search'])) {
            $term = '%' . $filters['search'] . '%';
            $query->where(function ($q) use ($term) {
                $q->where('name', 'like', $term)
                  ->orWhere('sku', 'like', $term);
            });
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        $perPage = min((int) ($filters['per_page'] ?? self::PER_PAGE), 100);

        return $query->latest()->paginate($perPage);
    }

    public function create(array $data): Product
    {
        $product = Product::create($data);

        $this->auditLog->log('products', 'created', $product->id, [], $product->only($product->getFillable()));

        return $product;
    }

    public function update(Product $product, array $data): Product
    {
        $old = $product->only($product->getFillable());

        $product->update($data);

        $this->auditLog->log('products', 'updated', $product->id, $old, $product->fresh()->only($product->getFillable()));

        return $product->fresh();
    }

    public function delete(Product $product): void
    {
        $this->auditLog->log('products', 'deleted', $product->id, $product->only($product->getFillable()), []);

        $product->delete();
    }
}

