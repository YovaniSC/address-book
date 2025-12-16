<?php

namespace Database\Factories;

use App\Models\Contact;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Contact>
 */
class ContactFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Contact::class;
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'birthday_date' => $this->faker->date(),
            'notes' => $this->faker->boolean(40) ? $this->faker->sentence() : null,
            'website' => $this->faker->boolean(30) ? $this->faker->url() : null,
            'company' => $this->faker->boolean(50) ? $this->faker->company() : null,
        ];
    }
}
