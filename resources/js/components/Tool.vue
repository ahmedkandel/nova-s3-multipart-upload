<template>
    <div>
        <heading :level="1" class="mb-3">{{panel.name}}</heading>

        <files-grid
            v-if="withMeta.canView"
            :api-uri="apiUri"
            :with-meta="withMeta"
        />

        <uppy-wrapper
            v-if="withMeta.canUpload"
            :companion-uri="companionUri"
            :with-meta="withMeta"
            :queue-file="queueFile"
        />
    </div>
</template>

<script>
import FilesGrid from "./FilesGrid.vue";
import UppyWrapper from "./UppyWrapper.vue";

export default {
    components: {FilesGrid, UppyWrapper},

    props: ["resourceName", "resourceId", "panel"],

    data()
    {
        return {
            apiUri: `/nova-vendor/nova-s3-multipart-upload/${this.resourceName}/${this.resourceId}/${this.panel.fields[0].attribute}/files`,
            companionUri: `/nova-vendor/nova-s3-multipart-upload/${this.resourceName}/${this.resourceId}/${this.panel.fields[0].attribute}/`,
            withMeta: this.panel.fields[0],
            filesQueue: [],
            isSaving: false,
        };
    },

    watch:
    {
        filesQueue: {
            handler: function (){
                if (!this.isSaving && this.filesQueue.length)
                {
                    this.processQueue();
                }
            },
            deep: true
        },
    },

    methods:
    {
        queueFile(file)
        {
            this.filesQueue.push(
                {
                    fileId: file.id,
                    fileKey: file.s3Multipart.key,
                    fileName: file.meta.name,
                    fileSize: file.size || 0,
                    fileMeta: file.meta,
                }
            );
        },

        dequeueFile(fileId)
        {
            this.filesQueue = this.filesQueue.filter((item) => item.fileId !== fileId);
        },

        processQueue()
        {
            this.saveModel(this.filesQueue[0]);
        },

        saveModel(data)
        {
            this.isSaving = true,

            Nova.request()
                .post(this.apiUri, data)
                .then((response) =>
                    {
                        Nova.success(response.data.message);

                        Nova.$emit(`refresh-${this.withMeta.attribute}-files`);

                        if (this.withMeta.refreshListable)
                        {
                            Nova.$emit('refresh-resources');
                        }
                    }
                )
                .catch((error) =>
                    {
                        Nova.error(error.message);
                    }
                )
                .then(() =>
                    {
                        this.isSaving = false,

                        this.dequeueFile(data.fileId);
                    }
                );
        },
    },
};
</script>
