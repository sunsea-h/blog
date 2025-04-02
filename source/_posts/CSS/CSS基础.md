---
title: CSS 基础
categories:
  - CSS
date: 2022-09-05 11:33:18
updated: 2024-07-28 17:35:04
---

# CSS 基础

## 在 HTML 中的应用

1. css 嵌入到 html 的头部的 style 标签内
2. css 嵌入到元素 style 属性内
3. css 单独写入 .css 文件中，通过 link 引入到 html 中  
   `<link href=' ' rel='stylesheet' type='text/css' >`
4. 通过 `@import url(链接)` 引入

## 语法

注释：/\* 注释内容 */  
语法：选择器 { 样式规则 }

## 选择器

### 核心选择器

id 选择器（#）、class 选择器（.）、标签选择器、并且选择器（div.box）、和选择器（div,.box）、普遍选择器（*）

### 层次选择器

- 子代选择器（>）  
  `.menu > li {}`
- 后代选择器（空格）  
  `.menu li {}`
- 兄弟选择器（+ ~）  
  '~' 当前元素之后的所有兄弟  
  `ul.rank > li:nth-child(2) ~ *{}` 第二个 li 之后的所有 li  
  '+' 当前元素之后的下一个兄弟  
  `ul.rank > li:nth-child(2) + *{}` 第三个 li

### 属性选择器（[name]）

[name='username']  
[name*='u'] 以 u 开始的  
[name^='u'] 含有 u 的  
[name$='u'] 以 u 结尾的

### 伪类选择器

```html
子元素：
:first-child
:last-child
:nth-child(n)        n序号，从1开始
:nth-child(2n+1)     1、3、5...
:nth-child(even)     偶数
:nth-child(odd)     奇数
状态：
:visited      访问过的
:hover        光标悬浮上去
:active       a标签
:focus        聚焦
```

### 伪元素选择器

```html
ul.menu::after {

}
在class为menu的ul元素中追加一个子元素
<ul class="menu">
    <li>one</li>
    <li>two</li>
    ::after
</ul>
ul.menu::before {

}
在class为menu的ul元素中插入一个子元素
<ul class="menu">
    ::before
    <li>one</li>
    <li>two</li>
</ul>
```

### 计算选择器优先级

#### 权重（积分）

1000 style  
100 id  
10 class、伪类  
1 元素选择器、伪元素  
1+10 + 1 + 10 + 1+ 10 + 1  

```css
ul.menu > li.menu_item > ul.sub_menu > li {
     color: lightcyan;  /*34*/
}
##introduce {
    color:lightcoral    /*100*/
}
```

#### 顺序（排名）

当权重值相同的情况下，后者覆盖前者

#### 特权（!important）

脱离了权重和顺序规则

## 样式规则

### 字体规则

**可被继承**

- font-family 字体  
  字体栈："MicrosoftYaHei"," 宋体 "  
  在浏览器所在 pc 从字体栈顶到底寻找字体，找不到使用默认字体
- font-size 字体大小  
  12px
- font-weight 字体粗细程度  
  100~900（一般 400 等同于 normal，而 700 等同于 bold。）  
  bold  
  bolder（相对于父元素）
- font-style 是否是斜体  
  italic  
  normal
- color 字体颜色
- line-height 行高
- 长度的相对单位  
  px 像素  
  em 相对于当前元素上的字号  
  rem 相对于根元素上的字号
- font 速写形式

```css
font: font-style font-weight font-size/line-height font-family
font: normal normal 14px/1.2 '宋体','微软雅黑';
font: 14px/1.2 '宋体','微软雅黑';
```

- 网络字体（应用 iconfont）
  
  1. 获取字体文件 .ott .woff...（字体方正） 阿里云服务器（共享）
  
  2. css3    

 ```css
 @font-size {
	 font-family: '自定义名字'；
	 src: url('./lszi.woff')
 }
 .logo {
	 font-family: '自定义名字';
	 font-size: 12px;
 }
```

### 文本规则

- text-align：文本在容器中显示方式
  
  left、right、center

- text-indent：缩进
- text-transform：控制大小写
  
  none、capitalize、uppercase、lowercase

