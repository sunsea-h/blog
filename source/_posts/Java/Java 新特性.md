---
title: Java 新特性
date: 2024-07-20 23:46:02
updated: 2024-07-21 18:27:25
---

# Java 新特性

## 变量

1. 使用 `var` 声明局部变量, 自动推断类型
2. 通过 `instanceof` 判断变量类型 (jdk16 正式)

## switch

```java
int month = 1;  
var result = switch (month) {  
    case 12,1,2 -> {  
        yield "冬季";  
    }  
    case 3,4,5 -> {  
        yield "春季";  
    }  
    case 6,7,8 -> {  
        yield "夏季";  
    }  
    case 9,10,11-> {  
        yield "秋季";  
    }  
    default -> {  
        yield "月份不正确";  
    }  
};  
System.out.println(result);
```

> jdk12 新特性

switch 支持多个 case 合并写到一个 case  
如果使用 lambda 表达式, 还可以省略 break ,也不会 case 穿透

> jdk13

增加使用 `yield` 返回内容

## 文本块

```java
String str = """  
        <div>            
	        <span>result</span>        
			</div>
			""";
```

## Record 类 (JDK16 正式)

本质是一个 final 类, 所有的属性都有 final 修饰  
会自动编译出 gethashCode、比较所有属性值的 equals、toString 等方法，减少了代码编写量  
使用 Record 可以更方便的创建一个常量类

注意: 
1. Record 只有一个全参构造
2. 重写 equals 比较所有属性值
3. 只能在 Record 类中声明静态字段 静态方法和实例方法,除了实例字段
4. 类不能声明为 abstract
5. 不能显示的声明父类 (默认 java.lang.Record ), 也不能声明子类

```java
public record class Person {
	// ...
}
```

## 密封类 (JDK17 正式)

1. sealed 修饰的类或接口必须有子类或实现类
2. 一个类继承或实现密封类或接口, 必须是 sealed, un-sealed, final 修饰的
3. 通过 permits 指定谁可以实现或继承

 ```java
public sealed class 密封类 permits 子类 {
	// ...
}
```