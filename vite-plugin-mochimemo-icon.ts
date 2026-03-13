import fs from 'fs'
import path from 'path'
import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import type { SiteConfig } from './src/core/config/schema'

export default function mochimemoIconPlugin(blogConfig: SiteConfig): Plugin {
  let iconPath: string | null = null
  let iconName: string = 'pwa-icon.png'
  let resolvedConfig: ResolvedConfig
  let isUrl: boolean = false

  return {
    name: 'mochimemo-icon',

    // 在配置加载后立即执行
    config() {
      // 获取用户配置的图标路径
      iconPath = blogConfig.logo || null

      // 如果没有配置图标，使用默认图标
      if (!iconPath) {
        console.warn('未配置图标，将使用默认图标')
        return
      }

      // 判断是否为网址
      isUrl = iconPath.startsWith('http://') || iconPath.startsWith('https://')

      if (isUrl) {
        console.log(`使用网络图标: ${iconPath}`)
        // 对于网址，使用 URL 的文件名
        try {
          const url = new URL(iconPath)
          iconName = path.basename(url.pathname)
        } catch (e) {
          console.warn('解析 URL 失败，使用默认图标名')
        }
      } else {
        // 解析图标路径
        if (path.isAbsolute(iconPath)) {
          // 绝对路径（Windows 或 Unix）
        } else {
          // 相对路径，相对于项目根目录
          iconPath = path.resolve(process.cwd(), iconPath)
        }

        // 检查文件是否存在
        if (!fs.existsSync(iconPath)) {
          console.warn(`图标文件不存在: ${iconPath}`)
          iconPath = null
        }

        // 解析图标文件名
        if (iconPath) {
          iconName = path.basename(iconPath)

          // 在配置阶段就复制图标到 public 目录（开发和生产环境都生效）
          try {
            const iconContent = fs.readFileSync(iconPath)
            const publicDir = path.resolve(process.cwd(), 'public')
            const targetPath = path.join(publicDir, iconName)

            // 确保 public 目录存在
            if (!fs.existsSync(publicDir)) {
              fs.mkdirSync(publicDir, { recursive: true })
            }

            // 写入图标文件
            fs.writeFileSync(targetPath, iconContent)
            console.log(`图标已复制到: ${targetPath}`)
          } catch (error) {
            console.error(`复制图标失败: ${error}`)
          }
        }
      }

      return
    },

    configResolved(config) {
      resolvedConfig = config
    },

    // 配置开发服务器
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        // 只处理 index.html
        if (req.url === '/' || req.url === '/index.html') {
          const originalEnd = res.end.bind(res)
          let chunks: Buffer[] = []

          res.end = (chunk?: any, encoding?: BufferEncoding) => {
            if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
            
            if (encoding) {
              chunks.push(Buffer.from(encoding))
            }

            if (!encoding) {
              let html = Buffer.concat(chunks).toString('utf-8')
              
              // 转换 HTML
              if (iconPath) {
                let iconSrc: string
                
                if (isUrl) {
                  iconSrc = iconPath
                } else {
                  iconSrc = `/${iconName}`
                }

                const iconRegex = /<link\s+rel="icon"[^>]*>/g
                const iconLink = `<link rel="icon" type="image/png" href="${iconSrc}" />`
                
                if (iconRegex.test(html)) {
                  html = html.replace(iconRegex, iconLink)
                } else {
                  html = html.replace('</head>', `${iconLink}\n  </head>`)
                }
              }
              
              originalEnd(html)
            }
          }
        } else {
          next()
        }
      })
    },

    // 转换 index.html 中的图标链接（主要用于生产环境）
    transformIndexHtml(html) {
      console.log('[mochimemo-icon] transformIndexHtml 被调用')
      console.log('[mochimemo-icon] iconPath:', iconPath)
      console.log('[mochimemo-icon] isUrl:', isUrl)
      
      // 在配置了图标时替换图标
      if (iconPath) {
        let iconSrc: string
        
        if (isUrl) {
          // 使用网址
          iconSrc = iconPath
        } else {
          // 使用本地文件
          iconSrc = `/${iconName}`
        }

        console.log('[mochimemo-icon] 将使用图标:', iconSrc)

        // 替换或添加图标链接
        const iconRegex = /<link\s+rel="icon"[^>]*>/g
        const iconLink = `<link rel="icon" type="image/png" href="${iconSrc}" />`
        
        console.log('[mochimemo-icon] 生成的图标链接:', iconLink)
        
        // 如果存在图标链接，替换它
        if (iconRegex.test(html)) {
          html = html.replace(iconRegex, iconLink)
          console.log('[mochimemo-icon] 已替换现有的图标链接')
        } else {
          // 否则在 head 中插入
          html = html.replace('</head>', `${iconLink}\n  </head>`)
          console.log('[mochimemo-icon] 已插入新的图标链接')
        }
      } else {
        console.log('[mochimemo-icon] 未配置图标，跳过替换')
      }
      
      return html
    },

    // 在构建完成后确保图标被包含在输出中（仅针对本地文件）
    closeBundle() {
      if (!iconPath || isUrl) return

      try {
        const outDir = path.resolve(resolvedConfig.build.outDir)
        const targetPath = path.join(outDir, iconName)

        // 如果图标已经在 dist 目录中（通过其他方式），不需要再次复制
        if (fs.existsSync(targetPath)) {
          return
        }

        // 否则从 public 目录复制到 dist 目录
        const publicIconPath = path.resolve(process.cwd(), 'public', iconName)
        if (fs.existsSync(publicIconPath)) {
          const iconContent = fs.readFileSync(publicIconPath)
          fs.writeFileSync(targetPath, iconContent)
          console.log(`图标已复制到构建目录: ${targetPath}`)
        }
      } catch (error) {
        console.error(`复制图标到构建目录失败: ${error}`)
      }
    }
  }
}