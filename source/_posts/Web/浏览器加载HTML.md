---
date: 2025-03-21 17:17:02
updated: 2025-03-27 17:43:32
title: 浏览器加载HTML
---
# 浏览器加载 HTML

## 解析 URL 加载页面过程

1. DNS 解析
2. TCP 连接
3. 发送 HTTP 请求
4. 服务器处理请求并返回需要的数据
5. 浏览器解析渲染页面  
   解析 HTML，生成 DOM 树，解析 CSS，生成 CSSOM 树  
   将 DOM 树和 CSSOM 树结合，生成渲染树 (Render Tree)  
   Layout(回流): 根据生成的渲染树，进行回流 (Layout)，得到节点的几何信息（位置，大小）  
   Painting(重绘): 根据渲染树以及回流得到的几何信息，得到节点的绝对像素  
   Display: 将像素发送给 GPU，展示在页面上
6. 连接结束

## DOM 树生成

1. 获取原始 HTML 字节流，根据 [编码](#解析编码) 转换为字符序列
2. 词法分析（标记化）
3. 语法分析（构建节点和树结构）
4. 脚本与外部资源的处理  
	   - 阻塞解析的脚本，遇到同步 script，下载并执行，可能修改 DOM  
	   - 异步脚本 `async` 依然有可能阻塞，`defer` 解析完成后按顺序执行  
	   - CSS 解析：与 DOM 树同时进行，但会阻塞脚本执行，间接影响 DOM 生成
5. DOMContentLoaded 事件
   - DOM 树生成且同步脚本执行完毕后触发，JavaScript 可安全操作 DOM，不需要等待图片等资源加载完毕

## 解析编码

按照优先级顺序
- 检查 BOM，按照对应 Unicode 编码解析
- HTTP 响应头声明 charset `Content-Type: text/html; charset=utf-8`
- 文档开头 `<meta charset>` 或 `<meta http-equiv>` 声明
- 默认 UTF-8
