<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\ContactRepositoryInterface;
use App\Repositories\EloquentContactRepository;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(ContactRepositoryInterface::class, EloquentContactRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
