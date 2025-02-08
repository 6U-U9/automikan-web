import { Ref, ref, unref, computed } from 'vue'
import { Anime } from '../types'
import { listAnimes, updateAnime, deleteAnime } from '../../../api/anime'
import { getPoster } from '../../../api/poster'

export type Pagination = {
    page: number
    perPage: number
    total: number
}

export type Sorting = {
    sortBy: keyof Anime | undefined
    sortingOrder: 'asc' | 'desc' | null
}

export type Filters = {
    isAggregate: boolean
    source: string
    search: string
}

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'id', sortingOrder: 'desc' })

export const useAnimes = (options?: { sorting?: Ref<Sorting>; pagination?: Ref<Pagination> }) => {
    const isLoading = ref(false)
    const error = ref()

    const { sorting = makeSortingRef(), pagination = makePaginationRef() } = options ?? {}

    const animes = ref([]) as Ref<Anime[]>

    const fetch = async () => {
        isLoading.value = true
        try {
            animes.value = await listAnimes()
            for (const anime of animes.value) {
                anime.poster_blob_url = await getPoster(anime.poster_id)
            }
        } finally {
            isLoading.value = false
        }
    }

    fetch()

    return {
        isLoading,

        animes,

        fetch,

        async update(anime: Anime) {
            isLoading.value = true
            try {
                const response = await updateAnime(anime)
                fetch()
                return response
            } catch (e) {
                error.value = e
            } finally {
                isLoading.value = false
            }
        },

        async remove(anime: Anime) {
            isLoading.value = true
            try {
                const response = await deleteAnime(anime)
                fetch()
                return response
            } catch (e) {
                error.value = e
            } finally {
                isLoading.value = false
            }
        },

        pagination,
        sorting,
    }
}
