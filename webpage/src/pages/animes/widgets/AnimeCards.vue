<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { type PropType } from 'vue'
import { type Anime } from '../types'

const props = defineProps({
    animes: {
        type: Array as PropType<Anime[]>,
        required: true,
    },
    loading: {
        type: Boolean,
        required: true,
    },
})

defineEmits<{
    (event: 'edit', anime: Anime): void
    (event: 'delete', anime: Anime): void
}>()
</script>

<template>
    <VaInnerLoading
        v-if="animes.length > 0 || loading"
        :loading="loading"
        class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 min-h-[4rem]"
    >
        <VaCard
            v-for="anime in animes"
            :key="anime.id"
            :style="{ '--va-card-outlined-border': '1px solid var(--va-background-element)' }"
            outlined
        >
            <VaCardBlock horizontal>
                <VaImage
                    class="flex-grow-0 flex-shrink-0 basis-52"
                    :src="anime.poster_blob_url"
                    fit="contain"
                    :ratio="7 / 10"
                />
                <div class="flex-auto">
                    <VaCardContent class="flex flex-col h-full">
                        <div class="flex flex-col items-center gap-1 grow">
                            <h4 class="va-h5 text-center self-stretch overflow-hidden line-clamp-2 text-ellipsis">
                                {{ anime.title }}
                            </h4>
                            <VaBadge :text="`season ${anime.season}`" color="warning" text-color="#812E9E" />
                        </div>
                        <VaDivider class="my-6" />
                        <div class="flex justify-between">
                            <VaButton
                                preset="secondary"
                                icon="mso-edit"
                                color="secondary"
                                @click="$emit('edit', anime)"
                            />
                            <VaButton
                                preset="secondary"
                                icon="mso-delete"
                                color="danger"
                                @click="$emit('delete', anime)"
                            />
                        </div>
                    </VaCardContent>
                </div>
            </VaCardBlock>
        </VaCard>
    </VaInnerLoading>
    <div v-else class="p-4 flex justify-center items-center text-[var(--va-secondary)]">No animes</div>
</template>
