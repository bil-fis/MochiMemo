<script setup lang="ts">
import { useConfig } from '@/core/config'
import './css/home.css'

const config = useConfig()
</script>

<template>
  <div class="home-page-content">
    <h3 class="home-content-title">内容区域</h3>
    <div class="home-content-body">
      <!-- 这里是首页内容区域，具体功能待定 -->
    </div>
  </div>
</template>

<style scoped>
/* 首页特有样式 */
.home-page-content {
  @apply w-full h-full flex flex-col;
}

.home-content-title {
  @apply text-4xl font-bold text-white mb-8 pb-5 border-b-2 border-zinc-700;
}

.home-content-body {
  @apply text-xl text-white leading-loose flex-1 overflow-y-auto;
}
</style>