<?php

namespace Ahmedkandel\NovaS3MultipartUpload;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Laravel\Nova\Nova;

class ToolServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        $this->app->booted(function () {
            $this->routes();
        });

        Nova::serving(function () {
            Nova::script('nova-s3-multipart-upload', __DIR__ . '/../dist/js/tool.js');
            Nova::style('nova-s3-multipart-upload', __DIR__ . '/../dist/css/tool.css');
        });
    }

    /**
     * Register the tool's routes.
     *
     * @return void
     */
    protected function routes()
    {
        if ($this->app->routesAreCached()) {
            return;
        }

        Route::middleware(['nova'])
            ->namespace('Ahmedkandel\NovaS3MultipartUpload\Http\Controllers')
            ->prefix('/nova-vendor/nova-s3-multipart-upload/{resource}/{resourceId}/{field}')
            ->group(__DIR__ . '/../routes/api.php');
    }
}
