import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { Subscription } from '../pages/subscriptions/types'
import { client } from '../services/api'

export async function listSubscriptions(): Promise<Subscription[]> {
    try {
        const response: AxiosResponse<Subscription[]> = await client.get('/subscription/list')
        const subscriptions: Subscription[] = response.data
        return subscriptions
    } catch (error) {
        console.error('Error fetching subscriptions:', error)
        throw error // Or handle the error appropriately
    }
}

export async function addSubscription(item: Subscription): Promise<Subscription> {
    try {
        const response: AxiosResponse<Subscription> = await client.post('/subscription/create', item)
        const subscription: Subscription = response.data
        return subscription
    } catch (error) {
        console.error('Error fetching subscriptions:', error)
        throw error // Or handle the error appropriately
    }
}

export async function deleteSubscription(item: Subscription): Promise<Subscription> {
    try {
        const response: AxiosResponse<Subscription> = await client.post('/subscription/delete', item)
        const subscription: Subscription = response.data
        return subscription
    } catch (error) {
        console.error('Error fetching subscriptions:', error)
        throw error // Or handle the error appropriately
    }
}
