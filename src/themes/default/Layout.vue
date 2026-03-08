<script setup lang="ts">
import { useConfig } from '@/core/config'
import './css/home.css'

const config = useConfig()
const themeConfig = config.themeConfig
const leftnav = themeConfig?.leftnav || {}
const headerConfig = themeConfig?.header || {}
const headerLinks = headerConfig.links || []
const footerConfig = themeConfig?.footer || {}

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
</script>

<style scoped>
</style>

<template>
  <div class="home-page">
    <!-- 顶部透明标题栏 -->
    <header class="home-header">
      <div class="home-header-inner">
        <a href="/" class="home-logo">{{ config.title }}</a>
        <nav class="home-nav">
          <a v-for="link in headerLinks" :key="link.url" :href="link.url" class="home-nav-link">{{ link.name }}</a>
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
        <p class="home-footer-copyright">© {{ copyrightYear }} {{ config.author || 'Your Name' }} Powered by MochiMemo</p>
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
  </div>
</template>