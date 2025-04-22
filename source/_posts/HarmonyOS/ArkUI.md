---
title: ArkUI
date: 2025-03-27 23:44:11
updated: 2025-04-10 23:55:09
---
# ArkUI

[官网地址](https://developer.huawei.com/consumer/cn/doc/harmonyos-references-V14/arkui-api-V14)

## 像素单位

- px，参考手机实际物理像素
- vp，当前手机屏幕宽度
- fp，字体大小，随系统字体大小变化
- lpx，设计稿 720px，像素单位 1440px，1lpx=2px

## 布局

| 布局     | 主轴  | 侧轴  |
| ------ | --- | --- |
| Column | 垂直  | 水平  |
| Row    | 水平  | 垂直  |

两种布局，子元素默认在侧轴方向上水平居中。

## 颜色

支持类型
- 单词（基础色：白色，黑色，灰色，红，绿，蓝）
- rgb
- 十六进制
- 枚举值，`Color.orange`

## 布局

### RelativeContainer

默认情况所有元素堆叠在一起，对其容器左上角。  
容器子元素根据水平方向和垂直方向根据参考者布局；  
参考者可以是容器，也可以是其他子元素（被参考的子元素需要设置 id 属性）。  
例：将图片定位到页面右下角，并设置偏移量。

```ts
RelativeContainer() {
	Stack() {
		Image($r("app.media.add"))
			.width(50)
			.height(50)
			.backgroundColor("#737BE6")
			.borderRadius("50%")
			.padding(10)
	}
	.alignRules({
		right: {anchor: "__container__", align: HorizontalAlign.End},
		bottom: {anchor: "__container__", align: VerticalAlign.Bottom}
	})
	.offset({
		x: -50,
		y: -50
	})
}
```

![](ArkUI.assets/file-20250408232034687.png)  

#### ![](ArkUI.assets/file-20250408232508567.png)垂直水平居中

```ts
.alignRules({
	// 方法一
	middle: {anchor: "__container__", align: HorizontalAlign.Center},
	center: {anchor: "__container__", align: VerticalAlign.Center},
	// 方法二
	left: {anchor: "__container__", align: HorizontalAlign.Start},
	right: {anchor: "__container__", align: HorizontalAlign.End},
	top: {anchor: "__container__", align: VerticalAlign.Top},
	bottom: {anchor: "__container__", align: VerticalAlign.Bottom},
})
```

## 装饰器

### @Styles

提取当前页面重复使用的样式代码。  
仅支持**通用属性**和**通用事件**。  
不能 export，只能在当前文件中使用。

```ts
// 组件外部
@Styles function titleText() {}

// 组件内部
@Styles titleText() {
	.width("100%")
	.height("100%")
}

// 使用
Column()
	.titleText()
```

### @extend

定义指定组件的扩展样式。  
组件外部定义。  
解决了 Styles 不能传参的问题，以及只支持通用属性和通用事件的问题。

### @State

定义页面展示的数据，变化时会动态更新页面。  
修饰的变量必须进行初始化，为私有变量。  
嵌套类型的数据，嵌套中的对象数据发生变化，无法检测（渐层监听）。  
复杂类型数据，需要使用面向对象方法，new 实例进行初始化。
