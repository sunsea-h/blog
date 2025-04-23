---
title: Java Spring 注解
categories:
  - Java
date: 2022-09-05 11:33:18
updated: 2024-07-28 22:20:03
---

# Java Spring 注解

## @PathVariable

主要用于接收 `http://host:port/path/{参数值}` 数据。  
参数值需要在 url 进行占位

```java
@GetMapping("/paySerial/{aaaa}")
    public PaySerialRes qryPaySerialDetail(@PathVariable("aaaa") String paySerialId) {
        log.info("传入的id为；{}",paySerialId);
        return paySerialService.qryPaySerialDetail(paySerialId);
    }
```

参数同 `@RequestParam`。

## @RequestParam

主要用于接收 `http://host:port/path?参数名=参数值` 数据。
- 不加 `@RequestParam` 注解：url 可带参数也可不带参数，输入 `localhost:8080/list1` 以及 `localhost:8080/list1?userId=xxx` 方法都能执行
- 加 `@RequestParam` 注解：url 必须带有参数。也就是说你直接输入 `localhost:8080/list2` 会报错，不会执行方法。只能输入 `localhost:8080/list2?userId=xxx` 才能执行相应的方法

支持参数：
- `defaultValue` 如果本次请求没有携带这个参数，或者参数为空，那么就会启用默认值  
- `name` 绑定本次参数的名称，要跟 URL 上面的一样  
- `required` 传入的参数是否必须，默认是 true，表示请求中一定要有相应的参数，否则将报 404 错误码；  
- `value` 跟 name 一样的作用，是 name 属性的一个别名

## @Param

- 当使用了 `@Param` 注解来声明参数的时候，SQL 语句取值使用 `#{}`，`${}` 取值都可以。
- 当不使用 `@Param` 注解声明参数的时候，必须使用的是 `#{}` 来取参数。使用 `${}` 方式取值会报错。
- 不使用 `@Param` 注解时，参数只能有一个，并且是 Javabean。在 SQL 语句里可以引用 JavaBean 的属性，而且只能引用 JavaBean 的属性。