export type SubscriptionSource = 'Mikan' | 'Unknown'

export type Subscription = {
    id: number
    source: SubscriptionSource
    aggregate: boolean
    url: string
    description: string
}
