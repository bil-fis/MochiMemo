import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.min.css'

const md = new MarkdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
})

md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx]
    if (!token) return ''

    const code = token.content
    const lang = token.info?.trim() || 'plaintext'

    // 高亮
    const html = hljs.highlight(code, {
        language: hljs.getLanguage(lang) ? lang : 'plaintext',
    }).value

    // 包上行号需要的 .line
    const lines = html
        .split('\n')
        .map(line => `<span class="line">${line}</span>`)
        .join('\n')

    return `
<pre class="line-numbers" data-language="${lang}">
  <code>${lines}</code>
</pre>
  `
}

export function renderMarkdown(markdown: string): string {
    return md.render(markdown)
}