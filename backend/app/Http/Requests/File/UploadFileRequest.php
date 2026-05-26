<?php

namespace App\Http\Requests\File;

use Illuminate\Foundation\Http\FormRequest;

class UploadFileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file' => [
                'required',
                'file',
                'max:10240', // 10 MB in kilobytes
                'mimetypes:' . implode(',', [
                    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'text/plain', 'text/csv',
                    'application/zip',
                ]),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'file.mimetypes' => 'Allowed file types: images, PDF, Word, Excel, CSV, TXT, ZIP.',
            'file.max'       => 'File must not exceed 10 MB.',
        ];
    }
}
