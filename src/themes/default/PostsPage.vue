<script setup lang="ts">
import {renderMarkdown} from '@/utils/markdown'
import {getreadTime} from "@/utils/readingTime";
import './css/post.css'

const markdown = `
  # 测试markdown
  ***加粗*** *斜体*
  - 表一
  - 表二
  \`\`\` js
  console.log('hi')
  console.log('hi')
  console.log('hi')
  console.log('hi')
  \`\`\`
  :heart:
  `
const contentHtml = renderMarkdown(markdown)
const title = "aaa"
</script>

<template>
  <div class="post-detail">
    <!-- 标题区域 -->
    <div class="post-title">
      <h1 class="post-content-title">{{title}}</h1>
      <div class="post-breadcrumb">
        <div class="i-mingcute:list-check-fill"></div>
        <a href="/categories" class="post-breadcrumb-link">分类</a>
        <span class="post-breadcrumb-separator">></span>
        <a href="/posts" class="post-breadcrumb-link">文章</a>
      </div>
    </div>

    <!-- 元信息 -->
    <div class="post-meta">
      <div class="post-meta-item">
        <span class="post-meta-icon i-mingcute:user-3-line"></span>
        <span>作者</span>
      </div>
      <div class="post-meta-item">
        <span class="post-meta-icon i-mingcute:calendar-line"></span>
        <span>2026-03-08</span>
      </div>
      <div class="post-meta-item">
        <span class="post-meta-icon i-mingcute:time-line"></span>
        <span>{{getreadTime(contentHtml).textLong}}</span>
      </div>
    </div>

    <!-- 分割线 -->
    <div class="post-divider"></div>

    <!-- 内容 -->
    <div class="post-content" v-html="contentHtml"></div>
  </div>
</template>

<style scoped>
:deep() {

  pre.line-numbers {
    font-size: 1.2rem;       /* 调大基础字号 */
    line-height: 0.6rem;         /* 减小行高 */
    /* 其余保持不变 */
    position: relative !important;
    display: block !important;
    margin: 1em 0 !important;
    padding: 0.8em 0.8em 0.8em 2.2em !important;
    border-radius: 0.5em !important;
    background: #1e1e1e !important;
    overflow: auto !important;
    counter-reset: line !important;
    font-family: monospace !important;
  }

  pre.line-numbers::before {
    font-size: 1.05rem;
    line-height: 0.6rem;
    /* 注意：如果你在这里用 rem，它会相对于根元素，不会受父元素影响 */
    /* 其余保持不变 */
    content: attr(data-language) !important;
    position: absolute !important;
    top: 0 !important;
    right: 0.5em !important;
    color: #eee !important;
    background: rgba(0, 0, 0, 0.4) !important;
    padding: 0.2em 0.5em !important;
    border-bottom-left-radius: 0.4em !important;
    border-bottom-right-radius: 0.4em !important;
    user-select: none !important;
  }

  /* 代码每一行 */
  pre.line-numbers .line {
    display: block !important;
    counter-increment: line !important;
    position: relative !important;
    color: #d4d4d4 !important;
    line-height: 0.6rem !important;
  }

  /* 行号 */
  pre.line-numbers .line::before {
    content: counter(line) !important;
    position: absolute !important;
    left: -2em !important;
    width: 1.5em !important;
    text-align: right !important;
    color: #777 !important;
    border-right: 1px solid #333 !important;
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

}
</style>