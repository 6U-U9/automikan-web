export type Anime = {
    id: number
    mikan_id?: number
    title: string
    alternative_title: string
    season: number
    poster_id: number
    poster_blob_url?: string
    air_time: string

    fliter_rule: string
    naming_format: string
}

export type AnimeVersion = {
    id: number
    anime_id: number
    mikan_id?: number
    provider: string
    audio_coding: string
    video_coding: string
    resolution: string
    source: string
    subtitle: string
}

export type Episode = {
    id: number
    anime_id: number
    index: number
    special: string
    title: string
    alternative_title: string
}

export type EmptyAnime = Omit<Anime, 'id' | 'poster_id' | 'poster_blob_url'>
