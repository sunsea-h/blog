---
title: JavaScript 预编译
categories:
  - JavaScript
date: 2024-07-22 18:00:07
updated: 2024-07-22 18:01:00
---

# JavaScript 预编译

## 全局的预编译

1. 创建 GO（Global Object）对象
2. 找变量声明（全局没有形参），将变量声明作为 GO 的 key，值赋为 undefined
3. 在全局找函数声明，将函数名作为 GO 对象的 key，值赋为函数体

## 函数体的预编译

1. 创建 AO(Action Object) 对象
2. 找到有效标识符（形参和变量声明），找到后将有效标识符作为 AO 对象的属性名（key），值（value）赋为 undefined
3. 将形参和实参值统一
4. 在函数体内找函数声明，将函数名作为 AO 对象的 key，值赋为函数体