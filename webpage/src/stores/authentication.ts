import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '../router'
import api from '../services/api'

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(localStorage.getItem('access_token'))
    const user = ref<string | null>(localStorage.getItem('user_name'))
    const expireTime = ref<string | null>(localStorage.getItem('expire_time'))

    // 5 minutes before token expires
    const isTokenExpiringSoon = (): boolean => {
        if (!expireTime.value) return true
        const currentTime = Math.floor(Date.now() / 1000)
        const time = parseInt(expireTime.value)
        return time - currentTime < 300
    }

    const login = async (username: string, password: string): Promise<void> => {
        try {
            const params = new URLSearchParams()
            params.append('username', username)
            params.append('password', password)

            const response = await api.client.post('/user/login', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                validateStatus: function (status) {
                    return status === 200
                },
            })

            user.value = username
            token.value = response.data.access_token
            expireTime.value = response.data.expire_time
            if (token.value) {
                localStorage.setItem('access_token', token.value)
            }
            if (expireTime.value) {
                localStorage.setItem('expire_time', expireTime.value)
            }
            if (user.value) {
                localStorage.setItem('user_name', user.value)
            }
            // api.client.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
            router.push({ name: 'home' })
        } catch (error: any) {
            console.error('登录失败:', error)
            throw error
        }
    }

    // 登出方法
    const logout = async (): Promise<void> => {
        token.value = null
        user.value = null
        localStorage.removeItem('access_token')
        // delete api.client.defaults.headers.common['Authorization'];
        router.push({ name: 'login' })
    }

    // 获取当前用户信息
    const fetchUser = async (): Promise<void> => {
        if (!token.value) return
        try {
            const response = await api.client.get('/user/me')
            user.value = response.data
        } catch (error: any) {
            console.error('获取用户信息失败:', error)
            await logout()
        }
    }

    // 刷新 Token 方法（假设后端有刷新 Token 的 API）
    const refreshToken = async (): Promise<void> => {
        try {
            const response = await api.client.post('/user/refresh_token', null, {
                validateStatus: function (status) {
                    return status === 200
                },
            })
            token.value = response.data.access_token
            expireTime.value = response.data.expire_time
            if (token.value) {
                localStorage.setItem('access_token', token.value)
            }
            if (expireTime.value) {
                localStorage.setItem('expire_time', expireTime.value)
            }
            // api.client.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
        } catch (error) {
            console.error('刷新 Token 失败:', error)
            await logout()
        }
    }

    return {
        token,
        user,
        login,
        logout,
        fetchUser,
        isTokenExpiringSoon,
        refreshToken,
    }
})
