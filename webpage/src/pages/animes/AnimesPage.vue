<script setup lang="ts">
import { ref, provide } from 'vue'
import { useAnimes } from './composables/useAnimes'
import AnimeCards from './widgets/AnimeCards.vue'
import EditAnimeForm from './widgets/EditAnimeForm.vue'
import { Anime } from './types'
import { useModal, useToast } from 'vuestic-ui'

const { animes, update, isLoading, remove, pagination, sorting } = useAnimes()

const animeToEdit = ref<Anime | null>(null)
const doShowAnimeFormModal = ref(false)

const editAnime = (anime: Anime) => {
    animeToEdit.value = anime
    doShowAnimeFormModal.value = true
}

const createNewAnime = () => {
    animeToEdit.value = null
    doShowAnimeFormModal.value = true
}

const { init: notify } = useToast()

const onAnimeSaved = async (anime: Anime) => {
    doShowAnimeFormModal.value = false
    if ('id' in anime) {
        await update(anime as Anime)
        notify({
            message: 'Anime updated',
            color: 'success',
        })
    } else {
        // await add(anime as Anime)
        notify({
            message: 'Anime create not implemented',
            color: 'danger',
        })
    }
}

const { confirm } = useModal()

const onAnimeDeleted = async (anime: Anime) => {
    const response = await confirm({
        title: 'Delete anime',
        message: `Are you sure you want to delete anime "${anime.title}"?`,
        okText: 'Delete',
        size: 'small',
        maxWidth: '380px',
    })

    if (!response) {
        return
    }

    // await remove(anime)
    notify({
        message: 'Anime delete not implemented',
        color: 'danger',
    })
}

const editFormRef = ref()

const beforeEditFormModalClose = async (hide: () => unknown) => {
    if (editFormRef.value.isFormHasUnsavedChanges) {
        const agreed = await confirm({
            maxWidth: '380px',
            message: 'Form has unsaved changes. Are you sure you want to close it?',
            size: 'small',
        })
        if (agreed) {
            hide()
        }
    } else {
        hide()
    }
}
</script>

<template>
    <h1 class="page-title">Animes</h1>

    <VaCard>
        <VaCardContent>
            <AnimeCards :animes="animes" :loading="isLoading" @edit="editAnime" @delete="onAnimeDeleted" />
        </VaCardContent>

        <VaModal
            v-slot="{ cancel, ok }"
            v-model="doShowAnimeFormModal"
            size="small"
            mobile-fullscreen
            close-button
            stateful
            hide-default-actions
            :before-cancel="beforeEditFormModalClose"
        >
            <h1 v-if="animeToEdit === null" class="va-h5 mb-4">Add anime</h1>
            <h1 v-else class="va-h5 mb-4">Edit anime</h1>
            <EditAnimeForm
                ref="editFormRef"
                :anime="animeToEdit"
                :save-button-label="animeToEdit === null ? 'Add' : 'Save'"
                @close="cancel"
                @save="
                    (anime) => {
                        onAnimeSaved(anime)
                        ok()
                    }
                "
            />
        </VaModal>
    </VaCard>
</template>
