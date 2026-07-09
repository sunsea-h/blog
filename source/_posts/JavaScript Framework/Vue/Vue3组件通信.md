---
title: Vue3组件通信
categories:
  - JavaScript Framework
  - Vue
date: 2026-06-12 09:53:02
updated: 2026-06-12 09:56:31
---
# Vue3 组件通信

- props/emits，父子通信，关注单项数据流
- provide/inject，跨层级通信，需要提供 reactive 对象保证响应式
- Pinia，全局状态管理
- $attrs/ref，高阶组件属性透传，父组件使用 ref 控制子组件
