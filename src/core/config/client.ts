import type {SiteConfig} from "./schema"

declare const __BLOG_CONFIG__: SiteConfig

export const useConfig = (): SiteConfig =>{
    return __BLOG_CONFIG__
}

export const config = __BLOG_CONFIG__