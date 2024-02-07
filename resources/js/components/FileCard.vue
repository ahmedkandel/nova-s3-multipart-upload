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
                v-if="withMeta.canDownload && withMeta.contentDisposition.includes('inline')"
                v-tooltip.click="__('View')"
                @keydown.enter.prevent="downloadFile('inline')"
                @click.prevent="downloadFile('inline')"
                class="cursor-pointer dim btn btn-link text-primary inline-flex items-center ml-3"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" fill="currentColor" viewBox="0 0 22 16">
                    <icon-view />
                </svg>
            </button>

            <button
                type="button"
                v-if="withMeta.canDownload && withMeta.contentDisposition.includes('attachment')"
                v-tooltip.click="__('Download')"
                @keydown.enter.prevent="downloadFile('attachment')"
                @click.prevent="downloadFile('attachment')"
                class="cursor-pointer dim btn btn-link text-primary inline-flex items-center ml-3"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" fill="currentColor" viewBox="2 2 20 20">
                    <icon-download />
                </svg>
            </button>

            <button
                type="button"
                v-if="withMeta.canDelete"
                v-tooltip.click="__('Delete')"
                @keydown.enter.prevent="openRemoveModal"
                @click.prevent="openRemoveModal"
                class="cursor-pointer dim btn btn-link text-primary inline-flex items-center ml-3"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" fill="currentColor" viewBox="0 0 20 20" stroke="none">
                    <icon-delete />
                </svg>
            </button>
        </div>
    </card>
</template>

<script>
import { render } from 'preact';
import getFileType from "@uppy/utils/lib/getFileType";
import getFileTypeIcon from "@uppy/dashboard/lib/utils/getFileTypeIcon";
import IconView from '@/components/Icons/IconView';
import IconDownload from '@/components/Icons/IconDownload';
import IconDelete from '@/components/Icons/IconDelete';

export default {
    components: { IconView, IconDownload, IconDelete },
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
