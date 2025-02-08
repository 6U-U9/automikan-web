export type SubscriptionSource = 'mikan' | 'unknown'

export type Subscription = {
    id: number
    source: SubscriptionSource
    aggregate: boolean
    url: string
    description: string
}
