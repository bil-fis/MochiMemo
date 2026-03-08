// 页面类型
export type PageType = 'home' | 'post' | 'category' | 'tag' | 'custom'
// 数据源类型
export type PageSourceType = 'local' | 'git'

// 路由携带的元信息
export interface RouteMeta {
    title?: string
    type: PageType
    source?: PageSourceType
    // 本地文件
    file?: string
    // Git Issue
    issue?: {
        platform?: 'github' | 'gitee' | 'gitlab'
        owner?: string
        repo?: string
        number?: number
        slug?: string
        label?: string
    }
}