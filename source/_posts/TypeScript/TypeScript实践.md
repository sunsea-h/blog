---
title: TypeScript 实践
date: 2024-02-09 21:50:28
updated: 2024-02-09 22:03:25
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