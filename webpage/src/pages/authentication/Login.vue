<template>
    <VaForm ref="form" @submit.prevent="submit">
        <h1 class="font-semibold text-4xl mb-4">Log in</h1>
        <VaInput
            v-model="formData.username"
            :rules="[validators.required]"
            class="mb-4"
            label="User Name"
            type="text"
        />
        <VaValue v-slot="isPasswordVisible" :default-value="false">
            <VaInput
                v-model="formData.password"
                :rules="[validators.required]"
                :type="isPasswordVisible.value ? 'text' : 'password'"
                class="mb-4"
                label="Password"
                @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value"
            >
                <template #appendInner>
                    <VaIcon
                        :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'"
                        class="cursor-pointer"
                        color="secondary"
                    />
                </template>
            </VaInput>
        </VaValue>

        <div
            v-if="false"
            class="auth-layout__options flex flex-col sm:flex-row items-start sm:items-center justify-between"
        >
            <VaCheckbox v-model="formData.keepLoggedIn" class="mb-2 sm:mb-0" label="Keep me signed in on this device" />
            <RouterLink :to="{ name: 'login' }" class="mt-2 sm:mt-0 sm:ml-1 font-semibold text-primary">
                Forgot password?
            </RouterLink>
        </div>

        <div class="flex justify-center mt-4">
            <VaButton class="w-full" @click="submit"> Login</VaButton>
        </div>
    </VaForm>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useForm, useToast } from 'vuestic-ui'
import { validators } from '../../services/utils'
import { useAuthStore } from '../../stores/authentication'

const { validate } = useForm('form')
const { init } = useToast()

const formData = reactive({
    username: '',
    password: '',
    keepLoggedIn: false,
})

const authStore = useAuthStore()

const submit = () => {
    if (validate()) {
        authStore.login(formData.username, formData.password)
        init({ message: "You've successfully logged in", color: 'success' })
    }
}
</script>
