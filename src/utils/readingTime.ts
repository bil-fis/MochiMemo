// 自定义阅读时间计算（替代 reading-time）
export function getreadTime(content:string) {
    // 统计单词数：按空白字符分割，过滤空字符串
    // 注意：对于纯中文文本，此方法会将每个汉字视为一个“单词”吗？不会，因为中文没有空格，
    // 整个文本会被当作一个单词，导致统计偏差。若需要支持中文，可将分割逻辑改为按字符统计。
    const words = content.trim().split(/\s+/).filter(word => word.length > 0).length;

    const wordsPerMinute = 500; // 阅读速度（词/分钟），与原代码保持一致
    const minutesRaw = words / wordsPerMinute; // 原始分钟数（浮点数）
    const minutesCeil = Math.max(1, Math.ceil(minutesRaw)); // 向上取整，至少1分钟

    return {
        minutes: minutesCeil,               // 整数，至少1分钟
        words: words,                        // 单词数
        text: `${minutesRaw} 分钟阅读`,      // 保留小数，如 "3.2 分钟阅读"
        textLong: `${minutesRaw} 分钟 · ${words} 字`, // 完整描述
    };
}