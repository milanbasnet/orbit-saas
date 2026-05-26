<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // $this->route('product') is the bound Product model via route-model binding
        $productId = $this->route('product')?->id;

        return [
            'sku'         => ['required', 'string', 'max:100', Rule::unique('products', 'sku')->ignore($productId)],
            'name'        => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price'       => ['required', 'numeric', 'min:0'],
            'status'      => ['required', Rule::in(['active', 'inactive', 'draft'])],
        ];
    }
}
