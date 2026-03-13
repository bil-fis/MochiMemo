<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { renderMarkdown } from '@/utils/markdown'
import { getreadTime } from "@/utils/readingTime"
import './css/post.css'

const route = useRoute()

const contentHtml = ref('')
const readingTime = ref<any>(null)
const loading = ref(true)
const error = ref('')

// 加载自定义页面内容
const loadPageContent = async () => {
  loading.value = true
  error.value = ''

  const meta = route.meta as any
  const file = meta?.file

  if (!file) {
    error.value = '未指定页面文件'
    loading.value = false
    return
  }

  try {
    // 动态导入 markdown 文件
    // Vite 会自动处理 .md 文件的导入
    const module = await import(/* @vite-ignore */ `../../${file}?raw`)
    const content = module.default as string

    // 渲染 markdown
    contentHtml.value = renderMarkdown(content)
    readingTime.value = getreadTime(contentHtml.value)
    loading.value = false
  } catch (e) {
    console.error('Failed to load page content:', e)
    error.value = `无法加载页面文件: ${file}`
    loading.value = false
  }
}

// 监听路由变化
watch(() => route.path, () => {
  loadPageContent()
})

// 组件挂载时加载内容
onMounted(() => {
  loadPageContent()
})

// 计算属性
const title = computed(() => {
  const meta = route.meta as any
  return meta?.title || '自定义页面'
})
</script>

<template>
  <div class="post-detail">
    <!-- 标题区域 -->
    <div class="post-title">
      <h1 class="post-content-title">{{ title }}</h1>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="post-loading">
      <p>加载中...</p>
    </div>

    <!-- 错误信息 -->
    <div v-else-if="error" class="post-error">
      <p>{{ error }}</p>
    </div>

    <!-- 内容 -->
    <template v-else>
      <!-- 分割线 -->
      <div class="post-divider"></div>

      <!-- 内容 -->
      <div class="post-content" v-html="contentHtml"></div>
    </template>
  </div>
</template>

<style scoped>
.post-loading,
.post-error {
  padding: 2rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
}

.post-error {
  color: rgba(255, 100, 100, 0.8);
}
</style>