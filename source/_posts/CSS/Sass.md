---
title: Sass
date: 2024-02-15 16:44:28
updated: 2024-02-15 17:31:13
---

# Sass

## 变量

```sass
$primary-color: #1c1c1c;
```

## 样式嵌套

## 混合器

```css
@mixin transform ($property) {
  -ms-transform: $property;
  transform: $property;
}

.box {
  @include transform(rotate(30deg));
}
```

## 模块化

*_base.scss*

```css
$base-font-size: 16px;
```

*app.scss*

```css
@use base;  
  
.inverse {  
  font-size: base.$base-font-size;  
}
```

## 继承

```css
%message-base {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
}

.success {
  @extend %message-base;
  border-color: green;
}
.error {
  @extend %message-base;
  border-color: red;
}
.warning {
  @extend %message-base;
  border-color: yellow;
}
```

## 函数循环

```css
@function pow($base, $exponent) {
  $result: 1;
  @for $i from 1 through $exponent {
    $result: $result * $base;
  }
  @return $result;
}

.sidebar {
  float: left;
  margin-left: pow(4, 3) * 1px;
}
```

## 算数运算符

```css
.container {
  width: 100%;
}
article[role="main"] {
  float: left;
  width: 600px / 960px * 100%;
}
article[role="complementary"] {
  float: right;
  width: 300px / 960px * 100%;
}
```