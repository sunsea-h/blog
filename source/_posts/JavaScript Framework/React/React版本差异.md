---
title: React版本差异
categories:
  - JavaScript Framework
  - React
date: 2024-11-08 15:08:07
updated: 2025-05-06 11:43:16
---
# React 版本差异

## React 17

**1.事件委托由 document 改为 DOM 容器（root）**    

**2.向浏览器原生事件靠拢**    
onScroll 不再冒泡  
onFocus/onBlur 采用原生的 focusin/focusout 事件（onFocus 依然会冒泡）  
捕获阶段的事件监听直接采用原生 DOM 事件监听机制  

**3.DOM 事件复用池被废弃**    
事件池导致事件只在传播过程中可用，之后会被立刻释放回收；之外的事件对象上所有状态会置为 null 。除非使用 `e.persist()` （或者直接值缓存）

## React 18

**1.严格模式**  
在开发模式下使用严格模式（ `<React.StrictMode>` ），会执行两次，是为了模拟立即卸载组件和重新加载组件，使开发者提前发现组件重复挂载会出现的 bug 。

**2.自动批处理**  
react 中多个 setState 会触发多次渲染, 只有 React 事件处理程序期间会进行批处理。  
相比之前只会在 **React 事件处理程序期间**才会进行状态批处理, 从 createRoot 开始, 无论来自何处都会进行批处理 (包括之前默认在 `Promise`, `settimeout`, `原生事件处理`, 其他 React 默认不进行批处理的事件中进行处理)。
> 可以使用 `React.fluhSync` 不进行批处理, 立刻触发渲染。 

**3.Transitions**  
定义了两种状态更新: **紧急更新**和 **过渡性更新**。  
过渡性更新适用于不紧急的状态更新，通过 `startTransition` 包裹状态更新。

```ad-note
title: startTransition和settimeout区别

执行时机：startTransition会立即执行，延迟取决于设备速度以及紧急更新的情况。

可控制：更新可打断，react会暴露pending状态，不会冻结页面。
```
