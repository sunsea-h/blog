---
title: Java lambda 和 stream 流
categories:
  - Java
date: 2024-07-19 23:52:57
updated: 2024-07-20 19:15:53
---

# Java lambda 和 stream 流

## Lambda 表达式

前提: 必须是函数式接口做方法参数传递
> 函数式接口: 有且只有一个抽象方法的接口  
> 通过可以使用 `@FunctionalInterface` 声明来判断

```java
public static void main(String[] args) {  
    new Thread(new Runnable() {  
        @Override  
        public void run() {  
            System.out.println("执行");  
        }  
    }).start();  
  
    // =============  
    new Thread(() -> {  
        System.out.println("执行");  
    }).start();  
}
```

## 常见函数式接口

常配合 Stream 流使用
1. Supplier
2. Consumer
3. Function
4. Predicate

## Stream 流

Stream 流获取:
- Collection 集合 `list.stream()`
- 数组 `Stream.of("1", "2")`

```java
public static void main(String[] args) {  
    ArrayList<String> list = new ArrayList<>();  
    list.add("张三丰");  
    list.add("张翠山");  
    list.add("嬴政");  
    list.add("张无忌");  
    list.add("韩信");  
    list.add("刘邦");  
    list.add("张三");  
    list.add("吕不韦");  
  
    Stream<String> stream = list.stream();  
    stream  
        .filter(s -> s.startsWith("张"))  
        .filter(s -> s.length() == 3)  
        // :: 对方法的引用 lambda 的简写  
        .forEach(System.out::println);  
}
```

## 方法引用

被引用的方法要在重写方法里  
被引用的方法的参数和返回值要和重写方法一直, 且引用方法最好是操作重写方法的参数值
```java
public static void main(String[] args) {  
    method(new Supplier<String>() {  
        @Override  
        public String get() {  
            return " abc ".trim();  
        }  
    });  
  
    method(() -> " abc ".trim());  
  
    method(" abc "::trim);  
}  
  
public static void method(Supplier<String> supplier) {  
    String s = supplier.get();  
    System.out.println(s);  
}
```