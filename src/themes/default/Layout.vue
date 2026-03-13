<script setup lang="ts">
import { useConfig } from '@/core/config'
import { useRoute } from 'vue-router'
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import './css/home.css'

const config = useConfig()
const themeConfig = config.themeConfig
const leftnav = themeConfig?.leftnav || {}
const headerConfig = themeConfig?.header || {}
const headerLinks = headerConfig.links || []
const footerConfig = themeConfig?.footer || {}

// 背景图片
const backgroundImage = computed(() => themeConfig?.backgroundImage || '')

// 计算版权年份
const currentYear = new Date().getFullYear()
const startYear = footerConfig.startYear || currentYear
let copyrightYear: string
if (startYear > currentYear) {
  copyrightYear = `${currentYear}-${startYear}`
} else if (startYear === currentYear) {
  copyrightYear = `${currentYear}`
} else {
  copyrightYear = `${startYear}-${currentYear}`
}

// ICP 备案默认链接
const icpUrl = footerConfig.ICP?.url || 'https://beian.miit.gov.cn'
const icpDetail = footerConfig.ICP?.detail
const icpIcon = footerConfig.ICP?.ico

// 公安备案默认链接和图标
const gabUrl = footerConfig.GAB?.url || 'https://beian.mps.gov.cn/'
const gabDetail = footerConfig.GAB?.detail
const gabIcon = footerConfig.GAB?.ico || 'https://beian.mps.gov.cn/img/logo01.dd7ff50e.png'

// 目录相关
const route = useRoute()
const showTocMenu = ref(false)
const tocItems = ref<Array<{ id: string; text: string; level: number }>>([])

// 判断是否在文章页面
const isPostPage = computed(() => {
  return route.meta?.type === 'post'
})

// 提取标题
const extractHeadings = () => {
  if (!isPostPage.value) {
    tocItems.value = []
    return
  }

  nextTick(() => {
    const contentEl = document.querySelector('.home-content-body')
    if (!contentEl) return

    const headings = contentEl.querySelectorAll('h1[id], h2[id]')
    const items: Array<{ id: string; text: string; level: number }> = []

    headings.forEach((heading) => {
      const id = heading.id
      const text = heading.textContent || ''
      const level = parseInt(heading.tagName.charAt(1))

      if (id && text) {
        items.push({ id, text, level })
      }
    })

    tocItems.value = items
  })
}

// 监听路由变化，重新提取标题
watch(() => route.path, () => {
  showTocMenu.value = false
  extractHeadings()
})

// 组件挂载后提取标题
onMounted(() => {
  extractHeadings()
})

// 滚动到标题
const scrollToHeading = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    // 更新 URL hash，但不触发路由变化
    history.replaceState(null, '', `#${id}`)
    showTocMenu.value = false
  }
}
</script>

<style scoped>
/* 目录容器 */
.toc-container {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  z-index: 100;
}

/* 目录切换按钮 */
.toc-toggle-btn {
  position: relative;
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.7);
  font-size: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toc-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: scale(1.05);
}

.toc-toggle-btn.active {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(0, 0, 0, 0.2);
}

/* 目录菜单 */
.toc-menu {
  position: absolute;
  right: 0;
  bottom: 5rem;
  width: 20rem;
  max-height: 32rem;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.75rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 目录标题 */
.toc-header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 1rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.9);
}

/* 目录列表 */
.toc-list {
  list-style: none;
  padding: 0.75rem 0;
  margin: 0;
}

.toc-item {
  padding: 0.75rem 1.25rem;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.7);
  font-size: 1rem;
  transition: all 0.2s ease;
  line-height: 1.6;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.toc-item:hover {
  background: rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 1);
  padding-left: 1.5rem;
}

/* 标题层级缩进 */
.toc-level-1 {
  padding-left: 1.25rem;
}

.toc-level-2 {
  padding-left: 2.5rem;
}

.toc-level-1:hover {
  padding-left: 1.5rem;
}

.toc-level-2:hover {
  padding-left: 2.75rem;
}

/* 自定义滚动条 */
.toc-menu::-webkit-scrollbar {
  width: 0.375rem;
}

.toc-menu::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 0.25rem;
}

.toc-menu::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 0.25rem;
}

.toc-menu::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>

