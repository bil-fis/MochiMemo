<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { renderMarkdown } from '@/utils/markdown'
import { getreadTime } from "@/utils/readingTime"
import { getArticleBySlug, getAllCategories, getArticlesByCategory, type ArticleItem } from '@/core/article'
import { useConfig } from '@/core/config'
import './css/post.css'

const route = useRoute()
const config = useConfig()

const categorySlug = computed(() => route.params.slug as string)
const articlesList = ref<ArticleItem[]>([])
const categoriesConfig = ref<any[]>([])
const isListView = computed(() => !categorySlug.value)

// 获取分类配置
const getCategoriesConfig = () => {
  const themeConfig = config.themeConfig
  const categories = themeConfig?.category || []

  // 获取所有实际使用的分类
  const allCategories = getAllCategories()

  // 合并配置和实际分类
  return allCategories.map(categoryName => {
    const configItem = categories.find((c: any) => c.name === categoryName)
    return {
      name: categoryName,
      thumb: configItem?.thumb || '',
      count: getArticlesByCategory(categoryName).length
    }
  })
}

// 获取分类缩略图
const getThumbnail = (category: any): string => {
  if (category.thumb) {
    return category.thumb
  }
  // 默认占位图
  return 'data:image/svg+xml,' + encodeURIComponent(`
    <svg width="400" height="225" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#e5e7eb"/>
      <text x="50%" y="50%" text-anchor="middle" fill="#000" font-size="24">
        ${category.name}
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

// 加载分类或文章列表
const loadContent = async () => {
  if (!categorySlug.value) {
    // 显示分类列表
    categoriesConfig.value = getCategoriesConfig()
  } else {
    // 显示该分类的文章
    articlesList.value = getArticlesByCategory(categorySlug.value)
  }
}

// 监听路由变化
watch(() => categorySlug.value, () => {
  loadContent()
})

// 组件挂载时加载内容
onMounted(() => {
  loadContent()
})

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
  <!-- 分类列表视图 -->
  <div v-if="isListView" class="categories-list-view">
    <div class="categories-list-header">
      <h1 class="categories-list-title">所有分类</h1>
      <p class="categories-list-count">共有 {{ categoriesConfig.length }} 个分类</p>
    </div>

    <div class="categories-grid">
      <router-link
        v-for="category in categoriesConfig"
        :key="category.name"
        :to="`/categories/${category.name}`"
        class="category-card"
      >
        <!-- 缩略图 -->
        <div class="category-card-thumbnail">
          <img :src="getThumbnail(category)" :alt="category.name" />
        </div>

        <!-- 内容 -->
        <div class="category-card-content">
          <h2 class="category-card-title">{{ category.name }}</h2>
          <p class="category-card-count">{{ category.count }} 篇文章</p>
        </div>
      </router-link>
    </div>
  </div>

  <!-- 分类文章列表视图 -->
  <div v-else class="category-articles-view">
    <div class="category-articles-header">
      <h1 class="category-articles-title">{{ categorySlug }}</h1>
      <p class="category-articles-count">共有 {{ articlesList.length }} 篇文章</p>
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
          <img :src="getThumbnail({ name: articleItem.name })" :alt="articleItem.name" />
        </div>

        <!-- 内容 -->
        <div class="article-card-content">
          <h2 class="article-card-title">{{ articleItem.name }}</h2>
          <p class="article-card-excerpt">
            {{ articleItem.name }}
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
</template>

<style scoped>
/* 分类列表视图 */
.categories-list-view {
  padding: 2rem 0;
}

.categories-list-header {
  margin-bottom: 2rem;
}

.categories-list-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #000;
  margin: 0 0 0.5rem 0;
}

.categories-list-count {
  font-size: 1.125rem;
  color: #000;
  margin: 0;
}

/* 分类网格 */
.categories-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* 分类卡片 */
.category-card {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
  text-decoration: none;
  gap: 0;
}

.category-card:hover {
  transform: translateX(8px);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

/* 分类卡片缩略图 */
.category-card-thumbnail {
  width: 280px;
  min-width: 280px;
  height: 180px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.category-card-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.category-card:hover .category-card-thumbnail img {
  transform: scale(1.05);
}

/* 分类卡片内容 */
.category-card-content {
  padding: 1.75rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.category-card-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #000;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.category-card-count {
  font-size: 1rem;
  color: #000;
  margin: 0;
}

/* 分类文章列表视图 */
.category-articles-view {
  padding: 2rem 0;
}

.category-articles-header {
  margin-bottom: 2rem;
}

.category-articles-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #000;
  margin: 0 0 0.5rem 0;
}

.category-articles-count {
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
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
  text-decoration: none;
  gap: 0;
}

.article-card:hover {
  transform: translateX(8px);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

/* 卡片缩略图 */
.article-card-thumbnail {
  width: 280px;
  min-width: 280px;
  height: 180px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.2);
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

/* 响应式设计 */
@media (max-width: 768px) {
  .category-card,
  .article-card {
    flex-direction: column;
  }

  .category-card-thumbnail,
  .article-card-thumbnail {
    width: 100%;
    min-width: 0;
    height: 200px;
  }

  .categories-list-title,
  .category-articles-title {
    font-size: 2rem;
  }

  .categories-list-count,
  .category-articles-count {
    font-size: 1rem;
  }

  .category-card-title,
  .article-card-title {
    font-size: 1.5rem;
  }

  .article-card-excerpt {
    font-size: 0.9375rem;
  }
}
</style>