- text-decoration
  
  - text-decoration-line
    
    none：指定文字无装饰
    
    underline：指定文字的装饰是下划线
    
    overline：指定文字的装饰是上划线
    
    line-through：指定文字的装饰是贯穿线
    
    blink：指定文字的装饰是闪烁
  
  - text-decoration-style
    
    solid（实线）、double（双线）、dotted（点状线条）、dashed（虚线）、wavy（波浪线）
  
  - text-decoration-color
- text-shadow：阴影及模糊效果
- text-overflow：文本超出部分如何显示提示？
  
  ellipsis （...）

- overflow： 容器内的内容超出部分如何处理？（容器，容器的内容的大小超过容器本身）
  
  visible（不做处理）、hidden（隐藏）、scroll（滚动条）

- white-space：容器内的文本是否会主动换行
  
  nowrap（不换行）

- vertical-align：行内元素在容器中的垂直排列方式
	- middle：元素上下边的中心点和行基线向上 1/2x 的高度位置对齐
	- text-top：元素顶边和父级的内容区域顶边对齐
	- text-bottom：元素底部和父级的内容区域底部对齐

### 列表规则

用于设置有序列表、无需列表、自定义列表的显示方式 ul、ol、dl  
    list-style:none;

### 其他规则

#### 常用规则

```css
cursor: pointer;    手型光标
visibility: hidden  设置对象隐藏
opacity:0.2         设置对象不透明度（0.0-1.0）
display:            改变元素的显示方式
```

- none
- block 将行内元素转换为块元素
- inline 将块元素转换为行内元素
- inline-block 行内块元素
  - 与其他行内元素共享一行空间  
  - 可以指定宽高

outline: 外圈线框

- outline-color
- outline-style
- outline-width
- outline-offset（偏移）
- verticle-align 行内元素在垂直方向上的排列规则。这个规则只能应用于行内元素 
  1. 前提  
     盒子中存在多个行内元素
  2. 基线  
     行内元素默认在基线上下排列

#### 居中

1. 将一个文本在块元素进行水平居中

text-align: center;

2. 将一个文本在块元素进行垂直居中

line-height = height

3. 将一个块元素进行水平居中

margin: 0 auto; 

4. 将一个块元素进行垂直居中
- 伸缩盒布局

  ```css
  display: flex;
  flex-direction: row;
  height: 100px;
  align-items: center;
  ```

## 盒子规则

盒子 -- 块元素

### margin

margin 速写形式，外边距，上下外边距会进行重叠  
margin-top  
margin-right  
margin-bottom  
margin-left

margin: 10px; 上右下左  
margin: 10px 20px; 上下，左右  
margin: 10px 20px 30px; 上 左右 下  
margin: 10px 20px 30px 40px; 上 右 下 左

### border

- border-width  
    border-top-width  
    border-right-width  
    border-bottom-width  
    border-left-width
- border-style  
    border-top-style  
    border-right-style  
    border-bottom-style  
    border-left-style
- border-color  
    border-top-color  
    border-right-color  
    border-bottom-color  
    border-left-color
- border 速写  
  border: 2px solid \#ccc;

### padding

padding 速写形式，外边距，上下外边距会进行重叠  
padding-top  
padding-right  
padding-bottom  
padding-left

padding: 10px; 上右下左  
padding: 10px 20px; 上下，左右  
padding: 10px 20px 30px; 上 左右 下  
padding: 10px 20px 30px 40px; 下 右 下 左

### width/height

宽高

### box-sizing（盒子模式）

1. 内容盒子（普通盒子，默认盒子）  
   content-box;  
   盒子实际占据的宽度：2 borderWidth + 2 padding + width  
   盒子实际占据的高度：2 borderWidth + 2 padding + height
2. 边框盒子（怪异盒子，IE 低版本）  
   border-box;  
   盒子实际占据的宽度：width  
   width = 2 borderWidth + 2 padding + 内容宽  
   盒子实际占据的高度：height  
   height = 2 borderHeight + 2 padding + 内容高

### css 实现简易呼吸灯

border-radius：设置对象的圆角半径长度

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS实现简易呼吸灯</title>
    <style>
    .outer , .inner {
        box-sizing: border-box; /* width : padding + border + 内容*/
        border-radius: 50%;
    }
    .outer {
        width: 300px;
        height: 300px;
        border: 3px solid ##ccc;
        margin: 0 auto;
        padding: 50px;
        transition: padding 2s;
    }
    .outer:hover {
        padding: 10px;
    }
    .outer .inner {
        width: 100%;
        height: 100%;
        border: 5px solid ##ccc;
    }
    </style>
