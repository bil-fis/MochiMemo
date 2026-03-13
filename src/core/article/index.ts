import type { Article, ArticleItem } from './types'
import { parseFrontmatter, generateTitleFromFilename, formatDate, generateId, generateSlug } from './frontmatter'

/**
 * 文章数据存储（运行时）
 */
let articlesStore: Map<string, Article> = new Map()
let articlesBySlug: Map<string, Article> = new Map()
let articleItemsCache: ArticleItem[] | null = null

/**
 * 初始化文章存储（由 Vite 插件调用）
 */
export function initArticles(articles: Article[]): void {
  articlesStore = new Map()
  articlesBySlug = new Map()
  articleItemsCache = null

  for (const article of articles) {
    articlesStore.set(article.id, article)
    articlesBySlug.set(article.slug, article)
  }
}

/**
 * 添加单篇文章
 */
export function addArticle(article: Article): void {
  articlesStore.set(article.id, article)
  articlesBySlug.set(article.slug, article)
  articleItemsCache = null
}

/**
 * 根据 ID 获取完整文章
 */
export function getArticleById(id: string): Article | undefined {
  return articlesStore.get(id)
}

/**
 * 根据 slug 获取完整文章
 */
export function getArticleBySlug(slug: string): Article | undefined {
  return articlesBySlug.get(slug)
}

/**
 * 根据 title 获取原始 markdown 文本
 */
export function getRawMarkdown(title: string): string | undefined {
  // 根据 title 查找文章
  for (const article of articlesStore.values()) {
    if (article.name === title) {
      return article.raw
    }
  }
  return undefined
}

/**
 * 获取所有文章列表项（不包含完整内容）
 */
export function getAllArticles(): ArticleItem[] {
  if (articleItemsCache) {
    return articleItemsCache
  }

  const items: ArticleItem[] = []
  for (const article of articlesStore.values()) {
    items.push({
      id: article.id,
      name: article.title,
      date: article.date,
      tags: article.tags,
      category: article.category,
      slug: article.slug,
      type: article.type
    })
  }

  // 按日期降序排序
  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  articleItemsCache = items
  return items
}

/**
 * 只获取文章列表（不包括页面）
 */
export function getPostsOnly(): ArticleItem[] {
  const allArticles = getAllArticles()
  return allArticles.filter(item => item.type === 'post')
}

/**
 * 只获取页面列表（不包括文章）
 */
export function getPagesOnly(): ArticleItem[] {
  const allArticles = getAllArticles()
  return allArticles.filter(item => item.type === 'page')
}

/**
 * 根据日期获取文章列表（只返回文章，不包括页面）
 * @param date 日期字符串，格式：YYYY-MM-DD 或 YYYY-MM-DDTHH:mm:ss.sssZ
 */
export function getArticlesByDate(date: string): ArticleItem[] {
  const items = getPostsOnly()
  return items.filter(item => {
    const itemDate = item.date.split('T')[0] // 只比较日期部分
    return itemDate === date || item.date.startsWith(date)
  })
}

/**
 * 根据标签获取文章列表（只返回文章，不包括页面）
 */
export function getArticlesByTag(tag: string): ArticleItem[] {
  const items = getPostsOnly()
  return items.filter(item => item.tags.includes(tag))
}

/**
 * 根据分类获取文章列表（只返回文章，不包括页面）
 */
export function getArticlesByCategory(category: string): ArticleItem[] {
  const items = getPostsOnly()
  return items.filter(item => item.category === category)
}

/**
 * 获取所有唯一标签（只从文章中获取，不包括页面）
 */
export function getAllTags(): string[] {
  const tagSet = new Set<string>()
  for (const article of articlesStore.values()) {
    if (article.type === 'post') {
      article.tags.forEach(tag => tagSet.add(tag))
    }
  }
  return Array.from(tagSet).sort()
}

/**
 * 获取所有唯一分类（只从文章中获取，不包括页面）
 */
export function getAllCategories(): string[] {
  const categorySet = new Set<string>()
  for (const article of articlesStore.values()) {
    if (article.type === 'post') {
      categorySet.add(article.category)
    }
  }
  return Array.from(categorySet).sort()
}

/**
 * 搜索文章（按标题，只搜索文章，不包括页面）
 */
export function searchArticles(query: string): ArticleItem[] {
  const items = getPostsOnly()
  const lowerQuery = query.toLowerCase()
  return items.filter(item => item.name.toLowerCase().includes(lowerQuery))
}

/**
 * 获取文章总数（只计算文章，不包括页面）
 */
export function getArticleCount(): number {
  let count = 0
  for (const article of articlesStore.values()) {
    if (article.type === 'post') {
      count++
    }
  }
  return count
}

/**
 * 清空文章存储
 */
export function clearArticles(): void {
  articlesStore.clear()
  articlesBySlug.clear()
  articleItemsCache = null
}

/**
 * 内部方法：从文件内容创建文章对象
 */
export function createArticleFromFile(
  file: string,
  content: string,
  mtime: number
): Article {
  const { meta, content: markdownContent } = parseFrontmatter(content)

  // 如果 frontmatter 中没有 title，使用文件名
  const title = meta.title || generateTitleFromFilename(file)

  // 如果 frontmatter 中没有 date，使用文件修改时间
  const date = meta.date || formatDate(mtime)

  // 生成 slug（如果 title 为空，使用文件名）
  const slug = title ? generateSlug(title) : generateSlug(file)

  // 生成 ID
  const id = generateId(file)

  return {
    id,
    slug,
    title,
    date,
    tags: meta.tags,
    category: meta.category,
    content: markdownContent,
    raw: content,
    file
  }
}