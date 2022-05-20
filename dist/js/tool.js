/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@transloadit/prettier-bytes/prettierBytes.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@transloadit/prettier-bytes/prettierBytes.js ***!
  \*******************************************************************/
/***/ ((module) => {

// Adapted from https://github.com/Flet/prettier-bytes/
// Changing 1000 bytes to 1024, so we can keep uppercase KB vs kB
// ISC License (c) Dan Flettre https://github.com/Flet/prettier-bytes/blob/master/LICENSE
module.exports = function prettierBytes (num) {
  if (typeof num !== 'number' || isNaN(num)) {
    throw new TypeError('Expected a number, got ' + typeof num)
  }

  var neg = num < 0
  var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  if (neg) {
    num = -num
  }

  if (num < 1) {
    return (neg ? '-' : '') + num + ' B'
  }

  var exponent = Math.min(Math.floor(Math.log(num) / Math.log(1024)), units.length - 1)
  num = Number(num / Math.pow(1024, exponent))
  var unit = units[exponent]

  if (num >= 10 || num % 1 === 0) {
    // Do not show decimals when the number is two-digit, or if the number has no
    // decimal component.
    return (neg ? '-' : '') + num.toFixed(0) + ' ' + unit
  } else {
    return (neg ? '-' : '') + num.toFixed(1) + ' ' + unit
  }
}


/***/ }),

/***/ "./node_modules/@uppy/aws-s3-multipart/lib/MultipartUploader.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@uppy/aws-s3-multipart/lib/MultipartUploader.js ***!
  \**********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const {
  AbortController,
  createAbortError
} = __webpack_require__(/*! @uppy/utils/lib/AbortController */ "./node_modules/@uppy/utils/lib/AbortController.js");

const delay = __webpack_require__(/*! @uppy/utils/lib/delay */ "./node_modules/@uppy/utils/lib/delay.js");

const MB = 1024 * 1024;
const defaultOptions = {
  limit: 1,
  retryDelays: [0, 1000, 3000, 5000],

  getChunkSize(file) {
    return Math.ceil(file.size / 10000);
  },

  onStart() {},

  onProgress() {},

  onPartComplete() {},

  onSuccess() {},

  onError(err) {
    throw err;
  }

};

function ensureInt(value) {
  if (typeof value === 'string') {
    return parseInt(value, 10);
  }

  if (typeof value === 'number') {
    return value;
  }

  throw new TypeError('Expected a number');
}

var _aborted = /*#__PURE__*/_classPrivateFieldLooseKey("aborted");

var _initChunks = /*#__PURE__*/_classPrivateFieldLooseKey("initChunks");

var _createUpload = /*#__PURE__*/_classPrivateFieldLooseKey("createUpload");

var _resumeUpload = /*#__PURE__*/_classPrivateFieldLooseKey("resumeUpload");

var _uploadParts = /*#__PURE__*/_classPrivateFieldLooseKey("uploadParts");

var _retryable = /*#__PURE__*/_classPrivateFieldLooseKey("retryable");

var _prepareUploadParts = /*#__PURE__*/_classPrivateFieldLooseKey("prepareUploadParts");

var _uploadPartRetryable = /*#__PURE__*/_classPrivateFieldLooseKey("uploadPartRetryable");

var _uploadPart = /*#__PURE__*/_classPrivateFieldLooseKey("uploadPart");

var _onPartProgress = /*#__PURE__*/_classPrivateFieldLooseKey("onPartProgress");

var _onPartComplete = /*#__PURE__*/_classPrivateFieldLooseKey("onPartComplete");

var _uploadPartBytes = /*#__PURE__*/_classPrivateFieldLooseKey("uploadPartBytes");

var _completeUpload = /*#__PURE__*/_classPrivateFieldLooseKey("completeUpload");

var _abortUpload = /*#__PURE__*/_classPrivateFieldLooseKey("abortUpload");

var _onError = /*#__PURE__*/_classPrivateFieldLooseKey("onError");

class MultipartUploader {
  constructor(file, options) {
    Object.defineProperty(this, _onError, {
      value: _onError2
    });
    Object.defineProperty(this, _abortUpload, {
      value: _abortUpload2
    });
    Object.defineProperty(this, _completeUpload, {
      value: _completeUpload2
    });
    Object.defineProperty(this, _uploadPartBytes, {
      value: _uploadPartBytes2
    });
    Object.defineProperty(this, _onPartComplete, {
      value: _onPartComplete2
    });
    Object.defineProperty(this, _onPartProgress, {
      value: _onPartProgress2
    });
    Object.defineProperty(this, _uploadPart, {
      value: _uploadPart2
    });
    Object.defineProperty(this, _uploadPartRetryable, {
      value: _uploadPartRetryable2
    });
    Object.defineProperty(this, _prepareUploadParts, {
      value: _prepareUploadParts2
    });
    Object.defineProperty(this, _retryable, {
      value: _retryable2
    });
    Object.defineProperty(this, _uploadParts, {
      value: _uploadParts2
    });
    Object.defineProperty(this, _resumeUpload, {
      value: _resumeUpload2
    });
    Object.defineProperty(this, _createUpload, {
      value: _createUpload2
    });
    Object.defineProperty(this, _initChunks, {
      value: _initChunks2
    });
    Object.defineProperty(this, _aborted, {
      value: _aborted2
    });
    this.options = { ...defaultOptions,
      ...options
    }; // Use default `getChunkSize` if it was null or something

    if (!this.options.getChunkSize) {
      this.options.getChunkSize = defaultOptions.getChunkSize;
    }

    this.file = file;
    this.abortController = new AbortController();
    this.key = this.options.key || null;
    this.uploadId = this.options.uploadId || null;
    this.parts = []; // Do `this.createdPromise.then(OP)` to execute an operation `OP` _only_ if the
    // upload was created already. That also ensures that the sequencing is right
    // (so the `OP` definitely happens if the upload is created).
    //
    // This mostly exists to make `#abortUpload` work well: only sending the abort request if
    // the upload was already created, and if the createMultipartUpload request is still in flight,
    // aborting it immediately after it finishes.

    this.createdPromise = Promise.reject(); // eslint-disable-line prefer-promise-reject-errors

    this.isPaused = false;
    this.partsInProgress = 0;
    this.chunks = null;
    this.chunkState = null;

    _classPrivateFieldLooseBase(this, _initChunks)[_initChunks]();

    this.createdPromise.catch(() => {}); // silence uncaught rejection warning
  }
  /**
   * Was this upload aborted?
   *
   * If yes, we may need to throw an AbortError.
   *
   * @returns {boolean}
   */


  start() {
    this.isPaused = false;

    if (this.uploadId) {
      _classPrivateFieldLooseBase(this, _resumeUpload)[_resumeUpload]();
    } else {
      _classPrivateFieldLooseBase(this, _createUpload)[_createUpload]();
    }
  }

  pause() {
    this.abortController.abort(); // Swap it out for a new controller, because this instance may be resumed later.

    this.abortController = new AbortController();
    this.isPaused = true;
  }

  abort(opts) {
    var _opts;

    if (opts === void 0) {
      opts = undefined;
    }

    if ((_opts = opts) != null && _opts.really) _classPrivateFieldLooseBase(this, _abortUpload)[_abortUpload]();else this.pause();
  }

}

function _aborted2() {
  return this.abortController.signal.aborted;
}

function _initChunks2() {
  const chunks = [];
  const desiredChunkSize = this.options.getChunkSize(this.file); // at least 5MB per request, at most 10k requests

  const minChunkSize = Math.max(5 * MB, Math.ceil(this.file.size / 10000));
  const chunkSize = Math.max(desiredChunkSize, minChunkSize); // Upload zero-sized files in one zero-sized chunk

  if (this.file.size === 0) {
    chunks.push(this.file);
  } else {
    for (let i = 0; i < this.file.size; i += chunkSize) {
      const end = Math.min(this.file.size, i + chunkSize);
      chunks.push(this.file.slice(i, end));
    }
  }

  this.chunks = chunks;
  this.chunkState = chunks.map(() => ({
    uploaded: 0,
    busy: false,
    done: false
  }));
}

function _createUpload2() {
  this.createdPromise = Promise.resolve().then(() => this.options.createMultipartUpload());
  return this.createdPromise.then(result => {
    if (_classPrivateFieldLooseBase(this, _aborted)[_aborted]()) throw createAbortError();
    const valid = typeof result === 'object' && result && typeof result.uploadId === 'string' && typeof result.key === 'string';

    if (!valid) {
      throw new TypeError('AwsS3/Multipart: Got incorrect result from `createMultipartUpload()`, expected an object `{ uploadId, key }`.');
    }

    this.key = result.key;
    this.uploadId = result.uploadId;
    this.options.onStart(result);

    _classPrivateFieldLooseBase(this, _uploadParts)[_uploadParts]();
  }).catch(err => {
    _classPrivateFieldLooseBase(this, _onError)[_onError](err);
  });
}

async function _resumeUpload2() {
  try {
    const parts = await this.options.listParts({
      uploadId: this.uploadId,
      key: this.key
    });
    if (_classPrivateFieldLooseBase(this, _aborted)[_aborted]()) throw createAbortError();
    parts.forEach(part => {
      const i = part.PartNumber - 1;
      this.chunkState[i] = {
        uploaded: ensureInt(part.Size),
        etag: part.ETag,
        done: true
      }; // Only add if we did not yet know about this part.

      if (!this.parts.some(p => p.PartNumber === part.PartNumber)) {
        this.parts.push({
          PartNumber: part.PartNumber,
          ETag: part.ETag
        });
      }
    });

    _classPrivateFieldLooseBase(this, _uploadParts)[_uploadParts]();
  } catch (err) {
    _classPrivateFieldLooseBase(this, _onError)[_onError](err);
  }
}

function _uploadParts2() {
  if (this.isPaused) return; // All parts are uploaded.

  if (this.chunkState.every(state => state.done)) {
    _classPrivateFieldLooseBase(this, _completeUpload)[_completeUpload]();

    return;
  } // For a 100MB file, with the default min chunk size of 5MB and a limit of 10:
  //
  // Total 20 parts
  // ---------
  // Need 1 is 10
  // Need 2 is 5
  // Need 3 is 5


  const need = this.options.limit - this.partsInProgress;
  const completeChunks = this.chunkState.filter(state => state.done).length;
  const remainingChunks = this.chunks.length - completeChunks;
  let minNeeded = Math.ceil(this.options.limit / 2);

  if (minNeeded > remainingChunks) {
    minNeeded = remainingChunks;
  }

  if (need < minNeeded) return;
  const candidates = [];

  for (let i = 0; i < this.chunkState.length; i++) {
    const state = this.chunkState[i]; // eslint-disable-next-line no-continue

    if (state.done || state.busy) continue;
    candidates.push(i);

    if (candidates.length >= need) {
      break;
    }
  }

  if (candidates.length === 0) return;

  _classPrivateFieldLooseBase(this, _prepareUploadParts)[_prepareUploadParts](candidates).then(result => {
    candidates.forEach(index => {
      const partNumber = index + 1;
      const prePreparedPart = {
        url: result.presignedUrls[partNumber],
        headers: result.headers
      };

      _classPrivateFieldLooseBase(this, _uploadPartRetryable)[_uploadPartRetryable](index, prePreparedPart).then(() => {
        _classPrivateFieldLooseBase(this, _uploadParts)[_uploadParts]();
      }, err => {
        _classPrivateFieldLooseBase(this, _onError)[_onError](err);
      });
    });
  });
}

function _retryable2(_ref) {
  let {
    before,
    attempt,
    after
  } = _ref;
  const {
    retryDelays
  } = this.options;
  const {
    signal
  } = this.abortController;
  if (before) before();

  function shouldRetry(err) {
    if (err.source && typeof err.source.status === 'number') {
      const {
        status
      } = err.source; // 0 probably indicates network failure

      return status === 0 || status === 409 || status === 423 || status >= 500 && status < 600;
    }

    return false;
  }

  const doAttempt = retryAttempt => attempt().catch(err => {
    if (_classPrivateFieldLooseBase(this, _aborted)[_aborted]()) throw createAbortError();

    if (shouldRetry(err) && retryAttempt < retryDelays.length) {
      return delay(retryDelays[retryAttempt], {
        signal
      }).then(() => doAttempt(retryAttempt + 1));
    }

    throw err;
  });

  return doAttempt(0).then(result => {
    if (after) after();
    return result;
  }, err => {
    if (after) after();
    throw err;
  });
}

async function _prepareUploadParts2(candidates) {
  candidates.forEach(i => {
    this.chunkState[i].busy = true;
  });
  const result = await _classPrivateFieldLooseBase(this, _retryable)[_retryable]({
    attempt: () => this.options.prepareUploadParts({
      key: this.key,
      uploadId: this.uploadId,
      partNumbers: candidates.map(index => index + 1),
      chunks: candidates.reduce((chunks, candidate) => ({ ...chunks,
        // Use the part number as the index
        [candidate + 1]: this.chunks[candidate]
      }), {})
    })
  });

  if (typeof (result == null ? void 0 : result.presignedUrls) !== 'object') {
    throw new TypeError('AwsS3/Multipart: Got incorrect result from `prepareUploadParts()`, expected an object `{ presignedUrls }`.');
  }

  return result;
}

function _uploadPartRetryable2(index, prePreparedPart) {
  return _classPrivateFieldLooseBase(this, _retryable)[_retryable]({
    before: () => {
      this.partsInProgress += 1;
    },
    attempt: () => _classPrivateFieldLooseBase(this, _uploadPart)[_uploadPart](index, prePreparedPart),
    after: () => {
      this.partsInProgress -= 1;
    }
  });
}

function _uploadPart2(index, prePreparedPart) {
  this.chunkState[index].busy = true;
  const valid = typeof (prePreparedPart == null ? void 0 : prePreparedPart.url) === 'string';

  if (!valid) {
    throw new TypeError('AwsS3/Multipart: Got incorrect result for `prePreparedPart`, expected an object `{ url }`.');
  }

  const {
    url,
    headers
  } = prePreparedPart;

  if (_classPrivateFieldLooseBase(this, _aborted)[_aborted]()) {
    this.chunkState[index].busy = false;
    throw createAbortError();
  }

  return _classPrivateFieldLooseBase(this, _uploadPartBytes)[_uploadPartBytes](index, url, headers);
}

function _onPartProgress2(index, sent) {
  this.chunkState[index].uploaded = ensureInt(sent);
  const totalUploaded = this.chunkState.reduce((n, c) => n + c.uploaded, 0);
  this.options.onProgress(totalUploaded, this.file.size);
}

function _onPartComplete2(index, etag) {
  this.chunkState[index].etag = etag;
  this.chunkState[index].done = true;
  const part = {
    PartNumber: index + 1,
    ETag: etag
  };
  this.parts.push(part);
  this.options.onPartComplete(part);
}

function _uploadPartBytes2(index, url, headers) {
  const body = this.chunks[index];
  const {
    signal
  } = this.abortController;
  let defer;
  const promise = new Promise((resolve, reject) => {
    defer = {
      resolve,
      reject
    };
  });
  const xhr = new XMLHttpRequest();
  xhr.open('PUT', url, true);

  if (headers) {
    Object.keys(headers).forEach(key => {
      xhr.setRequestHeader(key, headers[key]);
    });
  }

  xhr.responseType = 'text';

  function cleanup() {
    // eslint-disable-next-line no-use-before-define
    signal.removeEventListener('abort', onabort);
  }

  function onabort() {
    xhr.abort();
  }

  signal.addEventListener('abort', onabort);
  xhr.upload.addEventListener('progress', ev => {
    if (!ev.lengthComputable) return;

    _classPrivateFieldLooseBase(this, _onPartProgress)[_onPartProgress](index, ev.loaded, ev.total);
  });
  xhr.addEventListener('abort', () => {
    cleanup();
    this.chunkState[index].busy = false;
    defer.reject(createAbortError());
  });
  xhr.addEventListener('load', ev => {
    cleanup();
    this.chunkState[index].busy = false;

    if (ev.target.status < 200 || ev.target.status >= 300) {
      const error = new Error('Non 2xx');
      error.source = ev.target;
      defer.reject(error);
      return;
    } // This avoids the net::ERR_OUT_OF_MEMORY in Chromium Browsers.


    this.chunks[index] = null;

    _classPrivateFieldLooseBase(this, _onPartProgress)[_onPartProgress](index, body.size, body.size); // NOTE This must be allowed by CORS.


    const etag = ev.target.getResponseHeader('ETag');

    if (etag === null) {
      defer.reject(new Error('AwsS3/Multipart: Could not read the ETag header. This likely means CORS is not configured correctly on the S3 Bucket. See https://uppy.io/docs/aws-s3-multipart#S3-Bucket-Configuration for instructions.'));
      return;
    }

    _classPrivateFieldLooseBase(this, _onPartComplete)[_onPartComplete](index, etag);

    defer.resolve();
  });
  xhr.addEventListener('error', ev => {
    cleanup();
    this.chunkState[index].busy = false;
    const error = new Error('Unknown error');
    error.source = ev.target;
    defer.reject(error);
  });
  xhr.send(body);
  return promise;
}

async function _completeUpload2() {
  // Parts may not have completed uploading in sorted order, if limit > 1.
  this.parts.sort((a, b) => a.PartNumber - b.PartNumber);

  try {
    const result = await this.options.completeMultipartUpload({
      key: this.key,
      uploadId: this.uploadId,
      parts: this.parts
    });
    this.options.onSuccess(result);
  } catch (err) {
    _classPrivateFieldLooseBase(this, _onError)[_onError](err);
  }
}

function _abortUpload2() {
  this.abortController.abort();
  this.createdPromise.then(() => {
    this.options.abortMultipartUpload({
      key: this.key,
      uploadId: this.uploadId
    });
  }, () => {// if the creation failed we do not need to abort
  });
}

function _onError2(err) {
  if (err && err.name === 'AbortError') {
    return;
  }

  this.options.onError(err);
}

module.exports = MultipartUploader;

/***/ }),

/***/ "./node_modules/@uppy/aws-s3-multipart/lib/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@uppy/aws-s3-multipart/lib/index.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _class, _temp;

const BasePlugin = __webpack_require__(/*! @uppy/core/lib/BasePlugin */ "./node_modules/@uppy/core/lib/BasePlugin.js");

const {
  Socket,
  Provider,
  RequestClient
} = __webpack_require__(/*! @uppy/companion-client */ "./node_modules/@uppy/companion-client/lib/index.js");

const EventTracker = __webpack_require__(/*! @uppy/utils/lib/EventTracker */ "./node_modules/@uppy/utils/lib/EventTracker.js");

const emitSocketProgress = __webpack_require__(/*! @uppy/utils/lib/emitSocketProgress */ "./node_modules/@uppy/utils/lib/emitSocketProgress.js");

const getSocketHost = __webpack_require__(/*! @uppy/utils/lib/getSocketHost */ "./node_modules/@uppy/utils/lib/getSocketHost.js");

const {
  RateLimitedQueue
} = __webpack_require__(/*! @uppy/utils/lib/RateLimitedQueue */ "./node_modules/@uppy/utils/lib/RateLimitedQueue.js");

const MultipartUploader = __webpack_require__(/*! ./MultipartUploader */ "./node_modules/@uppy/aws-s3-multipart/lib/MultipartUploader.js");

function assertServerError(res) {
  if (res && res.error) {
    const error = new Error(res.message);
    Object.assign(error, res.error);
    throw error;
  }

  return res;
}

module.exports = (_temp = _class = class AwsS3Multipart extends BasePlugin {
  constructor(uppy, opts) {
    super(uppy, opts);
    this.type = 'uploader';
    this.id = this.opts.id || 'AwsS3Multipart';
    this.title = 'AWS S3 Multipart';
    this.client = new RequestClient(uppy, opts);
    const defaultOptions = {
      timeout: 30 * 1000,
      limit: 0,
      retryDelays: [0, 1000, 3000, 5000],
      createMultipartUpload: this.createMultipartUpload.bind(this),
      listParts: this.listParts.bind(this),
      prepareUploadParts: this.prepareUploadParts.bind(this),
      abortMultipartUpload: this.abortMultipartUpload.bind(this),
      completeMultipartUpload: this.completeMultipartUpload.bind(this)
    };
    this.opts = { ...defaultOptions,
      ...opts
    };
    this.upload = this.upload.bind(this);
    this.requests = new RateLimitedQueue(this.opts.limit);
    this.uploaders = Object.create(null);
    this.uploaderEvents = Object.create(null);
    this.uploaderSockets = Object.create(null);
  }
  /**
   * Clean up all references for a file's upload: the MultipartUploader instance,
   * any events related to the file, and the Companion WebSocket connection.
   *
   * Set `opts.abort` to tell S3 that the multipart upload is cancelled and must be removed.
   * This should be done when the user cancels the upload, not when the upload is completed or errored.
   */


  resetUploaderReferences(fileID, opts) {
    if (opts === void 0) {
      opts = {};
    }

    if (this.uploaders[fileID]) {
      this.uploaders[fileID].abort({
        really: opts.abort || false
      });
      this.uploaders[fileID] = null;
    }

    if (this.uploaderEvents[fileID]) {
      this.uploaderEvents[fileID].remove();
      this.uploaderEvents[fileID] = null;
    }

    if (this.uploaderSockets[fileID]) {
      this.uploaderSockets[fileID].close();
      this.uploaderSockets[fileID] = null;
    }
  }

  assertHost(method) {
    if (!this.opts.companionUrl) {
      throw new Error(`Expected a \`companionUrl\` option containing a Companion address, or if you are not using Companion, a custom \`${method}\` implementation.`);
    }
  }

  createMultipartUpload(file) {
    this.assertHost('createMultipartUpload');
    const metadata = {};
    Object.keys(file.meta).forEach(key => {
      if (file.meta[key] != null) {
        metadata[key] = file.meta[key].toString();
      }
    });
    return this.client.post('s3/multipart', {
      filename: file.name,
      type: file.type,
      metadata
    }).then(assertServerError);
  }

  listParts(file, _ref) {
    let {
      key,
      uploadId
    } = _ref;
    this.assertHost('listParts');
    const filename = encodeURIComponent(key);
    return this.client.get(`s3/multipart/${uploadId}?key=${filename}`).then(assertServerError);
  }

  prepareUploadParts(file, _ref2) {
    let {
      key,
      uploadId,
      partNumbers
    } = _ref2;
    this.assertHost('prepareUploadParts');
    const filename = encodeURIComponent(key);
    return this.client.get(`s3/multipart/${uploadId}/batch?key=${filename}&partNumbers=${partNumbers.join(',')}`).then(assertServerError);
  }

  completeMultipartUpload(file, _ref3) {
    let {
      key,
      uploadId,
      parts
    } = _ref3;
    this.assertHost('completeMultipartUpload');
    const filename = encodeURIComponent(key);
    const uploadIdEnc = encodeURIComponent(uploadId);
    return this.client.post(`s3/multipart/${uploadIdEnc}/complete?key=${filename}`, {
      parts
    }).then(assertServerError);
  }

  abortMultipartUpload(file, _ref4) {
    let {
      key,
      uploadId
    } = _ref4;
    this.assertHost('abortMultipartUpload');
    const filename = encodeURIComponent(key);
    const uploadIdEnc = encodeURIComponent(uploadId);
    return this.client.delete(`s3/multipart/${uploadIdEnc}?key=${filename}`).then(assertServerError);
  }

  uploadFile(file) {
    var _this = this;

    return new Promise((resolve, reject) => {
      const onStart = data => {
        const cFile = this.uppy.getFile(file.id);
        this.uppy.setFileState(file.id, {
          s3Multipart: { ...cFile.s3Multipart,
            key: data.key,
            uploadId: data.uploadId
          }
        });
      };

      const onProgress = (bytesUploaded, bytesTotal) => {
        this.uppy.emit('upload-progress', file, {
          uploader: this,
          bytesUploaded,
          bytesTotal
        });
      };

      const onError = err => {
        this.uppy.log(err);
        this.uppy.emit('upload-error', file, err);
        queuedRequest.done();
        this.resetUploaderReferences(file.id);
        reject(err);
      };

      const onSuccess = result => {
        const uploadResp = {
          body: { ...result
          },
          uploadURL: result.location
        };
        queuedRequest.done();
        this.resetUploaderReferences(file.id);
        const cFile = this.uppy.getFile(file.id);
        this.uppy.emit('upload-success', cFile || file, uploadResp);

        if (result.location) {
          this.uppy.log(`Download ${upload.file.name} from ${result.location}`);
        }

        resolve(upload);
      };

      const onPartComplete = part => {
        const cFile = this.uppy.getFile(file.id);

        if (!cFile) {
          return;
        }

        this.uppy.emit('s3-multipart:part-uploaded', cFile, part);
      };

      const upload = new MultipartUploader(file.data, {
        // .bind to pass the file object to each handler.
        createMultipartUpload: this.opts.createMultipartUpload.bind(this, file),
        listParts: this.opts.listParts.bind(this, file),
        prepareUploadParts: this.opts.prepareUploadParts.bind(this, file),
        completeMultipartUpload: this.opts.completeMultipartUpload.bind(this, file),
        abortMultipartUpload: this.opts.abortMultipartUpload.bind(this, file),
        getChunkSize: this.opts.getChunkSize ? this.opts.getChunkSize.bind(this) : null,
        onStart,
        onProgress,
        onError,
        onSuccess,
        onPartComplete,
        limit: this.opts.limit || 5,
        retryDelays: this.opts.retryDelays || [],
        ...file.s3Multipart
      });
      this.uploaders[file.id] = upload;
      this.uploaderEvents[file.id] = new EventTracker(this.uppy);
      let queuedRequest = this.requests.run(() => {
        if (!file.isPaused) {
          upload.start();
        } // Don't do anything here, the caller will take care of cancelling the upload itself
        // using resetUploaderReferences(). This is because resetUploaderReferences() has to be
        // called when this request is still in the queue, and has not been started yet, too. At
        // that point this cancellation function is not going to be called.


        return () => {};
      });
      this.onFileRemove(file.id, removed => {
        queuedRequest.abort();
        this.resetUploaderReferences(file.id, {
          abort: true
        });
        resolve(`upload ${removed.id} was removed`);
      });
      this.onCancelAll(file.id, function (_temp2) {
        let {
          reason
        } = _temp2 === void 0 ? {} : _temp2;

        if (reason === 'user') {
          queuedRequest.abort();

          _this.resetUploaderReferences(file.id, {
            abort: true
          });
        }

        resolve(`upload ${file.id} was canceled`);
      });
      this.onFilePause(file.id, isPaused => {
        if (isPaused) {
          // Remove this file from the queue so another file can start in its place.
          queuedRequest.abort();
          upload.pause();
        } else {
          // Resuming an upload should be queued, else you could pause and then
          // resume a queued upload to make it skip the queue.
          queuedRequest.abort();
          queuedRequest = this.requests.run(() => {
            upload.start();
            return () => {};
          });
        }
      });
      this.onPauseAll(file.id, () => {
        queuedRequest.abort();
        upload.pause();
      });
      this.onResumeAll(file.id, () => {
        queuedRequest.abort();

        if (file.error) {
          upload.abort();
        }

        queuedRequest = this.requests.run(() => {
          upload.start();
          return () => {};
        });
      }); // Don't double-emit upload-started for Golden Retriever-restored files that were already started

      if (!file.progress.uploadStarted || !file.isRestored) {
        this.uppy.emit('upload-started', file);
      }
    });
  }

  uploadRemote(file) {
    this.resetUploaderReferences(file.id); // Don't double-emit upload-started for Golden Retriever-restored files that were already started

    if (!file.progress.uploadStarted || !file.isRestored) {
      this.uppy.emit('upload-started', file);
    }

    if (file.serverToken) {
      return this.connectToServerSocket(file);
    }

    return new Promise((resolve, reject) => {
      const Client = file.remote.providerOptions.provider ? Provider : RequestClient;
      const client = new Client(this.uppy, file.remote.providerOptions);
      client.post(file.remote.url, { ...file.remote.body,
        protocol: 's3-multipart',
        size: file.data.size,
        metadata: file.meta
      }).then(res => {
        this.uppy.setFileState(file.id, {
          serverToken: res.token
        });
        file = this.uppy.getFile(file.id);
        return file;
      }).then(file => {
        return this.connectToServerSocket(file);
      }).then(() => {
        resolve();
      }).catch(err => {
        this.uppy.emit('upload-error', file, err);
        reject(err);
      });
    });
  }

  connectToServerSocket(file) {
    var _this2 = this;

    return new Promise((resolve, reject) => {
      const token = file.serverToken;
      const host = getSocketHost(file.remote.companionUrl);
      const socket = new Socket({
        target: `${host}/api/${token}`,
        autoOpen: false
      });
      this.uploaderSockets[file.id] = socket;
      this.uploaderEvents[file.id] = new EventTracker(this.uppy);
      this.onFileRemove(file.id, () => {
        queuedRequest.abort();
        socket.send('cancel', {});
        this.resetUploaderReferences(file.id, {
          abort: true
        });
        resolve(`upload ${file.id} was removed`);
      });
      this.onFilePause(file.id, isPaused => {
        if (isPaused) {
          // Remove this file from the queue so another file can start in its place.
          queuedRequest.abort();
          socket.send('pause', {});
        } else {
          // Resuming an upload should be queued, else you could pause and then
          // resume a queued upload to make it skip the queue.
          queuedRequest.abort();
          queuedRequest = this.requests.run(() => {
            socket.send('resume', {});
            return () => {};
          });
        }
      });
      this.onPauseAll(file.id, () => {
        queuedRequest.abort();
        socket.send('pause', {});
      });
      this.onCancelAll(file.id, function (_temp3) {
        let {
          reason
        } = _temp3 === void 0 ? {} : _temp3;

        if (reason === 'user') {
          queuedRequest.abort();
          socket.send('cancel', {});

          _this2.resetUploaderReferences(file.id);
        }

        resolve(`upload ${file.id} was canceled`);
      });
      this.onResumeAll(file.id, () => {
        queuedRequest.abort();

        if (file.error) {
          socket.send('pause', {});
        }

        queuedRequest = this.requests.run(() => {
          socket.send('resume', {});
        });
      });
      this.onRetry(file.id, () => {
        // Only do the retry if the upload is actually in progress;
        // else we could try to send these messages when the upload is still queued.
        // We may need a better check for this since the socket may also be closed
        // for other reasons, like network failures.
        if (socket.isOpen) {
          socket.send('pause', {});
          socket.send('resume', {});
        }
      });
      this.onRetryAll(file.id, () => {
        if (socket.isOpen) {
          socket.send('pause', {});
          socket.send('resume', {});
        }
      });
      socket.on('progress', progressData => emitSocketProgress(this, progressData, file));
      socket.on('error', errData => {
        this.uppy.emit('upload-error', file, new Error(errData.error));
        this.resetUploaderReferences(file.id);
        queuedRequest.done();
        reject(new Error(errData.error));
      });
      socket.on('success', data => {
        const uploadResp = {
          uploadURL: data.url
        };
        this.uppy.emit('upload-success', file, uploadResp);
        this.resetUploaderReferences(file.id);
        queuedRequest.done();
        resolve();
      });
      let queuedRequest = this.requests.run(() => {
        socket.open();

        if (file.isPaused) {
          socket.send('pause', {});
        }

        return () => {};
      });
    });
  }

  upload(fileIDs) {
    if (fileIDs.length === 0) return Promise.resolve();
    const promises = fileIDs.map(id => {
      const file = this.uppy.getFile(id);

      if (file.isRemote) {
        return this.uploadRemote(file);
      }

      return this.uploadFile(file);
    });
    return Promise.all(promises);
  }

  onFileRemove(fileID, cb) {
    this.uploaderEvents[fileID].on('file-removed', file => {
      if (fileID === file.id) cb(file.id);
    });
  }

  onFilePause(fileID, cb) {
    this.uploaderEvents[fileID].on('upload-pause', (targetFileID, isPaused) => {
      if (fileID === targetFileID) {
        // const isPaused = this.uppy.pauseResume(fileID)
        cb(isPaused);
      }
    });
  }

  onRetry(fileID, cb) {
    this.uploaderEvents[fileID].on('upload-retry', targetFileID => {
      if (fileID === targetFileID) {
        cb();
      }
    });
  }

  onRetryAll(fileID, cb) {
    this.uploaderEvents[fileID].on('retry-all', () => {
      if (!this.uppy.getFile(fileID)) return;
      cb();
    });
  }

  onPauseAll(fileID, cb) {
    this.uploaderEvents[fileID].on('pause-all', () => {
      if (!this.uppy.getFile(fileID)) return;
      cb();
    });
  }

  onCancelAll(fileID, eventHandler) {
    var _this3 = this;

    this.uploaderEvents[fileID].on('cancel-all', function () {
      if (!_this3.uppy.getFile(fileID)) return;
      eventHandler(...arguments);
    });
  }

  onResumeAll(fileID, cb) {
    this.uploaderEvents[fileID].on('resume-all', () => {
      if (!this.uppy.getFile(fileID)) return;
      cb();
    });
  }

  install() {
    const {
      capabilities
    } = this.uppy.getState();
    this.uppy.setState({
      capabilities: { ...capabilities,
        resumableUploads: true
      }
    });
    this.uppy.addUploader(this.upload);
  }

  uninstall() {
    const {
      capabilities
    } = this.uppy.getState();
    this.uppy.setState({
      capabilities: { ...capabilities,
        resumableUploads: false
      }
    });
    this.uppy.removeUploader(this.upload);
  }

}, _class.VERSION = "2.3.0", _temp);

/***/ }),

/***/ "./node_modules/@uppy/companion-client/lib/AuthError.js":
/*!**************************************************************!*\
  !*** ./node_modules/@uppy/companion-client/lib/AuthError.js ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";


class AuthError extends Error {
  constructor() {
    super('Authorization required');
    this.name = 'AuthError';
    this.isAuthError = true;
  }

}

module.exports = AuthError;

/***/ }),

/***/ "./node_modules/@uppy/companion-client/lib/Provider.js":
/*!*************************************************************!*\
  !*** ./node_modules/@uppy/companion-client/lib/Provider.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const RequestClient = __webpack_require__(/*! ./RequestClient */ "./node_modules/@uppy/companion-client/lib/RequestClient.js");

const tokenStorage = __webpack_require__(/*! ./tokenStorage */ "./node_modules/@uppy/companion-client/lib/tokenStorage.js");

const getName = id => {
  return id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
};

module.exports = class Provider extends RequestClient {
  constructor(uppy, opts) {
    super(uppy, opts);
    this.provider = opts.provider;
    this.id = this.provider;
    this.name = this.opts.name || getName(this.id);
    this.pluginId = this.opts.pluginId;
    this.tokenKey = `companion-${this.pluginId}-auth-token`;
    this.companionKeysParams = this.opts.companionKeysParams;
    this.preAuthToken = null;
  }

  headers() {
    return Promise.all([super.headers(), this.getAuthToken()]).then(_ref => {
      let [headers, token] = _ref;
      const authHeaders = {};

      if (token) {
        authHeaders['uppy-auth-token'] = token;
      }

      if (this.companionKeysParams) {
        authHeaders['uppy-credentials-params'] = btoa(JSON.stringify({
          params: this.companionKeysParams
        }));
      }

      return { ...headers,
        ...authHeaders
      };
    });
  }

  onReceiveResponse(response) {
    response = super.onReceiveResponse(response);
    const plugin = this.uppy.getPlugin(this.pluginId);
    const oldAuthenticated = plugin.getPluginState().authenticated;
    const authenticated = oldAuthenticated ? response.status !== 401 : response.status < 400;
    plugin.setPluginState({
      authenticated
    });
    return response;
  }

  setAuthToken(token) {
    return this.uppy.getPlugin(this.pluginId).storage.setItem(this.tokenKey, token);
  }

  getAuthToken() {
    return this.uppy.getPlugin(this.pluginId).storage.getItem(this.tokenKey);
  }
  /**
   * Ensure we have a preauth token if necessary. Attempts to fetch one if we don't,
   * or rejects if loading one fails.
   */


  async ensurePreAuth() {
    if (this.companionKeysParams && !this.preAuthToken) {
      await this.fetchPreAuthToken();

      if (!this.preAuthToken) {
        throw new Error('Could not load authentication data required for third-party login. Please try again later.');
      }
    }
  }

  authUrl(queries) {
    if (queries === void 0) {
      queries = {};
    }

    const params = new URLSearchParams(queries);

    if (this.preAuthToken) {
      params.set('uppyPreAuthToken', this.preAuthToken);
    }

    return `${this.hostname}/${this.id}/connect?${params}`;
  }

  fileUrl(id) {
    return `${this.hostname}/${this.id}/get/${id}`;
  }

  async fetchPreAuthToken() {
    if (!this.companionKeysParams) {
      return;
    }

    try {
      const res = await this.post(`${this.id}/preauth/`, {
        params: this.companionKeysParams
      });
      this.preAuthToken = res.token;
    } catch (err) {
      this.uppy.log(`[CompanionClient] unable to fetch preAuthToken ${err}`, 'warning');
    }
  }

  list(directory) {
    return this.get(`${this.id}/list/${directory || ''}`);
  }

  logout() {
    return this.get(`${this.id}/logout`).then(response => Promise.all([response, this.uppy.getPlugin(this.pluginId).storage.removeItem(this.tokenKey)])).then(_ref2 => {
      let [response] = _ref2;
      return response;
    });
  }

  static initPlugin(plugin, opts, defaultOpts) {
    plugin.type = 'acquirer';
    plugin.files = [];

    if (defaultOpts) {
      plugin.opts = { ...defaultOpts,
        ...opts
      };
    }

    if (opts.serverUrl || opts.serverPattern) {
      throw new Error('`serverUrl` and `serverPattern` have been renamed to `companionUrl` and `companionAllowedHosts` respectively in the 0.30.5 release. Please consult the docs (for example, https://uppy.io/docs/instagram/ for the Instagram plugin) and use the updated options.`');
    }

    if (opts.companionAllowedHosts) {
      const pattern = opts.companionAllowedHosts; // validate companionAllowedHosts param

      if (typeof pattern !== 'string' && !Array.isArray(pattern) && !(pattern instanceof RegExp)) {
        throw new TypeError(`${plugin.id}: the option "companionAllowedHosts" must be one of string, Array, RegExp`);
      }

      plugin.opts.companionAllowedHosts = pattern;
    } else if (/^(?!https?:\/\/).*$/i.test(opts.companionUrl)) {
      // does not start with https://
      plugin.opts.companionAllowedHosts = `https://${opts.companionUrl.replace(/^\/\//, '')}`;
    } else {
      plugin.opts.companionAllowedHosts = new URL(opts.companionUrl).origin;
    }

    plugin.storage = plugin.opts.storage || tokenStorage;
  }

};

/***/ }),

/***/ "./node_modules/@uppy/companion-client/lib/RequestClient.js":
/*!******************************************************************!*\
  !*** ./node_modules/@uppy/companion-client/lib/RequestClient.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _class, _getPostResponseFunc, _getUrl, _errorHandler, _temp;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const fetchWithNetworkError = __webpack_require__(/*! @uppy/utils/lib/fetchWithNetworkError */ "./node_modules/@uppy/utils/lib/fetchWithNetworkError.js");

const ErrorWithCause = __webpack_require__(/*! @uppy/utils/lib/ErrorWithCause */ "./node_modules/@uppy/utils/lib/ErrorWithCause.js");

const AuthError = __webpack_require__(/*! ./AuthError */ "./node_modules/@uppy/companion-client/lib/AuthError.js"); // Remove the trailing slash so we can always safely append /xyz.


function stripSlash(url) {
  return url.replace(/\/$/, '');
}

async function handleJSONResponse(res) {
  if (res.status === 401) {
    throw new AuthError();
  }

  const jsonPromise = res.json();

  if (res.status < 200 || res.status > 300) {
    let errMsg = `Failed request with status: ${res.status}. ${res.statusText}`;

    try {
      const errData = await jsonPromise;
      errMsg = errData.message ? `${errMsg} message: ${errData.message}` : errMsg;
      errMsg = errData.requestId ? `${errMsg} request-Id: ${errData.requestId}` : errMsg;
    } finally {
      // eslint-disable-next-line no-unsafe-finally
      throw new Error(errMsg);
    }
  }

  return jsonPromise;
}

module.exports = (_temp = (_getPostResponseFunc = /*#__PURE__*/_classPrivateFieldLooseKey("getPostResponseFunc"), _getUrl = /*#__PURE__*/_classPrivateFieldLooseKey("getUrl"), _errorHandler = /*#__PURE__*/_classPrivateFieldLooseKey("errorHandler"), _class = class RequestClient {
  // eslint-disable-next-line global-require
  constructor(uppy, opts) {
    Object.defineProperty(this, _errorHandler, {
      value: _errorHandler2
    });
    Object.defineProperty(this, _getUrl, {
      value: _getUrl2
    });
    Object.defineProperty(this, _getPostResponseFunc, {
      writable: true,
      value: skip => response => skip ? response : this.onReceiveResponse(response)
    });
    this.uppy = uppy;
    this.opts = opts;
    this.onReceiveResponse = this.onReceiveResponse.bind(this);
    this.allowedHeaders = ['accept', 'content-type', 'uppy-auth-token'];
    this.preflightDone = false;
  }

  get hostname() {
    const {
      companion
    } = this.uppy.getState();
    const host = this.opts.companionUrl;
    return stripSlash(companion && companion[host] ? companion[host] : host);
  }

  headers() {
    const userHeaders = this.opts.companionHeaders || {};
    return Promise.resolve({ ...RequestClient.defaultHeaders,
      ...userHeaders
    });
  }

  onReceiveResponse(response) {
    const state = this.uppy.getState();
    const companion = state.companion || {};
    const host = this.opts.companionUrl;
    const {
      headers
    } = response; // Store the self-identified domain name for the Companion instance we just hit.

    if (headers.has('i-am') && headers.get('i-am') !== companion[host]) {
      this.uppy.setState({
        companion: { ...companion,
          [host]: headers.get('i-am')
        }
      });
    }

    return response;
  }

  preflight(path) {
    if (this.preflightDone) {
      return Promise.resolve(this.allowedHeaders.slice());
    }

    return fetch(_classPrivateFieldLooseBase(this, _getUrl)[_getUrl](path), {
      method: 'OPTIONS'
    }).then(response => {
      if (response.headers.has('access-control-allow-headers')) {
        this.allowedHeaders = response.headers.get('access-control-allow-headers').split(',').map(headerName => headerName.trim().toLowerCase());
      }

      this.preflightDone = true;
      return this.allowedHeaders.slice();
    }).catch(err => {
      this.uppy.log(`[CompanionClient] unable to make preflight request ${err}`, 'warning');
      this.preflightDone = true;
      return this.allowedHeaders.slice();
    });
  }

  preflightAndHeaders(path) {
    return Promise.all([this.preflight(path), this.headers()]).then(_ref => {
      let [allowedHeaders, headers] = _ref;
      // filter to keep only allowed Headers
      Object.keys(headers).forEach(header => {
        if (!allowedHeaders.includes(header.toLowerCase())) {
          this.uppy.log(`[CompanionClient] excluding disallowed header ${header}`);
          delete headers[header]; // eslint-disable-line no-param-reassign
        }
      });
      return headers;
    });
  }

  get(path, skipPostResponse) {
    const method = 'get';
    return this.preflightAndHeaders(path).then(headers => fetchWithNetworkError(_classPrivateFieldLooseBase(this, _getUrl)[_getUrl](path), {
      method,
      headers,
      credentials: this.opts.companionCookiesRule || 'same-origin'
    })).then(_classPrivateFieldLooseBase(this, _getPostResponseFunc)[_getPostResponseFunc](skipPostResponse)).then(handleJSONResponse).catch(_classPrivateFieldLooseBase(this, _errorHandler)[_errorHandler](method, path));
  }

  post(path, data, skipPostResponse) {
    const method = 'post';
    return this.preflightAndHeaders(path).then(headers => fetchWithNetworkError(_classPrivateFieldLooseBase(this, _getUrl)[_getUrl](path), {
      method,
      headers,
      credentials: this.opts.companionCookiesRule || 'same-origin',
      body: JSON.stringify(data)
    })).then(_classPrivateFieldLooseBase(this, _getPostResponseFunc)[_getPostResponseFunc](skipPostResponse)).then(handleJSONResponse).catch(_classPrivateFieldLooseBase(this, _errorHandler)[_errorHandler](method, path));
  }

  delete(path, data, skipPostResponse) {
    const method = 'delete';
    return this.preflightAndHeaders(path).then(headers => fetchWithNetworkError(`${this.hostname}/${path}`, {
      method,
      headers,
      credentials: this.opts.companionCookiesRule || 'same-origin',
      body: data ? JSON.stringify(data) : null
    })).then(_classPrivateFieldLooseBase(this, _getPostResponseFunc)[_getPostResponseFunc](skipPostResponse)).then(handleJSONResponse).catch(_classPrivateFieldLooseBase(this, _errorHandler)[_errorHandler](method, path));
  }

}), _class.VERSION = "2.1.0", _class.defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'Uppy-Versions': `@uppy/companion-client=${_class.VERSION}`
}, _temp);

function _getUrl2(url) {
  if (/^(https?:|)\/\//.test(url)) {
    return url;
  }

  return `${this.hostname}/${url}`;
}

function _errorHandler2(method, path) {
  return err => {
    var _err;

    if (!((_err = err) != null && _err.isAuthError)) {
      // eslint-disable-next-line no-param-reassign
      err = new ErrorWithCause(`Could not ${method} ${_classPrivateFieldLooseBase(this, _getUrl)[_getUrl](path)}`, {
        cause: err
      });
    }

    return Promise.reject(err);
  };
}

/***/ }),

/***/ "./node_modules/@uppy/companion-client/lib/SearchProvider.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@uppy/companion-client/lib/SearchProvider.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const RequestClient = __webpack_require__(/*! ./RequestClient */ "./node_modules/@uppy/companion-client/lib/RequestClient.js");

const getName = id => {
  return id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
};

module.exports = class SearchProvider extends RequestClient {
  constructor(uppy, opts) {
    super(uppy, opts);
    this.provider = opts.provider;
    this.id = this.provider;
    this.name = this.opts.name || getName(this.id);
    this.pluginId = this.opts.pluginId;
  }

  fileUrl(id) {
    return `${this.hostname}/search/${this.id}/get/${id}`;
  }

  search(text, queries) {
    queries = queries ? `&${queries}` : '';
    return this.get(`search/${this.id}/list?q=${encodeURIComponent(text)}${queries}`);
  }

};

/***/ }),

/***/ "./node_modules/@uppy/companion-client/lib/Socket.js":
/*!***********************************************************!*\
  !*** ./node_modules/@uppy/companion-client/lib/Socket.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _queued, _emitter, _isOpen, _socket, _handleMessage;

let _Symbol$for, _Symbol$for2;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const ee = __webpack_require__(/*! namespace-emitter */ "./node_modules/namespace-emitter/index.js");

module.exports = (_queued = /*#__PURE__*/_classPrivateFieldLooseKey("queued"), _emitter = /*#__PURE__*/_classPrivateFieldLooseKey("emitter"), _isOpen = /*#__PURE__*/_classPrivateFieldLooseKey("isOpen"), _socket = /*#__PURE__*/_classPrivateFieldLooseKey("socket"), _handleMessage = /*#__PURE__*/_classPrivateFieldLooseKey("handleMessage"), _Symbol$for = Symbol.for('uppy test: getSocket'), _Symbol$for2 = Symbol.for('uppy test: getQueued'), class UppySocket {
  constructor(opts) {
    Object.defineProperty(this, _queued, {
      writable: true,
      value: []
    });
    Object.defineProperty(this, _emitter, {
      writable: true,
      value: ee()
    });
    Object.defineProperty(this, _isOpen, {
      writable: true,
      value: false
    });
    Object.defineProperty(this, _socket, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _handleMessage, {
      writable: true,
      value: e => {
        try {
          const message = JSON.parse(e.data);
          this.emit(message.action, message.payload);
        } catch (err) {
          // TODO: use a more robust error handler.
          console.log(err); // eslint-disable-line no-console
        }
      }
    });
    this.opts = opts;

    if (!opts || opts.autoOpen !== false) {
      this.open();
    }
  }

  get isOpen() {
    return _classPrivateFieldLooseBase(this, _isOpen)[_isOpen];
  }

  [_Symbol$for]() {
    return _classPrivateFieldLooseBase(this, _socket)[_socket];
  }

  [_Symbol$for2]() {
    return _classPrivateFieldLooseBase(this, _queued)[_queued];
  }

  open() {
    _classPrivateFieldLooseBase(this, _socket)[_socket] = new WebSocket(this.opts.target);

    _classPrivateFieldLooseBase(this, _socket)[_socket].onopen = () => {
      _classPrivateFieldLooseBase(this, _isOpen)[_isOpen] = true;

      while (_classPrivateFieldLooseBase(this, _queued)[_queued].length > 0 && _classPrivateFieldLooseBase(this, _isOpen)[_isOpen]) {
        const first = _classPrivateFieldLooseBase(this, _queued)[_queued].shift();

        this.send(first.action, first.payload);
      }
    };

    _classPrivateFieldLooseBase(this, _socket)[_socket].onclose = () => {
      _classPrivateFieldLooseBase(this, _isOpen)[_isOpen] = false;
    };

    _classPrivateFieldLooseBase(this, _socket)[_socket].onmessage = _classPrivateFieldLooseBase(this, _handleMessage)[_handleMessage];
  }

  close() {
    var _classPrivateFieldLoo;

    (_classPrivateFieldLoo = _classPrivateFieldLooseBase(this, _socket)[_socket]) == null ? void 0 : _classPrivateFieldLoo.close();
  }

  send(action, payload) {
    // attach uuid
    if (!_classPrivateFieldLooseBase(this, _isOpen)[_isOpen]) {
      _classPrivateFieldLooseBase(this, _queued)[_queued].push({
        action,
        payload
      });

      return;
    }

    _classPrivateFieldLooseBase(this, _socket)[_socket].send(JSON.stringify({
      action,
      payload
    }));
  }

  on(action, handler) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].on(action, handler);
  }

  emit(action, payload) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].emit(action, payload);
  }

  once(action, handler) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].once(action, handler);
  }

});

/***/ }),

/***/ "./node_modules/@uppy/companion-client/lib/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@uppy/companion-client/lib/index.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/**
 * Manages communications with Companion
 */

const RequestClient = __webpack_require__(/*! ./RequestClient */ "./node_modules/@uppy/companion-client/lib/RequestClient.js");

const Provider = __webpack_require__(/*! ./Provider */ "./node_modules/@uppy/companion-client/lib/Provider.js");

const SearchProvider = __webpack_require__(/*! ./SearchProvider */ "./node_modules/@uppy/companion-client/lib/SearchProvider.js");

const Socket = __webpack_require__(/*! ./Socket */ "./node_modules/@uppy/companion-client/lib/Socket.js");

module.exports = {
  RequestClient,
  Provider,
  SearchProvider,
  Socket
};

/***/ }),

/***/ "./node_modules/@uppy/companion-client/lib/tokenStorage.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@uppy/companion-client/lib/tokenStorage.js ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";

/**
 * This module serves as an Async wrapper for LocalStorage
 */

module.exports.setItem = (key, value) => {
  return new Promise(resolve => {
    localStorage.setItem(key, value);
    resolve();
  });
};

module.exports.getItem = key => {
  return Promise.resolve(localStorage.getItem(key));
};

module.exports.removeItem = key => {
  return new Promise(resolve => {
    localStorage.removeItem(key);
    resolve();
  });
};

/***/ }),

/***/ "./node_modules/@uppy/core/lib/BasePlugin.js":
/*!***************************************************!*\
  !*** ./node_modules/@uppy/core/lib/BasePlugin.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Core plugin logic that all plugins share.
 *
 * BasePlugin does not contain DOM rendering so it can be used for plugins
 * without a user interface.
 *
 * See `Plugin` for the extended version with Preact rendering for interfaces.
 */
const Translator = __webpack_require__(/*! @uppy/utils/lib/Translator */ "./node_modules/@uppy/utils/lib/Translator.js");

module.exports = class BasePlugin {
  constructor(uppy, opts) {
    if (opts === void 0) {
      opts = {};
    }

    this.uppy = uppy;
    this.opts = opts;
  }

  getPluginState() {
    const {
      plugins
    } = this.uppy.getState();
    return plugins[this.id] || {};
  }

  setPluginState(update) {
    const {
      plugins
    } = this.uppy.getState();
    this.uppy.setState({
      plugins: { ...plugins,
        [this.id]: { ...plugins[this.id],
          ...update
        }
      }
    });
  }

  setOptions(newOpts) {
    this.opts = { ...this.opts,
      ...newOpts
    };
    this.setPluginState(); // so that UI re-renders with new options

    this.i18nInit();
  }

  i18nInit() {
    const translator = new Translator([this.defaultLocale, this.uppy.locale, this.opts.locale]);
    this.i18n = translator.translate.bind(translator);
    this.i18nArray = translator.translateArray.bind(translator);
    this.setPluginState(); // so that UI re-renders and we see the updated locale
  }
  /**
   * Extendable methods
   * ==================
   * These methods are here to serve as an overview of the extendable methods as well as
   * making them not conditional in use, such as `if (this.afterUpdate)`.
   */
  // eslint-disable-next-line class-methods-use-this


  addTarget() {
    throw new Error('Extend the addTarget method to add your plugin to another plugin\'s target');
  } // eslint-disable-next-line class-methods-use-this


  install() {} // eslint-disable-next-line class-methods-use-this


  uninstall() {}
  /**
   * Called when plugin is mounted, whether in DOM or into another plugin.
   * Needed because sometimes plugins are mounted separately/after `install`,
   * so this.el and this.parent might not be available in `install`.
   * This is the case with @uppy/react plugins, for example.
   */


  render() {
    throw new Error('Extend the render method to add your plugin to a DOM element');
  } // TODO: remove in the next major version. It's not feasible to
  // try to use plugins with other frameworks.
  // eslint-disable-next-line class-methods-use-this


  update() {} // Called after every state update, after everything's mounted. Debounced.
  // eslint-disable-next-line class-methods-use-this


  afterUpdate() {}

};

/***/ }),

/***/ "./node_modules/@uppy/core/lib/Restricter.js":
/*!***************************************************!*\
  !*** ./node_modules/@uppy/core/lib/Restricter.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* eslint-disable max-classes-per-file, class-methods-use-this */

/* global AggregateError */
const prettierBytes = __webpack_require__(/*! @transloadit/prettier-bytes */ "./node_modules/@transloadit/prettier-bytes/prettierBytes.js");

const match = __webpack_require__(/*! mime-match */ "./node_modules/mime-match/index.js");

const defaultOptions = {
  maxFileSize: null,
  minFileSize: null,
  maxTotalFileSize: null,
  maxNumberOfFiles: null,
  minNumberOfFiles: null,
  allowedFileTypes: null,
  requiredMetaFields: []
};

class RestrictionError extends Error {
  constructor() {
    super(...arguments);
    this.isRestriction = true;
  }

}

if (typeof AggregateError === 'undefined') {
  // eslint-disable-next-line no-global-assign
  // TODO: remove this "polyfill" in the next major.
  globalThis.AggregateError = class AggregateError extends Error {
    constructor(errors, message) {
      super(message);
      this.errors = errors;
    }

  };
}

class Restricter {
  constructor(getOpts, i18n) {
    this.i18n = i18n;

    this.getOpts = () => {
      const opts = getOpts();

      if (opts.restrictions.allowedFileTypes != null && !Array.isArray(opts.restrictions.allowedFileTypes)) {
        throw new TypeError('`restrictions.allowedFileTypes` must be an array');
      }

      return opts;
    };
  }

  validate(file, files) {
    const {
      maxFileSize,
      minFileSize,
      maxTotalFileSize,
      maxNumberOfFiles,
      allowedFileTypes
    } = this.getOpts().restrictions;

    if (maxNumberOfFiles && files.length + 1 > maxNumberOfFiles) {
      throw new RestrictionError(`${this.i18n('youCanOnlyUploadX', {
        smart_count: maxNumberOfFiles
      })}`);
    }

    if (allowedFileTypes) {
      const isCorrectFileType = allowedFileTypes.some(type => {
        // check if this is a mime-type
        if (type.includes('/')) {
          if (!file.type) return false;
          return match(file.type.replace(/;.*?$/, ''), type);
        } // otherwise this is likely an extension


        if (type[0] === '.' && file.extension) {
          return file.extension.toLowerCase() === type.slice(1).toLowerCase();
        }

        return false;
      });

      if (!isCorrectFileType) {
        const allowedFileTypesString = allowedFileTypes.join(', ');
        throw new RestrictionError(this.i18n('youCanOnlyUploadFileTypes', {
          types: allowedFileTypesString
        }));
      }
    } // We can't check maxTotalFileSize if the size is unknown.


    if (maxTotalFileSize && file.size != null) {
      const totalFilesSize = files.reduce((total, f) => total + f.size, file.size);

      if (totalFilesSize > maxTotalFileSize) {
        throw new RestrictionError(this.i18n('exceedsSize', {
          size: prettierBytes(maxTotalFileSize),
          file: file.name
        }));
      }
    } // We can't check maxFileSize if the size is unknown.


    if (maxFileSize && file.size != null && file.size > maxFileSize) {
      throw new RestrictionError(this.i18n('exceedsSize', {
        size: prettierBytes(maxFileSize),
        file: file.name
      }));
    } // We can't check minFileSize if the size is unknown.


    if (minFileSize && file.size != null && file.size < minFileSize) {
      throw new RestrictionError(this.i18n('inferiorSize', {
        size: prettierBytes(minFileSize)
      }));
    }
  }

  validateMinNumberOfFiles(files) {
    const {
      minNumberOfFiles
    } = this.getOpts().restrictions;

    if (Object.keys(files).length < minNumberOfFiles) {
      throw new RestrictionError(this.i18n('youHaveToAtLeastSelectX', {
        smart_count: minNumberOfFiles
      }));
    }
  }

  getMissingRequiredMetaFields(file) {
    const error = new RestrictionError(this.i18n('missingRequiredMetaFieldOnFile', {
      fileName: file.name
    }));
    const {
      requiredMetaFields
    } = this.getOpts().restrictions; // TODO: migrate to Object.hasOwn in the next major.

    const own = Object.prototype.hasOwnProperty;
    const missingFields = [];

    for (const field of requiredMetaFields) {
      if (!own.call(file.meta, field) || file.meta[field] === '') {
        missingFields.push(field);
      }
    }

    return {
      missingFields,
      error
    };
  }

}

module.exports = {
  Restricter,
  defaultOptions,
  RestrictionError
};

/***/ }),

/***/ "./node_modules/@uppy/core/lib/UIPlugin.js":
/*!*************************************************!*\
  !*** ./node_modules/@uppy/core/lib/UIPlugin.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const {
  render
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const findDOMElement = __webpack_require__(/*! @uppy/utils/lib/findDOMElement */ "./node_modules/@uppy/utils/lib/findDOMElement.js");

const getTextDirection = __webpack_require__(/*! @uppy/utils/lib/getTextDirection */ "./node_modules/@uppy/utils/lib/getTextDirection.js");

const BasePlugin = __webpack_require__(/*! ./BasePlugin */ "./node_modules/@uppy/core/lib/BasePlugin.js");
/**
 * Defer a frequent call to the microtask queue.
 *
 * @param {() => T} fn
 * @returns {Promise<T>}
 */


function debounce(fn) {
  let calling = null;
  let latestArgs = null;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    latestArgs = args;

    if (!calling) {
      calling = Promise.resolve().then(() => {
        calling = null; // At this point `args` may be different from the most
        // recent state, if multiple calls happened since this task
        // was queued. So we use the `latestArgs`, which definitely
        // is the most recent call.

        return fn(...latestArgs);
      });
    }

    return calling;
  };
}
/**
 * UIPlugin is the extended version of BasePlugin to incorporate rendering with Preact.
 * Use this for plugins that need a user interface.
 *
 * For plugins without an user interface, see BasePlugin.
 */


var _updateUI = /*#__PURE__*/_classPrivateFieldLooseKey("updateUI");

class UIPlugin extends BasePlugin {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, _updateUI, {
      writable: true,
      value: void 0
    });
  }

  /**
   * Check if supplied `target` is a DOM element or an `object`.
   * If it’s an object — target is a plugin, and we search `plugins`
   * for a plugin with same name and return its target.
   */
  mount(target, plugin) {
    const callerPluginName = plugin.id;
    const targetElement = findDOMElement(target);

    if (targetElement) {
      this.isTargetDOMEl = true; // When target is <body> with a single <div> element,
      // Preact thinks it’s the Uppy root element in there when doing a diff,
      // and destroys it. So we are creating a fragment (could be empty div)

      const uppyRootElement = document.createElement('div');
      uppyRootElement.classList.add('uppy-Root'); // API for plugins that require a synchronous rerender.

      _classPrivateFieldLooseBase(this, _updateUI)[_updateUI] = debounce(state => {
        // plugin could be removed, but this.rerender is debounced below,
        // so it could still be called even after uppy.removePlugin or uppy.close
        // hence the check
        if (!this.uppy.getPlugin(this.id)) return;
        render(this.render(state), uppyRootElement);
        this.afterUpdate();
      });
      this.uppy.log(`Installing ${callerPluginName} to a DOM element '${target}'`);

      if (this.opts.replaceTargetContent) {
        // Doing render(h(null), targetElement), which should have been
        // a better way, since because the component might need to do additional cleanup when it is removed,
        // stopped working — Preact just adds null into target, not replacing
        targetElement.innerHTML = '';
      }

      render(this.render(this.uppy.getState()), uppyRootElement);
      this.el = uppyRootElement;
      targetElement.appendChild(uppyRootElement); // Set the text direction if the page has not defined one.

      uppyRootElement.dir = this.opts.direction || getTextDirection(uppyRootElement) || 'ltr';
      this.onMount();
      return this.el;
    }

    let targetPlugin;

    if (typeof target === 'object' && target instanceof UIPlugin) {
      // Targeting a plugin *instance*
      targetPlugin = target;
    } else if (typeof target === 'function') {
      // Targeting a plugin type
      const Target = target; // Find the target plugin instance.

      this.uppy.iteratePlugins(p => {
        if (p instanceof Target) {
          targetPlugin = p;
          return false;
        }
      });
    }

    if (targetPlugin) {
      this.uppy.log(`Installing ${callerPluginName} to ${targetPlugin.id}`);
      this.parent = targetPlugin;
      this.el = targetPlugin.addTarget(plugin);
      this.onMount();
      return this.el;
    }

    this.uppy.log(`Not installing ${callerPluginName}`);
    let message = `Invalid target option given to ${callerPluginName}.`;

    if (typeof target === 'function') {
      message += ' The given target is not a Plugin class. ' + 'Please check that you\'re not specifying a React Component instead of a plugin. ' + 'If you are using @uppy/* packages directly, make sure you have only 1 version of @uppy/core installed: ' + 'run `npm ls @uppy/core` on the command line and verify that all the versions match and are deduped correctly.';
    } else {
      message += 'If you meant to target an HTML element, please make sure that the element exists. ' + 'Check that the <script> tag initializing Uppy is right before the closing </body> tag at the end of the page. ' + '(see https://github.com/transloadit/uppy/issues/1042)\n\n' + 'If you meant to target a plugin, please confirm that your `import` statements or `require` calls are correct.';
    }

    throw new Error(message);
  }

  update(state) {
    if (this.el != null) {
      var _classPrivateFieldLoo, _classPrivateFieldLoo2;

      (_classPrivateFieldLoo = (_classPrivateFieldLoo2 = _classPrivateFieldLooseBase(this, _updateUI))[_updateUI]) == null ? void 0 : _classPrivateFieldLoo.call(_classPrivateFieldLoo2, state);
    }
  }

  unmount() {
    if (this.isTargetDOMEl) {
      var _this$el;

      (_this$el = this.el) == null ? void 0 : _this$el.remove();
    }

    this.onUnmount();
  } // eslint-disable-next-line class-methods-use-this


  onMount() {} // eslint-disable-next-line class-methods-use-this


  onUnmount() {}

}

module.exports = UIPlugin;

/***/ }),

/***/ "./node_modules/@uppy/core/lib/Uppy.js":
/*!*********************************************!*\
  !*** ./node_modules/@uppy/core/lib/Uppy.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* eslint-disable max-classes-per-file */

/* global AggregateError */


let _Symbol$for, _Symbol$for2;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const Translator = __webpack_require__(/*! @uppy/utils/lib/Translator */ "./node_modules/@uppy/utils/lib/Translator.js");

const ee = __webpack_require__(/*! namespace-emitter */ "./node_modules/namespace-emitter/index.js");

const {
  nanoid
} = __webpack_require__(/*! nanoid/non-secure */ "./node_modules/nanoid/non-secure/index.cjs");

const throttle = __webpack_require__(/*! lodash.throttle */ "./node_modules/lodash.throttle/index.js");

const DefaultStore = __webpack_require__(/*! @uppy/store-default */ "./node_modules/@uppy/store-default/lib/index.js");

const getFileType = __webpack_require__(/*! @uppy/utils/lib/getFileType */ "./node_modules/@uppy/utils/lib/getFileType.js");

const getFileNameAndExtension = __webpack_require__(/*! @uppy/utils/lib/getFileNameAndExtension */ "./node_modules/@uppy/utils/lib/getFileNameAndExtension.js");

const generateFileID = __webpack_require__(/*! @uppy/utils/lib/generateFileID */ "./node_modules/@uppy/utils/lib/generateFileID.js");

const supportsUploadProgress = __webpack_require__(/*! ./supportsUploadProgress */ "./node_modules/@uppy/core/lib/supportsUploadProgress.js");

const getFileName = __webpack_require__(/*! ./getFileName */ "./node_modules/@uppy/core/lib/getFileName.js");

const {
  justErrorsLogger,
  debugLogger
} = __webpack_require__(/*! ./loggers */ "./node_modules/@uppy/core/lib/loggers.js");

const {
  Restricter,
  defaultOptions: defaultRestrictionOptions,
  RestrictionError
} = __webpack_require__(/*! ./Restricter */ "./node_modules/@uppy/core/lib/Restricter.js");

const locale = __webpack_require__(/*! ./locale */ "./node_modules/@uppy/core/lib/locale.js"); // Exported from here.

/**
 * Uppy Core module.
 * Manages plugins, state updates, acts as an event bus,
 * adds/removes files and metadata.
 */


var _plugins = /*#__PURE__*/_classPrivateFieldLooseKey("plugins");

var _restricter = /*#__PURE__*/_classPrivateFieldLooseKey("restricter");

var _storeUnsubscribe = /*#__PURE__*/_classPrivateFieldLooseKey("storeUnsubscribe");

var _emitter = /*#__PURE__*/_classPrivateFieldLooseKey("emitter");

var _preProcessors = /*#__PURE__*/_classPrivateFieldLooseKey("preProcessors");

var _uploaders = /*#__PURE__*/_classPrivateFieldLooseKey("uploaders");

var _postProcessors = /*#__PURE__*/_classPrivateFieldLooseKey("postProcessors");

var _informAndEmit = /*#__PURE__*/_classPrivateFieldLooseKey("informAndEmit");

var _checkRequiredMetaFieldsOnFile = /*#__PURE__*/_classPrivateFieldLooseKey("checkRequiredMetaFieldsOnFile");

var _checkRequiredMetaFields = /*#__PURE__*/_classPrivateFieldLooseKey("checkRequiredMetaFields");

var _assertNewUploadAllowed = /*#__PURE__*/_classPrivateFieldLooseKey("assertNewUploadAllowed");

var _checkAndCreateFileStateObject = /*#__PURE__*/_classPrivateFieldLooseKey("checkAndCreateFileStateObject");

var _startIfAutoProceed = /*#__PURE__*/_classPrivateFieldLooseKey("startIfAutoProceed");

var _addListeners = /*#__PURE__*/_classPrivateFieldLooseKey("addListeners");

var _updateOnlineStatus = /*#__PURE__*/_classPrivateFieldLooseKey("updateOnlineStatus");

var _createUpload = /*#__PURE__*/_classPrivateFieldLooseKey("createUpload");

var _getUpload = /*#__PURE__*/_classPrivateFieldLooseKey("getUpload");

var _removeUpload = /*#__PURE__*/_classPrivateFieldLooseKey("removeUpload");

var _runUpload = /*#__PURE__*/_classPrivateFieldLooseKey("runUpload");

_Symbol$for = Symbol.for('uppy test: getPlugins');
_Symbol$for2 = Symbol.for('uppy test: createUpload');

class Uppy {
  // eslint-disable-next-line global-require

  /** @type {Record<string, BasePlugin[]>} */

  /**
   * Instantiate Uppy
   *
   * @param {object} opts — Uppy options
   */
  constructor(_opts) {
    Object.defineProperty(this, _runUpload, {
      value: _runUpload2
    });
    Object.defineProperty(this, _removeUpload, {
      value: _removeUpload2
    });
    Object.defineProperty(this, _getUpload, {
      value: _getUpload2
    });
    Object.defineProperty(this, _createUpload, {
      value: _createUpload2
    });
    Object.defineProperty(this, _addListeners, {
      value: _addListeners2
    });
    Object.defineProperty(this, _startIfAutoProceed, {
      value: _startIfAutoProceed2
    });
    Object.defineProperty(this, _checkAndCreateFileStateObject, {
      value: _checkAndCreateFileStateObject2
    });
    Object.defineProperty(this, _assertNewUploadAllowed, {
      value: _assertNewUploadAllowed2
    });
    Object.defineProperty(this, _checkRequiredMetaFields, {
      value: _checkRequiredMetaFields2
    });
    Object.defineProperty(this, _checkRequiredMetaFieldsOnFile, {
      value: _checkRequiredMetaFieldsOnFile2
    });
    Object.defineProperty(this, _informAndEmit, {
      value: _informAndEmit2
    });
    Object.defineProperty(this, _plugins, {
      writable: true,
      value: Object.create(null)
    });
    Object.defineProperty(this, _restricter, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _storeUnsubscribe, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _emitter, {
      writable: true,
      value: ee()
    });
    Object.defineProperty(this, _preProcessors, {
      writable: true,
      value: new Set()
    });
    Object.defineProperty(this, _uploaders, {
      writable: true,
      value: new Set()
    });
    Object.defineProperty(this, _postProcessors, {
      writable: true,
      value: new Set()
    });
    Object.defineProperty(this, _updateOnlineStatus, {
      writable: true,
      value: this.updateOnlineStatus.bind(this)
    });
    this.defaultLocale = locale;
    const defaultOptions = {
      id: 'uppy',
      autoProceed: false,

      /**
       * @deprecated The method should not be used
       */
      allowMultipleUploads: true,
      allowMultipleUploadBatches: true,
      debug: false,
      restrictions: defaultRestrictionOptions,
      meta: {},
      onBeforeFileAdded: currentFile => currentFile,
      onBeforeUpload: files => files,
      store: DefaultStore(),
      logger: justErrorsLogger,
      infoTimeout: 5000
    }; // Merge default options with the ones set by user,
    // making sure to merge restrictions too

    this.opts = { ...defaultOptions,
      ..._opts,
      restrictions: { ...defaultOptions.restrictions,
        ...(_opts && _opts.restrictions)
      }
    }; // Support debug: true for backwards-compatability, unless logger is set in opts
    // opts instead of this.opts to avoid comparing objects — we set logger: justErrorsLogger in defaultOptions

    if (_opts && _opts.logger && _opts.debug) {
      this.log('You are using a custom `logger`, but also set `debug: true`, which uses built-in logger to output logs to console. Ignoring `debug: true` and using your custom `logger`.', 'warning');
    } else if (_opts && _opts.debug) {
      this.opts.logger = debugLogger;
    }

    this.log(`Using Core v${this.constructor.VERSION}`);
    this.i18nInit(); // ___Why throttle at 500ms?
    //    - We must throttle at >250ms for superfocus in Dashboard to work well
    //    (because animation takes 0.25s, and we want to wait for all animations to be over before refocusing).
    //    [Practical Check]: if thottle is at 100ms, then if you are uploading a file,
    //    and click 'ADD MORE FILES', - focus won't activate in Firefox.
    //    - We must throttle at around >500ms to avoid performance lags.
    //    [Practical Check] Firefox, try to upload a big file for a prolonged period of time. Laptop will start to heat up.

    this.calculateProgress = throttle(this.calculateProgress.bind(this), 500, {
      leading: true,
      trailing: true
    });
    this.store = this.opts.store;
    this.setState({
      plugins: {},
      files: {},
      currentUploads: {},
      allowNewUpload: true,
      capabilities: {
        uploadProgress: supportsUploadProgress(),
        individualCancellation: true,
        resumableUploads: false
      },
      totalProgress: 0,
      meta: { ...this.opts.meta
      },
      info: [],
      recoveredState: null
    });
    _classPrivateFieldLooseBase(this, _restricter)[_restricter] = new Restricter(() => this.opts, this.i18n);
    _classPrivateFieldLooseBase(this, _storeUnsubscribe)[_storeUnsubscribe] = this.store.subscribe((prevState, nextState, patch) => {
      this.emit('state-update', prevState, nextState, patch);
      this.updateAll(nextState);
    }); // Exposing uppy object on window for debugging and testing

    if (this.opts.debug && typeof window !== 'undefined') {
      window[this.opts.id] = this;
    }

    _classPrivateFieldLooseBase(this, _addListeners)[_addListeners]();
  }

  emit(event) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    _classPrivateFieldLooseBase(this, _emitter)[_emitter].emit(event, ...args);
  }

  on(event, callback) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].on(event, callback);

    return this;
  }

  once(event, callback) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].once(event, callback);

    return this;
  }

  off(event, callback) {
    _classPrivateFieldLooseBase(this, _emitter)[_emitter].off(event, callback);

    return this;
  }
  /**
   * Iterate on all plugins and run `update` on them.
   * Called each time state changes.
   *
   */


  updateAll(state) {
    this.iteratePlugins(plugin => {
      plugin.update(state);
    });
  }
  /**
   * Updates state with a patch
   *
   * @param {object} patch {foo: 'bar'}
   */


  setState(patch) {
    this.store.setState(patch);
  }
  /**
   * Returns current state.
   *
   * @returns {object}
   */


  getState() {
    return this.store.getState();
  }
  /**
   * Back compat for when uppy.state is used instead of uppy.getState().
   *
   * @deprecated
   */


  get state() {
    // Here, state is a non-enumerable property.
    return this.getState();
  }
  /**
   * Shorthand to set state for a specific file.
   */


  setFileState(fileID, state) {
    if (!this.getState().files[fileID]) {
      throw new Error(`Can’t set state for ${fileID} (the file could have been removed)`);
    }

    this.setState({
      files: { ...this.getState().files,
        [fileID]: { ...this.getState().files[fileID],
          ...state
        }
      }
    });
  }

  i18nInit() {
    const translator = new Translator([this.defaultLocale, this.opts.locale]);
    this.i18n = translator.translate.bind(translator);
    this.i18nArray = translator.translateArray.bind(translator);
    this.locale = translator.locale;
  }

  setOptions(newOpts) {
    this.opts = { ...this.opts,
      ...newOpts,
      restrictions: { ...this.opts.restrictions,
        ...(newOpts && newOpts.restrictions)
      }
    };

    if (newOpts.meta) {
      this.setMeta(newOpts.meta);
    }

    this.i18nInit();

    if (newOpts.locale) {
      this.iteratePlugins(plugin => {
        plugin.setOptions();
      });
    } // Note: this is not the preact `setState`, it's an internal function that has the same name.


    this.setState(); // so that UI re-renders with new options
  }

  resetProgress() {
    const defaultProgress = {
      percentage: 0,
      bytesUploaded: 0,
      uploadComplete: false,
      uploadStarted: null
    };
    const files = { ...this.getState().files
    };
    const updatedFiles = {};
    Object.keys(files).forEach(fileID => {
      const updatedFile = { ...files[fileID]
      };
      updatedFile.progress = { ...updatedFile.progress,
        ...defaultProgress
      };
      updatedFiles[fileID] = updatedFile;
    });
    this.setState({
      files: updatedFiles,
      totalProgress: 0
    });
    this.emit('reset-progress');
  }

  addPreProcessor(fn) {
    _classPrivateFieldLooseBase(this, _preProcessors)[_preProcessors].add(fn);
  }

  removePreProcessor(fn) {
    return _classPrivateFieldLooseBase(this, _preProcessors)[_preProcessors].delete(fn);
  }

  addPostProcessor(fn) {
    _classPrivateFieldLooseBase(this, _postProcessors)[_postProcessors].add(fn);
  }

  removePostProcessor(fn) {
    return _classPrivateFieldLooseBase(this, _postProcessors)[_postProcessors].delete(fn);
  }

  addUploader(fn) {
    _classPrivateFieldLooseBase(this, _uploaders)[_uploaders].add(fn);
  }

  removeUploader(fn) {
    return _classPrivateFieldLooseBase(this, _uploaders)[_uploaders].delete(fn);
  }

  setMeta(data) {
    const updatedMeta = { ...this.getState().meta,
      ...data
    };
    const updatedFiles = { ...this.getState().files
    };
    Object.keys(updatedFiles).forEach(fileID => {
      updatedFiles[fileID] = { ...updatedFiles[fileID],
        meta: { ...updatedFiles[fileID].meta,
          ...data
        }
      };
    });
    this.log('Adding metadata:');
    this.log(data);
    this.setState({
      meta: updatedMeta,
      files: updatedFiles
    });
  }

  setFileMeta(fileID, data) {
    const updatedFiles = { ...this.getState().files
    };

    if (!updatedFiles[fileID]) {
      this.log('Was trying to set metadata for a file that has been removed: ', fileID);
      return;
    }

    const newMeta = { ...updatedFiles[fileID].meta,
      ...data
    };
    updatedFiles[fileID] = { ...updatedFiles[fileID],
      meta: newMeta
    };
    this.setState({
      files: updatedFiles
    });
  }
  /**
   * Get a file object.
   *
   * @param {string} fileID The ID of the file object to return.
   */


  getFile(fileID) {
    return this.getState().files[fileID];
  }
  /**
   * Get all files in an array.
   */


  getFiles() {
    const {
      files
    } = this.getState();
    return Object.values(files);
  }

  getObjectOfFilesPerState() {
    const {
      files: filesObject,
      totalProgress,
      error
    } = this.getState();
    const files = Object.values(filesObject);
    const inProgressFiles = files.filter(_ref => {
      let {
        progress
      } = _ref;
      return !progress.uploadComplete && progress.uploadStarted;
    });
    const newFiles = files.filter(file => !file.progress.uploadStarted);
    const startedFiles = files.filter(file => file.progress.uploadStarted || file.progress.preprocess || file.progress.postprocess);
    const uploadStartedFiles = files.filter(file => file.progress.uploadStarted);
    const pausedFiles = files.filter(file => file.isPaused);
    const completeFiles = files.filter(file => file.progress.uploadComplete);
    const erroredFiles = files.filter(file => file.error);
    const inProgressNotPausedFiles = inProgressFiles.filter(file => !file.isPaused);
    const processingFiles = files.filter(file => file.progress.preprocess || file.progress.postprocess);
    return {
      newFiles,
      startedFiles,
      uploadStartedFiles,
      pausedFiles,
      completeFiles,
      erroredFiles,
      inProgressFiles,
      inProgressNotPausedFiles,
      processingFiles,
      isUploadStarted: uploadStartedFiles.length > 0,
      isAllComplete: totalProgress === 100 && completeFiles.length === files.length && processingFiles.length === 0,
      isAllErrored: !!error && erroredFiles.length === files.length,
      isAllPaused: inProgressFiles.length !== 0 && pausedFiles.length === inProgressFiles.length,
      isUploadInProgress: inProgressFiles.length > 0,
      isSomeGhost: files.some(file => file.isGhost)
    };
  }
  /*
  * @constructs
  * @param { Error } error
  * @param { undefined } file
  */

  /*
  * @constructs
  * @param { RestrictionError } error
  * @param { UppyFile | undefined } file
  */


  validateRestrictions(file, files) {
    if (files === void 0) {
      files = this.getFiles();
    }

    // TODO: directly return the Restriction error in next major version.
    // we create RestrictionError's just to discard immediately, which doesn't make sense.
    try {
      _classPrivateFieldLooseBase(this, _restricter)[_restricter].validate(file, files);

      return {
        result: true
      };
    } catch (err) {
      return {
        result: false,
        reason: err.message
      };
    }
  }

  checkIfFileAlreadyExists(fileID) {
    const {
      files
    } = this.getState();

    if (files[fileID] && !files[fileID].isGhost) {
      return true;
    }

    return false;
  }
  /**
   * Create a file state object based on user-provided `addFile()` options.
   *
   * Note this is extremely side-effectful and should only be done when a file state object
   * will be added to state immediately afterward!
   *
   * The `files` value is passed in because it may be updated by the caller without updating the store.
   */


  /**
   * Add a new file to `state.files`. This will run `onBeforeFileAdded`,
   * try to guess file type in a clever way, check file against restrictions,
   * and start an upload if `autoProceed === true`.
   *
   * @param {object} file object to add
   * @returns {string} id for the added file
   */
  addFile(file) {
    _classPrivateFieldLooseBase(this, _assertNewUploadAllowed)[_assertNewUploadAllowed](file);

    const {
      files
    } = this.getState();

    let newFile = _classPrivateFieldLooseBase(this, _checkAndCreateFileStateObject)[_checkAndCreateFileStateObject](files, file); // Users are asked to re-select recovered files without data,
    // and to keep the progress, meta and everthing else, we only replace said data


    if (files[newFile.id] && files[newFile.id].isGhost) {
      newFile = { ...files[newFile.id],
        data: file.data,
        isGhost: false
      };
      this.log(`Replaced the blob in the restored ghost file: ${newFile.name}, ${newFile.id}`);
    }

    this.setState({
      files: { ...files,
        [newFile.id]: newFile
      }
    });
    this.emit('file-added', newFile);
    this.emit('files-added', [newFile]);
    this.log(`Added file: ${newFile.name}, ${newFile.id}, mime type: ${newFile.type}`);

    _classPrivateFieldLooseBase(this, _startIfAutoProceed)[_startIfAutoProceed]();

    return newFile.id;
  }
  /**
   * Add multiple files to `state.files`. See the `addFile()` documentation.
   *
   * If an error occurs while adding a file, it is logged and the user is notified.
   * This is good for UI plugins, but not for programmatic use.
   * Programmatic users should usually still use `addFile()` on individual files.
   */


  addFiles(fileDescriptors) {
    _classPrivateFieldLooseBase(this, _assertNewUploadAllowed)[_assertNewUploadAllowed](); // create a copy of the files object only once


    const files = { ...this.getState().files
    };
    const newFiles = [];
    const errors = [];

    for (let i = 0; i < fileDescriptors.length; i++) {
      try {
        let newFile = _classPrivateFieldLooseBase(this, _checkAndCreateFileStateObject)[_checkAndCreateFileStateObject](files, fileDescriptors[i]); // Users are asked to re-select recovered files without data,
        // and to keep the progress, meta and everthing else, we only replace said data


        if (files[newFile.id] && files[newFile.id].isGhost) {
          newFile = { ...files[newFile.id],
            data: fileDescriptors[i].data,
            isGhost: false
          };
          this.log(`Replaced blob in a ghost file: ${newFile.name}, ${newFile.id}`);
        }

        files[newFile.id] = newFile;
        newFiles.push(newFile);
      } catch (err) {
        if (!err.isRestriction) {
          errors.push(err);
        }
      }
    }

    this.setState({
      files
    });
    newFiles.forEach(newFile => {
      this.emit('file-added', newFile);
    });
    this.emit('files-added', newFiles);

    if (newFiles.length > 5) {
      this.log(`Added batch of ${newFiles.length} files`);
    } else {
      Object.keys(newFiles).forEach(fileID => {
        this.log(`Added file: ${newFiles[fileID].name}\n id: ${newFiles[fileID].id}\n type: ${newFiles[fileID].type}`);
      });
    }

    if (newFiles.length > 0) {
      _classPrivateFieldLooseBase(this, _startIfAutoProceed)[_startIfAutoProceed]();
    }

    if (errors.length > 0) {
      let message = 'Multiple errors occurred while adding files:\n';
      errors.forEach(subError => {
        message += `\n * ${subError.message}`;
      });
      this.info({
        message: this.i18n('addBulkFilesFailed', {
          smart_count: errors.length
        }),
        details: message
      }, 'error', this.opts.infoTimeout);

      if (typeof AggregateError === 'function') {
        throw new AggregateError(errors, message);
      } else {
        const err = new Error(message);
        err.errors = errors;
        throw err;
      }
    }
  }

  removeFiles(fileIDs, reason) {
    const {
      files,
      currentUploads
    } = this.getState();
    const updatedFiles = { ...files
    };
    const updatedUploads = { ...currentUploads
    };
    const removedFiles = Object.create(null);
    fileIDs.forEach(fileID => {
      if (files[fileID]) {
        removedFiles[fileID] = files[fileID];
        delete updatedFiles[fileID];
      }
    }); // Remove files from the `fileIDs` list in each upload.

    function fileIsNotRemoved(uploadFileID) {
      return removedFiles[uploadFileID] === undefined;
    }

    Object.keys(updatedUploads).forEach(uploadID => {
      const newFileIDs = currentUploads[uploadID].fileIDs.filter(fileIsNotRemoved); // Remove the upload if no files are associated with it anymore.

      if (newFileIDs.length === 0) {
        delete updatedUploads[uploadID];
        return;
      }

      updatedUploads[uploadID] = { ...currentUploads[uploadID],
        fileIDs: newFileIDs
      };
    });
    const stateUpdate = {
      currentUploads: updatedUploads,
      files: updatedFiles
    }; // If all files were removed - allow new uploads,
    // and clear recoveredState

    if (Object.keys(updatedFiles).length === 0) {
      stateUpdate.allowNewUpload = true;
      stateUpdate.error = null;
      stateUpdate.recoveredState = null;
    }

    this.setState(stateUpdate);
    this.calculateTotalProgress();
    const removedFileIDs = Object.keys(removedFiles);
    removedFileIDs.forEach(fileID => {
      this.emit('file-removed', removedFiles[fileID], reason);
    });

    if (removedFileIDs.length > 5) {
      this.log(`Removed ${removedFileIDs.length} files`);
    } else {
      this.log(`Removed files: ${removedFileIDs.join(', ')}`);
    }
  }

  removeFile(fileID, reason) {
    if (reason === void 0) {
      reason = null;
    }

    this.removeFiles([fileID], reason);
  }

  pauseResume(fileID) {
    if (!this.getState().capabilities.resumableUploads || this.getFile(fileID).uploadComplete) {
      return undefined;
    }

    const wasPaused = this.getFile(fileID).isPaused || false;
    const isPaused = !wasPaused;
    this.setFileState(fileID, {
      isPaused
    });
    this.emit('upload-pause', fileID, isPaused);
    return isPaused;
  }

  pauseAll() {
    const updatedFiles = { ...this.getState().files
    };
    const inProgressUpdatedFiles = Object.keys(updatedFiles).filter(file => {
      return !updatedFiles[file].progress.uploadComplete && updatedFiles[file].progress.uploadStarted;
    });
    inProgressUpdatedFiles.forEach(file => {
      const updatedFile = { ...updatedFiles[file],
        isPaused: true
      };
      updatedFiles[file] = updatedFile;
    });
    this.setState({
      files: updatedFiles
    });
    this.emit('pause-all');
  }

  resumeAll() {
    const updatedFiles = { ...this.getState().files
    };
    const inProgressUpdatedFiles = Object.keys(updatedFiles).filter(file => {
      return !updatedFiles[file].progress.uploadComplete && updatedFiles[file].progress.uploadStarted;
    });
    inProgressUpdatedFiles.forEach(file => {
      const updatedFile = { ...updatedFiles[file],
        isPaused: false,
        error: null
      };
      updatedFiles[file] = updatedFile;
    });
    this.setState({
      files: updatedFiles
    });
    this.emit('resume-all');
  }

  retryAll() {
    const updatedFiles = { ...this.getState().files
    };
    const filesToRetry = Object.keys(updatedFiles).filter(file => {
      return updatedFiles[file].error;
    });
    filesToRetry.forEach(file => {
      const updatedFile = { ...updatedFiles[file],
        isPaused: false,
        error: null
      };
      updatedFiles[file] = updatedFile;
    });
    this.setState({
      files: updatedFiles,
      error: null
    });
    this.emit('retry-all', filesToRetry);

    if (filesToRetry.length === 0) {
      return Promise.resolve({
        successful: [],
        failed: []
      });
    }

    const uploadID = _classPrivateFieldLooseBase(this, _createUpload)[_createUpload](filesToRetry, {
      forceAllowNewUpload: true // create new upload even if allowNewUpload: false

    });

    return _classPrivateFieldLooseBase(this, _runUpload)[_runUpload](uploadID);
  }

  cancelAll(_temp) {
    let {
      reason = 'user'
    } = _temp === void 0 ? {} : _temp;
    this.emit('cancel-all', {
      reason
    }); // Only remove existing uploads if user is canceling

    if (reason === 'user') {
      const {
        files
      } = this.getState();
      const fileIDs = Object.keys(files);

      if (fileIDs.length) {
        this.removeFiles(fileIDs, 'cancel-all');
      }

      this.setState({
        totalProgress: 0,
        error: null,
        recoveredState: null
      });
    }
  }

  retryUpload(fileID) {
    this.setFileState(fileID, {
      error: null,
      isPaused: false
    });
    this.emit('upload-retry', fileID);

    const uploadID = _classPrivateFieldLooseBase(this, _createUpload)[_createUpload]([fileID], {
      forceAllowNewUpload: true // create new upload even if allowNewUpload: false

    });

    return _classPrivateFieldLooseBase(this, _runUpload)[_runUpload](uploadID);
  } // todo remove in next major. what is the point of the reset method when we have cancelAll or vice versa?


  reset() {
    this.cancelAll(...arguments);
  }

  logout() {
    this.iteratePlugins(plugin => {
      if (plugin.provider && plugin.provider.logout) {
        plugin.provider.logout();
      }
    });
  }

  calculateProgress(file, data) {
    if (file == null || !this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file == null ? void 0 : file.id}`);
      return;
    } // bytesTotal may be null or zero; in that case we can't divide by it


    const canHavePercentage = Number.isFinite(data.bytesTotal) && data.bytesTotal > 0;
    this.setFileState(file.id, {
      progress: { ...this.getFile(file.id).progress,
        bytesUploaded: data.bytesUploaded,
        bytesTotal: data.bytesTotal,
        percentage: canHavePercentage ? Math.round(data.bytesUploaded / data.bytesTotal * 100) : 0
      }
    });
    this.calculateTotalProgress();
  }

  calculateTotalProgress() {
    // calculate total progress, using the number of files currently uploading,
    // multiplied by 100 and the summ of individual progress of each file
    const files = this.getFiles();
    const inProgress = files.filter(file => {
      return file.progress.uploadStarted || file.progress.preprocess || file.progress.postprocess;
    });

    if (inProgress.length === 0) {
      this.emit('progress', 0);
      this.setState({
        totalProgress: 0
      });
      return;
    }

    const sizedFiles = inProgress.filter(file => file.progress.bytesTotal != null);
    const unsizedFiles = inProgress.filter(file => file.progress.bytesTotal == null);

    if (sizedFiles.length === 0) {
      const progressMax = inProgress.length * 100;
      const currentProgress = unsizedFiles.reduce((acc, file) => {
        return acc + file.progress.percentage;
      }, 0);
      const totalProgress = Math.round(currentProgress / progressMax * 100);
      this.setState({
        totalProgress
      });
      return;
    }

    let totalSize = sizedFiles.reduce((acc, file) => {
      return acc + file.progress.bytesTotal;
    }, 0);
    const averageSize = totalSize / sizedFiles.length;
    totalSize += averageSize * unsizedFiles.length;
    let uploadedSize = 0;
    sizedFiles.forEach(file => {
      uploadedSize += file.progress.bytesUploaded;
    });
    unsizedFiles.forEach(file => {
      uploadedSize += averageSize * (file.progress.percentage || 0) / 100;
    });
    let totalProgress = totalSize === 0 ? 0 : Math.round(uploadedSize / totalSize * 100); // hot fix, because:
    // uploadedSize ended up larger than totalSize, resulting in 1325% total

    if (totalProgress > 100) {
      totalProgress = 100;
    }

    this.setState({
      totalProgress
    });
    this.emit('progress', totalProgress);
  }
  /**
   * Registers listeners for all global actions, like:
   * `error`, `file-removed`, `upload-progress`
   */


  updateOnlineStatus() {
    const online = typeof window.navigator.onLine !== 'undefined' ? window.navigator.onLine : true;

    if (!online) {
      this.emit('is-offline');
      this.info(this.i18n('noInternetConnection'), 'error', 0);
      this.wasOffline = true;
    } else {
      this.emit('is-online');

      if (this.wasOffline) {
        this.emit('back-online');
        this.info(this.i18n('connectedToInternet'), 'success', 3000);
        this.wasOffline = false;
      }
    }
  }

  getID() {
    return this.opts.id;
  }
  /**
   * Registers a plugin with Core.
   *
   * @param {object} Plugin object
   * @param {object} [opts] object with options to be passed to Plugin
   * @returns {object} self for chaining
   */
  // eslint-disable-next-line no-shadow


  use(Plugin, opts) {
    if (typeof Plugin !== 'function') {
      const msg = `Expected a plugin class, but got ${Plugin === null ? 'null' : typeof Plugin}.` + ' Please verify that the plugin was imported and spelled correctly.';
      throw new TypeError(msg);
    } // Instantiate


    const plugin = new Plugin(this, opts);
    const pluginId = plugin.id;

    if (!pluginId) {
      throw new Error('Your plugin must have an id');
    }

    if (!plugin.type) {
      throw new Error('Your plugin must have a type');
    }

    const existsPluginAlready = this.getPlugin(pluginId);

    if (existsPluginAlready) {
      const msg = `Already found a plugin named '${existsPluginAlready.id}'. ` + `Tried to use: '${pluginId}'.\n` + 'Uppy plugins must have unique `id` options. See https://uppy.io/docs/plugins/#id.';
      throw new Error(msg);
    }

    if (Plugin.VERSION) {
      this.log(`Using ${pluginId} v${Plugin.VERSION}`);
    }

    if (plugin.type in _classPrivateFieldLooseBase(this, _plugins)[_plugins]) {
      _classPrivateFieldLooseBase(this, _plugins)[_plugins][plugin.type].push(plugin);
    } else {
      _classPrivateFieldLooseBase(this, _plugins)[_plugins][plugin.type] = [plugin];
    }

    plugin.install();
    return this;
  }
  /**
   * Find one Plugin by name.
   *
   * @param {string} id plugin id
   * @returns {BasePlugin|undefined}
   */


  getPlugin(id) {
    for (const plugins of Object.values(_classPrivateFieldLooseBase(this, _plugins)[_plugins])) {
      const foundPlugin = plugins.find(plugin => plugin.id === id);
      if (foundPlugin != null) return foundPlugin;
    }

    return undefined;
  }

  [_Symbol$for](type) {
    return _classPrivateFieldLooseBase(this, _plugins)[_plugins][type];
  }
  /**
   * Iterate through all `use`d plugins.
   *
   * @param {Function} method that will be run on each plugin
   */


  iteratePlugins(method) {
    Object.values(_classPrivateFieldLooseBase(this, _plugins)[_plugins]).flat(1).forEach(method);
  }
  /**
   * Uninstall and remove a plugin.
   *
   * @param {object} instance The plugin instance to remove.
   */


  removePlugin(instance) {
    this.log(`Removing plugin ${instance.id}`);
    this.emit('plugin-remove', instance);

    if (instance.uninstall) {
      instance.uninstall();
    }

    const list = _classPrivateFieldLooseBase(this, _plugins)[_plugins][instance.type]; // list.indexOf failed here, because Vue3 converted the plugin instance
    // to a Proxy object, which failed the strict comparison test:
    // obj !== objProxy


    const index = list.findIndex(item => item.id === instance.id);

    if (index !== -1) {
      list.splice(index, 1);
    }

    const state = this.getState();
    const updatedState = {
      plugins: { ...state.plugins,
        [instance.id]: undefined
      }
    };
    this.setState(updatedState);
  }
  /**
   * Uninstall all plugins and close down this Uppy instance.
   */


  close(_temp2) {
    let {
      reason
    } = _temp2 === void 0 ? {} : _temp2;
    this.log(`Closing Uppy instance ${this.opts.id}: removing all files and uninstalling plugins`);
    this.cancelAll({
      reason
    });

    _classPrivateFieldLooseBase(this, _storeUnsubscribe)[_storeUnsubscribe]();

    this.iteratePlugins(plugin => {
      this.removePlugin(plugin);
    });

    if (typeof window !== 'undefined' && window.removeEventListener) {
      window.removeEventListener('online', _classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus]);
      window.removeEventListener('offline', _classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus]);
    }
  }

  hideInfo() {
    const {
      info
    } = this.getState();
    this.setState({
      info: info.slice(1)
    });
    this.emit('info-hidden');
  }
  /**
   * Set info message in `state.info`, so that UI plugins like `Informer`
   * can display the message.
   *
   * @param {string | object} message Message to be displayed by the informer
   * @param {string} [type]
   * @param {number} [duration]
   */


  info(message, type, duration) {
    if (type === void 0) {
      type = 'info';
    }

    if (duration === void 0) {
      duration = 3000;
    }

    const isComplexMessage = typeof message === 'object';
    this.setState({
      info: [...this.getState().info, {
        type,
        message: isComplexMessage ? message.message : message,
        details: isComplexMessage ? message.details : null
      }]
    });
    setTimeout(() => this.hideInfo(), duration);
    this.emit('info-visible');
  }
  /**
   * Passes messages to a function, provided in `opts.logger`.
   * If `opts.logger: Uppy.debugLogger` or `opts.debug: true`, logs to the browser console.
   *
   * @param {string|object} message to log
   * @param {string} [type] optional `error` or `warning`
   */


  log(message, type) {
    const {
      logger
    } = this.opts;

    switch (type) {
      case 'error':
        logger.error(message);
        break;

      case 'warning':
        logger.warn(message);
        break;

      default:
        logger.debug(message);
        break;
    }
  }
  /**
   * Restore an upload by its ID.
   */


  restore(uploadID) {
    this.log(`Core: attempting to restore upload "${uploadID}"`);

    if (!this.getState().currentUploads[uploadID]) {
      _classPrivateFieldLooseBase(this, _removeUpload)[_removeUpload](uploadID);

      return Promise.reject(new Error('Nonexistent upload'));
    }

    return _classPrivateFieldLooseBase(this, _runUpload)[_runUpload](uploadID);
  }
  /**
   * Create an upload for a bunch of files.
   *
   * @param {Array<string>} fileIDs File IDs to include in this upload.
   * @returns {string} ID of this upload.
   */


  [_Symbol$for2]() {
    return _classPrivateFieldLooseBase(this, _createUpload)[_createUpload](...arguments);
  }

  /**
   * Add data to an upload's result object.
   *
   * @param {string} uploadID The ID of the upload.
   * @param {object} data Data properties to add to the result object.
   */
  addResultData(uploadID, data) {
    if (!_classPrivateFieldLooseBase(this, _getUpload)[_getUpload](uploadID)) {
      this.log(`Not setting result for an upload that has been removed: ${uploadID}`);
      return;
    }

    const {
      currentUploads
    } = this.getState();
    const currentUpload = { ...currentUploads[uploadID],
      result: { ...currentUploads[uploadID].result,
        ...data
      }
    };
    this.setState({
      currentUploads: { ...currentUploads,
        [uploadID]: currentUpload
      }
    });
  }
  /**
   * Remove an upload, eg. if it has been canceled or completed.
   *
   * @param {string} uploadID The ID of the upload.
   */


  /**
   * Start an upload for all the files that are not currently being uploaded.
   *
   * @returns {Promise}
   */
  upload() {
    var _classPrivateFieldLoo;

    if (!((_classPrivateFieldLoo = _classPrivateFieldLooseBase(this, _plugins)[_plugins].uploader) != null && _classPrivateFieldLoo.length)) {
      this.log('No uploader type plugins are used', 'warning');
    }

    let {
      files
    } = this.getState();
    const onBeforeUploadResult = this.opts.onBeforeUpload(files);

    if (onBeforeUploadResult === false) {
      return Promise.reject(new Error('Not starting the upload because onBeforeUpload returned false'));
    }

    if (onBeforeUploadResult && typeof onBeforeUploadResult === 'object') {
      files = onBeforeUploadResult; // Updating files in state, because uploader plugins receive file IDs,
      // and then fetch the actual file object from state

      this.setState({
        files
      });
    }

    return Promise.resolve().then(() => _classPrivateFieldLooseBase(this, _restricter)[_restricter].validateMinNumberOfFiles(files)).catch(err => {
      _classPrivateFieldLooseBase(this, _informAndEmit)[_informAndEmit](err);

      throw err;
    }).then(() => {
      if (!_classPrivateFieldLooseBase(this, _checkRequiredMetaFields)[_checkRequiredMetaFields](files)) {
        throw new RestrictionError(this.i18n('missingRequiredMetaField'));
      }
    }).catch(err => {
      // Doing this in a separate catch because we already emited and logged
      // all the errors in `checkRequiredMetaFields` so we only throw a generic
      // missing fields error here.
      throw err;
    }).then(() => {
      const {
        currentUploads
      } = this.getState(); // get a list of files that are currently assigned to uploads

      const currentlyUploadingFiles = Object.values(currentUploads).flatMap(curr => curr.fileIDs);
      const waitingFileIDs = [];
      Object.keys(files).forEach(fileID => {
        const file = this.getFile(fileID); // if the file hasn't started uploading and hasn't already been assigned to an upload..

        if (!file.progress.uploadStarted && currentlyUploadingFiles.indexOf(fileID) === -1) {
          waitingFileIDs.push(file.id);
        }
      });

      const uploadID = _classPrivateFieldLooseBase(this, _createUpload)[_createUpload](waitingFileIDs);

      return _classPrivateFieldLooseBase(this, _runUpload)[_runUpload](uploadID);
    }).catch(err => {
      this.emit('error', err);
      this.log(err, 'error');
      throw err;
    });
  }

}

function _informAndEmit2(error, file) {
  const {
    message,
    details = ''
  } = error;

  if (error.isRestriction) {
    this.emit('restriction-failed', file, error);
  } else {
    this.emit('error', error);
  }

  this.info({
    message,
    details
  }, 'error', this.opts.infoTimeout);
  this.log(`${message} ${details}`.trim(), 'error');
}

function _checkRequiredMetaFieldsOnFile2(file) {
  const {
    missingFields,
    error
  } = _classPrivateFieldLooseBase(this, _restricter)[_restricter].getMissingRequiredMetaFields(file);

  if (missingFields.length > 0) {
    this.setFileState(file.id, {
      missingRequiredMetaFields: missingFields
    });
    this.log(error.message);
    this.emit('restriction-failed', file, error);
    return false;
  }

  return true;
}

function _checkRequiredMetaFields2(files) {
  let success = true;

  for (const file of Object.values(files)) {
    if (!_classPrivateFieldLooseBase(this, _checkRequiredMetaFieldsOnFile)[_checkRequiredMetaFieldsOnFile](file)) {
      success = false;
    }
  }

  return success;
}

function _assertNewUploadAllowed2(file) {
  const {
    allowNewUpload
  } = this.getState();

  if (allowNewUpload === false) {
    const error = new RestrictionError(this.i18n('noMoreFilesAllowed'));

    _classPrivateFieldLooseBase(this, _informAndEmit)[_informAndEmit](error, file);

    throw error;
  }
}

function _checkAndCreateFileStateObject2(files, fileDescriptor) {
  const fileType = getFileType(fileDescriptor);
  const fileName = getFileName(fileType, fileDescriptor);
  const fileExtension = getFileNameAndExtension(fileName).extension;
  const isRemote = Boolean(fileDescriptor.isRemote);
  const fileID = generateFileID({ ...fileDescriptor,
    type: fileType
  });

  if (this.checkIfFileAlreadyExists(fileID)) {
    const error = new RestrictionError(this.i18n('noDuplicates', {
      fileName
    }));

    _classPrivateFieldLooseBase(this, _informAndEmit)[_informAndEmit](error, fileDescriptor);

    throw error;
  }

  const meta = fileDescriptor.meta || {};
  meta.name = fileName;
  meta.type = fileType; // `null` means the size is unknown.

  const size = Number.isFinite(fileDescriptor.data.size) ? fileDescriptor.data.size : null;
  let newFile = {
    source: fileDescriptor.source || '',
    id: fileID,
    name: fileName,
    extension: fileExtension || '',
    meta: { ...this.getState().meta,
      ...meta
    },
    type: fileType,
    data: fileDescriptor.data,
    progress: {
      percentage: 0,
      bytesUploaded: 0,
      bytesTotal: size,
      uploadComplete: false,
      uploadStarted: null
    },
    size,
    isRemote,
    remote: fileDescriptor.remote || '',
    preview: fileDescriptor.preview
  };
  const onBeforeFileAddedResult = this.opts.onBeforeFileAdded(newFile, files);

  if (onBeforeFileAddedResult === false) {
    // Don’t show UI info for this error, as it should be done by the developer
    const error = new RestrictionError('Cannot add the file because onBeforeFileAdded returned false.');
    this.emit('restriction-failed', fileDescriptor, error);
    throw error;
  } else if (typeof onBeforeFileAddedResult === 'object' && onBeforeFileAddedResult !== null) {
    newFile = onBeforeFileAddedResult;
  }

  try {
    const filesArray = Object.keys(files).map(i => files[i]);

    _classPrivateFieldLooseBase(this, _restricter)[_restricter].validate(newFile, filesArray);
  } catch (err) {
    _classPrivateFieldLooseBase(this, _informAndEmit)[_informAndEmit](err, newFile);

    throw err;
  }

  return newFile;
}

function _startIfAutoProceed2() {
  if (this.opts.autoProceed && !this.scheduledAutoProceed) {
    this.scheduledAutoProceed = setTimeout(() => {
      this.scheduledAutoProceed = null;
      this.upload().catch(err => {
        if (!err.isRestriction) {
          this.log(err.stack || err.message || err);
        }
      });
    }, 4);
  }
}

function _addListeners2() {
  /**
   * @param {Error} error
   * @param {object} [file]
   * @param {object} [response]
   */
  const errorHandler = (error, file, response) => {
    let errorMsg = error.message || 'Unknown error';

    if (error.details) {
      errorMsg += ` ${error.details}`;
    }

    this.setState({
      error: errorMsg
    });

    if (file != null && file.id in this.getState().files) {
      this.setFileState(file.id, {
        error: errorMsg,
        response
      });
    }
  };

  this.on('error', errorHandler);
  this.on('upload-error', (file, error, response) => {
    errorHandler(error, file, response);

    if (typeof error === 'object' && error.message) {
      const newError = new Error(error.message);
      newError.details = error.message;

      if (error.details) {
        newError.details += ` ${error.details}`;
      }

      newError.message = this.i18n('failedToUpload', {
        file: file.name
      });

      _classPrivateFieldLooseBase(this, _informAndEmit)[_informAndEmit](newError);
    } else {
      _classPrivateFieldLooseBase(this, _informAndEmit)[_informAndEmit](error);
    }
  });
  this.on('upload', () => {
    this.setState({
      error: null
    });
  });
  this.on('upload-started', file => {
    if (file == null || !this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file == null ? void 0 : file.id}`);
      return;
    }

    this.setFileState(file.id, {
      progress: {
        uploadStarted: Date.now(),
        uploadComplete: false,
        percentage: 0,
        bytesUploaded: 0,
        bytesTotal: file.size
      }
    });
  });
  this.on('upload-progress', this.calculateProgress);
  this.on('upload-success', (file, uploadResp) => {
    if (file == null || !this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file == null ? void 0 : file.id}`);
      return;
    }

    const currentProgress = this.getFile(file.id).progress;
    this.setFileState(file.id, {
      progress: { ...currentProgress,
        postprocess: _classPrivateFieldLooseBase(this, _postProcessors)[_postProcessors].size > 0 ? {
          mode: 'indeterminate'
        } : null,
        uploadComplete: true,
        percentage: 100,
        bytesUploaded: currentProgress.bytesTotal
      },
      response: uploadResp,
      uploadURL: uploadResp.uploadURL,
      isPaused: false
    }); // Remote providers sometimes don't tell us the file size,
    // but we can know how many bytes we uploaded once the upload is complete.

    if (file.size == null) {
      this.setFileState(file.id, {
        size: uploadResp.bytesUploaded || currentProgress.bytesTotal
      });
    }

    this.calculateTotalProgress();
  });
  this.on('preprocess-progress', (file, progress) => {
    if (file == null || !this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file == null ? void 0 : file.id}`);
      return;
    }

    this.setFileState(file.id, {
      progress: { ...this.getFile(file.id).progress,
        preprocess: progress
      }
    });
  });
  this.on('preprocess-complete', file => {
    if (file == null || !this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file == null ? void 0 : file.id}`);
      return;
    }

    const files = { ...this.getState().files
    };
    files[file.id] = { ...files[file.id],
      progress: { ...files[file.id].progress
      }
    };
    delete files[file.id].progress.preprocess;
    this.setState({
      files
    });
  });
  this.on('postprocess-progress', (file, progress) => {
    if (file == null || !this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file == null ? void 0 : file.id}`);
      return;
    }

    this.setFileState(file.id, {
      progress: { ...this.getState().files[file.id].progress,
        postprocess: progress
      }
    });
  });
  this.on('postprocess-complete', file => {
    if (file == null || !this.getFile(file.id)) {
      this.log(`Not setting progress for a file that has been removed: ${file == null ? void 0 : file.id}`);
      return;
    }

    const files = { ...this.getState().files
    };
    files[file.id] = { ...files[file.id],
      progress: { ...files[file.id].progress
      }
    };
    delete files[file.id].progress.postprocess;
    this.setState({
      files
    });
  });
  this.on('restored', () => {
    // Files may have changed--ensure progress is still accurate.
    this.calculateTotalProgress();
  });
  this.on('dashboard:file-edit-complete', file => {
    if (file) {
      _classPrivateFieldLooseBase(this, _checkRequiredMetaFieldsOnFile)[_checkRequiredMetaFieldsOnFile](file);
    }
  }); // show informer if offline

  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('online', _classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus]);
    window.addEventListener('offline', _classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus]);
    setTimeout(_classPrivateFieldLooseBase(this, _updateOnlineStatus)[_updateOnlineStatus], 3000);
  }
}

function _createUpload2(fileIDs, opts) {
  if (opts === void 0) {
    opts = {};
  }

  // uppy.retryAll sets this to true — when retrying we want to ignore `allowNewUpload: false`
  const {
    forceAllowNewUpload = false
  } = opts;
  const {
    allowNewUpload,
    currentUploads
  } = this.getState();

  if (!allowNewUpload && !forceAllowNewUpload) {
    throw new Error('Cannot create a new upload: already uploading.');
  }

  const uploadID = nanoid();
  this.emit('upload', {
    id: uploadID,
    fileIDs
  });
  this.setState({
    allowNewUpload: this.opts.allowMultipleUploadBatches !== false && this.opts.allowMultipleUploads !== false,
    currentUploads: { ...currentUploads,
      [uploadID]: {
        fileIDs,
        step: 0,
        result: {}
      }
    }
  });
  return uploadID;
}

function _getUpload2(uploadID) {
  const {
    currentUploads
  } = this.getState();
  return currentUploads[uploadID];
}

function _removeUpload2(uploadID) {
  const currentUploads = { ...this.getState().currentUploads
  };
  delete currentUploads[uploadID];
  this.setState({
    currentUploads
  });
}

async function _runUpload2(uploadID) {
  let {
    currentUploads
  } = this.getState();
  let currentUpload = currentUploads[uploadID];
  const restoreStep = currentUpload.step || 0;
  const steps = [..._classPrivateFieldLooseBase(this, _preProcessors)[_preProcessors], ..._classPrivateFieldLooseBase(this, _uploaders)[_uploaders], ..._classPrivateFieldLooseBase(this, _postProcessors)[_postProcessors]];

  try {
    for (let step = restoreStep; step < steps.length; step++) {
      if (!currentUpload) {
        break;
      }

      const fn = steps[step];
      const updatedUpload = { ...currentUpload,
        step
      };
      this.setState({
        currentUploads: { ...currentUploads,
          [uploadID]: updatedUpload
        }
      }); // TODO give this the `updatedUpload` object as its only parameter maybe?
      // Otherwise when more metadata may be added to the upload this would keep getting more parameters

      await fn(updatedUpload.fileIDs, uploadID); // Update currentUpload value in case it was modified asynchronously.

      currentUploads = this.getState().currentUploads;
      currentUpload = currentUploads[uploadID];
    }
  } catch (err) {
    _classPrivateFieldLooseBase(this, _removeUpload)[_removeUpload](uploadID);

    throw err;
  } // Set result data.


  if (currentUpload) {
    // Mark postprocessing step as complete if necessary; this addresses a case where we might get
    // stuck in the postprocessing UI while the upload is fully complete.
    // If the postprocessing steps do not do any work, they may not emit postprocessing events at
    // all, and never mark the postprocessing as complete. This is fine on its own but we
    // introduced code in the @uppy/core upload-success handler to prepare postprocessing progress
    // state if any postprocessors are registered. That is to avoid a "flash of completed state"
    // before the postprocessing plugins can emit events.
    //
    // So, just in case an upload with postprocessing plugins *has* completed *without* emitting
    // postprocessing completion, we do it instead.
    currentUpload.fileIDs.forEach(fileID => {
      const file = this.getFile(fileID);

      if (file && file.progress.postprocess) {
        this.emit('postprocess-complete', file);
      }
    });
    const files = currentUpload.fileIDs.map(fileID => this.getFile(fileID));
    const successful = files.filter(file => !file.error);
    const failed = files.filter(file => file.error);
    await this.addResultData(uploadID, {
      successful,
      failed,
      uploadID
    }); // Update currentUpload value in case it was modified asynchronously.

    currentUploads = this.getState().currentUploads;
    currentUpload = currentUploads[uploadID];
  } // Emit completion events.
  // This is in a separate function so that the `currentUploads` variable
  // always refers to the latest state. In the handler right above it refers
  // to an outdated object without the `.result` property.


  let result;

  if (currentUpload) {
    result = currentUpload.result;
    this.emit('complete', result);

    _classPrivateFieldLooseBase(this, _removeUpload)[_removeUpload](uploadID);
  }

  if (result == null) {
    this.log(`Not setting result for an upload that has been removed: ${uploadID}`);
  }

  return result;
}

Uppy.VERSION = "2.2.0";
module.exports = Uppy;

/***/ }),

/***/ "./node_modules/@uppy/core/lib/getFileName.js":
/*!****************************************************!*\
  !*** ./node_modules/@uppy/core/lib/getFileName.js ***!
  \****************************************************/
/***/ ((module) => {

module.exports = function getFileName(fileType, fileDescriptor) {
  if (fileDescriptor.name) {
    return fileDescriptor.name;
  }

  if (fileType.split('/')[0] === 'image') {
    return `${fileType.split('/')[0]}.${fileType.split('/')[1]}`;
  }

  return 'noname';
};

/***/ }),

/***/ "./node_modules/@uppy/core/lib/index.js":
/*!**********************************************!*\
  !*** ./node_modules/@uppy/core/lib/index.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const Uppy = __webpack_require__(/*! ./Uppy */ "./node_modules/@uppy/core/lib/Uppy.js");

const UIPlugin = __webpack_require__(/*! ./UIPlugin */ "./node_modules/@uppy/core/lib/UIPlugin.js");

const BasePlugin = __webpack_require__(/*! ./BasePlugin */ "./node_modules/@uppy/core/lib/BasePlugin.js");

const {
  debugLogger
} = __webpack_require__(/*! ./loggers */ "./node_modules/@uppy/core/lib/loggers.js");

module.exports = Uppy;
module.exports.Uppy = Uppy;
module.exports.UIPlugin = UIPlugin;
module.exports.BasePlugin = BasePlugin;
module.exports.debugLogger = debugLogger;

/***/ }),

/***/ "./node_modules/@uppy/core/lib/locale.js":
/*!***********************************************!*\
  !*** ./node_modules/@uppy/core/lib/locale.js ***!
  \***********************************************/
/***/ ((module) => {

module.exports = {
  strings: {
    addBulkFilesFailed: {
      0: 'Failed to add %{smart_count} file due to an internal error',
      1: 'Failed to add %{smart_count} files due to internal errors'
    },
    youCanOnlyUploadX: {
      0: 'You can only upload %{smart_count} file',
      1: 'You can only upload %{smart_count} files'
    },
    youHaveToAtLeastSelectX: {
      0: 'You have to select at least %{smart_count} file',
      1: 'You have to select at least %{smart_count} files'
    },
    exceedsSize: '%{file} exceeds maximum allowed size of %{size}',
    missingRequiredMetaField: 'Missing required meta fields',
    missingRequiredMetaFieldOnFile: 'Missing required meta fields in %{fileName}',
    inferiorSize: 'This file is smaller than the allowed size of %{size}',
    youCanOnlyUploadFileTypes: 'You can only upload: %{types}',
    noMoreFilesAllowed: 'Cannot add more files',
    noDuplicates: "Cannot add the duplicate file '%{fileName}', it already exists",
    companionError: 'Connection with Companion failed',
    authAborted: 'Authentication aborted',
    companionUnauthorizeHint: 'To unauthorize to your %{provider} account, please go to %{url}',
    failedToUpload: 'Failed to upload %{file}',
    noInternetConnection: 'No Internet connection',
    connectedToInternet: 'Connected to the Internet',
    // Strings for remote providers
    noFilesFound: 'You have no files or folders here',
    selectX: {
      0: 'Select %{smart_count}',
      1: 'Select %{smart_count}'
    },
    allFilesFromFolderNamed: 'All files from folder %{name}',
    openFolderNamed: 'Open folder %{name}',
    cancel: 'Cancel',
    logOut: 'Log out',
    filter: 'Filter',
    resetFilter: 'Reset filter',
    loading: 'Loading...',
    authenticateWithTitle: 'Please authenticate with %{pluginName} to select files',
    authenticateWith: 'Connect to %{pluginName}',
    signInWithGoogle: 'Sign in with Google',
    searchImages: 'Search for images',
    enterTextToSearch: 'Enter text to search for images',
    search: 'Search',
    emptyFolderAdded: 'No files were added from empty folder',
    folderAlreadyAdded: 'The folder "%{folder}" was already added',
    folderAdded: {
      0: 'Added %{smart_count} file from %{folder}',
      1: 'Added %{smart_count} files from %{folder}'
    }
  }
};

/***/ }),

/***/ "./node_modules/@uppy/core/lib/loggers.js":
/*!************************************************!*\
  !*** ./node_modules/@uppy/core/lib/loggers.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* eslint-disable no-console */
const getTimeStamp = __webpack_require__(/*! @uppy/utils/lib/getTimeStamp */ "./node_modules/@uppy/utils/lib/getTimeStamp.js"); // Swallow all logs, except errors.
// default if logger is not set or debug: false


const justErrorsLogger = {
  debug: () => {},
  warn: () => {},
  error: function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return console.error(`[Uppy] [${getTimeStamp()}]`, ...args);
  }
}; // Print logs to console with namespace + timestamp,
// set by logger: Uppy.debugLogger or debug: true

const debugLogger = {
  debug: function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return console.debug(`[Uppy] [${getTimeStamp()}]`, ...args);
  },
  warn: function () {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return console.warn(`[Uppy] [${getTimeStamp()}]`, ...args);
  },
  error: function () {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return console.error(`[Uppy] [${getTimeStamp()}]`, ...args);
  }
};
module.exports = {
  justErrorsLogger,
  debugLogger
};

/***/ }),

/***/ "./node_modules/@uppy/core/lib/supportsUploadProgress.js":
/*!***************************************************************!*\
  !*** ./node_modules/@uppy/core/lib/supportsUploadProgress.js ***!
  \***************************************************************/
/***/ ((module) => {

// Edge 15.x does not fire 'progress' events on uploads.
// See https://github.com/transloadit/uppy/issues/945
// And https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12224510/
module.exports = function supportsUploadProgress(userAgent) {
  // Allow passing in userAgent for tests
  if (userAgent == null) {
    userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : null;
  } // Assume it works because basically everything supports progress events.


  if (!userAgent) return true;
  const m = /Edge\/(\d+\.\d+)/.exec(userAgent);
  if (!m) return true;
  const edgeVersion = m[1];
  let [major, minor] = edgeVersion.split('.');
  major = parseInt(major, 10);
  minor = parseInt(minor, 10); // Worked before:
  // Edge 40.15063.0.0
  // Microsoft EdgeHTML 15.15063

  if (major < 15 || major === 15 && minor < 15063) {
    return true;
  } // Fixed in:
  // Microsoft EdgeHTML 18.18218


  if (major > 18 || major === 18 && minor >= 18218) {
    return true;
  } // other versions don't work.


  return false;
};

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/AddFiles.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/AddFiles.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

let _Symbol$for;

const {
  h,
  Component
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

_Symbol$for = Symbol.for('uppy test: disable unused locale key warning');

class AddFiles extends Component {
  constructor() {
    super(...arguments);

    this.triggerFileInputClick = () => {
      this.fileInput.click();
    };

    this.triggerFolderInputClick = () => {
      this.folderInput.click();
    };

    this.onFileInputChange = event => {
      this.props.handleInputChange(event); // We clear the input after a file is selected, because otherwise
      // change event is not fired in Chrome and Safari when a file
      // with the same name is selected.
      // ___Why not use value="" on <input/> instead?
      //    Because if we use that method of clearing the input,
      //    Chrome will not trigger change if we drop the same file twice (Issue #768).

      event.target.value = null;
    };

    this.renderHiddenInput = (isFolder, refCallback) => {
      return h("input", {
        className: "uppy-Dashboard-input",
        hidden: true,
        "aria-hidden": "true",
        tabIndex: -1,
        webkitdirectory: isFolder,
        type: "file",
        name: "files[]",
        multiple: this.props.maxNumberOfFiles !== 1,
        onChange: this.onFileInputChange,
        accept: this.props.allowedFileTypes,
        ref: refCallback
      });
    };

    this.renderMyDeviceAcquirer = () => {
      return h("div", {
        className: "uppy-DashboardTab",
        role: "presentation",
        "data-uppy-acquirer-id": "MyDevice"
      }, h("button", {
        type: "button",
        className: "uppy-u-reset uppy-c-btn uppy-DashboardTab-btn",
        role: "tab",
        tabIndex: 0,
        "data-uppy-super-focusable": true,
        onClick: this.triggerFileInputClick
      }, h("svg", {
        "aria-hidden": "true",
        focusable: "false",
        width: "32",
        height: "32",
        viewBox: "0 0 32 32"
      }, h("g", {
        fill: "none",
        fillRule: "evenodd"
      }, h("rect", {
        className: "uppy-ProviderIconBg",
        width: "32",
        height: "32",
        rx: "16",
        fill: "#2275D7"
      }), h("path", {
        d: "M21.973 21.152H9.863l-1.108-5.087h14.464l-1.246 5.087zM9.935 11.37h3.958l.886 1.444a.673.673 0 0 0 .585.316h6.506v1.37H9.935v-3.13zm14.898 3.44a.793.793 0 0 0-.616-.31h-.978v-2.126c0-.379-.275-.613-.653-.613H15.75l-.886-1.445a.673.673 0 0 0-.585-.316H9.232c-.378 0-.667.209-.667.587V14.5h-.782a.793.793 0 0 0-.61.303.795.795 0 0 0-.155.663l1.45 6.633c.078.36.396.618.764.618h13.354c.36 0 .674-.246.76-.595l1.631-6.636a.795.795 0 0 0-.144-.675z",
        fill: "#FFF"
      }))), h("div", {
        className: "uppy-DashboardTab-name"
      }, this.props.i18n('myDevice'))));
    };

    this.renderBrowseButton = (text, onClickFn) => {
      const numberOfAcquirers = this.props.acquirers.length;
      return h("button", {
        type: "button",
        className: "uppy-u-reset uppy-Dashboard-browse",
        onClick: onClickFn,
        "data-uppy-super-focusable": numberOfAcquirers === 0
      }, text);
    };

    this.renderDropPasteBrowseTagline = () => {
      const numberOfAcquirers = this.props.acquirers.length;
      const browseFiles = this.renderBrowseButton(this.props.i18n('browseFiles'), this.triggerFileInputClick);
      const browseFolders = this.renderBrowseButton(this.props.i18n('browseFolders'), this.triggerFolderInputClick); // in order to keep the i18n CamelCase and options lower (as are defaults) we will want to transform a lower
      // to Camel

      const lowerFMSelectionType = this.props.fileManagerSelectionType;
      const camelFMSelectionType = lowerFMSelectionType.charAt(0).toUpperCase() + lowerFMSelectionType.slice(1);
      return h("div", {
        class: "uppy-Dashboard-AddFiles-title"
      }, // eslint-disable-next-line no-nested-ternary
      this.props.disableLocalFiles ? this.props.i18n('importFiles') : numberOfAcquirers > 0 ? this.props.i18nArray(`dropPasteImport${camelFMSelectionType}`, {
        browseFiles,
        browseFolders,
        browse: browseFiles
      }) : this.props.i18nArray(`dropPaste${camelFMSelectionType}`, {
        browseFiles,
        browseFolders,
        browse: browseFiles
      }));
    };

    this.renderAcquirer = acquirer => {
      return h("div", {
        className: "uppy-DashboardTab",
        role: "presentation",
        "data-uppy-acquirer-id": acquirer.id
      }, h("button", {
        type: "button",
        className: "uppy-u-reset uppy-c-btn uppy-DashboardTab-btn",
        role: "tab",
        tabIndex: 0,
        "data-cy": acquirer.id,
        "aria-controls": `uppy-DashboardContent-panel--${acquirer.id}`,
        "aria-selected": this.props.activePickerPanel.id === acquirer.id,
        "data-uppy-super-focusable": true,
        onClick: () => this.props.showPanel(acquirer.id)
      }, acquirer.icon(), h("div", {
        className: "uppy-DashboardTab-name"
      }, acquirer.name)));
    };

    this.renderAcquirers = (acquirers, disableLocalFiles) => {
      // Group last two buttons, so we don’t end up with
      // just one button on a new line
      const acquirersWithoutLastTwo = [...acquirers];
      const lastTwoAcquirers = acquirersWithoutLastTwo.splice(acquirers.length - 2, acquirers.length);
      return h("div", {
        className: "uppy-Dashboard-AddFiles-list",
        role: "tablist"
      }, !disableLocalFiles && this.renderMyDeviceAcquirer(), acquirersWithoutLastTwo.map(acquirer => this.renderAcquirer(acquirer)), h("span", {
        role: "presentation",
        style: {
          'white-space': 'nowrap'
        }
      }, lastTwoAcquirers.map(acquirer => this.renderAcquirer(acquirer))));
    };
  }

  [_Symbol$for]() {
    // Those are actually used in `renderDropPasteBrowseTagline` method.
    this.props.i18nArray('dropPasteBoth');
    this.props.i18nArray('dropPasteFiles');
    this.props.i18nArray('dropPasteFolders');
    this.props.i18nArray('dropPasteImportBoth');
    this.props.i18nArray('dropPasteImportFiles');
    this.props.i18nArray('dropPasteImportFolders');
  }

  renderPoweredByUppy() {
    const {
      i18nArray
    } = this.props;
    const uppyBranding = h("span", null, h("svg", {
      "aria-hidden": "true",
      focusable: "false",
      className: "uppy-c-icon uppy-Dashboard-poweredByIcon",
      width: "11",
      height: "11",
      viewBox: "0 0 11 11"
    }, h("path", {
      d: "M7.365 10.5l-.01-4.045h2.612L5.5.806l-4.467 5.65h2.604l.01 4.044h3.718z",
      fillRule: "evenodd"
    })), h("span", {
      className: "uppy-Dashboard-poweredByUppy"
    }, "Uppy"));
    const linkText = i18nArray('poweredBy', {
      uppy: uppyBranding
    });
    return h("a", {
      tabIndex: "-1",
      href: "https://uppy.io",
      rel: "noreferrer noopener",
      target: "_blank",
      className: "uppy-Dashboard-poweredBy"
    }, linkText);
  }

  render() {
    return h("div", {
      className: "uppy-Dashboard-AddFiles"
    }, this.renderHiddenInput(false, ref => {
      this.fileInput = ref;
    }), this.renderHiddenInput(true, ref => {
      this.folderInput = ref;
    }), this.renderDropPasteBrowseTagline(), this.props.acquirers.length > 0 && this.renderAcquirers(this.props.acquirers, this.props.disableLocalFiles), h("div", {
      className: "uppy-Dashboard-AddFiles-info"
    }, this.props.note && h("div", {
      className: "uppy-Dashboard-note"
    }, this.props.note), this.props.proudlyDisplayPoweredByUppy && this.renderPoweredByUppy(this.props)));
  }

}

module.exports = AddFiles;

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/AddFilesPanel.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/AddFilesPanel.js ***!
  \**********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  h
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const classNames = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");

const AddFiles = __webpack_require__(/*! ./AddFiles */ "./node_modules/@uppy/dashboard/lib/components/AddFiles.js");

const AddFilesPanel = props => {
  return h("div", {
    className: classNames('uppy-Dashboard-AddFilesPanel', props.className),
    "data-uppy-panelType": "AddFiles",
    "aria-hidden": props.showAddFilesPanel
  }, h("div", {
    className: "uppy-DashboardContent-bar"
  }, h("div", {
    className: "uppy-DashboardContent-title",
    role: "heading",
    "aria-level": "1"
  }, props.i18n('addingMoreFiles')), h("button", {
    className: "uppy-DashboardContent-back",
    type: "button",
    onClick: () => props.toggleAddFilesPanel(false)
  }, props.i18n('back'))), h(AddFiles, props));
};

module.exports = AddFilesPanel;

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/Dashboard.js":
/*!******************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/Dashboard.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const {
  h
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const classNames = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");

const isDragDropSupported = __webpack_require__(/*! @uppy/utils/lib/isDragDropSupported */ "./node_modules/@uppy/utils/lib/isDragDropSupported.js");

const FileList = __webpack_require__(/*! ./FileList */ "./node_modules/@uppy/dashboard/lib/components/FileList.js");

const AddFiles = __webpack_require__(/*! ./AddFiles */ "./node_modules/@uppy/dashboard/lib/components/AddFiles.js");

const AddFilesPanel = __webpack_require__(/*! ./AddFilesPanel */ "./node_modules/@uppy/dashboard/lib/components/AddFilesPanel.js");

const PickerPanelContent = __webpack_require__(/*! ./PickerPanelContent */ "./node_modules/@uppy/dashboard/lib/components/PickerPanelContent.js");

const EditorPanel = __webpack_require__(/*! ./EditorPanel */ "./node_modules/@uppy/dashboard/lib/components/EditorPanel.js");

const PanelTopBar = __webpack_require__(/*! ./PickerPanelTopBar */ "./node_modules/@uppy/dashboard/lib/components/PickerPanelTopBar.js");

const FileCard = __webpack_require__(/*! ./FileCard */ "./node_modules/@uppy/dashboard/lib/components/FileCard/index.js");

const Slide = __webpack_require__(/*! ./Slide */ "./node_modules/@uppy/dashboard/lib/components/Slide.js"); // http://dev.edenspiekermann.com/2016/02/11/introducing-accessible-modal-dialog
// https://github.com/ghosh/micromodal


const WIDTH_XL = 900;
const WIDTH_LG = 700;
const WIDTH_MD = 576;
const HEIGHT_MD = 400;

module.exports = function Dashboard(props) {
  const noFiles = props.totalFileCount === 0;
  const isSizeMD = props.containerWidth > WIDTH_MD;
  const dashboardClassName = classNames({
    'uppy-Dashboard': true,
    'uppy-Dashboard--isDisabled': props.disabled,
    'uppy-Dashboard--animateOpenClose': props.animateOpenClose,
    'uppy-Dashboard--isClosing': props.isClosing,
    'uppy-Dashboard--isDraggingOver': props.isDraggingOver,
    'uppy-Dashboard--modal': !props.inline,
    'uppy-size--md': props.containerWidth > WIDTH_MD,
    'uppy-size--lg': props.containerWidth > WIDTH_LG,
    'uppy-size--xl': props.containerWidth > WIDTH_XL,
    'uppy-size--height-md': props.containerHeight > HEIGHT_MD,
    'uppy-Dashboard--isAddFilesPanelVisible': props.showAddFilesPanel,
    'uppy-Dashboard--isInnerWrapVisible': props.areInsidesReadyToBeVisible
  }); // Important: keep these in sync with the percent width values in `src/components/FileItem/index.scss`.

  let itemsPerRow = 1; // mobile

  if (props.containerWidth > WIDTH_XL) {
    itemsPerRow = 5;
  } else if (props.containerWidth > WIDTH_LG) {
    itemsPerRow = 4;
  } else if (props.containerWidth > WIDTH_MD) {
    itemsPerRow = 3;
  }

  const showFileList = props.showSelectedFiles && !noFiles;
  const numberOfFilesForRecovery = props.recoveredState ? Object.keys(props.recoveredState.files).length : null;
  const numberOfGhosts = props.files ? Object.keys(props.files).filter(fileID => props.files[fileID].isGhost).length : null;

  const renderRestoredText = () => {
    if (numberOfGhosts > 0) {
      return props.i18n('recoveredXFiles', {
        smart_count: numberOfGhosts
      });
    }

    return props.i18n('recoveredAllFiles');
  };

  const dashboard = h("div", {
    className: dashboardClassName,
    "data-uppy-theme": props.theme,
    "data-uppy-num-acquirers": props.acquirers.length,
    "data-uppy-drag-drop-supported": !props.disableLocalFiles && isDragDropSupported(),
    "aria-hidden": props.inline ? 'false' : props.isHidden,
    "aria-disabled": props.disabled,
    "aria-label": !props.inline ? props.i18n('dashboardWindowTitle') : props.i18n('dashboardTitle'),
    onPaste: props.handlePaste,
    onDragOver: props.handleDragOver,
    onDragLeave: props.handleDragLeave,
    onDrop: props.handleDrop
  }, h("div", {
    "aria-hidden": "true",
    className: "uppy-Dashboard-overlay",
    tabIndex: -1,
    onClick: props.handleClickOutside
  }), h("div", {
    className: "uppy-Dashboard-inner",
    "aria-modal": !props.inline && 'true',
    role: !props.inline && 'dialog',
    style: {
      width: props.inline && props.width ? props.width : '',
      height: props.inline && props.height ? props.height : ''
    }
  }, !props.inline ? h("button", {
    className: "uppy-u-reset uppy-Dashboard-close",
    type: "button",
    "aria-label": props.i18n('closeModal'),
    title: props.i18n('closeModal'),
    onClick: props.closeModal
  }, h("span", {
    "aria-hidden": "true"
  }, "\xD7")) : null, h("div", {
    className: "uppy-Dashboard-innerWrap"
  }, h("div", {
    className: "uppy-Dashboard-dropFilesHereHint"
  }, props.i18n('dropHint')), showFileList && h(PanelTopBar, props), numberOfFilesForRecovery && h("div", {
    className: "uppy-Dashboard-serviceMsg"
  }, h("svg", {
    className: "uppy-Dashboard-serviceMsg-icon",
    "aria-hidden": "true",
    focusable: "false",
    width: "21",
    height: "16",
    viewBox: "0 0 24 19"
  }, h("g", {
    transform: "translate(0 -1)",
    fill: "none",
    fillRule: "evenodd"
  }, h("path", {
    d: "M12.857 1.43l10.234 17.056A1 1 0 0122.234 20H1.766a1 1 0 01-.857-1.514L11.143 1.429a1 1 0 011.714 0z",
    fill: "#FFD300"
  }), h("path", {
    fill: "#000",
    d: "M11 6h2l-.3 8h-1.4z"
  }), h("circle", {
    fill: "#000",
    cx: "12",
    cy: "17",
    r: "1"
  }))), h("strong", {
    className: "uppy-Dashboard-serviceMsg-title"
  }, props.i18n('sessionRestored')), h("div", {
    className: "uppy-Dashboard-serviceMsg-text"
  }, renderRestoredText())), showFileList ? h(FileList, _extends({}, props, {
    itemsPerRow: itemsPerRow
  })) : h(AddFiles, _extends({}, props, {
    isSizeMD: isSizeMD
  })), h(Slide, null, props.showAddFilesPanel ? h(AddFilesPanel, _extends({
    key: "AddFiles"
  }, props, {
    isSizeMD: isSizeMD
  })) : null), h(Slide, null, props.fileCardFor ? h(FileCard, _extends({
    key: "FileCard"
  }, props)) : null), h(Slide, null, props.activePickerPanel ? h(PickerPanelContent, _extends({
    key: "Picker"
  }, props)) : null), h(Slide, null, props.showFileEditor ? h(EditorPanel, _extends({
    key: "Editor"
  }, props)) : null), h("div", {
    className: "uppy-Dashboard-progressindicators"
  }, props.progressindicators.map(target => {
    return props.uppy.getPlugin(target.id).render(props.state);
  })))));
  return dashboard;
};

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/EditorPanel.js":
/*!********************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/EditorPanel.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  h
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const classNames = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");

function EditorPanel(props) {
  const file = props.files[props.fileCardFor];
  return h("div", {
    className: classNames('uppy-DashboardContent-panel', props.className),
    role: "tabpanel",
    "data-uppy-panelType": "FileEditor",
    id: "uppy-DashboardContent-panel--editor"
  }, h("div", {
    className: "uppy-DashboardContent-bar"
  }, h("div", {
    className: "uppy-DashboardContent-title",
    role: "heading",
    "aria-level": "1"
  }, props.i18nArray('editing', {
    file: h("span", {
      className: "uppy-DashboardContent-titleFile"
    }, file.meta ? file.meta.name : file.name)
  })), h("button", {
    className: "uppy-DashboardContent-back",
    type: "button",
    onClick: props.hideAllPanels
  }, props.i18n('cancel')), h("button", {
    className: "uppy-DashboardContent-save",
    type: "button",
    onClick: props.saveFileEditor
  }, props.i18n('save'))), h("div", {
    className: "uppy-DashboardContent-panelBody"
  }, props.editors.map(target => {
    return props.uppy.getPlugin(target.id).render(props.state);
  })));
}

module.exports = EditorPanel;

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/FileCard/index.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/FileCard/index.js ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  h,
  Component
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const classNames = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");

const {
  nanoid
} = __webpack_require__(/*! nanoid/non-secure */ "./node_modules/nanoid/non-secure/index.cjs");

const getFileTypeIcon = __webpack_require__(/*! ../../utils/getFileTypeIcon */ "./node_modules/@uppy/dashboard/lib/utils/getFileTypeIcon.js");

const ignoreEvent = __webpack_require__(/*! ../../utils/ignoreEvent.js */ "./node_modules/@uppy/dashboard/lib/utils/ignoreEvent.js");

const FilePreview = __webpack_require__(/*! ../FilePreview */ "./node_modules/@uppy/dashboard/lib/components/FilePreview.js");

class FileCard extends Component {
  constructor(props) {
    super(props);
    this.form = document.createElement('form');

    this.updateMeta = (newVal, name) => {
      this.setState(_ref => {
        let {
          formState
        } = _ref;
        return {
          formState: { ...formState,
            [name]: newVal
          }
        };
      });
    };

    this.handleSave = e => {
      e.preventDefault();
      const fileID = this.props.fileCardFor;
      this.props.saveFileCard(this.state.formState, fileID);
    };

    this.handleCancel = () => {
      this.props.toggleFileCard(false);
    };

    this.saveOnEnter = ev => {
      if (ev.keyCode === 13) {
        ev.stopPropagation();
        ev.preventDefault();
        const file = this.props.files[this.props.fileCardFor];
        this.props.saveFileCard(this.state.formState, file.id);
      }
    };

    this.renderMetaFields = () => {
      const metaFields = this.getMetaFields() || [];
      const fieldCSSClasses = {
        text: 'uppy-u-reset uppy-c-textInput uppy-Dashboard-FileCard-input'
      };
      return metaFields.map(field => {
        const id = `uppy-Dashboard-FileCard-input-${field.id}`;
        const required = this.props.requiredMetaFields.includes(field.id);
        return h("fieldset", {
          key: field.id,
          className: "uppy-Dashboard-FileCard-fieldset"
        }, h("label", {
          className: "uppy-Dashboard-FileCard-label",
          htmlFor: id
        }, field.name), field.render !== undefined ? field.render({
          value: this.state.formState[field.id],
          onChange: newVal => this.updateMeta(newVal, field.id),
          fieldCSSClasses,
          required,
          form: this.form.id
        }, h) : h("input", {
          className: fieldCSSClasses.text,
          id: id,
          form: this.form.id,
          type: field.type || 'text',
          required: required,
          value: this.state.formState[field.id],
          placeholder: field.placeholder // If `form` attribute is not supported, we need to capture pressing Enter to avoid bubbling in case Uppy is
          // embedded inside a <form>.
          ,
          onKeyUp: 'form' in HTMLInputElement.prototype ? undefined : this.saveOnEnter,
          onKeyDown: 'form' in HTMLInputElement.prototype ? undefined : this.saveOnEnter,
          onKeyPress: 'form' in HTMLInputElement.prototype ? undefined : this.saveOnEnter,
          onInput: ev => this.updateMeta(ev.target.value, field.id),
          "data-uppy-super-focusable": true
        }));
      });
    };

    const _file = this.props.files[this.props.fileCardFor];

    const _metaFields = this.getMetaFields() || [];

    const storedMetaData = {};

    _metaFields.forEach(field => {
      storedMetaData[field.id] = _file.meta[field.id] || '';
    });

    this.state = {
      formState: storedMetaData
    };
    this.form.id = nanoid();
  } // TODO(aduh95): move this to `UNSAFE_componentWillMount` when updating to Preact X+.


  componentWillMount() {
    // eslint-disable-line react/no-deprecated
    this.form.addEventListener('submit', this.handleSave);
    document.body.appendChild(this.form);
  }

  componentWillUnmount() {
    this.form.removeEventListener('submit', this.handleSave);
    document.body.removeChild(this.form);
  }

  getMetaFields() {
    return typeof this.props.metaFields === 'function' ? this.props.metaFields(this.props.files[this.props.fileCardFor]) : this.props.metaFields;
  }

  render() {
    const file = this.props.files[this.props.fileCardFor];
    const showEditButton = this.props.canEditFile(file);
    return h("div", {
      className: classNames('uppy-Dashboard-FileCard', this.props.className),
      "data-uppy-panelType": "FileCard",
      onDragOver: ignoreEvent,
      onDragLeave: ignoreEvent,
      onDrop: ignoreEvent,
      onPaste: ignoreEvent
    }, h("div", {
      className: "uppy-DashboardContent-bar"
    }, h("div", {
      className: "uppy-DashboardContent-title",
      role: "heading",
      "aria-level": "1"
    }, this.props.i18nArray('editing', {
      file: h("span", {
        className: "uppy-DashboardContent-titleFile"
      }, file.meta ? file.meta.name : file.name)
    })), h("button", {
      className: "uppy-DashboardContent-back",
      type: "button",
      form: this.form.id,
      title: this.props.i18n('finishEditingFile'),
      onClick: this.handleCancel
    }, this.props.i18n('cancel'))), h("div", {
      className: "uppy-Dashboard-FileCard-inner"
    }, h("div", {
      className: "uppy-Dashboard-FileCard-preview",
      style: {
        backgroundColor: getFileTypeIcon(file.type).color
      }
    }, h(FilePreview, {
      file: file
    }), showEditButton && h("button", {
      type: "button",
      className: "uppy-u-reset uppy-c-btn uppy-Dashboard-FileCard-edit",
      onClick: event => {
        // When opening the image editor we want to save any meta fields changes.
        // Otherwise it's confusing for the user to click save in the editor,
        // but the changes here are discarded. This bypasses validation,
        // but we are okay with that.
        this.handleSave(event);
        this.props.openFileEditor(file);
      },
      form: this.form.id
    }, this.props.i18n('editFile'))), h("div", {
      className: "uppy-Dashboard-FileCard-info"
    }, this.renderMetaFields()), h("div", {
      className: "uppy-Dashboard-FileCard-actions"
    }, h("button", {
      className: "uppy-u-reset uppy-c-btn uppy-c-btn-primary uppy-Dashboard-FileCard-actionsBtn" // If `form` attribute is supported, we want a submit button to trigger the form validation.
      // Otherwise, fallback to a classic button with a onClick event handler.
      ,
      type: 'form' in HTMLButtonElement.prototype ? 'submit' : 'button',
      onClick: 'form' in HTMLButtonElement.prototype ? undefined : this.handleSave,
      form: this.form.id
    }, this.props.i18n('saveChanges')), h("button", {
      className: "uppy-u-reset uppy-c-btn uppy-c-btn-link uppy-Dashboard-FileCard-actionsBtn",
      type: "button",
      onClick: this.handleCancel,
      form: this.form.id
    }, this.props.i18n('cancel')))));
  }

}

module.exports = FileCard;

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/FileItem/Buttons/index.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/FileItem/Buttons/index.js ***!
  \*******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  h
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const copyToClipboard = __webpack_require__(/*! ../../../utils/copyToClipboard */ "./node_modules/@uppy/dashboard/lib/utils/copyToClipboard.js");

function EditButton(_ref) {
  let {
    file,
    uploadInProgressOrComplete,
    metaFields,
    canEditFile,
    i18n,
    onClick
  } = _ref;

  if (!uploadInProgressOrComplete && metaFields && metaFields.length > 0 || !uploadInProgressOrComplete && canEditFile(file)) {
    return h("button", {
      className: "uppy-u-reset uppy-Dashboard-Item-action uppy-Dashboard-Item-action--edit",
      type: "button",
      "aria-label": i18n('editFileWithFilename', {
        file: file.meta.name
      }),
      title: i18n('editFileWithFilename', {
        file: file.meta.name
      }),
      onClick: () => onClick()
    }, h("svg", {
      "aria-hidden": "true",
      focusable: "false",
      className: "uppy-c-icon",
      width: "14",
      height: "14",
      viewBox: "0 0 14 14"
    }, h("g", {
      fillRule: "evenodd"
    }, h("path", {
      d: "M1.5 10.793h2.793A1 1 0 0 0 5 10.5L11.5 4a1 1 0 0 0 0-1.414L9.707.793a1 1 0 0 0-1.414 0l-6.5 6.5A1 1 0 0 0 1.5 8v2.793zm1-1V8L9 1.5l1.793 1.793-6.5 6.5H2.5z",
      fillRule: "nonzero"
    }), h("rect", {
      x: "1",
      y: "12.293",
      width: "11",
      height: "1",
      rx: ".5"
    }), h("path", {
      fillRule: "nonzero",
      d: "M6.793 2.5L9.5 5.207l.707-.707L7.5 1.793z"
    }))));
  }

  return null;
}

function RemoveButton(_ref2) {
  let {
    i18n,
    onClick,
    file
  } = _ref2;
  return h("button", {
    className: "uppy-u-reset uppy-Dashboard-Item-action uppy-Dashboard-Item-action--remove",
    type: "button",
    "aria-label": i18n('removeFile', {
      file: file.meta.name
    }),
    title: i18n('removeFile', {
      file: file.meta.name
    }),
    onClick: () => onClick()
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "18",
    height: "18",
    viewBox: "0 0 18 18"
  }, h("path", {
    d: "M9 0C4.034 0 0 4.034 0 9s4.034 9 9 9 9-4.034 9-9-4.034-9-9-9z"
  }), h("path", {
    fill: "#FFF",
    d: "M13 12.222l-.778.778L9 9.778 5.778 13 5 12.222 8.222 9 5 5.778 5.778 5 9 8.222 12.222 5l.778.778L9.778 9z"
  })));
}

const copyLinkToClipboard = (event, props) => {
  copyToClipboard(props.file.uploadURL, props.i18n('copyLinkToClipboardFallback')).then(() => {
    props.uppy.log('Link copied to clipboard.');
    props.uppy.info(props.i18n('copyLinkToClipboardSuccess'), 'info', 3000);
  }).catch(props.uppy.log) // avoid losing focus
  .then(() => event.target.focus({
    preventScroll: true
  }));
};

function CopyLinkButton(props) {
  const {
    i18n
  } = props;
  return h("button", {
    className: "uppy-u-reset uppy-Dashboard-Item-action uppy-Dashboard-Item-action--copyLink",
    type: "button",
    "aria-label": i18n('copyLink'),
    title: i18n('copyLink'),
    onClick: event => copyLinkToClipboard(event, props)
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "14",
    height: "14",
    viewBox: "0 0 14 12"
  }, h("path", {
    d: "M7.94 7.703a2.613 2.613 0 0 1-.626 2.681l-.852.851a2.597 2.597 0 0 1-1.849.766A2.616 2.616 0 0 1 2.764 7.54l.852-.852a2.596 2.596 0 0 1 2.69-.625L5.267 7.099a1.44 1.44 0 0 0-.833.407l-.852.851a1.458 1.458 0 0 0 1.03 2.486c.39 0 .755-.152 1.03-.426l.852-.852c.231-.231.363-.522.406-.824l1.04-1.038zm4.295-5.937A2.596 2.596 0 0 0 10.387 1c-.698 0-1.355.272-1.849.766l-.852.851a2.614 2.614 0 0 0-.624 2.688l1.036-1.036c.041-.304.173-.6.407-.833l.852-.852c.275-.275.64-.426 1.03-.426a1.458 1.458 0 0 1 1.03 2.486l-.852.851a1.442 1.442 0 0 1-.824.406l-1.04 1.04a2.596 2.596 0 0 0 2.683-.628l.851-.85a2.616 2.616 0 0 0 0-3.697zm-6.88 6.883a.577.577 0 0 0 .82 0l3.474-3.474a.579.579 0 1 0-.819-.82L5.355 7.83a.579.579 0 0 0 0 .819z"
  })));
}

module.exports = function Buttons(props) {
  const {
    uppy,
    file,
    uploadInProgressOrComplete,
    canEditFile,
    metaFields,
    showLinkToFileUploadResult,
    showRemoveButton,
    i18n,
    toggleFileCard,
    openFileEditor
  } = props;

  const editAction = () => {
    if (metaFields && metaFields.length > 0) {
      toggleFileCard(true, file.id);
    } else {
      openFileEditor(file);
    }
  };

  return h("div", {
    className: "uppy-Dashboard-Item-actionWrapper"
  }, h(EditButton, {
    i18n: i18n,
    file: file,
    uploadInProgressOrComplete: uploadInProgressOrComplete,
    canEditFile: canEditFile,
    metaFields: metaFields,
    onClick: editAction
  }), showLinkToFileUploadResult && file.uploadURL ? h(CopyLinkButton, {
    file: file,
    uppy: uppy,
    i18n: i18n
  }) : null, showRemoveButton ? h(RemoveButton, {
    i18n: i18n,
    file: file,
    uppy: uppy,
    onClick: () => props.uppy.removeFile(file.id, 'removed-by-user')
  }) : null);
};

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/FileItem/FileInfo/index.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/FileItem/FileInfo/index.js ***!
  \********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  h,
  Fragment
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const prettierBytes = __webpack_require__(/*! @transloadit/prettier-bytes */ "./node_modules/@transloadit/prettier-bytes/prettierBytes.js");

const truncateString = __webpack_require__(/*! @uppy/utils/lib/truncateString */ "./node_modules/@uppy/utils/lib/truncateString.js");

const MetaErrorMessage = __webpack_require__(/*! ../MetaErrorMessage */ "./node_modules/@uppy/dashboard/lib/components/FileItem/MetaErrorMessage.js");

const renderFileName = props => {
  const {
    author,
    name
  } = props.file.meta;

  function getMaxNameLength() {
    if (props.containerWidth <= 352) {
      return 35;
    }

    if (props.containerWidth <= 576) {
      return 60;
    } // When `author` is present, we want to make sure
    // the file name fits on one line so we can place
    // the author on the second line.


    return author ? 20 : 30;
  }

  return h("div", {
    className: "uppy-Dashboard-Item-name",
    title: name
  }, truncateString(name, getMaxNameLength()));
};

const renderAuthor = props => {
  const {
    author
  } = props.file.meta;
  const {
    providerName
  } = props.file.remote;
  const dot = `\u00B7`;

  if (!author) {
    return null;
  }

  return h("div", {
    className: "uppy-Dashboard-Item-author"
  }, h("a", {
    href: `${author.url}?utm_source=Companion&utm_medium=referral`,
    target: "_blank",
    rel: "noopener noreferrer"
  }, truncateString(author.name, 13)), providerName ? h(Fragment, null, ` ${dot} `, providerName, ` ${dot} `) : null);
};

const renderFileSize = props => props.file.size && h("div", {
  className: "uppy-Dashboard-Item-statusSize"
}, prettierBytes(props.file.size));

const ReSelectButton = props => props.file.isGhost && h("span", null, ' \u2022 ', h("button", {
  className: "uppy-u-reset uppy-c-btn uppy-Dashboard-Item-reSelect",
  type: "button",
  onClick: props.toggleAddFilesPanel
}, props.i18n('reSelect')));

const ErrorButton = _ref => {
  let {
    file,
    onClick
  } = _ref;

  if (file.error) {
    return h("button", {
      className: "uppy-u-reset uppy-Dashboard-Item-errorDetails",
      "aria-label": file.error,
      "data-microtip-position": "bottom",
      "data-microtip-size": "medium",
      onClick: onClick,
      type: "button"
    }, "?");
  }

  return null;
};

module.exports = function FileInfo(props) {
  const {
    file
  } = props;
  return h("div", {
    className: "uppy-Dashboard-Item-fileInfo",
    "data-uppy-file-source": file.source
  }, h("div", {
    className: "uppy-Dashboard-Item-fileName"
  }, renderFileName(props), h(ErrorButton, {
    file: props.file // eslint-disable-next-line no-alert
    ,
    onClick: () => alert(props.file.error) // TODO: move to a custom alert implementation

  })), h("div", {
    className: "uppy-Dashboard-Item-status"
  }, renderAuthor(props), renderFileSize(props), ReSelectButton(props)), h(MetaErrorMessage, {
    file: props.file,
    i18n: props.i18n,
    toggleFileCard: props.toggleFileCard,
    metaFields: props.metaFields
  }));
};

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/FileItem/FilePreviewAndLink/index.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/FileItem/FilePreviewAndLink/index.js ***!
  \******************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  h
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const FilePreview = __webpack_require__(/*! ../../FilePreview */ "./node_modules/@uppy/dashboard/lib/components/FilePreview.js");

const MetaErrorMessage = __webpack_require__(/*! ../MetaErrorMessage */ "./node_modules/@uppy/dashboard/lib/components/FileItem/MetaErrorMessage.js");

const getFileTypeIcon = __webpack_require__(/*! ../../../utils/getFileTypeIcon */ "./node_modules/@uppy/dashboard/lib/utils/getFileTypeIcon.js");

module.exports = function FilePreviewAndLink(props) {
  return h("div", {
    className: "uppy-Dashboard-Item-previewInnerWrap",
    style: {
      backgroundColor: getFileTypeIcon(props.file.type).color
    }
  }, props.showLinkToFileUploadResult && props.file.uploadURL && h("a", {
    className: "uppy-Dashboard-Item-previewLink",
    href: props.file.uploadURL,
    rel: "noreferrer noopener",
    target: "_blank",
    "aria-label": props.file.meta.name
  }, h("span", {
    hidden: true
  }, props.file.meta.name)), h(FilePreview, {
    file: props.file
  }), h(MetaErrorMessage, {
    file: props.file,
    i18n: props.i18n,
    toggleFileCard: props.toggleFileCard,
    metaFields: props.metaFields
  }));
};

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/FileItem/FileProgress/index.js":
/*!************************************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/FileItem/FileProgress/index.js ***!
  \************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  h
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

function onPauseResumeCancelRetry(props) {
  if (props.isUploaded) return;

  if (props.error && !props.hideRetryButton) {
    props.uppy.retryUpload(props.file.id);
    return;
  }

  if (props.resumableUploads && !props.hidePauseResumeButton) {
    props.uppy.pauseResume(props.file.id);
  } else if (props.individualCancellation && !props.hideCancelButton) {
    props.uppy.removeFile(props.file.id);
  }
}

function progressIndicatorTitle(props) {
  if (props.isUploaded) {
    return props.i18n('uploadComplete');
  }

  if (props.error) {
    return props.i18n('retryUpload');
  }

  if (props.resumableUploads) {
    if (props.file.isPaused) {
      return props.i18n('resumeUpload');
    }

    return props.i18n('pauseUpload');
  }

  if (props.individualCancellation) {
    return props.i18n('cancelUpload');
  }

  return '';
}

function ProgressIndicatorButton(props) {
  return h("div", {
    className: "uppy-Dashboard-Item-progress"
  }, h("button", {
    className: "uppy-u-reset uppy-Dashboard-Item-progressIndicator",
    type: "button",
    "aria-label": progressIndicatorTitle(props),
    title: progressIndicatorTitle(props),
    onClick: () => onPauseResumeCancelRetry(props)
  }, props.children));
}

function ProgressCircleContainer(_ref) {
  let {
    children
  } = _ref;
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    width: "70",
    height: "70",
    viewBox: "0 0 36 36",
    className: "uppy-c-icon uppy-Dashboard-Item-progressIcon--circle"
  }, children);
}

function ProgressCircle(_ref2) {
  let {
    progress
  } = _ref2;
  // circle length equals 2 * PI * R
  const circleLength = 2 * Math.PI * 15;
  return h("g", null, h("circle", {
    className: "uppy-Dashboard-Item-progressIcon--bg",
    r: "15",
    cx: "18",
    cy: "18",
    "stroke-width": "2",
    fill: "none"
  }), h("circle", {
    className: "uppy-Dashboard-Item-progressIcon--progress",
    r: "15",
    cx: "18",
    cy: "18",
    transform: "rotate(-90, 18, 18)",
    fill: "none",
    "stroke-width": "2",
    "stroke-dasharray": circleLength,
    "stroke-dashoffset": circleLength - circleLength / 100 * progress
  }));
}

module.exports = function FileProgress(props) {
  // Nothing if upload has not started
  if (!props.file.progress.uploadStarted) {
    return null;
  } // Green checkmark when complete


  if (props.isUploaded) {
    return h("div", {
      className: "uppy-Dashboard-Item-progress"
    }, h("div", {
      className: "uppy-Dashboard-Item-progressIndicator"
    }, h(ProgressCircleContainer, null, h("circle", {
      r: "15",
      cx: "18",
      cy: "18",
      fill: "#1bb240"
    }), h("polygon", {
      className: "uppy-Dashboard-Item-progressIcon--check",
      transform: "translate(2, 3)",
      points: "14 22.5 7 15.2457065 8.99985857 13.1732815 14 18.3547104 22.9729883 9 25 11.1005634"
    }))));
  }

  if (props.recoveredState) {
    return;
  } // Retry button for error


  if (props.error && !props.hideRetryButton) {
    return h(ProgressIndicatorButton, props, h("svg", {
      "aria-hidden": "true",
      focusable: "false",
      className: "uppy-c-icon uppy-Dashboard-Item-progressIcon--retry",
      width: "28",
      height: "31",
      viewBox: "0 0 16 19"
    }, h("path", {
      d: "M16 11a8 8 0 1 1-8-8v2a6 6 0 1 0 6 6h2z"
    }), h("path", {
      d: "M7.9 3H10v2H7.9z"
    }), h("path", {
      d: "M8.536.5l3.535 3.536-1.414 1.414L7.12 1.914z"
    }), h("path", {
      d: "M10.657 2.621l1.414 1.415L8.536 7.57 7.12 6.157z"
    })));
  } // Pause/resume button for resumable uploads


  if (props.resumableUploads && !props.hidePauseResumeButton) {
    return h(ProgressIndicatorButton, props, h(ProgressCircleContainer, null, h(ProgressCircle, {
      progress: props.file.progress.percentage
    }), props.file.isPaused ? h("polygon", {
      className: "uppy-Dashboard-Item-progressIcon--play",
      transform: "translate(3, 3)",
      points: "12 20 12 10 20 15"
    }) : h("g", {
      className: "uppy-Dashboard-Item-progressIcon--pause",
      transform: "translate(14.5, 13)"
    }, h("rect", {
      x: "0",
      y: "0",
      width: "2",
      height: "10",
      rx: "0"
    }), h("rect", {
      x: "5",
      y: "0",
      width: "2",
      height: "10",
      rx: "0"
    }))));
  } // Cancel button for non-resumable uploads if individualCancellation is supported (not bundled)


  if (!props.resumableUploads && props.individualCancellation && !props.hideCancelButton) {
    return h(ProgressIndicatorButton, props, h(ProgressCircleContainer, null, h(ProgressCircle, {
      progress: props.file.progress.percentage
    }), h("polygon", {
      className: "cancel",
      transform: "translate(2, 2)",
      points: "19.8856516 11.0625 16 14.9481516 12.1019737 11.0625 11.0625 12.1143484 14.9481516 16 11.0625 19.8980263 12.1019737 20.9375 16 17.0518484 19.8856516 20.9375 20.9375 19.8980263 17.0518484 16 20.9375 12"
    })));
  } // Just progress when buttons are disabled


  return h("div", {
    className: "uppy-Dashboard-Item-progress"
  }, h("div", {
    className: "uppy-Dashboard-Item-progressIndicator"
  }, h(ProgressCircleContainer, null, h(ProgressCircle, {
    progress: props.file.progress.percentage
  }))));
};

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/FileItem/MetaErrorMessage.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/FileItem/MetaErrorMessage.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  h
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const metaFieldIdToName = (metaFieldId, metaFields) => {
  const field = metaFields.filter(f => f.id === metaFieldId);
  return field[0].name;
};

module.exports = function renderMissingMetaFieldsError(props) {
  const {
    file,
    toggleFileCard,
    i18n,
    metaFields
  } = props;
  const {
    missingRequiredMetaFields
  } = file;

  if (!(missingRequiredMetaFields != null && missingRequiredMetaFields.length)) {
    return null;
  }

  const metaFieldsString = missingRequiredMetaFields.map(missingMetaField => metaFieldIdToName(missingMetaField, metaFields)).join(', ');
  return h("div", {
    className: "uppy-Dashboard-Item-errorMessage"
  }, i18n('missingRequiredMetaFields', {
    smart_count: missingRequiredMetaFields.length,
    fields: metaFieldsString
  }), ' ', h("button", {
    type: "button",
    class: "uppy-u-reset uppy-Dashboard-Item-errorMessageBtn",
    onClick: () => toggleFileCard(true, file.id)
  }, i18n('editFile')));
};

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/FileItem/index.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/FileItem/index.js ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  h,
  Component
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const classNames = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");

const shallowEqual = __webpack_require__(/*! is-shallow-equal */ "./node_modules/is-shallow-equal/index.js");

const FilePreviewAndLink = __webpack_require__(/*! ./FilePreviewAndLink */ "./node_modules/@uppy/dashboard/lib/components/FileItem/FilePreviewAndLink/index.js");

const FileProgress = __webpack_require__(/*! ./FileProgress */ "./node_modules/@uppy/dashboard/lib/components/FileItem/FileProgress/index.js");

const FileInfo = __webpack_require__(/*! ./FileInfo */ "./node_modules/@uppy/dashboard/lib/components/FileItem/FileInfo/index.js");

const Buttons = __webpack_require__(/*! ./Buttons */ "./node_modules/@uppy/dashboard/lib/components/FileItem/Buttons/index.js");

module.exports = class FileItem extends Component {
  componentDidMount() {
    const {
      file
    } = this.props;

    if (!file.preview) {
      this.props.handleRequestThumbnail(file);
    }
  }

  shouldComponentUpdate(nextProps) {
    return !shallowEqual(this.props, nextProps);
  } // VirtualList mounts FileItems again and they emit `thumbnail:request`
  // Otherwise thumbnails are broken or missing after Golden Retriever restores files


  componentDidUpdate() {
    const {
      file
    } = this.props;

    if (!file.preview) {
      this.props.handleRequestThumbnail(file);
    }
  }

  componentWillUnmount() {
    const {
      file
    } = this.props;

    if (!file.preview) {
      this.props.handleCancelThumbnail(file);
    }
  }

  render() {
    const {
      file
    } = this.props;
    const isProcessing = file.progress.preprocess || file.progress.postprocess;
    const isUploaded = file.progress.uploadComplete && !isProcessing && !file.error;
    const uploadInProgressOrComplete = file.progress.uploadStarted || isProcessing;
    const uploadInProgress = file.progress.uploadStarted && !file.progress.uploadComplete || isProcessing;
    const error = file.error || false; // File that Golden Retriever was able to partly restore (only meta, not blob),
    // users still need to re-add it, so it’s a ghost

    const {
      isGhost
    } = file;
    let showRemoveButton = this.props.individualCancellation ? !isUploaded : !uploadInProgress && !isUploaded;

    if (isUploaded && this.props.showRemoveButtonAfterComplete) {
      showRemoveButton = true;
    }

    const dashboardItemClass = classNames({
      'uppy-Dashboard-Item': true,
      'is-inprogress': uploadInProgress && !this.props.recoveredState,
      'is-processing': isProcessing,
      'is-complete': isUploaded,
      'is-error': !!error,
      'is-resumable': this.props.resumableUploads,
      'is-noIndividualCancellation': !this.props.individualCancellation,
      'is-ghost': isGhost
    });
    return h("div", {
      className: dashboardItemClass,
      id: `uppy_${file.id}`,
      role: this.props.role
    }, h("div", {
      className: "uppy-Dashboard-Item-preview"
    }, h(FilePreviewAndLink, {
      file: file,
      showLinkToFileUploadResult: this.props.showLinkToFileUploadResult,
      i18n: this.props.i18n,
      toggleFileCard: this.props.toggleFileCard,
      metaFields: this.props.metaFields
    }), h(FileProgress, {
      uppy: this.props.uppy,
      file: file,
      error: error,
      isUploaded: isUploaded,
      hideRetryButton: this.props.hideRetryButton,
      hideCancelButton: this.props.hideCancelButton,
      hidePauseResumeButton: this.props.hidePauseResumeButton,
      recoveredState: this.props.recoveredState,
      showRemoveButtonAfterComplete: this.props.showRemoveButtonAfterComplete,
      resumableUploads: this.props.resumableUploads,
      individualCancellation: this.props.individualCancellation,
      i18n: this.props.i18n
    })), h("div", {
      className: "uppy-Dashboard-Item-fileInfoAndButtons"
    }, h(FileInfo, {
      file: file,
      id: this.props.id,
      acquirers: this.props.acquirers,
      containerWidth: this.props.containerWidth,
      i18n: this.props.i18n,
      toggleAddFilesPanel: this.props.toggleAddFilesPanel,
      toggleFileCard: this.props.toggleFileCard,
      metaFields: this.props.metaFields
    }), h(Buttons, {
      file: file,
      metaFields: this.props.metaFields,
      showLinkToFileUploadResult: this.props.showLinkToFileUploadResult,
      showRemoveButton: showRemoveButton,
      canEditFile: this.props.canEditFile,
      uploadInProgressOrComplete: uploadInProgressOrComplete,
      toggleFileCard: this.props.toggleFileCard,
      openFileEditor: this.props.openFileEditor,
      uppy: this.props.uppy,
      i18n: this.props.i18n
    })));
  }

};

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/FileList.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/FileList.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const classNames = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");

const {
  h
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const FileItem = __webpack_require__(/*! ./FileItem/index.js */ "./node_modules/@uppy/dashboard/lib/components/FileItem/index.js");

const VirtualList = __webpack_require__(/*! ./VirtualList */ "./node_modules/@uppy/dashboard/lib/components/VirtualList.js");

function chunks(list, size) {
  const chunked = [];
  let currentChunk = [];
  list.forEach(item => {
    if (currentChunk.length < size) {
      currentChunk.push(item);
    } else {
      chunked.push(currentChunk);
      currentChunk = [item];
    }
  });
  if (currentChunk.length) chunked.push(currentChunk);
  return chunked;
}

module.exports = props => {
  const noFiles = props.totalFileCount === 0;
  const dashboardFilesClass = classNames('uppy-Dashboard-files', {
    'uppy-Dashboard-files--noFiles': noFiles
  }); // It's not great that this is hardcoded!
  // It's ESPECIALLY not great that this is checking against `itemsPerRow`!

  const rowHeight = props.itemsPerRow === 1 // Mobile
  ? 71 // 190px height + 2 * 5px margin
  : 200;
  const fileProps = {
    // FIXME This is confusing, it's actually the Dashboard's plugin ID
    id: props.id,
    error: props.error,
    // TODO move this to context
    i18n: props.i18n,
    uppy: props.uppy,
    // features
    acquirers: props.acquirers,
    resumableUploads: props.resumableUploads,
    individualCancellation: props.individualCancellation,
    // visual options
    hideRetryButton: props.hideRetryButton,
    hidePauseResumeButton: props.hidePauseResumeButton,
    hideCancelButton: props.hideCancelButton,
    showLinkToFileUploadResult: props.showLinkToFileUploadResult,
    showRemoveButtonAfterComplete: props.showRemoveButtonAfterComplete,
    isWide: props.isWide,
    metaFields: props.metaFields,
    recoveredState: props.recoveredState,
    // callbacks
    toggleFileCard: props.toggleFileCard,
    handleRequestThumbnail: props.handleRequestThumbnail,
    handleCancelThumbnail: props.handleCancelThumbnail
  };

  const sortByGhostComesFirst = (file1, file2) => {
    return props.files[file2].isGhost - props.files[file1].isGhost;
  }; // Sort files by file.isGhost, ghost files first, only if recoveredState is present


  const files = Object.keys(props.files);
  if (props.recoveredState) files.sort(sortByGhostComesFirst);
  const rows = chunks(files, props.itemsPerRow);

  const renderRow = row => // The `role="presentation` attribute ensures that the list items are properly
  // associated with the `VirtualList` element.
  // We use the first file ID as the key—this should not change across scroll rerenders
  h("div", {
    role: "presentation",
    key: row[0]
  }, row.map(fileID => h(FileItem, _extends({
    key: fileID,
    uppy: props.uppy
  }, fileProps, {
    role: "listitem",
    openFileEditor: props.openFileEditor,
    canEditFile: props.canEditFile,
    toggleAddFilesPanel: props.toggleAddFilesPanel,
    file: props.files[fileID]
  }))));

  return h(VirtualList, {
    class: dashboardFilesClass,
    role: "list",
    data: rows,
    renderRow: renderRow,
    rowHeight: rowHeight
  });
};

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/FilePreview.js":
/*!********************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/FilePreview.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  h
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const getFileTypeIcon = __webpack_require__(/*! ../utils/getFileTypeIcon */ "./node_modules/@uppy/dashboard/lib/utils/getFileTypeIcon.js");

module.exports = function FilePreview(props) {
  const {
    file
  } = props;

  if (file.preview) {
    return h("img", {
      className: "uppy-Dashboard-Item-previewImg",
      alt: file.name,
      src: file.preview
    });
  }

  const {
    color,
    icon
  } = getFileTypeIcon(file.type);
  return h("div", {
    className: "uppy-Dashboard-Item-previewIconWrap"
  }, h("span", {
    className: "uppy-Dashboard-Item-previewIcon",
    style: {
      color
    }
  }, icon), h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-Dashboard-Item-previewIconBg",
    width: "58",
    height: "76",
    viewBox: "0 0 58 76"
  }, h("rect", {
    fill: "#FFF",
    width: "58",
    height: "76",
    rx: "3",
    fillRule: "evenodd"
  })));
};

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/PickerPanelContent.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/PickerPanelContent.js ***!
  \***************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  h
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const classNames = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");

const ignoreEvent = __webpack_require__(/*! ../utils/ignoreEvent.js */ "./node_modules/@uppy/dashboard/lib/utils/ignoreEvent.js");

function PickerPanelContent(props) {
  return h("div", {
    className: classNames('uppy-DashboardContent-panel', props.className),
    role: "tabpanel",
    "data-uppy-panelType": "PickerPanel",
    id: `uppy-DashboardContent-panel--${props.activePickerPanel.id}`,
    onDragOver: ignoreEvent,
    onDragLeave: ignoreEvent,
    onDrop: ignoreEvent,
    onPaste: ignoreEvent
  }, h("div", {
    className: "uppy-DashboardContent-bar"
  }, h("div", {
    className: "uppy-DashboardContent-title",
    role: "heading",
    "aria-level": "1"
  }, props.i18n('importFrom', {
    name: props.activePickerPanel.name
  })), h("button", {
    className: "uppy-DashboardContent-back",
    type: "button",
    onClick: props.hideAllPanels
  }, props.i18n('cancel'))), h("div", {
    className: "uppy-DashboardContent-panelBody"
  }, props.uppy.getPlugin(props.activePickerPanel.id).render(props.state)));
}

module.exports = PickerPanelContent;

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/PickerPanelTopBar.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/PickerPanelTopBar.js ***!
  \**************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  h
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const uploadStates = {
  STATE_ERROR: 'error',
  STATE_WAITING: 'waiting',
  STATE_PREPROCESSING: 'preprocessing',
  STATE_UPLOADING: 'uploading',
  STATE_POSTPROCESSING: 'postprocessing',
  STATE_COMPLETE: 'complete',
  STATE_PAUSED: 'paused'
};

function getUploadingState(isAllErrored, isAllComplete, isAllPaused, files) {
  if (files === void 0) {
    files = {};
  }

  if (isAllErrored) {
    return uploadStates.STATE_ERROR;
  }

  if (isAllComplete) {
    return uploadStates.STATE_COMPLETE;
  }

  if (isAllPaused) {
    return uploadStates.STATE_PAUSED;
  }

  let state = uploadStates.STATE_WAITING;
  const fileIDs = Object.keys(files);

  for (let i = 0; i < fileIDs.length; i++) {
    const {
      progress
    } = files[fileIDs[i]]; // If ANY files are being uploaded right now, show the uploading state.

    if (progress.uploadStarted && !progress.uploadComplete) {
      return uploadStates.STATE_UPLOADING;
    } // If files are being preprocessed AND postprocessed at this time, we show the
    // preprocess state. If any files are being uploaded we show uploading.


    if (progress.preprocess && state !== uploadStates.STATE_UPLOADING) {
      state = uploadStates.STATE_PREPROCESSING;
    } // If NO files are being preprocessed or uploaded right now, but some files are
    // being postprocessed, show the postprocess state.


    if (progress.postprocess && state !== uploadStates.STATE_UPLOADING && state !== uploadStates.STATE_PREPROCESSING) {
      state = uploadStates.STATE_POSTPROCESSING;
    }
  }

  return state;
}

function UploadStatus(props) {
  const uploadingState = getUploadingState(props.isAllErrored, props.isAllComplete, props.isAllPaused, props.files);

  switch (uploadingState) {
    case 'uploading':
      return props.i18n('uploadingXFiles', {
        smart_count: props.inProgressNotPausedFiles.length
      });

    case 'preprocessing':
    case 'postprocessing':
      return props.i18n('processingXFiles', {
        smart_count: props.processingFiles.length
      });

    case 'paused':
      return props.i18n('uploadPaused');

    case 'waiting':
      return props.i18n('xFilesSelected', {
        smart_count: props.newFiles.length
      });

    case 'complete':
      return props.i18n('uploadComplete');
  }
}

function PanelTopBar(props) {
  let {
    allowNewUpload
  } = props; // TODO maybe this should be done in ../index.js, then just pass that down as `allowNewUpload`

  if (allowNewUpload && props.maxNumberOfFiles) {
    allowNewUpload = props.totalFileCount < props.maxNumberOfFiles;
  }

  return h("div", {
    className: "uppy-DashboardContent-bar"
  }, !props.isAllComplete && !props.hideCancelButton ? h("button", {
    className: "uppy-DashboardContent-back",
    type: "button",
    onClick: () => props.uppy.cancelAll()
  }, props.i18n('cancel')) : h("div", null), h("div", {
    className: "uppy-DashboardContent-title",
    role: "heading",
    "aria-level": "1"
  }, h(UploadStatus, props)), allowNewUpload ? h("button", {
    className: "uppy-DashboardContent-addMore",
    type: "button",
    "aria-label": props.i18n('addMoreFiles'),
    title: props.i18n('addMoreFiles'),
    onClick: () => props.toggleAddFilesPanel(true)
  }, h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "15",
    height: "15",
    viewBox: "0 0 15 15"
  }, h("path", {
    d: "M8 6.5h6a.5.5 0 0 1 .5.5v.5a.5.5 0 0 1-.5.5H8v6a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5V8h-6a.5.5 0 0 1-.5-.5V7a.5.5 0 0 1 .5-.5h6v-6A.5.5 0 0 1 7 0h.5a.5.5 0 0 1 .5.5v6z"
  })), h("span", {
    className: "uppy-DashboardContent-addMoreCaption"
  }, props.i18n('addMore'))) : h("div", null));
}

module.exports = PanelTopBar;

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/Slide.js":
/*!**************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/Slide.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  cloneElement,
  Component,
  toChildArray
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const classNames = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");

const transitionName = 'uppy-transition-slideDownUp';
const duration = 250;
/**
 * Vertical slide transition.
 *
 * This can take a _single_ child component, which _must_ accept a `className` prop.
 *
 * Currently this is specific to the `uppy-transition-slideDownUp` transition,
 * but it should be simple to extend this for any type of single-element
 * transition by setting the CSS name and duration as props.
 */

class Slide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cachedChildren: null,
      className: ''
    };
  } // TODO: refactor to stable lifecycle method
  // eslint-disable-next-line


  componentWillUpdate(nextProps) {
    const {
      cachedChildren
    } = this.state;
    const child = toChildArray(nextProps.children)[0];
    if (cachedChildren === child) return null;
    const patch = {
      cachedChildren: child
    }; // Enter transition

    if (child && !cachedChildren) {
      patch.className = `${transitionName}-enter`;
      cancelAnimationFrame(this.animationFrame);
      clearTimeout(this.leaveTimeout);
      this.leaveTimeout = undefined;
      this.animationFrame = requestAnimationFrame(() => {
        // Force it to render before we add the active class
        // this.base.getBoundingClientRect()
        this.setState({
          className: `${transitionName}-enter ${transitionName}-enter-active`
        });
        this.enterTimeout = setTimeout(() => {
          this.setState({
            className: ''
          });
        }, duration);
      });
    } // Leave transition


    if (cachedChildren && !child && this.leaveTimeout === undefined) {
      patch.cachedChildren = cachedChildren;
      patch.className = `${transitionName}-leave`;
      cancelAnimationFrame(this.animationFrame);
      clearTimeout(this.enterTimeout);
      this.enterTimeout = undefined;
      this.animationFrame = requestAnimationFrame(() => {
        this.setState({
          className: `${transitionName}-leave ${transitionName}-leave-active`
        });
        this.leaveTimeout = setTimeout(() => {
          this.setState({
            cachedChildren: null,
            className: ''
          });
        }, duration);
      });
    } // eslint-disable-next-line


    this.setState(patch);
  }

  render() {
    const {
      cachedChildren,
      className
    } = this.state;

    if (!cachedChildren) {
      return null;
    }

    return cloneElement(cachedChildren, {
      className: classNames(className, cachedChildren.props.className)
    });
  }

}

module.exports = Slide;

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/components/VirtualList.js":
/*!********************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/components/VirtualList.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

/**
 * Adapted from preact-virtual-list: https://github.com/developit/preact-virtual-list
 *
 * © 2016 Jason Miller
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * Adaptations:
 * - Added role=presentation to helper elements
 * - Tweaked styles for Uppy's Dashboard use case
 */
const {
  h,
  Component
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const STYLE_INNER = {
  position: 'relative',
  // Disabled for our use case: the wrapper elements around FileList already deal with overflow,
  // and this additional property would hide things that we want to show.
  //
  // overflow: 'hidden',
  width: '100%',
  minHeight: '100%'
};
const STYLE_CONTENT = {
  position: 'absolute',
  top: 0,
  left: 0,
  // Because the `top` value gets set to some offset, this `height` being 100% would make the scrollbar
  // stretch far beyond the content. For our use case, the content div actually can get its height from
  // the elements inside it, so we don't need to specify a `height` property at all.
  //
  // height: '100%',
  width: '100%',
  overflow: 'visible'
};

class VirtualList extends Component {
  constructor(props) {
    super(props); // The currently focused node, used to retain focus when the visible rows change.
    // To avoid update loops, this should not cause state updates, so it's kept as a plain property.

    this.handleScroll = () => {
      this.setState({
        offset: this.base.scrollTop
      });
    };

    this.handleResize = () => {
      this.resize();
    };

    this.focusElement = null;
    this.state = {
      offset: 0,
      height: 0
    };
  }

  componentDidMount() {
    this.resize();
    window.addEventListener('resize', this.handleResize);
  } // TODO: refactor to stable lifecycle method
  // eslint-disable-next-line


  componentWillUpdate() {
    if (this.base.contains(document.activeElement)) {
      this.focusElement = document.activeElement;
    }
  }

  componentDidUpdate() {
    // Maintain focus when rows are added and removed.
    if (this.focusElement && this.focusElement.parentNode && document.activeElement !== this.focusElement) {
      this.focusElement.focus();
    }

    this.focusElement = null;
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  resize() {
    const {
      height
    } = this.state;

    if (height !== this.base.offsetHeight) {
      this.setState({
        height: this.base.offsetHeight
      });
    }
  }

  render(_ref) {
    let {
      data,
      rowHeight,
      renderRow,
      overscanCount = 10,
      ...props
    } = _ref;
    const {
      offset,
      height
    } = this.state; // first visible row index

    let start = Math.floor(offset / rowHeight); // actual number of visible rows (without overscan)

    let visibleRowCount = Math.floor(height / rowHeight); // Overscan: render blocks of rows modulo an overscan row count
    // This dramatically reduces DOM writes during scrolling

    if (overscanCount) {
      start = Math.max(0, start - start % overscanCount);
      visibleRowCount += overscanCount;
    } // last visible + overscan row index + padding to allow keyboard focus to travel past the visible area


    const end = start + visibleRowCount + 4; // data slice currently in viewport plus overscan items

    const selection = data.slice(start, end);
    const styleInner = { ...STYLE_INNER,
      height: data.length * rowHeight
    };
    const styleContent = { ...STYLE_CONTENT,
      top: start * rowHeight
    }; // The `role="presentation"` attributes ensure that these wrapper elements are not treated as list
    // items by accessibility and outline tools.

    return h("div", _extends({
      onScroll: this.handleScroll
    }, props), h("div", {
      role: "presentation",
      style: styleInner
    }, h("div", {
      role: "presentation",
      style: styleContent
    }, selection.map(renderRow))));
  }

}

module.exports = VirtualList;

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/index.js":
/*!***************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/index.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _class, _openFileEditorWhenFilesAdded, _attachRenderFunctionToTarget, _isTargetSupported, _getAcquirers, _getProgressIndicators, _getEditors, _temp;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const {
  h
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const {
  UIPlugin
} = __webpack_require__(/*! @uppy/core */ "./node_modules/@uppy/core/lib/index.js");

const StatusBar = __webpack_require__(/*! @uppy/status-bar */ "./node_modules/@uppy/status-bar/lib/index.js");

const Informer = __webpack_require__(/*! @uppy/informer */ "./node_modules/@uppy/informer/lib/index.js");

const ThumbnailGenerator = __webpack_require__(/*! @uppy/thumbnail-generator */ "./node_modules/@uppy/thumbnail-generator/lib/index.js");

const findAllDOMElements = __webpack_require__(/*! @uppy/utils/lib/findAllDOMElements */ "./node_modules/@uppy/utils/lib/findAllDOMElements.js");

const toArray = __webpack_require__(/*! @uppy/utils/lib/toArray */ "./node_modules/@uppy/utils/lib/toArray.js");

const getDroppedFiles = __webpack_require__(/*! @uppy/utils/lib/getDroppedFiles */ "./node_modules/@uppy/utils/lib/getDroppedFiles/index.js");

const {
  nanoid
} = __webpack_require__(/*! nanoid/non-secure */ "./node_modules/nanoid/non-secure/index.cjs");

const trapFocus = __webpack_require__(/*! ./utils/trapFocus */ "./node_modules/@uppy/dashboard/lib/utils/trapFocus.js");

const createSuperFocus = __webpack_require__(/*! ./utils/createSuperFocus */ "./node_modules/@uppy/dashboard/lib/utils/createSuperFocus.js");

const memoize = (__webpack_require__(/*! memoize-one */ "./node_modules/memoize-one/dist/memoize-one.esm.js")["default"]) || __webpack_require__(/*! memoize-one */ "./node_modules/memoize-one/dist/memoize-one.esm.js");

const FOCUSABLE_ELEMENTS = __webpack_require__(/*! @uppy/utils/lib/FOCUSABLE_ELEMENTS */ "./node_modules/@uppy/utils/lib/FOCUSABLE_ELEMENTS.js");

const DashboardUI = __webpack_require__(/*! ./components/Dashboard */ "./node_modules/@uppy/dashboard/lib/components/Dashboard.js");

const locale = __webpack_require__(/*! ./locale */ "./node_modules/@uppy/dashboard/lib/locale.js");

const TAB_KEY = 9;
const ESC_KEY = 27;

function createPromise() {
  const o = {};
  o.promise = new Promise((resolve, reject) => {
    o.resolve = resolve;
    o.reject = reject;
  });
  return o;
}

function defaultPickerIcon() {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    width: "30",
    height: "30",
    viewBox: "0 0 30 30"
  }, h("path", {
    d: "M15 30c8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15C6.716 0 0 6.716 0 15c0 8.284 6.716 15 15 15zm4.258-12.676v6.846h-8.426v-6.846H5.204l9.82-12.364 9.82 12.364H19.26z"
  }));
}
/**
 * Dashboard UI with previews, metadata editing, tabs for various services and more
 */


module.exports = (_temp = (_openFileEditorWhenFilesAdded = /*#__PURE__*/_classPrivateFieldLooseKey("openFileEditorWhenFilesAdded"), _attachRenderFunctionToTarget = /*#__PURE__*/_classPrivateFieldLooseKey("attachRenderFunctionToTarget"), _isTargetSupported = /*#__PURE__*/_classPrivateFieldLooseKey("isTargetSupported"), _getAcquirers = /*#__PURE__*/_classPrivateFieldLooseKey("getAcquirers"), _getProgressIndicators = /*#__PURE__*/_classPrivateFieldLooseKey("getProgressIndicators"), _getEditors = /*#__PURE__*/_classPrivateFieldLooseKey("getEditors"), _class = class Dashboard extends UIPlugin {
  constructor(uppy, _opts) {
    var _this;

    super(uppy, _opts);
    _this = this;

    this.removeTarget = plugin => {
      const pluginState = this.getPluginState(); // filter out the one we want to remove

      const newTargets = pluginState.targets.filter(target => target.id !== plugin.id);
      this.setPluginState({
        targets: newTargets
      });
    };

    this.addTarget = plugin => {
      const callerPluginId = plugin.id || plugin.constructor.name;
      const callerPluginName = plugin.title || callerPluginId;
      const callerPluginType = plugin.type;

      if (callerPluginType !== 'acquirer' && callerPluginType !== 'progressindicator' && callerPluginType !== 'editor') {
        const msg = 'Dashboard: can only be targeted by plugins of types: acquirer, progressindicator, editor';
        this.uppy.log(msg, 'error');
        return;
      }

      const target = {
        id: callerPluginId,
        name: callerPluginName,
        type: callerPluginType
      };
      const state = this.getPluginState();
      const newTargets = state.targets.slice();
      newTargets.push(target);
      this.setPluginState({
        targets: newTargets
      });
      return this.el;
    };

    this.hideAllPanels = () => {
      const state = this.getPluginState();
      const update = {
        activePickerPanel: false,
        showAddFilesPanel: false,
        activeOverlayType: null,
        fileCardFor: null,
        showFileEditor: false
      };

      if (state.activePickerPanel === update.activePickerPanel && state.showAddFilesPanel === update.showAddFilesPanel && state.showFileEditor === update.showFileEditor && state.activeOverlayType === update.activeOverlayType) {
        // avoid doing a state update if nothing changed
        return;
      }

      this.setPluginState(update);
    };

    this.showPanel = id => {
      const {
        targets
      } = this.getPluginState();
      const activePickerPanel = targets.filter(target => {
        return target.type === 'acquirer' && target.id === id;
      })[0];
      this.setPluginState({
        activePickerPanel,
        activeOverlayType: 'PickerPanel'
      });
    };

    this.canEditFile = file => {
      const {
        targets
      } = this.getPluginState();

      const editors = _classPrivateFieldLooseBase(this, _getEditors)[_getEditors](targets);

      return editors.some(target => this.uppy.getPlugin(target.id).canEditFile(file));
    };

    this.openFileEditor = file => {
      const {
        targets
      } = this.getPluginState();

      const editors = _classPrivateFieldLooseBase(this, _getEditors)[_getEditors](targets);

      this.setPluginState({
        showFileEditor: true,
        fileCardFor: file.id || null,
        activeOverlayType: 'FileEditor'
      });
      editors.forEach(editor => {
        this.uppy.getPlugin(editor.id).selectFile(file);
      });
    };

    this.saveFileEditor = () => {
      const {
        targets
      } = this.getPluginState();

      const editors = _classPrivateFieldLooseBase(this, _getEditors)[_getEditors](targets);

      editors.forEach(editor => {
        this.uppy.getPlugin(editor.id).save();
      });
      this.hideAllPanels();
    };

    this.openModal = () => {
      const {
        promise,
        resolve
      } = createPromise(); // save scroll position

      this.savedScrollPosition = window.pageYOffset; // save active element, so we can restore focus when modal is closed

      this.savedActiveElement = document.activeElement;

      if (this.opts.disablePageScrollWhenModalOpen) {
        document.body.classList.add('uppy-Dashboard-isFixed');
      }

      if (this.opts.animateOpenClose && this.getPluginState().isClosing) {
        const handler = () => {
          this.setPluginState({
            isHidden: false
          });
          this.el.removeEventListener('animationend', handler, false);
          resolve();
        };

        this.el.addEventListener('animationend', handler, false);
      } else {
        this.setPluginState({
          isHidden: false
        });
        resolve();
      }

      if (this.opts.browserBackButtonClose) {
        this.updateBrowserHistory();
      } // handle ESC and TAB keys in modal dialog


      document.addEventListener('keydown', this.handleKeyDownInModal);
      this.uppy.emit('dashboard:modal-open');
      return promise;
    };

    this.closeModal = function (opts) {
      if (opts === void 0) {
        opts = {};
      }

      const {
        // Whether the modal is being closed by the user (`true`) or by other means (e.g. browser back button)
        manualClose = true
      } = opts;

      const {
        isHidden,
        isClosing
      } = _this.getPluginState();

      if (isHidden || isClosing) {
        // short-circuit if animation is ongoing
        return;
      }

      const {
        promise,
        resolve
      } = createPromise();

      if (_this.opts.disablePageScrollWhenModalOpen) {
        document.body.classList.remove('uppy-Dashboard-isFixed');
      }

      if (_this.opts.animateOpenClose) {
        _this.setPluginState({
          isClosing: true
        });

        const handler = () => {
          _this.setPluginState({
            isHidden: true,
            isClosing: false
          });

          _this.superFocus.cancel();

          _this.savedActiveElement.focus();

          _this.el.removeEventListener('animationend', handler, false);

          resolve();
        };

        _this.el.addEventListener('animationend', handler, false);
      } else {
        _this.setPluginState({
          isHidden: true
        });

        _this.superFocus.cancel();

        _this.savedActiveElement.focus();

        resolve();
      } // handle ESC and TAB keys in modal dialog


      document.removeEventListener('keydown', _this.handleKeyDownInModal);

      if (manualClose) {
        if (_this.opts.browserBackButtonClose) {
          var _history$state;

          // Make sure that the latest entry in the history state is our modal name
          // eslint-disable-next-line no-restricted-globals
          if ((_history$state = history.state) != null && _history$state[_this.modalName]) {
            // Go back in history to clear out the entry we created (ultimately closing the modal)
            // eslint-disable-next-line no-restricted-globals
            history.back();
          }
        }
      }

      _this.uppy.emit('dashboard:modal-closed');

      return promise;
    };

    this.isModalOpen = () => {
      return !this.getPluginState().isHidden || false;
    };

    this.requestCloseModal = () => {
      if (this.opts.onRequestCloseModal) {
        return this.opts.onRequestCloseModal();
      }

      return this.closeModal();
    };

    this.setDarkModeCapability = isDarkModeOn => {
      const {
        capabilities
      } = this.uppy.getState();
      this.uppy.setState({
        capabilities: { ...capabilities,
          darkMode: isDarkModeOn
        }
      });
    };

    this.handleSystemDarkModeChange = event => {
      const isDarkModeOnNow = event.matches;
      this.uppy.log(`[Dashboard] Dark mode is ${isDarkModeOnNow ? 'on' : 'off'}`);
      this.setDarkModeCapability(isDarkModeOnNow);
    };

    this.toggleFileCard = (show, fileID) => {
      const file = this.uppy.getFile(fileID);

      if (show) {
        this.uppy.emit('dashboard:file-edit-start', file);
      } else {
        this.uppy.emit('dashboard:file-edit-complete', file);
      }

      this.setPluginState({
        fileCardFor: show ? fileID : null,
        activeOverlayType: show ? 'FileCard' : null
      });
    };

    this.toggleAddFilesPanel = show => {
      this.setPluginState({
        showAddFilesPanel: show,
        activeOverlayType: show ? 'AddFiles' : null
      });
    };

    this.addFiles = files => {
      const descriptors = files.map(file => ({
        source: this.id,
        name: file.name,
        type: file.type,
        data: file,
        meta: {
          // path of the file relative to the ancestor directory the user selected.
          // e.g. 'docs/Old Prague/airbnb.pdf'
          relativePath: file.relativePath || null
        }
      }));

      try {
        this.uppy.addFiles(descriptors);
      } catch (err) {
        this.uppy.log(err);
      }
    };

    this.startListeningToResize = () => {
      // Watch for Dashboard container (`.uppy-Dashboard-inner`) resize
      // and update containerWidth/containerHeight in plugin state accordingly.
      // Emits first event on initialization.
      this.resizeObserver = new ResizeObserver(entries => {
        const uppyDashboardInnerEl = entries[0];
        const {
          width,
          height
        } = uppyDashboardInnerEl.contentRect;
        this.uppy.log(`[Dashboard] resized: ${width} / ${height}`, 'debug');
        this.setPluginState({
          containerWidth: width,
          containerHeight: height,
          areInsidesReadyToBeVisible: true
        });
      });
      this.resizeObserver.observe(this.el.querySelector('.uppy-Dashboard-inner')); // If ResizeObserver fails to emit an event telling us what size to use - default to the mobile view

      this.makeDashboardInsidesVisibleAnywayTimeout = setTimeout(() => {
        const pluginState = this.getPluginState();
        const isModalAndClosed = !this.opts.inline && pluginState.isHidden;

        if ( // if ResizeObserver hasn't yet fired,
        !pluginState.areInsidesReadyToBeVisible // and it's not due to the modal being closed
        && !isModalAndClosed) {
          this.uppy.log("[Dashboard] resize event didn't fire on time: defaulted to mobile layout", 'debug');
          this.setPluginState({
            areInsidesReadyToBeVisible: true
          });
        }
      }, 1000);
    };

    this.stopListeningToResize = () => {
      this.resizeObserver.disconnect();
      clearTimeout(this.makeDashboardInsidesVisibleAnywayTimeout);
    };

    this.recordIfFocusedOnUppyRecently = event => {
      if (this.el.contains(event.target)) {
        this.ifFocusedOnUppyRecently = true;
      } else {
        this.ifFocusedOnUppyRecently = false; // ___Why run this.superFocus.cancel here when it already runs in superFocusOnEachUpdate?
        //    Because superFocus is debounced, when we move from Uppy to some other element on the page,
        //    previously run superFocus sometimes hits and moves focus back to Uppy.

        this.superFocus.cancel();
      }
    };

    this.disableAllFocusableElements = disable => {
      const focusableNodes = toArray(this.el.querySelectorAll(FOCUSABLE_ELEMENTS));

      if (disable) {
        focusableNodes.forEach(node => {
          // save previous tabindex in a data-attribute, to restore when enabling
          const currentTabIndex = node.getAttribute('tabindex');

          if (currentTabIndex) {
            node.dataset.inertTabindex = currentTabIndex;
          }

          node.setAttribute('tabindex', '-1');
        });
      } else {
        focusableNodes.forEach(node => {
          if ('inertTabindex' in node.dataset) {
            node.setAttribute('tabindex', node.dataset.inertTabindex);
          } else {
            node.removeAttribute('tabindex');
          }
        });
      }

      this.dashboardIsDisabled = disable;
    };

    this.updateBrowserHistory = () => {
      var _history$state2;

      // Ensure history state does not already contain our modal name to avoid double-pushing
      // eslint-disable-next-line no-restricted-globals
      if (!((_history$state2 = history.state) != null && _history$state2[this.modalName])) {
        // Push to history so that the page is not lost on browser back button press
        // eslint-disable-next-line no-restricted-globals
        history.pushState({ // eslint-disable-next-line no-restricted-globals
          ...history.state,
          [this.modalName]: true
        }, '');
      } // Listen for back button presses


      window.addEventListener('popstate', this.handlePopState, false);
    };

    this.handlePopState = event => {
      var _event$state;

      // Close the modal if the history state no longer contains our modal name
      if (this.isModalOpen() && (!event.state || !event.state[this.modalName])) {
        this.closeModal({
          manualClose: false
        });
      } // When the browser back button is pressed and uppy is now the latest entry
      // in the history but the modal is closed, fix the history by removing the
      // uppy history entry.
      // This occurs when another entry is added into the history state while the
      // modal is open, and then the modal gets manually closed.
      // Solves PR #575 (https://github.com/transloadit/uppy/pull/575)


      if (!this.isModalOpen() && (_event$state = event.state) != null && _event$state[this.modalName]) {
        // eslint-disable-next-line no-restricted-globals
        history.back();
      }
    };

    this.handleKeyDownInModal = event => {
      // close modal on esc key press
      if (event.keyCode === ESC_KEY) this.requestCloseModal(event); // trap focus on tab key press

      if (event.keyCode === TAB_KEY) trapFocus.forModal(event, this.getPluginState().activeOverlayType, this.el);
    };

    this.handleClickOutside = () => {
      if (this.opts.closeModalOnClickOutside) this.requestCloseModal();
    };

    this.handlePaste = event => {
      // Let any acquirer plugin (Url/Webcam/etc.) handle pastes to the root
      this.uppy.iteratePlugins(plugin => {
        if (plugin.type === 'acquirer') {
          // Every Plugin with .type acquirer can define handleRootPaste(event)
          plugin.handleRootPaste == null ? void 0 : plugin.handleRootPaste(event);
        }
      }); // Add all dropped files

      const files = toArray(event.clipboardData.files);

      if (files.length > 0) {
        this.uppy.log('[Dashboard] Files pasted');
        this.addFiles(files);
      }
    };

    this.handleInputChange = event => {
      event.preventDefault();
      const files = toArray(event.target.files);

      if (files.length > 0) {
        this.uppy.log('[Dashboard] Files selected through input');
        this.addFiles(files);
      }
    };

    this.handleDragOver = event => {
      var _this$opts$onDragOver, _this$opts;

      event.preventDefault();
      event.stopPropagation(); // Check if some plugin can handle the datatransfer without files —
      // for instance, the Url plugin can import a url

      const canSomePluginHandleRootDrop = () => {
        let somePluginCanHandleRootDrop = true;
        this.uppy.iteratePlugins(plugin => {
          if (plugin.canHandleRootDrop != null && plugin.canHandleRootDrop(event)) {
            somePluginCanHandleRootDrop = true;
          }
        });
        return somePluginCanHandleRootDrop;
      }; // Check if the "type" of the datatransfer object includes files


      const doesEventHaveFiles = () => {
        const {
          types
        } = event.dataTransfer;
        return types.some(type => type === 'Files');
      }; // Deny drop, if no plugins can handle datatransfer, there are no files,
      // or when opts.disabled is set, or new uploads are not allowed


      const somePluginCanHandleRootDrop = canSomePluginHandleRootDrop(event);
      const hasFiles = doesEventHaveFiles(event);

      if (!somePluginCanHandleRootDrop && !hasFiles || this.opts.disabled // opts.disableLocalFiles should only be taken into account if no plugins
      // can handle the datatransfer
      || this.opts.disableLocalFiles && (hasFiles || !somePluginCanHandleRootDrop) || !this.uppy.getState().allowNewUpload) {
        event.dataTransfer.dropEffect = 'none';
        clearTimeout(this.removeDragOverClassTimeout);
        return;
      } // Add a small (+) icon on drop
      // (and prevent browsers from interpreting this as files being _moved_ into the
      // browser, https://github.com/transloadit/uppy/issues/1978).


      event.dataTransfer.dropEffect = 'copy';
      clearTimeout(this.removeDragOverClassTimeout);
      this.setPluginState({
        isDraggingOver: true
      });
      (_this$opts$onDragOver = (_this$opts = this.opts).onDragOver) == null ? void 0 : _this$opts$onDragOver.call(_this$opts, event);
    };

    this.handleDragLeave = event => {
      var _this$opts$onDragLeav, _this$opts2;

      event.preventDefault();
      event.stopPropagation();
      clearTimeout(this.removeDragOverClassTimeout); // Timeout against flickering, this solution is taken from drag-drop library.
      // Solution with 'pointer-events: none' didn't work across browsers.

      this.removeDragOverClassTimeout = setTimeout(() => {
        this.setPluginState({
          isDraggingOver: false
        });
      }, 50);
      (_this$opts$onDragLeav = (_this$opts2 = this.opts).onDragLeave) == null ? void 0 : _this$opts$onDragLeav.call(_this$opts2, event);
    };

    this.handleDrop = async event => {
      var _this$opts$onDrop, _this$opts3;

      event.preventDefault();
      event.stopPropagation();
      clearTimeout(this.removeDragOverClassTimeout);
      this.setPluginState({
        isDraggingOver: false
      }); // Let any acquirer plugin (Url/Webcam/etc.) handle drops to the root

      this.uppy.iteratePlugins(plugin => {
        if (plugin.type === 'acquirer') {
          // Every Plugin with .type acquirer can define handleRootDrop(event)
          plugin.handleRootDrop == null ? void 0 : plugin.handleRootDrop(event);
        }
      }); // Add all dropped files

      let executedDropErrorOnce = false;

      const logDropError = error => {
        this.uppy.log(error, 'error'); // In practice all drop errors are most likely the same,
        // so let's just show one to avoid overwhelming the user

        if (!executedDropErrorOnce) {
          this.uppy.info(error.message, 'error');
          executedDropErrorOnce = true;
        }
      }; // Add all dropped files


      const files = await getDroppedFiles(event.dataTransfer, {
        logDropError
      });

      if (files.length > 0) {
        this.uppy.log('[Dashboard] Files dropped');
        this.addFiles(files);
      }

      (_this$opts$onDrop = (_this$opts3 = this.opts).onDrop) == null ? void 0 : _this$opts$onDrop.call(_this$opts3, event);
    };

    this.handleRequestThumbnail = file => {
      if (!this.opts.waitForThumbnailsBeforeUpload) {
        this.uppy.emit('thumbnail:request', file);
      }
    };

    this.handleCancelThumbnail = file => {
      if (!this.opts.waitForThumbnailsBeforeUpload) {
        this.uppy.emit('thumbnail:cancel', file);
      }
    };

    this.handleKeyDownInInline = event => {
      // Trap focus on tab key press.
      if (event.keyCode === TAB_KEY) trapFocus.forInline(event, this.getPluginState().activeOverlayType, this.el);
    };

    this.handlePasteOnBody = event => {
      const isFocusInOverlay = this.el.contains(document.activeElement);

      if (isFocusInOverlay) {
        this.handlePaste(event);
      }
    };

    this.handleComplete = _ref => {
      let {
        failed
      } = _ref;

      if (this.opts.closeAfterFinish && failed.length === 0) {
        // All uploads are done
        this.requestCloseModal();
      }
    };

    this.handleCancelRestore = () => {
      this.uppy.emit('restore-canceled');
    };

    Object.defineProperty(this, _openFileEditorWhenFilesAdded, {
      writable: true,
      value: files => {
        const firstFile = files[0];

        if (this.canEditFile(firstFile)) {
          this.openFileEditor(firstFile);
        }
      }
    });

    this.initEvents = () => {
      // Modal open button
      if (this.opts.trigger && !this.opts.inline) {
        const showModalTrigger = findAllDOMElements(this.opts.trigger);

        if (showModalTrigger) {
          showModalTrigger.forEach(trigger => trigger.addEventListener('click', this.openModal));
        } else {
          this.uppy.log('Dashboard modal trigger not found. Make sure `trigger` is set in Dashboard options, unless you are planning to call `dashboard.openModal()` method yourself', 'warning');
        }
      }

      this.startListeningToResize();
      document.addEventListener('paste', this.handlePasteOnBody);
      this.uppy.on('plugin-remove', this.removeTarget);
      this.uppy.on('file-added', this.hideAllPanels);
      this.uppy.on('dashboard:modal-closed', this.hideAllPanels);
      this.uppy.on('file-editor:complete', this.hideAllPanels);
      this.uppy.on('complete', this.handleComplete); // ___Why fire on capture?
      //    Because this.ifFocusedOnUppyRecently needs to change before onUpdate() fires.

      document.addEventListener('focus', this.recordIfFocusedOnUppyRecently, true);
      document.addEventListener('click', this.recordIfFocusedOnUppyRecently, true);

      if (this.opts.inline) {
        this.el.addEventListener('keydown', this.handleKeyDownInInline);
      }

      if (this.opts.autoOpenFileEditor) {
        this.uppy.on('files-added', _classPrivateFieldLooseBase(this, _openFileEditorWhenFilesAdded)[_openFileEditorWhenFilesAdded]);
      }
    };

    this.removeEvents = () => {
      const showModalTrigger = findAllDOMElements(this.opts.trigger);

      if (!this.opts.inline && showModalTrigger) {
        showModalTrigger.forEach(trigger => trigger.removeEventListener('click', this.openModal));
      }

      this.stopListeningToResize();
      document.removeEventListener('paste', this.handlePasteOnBody);
      window.removeEventListener('popstate', this.handlePopState, false);
      this.uppy.off('plugin-remove', this.removeTarget);
      this.uppy.off('file-added', this.hideAllPanels);
      this.uppy.off('dashboard:modal-closed', this.hideAllPanels);
      this.uppy.off('file-editor:complete', this.hideAllPanels);
      this.uppy.off('complete', this.handleComplete);
      document.removeEventListener('focus', this.recordIfFocusedOnUppyRecently);
      document.removeEventListener('click', this.recordIfFocusedOnUppyRecently);

      if (this.opts.inline) {
        this.el.removeEventListener('keydown', this.handleKeyDownInInline);
      }

      if (this.opts.autoOpenFileEditor) {
        this.uppy.off('files-added', _classPrivateFieldLooseBase(this, _openFileEditorWhenFilesAdded)[_openFileEditorWhenFilesAdded]);
      }
    };

    this.superFocusOnEachUpdate = () => {
      const isFocusInUppy = this.el.contains(document.activeElement); // When focus is lost on the page (== focus is on body for most browsers, or focus is null for IE11)

      const isFocusNowhere = document.activeElement === document.body || document.activeElement === null;
      const isInformerHidden = this.uppy.getState().info.length === 0;
      const isModal = !this.opts.inline;

      if ( // If update is connected to showing the Informer - let the screen reader calmly read it.
      isInformerHidden && ( // If we are in a modal - always superfocus without concern for other elements
      // on the page (user is unlikely to want to interact with the rest of the page)
      isModal // If we are already inside of Uppy, or
      || isFocusInUppy // If we are not focused on anything BUT we have already, at least once, focused on uppy
      //   1. We focus when isFocusNowhere, because when the element we were focused
      //      on disappears (e.g. an overlay), - focus gets lost. If user is typing
      //      something somewhere else on the page, - focus won't be 'nowhere'.
      //   2. We only focus when focus is nowhere AND this.ifFocusedOnUppyRecently,
      //      to avoid focus jumps if we do something else on the page.
      //   [Practical check] Without '&& this.ifFocusedOnUppyRecently', in Safari, in inline mode,
      //                     when file is uploading, - navigate via tab to the checkbox,
      //                     try to press space multiple times. Focus will jump to Uppy.
      || isFocusNowhere && this.ifFocusedOnUppyRecently)) {
        this.superFocus(this.el, this.getPluginState().activeOverlayType);
      } else {
        this.superFocus.cancel();
      }
    };

    this.afterUpdate = () => {
      if (this.opts.disabled && !this.dashboardIsDisabled) {
        this.disableAllFocusableElements(true);
        return;
      }

      if (!this.opts.disabled && this.dashboardIsDisabled) {
        this.disableAllFocusableElements(false);
      }

      this.superFocusOnEachUpdate();
    };

    this.saveFileCard = (meta, fileID) => {
      this.uppy.setFileMeta(fileID, meta);
      this.toggleFileCard(false, fileID);
    };

    Object.defineProperty(this, _attachRenderFunctionToTarget, {
      writable: true,
      value: target => {
        const plugin = this.uppy.getPlugin(target.id);
        return { ...target,
          icon: plugin.icon || this.opts.defaultPickerIcon,
          render: plugin.render
        };
      }
    });
    Object.defineProperty(this, _isTargetSupported, {
      writable: true,
      value: target => {
        const plugin = this.uppy.getPlugin(target.id); // If the plugin does not provide a `supported` check, assume the plugin works everywhere.

        if (typeof plugin.isSupported !== 'function') {
          return true;
        }

        return plugin.isSupported();
      }
    });
    Object.defineProperty(this, _getAcquirers, {
      writable: true,
      value: memoize(targets => {
        return targets.filter(target => target.type === 'acquirer' && _classPrivateFieldLooseBase(this, _isTargetSupported)[_isTargetSupported](target)).map(_classPrivateFieldLooseBase(this, _attachRenderFunctionToTarget)[_attachRenderFunctionToTarget]);
      })
    });
    Object.defineProperty(this, _getProgressIndicators, {
      writable: true,
      value: memoize(targets => {
        return targets.filter(target => target.type === 'progressindicator').map(_classPrivateFieldLooseBase(this, _attachRenderFunctionToTarget)[_attachRenderFunctionToTarget]);
      })
    });
    Object.defineProperty(this, _getEditors, {
      writable: true,
      value: memoize(targets => {
        return targets.filter(target => target.type === 'editor').map(_classPrivateFieldLooseBase(this, _attachRenderFunctionToTarget)[_attachRenderFunctionToTarget]);
      })
    });

    this.render = state => {
      const pluginState = this.getPluginState();
      const {
        files,
        capabilities,
        allowNewUpload
      } = state;
      const {
        newFiles,
        uploadStartedFiles,
        completeFiles,
        erroredFiles,
        inProgressFiles,
        inProgressNotPausedFiles,
        processingFiles,
        isUploadStarted,
        isAllComplete,
        isAllErrored,
        isAllPaused
      } = this.uppy.getObjectOfFilesPerState();

      const acquirers = _classPrivateFieldLooseBase(this, _getAcquirers)[_getAcquirers](pluginState.targets);

      const progressindicators = _classPrivateFieldLooseBase(this, _getProgressIndicators)[_getProgressIndicators](pluginState.targets);

      const editors = _classPrivateFieldLooseBase(this, _getEditors)[_getEditors](pluginState.targets);

      let theme;

      if (this.opts.theme === 'auto') {
        theme = capabilities.darkMode ? 'dark' : 'light';
      } else {
        theme = this.opts.theme;
      }

      if (['files', 'folders', 'both'].indexOf(this.opts.fileManagerSelectionType) < 0) {
        this.opts.fileManagerSelectionType = 'files'; // eslint-disable-next-line no-console

        console.warn(`Unsupported option for "fileManagerSelectionType". Using default of "${this.opts.fileManagerSelectionType}".`);
      }

      return DashboardUI({
        state,
        isHidden: pluginState.isHidden,
        files,
        newFiles,
        uploadStartedFiles,
        completeFiles,
        erroredFiles,
        inProgressFiles,
        inProgressNotPausedFiles,
        processingFiles,
        isUploadStarted,
        isAllComplete,
        isAllErrored,
        isAllPaused,
        totalFileCount: Object.keys(files).length,
        totalProgress: state.totalProgress,
        allowNewUpload,
        acquirers,
        theme,
        disabled: this.opts.disabled,
        disableLocalFiles: this.opts.disableLocalFiles,
        direction: this.opts.direction,
        activePickerPanel: pluginState.activePickerPanel,
        showFileEditor: pluginState.showFileEditor,
        saveFileEditor: this.saveFileEditor,
        disableAllFocusableElements: this.disableAllFocusableElements,
        animateOpenClose: this.opts.animateOpenClose,
        isClosing: pluginState.isClosing,
        progressindicators,
        editors,
        autoProceed: this.uppy.opts.autoProceed,
        id: this.id,
        closeModal: this.requestCloseModal,
        handleClickOutside: this.handleClickOutside,
        handleInputChange: this.handleInputChange,
        handlePaste: this.handlePaste,
        inline: this.opts.inline,
        showPanel: this.showPanel,
        hideAllPanels: this.hideAllPanels,
        i18n: this.i18n,
        i18nArray: this.i18nArray,
        uppy: this.uppy,
        note: this.opts.note,
        recoveredState: state.recoveredState,
        metaFields: pluginState.metaFields,
        resumableUploads: capabilities.resumableUploads || false,
        individualCancellation: capabilities.individualCancellation,
        isMobileDevice: capabilities.isMobileDevice,
        fileCardFor: pluginState.fileCardFor,
        toggleFileCard: this.toggleFileCard,
        toggleAddFilesPanel: this.toggleAddFilesPanel,
        showAddFilesPanel: pluginState.showAddFilesPanel,
        saveFileCard: this.saveFileCard,
        openFileEditor: this.openFileEditor,
        canEditFile: this.canEditFile,
        width: this.opts.width,
        height: this.opts.height,
        showLinkToFileUploadResult: this.opts.showLinkToFileUploadResult,
        fileManagerSelectionType: this.opts.fileManagerSelectionType,
        proudlyDisplayPoweredByUppy: this.opts.proudlyDisplayPoweredByUppy,
        hideCancelButton: this.opts.hideCancelButton,
        hideRetryButton: this.opts.hideRetryButton,
        hidePauseResumeButton: this.opts.hidePauseResumeButton,
        showRemoveButtonAfterComplete: this.opts.showRemoveButtonAfterComplete,
        containerWidth: pluginState.containerWidth,
        containerHeight: pluginState.containerHeight,
        areInsidesReadyToBeVisible: pluginState.areInsidesReadyToBeVisible,
        isTargetDOMEl: this.isTargetDOMEl,
        parentElement: this.el,
        allowedFileTypes: this.uppy.opts.restrictions.allowedFileTypes,
        maxNumberOfFiles: this.uppy.opts.restrictions.maxNumberOfFiles,
        requiredMetaFields: this.uppy.opts.restrictions.requiredMetaFields,
        showSelectedFiles: this.opts.showSelectedFiles,
        handleCancelRestore: this.handleCancelRestore,
        handleRequestThumbnail: this.handleRequestThumbnail,
        handleCancelThumbnail: this.handleCancelThumbnail,
        // drag props
        isDraggingOver: pluginState.isDraggingOver,
        handleDragOver: this.handleDragOver,
        handleDragLeave: this.handleDragLeave,
        handleDrop: this.handleDrop
      });
    };

    this.discoverProviderPlugins = () => {
      this.uppy.iteratePlugins(plugin => {
        if (plugin && !plugin.target && plugin.opts && plugin.opts.target === this.constructor) {
          this.addTarget(plugin);
        }
      });
    };

    this.install = () => {
      // Set default state for Dashboard
      this.setPluginState({
        isHidden: true,
        fileCardFor: null,
        activeOverlayType: null,
        showAddFilesPanel: false,
        activePickerPanel: false,
        showFileEditor: false,
        metaFields: this.opts.metaFields,
        targets: [],
        // We'll make them visible once .containerWidth is determined
        areInsidesReadyToBeVisible: false,
        isDraggingOver: false
      });
      const {
        inline,
        closeAfterFinish
      } = this.opts;

      if (inline && closeAfterFinish) {
        throw new Error('[Dashboard] `closeAfterFinish: true` cannot be used on an inline Dashboard, because an inline Dashboard cannot be closed at all. Either set `inline: false`, or disable the `closeAfterFinish` option.');
      }

      const {
        allowMultipleUploads,
        allowMultipleUploadBatches
      } = this.uppy.opts;

      if ((allowMultipleUploads || allowMultipleUploadBatches) && closeAfterFinish) {
        this.uppy.log('[Dashboard] When using `closeAfterFinish`, we recommended setting the `allowMultipleUploadBatches` option to `false` in the Uppy constructor. See https://uppy.io/docs/uppy/#allowMultipleUploads-true', 'warning');
      }

      const {
        target
      } = this.opts;

      if (target) {
        this.mount(target, this);
      }

      const plugins = this.opts.plugins || [];
      plugins.forEach(pluginID => {
        const plugin = this.uppy.getPlugin(pluginID);

        if (plugin) {
          plugin.mount(this, plugin);
        }
      });

      if (!this.opts.disableStatusBar) {
        this.uppy.use(StatusBar, {
          id: `${this.id}:StatusBar`,
          target: this,
          hideUploadButton: this.opts.hideUploadButton,
          hideRetryButton: this.opts.hideRetryButton,
          hidePauseResumeButton: this.opts.hidePauseResumeButton,
          hideCancelButton: this.opts.hideCancelButton,
          showProgressDetails: this.opts.showProgressDetails,
          hideAfterFinish: this.opts.hideProgressAfterFinish,
          locale: this.opts.locale,
          doneButtonHandler: this.opts.doneButtonHandler
        });
      }

      if (!this.opts.disableInformer) {
        this.uppy.use(Informer, {
          id: `${this.id}:Informer`,
          target: this
        });
      }

      if (!this.opts.disableThumbnailGenerator) {
        this.uppy.use(ThumbnailGenerator, {
          id: `${this.id}:ThumbnailGenerator`,
          thumbnailWidth: this.opts.thumbnailWidth,
          thumbnailHeight: this.opts.thumbnailHeight,
          thumbnailType: this.opts.thumbnailType,
          waitForThumbnailsBeforeUpload: this.opts.waitForThumbnailsBeforeUpload,
          // If we don't block on thumbnails, we can lazily generate them
          lazy: !this.opts.waitForThumbnailsBeforeUpload
        });
      } // Dark Mode / theme


      this.darkModeMediaQuery = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
      const isDarkModeOnFromTheStart = this.darkModeMediaQuery ? this.darkModeMediaQuery.matches : false;
      this.uppy.log(`[Dashboard] Dark mode is ${isDarkModeOnFromTheStart ? 'on' : 'off'}`);
      this.setDarkModeCapability(isDarkModeOnFromTheStart);

      if (this.opts.theme === 'auto') {
        this.darkModeMediaQuery.addListener(this.handleSystemDarkModeChange);
      }

      this.discoverProviderPlugins();
      this.initEvents();
    };

    this.uninstall = () => {
      if (!this.opts.disableInformer) {
        const informer = this.uppy.getPlugin(`${this.id}:Informer`); // Checking if this plugin exists, in case it was removed by uppy-core
        // before the Dashboard was.

        if (informer) this.uppy.removePlugin(informer);
      }

      if (!this.opts.disableStatusBar) {
        const statusBar = this.uppy.getPlugin(`${this.id}:StatusBar`);
        if (statusBar) this.uppy.removePlugin(statusBar);
      }

      if (!this.opts.disableThumbnailGenerator) {
        const thumbnail = this.uppy.getPlugin(`${this.id}:ThumbnailGenerator`);
        if (thumbnail) this.uppy.removePlugin(thumbnail);
      }

      const plugins = this.opts.plugins || [];
      plugins.forEach(pluginID => {
        const plugin = this.uppy.getPlugin(pluginID);
        if (plugin) plugin.unmount();
      });

      if (this.opts.theme === 'auto') {
        this.darkModeMediaQuery.removeListener(this.handleSystemDarkModeChange);
      }

      this.unmount();
      this.removeEvents();
    };

    this.id = this.opts.id || 'Dashboard';
    this.title = 'Dashboard';
    this.type = 'orchestrator';
    this.modalName = `uppy-Dashboard-${nanoid()}`;
    this.defaultLocale = locale; // set default options

    const defaultOptions = {
      target: 'body',
      metaFields: [],
      trigger: null,
      inline: false,
      width: 750,
      height: 550,
      thumbnailWidth: 280,
      thumbnailType: 'image/jpeg',
      waitForThumbnailsBeforeUpload: false,
      defaultPickerIcon,
      showLinkToFileUploadResult: false,
      showProgressDetails: false,
      hideUploadButton: false,
      hideCancelButton: false,
      hideRetryButton: false,
      hidePauseResumeButton: false,
      hideProgressAfterFinish: false,
      doneButtonHandler: () => {
        this.uppy.reset();
        this.requestCloseModal();
      },
      note: null,
      closeModalOnClickOutside: false,
      closeAfterFinish: false,
      disableStatusBar: false,
      disableInformer: false,
      disableThumbnailGenerator: false,
      disablePageScrollWhenModalOpen: true,
      animateOpenClose: true,
      fileManagerSelectionType: 'files',
      proudlyDisplayPoweredByUppy: true,
      onRequestCloseModal: () => this.closeModal(),
      showSelectedFiles: true,
      showRemoveButtonAfterComplete: false,
      browserBackButtonClose: false,
      theme: 'light',
      autoOpenFileEditor: false,
      disabled: false,
      disableLocalFiles: false
    }; // merge default options with the ones set by user

    this.opts = { ...defaultOptions,
      ..._opts
    };
    this.i18nInit();
    this.superFocus = createSuperFocus();
    this.ifFocusedOnUppyRecently = false; // Timeouts

    this.makeDashboardInsidesVisibleAnywayTimeout = null;
    this.removeDragOverClassTimeout = null;
  }

}), _class.VERSION = "2.2.0", _temp);

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/locale.js":
/*!****************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/locale.js ***!
  \****************************************************/
/***/ ((module) => {

module.exports = {
  strings: {
    // When `inline: false`, used as the screen reader label for the button that closes the modal.
    closeModal: 'Close Modal',
    // Used as the screen reader label for the plus (+) button that shows the “Add more files” screen
    addMoreFiles: 'Add more files',
    addingMoreFiles: 'Adding more files',
    // Used as the header for import panels, e.g., “Import from Google Drive”.
    importFrom: 'Import from %{name}',
    // When `inline: false`, used as the screen reader label for the dashboard modal.
    dashboardWindowTitle: 'Uppy Dashboard Window (Press escape to close)',
    // When `inline: true`, used as the screen reader label for the dashboard area.
    dashboardTitle: 'Uppy Dashboard',
    // Shown in the Informer when a link to a file was copied to the clipboard.
    copyLinkToClipboardSuccess: 'Link copied to clipboard.',
    // Used when a link cannot be copied automatically — the user has to select the text from the
    // input element below this string.
    copyLinkToClipboardFallback: 'Copy the URL below',
    // Used as the hover title and screen reader label for buttons that copy a file link.
    copyLink: 'Copy link',
    back: 'Back',
    // Used as the screen reader label for buttons that remove a file.
    removeFile: 'Remove file',
    // Used as the screen reader label for buttons that open the metadata editor panel for a file.
    editFile: 'Edit file',
    // Shown in the panel header for the metadata editor. Rendered as “Editing image.png”.
    editing: 'Editing %{file}',
    // Used as the screen reader label for the button that saves metadata edits and returns to the
    // file list view.
    finishEditingFile: 'Finish editing file',
    saveChanges: 'Save changes',
    // Used as the label for the tab button that opens the system file selection dialog.
    myDevice: 'My Device',
    dropHint: 'Drop your files here',
    // Used as the hover text and screen reader label for file progress indicators when
    // they have been fully uploaded.
    uploadComplete: 'Upload complete',
    uploadPaused: 'Upload paused',
    // Used as the hover text and screen reader label for the buttons to resume paused uploads.
    resumeUpload: 'Resume upload',
    // Used as the hover text and screen reader label for the buttons to pause uploads.
    pauseUpload: 'Pause upload',
    // Used as the hover text and screen reader label for the buttons to retry failed uploads.
    retryUpload: 'Retry upload',
    // Used as the hover text and screen reader label for the buttons to cancel uploads.
    cancelUpload: 'Cancel upload',
    // Used in a title, how many files are currently selected
    xFilesSelected: {
      0: '%{smart_count} file selected',
      1: '%{smart_count} files selected'
    },
    uploadingXFiles: {
      0: 'Uploading %{smart_count} file',
      1: 'Uploading %{smart_count} files'
    },
    processingXFiles: {
      0: 'Processing %{smart_count} file',
      1: 'Processing %{smart_count} files'
    },
    // The "powered by Uppy" link at the bottom of the Dashboard.
    poweredBy: 'Powered by %{uppy}',
    addMore: 'Add more',
    editFileWithFilename: 'Edit file %{file}',
    save: 'Save',
    cancel: 'Cancel',
    dropPasteFiles: 'Drop files here or %{browseFiles}',
    dropPasteFolders: 'Drop files here or %{browseFolders}',
    dropPasteBoth: 'Drop files here, %{browseFiles} or %{browseFolders}',
    dropPasteImportFiles: 'Drop files here, %{browseFiles} or import from:',
    dropPasteImportFolders: 'Drop files here, %{browseFolders} or import from:',
    dropPasteImportBoth: 'Drop files here, %{browseFiles}, %{browseFolders} or import from:',
    importFiles: 'Import files from:',
    browseFiles: 'browse files',
    browseFolders: 'browse folders',
    recoveredXFiles: {
      0: 'We could not fully recover 1 file. Please re-select it and resume the upload.',
      1: 'We could not fully recover %{smart_count} files. Please re-select them and resume the upload.'
    },
    recoveredAllFiles: 'We restored all files. You can now resume the upload.',
    sessionRestored: 'Session restored',
    reSelect: 'Re-select',
    missingRequiredMetaFields: {
      0: 'Missing required meta field: %{fields}.',
      1: 'Missing required meta fields: %{fields}.'
    }
  }
};

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/utils/copyToClipboard.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/utils/copyToClipboard.js ***!
  \*******************************************************************/
/***/ ((module) => {

/**
 * Copies text to clipboard by creating an almost invisible textarea,
 * adding text there, then running execCommand('copy').
 * Falls back to prompt() when the easy way fails (hello, Safari!)
 * From http://stackoverflow.com/a/30810322
 *
 * @param {string} textToCopy
 * @param {string} fallbackString
 * @returns {Promise}
 */
module.exports = function copyToClipboard(textToCopy, fallbackString) {
  fallbackString = fallbackString || 'Copy the URL below';
  return new Promise(resolve => {
    const textArea = document.createElement('textarea');
    textArea.setAttribute('style', {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '2em',
      height: '2em',
      padding: 0,
      border: 'none',
      outline: 'none',
      boxShadow: 'none',
      background: 'transparent'
    });
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();

    const magicCopyFailed = () => {
      document.body.removeChild(textArea); // eslint-disable-next-line no-alert

      window.prompt(fallbackString, textToCopy);
      resolve();
    };

    try {
      const successful = document.execCommand('copy');

      if (!successful) {
        return magicCopyFailed('copy command unavailable');
      }

      document.body.removeChild(textArea);
      return resolve();
    } catch (err) {
      document.body.removeChild(textArea);
      return magicCopyFailed(err);
    }
  });
};

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/utils/createSuperFocus.js":
/*!********************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/utils/createSuperFocus.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const debounce = __webpack_require__(/*! lodash.debounce */ "./node_modules/lodash.debounce/index.js");

const FOCUSABLE_ELEMENTS = __webpack_require__(/*! @uppy/utils/lib/FOCUSABLE_ELEMENTS */ "./node_modules/@uppy/utils/lib/FOCUSABLE_ELEMENTS.js");

const getActiveOverlayEl = __webpack_require__(/*! ./getActiveOverlayEl */ "./node_modules/@uppy/dashboard/lib/utils/getActiveOverlayEl.js");
/*
  Focuses on some element in the currently topmost overlay.

  1. If there are some [data-uppy-super-focusable] elements rendered already - focuses
     on the first superfocusable element, and leaves focus up to the control of
     a user (until currently focused element disappears from the screen [which
     can happen when overlay changes, or, e.g., when we click on a folder in googledrive]).
  2. If there are no [data-uppy-super-focusable] elements yet (or ever) - focuses
     on the first focusable element, but switches focus if superfocusable elements appear on next render.
*/


module.exports = function createSuperFocus() {
  let lastFocusWasOnSuperFocusableEl = false;

  const superFocus = (dashboardEl, activeOverlayType) => {
    const overlayEl = getActiveOverlayEl(dashboardEl, activeOverlayType);
    const isFocusInOverlay = overlayEl.contains(document.activeElement); // If focus is already in the topmost overlay, AND on last update we focused on the superfocusable
    // element - then leave focus up to the user.
    // [Practical check] without this line, typing in the search input in googledrive overlay won't work.

    if (isFocusInOverlay && lastFocusWasOnSuperFocusableEl) return;
    const superFocusableEl = overlayEl.querySelector('[data-uppy-super-focusable]'); // If we are already in the topmost overlay, AND there are no super focusable elements yet, - leave focus up to the user.
    // [Practical check] without this line, if you are in an empty folder in google drive, and something's uploading in the
    // bg, - focus will be jumping to Done all the time.

    if (isFocusInOverlay && !superFocusableEl) return;

    if (superFocusableEl) {
      superFocusableEl.focus({
        preventScroll: true
      });
      lastFocusWasOnSuperFocusableEl = true;
    } else {
      const firstEl = overlayEl.querySelector(FOCUSABLE_ELEMENTS);
      firstEl == null ? void 0 : firstEl.focus({
        preventScroll: true
      });
      lastFocusWasOnSuperFocusableEl = false;
    }
  }; // ___Why do we need to debounce?
  //    1. To deal with animations: overlay changes via animations, which results in the DOM updating AFTER plugin.update()
  //       already executed.
  //    [Practical check] without debounce, if we open the Url overlay, and click 'Done', Dashboard won't get focused again.
  //    [Practical check] if we delay 250ms instead of 260ms - IE11 won't get focused in same situation.
  //    2. Performance: there can be many state update()s in a second, and this function is called every time.


  return debounce(superFocus, 260);
};

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/utils/getActiveOverlayEl.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/utils/getActiveOverlayEl.js ***!
  \**********************************************************************/
/***/ ((module) => {

/**
 * @returns {HTMLElement} - either dashboard element, or the overlay that's most on top
 */
module.exports = function getActiveOverlayEl(dashboardEl, activeOverlayType) {
  if (activeOverlayType) {
    const overlayEl = dashboardEl.querySelector(`[data-uppy-paneltype="${activeOverlayType}"]`); // if an overlay is already mounted

    if (overlayEl) return overlayEl;
  }

  return dashboardEl;
};

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/utils/getFileTypeIcon.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/utils/getFileTypeIcon.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  h
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

function iconImage() {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    width: "25",
    height: "25",
    viewBox: "0 0 25 25"
  }, h("g", {
    fill: "#686DE0",
    fillRule: "evenodd"
  }, h("path", {
    d: "M5 7v10h15V7H5zm0-1h15a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z",
    fillRule: "nonzero"
  }), h("path", {
    d: "M6.35 17.172l4.994-5.026a.5.5 0 0 1 .707 0l2.16 2.16 3.505-3.505a.5.5 0 0 1 .707 0l2.336 2.31-.707.72-1.983-1.97-3.505 3.505a.5.5 0 0 1-.707 0l-2.16-2.159-3.938 3.939-1.409.026z",
    fillRule: "nonzero"
  }), h("circle", {
    cx: "7.5",
    cy: "9.5",
    r: "1.5"
  })));
}

function iconAudio() {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "25",
    height: "25",
    viewBox: "0 0 25 25"
  }, h("path", {
    d: "M9.5 18.64c0 1.14-1.145 2-2.5 2s-2.5-.86-2.5-2c0-1.14 1.145-2 2.5-2 .557 0 1.079.145 1.5.396V7.25a.5.5 0 0 1 .379-.485l9-2.25A.5.5 0 0 1 18.5 5v11.64c0 1.14-1.145 2-2.5 2s-2.5-.86-2.5-2c0-1.14 1.145-2 2.5-2 .557 0 1.079.145 1.5.396V8.67l-8 2v7.97zm8-11v-2l-8 2v2l8-2zM7 19.64c.855 0 1.5-.484 1.5-1s-.645-1-1.5-1-1.5.484-1.5 1 .645 1 1.5 1zm9-2c.855 0 1.5-.484 1.5-1s-.645-1-1.5-1-1.5.484-1.5 1 .645 1 1.5 1z",
    fill: "#049BCF",
    fillRule: "nonzero"
  }));
}

function iconVideo() {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "25",
    height: "25",
    viewBox: "0 0 25 25"
  }, h("path", {
    d: "M16 11.834l4.486-2.691A1 1 0 0 1 22 10v6a1 1 0 0 1-1.514.857L16 14.167V17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2.834zM15 9H5v8h10V9zm1 4l5 3v-6l-5 3z",
    fill: "#19AF67",
    fillRule: "nonzero"
  }));
}

function iconPDF() {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "25",
    height: "25",
    viewBox: "0 0 25 25"
  }, h("path", {
    d: "M9.766 8.295c-.691-1.843-.539-3.401.747-3.726 1.643-.414 2.505.938 2.39 3.299-.039.79-.194 1.662-.537 3.148.324.49.66.967 1.055 1.51.17.231.382.488.629.757 1.866-.128 3.653.114 4.918.655 1.487.635 2.192 1.685 1.614 2.84-.566 1.133-1.839 1.084-3.416.249-1.141-.604-2.457-1.634-3.51-2.707a13.467 13.467 0 0 0-2.238.426c-1.392 4.051-4.534 6.453-5.707 4.572-.986-1.58 1.38-4.206 4.914-5.375.097-.322.185-.656.264-1.001.08-.353.306-1.31.407-1.737-.678-1.059-1.2-2.031-1.53-2.91zm2.098 4.87c-.033.144-.068.287-.104.427l.033-.01-.012.038a14.065 14.065 0 0 1 1.02-.197l-.032-.033.052-.004a7.902 7.902 0 0 1-.208-.271c-.197-.27-.38-.526-.555-.775l-.006.028-.002-.003c-.076.323-.148.632-.186.8zm5.77 2.978c1.143.605 1.832.632 2.054.187.26-.519-.087-1.034-1.113-1.473-.911-.39-2.175-.608-3.55-.608.845.766 1.787 1.459 2.609 1.894zM6.559 18.789c.14.223.693.16 1.425-.413.827-.648 1.61-1.747 2.208-3.206-2.563 1.064-4.102 2.867-3.633 3.62zm5.345-10.97c.088-1.793-.351-2.48-1.146-2.28-.473.119-.564 1.05-.056 2.405.213.566.52 1.188.908 1.859.18-.858.268-1.453.294-1.984z",
    fill: "#E2514A",
    fillRule: "nonzero"
  }));
}

function iconArchive() {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    width: "25",
    height: "25",
    viewBox: "0 0 25 25"
  }, h("path", {
    d: "M10.45 2.05h1.05a.5.5 0 0 1 .5.5v.024a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5V2.55a.5.5 0 0 1 .5-.5zm2.05 1.024h1.05a.5.5 0 0 1 .5.5V3.6a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5v-.001zM10.45 0h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5V.5a.5.5 0 0 1 .5-.5zm2.05 1.025h1.05a.5.5 0 0 1 .5.5v.024a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.024a.5.5 0 0 1 .5-.5zm-2.05 3.074h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5zm2.05 1.025h1.05a.5.5 0 0 1 .5.5v.024a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.024a.5.5 0 0 1 .5-.5zm-2.05 1.024h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5zm2.05 1.025h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5zm-2.05 1.025h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5zm2.05 1.025h1.05a.5.5 0 0 1 .5.5v.024a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.024a.5.5 0 0 1 .5-.5zm-1.656 3.074l-.82 5.946c.52.302 1.174.458 1.976.458.803 0 1.455-.156 1.975-.458l-.82-5.946h-2.311zm0-1.025h2.312c.512 0 .946.378 1.015.885l.82 5.946c.056.412-.142.817-.501 1.026-.686.398-1.515.597-2.49.597-.974 0-1.804-.199-2.49-.597a1.025 1.025 0 0 1-.5-1.026l.819-5.946c.07-.507.503-.885 1.015-.885zm.545 6.6a.5.5 0 0 1-.397-.561l.143-.999a.5.5 0 0 1 .495-.429h.74a.5.5 0 0 1 .495.43l.143.998a.5.5 0 0 1-.397.561c-.404.08-.819.08-1.222 0z",
    fill: "#00C469",
    fillRule: "nonzero"
  }));
}

function iconFile() {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "25",
    height: "25",
    viewBox: "0 0 25 25"
  }, h("g", {
    fill: "#A7AFB7",
    fillRule: "nonzero"
  }, h("path", {
    d: "M5.5 22a.5.5 0 0 1-.5-.5v-18a.5.5 0 0 1 .5-.5h10.719a.5.5 0 0 1 .367.16l3.281 3.556a.5.5 0 0 1 .133.339V21.5a.5.5 0 0 1-.5.5h-14zm.5-1h13V7.25L16 4H6v17z"
  }), h("path", {
    d: "M15 4v3a1 1 0 0 0 1 1h3V7h-3V4h-1z"
  })));
}

function iconText() {
  return h("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "25",
    height: "25",
    viewBox: "0 0 25 25"
  }, h("path", {
    d: "M4.5 7h13a.5.5 0 1 1 0 1h-13a.5.5 0 0 1 0-1zm0 3h15a.5.5 0 1 1 0 1h-15a.5.5 0 1 1 0-1zm0 3h15a.5.5 0 1 1 0 1h-15a.5.5 0 1 1 0-1zm0 3h10a.5.5 0 1 1 0 1h-10a.5.5 0 1 1 0-1z",
    fill: "#5A5E69",
    fillRule: "nonzero"
  }));
}

module.exports = function getIconByMime(fileType) {
  const defaultChoice = {
    color: '#838999',
    icon: iconFile()
  };
  if (!fileType) return defaultChoice;
  const fileTypeGeneral = fileType.split('/')[0];
  const fileTypeSpecific = fileType.split('/')[1]; // Text

  if (fileTypeGeneral === 'text') {
    return {
      color: '#5a5e69',
      icon: iconText()
    };
  } // Image


  if (fileTypeGeneral === 'image') {
    return {
      color: '#686de0',
      icon: iconImage()
    };
  } // Audio


  if (fileTypeGeneral === 'audio') {
    return {
      color: '#068dbb',
      icon: iconAudio()
    };
  } // Video


  if (fileTypeGeneral === 'video') {
    return {
      color: '#19af67',
      icon: iconVideo()
    };
  } // PDF


  if (fileTypeGeneral === 'application' && fileTypeSpecific === 'pdf') {
    return {
      color: '#e25149',
      icon: iconPDF()
    };
  } // Archive


  const archiveTypes = ['zip', 'x-7z-compressed', 'x-rar-compressed', 'x-tar', 'x-gzip', 'x-apple-diskimage'];

  if (fileTypeGeneral === 'application' && archiveTypes.indexOf(fileTypeSpecific) !== -1) {
    return {
      color: '#00C469',
      icon: iconArchive()
    };
  }

  return defaultChoice;
};

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/utils/ignoreEvent.js":
/*!***************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/utils/ignoreEvent.js ***!
  \***************************************************************/
/***/ ((module) => {

// ignore drop/paste events if they are not in input or textarea —
// otherwise when Url plugin adds drop/paste listeners to this.el,
// draging UI elements or pasting anything into any field triggers those events —
// Url treats them as URLs that need to be imported
function ignoreEvent(ev) {
  const {
    tagName
  } = ev.target;

  if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
    ev.stopPropagation();
    return;
  }

  ev.preventDefault();
  ev.stopPropagation();
}

module.exports = ignoreEvent;

/***/ }),

/***/ "./node_modules/@uppy/dashboard/lib/utils/trapFocus.js":
/*!*************************************************************!*\
  !*** ./node_modules/@uppy/dashboard/lib/utils/trapFocus.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const toArray = __webpack_require__(/*! @uppy/utils/lib/toArray */ "./node_modules/@uppy/utils/lib/toArray.js");

const FOCUSABLE_ELEMENTS = __webpack_require__(/*! @uppy/utils/lib/FOCUSABLE_ELEMENTS */ "./node_modules/@uppy/utils/lib/FOCUSABLE_ELEMENTS.js");

const getActiveOverlayEl = __webpack_require__(/*! ./getActiveOverlayEl */ "./node_modules/@uppy/dashboard/lib/utils/getActiveOverlayEl.js");

function focusOnFirstNode(event, nodes) {
  const node = nodes[0];

  if (node) {
    node.focus();
    event.preventDefault();
  }
}

function focusOnLastNode(event, nodes) {
  const node = nodes[nodes.length - 1];

  if (node) {
    node.focus();
    event.preventDefault();
  }
} // ___Why not just use (focusedItemIndex === -1)?
//    Firefox thinks <ul> is focusable, but we don't have <ul>s in our FOCUSABLE_ELEMENTS. Which means that if we tab into
//    the <ul>, code will think that we are not in the active overlay, and we should focusOnFirstNode() of the currently
//    active overlay!
//    [Practical check] if we use (focusedItemIndex === -1), instagram provider in firefox will never get focus on its pics
//    in the <ul>.


function isFocusInOverlay(activeOverlayEl) {
  return activeOverlayEl.contains(document.activeElement);
}

function trapFocus(event, activeOverlayType, dashboardEl) {
  const activeOverlayEl = getActiveOverlayEl(dashboardEl, activeOverlayType);
  const focusableNodes = toArray(activeOverlayEl.querySelectorAll(FOCUSABLE_ELEMENTS));
  const focusedItemIndex = focusableNodes.indexOf(document.activeElement); // If we pressed tab, and focus is not yet within the current overlay - focus on
  // the first element within the current overlay.
  // This is a safety measure (for when user returns from another tab e.g.), most
  // plugins will try to focus on some important element as it loads.

  if (!isFocusInOverlay(activeOverlayEl)) {
    focusOnFirstNode(event, focusableNodes); // If we pressed shift + tab, and we're on the first element of a modal
  } else if (event.shiftKey && focusedItemIndex === 0) {
    focusOnLastNode(event, focusableNodes); // If we pressed tab, and we're on the last element of the modal
  } else if (!event.shiftKey && focusedItemIndex === focusableNodes.length - 1) {
    focusOnFirstNode(event, focusableNodes);
  }
}

module.exports = {
  // Traps focus inside of the currently open overlay (e.g. Dashboard, or e.g. Instagram),
  // never lets focus disappear from the modal.
  forModal: (event, activeOverlayType, dashboardEl) => {
    trapFocus(event, activeOverlayType, dashboardEl);
  },
  // Traps focus inside of the currently open overlay, unless overlay is null - then let the user tab away.
  forInline: (event, activeOverlayType, dashboardEl) => {
    // ___When we're in the bare 'Drop files here, paste, browse or import from' screen
    if (activeOverlayType === null) {// Do nothing and let the browser handle it, user can tab away from Uppy to other elements on the page
      // ___When there is some overlay with 'Done' button
    } else {
      // Trap the focus inside this overlay!
      // User can close the overlay (click 'Done') if they want to travel away from Uppy.
      trapFocus(event, activeOverlayType, dashboardEl);
    }
  }
};

/***/ }),

/***/ "./node_modules/@uppy/informer/lib/FadeIn.js":
/*!***************************************************!*\
  !*** ./node_modules/@uppy/informer/lib/FadeIn.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const {
  h,
  Component,
  createRef
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const TRANSITION_MS = 300;
module.exports = class FadeIn extends Component {
  constructor() {
    super(...arguments);
    this.ref = createRef();
  }

  componentWillEnter(callback) {
    this.ref.current.style.opacity = '1';
    this.ref.current.style.transform = 'none';
    setTimeout(callback, TRANSITION_MS);
  }

  componentWillLeave(callback) {
    this.ref.current.style.opacity = '0';
    this.ref.current.style.transform = 'translateY(350%)';
    setTimeout(callback, TRANSITION_MS);
  }

  render() {
    const {
      children
    } = this.props;
    return h("div", {
      className: "uppy-Informer-animated",
      ref: this.ref
    }, children);
  }

};

/***/ }),

/***/ "./node_modules/@uppy/informer/lib/TransitionGroup.js":
/*!************************************************************!*\
  !*** ./node_modules/@uppy/informer/lib/TransitionGroup.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* eslint-disable */

/**
 * @source https://github.com/developit/preact-transition-group
 */


const {
  Component,
  cloneElement,
  h,
  toChildArray
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

function assign(obj, props) {
  return Object.assign(obj, props);
}

function getKey(vnode, fallback) {
  var _vnode$key;

  return (_vnode$key = vnode == null ? void 0 : vnode.key) != null ? _vnode$key : fallback;
}

function linkRef(component, name) {
  const cache = component._ptgLinkedRefs || (component._ptgLinkedRefs = {});
  return cache[name] || (cache[name] = c => {
    component.refs[name] = c;
  });
}

function getChildMapping(children) {
  const out = {};

  for (let i = 0; i < children.length; i++) {
    if (children[i] != null) {
      const key = getKey(children[i], i.toString(36));
      out[key] = children[i];
    }
  }

  return out;
}

function mergeChildMappings(prev, next) {
  prev = prev || {};
  next = next || {};

  const getValueForKey = key => next.hasOwnProperty(key) ? next[key] : prev[key]; // For each key of `next`, the list of keys to insert before that key in
  // the combined list


  const nextKeysPending = {};
  let pendingKeys = [];

  for (const prevKey in prev) {
    if (next.hasOwnProperty(prevKey)) {
      if (pendingKeys.length) {
        nextKeysPending[prevKey] = pendingKeys;
        pendingKeys = [];
      }
    } else {
      pendingKeys.push(prevKey);
    }
  }

  const childMapping = {};

  for (const nextKey in next) {
    if (nextKeysPending.hasOwnProperty(nextKey)) {
      for (let i = 0; i < nextKeysPending[nextKey].length; i++) {
        const pendingNextKey = nextKeysPending[nextKey][i];
        childMapping[nextKeysPending[nextKey][i]] = getValueForKey(pendingNextKey);
      }
    }

    childMapping[nextKey] = getValueForKey(nextKey);
  } // Finally, add the keys which didn't appear before any key in `next`


  for (let i = 0; i < pendingKeys.length; i++) {
    childMapping[pendingKeys[i]] = getValueForKey(pendingKeys[i]);
  }

  return childMapping;
}

const identity = i => i;

class TransitionGroup extends Component {
  constructor(props, context) {
    super(props, context);
    this.refs = {};
    this.state = {
      children: getChildMapping(toChildArray(toChildArray(this.props.children)) || [])
    };
    this.performAppear = this.performAppear.bind(this);
    this.performEnter = this.performEnter.bind(this);
    this.performLeave = this.performLeave.bind(this);
  }

  componentWillMount() {
    this.currentlyTransitioningKeys = {};
    this.keysToAbortLeave = [];
    this.keysToEnter = [];
    this.keysToLeave = [];
  }

  componentDidMount() {
    const initialChildMapping = this.state.children;

    for (const key in initialChildMapping) {
      if (initialChildMapping[key]) {
        // this.performAppear(getKey(initialChildMapping[key], key));
        this.performAppear(key);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const nextChildMapping = getChildMapping(toChildArray(nextProps.children) || []);
    const prevChildMapping = this.state.children;
    this.setState(prevState => ({
      children: mergeChildMappings(prevState.children, nextChildMapping)
    }));
    let key;

    for (key in nextChildMapping) {
      if (nextChildMapping.hasOwnProperty(key)) {
        const hasPrev = prevChildMapping && prevChildMapping.hasOwnProperty(key); // We should re-enter the component and abort its leave function

        if (nextChildMapping[key] && hasPrev && this.currentlyTransitioningKeys[key]) {
          this.keysToEnter.push(key);
          this.keysToAbortLeave.push(key);
        } else if (nextChildMapping[key] && !hasPrev && !this.currentlyTransitioningKeys[key]) {
          this.keysToEnter.push(key);
        }
      }
    }

    for (key in prevChildMapping) {
      if (prevChildMapping.hasOwnProperty(key)) {
        const hasNext = nextChildMapping && nextChildMapping.hasOwnProperty(key);

        if (prevChildMapping[key] && !hasNext && !this.currentlyTransitioningKeys[key]) {
          this.keysToLeave.push(key);
        }
      }
    }
  }

  componentDidUpdate() {
    const {
      keysToEnter
    } = this;
    this.keysToEnter = [];
    keysToEnter.forEach(this.performEnter);
    const {
      keysToLeave
    } = this;
    this.keysToLeave = [];
    keysToLeave.forEach(this.performLeave);
  }

  _finishAbort(key) {
    const idx = this.keysToAbortLeave.indexOf(key);

    if (idx !== -1) {
      this.keysToAbortLeave.splice(idx, 1);
    }
  }

  performAppear(key) {
    this.currentlyTransitioningKeys[key] = true;
    const component = this.refs[key];

    if (component.componentWillAppear) {
      component.componentWillAppear(this._handleDoneAppearing.bind(this, key));
    } else {
      this._handleDoneAppearing(key);
    }
  }

  _handleDoneAppearing(key) {
    const component = this.refs[key];

    if (component.componentDidAppear) {
      component.componentDidAppear();
    }

    delete this.currentlyTransitioningKeys[key];

    this._finishAbort(key);

    const currentChildMapping = getChildMapping(toChildArray(this.props.children) || []);

    if (!currentChildMapping || !currentChildMapping.hasOwnProperty(key)) {
      // This was removed before it had fully appeared. Remove it.
      this.performLeave(key);
    }
  }

  performEnter(key) {
    this.currentlyTransitioningKeys[key] = true;
    const component = this.refs[key];

    if (component.componentWillEnter) {
      component.componentWillEnter(this._handleDoneEntering.bind(this, key));
    } else {
      this._handleDoneEntering(key);
    }
  }

  _handleDoneEntering(key) {
    const component = this.refs[key];

    if (component.componentDidEnter) {
      component.componentDidEnter();
    }

    delete this.currentlyTransitioningKeys[key];

    this._finishAbort(key);

    const currentChildMapping = getChildMapping(toChildArray(this.props.children) || []);

    if (!currentChildMapping || !currentChildMapping.hasOwnProperty(key)) {
      // This was removed before it had fully entered. Remove it.
      this.performLeave(key);
    }
  }

  performLeave(key) {
    // If we should immediately abort this leave function,
    // don't run the leave transition at all.
    const idx = this.keysToAbortLeave.indexOf(key);

    if (idx !== -1) {
      return;
    }

    this.currentlyTransitioningKeys[key] = true;
    const component = this.refs[key];

    if (component.componentWillLeave) {
      component.componentWillLeave(this._handleDoneLeaving.bind(this, key));
    } else {
      // Note that this is somewhat dangerous b/c it calls setState()
      // again, effectively mutating the component before all the work
      // is done.
      this._handleDoneLeaving(key);
    }
  }

  _handleDoneLeaving(key) {
    // If we should immediately abort the leave,
    // then skip this altogether
    const idx = this.keysToAbortLeave.indexOf(key);

    if (idx !== -1) {
      return;
    }

    const component = this.refs[key];

    if (component.componentDidLeave) {
      component.componentDidLeave();
    }

    delete this.currentlyTransitioningKeys[key];
    const currentChildMapping = getChildMapping(toChildArray(this.props.children) || []);

    if (currentChildMapping && currentChildMapping.hasOwnProperty(key)) {
      // This entered again before it fully left. Add it again.
      this.performEnter(key);
    } else {
      const children = assign({}, this.state.children);
      delete children[key];
      this.setState({
        children
      });
    }
  }

  render(_ref, _ref2) {
    let {
      childFactory,
      transitionLeave,
      transitionName,
      transitionAppear,
      transitionEnter,
      transitionLeaveTimeout,
      transitionEnterTimeout,
      transitionAppearTimeout,
      component,
      ...props
    } = _ref;
    let {
      children
    } = _ref2;
    // TODO: we could get rid of the need for the wrapper node
    // by cloning a single child
    const childrenToRender = [];

    for (const key in children) {
      if (children.hasOwnProperty(key)) {
        const child = children[key];

        if (child) {
          const ref = linkRef(this, key),
                el = cloneElement(childFactory(child), {
            ref,
            key
          });
          childrenToRender.push(el);
        }
      }
    }

    return h(component, props, childrenToRender);
  }

}

TransitionGroup.defaultProps = {
  component: 'span',
  childFactory: identity
};
module.exports = TransitionGroup;

/***/ }),

/***/ "./node_modules/@uppy/informer/lib/index.js":
/*!**************************************************!*\
  !*** ./node_modules/@uppy/informer/lib/index.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _class, _temp;

/* eslint-disable jsx-a11y/no-noninteractive-element-interactions  */

/* eslint-disable jsx-a11y/click-events-have-key-events */
const {
  h
} = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const {
  UIPlugin
} = __webpack_require__(/*! @uppy/core */ "./node_modules/@uppy/core/lib/index.js");

const FadeIn = __webpack_require__(/*! ./FadeIn */ "./node_modules/@uppy/informer/lib/FadeIn.js");

const TransitionGroup = __webpack_require__(/*! ./TransitionGroup */ "./node_modules/@uppy/informer/lib/TransitionGroup.js");
/**
 * Informer
 * Shows rad message bubbles
 * used like this: `uppy.info('hello world', 'info', 5000)`
 * or for errors: `uppy.info('Error uploading img.jpg', 'error', 5000)`
 *
 */


module.exports = (_temp = _class = class Informer extends UIPlugin {
  // eslint-disable-next-line global-require
  constructor(uppy, opts) {
    super(uppy, opts);

    this.render = state => {
      return h("div", {
        className: "uppy uppy-Informer"
      }, h(TransitionGroup, null, state.info.map(info => h(FadeIn, {
        key: info.message
      }, h("p", {
        role: "alert"
      }, info.message, ' ', info.details && h("span", {
        "aria-label": info.details,
        "data-microtip-position": "top-left",
        "data-microtip-size": "medium",
        role: "tooltip" // eslint-disable-next-line no-alert
        ,
        onClick: () => alert(`${info.message} \n\n ${info.details}`)
      }, "?"))))));
    };

    this.type = 'progressindicator';
    this.id = this.opts.id || 'Informer';
    this.title = 'Informer'; // set default options

    const defaultOptions = {}; // merge default options with the ones set by user

    this.opts = { ...defaultOptions,
      ...opts
    };
  }

  install() {
    const {
      target
    } = this.opts;

    if (target) {
      this.mount(target, this);
    }
  }

}, _class.VERSION = "2.0.5", _temp);

/***/ }),

/***/ "./node_modules/@uppy/store-default/lib/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/@uppy/store-default/lib/index.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

var _publish = /*#__PURE__*/_classPrivateFieldLooseKey("publish");

/**
 * Default store that keeps state in a simple object.
 */
class DefaultStore {
  constructor() {
    Object.defineProperty(this, _publish, {
      value: _publish2
    });
    this.state = {};
    this.callbacks = [];
  }

  getState() {
    return this.state;
  }

  setState(patch) {
    const prevState = { ...this.state
    };
    const nextState = { ...this.state,
      ...patch
    };
    this.state = nextState;

    _classPrivateFieldLooseBase(this, _publish)[_publish](prevState, nextState, patch);
  }

  subscribe(listener) {
    this.callbacks.push(listener);
    return () => {
      // Remove the listener.
      this.callbacks.splice(this.callbacks.indexOf(listener), 1);
    };
  }

}

function _publish2() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  this.callbacks.forEach(listener => {
    listener(...args);
  });
}

DefaultStore.VERSION = "2.0.3";

module.exports = function defaultStore() {
  return new DefaultStore();
};

/***/ }),

/***/ "./node_modules/@uppy/thumbnail-generator/lib/index.js":
/*!*************************************************************!*\
  !*** ./node_modules/@uppy/thumbnail-generator/lib/index.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _class, _temp;

const {
  UIPlugin
} = __webpack_require__(/*! @uppy/core */ "./node_modules/@uppy/core/lib/index.js");

const dataURItoBlob = __webpack_require__(/*! @uppy/utils/lib/dataURItoBlob */ "./node_modules/@uppy/utils/lib/dataURItoBlob.js");

const isObjectURL = __webpack_require__(/*! @uppy/utils/lib/isObjectURL */ "./node_modules/@uppy/utils/lib/isObjectURL.js");

const isPreviewSupported = __webpack_require__(/*! @uppy/utils/lib/isPreviewSupported */ "./node_modules/@uppy/utils/lib/isPreviewSupported.js");

const {
  rotation
} = __webpack_require__(/*! exifr/dist/mini.umd.js */ "./node_modules/exifr/dist/mini.umd.js");

const locale = __webpack_require__(/*! ./locale */ "./node_modules/@uppy/thumbnail-generator/lib/locale.js");
/**
 * The Thumbnail Generator plugin
 */


module.exports = (_temp = _class = class ThumbnailGenerator extends UIPlugin {
  constructor(uppy, opts) {
    super(uppy, opts);

    this.onFileAdded = file => {
      if (!file.preview && file.data && isPreviewSupported(file.type) && !file.isRemote) {
        this.addToQueue(file.id);
      }
    };

    this.onCancelRequest = file => {
      const index = this.queue.indexOf(file.id);

      if (index !== -1) {
        this.queue.splice(index, 1);
      }
    };

    this.onFileRemoved = file => {
      const index = this.queue.indexOf(file.id);

      if (index !== -1) {
        this.queue.splice(index, 1);
      } // Clean up object URLs.


      if (file.preview && isObjectURL(file.preview)) {
        URL.revokeObjectURL(file.preview);
      }
    };

    this.onRestored = () => {
      const restoredFiles = this.uppy.getFiles().filter(file => file.isRestored);
      restoredFiles.forEach(file => {
        // Only add blob URLs; they are likely invalid after being restored.
        if (!file.preview || isObjectURL(file.preview)) {
          this.addToQueue(file.id);
        }
      });
    };

    this.onAllFilesRemoved = () => {
      this.queue = [];
    };

    this.waitUntilAllProcessed = fileIDs => {
      fileIDs.forEach(fileID => {
        const file = this.uppy.getFile(fileID);
        this.uppy.emit('preprocess-progress', file, {
          mode: 'indeterminate',
          message: this.i18n('generatingThumbnails')
        });
      });

      const emitPreprocessCompleteForAll = () => {
        fileIDs.forEach(fileID => {
          const file = this.uppy.getFile(fileID);
          this.uppy.emit('preprocess-complete', file);
        });
      };

      return new Promise(resolve => {
        if (this.queueProcessing) {
          this.uppy.once('thumbnail:all-generated', () => {
            emitPreprocessCompleteForAll();
            resolve();
          });
        } else {
          emitPreprocessCompleteForAll();
          resolve();
        }
      });
    };

    this.type = 'modifier';
    this.id = this.opts.id || 'ThumbnailGenerator';
    this.title = 'Thumbnail Generator';
    this.queue = [];
    this.queueProcessing = false;
    this.defaultThumbnailDimension = 200;
    this.thumbnailType = this.opts.thumbnailType || 'image/jpeg';
    this.defaultLocale = locale;
    const defaultOptions = {
      thumbnailWidth: null,
      thumbnailHeight: null,
      waitForThumbnailsBeforeUpload: false,
      lazy: false
    };
    this.opts = { ...defaultOptions,
      ...opts
    };
    this.i18nInit();

    if (this.opts.lazy && this.opts.waitForThumbnailsBeforeUpload) {
      throw new Error('ThumbnailGenerator: The `lazy` and `waitForThumbnailsBeforeUpload` options are mutually exclusive. Please ensure at most one of them is set to `true`.');
    }
  }
  /**
   * Create a thumbnail for the given Uppy file object.
   *
   * @param {{data: Blob}} file
   * @param {number} targetWidth
   * @param {number} targetHeight
   * @returns {Promise}
   */


  createThumbnail(file, targetWidth, targetHeight) {
    const originalUrl = URL.createObjectURL(file.data);
    const onload = new Promise((resolve, reject) => {
      const image = new Image();
      image.src = originalUrl;
      image.addEventListener('load', () => {
        URL.revokeObjectURL(originalUrl);
        resolve(image);
      });
      image.addEventListener('error', event => {
        URL.revokeObjectURL(originalUrl);
        reject(event.error || new Error('Could not create thumbnail'));
      });
    });
    const orientationPromise = rotation(file.data).catch(() => 1);
    return Promise.all([onload, orientationPromise]).then(_ref => {
      let [image, orientation] = _ref;
      const dimensions = this.getProportionalDimensions(image, targetWidth, targetHeight, orientation.deg);
      const rotatedImage = this.rotateImage(image, orientation);
      const resizedImage = this.resizeImage(rotatedImage, dimensions.width, dimensions.height);
      return this.canvasToBlob(resizedImage, this.thumbnailType, 80);
    }).then(blob => {
      return URL.createObjectURL(blob);
    });
  }
  /**
   * Get the new calculated dimensions for the given image and a target width
   * or height. If both width and height are given, only width is taken into
   * account. If neither width nor height are given, the default dimension
   * is used.
   */


  getProportionalDimensions(img, width, height, rotation) {
    let aspect = img.width / img.height;

    if (rotation === 90 || rotation === 270) {
      aspect = img.height / img.width;
    }

    if (width != null) {
      return {
        width,
        height: Math.round(width / aspect)
      };
    }

    if (height != null) {
      return {
        width: Math.round(height * aspect),
        height
      };
    }

    return {
      width: this.defaultThumbnailDimension,
      height: Math.round(this.defaultThumbnailDimension / aspect)
    };
  }
  /**
   * Make sure the image doesn’t exceed browser/device canvas limits.
   * For ios with 256 RAM and ie
   */


  protect(image) {
    // https://stackoverflow.com/questions/6081483/maximum-size-of-a-canvas-element
    const ratio = image.width / image.height;
    const maxSquare = 5000000; // ios max canvas square

    const maxSize = 4096; // ie max canvas dimensions

    let maxW = Math.floor(Math.sqrt(maxSquare * ratio));
    let maxH = Math.floor(maxSquare / Math.sqrt(maxSquare * ratio));

    if (maxW > maxSize) {
      maxW = maxSize;
      maxH = Math.round(maxW / ratio);
    }

    if (maxH > maxSize) {
      maxH = maxSize;
      maxW = Math.round(ratio * maxH);
    }

    if (image.width > maxW) {
      const canvas = document.createElement('canvas');
      canvas.width = maxW;
      canvas.height = maxH;
      canvas.getContext('2d').drawImage(image, 0, 0, maxW, maxH);
      image = canvas;
    }

    return image;
  }
  /**
   * Resize an image to the target `width` and `height`.
   *
   * Returns a Canvas with the resized image on it.
   */


  resizeImage(image, targetWidth, targetHeight) {
    // Resizing in steps refactored to use a solution from
    // https://blog.uploadcare.com/image-resize-in-browsers-is-broken-e38eed08df01
    image = this.protect(image);
    let steps = Math.ceil(Math.log2(image.width / targetWidth));

    if (steps < 1) {
      steps = 1;
    }

    let sW = targetWidth * 2 ** (steps - 1);
    let sH = targetHeight * 2 ** (steps - 1);
    const x = 2;

    while (steps--) {
      const canvas = document.createElement('canvas');
      canvas.width = sW;
      canvas.height = sH;
      canvas.getContext('2d').drawImage(image, 0, 0, sW, sH);
      image = canvas;
      sW = Math.round(sW / x);
      sH = Math.round(sH / x);
    }

    return image;
  }

  rotateImage(image, translate) {
    let w = image.width;
    let h = image.height;

    if (translate.deg === 90 || translate.deg === 270) {
      w = image.height;
      h = image.width;
    }

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const context = canvas.getContext('2d');
    context.translate(w / 2, h / 2);

    if (translate.canvas) {
      context.rotate(translate.rad);
      context.scale(translate.scaleX, translate.scaleY);
    }

    context.drawImage(image, -image.width / 2, -image.height / 2, image.width, image.height);
    return canvas;
  }
  /**
   * Save a <canvas> element's content to a Blob object.
   *
   * @param {HTMLCanvasElement} canvas
   * @returns {Promise}
   */


  canvasToBlob(canvas, type, quality) {
    try {
      canvas.getContext('2d').getImageData(0, 0, 1, 1);
    } catch (err) {
      if (err.code === 18) {
        return Promise.reject(new Error('cannot read image, probably an svg with external resources'));
      }
    }

    if (canvas.toBlob) {
      return new Promise(resolve => {
        canvas.toBlob(resolve, type, quality);
      }).then(blob => {
        if (blob === null) {
          throw new Error('cannot read image, probably an svg with external resources');
        }

        return blob;
      });
    }

    return Promise.resolve().then(() => {
      return dataURItoBlob(canvas.toDataURL(type, quality), {});
    }).then(blob => {
      if (blob === null) {
        throw new Error('could not extract blob, probably an old browser');
      }

      return blob;
    });
  }
  /**
   * Set the preview URL for a file.
   */


  setPreviewURL(fileID, preview) {
    this.uppy.setFileState(fileID, {
      preview
    });
  }

  addToQueue(item) {
    this.queue.push(item);

    if (this.queueProcessing === false) {
      this.processQueue();
    }
  }

  processQueue() {
    this.queueProcessing = true;

    if (this.queue.length > 0) {
      const current = this.uppy.getFile(this.queue.shift());

      if (!current) {
        this.uppy.log('[ThumbnailGenerator] file was removed before a thumbnail could be generated, but not removed from the queue. This is probably a bug', 'error');
        return;
      }

      return this.requestThumbnail(current).catch(() => {}) // eslint-disable-line node/handle-callback-err
      .then(() => this.processQueue());
    }

    this.queueProcessing = false;
    this.uppy.log('[ThumbnailGenerator] Emptied thumbnail queue');
    this.uppy.emit('thumbnail:all-generated');
  }

  requestThumbnail(file) {
    if (isPreviewSupported(file.type) && !file.isRemote) {
      return this.createThumbnail(file, this.opts.thumbnailWidth, this.opts.thumbnailHeight).then(preview => {
        this.setPreviewURL(file.id, preview);
        this.uppy.log(`[ThumbnailGenerator] Generated thumbnail for ${file.id}`);
        this.uppy.emit('thumbnail:generated', this.uppy.getFile(file.id), preview);
      }).catch(err => {
        this.uppy.log(`[ThumbnailGenerator] Failed thumbnail for ${file.id}:`, 'warning');
        this.uppy.log(err, 'warning');
        this.uppy.emit('thumbnail:error', this.uppy.getFile(file.id), err);
      });
    }

    return Promise.resolve();
  }

  install() {
    this.uppy.on('file-removed', this.onFileRemoved);
    this.uppy.on('cancel-all', this.onAllFilesRemoved);

    if (this.opts.lazy) {
      this.uppy.on('thumbnail:request', this.onFileAdded);
      this.uppy.on('thumbnail:cancel', this.onCancelRequest);
    } else {
      this.uppy.on('file-added', this.onFileAdded);
      this.uppy.on('restored', this.onRestored);
    }

    if (this.opts.waitForThumbnailsBeforeUpload) {
      this.uppy.addPreProcessor(this.waitUntilAllProcessed);
    }
  }

  uninstall() {
    this.uppy.off('file-removed', this.onFileRemoved);
    this.uppy.off('cancel-all', this.onAllFilesRemoved);

    if (this.opts.lazy) {
      this.uppy.off('thumbnail:request', this.onFileAdded);
      this.uppy.off('thumbnail:cancel', this.onCancelRequest);
    } else {
      this.uppy.off('file-added', this.onFileAdded);
      this.uppy.off('restored', this.onRestored);
    }

    if (this.opts.waitForThumbnailsBeforeUpload) {
      this.uppy.removePreProcessor(this.waitUntilAllProcessed);
    }
  }

}, _class.VERSION = "2.1.1", _temp);

/***/ }),

/***/ "./node_modules/@uppy/thumbnail-generator/lib/locale.js":
/*!**************************************************************!*\
  !*** ./node_modules/@uppy/thumbnail-generator/lib/locale.js ***!
  \**************************************************************/
/***/ ((module) => {

module.exports = {
  strings: {
    generatingThumbnails: 'Generating thumbnails...'
  }
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/AbortController.js":
/*!*********************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/AbortController.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports) => {

/**
 * Little AbortController proxy module so we can swap out the implementation easily later.
 */
exports.AbortController = globalThis.AbortController;
exports.AbortSignal = globalThis.AbortSignal;

exports.createAbortError = function (message) {
  if (message === void 0) {
    message = 'Aborted';
  }

  return new DOMException(message, 'AbortError');
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/ErrorWithCause.js":
/*!********************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/ErrorWithCause.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const hasProperty = __webpack_require__(/*! ./hasProperty */ "./node_modules/@uppy/utils/lib/hasProperty.js");

class ErrorWithCause extends Error {
  constructor(message, options) {
    if (options === void 0) {
      options = {};
    }

    super(message);
    this.cause = options.cause;

    if (this.cause && hasProperty(this.cause, 'isNetworkError')) {
      this.isNetworkError = this.cause.isNetworkError;
    }
  }

}

module.exports = ErrorWithCause;

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/EventTracker.js":
/*!******************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/EventTracker.js ***!
  \******************************************************/
/***/ ((module) => {

var _emitter, _events;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

/**
 * Create a wrapper around an event emitter with a `remove` method to remove
 * all events that were added using the wrapped emitter.
 */
module.exports = (_emitter = /*#__PURE__*/_classPrivateFieldLooseKey("emitter"), _events = /*#__PURE__*/_classPrivateFieldLooseKey("events"), class EventTracker {
  constructor(emitter) {
    Object.defineProperty(this, _emitter, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _events, {
      writable: true,
      value: []
    });
    _classPrivateFieldLooseBase(this, _emitter)[_emitter] = emitter;
  }

  on(event, fn) {
    _classPrivateFieldLooseBase(this, _events)[_events].push([event, fn]);

    return _classPrivateFieldLooseBase(this, _emitter)[_emitter].on(event, fn);
  }

  remove() {
    for (const [event, fn] of _classPrivateFieldLooseBase(this, _events)[_events].splice(0)) {
      _classPrivateFieldLooseBase(this, _emitter)[_emitter].off(event, fn);
    }
  }

});

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/FOCUSABLE_ELEMENTS.js":
/*!************************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/FOCUSABLE_ELEMENTS.js ***!
  \************************************************************/
/***/ ((module) => {

module.exports = ['a[href]:not([tabindex^="-"]):not([inert]):not([aria-hidden])', 'area[href]:not([tabindex^="-"]):not([inert]):not([aria-hidden])', 'input:not([disabled]):not([inert]):not([aria-hidden])', 'select:not([disabled]):not([inert]):not([aria-hidden])', 'textarea:not([disabled]):not([inert]):not([aria-hidden])', 'button:not([disabled]):not([inert]):not([aria-hidden])', 'iframe:not([tabindex^="-"]):not([inert]):not([aria-hidden])', 'object:not([tabindex^="-"]):not([inert]):not([aria-hidden])', 'embed:not([tabindex^="-"]):not([inert]):not([aria-hidden])', '[contenteditable]:not([tabindex^="-"]):not([inert]):not([aria-hidden])', '[tabindex]:not([tabindex^="-"]):not([inert]):not([aria-hidden])'];

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/NetworkError.js":
/*!******************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/NetworkError.js ***!
  \******************************************************/
/***/ ((module) => {

class NetworkError extends Error {
  constructor(error, xhr) {
    if (xhr === void 0) {
      xhr = null;
    }

    super(`This looks like a network error, the endpoint might be blocked by an internet provider or a firewall.`);
    this.cause = error;
    this.isNetworkError = true;
    this.request = xhr;
  }

}

module.exports = NetworkError;

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/RateLimitedQueue.js":
/*!**********************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/RateLimitedQueue.js ***!
  \**********************************************************/
/***/ ((module) => {

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

function createCancelError() {
  return new Error('Cancelled');
}

var _activeRequests = /*#__PURE__*/_classPrivateFieldLooseKey("activeRequests");

var _queuedHandlers = /*#__PURE__*/_classPrivateFieldLooseKey("queuedHandlers");

var _paused = /*#__PURE__*/_classPrivateFieldLooseKey("paused");

var _pauseTimer = /*#__PURE__*/_classPrivateFieldLooseKey("pauseTimer");

var _downLimit = /*#__PURE__*/_classPrivateFieldLooseKey("downLimit");

var _upperLimit = /*#__PURE__*/_classPrivateFieldLooseKey("upperLimit");

var _rateLimitingTimer = /*#__PURE__*/_classPrivateFieldLooseKey("rateLimitingTimer");

var _call = /*#__PURE__*/_classPrivateFieldLooseKey("call");

var _queueNext = /*#__PURE__*/_classPrivateFieldLooseKey("queueNext");

var _next = /*#__PURE__*/_classPrivateFieldLooseKey("next");

var _queue = /*#__PURE__*/_classPrivateFieldLooseKey("queue");

var _dequeue = /*#__PURE__*/_classPrivateFieldLooseKey("dequeue");

var _resume = /*#__PURE__*/_classPrivateFieldLooseKey("resume");

var _increaseLimit = /*#__PURE__*/_classPrivateFieldLooseKey("increaseLimit");

class RateLimitedQueue {
  constructor(limit) {
    Object.defineProperty(this, _dequeue, {
      value: _dequeue2
    });
    Object.defineProperty(this, _queue, {
      value: _queue2
    });
    Object.defineProperty(this, _next, {
      value: _next2
    });
    Object.defineProperty(this, _queueNext, {
      value: _queueNext2
    });
    Object.defineProperty(this, _call, {
      value: _call2
    });
    Object.defineProperty(this, _activeRequests, {
      writable: true,
      value: 0
    });
    Object.defineProperty(this, _queuedHandlers, {
      writable: true,
      value: []
    });
    Object.defineProperty(this, _paused, {
      writable: true,
      value: false
    });
    Object.defineProperty(this, _pauseTimer, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _downLimit, {
      writable: true,
      value: 1
    });
    Object.defineProperty(this, _upperLimit, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _rateLimitingTimer, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _resume, {
      writable: true,
      value: () => this.resume()
    });
    Object.defineProperty(this, _increaseLimit, {
      writable: true,
      value: () => {
        if (_classPrivateFieldLooseBase(this, _paused)[_paused]) {
          _classPrivateFieldLooseBase(this, _rateLimitingTimer)[_rateLimitingTimer] = setTimeout(_classPrivateFieldLooseBase(this, _increaseLimit)[_increaseLimit], 0);
          return;
        }

        _classPrivateFieldLooseBase(this, _downLimit)[_downLimit] = this.limit;
        this.limit = Math.ceil((_classPrivateFieldLooseBase(this, _upperLimit)[_upperLimit] + _classPrivateFieldLooseBase(this, _downLimit)[_downLimit]) / 2);

        for (let i = _classPrivateFieldLooseBase(this, _downLimit)[_downLimit]; i <= this.limit; i++) {
          _classPrivateFieldLooseBase(this, _queueNext)[_queueNext]();
        }

        if (_classPrivateFieldLooseBase(this, _upperLimit)[_upperLimit] - _classPrivateFieldLooseBase(this, _downLimit)[_downLimit] > 3) {
          _classPrivateFieldLooseBase(this, _rateLimitingTimer)[_rateLimitingTimer] = setTimeout(_classPrivateFieldLooseBase(this, _increaseLimit)[_increaseLimit], 2000);
        } else {
          _classPrivateFieldLooseBase(this, _downLimit)[_downLimit] = Math.floor(_classPrivateFieldLooseBase(this, _downLimit)[_downLimit] / 2);
        }
      }
    });

    if (typeof limit !== 'number' || limit === 0) {
      this.limit = Infinity;
    } else {
      this.limit = limit;
    }
  }

  run(fn, queueOptions) {
    if (!_classPrivateFieldLooseBase(this, _paused)[_paused] && _classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] < this.limit) {
      return _classPrivateFieldLooseBase(this, _call)[_call](fn);
    }

    return _classPrivateFieldLooseBase(this, _queue)[_queue](fn, queueOptions);
  }

  wrapPromiseFunction(fn, queueOptions) {
    var _this = this;

    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      let queuedRequest;
      const outerPromise = new Promise((resolve, reject) => {
        queuedRequest = _this.run(() => {
          let cancelError;
          let innerPromise;

          try {
            innerPromise = Promise.resolve(fn(...args));
          } catch (err) {
            innerPromise = Promise.reject(err);
          }

          innerPromise.then(result => {
            if (cancelError) {
              reject(cancelError);
            } else {
              queuedRequest.done();
              resolve(result);
            }
          }, err => {
            if (cancelError) {
              reject(cancelError);
            } else {
              queuedRequest.done();
              reject(err);
            }
          });
          return () => {
            cancelError = createCancelError();
          };
        }, queueOptions);
      });

      outerPromise.abort = () => {
        queuedRequest.abort();
      };

      return outerPromise;
    };
  }

  resume() {
    _classPrivateFieldLooseBase(this, _paused)[_paused] = false;
    clearTimeout(_classPrivateFieldLooseBase(this, _pauseTimer)[_pauseTimer]);

    for (let i = 0; i < this.limit; i++) {
      _classPrivateFieldLooseBase(this, _queueNext)[_queueNext]();
    }
  }

  /**
   * Freezes the queue for a while or indefinitely.
   *
   * @param {number | null } [duration] Duration for the pause to happen, in milliseconds.
   *                                    If omitted, the queue won't resume automatically.
   */
  pause(duration) {
    if (duration === void 0) {
      duration = null;
    }

    _classPrivateFieldLooseBase(this, _paused)[_paused] = true;
    clearTimeout(_classPrivateFieldLooseBase(this, _pauseTimer)[_pauseTimer]);

    if (duration != null) {
      _classPrivateFieldLooseBase(this, _pauseTimer)[_pauseTimer] = setTimeout(_classPrivateFieldLooseBase(this, _resume)[_resume], duration);
    }
  }
  /**
   * Pauses the queue for a duration, and lower the limit of concurrent requests
   * when the queue resumes. When the queue resumes, it tries to progressively
   * increase the limit in `this.#increaseLimit` until another call is made to
   * `this.rateLimit`.
   * Call this function when using the RateLimitedQueue for network requests and
   * the remote server responds with 429 HTTP code.
   *
   * @param {number} duration in milliseconds.
   */


  rateLimit(duration) {
    clearTimeout(_classPrivateFieldLooseBase(this, _rateLimitingTimer)[_rateLimitingTimer]);
    this.pause(duration);

    if (this.limit > 1 && Number.isFinite(this.limit)) {
      _classPrivateFieldLooseBase(this, _upperLimit)[_upperLimit] = this.limit - 1;
      this.limit = _classPrivateFieldLooseBase(this, _downLimit)[_downLimit];
      _classPrivateFieldLooseBase(this, _rateLimitingTimer)[_rateLimitingTimer] = setTimeout(_classPrivateFieldLooseBase(this, _increaseLimit)[_increaseLimit], duration);
    }
  }

  get isPaused() {
    return _classPrivateFieldLooseBase(this, _paused)[_paused];
  }

}

function _call2(fn) {
  _classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] += 1;
  let done = false;
  let cancelActive;

  try {
    cancelActive = fn();
  } catch (err) {
    _classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] -= 1;
    throw err;
  }

  return {
    abort: () => {
      if (done) return;
      done = true;
      _classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] -= 1;
      cancelActive();

      _classPrivateFieldLooseBase(this, _queueNext)[_queueNext]();
    },
    done: () => {
      if (done) return;
      done = true;
      _classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] -= 1;

      _classPrivateFieldLooseBase(this, _queueNext)[_queueNext]();
    }
  };
}

function _queueNext2() {
  // Do it soon but not immediately, this allows clearing out the entire queue synchronously
  // one by one without continuously _advancing_ it (and starting new tasks before immediately
  // aborting them)
  queueMicrotask(() => _classPrivateFieldLooseBase(this, _next)[_next]());
}

function _next2() {
  if (_classPrivateFieldLooseBase(this, _paused)[_paused] || _classPrivateFieldLooseBase(this, _activeRequests)[_activeRequests] >= this.limit) {
    return;
  }

  if (_classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].length === 0) {
    return;
  } // Dispatch the next request, and update the abort/done handlers
  // so that cancelling it does the Right Thing (and doesn't just try
  // to dequeue an already-running request).


  const next = _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].shift();

  const handler = _classPrivateFieldLooseBase(this, _call)[_call](next.fn);

  next.abort = handler.abort;
  next.done = handler.done;
}

function _queue2(fn, options) {
  if (options === void 0) {
    options = {};
  }

  const handler = {
    fn,
    priority: options.priority || 0,
    abort: () => {
      _classPrivateFieldLooseBase(this, _dequeue)[_dequeue](handler);
    },
    done: () => {
      throw new Error('Cannot mark a queued request as done: this indicates a bug');
    }
  };

  const index = _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].findIndex(other => {
    return handler.priority > other.priority;
  });

  if (index === -1) {
    _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].push(handler);
  } else {
    _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].splice(index, 0, handler);
  }

  return handler;
}

function _dequeue2(handler) {
  const index = _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].indexOf(handler);

  if (index !== -1) {
    _classPrivateFieldLooseBase(this, _queuedHandlers)[_queuedHandlers].splice(index, 1);
  }
}

module.exports = {
  RateLimitedQueue,
  internalRateLimitedQueue: Symbol('__queue')
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/Translator.js":
/*!****************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/Translator.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _apply;

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const has = __webpack_require__(/*! ./hasProperty */ "./node_modules/@uppy/utils/lib/hasProperty.js");

function insertReplacement(source, rx, replacement) {
  const newParts = [];
  source.forEach(chunk => {
    // When the source contains multiple placeholders for interpolation,
    // we should ignore chunks that are not strings, because those
    // can be JSX objects and will be otherwise incorrectly turned into strings.
    // Without this condition we’d get this: [object Object] hello [object Object] my <button>
    if (typeof chunk !== 'string') {
      return newParts.push(chunk);
    }

    return rx[Symbol.split](chunk).forEach((raw, i, list) => {
      if (raw !== '') {
        newParts.push(raw);
      } // Interlace with the `replacement` value


      if (i < list.length - 1) {
        newParts.push(replacement);
      }
    });
  });
  return newParts;
}
/**
 * Takes a string with placeholder variables like `%{smart_count} file selected`
 * and replaces it with values from options `{smart_count: 5}`
 *
 * @license https://github.com/airbnb/polyglot.js/blob/master/LICENSE
 * taken from https://github.com/airbnb/polyglot.js/blob/master/lib/polyglot.js#L299
 *
 * @param {string} phrase that needs interpolation, with placeholders
 * @param {object} options with values that will be used to replace placeholders
 * @returns {any[]} interpolated
 */


function interpolate(phrase, options) {
  const dollarRegex = /\$/g;
  const dollarBillsYall = '$$$$';
  let interpolated = [phrase];
  if (options == null) return interpolated;

  for (const arg of Object.keys(options)) {
    if (arg !== '_') {
      // Ensure replacement value is escaped to prevent special $-prefixed
      // regex replace tokens. the "$$$$" is needed because each "$" needs to
      // be escaped with "$" itself, and we need two in the resulting output.
      let replacement = options[arg];

      if (typeof replacement === 'string') {
        replacement = dollarRegex[Symbol.replace](replacement, dollarBillsYall);
      } // We create a new `RegExp` each time instead of using a more-efficient
      // string replace so that the same argument can be replaced multiple times
      // in the same phrase.


      interpolated = insertReplacement(interpolated, new RegExp(`%\\{${arg}\\}`, 'g'), replacement);
    }
  }

  return interpolated;
}
/**
 * Translates strings with interpolation & pluralization support.
 * Extensible with custom dictionaries and pluralization functions.
 *
 * Borrows heavily from and inspired by Polyglot https://github.com/airbnb/polyglot.js,
 * basically a stripped-down version of it. Differences: pluralization functions are not hardcoded
 * and can be easily added among with dictionaries, nested objects are used for pluralization
 * as opposed to `||||` delimeter
 *
 * Usage example: `translator.translate('files_chosen', {smart_count: 3})`
 */


module.exports = (_apply = /*#__PURE__*/_classPrivateFieldLooseKey("apply"), class Translator {
  /**
   * @param {object|Array<object>} locales - locale or list of locales.
   */
  constructor(locales) {
    Object.defineProperty(this, _apply, {
      value: _apply2
    });
    this.locale = {
      strings: {},

      pluralize(n) {
        if (n === 1) {
          return 0;
        }

        return 1;
      }

    };

    if (Array.isArray(locales)) {
      locales.forEach(_classPrivateFieldLooseBase(this, _apply)[_apply], this);
    } else {
      _classPrivateFieldLooseBase(this, _apply)[_apply](locales);
    }
  }

  /**
   * Public translate method
   *
   * @param {string} key
   * @param {object} options with values that will be used later to replace placeholders in string
   * @returns {string} translated (and interpolated)
   */
  translate(key, options) {
    return this.translateArray(key, options).join('');
  }
  /**
   * Get a translation and return the translated and interpolated parts as an array.
   *
   * @param {string} key
   * @param {object} options with values that will be used to replace placeholders
   * @returns {Array} The translated and interpolated parts, in order.
   */


  translateArray(key, options) {
    if (!has(this.locale.strings, key)) {
      throw new Error(`missing string: ${key}`);
    }

    const string = this.locale.strings[key];
    const hasPluralForms = typeof string === 'object';

    if (hasPluralForms) {
      if (options && typeof options.smart_count !== 'undefined') {
        const plural = this.locale.pluralize(options.smart_count);
        return interpolate(string[plural], options);
      }

      throw new Error('Attempted to use a string with plural forms, but no value was given for %{smart_count}');
    }

    return interpolate(string, options);
  }

});

function _apply2(locale) {
  if (!(locale != null && locale.strings)) {
    return;
  }

  const prevLocale = this.locale;
  this.locale = { ...prevLocale,
    strings: { ...prevLocale.strings,
      ...locale.strings
    }
  };
  this.locale.pluralize = locale.pluralize || prevLocale.pluralize;
}

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/canvasToBlob.js":
/*!******************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/canvasToBlob.js ***!
  \******************************************************/
/***/ ((module) => {

/**
 * Save a <canvas> element's content to a Blob object.
 *
 * @param {HTMLCanvasElement} canvas
 * @returns {Promise}
 */
module.exports = function canvasToBlob(canvas, type, quality) {
  return new Promise(resolve => {
    canvas.toBlob(resolve, type, quality);
  });
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/dataURItoBlob.js":
/*!*******************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/dataURItoBlob.js ***!
  \*******************************************************/
/***/ ((module) => {

const DATA_URL_PATTERN = /^data:([^/]+\/[^,;]+(?:[^,]*?))(;base64)?,([\s\S]*)$/;

module.exports = function dataURItoBlob(dataURI, opts, toFile) {
  var _ref, _opts$mimeType;

  // get the base64 data
  const dataURIData = DATA_URL_PATTERN.exec(dataURI); // user may provide mime type, if not get it from data URI

  const mimeType = (_ref = (_opts$mimeType = opts.mimeType) != null ? _opts$mimeType : dataURIData == null ? void 0 : dataURIData[1]) != null ? _ref : 'plain/text';
  let data;

  if (dataURIData[2] != null) {
    const binary = atob(decodeURIComponent(dataURIData[3]));
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    data = [bytes];
  } else {
    data = [decodeURIComponent(dataURIData[3])];
  } // Convert to a File?


  if (toFile) {
    return new File(data, opts.name || '', {
      type: mimeType
    });
  }

  return new Blob(data, {
    type: mimeType
  });
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/delay.js":
/*!***********************************************!*\
  !*** ./node_modules/@uppy/utils/lib/delay.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  createAbortError
} = __webpack_require__(/*! ./AbortController */ "./node_modules/@uppy/utils/lib/AbortController.js");
/**
 * Return a Promise that resolves after `ms` milliseconds.
 *
 * @param {number} ms - Number of milliseconds to wait.
 * @param {{ signal?: AbortSignal }} [opts] - An abort signal that can be used to cancel the delay early.
 * @returns {Promise<void>} A Promise that resolves after the given amount of `ms`.
 */


module.exports = function delay(ms, opts) {
  return new Promise((resolve, reject) => {
    var _opts$signal, _opts$signal2;

    if (opts != null && (_opts$signal = opts.signal) != null && _opts$signal.aborted) {
      return reject(createAbortError());
    }

    const timeout = setTimeout(() => {
      cleanup(); // eslint-disable-line no-use-before-define

      resolve();
    }, ms);

    function onabort() {
      clearTimeout(timeout);
      cleanup(); // eslint-disable-line no-use-before-define

      reject(createAbortError());
    }

    opts == null ? void 0 : (_opts$signal2 = opts.signal) == null ? void 0 : _opts$signal2.addEventListener('abort', onabort);

    function cleanup() {
      var _opts$signal3;

      opts == null ? void 0 : (_opts$signal3 = opts.signal) == null ? void 0 : _opts$signal3.removeEventListener('abort', onabort);
    }

    return undefined;
  });
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/emitSocketProgress.js":
/*!************************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/emitSocketProgress.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const throttle = __webpack_require__(/*! lodash.throttle */ "./node_modules/lodash.throttle/index.js");

function emitSocketProgress(uploader, progressData, file) {
  const {
    progress,
    bytesUploaded,
    bytesTotal
  } = progressData;

  if (progress) {
    uploader.uppy.log(`Upload progress: ${progress}`);
    uploader.uppy.emit('upload-progress', file, {
      uploader,
      bytesUploaded,
      bytesTotal
    });
  }
}

module.exports = throttle(emitSocketProgress, 300, {
  leading: true,
  trailing: true
});

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/fetchWithNetworkError.js":
/*!***************************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/fetchWithNetworkError.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const NetworkError = __webpack_require__(/*! ./NetworkError */ "./node_modules/@uppy/utils/lib/NetworkError.js");
/**
 * Wrapper around window.fetch that throws a NetworkError when appropriate
 */


module.exports = function fetchWithNetworkError() {
  return fetch(...arguments).catch(err => {
    if (err.name === 'AbortError') {
      throw err;
    } else {
      throw new NetworkError(err);
    }
  });
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/findAllDOMElements.js":
/*!************************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/findAllDOMElements.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const isDOMElement = __webpack_require__(/*! ./isDOMElement */ "./node_modules/@uppy/utils/lib/isDOMElement.js");
/**
 * Find one or more DOM elements.
 *
 * @param {string|Node} element
 * @returns {Node[]|null}
 */


module.exports = function findAllDOMElements(element) {
  if (typeof element === 'string') {
    const elements = document.querySelectorAll(element);
    return elements.length === 0 ? null : Array.from(elements);
  }

  if (typeof element === 'object' && isDOMElement(element)) {
    return [element];
  }

  return null;
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/findDOMElement.js":
/*!********************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/findDOMElement.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const isDOMElement = __webpack_require__(/*! ./isDOMElement */ "./node_modules/@uppy/utils/lib/isDOMElement.js");
/**
 * Find a DOM element.
 *
 * @param {Node|string} element
 * @returns {Node|null}
 */


module.exports = function findDOMElement(element, context) {
  if (context === void 0) {
    context = document;
  }

  if (typeof element === 'string') {
    return context.querySelector(element);
  }

  if (isDOMElement(element)) {
    return element;
  }

  return null;
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/generateFileID.js":
/*!********************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/generateFileID.js ***!
  \********************************************************/
/***/ ((module) => {

function encodeCharacter(character) {
  return character.charCodeAt(0).toString(32);
}

function encodeFilename(name) {
  let suffix = '';
  return name.replace(/[^A-Z0-9]/ig, character => {
    suffix += `-${encodeCharacter(character)}`;
    return '/';
  }) + suffix;
}
/**
 * Takes a file object and turns it into fileID, by converting file.name to lowercase,
 * removing extra characters and adding type, size and lastModified
 *
 * @param {object} file
 * @returns {string} the fileID
 */


module.exports = function generateFileID(file) {
  // It's tempting to do `[items].filter(Boolean).join('-')` here, but that
  // is slower! simple string concatenation is fast
  let id = 'uppy';

  if (typeof file.name === 'string') {
    id += `-${encodeFilename(file.name.toLowerCase())}`;
  }

  if (file.type !== undefined) {
    id += `-${file.type}`;
  }

  if (file.meta && typeof file.meta.relativePath === 'string') {
    id += `-${encodeFilename(file.meta.relativePath.toLowerCase())}`;
  }

  if (file.data.size !== undefined) {
    id += `-${file.data.size}`;
  }

  if (file.data.lastModified !== undefined) {
    id += `-${file.data.lastModified}`;
  }

  return id;
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/getBytesRemaining.js":
/*!***********************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/getBytesRemaining.js ***!
  \***********************************************************/
/***/ ((module) => {

module.exports = function getBytesRemaining(fileProgress) {
  return fileProgress.bytesTotal - fileProgress.bytesUploaded;
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/getDroppedFiles/index.js":
/*!***************************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/getDroppedFiles/index.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const webkitGetAsEntryApi = __webpack_require__(/*! ./utils/webkitGetAsEntryApi/index */ "./node_modules/@uppy/utils/lib/getDroppedFiles/utils/webkitGetAsEntryApi/index.js");

const fallbackApi = __webpack_require__(/*! ./utils/fallbackApi */ "./node_modules/@uppy/utils/lib/getDroppedFiles/utils/fallbackApi.js");
/**
 * Returns a promise that resolves to the array of dropped files (if a folder is
 * dropped, and browser supports folder parsing - promise resolves to the flat
 * array of all files in all directories).
 * Each file has .relativePath prop appended to it (e.g. "/docs/Prague/ticket_from_prague_to_ufa.pdf")
 * if browser supports it. Otherwise it's undefined.
 *
 * @param {DataTransfer} dataTransfer
 * @param {Function} logDropError - a function that's called every time some
 * folder or some file error out (e.g. because of the folder name being too long
 * on Windows). Notice that resulting promise will always be resolved anyway.
 *
 * @returns {Promise} - Array<File>
 */


module.exports = function getDroppedFiles(dataTransfer, _temp) {
  var _dataTransfer$items;

  let {
    logDropError = () => {}
  } = _temp === void 0 ? {} : _temp;

  // Get all files from all subdirs. Works (at least) in Chrome, Mozilla, and Safari
  if ((_dataTransfer$items = dataTransfer.items) != null && _dataTransfer$items[0] && 'webkitGetAsEntry' in dataTransfer.items[0]) {
    return webkitGetAsEntryApi(dataTransfer, logDropError); // Otherwise just return all first-order files
  }

  return fallbackApi(dataTransfer);
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/getDroppedFiles/utils/fallbackApi.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/getDroppedFiles/utils/fallbackApi.js ***!
  \***************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const toArray = __webpack_require__(/*! ../../toArray */ "./node_modules/@uppy/utils/lib/toArray.js"); // .files fallback, should be implemented in any browser


module.exports = function fallbackApi(dataTransfer) {
  const files = toArray(dataTransfer.files);
  return Promise.resolve(files);
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/getDroppedFiles/utils/webkitGetAsEntryApi/getFilesAndDirectoriesFromDirectory.js":
/*!***********************************************************************************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/getDroppedFiles/utils/webkitGetAsEntryApi/getFilesAndDirectoriesFromDirectory.js ***!
  \***********************************************************************************************************************/
/***/ ((module) => {

/**
 * Recursive function, calls the original callback() when the directory is entirely parsed.
 *
 * @param {FileSystemDirectoryReader} directoryReader
 * @param {Array} oldEntries
 * @param {Function} logDropError
 * @param {Function} callback - called with ([ all files and directories in that directoryReader ])
 */
module.exports = function getFilesAndDirectoriesFromDirectory(directoryReader, oldEntries, logDropError, _ref) {
  let {
    onSuccess
  } = _ref;
  directoryReader.readEntries(entries => {
    const newEntries = [...oldEntries, ...entries]; // According to the FileSystem API spec, getFilesAndDirectoriesFromDirectory()
    // must be called until it calls the onSuccess with an empty array.

    if (entries.length) {
      setTimeout(() => {
        getFilesAndDirectoriesFromDirectory(directoryReader, newEntries, logDropError, {
          onSuccess
        });
      }, 0); // Done iterating this particular directory
    } else {
      onSuccess(newEntries);
    }
  }, // Make sure we resolve on error anyway, it's fine if only one directory couldn't be parsed!
  error => {
    logDropError(error);
    onSuccess(oldEntries);
  });
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/getDroppedFiles/utils/webkitGetAsEntryApi/getRelativePath.js":
/*!***************************************************************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/getDroppedFiles/utils/webkitGetAsEntryApi/getRelativePath.js ***!
  \***************************************************************************************************/
/***/ ((module) => {

/**
 * Get the relative path from the FileEntry#fullPath, because File#webkitRelativePath is always '', at least onDrop.
 *
 * @param {FileEntry} fileEntry
 *
 * @returns {string|null} - if file is not in a folder - return null (this is to
 * be consistent with .relativePath-s of files selected from My Device). If file
 * is in a folder - return its fullPath, e.g. '/simpsons/hi.jpeg'.
 */
module.exports = function getRelativePath(fileEntry) {
  // fileEntry.fullPath - "/simpsons/hi.jpeg" or undefined (for browsers that don't support it)
  // fileEntry.name - "hi.jpeg"
  if (!fileEntry.fullPath || fileEntry.fullPath === `/${fileEntry.name}`) {
    return null;
  }

  return fileEntry.fullPath;
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/getDroppedFiles/utils/webkitGetAsEntryApi/index.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/getDroppedFiles/utils/webkitGetAsEntryApi/index.js ***!
  \*****************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const toArray = __webpack_require__(/*! ../../../toArray */ "./node_modules/@uppy/utils/lib/toArray.js");

const getRelativePath = __webpack_require__(/*! ./getRelativePath */ "./node_modules/@uppy/utils/lib/getDroppedFiles/utils/webkitGetAsEntryApi/getRelativePath.js");

const getFilesAndDirectoriesFromDirectory = __webpack_require__(/*! ./getFilesAndDirectoriesFromDirectory */ "./node_modules/@uppy/utils/lib/getDroppedFiles/utils/webkitGetAsEntryApi/getFilesAndDirectoriesFromDirectory.js");

module.exports = function webkitGetAsEntryApi(dataTransfer, logDropError) {
  const files = [];
  const rootPromises = [];
  /**
   * Returns a resolved promise, when :files array is enhanced
   *
   * @param {(FileSystemFileEntry|FileSystemDirectoryEntry)} entry
   * @returns {Promise} - empty promise that resolves when :files is enhanced with a file
   */

  const createPromiseToAddFileOrParseDirectory = entry => new Promise(resolve => {
    // This is a base call
    if (entry.isFile) {
      // Creates a new File object which can be used to read the file.
      entry.file(file => {
        // eslint-disable-next-line no-param-reassign
        file.relativePath = getRelativePath(entry);
        files.push(file);
        resolve();
      }, // Make sure we resolve on error anyway, it's fine if only one file couldn't be read!
      error => {
        logDropError(error);
        resolve();
      }); // This is a recursive call
    } else if (entry.isDirectory) {
      const directoryReader = entry.createReader();
      getFilesAndDirectoriesFromDirectory(directoryReader, [], logDropError, {
        onSuccess: entries => resolve(Promise.all(entries.map(createPromiseToAddFileOrParseDirectory)))
      });
    }
  }); // For each dropped item, - make sure it's a file/directory, and start deepening in!


  toArray(dataTransfer.items).forEach(item => {
    const entry = item.webkitGetAsEntry(); // :entry can be null when we drop the url e.g.

    if (entry) {
      rootPromises.push(createPromiseToAddFileOrParseDirectory(entry));
    }
  });
  return Promise.all(rootPromises).then(() => files);
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/getFileNameAndExtension.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/getFileNameAndExtension.js ***!
  \*****************************************************************/
/***/ ((module) => {

/**
 * Takes a full filename string and returns an object {name, extension}
 *
 * @param {string} fullFileName
 * @returns {object} {name, extension}
 */
module.exports = function getFileNameAndExtension(fullFileName) {
  const lastDot = fullFileName.lastIndexOf('.'); // these count as no extension: "no-dot", "trailing-dot."

  if (lastDot === -1 || lastDot === fullFileName.length - 1) {
    return {
      name: fullFileName,
      extension: undefined
    };
  }

  return {
    name: fullFileName.slice(0, lastDot),
    extension: fullFileName.slice(lastDot + 1)
  };
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/getFileType.js":
/*!*****************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/getFileType.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const getFileNameAndExtension = __webpack_require__(/*! ./getFileNameAndExtension */ "./node_modules/@uppy/utils/lib/getFileNameAndExtension.js");

const mimeTypes = __webpack_require__(/*! ./mimeTypes */ "./node_modules/@uppy/utils/lib/mimeTypes.js");

module.exports = function getFileType(file) {
  var _getFileNameAndExtens;

  if (file.type) return file.type;
  const fileExtension = file.name ? (_getFileNameAndExtens = getFileNameAndExtension(file.name).extension) == null ? void 0 : _getFileNameAndExtens.toLowerCase() : null;

  if (fileExtension && fileExtension in mimeTypes) {
    // else, see if we can map extension to a mime type
    return mimeTypes[fileExtension];
  } // if all fails, fall back to a generic byte stream type


  return 'application/octet-stream';
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/getFileTypeExtension.js":
/*!**************************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/getFileTypeExtension.js ***!
  \**************************************************************/
/***/ ((module) => {

const mimeToExtensions = {
  'audio/mp3': 'mp3',
  'audio/mp4': 'mp4',
  'audio/ogg': 'ogg',
  'audio/webm': 'webm',
  'image/gif': 'gif',
  'image/heic': 'heic',
  'image/heif': 'heif',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/svg+xml': 'svg',
  'video/mp4': 'mp4',
  'video/ogg': 'ogv',
  'video/quicktime': 'mov',
  'video/webm': 'webm',
  'video/x-matroska': 'mkv',
  'video/x-msvideo': 'avi'
};

module.exports = function getFileTypeExtension(mimeType) {
  // Remove the ; bit in 'video/x-matroska;codecs=avc1'
  // eslint-disable-next-line no-param-reassign
  [mimeType] = mimeType.split(';', 1);
  return mimeToExtensions[mimeType] || null;
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/getSocketHost.js":
/*!*******************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/getSocketHost.js ***!
  \*******************************************************/
/***/ ((module) => {

module.exports = function getSocketHost(url) {
  // get the host domain
  const regex = /^(?:https?:\/\/|\/\/)?(?:[^@\n]+@)?(?:www\.)?([^\n]+)/i;
  const host = regex.exec(url)[1];
  const socketProtocol = /^http:\/\//i.test(url) ? 'ws' : 'wss';
  return `${socketProtocol}://${host}`;
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/getSpeed.js":
/*!**************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/getSpeed.js ***!
  \**************************************************/
/***/ ((module) => {

module.exports = function getSpeed(fileProgress) {
  if (!fileProgress.bytesUploaded) return 0;
  const timeElapsed = Date.now() - fileProgress.uploadStarted;
  const uploadSpeed = fileProgress.bytesUploaded / (timeElapsed / 1000);
  return uploadSpeed;
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/getTextDirection.js":
/*!**********************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/getTextDirection.js ***!
  \**********************************************************/
/***/ ((module) => {

/**
 * Get the declared text direction for an element.
 *
 * @param {Node} element
 * @returns {string|undefined}
 */
function getTextDirection(element) {
  var _element;

  // There is another way to determine text direction using getComputedStyle(), as done here:
  // https://github.com/pencil-js/text-direction/blob/2a235ce95089b3185acec3b51313cbba921b3811/text-direction.js
  //
  // We do not use that approach because we are interested specifically in the _declared_ text direction.
  // If no text direction is declared, we have to provide our own explicit text direction so our
  // bidirectional CSS style sheets work.
  while (element && !element.dir) {
    // eslint-disable-next-line no-param-reassign
    element = element.parentNode;
  }

  return (_element = element) == null ? void 0 : _element.dir;
}

module.exports = getTextDirection;

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/getTimeStamp.js":
/*!******************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/getTimeStamp.js ***!
  \******************************************************/
/***/ ((module) => {

/**
 * Adds zero to strings shorter than two characters.
 *
 * @param {number} number
 * @returns {string}
 */
function pad(number) {
  return number < 10 ? `0${number}` : number.toString();
}
/**
 * Returns a timestamp in the format of `hours:minutes:seconds`
 */


module.exports = function getTimeStamp() {
  const date = new Date();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${hours}:${minutes}:${seconds}`;
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/hasProperty.js":
/*!*****************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/hasProperty.js ***!
  \*****************************************************/
/***/ ((module) => {

module.exports = function has(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/isDOMElement.js":
/*!******************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/isDOMElement.js ***!
  \******************************************************/
/***/ ((module) => {

/**
 * Check if an object is a DOM element. Duck-typing based on `nodeType`.
 *
 * @param {*} obj
 */
module.exports = function isDOMElement(obj) {
  return (obj == null ? void 0 : obj.nodeType) === Node.ELEMENT_NODE;
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/isDragDropSupported.js":
/*!*************************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/isDragDropSupported.js ***!
  \*************************************************************/
/***/ ((module) => {

/**
 * Checks if the browser supports Drag & Drop (not supported on mobile devices, for example).
 *
 * @returns {boolean}
 */
module.exports = function isDragDropSupported() {
  const div = document.body;

  if (!('draggable' in div) || !('ondragstart' in div && 'ondrop' in div)) {
    return false;
  }

  if (!('FormData' in window)) {
    return false;
  }

  if (!('FileReader' in window)) {
    return false;
  }

  return true;
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/isObjectURL.js":
/*!*****************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/isObjectURL.js ***!
  \*****************************************************/
/***/ ((module) => {

/**
 * Check if a URL string is an object URL from `URL.createObjectURL`.
 *
 * @param {string} url
 * @returns {boolean}
 */
module.exports = function isObjectURL(url) {
  return url.startsWith('blob:');
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/isPreviewSupported.js":
/*!************************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/isPreviewSupported.js ***!
  \************************************************************/
/***/ ((module) => {

module.exports = function isPreviewSupported(fileType) {
  if (!fileType) return false; // list of images that browsers can preview

  return /^[^/]+\/(jpe?g|gif|png|svg|svg\+xml|bmp|webp|avif)$/.test(fileType);
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/mimeTypes.js":
/*!***************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/mimeTypes.js ***!
  \***************************************************/
/***/ ((module) => {

// ___Why not add the mime-types package?
//    It's 19.7kB gzipped, and we only need mime types for well-known extensions (for file previews).
// ___Where to take new extensions from?
//    https://github.com/jshttp/mime-db/blob/master/db.json
module.exports = {
  md: 'text/markdown',
  markdown: 'text/markdown',
  mp4: 'video/mp4',
  mp3: 'audio/mp3',
  svg: 'image/svg+xml',
  jpg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  heic: 'image/heic',
  heif: 'image/heif',
  yaml: 'text/yaml',
  yml: 'text/yaml',
  csv: 'text/csv',
  tsv: 'text/tab-separated-values',
  tab: 'text/tab-separated-values',
  avi: 'video/x-msvideo',
  mks: 'video/x-matroska',
  mkv: 'video/x-matroska',
  mov: 'video/quicktime',
  dicom: 'application/dicom',
  doc: 'application/msword',
  docm: 'application/vnd.ms-word.document.macroenabled.12',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  dot: 'application/msword',
  dotm: 'application/vnd.ms-word.template.macroenabled.12',
  dotx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
  xla: 'application/vnd.ms-excel',
  xlam: 'application/vnd.ms-excel.addin.macroenabled.12',
  xlc: 'application/vnd.ms-excel',
  xlf: 'application/x-xliff+xml',
  xlm: 'application/vnd.ms-excel',
  xls: 'application/vnd.ms-excel',
  xlsb: 'application/vnd.ms-excel.sheet.binary.macroenabled.12',
  xlsm: 'application/vnd.ms-excel.sheet.macroenabled.12',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xlt: 'application/vnd.ms-excel',
  xltm: 'application/vnd.ms-excel.template.macroenabled.12',
  xltx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
  xlw: 'application/vnd.ms-excel',
  txt: 'text/plain',
  text: 'text/plain',
  conf: 'text/plain',
  log: 'text/plain',
  pdf: 'application/pdf',
  zip: 'application/zip',
  '7z': 'application/x-7z-compressed',
  rar: 'application/x-rar-compressed',
  tar: 'application/x-tar',
  gz: 'application/gzip',
  dmg: 'application/x-apple-diskimage'
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/prettyETA.js":
/*!***************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/prettyETA.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const secondsToTime = __webpack_require__(/*! ./secondsToTime */ "./node_modules/@uppy/utils/lib/secondsToTime.js");

module.exports = function prettyETA(seconds) {
  const time = secondsToTime(seconds); // Only display hours and minutes if they are greater than 0 but always
  // display minutes if hours is being displayed
  // Display a leading zero if the there is a preceding unit: 1m 05s, but 5s

  const hoursStr = time.hours === 0 ? '' : `${time.hours}h`;
  const minutesStr = time.minutes === 0 ? '' : `${time.hours === 0 ? time.minutes : ` ${time.minutes.toString(10).padStart(2, '0')}`}m`;
  const secondsStr = time.hours !== 0 ? '' : `${time.minutes === 0 ? time.seconds : ` ${time.seconds.toString(10).padStart(2, '0')}`}s`;
  return `${hoursStr}${minutesStr}${secondsStr}`;
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/secondsToTime.js":
/*!*******************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/secondsToTime.js ***!
  \*******************************************************/
/***/ ((module) => {

module.exports = function secondsToTime(rawSeconds) {
  const hours = Math.floor(rawSeconds / 3600) % 24;
  const minutes = Math.floor(rawSeconds / 60) % 60;
  const seconds = Math.floor(rawSeconds % 60);
  return {
    hours,
    minutes,
    seconds
  };
};

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/toArray.js":
/*!*************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/toArray.js ***!
  \*************************************************/
/***/ ((module) => {

/**
 * Converts list into array
 */
module.exports = Array.from;

/***/ }),

/***/ "./node_modules/@uppy/utils/lib/truncateString.js":
/*!********************************************************!*\
  !*** ./node_modules/@uppy/utils/lib/truncateString.js ***!
  \********************************************************/
/***/ ((module) => {

/**
 * Truncates a string to the given number of chars (maxLength) by inserting '...' in the middle of that string.
 * Partially taken from https://stackoverflow.com/a/5723274/3192470.
 *
 * @param {string} string - string to be truncated
 * @param {number} maxLength - maximum size of the resulting string
 * @returns {string}
 */
const separator = '...';

module.exports = function truncateString(string, maxLength) {
  // Return the empty string if maxLength is zero
  if (maxLength === 0) return ''; // Return original string if it's already shorter than maxLength

  if (string.length <= maxLength) return string; // Return truncated substring appended of the ellipsis char if string can't be meaningfully truncated

  if (maxLength <= separator.length + 1) return `${string.slice(0, maxLength - 1)}…`;
  const charsToShow = maxLength - separator.length;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return string.slice(0, frontChars) + separator + string.slice(-backChars);
};

/***/ }),

/***/ "./node_modules/@uppy/vue/lib/dashboard-modal.js":
/*!*******************************************************!*\
  !*** ./node_modules/@uppy/vue/lib/dashboard-modal.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _uppy_dashboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @uppy/dashboard */ "./node_modules/@uppy/dashboard/lib/index.js");
/* harmony import */ var _uppy_dashboard__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_uppy_dashboard__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var shallow_equal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! shallow-equal */ "./node_modules/shallow-equal/dist/index.esm.js");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue */ "vue");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils.js */ "./node_modules/@uppy/vue/lib/utils.js");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data() {
    return {
      plugin: {}
    };
  },

  props: {
    uppy: {
      required: true
    },
    props: {
      type: Object
    },
    plugins: {
      type: Array
    },
    open: {
      type: Boolean,
      required: true
    }
  },

  mounted() {
    this.installPlugin();
  },

  methods: {
    installPlugin() {
      const {
        uppy
      } = this;
      const options = {
        id: 'vue:DashboardModal',
        plugins: this.plugins,
        ...this.props,
        target: this.$refs.container
      };
      uppy.use((_uppy_dashboard__WEBPACK_IMPORTED_MODULE_0___default()), options);
      this.plugin = uppy.getPlugin(options.id);

      if (this.open) {
        this.plugin.openModal();
      }
    },

    uninstallPlugin(uppy) {
      uppy.removePlugin(this.plugin);
    }

  },

  beforeDestroy() {
    this.uninstallPlugin(this.uppy);
  },

  beforeUnmount() {
    this.uninstallPlugin(this.uppy);
  },

  watch: {
    uppy(current, old) {
      if (old !== current) {
        this.uninstallPlugin(old);
        this.installPlugin();
      }
    },

    open(current, old) {
      if (current && !old) {
        this.plugin.openModal();
      }

      if (!current && old) {
        this.plugin.closeModal();
      }
    },

    props(current, old) {
      if (!(0,shallow_equal__WEBPACK_IMPORTED_MODULE_1__.shallowEqualObjects)(current, old)) {
        this.plugin.setOptions({ ...current
        });
      }
    }

  },

  render() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    // Hack to allow support for Vue 2 and 3
    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isVue2)(...args)) {
      // If it's first argument is a function, then it's a Vue 2 App
      const [createElement] = args;
      return createElement('div', {
        ref: 'container'
      });
    } // Otherwise, we use the `h` function from the Vue package (in Vue 3 fashion)


    return vue__WEBPACK_IMPORTED_MODULE_2__.h('div', {
      ref: 'container'
    });
  }

});

/***/ }),

/***/ "./node_modules/@uppy/vue/lib/dashboard.js":
/*!*************************************************!*\
  !*** ./node_modules/@uppy/vue/lib/dashboard.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _uppy_dashboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @uppy/dashboard */ "./node_modules/@uppy/dashboard/lib/index.js");
/* harmony import */ var _uppy_dashboard__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_uppy_dashboard__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var shallow_equal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! shallow-equal */ "./node_modules/shallow-equal/dist/index.esm.js");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue */ "vue");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils.js */ "./node_modules/@uppy/vue/lib/utils.js");

 // Cross compatibility dependencies



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data() {
    return {
      plugin: {}
    };
  },

  props: {
    uppy: {
      required: true
    },
    props: {
      type: Object
    },
    plugins: {
      type: Array
    }
  },

  mounted() {
    this.installPlugin();
  },

  methods: {
    installPlugin() {
      const {
        uppy
      } = this;
      const options = {
        id: 'vue:Dashboard',
        inline: true,
        plugins: this.plugins,
        ...this.props,
        target: this.$refs.container
      };
      uppy.use((_uppy_dashboard__WEBPACK_IMPORTED_MODULE_0___default()), options);
      this.plugin = uppy.getPlugin(options.id);
    },

    uninstallPlugin(uppy) {
      uppy.removePlugin(this.plugin);
    }

  },

  beforeDestroy() {
    this.uninstallPlugin(this.uppy);
  },

  beforeUnmount() {
    this.uninstallPlugin(this.uppy);
  },

  watch: {
    uppy(current, old) {
      if (old !== current) {
        this.uninstallPlugin(old);
        this.installPlugin();
      }
    },

    props(current, old) {
      if (!(0,shallow_equal__WEBPACK_IMPORTED_MODULE_1__.shallowEqualObjects)(current, old)) {
        this.plugin.setOptions({ ...current
        });
      }
    }

  },

  render() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    // Hack to allow support for Vue 2 and 3
    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isVue2)(...args)) {
      // If it's first argument is a function, then it's a Vue 2 App
      const [createElement] = args;
      return createElement('div', {
        ref: 'container'
      });
    } // Otherwise, we use the `h` function from the Vue package (in Vue 3 fashion)


    return vue__WEBPACK_IMPORTED_MODULE_2__.h('div', {
      ref: 'container'
    });
  }

});

/***/ }),

/***/ "./node_modules/@uppy/vue/lib/drag-drop.js":
/*!*************************************************!*\
  !*** ./node_modules/@uppy/vue/lib/drag-drop.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _uppy_drag_drop__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @uppy/drag-drop */ "./node_modules/@uppy/drag-drop/lib/index.js");
/* harmony import */ var _uppy_drag_drop__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_uppy_drag_drop__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var shallow_equal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! shallow-equal */ "./node_modules/shallow-equal/dist/index.esm.js");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue */ "vue");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils.js */ "./node_modules/@uppy/vue/lib/utils.js");

 // Cross compatibility dependencies



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data() {
    return {
      plugin: {}
    };
  },

  props: {
    uppy: {
      required: true
    },
    props: {
      type: Object
    }
  },

  mounted() {
    this.installPlugin();
  },

  methods: {
    installPlugin() {
      const {
        uppy
      } = this;
      const options = {
        id: 'vue:DragDrop',
        ...this.props,
        target: this.$refs.container
      };
      uppy.use((_uppy_drag_drop__WEBPACK_IMPORTED_MODULE_0___default()), options);
      this.plugin = uppy.getPlugin(options.id);
    },

    uninstallPlugin(uppy) {
      uppy.removePlugin(this.plugin);
    }

  },

  beforeDestroy() {
    this.uninstallPlugin(this.uppy);
  },

  beforeUnmount() {
    this.uninstallPlugin(this.uppy);
  },

  watch: {
    uppy(current, old) {
      if (old !== current) {
        this.uninstallPlugin(old);
        this.installPlugin();
      }
    },

    props(current, old) {
      if (!(0,shallow_equal__WEBPACK_IMPORTED_MODULE_1__.shallowEqualObjects)(current, old)) {
        this.plugin.setOptions({ ...current
        });
      }
    }

  },

  render() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    // Hack to allow support for Vue 2 and 3
    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isVue2)(...args)) {
      // If it's first argument is a function, then it's a Vue 2 App
      const [createElement] = args;
      return createElement('div', {
        ref: 'container'
      });
    } // Otherwise, we import the `h` function from the Vue package (in Vue 3 fashion)


    return vue__WEBPACK_IMPORTED_MODULE_2__.h('div', {
      ref: 'container'
    });
  }

});

/***/ }),

/***/ "./node_modules/@uppy/vue/lib/index.js":
/*!*********************************************!*\
  !*** ./node_modules/@uppy/vue/lib/index.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Dashboard": () => (/* reexport safe */ _dashboard_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "DashboardModal": () => (/* reexport safe */ _dashboard_modal_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "DragDrop": () => (/* reexport safe */ _drag_drop_js__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   "ProgressBar": () => (/* reexport safe */ _progress_bar_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   "StatusBar": () => (/* reexport safe */ _status_bar_js__WEBPACK_IMPORTED_MODULE_4__["default"])
/* harmony export */ });
/* harmony import */ var _dashboard_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dashboard.js */ "./node_modules/@uppy/vue/lib/dashboard.js");
/* harmony import */ var _dashboard_modal_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dashboard-modal.js */ "./node_modules/@uppy/vue/lib/dashboard-modal.js");
/* harmony import */ var _drag_drop_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./drag-drop.js */ "./node_modules/@uppy/vue/lib/drag-drop.js");
/* harmony import */ var _progress_bar_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./progress-bar.js */ "./node_modules/@uppy/vue/lib/progress-bar.js");
/* harmony import */ var _status_bar_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./status-bar.js */ "./node_modules/@uppy/vue/lib/status-bar.js");






/***/ }),

/***/ "./node_modules/@uppy/vue/lib/progress-bar.js":
/*!****************************************************!*\
  !*** ./node_modules/@uppy/vue/lib/progress-bar.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _uppy_progress_bar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @uppy/progress-bar */ "./node_modules/@uppy/progress-bar/lib/index.js");
/* harmony import */ var _uppy_progress_bar__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_uppy_progress_bar__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var shallow_equal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! shallow-equal */ "./node_modules/shallow-equal/dist/index.esm.js");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue */ "vue");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils.js */ "./node_modules/@uppy/vue/lib/utils.js");

 // Cross compatibility dependencies



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data() {
    return {
      plugin: {}
    };
  },

  props: {
    uppy: {
      required: true
    },
    props: {
      type: Object
    }
  },

  mounted() {
    this.installPlugin();
  },

  methods: {
    installPlugin() {
      const {
        uppy
      } = this;
      const options = {
        id: 'vue:ProgressBar',
        ...this.props,
        target: this.$refs.container
      };
      uppy.use((_uppy_progress_bar__WEBPACK_IMPORTED_MODULE_0___default()), options);
      this.plugin = uppy.getPlugin(options.id);
    },

    uninstallPlugin(uppy) {
      uppy.removePlugin(this.plugin);
    }

  },

  beforeDestroy() {
    this.uninstallPlugin(this.uppy);
  },

  watch: {
    uppy(current, old) {
      if (old !== current) {
        this.uninstallPlugin(old);
        this.installPlugin();
      }
    },

    props(current, old) {
      if (!(0,shallow_equal__WEBPACK_IMPORTED_MODULE_1__.shallowEqualObjects)(current, old)) {
        this.plugin.setOptions({ ...current
        });
      }
    }

  },

  render() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    // Hack to allow support for Vue 2 and 3
    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isVue2)(...args)) {
      // If it's first argument is a function, then it's a Vue 2 App
      const [createElement] = args;
      return createElement('div', {
        ref: 'container'
      });
    } // Otherwise, we import the `h` function from the Vue package (in Vue 3 fashion)


    return vue__WEBPACK_IMPORTED_MODULE_2__.h('div', {
      ref: 'container'
    });
  }

});

/***/ }),

/***/ "./node_modules/@uppy/vue/lib/status-bar.js":
/*!**************************************************!*\
  !*** ./node_modules/@uppy/vue/lib/status-bar.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _uppy_status_bar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @uppy/status-bar */ "./node_modules/@uppy/status-bar/lib/index.js");
/* harmony import */ var _uppy_status_bar__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_uppy_status_bar__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var shallow_equal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! shallow-equal */ "./node_modules/shallow-equal/dist/index.esm.js");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue */ "vue");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils.js */ "./node_modules/@uppy/vue/lib/utils.js");

 // Cross compatibility dependencies



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data() {
    return {
      plugin: {}
    };
  },

  props: {
    uppy: {
      required: true
    },
    props: {
      type: Object
    }
  },

  mounted() {
    this.installPlugin();
  },

  methods: {
    installPlugin() {
      const {
        uppy
      } = this;
      const options = {
        id: 'vue:StatusBar',
        ...this.props,
        target: this.$refs.container
      };
      uppy.use((_uppy_status_bar__WEBPACK_IMPORTED_MODULE_0___default()), options);
      this.plugin = uppy.getPlugin(options.id);
    },

    uninstallPlugin(uppy) {
      uppy.removePlugin(this.plugin);
    }

  },

  beforeDestroy() {
    this.uninstallPlugin(this.uppy);
  },

  beforeUnmount() {
    this.uninstallPlugin(this.uppy);
  },

  watch: {
    uppy(current, old) {
      if (old !== current) {
        this.uninstallPlugin(old);
        this.installPlugin();
      }
    },

    props(current, old) {
      if (!(0,shallow_equal__WEBPACK_IMPORTED_MODULE_1__.shallowEqualObjects)(current, old)) {
        this.plugin.setOptions({ ...current
        });
      }
    }

  },

  render() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    // Hack to allow support for Vue 2 and 3
    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isVue2)(...args)) {
      // If it's first argument is a function, then it's a Vue 2 App
      const [createElement] = args;
      return createElement('div', {
        ref: 'container'
      });
    } // Other wise, we import the `h` function from the Vue package (in Vue 3 fashion)


    return vue__WEBPACK_IMPORTED_MODULE_2__.h('div', {
      ref: 'container'
    });
  }

});

/***/ }),

/***/ "./node_modules/@uppy/vue/lib/utils.js":
/*!*********************************************!*\
  !*** ./node_modules/@uppy/vue/lib/utils.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isVue2": () => (/* binding */ isVue2)
/* harmony export */ });
// eslint-disable-next-line import/prefer-default-export
const isVue2 = function () {
  return arguments.length > 0 && typeof (arguments.length <= 0 ? undefined : arguments[0]) === 'function';
};

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/FileCard.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/FileCard.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");
/* harmony import */ var _uppy_utils_lib_getFileType__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @uppy/utils/lib/getFileType */ "./node_modules/@uppy/utils/lib/getFileType.js");
/* harmony import */ var _uppy_utils_lib_getFileType__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_uppy_utils_lib_getFileType__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _uppy_dashboard_lib_utils_getFileTypeIcon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @uppy/dashboard/lib/utils/getFileTypeIcon */ "./node_modules/@uppy/dashboard/lib/utils/getFileTypeIcon.js");
/* harmony import */ var _uppy_dashboard_lib_utils_getFileTypeIcon__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_uppy_dashboard_lib_utils_getFileTypeIcon__WEBPACK_IMPORTED_MODULE_2__);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: ["fileKey", "fileName", "fileSize", "fileMeta", "apiUri", "withMeta"],
  mounted: function mounted() {
    (0,preact__WEBPACK_IMPORTED_MODULE_0__.render)(_uppy_dashboard_lib_utils_getFileTypeIcon__WEBPACK_IMPORTED_MODULE_2___default()(_uppy_utils_lib_getFileType__WEBPACK_IMPORTED_MODULE_1___default()({
      name: this.fileKey
    })).icon, this.$refs.fileIcon);
  },
  computed: {
    formatedFileSize: function formatedFileSize() {
      var i = Math.floor(Math.log(this.fileSize) / Math.log(1024));
      return (this.fileSize / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
    },
    formatedFileMeta: function formatedFileMeta() {
      var output = [];

      for (var prop in this.fileMeta) {
        output.push("".concat(prop, ": ").concat(this.fileMeta[prop]));
      }

      return output.join(' | ');
    }
  },
  methods: {
    downloadFile: function downloadFile(contentDisposition) {
      Nova.request().get("".concat(this.apiUri, "/").concat(this.fileKey), {
        params: {
          contentDisposition: contentDisposition
        }
      }).then(function (response) {
        var link = document.createElement('a');
        link.href = response.data.temporaryUrl;
        link.target = contentDisposition === 'inline' ? '_blank' : '_self';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })["catch"](function (error) {
        Nova.error(error.message);
      });
    },
    removeFile: function removeFile() {
      var _this = this;

      if (!confirm("Are you sure you want to delete this file?")) {
        return;
      }

      Nova.request()["delete"]("".concat(this.apiUri, "/").concat(this.fileKey)).then(function (response) {
        Nova.success(response.data.message);
        Nova.$emit("refresh-".concat(_this.withMeta.attribute, "-files"));

        if (_this.withMeta.refreshListable) {
          Nova.$emit('refresh-resources');
        }
      })["catch"](function (error) {
        Nova.error(error.message);
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/FilesGrid.vue?vue&type=script&lang=js":
/*!***************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/FilesGrid.vue?vue&type=script&lang=js ***!
  \***************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FileCard_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FileCard.vue */ "./resources/js/components/FileCard.vue");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  components: {
    FileCard: _FileCard_vue__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  props: ["apiUri", "withMeta"],
  data: function data() {
    return {
      files: [],
      isLoading: true
    };
  },
  created: function created() {
    var _this = this;

    this.getFiles();
    Nova.$on("refresh-".concat(this.withMeta.attribute, "-files"), function () {
      _this.getFiles();
    });
  },
  methods: {
    getFiles: function getFiles() {
      var _this2 = this;

      this.isLoading = true;
      new Promise(function (resolve) {
        setTimeout(function () {
          return resolve();
        }, 300);
      }).then(function () {
        Nova.request().get(_this2.apiUri).then(function (response) {
          _this2.isLoading = false;
          _this2.files = response.data.files;
        });
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/Tool.vue?vue&type=script&lang=js":
/*!**********************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/Tool.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FilesGrid_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FilesGrid.vue */ "./resources/js/components/FilesGrid.vue");
/* harmony import */ var _UppyWrapper_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./UppyWrapper.vue */ "./resources/js/components/UppyWrapper.vue");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  components: {
    FilesGrid: _FilesGrid_vue__WEBPACK_IMPORTED_MODULE_0__["default"],
    UppyWrapper: _UppyWrapper_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  props: ["resourceName", "resourceId", "panel"],
  data: function data() {
    return {
      apiUri: "/nova-vendor/nova-s3-multipart-upload/".concat(this.resourceName, "/").concat(this.resourceId, "/").concat(this.panel.fields[0].attribute, "/files"),
      companionUri: "/nova-vendor/nova-s3-multipart-upload/".concat(this.resourceName, "/").concat(this.resourceId, "/").concat(this.panel.fields[0].attribute, "/"),
      withMeta: this.panel.fields[0],
      filesQueue: [],
      isSaving: false
    };
  },
  watch: {
    filesQueue: function filesQueue() {
      if (!this.isSaving && this.filesQueue.length) {
        this.processQueue();
      }
    }
  },
  methods: {
    queueFile: function queueFile(file) {
      this.filesQueue.push({
        fileId: file.id,
        fileKey: file.s3Multipart.key,
        fileName: file.meta.name,
        fileSize: file.size || 0,
        fileMeta: file.meta
      });
    },
    dequeueFile: function dequeueFile(fileId) {
      this.filesQueue = this.filesQueue.filter(function (item) {
        return item.fileId !== fileId;
      });
    },
    processQueue: function processQueue() {
      this.saveModel(this.filesQueue[0]);
    },
    saveModel: function saveModel(data) {
      var _this = this;

      this.isSaving = true, Nova.request().post(this.apiUri, data).then(function (response) {
        Nova.success(response.data.message);
        Nova.$emit("refresh-".concat(_this.withMeta.attribute, "-files"));

        if (_this.withMeta.refreshListable) {
          Nova.$emit('refresh-resources');
        }
      })["catch"](function (error) {
        Nova.error(error.message);
      }).then(function () {
        _this.isSaving = false, _this.dequeueFile(data.fileId);
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/UppyWrapper.vue?vue&type=script&lang=js":
/*!*****************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/UppyWrapper.vue?vue&type=script&lang=js ***!
  \*****************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _uppy_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @uppy/vue */ "./node_modules/@uppy/vue/lib/index.js");
/* harmony import */ var _uppy_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @uppy/core */ "./node_modules/@uppy/core/lib/index.js");
/* harmony import */ var _uppy_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_uppy_core__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _uppy_aws_s3_multipart__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @uppy/aws-s3-multipart */ "./node_modules/@uppy/aws-s3-multipart/lib/index.js");
/* harmony import */ var _uppy_aws_s3_multipart__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_uppy_aws_s3_multipart__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _uppy_webcam__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @uppy/webcam */ "./node_modules/@uppy/webcam/lib/index.js");
/* harmony import */ var _uppy_webcam__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_uppy_webcam__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _uppy_screen_capture__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @uppy/screen-capture */ "./node_modules/@uppy/screen-capture/lib/index.js");
/* harmony import */ var _uppy_screen_capture__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_uppy_screen_capture__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _uppy_image_editor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @uppy/image-editor */ "./node_modules/@uppy/image-editor/lib/index.js");
/* harmony import */ var _uppy_image_editor__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_uppy_image_editor__WEBPACK_IMPORTED_MODULE_5__);
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  components: {
    Dashboard: _uppy_vue__WEBPACK_IMPORTED_MODULE_0__.Dashboard
  },
  props: ['companionUri', 'withMeta', 'queueFile'],
  data: function data() {
    return this.initUppy();
  },
  beforeDestroy: function beforeDestroy() {
    this.uppy.close();
  },
  methods: {
    getChunkSize: function getChunkSize(file) {
      return this.withMeta.chunkSize || 5 * 1024 * 1024;
    },
    initUppy: function initUppy() {
      var _this = this;

      var locale = window.NovaUppyLocale || {
        strings: {}
      };

      _.merge(locale.strings, this.withMeta.locale);

      var plugins = [];
      var uppy = new (_uppy_core__WEBPACK_IMPORTED_MODULE_1___default())({
        id: this.withMeta.attribute,
        autoProceed: this.withMeta.autoProceed || false,
        allowMultipleUploadBatches: this.withMeta.allowMultipleUploads || false,
        restrictions: _objectSpread(_objectSpread({}, this.withMeta.restrictions), this.withMeta.multipleFilesRestriction),
        locale: locale
      }).on('upload-success', function (file, response) {
        _this.queueFile(file);
      }).use((_uppy_aws_s3_multipart__WEBPACK_IMPORTED_MODULE_2___default()), {
        limit: this.withMeta.limit || 0,
        companionUrl: this.companionUri,
        companionHeaders: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        getChunkSize: this.getChunkSize
      });
      uppy.on('file-added', function (file) {
        uppy.setFileMeta(file.id, _this.withMeta.metaValues || {});
      });

      if (this.withMeta.useWebcam) {
        uppy.use((_uppy_webcam__WEBPACK_IMPORTED_MODULE_3___default()), {
          title: locale.strings['Camera'] || 'Camera',
          showVideoSourceDropdown: true,
          showRecordingLength: true
        });
        plugins.push('Webcam');
      }

      if (this.withMeta.useScreenCapture) {
        uppy.use((_uppy_screen_capture__WEBPACK_IMPORTED_MODULE_4___default()), {
          title: locale.strings['Screencast'] || 'Screencast'
        });
        plugins.push('ScreenCapture');
      }

      if (this.withMeta.useImageEditor) {
        uppy.use((_uppy_image_editor__WEBPACK_IMPORTED_MODULE_5___default()), {
          quality: 1
        });
        plugins.push('ImageEditor');
      }

      var options = {
        plugins: plugins,
        width: null,
        height: this.withMeta.height || null,
        showProgressDetails: true,
        fileManagerSelectionType: this.withMeta.fileManagerSelectionType || 'files',
        metaFields: [].concat(_toConsumableArray(this.withMeta.nameMetaField || []), _toConsumableArray(this.withMeta.metaFields || [])),
        autoOpenFileEditor: this.withMeta.autoOpenFileEditor || false,
        proudlyDisplayPoweredByUppy: this.withMeta.proudlyDisplayPoweredByUppy || false,
        note: this.withMeta.note || null
      };
      return {
        uppy: uppy,
        options: options
      };
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/FileCard.vue?vue&type=template&id=63c6b3d2":
/*!******************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/FileCard.vue?vue&type=template&id=63c6b3d2 ***!
  \******************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "vue");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);

var _hoisted_1 = {
  ref: "fileIcon",
  "class": "flex items-center flex-no-shrink mr-4"
};
var _hoisted_2 = {
  "class": "flex flex-col justify-center truncate"
};
var _hoisted_3 = {
  key: 0,
  "class": "mt-2 text-80 text-xs font-semibold"
};
var _hoisted_4 = {
  key: 0,
  "class": "flex item-center ml-auto"
};

var _hoisted_5 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: "16",
  height: "20",
  fill: "none",
  viewBox: "0 0 22 16",
  stroke: "currentColor",
  "stroke-width": "2"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
}), /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
})], -1
/* HOISTED */
);

var _hoisted_6 = [_hoisted_5];

var _hoisted_7 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: "16",
  height: "20",
  fill: "none",
  viewBox: "2 2 20 20",
  stroke: "currentColor",
  "stroke-width": "2"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
})], -1
/* HOISTED */
);

var _hoisted_8 = [_hoisted_7];

var _hoisted_9 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: "16",
  height: "20",
  fill: "none",
  viewBox: "0 0 20 20",
  stroke: "currentColor",
  "stroke-width": "2"
}, [/*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
})], -1
/* HOISTED */
);

var _hoisted_10 = [_hoisted_9];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_card = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("card");

  var _directive_tooltip = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveDirective)("tooltip");

  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_card, {
    "class": "flex item-center overflow-hidden p-4"
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_1, null, 512
      /* NEED_PATCH */
      ), [[_directive_tooltip, $options.formatedFileMeta, void 0, {
        click: true
      }]]), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_2, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.fileName || $props.fileKey), 1
      /* TEXT */
      ), $props.fileSize ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_3, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($options.formatedFileSize), 1
      /* TEXT */
      )) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)]), $props.withMeta.canDownload || $props.withMeta.canDelete ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_4, [$props.withMeta.canDownload && $props.withMeta.contentDisposition.includes('inline') ? (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)(((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("button", {
        key: 0,
        "class": "cursor-pointer dim btn btn-link text-primary inline-flex items-center ml-3",
        type: "button",
        onKeydown: _cache[0] || (_cache[0] = (0,vue__WEBPACK_IMPORTED_MODULE_0__.withKeys)((0,vue__WEBPACK_IMPORTED_MODULE_0__.withModifiers)(function ($event) {
          return $options.downloadFile('inline');
        }, ["prevent"]), ["enter"])),
        onClick: _cache[1] || (_cache[1] = (0,vue__WEBPACK_IMPORTED_MODULE_0__.withModifiers)(function ($event) {
          return $options.downloadFile('inline');
        }, ["prevent"]))
      }, _hoisted_6, 32
      /* HYDRATE_EVENTS */
      )), [[_directive_tooltip, _ctx.__('View'), void 0, {
        click: true
      }]]) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), $props.withMeta.canDownload && $props.withMeta.contentDisposition.includes('attachment') ? (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)(((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("button", {
        key: 1,
        type: "button",
        "class": "cursor-pointer dim btn btn-link text-primary inline-flex items-center ml-3",
        onKeydown: _cache[2] || (_cache[2] = (0,vue__WEBPACK_IMPORTED_MODULE_0__.withKeys)((0,vue__WEBPACK_IMPORTED_MODULE_0__.withModifiers)(function ($event) {
          return $options.downloadFile('attachment');
        }, ["prevent"]), ["enter"])),
        onClick: _cache[3] || (_cache[3] = (0,vue__WEBPACK_IMPORTED_MODULE_0__.withModifiers)(function ($event) {
          return $options.downloadFile('attachment');
        }, ["prevent"]))
      }, _hoisted_8, 32
      /* HYDRATE_EVENTS */
      )), [[_directive_tooltip, _ctx.__('Download'), void 0, {
        click: true
      }]]) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), $props.withMeta.canDelete ? (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)(((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("button", {
        key: 2,
        type: "button",
        "class": "cursor-pointer dim btn btn-link text-primary inline-flex items-center ml-3",
        onKeydown: _cache[4] || (_cache[4] = (0,vue__WEBPACK_IMPORTED_MODULE_0__.withKeys)((0,vue__WEBPACK_IMPORTED_MODULE_0__.withModifiers)(function () {
          return $options.removeFile && $options.removeFile.apply($options, arguments);
        }, ["prevent"]), ["enter"])),
        onClick: _cache[5] || (_cache[5] = (0,vue__WEBPACK_IMPORTED_MODULE_0__.withModifiers)(function () {
          return $options.removeFile && $options.removeFile.apply($options, arguments);
        }, ["prevent"]))
      }, _hoisted_10, 32
      /* HYDRATE_EVENTS */
      )), [[_directive_tooltip, _ctx.__('Delete'), void 0, {
        click: true
      }]]) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)];
    }),
    _: 1
    /* STABLE */

  });
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/FilesGrid.vue?vue&type=template&id=40ceda02":
/*!*******************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/FilesGrid.vue?vue&type=template&id=40ceda02 ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "vue");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);

function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_file_card = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("file-card");

  var _component_loading_view = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("loading-view");

  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_loading_view, {
    loading: $data.isLoading
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [$data.files.length ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", {
        key: 0,
        "class": (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)(["mb-3 files-grid", {
          'files-grid-2': $data.files.length === 2,
          'files-grid-3': $data.files.length > 2
        }])
      }, [((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($data.files, function (file) {
        return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_file_card, {
          key: file.fileKey,
          "file-key": file.fileKey,
          "file-name": file.fileName,
          "file-size": file.fileSize,
          "file-meta": file.fileMeta,
          "api-uri": $props.apiUri,
          "with-meta": $props.withMeta
        }, null, 8
        /* PROPS */
        , ["file-key", "file-name", "file-size", "file-meta", "api-uri", "with-meta"]);
      }), 128
      /* KEYED_FRAGMENT */
      ))], 2
      /* CLASS */
      )) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)];
    }),
    _: 1
    /* STABLE */

  }, 8
  /* PROPS */
  , ["loading"]);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/Tool.vue?vue&type=template&id=68ff5483":
/*!**************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/Tool.vue?vue&type=template&id=68ff5483 ***!
  \**************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "vue");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);

function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_heading = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("heading");

  var _component_files_grid = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("files-grid");

  var _component_uppy_wrapper = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("uppy-wrapper");

  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", null, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_heading, {
    level: 1,
    "class": "mb-3"
  }, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)((0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.panel.name), 1
      /* TEXT */
      )];
    }),
    _: 1
    /* STABLE */

  }), $data.withMeta.canView ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_files_grid, {
    key: 0,
    "api-uri": $data.apiUri,
    "with-meta": $data.withMeta
  }, null, 8
  /* PROPS */
  , ["api-uri", "with-meta"])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), $data.withMeta.canUpload ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_uppy_wrapper, {
    key: 1,
    "companion-uri": $data.companionUri,
    "with-meta": $data.withMeta,
    "queue-file": $options.queueFile
  }, null, 8
  /* PROPS */
  , ["companion-uri", "with-meta", "queue-file"])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)]);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/UppyWrapper.vue?vue&type=template&id=b8d52518":
/*!*********************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/UppyWrapper.vue?vue&type=template&id=b8d52518 ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "vue");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);

function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_Dashboard = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("Dashboard");

  var _component_card = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("card");

  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_card, null, {
    "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_Dashboard, {
        uppy: _ctx.uppy,
        props: _ctx.options,
        "class": "uppy-panel"
      }, null, 8
      /* PROPS */
      , ["uppy", "props"])];
    }),
    _: 1
    /* STABLE */

  });
}

/***/ }),

/***/ "./resources/js/tool.js":
/*!******************************!*\
  !*** ./resources/js/tool.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Nova.booting(function (Vue, router, store) {
  Vue.component('nova-s3-multipart-upload', (__webpack_require__(/*! ./components/Tool */ "./resources/js/components/Tool.vue")["default"]));
});

/***/ }),

/***/ "./node_modules/base64-js/index.js":
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ "./node_modules/buffer/index.js":
/*!**************************************!*\
  !*** ./node_modules/buffer/index.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(/*! base64-js */ "./node_modules/base64-js/index.js")
var ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js")
var isArray = __webpack_require__(/*! isarray */ "./node_modules/isarray/index.js")

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = __webpack_require__.g.TYPED_ARRAY_SUPPORT !== undefined
  ? __webpack_require__.g.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}


/***/ }),

/***/ "./node_modules/classnames/index.js":
/*!******************************************!*\
  !*** ./node_modules/classnames/index.js ***!
  \******************************************/
/***/ ((module, exports) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
  Copyright (c) 2018 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames() {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				if (arg.length) {
					var inner = classNames.apply(null, arg);
					if (inner) {
						classes.push(inner);
					}
				}
			} else if (argType === 'object') {
				if (arg.toString === Object.prototype.toString) {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(key);
						}
					}
				} else {
					classes.push(arg.toString());
				}
			}
		}

		return classes.join(' ');
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}());


/***/ }),

/***/ "./node_modules/cropperjs/dist/cropper.js":
/*!************************************************!*\
  !*** ./node_modules/cropperjs/dist/cropper.js ***!
  \************************************************/
/***/ (function(module) {

/*!
 * Cropper.js v1.5.7
 * https://fengyuanchen.github.io/cropperjs
 *
 * Copyright 2015-present Chen Fengyuan
 * Released under the MIT license
 *
 * Date: 2020-05-23T05:23:00.081Z
 */

(function (global, factory) {
   true ? module.exports = factory() :
  0;
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var IS_BROWSER = typeof window !== 'undefined' && typeof window.document !== 'undefined';
  var WINDOW = IS_BROWSER ? window : {};
  var IS_TOUCH_DEVICE = IS_BROWSER && WINDOW.document.documentElement ? 'ontouchstart' in WINDOW.document.documentElement : false;
  var HAS_POINTER_EVENT = IS_BROWSER ? 'PointerEvent' in WINDOW : false;
  var NAMESPACE = 'cropper'; // Actions

  var ACTION_ALL = 'all';
  var ACTION_CROP = 'crop';
  var ACTION_MOVE = 'move';
  var ACTION_ZOOM = 'zoom';
  var ACTION_EAST = 'e';
  var ACTION_WEST = 'w';
  var ACTION_SOUTH = 's';
  var ACTION_NORTH = 'n';
  var ACTION_NORTH_EAST = 'ne';
  var ACTION_NORTH_WEST = 'nw';
  var ACTION_SOUTH_EAST = 'se';
  var ACTION_SOUTH_WEST = 'sw'; // Classes

  var CLASS_CROP = "".concat(NAMESPACE, "-crop");
  var CLASS_DISABLED = "".concat(NAMESPACE, "-disabled");
  var CLASS_HIDDEN = "".concat(NAMESPACE, "-hidden");
  var CLASS_HIDE = "".concat(NAMESPACE, "-hide");
  var CLASS_INVISIBLE = "".concat(NAMESPACE, "-invisible");
  var CLASS_MODAL = "".concat(NAMESPACE, "-modal");
  var CLASS_MOVE = "".concat(NAMESPACE, "-move"); // Data keys

  var DATA_ACTION = "".concat(NAMESPACE, "Action");
  var DATA_PREVIEW = "".concat(NAMESPACE, "Preview"); // Drag modes

  var DRAG_MODE_CROP = 'crop';
  var DRAG_MODE_MOVE = 'move';
  var DRAG_MODE_NONE = 'none'; // Events

  var EVENT_CROP = 'crop';
  var EVENT_CROP_END = 'cropend';
  var EVENT_CROP_MOVE = 'cropmove';
  var EVENT_CROP_START = 'cropstart';
  var EVENT_DBLCLICK = 'dblclick';
  var EVENT_TOUCH_START = IS_TOUCH_DEVICE ? 'touchstart' : 'mousedown';
  var EVENT_TOUCH_MOVE = IS_TOUCH_DEVICE ? 'touchmove' : 'mousemove';
  var EVENT_TOUCH_END = IS_TOUCH_DEVICE ? 'touchend touchcancel' : 'mouseup';
  var EVENT_POINTER_DOWN = HAS_POINTER_EVENT ? 'pointerdown' : EVENT_TOUCH_START;
  var EVENT_POINTER_MOVE = HAS_POINTER_EVENT ? 'pointermove' : EVENT_TOUCH_MOVE;
  var EVENT_POINTER_UP = HAS_POINTER_EVENT ? 'pointerup pointercancel' : EVENT_TOUCH_END;
  var EVENT_READY = 'ready';
  var EVENT_RESIZE = 'resize';
  var EVENT_WHEEL = 'wheel';
  var EVENT_ZOOM = 'zoom'; // Mime types

  var MIME_TYPE_JPEG = 'image/jpeg'; // RegExps

  var REGEXP_ACTIONS = /^e|w|s|n|se|sw|ne|nw|all|crop|move|zoom$/;
  var REGEXP_DATA_URL = /^data:/;
  var REGEXP_DATA_URL_JPEG = /^data:image\/jpeg;base64,/;
  var REGEXP_TAG_NAME = /^img|canvas$/i; // Misc

  var DEFAULTS = {
    // Define the view mode of the cropper
    viewMode: 0,
    // 0, 1, 2, 3
    // Define the dragging mode of the cropper
    dragMode: DRAG_MODE_CROP,
    // 'crop', 'move' or 'none'
    // Define the initial aspect ratio of the crop box
    initialAspectRatio: NaN,
    // Define the aspect ratio of the crop box
    aspectRatio: NaN,
    // An object with the previous cropping result data
    data: null,
    // A selector for adding extra containers to preview
    preview: '',
    // Re-render the cropper when resize the window
    responsive: true,
    // Restore the cropped area after resize the window
    restore: true,
    // Check if the current image is a cross-origin image
    checkCrossOrigin: true,
    // Check the current image's Exif Orientation information
    checkOrientation: true,
    // Show the black modal
    modal: true,
    // Show the dashed lines for guiding
    guides: true,
    // Show the center indicator for guiding
    center: true,
    // Show the white modal to highlight the crop box
    highlight: true,
    // Show the grid background
    background: true,
    // Enable to crop the image automatically when initialize
    autoCrop: true,
    // Define the percentage of automatic cropping area when initializes
    autoCropArea: 0.8,
    // Enable to move the image
    movable: true,
    // Enable to rotate the image
    rotatable: true,
    // Enable to scale the image
    scalable: true,
    // Enable to zoom the image
    zoomable: true,
    // Enable to zoom the image by dragging touch
    zoomOnTouch: true,
    // Enable to zoom the image by wheeling mouse
    zoomOnWheel: true,
    // Define zoom ratio when zoom the image by wheeling mouse
    wheelZoomRatio: 0.1,
    // Enable to move the crop box
    cropBoxMovable: true,
    // Enable to resize the crop box
    cropBoxResizable: true,
    // Toggle drag mode between "crop" and "move" when click twice on the cropper
    toggleDragModeOnDblclick: true,
    // Size limitation
    minCanvasWidth: 0,
    minCanvasHeight: 0,
    minCropBoxWidth: 0,
    minCropBoxHeight: 0,
    minContainerWidth: 200,
    minContainerHeight: 100,
    // Shortcuts of events
    ready: null,
    cropstart: null,
    cropmove: null,
    cropend: null,
    crop: null,
    zoom: null
  };

  var TEMPLATE = '<div class="cropper-container" touch-action="none">' + '<div class="cropper-wrap-box">' + '<div class="cropper-canvas"></div>' + '</div>' + '<div class="cropper-drag-box"></div>' + '<div class="cropper-crop-box">' + '<span class="cropper-view-box"></span>' + '<span class="cropper-dashed dashed-h"></span>' + '<span class="cropper-dashed dashed-v"></span>' + '<span class="cropper-center"></span>' + '<span class="cropper-face"></span>' + '<span class="cropper-line line-e" data-cropper-action="e"></span>' + '<span class="cropper-line line-n" data-cropper-action="n"></span>' + '<span class="cropper-line line-w" data-cropper-action="w"></span>' + '<span class="cropper-line line-s" data-cropper-action="s"></span>' + '<span class="cropper-point point-e" data-cropper-action="e"></span>' + '<span class="cropper-point point-n" data-cropper-action="n"></span>' + '<span class="cropper-point point-w" data-cropper-action="w"></span>' + '<span class="cropper-point point-s" data-cropper-action="s"></span>' + '<span class="cropper-point point-ne" data-cropper-action="ne"></span>' + '<span class="cropper-point point-nw" data-cropper-action="nw"></span>' + '<span class="cropper-point point-sw" data-cropper-action="sw"></span>' + '<span class="cropper-point point-se" data-cropper-action="se"></span>' + '</div>' + '</div>';

  /**
   * Check if the given value is not a number.
   */

  var isNaN = Number.isNaN || WINDOW.isNaN;
  /**
   * Check if the given value is a number.
   * @param {*} value - The value to check.
   * @returns {boolean} Returns `true` if the given value is a number, else `false`.
   */

  function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
  }
  /**
   * Check if the given value is a positive number.
   * @param {*} value - The value to check.
   * @returns {boolean} Returns `true` if the given value is a positive number, else `false`.
   */

  var isPositiveNumber = function isPositiveNumber(value) {
    return value > 0 && value < Infinity;
  };
  /**
   * Check if the given value is undefined.
   * @param {*} value - The value to check.
   * @returns {boolean} Returns `true` if the given value is undefined, else `false`.
   */

  function isUndefined(value) {
    return typeof value === 'undefined';
  }
  /**
   * Check if the given value is an object.
   * @param {*} value - The value to check.
   * @returns {boolean} Returns `true` if the given value is an object, else `false`.
   */

  function isObject(value) {
    return _typeof(value) === 'object' && value !== null;
  }
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  /**
   * Check if the given value is a plain object.
   * @param {*} value - The value to check.
   * @returns {boolean} Returns `true` if the given value is a plain object, else `false`.
   */

  function isPlainObject(value) {
    if (!isObject(value)) {
      return false;
    }

    try {
      var _constructor = value.constructor;
      var prototype = _constructor.prototype;
      return _constructor && prototype && hasOwnProperty.call(prototype, 'isPrototypeOf');
    } catch (error) {
      return false;
    }
  }
  /**
   * Check if the given value is a function.
   * @param {*} value - The value to check.
   * @returns {boolean} Returns `true` if the given value is a function, else `false`.
   */

  function isFunction(value) {
    return typeof value === 'function';
  }
  var slice = Array.prototype.slice;
  /**
   * Convert array-like or iterable object to an array.
   * @param {*} value - The value to convert.
   * @returns {Array} Returns a new array.
   */

  function toArray(value) {
    return Array.from ? Array.from(value) : slice.call(value);
  }
  /**
   * Iterate the given data.
   * @param {*} data - The data to iterate.
   * @param {Function} callback - The process function for each element.
   * @returns {*} The original data.
   */

  function forEach(data, callback) {
    if (data && isFunction(callback)) {
      if (Array.isArray(data) || isNumber(data.length)
      /* array-like */
      ) {
          toArray(data).forEach(function (value, key) {
            callback.call(data, value, key, data);
          });
        } else if (isObject(data)) {
        Object.keys(data).forEach(function (key) {
          callback.call(data, data[key], key, data);
        });
      }
    }

    return data;
  }
  /**
   * Extend the given object.
   * @param {*} target - The target object to extend.
   * @param {*} args - The rest objects for merging to the target object.
   * @returns {Object} The extended object.
   */

  var assign = Object.assign || function assign(target) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (isObject(target) && args.length > 0) {
      args.forEach(function (arg) {
        if (isObject(arg)) {
          Object.keys(arg).forEach(function (key) {
            target[key] = arg[key];
          });
        }
      });
    }

    return target;
  };
  var REGEXP_DECIMALS = /\.\d*(?:0|9){12}\d*$/;
  /**
   * Normalize decimal number.
   * Check out {@link https://0.30000000000000004.com/}
   * @param {number} value - The value to normalize.
   * @param {number} [times=100000000000] - The times for normalizing.
   * @returns {number} Returns the normalized number.
   */

  function normalizeDecimalNumber(value) {
    var times = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100000000000;
    return REGEXP_DECIMALS.test(value) ? Math.round(value * times) / times : value;
  }
  var REGEXP_SUFFIX = /^width|height|left|top|marginLeft|marginTop$/;
  /**
   * Apply styles to the given element.
   * @param {Element} element - The target element.
   * @param {Object} styles - The styles for applying.
   */

  function setStyle(element, styles) {
    var style = element.style;
    forEach(styles, function (value, property) {
      if (REGEXP_SUFFIX.test(property) && isNumber(value)) {
        value = "".concat(value, "px");
      }

      style[property] = value;
    });
  }
  /**
   * Check if the given element has a special class.
   * @param {Element} element - The element to check.
   * @param {string} value - The class to search.
   * @returns {boolean} Returns `true` if the special class was found.
   */

  function hasClass(element, value) {
    return element.classList ? element.classList.contains(value) : element.className.indexOf(value) > -1;
  }
  /**
   * Add classes to the given element.
   * @param {Element} element - The target element.
   * @param {string} value - The classes to be added.
   */

  function addClass(element, value) {
    if (!value) {
      return;
    }

    if (isNumber(element.length)) {
      forEach(element, function (elem) {
        addClass(elem, value);
      });
      return;
    }

    if (element.classList) {
      element.classList.add(value);
      return;
    }

    var className = element.className.trim();

    if (!className) {
      element.className = value;
    } else if (className.indexOf(value) < 0) {
      element.className = "".concat(className, " ").concat(value);
    }
  }
  /**
   * Remove classes from the given element.
   * @param {Element} element - The target element.
   * @param {string} value - The classes to be removed.
   */

  function removeClass(element, value) {
    if (!value) {
      return;
    }

    if (isNumber(element.length)) {
      forEach(element, function (elem) {
        removeClass(elem, value);
      });
      return;
    }

    if (element.classList) {
      element.classList.remove(value);
      return;
    }

    if (element.className.indexOf(value) >= 0) {
      element.className = element.className.replace(value, '');
    }
  }
  /**
   * Add or remove classes from the given element.
   * @param {Element} element - The target element.
   * @param {string} value - The classes to be toggled.
   * @param {boolean} added - Add only.
   */

  function toggleClass(element, value, added) {
    if (!value) {
      return;
    }

    if (isNumber(element.length)) {
      forEach(element, function (elem) {
        toggleClass(elem, value, added);
      });
      return;
    } // IE10-11 doesn't support the second parameter of `classList.toggle`


    if (added) {
      addClass(element, value);
    } else {
      removeClass(element, value);
    }
  }
  var REGEXP_CAMEL_CASE = /([a-z\d])([A-Z])/g;
  /**
   * Transform the given string from camelCase to kebab-case
   * @param {string} value - The value to transform.
   * @returns {string} The transformed value.
   */

  function toParamCase(value) {
    return value.replace(REGEXP_CAMEL_CASE, '$1-$2').toLowerCase();
  }
  /**
   * Get data from the given element.
   * @param {Element} element - The target element.
   * @param {string} name - The data key to get.
   * @returns {string} The data value.
   */

  function getData(element, name) {
    if (isObject(element[name])) {
      return element[name];
    }

    if (element.dataset) {
      return element.dataset[name];
    }

    return element.getAttribute("data-".concat(toParamCase(name)));
  }
  /**
   * Set data to the given element.
   * @param {Element} element - The target element.
   * @param {string} name - The data key to set.
   * @param {string} data - The data value.
   */

  function setData(element, name, data) {
    if (isObject(data)) {
      element[name] = data;
    } else if (element.dataset) {
      element.dataset[name] = data;
    } else {
      element.setAttribute("data-".concat(toParamCase(name)), data);
    }
  }
  /**
   * Remove data from the given element.
   * @param {Element} element - The target element.
   * @param {string} name - The data key to remove.
   */

  function removeData(element, name) {
    if (isObject(element[name])) {
      try {
        delete element[name];
      } catch (error) {
        element[name] = undefined;
      }
    } else if (element.dataset) {
      // #128 Safari not allows to delete dataset property
      try {
        delete element.dataset[name];
      } catch (error) {
        element.dataset[name] = undefined;
      }
    } else {
      element.removeAttribute("data-".concat(toParamCase(name)));
    }
  }
  var REGEXP_SPACES = /\s\s*/;

  var onceSupported = function () {
    var supported = false;

    if (IS_BROWSER) {
      var once = false;

      var listener = function listener() {};

      var options = Object.defineProperty({}, 'once', {
        get: function get() {
          supported = true;
          return once;
        },

        /**
         * This setter can fix a `TypeError` in strict mode
         * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Getter_only}
         * @param {boolean} value - The value to set
         */
        set: function set(value) {
          once = value;
        }
      });
      WINDOW.addEventListener('test', listener, options);
      WINDOW.removeEventListener('test', listener, options);
    }

    return supported;
  }();
  /**
   * Remove event listener from the target element.
   * @param {Element} element - The event target.
   * @param {string} type - The event type(s).
   * @param {Function} listener - The event listener.
   * @param {Object} options - The event options.
   */


  function removeListener(element, type, listener) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var handler = listener;
    type.trim().split(REGEXP_SPACES).forEach(function (event) {
      if (!onceSupported) {
        var listeners = element.listeners;

        if (listeners && listeners[event] && listeners[event][listener]) {
          handler = listeners[event][listener];
          delete listeners[event][listener];

          if (Object.keys(listeners[event]).length === 0) {
            delete listeners[event];
          }

          if (Object.keys(listeners).length === 0) {
            delete element.listeners;
          }
        }
      }

      element.removeEventListener(event, handler, options);
    });
  }
  /**
   * Add event listener to the target element.
   * @param {Element} element - The event target.
   * @param {string} type - The event type(s).
   * @param {Function} listener - The event listener.
   * @param {Object} options - The event options.
   */

  function addListener(element, type, listener) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var _handler = listener;
    type.trim().split(REGEXP_SPACES).forEach(function (event) {
      if (options.once && !onceSupported) {
        var _element$listeners = element.listeners,
            listeners = _element$listeners === void 0 ? {} : _element$listeners;

        _handler = function handler() {
          delete listeners[event][listener];
          element.removeEventListener(event, _handler, options);

          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          listener.apply(element, args);
        };

        if (!listeners[event]) {
          listeners[event] = {};
        }

        if (listeners[event][listener]) {
          element.removeEventListener(event, listeners[event][listener], options);
        }

        listeners[event][listener] = _handler;
        element.listeners = listeners;
      }

      element.addEventListener(event, _handler, options);
    });
  }
  /**
   * Dispatch event on the target element.
   * @param {Element} element - The event target.
   * @param {string} type - The event type(s).
   * @param {Object} data - The additional event data.
   * @returns {boolean} Indicate if the event is default prevented or not.
   */

  function dispatchEvent(element, type, data) {
    var event; // Event and CustomEvent on IE9-11 are global objects, not constructors

    if (isFunction(Event) && isFunction(CustomEvent)) {
      event = new CustomEvent(type, {
        detail: data,
        bubbles: true,
        cancelable: true
      });
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(type, true, true, data);
    }

    return element.dispatchEvent(event);
  }
  /**
   * Get the offset base on the document.
   * @param {Element} element - The target element.
   * @returns {Object} The offset data.
   */

  function getOffset(element) {
    var box = element.getBoundingClientRect();
    return {
      left: box.left + (window.pageXOffset - document.documentElement.clientLeft),
      top: box.top + (window.pageYOffset - document.documentElement.clientTop)
    };
  }
  var location = WINDOW.location;
  var REGEXP_ORIGINS = /^(\w+:)\/\/([^:/?#]*):?(\d*)/i;
  /**
   * Check if the given URL is a cross origin URL.
   * @param {string} url - The target URL.
   * @returns {boolean} Returns `true` if the given URL is a cross origin URL, else `false`.
   */

  function isCrossOriginURL(url) {
    var parts = url.match(REGEXP_ORIGINS);
    return parts !== null && (parts[1] !== location.protocol || parts[2] !== location.hostname || parts[3] !== location.port);
  }
  /**
   * Add timestamp to the given URL.
   * @param {string} url - The target URL.
   * @returns {string} The result URL.
   */

  function addTimestamp(url) {
    var timestamp = "timestamp=".concat(new Date().getTime());
    return url + (url.indexOf('?') === -1 ? '?' : '&') + timestamp;
  }
  /**
   * Get transforms base on the given object.
   * @param {Object} obj - The target object.
   * @returns {string} A string contains transform values.
   */

  function getTransforms(_ref) {
    var rotate = _ref.rotate,
        scaleX = _ref.scaleX,
        scaleY = _ref.scaleY,
        translateX = _ref.translateX,
        translateY = _ref.translateY;
    var values = [];

    if (isNumber(translateX) && translateX !== 0) {
      values.push("translateX(".concat(translateX, "px)"));
    }

    if (isNumber(translateY) && translateY !== 0) {
      values.push("translateY(".concat(translateY, "px)"));
    } // Rotate should come first before scale to match orientation transform


    if (isNumber(rotate) && rotate !== 0) {
      values.push("rotate(".concat(rotate, "deg)"));
    }

    if (isNumber(scaleX) && scaleX !== 1) {
      values.push("scaleX(".concat(scaleX, ")"));
    }

    if (isNumber(scaleY) && scaleY !== 1) {
      values.push("scaleY(".concat(scaleY, ")"));
    }

    var transform = values.length ? values.join(' ') : 'none';
    return {
      WebkitTransform: transform,
      msTransform: transform,
      transform: transform
    };
  }
  /**
   * Get the max ratio of a group of pointers.
   * @param {string} pointers - The target pointers.
   * @returns {number} The result ratio.
   */

  function getMaxZoomRatio(pointers) {
    var pointers2 = _objectSpread2({}, pointers);

    var ratios = [];
    forEach(pointers, function (pointer, pointerId) {
      delete pointers2[pointerId];
      forEach(pointers2, function (pointer2) {
        var x1 = Math.abs(pointer.startX - pointer2.startX);
        var y1 = Math.abs(pointer.startY - pointer2.startY);
        var x2 = Math.abs(pointer.endX - pointer2.endX);
        var y2 = Math.abs(pointer.endY - pointer2.endY);
        var z1 = Math.sqrt(x1 * x1 + y1 * y1);
        var z2 = Math.sqrt(x2 * x2 + y2 * y2);
        var ratio = (z2 - z1) / z1;
        ratios.push(ratio);
      });
    });
    ratios.sort(function (a, b) {
      return Math.abs(a) < Math.abs(b);
    });
    return ratios[0];
  }
  /**
   * Get a pointer from an event object.
   * @param {Object} event - The target event object.
   * @param {boolean} endOnly - Indicates if only returns the end point coordinate or not.
   * @returns {Object} The result pointer contains start and/or end point coordinates.
   */

  function getPointer(_ref2, endOnly) {
    var pageX = _ref2.pageX,
        pageY = _ref2.pageY;
    var end = {
      endX: pageX,
      endY: pageY
    };
    return endOnly ? end : _objectSpread2({
      startX: pageX,
      startY: pageY
    }, end);
  }
  /**
   * Get the center point coordinate of a group of pointers.
   * @param {Object} pointers - The target pointers.
   * @returns {Object} The center point coordinate.
   */

  function getPointersCenter(pointers) {
    var pageX = 0;
    var pageY = 0;
    var count = 0;
    forEach(pointers, function (_ref3) {
      var startX = _ref3.startX,
          startY = _ref3.startY;
      pageX += startX;
      pageY += startY;
      count += 1;
    });
    pageX /= count;
    pageY /= count;
    return {
      pageX: pageX,
      pageY: pageY
    };
  }
  /**
   * Get the max sizes in a rectangle under the given aspect ratio.
   * @param {Object} data - The original sizes.
   * @param {string} [type='contain'] - The adjust type.
   * @returns {Object} The result sizes.
   */

  function getAdjustedSizes(_ref4) // or 'cover'
  {
    var aspectRatio = _ref4.aspectRatio,
        height = _ref4.height,
        width = _ref4.width;
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'contain';
    var isValidWidth = isPositiveNumber(width);
    var isValidHeight = isPositiveNumber(height);

    if (isValidWidth && isValidHeight) {
      var adjustedWidth = height * aspectRatio;

      if (type === 'contain' && adjustedWidth > width || type === 'cover' && adjustedWidth < width) {
        height = width / aspectRatio;
      } else {
        width = height * aspectRatio;
      }
    } else if (isValidWidth) {
      height = width / aspectRatio;
    } else if (isValidHeight) {
      width = height * aspectRatio;
    }

    return {
      width: width,
      height: height
    };
  }
  /**
   * Get the new sizes of a rectangle after rotated.
   * @param {Object} data - The original sizes.
   * @returns {Object} The result sizes.
   */

  function getRotatedSizes(_ref5) {
    var width = _ref5.width,
        height = _ref5.height,
        degree = _ref5.degree;
    degree = Math.abs(degree) % 180;

    if (degree === 90) {
      return {
        width: height,
        height: width
      };
    }

    var arc = degree % 90 * Math.PI / 180;
    var sinArc = Math.sin(arc);
    var cosArc = Math.cos(arc);
    var newWidth = width * cosArc + height * sinArc;
    var newHeight = width * sinArc + height * cosArc;
    return degree > 90 ? {
      width: newHeight,
      height: newWidth
    } : {
      width: newWidth,
      height: newHeight
    };
  }
  /**
   * Get a canvas which drew the given image.
   * @param {HTMLImageElement} image - The image for drawing.
   * @param {Object} imageData - The image data.
   * @param {Object} canvasData - The canvas data.
   * @param {Object} options - The options.
   * @returns {HTMLCanvasElement} The result canvas.
   */

  function getSourceCanvas(image, _ref6, _ref7, _ref8) {
    var imageAspectRatio = _ref6.aspectRatio,
        imageNaturalWidth = _ref6.naturalWidth,
        imageNaturalHeight = _ref6.naturalHeight,
        _ref6$rotate = _ref6.rotate,
        rotate = _ref6$rotate === void 0 ? 0 : _ref6$rotate,
        _ref6$scaleX = _ref6.scaleX,
        scaleX = _ref6$scaleX === void 0 ? 1 : _ref6$scaleX,
        _ref6$scaleY = _ref6.scaleY,
        scaleY = _ref6$scaleY === void 0 ? 1 : _ref6$scaleY;
    var aspectRatio = _ref7.aspectRatio,
        naturalWidth = _ref7.naturalWidth,
        naturalHeight = _ref7.naturalHeight;
    var _ref8$fillColor = _ref8.fillColor,
        fillColor = _ref8$fillColor === void 0 ? 'transparent' : _ref8$fillColor,
        _ref8$imageSmoothingE = _ref8.imageSmoothingEnabled,
        imageSmoothingEnabled = _ref8$imageSmoothingE === void 0 ? true : _ref8$imageSmoothingE,
        _ref8$imageSmoothingQ = _ref8.imageSmoothingQuality,
        imageSmoothingQuality = _ref8$imageSmoothingQ === void 0 ? 'low' : _ref8$imageSmoothingQ,
        _ref8$maxWidth = _ref8.maxWidth,
        maxWidth = _ref8$maxWidth === void 0 ? Infinity : _ref8$maxWidth,
        _ref8$maxHeight = _ref8.maxHeight,
        maxHeight = _ref8$maxHeight === void 0 ? Infinity : _ref8$maxHeight,
        _ref8$minWidth = _ref8.minWidth,
        minWidth = _ref8$minWidth === void 0 ? 0 : _ref8$minWidth,
        _ref8$minHeight = _ref8.minHeight,
        minHeight = _ref8$minHeight === void 0 ? 0 : _ref8$minHeight;
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var maxSizes = getAdjustedSizes({
      aspectRatio: aspectRatio,
      width: maxWidth,
      height: maxHeight
    });
    var minSizes = getAdjustedSizes({
      aspectRatio: aspectRatio,
      width: minWidth,
      height: minHeight
    }, 'cover');
    var width = Math.min(maxSizes.width, Math.max(minSizes.width, naturalWidth));
    var height = Math.min(maxSizes.height, Math.max(minSizes.height, naturalHeight)); // Note: should always use image's natural sizes for drawing as
    // imageData.naturalWidth === canvasData.naturalHeight when rotate % 180 === 90

    var destMaxSizes = getAdjustedSizes({
      aspectRatio: imageAspectRatio,
      width: maxWidth,
      height: maxHeight
    });
    var destMinSizes = getAdjustedSizes({
      aspectRatio: imageAspectRatio,
      width: minWidth,
      height: minHeight
    }, 'cover');
    var destWidth = Math.min(destMaxSizes.width, Math.max(destMinSizes.width, imageNaturalWidth));
    var destHeight = Math.min(destMaxSizes.height, Math.max(destMinSizes.height, imageNaturalHeight));
    var params = [-destWidth / 2, -destHeight / 2, destWidth, destHeight];
    canvas.width = normalizeDecimalNumber(width);
    canvas.height = normalizeDecimalNumber(height);
    context.fillStyle = fillColor;
    context.fillRect(0, 0, width, height);
    context.save();
    context.translate(width / 2, height / 2);
    context.rotate(rotate * Math.PI / 180);
    context.scale(scaleX, scaleY);
    context.imageSmoothingEnabled = imageSmoothingEnabled;
    context.imageSmoothingQuality = imageSmoothingQuality;
    context.drawImage.apply(context, [image].concat(_toConsumableArray(params.map(function (param) {
      return Math.floor(normalizeDecimalNumber(param));
    }))));
    context.restore();
    return canvas;
  }
  var fromCharCode = String.fromCharCode;
  /**
   * Get string from char code in data view.
   * @param {DataView} dataView - The data view for read.
   * @param {number} start - The start index.
   * @param {number} length - The read length.
   * @returns {string} The read result.
   */

  function getStringFromCharCode(dataView, start, length) {
    var str = '';
    length += start;

    for (var i = start; i < length; i += 1) {
      str += fromCharCode(dataView.getUint8(i));
    }

    return str;
  }
  var REGEXP_DATA_URL_HEAD = /^data:.*,/;
  /**
   * Transform Data URL to array buffer.
   * @param {string} dataURL - The Data URL to transform.
   * @returns {ArrayBuffer} The result array buffer.
   */

  function dataURLToArrayBuffer(dataURL) {
    var base64 = dataURL.replace(REGEXP_DATA_URL_HEAD, '');
    var binary = atob(base64);
    var arrayBuffer = new ArrayBuffer(binary.length);
    var uint8 = new Uint8Array(arrayBuffer);
    forEach(uint8, function (value, i) {
      uint8[i] = binary.charCodeAt(i);
    });
    return arrayBuffer;
  }
  /**
   * Transform array buffer to Data URL.
   * @param {ArrayBuffer} arrayBuffer - The array buffer to transform.
   * @param {string} mimeType - The mime type of the Data URL.
   * @returns {string} The result Data URL.
   */

  function arrayBufferToDataURL(arrayBuffer, mimeType) {
    var chunks = []; // Chunk Typed Array for better performance (#435)

    var chunkSize = 8192;
    var uint8 = new Uint8Array(arrayBuffer);

    while (uint8.length > 0) {
      // XXX: Babel's `toConsumableArray` helper will throw error in IE or Safari 9
      // eslint-disable-next-line prefer-spread
      chunks.push(fromCharCode.apply(null, toArray(uint8.subarray(0, chunkSize))));
      uint8 = uint8.subarray(chunkSize);
    }

    return "data:".concat(mimeType, ";base64,").concat(btoa(chunks.join('')));
  }
  /**
   * Get orientation value from given array buffer.
   * @param {ArrayBuffer} arrayBuffer - The array buffer to read.
   * @returns {number} The read orientation value.
   */

  function resetAndGetOrientation(arrayBuffer) {
    var dataView = new DataView(arrayBuffer);
    var orientation; // Ignores range error when the image does not have correct Exif information

    try {
      var littleEndian;
      var app1Start;
      var ifdStart; // Only handle JPEG image (start by 0xFFD8)

      if (dataView.getUint8(0) === 0xFF && dataView.getUint8(1) === 0xD8) {
        var length = dataView.byteLength;
        var offset = 2;

        while (offset + 1 < length) {
          if (dataView.getUint8(offset) === 0xFF && dataView.getUint8(offset + 1) === 0xE1) {
            app1Start = offset;
            break;
          }

          offset += 1;
        }
      }

      if (app1Start) {
        var exifIDCode = app1Start + 4;
        var tiffOffset = app1Start + 10;

        if (getStringFromCharCode(dataView, exifIDCode, 4) === 'Exif') {
          var endianness = dataView.getUint16(tiffOffset);
          littleEndian = endianness === 0x4949;

          if (littleEndian || endianness === 0x4D4D
          /* bigEndian */
          ) {
              if (dataView.getUint16(tiffOffset + 2, littleEndian) === 0x002A) {
                var firstIFDOffset = dataView.getUint32(tiffOffset + 4, littleEndian);

                if (firstIFDOffset >= 0x00000008) {
                  ifdStart = tiffOffset + firstIFDOffset;
                }
              }
            }
        }
      }

      if (ifdStart) {
        var _length = dataView.getUint16(ifdStart, littleEndian);

        var _offset;

        var i;

        for (i = 0; i < _length; i += 1) {
          _offset = ifdStart + i * 12 + 2;

          if (dataView.getUint16(_offset, littleEndian) === 0x0112
          /* Orientation */
          ) {
              // 8 is the offset of the current tag's value
              _offset += 8; // Get the original orientation value

              orientation = dataView.getUint16(_offset, littleEndian); // Override the orientation with its default value

              dataView.setUint16(_offset, 1, littleEndian);
              break;
            }
        }
      }
    } catch (error) {
      orientation = 1;
    }

    return orientation;
  }
  /**
   * Parse Exif Orientation value.
   * @param {number} orientation - The orientation to parse.
   * @returns {Object} The parsed result.
   */

  function parseOrientation(orientation) {
    var rotate = 0;
    var scaleX = 1;
    var scaleY = 1;

    switch (orientation) {
      // Flip horizontal
      case 2:
        scaleX = -1;
        break;
      // Rotate left 180°

      case 3:
        rotate = -180;
        break;
      // Flip vertical

      case 4:
        scaleY = -1;
        break;
      // Flip vertical and rotate right 90°

      case 5:
        rotate = 90;
        scaleY = -1;
        break;
      // Rotate right 90°

      case 6:
        rotate = 90;
        break;
      // Flip horizontal and rotate right 90°

      case 7:
        rotate = 90;
        scaleX = -1;
        break;
      // Rotate left 90°

      case 8:
        rotate = -90;
        break;
    }

    return {
      rotate: rotate,
      scaleX: scaleX,
      scaleY: scaleY
    };
  }

  var render = {
    render: function render() {
      this.initContainer();
      this.initCanvas();
      this.initCropBox();
      this.renderCanvas();

      if (this.cropped) {
        this.renderCropBox();
      }
    },
    initContainer: function initContainer() {
      var element = this.element,
          options = this.options,
          container = this.container,
          cropper = this.cropper;
      addClass(cropper, CLASS_HIDDEN);
      removeClass(element, CLASS_HIDDEN);
      var containerData = {
        width: Math.max(container.offsetWidth, Number(options.minContainerWidth) || 200),
        height: Math.max(container.offsetHeight, Number(options.minContainerHeight) || 100)
      };
      this.containerData = containerData;
      setStyle(cropper, {
        width: containerData.width,
        height: containerData.height
      });
      addClass(element, CLASS_HIDDEN);
      removeClass(cropper, CLASS_HIDDEN);
    },
    // Canvas (image wrapper)
    initCanvas: function initCanvas() {
      var containerData = this.containerData,
          imageData = this.imageData;
      var viewMode = this.options.viewMode;
      var rotated = Math.abs(imageData.rotate) % 180 === 90;
      var naturalWidth = rotated ? imageData.naturalHeight : imageData.naturalWidth;
      var naturalHeight = rotated ? imageData.naturalWidth : imageData.naturalHeight;
      var aspectRatio = naturalWidth / naturalHeight;
      var canvasWidth = containerData.width;
      var canvasHeight = containerData.height;

      if (containerData.height * aspectRatio > containerData.width) {
        if (viewMode === 3) {
          canvasWidth = containerData.height * aspectRatio;
        } else {
          canvasHeight = containerData.width / aspectRatio;
        }
      } else if (viewMode === 3) {
        canvasHeight = containerData.width / aspectRatio;
      } else {
        canvasWidth = containerData.height * aspectRatio;
      }

      var canvasData = {
        aspectRatio: aspectRatio,
        naturalWidth: naturalWidth,
        naturalHeight: naturalHeight,
        width: canvasWidth,
        height: canvasHeight
      };
      canvasData.left = (containerData.width - canvasWidth) / 2;
      canvasData.top = (containerData.height - canvasHeight) / 2;
      canvasData.oldLeft = canvasData.left;
      canvasData.oldTop = canvasData.top;
      this.canvasData = canvasData;
      this.limited = viewMode === 1 || viewMode === 2;
      this.limitCanvas(true, true);
      this.initialImageData = assign({}, imageData);
      this.initialCanvasData = assign({}, canvasData);
    },
    limitCanvas: function limitCanvas(sizeLimited, positionLimited) {
      var options = this.options,
          containerData = this.containerData,
          canvasData = this.canvasData,
          cropBoxData = this.cropBoxData;
      var viewMode = options.viewMode;
      var aspectRatio = canvasData.aspectRatio;
      var cropped = this.cropped && cropBoxData;

      if (sizeLimited) {
        var minCanvasWidth = Number(options.minCanvasWidth) || 0;
        var minCanvasHeight = Number(options.minCanvasHeight) || 0;

        if (viewMode > 1) {
          minCanvasWidth = Math.max(minCanvasWidth, containerData.width);
          minCanvasHeight = Math.max(minCanvasHeight, containerData.height);

          if (viewMode === 3) {
            if (minCanvasHeight * aspectRatio > minCanvasWidth) {
              minCanvasWidth = minCanvasHeight * aspectRatio;
            } else {
              minCanvasHeight = minCanvasWidth / aspectRatio;
            }
          }
        } else if (viewMode > 0) {
          if (minCanvasWidth) {
            minCanvasWidth = Math.max(minCanvasWidth, cropped ? cropBoxData.width : 0);
          } else if (minCanvasHeight) {
            minCanvasHeight = Math.max(minCanvasHeight, cropped ? cropBoxData.height : 0);
          } else if (cropped) {
            minCanvasWidth = cropBoxData.width;
            minCanvasHeight = cropBoxData.height;

            if (minCanvasHeight * aspectRatio > minCanvasWidth) {
              minCanvasWidth = minCanvasHeight * aspectRatio;
            } else {
              minCanvasHeight = minCanvasWidth / aspectRatio;
            }
          }
        }

        var _getAdjustedSizes = getAdjustedSizes({
          aspectRatio: aspectRatio,
          width: minCanvasWidth,
          height: minCanvasHeight
        });

        minCanvasWidth = _getAdjustedSizes.width;
        minCanvasHeight = _getAdjustedSizes.height;
        canvasData.minWidth = minCanvasWidth;
        canvasData.minHeight = minCanvasHeight;
        canvasData.maxWidth = Infinity;
        canvasData.maxHeight = Infinity;
      }

      if (positionLimited) {
        if (viewMode > (cropped ? 0 : 1)) {
          var newCanvasLeft = containerData.width - canvasData.width;
          var newCanvasTop = containerData.height - canvasData.height;
          canvasData.minLeft = Math.min(0, newCanvasLeft);
          canvasData.minTop = Math.min(0, newCanvasTop);
          canvasData.maxLeft = Math.max(0, newCanvasLeft);
          canvasData.maxTop = Math.max(0, newCanvasTop);

          if (cropped && this.limited) {
            canvasData.minLeft = Math.min(cropBoxData.left, cropBoxData.left + (cropBoxData.width - canvasData.width));
            canvasData.minTop = Math.min(cropBoxData.top, cropBoxData.top + (cropBoxData.height - canvasData.height));
            canvasData.maxLeft = cropBoxData.left;
            canvasData.maxTop = cropBoxData.top;

            if (viewMode === 2) {
              if (canvasData.width >= containerData.width) {
                canvasData.minLeft = Math.min(0, newCanvasLeft);
                canvasData.maxLeft = Math.max(0, newCanvasLeft);
              }

              if (canvasData.height >= containerData.height) {
                canvasData.minTop = Math.min(0, newCanvasTop);
                canvasData.maxTop = Math.max(0, newCanvasTop);
              }
            }
          }
        } else {
          canvasData.minLeft = -canvasData.width;
          canvasData.minTop = -canvasData.height;
          canvasData.maxLeft = containerData.width;
          canvasData.maxTop = containerData.height;
        }
      }
    },
    renderCanvas: function renderCanvas(changed, transformed) {
      var canvasData = this.canvasData,
          imageData = this.imageData;

      if (transformed) {
        var _getRotatedSizes = getRotatedSizes({
          width: imageData.naturalWidth * Math.abs(imageData.scaleX || 1),
          height: imageData.naturalHeight * Math.abs(imageData.scaleY || 1),
          degree: imageData.rotate || 0
        }),
            naturalWidth = _getRotatedSizes.width,
            naturalHeight = _getRotatedSizes.height;

        var width = canvasData.width * (naturalWidth / canvasData.naturalWidth);
        var height = canvasData.height * (naturalHeight / canvasData.naturalHeight);
        canvasData.left -= (width - canvasData.width) / 2;
        canvasData.top -= (height - canvasData.height) / 2;
        canvasData.width = width;
        canvasData.height = height;
        canvasData.aspectRatio = naturalWidth / naturalHeight;
        canvasData.naturalWidth = naturalWidth;
        canvasData.naturalHeight = naturalHeight;
        this.limitCanvas(true, false);
      }

      if (canvasData.width > canvasData.maxWidth || canvasData.width < canvasData.minWidth) {
        canvasData.left = canvasData.oldLeft;
      }

      if (canvasData.height > canvasData.maxHeight || canvasData.height < canvasData.minHeight) {
        canvasData.top = canvasData.oldTop;
      }

      canvasData.width = Math.min(Math.max(canvasData.width, canvasData.minWidth), canvasData.maxWidth);
      canvasData.height = Math.min(Math.max(canvasData.height, canvasData.minHeight), canvasData.maxHeight);
      this.limitCanvas(false, true);
      canvasData.left = Math.min(Math.max(canvasData.left, canvasData.minLeft), canvasData.maxLeft);
      canvasData.top = Math.min(Math.max(canvasData.top, canvasData.minTop), canvasData.maxTop);
      canvasData.oldLeft = canvasData.left;
      canvasData.oldTop = canvasData.top;
      setStyle(this.canvas, assign({
        width: canvasData.width,
        height: canvasData.height
      }, getTransforms({
        translateX: canvasData.left,
        translateY: canvasData.top
      })));
      this.renderImage(changed);

      if (this.cropped && this.limited) {
        this.limitCropBox(true, true);
      }
    },
    renderImage: function renderImage(changed) {
      var canvasData = this.canvasData,
          imageData = this.imageData;
      var width = imageData.naturalWidth * (canvasData.width / canvasData.naturalWidth);
      var height = imageData.naturalHeight * (canvasData.height / canvasData.naturalHeight);
      assign(imageData, {
        width: width,
        height: height,
        left: (canvasData.width - width) / 2,
        top: (canvasData.height - height) / 2
      });
      setStyle(this.image, assign({
        width: imageData.width,
        height: imageData.height
      }, getTransforms(assign({
        translateX: imageData.left,
        translateY: imageData.top
      }, imageData))));

      if (changed) {
        this.output();
      }
    },
    initCropBox: function initCropBox() {
      var options = this.options,
          canvasData = this.canvasData;
      var aspectRatio = options.aspectRatio || options.initialAspectRatio;
      var autoCropArea = Number(options.autoCropArea) || 0.8;
      var cropBoxData = {
        width: canvasData.width,
        height: canvasData.height
      };

      if (aspectRatio) {
        if (canvasData.height * aspectRatio > canvasData.width) {
          cropBoxData.height = cropBoxData.width / aspectRatio;
        } else {
          cropBoxData.width = cropBoxData.height * aspectRatio;
        }
      }

      this.cropBoxData = cropBoxData;
      this.limitCropBox(true, true); // Initialize auto crop area

      cropBoxData.width = Math.min(Math.max(cropBoxData.width, cropBoxData.minWidth), cropBoxData.maxWidth);
      cropBoxData.height = Math.min(Math.max(cropBoxData.height, cropBoxData.minHeight), cropBoxData.maxHeight); // The width/height of auto crop area must large than "minWidth/Height"

      cropBoxData.width = Math.max(cropBoxData.minWidth, cropBoxData.width * autoCropArea);
      cropBoxData.height = Math.max(cropBoxData.minHeight, cropBoxData.height * autoCropArea);
      cropBoxData.left = canvasData.left + (canvasData.width - cropBoxData.width) / 2;
      cropBoxData.top = canvasData.top + (canvasData.height - cropBoxData.height) / 2;
      cropBoxData.oldLeft = cropBoxData.left;
      cropBoxData.oldTop = cropBoxData.top;
      this.initialCropBoxData = assign({}, cropBoxData);
    },
    limitCropBox: function limitCropBox(sizeLimited, positionLimited) {
      var options = this.options,
          containerData = this.containerData,
          canvasData = this.canvasData,
          cropBoxData = this.cropBoxData,
          limited = this.limited;
      var aspectRatio = options.aspectRatio;

      if (sizeLimited) {
        var minCropBoxWidth = Number(options.minCropBoxWidth) || 0;
        var minCropBoxHeight = Number(options.minCropBoxHeight) || 0;
        var maxCropBoxWidth = limited ? Math.min(containerData.width, canvasData.width, canvasData.width + canvasData.left, containerData.width - canvasData.left) : containerData.width;
        var maxCropBoxHeight = limited ? Math.min(containerData.height, canvasData.height, canvasData.height + canvasData.top, containerData.height - canvasData.top) : containerData.height; // The min/maxCropBoxWidth/Height must be less than container's width/height

        minCropBoxWidth = Math.min(minCropBoxWidth, containerData.width);
        minCropBoxHeight = Math.min(minCropBoxHeight, containerData.height);

        if (aspectRatio) {
          if (minCropBoxWidth && minCropBoxHeight) {
            if (minCropBoxHeight * aspectRatio > minCropBoxWidth) {
              minCropBoxHeight = minCropBoxWidth / aspectRatio;
            } else {
              minCropBoxWidth = minCropBoxHeight * aspectRatio;
            }
          } else if (minCropBoxWidth) {
            minCropBoxHeight = minCropBoxWidth / aspectRatio;
          } else if (minCropBoxHeight) {
            minCropBoxWidth = minCropBoxHeight * aspectRatio;
          }

          if (maxCropBoxHeight * aspectRatio > maxCropBoxWidth) {
            maxCropBoxHeight = maxCropBoxWidth / aspectRatio;
          } else {
            maxCropBoxWidth = maxCropBoxHeight * aspectRatio;
          }
        } // The minWidth/Height must be less than maxWidth/Height


        cropBoxData.minWidth = Math.min(minCropBoxWidth, maxCropBoxWidth);
        cropBoxData.minHeight = Math.min(minCropBoxHeight, maxCropBoxHeight);
        cropBoxData.maxWidth = maxCropBoxWidth;
        cropBoxData.maxHeight = maxCropBoxHeight;
      }

      if (positionLimited) {
        if (limited) {
          cropBoxData.minLeft = Math.max(0, canvasData.left);
          cropBoxData.minTop = Math.max(0, canvasData.top);
          cropBoxData.maxLeft = Math.min(containerData.width, canvasData.left + canvasData.width) - cropBoxData.width;
          cropBoxData.maxTop = Math.min(containerData.height, canvasData.top + canvasData.height) - cropBoxData.height;
        } else {
          cropBoxData.minLeft = 0;
          cropBoxData.minTop = 0;
          cropBoxData.maxLeft = containerData.width - cropBoxData.width;
          cropBoxData.maxTop = containerData.height - cropBoxData.height;
        }
      }
    },
    renderCropBox: function renderCropBox() {
      var options = this.options,
          containerData = this.containerData,
          cropBoxData = this.cropBoxData;

      if (cropBoxData.width > cropBoxData.maxWidth || cropBoxData.width < cropBoxData.minWidth) {
        cropBoxData.left = cropBoxData.oldLeft;
      }

      if (cropBoxData.height > cropBoxData.maxHeight || cropBoxData.height < cropBoxData.minHeight) {
        cropBoxData.top = cropBoxData.oldTop;
      }

      cropBoxData.width = Math.min(Math.max(cropBoxData.width, cropBoxData.minWidth), cropBoxData.maxWidth);
      cropBoxData.height = Math.min(Math.max(cropBoxData.height, cropBoxData.minHeight), cropBoxData.maxHeight);
      this.limitCropBox(false, true);
      cropBoxData.left = Math.min(Math.max(cropBoxData.left, cropBoxData.minLeft), cropBoxData.maxLeft);
      cropBoxData.top = Math.min(Math.max(cropBoxData.top, cropBoxData.minTop), cropBoxData.maxTop);
      cropBoxData.oldLeft = cropBoxData.left;
      cropBoxData.oldTop = cropBoxData.top;

      if (options.movable && options.cropBoxMovable) {
        // Turn to move the canvas when the crop box is equal to the container
        setData(this.face, DATA_ACTION, cropBoxData.width >= containerData.width && cropBoxData.height >= containerData.height ? ACTION_MOVE : ACTION_ALL);
      }

      setStyle(this.cropBox, assign({
        width: cropBoxData.width,
        height: cropBoxData.height
      }, getTransforms({
        translateX: cropBoxData.left,
        translateY: cropBoxData.top
      })));

      if (this.cropped && this.limited) {
        this.limitCanvas(true, true);
      }

      if (!this.disabled) {
        this.output();
      }
    },
    output: function output() {
      this.preview();
      dispatchEvent(this.element, EVENT_CROP, this.getData());
    }
  };

  var preview = {
    initPreview: function initPreview() {
      var element = this.element,
          crossOrigin = this.crossOrigin;
      var preview = this.options.preview;
      var url = crossOrigin ? this.crossOriginUrl : this.url;
      var alt = element.alt || 'The image to preview';
      var image = document.createElement('img');

      if (crossOrigin) {
        image.crossOrigin = crossOrigin;
      }

      image.src = url;
      image.alt = alt;
      this.viewBox.appendChild(image);
      this.viewBoxImage = image;

      if (!preview) {
        return;
      }

      var previews = preview;

      if (typeof preview === 'string') {
        previews = element.ownerDocument.querySelectorAll(preview);
      } else if (preview.querySelector) {
        previews = [preview];
      }

      this.previews = previews;
      forEach(previews, function (el) {
        var img = document.createElement('img'); // Save the original size for recover

        setData(el, DATA_PREVIEW, {
          width: el.offsetWidth,
          height: el.offsetHeight,
          html: el.innerHTML
        });

        if (crossOrigin) {
          img.crossOrigin = crossOrigin;
        }

        img.src = url;
        img.alt = alt;
        /**
         * Override img element styles
         * Add `display:block` to avoid margin top issue
         * Add `height:auto` to override `height` attribute on IE8
         * (Occur only when margin-top <= -height)
         */

        img.style.cssText = 'display:block;' + 'width:100%;' + 'height:auto;' + 'min-width:0!important;' + 'min-height:0!important;' + 'max-width:none!important;' + 'max-height:none!important;' + 'image-orientation:0deg!important;"';
        el.innerHTML = '';
        el.appendChild(img);
      });
    },
    resetPreview: function resetPreview() {
      forEach(this.previews, function (element) {
        var data = getData(element, DATA_PREVIEW);
        setStyle(element, {
          width: data.width,
          height: data.height
        });
        element.innerHTML = data.html;
        removeData(element, DATA_PREVIEW);
      });
    },
    preview: function preview() {
      var imageData = this.imageData,
          canvasData = this.canvasData,
          cropBoxData = this.cropBoxData;
      var cropBoxWidth = cropBoxData.width,
          cropBoxHeight = cropBoxData.height;
      var width = imageData.width,
          height = imageData.height;
      var left = cropBoxData.left - canvasData.left - imageData.left;
      var top = cropBoxData.top - canvasData.top - imageData.top;

      if (!this.cropped || this.disabled) {
        return;
      }

      setStyle(this.viewBoxImage, assign({
        width: width,
        height: height
      }, getTransforms(assign({
        translateX: -left,
        translateY: -top
      }, imageData))));
      forEach(this.previews, function (element) {
        var data = getData(element, DATA_PREVIEW);
        var originalWidth = data.width;
        var originalHeight = data.height;
        var newWidth = originalWidth;
        var newHeight = originalHeight;
        var ratio = 1;

        if (cropBoxWidth) {
          ratio = originalWidth / cropBoxWidth;
          newHeight = cropBoxHeight * ratio;
        }

        if (cropBoxHeight && newHeight > originalHeight) {
          ratio = originalHeight / cropBoxHeight;
          newWidth = cropBoxWidth * ratio;
          newHeight = originalHeight;
        }

        setStyle(element, {
          width: newWidth,
          height: newHeight
        });
        setStyle(element.getElementsByTagName('img')[0], assign({
          width: width * ratio,
          height: height * ratio
        }, getTransforms(assign({
          translateX: -left * ratio,
          translateY: -top * ratio
        }, imageData))));
      });
    }
  };

  var events = {
    bind: function bind() {
      var element = this.element,
          options = this.options,
          cropper = this.cropper;

      if (isFunction(options.cropstart)) {
        addListener(element, EVENT_CROP_START, options.cropstart);
      }

      if (isFunction(options.cropmove)) {
        addListener(element, EVENT_CROP_MOVE, options.cropmove);
      }

      if (isFunction(options.cropend)) {
        addListener(element, EVENT_CROP_END, options.cropend);
      }

      if (isFunction(options.crop)) {
        addListener(element, EVENT_CROP, options.crop);
      }

      if (isFunction(options.zoom)) {
        addListener(element, EVENT_ZOOM, options.zoom);
      }

      addListener(cropper, EVENT_POINTER_DOWN, this.onCropStart = this.cropStart.bind(this));

      if (options.zoomable && options.zoomOnWheel) {
        addListener(cropper, EVENT_WHEEL, this.onWheel = this.wheel.bind(this), {
          passive: false,
          capture: true
        });
      }

      if (options.toggleDragModeOnDblclick) {
        addListener(cropper, EVENT_DBLCLICK, this.onDblclick = this.dblclick.bind(this));
      }

      addListener(element.ownerDocument, EVENT_POINTER_MOVE, this.onCropMove = this.cropMove.bind(this));
      addListener(element.ownerDocument, EVENT_POINTER_UP, this.onCropEnd = this.cropEnd.bind(this));

      if (options.responsive) {
        addListener(window, EVENT_RESIZE, this.onResize = this.resize.bind(this));
      }
    },
    unbind: function unbind() {
      var element = this.element,
          options = this.options,
          cropper = this.cropper;

      if (isFunction(options.cropstart)) {
        removeListener(element, EVENT_CROP_START, options.cropstart);
      }

      if (isFunction(options.cropmove)) {
        removeListener(element, EVENT_CROP_MOVE, options.cropmove);
      }

      if (isFunction(options.cropend)) {
        removeListener(element, EVENT_CROP_END, options.cropend);
      }

      if (isFunction(options.crop)) {
        removeListener(element, EVENT_CROP, options.crop);
      }

      if (isFunction(options.zoom)) {
        removeListener(element, EVENT_ZOOM, options.zoom);
      }

      removeListener(cropper, EVENT_POINTER_DOWN, this.onCropStart);

      if (options.zoomable && options.zoomOnWheel) {
        removeListener(cropper, EVENT_WHEEL, this.onWheel, {
          passive: false,
          capture: true
        });
      }

      if (options.toggleDragModeOnDblclick) {
        removeListener(cropper, EVENT_DBLCLICK, this.onDblclick);
      }

      removeListener(element.ownerDocument, EVENT_POINTER_MOVE, this.onCropMove);
      removeListener(element.ownerDocument, EVENT_POINTER_UP, this.onCropEnd);

      if (options.responsive) {
        removeListener(window, EVENT_RESIZE, this.onResize);
      }
    }
  };

  var handlers = {
    resize: function resize() {
      if (this.disabled) {
        return;
      }

      var options = this.options,
          container = this.container,
          containerData = this.containerData;
      var ratio = container.offsetWidth / containerData.width; // Resize when width changed or height changed

      if (ratio !== 1 || container.offsetHeight !== containerData.height) {
        var canvasData;
        var cropBoxData;

        if (options.restore) {
          canvasData = this.getCanvasData();
          cropBoxData = this.getCropBoxData();
        }

        this.render();

        if (options.restore) {
          this.setCanvasData(forEach(canvasData, function (n, i) {
            canvasData[i] = n * ratio;
          }));
          this.setCropBoxData(forEach(cropBoxData, function (n, i) {
            cropBoxData[i] = n * ratio;
          }));
        }
      }
    },
    dblclick: function dblclick() {
      if (this.disabled || this.options.dragMode === DRAG_MODE_NONE) {
        return;
      }

      this.setDragMode(hasClass(this.dragBox, CLASS_CROP) ? DRAG_MODE_MOVE : DRAG_MODE_CROP);
    },
    wheel: function wheel(event) {
      var _this = this;

      var ratio = Number(this.options.wheelZoomRatio) || 0.1;
      var delta = 1;

      if (this.disabled) {
        return;
      }

      event.preventDefault(); // Limit wheel speed to prevent zoom too fast (#21)

      if (this.wheeling) {
        return;
      }

      this.wheeling = true;
      setTimeout(function () {
        _this.wheeling = false;
      }, 50);

      if (event.deltaY) {
        delta = event.deltaY > 0 ? 1 : -1;
      } else if (event.wheelDelta) {
        delta = -event.wheelDelta / 120;
      } else if (event.detail) {
        delta = event.detail > 0 ? 1 : -1;
      }

      this.zoom(-delta * ratio, event);
    },
    cropStart: function cropStart(event) {
      var buttons = event.buttons,
          button = event.button;

      if (this.disabled // Handle mouse event and pointer event and ignore touch event
      || (event.type === 'mousedown' || event.type === 'pointerdown' && event.pointerType === 'mouse') && ( // No primary button (Usually the left button)
      isNumber(buttons) && buttons !== 1 || isNumber(button) && button !== 0 // Open context menu
      || event.ctrlKey)) {
        return;
      }

      var options = this.options,
          pointers = this.pointers;
      var action;

      if (event.changedTouches) {
        // Handle touch event
        forEach(event.changedTouches, function (touch) {
          pointers[touch.identifier] = getPointer(touch);
        });
      } else {
        // Handle mouse event and pointer event
        pointers[event.pointerId || 0] = getPointer(event);
      }

      if (Object.keys(pointers).length > 1 && options.zoomable && options.zoomOnTouch) {
        action = ACTION_ZOOM;
      } else {
        action = getData(event.target, DATA_ACTION);
      }

      if (!REGEXP_ACTIONS.test(action)) {
        return;
      }

      if (dispatchEvent(this.element, EVENT_CROP_START, {
        originalEvent: event,
        action: action
      }) === false) {
        return;
      } // This line is required for preventing page zooming in iOS browsers


      event.preventDefault();
      this.action = action;
      this.cropping = false;

      if (action === ACTION_CROP) {
        this.cropping = true;
        addClass(this.dragBox, CLASS_MODAL);
      }
    },
    cropMove: function cropMove(event) {
      var action = this.action;

      if (this.disabled || !action) {
        return;
      }

      var pointers = this.pointers;
      event.preventDefault();

      if (dispatchEvent(this.element, EVENT_CROP_MOVE, {
        originalEvent: event,
        action: action
      }) === false) {
        return;
      }

      if (event.changedTouches) {
        forEach(event.changedTouches, function (touch) {
          // The first parameter should not be undefined (#432)
          assign(pointers[touch.identifier] || {}, getPointer(touch, true));
        });
      } else {
        assign(pointers[event.pointerId || 0] || {}, getPointer(event, true));
      }

      this.change(event);
    },
    cropEnd: function cropEnd(event) {
      if (this.disabled) {
        return;
      }

      var action = this.action,
          pointers = this.pointers;

      if (event.changedTouches) {
        forEach(event.changedTouches, function (touch) {
          delete pointers[touch.identifier];
        });
      } else {
        delete pointers[event.pointerId || 0];
      }

      if (!action) {
        return;
      }

      event.preventDefault();

      if (!Object.keys(pointers).length) {
        this.action = '';
      }

      if (this.cropping) {
        this.cropping = false;
        toggleClass(this.dragBox, CLASS_MODAL, this.cropped && this.options.modal);
      }

      dispatchEvent(this.element, EVENT_CROP_END, {
        originalEvent: event,
        action: action
      });
    }
  };

  var change = {
    change: function change(event) {
      var options = this.options,
          canvasData = this.canvasData,
          containerData = this.containerData,
          cropBoxData = this.cropBoxData,
          pointers = this.pointers;
      var action = this.action;
      var aspectRatio = options.aspectRatio;
      var left = cropBoxData.left,
          top = cropBoxData.top,
          width = cropBoxData.width,
          height = cropBoxData.height;
      var right = left + width;
      var bottom = top + height;
      var minLeft = 0;
      var minTop = 0;
      var maxWidth = containerData.width;
      var maxHeight = containerData.height;
      var renderable = true;
      var offset; // Locking aspect ratio in "free mode" by holding shift key

      if (!aspectRatio && event.shiftKey) {
        aspectRatio = width && height ? width / height : 1;
      }

      if (this.limited) {
        minLeft = cropBoxData.minLeft;
        minTop = cropBoxData.minTop;
        maxWidth = minLeft + Math.min(containerData.width, canvasData.width, canvasData.left + canvasData.width);
        maxHeight = minTop + Math.min(containerData.height, canvasData.height, canvasData.top + canvasData.height);
      }

      var pointer = pointers[Object.keys(pointers)[0]];
      var range = {
        x: pointer.endX - pointer.startX,
        y: pointer.endY - pointer.startY
      };

      var check = function check(side) {
        switch (side) {
          case ACTION_EAST:
            if (right + range.x > maxWidth) {
              range.x = maxWidth - right;
            }

            break;

          case ACTION_WEST:
            if (left + range.x < minLeft) {
              range.x = minLeft - left;
            }

            break;

          case ACTION_NORTH:
            if (top + range.y < minTop) {
              range.y = minTop - top;
            }

            break;

          case ACTION_SOUTH:
            if (bottom + range.y > maxHeight) {
              range.y = maxHeight - bottom;
            }

            break;
        }
      };

      switch (action) {
        // Move crop box
        case ACTION_ALL:
          left += range.x;
          top += range.y;
          break;
        // Resize crop box

        case ACTION_EAST:
          if (range.x >= 0 && (right >= maxWidth || aspectRatio && (top <= minTop || bottom >= maxHeight))) {
            renderable = false;
            break;
          }

          check(ACTION_EAST);
          width += range.x;

          if (width < 0) {
            action = ACTION_WEST;
            width = -width;
            left -= width;
          }

          if (aspectRatio) {
            height = width / aspectRatio;
            top += (cropBoxData.height - height) / 2;
          }

          break;

        case ACTION_NORTH:
          if (range.y <= 0 && (top <= minTop || aspectRatio && (left <= minLeft || right >= maxWidth))) {
            renderable = false;
            break;
          }

          check(ACTION_NORTH);
          height -= range.y;
          top += range.y;

          if (height < 0) {
            action = ACTION_SOUTH;
            height = -height;
            top -= height;
          }

          if (aspectRatio) {
            width = height * aspectRatio;
            left += (cropBoxData.width - width) / 2;
          }

          break;

        case ACTION_WEST:
          if (range.x <= 0 && (left <= minLeft || aspectRatio && (top <= minTop || bottom >= maxHeight))) {
            renderable = false;
            break;
          }

          check(ACTION_WEST);
          width -= range.x;
          left += range.x;

          if (width < 0) {
            action = ACTION_EAST;
            width = -width;
            left -= width;
          }

          if (aspectRatio) {
            height = width / aspectRatio;
            top += (cropBoxData.height - height) / 2;
          }

          break;

        case ACTION_SOUTH:
          if (range.y >= 0 && (bottom >= maxHeight || aspectRatio && (left <= minLeft || right >= maxWidth))) {
            renderable = false;
            break;
          }

          check(ACTION_SOUTH);
          height += range.y;

          if (height < 0) {
            action = ACTION_NORTH;
            height = -height;
            top -= height;
          }

          if (aspectRatio) {
            width = height * aspectRatio;
            left += (cropBoxData.width - width) / 2;
          }

          break;

        case ACTION_NORTH_EAST:
          if (aspectRatio) {
            if (range.y <= 0 && (top <= minTop || right >= maxWidth)) {
              renderable = false;
              break;
            }

            check(ACTION_NORTH);
            height -= range.y;
            top += range.y;
            width = height * aspectRatio;
          } else {
            check(ACTION_NORTH);
            check(ACTION_EAST);

            if (range.x >= 0) {
              if (right < maxWidth) {
                width += range.x;
              } else if (range.y <= 0 && top <= minTop) {
                renderable = false;
              }
            } else {
              width += range.x;
            }

            if (range.y <= 0) {
              if (top > minTop) {
                height -= range.y;
                top += range.y;
              }
            } else {
              height -= range.y;
              top += range.y;
            }
          }

          if (width < 0 && height < 0) {
            action = ACTION_SOUTH_WEST;
            height = -height;
            width = -width;
            top -= height;
            left -= width;
          } else if (width < 0) {
            action = ACTION_NORTH_WEST;
            width = -width;
            left -= width;
          } else if (height < 0) {
            action = ACTION_SOUTH_EAST;
            height = -height;
            top -= height;
          }

          break;

        case ACTION_NORTH_WEST:
          if (aspectRatio) {
            if (range.y <= 0 && (top <= minTop || left <= minLeft)) {
              renderable = false;
              break;
            }

            check(ACTION_NORTH);
            height -= range.y;
            top += range.y;
            width = height * aspectRatio;
            left += cropBoxData.width - width;
          } else {
            check(ACTION_NORTH);
            check(ACTION_WEST);

            if (range.x <= 0) {
              if (left > minLeft) {
                width -= range.x;
                left += range.x;
              } else if (range.y <= 0 && top <= minTop) {
                renderable = false;
              }
            } else {
              width -= range.x;
              left += range.x;
            }

            if (range.y <= 0) {
              if (top > minTop) {
                height -= range.y;
                top += range.y;
              }
            } else {
              height -= range.y;
              top += range.y;
            }
          }

          if (width < 0 && height < 0) {
            action = ACTION_SOUTH_EAST;
            height = -height;
            width = -width;
            top -= height;
            left -= width;
          } else if (width < 0) {
            action = ACTION_NORTH_EAST;
            width = -width;
            left -= width;
          } else if (height < 0) {
            action = ACTION_SOUTH_WEST;
            height = -height;
            top -= height;
          }

          break;

        case ACTION_SOUTH_WEST:
          if (aspectRatio) {
            if (range.x <= 0 && (left <= minLeft || bottom >= maxHeight)) {
              renderable = false;
              break;
            }

            check(ACTION_WEST);
            width -= range.x;
            left += range.x;
            height = width / aspectRatio;
          } else {
            check(ACTION_SOUTH);
            check(ACTION_WEST);

            if (range.x <= 0) {
              if (left > minLeft) {
                width -= range.x;
                left += range.x;
              } else if (range.y >= 0 && bottom >= maxHeight) {
                renderable = false;
              }
            } else {
              width -= range.x;
              left += range.x;
            }

            if (range.y >= 0) {
              if (bottom < maxHeight) {
                height += range.y;
              }
            } else {
              height += range.y;
            }
          }

          if (width < 0 && height < 0) {
            action = ACTION_NORTH_EAST;
            height = -height;
            width = -width;
            top -= height;
            left -= width;
          } else if (width < 0) {
            action = ACTION_SOUTH_EAST;
            width = -width;
            left -= width;
          } else if (height < 0) {
            action = ACTION_NORTH_WEST;
            height = -height;
            top -= height;
          }

          break;

        case ACTION_SOUTH_EAST:
          if (aspectRatio) {
            if (range.x >= 0 && (right >= maxWidth || bottom >= maxHeight)) {
              renderable = false;
              break;
            }

            check(ACTION_EAST);
            width += range.x;
            height = width / aspectRatio;
          } else {
            check(ACTION_SOUTH);
            check(ACTION_EAST);

            if (range.x >= 0) {
              if (right < maxWidth) {
                width += range.x;
              } else if (range.y >= 0 && bottom >= maxHeight) {
                renderable = false;
              }
            } else {
              width += range.x;
            }

            if (range.y >= 0) {
              if (bottom < maxHeight) {
                height += range.y;
              }
            } else {
              height += range.y;
            }
          }

          if (width < 0 && height < 0) {
            action = ACTION_NORTH_WEST;
            height = -height;
            width = -width;
            top -= height;
            left -= width;
          } else if (width < 0) {
            action = ACTION_SOUTH_WEST;
            width = -width;
            left -= width;
          } else if (height < 0) {
            action = ACTION_NORTH_EAST;
            height = -height;
            top -= height;
          }

          break;
        // Move canvas

        case ACTION_MOVE:
          this.move(range.x, range.y);
          renderable = false;
          break;
        // Zoom canvas

        case ACTION_ZOOM:
          this.zoom(getMaxZoomRatio(pointers), event);
          renderable = false;
          break;
        // Create crop box

        case ACTION_CROP:
          if (!range.x || !range.y) {
            renderable = false;
            break;
          }

          offset = getOffset(this.cropper);
          left = pointer.startX - offset.left;
          top = pointer.startY - offset.top;
          width = cropBoxData.minWidth;
          height = cropBoxData.minHeight;

          if (range.x > 0) {
            action = range.y > 0 ? ACTION_SOUTH_EAST : ACTION_NORTH_EAST;
          } else if (range.x < 0) {
            left -= width;
            action = range.y > 0 ? ACTION_SOUTH_WEST : ACTION_NORTH_WEST;
          }

          if (range.y < 0) {
            top -= height;
          } // Show the crop box if is hidden


          if (!this.cropped) {
            removeClass(this.cropBox, CLASS_HIDDEN);
            this.cropped = true;

            if (this.limited) {
              this.limitCropBox(true, true);
            }
          }

          break;
      }

      if (renderable) {
        cropBoxData.width = width;
        cropBoxData.height = height;
        cropBoxData.left = left;
        cropBoxData.top = top;
        this.action = action;
        this.renderCropBox();
      } // Override


      forEach(pointers, function (p) {
        p.startX = p.endX;
        p.startY = p.endY;
      });
    }
  };

  var methods = {
    // Show the crop box manually
    crop: function crop() {
      if (this.ready && !this.cropped && !this.disabled) {
        this.cropped = true;
        this.limitCropBox(true, true);

        if (this.options.modal) {
          addClass(this.dragBox, CLASS_MODAL);
        }

        removeClass(this.cropBox, CLASS_HIDDEN);
        this.setCropBoxData(this.initialCropBoxData);
      }

      return this;
    },
    // Reset the image and crop box to their initial states
    reset: function reset() {
      if (this.ready && !this.disabled) {
        this.imageData = assign({}, this.initialImageData);
        this.canvasData = assign({}, this.initialCanvasData);
        this.cropBoxData = assign({}, this.initialCropBoxData);
        this.renderCanvas();

        if (this.cropped) {
          this.renderCropBox();
        }
      }

      return this;
    },
    // Clear the crop box
    clear: function clear() {
      if (this.cropped && !this.disabled) {
        assign(this.cropBoxData, {
          left: 0,
          top: 0,
          width: 0,
          height: 0
        });
        this.cropped = false;
        this.renderCropBox();
        this.limitCanvas(true, true); // Render canvas after crop box rendered

        this.renderCanvas();
        removeClass(this.dragBox, CLASS_MODAL);
        addClass(this.cropBox, CLASS_HIDDEN);
      }

      return this;
    },

    /**
     * Replace the image's src and rebuild the cropper
     * @param {string} url - The new URL.
     * @param {boolean} [hasSameSize] - Indicate if the new image has the same size as the old one.
     * @returns {Cropper} this
     */
    replace: function replace(url) {
      var hasSameSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (!this.disabled && url) {
        if (this.isImg) {
          this.element.src = url;
        }

        if (hasSameSize) {
          this.url = url;
          this.image.src = url;

          if (this.ready) {
            this.viewBoxImage.src = url;
            forEach(this.previews, function (element) {
              element.getElementsByTagName('img')[0].src = url;
            });
          }
        } else {
          if (this.isImg) {
            this.replaced = true;
          }

          this.options.data = null;
          this.uncreate();
          this.load(url);
        }
      }

      return this;
    },
    // Enable (unfreeze) the cropper
    enable: function enable() {
      if (this.ready && this.disabled) {
        this.disabled = false;
        removeClass(this.cropper, CLASS_DISABLED);
      }

      return this;
    },
    // Disable (freeze) the cropper
    disable: function disable() {
      if (this.ready && !this.disabled) {
        this.disabled = true;
        addClass(this.cropper, CLASS_DISABLED);
      }

      return this;
    },

    /**
     * Destroy the cropper and remove the instance from the image
     * @returns {Cropper} this
     */
    destroy: function destroy() {
      var element = this.element;

      if (!element[NAMESPACE]) {
        return this;
      }

      element[NAMESPACE] = undefined;

      if (this.isImg && this.replaced) {
        element.src = this.originalUrl;
      }

      this.uncreate();
      return this;
    },

    /**
     * Move the canvas with relative offsets
     * @param {number} offsetX - The relative offset distance on the x-axis.
     * @param {number} [offsetY=offsetX] - The relative offset distance on the y-axis.
     * @returns {Cropper} this
     */
    move: function move(offsetX) {
      var offsetY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : offsetX;
      var _this$canvasData = this.canvasData,
          left = _this$canvasData.left,
          top = _this$canvasData.top;
      return this.moveTo(isUndefined(offsetX) ? offsetX : left + Number(offsetX), isUndefined(offsetY) ? offsetY : top + Number(offsetY));
    },

    /**
     * Move the canvas to an absolute point
     * @param {number} x - The x-axis coordinate.
     * @param {number} [y=x] - The y-axis coordinate.
     * @returns {Cropper} this
     */
    moveTo: function moveTo(x) {
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;
      var canvasData = this.canvasData;
      var changed = false;
      x = Number(x);
      y = Number(y);

      if (this.ready && !this.disabled && this.options.movable) {
        if (isNumber(x)) {
          canvasData.left = x;
          changed = true;
        }

        if (isNumber(y)) {
          canvasData.top = y;
          changed = true;
        }

        if (changed) {
          this.renderCanvas(true);
        }
      }

      return this;
    },

    /**
     * Zoom the canvas with a relative ratio
     * @param {number} ratio - The target ratio.
     * @param {Event} _originalEvent - The original event if any.
     * @returns {Cropper} this
     */
    zoom: function zoom(ratio, _originalEvent) {
      var canvasData = this.canvasData;
      ratio = Number(ratio);

      if (ratio < 0) {
        ratio = 1 / (1 - ratio);
      } else {
        ratio = 1 + ratio;
      }

      return this.zoomTo(canvasData.width * ratio / canvasData.naturalWidth, null, _originalEvent);
    },

    /**
     * Zoom the canvas to an absolute ratio
     * @param {number} ratio - The target ratio.
     * @param {Object} pivot - The zoom pivot point coordinate.
     * @param {Event} _originalEvent - The original event if any.
     * @returns {Cropper} this
     */
    zoomTo: function zoomTo(ratio, pivot, _originalEvent) {
      var options = this.options,
          canvasData = this.canvasData;
      var width = canvasData.width,
          height = canvasData.height,
          naturalWidth = canvasData.naturalWidth,
          naturalHeight = canvasData.naturalHeight;
      ratio = Number(ratio);

      if (ratio >= 0 && this.ready && !this.disabled && options.zoomable) {
        var newWidth = naturalWidth * ratio;
        var newHeight = naturalHeight * ratio;

        if (dispatchEvent(this.element, EVENT_ZOOM, {
          ratio: ratio,
          oldRatio: width / naturalWidth,
          originalEvent: _originalEvent
        }) === false) {
          return this;
        }

        if (_originalEvent) {
          var pointers = this.pointers;
          var offset = getOffset(this.cropper);
          var center = pointers && Object.keys(pointers).length ? getPointersCenter(pointers) : {
            pageX: _originalEvent.pageX,
            pageY: _originalEvent.pageY
          }; // Zoom from the triggering point of the event

          canvasData.left -= (newWidth - width) * ((center.pageX - offset.left - canvasData.left) / width);
          canvasData.top -= (newHeight - height) * ((center.pageY - offset.top - canvasData.top) / height);
        } else if (isPlainObject(pivot) && isNumber(pivot.x) && isNumber(pivot.y)) {
          canvasData.left -= (newWidth - width) * ((pivot.x - canvasData.left) / width);
          canvasData.top -= (newHeight - height) * ((pivot.y - canvasData.top) / height);
        } else {
          // Zoom from the center of the canvas
          canvasData.left -= (newWidth - width) / 2;
          canvasData.top -= (newHeight - height) / 2;
        }

        canvasData.width = newWidth;
        canvasData.height = newHeight;
        this.renderCanvas(true);
      }

      return this;
    },

    /**
     * Rotate the canvas with a relative degree
     * @param {number} degree - The rotate degree.
     * @returns {Cropper} this
     */
    rotate: function rotate(degree) {
      return this.rotateTo((this.imageData.rotate || 0) + Number(degree));
    },

    /**
     * Rotate the canvas to an absolute degree
     * @param {number} degree - The rotate degree.
     * @returns {Cropper} this
     */
    rotateTo: function rotateTo(degree) {
      degree = Number(degree);

      if (isNumber(degree) && this.ready && !this.disabled && this.options.rotatable) {
        this.imageData.rotate = degree % 360;
        this.renderCanvas(true, true);
      }

      return this;
    },

    /**
     * Scale the image on the x-axis.
     * @param {number} scaleX - The scale ratio on the x-axis.
     * @returns {Cropper} this
     */
    scaleX: function scaleX(_scaleX) {
      var scaleY = this.imageData.scaleY;
      return this.scale(_scaleX, isNumber(scaleY) ? scaleY : 1);
    },

    /**
     * Scale the image on the y-axis.
     * @param {number} scaleY - The scale ratio on the y-axis.
     * @returns {Cropper} this
     */
    scaleY: function scaleY(_scaleY) {
      var scaleX = this.imageData.scaleX;
      return this.scale(isNumber(scaleX) ? scaleX : 1, _scaleY);
    },

    /**
     * Scale the image
     * @param {number} scaleX - The scale ratio on the x-axis.
     * @param {number} [scaleY=scaleX] - The scale ratio on the y-axis.
     * @returns {Cropper} this
     */
    scale: function scale(scaleX) {
      var scaleY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : scaleX;
      var imageData = this.imageData;
      var transformed = false;
      scaleX = Number(scaleX);
      scaleY = Number(scaleY);

      if (this.ready && !this.disabled && this.options.scalable) {
        if (isNumber(scaleX)) {
          imageData.scaleX = scaleX;
          transformed = true;
        }

        if (isNumber(scaleY)) {
          imageData.scaleY = scaleY;
          transformed = true;
        }

        if (transformed) {
          this.renderCanvas(true, true);
        }
      }

      return this;
    },

    /**
     * Get the cropped area position and size data (base on the original image)
     * @param {boolean} [rounded=false] - Indicate if round the data values or not.
     * @returns {Object} The result cropped data.
     */
    getData: function getData() {
      var rounded = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var options = this.options,
          imageData = this.imageData,
          canvasData = this.canvasData,
          cropBoxData = this.cropBoxData;
      var data;

      if (this.ready && this.cropped) {
        data = {
          x: cropBoxData.left - canvasData.left,
          y: cropBoxData.top - canvasData.top,
          width: cropBoxData.width,
          height: cropBoxData.height
        };
        var ratio = imageData.width / imageData.naturalWidth;
        forEach(data, function (n, i) {
          data[i] = n / ratio;
        });

        if (rounded) {
          // In case rounding off leads to extra 1px in right or bottom border
          // we should round the top-left corner and the dimension (#343).
          var bottom = Math.round(data.y + data.height);
          var right = Math.round(data.x + data.width);
          data.x = Math.round(data.x);
          data.y = Math.round(data.y);
          data.width = right - data.x;
          data.height = bottom - data.y;
        }
      } else {
        data = {
          x: 0,
          y: 0,
          width: 0,
          height: 0
        };
      }

      if (options.rotatable) {
        data.rotate = imageData.rotate || 0;
      }

      if (options.scalable) {
        data.scaleX = imageData.scaleX || 1;
        data.scaleY = imageData.scaleY || 1;
      }

      return data;
    },

    /**
     * Set the cropped area position and size with new data
     * @param {Object} data - The new data.
     * @returns {Cropper} this
     */
    setData: function setData(data) {
      var options = this.options,
          imageData = this.imageData,
          canvasData = this.canvasData;
      var cropBoxData = {};

      if (this.ready && !this.disabled && isPlainObject(data)) {
        var transformed = false;

        if (options.rotatable) {
          if (isNumber(data.rotate) && data.rotate !== imageData.rotate) {
            imageData.rotate = data.rotate;
            transformed = true;
          }
        }

        if (options.scalable) {
          if (isNumber(data.scaleX) && data.scaleX !== imageData.scaleX) {
            imageData.scaleX = data.scaleX;
            transformed = true;
          }

          if (isNumber(data.scaleY) && data.scaleY !== imageData.scaleY) {
            imageData.scaleY = data.scaleY;
            transformed = true;
          }
        }

        if (transformed) {
          this.renderCanvas(true, true);
        }

        var ratio = imageData.width / imageData.naturalWidth;

        if (isNumber(data.x)) {
          cropBoxData.left = data.x * ratio + canvasData.left;
        }

        if (isNumber(data.y)) {
          cropBoxData.top = data.y * ratio + canvasData.top;
        }

        if (isNumber(data.width)) {
          cropBoxData.width = data.width * ratio;
        }

        if (isNumber(data.height)) {
          cropBoxData.height = data.height * ratio;
        }

        this.setCropBoxData(cropBoxData);
      }

      return this;
    },

    /**
     * Get the container size data.
     * @returns {Object} The result container data.
     */
    getContainerData: function getContainerData() {
      return this.ready ? assign({}, this.containerData) : {};
    },

    /**
     * Get the image position and size data.
     * @returns {Object} The result image data.
     */
    getImageData: function getImageData() {
      return this.sized ? assign({}, this.imageData) : {};
    },

    /**
     * Get the canvas position and size data.
     * @returns {Object} The result canvas data.
     */
    getCanvasData: function getCanvasData() {
      var canvasData = this.canvasData;
      var data = {};

      if (this.ready) {
        forEach(['left', 'top', 'width', 'height', 'naturalWidth', 'naturalHeight'], function (n) {
          data[n] = canvasData[n];
        });
      }

      return data;
    },

    /**
     * Set the canvas position and size with new data.
     * @param {Object} data - The new canvas data.
     * @returns {Cropper} this
     */
    setCanvasData: function setCanvasData(data) {
      var canvasData = this.canvasData;
      var aspectRatio = canvasData.aspectRatio;

      if (this.ready && !this.disabled && isPlainObject(data)) {
        if (isNumber(data.left)) {
          canvasData.left = data.left;
        }

        if (isNumber(data.top)) {
          canvasData.top = data.top;
        }

        if (isNumber(data.width)) {
          canvasData.width = data.width;
          canvasData.height = data.width / aspectRatio;
        } else if (isNumber(data.height)) {
          canvasData.height = data.height;
          canvasData.width = data.height * aspectRatio;
        }

        this.renderCanvas(true);
      }

      return this;
    },

    /**
     * Get the crop box position and size data.
     * @returns {Object} The result crop box data.
     */
    getCropBoxData: function getCropBoxData() {
      var cropBoxData = this.cropBoxData;
      var data;

      if (this.ready && this.cropped) {
        data = {
          left: cropBoxData.left,
          top: cropBoxData.top,
          width: cropBoxData.width,
          height: cropBoxData.height
        };
      }

      return data || {};
    },

    /**
     * Set the crop box position and size with new data.
     * @param {Object} data - The new crop box data.
     * @returns {Cropper} this
     */
    setCropBoxData: function setCropBoxData(data) {
      var cropBoxData = this.cropBoxData;
      var aspectRatio = this.options.aspectRatio;
      var widthChanged;
      var heightChanged;

      if (this.ready && this.cropped && !this.disabled && isPlainObject(data)) {
        if (isNumber(data.left)) {
          cropBoxData.left = data.left;
        }

        if (isNumber(data.top)) {
          cropBoxData.top = data.top;
        }

        if (isNumber(data.width) && data.width !== cropBoxData.width) {
          widthChanged = true;
          cropBoxData.width = data.width;
        }

        if (isNumber(data.height) && data.height !== cropBoxData.height) {
          heightChanged = true;
          cropBoxData.height = data.height;
        }

        if (aspectRatio) {
          if (widthChanged) {
            cropBoxData.height = cropBoxData.width / aspectRatio;
          } else if (heightChanged) {
            cropBoxData.width = cropBoxData.height * aspectRatio;
          }
        }

        this.renderCropBox();
      }

      return this;
    },

    /**
     * Get a canvas drawn the cropped image.
     * @param {Object} [options={}] - The config options.
     * @returns {HTMLCanvasElement} - The result canvas.
     */
    getCroppedCanvas: function getCroppedCanvas() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (!this.ready || !window.HTMLCanvasElement) {
        return null;
      }

      var canvasData = this.canvasData;
      var source = getSourceCanvas(this.image, this.imageData, canvasData, options); // Returns the source canvas if it is not cropped.

      if (!this.cropped) {
        return source;
      }

      var _this$getData = this.getData(),
          initialX = _this$getData.x,
          initialY = _this$getData.y,
          initialWidth = _this$getData.width,
          initialHeight = _this$getData.height;

      var ratio = source.width / Math.floor(canvasData.naturalWidth);

      if (ratio !== 1) {
        initialX *= ratio;
        initialY *= ratio;
        initialWidth *= ratio;
        initialHeight *= ratio;
      }

      var aspectRatio = initialWidth / initialHeight;
      var maxSizes = getAdjustedSizes({
        aspectRatio: aspectRatio,
        width: options.maxWidth || Infinity,
        height: options.maxHeight || Infinity
      });
      var minSizes = getAdjustedSizes({
        aspectRatio: aspectRatio,
        width: options.minWidth || 0,
        height: options.minHeight || 0
      }, 'cover');

      var _getAdjustedSizes = getAdjustedSizes({
        aspectRatio: aspectRatio,
        width: options.width || (ratio !== 1 ? source.width : initialWidth),
        height: options.height || (ratio !== 1 ? source.height : initialHeight)
      }),
          width = _getAdjustedSizes.width,
          height = _getAdjustedSizes.height;

      width = Math.min(maxSizes.width, Math.max(minSizes.width, width));
      height = Math.min(maxSizes.height, Math.max(minSizes.height, height));
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      canvas.width = normalizeDecimalNumber(width);
      canvas.height = normalizeDecimalNumber(height);
      context.fillStyle = options.fillColor || 'transparent';
      context.fillRect(0, 0, width, height);
      var _options$imageSmoothi = options.imageSmoothingEnabled,
          imageSmoothingEnabled = _options$imageSmoothi === void 0 ? true : _options$imageSmoothi,
          imageSmoothingQuality = options.imageSmoothingQuality;
      context.imageSmoothingEnabled = imageSmoothingEnabled;

      if (imageSmoothingQuality) {
        context.imageSmoothingQuality = imageSmoothingQuality;
      } // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.drawImage


      var sourceWidth = source.width;
      var sourceHeight = source.height; // Source canvas parameters

      var srcX = initialX;
      var srcY = initialY;
      var srcWidth;
      var srcHeight; // Destination canvas parameters

      var dstX;
      var dstY;
      var dstWidth;
      var dstHeight;

      if (srcX <= -initialWidth || srcX > sourceWidth) {
        srcX = 0;
        srcWidth = 0;
        dstX = 0;
        dstWidth = 0;
      } else if (srcX <= 0) {
        dstX = -srcX;
        srcX = 0;
        srcWidth = Math.min(sourceWidth, initialWidth + srcX);
        dstWidth = srcWidth;
      } else if (srcX <= sourceWidth) {
        dstX = 0;
        srcWidth = Math.min(initialWidth, sourceWidth - srcX);
        dstWidth = srcWidth;
      }

      if (srcWidth <= 0 || srcY <= -initialHeight || srcY > sourceHeight) {
        srcY = 0;
        srcHeight = 0;
        dstY = 0;
        dstHeight = 0;
      } else if (srcY <= 0) {
        dstY = -srcY;
        srcY = 0;
        srcHeight = Math.min(sourceHeight, initialHeight + srcY);
        dstHeight = srcHeight;
      } else if (srcY <= sourceHeight) {
        dstY = 0;
        srcHeight = Math.min(initialHeight, sourceHeight - srcY);
        dstHeight = srcHeight;
      }

      var params = [srcX, srcY, srcWidth, srcHeight]; // Avoid "IndexSizeError"

      if (dstWidth > 0 && dstHeight > 0) {
        var scale = width / initialWidth;
        params.push(dstX * scale, dstY * scale, dstWidth * scale, dstHeight * scale);
      } // All the numerical parameters should be integer for `drawImage`
      // https://github.com/fengyuanchen/cropper/issues/476


      context.drawImage.apply(context, [source].concat(_toConsumableArray(params.map(function (param) {
        return Math.floor(normalizeDecimalNumber(param));
      }))));
      return canvas;
    },

    /**
     * Change the aspect ratio of the crop box.
     * @param {number} aspectRatio - The new aspect ratio.
     * @returns {Cropper} this
     */
    setAspectRatio: function setAspectRatio(aspectRatio) {
      var options = this.options;

      if (!this.disabled && !isUndefined(aspectRatio)) {
        // 0 -> NaN
        options.aspectRatio = Math.max(0, aspectRatio) || NaN;

        if (this.ready) {
          this.initCropBox();

          if (this.cropped) {
            this.renderCropBox();
          }
        }
      }

      return this;
    },

    /**
     * Change the drag mode.
     * @param {string} mode - The new drag mode.
     * @returns {Cropper} this
     */
    setDragMode: function setDragMode(mode) {
      var options = this.options,
          dragBox = this.dragBox,
          face = this.face;

      if (this.ready && !this.disabled) {
        var croppable = mode === DRAG_MODE_CROP;
        var movable = options.movable && mode === DRAG_MODE_MOVE;
        mode = croppable || movable ? mode : DRAG_MODE_NONE;
        options.dragMode = mode;
        setData(dragBox, DATA_ACTION, mode);
        toggleClass(dragBox, CLASS_CROP, croppable);
        toggleClass(dragBox, CLASS_MOVE, movable);

        if (!options.cropBoxMovable) {
          // Sync drag mode to crop box when it is not movable
          setData(face, DATA_ACTION, mode);
          toggleClass(face, CLASS_CROP, croppable);
          toggleClass(face, CLASS_MOVE, movable);
        }
      }

      return this;
    }
  };

  var AnotherCropper = WINDOW.Cropper;

  var Cropper = /*#__PURE__*/function () {
    /**
     * Create a new Cropper.
     * @param {Element} element - The target element for cropping.
     * @param {Object} [options={}] - The configuration options.
     */
    function Cropper(element) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Cropper);

      if (!element || !REGEXP_TAG_NAME.test(element.tagName)) {
        throw new Error('The first argument is required and must be an <img> or <canvas> element.');
      }

      this.element = element;
      this.options = assign({}, DEFAULTS, isPlainObject(options) && options);
      this.cropped = false;
      this.disabled = false;
      this.pointers = {};
      this.ready = false;
      this.reloading = false;
      this.replaced = false;
      this.sized = false;
      this.sizing = false;
      this.init();
    }

    _createClass(Cropper, [{
      key: "init",
      value: function init() {
        var element = this.element;
        var tagName = element.tagName.toLowerCase();
        var url;

        if (element[NAMESPACE]) {
          return;
        }

        element[NAMESPACE] = this;

        if (tagName === 'img') {
          this.isImg = true; // e.g.: "img/picture.jpg"

          url = element.getAttribute('src') || '';
          this.originalUrl = url; // Stop when it's a blank image

          if (!url) {
            return;
          } // e.g.: "https://example.com/img/picture.jpg"


          url = element.src;
        } else if (tagName === 'canvas' && window.HTMLCanvasElement) {
          url = element.toDataURL();
        }

        this.load(url);
      }
    }, {
      key: "load",
      value: function load(url) {
        var _this = this;

        if (!url) {
          return;
        }

        this.url = url;
        this.imageData = {};
        var element = this.element,
            options = this.options;

        if (!options.rotatable && !options.scalable) {
          options.checkOrientation = false;
        } // Only IE10+ supports Typed Arrays


        if (!options.checkOrientation || !window.ArrayBuffer) {
          this.clone();
          return;
        } // Detect the mime type of the image directly if it is a Data URL


        if (REGEXP_DATA_URL.test(url)) {
          // Read ArrayBuffer from Data URL of JPEG images directly for better performance
          if (REGEXP_DATA_URL_JPEG.test(url)) {
            this.read(dataURLToArrayBuffer(url));
          } else {
            // Only a JPEG image may contains Exif Orientation information,
            // the rest types of Data URLs are not necessary to check orientation at all.
            this.clone();
          }

          return;
        } // 1. Detect the mime type of the image by a XMLHttpRequest.
        // 2. Load the image as ArrayBuffer for reading orientation if its a JPEG image.


        var xhr = new XMLHttpRequest();
        var clone = this.clone.bind(this);
        this.reloading = true;
        this.xhr = xhr; // 1. Cross origin requests are only supported for protocol schemes:
        // http, https, data, chrome, chrome-extension.
        // 2. Access to XMLHttpRequest from a Data URL will be blocked by CORS policy
        // in some browsers as IE11 and Safari.

        xhr.onabort = clone;
        xhr.onerror = clone;
        xhr.ontimeout = clone;

        xhr.onprogress = function () {
          // Abort the request directly if it not a JPEG image for better performance
          if (xhr.getResponseHeader('content-type') !== MIME_TYPE_JPEG) {
            xhr.abort();
          }
        };

        xhr.onload = function () {
          _this.read(xhr.response);
        };

        xhr.onloadend = function () {
          _this.reloading = false;
          _this.xhr = null;
        }; // Bust cache when there is a "crossOrigin" property to avoid browser cache error


        if (options.checkCrossOrigin && isCrossOriginURL(url) && element.crossOrigin) {
          url = addTimestamp(url);
        }

        xhr.open('GET', url);
        xhr.responseType = 'arraybuffer';
        xhr.withCredentials = element.crossOrigin === 'use-credentials';
        xhr.send();
      }
    }, {
      key: "read",
      value: function read(arrayBuffer) {
        var options = this.options,
            imageData = this.imageData; // Reset the orientation value to its default value 1
        // as some iOS browsers will render image with its orientation

        var orientation = resetAndGetOrientation(arrayBuffer);
        var rotate = 0;
        var scaleX = 1;
        var scaleY = 1;

        if (orientation > 1) {
          // Generate a new URL which has the default orientation value
          this.url = arrayBufferToDataURL(arrayBuffer, MIME_TYPE_JPEG);

          var _parseOrientation = parseOrientation(orientation);

          rotate = _parseOrientation.rotate;
          scaleX = _parseOrientation.scaleX;
          scaleY = _parseOrientation.scaleY;
        }

        if (options.rotatable) {
          imageData.rotate = rotate;
        }

        if (options.scalable) {
          imageData.scaleX = scaleX;
          imageData.scaleY = scaleY;
        }

        this.clone();
      }
    }, {
      key: "clone",
      value: function clone() {
        var element = this.element,
            url = this.url;
        var crossOrigin = element.crossOrigin;
        var crossOriginUrl = url;

        if (this.options.checkCrossOrigin && isCrossOriginURL(url)) {
          if (!crossOrigin) {
            crossOrigin = 'anonymous';
          } // Bust cache when there is not a "crossOrigin" property (#519)


          crossOriginUrl = addTimestamp(url);
        }

        this.crossOrigin = crossOrigin;
        this.crossOriginUrl = crossOriginUrl;
        var image = document.createElement('img');

        if (crossOrigin) {
          image.crossOrigin = crossOrigin;
        }

        image.src = crossOriginUrl || url;
        image.alt = element.alt || 'The image to crop';
        this.image = image;
        image.onload = this.start.bind(this);
        image.onerror = this.stop.bind(this);
        addClass(image, CLASS_HIDE);
        element.parentNode.insertBefore(image, element.nextSibling);
      }
    }, {
      key: "start",
      value: function start() {
        var _this2 = this;

        var image = this.image;
        image.onload = null;
        image.onerror = null;
        this.sizing = true; // Match all browsers that use WebKit as the layout engine in iOS devices,
        // such as Safari for iOS, Chrome for iOS, and in-app browsers.

        var isIOSWebKit = WINDOW.navigator && /(?:iPad|iPhone|iPod).*?AppleWebKit/i.test(WINDOW.navigator.userAgent);

        var done = function done(naturalWidth, naturalHeight) {
          assign(_this2.imageData, {
            naturalWidth: naturalWidth,
            naturalHeight: naturalHeight,
            aspectRatio: naturalWidth / naturalHeight
          });
          _this2.sizing = false;
          _this2.sized = true;

          _this2.build();
        }; // Most modern browsers (excepts iOS WebKit)


        if (image.naturalWidth && !isIOSWebKit) {
          done(image.naturalWidth, image.naturalHeight);
          return;
        }

        var sizingImage = document.createElement('img');
        var body = document.body || document.documentElement;
        this.sizingImage = sizingImage;

        sizingImage.onload = function () {
          done(sizingImage.width, sizingImage.height);

          if (!isIOSWebKit) {
            body.removeChild(sizingImage);
          }
        };

        sizingImage.src = image.src; // iOS WebKit will convert the image automatically
        // with its orientation once append it into DOM (#279)

        if (!isIOSWebKit) {
          sizingImage.style.cssText = 'left:0;' + 'max-height:none!important;' + 'max-width:none!important;' + 'min-height:0!important;' + 'min-width:0!important;' + 'opacity:0;' + 'position:absolute;' + 'top:0;' + 'z-index:-1;';
          body.appendChild(sizingImage);
        }
      }
    }, {
      key: "stop",
      value: function stop() {
        var image = this.image;
        image.onload = null;
        image.onerror = null;
        image.parentNode.removeChild(image);
        this.image = null;
      }
    }, {
      key: "build",
      value: function build() {
        if (!this.sized || this.ready) {
          return;
        }

        var element = this.element,
            options = this.options,
            image = this.image; // Create cropper elements

        var container = element.parentNode;
        var template = document.createElement('div');
        template.innerHTML = TEMPLATE;
        var cropper = template.querySelector(".".concat(NAMESPACE, "-container"));
        var canvas = cropper.querySelector(".".concat(NAMESPACE, "-canvas"));
        var dragBox = cropper.querySelector(".".concat(NAMESPACE, "-drag-box"));
        var cropBox = cropper.querySelector(".".concat(NAMESPACE, "-crop-box"));
        var face = cropBox.querySelector(".".concat(NAMESPACE, "-face"));
        this.container = container;
        this.cropper = cropper;
        this.canvas = canvas;
        this.dragBox = dragBox;
        this.cropBox = cropBox;
        this.viewBox = cropper.querySelector(".".concat(NAMESPACE, "-view-box"));
        this.face = face;
        canvas.appendChild(image); // Hide the original image

        addClass(element, CLASS_HIDDEN); // Inserts the cropper after to the current image

        container.insertBefore(cropper, element.nextSibling); // Show the image if is hidden

        if (!this.isImg) {
          removeClass(image, CLASS_HIDE);
        }

        this.initPreview();
        this.bind();
        options.initialAspectRatio = Math.max(0, options.initialAspectRatio) || NaN;
        options.aspectRatio = Math.max(0, options.aspectRatio) || NaN;
        options.viewMode = Math.max(0, Math.min(3, Math.round(options.viewMode))) || 0;
        addClass(cropBox, CLASS_HIDDEN);

        if (!options.guides) {
          addClass(cropBox.getElementsByClassName("".concat(NAMESPACE, "-dashed")), CLASS_HIDDEN);
        }

        if (!options.center) {
          addClass(cropBox.getElementsByClassName("".concat(NAMESPACE, "-center")), CLASS_HIDDEN);
        }

        if (options.background) {
          addClass(cropper, "".concat(NAMESPACE, "-bg"));
        }

        if (!options.highlight) {
          addClass(face, CLASS_INVISIBLE);
        }

        if (options.cropBoxMovable) {
          addClass(face, CLASS_MOVE);
          setData(face, DATA_ACTION, ACTION_ALL);
        }

        if (!options.cropBoxResizable) {
          addClass(cropBox.getElementsByClassName("".concat(NAMESPACE, "-line")), CLASS_HIDDEN);
          addClass(cropBox.getElementsByClassName("".concat(NAMESPACE, "-point")), CLASS_HIDDEN);
        }

        this.render();
        this.ready = true;
        this.setDragMode(options.dragMode);

        if (options.autoCrop) {
          this.crop();
        }

        this.setData(options.data);

        if (isFunction(options.ready)) {
          addListener(element, EVENT_READY, options.ready, {
            once: true
          });
        }

        dispatchEvent(element, EVENT_READY);
      }
    }, {
      key: "unbuild",
      value: function unbuild() {
        if (!this.ready) {
          return;
        }

        this.ready = false;
        this.unbind();
        this.resetPreview();
        this.cropper.parentNode.removeChild(this.cropper);
        removeClass(this.element, CLASS_HIDDEN);
      }
    }, {
      key: "uncreate",
      value: function uncreate() {
        if (this.ready) {
          this.unbuild();
          this.ready = false;
          this.cropped = false;
        } else if (this.sizing) {
          this.sizingImage.onload = null;
          this.sizing = false;
          this.sized = false;
        } else if (this.reloading) {
          this.xhr.onabort = null;
          this.xhr.abort();
        } else if (this.image) {
          this.stop();
        }
      }
      /**
       * Get the no conflict cropper class.
       * @returns {Cropper} The cropper class.
       */

    }], [{
      key: "noConflict",
      value: function noConflict() {
        window.Cropper = AnotherCropper;
        return Cropper;
      }
      /**
       * Change the default options.
       * @param {Object} options - The new default options.
       */

    }, {
      key: "setDefaults",
      value: function setDefaults(options) {
        assign(DEFAULTS, isPlainObject(options) && options);
      }
    }]);

    return Cropper;
  }();

  assign(Cropper.prototype, render, preview, events, handlers, change, methods);

  return Cropper;

})));


/***/ }),

/***/ "./node_modules/exifr/dist/mini.umd.js":
/*!*********************************************!*\
  !*** ./node_modules/exifr/dist/mini.umd.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

/* provided dependency */ var process = __webpack_require__(/*! process/browser.js */ "./node_modules/process/browser.js");
/* provided dependency */ var Buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")["Buffer"];
!function(e,t){ true?t(exports):0}(this,(function(e){"use strict";function t(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}var s="undefined"!=typeof self?self:__webpack_require__.g;const i="undefined"!=typeof navigator,n=i&&"undefined"==typeof HTMLImageElement,r=!("undefined"==typeof __webpack_require__.g||"undefined"==typeof process||!process.versions||!process.versions.node),a=s.Buffer,h=!!a,f=e=>void 0!==e;function l(e){return void 0===e||(e instanceof Map?0===e.size:0===Object.values(e).filter(f).length)}function o(e){let t=new Error(e);throw delete t.stack,t}function u(e){let t=function(e){let t=0;return e.ifd0.enabled&&(t+=1024),e.exif.enabled&&(t+=2048),e.makerNote&&(t+=2048),e.userComment&&(t+=1024),e.gps.enabled&&(t+=512),e.interop.enabled&&(t+=100),e.ifd1.enabled&&(t+=1024),t+2048}(e);return e.jfif.enabled&&(t+=50),e.xmp.enabled&&(t+=2e4),e.iptc.enabled&&(t+=14e3),e.icc.enabled&&(t+=6e3),t}const d=e=>String.fromCharCode.apply(null,e),c="undefined"!=typeof TextDecoder?new TextDecoder("utf-8"):void 0;class p{static from(e,t){return e instanceof this&&e.le===t?e:new p(e,void 0,void 0,t)}constructor(e,t=0,s,i){if("boolean"==typeof i&&(this.le=i),Array.isArray(e)&&(e=new Uint8Array(e)),0===e)this.byteOffset=0,this.byteLength=0;else if(e instanceof ArrayBuffer){void 0===s&&(s=e.byteLength-t);let i=new DataView(e,t,s);this._swapDataView(i)}else if(e instanceof Uint8Array||e instanceof DataView||e instanceof p){void 0===s&&(s=e.byteLength-t),(t+=e.byteOffset)+s>e.byteOffset+e.byteLength&&o("Creating view outside of available memory in ArrayBuffer");let i=new DataView(e.buffer,t,s);this._swapDataView(i)}else if("number"==typeof e){let t=new DataView(new ArrayBuffer(e));this._swapDataView(t)}else o("Invalid input argument for BufferView: "+e)}_swapArrayBuffer(e){this._swapDataView(new DataView(e))}_swapBuffer(e){this._swapDataView(new DataView(e.buffer,e.byteOffset,e.byteLength))}_swapDataView(e){this.dataView=e,this.buffer=e.buffer,this.byteOffset=e.byteOffset,this.byteLength=e.byteLength}_lengthToEnd(e){return this.byteLength-e}set(e,t,s=p){return e instanceof DataView||e instanceof p?e=new Uint8Array(e.buffer,e.byteOffset,e.byteLength):e instanceof ArrayBuffer&&(e=new Uint8Array(e)),e instanceof Uint8Array||o("BufferView.set(): Invalid data argument."),this.toUint8().set(e,t),new s(this,t,e.byteLength)}subarray(e,t){return t=t||this._lengthToEnd(e),new p(this,e,t)}toUint8(){return new Uint8Array(this.buffer,this.byteOffset,this.byteLength)}getUint8Array(e,t){return new Uint8Array(this.buffer,this.byteOffset+e,t)}getString(e=0,t=this.byteLength){let s=this.getUint8Array(e,t);return i=s,c?c.decode(i):h?Buffer.from(i).toString("utf8"):decodeURIComponent(escape(d(i)));var i}getLatin1String(e=0,t=this.byteLength){let s=this.getUint8Array(e,t);return d(s)}getUnicodeString(e=0,t=this.byteLength){const s=[];for(let i=0;i<t&&e+i<this.byteLength;i+=2)s.push(this.getUint16(e+i));return d(s)}getInt8(e){return this.dataView.getInt8(e)}getUint8(e){return this.dataView.getUint8(e)}getInt16(e,t=this.le){return this.dataView.getInt16(e,t)}getInt32(e,t=this.le){return this.dataView.getInt32(e,t)}getUint16(e,t=this.le){return this.dataView.getUint16(e,t)}getUint32(e,t=this.le){return this.dataView.getUint32(e,t)}getFloat32(e,t=this.le){return this.dataView.getFloat32(e,t)}getFloat64(e,t=this.le){return this.dataView.getFloat64(e,t)}getFloat(e,t=this.le){return this.dataView.getFloat32(e,t)}getDouble(e,t=this.le){return this.dataView.getFloat64(e,t)}getUintBytes(e,t,s){switch(t){case 1:return this.getUint8(e,s);case 2:return this.getUint16(e,s);case 4:return this.getUint32(e,s);case 8:return this.getUint64&&this.getUint64(e,s)}}getUint(e,t,s){switch(t){case 8:return this.getUint8(e,s);case 16:return this.getUint16(e,s);case 32:return this.getUint32(e,s);case 64:return this.getUint64&&this.getUint64(e,s)}}toString(e){return this.dataView.toString(e,this.constructor.name)}ensureChunk(){}}function g(e,t){o(`${e} '${t}' was not loaded, try using full build of exifr.`)}class m extends Map{constructor(e){super(),this.kind=e}get(e,t){return this.has(e)||g(this.kind,e),t&&(e in t||function(e,t){o(`Unknown ${e} '${t}'.`)}(this.kind,e),t[e].enabled||g(this.kind,e)),super.get(e)}keyList(){return Array.from(this.keys())}}var y=new m("file parser"),b=new m("segment parser"),w=new m("file reader");let k=s.fetch;const O="Invalid input argument";function v(e,t){return(s=e).startsWith("data:")||s.length>1e4?A(e,t,"base64"):r&&e.includes("://")?S(e,t,"url",U):r?A(e,t,"fs"):i?S(e,t,"url",U):void o(O);var s}async function S(e,t,s,i){return w.has(s)?A(e,t,s):i?async function(e,t){let s=await t(e);return new p(s)}(e,i):void o(`Parser ${s} is not loaded`)}async function A(e,t,s){let i=new(w.get(s))(e,t);return await i.read(),i}const U=e=>k(e).then((e=>e.arrayBuffer())),x=e=>new Promise(((t,s)=>{let i=new FileReader;i.onloadend=()=>t(i.result||new ArrayBuffer),i.onerror=s,i.readAsArrayBuffer(e)}));class C extends Map{get tagKeys(){return this.allKeys||(this.allKeys=Array.from(this.keys())),this.allKeys}get tagValues(){return this.allValues||(this.allValues=Array.from(this.values())),this.allValues}}function B(e,t,s){let i=new C;for(let[e,t]of s)i.set(e,t);if(Array.isArray(t))for(let s of t)e.set(s,i);else e.set(t,i);return i}function V(e,t,s){let i,n=e.get(t);for(i of s)n.set(i[0],i[1])}const I=new Map,L=new Map,T=new Map,P=37500,z=37510,F=33723,j=34675,E=34665,_=34853,D=40965,M=["chunked","firstChunkSize","firstChunkSizeNode","firstChunkSizeBrowser","chunkSize","chunkLimit"],N=["jfif","xmp","icc","iptc","ihdr"],R=["tiff",...N],$=["ifd0","ifd1","exif","gps","interop"],K=[...R,...$],W=["makerNote","userComment"],X=["translateKeys","translateValues","reviveValues","multiSegment"],H=[...X,"sanitize","mergeOutput","silentErrors"];class Y{get translate(){return this.translateKeys||this.translateValues||this.reviveValues}}class G extends Y{get needed(){return this.enabled||this.deps.size>0}constructor(e,s,i,n){if(super(),t(this,"enabled",!1),t(this,"skip",new Set),t(this,"pick",new Set),t(this,"deps",new Set),t(this,"translateKeys",!1),t(this,"translateValues",!1),t(this,"reviveValues",!1),this.key=e,this.enabled=s,this.parse=this.enabled,this.applyInheritables(n),this.canBeFiltered=$.includes(e),this.canBeFiltered&&(this.dict=I.get(e)),void 0!==i)if(Array.isArray(i))this.parse=this.enabled=!0,this.canBeFiltered&&i.length>0&&this.translateTagSet(i,this.pick);else if("object"==typeof i){if(this.enabled=!0,this.parse=!1!==i.parse,this.canBeFiltered){let{pick:e,skip:t}=i;e&&e.length>0&&this.translateTagSet(e,this.pick),t&&t.length>0&&this.translateTagSet(t,this.skip)}this.applyInheritables(i)}else!0===i||!1===i?this.parse=this.enabled=i:o(`Invalid options argument: ${i}`)}applyInheritables(e){let t,s;for(t of X)s=e[t],void 0!==s&&(this[t]=s)}translateTagSet(e,t){if(this.dict){let s,i,{tagKeys:n,tagValues:r}=this.dict;for(s of e)"string"==typeof s?(i=r.indexOf(s),-1===i&&(i=n.indexOf(Number(s))),-1!==i&&t.add(Number(n[i]))):t.add(s)}else for(let s of e)t.add(s)}finalizeFilters(){!this.enabled&&this.deps.size>0?(this.enabled=!0,te(this.pick,this.deps)):this.enabled&&this.pick.size>0&&te(this.pick,this.deps)}}var J={jfif:!1,tiff:!0,xmp:!1,icc:!1,iptc:!1,ifd0:!0,ifd1:!1,exif:!0,gps:!0,interop:!1,ihdr:void 0,makerNote:!1,userComment:!1,multiSegment:!1,skip:[],pick:[],translateKeys:!0,translateValues:!0,reviveValues:!0,sanitize:!0,mergeOutput:!0,silentErrors:!0,chunked:!0,firstChunkSize:void 0,firstChunkSizeNode:512,firstChunkSizeBrowser:65536,chunkSize:65536,chunkLimit:5},q=new Map;class Q extends Y{static useCached(e){let t=q.get(e);return void 0!==t||(t=new this(e),q.set(e,t)),t}constructor(e){super(),!0===e?this.setupFromTrue():void 0===e?this.setupFromUndefined():Array.isArray(e)?this.setupFromArray(e):"object"==typeof e?this.setupFromObject(e):o(`Invalid options argument ${e}`),void 0===this.firstChunkSize&&(this.firstChunkSize=i?this.firstChunkSizeBrowser:this.firstChunkSizeNode),this.mergeOutput&&(this.ifd1.enabled=!1),this.filterNestedSegmentTags(),this.traverseTiffDependencyTree(),this.checkLoadedPlugins()}setupFromUndefined(){let e;for(e of M)this[e]=J[e];for(e of H)this[e]=J[e];for(e of W)this[e]=J[e];for(e of K)this[e]=new G(e,J[e],void 0,this)}setupFromTrue(){let e;for(e of M)this[e]=J[e];for(e of H)this[e]=J[e];for(e of W)this[e]=!0;for(e of K)this[e]=new G(e,!0,void 0,this)}setupFromArray(e){let t;for(t of M)this[t]=J[t];for(t of H)this[t]=J[t];for(t of W)this[t]=J[t];for(t of K)this[t]=new G(t,!1,void 0,this);this.setupGlobalFilters(e,void 0,$)}setupFromObject(e){let t;for(t of($.ifd0=$.ifd0||$.image,$.ifd1=$.ifd1||$.thumbnail,Object.assign(this,e),M))this[t]=ee(e[t],J[t]);for(t of H)this[t]=ee(e[t],J[t]);for(t of W)this[t]=ee(e[t],J[t]);for(t of R)this[t]=new G(t,J[t],e[t],this);for(t of $)this[t]=new G(t,J[t],e[t],this.tiff);this.setupGlobalFilters(e.pick,e.skip,$,K),!0===e.tiff?this.batchEnableWithBool($,!0):!1===e.tiff?this.batchEnableWithUserValue($,e):Array.isArray(e.tiff)?this.setupGlobalFilters(e.tiff,void 0,$):"object"==typeof e.tiff&&this.setupGlobalFilters(e.tiff.pick,e.tiff.skip,$)}batchEnableWithBool(e,t){for(let s of e)this[s].enabled=t}batchEnableWithUserValue(e,t){for(let s of e){let e=t[s];this[s].enabled=!1!==e&&void 0!==e}}setupGlobalFilters(e,t,s,i=s){if(e&&e.length){for(let e of i)this[e].enabled=!1;let t=Z(e,s);for(let[e,s]of t)te(this[e].pick,s),this[e].enabled=!0}else if(t&&t.length){let e=Z(t,s);for(let[t,s]of e)te(this[t].skip,s)}}filterNestedSegmentTags(){let{ifd0:e,exif:t,xmp:s,iptc:i,icc:n}=this;this.makerNote?t.deps.add(P):t.skip.add(P),this.userComment?t.deps.add(z):t.skip.add(z),s.enabled||e.skip.add(700),i.enabled||e.skip.add(F),n.enabled||e.skip.add(j)}traverseTiffDependencyTree(){let{ifd0:e,exif:t,gps:s,interop:i}=this;i.needed&&(t.deps.add(D),e.deps.add(D)),t.needed&&e.deps.add(E),s.needed&&e.deps.add(_),this.tiff.enabled=$.some((e=>!0===this[e].enabled))||this.makerNote||this.userComment;for(let e of $)this[e].finalizeFilters()}get onlyTiff(){return!N.map((e=>this[e].enabled)).some((e=>!0===e))&&this.tiff.enabled}checkLoadedPlugins(){for(let e of R)this[e].enabled&&!b.has(e)&&g("segment parser",e)}}function Z(e,t){let s,i,n,r,a=[];for(n of t){for(r of(s=I.get(n),i=[],s))(e.includes(r[0])||e.includes(r[1]))&&i.push(r[0]);i.length&&a.push([n,i])}return a}function ee(e,t){return void 0!==e?e:void 0!==t?t:void 0}function te(e,t){for(let s of t)e.add(s)}t(Q,"default",J);class se{constructor(e){t(this,"parsers",{}),t(this,"output",{}),t(this,"errors",[]),t(this,"pushToErrors",(e=>this.errors.push(e))),this.options=Q.useCached(e)}async read(e){this.file=await function(e,t){return"string"==typeof e?v(e,t):i&&!n&&e instanceof HTMLImageElement?v(e.src,t):e instanceof Uint8Array||e instanceof ArrayBuffer||e instanceof DataView?new p(e):i&&e instanceof Blob?S(e,t,"blob",x):void o(O)}(e,this.options)}setup(){if(this.fileParser)return;let{file:e}=this,t=e.getUint16(0);for(let[s,i]of y)if(i.canHandle(e,t))return this.fileParser=new i(this.options,this.file,this.parsers),e[s]=!0;this.file.close&&this.file.close(),o("Unknown file format")}async parse(){let{output:e,errors:t}=this;return this.setup(),this.options.silentErrors?(await this.executeParsers().catch(this.pushToErrors),t.push(...this.fileParser.errors)):await this.executeParsers(),this.file.close&&this.file.close(),this.options.silentErrors&&t.length>0&&(e.errors=t),l(s=e)?void 0:s;var s}async executeParsers(){let{output:e}=this;await this.fileParser.parse();let t=Object.values(this.parsers).map((async t=>{let s=await t.parse();t.assignToOutput(e,s)}));this.options.silentErrors&&(t=t.map((e=>e.catch(this.pushToErrors)))),await Promise.all(t)}async extractThumbnail(){this.setup();let{options:e,file:t}=this,s=b.get("tiff",e);var i;if(t.tiff?i={start:0,type:"tiff"}:t.jpeg&&(i=await this.fileParser.getOrFindSegment("tiff")),void 0===i)return;let n=await this.fileParser.ensureSegmentChunk(i),r=this.parsers.tiff=new s(n,e,t),a=await r.extractThumbnail();return t.close&&t.close(),a}}async function ie(e,t){let s=new se(t);return await s.read(e),s.parse()}var ne=Object.freeze({__proto__:null,parse:ie,Exifr:se,fileParsers:y,segmentParsers:b,fileReaders:w,tagKeys:I,tagValues:L,tagRevivers:T,createDictionary:B,extendDictionary:V,fetchUrlAsArrayBuffer:U,readBlobAsArrayBuffer:x,chunkedProps:M,otherSegments:N,segments:R,tiffBlocks:$,segmentsAndBlocks:K,tiffExtractables:W,inheritables:X,allFormatters:H,Options:Q});class re{static findPosition(e,t){let s=e.getUint16(t+2)+2,i="function"==typeof this.headerLength?this.headerLength(e,t,s):this.headerLength,n=t+i,r=s-i;return{offset:t,length:s,headerLength:i,start:n,size:r,end:n+r}}static parse(e,t={}){return new this(e,new Q({[this.type]:t}),e).parse()}normalizeInput(e){return e instanceof p?e:new p(e)}constructor(e,s={},i){t(this,"errors",[]),t(this,"raw",new Map),t(this,"handleError",(e=>{if(!this.options.silentErrors)throw e;this.errors.push(e.message)})),this.chunk=this.normalizeInput(e),this.file=i,this.type=this.constructor.type,this.globalOptions=this.options=s,this.localOptions=s[this.type],this.canTranslate=this.localOptions&&this.localOptions.translate}translate(){this.canTranslate&&(this.translated=this.translateBlock(this.raw,this.type))}get output(){return this.translated?this.translated:this.raw?Object.fromEntries(this.raw):void 0}translateBlock(e,t){let s=T.get(t),i=L.get(t),n=I.get(t),r=this.options[t],a=r.reviveValues&&!!s,h=r.translateValues&&!!i,f=r.translateKeys&&!!n,l={};for(let[t,r]of e)a&&s.has(t)?r=s.get(t)(r):h&&i.has(t)&&(r=this.translateValue(r,i.get(t))),f&&n.has(t)&&(t=n.get(t)||t),l[t]=r;return l}translateValue(e,t){return t[e]||t.DEFAULT||e}assignToOutput(e,t){this.assignObjectToOutput(e,this.constructor.type,t)}assignObjectToOutput(e,t,s){if(this.globalOptions.mergeOutput)return Object.assign(e,s);e[t]?Object.assign(e[t],s):e[t]=s}}t(re,"headerLength",4),t(re,"type",void 0),t(re,"multiSegment",!1),t(re,"canHandle",(()=>!1));function ae(e){return 192===e||194===e||196===e||219===e||221===e||218===e||254===e}function he(e){return e>=224&&e<=239}function fe(e,t,s){for(let[i,n]of b)if(n.canHandle(e,t,s))return i}class le extends class{constructor(e,s,i){t(this,"errors",[]),t(this,"ensureSegmentChunk",(async e=>{let t=e.start,s=e.size||65536;if(this.file.chunked)if(this.file.available(t,s))e.chunk=this.file.subarray(t,s);else try{e.chunk=await this.file.readChunk(t,s)}catch(t){o(`Couldn't read segment: ${JSON.stringify(e)}. ${t.message}`)}else this.file.byteLength>t+s?e.chunk=this.file.subarray(t,s):void 0===e.size?e.chunk=this.file.subarray(t):o("Segment unreachable: "+JSON.stringify(e));return e.chunk})),this.extendOptions&&this.extendOptions(e),this.options=e,this.file=s,this.parsers=i}injectSegment(e,t){this.options[e].enabled&&this.createParser(e,t)}createParser(e,t){let s=new(b.get(e))(t,this.options,this.file);return this.parsers[e]=s}createParsers(e){for(let t of e){let{type:e,chunk:s}=t,i=this.options[e];if(i&&i.enabled){let t=this.parsers[e];t&&t.append||t||this.createParser(e,s)}}}async readSegments(e){let t=e.map(this.ensureSegmentChunk);await Promise.all(t)}}{constructor(...e){super(...e),t(this,"appSegments",[]),t(this,"jpegSegments",[]),t(this,"unknownSegments",[])}static canHandle(e,t){return 65496===t}async parse(){await this.findAppSegments(),await this.readSegments(this.appSegments),this.mergeMultiSegments(),this.createParsers(this.mergedAppSegments||this.appSegments)}setupSegmentFinderArgs(e){!0===e?(this.findAll=!0,this.wanted=new Set(b.keyList())):(e=void 0===e?b.keyList().filter((e=>this.options[e].enabled)):e.filter((e=>this.options[e].enabled&&b.has(e))),this.findAll=!1,this.remaining=new Set(e),this.wanted=new Set(e)),this.unfinishedMultiSegment=!1}async findAppSegments(e=0,t){this.setupSegmentFinderArgs(t);let{file:s,findAll:i,wanted:n,remaining:r}=this;if(!i&&this.file.chunked&&(i=Array.from(n).some((e=>{let t=b.get(e),s=this.options[e];return t.multiSegment&&s.multiSegment})),i&&await this.file.readWhole()),e=this.findAppSegmentsInRange(e,s.byteLength),!this.options.onlyTiff&&s.chunked){let t=!1;for(;r.size>0&&!t&&(s.canReadNextChunk||this.unfinishedMultiSegment);){let{nextChunkOffset:i}=s,n=this.appSegments.some((e=>!this.file.available(e.offset||e.start,e.length||e.size)));if(t=e>i&&!n?!await s.readNextChunk(e):!await s.readNextChunk(i),void 0===(e=this.findAppSegmentsInRange(e,s.byteLength)))return}}}findAppSegmentsInRange(e,t){t-=2;let s,i,n,r,a,h,{file:f,findAll:l,wanted:o,remaining:u,options:d}=this;for(;e<t;e++)if(255===f.getUint8(e))if(s=f.getUint8(e+1),he(s)){if(i=f.getUint16(e+2),n=fe(f,e,i),n&&o.has(n)&&(r=b.get(n),a=r.findPosition(f,e),h=d[n],a.type=n,this.appSegments.push(a),!l&&(r.multiSegment&&h.multiSegment?(this.unfinishedMultiSegment=a.chunkNumber<a.chunkCount,this.unfinishedMultiSegment||u.delete(n)):u.delete(n),0===u.size)))break;d.recordUnknownSegments&&(a=re.findPosition(f,e),a.marker=s,this.unknownSegments.push(a)),e+=i+1}else if(ae(s)){if(i=f.getUint16(e+2),218===s&&!1!==d.stopAfterSos)return;d.recordJpegSegments&&this.jpegSegments.push({offset:e,length:i,marker:s}),e+=i+1}return e}mergeMultiSegments(){if(!this.appSegments.some((e=>e.multiSegment)))return;let e=function(e,t){let s,i,n,r=new Map;for(let a=0;a<e.length;a++)s=e[a],i=s[t],r.has(i)?n=r.get(i):r.set(i,n=[]),n.push(s);return Array.from(r)}(this.appSegments,"type");this.mergedAppSegments=e.map((([e,t])=>{let s=b.get(e,this.options);if(s.handleMultiSegments){return{type:e,chunk:s.handleMultiSegments(t)}}return t[0]}))}getSegment(e){return this.appSegments.find((t=>t.type===e))}async getOrFindSegment(e){let t=this.getSegment(e);return void 0===t&&(await this.findAppSegments(0,[e]),t=this.getSegment(e)),t}}t(le,"type","jpeg"),y.set("jpeg",le);const oe=[void 0,1,1,2,4,8,1,1,2,4,8,4,8,4];class ue extends re{parseHeader(){var e=this.chunk.getUint16();18761===e?this.le=!0:19789===e&&(this.le=!1),this.chunk.le=this.le,this.headerParsed=!0}parseTags(e,t,s=new Map){let{pick:i,skip:n}=this.options[t];i=new Set(i);let r=i.size>0,a=0===n.size,h=this.chunk.getUint16(e);e+=2;for(let f=0;f<h;f++){let h=this.chunk.getUint16(e);if(r){if(i.has(h)&&(s.set(h,this.parseTag(e,h,t)),i.delete(h),0===i.size))break}else!a&&n.has(h)||s.set(h,this.parseTag(e,h,t));e+=12}return s}parseTag(e,t,s){let{chunk:i}=this,n=i.getUint16(e+2),r=i.getUint32(e+4),a=oe[n];if(a*r<=4?e+=8:e=i.getUint32(e+8),(n<1||n>13)&&o(`Invalid TIFF value type. block: ${s.toUpperCase()}, tag: ${t.toString(16)}, type: ${n}, offset ${e}`),e>i.byteLength&&o(`Invalid TIFF value offset. block: ${s.toUpperCase()}, tag: ${t.toString(16)}, type: ${n}, offset ${e} is outside of chunk size ${i.byteLength}`),1===n)return i.getUint8Array(e,r);if(2===n)return""===(h=function(e){for(;e.endsWith("\0");)e=e.slice(0,-1);return e}(h=i.getString(e,r)).trim())?void 0:h;var h;if(7===n)return i.getUint8Array(e,r);if(1===r)return this.parseTagValue(n,e);{let t=new(function(e){switch(e){case 1:return Uint8Array;case 3:return Uint16Array;case 4:return Uint32Array;case 5:return Array;case 6:return Int8Array;case 8:return Int16Array;case 9:return Int32Array;case 10:return Array;case 11:return Float32Array;case 12:return Float64Array;default:return Array}}(n))(r),s=a;for(let i=0;i<r;i++)t[i]=this.parseTagValue(n,e),e+=s;return t}}parseTagValue(e,t){let{chunk:s}=this;switch(e){case 1:return s.getUint8(t);case 3:return s.getUint16(t);case 4:return s.getUint32(t);case 5:return s.getUint32(t)/s.getUint32(t+4);case 6:return s.getInt8(t);case 8:return s.getInt16(t);case 9:return s.getInt32(t);case 10:return s.getInt32(t)/s.getInt32(t+4);case 11:return s.getFloat(t);case 12:return s.getDouble(t);case 13:return s.getUint32(t);default:o(`Invalid tiff type ${e}`)}}}class de extends ue{static canHandle(e,t){return 225===e.getUint8(t+1)&&1165519206===e.getUint32(t+4)&&0===e.getUint16(t+8)}async parse(){this.parseHeader();let{options:e}=this;return e.ifd0.enabled&&await this.parseIfd0Block(),e.exif.enabled&&await this.safeParse("parseExifBlock"),e.gps.enabled&&await this.safeParse("parseGpsBlock"),e.interop.enabled&&await this.safeParse("parseInteropBlock"),e.ifd1.enabled&&await this.safeParse("parseThumbnailBlock"),this.createOutput()}safeParse(e){let t=this[e]();return void 0!==t.catch&&(t=t.catch(this.handleError)),t}findIfd0Offset(){void 0===this.ifd0Offset&&(this.ifd0Offset=this.chunk.getUint32(4))}findIfd1Offset(){if(void 0===this.ifd1Offset){this.findIfd0Offset();let e=this.chunk.getUint16(this.ifd0Offset),t=this.ifd0Offset+2+12*e;this.ifd1Offset=this.chunk.getUint32(t)}}parseBlock(e,t){let s=new Map;return this[t]=s,this.parseTags(e,t,s),s}async parseIfd0Block(){if(this.ifd0)return;let{file:e}=this;this.findIfd0Offset(),this.ifd0Offset<8&&o("Malformed EXIF data"),!e.chunked&&this.ifd0Offset>e.byteLength&&o(`IFD0 offset points to outside of file.\nthis.ifd0Offset: ${this.ifd0Offset}, file.byteLength: ${e.byteLength}`),e.tiff&&await e.ensureChunk(this.ifd0Offset,u(this.options));let t=this.parseBlock(this.ifd0Offset,"ifd0");return 0!==t.size?(this.exifOffset=t.get(E),this.interopOffset=t.get(D),this.gpsOffset=t.get(_),this.xmp=t.get(700),this.iptc=t.get(F),this.icc=t.get(j),this.options.sanitize&&(t.delete(E),t.delete(D),t.delete(_),t.delete(700),t.delete(F),t.delete(j)),t):void 0}async parseExifBlock(){if(this.exif)return;if(this.ifd0||await this.parseIfd0Block(),void 0===this.exifOffset)return;this.file.tiff&&await this.file.ensureChunk(this.exifOffset,u(this.options));let e=this.parseBlock(this.exifOffset,"exif");return this.interopOffset||(this.interopOffset=e.get(D)),this.makerNote=e.get(P),this.userComment=e.get(z),this.options.sanitize&&(e.delete(D),e.delete(P),e.delete(z)),this.unpack(e,41728),this.unpack(e,41729),e}unpack(e,t){let s=e.get(t);s&&1===s.length&&e.set(t,s[0])}async parseGpsBlock(){if(this.gps)return;if(this.ifd0||await this.parseIfd0Block(),void 0===this.gpsOffset)return;let e=this.parseBlock(this.gpsOffset,"gps");return e&&e.has(2)&&e.has(4)&&(e.set("latitude",ce(...e.get(2),e.get(1))),e.set("longitude",ce(...e.get(4),e.get(3)))),e}async parseInteropBlock(){if(!this.interop&&(this.ifd0||await this.parseIfd0Block(),void 0!==this.interopOffset||this.exif||await this.parseExifBlock(),void 0!==this.interopOffset))return this.parseBlock(this.interopOffset,"interop")}async parseThumbnailBlock(e=!1){if(!this.ifd1&&!this.ifd1Parsed&&(!this.options.mergeOutput||e))return this.findIfd1Offset(),this.ifd1Offset>0&&(this.parseBlock(this.ifd1Offset,"ifd1"),this.ifd1Parsed=!0),this.ifd1}async extractThumbnail(){if(this.headerParsed||this.parseHeader(),this.ifd1Parsed||await this.parseThumbnailBlock(!0),void 0===this.ifd1)return;let e=this.ifd1.get(513),t=this.ifd1.get(514);return this.chunk.getUint8Array(e,t)}get image(){return this.ifd0}get thumbnail(){return this.ifd1}createOutput(){let e,t,s,i={};for(t of $)if(e=this[t],!l(e))if(s=this.canTranslate?this.translateBlock(e,t):Object.fromEntries(e),this.options.mergeOutput){if("ifd1"===t)continue;Object.assign(i,s)}else i[t]=s;return this.makerNote&&(i.makerNote=this.makerNote),this.userComment&&(i.userComment=this.userComment),i}assignToOutput(e,t){if(this.globalOptions.mergeOutput)Object.assign(e,t);else for(let[s,i]of Object.entries(t))this.assignObjectToOutput(e,s,i)}}function ce(e,t,s,i){var n=e+t/60+s/3600;return"S"!==i&&"W"!==i||(n*=-1),n}t(de,"type","tiff"),t(de,"headerLength",10),b.set("tiff",de);var pe=Object.freeze({__proto__:null,default:ne,Exifr:se,fileParsers:y,segmentParsers:b,fileReaders:w,tagKeys:I,tagValues:L,tagRevivers:T,createDictionary:B,extendDictionary:V,fetchUrlAsArrayBuffer:U,readBlobAsArrayBuffer:x,chunkedProps:M,otherSegments:N,segments:R,tiffBlocks:$,segmentsAndBlocks:K,tiffExtractables:W,inheritables:X,allFormatters:H,Options:Q,parse:ie});const ge={ifd0:!1,ifd1:!1,exif:!1,gps:!1,interop:!1,sanitize:!1,reviveValues:!0,translateKeys:!1,translateValues:!1,mergeOutput:!1},me=Object.assign({},ge,{firstChunkSize:4e4,gps:[1,2,3,4]});const ye=Object.assign({},ge,{tiff:!1,ifd1:!0,mergeOutput:!1});const be=Object.assign({},ge,{firstChunkSize:4e4,ifd0:[274]});async function we(e){let t=new se(be);await t.read(e);let s=await t.parse();if(s&&s.ifd0)return s.ifd0[274]}const ke=Object.freeze({1:{dimensionSwapped:!1,scaleX:1,scaleY:1,deg:0,rad:0},2:{dimensionSwapped:!1,scaleX:-1,scaleY:1,deg:0,rad:0},3:{dimensionSwapped:!1,scaleX:1,scaleY:1,deg:180,rad:180*Math.PI/180},4:{dimensionSwapped:!1,scaleX:-1,scaleY:1,deg:180,rad:180*Math.PI/180},5:{dimensionSwapped:!0,scaleX:1,scaleY:-1,deg:90,rad:90*Math.PI/180},6:{dimensionSwapped:!0,scaleX:1,scaleY:1,deg:90,rad:90*Math.PI/180},7:{dimensionSwapped:!0,scaleX:1,scaleY:-1,deg:270,rad:270*Math.PI/180},8:{dimensionSwapped:!0,scaleX:1,scaleY:1,deg:270,rad:270*Math.PI/180}});if(e.rotateCanvas=!0,e.rotateCss=!0,"object"==typeof navigator){let t=navigator.userAgent;if(t.includes("iPad")||t.includes("iPhone")){let s=t.match(/OS (\d+)_(\d+)/);if(s){let[,t,i]=s,n=Number(t)+.1*Number(i);e.rotateCanvas=n<13.4,e.rotateCss=!1}}else if(t.includes("OS X 10")){let[,s]=t.match(/OS X 10[_.](\d+)/);e.rotateCanvas=e.rotateCss=Number(s)<15}if(t.includes("Chrome/")){let[,s]=t.match(/Chrome\/(\d+)/);e.rotateCanvas=e.rotateCss=Number(s)<81}else if(t.includes("Firefox/")){let[,s]=t.match(/Firefox\/(\d+)/);e.rotateCanvas=e.rotateCss=Number(s)<77}}class Oe extends p{constructor(...e){super(...e),t(this,"ranges",new ve),0!==this.byteLength&&this.ranges.add(0,this.byteLength)}_tryExtend(e,t,s){if(0===e&&0===this.byteLength&&s){let e=new DataView(s.buffer||s,s.byteOffset,s.byteLength);this._swapDataView(e)}else{let s=e+t;if(s>this.byteLength){let{dataView:e}=this._extend(s);this._swapDataView(e)}}}_extend(e){let t;t=h?a.allocUnsafe(e):new Uint8Array(e);let s=new DataView(t.buffer,t.byteOffset,t.byteLength);return t.set(new Uint8Array(this.buffer,this.byteOffset,this.byteLength),0),{uintView:t,dataView:s}}subarray(e,t,s=!1){return t=t||this._lengthToEnd(e),s&&this._tryExtend(e,t),this.ranges.add(e,t),super.subarray(e,t)}set(e,t,s=!1){s&&this._tryExtend(t,e.byteLength,e);let i=super.set(e,t);return this.ranges.add(t,i.byteLength),i}async ensureChunk(e,t){this.chunked&&(this.ranges.available(e,t)||await this.readChunk(e,t))}available(e,t){return this.ranges.available(e,t)}}class ve{constructor(){t(this,"list",[])}get length(){return this.list.length}add(e,t,s=0){let i=e+t,n=this.list.filter((t=>Se(e,t.offset,i)||Se(e,t.end,i)));if(n.length>0){e=Math.min(e,...n.map((e=>e.offset))),i=Math.max(i,...n.map((e=>e.end))),t=i-e;let s=n.shift();s.offset=e,s.length=t,s.end=i,this.list=this.list.filter((e=>!n.includes(e)))}else this.list.push({offset:e,length:t,end:i})}available(e,t){let s=e+t;return this.list.some((t=>t.offset<=e&&s<=t.end))}}function Se(e,t,s){return e<=t&&t<=s}class Ae extends Oe{constructor(e,s){super(0),t(this,"chunksRead",0),this.input=e,this.options=s}async readWhole(){this.chunked=!1,await this.readChunk(this.nextChunkOffset)}async readChunked(){this.chunked=!0,await this.readChunk(0,this.options.firstChunkSize)}async readNextChunk(e=this.nextChunkOffset){if(this.fullyRead)return this.chunksRead++,!1;let t=this.options.chunkSize,s=await this.readChunk(e,t);return!!s&&s.byteLength===t}async readChunk(e,t){if(this.chunksRead++,0!==(t=this.safeWrapAddress(e,t)))return this._readChunk(e,t)}safeWrapAddress(e,t){return void 0!==this.size&&e+t>this.size?Math.max(0,this.size-e):t}get nextChunkOffset(){if(0!==this.ranges.list.length)return this.ranges.list[0].length}get canReadNextChunk(){return this.chunksRead<this.options.chunkLimit}get fullyRead(){return void 0!==this.size&&this.nextChunkOffset===this.size}read(){return this.options.chunked?this.readChunked():this.readWhole()}close(){}}w.set("blob",class extends Ae{async readWhole(){this.chunked=!1;let e=await x(this.input);this._swapArrayBuffer(e)}readChunked(){return this.chunked=!0,this.size=this.input.size,super.readChunked()}async _readChunk(e,t){let s=t?e+t:void 0,i=this.input.slice(e,s),n=await x(i);return this.set(n,e,!0)}}),e.Exifr=se,e.Options=Q,e.allFormatters=H,e.chunkedProps=M,e.createDictionary=B,e.default=pe,e.extendDictionary=V,e.fetchUrlAsArrayBuffer=U,e.fileParsers=y,e.fileReaders=w,e.gps=async function(e){let t=new se(me);await t.read(e);let s=await t.parse();if(s&&s.gps){let{latitude:e,longitude:t}=s.gps;return{latitude:e,longitude:t}}},e.gpsOnlyOptions=me,e.inheritables=X,e.orientation=we,e.orientationOnlyOptions=be,e.otherSegments=N,e.parse=ie,e.readBlobAsArrayBuffer=x,e.rotation=async function(t){let s=await we(t);return Object.assign({canvas:e.rotateCanvas,css:e.rotateCss},ke[s])},e.rotations=ke,e.segmentParsers=b,e.segments=R,e.segmentsAndBlocks=K,e.tagKeys=I,e.tagRevivers=T,e.tagValues=L,e.thumbnail=async function(e){let t=new se(ye);await t.read(e);let s=await t.extractThumbnail();return s&&h?a.from(s):s},e.thumbnailOnlyOptions=ye,e.thumbnailUrl=async function(e){let t=await this.thumbnail(e);if(void 0!==t){let e=new Blob([t]);return URL.createObjectURL(e)}},e.tiffBlocks=$,e.tiffExtractables=W,Object.defineProperty(e,"__esModule",{value:!0})}));


/***/ }),

/***/ "./node_modules/ieee754/index.js":
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ "./node_modules/is-shallow-equal/index.js":
/*!************************************************!*\
  !*** ./node_modules/is-shallow-equal/index.js ***!
  \************************************************/
/***/ ((module) => {

module.exports = function isShallowEqual (a, b) {
  if (a === b) return true
  for (var i in a) if (!(i in b)) return false
  for (var i in b) if (a[i] !== b[i]) return false
  return true
}


/***/ }),

/***/ "./node_modules/isarray/index.js":
/*!***************************************!*\
  !*** ./node_modules/isarray/index.js ***!
  \***************************************/
/***/ ((module) => {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),

/***/ "./node_modules/lodash.debounce/index.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash.debounce/index.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = debounce;


/***/ }),

/***/ "./node_modules/lodash.throttle/index.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash.throttle/index.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = throttle;


/***/ }),

/***/ "./node_modules/memoize-one/dist/memoize-one.esm.js":
/*!**********************************************************!*\
  !*** ./node_modules/memoize-one/dist/memoize-one.esm.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var safeIsNaN = Number.isNaN ||
    function ponyfill(value) {
        return typeof value === 'number' && value !== value;
    };
function isEqual(first, second) {
    if (first === second) {
        return true;
    }
    if (safeIsNaN(first) && safeIsNaN(second)) {
        return true;
    }
    return false;
}
function areInputsEqual(newInputs, lastInputs) {
    if (newInputs.length !== lastInputs.length) {
        return false;
    }
    for (var i = 0; i < newInputs.length; i++) {
        if (!isEqual(newInputs[i], lastInputs[i])) {
            return false;
        }
    }
    return true;
}

function memoizeOne(resultFn, isEqual) {
    if (isEqual === void 0) { isEqual = areInputsEqual; }
    var lastThis;
    var lastArgs = [];
    var lastResult;
    var calledOnce = false;
    function memoized() {
        var newArgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            newArgs[_i] = arguments[_i];
        }
        if (calledOnce && lastThis === this && isEqual(newArgs, lastArgs)) {
            return lastResult;
        }
        lastResult = resultFn.apply(this, newArgs);
        calledOnce = true;
        lastThis = this;
        lastArgs = newArgs;
        return lastResult;
    }
    return memoized;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (memoizeOne);


/***/ }),

/***/ "./node_modules/mime-match/index.js":
/*!******************************************!*\
  !*** ./node_modules/mime-match/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var wildcard = __webpack_require__(/*! wildcard */ "./node_modules/wildcard/index.js");
var reMimePartSplit = /[\/\+\.]/;

/**
  # mime-match

  A simple function to checker whether a target mime type matches a mime-type
  pattern (e.g. image/jpeg matches image/jpeg OR image/*).

  ## Example Usage

  <<< example.js

**/
module.exports = function(target, pattern) {
  function test(pattern) {
    var result = wildcard(pattern, target, reMimePartSplit);

    // ensure that we have a valid mime type (should have two parts)
    return result && result.length >= 2;
  }

  return pattern ? test(pattern.split(';')[0]) : test;
};


/***/ }),

/***/ "./resources/sass/tool.scss":
/*!**********************************!*\
  !*** ./resources/sass/tool.scss ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/namespace-emitter/index.js":
/*!*************************************************!*\
  !*** ./node_modules/namespace-emitter/index.js ***!
  \*************************************************/
/***/ ((module) => {

/**
* Create an event emitter with namespaces
* @name createNamespaceEmitter
* @example
* var emitter = require('./index')()
*
* emitter.on('*', function () {
*   console.log('all events emitted', this.event)
* })
*
* emitter.on('example', function () {
*   console.log('example event emitted')
* })
*/
module.exports = function createNamespaceEmitter () {
  var emitter = {}
  var _fns = emitter._fns = {}

  /**
  * Emit an event. Optionally namespace the event. Handlers are fired in the order in which they were added with exact matches taking precedence. Separate the namespace and event with a `:`
  * @name emit
  * @param {String} event – the name of the event, with optional namespace
  * @param {...*} data – up to 6 arguments that are passed to the event listener
  * @example
  * emitter.emit('example')
  * emitter.emit('demo:test')
  * emitter.emit('data', { example: true}, 'a string', 1)
  */
  emitter.emit = function emit (event, arg1, arg2, arg3, arg4, arg5, arg6) {
    var toEmit = getListeners(event)

    if (toEmit.length) {
      emitAll(event, toEmit, [arg1, arg2, arg3, arg4, arg5, arg6])
    }
  }

  /**
  * Create en event listener.
  * @name on
  * @param {String} event
  * @param {Function} fn
  * @example
  * emitter.on('example', function () {})
  * emitter.on('demo', function () {})
  */
  emitter.on = function on (event, fn) {
    if (!_fns[event]) {
      _fns[event] = []
    }

    _fns[event].push(fn)
  }

  /**
  * Create en event listener that fires once.
  * @name once
  * @param {String} event
  * @param {Function} fn
  * @example
  * emitter.once('example', function () {})
  * emitter.once('demo', function () {})
  */
  emitter.once = function once (event, fn) {
    function one () {
      fn.apply(this, arguments)
      emitter.off(event, one)
    }
    this.on(event, one)
  }

  /**
  * Stop listening to an event. Stop all listeners on an event by only passing the event name. Stop a single listener by passing that event handler as a callback.
  * You must be explicit about what will be unsubscribed: `emitter.off('demo')` will unsubscribe an `emitter.on('demo')` listener,
  * `emitter.off('demo:example')` will unsubscribe an `emitter.on('demo:example')` listener
  * @name off
  * @param {String} event
  * @param {Function} [fn] – the specific handler
  * @example
  * emitter.off('example')
  * emitter.off('demo', function () {})
  */
  emitter.off = function off (event, fn) {
    var keep = []

    if (event && fn) {
      var fns = this._fns[event]
      var i = 0
      var l = fns ? fns.length : 0

      for (i; i < l; i++) {
        if (fns[i] !== fn) {
          keep.push(fns[i])
        }
      }
    }

    keep.length ? this._fns[event] = keep : delete this._fns[event]
  }

  function getListeners (e) {
    var out = _fns[e] ? _fns[e] : []
    var idx = e.indexOf(':')
    var args = (idx === -1) ? [e] : [e.substring(0, idx), e.substring(idx + 1)]

    var keys = Object.keys(_fns)
    var i = 0
    var l = keys.length

    for (i; i < l; i++) {
      var key = keys[i]
      if (key === '*') {
        out = out.concat(_fns[key])
      }

      if (args.length === 2 && args[0] === key) {
        out = out.concat(_fns[key])
        break
      }
    }

    return out
  }

  function emitAll (e, fns, args) {
    var i = 0
    var l = fns.length

    for (i; i < l; i++) {
      if (!fns[i]) break
      fns[i].event = e
      fns[i].apply(fns[i], args)
    }
  }

  return emitter
}


/***/ }),

/***/ "./node_modules/preact/dist/preact.module.js":
/*!***************************************************!*\
  !*** ./node_modules/preact/dist/preact.module.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Component": () => (/* binding */ _),
/* harmony export */   "Fragment": () => (/* binding */ d),
/* harmony export */   "cloneElement": () => (/* binding */ B),
/* harmony export */   "createContext": () => (/* binding */ D),
/* harmony export */   "createElement": () => (/* binding */ v),
/* harmony export */   "createRef": () => (/* binding */ p),
/* harmony export */   "h": () => (/* binding */ v),
/* harmony export */   "hydrate": () => (/* binding */ q),
/* harmony export */   "isValidElement": () => (/* binding */ i),
/* harmony export */   "options": () => (/* binding */ l),
/* harmony export */   "render": () => (/* binding */ S),
/* harmony export */   "toChildArray": () => (/* binding */ A)
/* harmony export */ });
var n,l,u,i,t,o,r,f,e={},c=[],s=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function a(n,l){for(var u in l)n[u]=l[u];return n}function h(n){var l=n.parentNode;l&&l.removeChild(n)}function v(l,u,i){var t,o,r,f={};for(r in u)"key"==r?t=u[r]:"ref"==r?o=u[r]:f[r]=u[r];if(arguments.length>2&&(f.children=arguments.length>3?n.call(arguments,2):i),"function"==typeof l&&null!=l.defaultProps)for(r in l.defaultProps)void 0===f[r]&&(f[r]=l.defaultProps[r]);return y(l,f,t,o,null)}function y(n,i,t,o,r){var f={type:n,props:i,key:t,ref:o,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:null==r?++u:r};return null==r&&null!=l.vnode&&l.vnode(f),f}function p(){return{current:null}}function d(n){return n.children}function _(n,l){this.props=n,this.context=l}function k(n,l){if(null==l)return n.__?k(n.__,n.__.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return"function"==typeof n.type?k(n):null}function b(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return b(n)}}function m(n){(!n.__d&&(n.__d=!0)&&t.push(n)&&!g.__r++||r!==l.debounceRendering)&&((r=l.debounceRendering)||o)(g)}function g(){for(var n;g.__r=t.length;)n=t.sort(function(n,l){return n.__v.__b-l.__v.__b}),t=[],n.some(function(n){var l,u,i,t,o,r;n.__d&&(o=(t=(l=n).__v).__e,(r=l.__P)&&(u=[],(i=a({},t)).__v=t.__v+1,j(r,t,i,l.__n,void 0!==r.ownerSVGElement,null!=t.__h?[o]:null,u,null==o?k(t):o,t.__h),z(u,t),t.__e!=o&&b(t)))})}function w(n,l,u,i,t,o,r,f,s,a){var h,v,p,_,b,m,g,w=i&&i.__k||c,A=w.length;for(u.__k=[],h=0;h<l.length;h++)if(null!=(_=u.__k[h]=null==(_=l[h])||"boolean"==typeof _?null:"string"==typeof _||"number"==typeof _||"bigint"==typeof _?y(null,_,null,null,_):Array.isArray(_)?y(d,{children:_},null,null,null):_.__b>0?y(_.type,_.props,_.key,null,_.__v):_)){if(_.__=u,_.__b=u.__b+1,null===(p=w[h])||p&&_.key==p.key&&_.type===p.type)w[h]=void 0;else for(v=0;v<A;v++){if((p=w[v])&&_.key==p.key&&_.type===p.type){w[v]=void 0;break}p=null}j(n,_,p=p||e,t,o,r,f,s,a),b=_.__e,(v=_.ref)&&p.ref!=v&&(g||(g=[]),p.ref&&g.push(p.ref,null,_),g.push(v,_.__c||b,_)),null!=b?(null==m&&(m=b),"function"==typeof _.type&&_.__k===p.__k?_.__d=s=x(_,s,n):s=P(n,_,p,w,b,s),"function"==typeof u.type&&(u.__d=s)):s&&p.__e==s&&s.parentNode!=n&&(s=k(p))}for(u.__e=m,h=A;h--;)null!=w[h]&&("function"==typeof u.type&&null!=w[h].__e&&w[h].__e==u.__d&&(u.__d=k(i,h+1)),N(w[h],w[h]));if(g)for(h=0;h<g.length;h++)M(g[h],g[++h],g[++h])}function x(n,l,u){for(var i,t=n.__k,o=0;t&&o<t.length;o++)(i=t[o])&&(i.__=n,l="function"==typeof i.type?x(i,l,u):P(u,i,i,t,i.__e,l));return l}function A(n,l){return l=l||[],null==n||"boolean"==typeof n||(Array.isArray(n)?n.some(function(n){A(n,l)}):l.push(n)),l}function P(n,l,u,i,t,o){var r,f,e;if(void 0!==l.__d)r=l.__d,l.__d=void 0;else if(null==u||t!=o||null==t.parentNode)n:if(null==o||o.parentNode!==n)n.appendChild(t),r=null;else{for(f=o,e=0;(f=f.nextSibling)&&e<i.length;e+=2)if(f==t)break n;n.insertBefore(t,o),r=o}return void 0!==r?r:t.nextSibling}function C(n,l,u,i,t){var o;for(o in u)"children"===o||"key"===o||o in l||H(n,o,null,u[o],i);for(o in l)t&&"function"!=typeof l[o]||"children"===o||"key"===o||"value"===o||"checked"===o||u[o]===l[o]||H(n,o,l[o],u[o],i)}function $(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]=null==u?"":"number"!=typeof u||s.test(l)?u:u+"px"}function H(n,l,u,i,t){var o;n:if("style"===l)if("string"==typeof u)n.style.cssText=u;else{if("string"==typeof i&&(n.style.cssText=i=""),i)for(l in i)u&&l in u||$(n.style,l,"");if(u)for(l in u)i&&u[l]===i[l]||$(n.style,l,u[l])}else if("o"===l[0]&&"n"===l[1])o=l!==(l=l.replace(/Capture$/,"")),l=l.toLowerCase()in n?l.toLowerCase().slice(2):l.slice(2),n.l||(n.l={}),n.l[l+o]=u,u?i||n.addEventListener(l,o?T:I,o):n.removeEventListener(l,o?T:I,o);else if("dangerouslySetInnerHTML"!==l){if(t)l=l.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if("href"!==l&&"list"!==l&&"form"!==l&&"tabIndex"!==l&&"download"!==l&&l in n)try{n[l]=null==u?"":u;break n}catch(n){}"function"==typeof u||(null!=u&&(!1!==u||"a"===l[0]&&"r"===l[1])?n.setAttribute(l,u):n.removeAttribute(l))}}function I(n){this.l[n.type+!1](l.event?l.event(n):n)}function T(n){this.l[n.type+!0](l.event?l.event(n):n)}function j(n,u,i,t,o,r,f,e,c){var s,h,v,y,p,k,b,m,g,x,A,P=u.type;if(void 0!==u.constructor)return null;null!=i.__h&&(c=i.__h,e=u.__e=i.__e,u.__h=null,r=[e]),(s=l.__b)&&s(u);try{n:if("function"==typeof P){if(m=u.props,g=(s=P.contextType)&&t[s.__c],x=s?g?g.props.value:s.__:t,i.__c?b=(h=u.__c=i.__c).__=h.__E:("prototype"in P&&P.prototype.render?u.__c=h=new P(m,x):(u.__c=h=new _(m,x),h.constructor=P,h.render=O),g&&g.sub(h),h.props=m,h.state||(h.state={}),h.context=x,h.__n=t,v=h.__d=!0,h.__h=[]),null==h.__s&&(h.__s=h.state),null!=P.getDerivedStateFromProps&&(h.__s==h.state&&(h.__s=a({},h.__s)),a(h.__s,P.getDerivedStateFromProps(m,h.__s))),y=h.props,p=h.state,v)null==P.getDerivedStateFromProps&&null!=h.componentWillMount&&h.componentWillMount(),null!=h.componentDidMount&&h.__h.push(h.componentDidMount);else{if(null==P.getDerivedStateFromProps&&m!==y&&null!=h.componentWillReceiveProps&&h.componentWillReceiveProps(m,x),!h.__e&&null!=h.shouldComponentUpdate&&!1===h.shouldComponentUpdate(m,h.__s,x)||u.__v===i.__v){h.props=m,h.state=h.__s,u.__v!==i.__v&&(h.__d=!1),h.__v=u,u.__e=i.__e,u.__k=i.__k,u.__k.forEach(function(n){n&&(n.__=u)}),h.__h.length&&f.push(h);break n}null!=h.componentWillUpdate&&h.componentWillUpdate(m,h.__s,x),null!=h.componentDidUpdate&&h.__h.push(function(){h.componentDidUpdate(y,p,k)})}h.context=x,h.props=m,h.state=h.__s,(s=l.__r)&&s(u),h.__d=!1,h.__v=u,h.__P=n,s=h.render(h.props,h.state,h.context),h.state=h.__s,null!=h.getChildContext&&(t=a(a({},t),h.getChildContext())),v||null==h.getSnapshotBeforeUpdate||(k=h.getSnapshotBeforeUpdate(y,p)),A=null!=s&&s.type===d&&null==s.key?s.props.children:s,w(n,Array.isArray(A)?A:[A],u,i,t,o,r,f,e,c),h.base=u.__e,u.__h=null,h.__h.length&&f.push(h),b&&(h.__E=h.__=null),h.__e=!1}else null==r&&u.__v===i.__v?(u.__k=i.__k,u.__e=i.__e):u.__e=L(i.__e,u,i,t,o,r,f,c);(s=l.diffed)&&s(u)}catch(n){u.__v=null,(c||null!=r)&&(u.__e=e,u.__h=!!c,r[r.indexOf(e)]=null),l.__e(n,u,i)}}function z(n,u){l.__c&&l.__c(u,n),n.some(function(u){try{n=u.__h,u.__h=[],n.some(function(n){n.call(u)})}catch(n){l.__e(n,u.__v)}})}function L(l,u,i,t,o,r,f,c){var s,a,v,y=i.props,p=u.props,d=u.type,_=0;if("svg"===d&&(o=!0),null!=r)for(;_<r.length;_++)if((s=r[_])&&"setAttribute"in s==!!d&&(d?s.localName===d:3===s.nodeType)){l=s,r[_]=null;break}if(null==l){if(null===d)return document.createTextNode(p);l=o?document.createElementNS("http://www.w3.org/2000/svg",d):document.createElement(d,p.is&&p),r=null,c=!1}if(null===d)y===p||c&&l.data===p||(l.data=p);else{if(r=r&&n.call(l.childNodes),a=(y=i.props||e).dangerouslySetInnerHTML,v=p.dangerouslySetInnerHTML,!c){if(null!=r)for(y={},_=0;_<l.attributes.length;_++)y[l.attributes[_].name]=l.attributes[_].value;(v||a)&&(v&&(a&&v.__html==a.__html||v.__html===l.innerHTML)||(l.innerHTML=v&&v.__html||""))}if(C(l,p,y,o,c),v)u.__k=[];else if(_=u.props.children,w(l,Array.isArray(_)?_:[_],u,i,t,o&&"foreignObject"!==d,r,f,r?r[0]:i.__k&&k(i,0),c),null!=r)for(_=r.length;_--;)null!=r[_]&&h(r[_]);c||("value"in p&&void 0!==(_=p.value)&&(_!==l.value||"progress"===d&&!_||"option"===d&&_!==y.value)&&H(l,"value",_,y.value,!1),"checked"in p&&void 0!==(_=p.checked)&&_!==l.checked&&H(l,"checked",_,y.checked,!1))}return l}function M(n,u,i){try{"function"==typeof n?n(u):n.current=u}catch(n){l.__e(n,i)}}function N(n,u,i){var t,o;if(l.unmount&&l.unmount(n),(t=n.ref)&&(t.current&&t.current!==n.__e||M(t,null,u)),null!=(t=n.__c)){if(t.componentWillUnmount)try{t.componentWillUnmount()}catch(n){l.__e(n,u)}t.base=t.__P=null}if(t=n.__k)for(o=0;o<t.length;o++)t[o]&&N(t[o],u,"function"!=typeof n.type);i||null==n.__e||h(n.__e),n.__e=n.__d=void 0}function O(n,l,u){return this.constructor(n,u)}function S(u,i,t){var o,r,f;l.__&&l.__(u,i),r=(o="function"==typeof t)?null:t&&t.__k||i.__k,f=[],j(i,u=(!o&&t||i).__k=v(d,null,[u]),r||e,e,void 0!==i.ownerSVGElement,!o&&t?[t]:r?null:i.firstChild?n.call(i.childNodes):null,f,!o&&t?t:r?r.__e:i.firstChild,o),z(f,u)}function q(n,l){S(n,l,q)}function B(l,u,i){var t,o,r,f=a({},l.props);for(r in u)"key"==r?t=u[r]:"ref"==r?o=u[r]:f[r]=u[r];return arguments.length>2&&(f.children=arguments.length>3?n.call(arguments,2):i),y(l.type,f,t||l.key,o||l.ref,null)}function D(n,l){var u={__c:l="__cC"+f++,__:n,Consumer:function(n,l){return n.children(l)},Provider:function(n){var u,i;return this.getChildContext||(u=[],(i={})[l]=this,this.getChildContext=function(){return i},this.shouldComponentUpdate=function(n){this.props.value!==n.value&&u.some(m)},this.sub=function(n){u.push(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){u.splice(u.indexOf(n),1),l&&l.call(n)}}),n.children}};return u.Provider.__=u.Consumer.contextType=u}n=c.slice,l={__e:function(n,l,u,i){for(var t,o,r;l=l.__;)if((t=l.__c)&&!t.__)try{if((o=t.constructor)&&null!=o.getDerivedStateFromError&&(t.setState(o.getDerivedStateFromError(n)),r=t.__d),null!=t.componentDidCatch&&(t.componentDidCatch(n,i||{}),r=t.__d),r)return t.__E=t}catch(l){n=l}throw n}},u=0,i=function(n){return null!=n&&void 0===n.constructor},_.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=a({},this.state),"function"==typeof n&&(n=n(a({},u),this.props)),n&&a(u,n),null!=n&&this.__v&&(l&&this.__h.push(l),m(this))},_.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),m(this))},_.prototype.render=d,t=[],o="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,g.__r=0,f=0;
//# sourceMappingURL=preact.module.js.map


/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/***/ ((module) => {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/shallow-equal/dist/index.esm.js":
/*!******************************************************!*\
  !*** ./node_modules/shallow-equal/dist/index.esm.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "shallowEqualArrays": () => (/* binding */ shallowEqualArrays),
/* harmony export */   "shallowEqualObjects": () => (/* binding */ shallowEqualObjects)
/* harmony export */ });
function shallowEqualObjects(objA, objB) {
  if (objA === objB) {
    return true;
  }

  if (!objA || !objB) {
    return false;
  }

  var aKeys = Object.keys(objA);
  var bKeys = Object.keys(objB);
  var len = aKeys.length;

  if (bKeys.length !== len) {
    return false;
  }

  for (var i = 0; i < len; i++) {
    var key = aKeys[i];

    if (objA[key] !== objB[key] || !Object.prototype.hasOwnProperty.call(objB, key)) {
      return false;
    }
  }

  return true;
}

function shallowEqualArrays(arrA, arrB) {
  if (arrA === arrB) {
    return true;
  }

  if (!arrA || !arrB) {
    return false;
  }

  var len = arrA.length;

  if (arrB.length !== len) {
    return false;
  }

  for (var i = 0; i < len; i++) {
    if (arrA[i] !== arrB[i]) {
      return false;
    }
  }

  return true;
}




/***/ }),

/***/ "./node_modules/vue-loader/dist/exportHelper.js":
/*!******************************************************!*\
  !*** ./node_modules/vue-loader/dist/exportHelper.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
// runtime helper for setting properties on components
// in a tree-shakable way
exports["default"] = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
        target[key] = val;
    }
    return target;
};


/***/ }),

/***/ "./resources/js/components/FileCard.vue":
/*!**********************************************!*\
  !*** ./resources/js/components/FileCard.vue ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FileCard_vue_vue_type_template_id_63c6b3d2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FileCard.vue?vue&type=template&id=63c6b3d2 */ "./resources/js/components/FileCard.vue?vue&type=template&id=63c6b3d2");
/* harmony import */ var _FileCard_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FileCard.vue?vue&type=script&lang=js */ "./resources/js/components/FileCard.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_kelvinngunyi_Codeden_kirschbaum_corcoran_ad_nova_components_nova_s3_multipart_upload_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_kelvinngunyi_Codeden_kirschbaum_corcoran_ad_nova_components_nova_s3_multipart_upload_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_FileCard_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_FileCard_vue_vue_type_template_id_63c6b3d2__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/components/FileCard.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/components/FilesGrid.vue":
/*!***********************************************!*\
  !*** ./resources/js/components/FilesGrid.vue ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FilesGrid_vue_vue_type_template_id_40ceda02__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FilesGrid.vue?vue&type=template&id=40ceda02 */ "./resources/js/components/FilesGrid.vue?vue&type=template&id=40ceda02");
/* harmony import */ var _FilesGrid_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FilesGrid.vue?vue&type=script&lang=js */ "./resources/js/components/FilesGrid.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_kelvinngunyi_Codeden_kirschbaum_corcoran_ad_nova_components_nova_s3_multipart_upload_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_kelvinngunyi_Codeden_kirschbaum_corcoran_ad_nova_components_nova_s3_multipart_upload_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_FilesGrid_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_FilesGrid_vue_vue_type_template_id_40ceda02__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/components/FilesGrid.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/components/Tool.vue":
/*!******************************************!*\
  !*** ./resources/js/components/Tool.vue ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Tool_vue_vue_type_template_id_68ff5483__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Tool.vue?vue&type=template&id=68ff5483 */ "./resources/js/components/Tool.vue?vue&type=template&id=68ff5483");
/* harmony import */ var _Tool_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Tool.vue?vue&type=script&lang=js */ "./resources/js/components/Tool.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_kelvinngunyi_Codeden_kirschbaum_corcoran_ad_nova_components_nova_s3_multipart_upload_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_kelvinngunyi_Codeden_kirschbaum_corcoran_ad_nova_components_nova_s3_multipart_upload_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_Tool_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_Tool_vue_vue_type_template_id_68ff5483__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/components/Tool.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/components/UppyWrapper.vue":
/*!*************************************************!*\
  !*** ./resources/js/components/UppyWrapper.vue ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _UppyWrapper_vue_vue_type_template_id_b8d52518__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UppyWrapper.vue?vue&type=template&id=b8d52518 */ "./resources/js/components/UppyWrapper.vue?vue&type=template&id=b8d52518");
/* harmony import */ var _UppyWrapper_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./UppyWrapper.vue?vue&type=script&lang=js */ "./resources/js/components/UppyWrapper.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_kelvinngunyi_Codeden_kirschbaum_corcoran_ad_nova_components_nova_s3_multipart_upload_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_kelvinngunyi_Codeden_kirschbaum_corcoran_ad_nova_components_nova_s3_multipart_upload_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_UppyWrapper_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_UppyWrapper_vue_vue_type_template_id_b8d52518__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/components/UppyWrapper.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/components/FileCard.vue?vue&type=script&lang=js":
/*!**********************************************************************!*\
  !*** ./resources/js/components/FileCard.vue?vue&type=script&lang=js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_FileCard_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_FileCard_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./FileCard.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/FileCard.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/components/FilesGrid.vue?vue&type=script&lang=js":
/*!***********************************************************************!*\
  !*** ./resources/js/components/FilesGrid.vue?vue&type=script&lang=js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_FilesGrid_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_FilesGrid_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./FilesGrid.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/FilesGrid.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/components/Tool.vue?vue&type=script&lang=js":
/*!******************************************************************!*\
  !*** ./resources/js/components/Tool.vue?vue&type=script&lang=js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Tool_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Tool_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./Tool.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/Tool.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/components/UppyWrapper.vue?vue&type=script&lang=js":
/*!*************************************************************************!*\
  !*** ./resources/js/components/UppyWrapper.vue?vue&type=script&lang=js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_UppyWrapper_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_UppyWrapper_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./UppyWrapper.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/UppyWrapper.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/components/FileCard.vue?vue&type=template&id=63c6b3d2":
/*!****************************************************************************!*\
  !*** ./resources/js/components/FileCard.vue?vue&type=template&id=63c6b3d2 ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_FileCard_vue_vue_type_template_id_63c6b3d2__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_FileCard_vue_vue_type_template_id_63c6b3d2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./FileCard.vue?vue&type=template&id=63c6b3d2 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/FileCard.vue?vue&type=template&id=63c6b3d2");


/***/ }),

/***/ "./resources/js/components/FilesGrid.vue?vue&type=template&id=40ceda02":
/*!*****************************************************************************!*\
  !*** ./resources/js/components/FilesGrid.vue?vue&type=template&id=40ceda02 ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_FilesGrid_vue_vue_type_template_id_40ceda02__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_FilesGrid_vue_vue_type_template_id_40ceda02__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./FilesGrid.vue?vue&type=template&id=40ceda02 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/FilesGrid.vue?vue&type=template&id=40ceda02");


/***/ }),

/***/ "./resources/js/components/Tool.vue?vue&type=template&id=68ff5483":
/*!************************************************************************!*\
  !*** ./resources/js/components/Tool.vue?vue&type=template&id=68ff5483 ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Tool_vue_vue_type_template_id_68ff5483__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Tool_vue_vue_type_template_id_68ff5483__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./Tool.vue?vue&type=template&id=68ff5483 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/Tool.vue?vue&type=template&id=68ff5483");


/***/ }),

/***/ "./resources/js/components/UppyWrapper.vue?vue&type=template&id=b8d52518":
/*!*******************************************************************************!*\
  !*** ./resources/js/components/UppyWrapper.vue?vue&type=template&id=b8d52518 ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_UppyWrapper_vue_vue_type_template_id_b8d52518__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_UppyWrapper_vue_vue_type_template_id_b8d52518__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./UppyWrapper.vue?vue&type=template&id=b8d52518 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/UppyWrapper.vue?vue&type=template&id=b8d52518");


/***/ }),

/***/ "./node_modules/wildcard/index.js":
/*!****************************************!*\
  !*** ./node_modules/wildcard/index.js ***!
  \****************************************/
/***/ ((module) => {

"use strict";
/* jshint node: true */


/**
  # wildcard

  Very simple wildcard matching, which is designed to provide the same
  functionality that is found in the
  [eve](https://github.com/adobe-webplatform/eve) eventing library.

  ## Usage

  It works with strings:

  <<< examples/strings.js

  Arrays:

  <<< examples/arrays.js

  Objects (matching against keys):

  <<< examples/objects.js

  While the library works in Node, if you are are looking for file-based
  wildcard matching then you should have a look at:

  <https://github.com/isaacs/node-glob>
**/

function WildcardMatcher(text, separator) {
  this.text = text = text || '';
  this.hasWild = ~text.indexOf('*');
  this.separator = separator;
  this.parts = text.split(separator);
}

WildcardMatcher.prototype.match = function(input) {
  var matches = true;
  var parts = this.parts;
  var ii;
  var partsCount = parts.length;
  var testParts;

  if (typeof input == 'string' || input instanceof String) {
    if (!this.hasWild && this.text != input) {
      matches = false;
    } else {
      testParts = (input || '').split(this.separator);
      for (ii = 0; matches && ii < partsCount; ii++) {
        if (parts[ii] === '*')  {
          continue;
        } else if (ii < testParts.length) {
          matches = parts[ii] === testParts[ii];
        } else {
          matches = false;
        }
      }

      // If matches, then return the component parts
      matches = matches && testParts;
    }
  }
  else if (typeof input.splice == 'function') {
    matches = [];

    for (ii = input.length; ii--; ) {
      if (this.match(input[ii])) {
        matches[matches.length] = input[ii];
      }
    }
  }
  else if (typeof input == 'object') {
    matches = {};

    for (var key in input) {
      if (this.match(key)) {
        matches[key] = input[key];
      }
    }
  }

  return matches;
};

module.exports = function(text, test, separator) {
  var matcher = new WildcardMatcher(text, separator || /[\/\.]/);
  if (typeof test != 'undefined') {
    return matcher.match(test);
  }

  return matcher;
};


/***/ }),

/***/ "vue":
/*!**********************!*\
  !*** external "Vue" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = Vue;

/***/ }),

/***/ "./node_modules/@uppy/drag-drop/lib/DragDrop.js":
/*!******************************************************!*\
  !*** ./node_modules/@uppy/drag-drop/lib/DragDrop.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _core = __webpack_require__(/*! @uppy/core */ "./node_modules/@uppy/core/lib/index.js");

var _preact = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const toArray = __webpack_require__(/*! @uppy/utils/lib/toArray */ "./node_modules/@uppy/utils/lib/toArray.js");

const isDragDropSupported = __webpack_require__(/*! @uppy/utils/lib/isDragDropSupported */ "./node_modules/@uppy/utils/lib/isDragDropSupported.js");

const getDroppedFiles = __webpack_require__(/*! @uppy/utils/lib/getDroppedFiles */ "./node_modules/@uppy/utils/lib/getDroppedFiles/index.js");

const packageJson = {
  "version": "2.1.0"
};

const locale = __webpack_require__(/*! ./locale.js */ "./node_modules/@uppy/drag-drop/lib/locale.js");
/**
 * Drag & Drop plugin
 *
 */


class DragDrop extends _core.UIPlugin {
  constructor(uppy, opts) {
    super(uppy, opts);

    this.handleDrop = async event => {
      var _this$opts$onDrop, _this$opts;

      event.preventDefault();
      event.stopPropagation();
      clearTimeout(this.removeDragOverClassTimeout); // Remove dragover class

      this.setPluginState({
        isDraggingOver: false
      });

      const logDropError = error => {
        this.uppy.log(error, 'error');
      }; // Add all dropped files


      const files = await getDroppedFiles(event.dataTransfer, {
        logDropError
      });

      if (files.length > 0) {
        this.uppy.log('[DragDrop] Files dropped');
        this.addFiles(files);
      }

      (_this$opts$onDrop = (_this$opts = this.opts).onDrop) == null ? void 0 : _this$opts$onDrop.call(_this$opts, event);
    };

    this.type = 'acquirer';
    this.id = this.opts.id || 'DragDrop';
    this.title = 'Drag & Drop';
    this.defaultLocale = locale; // Default options

    const defaultOpts = {
      target: null,
      inputName: 'files[]',
      width: '100%',
      height: '100%',
      note: null
    }; // Merge default options with the ones set by user

    this.opts = { ...defaultOpts,
      ...opts
    };
    this.i18nInit(); // Check for browser dragDrop support

    this.isDragDropSupported = isDragDropSupported();
    this.removeDragOverClassTimeout = null; // Bind `this` to class methods

    this.onInputChange = this.onInputChange.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.addFiles = this.addFiles.bind(this);
    this.render = this.render.bind(this);
  }

  addFiles(files) {
    const descriptors = files.map(file => ({
      source: this.id,
      name: file.name,
      type: file.type,
      data: file,
      meta: {
        // path of the file relative to the ancestor directory the user selected.
        // e.g. 'docs/Old Prague/airbnb.pdf'
        relativePath: file.relativePath || null
      }
    }));

    try {
      this.uppy.addFiles(descriptors);
    } catch (err) {
      this.uppy.log(err);
    }
  }

  onInputChange(event) {
    const files = toArray(event.target.files);

    if (files.length > 0) {
      this.uppy.log('[DragDrop] Files selected through input');
      this.addFiles(files);
    } // We clear the input after a file is selected, because otherwise
    // change event is not fired in Chrome and Safari when a file
    // with the same name is selected.
    // ___Why not use value="" on <input/> instead?
    //    Because if we use that method of clearing the input,
    //    Chrome will not trigger change if we drop the same file twice (Issue #768).
    // eslint-disable-next-line no-param-reassign


    event.target.value = null;
  }

  handleDragOver(event) {
    var _this$opts$onDragOver, _this$opts2;

    event.preventDefault();
    event.stopPropagation(); // Check if the "type" of the datatransfer object includes files. If not, deny drop.

    const {
      types
    } = event.dataTransfer;
    const hasFiles = types.some(type => type === 'Files');
    const {
      allowNewUpload
    } = this.uppy.getState();

    if (!hasFiles || !allowNewUpload) {
      // eslint-disable-next-line no-param-reassign
      event.dataTransfer.dropEffect = 'none';
      clearTimeout(this.removeDragOverClassTimeout);
      return;
    } // Add a small (+) icon on drop
    // (and prevent browsers from interpreting this as files being _moved_ into the browser
    // https://github.com/transloadit/uppy/issues/1978)
    //
    // eslint-disable-next-line no-param-reassign


    event.dataTransfer.dropEffect = 'copy';
    clearTimeout(this.removeDragOverClassTimeout);
    this.setPluginState({
      isDraggingOver: true
    });
    (_this$opts$onDragOver = (_this$opts2 = this.opts).onDragOver) == null ? void 0 : _this$opts$onDragOver.call(_this$opts2, event);
  }

  handleDragLeave(event) {
    var _this$opts$onDragLeav, _this$opts3;

    event.preventDefault();
    event.stopPropagation();
    clearTimeout(this.removeDragOverClassTimeout); // Timeout against flickering, this solution is taken from drag-drop library.
    // Solution with 'pointer-events: none' didn't work across browsers.

    this.removeDragOverClassTimeout = setTimeout(() => {
      this.setPluginState({
        isDraggingOver: false
      });
    }, 50);
    (_this$opts$onDragLeav = (_this$opts3 = this.opts).onDragLeave) == null ? void 0 : _this$opts$onDragLeav.call(_this$opts3, event);
  }

  renderHiddenFileInput() {
    const {
      restrictions
    } = this.uppy.opts;
    return (0, _preact.h)("input", {
      className: "uppy-DragDrop-input",
      type: "file",
      hidden: true,
      ref: ref => {
        this.fileInputRef = ref;
      },
      name: this.opts.inputName,
      multiple: restrictions.maxNumberOfFiles !== 1,
      accept: restrictions.allowedFileTypes,
      onChange: this.onInputChange
    });
  }

  static renderArrowSvg() {
    return (0, _preact.h)("svg", {
      "aria-hidden": "true",
      focusable: "false",
      className: "uppy-c-icon uppy-DragDrop-arrow",
      width: "16",
      height: "16",
      viewBox: "0 0 16 16"
    }, (0, _preact.h)("path", {
      d: "M11 10V0H5v10H2l6 6 6-6h-3zm0 0",
      fillRule: "evenodd"
    }));
  }

  renderLabel() {
    return (0, _preact.h)("div", {
      className: "uppy-DragDrop-label"
    }, this.i18nArray('dropHereOr', {
      browse: (0, _preact.h)("span", {
        className: "uppy-DragDrop-browse"
      }, this.i18n('browse'))
    }));
  }

  renderNote() {
    return (0, _preact.h)("span", {
      className: "uppy-DragDrop-note"
    }, this.opts.note);
  }

  render() {
    const dragDropClass = `uppy-u-reset
      uppy-DragDrop-container
      ${this.isDragDropSupported ? 'uppy-DragDrop--isDragDropSupported' : ''}
      ${this.getPluginState().isDraggingOver ? 'uppy-DragDrop--isDraggingOver' : ''}
    `;
    const dragDropStyle = {
      width: this.opts.width,
      height: this.opts.height
    };
    return (0, _preact.h)("button", {
      type: "button",
      className: dragDropClass,
      style: dragDropStyle,
      onClick: () => this.fileInputRef.click(),
      onDragOver: this.handleDragOver,
      onDragLeave: this.handleDragLeave,
      onDrop: this.handleDrop
    }, this.renderHiddenFileInput(), (0, _preact.h)("div", {
      className: "uppy-DragDrop-inner"
    }, DragDrop.renderArrowSvg(), this.renderLabel(), this.renderNote()));
  }

  install() {
    const {
      target
    } = this.opts;
    this.setPluginState({
      isDraggingOver: false
    });

    if (target) {
      this.mount(target, this);
    }
  }

  uninstall() {
    this.unmount();
  }

}

DragDrop.VERSION = packageJson.version;
module.exports = DragDrop;

/***/ }),

/***/ "./node_modules/@uppy/drag-drop/lib/index.js":
/*!***************************************************!*\
  !*** ./node_modules/@uppy/drag-drop/lib/index.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = __webpack_require__(/*! ./DragDrop.js */ "./node_modules/@uppy/drag-drop/lib/DragDrop.js");

/***/ }),

/***/ "./node_modules/@uppy/drag-drop/lib/locale.js":
/*!****************************************************!*\
  !*** ./node_modules/@uppy/drag-drop/lib/locale.js ***!
  \****************************************************/
/***/ ((module) => {

"use strict";


module.exports = {
  strings: {
    // Text to show on the droppable area.
    // `%{browse}` is replaced with a link that opens the system file selection dialog.
    dropHereOr: 'Drop here or %{browse}',
    // Used as the label for the link that opens the system file selection dialog.
    browse: 'browse'
  }
};

/***/ }),

/***/ "./node_modules/@uppy/image-editor/lib/Editor.js":
/*!*******************************************************!*\
  !*** ./node_modules/@uppy/image-editor/lib/Editor.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _preact = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const CropperImport = __webpack_require__(/*! cropperjs */ "./node_modules/cropperjs/dist/cropper.js");

// @TODO A silly hack that we can get rid of when we start publishing ESM to the npm package.
// eslint-disable-next-line no-underscore-dangle
const Cropper = CropperImport.__esModule ? CropperImport.default : CropperImport;

class Editor extends _preact.Component {
  constructor(props) {
    super(props);

    this.granularRotateOnChange = ev => {
      const {
        rotationAngle,
        rotationDelta
      } = this.state;
      const pendingRotationDelta = Number(ev.target.value) - rotationDelta;
      cancelAnimationFrame(this.granularRotateOnInputNextFrame);

      if (pendingRotationDelta !== 0) {
        const pendingRotationAngle = rotationAngle + pendingRotationDelta;
        this.granularRotateOnInputNextFrame = requestAnimationFrame(() => {
          this.cropper.rotateTo(pendingRotationAngle);
        });
      }
    };

    this.state = {
      rotationAngle: 0,
      rotationDelta: 0
    };
  }

  componentDidMount() {
    const {
      opts,
      storeCropperInstance
    } = this.props;
    this.cropper = new Cropper(this.imgElement, opts.cropperOptions);
    storeCropperInstance(this.cropper);

    if (opts.actions.granularRotate) {
      this.imgElement.addEventListener('crop', ev => {
        const rotationAngle = ev.detail.rotate;
        this.setState({
          rotationAngle,
          // 405 == 360 + 45
          rotationDelta: (rotationAngle + 405) % 90 - 45
        });
      });
    }
  }

  componentWillUnmount() {
    this.cropper.destroy();
  }

  renderGranularRotate() {
    const {
      i18n
    } = this.props;
    const {
      rotationDelta,
      rotationAngle
    } = this.state;
    return (// eslint-disable-next-line jsx-a11y/label-has-associated-control
      (0, _preact.h)("label", {
        "data-microtip-position": "top",
        role: "tooltip",
        "aria-label": `${rotationAngle}º`,
        className: "uppy-ImageCropper-rangeWrapper uppy-u-reset"
      }, (0, _preact.h)("input", {
        className: "uppy-ImageCropper-range uppy-u-reset",
        type: "range",
        onInput: this.granularRotateOnChange,
        onChange: this.granularRotateOnChange,
        value: rotationDelta,
        min: "-45",
        max: "44",
        "aria-label": i18n('rotate')
      }))
    );
  }

  renderRevert() {
    const {
      i18n
    } = this.props;
    return (0, _preact.h)("button", {
      type: "button",
      className: "uppy-u-reset uppy-c-btn",
      "aria-label": i18n('revert'),
      "data-microtip-position": "top",
      onClick: () => {
        this.cropper.reset();
        this.cropper.setAspectRatio(0);
      }
    }, (0, _preact.h)("svg", {
      "aria-hidden": "true",
      className: "uppy-c-icon",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24"
    }, (0, _preact.h)("path", {
      d: "M0 0h24v24H0z",
      fill: "none"
    }), (0, _preact.h)("path", {
      d: "M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"
    })));
  }

  renderRotate() {
    const {
      i18n
    } = this.props;
    return (0, _preact.h)("button", {
      type: "button",
      className: "uppy-u-reset uppy-c-btn",
      onClick: () => this.cropper.rotate(-90),
      "aria-label": i18n('rotate'),
      "data-microtip-position": "top"
    }, (0, _preact.h)("svg", {
      "aria-hidden": "true",
      className: "uppy-c-icon",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24"
    }, (0, _preact.h)("path", {
      d: "M0 0h24v24H0V0zm0 0h24v24H0V0z",
      fill: "none"
    }), (0, _preact.h)("path", {
      d: "M14 10a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7a2 2 0 012-2h8zm0 1.75H6a.25.25 0 00-.243.193L5.75 12v7a.25.25 0 00.193.243L6 19.25h8a.25.25 0 00.243-.193L14.25 19v-7a.25.25 0 00-.193-.243L14 11.75zM12 .76V4c2.3 0 4.61.88 6.36 2.64a8.95 8.95 0 012.634 6.025L21 13a1 1 0 01-1.993.117L19 13h-.003a6.979 6.979 0 00-2.047-4.95 6.97 6.97 0 00-4.652-2.044L12 6v3.24L7.76 5 12 .76z"
    })));
  }

  renderFlip() {
    const {
      i18n
    } = this.props;
    return (0, _preact.h)("button", {
      type: "button",
      className: "uppy-u-reset uppy-c-btn",
      "aria-label": i18n('flipHorizontal'),
      "data-microtip-position": "top",
      onClick: () => this.cropper.scaleX(-this.cropper.getData().scaleX || -1)
    }, (0, _preact.h)("svg", {
      "aria-hidden": "true",
      className: "uppy-c-icon",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24"
    }, (0, _preact.h)("path", {
      d: "M0 0h24v24H0z",
      fill: "none"
    }), (0, _preact.h)("path", {
      d: "M15 21h2v-2h-2v2zm4-12h2V7h-2v2zM3 5v14c0 1.1.9 2 2 2h4v-2H5V5h4V3H5c-1.1 0-2 .9-2 2zm16-2v2h2c0-1.1-.9-2-2-2zm-8 20h2V1h-2v22zm8-6h2v-2h-2v2zM15 5h2V3h-2v2zm4 8h2v-2h-2v2zm0 8c1.1 0 2-.9 2-2h-2v2z"
    })));
  }

  renderZoomIn() {
    const {
      i18n
    } = this.props;
    return (0, _preact.h)("button", {
      type: "button",
      className: "uppy-u-reset uppy-c-btn",
      "aria-label": i18n('zoomIn'),
      "data-microtip-position": "top",
      onClick: () => this.cropper.zoom(0.1)
    }, (0, _preact.h)("svg", {
      "aria-hidden": "true",
      className: "uppy-c-icon",
      height: "24",
      viewBox: "0 0 24 24",
      width: "24"
    }, (0, _preact.h)("path", {
      d: "M0 0h24v24H0V0z",
      fill: "none"
    }), (0, _preact.h)("path", {
      d: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
    }), (0, _preact.h)("path", {
      d: "M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z"
    })));
  }

  renderZoomOut() {
    const {
      i18n
    } = this.props;
    return (0, _preact.h)("button", {
      type: "button",
      className: "uppy-u-reset uppy-c-btn",
      "aria-label": i18n('zoomOut'),
      "data-microtip-position": "top",
      onClick: () => this.cropper.zoom(-0.1)
    }, (0, _preact.h)("svg", {
      "aria-hidden": "true",
      className: "uppy-c-icon",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24"
    }, (0, _preact.h)("path", {
      d: "M0 0h24v24H0V0z",
      fill: "none"
    }), (0, _preact.h)("path", {
      d: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z"
    })));
  }

  renderCropSquare() {
    const {
      i18n
    } = this.props;
    return (0, _preact.h)("button", {
      type: "button",
      className: "uppy-u-reset uppy-c-btn",
      "aria-label": i18n('aspectRatioSquare'),
      "data-microtip-position": "top",
      onClick: () => this.cropper.setAspectRatio(1)
    }, (0, _preact.h)("svg", {
      "aria-hidden": "true",
      className: "uppy-c-icon",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24"
    }, (0, _preact.h)("path", {
      d: "M0 0h24v24H0z",
      fill: "none"
    }), (0, _preact.h)("path", {
      d: "M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
    })));
  }

  renderCropWidescreen() {
    const {
      i18n
    } = this.props;
    return (0, _preact.h)("button", {
      type: "button",
      className: "uppy-u-reset uppy-c-btn",
      "aria-label": i18n('aspectRatioLandscape'),
      "data-microtip-position": "top",
      onClick: () => this.cropper.setAspectRatio(16 / 9)
    }, (0, _preact.h)("svg", {
      "aria-hidden": "true",
      className: "uppy-c-icon",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24"
    }, (0, _preact.h)("path", {
      d: "M 19,4.9999992 V 17.000001 H 4.9999998 V 6.9999992 H 19 m 0,-2 H 4.9999998 c -1.0999999,0 -1.9999999,0.9000001 -1.9999999,2 V 17.000001 c 0,1.1 0.9,2 1.9999999,2 H 19 c 1.1,0 2,-0.9 2,-2 V 6.9999992 c 0,-1.0999999 -0.9,-2 -2,-2 z"
    }), (0, _preact.h)("path", {
      fill: "none",
      d: "M0 0h24v24H0z"
    })));
  }

  renderCropWidescreenVertical() {
    const {
      i18n
    } = this.props;
    return (0, _preact.h)("button", {
      type: "button",
      className: "uppy-u-reset uppy-c-btn",
      "aria-label": i18n('aspectRatioPortrait'),
      "data-microtip-position": "top",
      onClick: () => this.cropper.setAspectRatio(9 / 16)
    }, (0, _preact.h)("svg", {
      "aria-hidden": "true",
      className: "uppy-c-icon",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24"
    }, (0, _preact.h)("path", {
      d: "M 19.000001,19 H 6.999999 V 5 h 10.000002 v 14 m 2,0 V 5 c 0,-1.0999999 -0.9,-1.9999999 -2,-1.9999999 H 6.999999 c -1.1,0 -2,0.9 -2,1.9999999 v 14 c 0,1.1 0.9,2 2,2 h 10.000002 c 1.1,0 2,-0.9 2,-2 z"
    }), (0, _preact.h)("path", {
      d: "M0 0h24v24H0z",
      fill: "none"
    })));
  }

  render() {
    const {
      currentImage,
      opts
    } = this.props;
    const {
      actions
    } = opts;
    const imageURL = URL.createObjectURL(currentImage.data);
    return (0, _preact.h)("div", {
      className: "uppy-ImageCropper"
    }, (0, _preact.h)("div", {
      className: "uppy-ImageCropper-container"
    }, (0, _preact.h)("img", {
      className: "uppy-ImageCropper-image",
      alt: currentImage.name,
      src: imageURL,
      ref: ref => {
        this.imgElement = ref;
      }
    })), (0, _preact.h)("div", {
      className: "uppy-ImageCropper-controls"
    }, actions.revert && this.renderRevert(), actions.rotate && this.renderRotate(), actions.granularRotate && this.renderGranularRotate(), actions.flip && this.renderFlip(), actions.zoomIn && this.renderZoomIn(), actions.zoomOut && this.renderZoomOut(), actions.cropSquare && this.renderCropSquare(), actions.cropWidescreen && this.renderCropWidescreen(), actions.cropWidescreenVertical && this.renderCropWidescreenVertical()));
  }

}

module.exports = Editor;

/***/ }),

/***/ "./node_modules/@uppy/image-editor/lib/ImageEditor.js":
/*!************************************************************!*\
  !*** ./node_modules/@uppy/image-editor/lib/ImageEditor.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _core = __webpack_require__(/*! @uppy/core */ "./node_modules/@uppy/core/lib/index.js");

var _preact = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const Editor = __webpack_require__(/*! ./Editor.js */ "./node_modules/@uppy/image-editor/lib/Editor.js");

const packageJson = {
  "version": "1.2.0"
};

const locale = __webpack_require__(/*! ./locale.js */ "./node_modules/@uppy/image-editor/lib/locale.js");

class ImageEditor extends _core.UIPlugin {
  constructor(uppy, opts) {
    super(uppy, opts);

    this.save = () => {
      const saveBlobCallback = blob => {
        const {
          currentImage
        } = this.getPluginState();
        this.uppy.setFileState(currentImage.id, {
          data: blob,
          size: blob.size,
          preview: null
        });
        const updatedFile = this.uppy.getFile(currentImage.id);
        this.uppy.emit('thumbnail:request', updatedFile);
        this.setPluginState({
          currentImage: updatedFile
        });
        this.uppy.emit('file-editor:complete', updatedFile);
      };

      const {
        currentImage
      } = this.getPluginState();
      this.cropper.getCroppedCanvas(this.opts.cropperOptions.croppedCanvasOptions).toBlob(saveBlobCallback, currentImage.type, this.opts.quality);
    };

    this.storeCropperInstance = cropper => {
      this.cropper = cropper;
    };

    this.selectFile = file => {
      this.uppy.emit('file-editor:start', file);
      this.setPluginState({
        currentImage: file
      });
    };

    this.id = this.opts.id || 'ImageEditor';
    this.title = 'Image Editor';
    this.type = 'editor';
    this.defaultLocale = locale;
    const defaultCropperOptions = {
      viewMode: 1,
      background: false,
      autoCropArea: 1,
      responsive: true,
      croppedCanvasOptions: {}
    };
    const defaultActions = {
      revert: true,
      rotate: true,
      granularRotate: true,
      flip: true,
      zoomIn: true,
      zoomOut: true,
      cropSquare: true,
      cropWidescreen: true,
      cropWidescreenVertical: true
    };
    const defaultOptions = {
      quality: 0.8
    };
    this.opts = { ...defaultOptions,
      ...opts,
      actions: { ...defaultActions,
        ...opts.actions
      },
      cropperOptions: { ...defaultCropperOptions,
        ...opts.cropperOptions
      }
    };
    this.i18nInit();
  } // eslint-disable-next-line class-methods-use-this


  canEditFile(file) {
    if (!file.type || file.isRemote) {
      return false;
    }

    const fileTypeSpecific = file.type.split('/')[1];

    if (/^(jpe?g|gif|png|bmp|webp)$/.test(fileTypeSpecific)) {
      return true;
    }

    return false;
  }

  install() {
    this.setPluginState({
      currentImage: null
    });
    const {
      target
    } = this.opts;

    if (target) {
      this.mount(target, this);
    }
  }

  uninstall() {
    this.unmount();
  }

  render() {
    const {
      currentImage
    } = this.getPluginState();

    if (currentImage === null || currentImage.isRemote) {
      return null;
    }

    return (0, _preact.h)(Editor, {
      currentImage: currentImage,
      storeCropperInstance: this.storeCropperInstance,
      save: this.save,
      opts: this.opts,
      i18n: this.i18n
    });
  }

}

ImageEditor.VERSION = packageJson.version;
module.exports = ImageEditor;

/***/ }),

/***/ "./node_modules/@uppy/image-editor/lib/index.js":
/*!******************************************************!*\
  !*** ./node_modules/@uppy/image-editor/lib/index.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = __webpack_require__(/*! ./ImageEditor.js */ "./node_modules/@uppy/image-editor/lib/ImageEditor.js");

/***/ }),

/***/ "./node_modules/@uppy/image-editor/lib/locale.js":
/*!*******************************************************!*\
  !*** ./node_modules/@uppy/image-editor/lib/locale.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


module.exports = {
  strings: {
    revert: 'Revert',
    rotate: 'Rotate',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    flipHorizontal: 'Flip horizontal',
    aspectRatioSquare: 'Crop square',
    aspectRatioLandscape: 'Crop landscape (16:9)',
    aspectRatioPortrait: 'Crop portrait (9:16)'
  }
};

/***/ }),

/***/ "./node_modules/@uppy/progress-bar/lib/ProgressBar.js":
/*!************************************************************!*\
  !*** ./node_modules/@uppy/progress-bar/lib/ProgressBar.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _preact = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

var _core = __webpack_require__(/*! @uppy/core */ "./node_modules/@uppy/core/lib/index.js");

const packageJson = {
  "version": "2.1.0"
};
/**
 * Progress bar
 *
 */

class ProgressBar extends _core.UIPlugin {
  constructor(uppy, opts) {
    super(uppy, opts);
    this.id = this.opts.id || 'ProgressBar';
    this.title = 'Progress Bar';
    this.type = 'progressindicator'; // set default options

    const defaultOptions = {
      target: 'body',
      fixed: false,
      hideAfterFinish: true
    }; // merge default options with the ones set by user

    this.opts = { ...defaultOptions,
      ...opts
    };
    this.render = this.render.bind(this);
  }

  render(state) {
    const progress = state.totalProgress || 0; // before starting and after finish should be hidden if specified in the options

    const isHidden = (progress === 0 || progress === 100) && this.opts.hideAfterFinish;
    return (0, _preact.h)("div", {
      className: "uppy uppy-ProgressBar",
      style: {
        position: this.opts.fixed ? 'fixed' : 'initial'
      },
      "aria-hidden": isHidden
    }, (0, _preact.h)("div", {
      className: "uppy-ProgressBar-inner",
      style: {
        width: `${progress}%`
      }
    }), (0, _preact.h)("div", {
      className: "uppy-ProgressBar-percentage"
    }, progress));
  }

  install() {
    const {
      target
    } = this.opts;

    if (target) {
      this.mount(target, this);
    }
  }

  uninstall() {
    this.unmount();
  }

}

ProgressBar.VERSION = packageJson.version;
module.exports = ProgressBar;

/***/ }),

/***/ "./node_modules/@uppy/progress-bar/lib/index.js":
/*!******************************************************!*\
  !*** ./node_modules/@uppy/progress-bar/lib/index.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = __webpack_require__(/*! ./ProgressBar.js */ "./node_modules/@uppy/progress-bar/lib/ProgressBar.js");

/***/ }),

/***/ "./node_modules/@uppy/screen-capture/lib/CaptureScreen.js":
/*!****************************************************************!*\
  !*** ./node_modules/@uppy/screen-capture/lib/CaptureScreen.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _preact = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const RecordButton = __webpack_require__(/*! ./RecordButton.js */ "./node_modules/@uppy/screen-capture/lib/RecordButton.js");

const SubmitButton = __webpack_require__(/*! ./SubmitButton.js */ "./node_modules/@uppy/screen-capture/lib/SubmitButton.js");

const StopWatch = __webpack_require__(/*! ./StopWatch.js */ "./node_modules/@uppy/screen-capture/lib/StopWatch.js");

const StreamStatus = __webpack_require__(/*! ./StreamStatus.js */ "./node_modules/@uppy/screen-capture/lib/StreamStatus.js");

class RecorderScreen extends _preact.Component {
  componentWillUnmount() {
    const {
      onStop
    } = this.props;
    onStop();
  }

  render() {
    const {
      recording,
      stream: videoStream,
      recordedVideo
    } = this.props;
    const videoProps = {
      playsinline: true
    }; // show stream

    if (recording || !recordedVideo && !recording) {
      videoProps.muted = true;
      videoProps.autoplay = true;
      videoProps.srcObject = videoStream;
    } // show preview


    if (recordedVideo && !recording) {
      videoProps.muted = false;
      videoProps.controls = true;
      videoProps.src = recordedVideo; // reset srcObject in dom. If not resetted, stream sticks in element

      if (this.videoElement) {
        this.videoElement.srcObject = undefined;
      }
    }

    return (0, _preact.h)("div", {
      className: "uppy uppy-ScreenCapture-container"
    }, (0, _preact.h)("div", {
      className: "uppy-ScreenCapture-videoContainer"
    }, (0, _preact.h)(StreamStatus, this.props), (0, _preact.h)("video", _extends({
      ref: videoElement => {
        this.videoElement = videoElement;
      },
      className: "uppy-ScreenCapture-video"
    }, videoProps)), (0, _preact.h)(StopWatch, this.props)), (0, _preact.h)("div", {
      className: "uppy-ScreenCapture-buttonContainer"
    }, (0, _preact.h)(RecordButton, this.props), (0, _preact.h)(SubmitButton, this.props)));
  }

}

module.exports = RecorderScreen;

/***/ }),

/***/ "./node_modules/@uppy/screen-capture/lib/RecordButton.js":
/*!***************************************************************!*\
  !*** ./node_modules/@uppy/screen-capture/lib/RecordButton.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _preact = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

function RecordButton(_ref) {
  let {
    recording,
    onStartRecording,
    onStopRecording,
    i18n
  } = _ref;

  if (recording) {
    return (0, _preact.h)("button", {
      className: "uppy-u-reset uppy-c-btn uppy-ScreenCapture-button uppy-ScreenCapture-button--video uppy-ScreenCapture-button--stop-rec",
      type: "button",
      title: i18n('stopCapturing'),
      "aria-label": i18n('stopCapturing'),
      onClick: onStopRecording,
      "data-uppy-super-focusable": true
    }, (0, _preact.h)("svg", {
      "aria-hidden": "true",
      focusable: "false",
      className: "uppy-c-icon",
      width: "100",
      height: "100",
      viewBox: "0 0 100 100"
    }, (0, _preact.h)("rect", {
      x: "15",
      y: "15",
      width: "70",
      height: "70"
    })));
  }

  return (0, _preact.h)("button", {
    className: "uppy-u-reset uppy-c-btn uppy-ScreenCapture-button uppy-ScreenCapture-button--video",
    type: "button",
    title: i18n('startCapturing'),
    "aria-label": i18n('startCapturing'),
    onClick: onStartRecording,
    "data-uppy-super-focusable": true
  }, (0, _preact.h)("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "100",
    height: "100",
    viewBox: "0 0 100 100"
  }, (0, _preact.h)("circle", {
    cx: "50",
    cy: "50",
    r: "40"
  })));
}

/**
 * Control screen capture recording. Will show record or stop button.
 */
module.exports = RecordButton;

/***/ }),

/***/ "./node_modules/@uppy/screen-capture/lib/ScreenCapture.js":
/*!****************************************************************!*\
  !*** ./node_modules/@uppy/screen-capture/lib/ScreenCapture.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _preact = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

var _core = __webpack_require__(/*! @uppy/core */ "./node_modules/@uppy/core/lib/index.js");

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const getFileTypeExtension = __webpack_require__(/*! @uppy/utils/lib/getFileTypeExtension */ "./node_modules/@uppy/utils/lib/getFileTypeExtension.js");

const ScreenRecIcon = __webpack_require__(/*! ./ScreenRecIcon.js */ "./node_modules/@uppy/screen-capture/lib/ScreenRecIcon.js");

const CaptureScreen = __webpack_require__(/*! ./CaptureScreen.js */ "./node_modules/@uppy/screen-capture/lib/CaptureScreen.js");

const packageJson = {
  "version": "2.1.0"
};

const locale = __webpack_require__(/*! ./locale.js */ "./node_modules/@uppy/screen-capture/lib/locale.js"); // Adapted from: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia


function getMediaDevices() {
  // check if screen capturing is supported
  return window.MediaRecorder && navigator.mediaDevices; // eslint-disable-line compat/compat
}
/**
 * Screen capture
 */


class ScreenCapture extends _core.UIPlugin {
  constructor(uppy, opts) {
    super(uppy, opts);
    this.mediaDevices = getMediaDevices(); // eslint-disable-next-line no-restricted-globals

    this.protocol = location.protocol === 'https:' ? 'https' : 'http';
    this.id = this.opts.id || 'ScreenCapture';
    this.title = this.opts.title || 'Screencast';
    this.type = 'acquirer';
    this.icon = ScreenRecIcon;
    this.defaultLocale = locale; // set default options
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints

    const defaultOptions = {
      // https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#Properties_of_shared_screen_tracks
      displayMediaConstraints: {
        video: {
          width: 1280,
          height: 720,
          frameRate: {
            ideal: 3,
            max: 5
          },
          cursor: 'motion',
          displaySurface: 'monitor'
        }
      },
      // https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints/audio
      userMediaConstraints: {
        audio: true
      },
      preferredVideoMimeType: 'video/webm'
    }; // merge default options with the ones set by user

    this.opts = { ...defaultOptions,
      ...opts
    }; // i18n

    this.i18nInit(); // uppy plugin class related

    this.install = this.install.bind(this);
    this.setPluginState = this.setPluginState.bind(this);
    this.render = this.render.bind(this); // screen capturer related

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
    this.submit = this.submit.bind(this);
    this.streamInterrupted = this.streamInactivated.bind(this); // initialize

    this.captureActive = false;
    this.capturedMediaFile = null;
  }

  install() {
    // Return if browser doesn’t support getDisplayMedia and
    if (!this.mediaDevices) {
      this.uppy.log('Screen recorder access is not supported', 'error');
      return null;
    }

    this.setPluginState({
      streamActive: false,
      audioStreamActive: false
    });
    const {
      target
    } = this.opts;

    if (target) {
      this.mount(target, this);
    }

    return undefined;
  }

  uninstall() {
    if (this.videoStream) {
      this.stop();
    }

    this.unmount();
  }

  start() {
    if (!this.mediaDevices) {
      return Promise.reject(new Error('Screen recorder access not supported'));
    }

    this.captureActive = true;
    this.selectAudioStreamSource();
    return this.selectVideoStreamSource().then(res => {
      // something happened in start -> return
      if (res === false) {
        // Close the Dashboard panel if plugin is installed
        // into Dashboard (could be other parent UI plugin)
        if (this.parent && this.parent.hideAllPanels) {
          this.parent.hideAllPanels();
          this.captureActive = false;
        }
      }
    });
  }

  selectVideoStreamSource() {
    // if active stream available, return it
    if (this.videoStream) {
      return new Promise(resolve => resolve(this.videoStream));
    } // ask user to select source to record and get mediastream from that
    // eslint-disable-next-line compat/compat


    return this.mediaDevices.getDisplayMedia(this.opts.displayMediaConstraints).then(videoStream => {
      this.videoStream = videoStream; // add event listener to stop recording if stream is interrupted

      this.videoStream.addEventListener('inactive', () => {
        this.streamInactivated();
      });
      this.setPluginState({
        streamActive: true
      });
      return videoStream;
    }).catch(err => {
      this.setPluginState({
        screenRecError: err
      });
      this.userDenied = true;
      setTimeout(() => {
        this.userDenied = false;
      }, 1000);
      return false;
    });
  }

  selectAudioStreamSource() {
    // if active stream available, return it
    if (this.audioStream) {
      return new Promise(resolve => resolve(this.audioStream));
    } // ask user to select source to record and get mediastream from that
    // eslint-disable-next-line compat/compat


    return this.mediaDevices.getUserMedia(this.opts.userMediaConstraints).then(audioStream => {
      this.audioStream = audioStream;
      this.setPluginState({
        audioStreamActive: true
      });
      return audioStream;
    }).catch(err => {
      if (err.name === 'NotAllowedError') {
        this.uppy.info(this.i18n('micDisabled'), 'error', 5000);
      }

      return false;
    });
  }

  startRecording() {
    const options = {};
    this.capturedMediaFile = null;
    this.recordingChunks = [];
    const {
      preferredVideoMimeType
    } = this.opts;
    this.selectVideoStreamSource().then(videoStream => {
      // Attempt to use the passed preferredVideoMimeType (if any) during recording.
      // If the browser doesn't support it, we'll fall back to the browser default instead
      if (preferredVideoMimeType && MediaRecorder.isTypeSupported(preferredVideoMimeType) && getFileTypeExtension(preferredVideoMimeType)) {
        options.mimeType = preferredVideoMimeType;
      } // prepare tracks


      const tracks = [videoStream.getVideoTracks()[0]]; // merge audio if exits

      if (this.audioStream) {
        tracks.push(this.audioStream.getAudioTracks()[0]);
      } // create new stream from video and audio
      // eslint-disable-next-line compat/compat


      this.outputStream = new MediaStream(tracks); // initialize mediarecorder
      // eslint-disable-next-line compat/compat

      this.recorder = new MediaRecorder(this.outputStream, options); // push data to buffer when data available

      this.recorder.addEventListener('dataavailable', event => {
        this.recordingChunks.push(event.data);
      }); // start recording

      this.recorder.start(); // set plugin state to recording

      this.setPluginState({
        recording: true
      });
    }).catch(err => {
      this.uppy.log(err, 'error');
    });
  }

  streamInactivated() {
    // get screen recorder state
    const {
      recordedVideo,
      recording
    } = { ...this.getPluginState()
    };

    if (!recordedVideo && !recording) {
      // Close the Dashboard panel if plugin is installed
      // into Dashboard (could be other parent UI plugin)
      if (this.parent && this.parent.hideAllPanels) {
        this.parent.hideAllPanels();
      }
    } else if (recording) {
      // stop recorder if it is active
      this.uppy.log('Capture stream inactive — stop recording');
      this.stopRecording();
    }

    this.videoStream = null;
    this.audioStream = null;
    this.setPluginState({
      streamActive: false,
      audioStreamActive: false
    });
  }

  stopRecording() {
    const stopped = new Promise(resolve => {
      this.recorder.addEventListener('stop', () => {
        resolve();
      });
      this.recorder.stop();
    });
    return stopped.then(() => {
      // recording stopped
      this.setPluginState({
        recording: false
      }); // get video file after recorder stopped

      return this.getVideo();
    }).then(file => {
      // store media file
      this.capturedMediaFile = file; // create object url for capture result preview

      this.setPluginState({
        // eslint-disable-next-line compat/compat
        recordedVideo: URL.createObjectURL(file.data)
      });
    }).then(() => {
      this.recordingChunks = null;
      this.recorder = null;
    }, error => {
      this.recordingChunks = null;
      this.recorder = null;
      throw error;
    });
  }

  submit() {
    try {
      // add recorded file to uppy
      if (this.capturedMediaFile) {
        this.uppy.addFile(this.capturedMediaFile);
      }
    } catch (err) {
      // Logging the error, exept restrictions, which is handled in Core
      if (!err.isRestriction) {
        this.uppy.log(err, 'error');
      }
    }
  }

  stop() {
    // flush video stream
    if (this.videoStream) {
      this.videoStream.getVideoTracks().forEach(track => {
        track.stop();
      });
      this.videoStream.getAudioTracks().forEach(track => {
        track.stop();
      });
      this.videoStream = null;
    } // flush audio stream


    if (this.audioStream) {
      this.audioStream.getAudioTracks().forEach(track => {
        track.stop();
      });
      this.audioStream.getVideoTracks().forEach(track => {
        track.stop();
      });
      this.audioStream = null;
    } // flush output stream


    if (this.outputStream) {
      this.outputStream.getAudioTracks().forEach(track => {
        track.stop();
      });
      this.outputStream.getVideoTracks().forEach(track => {
        track.stop();
      });
      this.outputStream = null;
    } // remove preview video


    this.setPluginState({
      recordedVideo: null
    });
    this.captureActive = false;
  }

  getVideo() {
    const mimeType = this.recordingChunks[0].type;
    const fileExtension = getFileTypeExtension(mimeType);

    if (!fileExtension) {
      return Promise.reject(new Error(`Could not retrieve recording: Unsupported media type "${mimeType}"`));
    }

    const name = `screencap-${Date.now()}.${fileExtension}`;
    const blob = new Blob(this.recordingChunks, {
      type: mimeType
    });
    const file = {
      source: this.id,
      name,
      data: new Blob([blob], {
        type: mimeType
      }),
      type: mimeType
    };
    return Promise.resolve(file);
  }

  render() {
    // get screen recorder state
    const recorderState = this.getPluginState();

    if (!recorderState.streamActive && !this.captureActive && !this.userDenied) {
      this.start();
    }

    return (0, _preact.h)(CaptureScreen, _extends({}, recorderState, {
      // eslint-disable-line react/jsx-props-no-spreading
      onStartRecording: this.startRecording,
      onStopRecording: this.stopRecording,
      onStop: this.stop,
      onSubmit: this.submit,
      i18n: this.i18n,
      stream: this.videoStream
    }));
  }

}

ScreenCapture.VERSION = packageJson.version;
module.exports = ScreenCapture;

/***/ }),

/***/ "./node_modules/@uppy/screen-capture/lib/ScreenRecIcon.js":
/*!****************************************************************!*\
  !*** ./node_modules/@uppy/screen-capture/lib/ScreenRecIcon.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _preact = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

module.exports = () => {
  return (0, _preact.h)("svg", {
    "aria-hidden": "true",
    focusable: "false",
    width: "32",
    height: "32",
    viewBox: "0 0 32 32"
  }, (0, _preact.h)("g", {
    fill: "none",
    fillRule: "evenodd"
  }, (0, _preact.h)("rect", {
    className: "uppy-ProviderIconBg",
    fill: "#2C3E50",
    width: "32",
    height: "32",
    rx: "16"
  }), (0, _preact.h)("path", {
    d: "M24.182 9H7.818C6.81 9 6 9.742 6 10.667v10c0 .916.81 1.666 1.818 1.666h4.546V24h7.272v-1.667h4.546c1 0 1.809-.75 1.809-1.666l.009-10C26 9.742 25.182 9 24.182 9zM24 21H8V11h16v10z",
    fill: "#FFF",
    fillRule: "nonzero"
  }), (0, _preact.h)("circle", {
    fill: "#FFF",
    cx: "16",
    cy: "16",
    r: "2"
  })));
};

/***/ }),

/***/ "./node_modules/@uppy/screen-capture/lib/StopWatch.js":
/*!************************************************************!*\
  !*** ./node_modules/@uppy/screen-capture/lib/StopWatch.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _preact = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

// TODO: rename this class to StopWatch in the next major.
class Stopwatch extends _preact.Component {
  constructor(props) {
    super(props);
    this.state = {
      elapsedTime: 0
    };
    this.wrapperStyle = {
      width: '100%',
      height: '100%',
      display: 'flex'
    };
    this.overlayStyle = {
      position: 'absolute',
      width: '100%',
      height: '100%',
      background: 'black',
      opacity: 0.7
    };
    this.infoContainerStyle = {
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 'auto',
      marginBottom: 'auto',
      zIndex: 1,
      color: 'white'
    };
    this.infotextStyle = {
      marginLeft: 'auto',
      marginRight: 'auto',
      marginBottom: '1rem',
      fontSize: '1.5rem'
    };
    this.timeStyle = {
      display: 'block',
      fontWeight: 'bold',
      marginLeft: 'auto',
      marginRight: 'auto',
      fontSize: '3rem',
      fontFamily: 'Courier New'
    };
  }

  startTimer() {
    this.timerTick();
    this.timerRunning = true;
  }

  resetTimer() {
    clearTimeout(this.timer);
    this.setState({
      elapsedTime: 0
    });
    this.timerRunning = false;
  }

  timerTick() {
    this.timer = setTimeout(() => {
      this.setState(state => ({
        elapsedTime: state.elapsedTime + 1
      }));
      this.timerTick();
    }, 1000);
  } // eslint-disable-next-line class-methods-use-this


  fmtMSS(s) {
    // eslint-disable-next-line no-return-assign, no-param-reassign
    return (s - (s %= 60)) / 60 + (s > 9 ? ':' : ':0') + s;
  }

  render() {
    const {
      recording,
      i18n
    } = { ...this.props
    };
    const {
      elapsedTime
    } = this.state; // second to minutes and seconds

    const minAndSec = this.fmtMSS(elapsedTime);

    if (recording && !this.timerRunning) {
      this.startTimer();
    }

    if (!recording && this.timerRunning) {
      this.resetTimer();
    }

    if (recording) {
      return (0, _preact.h)("div", {
        style: this.wrapperStyle
      }, (0, _preact.h)("div", {
        style: this.overlayStyle
      }), (0, _preact.h)("div", {
        style: this.infoContainerStyle
      }, (0, _preact.h)("div", {
        style: this.infotextStyle
      }, i18n('recording')), (0, _preact.h)("div", {
        style: this.timeStyle
      }, minAndSec)));
    }

    return null;
  }

}

module.exports = Stopwatch;

/***/ }),

/***/ "./node_modules/@uppy/screen-capture/lib/StreamStatus.js":
/*!***************************************************************!*\
  !*** ./node_modules/@uppy/screen-capture/lib/StreamStatus.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _preact = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

module.exports = _ref => {
  let {
    streamActive,
    i18n
  } = _ref;

  if (streamActive) {
    return (0, _preact.h)("div", {
      title: i18n('streamActive'),
      "aria-label": i18n('streamActive'),
      className: "uppy-ScreenCapture-icon--stream uppy-ScreenCapture-icon--streamActive"
    }, (0, _preact.h)("svg", {
      "aria-hidden": "true",
      focusable: "false",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24"
    }, (0, _preact.h)("path", {
      d: "M0 0h24v24H0z",
      opacity: ".1",
      fill: "none"
    }), (0, _preact.h)("path", {
      d: "M0 0h24v24H0z",
      fill: "none"
    }), (0, _preact.h)("path", {
      d: "M1 18v3h3c0-1.66-1.34-3-3-3zm0-4v2c2.76 0 5 2.24 5 5h2c0-3.87-3.13-7-7-7zm18-7H5v1.63c3.96 1.28 7.09 4.41 8.37 8.37H19V7zM1 10v2c4.97 0 9 4.03 9 9h2c0-6.08-4.93-11-11-11zm20-7H3c-1.1 0-2 .9-2 2v3h2V5h18v14h-7v2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
    })));
  }

  return (0, _preact.h)("div", {
    title: i18n('streamPassive'),
    "aria-label": i18n('streamPassive'),
    className: "uppy-ScreenCapture-icon--stream"
  }, (0, _preact.h)("svg", {
    "aria-hidden": "true",
    focusable: "false",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24"
  }, (0, _preact.h)("path", {
    d: "M0 0h24v24H0z",
    opacity: ".1",
    fill: "none"
  }), (0, _preact.h)("path", {
    d: "M0 0h24v24H0z",
    fill: "none"
  }), (0, _preact.h)("path", {
    d: "M21 3H3c-1.1 0-2 .9-2 2v3h2V5h18v14h-7v2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM1 18v3h3c0-1.66-1.34-3-3-3zm0-4v2c2.76 0 5 2.24 5 5h2c0-3.87-3.13-7-7-7zm0-4v2c4.97 0 9 4.03 9 9h2c0-6.08-4.93-11-11-11z"
  })));
};

/***/ }),

/***/ "./node_modules/@uppy/screen-capture/lib/SubmitButton.js":
/*!***************************************************************!*\
  !*** ./node_modules/@uppy/screen-capture/lib/SubmitButton.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _preact = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

function SubmitButton(_ref) {
  let {
    recording,
    recordedVideo,
    onSubmit,
    i18n
  } = _ref;

  if (recordedVideo && !recording) {
    return (0, _preact.h)("button", {
      className: "uppy-u-reset uppy-c-btn uppy-ScreenCapture-button uppy-ScreenCapture-button--submit",
      type: "button",
      title: i18n('submitRecordedFile'),
      "aria-label": i18n('submitRecordedFile'),
      onClick: onSubmit,
      "data-uppy-super-focusable": true
    }, (0, _preact.h)("svg", {
      width: "12",
      height: "9",
      viewBox: "0 0 12 9",
      xmlns: "http://www.w3.org/2000/svg",
      "aria-hidden": "true",
      focusable: "false",
      className: "uppy-c-icon"
    }, (0, _preact.h)("path", {
      fill: "#fff",
      fillRule: "nonzero",
      d: "M10.66 0L12 1.31 4.136 9 0 4.956l1.34-1.31L4.136 6.38z"
    })));
  }

  return null;
}

/**
 * Submit recorded video to uppy. Enabled when file is available
 */
module.exports = SubmitButton;

/***/ }),

/***/ "./node_modules/@uppy/screen-capture/lib/index.js":
/*!********************************************************!*\
  !*** ./node_modules/@uppy/screen-capture/lib/index.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = __webpack_require__(/*! ./ScreenCapture.js */ "./node_modules/@uppy/screen-capture/lib/ScreenCapture.js");

/***/ }),

/***/ "./node_modules/@uppy/screen-capture/lib/locale.js":
/*!*********************************************************!*\
  !*** ./node_modules/@uppy/screen-capture/lib/locale.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


module.exports = {
  strings: {
    startCapturing: 'Begin screen capturing',
    stopCapturing: 'Stop screen capturing',
    submitRecordedFile: 'Submit recorded file',
    streamActive: 'Stream active',
    streamPassive: 'Stream passive',
    micDisabled: 'Microphone access denied by user',
    recording: 'Recording'
  }
};

/***/ }),

/***/ "./node_modules/@uppy/status-bar/lib/Components.js":
/*!*********************************************************!*\
  !*** ./node_modules/@uppy/status-bar/lib/Components.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.CancelBtn = CancelBtn;
exports.DoneBtn = DoneBtn;
exports.LoadingSpinner = LoadingSpinner;
exports.PauseResumeButton = PauseResumeButton;
exports.ProgressBarComplete = ProgressBarComplete;
exports.ProgressBarError = ProgressBarError;
exports.ProgressBarProcessing = ProgressBarProcessing;
exports.ProgressBarUploading = ProgressBarUploading;
exports.ProgressDetails = ProgressDetails;
exports.RetryBtn = RetryBtn;
exports.UploadBtn = UploadBtn;

var _preact = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const classNames = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");

const throttle = __webpack_require__(/*! lodash.throttle */ "./node_modules/lodash.throttle/index.js");

const prettierBytes = __webpack_require__(/*! @transloadit/prettier-bytes */ "./node_modules/@transloadit/prettier-bytes/prettierBytes.js");

const prettyETA = __webpack_require__(/*! @uppy/utils/lib/prettyETA */ "./node_modules/@uppy/utils/lib/prettyETA.js");

const statusBarStates = __webpack_require__(/*! ./StatusBarStates.js */ "./node_modules/@uppy/status-bar/lib/StatusBarStates.js");

const DOT = `\u00B7`;

const renderDot = () => ` ${DOT} `;

function UploadBtn(props) {
  const {
    newFiles,
    isUploadStarted,
    recoveredState,
    i18n,
    uploadState,
    isSomeGhost,
    startUpload
  } = props;
  const uploadBtnClassNames = classNames('uppy-u-reset', 'uppy-c-btn', 'uppy-StatusBar-actionBtn', 'uppy-StatusBar-actionBtn--upload', {
    'uppy-c-btn-primary': uploadState === statusBarStates.STATE_WAITING
  }, {
    'uppy-StatusBar-actionBtn--disabled': isSomeGhost
  });
  const uploadBtnText = newFiles && isUploadStarted && !recoveredState ? i18n('uploadXNewFiles', {
    smart_count: newFiles
  }) : i18n('uploadXFiles', {
    smart_count: newFiles
  });
  return (0, _preact.h)("button", {
    type: "button",
    className: uploadBtnClassNames,
    "aria-label": i18n('uploadXFiles', {
      smart_count: newFiles
    }),
    onClick: startUpload,
    disabled: isSomeGhost,
    "data-uppy-super-focusable": true
  }, uploadBtnText);
}

function RetryBtn(props) {
  const {
    i18n,
    uppy
  } = props;
  return (0, _preact.h)("button", {
    type: "button",
    className: "uppy-u-reset uppy-c-btn uppy-StatusBar-actionBtn uppy-StatusBar-actionBtn--retry",
    "aria-label": i18n('retryUpload'),
    onClick: () => uppy.retryAll(),
    "data-uppy-super-focusable": true
  }, (0, _preact.h)("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "8",
    height: "10",
    viewBox: "0 0 8 10"
  }, (0, _preact.h)("path", {
    d: "M4 2.408a2.75 2.75 0 1 0 2.75 2.75.626.626 0 0 1 1.25.018v.023a4 4 0 1 1-4-4.041V.25a.25.25 0 0 1 .389-.208l2.299 1.533a.25.25 0 0 1 0 .416l-2.3 1.533A.25.25 0 0 1 4 3.316v-.908z"
  })), i18n('retry'));
}

function CancelBtn(props) {
  const {
    i18n,
    uppy
  } = props;
  return (0, _preact.h)("button", {
    type: "button",
    className: "uppy-u-reset uppy-StatusBar-actionCircleBtn",
    title: i18n('cancel'),
    "aria-label": i18n('cancel'),
    onClick: () => uppy.cancelAll(),
    "data-cy": "cancel",
    "data-uppy-super-focusable": true
  }, (0, _preact.h)("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "16",
    height: "16",
    viewBox: "0 0 16 16"
  }, (0, _preact.h)("g", {
    fill: "none",
    fillRule: "evenodd"
  }, (0, _preact.h)("circle", {
    fill: "#888",
    cx: "8",
    cy: "8",
    r: "8"
  }), (0, _preact.h)("path", {
    fill: "#FFF",
    d: "M9.283 8l2.567 2.567-1.283 1.283L8 9.283 5.433 11.85 4.15 10.567 6.717 8 4.15 5.433 5.433 4.15 8 6.717l2.567-2.567 1.283 1.283z"
  }))));
}

function PauseResumeButton(props) {
  const {
    isAllPaused,
    i18n,
    isAllComplete,
    resumableUploads,
    uppy
  } = props;
  const title = isAllPaused ? i18n('resume') : i18n('pause');

  function togglePauseResume() {
    if (isAllComplete) return null;

    if (!resumableUploads) {
      return uppy.cancelAll();
    }

    if (isAllPaused) {
      return uppy.resumeAll();
    }

    return uppy.pauseAll();
  }

  return (0, _preact.h)("button", {
    title: title,
    "aria-label": title,
    className: "uppy-u-reset uppy-StatusBar-actionCircleBtn",
    type: "button",
    onClick: togglePauseResume,
    "data-uppy-super-focusable": true
  }, (0, _preact.h)("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "16",
    height: "16",
    viewBox: "0 0 16 16"
  }, (0, _preact.h)("g", {
    fill: "none",
    fillRule: "evenodd"
  }, (0, _preact.h)("circle", {
    fill: "#888",
    cx: "8",
    cy: "8",
    r: "8"
  }), (0, _preact.h)("path", {
    fill: "#FFF",
    d: isAllPaused ? 'M6 4.25L11.5 8 6 11.75z' : 'M5 4.5h2v7H5v-7zm4 0h2v7H9v-7z'
  }))));
}

function DoneBtn(props) {
  const {
    i18n,
    doneButtonHandler
  } = props;
  return (0, _preact.h)("button", {
    type: "button",
    className: "uppy-u-reset uppy-c-btn uppy-StatusBar-actionBtn uppy-StatusBar-actionBtn--done",
    onClick: doneButtonHandler,
    "data-uppy-super-focusable": true
  }, i18n('done'));
}

function LoadingSpinner() {
  return (0, _preact.h)("svg", {
    className: "uppy-StatusBar-spinner",
    "aria-hidden": "true",
    focusable: "false",
    width: "14",
    height: "14"
  }, (0, _preact.h)("path", {
    d: "M13.983 6.547c-.12-2.509-1.64-4.893-3.939-5.936-2.48-1.127-5.488-.656-7.556 1.094C.524 3.367-.398 6.048.162 8.562c.556 2.495 2.46 4.52 4.94 5.183 2.932.784 5.61-.602 7.256-3.015-1.493 1.993-3.745 3.309-6.298 2.868-2.514-.434-4.578-2.349-5.153-4.84a6.226 6.226 0 0 1 2.98-6.778C6.34.586 9.74 1.1 11.373 3.493c.407.596.693 1.282.842 1.988.127.598.073 1.197.161 1.794.078.525.543 1.257 1.15.864.525-.341.49-1.05.456-1.592-.007-.15.02.3 0 0",
    fillRule: "evenodd"
  }));
}

function ProgressBarProcessing(props) {
  const {
    progress
  } = props;
  const {
    value,
    mode,
    message
  } = progress;
  const roundedValue = Math.round(value * 100);
  const dot = `\u00B7`;
  return (0, _preact.h)("div", {
    className: "uppy-StatusBar-content"
  }, (0, _preact.h)(LoadingSpinner, null), mode === 'determinate' ? `${roundedValue}% ${dot} ` : '', message);
}

function ProgressDetails(props) {
  const {
    numUploads,
    complete,
    totalUploadedSize,
    totalSize,
    totalETA,
    i18n
  } = props;
  const ifShowFilesUploadedOfTotal = numUploads > 1;
  return (0, _preact.h)("div", {
    className: "uppy-StatusBar-statusSecondary"
  }, ifShowFilesUploadedOfTotal && i18n('filesUploadedOfTotal', {
    complete,
    smart_count: numUploads
  }), (0, _preact.h)("span", {
    className: "uppy-StatusBar-additionalInfo"
  }, ifShowFilesUploadedOfTotal && renderDot(), i18n('dataUploadedOfTotal', {
    complete: prettierBytes(totalUploadedSize),
    total: prettierBytes(totalSize)
  }), renderDot(), i18n('xTimeLeft', {
    time: prettyETA(totalETA)
  })));
}

function FileUploadCount(props) {
  const {
    i18n,
    complete,
    numUploads
  } = props;
  return (0, _preact.h)("div", {
    className: "uppy-StatusBar-statusSecondary"
  }, i18n('filesUploadedOfTotal', {
    complete,
    smart_count: numUploads
  }));
}

function UploadNewlyAddedFiles(props) {
  const {
    i18n,
    newFiles,
    startUpload
  } = props;
  const uploadBtnClassNames = classNames('uppy-u-reset', 'uppy-c-btn', 'uppy-StatusBar-actionBtn', 'uppy-StatusBar-actionBtn--uploadNewlyAdded');
  return (0, _preact.h)("div", {
    className: "uppy-StatusBar-statusSecondary"
  }, (0, _preact.h)("div", {
    className: "uppy-StatusBar-statusSecondaryHint"
  }, i18n('xMoreFilesAdded', {
    smart_count: newFiles
  })), (0, _preact.h)("button", {
    type: "button",
    className: uploadBtnClassNames,
    "aria-label": i18n('uploadXFiles', {
      smart_count: newFiles
    }),
    onClick: startUpload
  }, i18n('upload')));
}

const ThrottledProgressDetails = throttle(ProgressDetails, 500, {
  leading: true,
  trailing: true
});

function ProgressBarUploading(props) {
  const {
    i18n,
    supportsUploadProgress,
    totalProgress,
    showProgressDetails,
    isUploadStarted,
    isAllComplete,
    isAllPaused,
    newFiles,
    numUploads,
    complete,
    totalUploadedSize,
    totalSize,
    totalETA,
    startUpload
  } = props;
  const showUploadNewlyAddedFiles = newFiles && isUploadStarted;

  if (!isUploadStarted || isAllComplete) {
    return null;
  }

  const title = isAllPaused ? i18n('paused') : i18n('uploading');

  function renderProgressDetails() {
    if (!isAllPaused && !showUploadNewlyAddedFiles && showProgressDetails) {
      if (supportsUploadProgress) {
        return (0, _preact.h)(ThrottledProgressDetails, {
          numUploads: numUploads,
          complete: complete,
          totalUploadedSize: totalUploadedSize,
          totalSize: totalSize,
          totalETA: totalETA,
          i18n: i18n
        });
      }

      return (0, _preact.h)(FileUploadCount, {
        i18n: i18n,
        complete: complete,
        numUploads: numUploads
      });
    }

    return null;
  }

  return (0, _preact.h)("div", {
    className: "uppy-StatusBar-content",
    "aria-label": title,
    title: title
  }, !isAllPaused ? (0, _preact.h)(LoadingSpinner, null) : null, (0, _preact.h)("div", {
    className: "uppy-StatusBar-status"
  }, (0, _preact.h)("div", {
    className: "uppy-StatusBar-statusPrimary"
  }, supportsUploadProgress ? `${title}: ${totalProgress}%` : title), renderProgressDetails(), showUploadNewlyAddedFiles ? (0, _preact.h)(UploadNewlyAddedFiles, {
    i18n: i18n,
    newFiles: newFiles,
    startUpload: startUpload
  }) : null));
}

function ProgressBarComplete(props) {
  const {
    i18n
  } = props;
  return (0, _preact.h)("div", {
    className: "uppy-StatusBar-content",
    role: "status",
    title: i18n('complete')
  }, (0, _preact.h)("div", {
    className: "uppy-StatusBar-status"
  }, (0, _preact.h)("div", {
    className: "uppy-StatusBar-statusPrimary"
  }, (0, _preact.h)("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-StatusBar-statusIndicator uppy-c-icon",
    width: "15",
    height: "11",
    viewBox: "0 0 15 11"
  }, (0, _preact.h)("path", {
    d: "M.414 5.843L1.627 4.63l3.472 3.472L13.202 0l1.212 1.213L5.1 10.528z"
  })), i18n('complete'))));
}

function ProgressBarError(props) {
  const {
    error,
    i18n,
    complete,
    numUploads
  } = props;

  function displayErrorAlert() {
    const errorMessage = `${i18n('uploadFailed')} \n\n ${error}`; // eslint-disable-next-line no-alert

    alert(errorMessage); // TODO: move to custom alert implementation
  }

  return (0, _preact.h)("div", {
    className: "uppy-StatusBar-content",
    title: i18n('uploadFailed')
  }, (0, _preact.h)("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-StatusBar-statusIndicator uppy-c-icon",
    width: "11",
    height: "11",
    viewBox: "0 0 11 11"
  }, (0, _preact.h)("path", {
    d: "M4.278 5.5L0 1.222 1.222 0 5.5 4.278 9.778 0 11 1.222 6.722 5.5 11 9.778 9.778 11 5.5 6.722 1.222 11 0 9.778z"
  })), (0, _preact.h)("div", {
    className: "uppy-StatusBar-status"
  }, (0, _preact.h)("div", {
    className: "uppy-StatusBar-statusPrimary"
  }, i18n('uploadFailed'), (0, _preact.h)("button", {
    className: "uppy-u-reset uppy-StatusBar-details",
    "aria-label": i18n('showErrorDetails'),
    "data-microtip-position": "top-right",
    "data-microtip-size": "medium",
    onClick: displayErrorAlert,
    type: "button"
  }, "?")), (0, _preact.h)(FileUploadCount, {
    i18n: i18n,
    complete: complete,
    numUploads: numUploads
  })));
}

/***/ }),

/***/ "./node_modules/@uppy/status-bar/lib/StatusBar.js":
/*!********************************************************!*\
  !*** ./node_modules/@uppy/status-bar/lib/StatusBar.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _preact = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

var _Components = __webpack_require__(/*! ./Components.js */ "./node_modules/@uppy/status-bar/lib/Components.js");

// TODO: rename this file to StatusBarUI>jsx on the next major.
const classNames = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");

const statusBarStates = __webpack_require__(/*! ./StatusBarStates.js */ "./node_modules/@uppy/status-bar/lib/StatusBarStates.js");

const calculateProcessingProgress = __webpack_require__(/*! ./calculateProcessingProgress.js */ "./node_modules/@uppy/status-bar/lib/calculateProcessingProgress.js");

const {
  STATE_ERROR,
  STATE_WAITING,
  STATE_PREPROCESSING,
  STATE_UPLOADING,
  STATE_POSTPROCESSING,
  STATE_COMPLETE
} = statusBarStates; // TODO: rename the function to StatusBarUI on the next major.

function StatusBar(props) {
  const {
    newFiles,
    allowNewUpload,
    isUploadInProgress,
    isAllPaused,
    resumableUploads,
    error,
    hideUploadButton,
    hidePauseResumeButton,
    hideCancelButton,
    hideRetryButton,
    recoveredState,
    uploadState,
    totalProgress,
    files,
    supportsUploadProgress,
    hideAfterFinish,
    isSomeGhost,
    doneButtonHandler,
    isUploadStarted,
    i18n,
    startUpload,
    uppy,
    isAllComplete,
    showProgressDetails,
    numUploads,
    complete,
    totalSize,
    totalETA,
    totalUploadedSize
  } = props;

  function getProgressValue() {
    switch (uploadState) {
      case STATE_POSTPROCESSING:
      case STATE_PREPROCESSING:
        {
          const progress = calculateProcessingProgress(files);

          if (progress.mode === 'determinate') {
            return progress.value * 100;
          }

          return totalProgress;
        }

      case STATE_ERROR:
        {
          return null;
        }

      case STATE_UPLOADING:
        {
          if (!supportsUploadProgress) {
            return null;
          }

          return totalProgress;
        }

      default:
        return totalProgress;
    }
  }

  function getIsIndeterminate() {
    switch (uploadState) {
      case STATE_POSTPROCESSING:
      case STATE_PREPROCESSING:
        {
          const {
            mode
          } = calculateProcessingProgress(files);
          return mode === 'indeterminate';
        }

      case STATE_UPLOADING:
        {
          if (!supportsUploadProgress) {
            return true;
          }

          return false;
        }

      default:
        return false;
    }
  }

  function getIsHidden() {
    if (recoveredState) {
      return false;
    }

    switch (uploadState) {
      case STATE_WAITING:
        return hideUploadButton || newFiles === 0;

      case STATE_COMPLETE:
        return hideAfterFinish;

      default:
        return false;
    }
  }

  const progressValue = getProgressValue();
  const isHidden = getIsHidden();
  const width = progressValue != null ? progressValue : 100;
  const showUploadBtn = !error && newFiles && !isUploadInProgress && !isAllPaused && allowNewUpload && !hideUploadButton;
  const showCancelBtn = !hideCancelButton && uploadState !== STATE_WAITING && uploadState !== STATE_COMPLETE;
  const showPauseResumeBtn = resumableUploads && !hidePauseResumeButton && uploadState === STATE_UPLOADING;
  const showRetryBtn = error && !isAllComplete && !hideRetryButton;
  const showDoneBtn = doneButtonHandler && uploadState === STATE_COMPLETE;
  const progressClassNames = classNames('uppy-StatusBar-progress', {
    'is-indeterminate': getIsIndeterminate()
  });
  const statusBarClassNames = classNames('uppy-StatusBar', `is-${uploadState}`, {
    'has-ghosts': isSomeGhost
  });
  return (0, _preact.h)("div", {
    className: statusBarClassNames,
    "aria-hidden": isHidden
  }, (0, _preact.h)("div", {
    className: progressClassNames,
    style: {
      width: `${width}%`
    },
    role: "progressbar",
    "aria-label": `${width}%`,
    "aria-valuetext": `${width}%`,
    "aria-valuemin": "0",
    "aria-valuemax": "100",
    "aria-valuenow": progressValue
  }), (() => {
    switch (uploadState) {
      case STATE_PREPROCESSING:
      case STATE_POSTPROCESSING:
        return (0, _preact.h)(_Components.ProgressBarProcessing, {
          progress: calculateProcessingProgress(files)
        });

      case STATE_COMPLETE:
        return (0, _preact.h)(_Components.ProgressBarComplete, {
          i18n: i18n
        });

      case STATE_ERROR:
        return (0, _preact.h)(_Components.ProgressBarError, {
          error: error,
          i18n: i18n,
          numUploads: numUploads,
          complete: complete
        });

      case STATE_UPLOADING:
        return (0, _preact.h)(_Components.ProgressBarUploading, {
          i18n: i18n,
          supportsUploadProgress: supportsUploadProgress,
          totalProgress: totalProgress,
          showProgressDetails: showProgressDetails,
          isUploadStarted: isUploadStarted,
          isAllComplete: isAllComplete,
          isAllPaused: isAllPaused,
          newFiles: newFiles,
          numUploads: numUploads,
          complete: complete,
          totalUploadedSize: totalUploadedSize,
          totalSize: totalSize,
          totalETA: totalETA,
          startUpload: startUpload
        });

      default:
        return null;
    }
  })(), (0, _preact.h)("div", {
    className: "uppy-StatusBar-actions"
  }, recoveredState || showUploadBtn ? (0, _preact.h)(_Components.UploadBtn, {
    newFiles: newFiles,
    isUploadStarted: isUploadStarted,
    recoveredState: recoveredState,
    i18n: i18n,
    isSomeGhost: isSomeGhost,
    startUpload: startUpload,
    uploadState: uploadState
  }) : null, showRetryBtn ? (0, _preact.h)(_Components.RetryBtn, {
    i18n: i18n,
    uppy: uppy
  }) : null, showPauseResumeBtn ? (0, _preact.h)(_Components.PauseResumeButton, {
    isAllPaused: isAllPaused,
    i18n: i18n,
    isAllComplete: isAllComplete,
    resumableUploads: resumableUploads,
    uppy: uppy
  }) : null, showCancelBtn ? (0, _preact.h)(_Components.CancelBtn, {
    i18n: i18n,
    uppy: uppy
  }) : null, showDoneBtn ? (0, _preact.h)(_Components.DoneBtn, {
    i18n: i18n,
    doneButtonHandler: doneButtonHandler
  }) : null));
}

module.exports = StatusBar;

/***/ }),

/***/ "./node_modules/@uppy/status-bar/lib/StatusBarStates.js":
/*!**************************************************************!*\
  !*** ./node_modules/@uppy/status-bar/lib/StatusBarStates.js ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";


module.exports = {
  STATE_ERROR: 'error',
  STATE_WAITING: 'waiting',
  STATE_PREPROCESSING: 'preprocessing',
  STATE_UPLOADING: 'uploading',
  STATE_POSTPROCESSING: 'postprocessing',
  STATE_COMPLETE: 'complete'
};

/***/ }),

/***/ "./node_modules/@uppy/status-bar/lib/_StatusBar.js":
/*!*********************************************************!*\
  !*** ./node_modules/@uppy/status-bar/lib/_StatusBar.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _core = __webpack_require__(/*! @uppy/core */ "./node_modules/@uppy/core/lib/index.js");

// TODO: rename this file to StatusBar.jsx on the next major.
const getSpeed = __webpack_require__(/*! @uppy/utils/lib/getSpeed */ "./node_modules/@uppy/utils/lib/getSpeed.js");

const getBytesRemaining = __webpack_require__(/*! @uppy/utils/lib/getBytesRemaining */ "./node_modules/@uppy/utils/lib/getBytesRemaining.js");

const getTextDirection = __webpack_require__(/*! @uppy/utils/lib/getTextDirection */ "./node_modules/@uppy/utils/lib/getTextDirection.js");

const statusBarStates = __webpack_require__(/*! ./StatusBarStates.js */ "./node_modules/@uppy/status-bar/lib/StatusBarStates.js");

const StatusBarUI = __webpack_require__(/*! ./StatusBar.js */ "./node_modules/@uppy/status-bar/lib/StatusBar.js");

const packageJson = {
  "version": "2.2.0"
};

const locale = __webpack_require__(/*! ./locale.js */ "./node_modules/@uppy/status-bar/lib/locale.js");
/**
 * StatusBar: renders a status bar with upload/pause/resume/cancel/retry buttons,
 * progress percentage and time remaining.
 */


class StatusBar extends _core.UIPlugin {
  constructor(uppy, opts) {
    super(uppy, opts);

    this.startUpload = () => {
      const {
        recoveredState
      } = this.uppy.getState();

      if (recoveredState) {
        this.uppy.emit('restore-confirmed');
        return undefined;
      }

      return this.uppy.upload().catch(() => {// Error logged in Core
      });
    };

    this.id = this.opts.id || 'StatusBar';
    this.title = 'StatusBar';
    this.type = 'progressindicator';
    this.defaultLocale = locale; // set default options

    const defaultOptions = {
      target: 'body',
      hideUploadButton: false,
      hideRetryButton: false,
      hidePauseResumeButton: false,
      hideCancelButton: false,
      showProgressDetails: false,
      hideAfterFinish: true,
      doneButtonHandler: null
    };
    this.opts = { ...defaultOptions,
      ...opts
    };
    this.i18nInit();
    this.render = this.render.bind(this);
    this.install = this.install.bind(this);
  }

  render(state) {
    const {
      capabilities,
      files,
      allowNewUpload,
      totalProgress,
      error,
      recoveredState
    } = state;
    const {
      newFiles,
      startedFiles,
      completeFiles,
      inProgressNotPausedFiles,
      isUploadStarted,
      isAllComplete,
      isAllErrored,
      isAllPaused,
      isUploadInProgress,
      isSomeGhost
    } = this.uppy.getObjectOfFilesPerState(); // If some state was recovered, we want to show Upload button/counter
    // for all the files, because in this case it’s not an Upload button,
    // but “Confirm Restore Button”

    const newFilesOrRecovered = recoveredState ? Object.values(files) : newFiles;
    const totalETA = getTotalETA(inProgressNotPausedFiles);
    const resumableUploads = !!capabilities.resumableUploads;
    const supportsUploadProgress = capabilities.uploadProgress !== false;
    let totalSize = 0;
    let totalUploadedSize = 0;
    startedFiles.forEach(file => {
      totalSize += file.progress.bytesTotal || 0;
      totalUploadedSize += file.progress.bytesUploaded || 0;
    });
    return StatusBarUI({
      error,
      uploadState: getUploadingState(error, isAllComplete, recoveredState, state.files || {}),
      allowNewUpload,
      totalProgress,
      totalSize,
      totalUploadedSize,
      isAllComplete: false,
      isAllPaused,
      isAllErrored,
      isUploadStarted,
      isUploadInProgress,
      isSomeGhost,
      recoveredState,
      complete: completeFiles.length,
      newFiles: newFilesOrRecovered.length,
      numUploads: startedFiles.length,
      totalETA,
      files,
      i18n: this.i18n,
      uppy: this.uppy,
      startUpload: this.startUpload,
      doneButtonHandler: this.opts.doneButtonHandler,
      resumableUploads,
      supportsUploadProgress,
      showProgressDetails: this.opts.showProgressDetails,
      hideUploadButton: this.opts.hideUploadButton,
      hideRetryButton: this.opts.hideRetryButton,
      hidePauseResumeButton: this.opts.hidePauseResumeButton,
      hideCancelButton: this.opts.hideCancelButton,
      hideAfterFinish: this.opts.hideAfterFinish,
      isTargetDOMEl: this.isTargetDOMEl
    });
  }

  onMount() {
    // Set the text direction if the page has not defined one.
    const element = this.el;
    const direction = getTextDirection(element);

    if (!direction) {
      element.dir = 'ltr';
    }
  }

  install() {
    const {
      target
    } = this.opts;

    if (target) {
      this.mount(target, this);
    }
  }

  uninstall() {
    this.unmount();
  }

}

StatusBar.VERSION = packageJson.version;
module.exports = StatusBar;

function getTotalSpeed(files) {
  let totalSpeed = 0;
  files.forEach(file => {
    totalSpeed += getSpeed(file.progress);
  });
  return totalSpeed;
}

function getTotalETA(files) {
  const totalSpeed = getTotalSpeed(files);

  if (totalSpeed === 0) {
    return 0;
  }

  const totalBytesRemaining = files.reduce((total, file) => {
    return total + getBytesRemaining(file.progress);
  }, 0);
  return Math.round(totalBytesRemaining / totalSpeed * 10) / 10;
}

function getUploadingState(error, isAllComplete, recoveredState, files) {
  if (error && !isAllComplete) {
    return statusBarStates.STATE_ERROR;
  }

  if (isAllComplete) {
    return statusBarStates.STATE_COMPLETE;
  }

  if (recoveredState) {
    return statusBarStates.STATE_WAITING;
  }

  let state = statusBarStates.STATE_WAITING;
  const fileIDs = Object.keys(files);

  for (let i = 0; i < fileIDs.length; i++) {
    const {
      progress
    } = files[fileIDs[i]]; // If ANY files are being uploaded right now, show the uploading state.

    if (progress.uploadStarted && !progress.uploadComplete) {
      return statusBarStates.STATE_UPLOADING;
    } // If files are being preprocessed AND postprocessed at this time, we show the
    // preprocess state. If any files are being uploaded we show uploading.


    if (progress.preprocess && state !== statusBarStates.STATE_UPLOADING) {
      state = statusBarStates.STATE_PREPROCESSING;
    } // If NO files are being preprocessed or uploaded right now, but some files are
    // being postprocessed, show the postprocess state.


    if (progress.postprocess && state !== statusBarStates.STATE_UPLOADING && state !== statusBarStates.STATE_PREPROCESSING) {
      state = statusBarStates.STATE_POSTPROCESSING;
    }
  }

  return state;
}

/***/ }),

/***/ "./node_modules/@uppy/status-bar/lib/calculateProcessingProgress.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@uppy/status-bar/lib/calculateProcessingProgress.js ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";


function calculateProcessingProgress(files) {
  const values = [];
  let mode;
  let message;

  for (const {
    progress
  } of Object.values(files)) {
    const {
      preprocess,
      postprocess
    } = progress; // In the future we should probably do this differently. For now we'll take the
    // mode and message from the first file…

    if (message == null && (preprocess || postprocess)) {
      ({
        mode,
        message
      } = preprocess || postprocess);
    }

    if ((preprocess == null ? void 0 : preprocess.mode) === 'determinate') values.push(preprocess.value);
    if ((postprocess == null ? void 0 : postprocess.mode) === 'determinate') values.push(postprocess.value);
  }

  const value = values.reduce((total, progressValue) => {
    return total + progressValue / values.length;
  }, 0);
  return {
    mode,
    message,
    value
  };
}

module.exports = calculateProcessingProgress;

/***/ }),

/***/ "./node_modules/@uppy/status-bar/lib/index.js":
/*!****************************************************!*\
  !*** ./node_modules/@uppy/status-bar/lib/index.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = __webpack_require__(/*! ./_StatusBar.js */ "./node_modules/@uppy/status-bar/lib/_StatusBar.js");

/***/ }),

/***/ "./node_modules/@uppy/status-bar/lib/locale.js":
/*!*****************************************************!*\
  !*** ./node_modules/@uppy/status-bar/lib/locale.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


module.exports = {
  strings: {
    // Shown in the status bar while files are being uploaded.
    uploading: 'Uploading',
    // Shown in the status bar once all files have been uploaded.
    complete: 'Complete',
    // Shown in the status bar if an upload failed.
    uploadFailed: 'Upload failed',
    // Shown in the status bar while the upload is paused.
    paused: 'Paused',
    // Used as the label for the button that retries an upload.
    retry: 'Retry',
    // Used as the label for the button that cancels an upload.
    cancel: 'Cancel',
    // Used as the label for the button that pauses an upload.
    pause: 'Pause',
    // Used as the label for the button that resumes an upload.
    resume: 'Resume',
    // Used as the label for the button that resets the upload state after an upload
    done: 'Done',
    // When `showProgressDetails` is set, shows the number of files that have been fully uploaded so far.
    filesUploadedOfTotal: {
      0: '%{complete} of %{smart_count} file uploaded',
      1: '%{complete} of %{smart_count} files uploaded'
    },
    // When `showProgressDetails` is set, shows the amount of bytes that have been uploaded so far.
    dataUploadedOfTotal: '%{complete} of %{total}',
    // When `showProgressDetails` is set, shows an estimation of how long the upload will take to complete.
    xTimeLeft: '%{time} left',
    // Used as the label for the button that starts an upload.
    uploadXFiles: {
      0: 'Upload %{smart_count} file',
      1: 'Upload %{smart_count} files'
    },
    // Used as the label for the button that starts an upload, if another upload has been started in the past
    // and new files were added later.
    uploadXNewFiles: {
      0: 'Upload +%{smart_count} file',
      1: 'Upload +%{smart_count} files'
    },
    upload: 'Upload',
    retryUpload: 'Retry upload',
    xMoreFilesAdded: {
      0: '%{smart_count} more file added',
      1: '%{smart_count} more files added'
    },
    showErrorDetails: 'Show error details'
  }
};

/***/ }),

/***/ "./node_modules/@uppy/webcam/lib/CameraIcon.js":
/*!*****************************************************!*\
  !*** ./node_modules/@uppy/webcam/lib/CameraIcon.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _preact = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

module.exports = () => {
  return (0, _preact.h)("svg", {
    "aria-hidden": "true",
    focusable: "false",
    fill: "#0097DC",
    width: "66",
    height: "55",
    viewBox: "0 0 66 55"
  }, (0, _preact.h)("path", {
    d: "M57.3 8.433c4.59 0 8.1 3.51 8.1 8.1v29.7c0 4.59-3.51 8.1-8.1 8.1H8.7c-4.59 0-8.1-3.51-8.1-8.1v-29.7c0-4.59 3.51-8.1 8.1-8.1h9.45l4.59-7.02c.54-.54 1.35-1.08 2.16-1.08h16.2c.81 0 1.62.54 2.16 1.08l4.59 7.02h9.45zM33 14.64c-8.62 0-15.393 6.773-15.393 15.393 0 8.62 6.773 15.393 15.393 15.393 8.62 0 15.393-6.773 15.393-15.393 0-8.62-6.773-15.393-15.393-15.393zM33 40c-5.648 0-9.966-4.319-9.966-9.967 0-5.647 4.318-9.966 9.966-9.966s9.966 4.319 9.966 9.966C42.966 35.681 38.648 40 33 40z",
    fillRule: "evenodd"
  }));
};

/***/ }),

/***/ "./node_modules/@uppy/webcam/lib/CameraScreen.js":
/*!*******************************************************!*\
  !*** ./node_modules/@uppy/webcam/lib/CameraScreen.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _preact = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const SnapshotButton = __webpack_require__(/*! ./SnapshotButton.js */ "./node_modules/@uppy/webcam/lib/SnapshotButton.js");

const RecordButton = __webpack_require__(/*! ./RecordButton.js */ "./node_modules/@uppy/webcam/lib/RecordButton.js");

const RecordingLength = __webpack_require__(/*! ./RecordingLength.js */ "./node_modules/@uppy/webcam/lib/RecordingLength.js");

const VideoSourceSelect = __webpack_require__(/*! ./VideoSourceSelect.js */ "./node_modules/@uppy/webcam/lib/VideoSourceSelect.js");

const SubmitButton = __webpack_require__(/*! ./SubmitButton.js */ "./node_modules/@uppy/webcam/lib/SubmitButton.js");

const DiscardButton = __webpack_require__(/*! ./DiscardButton.js */ "./node_modules/@uppy/webcam/lib/DiscardButton.js");

function isModeAvailable(modes, mode) {
  return modes.indexOf(mode) !== -1;
}

class CameraScreen extends _preact.Component {
  componentDidMount() {
    const {
      onFocus
    } = this.props;
    onFocus();
  }

  componentWillUnmount() {
    const {
      onStop
    } = this.props;
    onStop();
  }

  render() {
    const {
      src,
      recordedVideo,
      recording,
      modes,
      supportsRecording,
      videoSources,
      showVideoSourceDropdown,
      showRecordingLength,
      onSubmit,
      i18n,
      mirror,
      onSnapshot,
      onStartRecording,
      onStopRecording,
      onDiscardRecordedVideo,
      recordingLengthSeconds
    } = this.props;
    const hasRecordedVideo = !!recordedVideo;
    const shouldShowRecordButton = !hasRecordedVideo && supportsRecording && (isModeAvailable(modes, 'video-only') || isModeAvailable(modes, 'audio-only') || isModeAvailable(modes, 'video-audio'));
    const shouldShowSnapshotButton = !hasRecordedVideo && isModeAvailable(modes, 'picture');
    const shouldShowRecordingLength = supportsRecording && showRecordingLength && !hasRecordedVideo;
    const shouldShowVideoSourceDropdown = showVideoSourceDropdown && videoSources && videoSources.length > 1;
    const videoProps = {
      playsinline: true
    };

    if (recordedVideo) {
      videoProps.muted = false;
      videoProps.controls = true;
      videoProps.src = recordedVideo; // reset srcObject in dom. If not resetted, stream sticks in element

      if (this.videoElement) {
        this.videoElement.srcObject = undefined;
      }
    } else {
      videoProps.muted = true;
      videoProps.autoplay = true;
      videoProps.srcObject = src;
    }

    return (0, _preact.h)("div", {
      className: "uppy uppy-Webcam-container"
    }, (0, _preact.h)("div", {
      className: "uppy-Webcam-videoContainer"
    }, (0, _preact.h)("video", _extends({
      /* eslint-disable-next-line no-return-assign */
      ref: videoElement => this.videoElement = videoElement,
      className: `uppy-Webcam-video  ${mirror ? 'uppy-Webcam-video--mirrored' : ''}`
      /* eslint-disable-next-line react/jsx-props-no-spreading */

    }, videoProps))), (0, _preact.h)("div", {
      className: "uppy-Webcam-footer"
    }, (0, _preact.h)("div", {
      className: "uppy-Webcam-videoSourceContainer"
    }, shouldShowVideoSourceDropdown ? VideoSourceSelect(this.props) : null), (0, _preact.h)("div", {
      className: "uppy-Webcam-buttonContainer"
    }, shouldShowSnapshotButton && (0, _preact.h)(SnapshotButton, {
      onSnapshot: onSnapshot,
      i18n: i18n
    }), shouldShowRecordButton && (0, _preact.h)(RecordButton, {
      recording: recording,
      onStartRecording: onStartRecording,
      onStopRecording: onStopRecording,
      i18n: i18n
    }), hasRecordedVideo && (0, _preact.h)(SubmitButton, {
      onSubmit: onSubmit,
      i18n: i18n
    }), hasRecordedVideo && (0, _preact.h)(DiscardButton, {
      onDiscard: onDiscardRecordedVideo,
      i18n: i18n
    })), (0, _preact.h)("div", {
      className: "uppy-Webcam-recordingLength"
    }, shouldShowRecordingLength && (0, _preact.h)(RecordingLength, {
      recordingLengthSeconds: recordingLengthSeconds,
      i18n: i18n
    }))));
  }

}

module.exports = CameraScreen;

/***/ }),

/***/ "./node_modules/@uppy/webcam/lib/DiscardButton.js":
/*!********************************************************!*\
  !*** ./node_modules/@uppy/webcam/lib/DiscardButton.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _preact = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

function DiscardButton(_ref) {
  let {
    onDiscard,
    i18n
  } = _ref;
  return (0, _preact.h)("button", {
    className: "uppy-u-reset uppy-c-btn uppy-Webcam-button uppy-Webcam-button--discard",
    type: "button",
    title: i18n('discardRecordedFile'),
    "aria-label": i18n('discardRecordedFile'),
    onClick: onDiscard,
    "data-uppy-super-focusable": true
  }, (0, _preact.h)("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 13 13",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon"
  }, (0, _preact.h)("g", {
    fill: "#FFF",
    fillRule: "evenodd"
  }, (0, _preact.h)("path", {
    d: "M.496 11.367L11.103.76l1.414 1.414L1.911 12.781z"
  }), (0, _preact.h)("path", {
    d: "M11.104 12.782L.497 2.175 1.911.76l10.607 10.606z"
  }))));
}

module.exports = DiscardButton;

/***/ }),

/***/ "./node_modules/@uppy/webcam/lib/PermissionsScreen.js":
/*!************************************************************!*\
  !*** ./node_modules/@uppy/webcam/lib/PermissionsScreen.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _preact = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

module.exports = _ref => {
  let {
    icon,
    i18n,
    hasCamera
  } = _ref;
  return (0, _preact.h)("div", {
    className: "uppy-Webcam-permissons"
  }, (0, _preact.h)("div", {
    className: "uppy-Webcam-permissonsIcon"
  }, icon()), (0, _preact.h)("h1", {
    className: "uppy-Webcam-title"
  }, hasCamera ? i18n('allowAccessTitle') : i18n('noCameraTitle')), (0, _preact.h)("p", null, hasCamera ? i18n('allowAccessDescription') : i18n('noCameraDescription')));
};

/***/ }),

/***/ "./node_modules/@uppy/webcam/lib/RecordButton.js":
/*!*******************************************************!*\
  !*** ./node_modules/@uppy/webcam/lib/RecordButton.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _preact = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

function RecordButton(_ref) {
  let {
    recording,
    onStartRecording,
    onStopRecording,
    i18n
  } = _ref;

  if (recording) {
    return (0, _preact.h)("button", {
      className: "uppy-u-reset uppy-c-btn uppy-Webcam-button",
      type: "button",
      title: i18n('stopRecording'),
      "aria-label": i18n('stopRecording'),
      onClick: onStopRecording,
      "data-uppy-super-focusable": true
    }, (0, _preact.h)("svg", {
      "aria-hidden": "true",
      focusable: "false",
      className: "uppy-c-icon",
      width: "100",
      height: "100",
      viewBox: "0 0 100 100"
    }, (0, _preact.h)("rect", {
      x: "15",
      y: "15",
      width: "70",
      height: "70"
    })));
  }

  return (0, _preact.h)("button", {
    className: "uppy-u-reset uppy-c-btn uppy-Webcam-button",
    type: "button",
    title: i18n('startRecording'),
    "aria-label": i18n('startRecording'),
    onClick: onStartRecording,
    "data-uppy-super-focusable": true
  }, (0, _preact.h)("svg", {
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon",
    width: "100",
    height: "100",
    viewBox: "0 0 100 100"
  }, (0, _preact.h)("circle", {
    cx: "50",
    cy: "50",
    r: "40"
  })));
}

module.exports = RecordButton;

/***/ }),

/***/ "./node_modules/@uppy/webcam/lib/RecordingLength.js":
/*!**********************************************************!*\
  !*** ./node_modules/@uppy/webcam/lib/RecordingLength.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _preact = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const formatSeconds = __webpack_require__(/*! ./formatSeconds.js */ "./node_modules/@uppy/webcam/lib/formatSeconds.js");

function RecordingLength(_ref) {
  let {
    recordingLengthSeconds,
    i18n
  } = _ref;
  const formattedRecordingLengthSeconds = formatSeconds(recordingLengthSeconds);
  return (0, _preact.h)("span", {
    "aria-label": i18n('recordingLength', {
      recording_length: formattedRecordingLengthSeconds
    })
  }, formattedRecordingLengthSeconds);
}

module.exports = RecordingLength;

/***/ }),

/***/ "./node_modules/@uppy/webcam/lib/SnapshotButton.js":
/*!*********************************************************!*\
  !*** ./node_modules/@uppy/webcam/lib/SnapshotButton.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _preact = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

const CameraIcon = __webpack_require__(/*! ./CameraIcon.js */ "./node_modules/@uppy/webcam/lib/CameraIcon.js");

module.exports = _ref => {
  let {
    onSnapshot,
    i18n
  } = _ref;
  return (0, _preact.h)("button", {
    className: "uppy-u-reset uppy-c-btn uppy-Webcam-button uppy-Webcam-button--picture",
    type: "button",
    title: i18n('takePicture'),
    "aria-label": i18n('takePicture'),
    onClick: onSnapshot,
    "data-uppy-super-focusable": true
  }, CameraIcon());
};

/***/ }),

/***/ "./node_modules/@uppy/webcam/lib/SubmitButton.js":
/*!*******************************************************!*\
  !*** ./node_modules/@uppy/webcam/lib/SubmitButton.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _preact = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

function SubmitButton(_ref) {
  let {
    onSubmit,
    i18n
  } = _ref;
  return (0, _preact.h)("button", {
    className: "uppy-u-reset uppy-c-btn uppy-Webcam-button uppy-Webcam-button--submit",
    type: "button",
    title: i18n('submitRecordedFile'),
    "aria-label": i18n('submitRecordedFile'),
    onClick: onSubmit,
    "data-uppy-super-focusable": true
  }, (0, _preact.h)("svg", {
    width: "12",
    height: "9",
    viewBox: "0 0 12 9",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": "true",
    focusable: "false",
    className: "uppy-c-icon"
  }, (0, _preact.h)("path", {
    fill: "#fff",
    fillRule: "nonzero",
    d: "M10.66 0L12 1.31 4.136 9 0 4.956l1.34-1.31L4.136 6.38z"
  })));
}

module.exports = SubmitButton;

/***/ }),

/***/ "./node_modules/@uppy/webcam/lib/VideoSourceSelect.js":
/*!************************************************************!*\
  !*** ./node_modules/@uppy/webcam/lib/VideoSourceSelect.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _preact = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

module.exports = _ref => {
  let {
    currentDeviceId,
    videoSources,
    onChangeVideoSource
  } = _ref;
  return (0, _preact.h)("div", {
    className: "uppy-Webcam-videoSource"
  }, (0, _preact.h)("select", {
    className: "uppy-u-reset uppy-Webcam-videoSource-select",
    onChange: event => {
      onChangeVideoSource(event.target.value);
    }
  }, videoSources.map(videoSource => (0, _preact.h)("option", {
    key: videoSource.deviceId,
    value: videoSource.deviceId,
    selected: videoSource.deviceId === currentDeviceId
  }, videoSource.label))));
};

/***/ }),

/***/ "./node_modules/@uppy/webcam/lib/Webcam.js":
/*!*************************************************!*\
  !*** ./node_modules/@uppy/webcam/lib/Webcam.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _preact = __webpack_require__(/*! preact */ "./node_modules/preact/dist/preact.module.js");

var _core = __webpack_require__(/*! @uppy/core */ "./node_modules/@uppy/core/lib/index.js");

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }

var id = 0;

function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }

const getFileTypeExtension = __webpack_require__(/*! @uppy/utils/lib/getFileTypeExtension */ "./node_modules/@uppy/utils/lib/getFileTypeExtension.js");

const mimeTypes = __webpack_require__(/*! @uppy/utils/lib/mimeTypes */ "./node_modules/@uppy/utils/lib/mimeTypes.js");

const canvasToBlob = __webpack_require__(/*! @uppy/utils/lib/canvasToBlob */ "./node_modules/@uppy/utils/lib/canvasToBlob.js");

const supportsMediaRecorder = __webpack_require__(/*! ./supportsMediaRecorder.js */ "./node_modules/@uppy/webcam/lib/supportsMediaRecorder.js");

const CameraIcon = __webpack_require__(/*! ./CameraIcon.js */ "./node_modules/@uppy/webcam/lib/CameraIcon.js");

const CameraScreen = __webpack_require__(/*! ./CameraScreen.js */ "./node_modules/@uppy/webcam/lib/CameraScreen.js");

const PermissionsScreen = __webpack_require__(/*! ./PermissionsScreen.js */ "./node_modules/@uppy/webcam/lib/PermissionsScreen.js");

const packageJson = {
  "version": "2.2.0"
};

const locale = __webpack_require__(/*! ./locale.js */ "./node_modules/@uppy/webcam/lib/locale.js");
/**
 * Normalize a MIME type or file extension into a MIME type.
 *
 * @param {string} fileType - MIME type or a file extension prefixed with `.`.
 * @returns {string|undefined} The MIME type or `undefined` if the fileType is an extension and is not known.
 */


function toMimeType(fileType) {
  if (fileType[0] === '.') {
    return mimeTypes[fileType.slice(1)];
  }

  return fileType;
}
/**
 * Is this MIME type a video?
 *
 * @param {string} mimeType - MIME type.
 * @returns {boolean}
 */


function isVideoMimeType(mimeType) {
  return /^video\/[^*]+$/.test(mimeType);
}
/**
 * Is this MIME type an image?
 *
 * @param {string} mimeType - MIME type.
 * @returns {boolean}
 */


function isImageMimeType(mimeType) {
  return /^image\/[^*]+$/.test(mimeType);
}

function getMediaDevices() {
  // bug in the compatibility data
  // eslint-disable-next-line compat/compat
  return navigator.mediaDevices;
}
/**
 * Webcam
 */


var _enableMirror = /*#__PURE__*/_classPrivateFieldLooseKey("enableMirror");

class Webcam extends _core.UIPlugin {
  // enableMirror is used to toggle mirroring, for instance when discarding the video,
  // while `opts.mirror` is used to remember the initial user setting
  constructor(uppy, opts) {
    super(uppy, opts);
    Object.defineProperty(this, _enableMirror, {
      writable: true,
      value: void 0
    });
    this.mediaDevices = getMediaDevices();
    this.supportsUserMedia = !!this.mediaDevices; // eslint-disable-next-line no-restricted-globals

    this.protocol = location.protocol.match(/https/i) ? 'https' : 'http';
    this.id = this.opts.id || 'Webcam';
    this.type = 'acquirer';
    this.capturedMediaFile = null;

    this.icon = () => (0, _preact.h)("svg", {
      "aria-hidden": "true",
      focusable: "false",
      width: "32",
      height: "32",
      viewBox: "0 0 32 32"
    }, (0, _preact.h)("g", {
      fill: "none",
      fillRule: "evenodd"
    }, (0, _preact.h)("rect", {
      className: "uppy-ProviderIconBg",
      fill: "#03BFEF",
      width: "32",
      height: "32",
      rx: "16"
    }), (0, _preact.h)("path", {
      d: "M22 11c1.133 0 2 .867 2 2v7.333c0 1.134-.867 2-2 2H10c-1.133 0-2-.866-2-2V13c0-1.133.867-2 2-2h2.333l1.134-1.733C13.6 9.133 13.8 9 14 9h4c.2 0 .4.133.533.267L19.667 11H22zm-6 1.533a3.764 3.764 0 0 0-3.8 3.8c0 2.129 1.672 3.801 3.8 3.801s3.8-1.672 3.8-3.8c0-2.13-1.672-3.801-3.8-3.801zm0 6.261c-1.395 0-2.46-1.066-2.46-2.46 0-1.395 1.065-2.461 2.46-2.461s2.46 1.066 2.46 2.46c0 1.395-1.065 2.461-2.46 2.461z",
      fill: "#FFF",
      fillRule: "nonzero"
    })));

    this.defaultLocale = locale; // set default options

    const defaultOptions = {
      onBeforeSnapshot: () => Promise.resolve(),
      countdown: false,
      modes: ['video-audio', 'video-only', 'audio-only', 'picture'],
      mirror: true,
      showVideoSourceDropdown: false,
      facingMode: 'user',
      preferredImageMimeType: null,
      preferredVideoMimeType: null,
      showRecordingLength: false
    };
    this.opts = { ...defaultOptions,
      ...opts
    };
    this.i18nInit();
    this.title = this.i18n('pluginNameCamera');
    _classPrivateFieldLooseBase(this, _enableMirror)[_enableMirror] = this.opts.mirror;
    this.install = this.install.bind(this);
    this.setPluginState = this.setPluginState.bind(this);
    this.render = this.render.bind(this); // Camera controls

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.takeSnapshot = this.takeSnapshot.bind(this);
    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
    this.discardRecordedVideo = this.discardRecordedVideo.bind(this);
    this.submit = this.submit.bind(this);
    this.oneTwoThreeSmile = this.oneTwoThreeSmile.bind(this);
    this.focus = this.focus.bind(this);
    this.changeVideoSource = this.changeVideoSource.bind(this);
    this.webcamActive = false;

    if (this.opts.countdown) {
      this.opts.onBeforeSnapshot = this.oneTwoThreeSmile;
    }

    this.setPluginState({
      hasCamera: false,
      cameraReady: false,
      cameraError: null,
      recordingLengthSeconds: 0,
      videoSources: [],
      currentDeviceId: null
    });
  }

  setOptions(newOpts) {
    super.setOptions({ ...newOpts,
      videoConstraints: { // May be undefined but ... handles that
        ...this.opts.videoConstraints,
        ...(newOpts == null ? void 0 : newOpts.videoConstraints)
      }
    });
  }

  hasCameraCheck() {
    if (!this.mediaDevices) {
      return Promise.resolve(false);
    }

    return this.mediaDevices.enumerateDevices().then(devices => {
      return devices.some(device => device.kind === 'videoinput');
    });
  }

  isAudioOnly() {
    return this.opts.modes.length === 1 && this.opts.modes[0] === 'audio-only';
  }

  getConstraints(deviceId) {
    if (deviceId === void 0) {
      deviceId = null;
    }

    const acceptsAudio = this.opts.modes.indexOf('video-audio') !== -1 || this.opts.modes.indexOf('audio-only') !== -1;
    const acceptsVideo = !this.isAudioOnly() && (this.opts.modes.indexOf('video-audio') !== -1 || this.opts.modes.indexOf('video-only') !== -1 || this.opts.modes.indexOf('picture') !== -1);
    const videoConstraints = { ...(this.opts.videoConstraints || {
        facingMode: this.opts.facingMode
      }),
      // facingMode takes precedence over deviceId, and not needed
      // when specific device is selected
      ...(deviceId ? {
        deviceId,
        facingMode: null
      } : {})
    };
    return {
      audio: acceptsAudio,
      video: acceptsVideo ? videoConstraints : false
    };
  } // eslint-disable-next-line consistent-return


  start(options) {
    if (options === void 0) {
      options = null;
    }

    if (!this.supportsUserMedia) {
      return Promise.reject(new Error('Webcam access not supported'));
    }

    this.webcamActive = true;

    if (this.opts.mirror) {
      _classPrivateFieldLooseBase(this, _enableMirror)[_enableMirror] = true;
    }

    const constraints = this.getConstraints(options && options.deviceId ? options.deviceId : null);
    this.hasCameraCheck().then(hasCamera => {
      this.setPluginState({
        hasCamera
      }); // ask user for access to their camera

      return this.mediaDevices.getUserMedia(constraints).then(stream => {
        this.stream = stream;
        let currentDeviceId = null;
        const tracks = this.isAudioOnly() ? stream.getAudioTracks() : stream.getVideoTracks();

        if (!options || !options.deviceId) {
          currentDeviceId = tracks[0].getSettings().deviceId;
        } else {
          tracks.forEach(track => {
            if (track.getSettings().deviceId === options.deviceId) {
              currentDeviceId = track.getSettings().deviceId;
            }
          });
        } // Update the sources now, so we can access the names.


        this.updateVideoSources();
        this.setPluginState({
          currentDeviceId,
          cameraReady: true
        });
      }).catch(err => {
        this.setPluginState({
          cameraReady: false,
          cameraError: err
        });
        this.uppy.info(err.message, 'error');
      });
    });
  }
  /**
   * @returns {object}
   */


  getMediaRecorderOptions() {
    const options = {}; // Try to use the `opts.preferredVideoMimeType` or one of the `allowedFileTypes` for the recording.
    // If the browser doesn't support it, we'll fall back to the browser default instead.
    // Safari doesn't have the `isTypeSupported` API.

    if (MediaRecorder.isTypeSupported) {
      const {
        restrictions
      } = this.uppy.opts;
      let preferredVideoMimeTypes = [];

      if (this.opts.preferredVideoMimeType) {
        preferredVideoMimeTypes = [this.opts.preferredVideoMimeType];
      } else if (restrictions.allowedFileTypes) {
        preferredVideoMimeTypes = restrictions.allowedFileTypes.map(toMimeType).filter(isVideoMimeType);
      }

      const filterSupportedTypes = candidateType => MediaRecorder.isTypeSupported(candidateType) && getFileTypeExtension(candidateType);

      const acceptableMimeTypes = preferredVideoMimeTypes.filter(filterSupportedTypes);

      if (acceptableMimeTypes.length > 0) {
        // eslint-disable-next-line prefer-destructuring
        options.mimeType = acceptableMimeTypes[0];
      }
    }

    return options;
  }

  startRecording() {
    // only used if supportsMediaRecorder() returned true
    // eslint-disable-next-line compat/compat
    this.recorder = new MediaRecorder(this.stream, this.getMediaRecorderOptions());
    this.recordingChunks = [];
    let stoppingBecauseOfMaxSize = false;
    this.recorder.addEventListener('dataavailable', event => {
      this.recordingChunks.push(event.data);
      const {
        restrictions
      } = this.uppy.opts;

      if (this.recordingChunks.length > 1 && restrictions.maxFileSize != null && !stoppingBecauseOfMaxSize) {
        const totalSize = this.recordingChunks.reduce((acc, chunk) => acc + chunk.size, 0); // Exclude the initial chunk from the average size calculation because it is likely to be a very small outlier

        const averageChunkSize = (totalSize - this.recordingChunks[0].size) / (this.recordingChunks.length - 1);
        const expectedEndChunkSize = averageChunkSize * 3;
        const maxSize = Math.max(0, restrictions.maxFileSize - expectedEndChunkSize);

        if (totalSize > maxSize) {
          stoppingBecauseOfMaxSize = true;
          this.uppy.info(this.i18n('recordingStoppedMaxSize'), 'warning', 4000);
          this.stopRecording();
        }
      }
    }); // use a "time slice" of 500ms: ondataavailable will be called each 500ms
    // smaller time slices mean we can more accurately check the max file size restriction

    this.recorder.start(500);

    if (this.opts.showRecordingLength) {
      // Start the recordingLengthTimer if we are showing the recording length.
      this.recordingLengthTimer = setInterval(() => {
        const currentRecordingLength = this.getPluginState().recordingLengthSeconds;
        this.setPluginState({
          recordingLengthSeconds: currentRecordingLength + 1
        });
      }, 1000);
    }

    this.setPluginState({
      isRecording: true
    });
  }

  stopRecording() {
    const stopped = new Promise(resolve => {
      this.recorder.addEventListener('stop', () => {
        resolve();
      });
      this.recorder.stop();

      if (this.opts.showRecordingLength) {
        // Stop the recordingLengthTimer if we are showing the recording length.
        clearInterval(this.recordingLengthTimer);
        this.setPluginState({
          recordingLengthSeconds: 0
        });
      }
    });
    return stopped.then(() => {
      this.setPluginState({
        isRecording: false
      });
      return this.getVideo();
    }).then(file => {
      try {
        this.capturedMediaFile = file; // create object url for capture result preview

        this.setPluginState({
          // eslint-disable-next-line compat/compat
          recordedVideo: URL.createObjectURL(file.data)
        });
        _classPrivateFieldLooseBase(this, _enableMirror)[_enableMirror] = false;
      } catch (err) {
        // Logging the error, exept restrictions, which is handled in Core
        if (!err.isRestriction) {
          this.uppy.log(err);
        }
      }
    }).then(() => {
      this.recordingChunks = null;
      this.recorder = null;
    }, error => {
      this.recordingChunks = null;
      this.recorder = null;
      throw error;
    });
  }

  discardRecordedVideo() {
    this.setPluginState({
      recordedVideo: null
    });

    if (this.opts.mirror) {
      _classPrivateFieldLooseBase(this, _enableMirror)[_enableMirror] = true;
    }

    this.capturedMediaFile = null;
  }

  submit() {
    try {
      if (this.capturedMediaFile) {
        this.uppy.addFile(this.capturedMediaFile);
      }
    } catch (err) {
      // Logging the error, exept restrictions, which is handled in Core
      if (!err.isRestriction) {
        this.uppy.log(err, 'error');
      }
    }
  }

  async stop() {
    if (this.stream) {
      const audioTracks = this.stream.getAudioTracks();
      const videoTracks = this.stream.getVideoTracks();
      audioTracks.concat(videoTracks).forEach(track => track.stop());
    }

    if (this.recorder) {
      await new Promise(resolve => {
        this.recorder.addEventListener('stop', resolve, {
          once: true
        });
        this.recorder.stop();

        if (this.opts.showRecordingLength) {
          clearInterval(this.recordingLengthTimer);
        }
      });
    }

    this.recordingChunks = null;
    this.recorder = null;
    this.webcamActive = false;
    this.stream = null;
    this.setPluginState({
      recordedVideo: null,
      isRecording: false,
      recordingLengthSeconds: 0
    });
  }

  getVideoElement() {
    return this.el.querySelector('.uppy-Webcam-video');
  }

  oneTwoThreeSmile() {
    return new Promise((resolve, reject) => {
      let count = this.opts.countdown; // eslint-disable-next-line consistent-return

      const countDown = setInterval(() => {
        if (!this.webcamActive) {
          clearInterval(countDown);
          this.captureInProgress = false;
          return reject(new Error('Webcam is not active'));
        }

        if (count > 0) {
          this.uppy.info(`${count}...`, 'warning', 800);
          count--;
        } else {
          clearInterval(countDown);
          this.uppy.info(this.i18n('smile'), 'success', 1500);
          setTimeout(() => resolve(), 1500);
        }
      }, 1000);
    });
  }

  takeSnapshot() {
    if (this.captureInProgress) return;
    this.captureInProgress = true;
    this.opts.onBeforeSnapshot().catch(err => {
      const message = typeof err === 'object' ? err.message : err;
      this.uppy.info(message, 'error', 5000);
      return Promise.reject(new Error(`onBeforeSnapshot: ${message}`));
    }).then(() => {
      return this.getImage();
    }).then(tagFile => {
      this.captureInProgress = false;

      try {
        this.uppy.addFile(tagFile);
      } catch (err) {
        // Logging the error, except restrictions, which is handled in Core
        if (!err.isRestriction) {
          this.uppy.log(err);
        }
      }
    }, error => {
      this.captureInProgress = false;
      throw error;
    });
  }

  getImage() {
    const video = this.getVideoElement();

    if (!video) {
      return Promise.reject(new Error('No video element found, likely due to the Webcam tab being closed.'));
    }

    const width = video.videoWidth;
    const height = video.videoHeight;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    const {
      restrictions
    } = this.uppy.opts;
    let preferredImageMimeTypes = [];

    if (this.opts.preferredImageMimeType) {
      preferredImageMimeTypes = [this.opts.preferredImageMimeType];
    } else if (restrictions.allowedFileTypes) {
      preferredImageMimeTypes = restrictions.allowedFileTypes.map(toMimeType).filter(isImageMimeType);
    }

    const mimeType = preferredImageMimeTypes[0] || 'image/jpeg';
    const ext = getFileTypeExtension(mimeType) || 'jpg';
    const name = `cam-${Date.now()}.${ext}`;
    return canvasToBlob(canvas, mimeType).then(blob => {
      return {
        source: this.id,
        name,
        data: new Blob([blob], {
          type: mimeType
        }),
        type: mimeType
      };
    });
  }

  getVideo() {
    // Sometimes in iOS Safari, Blobs (especially the first Blob in the recordingChunks Array)
    // have empty 'type' attributes (e.g. '') so we need to find a Blob that has a defined 'type'
    // attribute in order to determine the correct MIME type.
    const mimeType = this.recordingChunks.find(blob => {
      var _blob$type;

      return ((_blob$type = blob.type) == null ? void 0 : _blob$type.length) > 0;
    }).type;
    const fileExtension = getFileTypeExtension(mimeType);

    if (!fileExtension) {
      return Promise.reject(new Error(`Could not retrieve recording: Unsupported media type "${mimeType}"`));
    }

    const name = `webcam-${Date.now()}.${fileExtension}`;
    const blob = new Blob(this.recordingChunks, {
      type: mimeType
    });
    const file = {
      source: this.id,
      name,
      data: new Blob([blob], {
        type: mimeType
      }),
      type: mimeType
    };
    return Promise.resolve(file);
  }

  focus() {
    if (!this.opts.countdown) return;
    setTimeout(() => {
      this.uppy.info(this.i18n('smile'), 'success', 1500);
    }, 1000);
  }

  changeVideoSource(deviceId) {
    this.stop();
    this.start({
      deviceId
    });
  }

  updateVideoSources() {
    this.mediaDevices.enumerateDevices().then(devices => {
      this.setPluginState({
        videoSources: devices.filter(device => device.kind === 'videoinput')
      });
    });
  }

  render() {
    if (!this.webcamActive) {
      this.start();
    }

    const webcamState = this.getPluginState();

    if (!webcamState.cameraReady || !webcamState.hasCamera) {
      return (0, _preact.h)(PermissionsScreen, {
        icon: CameraIcon,
        i18n: this.i18n,
        hasCamera: webcamState.hasCamera
      });
    }

    return (0, _preact.h)(CameraScreen // eslint-disable-next-line react/jsx-props-no-spreading
    , _extends({}, webcamState, {
      onChangeVideoSource: this.changeVideoSource,
      onSnapshot: this.takeSnapshot,
      onStartRecording: this.startRecording,
      onStopRecording: this.stopRecording,
      onDiscardRecordedVideo: this.discardRecordedVideo,
      onSubmit: this.submit,
      onFocus: this.focus,
      onStop: this.stop,
      i18n: this.i18n,
      modes: this.opts.modes,
      showRecordingLength: this.opts.showRecordingLength,
      showVideoSourceDropdown: this.opts.showVideoSourceDropdown,
      supportsRecording: supportsMediaRecorder(),
      recording: webcamState.isRecording,
      mirror: _classPrivateFieldLooseBase(this, _enableMirror)[_enableMirror],
      src: this.stream
    }));
  }

  install() {
    this.setPluginState({
      cameraReady: false,
      recordingLengthSeconds: 0
    });
    const {
      target
    } = this.opts;

    if (target) {
      this.mount(target, this);
    }

    if (this.mediaDevices) {
      this.updateVideoSources();

      this.mediaDevices.ondevicechange = () => {
        this.updateVideoSources();

        if (this.stream) {
          let restartStream = true;
          const {
            videoSources,
            currentDeviceId
          } = this.getPluginState();
          videoSources.forEach(videoSource => {
            if (currentDeviceId === videoSource.deviceId) {
              restartStream = false;
            }
          });

          if (restartStream) {
            this.stop();
            this.start();
          }
        }
      };
    }
  }

  uninstall() {
    this.stop();
    this.unmount();
  }

  onUnmount() {
    this.stop();
  }

}

Webcam.VERSION = packageJson.version;
module.exports = Webcam;

/***/ }),

/***/ "./node_modules/@uppy/webcam/lib/formatSeconds.js":
/*!********************************************************!*\
  !*** ./node_modules/@uppy/webcam/lib/formatSeconds.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


function formatSeconds(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, 0)}`;
}

/**
 * Takes an Integer value of seconds (e.g. 83) and converts it into a human-readable formatted string (e.g. '1:23').
 *
 * @param {Integer} seconds
 * @returns {string} the formatted seconds (e.g. '1:23' for 1 minute and 23 seconds)
 *
 */
module.exports = formatSeconds;

/***/ }),

/***/ "./node_modules/@uppy/webcam/lib/index.js":
/*!************************************************!*\
  !*** ./node_modules/@uppy/webcam/lib/index.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


module.exports = __webpack_require__(/*! ./Webcam.js */ "./node_modules/@uppy/webcam/lib/Webcam.js");

/***/ }),

/***/ "./node_modules/@uppy/webcam/lib/locale.js":
/*!*************************************************!*\
  !*** ./node_modules/@uppy/webcam/lib/locale.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";


module.exports = {
  strings: {
    pluginNameCamera: 'Camera',
    noCameraTitle: 'Camera Not Available',
    noCameraDescription: 'In order to take pictures or record video, please connect a camera device',
    recordingStoppedMaxSize: 'Recording stopped because the file size is about to exceed the limit',
    submitRecordedFile: 'Submit recorded file',
    discardRecordedFile: 'Discard recorded file',
    // Shown before a picture is taken when the `countdown` option is set.
    smile: 'Smile!',
    // Used as the label for the button that takes a picture.
    // This is not visibly rendered but is picked up by screen readers.
    takePicture: 'Take a picture',
    // Used as the label for the button that starts a video recording.
    // This is not visibly rendered but is picked up by screen readers.
    startRecording: 'Begin video recording',
    // Used as the label for the button that stops a video recording.
    // This is not visibly rendered but is picked up by screen readers.
    stopRecording: 'Stop video recording',
    // Used as the label for the recording length counter. See the showRecordingLength option.
    // This is not visibly rendered but is picked up by screen readers.
    recordingLength: 'Recording length %{recording_length}',
    // Title on the “allow access” screen
    allowAccessTitle: 'Please allow access to your camera',
    // Description on the “allow access” screen
    allowAccessDescription: 'In order to take pictures or record video with your camera, please allow camera access for this site.'
  }
};

/***/ }),

/***/ "./node_modules/@uppy/webcam/lib/supportsMediaRecorder.js":
/*!****************************************************************!*\
  !*** ./node_modules/@uppy/webcam/lib/supportsMediaRecorder.js ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";


function supportsMediaRecorder() {
  /* eslint-disable compat/compat */
  return typeof MediaRecorder === 'function' && !!MediaRecorder.prototype && typeof MediaRecorder.prototype.start === 'function';
  /* eslint-enable compat/compat */
}

module.exports = supportsMediaRecorder;

/***/ }),

/***/ "./node_modules/nanoid/non-secure/index.cjs":
/*!**************************************************!*\
  !*** ./node_modules/nanoid/non-secure/index.cjs ***!
  \**************************************************/
/***/ ((module) => {

let urlAlphabet =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'
let customAlphabet = (alphabet, defaultSize = 21) => {
  return (size = defaultSize) => {
    let id = ''
    let i = size
    while (i--) {
      id += alphabet[(Math.random() * alphabet.length) | 0]
    }
    return id
  }
}
let nanoid = (size = 21) => {
  let id = ''
  let i = size
  while (i--) {
    id += urlAlphabet[(Math.random() * 64) | 0]
  }
  return id
}
module.exports = { nanoid, customAlphabet }


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"/js/tool": 0,
/******/ 			"css/tool": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkahmedkandel_nova_s3_multipart_upload"] = self["webpackChunkahmedkandel_nova_s3_multipart_upload"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["css/tool"], () => (__webpack_require__("./resources/js/tool.js")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["css/tool"], () => (__webpack_require__("./resources/sass/tool.scss")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;