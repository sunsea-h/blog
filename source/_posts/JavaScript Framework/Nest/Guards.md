---
title: Guards
categories:
  - JavaScript Framework
  - Nest
date: 2025-02-25 17:47:07
updated: 2025-03-27 17:46:59
---
# Guards

主要负责处理请求的权限控制。  
路由处理程序执行之前。  
实现 `CanActivate` 接口，实现 `canActivate` 函数。  
通过 `@UseGuards()` 在 Controller，路由层级绑定。

```ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RedisInstance } from '../../database/redis';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private readonly role: number) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const authorization = request?.headers?.authorization || void 0;
    const token = authorization.split(' ')[1];

    const redis = await RedisInstance.initRedis('TokenGuard.canActive', 0);
    const key = `${user.id}-${user.username}`;
    const cache = redis.get(key);

    if (token !== cache) {
      throw new UnauthorizedException(
        'Your account has been logged in elsewhere, please log in again',
      );
    }
    if (user.role > this.role) {
      throw new ForbiddenException('You do not have permission to operate.');
    }
    return true;
  }
}

```
