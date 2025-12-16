<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ContactController;

Route::apiResource('contacts', ContactController::class);
