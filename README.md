# MochiMemo

> 注意 此项目仍在开发当中，如果您在看到此标识时拉取了仓库，可能使用的是不完整的程序  
> 我们非常欢迎您来帮助我们开发。欢迎提交 Issue 和 Pull Request。

一个基于 Vue 3 的现代化博客系统，支持 Markdown 渲染、深色主题和响应式设计。

## 特性

- 现代化的深色主题界面
- 云母模糊效果（Glassmorphism）
- 完整的 Markdown 渲染支持
- 响应式设计，适配各种设备
- 支持文章分类和标签
- 自定义主题系统
- 阅读时间估计

## 技术栈

- **前端框架**: Vue 3
- **构建工具**: Vite
- **开发语言**: TypeScript
- **CSS 框架**: UnoCSS
- **Markdown 解析**: markdown-it
- **路由**: Vue Router

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 配置

在项目根目录的 `mochi.config.yml` 文件中配置博客的基本信息：

```yaml
title: 你的博客标题
description: 博客描述
author: 作者名称
content:
  local:
    enabled: true
    postsDir: posts
    pagesDir: pages
theme: default
```

## 主题开发

### 主题结构

```
src/themes/default/
├── HomePage.vue      # 主页
├── PostsPage.vue     # 文章页
├── CategoryPage.vue  # 分类页
├── TagPage.vue       # 标签页
├── CustomPage.vue    # 自定义页
├── NotFound.vue      # 404 页
└── css/              # 样式文件
    ├── home.css
    └── post.css
```

### 创建自定义主题

1. 在 `src/themes/` 目录下创建新的主题文件夹
2. 实现必需的页面组件
3. 在主题的 `index.ts` 中导出所有页面组件
4. 在 `mochi.config.yml` 中设置 `theme: your-theme-name`

## 内容管理

### 文章格式

文章使用 Markdown 格式编写，支持：

- 标题、段落、列表
- 代码块（带行号和语法高亮）
- 表格、引用
- 图片、链接
- Emoji 表情

### 元数据

文章可以包含元数据，用于显示作者、日期、阅读时间等信息。

## 许可证

本项目采用 Apache-2.0 许可证。

详见 [LICENSE](LICENSE) 文件。

## 开源声明

本项目使用了多个开源库，详见 [NOTICE](NOTICE) 文件。

## 仓库地址

https://github.com/bil-fis/MochiMemo

## 贡献

欢迎提交 Issue 和 Pull Request。

## 联系方式

如有问题或建议，请通过 GitHub Issues 联系。