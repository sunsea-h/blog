---
title: Webpack核心概念
categories:
  - JavaScript Engineering
  - Webpack
date: 2025-04-14 14:08:58
updated: 2025-04-16 17:31:24
---
# Webpack 核心概念

## 待学习

- 理解打包流程
- 熟练掌握常用配置项、Loader、插件的使用方法，能够灵活搭建集成 Vue、React、Babel、Eslint、Less、Sass、图片处理等工具的 Webpack 环境
- 掌握常见脚手架工具的用法，例如：Vue-cli、create-react-app、@angular/cli
- 理解 Loader、Plugin 机制，能够自行开发 Web 组件
- 理解常见性能优化手段，并能用于解决实际问题
- 理解前端工程化概念与生态现状

## 核心流程

![](Webpack核心概念.assets/file-20250414165105960.png)  
![](Webpack核心概念.assets/file-20250414180857436.png)

## 入口

## 输出

## 加载器（Loaders）

Rule 按照数组顺序，use 内部 loaders 执行顺序**从下往上**。  
处理非 JS 的资源。  
**特点**
- 链式执行
- 支持异步执行
- 分 normal，pitch 模式

```ad-example
title:css资源处理

1.less-loader，实现 less 转换为 css。

2.css-loader，将 CSS 包装为符合 JavaScript 语法，类似 module.exports = `${css}`。

3.style-loader，使用 require 进行包装，运行时通过 injectStyles 注入到页面 style 标签中。 
```

## 插件（plugins）
