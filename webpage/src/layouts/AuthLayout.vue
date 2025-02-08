<template>
    <VaLayout v-if="breakpoint.lgUp" class="h-screen bg-[var(--va-background-secondary)]">
        <template #left>
            <RouterLink
                class="h-full flex items-center justify-center"
                style="width: 50vw"
                to="/"
                aria-label="Visit homepage"
            >
                <img src="/big-logo.webp" fit="scale-down" class="h-160" />
            </RouterLink>
        </template>
        <template #content>
            <main class="h-full flex items-center justify-center mx-auto max-w-[420px]">
                <RouterView />
            </main>
        </template>
    </VaLayout>

    <VaLayout v-else class="h-screen bg-[var(--va-background-secondary)]">
        <template #content>
            <div class="p-4">
                <main class="h-full flex flex-row items-center justify-start mx-auto max-w-[420px]">
                    <div class="flex flex-col items-start">
                        <RouterLink class="py-4" to="/" aria-label="Visit homepage">
                            <!--<VuesticLogo class="mb-2" start="#0E41C9" disable/>-->
                        </RouterLink>
                        <RouterView />
                    </div>
                </main>
            </div>
        </template>
    </VaLayout>
</template>

<script lang="ts" setup>
import { useBreakpoint } from 'vuestic-ui'

const breakpoint = useBreakpoint()
</script>
