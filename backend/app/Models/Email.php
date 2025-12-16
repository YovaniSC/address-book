<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Email extends Model
{
    protected $fillable = ['contact_id', 'email'];
    public function contact()
    {
        return $this->belongsTo(Contact::class);
    }
}
