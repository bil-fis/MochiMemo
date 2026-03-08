export interface SiteConfig {
    title: string
    description?: string
    author?: string
    logo?: string
    content: {
        local: {
            enabled: boolean
            postsDir: string
            pagesDir: string
        }
        git: {
            enabled: boolean,
            platform: 'github' | 'gitee' | 'gitlab'
            owner: string
            repo: string
            labels: {
                post: string
                page: string
            }
        }
    }
    routes?: Array<
        | {
        path: string
        file: string
        name?: string
    }
        | {
        path: string
        name?: string
        issue: {
            platform?: 'github' | 'gitee' | 'gitlab'
            owner?: string
            repo?: string
            number?: number
            slug?: string
            label?: string
        }
    }
    >
    theme: string
    plugins?: Array<{
        name: string
        enabled: boolean
        options?: Record<string, any>
    }>
    themeConfig?: Record<string, any>
}