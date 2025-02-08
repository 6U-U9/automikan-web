export interface INavigationRoute {
    name: string
    displayName: string
    meta: { icon: string }
    children?: INavigationRoute[]
}

export default {
    root: {
        name: '/',
        displayName: 'navigationRoutes.home',
    },
    routes: [
        {
            name: 'animes',
            displayName: 'menu.animes',
            meta: {
                icon: 'video_library',
            },
        },
        {
            name: 'subscriptions',
            displayName: 'menu.subscriptions',
            meta: {
                icon: 'rss_feed',
            },
        },
        {
            name: 'settings',
            displayName: 'menu.settings',
            meta: {
                icon: 'settings',
            },
        },
    ] as INavigationRoute[],
}
