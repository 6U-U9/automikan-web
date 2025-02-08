import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'
import { useAuthStore } from '../stores/authentication'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/:pathMatch(.*)*',
        redirect: { name: 'home' },
    },
    {
        name: 'home',
        path: '/',
        component: AppLayout,
        redirect: { name: 'animes' },
        children: [
            {
                name: 'animes',
                path: 'animes',
                component: () => import('../pages/animes/AnimesPage.vue'),
            },
            {
                name: 'subscriptions',
                path: 'subscriptions',
                component: () => import('../pages/subscriptions/SubscriptionsPage.vue'),
            },
            {
                name: 'settings',
                path: 'settings',
                component: () => import('../pages/settings/Settings.vue'),
            },
        ],
    },
    {
        path: '/login',
        component: AuthLayout,
        children: [
            {
                name: 'login',
                path: '',
                component: () => import('../pages/authentication/Login.vue'),
            },
        ],
    },
    {
        name: '404',
        path: '/404',
        component: () => import('../pages/404.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
        // For some reason using documentation example doesn't scroll on page navigation.
        if (to.hash) {
            return { el: to.hash, behavior: 'smooth' }
        } else {
            window.scrollTo(0, 0)
        }
    },
    routes,
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    const isAuthenticated = !!authStore.token // 判断是否有 token
    const isTokenExpiringSoon = authStore.isTokenExpiringSoon() // 检查 token 是否即将过期

    // 如果 token 即将过期，进行登出并重定向到登录页
    if (isAuthenticated && isTokenExpiringSoon) {
        authStore.logout() // 触发登出
        return next({ name: 'login' })
    }

    // 如果目标路由是保护路由且用户未登录，则重定向到登录页
    if (to.name !== 'login' && !isAuthenticated) {
        return next({ name: 'login' })
    }

    // 如果目标是登录页并且已经登录，则跳转到首页
    if (to.name === 'login' && isAuthenticated) {
        return next({ name: 'home' })
    }

    next() // 继续导航
})

export default router
