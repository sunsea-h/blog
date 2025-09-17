---
title: Java 枚举
categories:
  - Java
date: 2025-09-12 15:51:28
updated: 2025-09-12 15:52:19
---
# Java 枚举

每个枚举值都是当前枚举类的对象。  
枚举中的构造默认都是 private。  
**隐式 `public static final`**，无法被继承，可以实现接口。

```java
public enum Color {
    RED("#FF0000"), 
    GREEN("#00FF00"), 
    BLUE("#0000FF");

    private final String hex;

    Color(String hex) {
        this.hex = hex;
    }

    public String getHex() {
        return hex;
    }
}
```

## 编辑器自动生成的方法

| 方法                   | 说明                                 |
| ---------------------- | ------------------------------------ |
| `values()`             | 返回所有枚举常量的数组（按声明顺序） | 
| `valueOf(String name)` | 根据名称返回枚举常量（区分大小写）   |
| `name()`               | 返回常量名（字符串）                 |
| `ordinal()`            | 返回常量的声明顺序（从 0 开始）      |

## 抽象方法

```java
public enum Operation {
    PLUS {
        public double apply(double x, double y) { return x + y; }
    },
    MINUS {
        public double apply(double x, double y) { return x - y; }
    };

    public abstract double apply(double x, double y);
}
```
