---
date: 2024-12-30 14:12:56
updated: 2025-03-27 17:46:54
title: MiddleWare
---
# MiddleWare

路由处理程序 **之前** 调用的函数。  
可以访问请求对象、响应对象、next 函数。

## 定义

1.函数  

```ts
import { Injectable } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Logger } from '../../utils/log4js';

export function logger(req: Request, res: Response, next: NextFunction) {
  const code = res.statusCode;
  next();

  const logFormat = ` >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    Request original url: ${req.originalUrl}
    Method: ${req.method}
    IP: ${req.ip}
    Status code: ${code}
    Params: ${JSON.stringify(req.params)}
    Query: ${JSON.stringify(req.query)}
    Body: ${JSON.stringify(req.body)} \n  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  `;

  if (code >= 500) {
    Logger.error(logFormat);
  } else if (code >= 400) {
    Logger.warn(logFormat);
  } else {
    Logger.access(logFormat);
    Logger.log(logFormat);
  }
}
```

2.带有 `@Injectable()` 装饰器且实现 `NestMiddleware` 接口的类

```ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Logger } from '../../utils/log4js';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const code = res.statusCode;
    next();
    // 组装日志信息
    const logFormat = `Method: ${req.method} \n Request original url: ${req.originalUrl} \n IP: ${req.ip} \n Status code: ${code} \n`;
    // 根据状态码，进行日志类型区分
    if (code >= 500) {
      Logger.error(logFormat);
    } else if (code >= 400) {
      Logger.warn(logFormat);
    } else {
      Logger.access(logFormat);
      Logger.log(logFormat);
    }
  }
}
```

## 应用

### 局部

```ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

@Module({
  ...
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(LoggerMiddleware)
      .exclude('user/login')
      .forRoutes({ path: 'cats', method: RequestMethod.GET });
  }
}
```

`apply()` 支持单个或多个中间件

`exclude()` 支持单个字符串, 多个字符串, RouteInfo 对象, 排除指定路由, 支持 `path-to-regexp` 路径参数

`forRoutes()`
- 单个字符串
- 多个字符串
- 一个 `RouteInfo` 对象 (`{ path: 'cats', method: RequestMethod.GET }`)
- 一个控制器类
- 多个控制器类

字符串支持通配符 `*`  
但在使用 fastify 底层 API 时, 需要使用参数, `(.*)`, `：splat*`(固定字符串, 匹配所有剩余参数)

> `configure` 方法支持 `async/await`

### 全局

```ts
  const app = await NestFactory.create(AppModule);
  app.use(logger);
  await app.listen(3000);
```

这种方式无法访问全局中间件的 DI(**Dependency Injection**) 容器, 只能使用函数中间件
