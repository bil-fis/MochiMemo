import {createRouter, createWebHistory, type Router} from 'vue-router'
import {useConfig} from '../config'
import {buildBuiltinRoutes, buildUserRoutes, getThemePages} from './routeBuilder'

// 先获取配置
const config = useConfig()
let router: Router | null = null

// 创建路由
export async function createAppRouter() {
    if (router) return router
    const {Layout, HomePage, NotFound} = getThemePages()
    const routes = [
        // 首页
        {
            path: '/',
            component: Layout,
            children: [
                {path: '', component: HomePage},
                ...buildUserRoutes(config),
                ...buildBuiltinRoutes(),
            ],
            meta: {type: 'home'},
        },

        // 404
        {
            path: '/:pathMatch(.*)*',
            component: NotFound,
        },
    ]
    router = createRouter({
        history: createWebHistory(import.meta.env.BASE_URL),
        routes,
    })
    const siteTitle = config.title
    router.afterEach((to) => {
        if (to.path === '/') {
            document.title = siteTitle
        } else {
            const pageTitle = to.meta?.title || '页面'
            document.title = `${pageTitle} | ${siteTitle}`
        }
    })
    return router
}

export function getRouter() {
    if (!router) {
        throw new Error("路由未初始化")
    }
    return router
}