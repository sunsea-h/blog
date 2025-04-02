---
title: JavaScript 函数
categories:
  - JavaScript
date: 2022-09-05 11:33:18
updated: 2023-04-21 12:12:59
---

# JavaScript 函数

## 函数

**函数的作用**：  
- 功能的封装，直接调用，代码复用率提高；  
- 构建对象的模板（构造函数）；  
- 函数实际上是对象，每个函数都是 Function 类型的实例，并且都与其他引用类型一样具有属性和方法，由于函数是对象，因此函数名实际上也是一个指向函数对象的指针，不会与某个函数绑定。  

所有函数都会暴露一个 name 只读属性，显示函数的名称（指针变量），没有时显示空字符串，通过构造函数创建会显示 anonymous。  
函数是获取函数、设置函数和 bind 实例化，会在前加前缀（get、set、bound）。

```ad-tip
严格模式限制：  
- 函数不能以 eval 或 arguments 作为名称；   
- 函数的参数不能叫 eval 或 arguments；  
- 两个命名参数不能拥有同一个名称。  
```

## 函数声明

```javascript
// 1.函数声明:函数名和函数体都会被提升
// 函数定义最后不加分号
function 函数名(形参列表){
	//函数体
}

// 2.函数表达式：只有函数名被提升
var 函数名 = function(形参列表){
	//函数体
};

// 3.Function构造函数(不推荐)
// 会被解释两次：当作ECMAScript代码，传递的参数列表
let 函数名 = new Function(形参列表..., 函数体);

var c = 2;
function cook(a, b='鸡蛋'){//默认值，一般有默认值的放后面
	console.log(c);//2  先找局部，没有再找全局
}
```

箭头函数的缺点：
1. 不能使用 arguments、super 和 new.target
2. 不能用作构造函数
3. 没有 prototype 属性

## 函数内部属性

### arguments

类数组对象（内部的下标跟数组类似，拥有 length 的对象。不能使用数组的方法），包含着传入函数中的 **实际参数**  
arguments 对象还有一个 callee 的属性，用来指向拥有这个 arguments 对象的函数。  
在设置 arguments[1] 时会自动同步到传入的第二个参数，如果只传递一个参数，则不会同步到第二个参数。  
arguments 与传入参数内存并不相同，只会自动同步。 

严格模式中，  
重写 arguments 对象会导致语法错误；  
arguments 也不会与参数同步；  
访问 arguments.callee 会报错。

```javascript
function dg(num){
	if(num<=1)
		return 1;
	else
		return num * arguments.callee(num-1);
		//return num * dg(num-1);
}


foo(10, 20);
function foo(x, y, z) {
    console.log(foo.length); //3 期望接受参数个数
    console.log(arguments.length); //2 实际参数个数  
    console.log(arguments.callee === foo);//true	  
    console.log(x === arguments[0]);//true
    // 数据共享
    console.log(x);//10
    arguments[0] = 20;
    console.log(x); //20
    x = 30;
    console.log(arguments[0]);//30
    // 不会数据共享
    z = 40;
    console.log(arguments[2]); //undefind
    arguments[2] = 50;
    console.log(z); //40
    console.log(arguments[2]);//50
}
```

**递归函数**

```js
// arguments.callee（非严格模式中）
function factorial(num) { 
 if (num <= 1) { 
	 return 1; 
 } else { 
	 return num * arguments.callee(num - 1); 
 } 
} 
// 命名函数表达式（不限模式）
const factorial = (function f(num) { 
 if (num <= 1) { 
	 return 1; 
 } else { 
	 return num * f(num - 1); 
 } 
}); 
```

**函数默认参数**
- 后定义可以使用先定义的参数，反之不行（暂时性死区）；
- 可以使用对象或函数返回值（只在没有传入改参数时参数求值）；
- 参数有自己的作用域，不能引用函数体作用域。

### this

指向的是函数赖以执行的环境对象。  
严格模式中，调用函数时，没有指定上下文对象，this 为 undefined。

### caller

指向调用函数的函数。  
严格模式中，不能给 caller 赋值，会报错。

