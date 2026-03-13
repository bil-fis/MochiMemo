<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { renderMarkdown } from '@/utils/markdown'
import { getreadTime } from "@/utils/readingTime"
import { getArticleBySlug, getPostsOnly, type ArticleItem } from '@/core/article'
import { useConfig } from '@/core/config'
import './css/post.css'

const route = useRoute()
const config = useConfig()

const article = ref<any>(null)
const contentHtml = ref('')
const readingTime = ref<any>(null)
const articlesList = ref<ArticleItem[]>([])
const isListView = computed(() => !route.params.slug)

// 提取摘要（取前 150 个字符）
const extractExcerpt = (content: string, maxLength = 150): string => {
  // 移除 markdown 语法
  const plainText = content
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/`[^`]*`/g, '') // 移除行内代码
    .replace(/!\[.*?\]\(.*?\)/g, '') // 移除图片
    .replace(/\[.*?\]\(.*?\)/g, '') // 移除链接
    .replace(/#{1,6}\s/g, '') // 移除标题
    .replace(/\*\*?\*?/g, '') // 移除粗体斜体
    .replace(/\n+/g, ' ') // 合并换行
    .trim()

  return plainText.length > maxLength
    ? plainText.substring(0, maxLength) + '...'
    : plainText
}

// 获取文章缩略图（从 frontmatter 或使用默认图）
const getThumbnail = (articleItem: ArticleItem): string => {
  const fullArticle = getArticleBySlug(articleItem.slug)
  // 这里可以扩展从 frontmatter 中读取图片
  // 暂时使用默认占位图
  return 'data:image/svg+xml,' + encodeURIComponent(`
    <svg width="400" height="225" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#e5e7eb"/>
      <text x="50%" y="50%" text-anchor="middle" fill="#000" font-size="24">
        ${articleItem.name.substring(0, 10)}
      </text>
    </svg>
  `)
}

// 计算文章阅读时间
const calculateReadingTime = (articleItem: ArticleItem): string => {
  const fullArticle = getArticleBySlug(articleItem.slug)
  if (!fullArticle) return ''
  const html = renderMarkdown(fullArticle.content)
  const time = getreadTime(html)
  return time.text
}

// 获取文章
const loadArticle = async () => {
  const slug = route.params.slug as string

  if (!slug) {
    // 如果没有 slug，显示文章列表（只获取文章，不包括页面）
    articlesList.value = getPostsOnly()
  } else {
    // 根据 slug 加载文章
    const loadedArticle = getArticleBySlug(slug)
    if (loadedArticle) {
      article.value = loadedArticle
    } else {
      article.value = {
        title: '文章未找到',
        content: '抱歉，您访问的文章不存在。'
      }
    }
  }

  // 渲染 markdown 内容
  if (article.value) {
    contentHtml.value = renderMarkdown(article.value.content)
    readingTime.value = getreadTime(contentHtml.value)
  }
}

// 监听路由变化
watch(() => route.params.slug, () => {
  loadArticle()
})

// 组件挂载时加载文章
onMounted(() => {
  loadArticle()
})

// 计算属性
const title = computed(() => article.value?.title || '文章')
const date = computed(() => article.value?.date || '')
const tags = computed(() => article.value?.tags || [])
const category = computed(() => article.value?.category || '')
const author = computed(() => config.author || 'Unknown')

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
</script>

<template>
  <!-- 文章列表视图 -->
  <div v-if="isListView" class="articles-list-view">
    <div class="articles-list-header">
      <h1 class="articles-list-title">所有文章</h1>
      <p class="articles-list-count">共有 {{ articlesList.length }} 篇文章</p>
    </div>

    <div class="articles-grid">
      <router-link
        v-for="articleItem in articlesList"
        :key="articleItem.id"
        :to="`/posts/${articleItem.slug}`"
        class="article-card"
      >
        <!-- 缩略图 -->
        <div class="article-card-thumbnail">
          <img :src="getThumbnail(articleItem)" :alt="articleItem.name" />
        </div>

        <!-- 内容 -->
        <div class="article-card-content">
          <h2 class="article-card-title">{{ articleItem.name }}</h2>
          <p class="article-card-excerpt">
            {{ extractExcerpt(getArticleBySlug(articleItem.slug)?.content || '') }}
          </p>

          <!-- 底部信息 -->
          <div class="article-card-footer">
            <!-- 标签 -->
            <div class="article-card-tags" v-if="articleItem.tags.length > 0">
              <span
                v-for="tag in articleItem.tags.slice(0, 3)"
                :key="tag"
                class="article-card-tag"
              >
                # {{ tag }}
              </span>
            </div>

            <!-- 分类和时间 -->
            <div class="article-card-meta">
              <span class="article-card-category">
                <span class="i-mingcute:folder-line"></span>
                {{ articleItem.category }}
              </span>
              <span class="article-card-date">
                <span class="i-mingcute:calendar-line"></span>
                {{ formatDate(articleItem.date) }}
              </span>
              <span class="article-card-reading-time">
                <span class="i-mingcute:time-line"></span>
                {{ calculateReadingTime(articleItem) }}
              </span>
            </div>
          </div>
        </div>
      </router-link>
    </div>
  </div>

  <!-- 文章详情视图 -->
  <div v-else-if="article" class="post-detail">
    <!-- 标题区域 -->
    <div class="post-title">
      <div class="post-breadcrumb" v-if="category">
        <div class="i-mingcute:list-check-fill"></div>
        <router-link :to="`/categories/${category}`" class="post-breadcrumb-link">{{ category }}</router-link>
        <span class="post-breadcrumb-separator">></span>
        <span class="post-breadcrumb-link">{{ title }}</span>
      </div>
      <h1 class="post-content-title">{{ title }}</h1>
    </div>

    <!-- 元信息 -->
    <div class="post-meta" v-if="date">
      <div class="post-meta-item">
        <span class="post-meta-icon i-mingcute:user-3-line"></span>
        <span>{{ author }}</span>
      </div>
      <div class="post-meta-item">
        <span class="post-meta-icon i-mingcute:calendar-line"></span>
        <span>{{ formatDate(date) }}</span>
      </div>
      <div class="post-meta-item" v-if="readingTime">
        <span class="post-meta-icon i-mingcute:time-line"></span>
        <span>{{ readingTime.textLong }}</span>
      </div>
    </div>

    <!-- 标签 -->
    <div class="post-tags" v-if="tags.length > 0">
      <router-link
        v-for="tag in tags"
        :key="tag"
        :to="`/tags/${tag}`"
        class="post-tag"
      >
        # {{ tag }}
      </router-link>
    </div>

    <!-- 分割线 -->
    <div class="post-divider"></div>

    <!-- 内容 -->
    <div class="post-content" v-html="contentHtml"></div>
  </div>

  <!-- 加载中 -->
  <div v-else class="post-detail">
    <div class="post-title">
      <h1 class="post-content-title">加载中...</h1>
    </div>
  </div>
</template>

<style scoped>
/* 文章列表视图 */
.articles-list-view {
  padding: 2rem 0;
}

.articles-list-header {
  margin-bottom: 2rem;
}

.articles-list-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #000;
  margin: 0 0 0.5rem 0;
}

.articles-list-count {
  font-size: 1.125rem;
  color: #000;
  margin: 0;
}

/* 文章网格 */
.articles-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* 文章卡片 */
.article-card {
  display: flex;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
  text-decoration: none;
  gap: 0;
}

.article-card:hover {
  transform: translateX(8px);
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(0, 0, 0, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

/* 卡片缩略图 */
.article-card-thumbnail {
  width: 280px;
  min-width: 280px;
  height: 180px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.article-card-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-card:hover .article-card-thumbnail img {
  transform: scale(1.05);
}

/* 卡片内容 */
.article-card-content {
  padding: 1.75rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.article-card-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #000;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.article-card-excerpt {
  font-size: 1rem;
  color: #000;
  margin: 0 0 1.25rem 0;
  line-height: 1.6;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 卡片底部 */
.article-card-footer {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.article-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.article-card-tag {
  font-size: 0.875rem;
  color: #000;
  background: rgba(0, 0, 0, 0.05);
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.article-card:hover .article-card-tag {
  background: rgba(0, 0, 0, 0.1);
  color: #000;
}

.article-card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.875rem;
  color: #000;
}

.article-card-meta span {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.article-card-meta span::before {
  font-size: 1rem;
}

/* 文章详情视图 */
.post-detail {
  padding: 1.5rem 0;
}

.post-title {
  margin-bottom: 0.75rem;
  text-align: center;
}

.post-content-title {
  font-size: 3rem;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.95);
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
  text-align: center !important;
}

.post-breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 0.5rem;
}

.post-breadcrumb-link {
  color: rgba(0, 0, 0, 0.7);
  text-decoration: none;
  transition: color 0.2s ease;
}

.post-breadcrumb-link:hover {
  color: rgba(0, 0, 0, 1);
}

.post-breadcrumb-separator {
  color: rgba(0, 0, 0, 0.4);
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.75rem;
  justify-content: center;
}

.post-meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: rgba(0, 0, 0, 0.7);
}

.post-meta-icon {
  font-size: 1.125rem;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  justify-content: center;
}

.post-tag {
  font-size: 1rem;
  color: rgba(0, 0, 0, 0.8);
  background: rgba(0, 0, 0, 0.05);
  padding: 0.375rem 0.875rem;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.post-tag:hover {
  background: rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.95);
}

.post-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
  margin: 1rem 0;
}

.post-content {
  font-size: 1.125rem;
  line-height: 1.8;
  color: rgba(0, 0, 0, 0.8);
}

/* 代码块样式 */
:deep() {
  pre.line-numbers {
    font-size: 1.2rem;
    line-height: 0.6rem;
    position: relative !important;
    display: block !important;
    margin: 1em 0 !important;
    padding: 0.8em 0.8em 0.8em 2.2em !important;
    border-radius: 0.5em !important;
    background: #f5f5f5 !important;
    overflow: auto !important;
    counter-reset: line !important;
    font-family: monospace !important;
  }

  pre.line-numbers::before {
    font-size: 1.05rem;
    line-height: 0.6rem;
    content: attr(data-language) !important;
    position: absolute !important;
    top: 0 !important;
    right: 0.5em !important;
    color: #333 !important;
    background: rgba(0, 0, 0, 0.1) !important;
    padding: 0.2em 0.5em !important;
    border-bottom-left-radius: 0.4em !important;
    border-bottom-right-radius: 0.4em !important;
    user-select: none !important;
  }

  pre.line-numbers .line {
    display: block !important;
    counter-increment: line !important;
    position: relative !important;
    color: #333 !important;
    line-height: 0.6rem !important;
  }

  pre.line-numbers .line::before {
    content: counter(line) !important;
    position: absolute !important;
    left: -2em !important;
    width: 1.5em !important;
    text-align: right !important;
    color: #999 !important;
    border-right: 1px solid #ddd !important;
    padding-right: 0.3em !important;
    font-size: 0.9em !important;
    line-height: 0.6rem !important;
  }

  pre.line-numbers code {
    display: block !important;
    background: transparent !important;
    color: inherit !important;
    font-size: 1em !important;
    line-height: 0.6rem !important;
  }

  h1, h2, h3, h4, h5, h6 {
    color: rgba(0, 0, 0, 0.95);
    margin: 1.5em 0 0.75em 0;
    font-weight: 600;
  }

  h1 { font-size: 2em; }
  h2 { font-size: 1.75em; }
  h3 { font-size: 1.5em; }
  h4 { font-size: 1.25em; }
  h5 { font-size: 1.125em; }
  h6 { font-size: 1em; }

  p {
    margin: 0.75em 0;
  }

  a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  a:hover {
    color: rgba(255, 255, 255, 1);
  }

  ul, ol {
    margin: 0.75em 0;
    padding-left: 1.5em;
  }

  li {
    margin: 0.375em 0;
  }

  blockquote {
    margin: 1em 0;
    padding: 0.75em 1.25em;
    background: rgba(255, 255, 255, 0.05);
    border-left: 4px solid rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.8);
  }

  code {
    font-family: monospace;
    background: rgba(255, 255, 255, 0.1);
    padding: 0.125em 0.375em;
    border-radius: 0.25em;
    font-size: 0.875em;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .article-card {
    flex-direction: column;
  }

  .article-card-thumbnail {
    width: 100%;
    min-width: 0;
    height: 200px;
  }

  .articles-list-title {
    font-size: 2rem;
  }

  .articles-list-count {
    font-size: 1rem;
  }

  .article-card-title {
    font-size: 1.5rem;
  }

  .article-card-excerpt {
    font-size: 0.9375rem;
  }

  .post-content-title {
    font-size: 2.25rem;
  }
}
</style>