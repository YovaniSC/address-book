<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Contact extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'birthday_date', 'notes', 'website', 'company'];

    protected $casts = ['birthday_date' => 'date'];

    public function phones()
    {
        return $this->hasMany(Phone::class);
    }
    public function emails()
    {
        return $this->hasMany(Email::class);
    }
    public function addresses()
    {
        return $this->hasMany(Address::class);
    }
}
