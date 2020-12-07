# Nova S3 Multipart Upload

[![Latest Version on Packagist](https://img.shields.io/packagist/v/ahmedkandel/nova-s3-multipart-upload.svg)](https://github.com/ahmedkandel/nova-s3-multipart-upload) [![Total Downloads](https://img.shields.io/packagist/dt/ahmedkandel/nova-s3-multipart-upload.svg)](https://github.com/ahmedkandel/nova-s3-multipart-upload) [![License](https://img.shields.io/packagist/l/ahmedkandel/nova-s3-multipart-upload.svg)](https://github.com/ahmedkandel/nova-s3-multipart-upload/blob/master/LICENSE.md)

A Laravel Nova resource tool to upload files directly to Amazon S3. You can (upload | download | delete) single, multiple, small or big files.

![screenshot](https://github.com/ahmedkandel/nova-s3-multipart-upload/blob/master/docs/screenshot.png?raw=true)

### ⚡ Features

- **Secure:** No sensitive data will be exposed to the front-end including AWS credentials. The uploaded and downloaded files will never pass through your server for extra protection and performance.

- **Flexible:** File information can be stored in model attributes or as an array under a single model attribute or even as relationship.

- **Solid:** Based on excellent components, [Uppy](https://uppy.io/) file uploader, [Laravel Nova](https://nova.laravel.com/) dashboard and [Amazon S3](https://aws.amazon.com/s3/) storage.

- **Customizable:** Wide range of customization options using chained [methods](#%EF%B8%8F-methods).

- **Image Editor, Custom Meta Fields, Chunked Upload, Webcam Recording, Screen Capture, Authorization, Localization, ...**

### 📌 Installation

```bash
composer require "ahmedkandel/nova-s3-multipart-upload"
```

### 💡 Usage

In your Nova resource class add `NovaS3MultipartUpload` tool to fields:
```php
use Ahmedkandel\NovaS3MultipartUpload\NovaS3MultipartUpload;

class Post extends Resource
{
    public function fields(Request $request)
    {
        return [
            // ...
            NovaS3MultipartUpload::make('Video'),
        ];
    }
}
```
**NB** the `make` method requires a "human readable" name, it will try to guess the attribute name. You may pass the attribute name as a second argument.

**NB** the attribute name is used to store the file_path **OR** file/s information in case of `storeAsArray`/`storeAsMultipleArray` **OR** relationship model/s in case of `hasOne`/`hasMany`.

------------

In your model class add all the attributes that will be filled to `$fillable`:
```php
class Post extends Model
{
    protected $fillable = ['video'];
}
```

------------

When using `storeAsArray` or `storeAsMultipleArray` methods you will need to cast the attribute to an array in your model class:
```php
class Post extends Model
{
    protected $casts = [
        'videos' => 'array',
    ];
}
```

### ⚙️ S3 configuration

After creating your S3 bucket and connecting it to your Laravel project, You will need an extra step to configure the S3 bucket C"ross-origin resource sharing (CORS)" with either JSON or XML (note, this is NOT a bucket policy):

#### JSON
```json
[
    {
        "AllowedOrigins": [
            "http://your-website.com"
        ],
        "AllowedMethods": [
            "GET",
            "PUT"
        ],
        "AllowedHeaders": [
            "Authorization",
            "x-amz-date",
            "x-amz-content-sha256",
            "content-type"
        ],
        "ExposeHeaders": [
            "ETag"
        ],
        "MaxAgeSeconds": 3000
    },
    {
        "AllowedOrigins": [
            "*"
        ],
        "AllowedMethods": [
            "GET"
        ],
        "AllowedHeaders": [],
        "ExposeHeaders": [],
        "MaxAgeSeconds": 3000
    }
]
```

#### XML
```xml
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
  <CORSRule>
    <AllowedOrigin>http://your-domain.com</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>PUT</AllowedMethod>
    <MaxAgeSeconds>3000</MaxAgeSeconds>
    <AllowedHeader>Authorization</AllowedHeader>
    <AllowedHeader>x-amz-date</AllowedHeader>
    <AllowedHeader>x-amz-content-sha256</AllowedHeader>
    <AllowedHeader>content-type</AllowedHeader>
    <ExposeHeader>ETag</ExposeHeader>
  </CORSRule>
  <CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <MaxAgeSeconds>3000</MaxAgeSeconds>
  </CORSRule>
</CORSConfiguration>
```
**NB** please replace `http://your-domain.com` with your front-end domain.

### ✂️ Methods

- **File storage:**

	- `->disk($disk)` Set S3 disk name, default is 's3'.

	- `->path($path)` Set storage path, default is bucket root.

	- `->keepOriginalName()` Keep the file original names, default is to auto generate hashed names "which is recommended".

- **File information:**

	- `->storeName($fileNameColumn)` Stores file_name in this attribute/column/Key. You can edit the file name before uploading from the uploader panel.

	- `->storeSize($fileSizeColumn)` Stores file_size (in bytes) in this attribute/column/Key. The size will be formatted (in KB, MB, ...) on the file card.

	- `->storeMeta($array)` Stores other metadata and creates UI to handle them from the uploader panel. The `$array` keys are the attributes/columns/keys. e.g.
		```php
        ->storeMeta(
            [
                'file_author' => [
                    'name' => 'Author',
                    'placeholder' => 'your name please!',
                    'default' => 'No Author',
                ],
                'file_description' => [
                    'name' => 'Description',
                ],
            ]
        )
		```

- **Model attributes:**

	By default the file_path is stored in the model attribute specified by the `make` method. Then if any other file information (file_name, file_size, metadata) are added they get stored in the corresponding attributes.
    
	For more flexibility all these attributes could be stored as an associative array under one single model attribute defined by `make` method.

	- `->storeAsArray($fileKeyColumn)` Set the array key that will hold the file_path.

	- `->storeAsMultipleArray($fileKeyColumn)` Like `storeAsArray` but allow multiple files.

	If you would like to store the file information in separate "child" model that is related to the "main" model attribute defined by `make` method.

	- `->hasOne($fileKeyColumn)` Set the related model attribute that will hold the file_path.

	- `->hasMany($fileKeyColumn)` Like `hasOne` but allow multiple files.

	- `->refreshListable()` Refresh listable fields `HasOne` and `HasMany` in your resource detail view each time you upload or delete file.

- **Uploader options:**

	- `->autoProceed()` Start uploading automatically after the first patch of files are selected.

	- `->allowMultipleUploads()` Allow adding more files after uploading the first patch of files.

	- `->restrictions($array)` Rules and conditions to limit the type and/or number of files that can be uploaded. e.g.
		```php
        ->restrictions(
            [
                'maxFileSize' => 1024 * 1024 * 1024,
                'minFileSize' => 50 * 1024,
                'maxNumberOfFiles' => 10,
                'minNumberOfFiles' => 2,
                'allowedFileTypes' => [
                    'image/*',
                    'video/*',
                    '.pdf',
                ],
            ]
        )
		```

	- `->simultaneousChunks($integer)` The maximum amount of chunks to upload simultaneously.

	- `->chunkSize($integer)` The minimum chunk size in bytes to use when uploading the file.

	- `->panelHeight($integer)` The uploader panel height in pixels.

	- `->fileManagerSelectionType($string)` The type of selection via file manager window ('files', 'folders', 'both'), default is 'files'.

	- `->footerNote($string)` Text to be shown on the footer of the uploader panel. Useful when using `restrictions` to give instructions.

	- `->displayPoweredByUppy()` Display [Uppy team](https://transloadit.com/) credits on the uploader panel.

	- `->translate($array)` Localize the uploader panel. e.g.
 		```php
        ->translate(
            [
                'dropPasteImportBoth' => 'Trascina i file qui, sfoglia %{browseFiles} o %{browseFolders}',
                'browseFiles' => 'i file',
                'browseFolders' => 'le cartelle',
                'myDevice' => 'Dispositivo',
                'screencast' => 'Schermo',
            ]
        )
		```
		**NB** you can get a list of available `$array` key from [here](https://github.com/transloadit/uppy/blob/master/packages/%40uppy/locales/src/en_US.js).

### ✔️ Example

Uploading multiple files with their (names, sizes, metadata). Then save files information as multiple array in `files` attribute in `User` model.

User model class:
```php
class User extends Model
{
    protected $fillable = ['files'];
    
    protected $casts = [
        'files' => 'array',
    ];
}
```

User resource class:
```php
use Ahmedkandel\NovaS3MultipartUpload\NovaS3MultipartUpload;

class User extends Resource
{
    public function fields(Request $request)
    {
        return [
            // ...
            NovaS3MultipartUpload::make('Files')
                ->path($request->user()->id.'-uploads')
                ->storeAsMultipleArray('file_path')
                ->storeName('file_name')
                ->storeSize('file_size')
                ->storeMeta(
                    [
                        'file_author' => [
                            'name' => 'Author',
                            'placeholder' => 'your name please!',
                            'default' => 'No Author',
                        ],
                        'file_description' => [
                            'name' => 'Description',
                        ],
                    ]
                ),
        ];
    }
}
```

Preview:

![upload](https://github.com/ahmedkandel/nova-s3-multipart-upload/blob/master/docs/upload.gif?raw=true)

When files are uploaded the user model files attribute `\App\User::find(1)->files` will have the following value:
```json
[
    {
        "file_name": "Video.mkv",
        "file_path": "1-uploads/To5SvZLTyT1XQcUWCTpmqH6GfrgLmoep0tP6EV9n.mkv",
        "file_size": 207683,
        "file_author": "No Author",
        "file_description": null
    },
    {
        "file_name": "Document.pdf",
        "file_path": "1-uploads/RnEBFKa0EqDoKQRkXf27l4dZ7fQ8MTyBofMK202b.pdf",
        "file_size": 77395,
        "file_author": "Ahmed Kandil",
        "file_description": "DDD"
    }
]
```

### 🛂 Authorization

Nova authorize the user to see the resource tool using `->canSee(closure)` method which accepts a Closure that should return `true` or `false`.

We have added more methods to this tool for more granulare control:

- `->canUpload(closure)` allow the user to upload file and show the uploader panel.

- `->canView(closure)` allow the user to list uploaded file and show the files grid.

- `->canDownload(closure)` allow the user to download file and show the download button in the file card.

- `->canDelete(closure)` allow the user to delete file and show the delete button in the file card.

e.g. if you would like to allow the user to upload only if no file attribute is empty:
```php
->canUpload(function () {
    return empty($this->model()->video);
})
```

e.g. if you would like to allow the user to delete files in his own model (Post or Video):
```php
->canDelete(function () {
    return request()->user()->id === $this->model()->user_id;
})
```

**NB** by default all actions are authorized until you disallow them.

### 🔌 Plugins

- **Image Editor:** enable [Uppy Image Editor](https://uppy.io/docs/image-editor/) plugin using `->useImageEditor()` method. The plugin is using the excellent [Cropper.js](https://fengyuanchen.github.io/cropperjs/).

	**NB** the editor will be only activated for image files.

- **Webcam:** enable [Uppy Webcam](https://uppy.io/docs/webcam/) plugin using `->useWebcam()` method. Then you can record videos and take pictures to be uploaded.

	**NB** to be able to use the webcam you need https connection.

- **Screen Capture:** enable [Uppy Screen Capture](https://github.com/transloadit/uppy/tree/master/packages/%40uppy/screen-capture/) plugin using `->useScreenCapture()` method. Then you can record your screen or applications to be uploaded.

	**NB** to be able to use the screen capture you need https connection.

### ⚠️ Notes

This package is a resource tool **NOT** a resource field. This means it is only visible under the resource detail view as a panel and can not be inserted in another panel or tab, it must be a direct child of the resource fields array.

**Why?** After a lot of thinking we found that uploading file in the same request of creating a new model is not a good idea. Because the response duration will depend on the file upload progress, which means the user have to wait without any visiual indication hoping that everything will work. So we decided to separate the files (upload | download | delete) process from the model (create | edit) process.

### 📜 Changelog

Please see [CHANGELOG](https://github.com/ahmedkandel/nova-s3-multipart-upload/blob/master/CHANGELOG.md) for more information on what has changed recently.

### 🤝 License

The MIT License (MIT). Please see [License File](https://github.com/ahmedkandel/nova-s3-multipart-upload/blob/master/LICENSE.md) for more information.
