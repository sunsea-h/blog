---
title: Less
date: 2022-09-05 11:33:18
updated: 2023-03-22 18:27:32
---

# Less

Leaner Style Sheets 的缩写。一门向后兼容的 CSS 扩展语言。

## 安装

- 在 Node.js 环境中使用 Less

```Shell
### 下载
$ npm install -g less
### 使用
$ lessc style.less style.css
```

- 在浏览器环境中使用 Less

```HTML
<link rel="stylesheet/less" type="text/css" href="styles.less" />
<script src="//cdnjs.cloudflare.com/ajax/libs/less.js/3.11.1/less.min.js" ></script>
```

## 基本语法

### 变量（Variables）

```less
@width: 10px;
@height: @width + 10px;

##header {
  width: @width;
  height: @height;
}

// 编译为
##header {
  width: 10px;
  height: 20px;
}
```

### 混合（Mixins）

一种将一组属性从一个规则集包含（或混入）到另一个规则集的方法。

```less
.bordered {
  border-top: dotted 1px black;
  border-bottom: solid 2px black;
}
// 在其它规则集中使用这些属性
##header {
  color: ##111;
  .bordered();
}
```

### 嵌套（Nesting）

使用嵌套（nesting）代替层叠或与层叠结合使用的能力。

```less
// css
##header {
  color: black;
}
##header .navigation {
  font-size: 12px;
}
##header .logo {
  width: 300px;
}


// less
##header {
  color: black;
  .navigation {
    font-size: 12px;
  }
  .logo {
    width: 300px;
  }
}
```

**@规则嵌套和冒泡**  
@ 规则（例如 `@media` 或 `@supports`）可以与选择器以相同的方式进行嵌套。@ 规则会被放在前面，同一规则集中的其它元素的相对顺序保持不变。这叫做冒泡（bubbling）。

```less
.component {
  width: 300px;
  @media (min-width: 768px) {
    width: 600px;
    @media  (min-resolution: 192dpi) {
      background-image: url(/img/retina2x.png);
    }
  }
  @media (min-width: 1280px) {
    width: 800px;
  }
}

// 编译为
.component {
  width: 300px;
}
@media (min-width: 768px) {
  .component {
    width: 600px;
  }
}
@media (min-width: 768px) and (min-resolution: 192dpi) {
  .component {
    background-image: url(/img/retina2x.png);
  }
}
@media (min-width: 1280px) {
  .component {
    width: 800px;
  }

```

### 运算（Operations）

算术运算符 `+`、`-`、`*`、`/` 可以对任何数字、颜色或变量进行运算。  
计算的结果以最左侧操作数的单位类型为准。  
算术运算符在加、减或比较之前会进行单位换算，如果单位换算无效（px 到 cm 或 rad 到 % 的转换）或失去意义，则忽略单位。

```less
// 所有操作数被转换成相同的单位
@conversion-1: 5cm + 10mm; // 结果是 6cm
@conversion-2: 2 - 3cm - 5mm; // 结果是 -1.5cm

@incompatible-units: 2 + 5px - 3cm; // 结果是 4px

@base: 5%;
@filler: @base * 2; // 结果是 10%
@other: @base + @filler; // 结果是 15%

// 乘法和除法不作转换。
@base: 2cm * 3mm; // 结果是 6cm
// 对颜色进行算术运算
@color: ##224488 / 2; //结果是 ##112244
background-color: ##112244 + ##111; // 结果是 ##223355
```

`calc()` 并不对数学表达式进行计算，但是在嵌套函数中会计算变量和数学公式的值。

```less
@var: 50vh/2;
width: calc(50% + (@var - 20px));  // 结果是 calc(50% + (25vh - 20px))
```

### 转义（Escaping）

允许使用任意字符串作为属性或变量值。任何 `~"anything"` 或 `~'anything'` 形式的内容都将按原样输出，除非 `interpolation`。

```less
@min768: ~"(min-width: 768px)";
.element {
  @media @min768 {
    font-size: 1.2rem;
  }
}
// 编译为
@media (min-width: 768px) {
  .element {
    font-size: 1.2rem;
  }
}
```

Less 3.5.0+ 可以简写为

```less
@min768: (min-width: 768px);
.element {
  @media @min768 {
    font-size: 1.2rem;
  }
}
```

### 函数（Functions）

内置了多种函数用于转换颜色、处理字符串、算术运算等。

```less
@base: ##f04615;
@width: 0.5;

.class {
  width: percentage(@width); // returns `50%`
  color: saturate(@base, 5%);
  background-color: spin(lighten(@base, 25%), 8);
}
```

### 命令空间和访问符

```less
##bundle() {
  .button {
    display: block;
    border: 1px solid black;
    background-color: grey;
    &:hover {
      background-color: white;
    }
  }
  .tab { ... }
  .citation { ... }
}
// 把 `.button` 类混合到 `##header a` 中
##header a {
  color: orange;
  ##bundle.button();  // 还可以书写为 ##bundle > .button 形式
  ##bundle().tab; // 不希望出现
}
```

### 映射 map

将混合（mixins）和规则集（rulesets）作为一组值的映射（map）使用

```less
##colors() {
  primary: blue;
  secondary: green;
}
.button {
  color: ##colors[primary];
  border: 1px solid ##colors[secondary];
}
/*编译为*/
.button {
  color: blue;
  border: 1px solid green;
}
```

### 作用域（Scope）

Less 中的作用域与 CSS 中的作用域非常类似。首先在本地查找变量和混合（mixins），如果找不到，则从“父”级作用域继承。  
混合（mixin）和变量的定义不必在引用之前事先定义。

```less
@var: red;

##page {
  @var: white; 
  ##header {
    color: @var; // white
  }
  // @var: white; 上下位置效果相同
}

```

### 注释（Comments）

块注释和行注释都可以使用

```less
/* 一个块注释
 * style comment! */
@var: red;

// 这一行被注释掉了！
@var: white;
```

### 导入（Importing）

```less
// 导入的文件是 .less 扩展名，则可以将扩展名省略掉
@import "library"; // library.less 
@import "typo.css";
```