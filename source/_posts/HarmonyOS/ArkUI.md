---
title: ArkUI
categories:
  - HarmonyOS
date: 2025-03-27 23:44:11
updated: 2025-06-18 00:01:22
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

## 样式扩展

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

## 状态管理

### @State

定义页面展示的数据，变化时会动态更新页面。  
修饰的变量必须进行初始化，为私有变量。  
嵌套类型的数据，嵌套中的对象数据发生变化，无法检测（**浅层监听**）。  
复杂类型数据，需要使用面向对象方法，new 实例进行初始化。

### [@ObjectLink](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/arkts-observed-and-objectlink)

对象数组的深度更新解决方案。  
不能直接在 `@Entry` 修饰的组件中使用。  
必须同 `@Observed` 搭配使用，`@Observed` 修饰关联对象，`@ObjectLink` 用于在组件中声明状态。

## 组件通信

**1.子组件中声明变量，父组件传递同名参数。**
- 只能父传子，子无法触发更新
- 只在初始化时渲染，之后无法触发更新

**2.单项数据流， 子组件变量添加 `@Prop`**
- 子组件修改变量只在当前组件使用，无法传递父组件
- 可以不初始化
- 父组件修改后子组件触发更新
- 只能在 `@Component` 使用，不能在 `@Entry` 中使用

**3.双向数据流， 子组件变量添加 `@Link`**
- 子组件修改变量可以传递给父组件
- 其他同 `@Prop`

## 路由跳转

### 1.Navigation（推荐）

### 2.router

```ts
import { router } from '@kit.ArkUI';

// 添加堆栈记录
router.pushUrl({
	// 路由地址，取profile/main_pages.json中值
	url: 'pages/DetailPage',
	params: {}
	// 实例模式，默认多实例
}, router.RouterMode.Standard)
// 替换堆栈记录
router.replaceUrl()
```

获取传参，需要进行类型断言

```ts
aboutToAppear(): void {
	const result = router.getParams() as TaskParamsModel<TaskModel>
	const detail = result.value
}
```

## 存储

### 页面存储

LocalStorage 和 AppStorage 都是内存级别存储方案，唯一不同在于作用范围。  
[**LocalStorage**](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V14/arkts-localstorage-V14)
- 页面级别存储，内存数据库。
- 在同一个 EntryAbility 中多个页面数据共享，不同 EntryAbility 中无法共享。  
- 只能在模拟器中生效，预览器中无法生效。

#### 页面范围注入

*创建*

```ts
let storage: LocalStorage = new LocalStorage();  
storage.setOrCreate('username', 'xiaowang');  
  
@Entry(storage)
// ...
```

*使用*

```ts
@LocalStorageLink("username") name: string = '默认值';
```

#### Ability 范围注入

```ts
// Ability中声明注入

params: Record<string, string> = { "username": "alice" };  
storage: LocalStorage = new LocalStorage(this.params); 

onWindowStageCreate(windowStage: window.WindowStage): void {  
  // ...
  windowStage.loadContent('pages/Index', this.storage);  
}

// 绑定到页面
let storage = LocalStorage.getShared();
@Entry(storage)
```

**AppStorage**  
如果没有，会创建一个。

```ts
@StorageLink("username") username: string = "alice"
```

### 应用存储
