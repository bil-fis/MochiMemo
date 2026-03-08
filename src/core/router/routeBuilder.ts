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

    return userRoutes.map(routeDef => {
        const meta: RouteMeta = {
            type: 'custom',
            title: routeDef.name||'自定义页面',
        }

        if ('file' in routeDef) {
            meta.source = 'local'
            meta.file = routeDef.file
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
    return [
        {
            path: '/posts/:slug?',
            component: themePages.PostsPage,
            meta: { type: 'post',title:'文章' } as RouteMeta,
        },
        {
            path: '/categories/:slug?',
            component: themePages.CategoryPage,
            meta: { type: 'category',title:'分类' } as RouteMeta,
        },
        {
            path: '/tags/:slug?',
            component: themePages.TagPage,
            meta: { type: 'tag',title:'标签' } as RouteMeta,
        },
    ]
}