---
title: Vue 3 教程
date: 2024-02-20
tags:
  - Vue
  - JavaScript
  - 前端
category: 技术
---

# Vue 3 教程

学习 Vue 3 的基础知识。

## Composition API

Vue 3 引入了 Composition API，让代码更加灵活。

```javascript
import { ref, computed } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const doubled = computed(() => count.value * 2)
    return { count, doubled }
  }
}
```

## 响应式系统

Vue 3 使用 Proxy 实现响应式系统。