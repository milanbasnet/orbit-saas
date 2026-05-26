<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'order_number' => $this->order_number,
            'status'       => $this->status,
            'notes'        => $this->notes,
            'subtotal'     => $this->subtotal,
            'total'        => $this->total,
            // Nested resources — only included when the relation is eager-loaded
            'customer'     => new CustomerResource($this->whenLoaded('customer')),
            'items'        => OrderItemResource::collection($this->whenLoaded('items')),
            'created_at'   => $this->created_at,
            'updated_at'   => $this->updated_at,
        ];
    }
}