</head>
<body>
    <div class="outer">
        <div class="inner">

        </div>
    </div>
</body>
</html>
```

### background

- background 速写形式  
     background: color image position/size repeat origin clip attachment initial|inherit;
- background-color 
- background-image
- background-repeat  
     no-repeat、repeat
- background-size
- background-position
- background-clip 指定背景图像的绘画区域
- background-orign 指定背景图像的定位区域
- background-attachment 设置背景图像是否固定或者随着页面的其余部分滚动  
  scroll（随页面滚动）、fiexd（不滚动）、local（随元素内容滚动）

## 默认文档流（y 轴）

1. 块元素默认特性  
   块元素， 独占一行空间，高度由内容决定。块元素默认从上往下排列
2. 浮动 (float)、绝对定位 (absolute)、固定定位 (fixed) 三种方式定位会脱离文档流

## 浮动布局（x 轴）

解决块元素在容器中多列显示的问题  
实现文本环绕效果

应用场合：父子结构

- float  
  块元素 - 浮动元素：
1) 脱离默认文档流。
2) 块元素的宽度不再是 100%，由内容或者设定值决定。
3) 块元素不再支撑其父元素。
4) 同一层次（兄弟关系）浮动元素会在一行排列，当浮动元素宽度总和大于父元素的时候会发生换行。
5) 换行时，如果浮动元素高度不一致，会出现“卡住”。
6) 跟在浮动元素后的行内盒子会自动缩短，为浮动元素留空。
- clear  
  清理浮动。浏览器通过增加外边距实现不被浮动元素遮挡，

## 伸缩盒布局（x 轴、y 轴）

应用场合：父子结构  
div.container > div  
ul.container > li 

### 概念

伸缩盒容器 div.container 、ul.container  
伸缩盒元素 div、li  
主轴 默认主轴 x 轴，伸缩盒中，伸缩盒子元素沿着主轴来进行排列  
交叉轴 与主轴垂直的轴

### 规则

#### 伸缩盒容器

- `display:flex;`  
  强制让它的子元素沿着主轴方向中显示，并且子元素不会脱离文档流，交叉轴上元素的高度如果没有指定，应该和父元素保持一致。

- `flex-direction:row/row-reverse/column/column-reverse;`  
  定义主轴方向，row 表示主轴是 x 轴，column 表示主轴为 y 轴

- `flex-wrap: nowrap/warp/warp-reverse;`  
  当子元素的长度加起来超过主轴上的父元素的宽度，默认不换行，

- `align-items: stretch/centre/baseline/flex-start/flex-end;`  
  定义伸缩盒容器中的子元素在交叉轴上的排列方式

- `justify-content: space-around(元素两边margin相等)/space-between(首尾元素紧贴边)/centre/flex-start/flex-end;`  
  定义伸缩盒容器中的子元素在主轴上的排列方式

#### 伸缩盒元素

- `flex-basic:` 主轴上的基础长度（基本工资）
- `flex-grow:` 主轴上剩余空间分配的份数（分红）
- `flex-shrink:` 主轴上亏损空间的分摊份数（亏损）
- `flex:  flex-grow、flex-shrink、flex-basis`

如果 `width` 和 `flex-basis` 同时设置，非 auto 的 flex-basis 权重更大

```css
flex:none;   /* flex : 0,0,auto;*/
flex:auto;   /* flex:1,1,auto;*/
flex:1;      /* flex:1,1,0%;  0%表示0无尺寸*/
```

## 定位布局（z 轴）

- position:
  - `static`  
    静态（默认、非定位元素）
  - `relative`  
    相对（定位元素）
  - `absolute`  
    绝对（定位元素）
  - `fixed`  
    固定（定位元素）
  - `sticky`  
    粘滞（定位元素）
- 定位元素的特点: 可以使用定位规则。`top` `right` `bottom` `left`

### 相对定位

1. 不脱离文档流
2. 相对于它原来所在位置移动

### 绝对定位

1. 脱离文档流
2. 相对于距离它最近的父定位元素位置移动！如果所有的父元素都不是定位元素，相对于浏览器视口位置移动  
   一般情况下，绝对定位元素应该嵌套在相对定位元素内容来使用

### 固定定位

1. 脱离文档流
2. 相对于浏览器视口进行定位

### 粘滞定位

1. 在没有达到阈值的时候是不脱离文档流（相对），达到阈值脱离文档流（固定）
2. 通过 left、top、right、bottom 来设定阈值

### 应用

定位布局的应用：

1. 二级栏目
2. 模态框
3. 特殊布局

## 动画特效

### 动画

实现步骤：

1. 定义动画帧

```css
@keyframes 动画名{
    from {
         // 开始帧
    }
    to {
         // 结束帧
    }
}

