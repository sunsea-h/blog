---
title: JavaScript File
date: 2024-08-16 18:31:17
updated: 2024-09-03 16:21:43
---

# JavaScript File

![](JavaScript%20File.assets/image-20240903150532280.png)

## 原始字符串和 Base64 互换

浏览器:
- `atob()`
- `btoa()`

NodeJS:
- `Buffer.from()`
- `Buffer.toString()`

如果要支持其他 Unicode 字符, 转换前先进行 URI 编码 (`decodeURIComponent`, `encodeURIComponent`)
