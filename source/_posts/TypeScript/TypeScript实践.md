---
title: TypeScript实践
categories:
  - TypeScript
date: 2024-02-09 21:50:28
updated: 2026-03-19 10:54:12
---
# TypeScript 实践

## 实现 GetOptionals

```ts
interface ComplexObject {  
    mandatory: string  
    option1?: number  
    option2?: boolean  
}  
type GetOptional<T> = {  
    [P in keyof T as T[P] extends Required<T>[P] ? never : P]: T[P]  
}
```

## Enum 和 String Literal Union

- **String literal union**：90% 的字符串枚举场景
- **Const enum**（特殊的 enum）：需要完全内联优化
- **Regular enum**：需要数字映射、双向查找、与数字类型互操作

**Const enum**

```ts
export const DATE_FORMATS = {
  FULL: "full",
  DATE_ONLY: "dateOnly",
  TIME_ONLY: "timeOnly",
  DATE_TIME: "dateTime",
  SHORT: "short",
} as const;

export type DateFormat = typeof DATE_FORMATS[keyof typeof DATE_FORMATS];
```