### new.target

判断函数是否通过 new 进行创建，指向创建的函数或 undefined。

### IIFE

Immediately Invoked Function Expression，意为立即调用的函数表达式，也就是说，声明函数的同时立即调用这个函数

作用：IIFE 的目的是为了隔离作用域，防止污染全局命名空间

JS ES5 只有全局作用域（global scope）、函数作用域（function scope），从 ES6 开始才有块级作用域（block scope）

```javascript
(function foo(){
	var a = 10;
	console.log(a);
})();
// 或
!function foo(){
	var a = 10;
	console.log(a);
}();
```

### 作用域

- 函数作用域：函数内部声明的变量，在函数外部不能访问
- 全局作用域：函数外部声明的变量，在函数内部可以访问  
	当函数嵌套，在这个时候，内部函数与外部函数的这个变量就组成了闭包
- 在 js 中函数内部不存在块级作用域

## 函数调用

  - 函数名 (实参列表);  
  `foo(a,b); //通过小括号进行调用`  
  - 函数名.call(执行环境对象,实参列表);  
  `foo.call(this,a,b); //通过call()调用，this为foo方法this所指向的执行环境`  
  - 函数名.apply(执行环境对象,实参列表数组);  
  `foo.apply(this,[a,b]); //通过apply()调用，this为foo方法this所指向的执行环境`  
  - 函数名.bind(执行环境对象)(实参列表);  
  `foo.bind(this)(a,b); //通过bind返回的是一个方法，执行后面需要加小括号传参，this为foo方法this所指向的执行环境`  

### 尾调用优化

#### 原理

```js
function outerFunction() { 
 return innerFunction(); // 尾调用
} 
```

在 ES6 优化之前，执行这个例子会在内存中发生如下操作。  
(1) 执行到 outerFunction 函数体，第一个栈帧被推到栈上。  
(2) 执行 outerFunction 函数体，到 return 语句。计算返回值必须先计算 innerFunction。  
(3) 执行到 innerFunction 函数体，第二个栈帧被推到栈上。  
(4) 执行 innerFunction 函数体，计算其返回值。  
(5) 将返回值传回 outerFunction，然后 outerFunction 再返回值。  
(6) 将栈帧弹出栈外。  

在 ES6 优化之后，执行这个例子会在内存中发生如下操作。  
(1) 执行到 outerFunction 函数体，第一个栈帧被推到栈上。  
(2) 执行 outerFunction 函数体，到达 return 语句。为求值返回语句，必须先求值 innerFunction。  
(3) 引擎发现把第一个栈帧弹出栈外也没问题，因为 innerFunction 的返回值也是 outerFunction  
的返回值。  
(4) 弹出 outerFunction 的栈帧。  
(5) 执行到 innerFunction 函数体，栈帧被推到栈上。  
(6) 执行 innerFunction 函数体，计算其返回值。  
(7) 将 innerFunction 的栈帧弹出栈外。

#### 条件

- 代码在严格模式下执行；  
  非严格模式可使用 arguments 和 f.caller，会引用外部栈帧。
- 外部函数的返回值是对尾调用函数的调用；
- 尾调用函数返回后不需要执行额外的逻辑；
- 尾调用函数不是引用外部函数作用域中自由变量的闭包。  

1. 符合

```js
"use strict"; 
// 有优化：栈帧销毁前执行参数计算
function outerFunction(a, b) { 
	return innerFunction(a + b); 
} 
// 有优化：初始返回值不涉及栈帧
function outerFunction(a, b) { 
	if (a < b) { 
		return a; 
	} 
	return innerFunction(a + b); 
} 
// 有优化：两个内部函数都在尾部
function outerFunction(condition) { 
	return condition ? innerFunctionA() : innerFunctionB(); 
} 
```

2. 不符合

