<?php

namespace Ahmedkandel\NovaS3MultipartUpload;

use Illuminate\Support\Str;
use Laravel\Nova\ResourceTool;

class NovaS3MultipartUpload extends ResourceTool
{
    /**
     * The displayable name of the panel.
     *
     * @var string
     */
    public $name;

    /**
     * The name of the s3 disk.
     *
     * @var string
     */
    public $disk = 's3';

    /**
     * The file storage path.
     *
     * @var string
     */
    public $storagePath;

    /**
     * Should the file be stored with its original name.
     *
     * @var bool
     */
    public $keepOriginalName = false;

    /**
     * The attribute of the field.
     *
     * @var string
     */
    public $attribute;

    /**
     * Relationship type.
     *
     * @var string
     */
    public $relationship;

    /**
     * The attribute casts to array.
     *
     * @var bool
     */
    public $isArray = false;

    /**
     * The attribute casts to multiple array.
     *
     * @var bool
     */
    public $isMultipleArray = false;

    /**
     * The column name for file key / path.
     *
     * @var string
     */
    public $fileKeyColumn;

    /**
     * The column name for file name.
     *
     * @var string|null
     */
    public $fileNameColumn = null;

    /**
     * The column name for file size.
     *
     * @var string|null
     */
    public $fileSizeColumn = null;

    /**
     * Array of meta data columns.
     *
     * @var array
     */
    public $fileMetaColumns = [];

    /**
     * User can view files.
     *
     * @var bool
     */
    public $canView = true;

    /**
     * User can upload files.
     *
     * @var bool
     */
    public $canUpload = true;

    /**
     * User can download files.
     *
     * @var bool
     */
    public $canDownload = true;

    /**
     * User can delete files.
     *
     * @var bool
     */
    public $canDelete = true;

    /**
     * Create a new resource tool.
     *
     * @param  string  $name
     * @param  string|null  $attribute
     * @return void
     */
    public function __construct($name, $attribute = null)
    {
        $this->name = $name;

        parent::__construct();

        $this->attribute = $this->fileKeyColumn = $attribute ?? str_replace(' ', '_', Str::lower($name));

        $this->withMeta(
            [
                'attribute' => $this->attribute,
                'canView' => $this->canView,
                'canUpload' => $this->canUpload,
                'canDownload' => $this->canDownload,
                'canDelete' => $this->canDelete,
                'multipleFilesRestriction' => ['maxNumberOfFiles' => 1],
            ]
        );
    }

