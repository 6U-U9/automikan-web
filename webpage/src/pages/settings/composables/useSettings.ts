import { Ref, ref } from 'vue'
import { getConfig, updateConfig } from '../../../api/config'

export const useSettings = () => {
    const isLoading = ref(false)
    const error = ref()

    const config = ref() as Ref<string>

    const fetch = async () => {
        isLoading.value = true
        try {
            config.value = await getConfig()
        } finally {
            isLoading.value = false
        }
    }

    fetch()

    return {
        error,
        isLoading,

        config,

        fetch,

        async update(config: string) {
            isLoading.value = true
            try {
                const response = await updateConfig(config)
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
