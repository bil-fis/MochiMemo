import yaml from 'js-yaml'
import type { ArticleMeta } from './types'

/**
 * 解析 frontmatter
 * 支持 YAML 格式：--- 之间是 frontmatter，之后是 markdown 内容
 */
export function parseFrontmatter(content: string): { meta: ArticleMeta; content: string } {
  // 匹配 YAML frontmatter: ---\n...\n---
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)

  if (match) {
    try {
      const meta = yaml.load(match[1]) as any
      const markdownContent = match[2]

      return {
        meta: normalizeMeta(meta),
        content: markdownContent
      }
    } catch (error) {
      console.error('Failed to parse frontmatter:', error)
      return {
        meta: normalizeMeta({}),
        content
      }
    }
  }

  // 没有 frontmatter，返回原始内容
  return {
    meta: normalizeMeta({}),
    content
  }
}

/**
 * 标准化元数据，填充默认值
 */
function normalizeMeta(meta: any): ArticleMeta {
  return {
    title: meta.title || '',
    date: meta.date || '',
    tags: Array.isArray(meta.tags) ? meta.tags : (meta.tags ? [meta.tags] : []),
    category: meta.category || '未分类'
  }
}

/**
 * 从文件名生成默认标题
 */
export function generateTitleFromFilename(filename: string): string {
  // 移除 .md 扩展名
  const name = filename.replace(/\.md$/, '')
  // 移除路径，只保留文件名
  const basename = name.split('/').pop() || name
  return basename
}

/**
 * 格式化日期为 ISO 字符串
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toISOString()
}

/**
 * 生成唯一 ID
 */
export function generateId(file: string): string {
  // 使用文件路径作为基础，去掉扩展名和特殊字符
  const id = file
    .replace(/\.(md|markdown)$/i, '')
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return id
}

/**
 * 生成 slug（用于路由）
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}