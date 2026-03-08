<script setup lang="ts">
</script>

<style scoped>
@import './css/home.css';
</style>

<template>
  <div class="home-page">
    <!-- 顶部透明标题栏 -->
    <header class="home-header">
      <div class="home-header-inner">
        <a href="/" class="home-logo">MochiMemo</a>
        <nav class="home-nav">
          <a href="/" class="home-nav-link">首页</a>
          <a href="/posts" class="home-nav-link">文章</a>
          <a href="/categories" class="home-nav-link">分类</a>
          <a href="/tags" class="home-nav-link">标签</a>
        </nav>
      </div>
    </header>

    <div class="home-container">
      <!-- 左侧个人简介 -->
      <aside class="home-profile">
        <div class="home-profile-avatar">
          <img src="" alt="Avatar" />
        </div>
        <h2 class="home-profile-name">Your Name</h2>
        <p class="home-profile-bio">全栈开发者 / 技术博主 / 开源爱好者</p>
        <div class="home-profile-divider"></div>
        <div class="home-profile-info">
          <div class="home-profile-info-item">
            <span class="home-profile-info-icon i-mingcute:map-pin-fill"></span>
            <span>北京, 中国</span>
          </div>
          <div class="home-profile-info-item">
            <span class="home-profile-info-icon i-mingcute:briefcase-fill"></span>
            <span>前端工程师</span>
          </div>
          <div class="home-profile-info-item">
            <span class="home-profile-info-icon i-mingcute:idcard-fill"></span>
            <span>计算机科学</span>
          </div>
          <div class="home-profile-info-item">
            <span class="home-profile-info-icon i-mingcute:mail-ai-fill"></span>
            <span>example.com</span>
          </div>
        </div>
        <div class="home-profile-social">
          <a href="#" class="home-profile-social-link">🐦</a>
          <a href="#" class="home-profile-social-link">📧</a>
          <a href="#" class="home-profile-social-link">🐙</a>
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
        <p class="home-footer-copyright">© 2026 MochiMemo. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>