/**
 * 文章元数据（从 frontmatter 解析或默认生成）
 */
export interface ArticleMeta {
  title: string
  date: string
  tags: string[]
  category: string
}

/**
 * 完整的文章数据
 */
export interface Article extends ArticleMeta {
  id: string
  slug: string
  content: string
  raw: string
  file: string
  type: ArticleType
}

/**
 * 文章列表项（不包含完整内容）
 */
export interface ArticleItem {
  id: string
  name: string
  date: string
  tags: string[]
  category: string
  slug: string
  type: ArticleType
}

/**
 * 文章来源类型
 */
export type ArticleSource = 'local' | 'git'

/**
 * 文章类型
 */
export type ArticleType = 'post' | 'page'