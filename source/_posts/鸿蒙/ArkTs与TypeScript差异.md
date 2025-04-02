---
title: ArkTs与TypeScript差异
categories:
  - 鸿蒙
date: 2024-12-31 16:07:52
updated: 2025-03-28 10:26:41
---
# ArkTs 与 TypeScript 差异

[官网|TypeScript到ArkTS的适配规则](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/typescript-to-arkts-migration-guide-V5)

## 不支持运行时更改对象布局

## 对象字面量需标注类型

## 使用 nominal typing, 不支持 structural typing

```ad-note
title: nominal typing (名义类型) 和 structural typing (结构类型)

名义类型: 基于类型的名称(类型的名称和标识符)，强调类型的身份，提供更强的类型安全

例：Java、C#

结构类型: 基于类型的结构(类型的结构或形状)，强调类型的形状，提供更大的灵活性

例：TypeScript、Go
```

## `+` 单元运算符只能用于数字类型
