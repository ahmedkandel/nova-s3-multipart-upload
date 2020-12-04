<template>
    <loading-view :loading="isLoading">
        <div
            v-if="files.length"
            class="mb-3 files-grid"
            :class="{'files-grid-2' : files.length === 2, 'files-grid-3' : files.length > 2}"
        >
            <file-card
                v-for="file in files"
                :key="file.fileKey"
                :file-key="file.fileKey"
                :file-name="file.fileName"
                :file-size="file.fileSize"
                :file-meta="file.fileMeta"
                :file-url="file.fileUrl"
                :api-uri="file.apiUri"
                :with-meta="withMeta"
            />
        </div>
    </loading-view>
</template>

<script>
import FileCard from "./FileCard.vue";

export default {
    components: {FileCard},

    props: ["apiUri", "withMeta"],

    data()
    {
        return {
            files: [],
            isLoading: true,
        };
    },

    created()
    {
        this.getFiles();

        Nova.$on(`refresh-${this.withMeta.attribute}-files`, () =>
            {
                this.getFiles();
            }
        );
    },

    methods:
    {
        getFiles()
        {
            this.isLoading = true;

            new Promise((resolve) =>
                {
                    setTimeout(() => resolve(), 300);
                }
            )
            .then(() =>
                {
                    Nova.request()
                        .get(this.apiUri)
                        .then((response) =>
                            {
                                this.isLoading = false;

                                this.files = response.data.files;
                            }
                        );
                }
            );
        },
    },
}
</script>
