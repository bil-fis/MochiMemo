import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import { defaultConfig } from './src/core/config/default'
import type { SiteConfig } from './src/core/config/schema'
import mochimemoThemePlugin from "./vite-plugin-mochimemo-theme"
import mochimemoArticlesPlugin from "./vite-plugin-mochimemo-articles"
import UnoCSS from '@unocss/vite'
import {VitePWA} from "vite-plugin-pwa";

function loadUserConfig(): SiteConfig {
  try {
    const configPath = path.resolve('mochi.config.yml')
    const content = fs.readFileSync(configPath, 'utf8')
    const userConfig = yaml.load(content) as Partial<SiteConfig>

    const merged: SiteConfig = {
      ...defaultConfig,
      ...userConfig,

      content: {
        ...defaultConfig.content,
        ...userConfig.content,
        local: {
          ...defaultConfig.content.local,
          ...userConfig.content?.local,
        },
        git: {
          ...defaultConfig.content.git,
          ...userConfig.content?.git,
          labels: {
            ...defaultConfig.content.git.labels,
            ...userConfig.content?.git?.labels,
          },
        },
      },

      routes: userConfig.routes ?? defaultConfig.routes,
      plugins: userConfig.plugins ?? defaultConfig.plugins,
      themeConfig: userConfig.themeConfig ?? defaultConfig.themeConfig,
    }

    return merged
  } catch (e) {
    console.warn('配置加载失败，使用默认配置', e)
    return defaultConfig
  }
}

const blogConfig = loadUserConfig()

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      vue(),
      mochimemoThemePlugin(blogConfig.theme),
      mochimemoArticlesPlugin(blogConfig),
      UnoCSS(),
      VitePWA({
        registerType: "autoUpdate",
        devOptions: {
          enabled: true
        },
        manifest: {
          name: blogConfig.title,
          short_name: blogConfig.title,
          description: blogConfig.description,
          display:"standalone",
          scope:"/",
          start_url:"/",
          icons:[
            {
              src: "/pwa-icon.png",
              sizes: "512x512",
              type:"image/png"
            }
          ]
        },
      }),

  ],
  define: {
    __BLOG_CONFIG__: JSON.stringify(blogConfig),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server:{
    host: '0.0.0.0',
  },
})
