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
            <Button
              v-if="withMeta.canDownload && withMeta.contentDisposition.includes('inline')"
              as="Button"
              @keydown.enter.prevent="downloadFile('inline')"
              @click.stop="downloadFile('inline')"
              v-tooltip.click="__('View')"
              :aria-label="__('View')"
              icon="eye"
              variant="action"
              class="hover:text-primary-500 dark:hover:text-primary-500"
            />

            <Button
              v-if="withMeta.canDownload && withMeta.contentDisposition.includes('attachment')"
              as="Button"
              @keydown.enter.prevent="downloadFile('attachment')"
              @click.stop="downloadFile('attachment')"
              v-tooltip.click="__('Download')"
              :aria-label="__('Download')"
              icon="arrow down tray"
              variant="action"
              class="hover:text-primary-500 dark:hover:text-primary-500"
            />

            <Button
              v-if="withMeta.canDelete"
              as="Button"
              @keydown.enter.prevent="openDeleteModal"
              @click.stop="openDeleteModal"
              v-tooltip.click="__('Delete')"
              :aria-label="__('Delete')"
              icon="trash"
              variant="action"
              class="hover:text-primary-500 dark:hover:text-primary-500"
            />
        </div>

        <portal to="modals">
            <DeleteResourceModal
              mode="delete"
              :show="deleteModalOpen"
              @confirm="removeFile"
              @close="closeDeleteModal"
            >
              <ModalHeader v-text="__('Delete File')" />
              <ModalContent>
                <p class="leading-normal">
                  {{ __('Are you sure you want to delete this file?') }}
                </p>
              </ModalContent>
            </DeleteResourceModal>
        </portal>
    </card>
</template>

<script>
import { render } from 'preact';
import getFileType from "@uppy/utils/lib/getFileType";
import getFileTypeIcon from "@uppy/dashboard/lib/utils/getFileTypeIcon";
import DeleteResourceModal from '@/components/Modals/DeleteResourceModal';
import { Button } from 'laravel-nova-ui'

export default {
    components: { DeleteResourceModal, Button },
    props: ["fileKey", "fileName", "fileSize", "fileMeta", "apiUri", "withMeta"],

    data()
    {
        return {
            deleteModalOpen: false,
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

        openDeleteModal()
        {
            this.deleteModalOpen = true;
        },

        closeDeleteModal()
        {
            this.deleteModalOpen = false;
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
                );
        },
    }
}
</script>
