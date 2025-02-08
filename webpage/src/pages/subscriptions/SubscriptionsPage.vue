<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import SubscriptionsTable from './widgets/SubscriptionsTable.vue'
import EditSubscriptionForm from './widgets/EditSubscriptionForm.vue'
import { Subscription } from './types'
import { useSubscriptions } from './composables/useSubscriptions'
import { useModal, useToast } from 'vuestic-ui'

const doShowEditSubscriptionModal = ref(false)

const { subscriptions, isLoading, filters, sorting, pagination, error, ...subscriptionsApi } = useSubscriptions()

const subscriptionToEdit = ref<Subscription | null>(null)

const showEditSubscriptionModal = (subscription: Subscription) => {
    subscriptionToEdit.value = subscription
    doShowEditSubscriptionModal.value = true
}

const showAddSubscriptionModal = () => {
    subscriptionToEdit.value = null
    doShowEditSubscriptionModal.value = true
}

const { init: notify } = useToast()

watchEffect(() => {
    if (error.value) {
        notify({
            message: error.value.message,
            color: 'danger',
        })
    }
})

const onSubscriptionSaved = async (subscription: Subscription) => {
    if (subscriptionToEdit.value) {
        await subscriptionsApi.update(subscription)
        if (!error.value) {
            notify({
                message: `subscription has been updated`,
                color: 'success',
            })
        }
    } else {
        await subscriptionsApi.add(subscription)

        if (!error.value) {
            notify({
                message: `subscription has been created`,
                color: 'success',
            })
        }
    }
}

const onSubscriptionDelete = async (subscription: Subscription) => {
    await subscriptionsApi.remove(subscription)
    notify({
        message: `subscription has been deleted`,
        color: 'success',
    })
}

const editFormRef = ref()

const { confirm } = useModal()

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
    <h1 class="page-title">Subscriptions</h1>

    <VaCard>
        <VaCardContent>
            <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
                <div class="flex flex-col md:flex-row gap-2 justify-start">
                    <VaInput v-model="filters.search" placeholder="Search">
                        <template #prependInner>
                            <VaIcon name="search" color="secondary" size="small" />
                        </template>
                    </VaInput>
                </div>
                <VaButton @click="showAddSubscriptionModal">Add Subscription</VaButton>
            </div>

            <SubscriptionsTable
                v-model:sort-by="sorting.sortBy"
                v-model:sorting-order="sorting.sortingOrder"
                :subscriptions="subscriptions"
                :loading="isLoading"
                :pagination="pagination"
                @editSubscription="showEditSubscriptionModal"
                @deleteSubscription="onSubscriptionDelete"
            />
        </VaCardContent>
    </VaCard>

    <VaModal
        v-slot="{ cancel, ok }"
        v-model="doShowEditSubscriptionModal"
        size="small"
        mobile-fullscreen
        close-button
        hide-default-actions
        :before-cancel="beforeEditFormModalClose"
    >
        <h1 class="va-h5">{{ subscriptionToEdit ? 'Edit subscription' : 'Add subscription' }}</h1>
        <EditSubscriptionForm
            ref="editFormRef"
            :subscription="subscriptionToEdit"
            :save-button-label="subscriptionToEdit ? 'Save' : 'Add'"
            @close="cancel"
            @save="
                (subscription) => {
                    onSubscriptionSaved(subscription)
                    ok()
                }
            "
        />
    </VaModal>
</template>
