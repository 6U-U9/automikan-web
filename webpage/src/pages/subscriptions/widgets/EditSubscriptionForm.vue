<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { Subscription, SubscriptionSource } from '../types'
import { validators } from '../../../services/utils'

const props = defineProps({
    subscription: {
        type: Object as PropType<Subscription | null>,
        default: null,
    },
    saveButtonLabel: {
        type: String,
        default: 'Save',
    },
})

const defaultNewSubscription: Omit<Subscription, 'id'> = {
    source: 'Mikan',
    aggregate: true,
    url: '',
    description: '',
}

const newSubscription = ref<Subscription>({ ...defaultNewSubscription } as Subscription)

const isFormHasUnsavedChanges = computed(() => {
    return Object.keys(newSubscription.value).some((key) => {
        return (
            newSubscription.value[key as keyof Omit<Subscription, 'id'>] !==
            (props.subscription ?? defaultNewSubscription)?.[key as keyof Omit<Subscription, 'id'>]
        )
    })
})

defineExpose({
    isFormHasUnsavedChanges,
})

watch(
    [() => props.subscription],
    () => {
        if (!props.subscription) {
            return
        }

        newSubscription.value = {
            ...props.subscription,
        }
    },
    { immediate: true },
)

const form = useForm('add-subscription-form')

const emit = defineEmits(['close', 'save'])

const onSave = () => {
    if (form.validate()) {
        emit('save', newSubscription.value)
    }
}

const sourceSelectOptions: { text: Capitalize<Lowercase<SubscriptionSource>>; value: SubscriptionSource }[] = [
    { text: 'Mikan', value: 'Mikan' },
    { text: 'Unknown', value: 'Unknown' },
]
</script>

<template>
    <VaForm
        v-slot="{ isValid }"
        ref="add-subscription-form"
        class="flex-col justify-start items-start gap-4 inline-flex w-full"
    >
        <div class="self-stretch flex-col justify-start items-start gap-4 flex">
            <div class="flex gap-4 w-full">
                <div class="w-1/2">
                    <VaSelect
                        v-model="newSubscription.source"
                        label="Source"
                        class="w-full"
                        :options="sourceSelectOptions"
                        :rules="[validators.required]"
                        name="source"
                        value-by="value"
                    />
                </div>

                <div class="flex items-center w-1/2 mt-4">
                    <VaCheckbox v-model="newSubscription.aggregate" label="Aggregate" class="w-full" name="aggregate" />
                </div>
            </div>

            <div class="flex gap-4 w-full">
                <VaInput
                    v-model="newSubscription.url"
                    label="Url"
                    class="w-full"
                    :rules="[validators.required]"
                    name="url"
                />
            </div>

            <VaTextarea v-model="newSubscription.description" label="Notes" class="w-full" name="notes" />

            <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
                <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
                <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
            </div>
        </div>
    </VaForm>
</template>
