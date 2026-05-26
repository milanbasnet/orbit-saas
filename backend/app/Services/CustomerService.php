<?php

namespace App\Services;

use App\Models\Customer;
use Illuminate\Pagination\LengthAwarePaginator;

class CustomerService
{
    private const PER_PAGE = 15;

    public function __construct(private AuditLogService $auditLog) {}

    public function paginate(array $filters = []): LengthAwarePaginator
    {
        $query = Customer::query();

        if (! empty($filters['search'])) {
            $term = '%' . $filters['search'] . '%';
            $query->where(function ($q) use ($term) {
                $q->where('name', 'like', $term)
                  ->orWhere('email', 'like', $term)
                  ->orWhere('company', 'like', $term);
            });
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        $perPage = min((int) ($filters['per_page'] ?? self::PER_PAGE), 100);

        return $query->latest()->paginate($perPage);
    }

    public function create(array $data): Customer
    {
        $customer = Customer::create($data);

        $this->auditLog->log('customers', 'created', $customer->id, [], $customer->only($customer->getFillable()));

        return $customer;
    }

    public function update(Customer $customer, array $data): Customer
    {
        $old = $customer->only($customer->getFillable());

        $customer->update($data);

        $this->auditLog->log('customers', 'updated', $customer->id, $old, $customer->fresh()->only($customer->getFillable()));

        return $customer->fresh();
    }

    public function delete(Customer $customer): void
    {
        $this->auditLog->log('customers', 'deleted', $customer->id, $customer->only($customer->getFillable()), []);

        $customer->delete();
    }
}

