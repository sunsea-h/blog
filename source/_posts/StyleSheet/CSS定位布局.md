---
title: CSS 定位布局
categories:
  - StyleSheet
date: 2025-04-07 15:23:39
updated: 2025-04-08 14:35:32
---
# CSS 定位布局

- position:
  - `static`，静态（默认、非定位元素）
  - `relative`，相对（定位元素）
  - `absolute`，绝对（定位元素）
  - `fixed`，固定（定位元素）
  - `sticky`，粘滞（定位元素）
- 定位元素的特点: 可以使用定位规则。`top` `right` `bottom` `left`

### 相对定位 relative

不脱离文档流  
相对于它原来所在位置移动  
预留空间（原来位置处留出空白）  
对 `table-*-group`, `table-row`, `table-column`, `table-cell`, `table-caption` 元素无效。

### 绝对定位 absolute

脱离文档流  
相对于距离它最近的父定位元素位置移动  
如果所有的父元素都不是定位元素，相对于浏览器视口位置移动  
不预留空间  
可以设置 margin，不会与其他边距重合  
一般情况下，绝对定位元素应该嵌套在相对定位元素内容来使用

### 固定定位 fixed

脱离文档流  
相对于**浏览器视口**或**含有特定属性元素**进行定位  
> 特定属性：`transform`、`perspective`、`filter`（非 `none`） 或 `backdrop-filter` （非 `none`）

不预留空间  
打印时，元素会出现在每个页面上  
会创建新的层叠上下文

### 粘滞定位 sticky

相对于最近滚动祖先和包含块，通过 left、top、right、bottom 来设定阈值  
在没有达到阈值的时候是不脱离文档流（相对），达到阈值脱离文档流（固定）  
会创建新的层叠上下文

触发条件：
- 设置方向阈值
- 位于可滚动容器内，overflow 为 hidden（且内容超出），auto，scroll，且可以触发滚动

> overflow 为 hidden 时，通过代码使隐藏的内容展示实现滚动效果，如 `scrollViewInto()`，也可以触发 sticky 定位。

### 应用

定位布局的应用：

1. 二级栏目
2. 模态框
3. 特殊布局
