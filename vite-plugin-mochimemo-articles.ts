import fs from 'fs'
import path from 'path'
import type { Plugin } from 'vite'
import yaml from 'js-yaml'

interface SiteConfig {
  content?: {
    local?: {
      enabled?: boolean | string
      postsDir?: string
      pagesDir?: string
    }
  }
}

/**
 * Vite 插件：在构建时加载所有本地 markdown 文件
 */
export default function mochimemoArticlesPlugin(config: SiteConfig): Plugin {
  const postsDir = config.content?.local?.postsDir || 'contents/posts'
  const pagesDir = config.content?.local?.pagesDir || 'contents/pages'
  const enabled = config.content?.local?.enabled

  // 如果本地内容未启用，直接返回空插件
  if (!enabled || enabled === false || enabled === '') {
    return {
      name: 'mochimemo-articles',
      resolveId(id) {
        if (id === 'virtual:mochimemo-articles') {
          return '\0virtual:mochimemo-articles'
        }
      },
      load(id) {
        if (id === '\0virtual:mochimemo-articles') {
          return `export const articles = []`
        }
      }
    }
  }

  // 存储所有文章数据
  const articlesData: any[] = []

  return {
    name: 'mochimemo-articles',

    // 在构建开始时加载所有 markdown 文件
    buildStart() {
      loadArticlesFromDirectory(postsDir, 'post')
      loadArticlesFromDirectory(pagesDir, 'page')
    },

    // 解析虚拟模块 ID
    resolveId(id) {
      if (id === 'virtual:mochimemo-articles') {
        return '\0virtual:mochimemo-articles'
      }
    },

    // 加载虚拟模块内容
    load(id) {
      if (id === '\0virtual:mochimemo-articles') {
        // 生成包含所有文章的代码
        const articlesCode = JSON.stringify(articlesData, null, 2)
        return `
import { initArticles } from '@/core/article'

export const articles = ${articlesCode}

// 自动初始化文章存储
initArticles(articles)
`
      }
    },

    // 处理 HMR（开发环境）
    handleHotUpdate({ file, server }) {
      // 检查是否是 markdown 文件
      if (file.endsWith('.md')) {
        // 检查是否在 postsDir 或 pagesDir 中
        const relativePath = path.relative(process.cwd(), file)
        const isInPosts = relativePath.startsWith(postsDir)
        const isInPages = relativePath.startsWith(pagesDir)

        if (isInPosts || isInPages) {
          // 重新加载文章
          articlesData.length = 0
          loadArticlesFromDirectory(postsDir, 'post')
          loadArticlesFromDirectory(pagesDir, 'page')

          // 通知客户端更新
          const module = server.moduleGraph.getModuleById('\0virtual:mochimemo-articles')
          if (module) {
            server.reloadModule(module)
          }
        }
      }
    }
  }

  /**
   * 从目录加载所有 markdown 文件
   */
  function loadArticlesFromDirectory(dir: string, type: 'post' | 'page') {
    const fullPath = path.resolve(process.cwd(), dir)

    if (!fs.existsSync(fullPath)) {
      console.warn(`Directory not found: ${fullPath}`)
      return
    }

    const files = getAllMarkdownFiles(fullPath, dir)

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf-8')
        const stats = fs.statSync(file)
        const article = createArticleFromFile(file, content, stats.mtimeMs, type, dir)
        articlesData.push(article)
      } catch (error) {
        console.error(`Failed to load article: ${file}`, error)
      }
    }

    console.log(`Loaded ${files.length} ${type}(s) from ${dir}`)
  }

  /**
   * 递归获取目录下所有 markdown 文件
   */
  function getAllMarkdownFiles(dir: string, baseDir: string): string[] {
    const files: string[] = []
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        // 递归处理子目录
        files.push(...getAllMarkdownFiles(fullPath, baseDir))
      } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.markdown'))) {
        files.push(fullPath)
      }
    }

    return files
  }

  /**
   * 从文件内容创建文章对象
   */
  function createArticleFromFile(
    file: string,
    content: string,
    mtime: number,
    type: 'post' | 'page',
    baseDir: string
  ) {
    const { meta, content: markdownContent } = parseFrontmatter(content)

    // 计算相对于 baseDir 的路径
    const relativePath = path.relative(path.resolve(process.cwd(), baseDir), file)

    // 如果 frontmatter 中没有 title，使用文件名
    const title = meta.title || generateTitleFromFilename(relativePath)

    // 如果 frontmatter 中没有 date，使用文件修改时间
    const date = meta.date || formatDate(mtime)

    // 生成 slug
    const slug = title ? generateSlug(title) : generateSlug(relativePath)

    // 生成 ID
    const id = generateId(relativePath)

    return {
      id,
      slug,
      title,
      date,
      tags: meta.tags,
      category: meta.category,
      content: markdownContent,
      raw: content,
      file: relativePath,
      type
    }
  }

  /**
   * 解析 frontmatter
   */
  function parseFrontmatter(content: string): { meta: any; content: string } {
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

    return {
      meta: normalizeMeta({}),
      content
    }
  }

  /**
   * 标准化元数据
   */
  function normalizeMeta(meta: any): any {
    return {
      title: meta.title || '',
      date: meta.date || '',
      tags: Array.isArray(meta.tags) ? meta.tags : (meta.tags ? [meta.tags] : []),
      category: meta.category || '未分类'
    }
  }

  /**
   * 从文件名生成标题
   */
  function generateTitleFromFilename(filename: string): string {
    const name = filename.replace(/\.(md|markdown)$/i, '')
    const basename = name.split(path.sep).pop() || name
    return basename
  }

  /**
   * 格式化日期
   */
  function formatDate(timestamp: number): string {
    return new Date(timestamp).toISOString()
  }

  /**
   * 生成唯一 ID
   */
  function generateId(file: string): string {
    const id = file
      .replace(/\.(md|markdown)$/i, '')
      .replace(/[^a-zA-Z0-9\u4e00-\u9fa5_-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    return id
  }

  /**
   * 生成 slug
   */
  function generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }
}