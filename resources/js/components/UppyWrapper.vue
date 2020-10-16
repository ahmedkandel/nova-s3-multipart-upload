<template>
    <card>
        <div ref="uppyPanel" class="uppy-panel"></div>
    </card>
</template>

<script>
import Uppy from "@uppy/core";
import AwsS3Multipart from "@uppy/aws-s3-multipart";
import Webcam from "@uppy/webcam";
import ScreenCapture from "@uppy/screen-capture";
import ImageEditor from "@uppy/image-editor";
import Dashboard from "@uppy/dashboard";

export default {
    props: ["companionUri", "withMeta", "queueFile"],

    data()
    {
        return {
            uppyInstance: null,
        };
    },

    mounted()
    {
        this.initUppy();
    },

    beforeDestroy()
    {
        this.uppyInstance.close();
    },

    methods:
    {
        getChunkSize(file)
        {
            return this.withMeta.chunkSize || (5 * 1024 * 1024);
        },

        initUppy()
        {
            let plugins = [];

            this.uppyInstance = Uppy(
                {
                    id: this.withMeta.attribute,
                    autoProceed: this.withMeta.autoProceed || false,
                    allowMultipleUploads: this.withMeta.allowMultipleUploads || false,
                    restrictions: {...this.withMeta.restrictions, ...this.withMeta.multipleFilesRestriction},
                    meta: this.withMeta.metaValues || {},
                    locale: {strings: this.withMeta.locale || {}},
                }
            )
            .on('upload-success', (file, response) =>
                {
                    this.queueFile(file, response);
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

            if (this.withMeta.useWebcam)
            {
                this.uppyInstance.use(Webcam,
                    {
                        title: (this.withMeta.locale && this.withMeta.locale['camera']) || 'Camera',
                        showRecordingLength: true,
                    }
                );

                plugins.push('Webcam');
            }

            if (this.withMeta.useScreenCapture)
            {
                this.uppyInstance.use(ScreenCapture,
                    {
                        title: (this.withMeta.locale && this.withMeta.locale['screencast']) || 'Screencast',
                    }
                );

                plugins.push('ScreenCapture');
            }

            if (this.withMeta.useImageEditor)
            {
                this.uppyInstance.use(ImageEditor,
                    {
                        quality: 1,
                    }
                );

                plugins.push('ImageEditor');
            }

            this.uppyInstance.use(Dashboard,
                {
                    plugins: plugins,
                    target: this.$refs.uppyPanel,
                    inline: true,
                    width: null,
                    height: this.withMeta.height || null,
                    showLinkToFileUploadResult: false,
                    showProgressDetails: true,
                    fileManagerSelectionType: this.withMeta.fileManagerSelectionType || 'files',
                    metaFields:
                    [
                        ...this.withMeta.nameMetaField || [],
                        ...this.withMeta.metaFields || [],
                    ],
                    proudlyDisplayPoweredByUppy: this.withMeta.proudlyDisplayPoweredByUppy || false,
                    note: this.withMeta.note || null,
                }
            );
        },
    },
}
</script>
