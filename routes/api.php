<?php

use Illuminate\Support\Facades\Route;

Route::options('/s3/multipart', 'UploadController@preflightHeader');
Route::post('/s3/multipart', 'UploadController@createMultipartUpload');
Route::get('/s3/multipart/{uploadId}/{partNumber}', 'UploadController@prepareUploadPart');
Route::get('/s3/multipart/{uploadId}', 'UploadController@listParts');
Route::post('/s3/multipart/{uploadId}/complete', 'UploadController@completeMultipartUpload');
Route::delete('/s3/multipart/{uploadId}', 'UploadController@abortMultipartUpload');

Route::get('/files', 'FilesController@index');
Route::post('/files', 'FilesController@store');
Route::get('/files/{fileKey}', 'FilesController@download')->where('fileKey', '.*');
Route::delete('/files/{fileKey}', 'FilesController@destroy')->where('fileKey', '.*');
