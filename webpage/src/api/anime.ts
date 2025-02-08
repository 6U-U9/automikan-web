import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { Anime } from '../pages/animes/types'
import { client } from '../services/api'

export async function listAnimes(): Promise<Anime[]> {
    try {
        const response: AxiosResponse<Anime[]> = await client.get('/anime/list')
        const animes: Anime[] = response.data
        return animes
    } catch (error) {
        console.error('Error fetching animes:', error)
        throw error // Or handle the error appropriately
    }
}

export async function updateAnime(item: Anime): Promise<Anime> {
    try {
        const response: AxiosResponse<Anime> = await client.post('/anime/update', item)
        const anime: Anime = response.data
        return anime
    } catch (error) {
        console.error('Error fetching animes:', error)
        throw error // Or handle the error appropriately
    }
}

export async function deleteAnime(item: Anime): Promise<Anime> {
    try {
        const response: AxiosResponse<Anime> = await client.post('/anime/delete', item)
        const anime: Anime = response.data
        return anime
    } catch (error) {
        console.error('Error fetching animes:', error)
        throw error // Or handle the error appropriately
    }
}
