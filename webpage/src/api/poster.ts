import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { client } from '../services/api'

export async function getPoster(id: number): Promise<string> {
    try {
        const response = await client.get(`/poster/get/${id}`, {
            responseType: 'blob',
        })
        const imageSrc = URL.createObjectURL(response.data)
        return imageSrc
    } catch (error) {
        console.error('Error fetching poster:', error)
        throw error // Or handle the error appropriately
    }
}
