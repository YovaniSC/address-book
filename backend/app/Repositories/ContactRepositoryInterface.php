<?php

namespace App\Repositories;

use App\Models\Contact;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ContactRepositoryInterface
{
    public function paginateWithFilters(?string $search, ?string $city, int $perPage = 20): LengthAwarePaginator;
    public function findWithRelations(int $id): Contact;
    public function create(array $data): Contact;
    public function update(Contact $contact, array $data): Contact;
    public function delete(Contact $contact): void;
}
