<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required','string','max:255'],
            'birthday_date' => ['required','date'],

            'notes' => ['nullable','string'],
            'website' => ['nullable','string','max:255'],
            'company' => ['nullable','string','max:255'],

            'emails' => ['required','array','min:1'],
            'emails.*.email' => ['required','email','max:255'],

            'phones' => ['nullable','array'],
            'phones.*.phone' => ['required','string','max:50'],

            'addresses' => ['nullable','array'],
            'addresses.*.street' => ['nullable','string','max:255'],
            'addresses.*.city' => ['nullable','string','max:255'],
            'addresses.*.state' => ['nullable','string','max:255'],
            'addresses.*.zip' => ['nullable','string','max:20'],
        ];
    }
}
