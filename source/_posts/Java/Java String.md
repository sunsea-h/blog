---
title: Java String
categories:
  - Java
date: 2024-06-19 23:03:39
updated: 2024-06-21 21:59:06
---

# Java String
## String类
### 特点

1. 所有带双引号的都是 String 的对象啊
2. 字符串是常亮, 创建后不能更改
3. String 对象不可变, 可以共享

```java
// 3.指向堆中同一个地址
String s1 = "abc";
String s2 = "abc"
```

### 实现原理

**jdk8:**  
String 底层是一个被 final 修饰的 char 数组  
`private final char[] value;`  
**jdk9:**  
底层被一个 final 修饰的 byte 数组  
`private final byte[] value;`

### 注意

1. `String s1 = "abc";` 与 `String s2 = new String("abc");` 不共用同一个地址, `new String` 会创建新空间
2. `String s3 = new String("abc");` 如果之前有创建 abc ,则会创建一个对象, 否则会创建两个对象
3. 字符串的拼接, 字符串字面值的拼接, 不会产生新的对象; 有变量参与时会产生新字符串对象

```java
String s1 = "hello";
String s2 = "world";
String s3 = "helloworld";
// 编译后: String s4 = "helloworld";
String s4 = "hello" + "world";
// 编译后: String s5 = (new StringBuilder()).append(s1).append("world").toString()
String s5 = s1 + "world";
// 编译后: String s6 = (new StringBuilder()).append(s1).append(s2).toString()
String s6 = "s1 + s2;
// s3 == s4
// s3 != s5
// s3 != s6
```

## StringBuilder类
一个可变的字符串队列, 提供一个与 StringBuffer 兼容的统一 API, 但不保证同步
作用: 主要是字符串拼接
String 拼接会产生新的字符串对象, 创建过多, 会占用内存, 效率低

### 特点
默认长度 16
不够时, 默认扩容 2 倍 + 2, 如果扩容后的空间还是不够, 就按实际长度扩容