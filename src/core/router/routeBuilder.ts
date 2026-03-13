import type {RouteRecordRaw} from "vue-router";
import type {SiteConfig} from "../config";
import type {RouteMeta} from "./types"

export interface ThemePages{
    CustomPage: any,
    PostsPage: any,
    CategoryPage: any,
    TagPage: any,
    HomePage: any,
    NotFound: any,
    Layout: any,
}

let themePages: ThemePages
export function setThemePages(pages:ThemePages){
    themePages = pages;
}

export function getThemePages(){
    return themePages;
}

/**
 * 从 mochi.config.yml 的路由配置
 * 生成 Vue Router 路由列表
 */
export function buildUserRoutes(config: SiteConfig): RouteRecordRaw[] {
    const userRoutes = config.routes || []
    const pagesDir = config.content?.local?.pagesDir || 'contents/pages'

    return userRoutes.map(routeDef => {
        const meta: RouteMeta = {
            type: 'custom',
            title: routeDef.name || '自定义页面',
        }

        if ('file' in routeDef) {
            meta.source = 'local'

            // 处理文件路径
            const file = routeDef.file
            if (file.startsWith('pages/')) {
                // 如果以 pages/ 开头，替换为配置中的 pagesDir
                const relativePath = file.replace(/^pages\//, '')
                meta.file = `${pagesDir}/${relativePath}`
            } else {
                // 否则使用项目根目录
                meta.file = file
            }
        }

        if ('issue' in routeDef) {
            meta.source = 'git'
            meta.issue = routeDef.issue
        }

        return {
            path: routeDef.path,
            component: themePages.CustomPage,
            meta,
        }
    })
}

/**
 * 内置路由：文章、分类、标签等
 */
export function buildBuiltinRoutes(): RouteRecordRaw[] {
    // 动态导入文章模块（确保在客户端运行时加载）
    // 这个导入由 Vite 插件处理，返回所有文章数据
    let articles: any[] = []
    try {
        const articlesModule = import('virtual:mochimemo-articles')
        // 注意：这里不能直接使用 await，因为这是构建时执行的
        // 实际的文章数据会在客户端通过 initArticles 初始化
    } catch (e) {
        console.warn('Failed to load articles module:', e)
    }

    return [
        {
            path: '/posts/:slug?',
            component: themePages.PostsPage,
            meta: { type: 'post', title: '文章' } as RouteMeta,
        },
        {
            path: '/categories/:slug?',
            component: themePages.CategoryPage,
            meta: { type: 'category', title: '分类' } as RouteMeta,
        },
        {
            path: '/tags/:slug?',
            component: themePages.TagPage,
            meta: { type: 'tag', title: '标签' } as RouteMeta,
        },
    ]
}