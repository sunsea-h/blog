---
title: Java 多线程
categories:
  - Java
date: 2024-06-22 20:15:41
updated: 2024-06-24 23:38:43
---

# Java 多线程

**进程**: 进入内存中执行的程序  
**线程**: 进程中最小的执行单元  
java 使用 **抢占式调度**

```ad-info 
title:CPU调度
1. 分时调度
   所有线程轮流获取CPU使用权, 平均分配每个线程占用的时间片
2. 抢占式调度
   多个线程轮流抢占CPU使用权, 先抢到先执行, 优先级高的几率大
```

## 创建线程

### 方式一 extend Thread

1. 定义类, 继承 Thread
2. 重写 run 方法, 设置执行任务
3. 创建自定义类的对象
4. 调用 Thread 的 start 方法, 开始线程, 自动调用 run 方法

### 方式二 实现 Runnable 接口

1. 创建类，实现 Runnable 接口
2. 重写 run 方法，设置线程任务
3. 利用 Thread 类的构造方法：Thread（Runnabletarget），创建 Thread 对象（线程对象），将自定义的类当参数传递到 Thread 构造中 
4. 调用 Thread 中的 start 方法，开启线程，jvm 自动调用 run 方法

### 两种方式的区别

继承 Thread 只能单继承  
实现 Runnalbe 接口没有限制, 可以继承父类的同时实现接口

### 方式三 实现 `Callable<V>` 接口

类似 Runnable 接口  
V call() -> 类似 run()

`call()` 与 `run()` 区别:  
同: 都是设置线程任务的  
异: call 有返回值, 可以 throws; run 没有返回值, 不可以 throws

```java
public static void main(String[] args) throws ExecutionException, InterruptedException {  
    MyCallable myCallable = new MyCallable();  
    FutureTask<String> futureTask = new FutureTask<>(myCallable);  
    Thread thread = new Thread(futureTask);  
    thread.start();  
  
    System.out.println(futureTask.get());  
}
```

### 方式四 线程池

## 守护线程

```java
thread.setDaemon(true)
```

非守护线程执行完毕, 守护线程也会结束, 但还是会执行一部分  
如: 文件传输在聊天窗口关闭时结束

## 线程安全

```java
// 1. 同步代码块
const obj = new Object();
synchronized(obj) {

}

// 2. 同步方法
// 普通方法, 默认锁 this
public synchronized void method() {

}

// 静态方法, 默认锁 class 对象
修饰符 static synchronized 返回值类型 方法名() {
	方法体
	return 结果
}
```

## 线程控制

```java
// 不会释放锁
sleep(time)
// 等待, 释放锁
await(time)
// 唤醒一个线程, 随机
notify()
// 唤醒所有线程
notifyAll()
```

`await()` 和 `notify()` 需要锁对象调用, 在同步代码块或同步方法中  
必须是一个锁对象成对调用

## 死锁

尽量避免同步代码块嵌套情况

## Lock 锁

synchronized: 在 {} 结束后, 才会释放锁  
lock: 通过一对方法控制锁

```java
Lock lock = new ReentrantLock();
lock.block();
lock.unblock();
```

## 线程池 Executors

1. 获取 `static ExecutorService newFixedThreadPool(int nThread)`
2. 提交线程任务  
   `submit(Runnable r)`  
   `submit(Callable c)`
3. Future 接收 run 或 call 方法的返回值
4. `shutDown()` 关闭线程池

```java
public static void main(String[] args) throws ExecutionException, InterruptedException {  
    ExecutorService es = Executors.newFixedThreadPool(2);  
    Future<String> future = es.submit(new Callable<String>() {  
        @Override  
        public String call() throws Exception {  
            return "Hello World";  
        }  
    });  
    System.out.println(future.get());  
    es.shutdown();  
}
```