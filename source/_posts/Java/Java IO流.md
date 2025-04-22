---
title: Java IO 流
date: 2024-06-30 16:59:32
updated: 2024-07-20 23:38:35
---

# Java IO 流

## File 类

### 获取方法

```java
// 获取 File 的绝对路径, 带盘符的路径
String getAbsolutePath()

// 获取的是封装路径, new File 对象的时候写的啥路径，获取的就是啥路径
String getPath()

// 获取的是文件或者文件夹名称
String getName()

// 获取的是文件的长度, 文件的字节数I
long length()
```

### 创建方法

返回值表示是否成功, 文件/文件夹存在, 则创建失败

```java
// 创建文件
boolean createNewFile()

// 创建文件夹, 单级/多级
boolean mkdirs()
```

### 判断方法

```java
// 是否为文件夹
boolean isDirectory()

// 是否为文件
boolean isFile() 

// 是否存在
boolean exists()
```

### 遍历方法

```java
// 遍历指定的文件夹，返回的是 String 数组
String[] list() 

// 遍历指定的文件夹，返回的是 File 数组
File[] listFiles() 
```

`listFiles` 底层调用 `list` 方法

`file.delete()`  
不走回收站  
文件夹必须是空文件夹 

## IO 流分类

字节流: 万能流,一切皆字节  
- 字节输出流: OutputStream 抽象类  
- 字节输入流: InputStream 抽象类  

字符流: 专门操作文本文档  
- 字符输出流:Writer 抽象类  
- 字符输入流:Reader 抽象类

### 字节流读取

> `new String(bytes, 0, len)` 必须设置读取多少内容转多少内容, 否则会按照 bytes 长度转换  

```java
public static void main(String[] args) throws IOException {  
    FileInputStream fileInputStream = new FileInputStream("module1\\readme.txt");  
  
    byte[] bytes = new byte[2];  
    int len;  
    while ((len = fileInputStream.read(bytes)) != -1) {  
        System.out.println(new String(bytes, 0, len));  
    }  
  
    fileInputStream.close();  
}
// ab cd e
// 错误: ab cd ed (残留上次读取的数据)
```

### 字节流写入

```java
public static void main(String[] args) throws IOException {  
    FileInputStream fileInputStream = new FileInputStream("module1\\img-001.jpg");  
    FileOutputStream fileOutputStream = new FileOutputStream("module1\\img-002.jpg");  
  
    byte[] bytes = new byte[1024];  
    int len;  
    while ((len = fileInputStream.read(bytes)) != -1) {  
        fileOutputStream.write(bytes, 0, len);  
    }  
  
    fileInputStream.close();  
    fileOutputStream.close();  
}
```

### 字符流写入

```java
public static void main(String[] args) throws IOException {  
    FileWriter fileWriter = new FileWriter("module1\\readme.txt");  
      
    fileWriter.write("This is a readme.txt"); 
    // 将缓冲区数据刷到文件中, 流对象还可以使用 
    fileWriter.flush();  
    // 将缓冲区数据刷到文件中, 流对象关闭
    fileWriter.close();  
}
```

## 关闭流

jdk7 之前

```java
FileWriter fileWriter = null;  
try {  
    fileWriter = new FileWriter("module1\\readme.txt");  
  
    fileWriter.write("This is a readme.txt");  
} catch (IOException e) {  
    e.printStackTrace();  
} finally {  
    if (fileWriter != null) {  
        try {  
            fileWriter.close();  
        } catch (IOException e) {  
            e.printStackTrace();  
        }  
    }  
}
```

jdk7 之后  
自动刷新和换流

```java
try(FileWriter fileWriter = new FileWriter("module1\\readme.txt");) {  
    fileWriter.write("This is a readme.txt");  
} catch (IOException e) {  
    e.printStackTrace();  
}
```

> jkd9 之后, 可以在外部初始化 流,然后将初始化的对象放到 `try()` 里

## 缓冲流

`FileInputStream` 和 `FileOutputStream` 是 native 方法,与硬盘直接交互,效率不高  
缓冲流底部会自动关闭基本流

字节缓冲流

```java
long startTime = System.currentTimeMillis();  
  
FileInputStream fis = new FileInputStream("module1\\readme.txt");  
FileOutputStream fos = new FileOutputStream("module1\\readme.txt");  
  
BufferedInputStream bis = new BufferedInputStream(fis);  
BufferedOutputStream bos = new BufferedOutputStream(fos);  
  
int len;  
while ((len = bis.read()) != -1) {  
    bos.write(len);  
}  
long endTime = System.currentTimeMillis();  
long elapsedTime = endTime - startTime;  
System.out.println(elapsedTime);  

bis.close();  
bos.close();
```

字符缓冲流

```java
BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter("module1\\readme.txt", true));  
bufferedWriter.write("床前明月光");  
bufferedWriter.newLine();  
  
bufferedWriter.write("疑是地上霜");  
bufferedWriter.newLine();  
  
bufferedWriter.write("举头望明月");  
bufferedWriter.newLine();  
  
bufferedWriter.write("低头思故乡");  
bufferedWriter.newLine();  
  
bufferedWriter.close();  
  
BufferedReader bufferedReader = new BufferedReader(new FileReader("module1\\readme.txt"));  
String line = null;  
while ((line = bufferedReader.readLine()) != null) {  
    System.out.println(line);  
}  
bufferedReader.close();
```

## 转换流

字节流通向字符流的桥梁

```java
    public static void main(String[] args) throws IOException {
        InputStreamReader inputStreamReader = new InputStreamReader(
                new FileInputStream("D:\\Projects\\demo\\demo-java\\module1\\readme.txt"),
//                Files.newInputStream(Paths.get("module1\\readme.txt")),
                StandardCharsets.UTF_8
        );
        int data;
        while ((data = inputStreamReader.read()) != -1) {
            System.out.print((char) data);
        }
        inputStreamReader.close();
    }
```

## 序列化流

打乱数据, 阻止阅读  
对应的对象类必须实现 `Serializable` 接口  
序列化时跳过 `transient` 修饰的字段

```java
ObjectOutputStream oow = new ObjectOutputStream(  
//  new FileOutputStream("module1\\readme1.txt"));  
	Files.newOutputStream(Paths.get("module1\\readme1.txt")));  
Person person = new Person("张三", 19);  
oow.writeObject(person);  
oow.close();  

ObjectInputStream ois = new ObjectInputStream(  
//  new FileInputStream("module1\\readme1.txt"));  
	Files.newInputStream(Paths.get("module1\\readme1.txt")));  
Object o = ois.readObject();  
System.out.println(o);  
ois.close();
```

> 反序列化冲突问题

实现 `Serializable` 的类, 会在类中生成一个序列号, 反序列化时会比较文件中和类中的序列号  
修改类的源码会导致序列号变化, 比对时会失败  
**解决:**

```java
// 在对应类中直接手动声明序列号
public static final long serialVersionID = 42L;
```

## 打印流

```java
PrintStream printStream = new PrintStream(new FileOutputStream("module1\\readme.txt", true));  
// 控制流向  
System.setOut(printStream);  
  
System.out.println("我劝天空重抖擞");  
System.out.println("不拘一格降人才");  
printStream.close();
```