<template>
    <card class="flex item-center overflow-hidden p-4">
        <a
            :href="withMeta.viewResource === true ? fileUrl: null"
        >
            <div
                ref="fileIcon"
                v-tooltip.click="formatedFileMeta"
                class="flex items-center flex-no-shrink mr-4"
            >
            </div>
        </a>

        <div class="flex flex-col justify-center truncate">
            <div>
                {{fileName || fileKey}}
            </div>

            <div
                v-if="fileSize"
                class="mt-2 text-80 text-xs font-semibold"
            >
                {{formatedFileSize}}
            </div>
        </div>

        <div
            v-if="withMeta.canDownload || withMeta.canDelete"
            class="flex item-center ml-auto"
        >
            <button
                type="button"
                v-if="withMeta.canDownload"
                v-tooltip.click="__('Download')"
                @keydown.enter.prevent="downloadFile"
                @click.prevent="downloadFile"
                class="cursor-pointer dim btn btn-link text-primary inline-flex items-center ml-3"
            >
                <icon type="download" view-box="0 0 24 24" width="16" height="16" />
            </button>

            <button
                type="button"
                v-if="withMeta.canDelete"
                v-tooltip.click="__('Delete')"
                @keydown.enter.prevent="openRemoveModal"
                @click.prevent="openRemoveModal"
                class="cursor-pointer dim btn btn-link text-primary inline-flex items-center ml-3"
            >
                <icon type="delete" view-box="0 0 20 20" width="16" height="16" />
            </button>
        </div>

        <portal to="modals">
            <confirm-upload-removal-modal
                v-if="removeModalOpen"
                @confirm="removeFile"
                @close="closeRemoveModal"
            />
        </portal>
    </card>
</template>

<script>
import { render } from 'preact';
import getFileType from "@uppy/utils/lib/getFileType";
import getFileTypeIcon from "@uppy/dashboard/lib/utils/getFileTypeIcon";

export default {
    props: ["fileKey", "fileName", "fileSize", "fileMeta", "apiUri", "withMeta", "fileUrl"],

    data()
    {
        return {
            removeModalOpen: false,
        };
    },

    mounted()
    {
        render(
            getFileTypeIcon(
                getFileType(
                    {
                        name: this.fileKey,
                    }
                )
            ).icon,
            this.$refs.fileIcon
        );
    },

    computed:
    {
        formatedFileSize: function ()
        {
            let i = Math.floor( Math.log(this.fileSize) / Math.log(1024) );

            return ( this.fileSize / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];
        },

        formatedFileMeta: function ()
        {
            let output = [];

            for (const prop in this.fileMeta)
            {
                output.push(`${prop}: ${this.fileMeta[prop]}`);
            }

            return output.join(' | ');
        },
    },

    methods:
    {
        downloadFile()
        {
            Nova.request()
                .get(`${this.apiUri}/${this.fileKey}`)
                .then((response) =>
                    {
                        let link = document.createElement('a');
                        link.href = response.data.temporaryUrl;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                )
                .catch((error) =>
                    {
                        Nova.error(error.message);
                    }
                );
        },

        openRemoveModal()
        {
            this.removeModalOpen = true;
        },

        closeRemoveModal()
        {
            this.removeModalOpen = false;
        },

        removeFile()
        {
            Nova.request()
                .delete(`${this.apiUri}/${this.fileKey}`)
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
                        this.closeRemoveModal();
                    }
                );
        },
    }
}
</script>
