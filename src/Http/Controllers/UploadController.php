<?php

namespace Ahmedkandel\NovaS3MultipartUpload\Http\Controllers;

use Ahmedkandel\NovaS3MultipartUpload\NovaS3MultipartUpload;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Laravel\Nova\Http\Requests\NovaRequest;

class UploadController
{
    /**
     * Resource tool instance.
     *
     * @var \Ahmedkandel\NovaS3MultipartUpload\NovaS3MultipartUpload
     */
    private $tool;

    /**
     * S3 client instance.
     *
     * @var \Aws\S3\S3Client
     */
    private $s3Client;

    /**
     * The common parameters for S3 requests.
     *
     * @var array
     */
    private $params;

    /**
     * Set preflight response header to allow X-CSRF-TOKEN in Uppy request headers.
     *
     * @return void
     */
    public function preflightHeader()
    {
        header('Access-Control-Allow-Headers: Authorization, Origin, Content-Type, Accept, X-CSRF-TOKEN');
    }

    /**
     * Retrieve resource tool and create S3Client.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @return void
     */
    private function init($request)
    {
        $resource = $request->findResourceOrFail();

        $this->tool = collect($resource->availablePanelsForDetail($request, $resource))
            ->whereInstanceOf(NovaS3MultipartUpload::class)
            ->firstWhere('attribute', $request->route('field'));

        abort_unless($this->tool, 404);

        $this->s3Client = Storage::disk($this->tool->disk)->getDriver()->getAdapter()->getClient();

        $this->params = [
            'Bucket' => config('filesystems.disks.' . $this->tool->disk . '.bucket'),
            'UploadId' => $request->route('uploadId'),
            'Key' => $request->query('key'),
        ];
    }

    /**
     * Authorize user action.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @param string $action
     * @return void
     */
    private function authorize($request, $action)
    {
        abort_unless($this->tool->element->authorizedToSee($request), 403);

        abort_unless($this->tool->{'can' . $action}, 403);
    }

    /**
     * Initiate S3 multipart upload request.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @return array
     */
    public function createMultipartUpload(NovaRequest $request)
    {
        $this->init($request);

        $this->authorize($request, 'Upload');

        $data = $this->s3Client->createMultipartUpload([
            'Bucket' => $this->params['Bucket'],
            'Key' => $this->generateFileKey($request->input('filename')),
            'ContentType' => $request->input('type'),
        ]);

        return [
            'key' => $data['Key'],
            'uploadId' => $data['UploadId'],
        ];
    }

    /**
     * Generate file storage key
     *
     * @param string $fileName
     * @return string
     */
    private function generateFileKey($fileName)
    {
        $pathinfo = pathinfo($fileName);
        $path = $this->tool->storagePath ? $this->tool->storagePath . '/' : '';
        $name = $this->tool->keepOriginalName ? $pathinfo['filename'] : Str::random(40);

        return $path . $name . '.' . ($pathinfo['extension'] ?? '');
    }

    /**
     * Create S3 presigned upload request for each part.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @return array
     */
    public function prepareUploadPart(NovaRequest $request)
    {
        $this->init($request);

        $command = $this->s3Client->getCommand('UploadPart', array_merge(
            $this->params,
            [
                'PartNumber' => $request->route('partNumber'),
            ]
        ));
        $s3Request = $this->s3Client->createPresignedRequest($command, '+20 minutes');

        return [
            'url' => (string) $s3Request->getUri(),
        ];
    }

    /**
     * List uploaded parts.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @return array
     */
    public function listParts(NovaRequest $request)
    {
        $this->init($request);

        $data = $this->s3Client->listParts(array_merge(
            $this->params,
            [
                'PartNumberMarker' => 0,
            ]
        ));

        return $data['Parts'];
    }

    /**
     * Complete multipart upload by assembling previously uploaded parts.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @return array
     */
    public function completeMultipartUpload(NovaRequest $request)
    {
        $this->init($request);

        $data = $this->s3Client->completeMultipartUpload(array_merge(
            $this->params,
            [
                'MultipartUpload' => [
                    'Parts' => $request->input('parts'),
                ],
            ]
        ));

        return [
            'location' => $data['Key'],
        ];
    }

    /**
     * Abort multipart upload and delete uploaded parts.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @return array
     */
    public function abortMultipartUpload(NovaRequest $request)
    {
        $this->init($request);

        $this->s3Client->abortMultipartUpload($this->params);

        return [];
    }
}
