---
title: TypeScript 技巧
categories:
  - TypeScript
date: 2025-09-11 16:39:48
updated: 2025-09-11 18:06:13
---
# TypeScript 技巧

## 键重映射 + 值转换

```ts
type UserPermissions = 'read' | 'write' | 'delete';

type PermissionFlags = {
  [K in UserPermissions as `can${Capitalize<K>}`]: boolean;
};
```

这对权限等类型的声明，不需要每次新增权限，都要修改类型。

## 带 is 的类型守卫和自定义类型

```ts
type Product = { type: 'product'; price: number };
type User = { type: 'user'; email: string };
type Result = Product | User;

function isProduct(r: Result): r is Product {
  return r.type === 'product';
}

const prices = results.filter(isProduct).map(p => p.price);
```

## 泛型工具函数和函数组合

```ts
const toUpper = (s: string) => s.toUpperCase();
const getLength = (s: string) => s.length;

type Pipe<T, R> = (input: T) => R;

const pipe: Pipe<string, number> = str => getLength(toUpper(str));
```

## 带类型收窄的函数重载

```ts
function parseData(type: 'json'): object;
function parseData(type: 'text'): string;
function parseData(type: 'binary'): ArrayBuffer;
function parseData(type: string): any {
  // 实际解析逻辑
}

const jsonResult = parseData('json');
```

## 元组解构和 infer

```ts
type Params<T> = T extends (...args: infer A) => any ? A : never;

type MyFn = (x: number, y: string) => boolean;
type Args = Params<MyFn>; // [number, string]，完美提取！
```
