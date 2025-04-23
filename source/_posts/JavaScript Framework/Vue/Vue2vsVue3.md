---
title: Vue2vsVue3
categories:
  - JavaScript Framework
  - Vue
date: 2023-05-09 15:20:18
updated: 2024-08-15 10:54:11
---

# Vue2vsVue3

## 类型检查

`Vue3` 由于完全由 `TS` 进行重写，在应用中对类型判断的定义和使用有很强的表现。同一对象的多个键返回值必须通过定义对应的接口（`interface`）来进行类型定义。要不然在 ESLint 时都会报错。

## 数据劫持

`vue2` 的双向数据绑定是利用 `ES5` 的一个 `API Object.definePropert()` 对数据进行劫持 结合 `发布订阅` 模式的方式来实现的。  
`Vue3` 中使用了 `es6` 的 `ProxyAPI` 对数据代理。

## 模板碎片

Vue2 的 template 中必须是一个根元素标签  
`Vue3` 支持碎片 (`Fragments`), 可以有多个根元素

## 优化体积 (Tree Shaking)

使用函数编写 API, 更有利于打包时, 进行 Tree Shaking, 优化打包体积 

## 支持 Composition API

## 生命周期钩子变化

```txt
Vue2 ~~~~~~~~~~~ vue3   
beforeCreate  -> setup()   
created       -> setup()   
beforeMount   -> onBeforeMount   
mounted       -> onMounted   
beforeUpdate  -> onBeforeUpdate   
updated       -> onUpdated   
beforeDestroy -> onBeforeUnmount   
destroyed     -> onUnmounted   
activated     -> onActivated   
deactivated   -> onDeactivated   
```


## 参考
[【持续更新】梳理 Vue3 相比于 Vue2 的有哪些 “与众不同” ？希望本篇文章能帮你加深对 Vue 的理解，能信誓 - 掘金](https://juejin.cn/post/7011372376969445413#heading-5)
[都说Vue3跟Vue2比，性能优化很厉害！template模板不如jsx灵活，但是template相比jsx的固定性，可 - 掘金](https://juejin.cn/post/7294928126940512282#heading-0)
