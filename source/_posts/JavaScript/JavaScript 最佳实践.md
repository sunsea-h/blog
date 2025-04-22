---
title: JavaScript 最佳实践
date: 2023-05-04 10:35:48
updated: 2024309-19217-581290 20:30:00
---

# JavaScript 最佳实践

## 松散耦合

HTML、CSS 和 JavaScript 之间减少不必要的耦合。  
*HTML/JavaScripts 耦合*

```html
<script>
	document.write("Hello world!");
</script>
```

*CSS/JavaScript 解耦*

```js
// 通过更改类
element.className = "edit";
// 而不是直接修改指定样式
element.style.color = "color";
```

*应用程序逻辑与事件处理程序分离*

```js
// 未分离
function handleKeyPress(event) {
  if (event.keyCode == 13) {
    let target = event.target;
    let value = 5 * parseInt(target.value);
    if (value > 10) {
      document.getElementById("error-msg").style.display = "block";
    }
  }
}

// 分离后
// 应用程序逻辑
function validateValue(value) {
  value = 5 * parseInt(value);
  if (value > 10) {
    document.getElementById("error-msg").style.display = "block";
  }
}
// 事件处理程序专注于event对象相关信息
// event对象不要传给其他方法
function handleKeyPress(event) {
  if (event.keyCode == 13) {
    let target = event.target;
    validateValue(target.value);
  }
}
```

## 性能

- 避免全局查找和多次属性查找。
- 循环有限次数，可以直接多次调用模块，减少计算终止条件的消耗。
- 尽量避免使用要当作 JavaScript 解释的代码，实例化新解释器很费实践。
- 原生方法很快。
- switch 语句很快。
- 位操作很快。
- 语句最少化，合并语句。
	- 多个 let 合并为一个 let。
	- 递增语句合并 `let name=values; i++;` 合并为 `let name=values[i++];`。
	- 使用数组和对象字面量比构造函数使用更少的语句。
- 优化 DOM 交互。
	- 减少实时更新的次数，使用片段 `document.createDocumentFragment()` 一次性更新。
	- innerHTML 添加大量 DOM 更新更快，但添加不受控的数据会有风险。
- 尽量使用事件委托处理多个目标，以减少事件处理程序。
- 减少访问 HTMLCollection，以减少触发耗时的文档查询。

	```js
	// 返回HTMLCollection的情况：
	//    调用 getElementsByTagName()； 
	//    读取元素的 childNodes 属性； 
	//    读取元素的 attributes 属性； 
	//    访问特殊集合，如 document.form、document.images 等。
	
	// 初始化len存储length
	for (let i = 0, len=images.length; i < len; i++) {
		// 存储元素引用
		image = images[i];
		// 处理
	} 
	```

## 函数声明

减少多次判断

```js
function addEvent(ele, eventName, handler) {  
  if (ele.addEventListener) {  
    ele.addEventListener(eventName, handler)  
  } else if (ele.attachEvent) {  
    ele.attachEvent('on' + eventName, handler)  
  } else {  
    ele['on' + eventName] = handler  
  }  
}

// 省去每次调用判断的开销
var addEvent = (function() {  
  if (ele.addEventListener) {  
    return function(ele, eventName, handler) {  
      ele.addEventListener(eventName, handler)  
    }  
  } else if (ele.attachEvent) {  
    return function(ele, eventName, handler) {  
      ele.attachEvent('on' + eventName, handler)  
    }  
  } else {  
    return function(ele, eventName, handler) {  
      ele['on' + eventName] = handler  
    }  
  }  
})()
```
