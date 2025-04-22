---
title: Node.js 网络
date: 2025-03-19 15:14:19
updated: 2025-04-10 14:55:20
---
# Node.js 网络

## TCP 客户端

```js
const assert = require('assert');
const net = require('net');
let clients = 0;
let expectedAssertions = 2;

const server = net.createServer(function (client) {
  clients++;
  const clientId = clients;
  console.log('Client connected:', clientId);

  client.on('end', function () {
    console.log('Client disconnected:', clientId);
  });

  client.write('Welcome client: ' + clientId);
  client.pipe(client);
});

server.listen(8000, function () {
  console.log('Server started on port 8000');

  runTest(1, function () {
    runTest(2, function () {
      console.log('Tests finished');
      assert.equal(0, expectedAssertions);
      server.close();
    });
  });
});

function runTest(expectedId, done) {
  const client = net.connect(8000);

  client.on('data', function (data) {
    console.log('Received data:', data.toString());
    const expected = 'Welcome client: ' + expectedId;
    assert.equal(data.toString(), expected);
    expectedAssertions--;
    client.end();
  });

  client.on('end', done);
}
```

## UDP 客户端 - 文件发送服务

*Client*

```js
const path = require('path');
const dgram = require('dgram');
const fs = require('fs');
const port = 41230;
const defaultSize = 16;

function Client(remoteIP) {
  // 修改文件流读取配置
  const inStream = fs.createReadStream(path.resolve(__dirname, 'test.txt'), {
    encoding: 'utf8' // 保持显式编码声明
  });
  const socket = dgram.createSocket('udp4'); // 创建新的数据流 socket 作为客户端

  inStream.on('readable', function () {
    sendData(); // 当可读流准备好，开始发送数据到服务器
  });

  function sendData() {
    const message = inStream.read(defaultSize);

    if (!message) {
      return socket.unref();
    }

    // 新增Buffer转换和长度计算
    const buffer = Buffer.from(message, 'utf8'); // 显式转换为UTF8编码Buffer
    console.log(message); // 客户端保持字符串输出

    socket.send(
      buffer,  // 改用Buffer发送
      0,
      buffer.byteLength, // 使用字节长度代替字符长度
      port,
      remoteIP,
      function () {
        sendData();
      }
    );
  }
}
new Client(process.argv[2]);
```

*Server*

```js
const dgram = require('dgram');
const port = 41230;

function Server() {
  const socket = dgram.createSocket('udp4'); // 创建一个 socket 提供服务

  socket.on('message', function (msg) {
    // 保持当前UTF8解码方式
    process.stdout.write(msg.toString('utf8'));
  });

  socket.on('listening', function () {
    console.log('Server ready:', socket.address());
  });

  socket.bind(port);
}

new Server();

```

## HTTP 客户端

```js

```
