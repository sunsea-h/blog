---
title: HTML
categories:
  - HTML
date: 2022-09-05 11:33:18
updated: 2025-02-13 13:58:40
---
# HTML

## [html5](HTML5.md) 简介

超文本标记语言、解释性标签语言  
**超文本:**  
超级文本：字符，超级链接，图片，音频，视频，画布（地图、图表、3D 模型）  
**标记：**  
标签进行标记， html 标签（无法使用自定义标签）  
**语言：**
- c、java 编译型语言
  - hello.c --gcc--> hello.o -- 运行 -->linux
  - Hello.java --javac--> Hello.class -- 运行 --> jvm --> linux/win
- html、js、[[CSS]] 解释型语言
  - hello.html --> 浏览器 -> linux/win
- 执行效率：c > java > js

## html 结构

```html
<!DOCTYPE html> 
<html>
	<head>
		<!-- 内容类型，已被charset取代 -->
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<!-- 文档字符编码 -->
		<meta charset="UTF-8">
		<!-- 网页描述，用于搜索引擎的搜索结果 -->
		<meta name="description" content="This is a brief description of the webpage.">
		<!-- 关键词，供搜索引擎使用 -->
		<meta name="keywords" content="HTML, CSS, JavaScript, Web Development">
		<!-- 文档作者 -->
		<meta name="author" content="John Doe">
		<!-- 移动端显示方式 -->
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<!-- 页面刷新 -->
		<meta http-equiv="refresh" content="30">
	</head>
	<body>
	</body>
</html>
```

- 核心属性（通用，绝大多数标签都具有的属性）  
  id 唯一标识  
  class 分类，可以重复  
  title 悬浮提示  
  style 添加 css 规则的
- 自有属性

```html
<img src="" alt=""></img>
<a href="https://www.baidu.com" target="_blank">百度一下，你就知道</a>
```

## 标签

### 块标签（块元素）

**特点**：

1) 独占一行空间（100%）
2) 高度默认为 0，高度由内容决定
3) 可以指定宽、高
4) 用来搭建页面框架

**元素**：  
h4：div、body、p、ul>li、ol>li、dl>dt、dd、h1~h6  
h5：header、footer、nav、section、article、aside、address... 语义化标签

### 行内标签

**特点**：

1) 行内与其他行内元素共享一行空间
2) 宽高都由内容决定
3) 无法指定宽、高
4) 用来填充，行内元素需要嵌套在块元素中，但是块元素不能嵌套在行内元素中。

**元素**：  
span、a、img  
装饰类型标签：strong b em i sub sup ...

### 功能标签

#### a

  - href=" " 跳转
    - url 跳转到一个外网地址中
    - 相对路径：相对于当前代码所在文件的路径
    - 绝对路径：相对于基准点
    - 锚点
	    1. 定义锚点 `<div id="top">顶部</div>`
	    2. 跳转 `<a href="#top">跳转顶部</a>`
    - 其他
  - target=" " 目标
    - `_self` 默认值 ，当前页面
    - `_blank` 新页面

#### img

  - src 图片地址
    1. 网络资源
    2. 相对路径
    3. 绝对路径
    4. base64 格式值
  - alt 图片找不到时候的文本替换

#### table

内部元素顺序：
1. caption
2. colgroup
3. thead
4. tbody
5. tr
6. tfoot

#### form

- action 后端处理接口
- method 请求方法
  - get 用于查询操作，参数携带在 url 后面
  - post 用于更新【保存、修改、删除】操作，参数携带在请求报文请求体中
- enctype 编码方式 (针对 method 为 post 时)
  - application/x-www-form-urlencoded 
  - multipart/form-data  
  - text/plain  

#### input/textarea

```html
<input type="text" />  
<input type="password" /> 
<input type="radio" />   
<input type="checkbox" /> 
<input type="file"/>     
<input type="submit" /> 
<input type="reset" /> 
<input type="date" />

<textarea name="description" cols="50" rows="4"></textarea>
```

> 注意：text、password、radio、checkbox 建议添加 name 属性，radio、checkbo 必须添加 value 属性。

#### select

```html
<select name="address">
	<option value="js">江苏</option>
	<option value="sx">山西</option>
	<option value="hn">河南</option>
</select> 
```

## 锚点跳转

1. 调用元素的 `scrollIntoView` 方法
2. `window.location.assign('#my-anchor');` 类似用户触发锚点元素行为
3. 通过 `a` 元素的 href 设置元素 id 跳转

```css
/* 设置锚点样式 */
h1:target {
  /* 滚动边距, 应用于页面锚点 */
  scroll-margin-top: 40px;
  /* 滚动填充, 应用于滚动容器 */
  scroll-padding-top: 40px;
  /* 平滑滚动 */
  scroll-behavior: smooth;
}
```

## 转义字符

![](HTML.assets/image-20230301095124125.png)

## [XML](XML.md)
