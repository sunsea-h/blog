---
title: Vite
categories:
  - JavaScript Engineering
date: 2024-01-30 22:46:27
updated: 2024-04-30 10:05:13
---

# Vite

## 自动转换路径

1. css 中的静态路径
2. img 的 src 中的静态路径
3. `import()` 语句
4. URL 

```js
const url = new URL(`./assets/${val}.jpg`, import.meta.url)
```

## 环境变量

通过 `import.meta.env` 暴露。  
通过 `defineConfig({ envDir: '' })` 设置。
