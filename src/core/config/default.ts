import type {SiteConfig} from "./schema.ts"

export const defaultConfig: SiteConfig = {
    title: 'MochiMemo',
    description: 'A cute and lightweight blog system',
    author: 'Unkown',
    logo: '',
    content: {
        local: {
            enabled: true,
            postsDir: 'contents/posts',
            pagesDir: 'contents/pages',
        },
        git: {
            enabled: false,
            platform: 'github',
            owner: '',
            repo: '',
            labels: {
                post: 'post',
                page: 'page'
            },
        },
    },
    routes: [],
    theme: 'default',
    plugins: [],
    themeConfig: {},
}