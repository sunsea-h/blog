---
title: TypeScript 类
date: 2024-06-05 13:55:37
updated: 2024-07-17 11:08:31
---

# TypeScript 类

## 静态部分与实例部分的区别

## 装饰器

### 类装饰器

修改类定义和添加元数据  
参数:
- `constructor` 被装饰的类的构造函数

```JavaScript
function sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}

@sealed
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}
```

### 方法装饰器

修改方法的属性和行为  
参数:
- `target` 被装饰方法所属类的原型对象
- `propertyKey` 被装饰的方法的名称
- `descriptor` 被装饰方法的属性描述符

```JavaScript
function enumerable(value: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.enumerable = value;
    };
}

class Greeter {
    @enumerable(false)
    greet() {
        // ...
    }
}
```

### 访问器装饰器

修改访问器 (getter, setter) 的属性和行为  
参数:
- `target` 被装饰访问器所属类的原型对象
- `propertyKey` 被装饰的访问器的名称
- `descriptor` 被装饰访问器的属性描述符

```JavaScript
function configurable(value: boolean) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.configurable = value;
    };
}

class Point {
    @configurable(false)
    get x() {
        // ...
    }
}
```

### 属性装饰器

添加元数据或修改属性的行为  
参数:
- `target` 被装饰属性所属类的原型对象
- `propertyKey` 被装饰的属性的名称

```JavaScript
function format(formatString: string) {
    return function (target: any, propertyKey: string) {
        // ...
    };
}

class Greeter {
    @format("Hello")
    greeting: string;
}
```

### 参数装饰器

添加元数据或修改属性的行为  
参数:
- `target` 被装饰参数所属类的原型对象
- `propertyKey` 被装饰的参数所属方法的名称
- `parameterIndex` 被装饰参数在参数列表中的索引

```JavaScript
function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    // ...
}

class Greeter {
    greet(@required name: string) {
        // ...
    }
}
```