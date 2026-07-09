---
title: JavaScript Question
categories:
  - JavaScript
date: 2024-08-16 16:08:47
updated: 2026-03-09 13:36:06
---
# JavaScript Question

## 0.1+0.2!\=\=0.3

js 中存储数据遵循 IEEE754 双精度浮点数标准  
使用 64bit 存储一个双精度的浮点数，其中 1bit 表示符号位，11bit 表示指数位，剩下的 52 位表示尾数  
0.1 在二进制中是一个无限不循环小数  
`parseFloat((a+b).toFixed(9)) === 0.3` 需要设置一个最小误差 1e-9

## 安全的 undefined

js 中 undefined 不是一个关键字, 可能会被修改, 可以使用 `void 0` 或 `void(0)` 

## typeof NaN

typeof NaN 为 number

1. 不与自身相等
2. Object.is(NaN, NaN) 为 true

## 其他值隐式转换为 number

- null: 隐式转换成 0
- undefined: 隐式转换成 NaN
- string
	- 0 
	- 8，10，16 进制对应数 (0x10)
	- NaN
- number: 原样返回
- boolean: true 1, false 0
- symbol: 报错
- bigint: 报错
- object: 内部机制
	- 1. 查看 object 上是否实现了 valueof 方法，如果有则跳到 4，如果没有实现则;
	- 2. 查看 object 上是否实现了 toSting 方法，如果有则跳到 5，如果没有实现则;
	- 3. 返回 not a number, 但不是 NaN;
	- 4. 假如 valueof 方法的返回值为 y，如果 typeof y 为 "object",则直接报错；如果不为 "object"，则返回 Number(y);
	- 5. 假如 toSting 方法的返回值为 z，如果 typeof z 为 "object",则直接报错；如果不为 "object"，则返回 Number(z);

null, undefined, string, boolean 来说相当于显式调用 `Number()` 进行强转

## 绑定 label 标签触发事件问题

[checkbox选中状态失效之谜大家好，我是老纪。前两天遇到一个小Bug，感觉有点儿意思，简单记录下。 我的原生chec - 掘金](https://juejin.cn/post/7389122314548609039)

| 异常类型                                            | 同步方法 | 异步方法 | 资源加载 | Promise | Async...await |
|:------------------------------------------------|:-----|:-----|:-----|:--------|:--------------|
| try...catch                                     | √    |      |      |         | √             |
| window.onerror                                  | √    | √    |      |         |               |
| addEventListener("error", listener)             | √    | √    | √    |         |               |
| addEventListener("unhandlerejection", listener) |      |      |      | √       | √             |  
