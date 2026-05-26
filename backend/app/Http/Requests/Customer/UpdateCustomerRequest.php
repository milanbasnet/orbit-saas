<?php

namespace App\Http\Requests\Customer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // $this->route('customer') is the bound Customer model via route-model binding
        $customerId = $this->route('customer')?->id;

        return [
            'name'    => ['required', 'string', 'max:255'],
            'email'   => ['required', 'string', 'email', 'max:255', Rule::unique('customers', 'email')->ignore($customerId)],
            'phone'   => ['nullable', 'string', 'max:50'],
            'company' => ['nullable', 'string', 'max:255'],
            'status'  => ['required', Rule::in(['active', 'inactive'])],
            'notes'   => ['nullable', 'string'],
        ];
    }
}