@keyframes 动画名{
    0% {
        // 开始帧
    }
    20% {

    }
    ...
    100% {
        // 结束帧
    }
}
```

1. 设定动画
- animation-name: move;  
  动画名
- animation-duration: 2s;  
  持续时间
- animation-timing-function: linear;  
  时间曲线函数（自由落体，贝塞尔曲线）
- animation-delay: 1s;  
  延迟时间
- animation-iteration-count: 2;  
  动画迭代次数 infinite
- animation-direction: alternate-reverse;  
  动画执行的方向 from->to , to->from
- animation-fill-mode:forwards;  
  填充模式，动画结束后保留哪一帧规则
- animation-play-state: paused;  
  动画状态
- animation: move 2s 1s 2 linear;  
  动画的速写形式

### 动画库 animate.css

动画帧、动画设定规则都有第三方完成，我们直接使用 class 即可

- 引入动画库

  ```html
  <link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/animate.css/4.1.1/animate.css">
  ```

- 使用
1. 直接调用动画设定类

   ```html
   <div class="box animate__animated animate__infinite animate__bounce"></div>
   ```

2. 引用关键帧

   ```html
   <style>
   .bounce {
    animation: flash 10s linear infinite;
   }
   </style>
   <div class="box bounce"></div>
   ```

### 过渡

过渡是轻量级的动画，过渡中无需定义关键帧，它解决的问题是当属性改变的时候实行缓缓改变。一般通过伪类来触发。过渡一定发生在属性值改变上（状态发生变化的时候）

- transition-property: width;  
  过渡属性，取值可以为多个，多个值通过逗号分割；关键字：all 所有属性
- transition-duration: 2s;  
  过渡持续时间
- transition-delay: 0;  
  过渡延迟时间
- transition-timing-function: linear;  
  时间曲线函数
- transition:transform,background-color 2s,2s 0s linear;  
  速写形式

### 变形

```css
.box {
    transform: skew();
    transform-style: skew();
    transform-origin: center; // 或top、right、left
}
```

拉伸 skey(45deg)  
旋转 rotate(100px, 50px)  
缩放 scale(2)  
平移 translate(360deg)  

## 媒体查询（响应式布局）

### 实现

向上兼容：在窄屏设置的样式。默认在大屏也会存在  
向下覆盖：宽屏的样式设置会覆盖窄屏的样式设置  

判断最小值 (min-width)，那么就应该从小到大写  
判断最大值 (max-width)，那么就应该从大到小写  
1. 非响应式  
   2 套   
   - pc  
     1190px 宽度写死 400px 700px
   - mobile(响应式)
2. 半响应式
   - pc（4k 2k 1080p 普通）
   - mobile(响应式) 宽度尽可能使用百分比
3. 全响应式  
    -pc、mobile (4k 2k 1080 普通 pad phone)

### 技术

```css
@media 判断媒体类型（屏幕类型）
@media screen显示器/print打印机/speech语音类型/tv电视类型设备/all
@media screen and (min-width:900px) and (max-width:1200px) {
    /* 当屏幕满足上述条件，执行该代码块内部的css*/
    .container {
        background-color: pink;
    }
}
```

### bootstrap 中响应式

## 网格布局

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

![](CSS基础.assets/image-20221014162047578.png)

**auto-fit**

![](CSS基础.assets/image-20221014162136147.png)

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
![](CSS基础.assets/image-20221017100203866.png)

`row dense`  
![](CSS基础.assets/image-20221017100345980.png)

`column dense`  
![](CSS基础.assets/image-20221017100415318.png)

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

![](CSS基础.assets/image-20221017103503068.png)

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

## 阴影

[阴影、内阴影、外阴影、单边阴影、双边阴影等 - 一梦梦 - 博客园](https://www.cnblogs.com/mdr86553/p/13684354.html)  