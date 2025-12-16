<?php

namespace App\Repositories;

use App\Models\Contact;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentContactRepository implements ContactRepositoryInterface
{
    public function paginateWithFilters(?string $search, ?string $city, int $perPage = 20): LengthAwarePaginator
    {
        $query = Contact::query()->with(['phones','emails','addresses']);

        if ($search) {
            $s = trim($search);
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('company', 'like', "%{$s}%")
                  ->orWhere('website', 'like', "%{$s}%")
                  ->orWhere('notes', 'like', "%{$s}%")
                  ->orWhereHas('phones', fn($p) => $p->where('phone', 'like', "%{$s}%"))
                  ->orWhereHas('emails', fn($e) => $e->where('email', 'like', "%{$s}%"))
                  ->orWhereHas('addresses', function ($a) use ($s) {
                      $a->where('street', 'like', "%{$s}%")
                        ->orWhere('city', 'like', "%{$s}%")
                        ->orWhere('state', 'like', "%{$s}%")
                        ->orWhere('zip', 'like', "%{$s}%");
                  });
            });
        }

        if ($city) {
            $query->whereHas('addresses', fn($a) => $a->where('city', $city));
        }

        return $query->orderByDesc('id')->paginate($perPage);
    }

    public function findWithRelations(int $id): Contact
    {
        return Contact::with(['phones','emails','addresses'])->findOrFail($id);
    }

    public function create(array $data): Contact
    {
        return Contact::create($data);
    }

    public function update(Contact $contact, array $data): Contact
    {
        $contact->update($data);
        return $contact;
    }

    public function delete(Contact $contact): void
    {
        $contact->delete();
    }
}
