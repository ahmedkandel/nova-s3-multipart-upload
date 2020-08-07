<?php

namespace Ahmedkandel\NovaS3MultipartUpload;

use Laravel\Nova\ResourceTool;

class NovaS3MultipartUpload extends ResourceTool
{
    /**
     * Get the displayable name of the resource tool.
     *
     * @return string
     */
    public function name()
    {
        return 'Nova S3 Multipart Upload';
    }

    /**
     * Get the component name for the resource tool.
     *
     * @return string
     */
    public function component()
    {
        return 'nova-s3-multipart-upload';
    }
}
