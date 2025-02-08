import axios, { AxiosInstance } from 'axios'
import { useAuthStore } from '../stores/authentication'

const baseURL = '/api'
export const client: AxiosInstance = axios.create({
    baseURL: baseURL,
})

client.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore()
        const token = authStore.token // 获取存储在 Pinia 中的 token

        // 如果 token 存在，添加到请求头
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        // 处理请求错误
        return Promise.reject(error)
    },
)

// 添加响应拦截器（可选，根据需求）
client.interceptors.response.use(
    (response) => {
        // 如果需要在响应中处理数据，可以在这里做
        return response
    },
    (error) => {
        // 如果响应中出现错误，比如 token 过期，可以在这里做处理
        if (error.response && error.response.status === 401) {
            // token 过期时，执行登出操作
            const authStore = useAuthStore()
            authStore.logout()
            // 可以选择跳转到登录页
        }
        return Promise.reject(error)
    },
)

export default {
    client: client,
}
