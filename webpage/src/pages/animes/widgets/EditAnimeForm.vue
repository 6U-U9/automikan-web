<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { EmptyAnime, Anime } from '../types'
import { SelectOption } from 'vuestic-ui'

const props = defineProps<{
    anime: Anime | null
    saveButtonLabel: string
}>()

defineEmits<{
    (event: 'save', anime: Anime): void
    (event: 'close'): void
}>()

const defaultNewAnime: EmptyAnime = {
    title: '',
    alternative_title: '',
    season: 1,
    air_time: '',
    fliter_rule: '',
    naming_format: '',
}

const newAnime = ref({ ...defaultNewAnime })

const isFormHasUnsavedChanges = computed(() => {
    return Object.keys(newAnime.value).some((key) => {
        return newAnime.value[key as keyof EmptyAnime] !== (props.anime ?? defaultNewAnime)?.[key as keyof EmptyAnime]
    })
})

defineExpose({
    isFormHasUnsavedChanges,
})

watch(
    () => props.anime,
    () => {
        if (!props.anime) {
            return
        }

        newAnime.value = {
            ...props.anime,
        }
    },
    { immediate: true },
)
</script>

<template>
    <VaForm v-slot="{ validate }" class="flex flex-col gap-2">
        <VaInput v-model="newAnime.title" label="Anime Title" disabled />
        <VaInput v-model="newAnime.alternative_title" label="Alternative title" disabled />
        <VaInput v-model="newAnime.season" label="Season" inputmode="number" type="number" />
        <VaInput v-model="newAnime.fliter_rule" label="Fliter Rule" />
        <VaInput v-model="newAnime.naming_format" label="Naming Format" />
        <div class="flex justify-end flex-col-reverse sm:flex-row mt-4 gap-2">
            <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
            <VaButton @click="validate() && $emit('save', newAnime as Anime)">{{ saveButtonLabel }}</VaButton>
        </div>
    </VaForm>
</template>

<style lang="scss" scoped>
.va-select-content__autocomplete {
    flex: 1;
}

.va-input-wrapper__text {
    gap: 0.2rem;
}
</style>