```js
"use strict"; 
// 无优化：尾调用没有返回 
function outerFunction() { 
	innerFunction(); 
} 
// 无优化：尾调用没有直接返回
function outerFunction() { 
	let innerFunctionResult = innerFunction(); 
	return innerFunctionResult; 
} 
// 无优化：尾调用返回后必须转型为字符串
function outerFunction() { 
	return innerFunction().toString(); 
} 
// 无优化：尾调用是一个闭包
function outerFunction() { 
	let foo = 'bar'; 
	function innerFunction() { return foo; } 
	return innerFunction(); 
} 
```

## 函数的应用

### 函数做参数

由于函数名本身就是变量，所以函数可以当做值来使用（参数，返回值）

#### 数组遍历

```javascript
var arr = [1,2,3,4,5];
arr.forEach(function(v){
	console.log(v);
})
```

#### 定时器

```javascript
setTimeout(function(){
	console.log('可以开始抢票了！');
}, 2000);
```

#### 回调函数

函数作为参数（实参），当我们调用一个方法，该方法在执行过程中又需要调用我们的方法，这时候我们的方法可以通过匿名函数的方式传递给该方法

### 函数做返回值

```javascript
function getFunction(){
	//可以返回函数、对象、变量
    return (function(){
        console.log('hello');
    });
}
var foo = getFunction();//返回function
console.log(foo());
```

## 闭包

闭包是指有权访问另一个函数作用域中的变量的函数，闭包的创建方式，就是在一个函数内部创建另外一个函数  
副作用：闭包只能取得包含函数中任何变量的最后一个值

```javascript
// 通常情况下，无法访问局部变量
// 通过以下方法，可以访问
function getNum(){
	var num = 0;
	return function(){
		return num;
	}
}
var num = getNum();
console.log(num);
```

特点：
1. 函数的内部函数
2. 函数的内部引用外部的变量
3. 闭包不会被垃圾回收机制回收

```javascript
function getNum(){
	var num = 0;
	return function(){
		var n = 0;
		console.log(++num);
		console.log(++n);
	}
}
// 闭包不会生效
// getNum()();//重复创建，getNum会被销毁 
// getNum()();

// 闭包生效，保持引用的关系
var res = getNum();
res();
res();
```

如果闭包变量不使用了，因为不会被回收，所以可以手动赋值为 null 。

## 柯里化

把接收多个参数的函数变成一个可以接收单一参数的函数，并且返回接受余下的参数并返回结果的新函数。  
**只允许确定参数长度的函数**。  

```js
function curry(f) { // curry(f) 执行柯里化转换
  return function(a) {
    return function(b) {
      return f(a, b);
    };
  };
}

// 用法
function sum(a, b) {
  return a + b;
}

let curriedSum = curry(sum);

alert( curriedSum(1)(2) ); // 3
```

目的：以固定第一个参数的偏函数形式，执行函数，如：  

```js
log(new Date(), "DEBUG", "some debug"); // log(a, b, c)
log(new Date())("DEBUG")("some debug"); // log(a)(b)(c)
// logNow 会是带有固定第一个参数的日志的偏函数
let logNow = log(new Date());

// 使用它
logNow("INFO", "message"); // [HH:mm] INFO message
```

### 高级柯里化

```js
// func 是要转换的函数
function curried(...args) {
  if (args.length >= func.length) { // (1)
    return func.apply(this, args);
  } else {
    return function(...args2) { // (2)
      return curried.apply(this, args.concat(args2));
    }
  }
};
```

## 防抖和节流

### 8.1 防抖

高频事件完后，在进行事件操作（多次操作生效一次）。  

```js
function debounce(fn, delay) {
	let timer = null;
	return function () {
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			fn.apply(this, arguments);
		}, delay);
	};
}
```

### 8.2 节流

等待上次操作结束后再触发（隔一段时间生效一次）。

```js
function throttle(fn, delay) {
	let timer = null;
	return function () {
		if (timer) return;
		timer = setTimeout(() => {
			fn.apply(this, arguments);
			timer = null;
		}, delay);
	};
}
```

## forEach

[js forEach参数详解，forEach与for循环区别，forEach中如何删除数组元素 - 听风是风 - 博客园](https://www.cnblogs.com/echolun/p/11544045.html)  
- 不支持 break
- return 不生效
- 删除自身元素 index 不会重置