    /**
     * Get the displayable name of the resource tool.
     *
     * @return string
     */
    public function name()
    {
        return $this->name;
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

    /**
     * Set the name of the disk the file is stored on.
     *
     * @param  string  $disk
     * @return $this
     */
    public function disk($disk)
    {
        $this->disk = $disk;

        return $this;
    }

    /**
     * Set the file's storage path.
     *
     * @param  string  $path
     * @return $this
     */
    public function path($path)
    {
        $this->storagePath = Str::of($path)->rtrim('/');

        return $this;
    }

    /**
     * Set keepOriginalName boolean.
     *
     * @param  bool  $boolean
     * @return $this
     */
    public function keepOriginalName($boolean = true)
    {
        $this->keepOriginalName = $boolean;

        return $this;
    }

    /**
     * Set hasOne relationship information.
     *
     * @param  string  $fileKeyColumn
     * @return $this
     */
    public function hasOne($fileKeyColumn)
    {
        $this->relationship = 'HasOne';

        $this->fileKeyColumn = $fileKeyColumn;

        return $this;
    }

    /**
     * Set hasMany relationship information.
     *
     * @param  string  $fileKeyColumn
     * @return $this
     */
    public function hasMany($fileKeyColumn)
    {
        $this->relationship = 'HasMany';

        $this->fileKeyColumn = $fileKeyColumn;

        return $this->withMeta(['multipleFilesRestriction' => []]);
    }

    /**
     * Refresh listable resource after file saving
     *
     * @param  bool  $boolean
     * @return $this
     */
    public function refreshListable($boolean = true)
    {
        return $this->withMeta(['refreshListable' => $boolean]);
    }

    /**
     * Set file information storage as array.
     *
     * @param  string  $fileKeyColumn
     * @return $this
     */
    public function storeAsArray($fileKeyColumn)
    {
        $this->isArray = true;

        $this->fileKeyColumn = $fileKeyColumn;

        return $this;
    }

    /**
     * Set files information storage as multiple array.
     *
     * @param  string  $fileKeyColumn
     * @return $this
     */
    public function storeAsMultipleArray($fileKeyColumn)
    {
        $this->isMultipleArray = true;

        $this->fileKeyColumn = $fileKeyColumn;

        return $this->withMeta(['multipleFilesRestriction' => []]);
    }

    /**
     * Set fileNameColumn value.
     *
     * @param  string  $fileNameColumn
     * @return $this
     */
    public function storeName($fileNameColumn)
    {
        $this->fileNameColumn = $fileNameColumn;

        return $this->withMeta(['nameMetaField' => [['id' => 'name', 'name' => 'File']]]);
    }

    /**
     * Set fileSizeColumn value.
     *
     * @param  string  $fileSizeColumn
     * @return $this
     */
    public function storeSize($fileSizeColumn)
    {
        $this->fileSizeColumn = $fileSizeColumn;

        return $this;
    }

    /**
     * Set fileMetaColumns value.
     *
     * @param  array  $fileMetaColumns
     * @return $this
     */
    public function storeMeta($fileMetaColumns)
    {
        $metaColumns = $metaFields = $metaValues = [];

        foreach ($fileMetaColumns as $key => $value) {

            $metaColumns[$value['name']] = $key;

            $metaFields[] = [
                'id' => $key,
                'name' => $value['name'],
                'placeholder' => $value['placeholder'] ?? '',
            ];

            if (array_key_exists('default', $value)) {
                $metaValues[$key] = $value['default'];
            }

        }

        $this->fileMetaColumns = $metaColumns;

        return $this->withMeta(['metaFields' => $metaFields, 'metaValues' => $metaValues]);
    }

    /**
     * The file information are nested under model attribute.
     *
     * @return bool
     */
    public function isNestedAttribute()
    {
        return $this->relationship || $this->isArray || $this->isMultipleArray;
    }

    /**
     * The attribute has single file information.
     *
     * @return bool
     */
    public function hasSingleFile()
    {
        return $this->relationship !== 'HasMany' && ! $this->isMultipleArray;
    }

    /**
     * Filtered array of columns used to store file information.
     *
     * @return array
     */
    public function fileInfoColumns()
    {
        return array_filter([
            'fileKey' => $this->fileKeyColumn,
            'fileName' => $this->fileNameColumn,
            'fileSize' => $this->fileSizeColumn,
        ]);
    }

    /**
     * Filtered array of columns used to store file meta information.
     *
     * @return array
     */
    public function fileMetaColumns()
    {
        return array_filter($this->fileMetaColumns);
    }

    /**
     * Authorize the user to view files.
     *
     * @param  \Closure  $closure
     * @return $this
     */
    public function canView($closure)
    {
        $this->canView = $closure();

        return $this->withMeta(['canView' => $this->canView]);
    }

    /**
     * Authorize the user to upload files.
     *
     * @param  \Closure  $closure
     * @return $this
     */
    public function canUpload($closure)
    {
        $this->canUpload = $closure();

        return $this->withMeta(['canUpload' => $this->canUpload]);
    }

    /**
     * Authorize the user to download files.
     *
     * @param  \Closure  $closure
     * @return $this
     */
    public function canDownload($closure)
    {
        $this->canDownload = $closure();

        return $this->withMeta(['canDownload' => $this->canDownload]);
    }

    /**
     * Authorize the user to delete files.
     *
     * @param  \Closure  $closure
     * @return $this
     */
    public function canDelete($closure)
    {
        $this->canDelete = $closure();

        return $this->withMeta(['canDelete' => $this->canDelete]);
    }

    /**
     * Start uploading automatically after the first file is selected.
     *
     * @param  bool  $boolean
     * @return $this
     */
    public function autoProceed($boolean = true)
    {
        return $this->withMeta(['autoProceed' => $boolean]);
    }

    /**
     * Allow multiple upload batches.
     *
     * @param  bool  $boolean
     * @return $this
     */
    public function allowMultipleUploads($boolean = true)
    {
        return $this->withMeta(['allowMultipleUploads' => $boolean]);
    }

    /**
     * Conditions to limit the type and/or number of files that can be selected.
     *
     * @param  array  $array
     * @return $this
     */
    public function restrictions($array)
    {
        return $this->withMeta(['restrictions' => $array]);
    }

    /**
     * The maximum amount of chunks to upload simultaneously.
     *
     * @param  int  $integer
     * @return $this
     */
    public function simultaneousChunks($integer)
    {
        return $this->withMeta(['limit' => $integer]);
    }

    /**
     * The minimum chunk size in bytes to use when uploading the given file.
     *
     * @param  int  $integer
     * @return $this
     */
    public function chunkSize($integer)
    {
        return $this->withMeta(['chunkSize' => $integer]);
    }

    /**
     * The height of dashboard in pixels. footerNote & displayPoweredByUppy are hidden if panelHeight <= 400px.
     *
     * @param  int  $integer
     * @return $this
     */
    public function panelHeight($integer)
    {
        return $this->withMeta(['height' => $integer]);
    }

    /**
     * The type of selections allowed when browsing your file system via the file manager selection window.
     *
     * @param  string  $string  (‘files’, ‘folders’, ‘both’)
     * @return $this
     */
    public function fileManagerSelectionType($string)
    {
        return $this->withMeta(['fileManagerSelectionType' => $string]);
    }

    /**
     * The dashboard footer note.
     *
     * @param  string  $string
     * @return $this
     */
    public function footerNote($string)
    {
        return $this->withMeta(['note' => $string]);
    }

    /**
     * Display powered by Uppy.
     *
     * @param  bool  $boolean
     * @return $this
     */
    public function displayPoweredByUppy($boolean = true)
    {
        return $this->withMeta(['proudlyDisplayPoweredByUppy' => $boolean]);
    }

    /**
     * Translate text that is shown to the user.
     *
     * @param  array  $array
     * @return $this
     */
    public function translate($array)
    {
        return $this->withMeta(['locale' => $array]);
    }

    /**
     * Enable Webcam plugin.
     *
     * @param  bool $boolean
     * @return $this
     */
    public function useWebcam($boolean = true)
    {
        return $this->withMeta(['useWebcam' => $boolean]);
    }

    /**
     * Enable Screen Capture plugin.
     *
     * @param  bool  $boolean
     * @return $this
     */
    public function useScreenCapture($boolean = true)
    {
        return $this->withMeta(['useScreenCapture' => $boolean]);
    }

    /**
     * Enable Image Editor plugin.
     *
     * @param  bool  $boolean
     * @return $this
     */
    public function useImageEditor($boolean = true)
    {
        return $this->withMeta(['useImageEditor' => $boolean]);
    }
}
