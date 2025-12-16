<?php

namespace App\Services;

use App\Models\Contact;
use App\Repositories\ContactRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\ContactCreatedMail;

class ContactService
{
    public function __construct(private readonly ContactRepositoryInterface $repo) {}

    public function list(?string $search, ?string $city, int $perPage = 20)
    {
        return $this->repo->paginateWithFilters($search, $city, $perPage);
    }

    public function get(int $id): Contact
    {
        return $this->repo->findWithRelations($id);
    }
public function create(array $payload): Contact
{
    $recipient = $payload['emails'][0]['email']; // ya que emails es requerido min:1

    $contact = DB::transaction(function () use ($payload) {
        $contactData = collect($payload)->only(['name','birthday_date','notes','website','company'])->toArray();
        $contact = $this->repo->create($contactData);

        $contact->emails()->createMany($payload['emails'] ?? []);
        $contact->phones()->createMany($payload['phones'] ?? []);
        $contact->addresses()->createMany($payload['addresses'] ?? []);

        return $this->repo->findWithRelations($contact->id);
    });

    // Enviar correo (si falla, solo se registra el error para no bloquear la creación)
    try {
        Mail::to($recipient)->send(new ContactCreatedMail($contact));
    } catch (\Throwable $e) {
        Log::error('No se pudo enviar el correo de contacto creado', [
            'contact_id' => $contact->id ?? null,
            'recipient' => $recipient,
            'error' => $e->getMessage(),
        ]);
    }

    return $contact;
}


    public function update(int $id, array $payload): Contact
    {
        return DB::transaction(function () use ($id, $payload) {
            $contact = $this->repo->findWithRelations($id);

            $contactData = collect($payload)->only(['name','birthday_date','notes','website','company'])->toArray();
            $this->repo->update($contact, $contactData);

            $contact->emails()->delete();
            $contact->phones()->delete();
            $contact->addresses()->delete();

            $contact->emails()->createMany($payload['emails'] ?? []);
            $contact->phones()->createMany($payload['phones'] ?? []);
            $contact->addresses()->createMany($payload['addresses'] ?? []);

            return $this->repo->findWithRelations($contact->id);
        });
    }

    public function delete(int $id): void
    {
        $contact = $this->repo->findWithRelations($id);
        $this->repo->delete($contact);
    }
}
