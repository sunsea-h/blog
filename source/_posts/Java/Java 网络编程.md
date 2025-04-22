---
title: Java 网络编程
date: 2024-07-09 23:26:17
updated: 2024-07-11 23:49:47
---

# Java 网络编程

## UDP 编程

### 客户端 (发送端)

```java
public static void main(String[] args) throws IOException {  
    DatagramSocket socket = new DatagramSocket();  
    byte[] buf = "你好呀".getBytes();  
    InetAddress ip = InetAddress.getByName("127.0.0.1");  
    DatagramPacket packet = new DatagramPacket(buf, buf.length, ip, 1234);  
    socket.send(packet);  
    socket.close();  
}
```

### 服务端 (接收端)

```java
public static void main(String[] args) throws IOException {  
    DatagramSocket socket = new DatagramSocket(1234);  
  
    byte[] buf = new byte[1024];  
    DatagramPacket packet = new DatagramPacket(buf, buf.length);  
  
    socket.receive(packet);  
    byte[] data = packet.getData();  
    int length = packet.getLength();  
    InetAddress address = packet.getAddress();  
    int port = packet.getPort();  
    System.out.println(new String(data, 0, length));  
    System.out.println(address+"..."+port);  
    socket.close();  
}
```

## TCP 编程

例: 文件上传

### 客户端

```java
public static void main(String[] args) throws IOException {  
    Socket socket = new Socket("127.0.0.1", 6666);  
    FileInputStream fis = new FileInputStream("D:\\15735\\Pictures\\pc\\39er53.jpg");  
    OutputStream outputStream = socket.getOutputStream();  
    byte[] bytes = new byte[1024];  
    int len;  
    while ((len = fis.read(bytes)) != -1) {  
        outputStream.write(bytes, 0, len);  
    }  
    // 传递结束标记
    socket.shutdownOutput();  
    InputStream inputStream = socket.getInputStream();  
    byte[] bytes1 = new byte[1024];  
    int len1 = inputStream.read(bytes1);  
    System.out.println(new String(bytes1, 0, len1));  
  
    fis.close();  
    outputStream.close();  
    inputStream.close();  
    socket.close();  
}
```

### 服务端

```java
public static void main(String[] args) throws IOException {  
    ServerSocket serverSocket = new ServerSocket(6666);  
    Socket socket = serverSocket.accept();  
    InputStream inputStream = socket.getInputStream();  
    FileOutputStream fileOutputStream = new FileOutputStream("D:\\Projects\\demo\\demo-java\\module1\\src\\com\\sunsea\\tcp\\test.jpg");  
    byte[] bytes = new byte[1024];  
    int len;  
    while ((len = inputStream.read(bytes)) != -1) {  
        fileOutputStream.write(bytes, 0, len);  
    }  
    OutputStream outputStream = socket.getOutputStream();  
    outputStream.write("图片上传成功".getBytes());  
  
    fileOutputStream.close();  
    inputStream.close();  
    outputStream.close();  
    socket.close();  
    serverSocket.close();  
}
```