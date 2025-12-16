<?php

namespace Database\Seeders;

use App\Models\Contact;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ContactSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Contact::factory()
            ->count(5000)
            ->create()
            ->each(function (Contact $contact) {
                // Emails (mínimo 1)
                $emailsCount = rand(1, 2);
                $emails = [];
                for ($i = 0; $i < $emailsCount; $i++) {
                    $emails[] = ['email' => fake()->unique()->safeEmail()];
                }
                $contact->emails()->createMany($emails);

                // Phones (0 a 3)
                $phonesCount = rand(0, 3);
                $phones = [];
                for ($i = 0; $i < $phonesCount; $i++) {
                    $phones[] = ['phone' => fake()->phoneNumber()];
                }
                if ($phones) $contact->phones()->createMany($phones);

                // Addresses (0 a 2) - simple
                $addrCount = rand(0, 2);
                $addrs = [];
                for ($i = 0; $i < $addrCount; $i++) {
                    $addrs[] = [
                        'street' => fake()->streetAddress(),
                        'city' => fake()->city(),
                        'state' => fake()->state(),
                        'zip' => fake()->postcode(),
                    ];
                }
                if ($addrs) $contact->addresses()->createMany($addrs);
            });
    }
}
