<?php

namespace Ahmedkandel\NovaS3MultipartUpload;

use Aws\S3\S3Client;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Laravel\Nova\Nova;

class ToolServiceProvider extends ServiceProvider
{
    public function register()
    {
        parent::register();

        // Construct s3 client for tool
        $this->app->bind('novas3client', function ($app, $args) {
            $disk = $args['disk'];
            $config = $this->formatS3Config(config("filesystems.disks.{$disk}"));
            return new S3Client($config);
        });
    }


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
     * Format the given S3 configuration with the default options.
     *
     * @param array $config
     * @return array
     */
    protected function formatS3Config(array $config)
    {
        $config += ['version' => 'latest'];

        if (!empty($config['key']) && !empty($config['secret'])) {
            $config['credentials'] = Arr::only($config, ['key', 'secret', 'token']);
        }

        return $config;
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
