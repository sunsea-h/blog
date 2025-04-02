---
title: Nest
categories:
  - JavaScript Framework
  - Nest
date: 2024-11-11 11:55:28
updated: 2025-03-27 17:46:50
---
# Nest

## 核心设计

- 控制器 Controllers：处理请求
- 服务 Services：数据访问与核心逻辑
- 模块 Modules：组合所有的逻辑代码
- 管道 Pipes：校验请求的数据
- 过滤器 Filters：处理请求时的错误
- 守卫 Guards：鉴权、认证相关
- 拦截器 Interceptors：给请求、响应加入额外逻辑
- 存储库 Repositories：处理数据库中数据
- Controller 层负责处理请求、返回响应。
- Service 层负责提供方法和操作，只包含业务逻辑
- Data Access 层负责访问数据库中的数据

## 几种 AOP 方式的顺序

![](Nest.assets/image.png)
- **中间件 (Middleware)**: 在路由处理程序之前执行，通常用于执行一些全局的任务，比如日志记录、请求预处理等。
- **守卫 (Guards)**: 在中间件之后、路由处理程序和拦截器之前执行，主要用于权限验证和授权。
- **拦截器 (Interceptors)**: 在守卫之后、路由处理程序之前执行，可以用于绑定额外的逻辑，如转换返回结果、绑定额外的逻辑到方法的执行之前或之后、扩展基本方法行为等。
- **管道 (Pipes)**: 可以在参数处理时执行，如数据转换和验证。
- **路由处理程序 (Route Handler)**: 实际的控制器方法，在这里执行请求的主要逻辑。
- **异常过滤器 (Exception Filters)**: 在路由处理程序之后执行，用于捕获和处理异常。

## 守卫和拦截器的区别

![](Nest.assets/file-20241220113152773.png)
