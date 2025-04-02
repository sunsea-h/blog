---
title: Java 反射
categories:
  - Java
date: 2024-07-21 18:58:34
updated: 2024-07-22 22:46:36
---

# Java 反射

## 简单反射练习

*Person.java*

```java
public class Person {  
    public void eat() {  
        System.out.println("人要吃饭");  
    }  
    public void drink() {  
        System.out.println("人要喝水");  
    }  
}
```

*pro.properties*

```properties
className=com.sunsea.Person  
methodName=drink
```

*Reflect.java*

```java
public class Reflect {  
    public static void main(String[] args) throws IOException, ClassNotFoundException, NoSuchMethodException, InstantiationException, IllegalAccessException, InvocationTargetException {  
        // 1.创建 properties 集合  
        Properties properties = new Properties();  
        // 2.读取配置文件, 解析配置文件  
        InputStream inputStream = Reflect.class.getClassLoader().getResourceAsStream("pro.properties");  
        properties.load(inputStream);  
        // 3.根据解析出来的className, 创建class对象  
        // 4.根据解析出来的methodName, 获取对应方法  
        String className = properties.getProperty("className");  
        String methodName = properties.getProperty("methodName");  
        Class<?> aClass = Class.forName(className);  
        Object o = aClass.newInstance();  
        Method method = aClass.getMethod(methodName);  
        // 5.执行方法  
        method.invoke(o);  
    }  
}
```