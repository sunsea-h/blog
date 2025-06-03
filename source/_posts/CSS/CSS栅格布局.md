---
title: CSS栅格布局
categories:
  - CSS
date: 2025-04-09 13:33:56
updated: 2025-06-03 16:54:22
---
# CSS 栅格布局

[css【详解】grid布局—— 网格布局（栅格布局）_朝阳39的博客-CSDN博客](https://sunshinehu.blog.csdn.net/article/details/115588135)

### 基本术语

容器：采用网格布局的区域  
项目：只有网格区域的顶层子元素，网格布局只对项目有效，对项目的子元素无效  

### 使用

块级容器  
`display: grid;`  
行内容器  
`display: inline-grid;`

使用网格布局时，`float`、`display：inline-block`、`display：table-cell`、`vertical-align` 和 `column-*` 等设置会失效。

### 划分行/列 grid-template-rows/grid-template-columns

#### 单位

- 绝对值 px  
  `grid-template-columns: 100px 100px 100px;` 分三列，各 100px
- 百分比值 %  
  `grid-template-columns: 25% 25% 25% 25%` 均分四列
- 比例值 fr
  - 和大于 1(可分配区域按 **和值** 份数分)  
    `grid-template-columns: 1fr 2fr 3fr` 分 6 份，3 列: 1/6、2/6、3/6
  - 和小于 1(可分配区域 \* fr 值)  
    `grid-template-columns: .25fr .25fr` 两列各占总区域 1/4，剩余 1/2 区域

#### 混合使用

- 比例值与绝对值  
  `grid-template-columns: 100px .25fr .25fr` 可分配区域=总区域 -100px，2、3 列为可分配区域 * 1/4
- 比例值和 auto  
  可分配区域=总区域 -auto 内容区域
  - 比例值和大于 1  
    `grid-template-columns: auto 1fr 1fr` 第 2、3 列为可分配区域的 1/2
  - 比例值和小于 1  
    `grid-template-columns: auto .25fr .25fr` 第 2、3 列为可分配区域 * 1/4，第 1 列为总区域剩余部分

#### 函数

1. `minmax(min, max)` 产生一个长度范围
2. `repeat(重复次数，重复值)` 重复产生值
3. `fit-content()` 尺寸适应内容，又不会太宽，超过参数值 (只支持绝对值和百分比值，不支持 fr 值)

```css
// 六列：100px 120px 80px 100px 120px 80px
.container {
	grid-template-columns: repeat(2, 100px 120px 80px);
}

// 无法确定列数
.container {
	grid-template-columns: repeat(auto-fill, 100px);
}
.container {
	grid-template-columns: repeat(auto-fit, 100px);
}
```

**auto-fill**

![](CSS栅格布局.assets/image-20221014162047578.png)

**auto-fit**

![](CSS栅格布局.assets/image-20221014162136147.png)

`auto-fill` ：剩余空间保留空列，没有实质内容  
`auto-fit`：剩余空间平均分配给所有子项  

无论容器大小，始终保持子项均匀分配。

```css
.container {
	grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
}
```

每一行最后一列总是 20%

```css
.container {
	grid-template-columns: repeat(auto-fill, minmax(100px, 1fr))20%;
}
```

尺寸适应内容，但不超过 100px

```css
.container {
	display: grid;
	grid-template-columns: fit-content(100px) 40px auto;
}
```

#### 关键字

`min-content`：一排或一列中最小内容中最小的那一个  
`max-content`：一排或一列中最大内容中最大的那一个  
`auto`：浏览器决定长度  

### 网格线命名

给八根网格线命名

```css
.container {
	display: grid;
	grid-template-columns: [c1] 100px [c2] 100px [c3] 100px [c4];
	grid-template-rows: [r1] 100px [r2] 100px [r3] 100px [r4];
}
```

公共网格线（两侧）命名

```css
.container {
	display: grid;
	grid-template-columns: [区域一左侧] 100px [区域一右侧 区域二左侧] 100px [区域二右侧];
}
```

### 设置行/列间距

- `row-gap` ：行间距
- `column-gap` ：列间距
- `gap` ：`column-gap row-gap` 简写

都支持数值和百分比值，`gap` 还支持 `calc()` 。

### 指定区域

`grid-template-areas`  
网格区域需要是规整的矩形区域，否则无效。  
不属于任何区域的单元格使用 `.` 表示。  

```css
.container {
	display: grid;
	grid-template-columns: 100px 100px 100px;
	grid-template-rows: 100px 100px 100px;
	grid-template-areas: 
		'a b c'
		'd e f'
		'g h i';
	
}
```

区域命名会影响到网格线的命名，区域左侧为：`<name>-start`，区域右侧为：`<name>-end` 。

### 改变网格布局的布局顺序

`grid-auto-flow`
- `row`：先行后列
- `row dense`：先行后列，尽可能紧密排列，不留空格
- `column`：先列后行
- `column dense`：先列后行，尽可能紧密排列，不留空格

`row`  
![](CSS栅格布局.assets/image-20221017100203866.png)

`row dense`  
![](CSS栅格布局.assets/image-20221017100345980.png)

`column dense`  
![](CSS栅格布局.assets/image-20221017100415318.png)

### 设置单元格内对齐方式

- justify-items ：指定单元格内容水平对齐方式
	- stretch：【默认值】拉伸，占满单元格的整个宽度
	- start：对齐单元格的起始边缘
	- end：对齐单元格的结束边缘
	- center：单元格内部居中
- align-items ：指定单元格内容的垂直对齐方式
	- normal：【默认值】会根据使用场景的不同表现为 stretch 或者 start(取决于子项 **是否具有内在尺寸或内在比例**)
	- stretch：拉伸，占满单元格的整个宽度
	- start：对齐单元格的起始边缘
	- end：对齐单元格的结束边缘
	- center：单元格内部居中
	- baseline：基线对齐（align-items 属性特有属性值）
- place-items  
  简写：align-items justify-items

用法同上，但只作用于单个项目
- justify-self
- align-self
- place-self

### 设置容器内对齐方式

需要子项总尺寸小于容器尺寸：
1. 子项具有较小的具体尺寸
2. 子项尺寸为 auto 同时内容尺寸较小

- justify-content ：整个内容区域在容器中的水平位置（左中右）
- align-content ：整个内容区域在容器中的垂直位置（上中下）
- place-content ：简写 align-content justify-content

**取值**：
- normal【默认值】效果和 stretch 一样
- start - 对齐容器的起始边框。
- end - 对齐容器的结束边框。
- center - 容器内部居中。
- stretch - 项目大小没有指定时，拉伸占据整个网格容器。
- space-around - 每个项目两侧的间隔相等。所以，项目之间的间隔比项目与容器边框的间隔大一倍。
- space-between - 项目与项目的间隔相等，项目与容器边框之间没有间隔。
- space-evenly - 项目与项目的间隔相等，项目与容器边框之间也是同样长度的间隔。

### 指定项目的位置

- `grid-column-start` 属性：左边框所在的垂直网格线
- `grid-column-end` 属性：右边框所在的垂直网格线
- `grid-row-start` 属性：上边框所在的水平网格线
- `grid-row-end` 属性：下边框所在的水平网格线

属性值可以是负整数，但是不能是 0，负整数表示从右侧开始计数网格线。  
也可以指定网格线的名称，可以省略 `-start` 和 `-end` ,找不到时会自动补全。  

```css
.container {
	display: grid;
	grid-template-columns: [A] 80px [B] auto [C] 100px [D]
}

.item {
	// 第四个名称为 B 的网格线
	grid-column-start: B 4;
	grid-column-start: C;
	background: deepskyblue;
}
```

![](CSS栅格布局.assets/image-20221017103503068.png)

数量不够会自动创建隐式网格，在右方或下方，以满足需求。

#### span 关键字

跨越网格，取值为正整数（非负、非 0、非小数）。

```css
.item {
	grid-column-start: span 2;  // 占两格
}
```

```css
.item {
	grid-column-start: 2;  // 开始于第二个网格线
	grid-column-end: span 纵线3;  // 跨越网格，结束于名称为 纵线3 的网格线
	grid-row-start: 第二行开始;  // 开始于名称为 第二行开始 的网格线
	grid-row-end: span 3;  // 跨越三个网格线
}
```

3. 网格线有多个 B 或 B-start

```css
.container {
    display: grid;
    grid-template-columns: [B] 80px [B] auto [B] 100px [D] auto auto;
}
```

 `grid-column-start: span B` 表示离 `grid-column-end` 位置 **最近** 的网格线 B 。  
 `grid-column-start: B` 表示离 `grid-column-end` 位置 **最远** 的网格线 B 。

如果没有 B 或 B-start，则在第一列前创建隐式网格线。

### 指定项目的区域

```css
.item {
	// 1. 指定项目的区域
	grid-area: e;
	
	// 2. `grid-row-start`、`grid-column-start`、`grid-row-end`、`grid-column-end` 的简写
	// 不写推断为 auto
	grid-area: <row-start> / <row-end> / <column-start> / <column-start>
}
```

### 设置自动生成的行和列

设置隐式网格：
- grid-auto-columns ：列宽，同 grid-template-columns
- grid-auto-rows ：行高，同 grid-template-rows

不指定时根据内容大小决定。  
不支持 `repeat()` 。  

### 其他合并简写属性

#### `grid-template`  

简写 `grid-template-columns`、`grid-template-rows` 和 `grid-template-areas`  

网格线名称总是位于网格尺寸和区域名称两侧。 简写时 `[col-name1-end]` 和 `[col-name2-start]` 可分开也可合并。  
包含区域名称的 grid-template 缩写属性不支持 repeat() 函数。  

#### `grid`

简写 `grid-template-rows`、`grid-template-columns`、`grid-template-areas`、 `grid-auto-rows`、`grid-auto-columns`、`grid-auto-flow`

### 网格实现自适应换行

```css
grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
```
