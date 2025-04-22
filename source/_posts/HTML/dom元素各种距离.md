---
title: dom 元素各种距离
date: 2024-07-12 10:51:26
updated: 2025-02-13 10:24:45
---
# dom 元素各种距离

## 汇总

|        | getBoundingClientRect()（不计算滚动偏移量,相对于视口；小数） | offset（只读）                   | client（只读，整数）                                                                                   | scroll（非整数，包含伪元素宽度） |
| :----- | :----------------------------------------- | :--------------------------- | :---------------------------------------------------------------------------------------------- | :------------------ |
| width  | 如图示                                        | border+padding+width+ 滚动条    | width+padding（特例: 在根元素（`<html>` 元素）或怪异模式下的 `<body>` 元素上使用 `clientWidth` 时，该属性将返回视口宽度（不包含任何滚动条）） | 无滚动条时等同于 client     |
| height | 如图示                                        | border+padding+height+ 滚动条   | height+padding                                                                                  | 无滚动条时等同于 client     |
| top    | 如图示                                        | 距离最近定位元素（offsetParent）的顶部距离  | 元素上 border                                                                                      | 向下滚动的距离             |
| left   | 如图示                                        | 距离最近定位元素（offsetParent）的左边界距离 | 元素左 border，文本从右往左时，有滚动条时包含滚动条                                                                   | 向右滚动的距离             |

|     | page（页面左上角，包含滚动） | client（浏览器视口左上角） | screen（电脑屏幕左上角） | offset（触发事件对象） |
| --- | ---------------- | ---------------- | --------------- | -------------- |
| X   | 水平偏移量            | 水平偏移量            | 水平偏移量           | 水平距离           |
| Y   | 垂直偏移量            | 垂直偏移量            | 垂直偏移量           | 垂直距离           |  

多屏显示时，水平距离相同的显示屏视为单个设备

## getBoundingClientRect 图示

![](dom元素各种距离.assets/image-20240712105155517.png)

## offsetParent

指向最近的定位元素 (非 fixed, static), `table`, `td`, `th`, `body` 元素  
在 webkit 中，`position: fixed`, 祖先元素 `display:none` 时，返回 null

## offsetWidth 和 offsetHeight

![](dom元素各种距离.assets/image-20240827153027401.png)

## 判断元素是否滚动到底部

判断距离小于一定阈值：

```JavaScript
Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop) < 1;
```
