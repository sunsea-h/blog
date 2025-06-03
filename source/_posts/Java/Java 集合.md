---
title: Java 集合
categories:
  - Java
date: 2024-06-24 23:38:55
updated: 2025-06-02 19:44:00
---
# Java 集合

## 集合框架

**特点:**
1. 只能存储引用数据类型
2. 长度可变
3. 有单量方法, 方便操作  

**分类:**
1. 单列集合: 一个元素就是一个组成部分  
   `list.add("hello")`
2. 双列集合: 一个元素有两个组成部分  
   `map.put(key, value)`

## Collection 

单列集合顶级接口

Collection 接口
1. List 接口
	1. ArrayList 类
	2. LinkedList 类
	3. Vector 类
2. Set 接口
	1. HashSet 类
	2. LinkedHashSet 类 (继承 HashSet )
	3. TreeSet 类

**ArrayList**
- 元素有序
- 元素可重复
- 有索引
- 线程不安全
- 底层数据结构：数组

**LinkedList**
- 元素有序
- 元素可重复
- 有索引 (**本质上没有索引**, Java 提供了一些根据索引操作元素的方法)
- 线程不安全
- 底层数据结构：双向链表

**Vector**
- 元素有序
- 元素可重复
- 有索引
- 线程安全
- 底层数据结构：数组

**HashSet**
- 元素无序
- 元素唯一
- 无索引
- 线程不安全
- 底层数据结构: 哈希表

> JDK8 之前: 哈希表 = 数组 + 链表  
> JDK8 以后: 哈希表 = 数组 + 链表 + 红黑树

**LinkedHashSet**
- 元素有序
- 元素唯一
- 无索引
- 线程不安全
- 底层数据结构: 哈希表

**TreeSet**
- 可对元素进行排序
- 元素唯一
- 无索引
- 线程不安全
- 底层数据结构: 红黑树

### ArrayList

#### 总结

1. ArrayList 在初始化后, 第一次吃调用 `add` 方法之后才会初始化长度 10
2. 底层是数组, 但会自动扩容 `Array.copyof()` 1.5 倍

#### 并发修改异常  

调用 `next` 时内部会判断 **预期操作次数** 和 **实际操作次数**, 不等时抛出异常  
只有在调用 `iterator` 时才会同步预期操作次数和实际操作次数  
`add` 方法只会增加实际操作次数  
解决: 使用 `listIterator` 方法

```java
public static void main(String[] args) throws ExecutionException, InterruptedException {  
    ArrayList<String> list = new ArrayList<>();  
    list.add("a");  
    list.add("b");  
    list.add("c");  
    list.add("d");  
    list.add("e");  
  
    Iterator<String> iterator = list.iterator();  
    while (iterator.hasNext()) {  
        String element = iterator.next();  
        if ("c".equals(element)) {  
            list.add("f");  
        }  
    }  
}
```

#### asList

`ArrayList.asList()` 返回对象为 Array 的内部类 ArrayList，底层固定长度的数组。  
**只支持查询和修改，不支持增删操作。**  
适合做快速初始化，用于判断包含关系。

```java
Array.asList(1,2,3).contains(userInput);
```

#### subList

- 返回为原集合的视图，共享统一内存
- 依赖原集合的 modCount，原集合增删会报错

### HashSet 的存储去重复

1. 先计算元素的哈希值（重写 `hashcode` 方法），
2. 再比较内容（重写 `equals` 方法）先比较哈希值，
3. 如果哈希值不一样，存.如果哈希值一样，再比较内容
   1. 如果哈希值一样，内容不一样，存
   2. 如果哈希值一样，内容也一样，去重复

> **重写 `hashCode` 和 `equals`**

## Map

双列集合的顶级接口

Map 接口
1. HashMap 类
	1. LinkedHashMap 类
2. Hashtable 类
	1. Properties 类
3. TreeMap 类

**HashMap**
1. key 唯一, value 可重复
2. 无序
3. 无索引
4. 线程不安全
5. 键和值可以为 null
6. 数据结构: 哈希表

**LinkedHashMap**  
同 HashMap, 但
1. key 唯一, value 可重复
2. 有序
3. 无索引
4. 线程不安全
5. 键和值可以为 null
6. 数据结构: 哈希表 + 双向链表

**HashTable**
1. key 唯一, value 可重复
2. 无序
3. 无索引
4. 线程安全
5. 键和值不能为 null
6. 数据结构: 哈希表

**Properties**
1. key 唯一, value 可重复
2. 无序
3. 无索引
4. 线程安全
5. 键和值不能为 null
6. 键和值都是 String 类型
7. 数据结构: 哈希表  

**TreeMap**
1. key 唯一, value 可重复
2. 可以对 key 进行排序
3. 无索引
4. 线程不安全
5. 键和值不能为 null
6. 数据结构: 红黑树

### HashMap

默认创建一个长度的为 16 数组 , 在第一次 put 的时候创建  
默认加载因子 0.75,达到 75% 自动扩容  
当元素 hash 值相同,内容不相同时, 会在同一位置使用链表存储, 当链表长度>=8 且总长度>=64 时, 自动改为使用红黑树  
如果后续删除元素,同一索引位置的元素个数小于 6,自动从红黑树转为链表