<template>
  <div class="home-page" :style="backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}">
    <!-- 顶部透明标题栏 -->
    <header class="home-header">
      <div class="home-header-inner">
        <router-link to="/" class="home-logo">{{ config.title }}</router-link>
        <nav class="home-nav">
          <router-link v-for="link in headerLinks" :key="link.url" :to="link.url" class="home-nav-link">{{ link.name }}</router-link>
        </nav>
      </div>
    </header>

    <div class="home-container">
      <!-- 左侧个人简介 -->
      <aside class="home-profile">
        <div class="home-profile-avatar">
          <img v-if="leftnav.avatar" :src="leftnav.avatar" alt="Avatar" />
          <span v-else class="i-mingcute:user-2-fill"></span>
        </div>
        <h2 class="home-profile-name">{{ config.author || 'Your Name' }}</h2>
        <p class="home-profile-bio">{{ leftnav.selfDescription}}</p>
        <div class="home-profile-divider"></div>
        <div class="home-profile-info">
          <div v-if="leftnav.pos" class="home-profile-info-item">
            <span class="home-profile-info-icon i-mingcute:map-pin-fill"></span>
            <span>{{ leftnav.pos }}</span>
          </div>
          <div v-if="leftnav.work" class="home-profile-info-item">
            <span class="home-profile-info-icon i-mingcute:briefcase-fill"></span>
            <span>{{ leftnav.work }}</span>
          </div>
          <div v-if="leftnav.school" class="home-profile-info-item">
            <span class="home-profile-info-icon i-mingcute:idcard-fill"></span>
            <span>{{ leftnav.school }}</span>
          </div>
          <div v-if="leftnav.email" class="home-profile-info-item">
            <span class="home-profile-info-icon i-mingcute:mail-ai-fill"></span>
            <span>{{ leftnav.email }}</span>
          </div>
        </div>
        <div class="home-profile-social">
          <a v-if="leftnav.contacts?.github" :href="leftnav.contacts.github" class="home-profile-social-link" target="_blank" rel="noopener noreferrer">
            <span class="i-mingcute:github-fill"></span>
          </a>
          <a v-if="leftnav.contacts?.bilibili" :href="leftnav.contacts.bilibili" class="home-profile-social-link" target="_blank" rel="noopener noreferrer">
            <span class="i-mingcute:bilibili-fill"></span>
          </a>
          <a v-if="leftnav.contacts?.wechat" :href="leftnav.contacts.wechat" class="home-profile-social-link" target="_blank" rel="noopener noreferrer">
            <span class="i-mingcute:wechat-fill"></span>
          </a>
          <a v-if="leftnav.contacts?.qq" :href="leftnav.contacts.qq" class="home-profile-social-link" target="_blank" rel="noopener noreferrer">
            <span class="i-mingcute:qq-fill"></span>
          </a>
          <template v-if="leftnav.contacts && Array.isArray(leftnav.contacts)">
            <a v-for="(contact, index) in leftnav.contacts" :key="index" :href="contact.url" class="home-profile-social-link" target="_blank" rel="noopener noreferrer">
              <span v-if="contact.icon" :class="contact.icon"></span>
              <span v-else class="i-mingcute:link-fill"></span>
            </a>
          </template>
        </div>
      </aside>

      <!-- 右侧内容框 -->
      <main class="home-content">
        <div class="home-content-body">
          <router-view></router-view>
        </div>
      </main>
    </div>

    <!-- 页脚 -->
    <footer class="home-footer">
      <div class="home-footer-inner">
        <p class="home-footer-copyright">© {{ copyrightYear }} {{ config.author || 'Your Name' }} Powered by <a href="https://github.com/bil-fis/MochiMemo" target="_blank">MochiMemo</a></p>
        <div class="home-footer-links">
          <a v-if="icpDetail" :href="icpUrl" class="home-footer-link" target="_blank" rel="noopener noreferrer">
            <span v-if="icpIcon" :class="icpIcon"></span>
            <span v-else class="i-mingcute:shield-check-fill"></span>
            {{ icpDetail }}
          </a>
          <a v-if="gabDetail" :href="gabUrl" class="home-footer-link" target="_blank" rel="noopener noreferrer">
            <img v-if="gabIcon && (gabIcon.startsWith('http') || gabIcon.startsWith('/'))" :src="gabIcon" alt="GAB" class="home-footer-icon" />
            <span v-else-if="gabIcon" :class="gabIcon"></span>
            {{ gabDetail }}
          </a>
        </div>
      </div>
    </footer>

    <!-- 目录浮动按钮和菜单（仅在文章页面显示，手机端不显示） -->
    <div v-if="isPostPage && tocItems.length > 0" class="toc-container hidden md:block">
      <!-- 浮动按钮 -->
      <button
        @click="showTocMenu = !showTocMenu"
        class="toc-toggle-btn"
        :class="{ 'active': showTocMenu }"
      >
        <span class="i-mingcute:list-check-fill"></span>
      </button>

      <!-- 目录菜单 -->
      <div v-show="showTocMenu" class="toc-menu">
        <div class="toc-header">目录</div>
        <ul class="toc-list">
          <li
            v-for="item in tocItems"
            :key="item.id"
            @click="scrollToHeading(item.id)"
            class="toc-item"
            :class="`toc-level-${item.level}`"
          >
            {{ item.text }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>