---
title: Vue3 样式
categories:
  - JavaScript Framework
  - Vue
date: 2025-07-25 14:15:51
updated: 2025-07-25 14:28:34
---
# Vue3 样式

## 子组件根元素

子组件根元素即使设置 scoped 也会被父组件影响。

## 子组件样式

样式穿透，影响使用 scoped 的子组件样式。

```html
<style scoped>
.a :deep(.b) {
  /* ... */
}
</style>
```

## 插槽元素样式

父组件传递过来的插槽属于父组件，默认不会被子组件样式影响。  
可以使用插槽选择器来修改。

```html
<style scoped>
:slotted(div) {
  color: red;
}
</style>
```

## 全局样式

```html
# 1.多个style标签
<style>
/* 全局样式 */
</style>

<style scoped>
/* 局部样式 */
</style>

# 2.global选择器
<style scoped>
:global(.red) {
  color: red;
}
</style>
```

## 动态样式

绑定声明的变量。

```html
<style>
.a {
	color: v-bind('theme.color');
}
</style>
```
