---
title: Java 注解
date: 2024-07-21 18:58:41
updated: 2024-07-22 23:44:41
---

# Java 注解

## 作用

- 说明: 对代码进行说明,生成 doc 文档 (API 文档)
- 检查: 检查代码是否符合条件, `@Override`, `@FunctionalInterface`
- 分析: 对代码进行分析,起到代替配置文件的作用

## 注解定义及属性的定义格式

属性: 8 中基本类型, String 类型, class 类型, 枚举类型, 注解类型及类型的一些数组  
如果只有一个属性, 且为 value, 则可以省略 "="  
**定义和使用**

```java
// 注入内存中
@Retention(RetentionPolicy.RUNTIME)  
public @interface Book {  
    // 书名  
    String bookName();  
    // 作者  
    String[] author();  
    // 价格  
    int price();  
    // 数量  
    int count() default 10;  
}

@Book(bookName = "西湖游记", author = {"西施", "东施"}, price = 10)  
public class BookShelf {  
}
```

**获取注解内容**

```java
public static void main(String[] args) {  
    Class<BookShelf> bookShelfClass = BookShelf.class;  
    boolean annotationPresent = bookShelfClass.isAnnotationPresent(Book.class);  
    if (annotationPresent) {  
        Book book = bookShelfClass.getAnnotation(Book.class);  
        System.out.println(book.bookName());  
        System.out.println(Arrays.toString(book.author()));  
        System.out.println(book.price());  
        System.out.println(book.count());  
    }  
}
```

## 常用注解

- `@Override`: 检测此方法是否为重写方法
- `@Deprecated`: 表明此方法已弃用
- `@SuppressWarnings("all")`: 取消方法调用的黄色背景警告

## 元注解

管理注解的注解
- 控制注解的使用位置
	- 控制注解是否能在类上使用
	- 控制注解是否能在方法上使用
	- 控制注解是否能在构造上使用等
- 控制注解的生命周期 (加载位置)
	- 控制注解是否能在源码中出现
	- 控制注解是否能在 c1ass 文件中出现
	- 控制注解是否能在内存中出现

> `@Target` 控制注解的使用位置 

参数: ElementType 的枚举值的数组
- TYPE：控制注解能使用在类上
- FIELD：控制注解能使用在属性上
- METHOD：控制注解能使用在方法上
- PARAMETER：控制注解能使用在参数上
- CONSTRUCTOR：控制注解能使用在构造上
- LOCAL_VARIABLE：控制注解能使用在局部变量上

> `@Retention` 控制注解的生命周期  

RetentionPolicy 的枚举值
- SOURCE 控制注解能在源码中出现 ->默认
- CLASS：控制注解能在 c1ass 文件中出现
- RUNTIME：控制注解能在内存中出现