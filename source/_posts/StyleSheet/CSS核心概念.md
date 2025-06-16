---
title: CSS核心概念
categories:
  - StyleSheet
date: 2024-02-24 21:40:06
updated: 2025-04-09 15:17:19
---
# CSS 核心概念

## 动画

**transform** 对 **非可替换元素的行盒** 无效

## 包含块

影响元素的尺寸和位置。  
设置 width、height、margin、padding 等为百分值的时候根据包含块计算。
> 特例：初始包含块（ICB）：根元素 html 所在的包含块。大小等于视口。

| 目标元素                                | 包含块                                      |
| ----------------------------------- | ---------------------------------------- |
| position：relative 或 static 或 sticky | 最近的块容器内容区域（inline-block，block，list-item） |
| position： fixed                     | 视口区域                                     |
| position：absolute                   | 非 static 的内边距区域边缘                        |
| position：absolute 或 fixed           | <font color="#00b0f0">特殊条件</font>元素      |

<font color="#00b0f0">特殊条件</font>：
- transform 或 perspective 的值不是 none
- will-change 的值是 transform 或 perspective 
- filter 的值不是 none 或 will-change 的值是 filter(测试 Firefox，Chrome 都生效)
- backdrop-filter 的值不是 none
- contain 的值是 layout、paint、strict 或 content

## 区块格式化上下文（BFC）

###### 触发条件

| **触发条件**             | **示例/说明**                                                |
| -------------------- | -------------------------------------------------------- |
| 根元素                  | `<html>`                                                 |
| 浮动元素                 | `float: left;`                                           |
| 绝对定位元素               | `position: fixed;`                                       |
| 行内块                  | `display: inline-block;`                                 |
| `display` 表格相关值      | `display: table-cell;`                                   |
| `display: flow-root` | 无副作用的 BFC 创建方式（推荐）                                       |
| overflow             | 非 visible 或 clip                                         |
| 多列布局容器               | column-count 或 column-width 不为 auto                          |
| `column-span: all`   | 跨越多列的元素                                                  |
| contain              | 值为 layout，content，paint，用于性能优化的容器                        |
| 弹性元素                 | display:flex 或 inline-flex 的直接子元素，且本身不是 flex,inline-flex |
| 网格元素                 | display:grid 或 inline-grid 的直接子元素，且本身不是 grid,inline-grid |

> **`display: flex/grid`** 等会创建弹性/网格格式化上下文（FFC/GFC），而非 BFC。

###### 应用

**1.边距重叠**  
![](CSS核心概念.assets/image%203.png)  
![](CSS核心概念.assets/image%202.png)

**2.浮动塌陷**  
![](CSS核心概念.assets/image.png)  
![](CSS核心概念.assets/image%201.png)

## 层叠上下文

条件：
- 根元素（HTML）
- **_z-index 不为 auto_** 的绝对定位和相对定位元素
- fixed 定位元素和 sticky 定位元素
- z-index 不为 auto 的 flex item
- z-index 不为 auto 的 grid item
- opacity 小于 1 的元素
- mix-blend-mode 不为 normal 的元素
- 特定属性不为 none 的元素
	- transform
	- filter
	- backdrop-filter
	- perspective
	- clip-path
	- mask/mask-image/mask-border
- will-change 值为特定属性
- contain值为layout，paint，content，strict
- `isolation：isolate`

## 定宽高比 (flex+padding-top)

```html
<style>
.container {
	width: 100px;
	background-color: red;
	display: flex;
}

.container::after {
	content: '';
	padding-top: 100%;
}
</style>

<div class="container">
	文本内容
</div>
```

## 参考

[你未必知道的49个CSS知识点本文的每一条，都是我曾经发过的掘金沸点，其中有很多条超过了百赞（窃喜）。 鉴于时不时有童鞋 - 掘金](https://juejin.cn/post/6844903902123393032)  
[总结一波 css 触发 BFC,层叠上下文,级联层触发 BFC 的方式,其中设置 display 为 flow-root - 掘金](https://juejin.cn/post/7234061982579310649)
