<template>
    <card class="flex item-center overflow-hidden p-4">
        <div
            ref="fileIcon"
            v-tooltip.click="formatedFileMeta"
            class="flex items-center flex-no-shrink mr-4"
        >
        </div>

        <div class="flex flex-col justify-center truncate">
            <div>
                {{ fileName || fileKey }}
            </div>

            <div
                v-if="fileSize"
                class="mt-2 text-80 text-xs font-semibold"
            >
                {{ formatedFileSize }}
            </div>
        </div>

        <div
            v-if="withMeta.canDownload || withMeta.canDelete"
            class="flex item-center ml-auto"
        >
            <button
                v-if="withMeta.canDownload && withMeta.contentDisposition.includes('inline')"
                v-tooltip.click="__('View')"
                class="cursor-pointer dim btn btn-link text-primary inline-flex items-center ml-3"
                type="button"
                @keydown.enter.prevent="downloadFile('inline')"
                @click.prevent="downloadFile('inline')"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" fill="none" viewBox="0 0 22 16" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            </button>

            <button
                v-if="withMeta.canDownload && withMeta.contentDisposition.includes('attachment')"
                v-tooltip.click="__('Download')"
                type="button"
                class="cursor-pointer dim btn btn-link text-primary inline-flex items-center ml-3"
                @keydown.enter.prevent="downloadFile('attachment')"
                @click.prevent="downloadFile('attachment')"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" fill="none" viewBox="2 2 20 20" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
            </button>

            <button
                v-if="withMeta.canDelete"
                v-tooltip.click="__('Delete')"
                type="button"
                class="cursor-pointer dim btn btn-link text-primary inline-flex items-center ml-3"
                @keydown.enter.prevent="removeFile"
                @click.prevent="removeFile"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" fill="none" viewBox="0 0 20 20" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    </card>
</template>

<script>
import { render } from 'preact';
import getFileType from "@uppy/utils/lib/getFileType";
import getFileTypeIcon from "@uppy/dashboard/lib/utils/getFileTypeIcon";

export default {
    props: ["fileKey", "fileName", "fileSize", "fileMeta", "apiUri", "withMeta"],

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
        downloadFile(contentDisposition)
        {
            Nova.request()
                .get(`${this.apiUri}/${this.fileKey}`, { params: { contentDisposition } })
                .then((response) =>
                    {
                        let link = document.createElement('a');
                        link.href = response.data.temporaryUrl;
                        link.target = contentDisposition === 'inline' ? '_blank' : '_self';
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

        removeFile()
        {
            if(!confirm("Are you sure you want to delete this file?")){
                return;
            }

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
                );
        },
    }
}
</script>
