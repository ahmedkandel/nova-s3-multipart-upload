<template>
    <card>
        <Dashboard :uppy="uppy" :props="options" class="uppy-panel" />
    </card>
</template>

<script>
import { Dashboard } from '@uppy/vue'
import Uppy from '@uppy/core'
import AwsS3Multipart from '@uppy/aws-s3-multipart'
import Webcam from '@uppy/webcam';
import ScreenCapture from '@uppy/screen-capture';
import ImageEditor from '@uppy/image-editor';

export default {
    components: {
        Dashboard,
    },

    props: ['companionUri', 'withMeta', 'queueFile'],

    data()
    {
        return this.initUppy();
    },

    beforeDestroy()
    {
        this.uppy.close();
    },

    methods:
    {
        getChunkSize(file)
        {
            return this.withMeta.chunkSize || (5 * 1024 * 1024);
        },

        initUppy()
        {
            let locale = window.NovaUppyLocale || {strings: {}};
                _.merge(locale.strings, this.withMeta.locale);

            let plugins = [];

            let uppy = new Uppy(
                {
                    id: this.withMeta.attribute,
                    autoProceed: this.withMeta.autoProceed || false,
                    allowMultipleUploadBatches: this.withMeta.allowMultipleUploads || false,
                    restrictions: {...this.withMeta.restrictions, ...this.withMeta.multipleFilesRestriction},
                    locale: locale,
                }
            )
            .on('upload-success', (file, response) =>
                {
                    this.queueFile(file);
                }
            )
            .use(AwsS3Multipart,
                {
                    limit: this.withMeta.limit || 0,
                    companionUrl: this.companionUri,
                    companionHeaders:
                    {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    },
                    getChunkSize: this.getChunkSize,
                }
            );

            uppy.on('file-added', (file) => {
                uppy.setFileMeta(file.id, this.withMeta.metaValues || {})
            });

            if (this.withMeta.useWebcam)
            {
                uppy.use(Webcam,
                    {
                        title: locale.strings['Camera'] || 'Camera',
                        showVideoSourceDropdown: true,
                        showRecordingLength: true,
                    }
                );

                plugins.push('Webcam');
            }

            if (this.withMeta.useScreenCapture)
            {
                uppy.use(ScreenCapture,
                    {
                        title: locale.strings['Screencast'] || 'Screencast',
                    }
                );

                plugins.push('ScreenCapture');
            }

            if (this.withMeta.useImageEditor)
            {
                uppy.use(ImageEditor,
                    {
                        quality: 1,
                    }
                );

                plugins.push('ImageEditor');
            }

            let options = {
                plugins: plugins,
                width: null,
                height: this.withMeta.height || null,
                showProgressDetails: true,
                fileManagerSelectionType: this.withMeta.fileManagerSelectionType || 'files',
                metaFields:
                [
                    ...this.withMeta.nameMetaField || [],
                    ...this.withMeta.metaFields || [],
                ],
                autoOpenFileEditor: this.withMeta.autoOpenFileEditor || false,
                proudlyDisplayPoweredByUppy: this.withMeta.proudlyDisplayPoweredByUppy || false,
                note: this.withMeta.note || null,
            };

            return {uppy, options};
        },
    },
}
</script>
