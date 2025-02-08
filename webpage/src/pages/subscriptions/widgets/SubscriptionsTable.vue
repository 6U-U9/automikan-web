<script setup lang="ts">
import { defineVaDataTableColumns, useModal } from 'vuestic-ui'
import { Subscription, SubscriptionSource } from '../types'
import { PropType, computed, toRef } from 'vue'
import { Pagination, Sorting } from '../composables/useSubscriptions'
import { useVModel } from '@vueuse/core'

const columns = defineVaDataTableColumns([
    { label: 'Index', key: 'id', sortable: true },
    { label: 'Source', key: 'source', sortable: true },
    { label: 'Aggregate', key: 'aggregate', sortable: true },
    { label: 'Url', key: 'url', sortable: true },
    { label: 'Description', key: 'description', sortable: true },
    { label: ' ', key: 'actions', align: 'right' },
])

const props = defineProps({
    subscriptions: {
        type: Array as PropType<Subscription[]>,
        required: true,
    },
    loading: { type: Boolean, default: false },
    pagination: { type: Object as PropType<Pagination>, required: true },
    sortBy: { type: String as PropType<Sorting['sortBy']>, required: true },
    sortingOrder: { type: String as PropType<Sorting['sortingOrder']>, default: null },
})

const emit = defineEmits<{
    (event: 'edit-subscription', subscription: Subscription): void
    (event: 'delete-subscription', subscription: Subscription): void
    (event: 'update:sortBy', sortBy: Sorting['sortBy']): void
    (event: 'update:sortingOrder', sortingOrder: Sorting['sortingOrder']): void
}>()

const subscriptions = toRef(props, 'subscriptions')
const sortByVModel = useVModel(props, 'sortBy', emit)
const sortingOrderVModel = useVModel(props, 'sortingOrder', emit)

const sourceColors: Record<SubscriptionSource, string> = {
    Unknown: 'background-element',
    Mikan: 'warning',
}

const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.perPage))

const { confirm } = useModal()

const onSubscriptionDelete = async (subscription: Subscription) => {
    const agreed = await confirm({
        title: 'Delete subscription',
        message: `Are you sure you want to delete ${subscription.url}?`,
        okText: 'Delete',
        cancelText: 'Cancel',
        size: 'small',
        maxWidth: '380px',
    })

    if (agreed) {
        emit('delete-subscription', subscription)
    }
}
</script>

<template>
    <VaDataTable
        v-model:sort-by="sortByVModel"
        v-model:sorting-order="sortingOrderVModel"
        :columns="columns"
        :items="subscriptions"
        :loading="$props.loading"
    >
        <template #cell(id)="{ rowData }">
            <div class="flex items-center gap-2 max-w-[50px] ellipsis">
                {{ rowData.id }}
            </div>
        </template>

        <template #cell(source)="{ rowData }">
            <VaBadge :text="rowData.source" :color="sourceColors[rowData.source as SubscriptionSource]" />
        </template>

        <template #cell(aggregate)="{ rowData }">
            <div class="ellipsis max-w-[50px]">
                <VaIcon v-if="rowData.aggregate" name="check" color="success" size="20px" />
                <VaIcon v-else name="close" color="danger" size="20px" />
            </div>
        </template>

        <template #cell(url)="{ rowData }">
            <div class="max-w-[220px] ellipsis">
                {{ rowData.url }}
            </div>
        </template>

        <template #cell(description)="{ rowData }">
            <div class="ellipsis max-w-[130px]">
                {{ rowData.description }}
            </div>
        </template>

        <template #cell(actions)="{ rowData }">
            <div class="flex gap-2 justify-end">
                <VaButton
                    preset="primary"
                    size="small"
                    icon="mso-edit"
                    aria-label="Edit subscription"
                    @click="$emit('edit-subscription', rowData as Subscription)"
                />
                <VaButton
                    preset="primary"
                    size="small"
                    icon="mso-delete"
                    color="danger"
                    aria-label="Delete subscription"
                    @click="onSubscriptionDelete(rowData as Subscription)"
                />
            </div>
        </template>
    </VaDataTable>

    <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center py-2">
        <div>
            <b>{{ $props.pagination.total }} results.</b>
            Results per page
            <VaSelect v-model="$props.pagination.perPage" class="!w-20" :options="[10, 50, 100]" />
        </div>

        <div v-if="totalPages > 1" class="flex">
            <VaButton
                preset="secondary"
                icon="va-arrow-left"
                aria-label="Previous page"
                :disabled="$props.pagination.page === 1"
                @click="$props.pagination.page--"
            />
            <VaButton
                class="mr-2"
                preset="secondary"
                icon="va-arrow-right"
                aria-label="Next page"
                :disabled="$props.pagination.page === totalPages"
                @click="$props.pagination.page++"
            />
            <VaPagination
                v-model="$props.pagination.page"
                buttons-preset="secondary"
                :pages="totalPages"
                :visible-pages="5"
                :boundary-links="false"
                :direction-links="false"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.va-data-table {
    ::v-deep(.va-data-table__table-tr) {
        border-bottom: 1px solid var(--va-background-border);
    }
}
</style>
