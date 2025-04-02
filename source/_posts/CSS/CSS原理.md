---
title: CSS 原理
categories:
  - CSS
date: 2024-02-24 21:40:06
updated: 2025-02-27 16:26:03
---
# CSS 原理

## 动画

**transform** 对 **非可替换元素的行盒** 无效

## 包含块

影响元素的尺寸和位置。  
设置 width、height、margin、padding 等为百分值的时候根据包含块计算。
> 特例：初始包含块：根元素 html 所在的包含块。大小等于视口。

| 目标元素                   | 包含块                   |
| -------------------------- | ------------------------ |
| position：relative 或 static | 最近的块容器内容区域     |
| position： fixed           | 视口区域                 |
| position：absolute         | 非 static 的内边距区域边缘 |
| position：absolute 或 fixed  | <font color="#00b0f0">特殊条件</font>元素             |

<font color="#00b0f0">特殊条件</font>：
- transform 或 perspective 的值不是 none
- will-change 的值是 transform 或 perspective 
- filter 的值不是 none 或 will-change 的值是 filter(只在 Firefox 下生效). 
- contain: paint;

## 层叠上下文

条件：
- 根元素（HTML）
- **_z-index 不为 auto_** 的绝对定位和相对定位元素
- fixed 定位元素和 sticky 定位元素
- z-index 不为 auto 的 flex item
- z-index 不为 auto 的 grid item
- opacity 小于 1 的元素
- transform 不为 none 的元素

## BFC（块级格式化上下文）

###### 应用

阻止外边距合并  
![](CSS原理.assets/image%203.png)  
![](CSS原理.assets/image%202.png)

消除浮动的影响  
![](CSS原理.assets/image.png)  
![](CSS原理.assets/image%201.png)

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
