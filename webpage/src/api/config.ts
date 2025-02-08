import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { client } from '../services/api'

export async function getConfig(): Promise<string> {
    try {
        const response: AxiosResponse<string> = await client.get('/config/')
        const config: string = JSON.stringify(response.data, null, 4)
        return config
    } catch (error) {
        console.error('Error fetching config:', error)
        throw error // Or handle the error appropriately
    }
}

export async function updateConfig(item: string): Promise<string> {
    try {
        const response: AxiosResponse<string> = await client.post('/config/', JSON.parse(item))
        const config: string = response.data
        return config
    } catch (error) {
        console.error('Error fetching config:', error)
        throw error // Or handle the error appropriately
    }
}
