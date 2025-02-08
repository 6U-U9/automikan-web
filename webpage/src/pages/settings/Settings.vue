<template>
    <div class="flex flex-col space-y-6 md:space-y-4">
        <h1 class="page-title">Settings</h1>
        <VaTextarea v-model="config" autosize />
        <VaButton @click="saveConfig">Save</VaButton>
    </div>
</template>
<script lang="ts" setup>
import { useSettings } from './composables/useSettings'
import { useToast } from 'vuestic-ui'
const { init: notify } = useToast()
const { config, update, error } = useSettings()
const saveConfig = async () => {
    await update(config.value)
    if (!error.value) {
        notify({
            message: `config has been updated, some config will not take effect until the app is restarted`,
            color: 'success',
        })
    }
}
</script>
