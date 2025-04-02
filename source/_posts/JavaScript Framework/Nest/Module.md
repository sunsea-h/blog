---
title: Module
categories:
  - JavaScript Framework
  - Nest
date: 2024-12-30 14:17:22
updated: 2025-03-27 17:46:52
---
# Module

推荐在导入 service 时, 通过 module 导入, 能保证所有 service 使用的是同一个实例, 减少多个实例产生的问题 (服务内部维护状态会不同步) 以及内容消耗

使用 `@Global()` 声明全局模块

```ts
@Global()
@Module({
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
```

## Dynamic Module

在 module 中添加静态方法,返回一个动态模块类型对象  
**简单示例**

```ts
// app.module.ts
@Module({
  imports: [
    DatabaseModule.forRoot({
      uri: process.env.DATABASE_URL || 'mongodb://localhost:27017',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// database.module.ts
@Global()
@Module({})
export class DatabaseModule {
  static forRoot(config: { uri: string }): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: DatabaseService,
          useValue: new DatabaseService(config.uri),
        },
      ],
      exports: [DatabaseService],
    };
  }
}


// database.service.ts
export class DatabaseService {
  private readonly uri: string;

  constructor(uri: string) {
    this.uri = uri;
  }

  connect() {
    console.log(`Connected to DatabaseService: ${this.uri}`);
    // 连接逻辑
  }
}
```

重新导出动态模块时, 可以省略 `exports` 中的静态方法的调用

```ts
@Module({
  imports: [DatabaseModule.forRoot([User])],
  exports: [DatabaseModule],
})
```
