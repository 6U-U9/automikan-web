import { Ref, ref, watch } from 'vue'
import { Subscription } from '../types'
import { listSubscriptions, addSubscription, deleteSubscription } from '../../../api/subscription'

export type Pagination = {
    page: number
    perPage: number
    total: number
}

export type Sorting = {
    sortBy: keyof Subscription | undefined
    sortingOrder: 'asc' | 'desc' | null
}

export type Filters = {
    isAggregate: boolean
    source: string
    search: string
}

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'id', sortingOrder: null })
const makeFiltersRef = () => ref<Partial<Filters>>({ isAggregate: true, search: '' })

export const useSubscriptions = (options?: {
    pagination?: Ref<Pagination>
    sorting?: Ref<Sorting>
    filters?: Ref<Partial<Filters>>
}) => {
    const isLoading = ref(false)
    const error = ref()

    const { filters = makeFiltersRef(), sorting = makeSortingRef(), pagination = makePaginationRef() } = options || {}

    const subscriptions = ref([]) as Ref<Subscription[]>

    const fetch = async () => {
        isLoading.value = true
        try {
            subscriptions.value = await listSubscriptions()
        } finally {
            isLoading.value = false
        }
    }

    watch(
        filters,
        () => {
            // Reset pagination to first page when filters changed
            pagination.value.page = 1
            fetch()
        },
        { deep: true },
    )

    fetch()

    return {
        error,
        isLoading,
        filters,
        sorting,
        pagination,

        subscriptions,

        fetch,

        async add(subscription: Subscription) {
            isLoading.value = true
            try {
                const response = await addSubscription(subscription)
                fetch()
                return response
            } catch (e) {
                error.value = e
            } finally {
                isLoading.value = false
            }
        },

        async update(subscription: Subscription) {
            isLoading.value = true
            try {
                const response = await addSubscription(subscription)
                fetch()
                return response
            } catch (e) {
                error.value = e
            } finally {
                isLoading.value = false
            }
        },

        async remove(subscription: Subscription) {
            isLoading.value = true
            try {
                const response = await deleteSubscription(subscription)
                fetch()
                return response
            } catch (e) {
                error.value = e
            } finally {
                isLoading.value = false
            }
        },
    }
}
