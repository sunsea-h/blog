---
title: NodeJS
categories:
  - NodeJS
date: 2022-09-26 09:27:58
updated: 2024-12-24 14:31:36
---
# NodeJS

## 原理

javaScript 之前只作为一种脚本语言，运行在浏览器环境中，用于处理浏览器中的 DOM 事件，本身不存在 IO 操作。Node.js 使 JavaScript 可以运行在服务器上，拥有操作磁盘文件等功能。  
DIRT：Node 所针对的应用程序简称，数据密集型实时程序（data-intensive real-time）。

### nodejs 环境和浏览器环境的区别

**浏览器环境**  
![](NodeJS.assets/file-20241224142915421.png)  
V8 引擎负责解析 JS 代码；Blink 是浏览器内核，解析 HTML/CSS 中的元素，确定元素的位置。  

**Node 环境**  
![](NodeJS.assets/file-20241224142945788.png)  
只有 V8 引擎，负责解析 JS 代码。    

**总结**：    
1. 相比浏览器，没有 DOM 和 BOM 。      
2. 考虑到安全性，浏览器不支持跨域请求和文件读写功能；而 Node 可以直接操作文件系统、进行进程管理和跨域请求。    

### 特点

1. 采用单线程模式。  
传统服务器产生一次请求对应一个线程，因为数据请求比较慢，所以会造成许多线程在缓存中等待，造成内存浪费；采用单线程则可以节省空间。但是因为是单线程，所以请求太多时会处理不过来。  
2. 采用了事件驱动、非阻塞和异步模型等技术提高性能。  

### 事件驱动  

![](NodeJS.assets/file-20241224143001550.png)  

**事件循环**（ Event Loop ） 类似于 while(true) 循环，每次执行循环体的过程成为 Tick 。每次 Tick 都会查看是否有事件待处理，有则获取事件及相关回调函数进行执行。然后进入下次循环，直到没有事件待处理，则退出循环。  

1. Node.js 的单线程是指每个 Node.js 进程只有一个主线程执行代码，形成一个执行栈。  
2. 主线程外还有一个事件队列（ Event Queue ），当出现网络请求或其他异步操作时，会被放入事件队列中，等待主线程代码执行完毕。  
3. 主线程代码执行完毕后，会通过事件循环机制（ Event Loop ），从事件队列头部获取一个事件，从线程池分配线程去处理，直到队列为空。
4. 每当队列有新事件都会通知主线程，然后执行 Event Loop 。当事件都执行完后，通知主线程执行回调，线程回归线程池。

总结：JS 主线程只负责不断往返调度，阻塞操作都交由内部线程池处理，由事件循环不断驱动事件执行，从而实现 **异步非阻塞 IO** 。  

## 全局变量

### process

```js
// 获取平台信息
process.arch // x64
process.platform // win32

// 获取内存使用情况
process.memoryUsage();

// 获取命令行参数
process.argv

// 延迟执行：下次事件轮询队列头部执行回调
process.nextTick(func);

// 环境变量对象
process.env

// 特殊事件
// 退出
process.on('exit',function(code){
	console.log('Exiting...')
})
// 未捕获的错误
process.on('uncaughtException',function(error){
	console.error(error.message);
	// 在事件最后必须手动退出进程
	process.exit(1);
})
```

### exports 和 module.exports

默认情况下，exports 和 module.exports 指向同一个对象。  
每个模块文件都有一个 module 的对象。  

![](NodeJS.assets/file-20241224143034481.png)

其中含有一个 exports 的空对象，每个模块文件最后都会执行 `return module.exports` 返回这个对象。  
exports 其实是 module.exports 的一个引用，执行了 `var exports=module.exports` ，用于简化编写。但本质还是返回 module.exports 对象，所以不能直接给 exports 赋值，会改变引用。  
尽量给对象添加属性，如： `exports.name = 'zhangsan'` ，而不是直接赋值。  

### require

所有模块缓存在 require.cache 中。  
缓存针对绝对路径识别模块，路径不同模块名相同也会重新加载。  

```js
// 删除缓存
delete require.cache[modulename];

Object.keys(require.cache).forEach(function(key){
	delete require.cache[key]
})

// require.main 
// 判断是 直接执行 还是 被调用执行
require.main===module
```

## 流程控制

### 串行化

串行执行任务：
1. 确保包含 RSS 预订源列表的文件存在
2. 读取并解析文件中的预订源
3. 向预订源发送请求获取数据
4. 将预订源的数据解析到一个数组中

```js
const fs = require('fs');
const path = require('path');
const request = require('request');
const htmlparser = require('htmlparser');

const configFilename = path.resolve(__dirname, './rss-feeds.txt');

function checkForRSSFile() {
  fs.exists(configFilename, function (exist) {
    if (!exist) {
      return next(new Error(`Miss RSS File: ${configFilename}`));
    }
    next(null, configFilename);
  });
}

function readRSSFile(configFilename) {
  fs.readFile(configFilename, function (err, feedList) {
    if (err) {
      return next(err);
    }
    feedList = feedList
      .toString()
      .replace(/^\s+|\S+$/g, '')
      .split('\n');
    console.log(feedList);
    const random = Math.floor(Math.random() * feedList.length);
    next(null, feedList[random]);
  });
}

function downloadRSSFeed(feedUrl) {
  console.log(feedUrl);
  request({ uri: feedUrl }, function (err, res, body) {
    if (err) {
      return next(err);
    }
    if (res.statusCode !== 200) {
      return next(new Error(`Abnormal response status code!`));
    }
    next(null, body);
  });
}

function parserRSSFeed(rss) {
  const handler = new htmlparser.RssHandler();
  const parser = new htmlparser.Parser(handler);
  parser.parseComplete(rss);

  if (!handler.dom.items.length) {
    return next(new Error(`No rss items found!`));
  }
  const item = handler.dom.items.shift();
  console.log(item.title, ':', item.link);
}

const tasks = [
  checkForRSSFile,
  readRSSFile,
  downloadRSSFeed,
  parserRSSFeed
];

function next(err, result) {
  if (err) {
    throw err;
  }
  const currentTask = tasks.shift();
  if (currentTask) {
    currentTask(result);
  }
}

next();
```

### 并行化

并行读取文件夹中的所有文件，并统计其中单词出现的次数。  
每个任务需要读取文件，并在回调中执行 `checkIfComplete()` 和 `countWordsInText()`。

```js
const fs = require('fs');
const path = require('path');

const tasks = [];
let completedTasks = 0;
let wordCounts = {};
const filesDir = path.resolve(__dirname, './text');

// 检查是否执行完成
function checkIfComplete() {
  completedTasks++;
  if (completedTasks === tasks.length) {
    for (const word in wordCounts) {
      console.log(`${word}:${wordCounts[word]}`);
    }
  }
}

// 统计单词出现次数
function countWordsInText(text) {
  const words = text
    .toString()
    .toLowerCase()
    .split(/\W+/)
    .sort();
  for (let index in words) {
    const word = words[index];
    if (word) {
      wordCounts[word] = (wordCounts[word]) ? wordCounts[word] + 1 : 1;
    }
  }
}

fs.readdir(filesDir, function (err, files) {
  if (err) {
    throw err;
  }
  for (let index in files) {
    const task = (function (file) {
      return function () {
        fs.readFile(file, function (err, data) {
          if (err) {
            throw err;
          }
          countWordsInText(data);
          checkIfComplete();
        });
      };
    })(`${filesDir}/${files[index]}`);
    tasks.push(task);
  }
  for (let task in tasks) {
    tasks[task]();
  }
});
```

### 三方工具库

- Nimble
- Step
- Seq

## 模块化（Modules）

nodejs 采用模块化的方式，一个 js 文件就是一个模块，模块之间相互独立，也可以相互引用。  
nodejs 遵守 CommonJS 规范，module.exports 和 exports。通过 `require()` 导入别的模块中 `module.exports` 中的属性。  
而 export 和 export default 是 ES6 模块规范。  
>**CommonJS 规范**  
>1.每个文件都是一个模块。  
>2.模块内使用 global 变量不用导出，其他文件也可访问。  
>3.模块内部 module 对象代表模块本身，其 exports 属性是对外接口。  
>4.**模块加载机制：**  
>返回模块的 exports 对象。  
>输入的是被输出的值的拷贝。即一旦输出，模块内部变化影响不到输出的值。  

```js
(funciton(exports, require, module, __filename, __dirname) { // 包装头
  console.log('hello world!') // 原始文件
}); // 包装尾
```

### 查找模块步骤  

![](NodeJS.assets/image-20230331100957638.png)

## buffer 缓冲区

JavaScript 开始只用于浏览器环境，由于安全问题，不具备文件读写能力，也无法操作二进制数据流。Node.js 为了可以读取和操作文件或二进制数据流，引入了 Buffer 类，用于专门创建一个存放二进制数据的缓冲区。  
Buffer 对象是在内存中单独分配一块区域，而不是在 V8 的堆内存。分配和释放仍然是 Node 层面进行控制。  

```js
var buf1 = Buffer.alloc(256);
buf1.write('The Quick Brown Fox Jumps Over The Lazy Dog')
console.log(buf1.toString());
console.log(JSON.stringify(buf1));
```

![](NodeJS.assets/file-20241224143057978.png)

上述代码实现了缓冲区的创建、写入和输出。V6.0 之前是使用 `new Buffer()` 创建，但因为分配的内存未初始化时可能存在敏感信息，之后都使用 `Buffer.from()` 或 `Buffer.alloc()` 创建，前者接受一个元素是数字的数组、Buffer 实例或 string 值进行初始化，后者接受一个数字进行初始化，默认使用 0 进行内存初始化。

在输出缓冲区中的内容时， 使用 **Buffer.toString([encoding, start, end])** 转化为字符串，默认为 utf-8 格式。不确认缓冲区编码格式可以使用 **Buffer.isEncoding(encoding)** 判断。 

在使用 `JSON.stringify()` 转换为 JSON 对象时，实际上隐式调用了 `Buffer.toJSON()` 。

扩展：Buffer 还可以进行缓冲区合并 ( `buf1.concat()` )、比较 ( `buf1.compare()` )、拷贝 ( `buf1.copy()` ) 和裁剪 ( `buf1.slice()` ) 等操作。  

### dataURI

```js
// 生成 data URI
const fs = require('fs');
const mime = 'image/png';
const encoding = 'base64';
const base64Data = fs.readFileSync(`${__dirname}/monkey.png`).toString(encoding);
const uri = `data:${mime};${encoding},${base64Data}`;
console.log(uri);

// data URI 转文件
const fs = require('fs');
const uri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA...';
const base64Data = uri.split(',')[1];
const buf = Buffer(base64Data, 'base64');
fs.writeFileSync(`${__dirname}/secondmonkey.png`, buf);
```

## events 事件触发器

某些类型的对象 (触发器) 会周期性的触发命名事件来调用函数对象 (监听器)。  
- [`net.Server`](https://www.nodeapp.cn/net.html#net_class_net_server) 对象会在每次有新连接时触发事件；  
- [`fs.ReadStream`](https://www.nodeapp.cn/fs.html#fs_class_fs_readstream) 会在文件被打开时触发事件；  
- [流对象](https://www.nodeapp.cn/stream.html) 会在数据可读时触发事件。  

```js
const EventEmitter = require('events').EventEmitter;

const AudioDevice = {
  play: function (track) {
    console.log('play', track);
  },
  stop: function () {
    console.log('stop');
  },
};

class MusicPlayer extends EventEmitter {
  constructor() {
    super();
    this.playing = false; 
  }
}

const musicPlayer = new MusicPlayer();
musicPlayer.on('play', function (track) {
  this.playing = true;
  AudioDevice.play(track);
});
musicPlayer.on('stop', function () {
  this.playing = false;
  AudioDevice.stop();
});

musicPlayer.emit('play', 'The Roots - The Fire');
setTimeout(function () {
  musicPlayer.emit('stop');
}, 1000);

// 处理异常
// EventEmitter 实例发生错误会发出一个 error 事件
// 如果没有监听器，默认动作是打印一个堆栈并退出程序
musicPlayer.on('error', function (err) {
  console.err('Error:', err);
});
```

### this

普通函数的监听器，this 指向监听器所附加的 `EventEmitter` 实例，箭头函数不会指向实例。  

### 只执行一次

使用 `eventEmitter.once()` 注册只执行一次的监听器 (触发后注销)。  

### 异步与同步

按照注册顺序同步执行监听器。  
通过 `setImmediate` 和 `process.nextTick` 实现异步调用。  

```js
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  setImmediate(() => {
    console.log('这个是异步发生的');
  });
});
myEmitter.emit('event', 'a', 'b');
```

### 错误事件

需要为 EventEmitter 注册至少一个 `error` 监听器,否则会抛出错误、打印堆栈、退出进程。  

### EventEmitter 类

由 events 模块定义导出。  
`newListener`：所有 EventEmitter 添加监听器之前触发。在插入同名监听器时，会插入在之前同名监听器之前。  
`removeListener`：监听器移出之后触发。  

```js
const myEmitter = new MyEmitter();
// 只处理一次，所以不会无限循环
myEmitter.once('newListener', (event, listener) => {
  if (event === 'printevent') {
    // 在开头插入一个新的监听器
    myEmitter.on('printevent', () => {
      console.log('B');
    });
  }
});
myEmitter.on('printevent', () => {
  console.log('A');
});
myEmitter.emit('printevent');
// 打印:
//   B
//   A
```

`EventEmitter.defaultMaxListeners`：设置所有 EventEmitter 的默认监听器数量 (默认 10，超出提示警告)。  
`emitter.setMaxListeners()`：设置单个实例的默认监听器数量。可用于消除警告。  

```js
emitter.setMaxListeners(emitter.getMaxListeners() + 1);
emitter.once('event', () => {
  // 做些操作
  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
});
```

`emitter.removeListener()`：  
1.每次删除一个监听器实例，有多个同名监听器，需要执行多次。  
2.事件被触发会执行所有绑定的监听器，在触发之后到最后一个监听器执行完成之前，`removeListener()` 和 `removeAllListener()` 都不会影响该事件的监听器。  
3.会更改监听器数组中被移除监听器之后注册的监听器的位置索引，`emitter.listeners()` 返回监听器数组的任何副本需要重新创建。  
4.单个函数多次添加为单个事件的句柄，会删除最近添加的实例。  

[更多方法](https://www.nodeapp.cn/events.html#events_emitter_addlistener_eventname_listener) [更多方法(印记中文)](http://nodejs.cn/api-v16/events.html#emitteraddlistenereventname-listener)  

**简易实时聊天**

```js
const net = require('net');
const events = require('events');

const channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};
channel.dataInput = {};

channel.on('join', function (id, client) {
  this.clients[id] = client;
  this.subscriptions[id] = function (senderId, message) {
    if (id != senderId) {
      this.clients[id].write(message);
    }
  };
  this.dataInput[id] = '';
  this.on('broadcast', this.subscriptions[id]);
});

channel.on('leave', function (id) {
  channel.removeListener('broadcast', this.subscriptions[id]);
  channel.emit('broadcast', id, `${id} has left the chat.\n`);
});

channel.on('shutdown', function () {
  channel.emit('broadcast', '', `Chat has shut down.\n`);
  channel.removeAllListeners('broadcast');
});

channel.on('join', function (id, client) {
  const welcome = `Welcome!\nGuests online: ${this.listeners('broadcast').length}`;
  client.write(`${welcome}\n`);
});

const server = net.createServer(function (client) {
  const id = `${client.remoteAddress}:${client.remotePort}`;

  // 新版本取消connect事件
  // client.on('connect', function () {
  //   channel.emit('join', id, client);
  // });
  // 直接触发join
  channel.emit('join', id, client);

  client.on('data', function (data) {
    data = data.toString();
    channel.dataInput[id] += data;
    channel.emit('broadcast', id, data);
    if (channel.dataInput[id].indexOf('shutdown\r\n') !== -1) {
      channel.emit('shutdown');
    }
  });

  client.on('close', function () {
    channel.emit('leave', id);
  });
});

server.listen(8888, function () {
  console.log(`Server has start on port:8888`);
});
```

注意：

```js
channel.on('error', function (err) {
  console.log('ERROR: ', err.message);
})

channel.emit('error', new Error('Something is wrong.'))
```

其中，error 事件比较特殊，如果触发了 error 事件，但没有相应监听器，则会输出一个堆栈跟踪并停止执行，堆栈跟踪会用 emit 调用的第二个参数指明错误类型。  
其他事件类型没有监听器时，什么也不会做。

## util 实用工具

### promisify

采用常见的错误优先的回调风格 (`(error,value)=>...`)，返回一个 **返回 promise** 的版本。  

```js
const util = require('node:util');
const fs = require('node:fs');

const stat = util.promisify(fs.stat);
stat('.').then((stats) => {
  // 使用 `stats` 做些事情
}).catch((error) => {
  // 处理错误。
});

// 等同于
const util = require('node:util');
const fs = require('node:fs');

const stat = util.promisify(fs.stat);

async function callStat() {
  const stats = await stat('.');
  console.log(`This directory is owned by ${stats.uid}`);
}
```

## http 超文本传输协议

```js
const http = require('http');
const fs = require('fs');

http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  fs.createReadStream('./image.png').pipe(res);
}).listen(3000, function () {
  console.log('Server running at http://localhost:3000/');
});


// 或
const server = http.createServer();
server.on('request', function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
});
server.listen(3000, function () {
  console.log('Server running at http://localhost:3000/');
});
```

### 响应头

需要在 `res.write()` 和 `res.end()` 之前设置。  
在 `writeHead()` 之前调用 `setHeader()`，则请求头会合并，`writeHead()` 设置的优先。  
`writeHead()` 设置的请求头不缓存，直接写入，通过 `getHeader()` 获取不到。
- `Content-Type: text/html`，告知浏览器将响应结果作为 HTML 渲染。
- `Content-Length`，字节长度 (`Buffer.byteLength()`) 隐含禁用 node 的块编码，传输更少的数据，可提升性能。

### 使用 HTTPS 加强安全性

```shell
# 生成私钥
openssl genrsa 1024 > key.pem
# 生成证书（包含公钥和持有人信息）
openssl req -x509 -new key.pem > key-cert.pem
```

## stream 流

基于事件实现的一个实例，可读写。  

```js
const http = require('http');
const fs = require('fs');

http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  // 使用流
  // pipe()管道：数据 流向目标
  fs.createReadStream('./image.png').pipe(res);
}).listen(3000);

console.log('Server running at http://localhost:3000/');
```

### 流的类型

- 内置：许多核心模块都实现了流接口，如 `fs.createReadStream`
- HTTP：处理网络技术的流
- 解释器：第三方模块 XML、JSON 解释器
- 浏览器：Node 流可以被拓展使用在浏览器
- Audio：流接口的声音模块
- RPC（远程调用）：通过网络发送流是进程间通信的有效方式
- 测试：使用流的测试库

### 使用内建流 API

#### 静态 web 服务器

需要通过网络高效且支持大文件的发送一个文件到客户端。  

##### 不使用流

```js
const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
  fs.readFile(`${__dirname}/index.html`, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end(String(err));
      return;
    }

    res.end(data);
  });
}).listen(8000);
```

##### 使用流

```js
const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
  fs.createReadStream(`${__dirname}/index.html`).pipe(res);
}).listen(8000);
```

##### 使用流 +gzip

```js
const http = require('http');
const fs = require('fs');
const zlib = require('zlib');

http.createServer((req, res) => {
  res.writeHead(200, {
    'content-encoding': 'gzip',
  });
  fs.createReadStream(`${__dirname}/index.html`)
    .pipe(zlib.createGzip())
    .pipe(res);
}).listen(8000);
```

#### 流的错误处理

```js
const fs = require('fs');
const stream = fs.createReadStream('not-found');

stream.on('error', (err) => {
  console.trace();
  console.error('Stack:', err.stack);
  console.error('The error raised was:', err);
});
```

### 使用流基类

#### 可读流 - JSON 行解释器

继承 `stream.Readable`，实现 `_read` 方法。  
*json-lines.txt*

```json
{ "position": 0, "letter": "a" }
{ "position": 1, "letter": "b" }
{ "position": 2, "letter": "c" }
{ "position": 3, "letter": "d" }
{ "position": 4, "letter": "e" }
{ "position": 5, "letter": "f" }
{ "position": 6, "letter": "g" }
{ "position": 7, "letter": "h" }
{ "position": 8, "letter": "i" }
{ "position": 9, "letter": "j" }
```

*JSONLineReader.js*

```js
const stream = require('stream');
const fs = require('fs');
const util = require('util');

class JSONLineReader extends stream.Readable {
  constructor(source) {
    super();
    this._source = source;
    this._foundLineEnd = false;
    this._buffer = '';

    source.on('readable', () => {
      this.read();
    });
  }

  // 所有定制 stream.Readable 类都需要实现 _read 方法
  _read(size) {
    let chunk;
    let line;
    let result;

    if (this._buffer.length === 0) {
      chunk = this._source.read();
      this._buffer += chunk;
    }

    const lineIndex = this._buffer.indexOf('\n');

    if (lineIndex !== -1) {
      line = this._buffer.slice(0, lineIndex); // 从 buffer 的开始截取第一行来获取一些文本进行解析
      if (line) {
        result = JSON.parse(line);
        this._buffer = this._buffer.slice(lineIndex + 1);
        this.emit('object', result); // 当一个 JSON 记录解析出来的时候，触发一个 object 事件
        this.push(util.inspect(result)); // 将解析好的 JSON 发回内部队列
      } else {
        this._buffer = this._buffer.slice(1);
      }
    }
  }
}

const input = fs.createReadStream(`${__dirname}/json-lines.txt`, {
  encoding: 'utf8',
});
const jsonLineReader = new JSONLineReader(input); // 创建一个 JSONLineReader 实例，传递一个文件流给它处理

jsonLineReader.on('object', (obj) => {
  console.log('pos:', obj.position, '- letter:', obj.letter);
});
```

#### 可写流 - 文字变色

继承 `stream.Writable`，实现 `_write` 方法。  

```js
cat json-lines.txt | node stram_writable.js
```

*stram_writable.js*

```js
const stream = require('stream');

class GreenStream extends stream.Writable {
  constructor(options) {
    super(options);
  }

  _write(chunk, encoding, cb) {
	  // console.log 的底层原理
    process.stdout.write(`\u001b[32m${chunk}\u001b[39m`);
    cb();
  }
}

process.stdin.pipe(new GreenStream());
```

#### 双工流 - 接受和转换数据

继承 `stream.Duplex`，实现 `_read` 和 `_write` 方法。  

#### 转换流 - 解析数据

继承 `stream.Transform`，实现 `_transform` 方法。  

## fs 文件系统

### 读写流

```js
const fs = require('fs');
const readable = fs.createReadStream('./original.txt');
const writeable = fs.createWriteStream('./copy.txt');
readable.pipe(writeable);
```

### 同步读取与 require

```js
// 同步读取
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json').toString());
init(config);

// require
const config = require('./config.json);
init(config);
```

require 会全局加载，其他文件也加载并修改时会影响所有加载该文件的模块。  
可以使用 `Object.freeze` 冻结。  

### 文件描述

文件描述是通过 `open()` 和 `openSync()` 打开文件返回的一个用于查看文件的整数。  

### 文件锁

保证多个进程访问同一个文件时，文件的完整性和数据不丢失。  
**分类**：  
- 强制锁（内核级别执行）
- 咨询锁（非强制，只在涉及到进程订阅了相同的锁机制）
- 使用锁文件

**Node 实现锁文件**  
1.独占标记  

```js
// 所有需要打开文件的方法，fs.writeFile、fs.createWriteStream、fs.open 都有一个 x 标记
// 这个文件应该已独占打开，若这个文件存在，文件不能被打开
fs.open('config.lock', 'wx', (err) => {
  if (err) { return console.err(err); }
});

// 最好将当前进程号写进文件锁中
// 当有异常的时候就知道最后这个锁的进程
fs.writeFile(
  'config.lock',
  process.pid,
  { flogs: 'wx' },
  (err) => {
    if (err) { return console.error(err) };
  },
);
```

2.mkdir 文件锁  
独占标记会出现有的系统识别不了 `0_EXCL` 标记；可以把锁文件换成一个目录，PID 可以写入这个目录的一个文件。  

```js
fs.mkidr('config.lock', (err) => {
  if (err) { return console.error(err); }
  fs.writeFile(`/config.lock/${process.pid}`, (err) => {
    if (err) { return console.error(err); }
  });
});
```

3.lock 模拟实现  

```js
const fs = require('fs');
const lockDir = 'config.lock';
let hasLock = false;

exports.lock = function (cb) { // 获取锁
  if (hasLock) { return cb(); } // 已经获取了一个锁
  fs.mkdir(lockDir, function (err) {
    if (err) { return cb(err); } // 无法创建锁

    fs.writeFile(lockDir + '/' + process.pid, function (err) { // 把 PID写入到目录中以便调试
      if (err) { console.error(err); } // 无法写入 PID，继续运行
      hasLock = true; // 锁创建了
      return cb();
    });
  });
};

exports.unlock = function (cb) { // 解锁方法
  if (!hasLock) { return cb(); } // 如果没有需要解开的锁
  fs.unlink(lockDir + '/' + process.pid, function (err) {
    if (err) { return cb(err); }

    fs.rmdir(lockDir, function (err) {
      if (err) return cb(err);
      hasLock = false;
      cb();
    });
  });
};

process.on('exit', function () {
  if (hasLock) {
    fs.unlinkSync(lockDir + '/' + process.pid); // 如果还有锁，在退出之前同步删除掉
    fs.rmdirSync(lockDir);
    console.log('removed lock');
  }
});
```

### 逐行读取文件流

```js
const fs = require('fs');
const readline = require('readline');

// 一般用于监听 line 事件
const rl = readline.createInterface({
	// 监听的可读流，必输
  input: fs.createReadStream('/etc/hosts'),
  // \r 和 \n 之间的延迟时间，Infinity表示\r后跟\n总视为单个换行符
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  console.log(`cc ${line}`);
  const extract = line.match(/(\d+\.\d+\.\d+\.\d+) (.*)/);
});
```

## net 网络

### 获取本地 IP

```js
function get_local_ip() {
  const interfaces = require('os').networkInterfaces();
  let IPAdress = '';
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        IPAdress = alias.address;
      }
    }
  }
  return IPAdress;
}
```

### TCP 客户端

#### 启动与测试 TCP

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
    const expected = 'Welcome client: ' + expectedId;
    assert.equal(data.toString(), expected);
    expectedAssertions--;
    client.end();
  });

  client.on('end', done);
}
```

### UDP 客户端

#### 文件发送服务

```js
const dgram = require('dgram');
const fs = require('fs');
const port = 41230;
const defaultSize = 16;

function Client(remoteIP) {
  const inStream = fs.createReadStream(__filename); // 从当前文件创建可读流
  const socket = dgram.createSocket('udp4'); // 创建新的数据流 socket 作为客户端

  inStream.on('readable', function () {
    sendData(); // 当可读流准备好，开始发送数据到服务器
  });

  function sendData() {
    const message = inStream.read(defaultSize); // 读取数据块

    if (!message) {
      return socket.unref(); // 客户端完成任务后，使用 unref 安全关闭它
    }

    // 发送数据到服务器
    socket.send(message, 0, message.length, port, remoteIP, function () {
        sendData();
      }
    );
  }
}

function Server() {
  const socket = dgram.createSocket('udp4'); // 创建一个 socket 提供服务

  socket.on('message', function (msg) {
    process.stdout.write(msg.toString());
  });

  socket.on('listening', function () {
    console.log('Server ready:', socket.address());
  });

  socket.bind(port);
}

if (process.argv[2] === 'client') { // 根据命令行选项确定运行客户端还是服务端
  new Client(process.argv[3]);
} else {
  new Server();
}
```

### HTTP 客户端

#### 启动与测试 HTTP

```js
const assert = require('assert');
const http = require('http');

const server = http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' }); // 写入基于文本的响应头
  res.write('Hello, world.'); // 发送消息回客户端
  res.end();
});

server.listen(8000, function() {
  console.log('Listening on port 8000');
});

const req = http.request({ port: 8000 }, function(res) { // 创建请求
  console.log('HTTP headers:', res.headers);
  res.on('data', function(data) { // 给 data 事件创建监听，确保和期望值一致
    console.log('Body:', data.toString());
    assert.equal('Hello, world.', data.toString());
    assert.equal(200, res.statusCode);
    server.unref();
    console.log('测试完成');
  });
});

req.end();
```

#### 重定向

**状态码**：
- 300：多重选择
- 301：永久移动到新位置
- 302：找到重定向跳转
- 303：参见其他信息
- 304：没有改动
- 305：使用代理
- 307：临时重定向

```js
const http = require('http');
const https = require('https');
const url = require('url'); // 有很多接续 URLs 的方法

// 构造函数被用来创建一个对象来构成请求对象的生命周期
function Request() {
  this.maxRedirects = 10;
  this.redirects = 0;
}

Request.prototype.get = function(href, callback) {
  const uri = url.parse(href); // 解析 URLs 成为 Node http 模块使用的格式，确定是否使用 HTTPS
  const options = { host: uri.host, path: uri.path };
  const httpGet = uri.protocol === 'http:' ? http.get : https.get;

  console.log('GET:', href);

  function processResponse(response) {
    if (response.statusCode >= 300 && response.statusCode < 400) { // 检查状态码是否在 HTTP 重定向范围
      if (this.redirects >= this.maxRedirects) {
        this.error = new Error('Too many redirects for: ' + href);
      } else {
        this.redirects++; // 重定向计数自增
        href = url.resolve(options.host, response.headers.location); // 使用 url.resolve 确保相对路径的 URLs 转换为绝对路径 URLs
        return this.get(href, callback);
      }
    }

    response.url = href;
    response.redirects = this.redirects;

    console.log('Redirected:', href);

    function end() {
      console.log('Connection ended');
      callback(this.error, response);
    }

    response.on('data', function(data) {
      console.log('Got data, length:', data.length);
    });

    response.on('end', end.bind(this)); // 绑定回调到 Request 实例，确保能拿到实例属性
  }

  httpGet(options, processResponse.bind(this))
    .on('error', function(err) {
      callback(err);
    });
};

const request = new Request();
request.get('http://google.com/', function(err, res) {
  if (err) {
    console.error(err);
  } else {
    console.log(`
      Fetched URL: ${res.url} with ${res.redirects} redirects
    `);
    process.exit();
  }
});
```

#### HTTP 代理

#### 封装 request-promise

### DNS 请求

## cluster 集群

```js
const cluster = require('cluster');
const os = require('os');
const http = require('http');

const numCPUs = os.cpus.length;
const workers = [];
let requests = 0;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    workers[i] = cluster.fork();
    (function (i) {
      // 将新的请求总数发送给所有工人
      workers[i].on('message', function (message) {
        if (message.cmd === 'incrementRequestTotal') {
          requests++;
          for (let j = 0; j < numCPUs; j++) {
            workers[j].send({
              cmd: 'updateOfRequestTotal',
              requests
            });
          }
        }
      });
    })(i);
  }
  cluster.on('exit', function (worker, code, signal) {
    console.log('Worker ' + worker.process.pid + ' died.');
  });
} else {
  // 监听来自主进程的消息
  process.on('message', function (message) {
    if (message.cmd === 'updateOfRequestTotal') {
      requests = message.requests;
    }
  });
  http.Server(function (req, res) {
    res.writeHead(200);
    res.end(`Worker in process ${process.pid} says cluster has responsed to ${requests} requests.`);
    // 通知主进程请求总数增加了
    process.send({cmd: 'incrementRequestTotal'});
  });
}

```

## 数据存储

### 无服务器

**1.内存存储**  
使用变量存储在内存中。

**2.文件存储**

```js
const path = require('path');
const fs = require('fs');

const args = process.argv.splice(2);
const command = args.shift();
const taskDescription = args.join(' ');
const file = path.join(process.pwd(), './cli_tasks.js');

switch (command) {
  case 'list':
    listTasks(file);
    break;

  case 'add':
    addTasks(file, taskDescription);
    break;

  default:
    console.log(`Usage: ${process.argv[0]} list|add [taskDescription]`);
    break;
}

function loadOrInitializeTasksArray(file, cb) {
  fs.exists(file, function (exist) {
    if (exist) {
      fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
          throw err;
        }
        data = data.toString();
        const tasks = JSON.parse(data || '[]');
        cb(tasks);
      });
    } else {
      cb([]);
    }
  });
}

function listTasks(file) {
  loadOrInitializeTasksArray(file, function (tasks) {
    for (let i in tasks) {
      console.log(tasks[i]);
    }
  });
}

function storeTasks(file, tasks) {
  fs.writeFile(file, 'utf8', function (err) {
    if (err) {
      throw err;
    }
    console.log('Saved.');
  });
}

function addTasks(file, taskDescription) {
  loadOrInitializeTasksArray(file, function (tasks) {
    tasks.push(taskDescription);
    storeTasks(file, tasks);
  });
}
```

### 关系数据库

#### mysql

*timetrack_server.js*

```js
const http = require('http');
const mysql = require('mysql');
const work = require('./lib/timetrack');

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'timetrack'
});

const server = http.createServer(function (req, res) {
  switch (req.method) {
    case 'GET':
      switch (req.url) {
        case '/':
          work.show(db, res);
          break;

        case '/archived':
          work.showArchived(db, res);
          break;

        default:
          break;
      }
      break;

    case 'POST':
      switch (req.url) {
        case '/':
          work.add(db, req, res);
          break;

        case '/archive':
          work.archive(db, req, res);
          break;

        case '/delete':
          work.delete(db, req, res);
          break;

        default:
          break;
      }
      break;

    default:
      break;
  }
});

db.query(
  `CREATE TABLE IF NOT EXISTS work (
  id INT(10) NOT NULL AUTO_INCREMENT,
  hours DECIMAL(5,2) DEFAULT 0,
  date DATE,
  archived INT(1) DEFAULT 0,
  description LONGTEXT,
  PRIMARY KEY(id))`,
  function (err) {
    if (err) {
      throw err;
    }
    console.log('Server started...');
    server.listen(3000, '127.0.0.1');
  }
);
```

*timetrack.js*

```js
const qs = require('querystring');

/**
 * 发送HTML
 * @param {*} res 
 * @param {*} html 
 */
exports.sendHTML = function (res, html) {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(html));
  res.end();
};

/**
 * 接受表单数据
 * @param {*} req 
 * @param {*} cb 
 */
exports.parseRecivedData = function (req, cb) {
  let body = '';
  req.setEncoding('utf8');
  req.on('data', function (chunk) {
    body += chunk;
  });
  req.on('end', function () {
    const data = qs.parse(body);
    cb(data);
  });
};

/**
 * 创建表单
 * @param {*} id 
 * @param {*} path 
 * @param {*} label 
 * @returns 
 */
exports.actionForm = function (id, path, label) {
  const html = `<form action="${path}" method="post">
<input type="hidden" name="id" value="${id}" />
<input type="submit" value="${label}" />
</form>`;
  return html;
};

/**
 * 添加工作记录
 * @param {*} db 
 * @param {*} req 
 * @param {*} res 
 */
exports.add = function (db, req, res) {
  exports.parseRecivedData(req, function (work) {
    db.query(
      `INSERT INTO work (hours, date, description)
      VALUE (?,?,?)`,
      [work.hours, work.date, work.description],
      function (err) {
        if (err) {
          throw err;
        }
        exports.show(db, res);
      });
  });
};

/**
 * 删除工作记录
 * @param {*} db 
 * @param {*} req 
 * @param {*} res 
 */
exports.delete = function (db, req, res) {
  exports.parseRecivedData(req, function (work) {
    db.query(
      `DELETE FROM work WHERE id=?`,
      [work.id],
      function (err) {
        if (err) {
          throw err;
        }
        exports.show(db, res);
      });
  });
};

/**
 * 归档一条工作记录
 * @param {*} db 
 * @param {*} req 
 * @param {*} res 
 */
exports.archive = function (db, req, res) {
  exports.parseRecivedData(req, function (work) {
    db.query(
      `UPDATE work SET archive=1 WHERE id=?`,
      [work.id],
      function (err) {
        if (err) {
          throw err;
        }
        exports.show(db, res);
      }
    );
  });
};

/**
 * 获取工作记录
 * @param {*} db 
 * @param {*} res 
 * @param {*} showArchived 
 */
exports.show = function (db, res, showArchived) {
  const query = `SELECT * FROM work 
  WHERE archived=?
  ORDER BY date DESC`;
  const archiveValue = showArchived ? 1 : 0;
  db.query(query, [archiveValue], function (err, rows) {
    if (err) {
      throw err;
    }
    html = showArchived ? '' : `<a href='/archived>Archived work</a><br/>`;
    html += exports.workHitlistHtml(rows);
    html += exports.workFormHtml();
    exports.sendHTML(res, html);
  });
};

/**
 * 只显示归档的记录
 * @param {*} db 
 * @param {*} res 
 */
exports.showArchived = function (db, res) {
  exports.show(db, res, true);
};

exports.workHitlistHtml = function (rows) {
  const html = `<table>
${rows.forEach((row) => {
    html += `<tr>
  <td>${row.hours}</td>
  <td>${row.date}</td>
  <td>${row.description}</td>
  ${!row.archived ? `<td>${exports.workArchivedForm(row.id)}</td>` : ''}
  <td>${exports.workDeleteForm(row.id)}</td>
  </tr>`;
  })}
</table>`;
  return html;
};

exports.workFormHtml = function () {
  const html = `<form action="/" method="post">
<p>
Date (YYYY-MM-DD): <br />
<input type="text" name="date" />
</p>
<p>
Hours worked: <br />
<input type="text" name="hours" />
</p>
<p>
Description: <br />
<textarea name="description"></textarea>
</p>
</form>`;
  return html;
};

exports.workArchivedForm = function (id) {
  exports.actionForm(id, '/archive', 'Archive');
};

exports.workDeleteForm = function (id) {
  exports.actionForm(id, '/delete', 'Delete');
};
```

#### PostgreSQL

对 Windows 兼容不好。  
在查询时，可以通过 **RETURNING 从句 + 列名** 返回指定列的值。

```js
const pg = require('pg');

const user = '';
const password = '';
const database = '';
const conString = `tcp:${user}:${password}@localhost:5432/${database}`;

const client = new pg.Client(conString);
client.connect();

const query = client.query(
  `INSERT INTO work (name,age)
  VALUE ($1,$2)
  RETURNING id`,
  ['Mike', 39],
  function (err, result) {
    if (err) {
      throw err;
    }
    console.log('Result ID is', result.rows[0].id);
  }
);

/**
 * 处理返回的数据
 */
query.on('row', function (row) {
  console.log(row.id);
});

/**
 * 查询完成后的处理
 */
query.on('end', function (row) {
  client.end();
});

```

查询时，每取出一条数据库记录会触发一次 row 事件。  
取出最后一条记录时触发 end 事件，可以进行数据库关闭等操作。

### NoSQL 数据库

#### Redis

存储在 RAM 中，在磁盘中记录数据变化。当服务器崩溃，RAM 数据丢失时，可以从磁盘中日志恢复数据。  
数据结构：键/值对，哈希表，链表，集合。

```js
const redis = require('redis');

// 连接
const client = redis.createClient({ url: 'redis://default:adminhxh@124.223.97.64:6379' });

client.on('error', function (err) {
  console.log('Error:', err);
});

// 操作数据
// 键/值对
async function handle() {
  await client.connect();
  await client.set('color', 'red');
  const color = await client.get('color');
  console.log('Got:', color);
  client.disconnect();
}

// 哈希表/哈希映射
async function handleSet() {
  await client.connect();
  await client.hSet('camping', {
    'shelter': '2-person tent',
    'cooking': 'campstove'
  });
  const keys = await client.hKeys('camping');
  keys.forEach(function (key, i) {
    console.log(key, '\t');
  });
  const cooking = await client.hGet('camping', 'cooking');
  console.log('Will be cooking with: ', cooking);
  client.disconnect();
}

// 链表
// start~end之间的数据0 ~ -1 -1指链表中最后一个元素
async function handleLine() {
  await client.connect();
  await client.lPush('tasks', 'Paint the bikeshed red.');
  await client.lPush('tasks', 'Paint the bikeshed green.');
  const tasks = await client.lRange('tasks', 0, -1);
  tasks.forEach((task) => {
    console.log(task, '\t');
  });
  client.disconnect();
}

// 集合
// 会忽略重复的输入
async function handleS() {
  await client.connect();
  await client.sAdd('ip_addresses', '204.10.37.96');
  await client.sAdd('ip_addresses', '204.10.37.96');
  await client.sAdd('ip_addresses', '72.32.231.8');
  const members = await client.sMembers('ip_addresses');
  console.log(members);
  client.disconnect();
}

```

**信道**  
信息传递机制，提供预订/发布功能。  
预订一个信道后，可以接受到所有发送给该信道的消息。

```js
// 老版本
const net = require('net');
const redis = require('redis');

const server = net.createServer(function (socket) {
  let subscriber,
    publisher;

  // 创建预订客户端
  subscriber = redis.createClient();
  // 预订信道
  subscriber.subscrib('main_chat_room');
  // 信道接受消息发送给用户
  subscriber.on('message', function (channel, message) {
    console.log(`Channel ${channel}: ${message}`);
  });
  // 创建发布客户端
  publisher = redis.createClient();

  socket.on('data', function (data) {
    publisher.publish('main_chat_room', data);
  });

  socket.on('end', function () {
    subscriber.unsubscrib('main_chat_room');
    subscriber.end();
    publisher.end();
  });
});
```

可以通过 hiredis 来提高生产环境中 redis 的性能。  
hiredis 通过替换 redis 中 JavaScript 实现为 C 实现，每次 nodejs 更新可能需要重新构建 `npm rebuild hiredis`。

#### MongoDB

**mongodb 模块**

```js
const mongodb = require('mongodb');

const server = new mongodb.Server('127.0.0.1', 3000, {});
const client = new mongodb.Db('mydatabase', server, { w: 1 });

client.open(function (err) {
  if (err) { throw err; }
  client.collection('test_insert', function (err, collection) {
    if (err) { throw err; }

    collection.insert(
      {
        title: 'test',
        body: 'It is a body'
      },
      // 安全模式表示插入操作需要在回调之前执行
      { safe: true },
      function (err, documents) {
        if (err) { throw err; }
        // documents中为二进制JSON(BSON)格式
        console.log('document id: ', documents[0]._id);
      }
    );

    const _id = new client.bson_serializer.ObjectID('4e650d344ac74b5a01000001');
    collection.update(
      { id: _id },
      { $set: { 'title': 'I eat a apple' } },
      { safe: true },
      function (err) {
        if (err) { throw err; }
      }
    );

    collection.find({ 'title': 'I eat a apple' }).toArray(
      function (err, result) {
        if (err) { throw err; }
        console.log(result);
      }
    );

    collection.remove(
      { _id: _id },
      { safe: true },
      function (err) {
        if (err) { throw err; }
      }
    );
  });
});
```

**mongoose 模块**

```js
const mongoose = require('mongoose');

// 连接数据库
const db = mongoose.connect('mongoose://localhost/tasks');

// 注册schema
const Schema = mongoose.Schema;
const Tasks = new Schema({
  project: String,
  description: String
});
mongoose.model({ 'Task': Tasks });

// 添加任务
const Task = mongoose.model('Task');
const task = new Task();
task.project = 'Banana';
task.description = 'Paint the banana red.';
task.save(function (err) {
  if (err) { throw err; }
  console.log('saved');
});

// 搜索文档
Task.find({ 'project': 'Banana' }, function (err, tasks) {
  if (err) { throw err; }
  for (let i = 0; i < tasks.length; i++) {
    console.log('ID:', tasks[i]._id, '\n', tasks[i].description);
  }
});

// 更新文档
Task.update(
  { _id: '4e650d344ac74b5a01000001' },
  { description: 'Paint the banana green.' },
  // 只更新一个文档
  { multi: false },
  function (err, rowsUpdated) {
    if (err) { throw err; }
    console.log('Updated');
  }
);

// 删除文档
Task.findById(
  { _id: '4e650d344ac74b5a01000001' },
  function (err, task) {
    if (err) { throw err; }
    task.remove();
  }
);

// 断开连接
db.disconnect();

```

## Connect

### 使用

挂载：当 `use()` 的第一个参数为字符串时，只有路径前缀匹配时才会调用调用后面的中间件。

```js
const connect = require('connect');
const hello = require('./middleware/hello');
const errorHandler = require('./middleware/error/errorHandler');
const users = require('./middleware/users');
const pets = require('./middleware/pets');
const errorPage = require('./middleware/error/errorPage');

const api = connect()
  .use(users)
  .use(pets)
  .use(errorHandler);

const app = connect()
  .use(hello)
  .use('/api', api)
  .use(errorPage);

app.listen(3000, function () {
  console.log('Server has running');
});
```

**静态文件服务**

```js
const connect = require('connect');
const serveStatic = require('serve-static');
const serveIndex = require('serve-index');
const compression = require('compression');

function shouldCompress(req, res) {
  return res.getHeader('content-type').indexOf('text/plain') === 0;
}
const app = connect()
  .use(compression({ filter: shouldCompress }))
  .use('/api', serveIndex('public'))
  // 支持挂载
  .use('/api', serveStatic('public'));

module.exports = app;

```

[练习代码](https://gitee.com/sunsea-h/learn-project/tree/master/node/nodebook/connect-web)

### 内置中间件

在新版本中不在提供内置中间件，被第三方模块替代。  
[connect](https://github.com/senchalabs/connect)

## 常用中间件

### cookie-parser

解析 cookie，签名 cookie 和 JSON cookie，放入 req.cookies，req.signedCookies 中。  
其中 JSON cookie 可以是签名的，也可以是不签名的。  
connect 提供通过 `res.setHeader()` 设置 Set-Cookie 请求头来设置出站 cookie。

```js
const cookieParser = require('cookie-parser');

const app = connect()
  .use(cookieParser())
  .use(function (req, res) {
    console.log(req.cookies);
    res.end(req.cookies)
  })
  .use(hello)
  .use('/api', api)
  .use(errorPage);

app.listen(3000, function () {
  console.log('Server has running');
});
```

### body-parser

```js
const bodyParser = require('body-parser');

const app = connect()
	// 已弃用，使用具体的方法raw（所有body解析为Buffer）、text（所有body解析为字符串）、urlencoded、json
  .use(bodyParser())
  .use(bodyParser.raw())
  .use(bodyParser.text())
  .use(bodyParser.urlencoded())
  .use(bodyParser.json())
  .use(function (req, res) {
    console.log(req.body);
    // 如果为 mutipart/form-data,且为文件上传
    console.log(req.files);
    res.end(req.body,req.files);
  })
  .use(hello)
  .use('/api', api)
  .use(errorPage);

app.listen(3000, function () {
  console.log('Server has running');
});
```

### [raw-body](https://www.npmjs.com/package/raw-body)

```js
const bodyParser = require('body-parser');
const getRawBody = require('raw-body');

const app = connect()
  .use(function (req, res) {
    getRawBody(req, {
      length: req.headers['content-length'],
      limit: '1mb',
      encoding: contentType.parse(req).parameters.charset
    }, function (err, string) {
      if (err) return next(err);
      req.text = string;
      next();
    });
  })
  .use(bodyParser())
  .use(bodyParser.raw())
  .use(bodyParser.text())
  .use(bodyParser.urlencoded())
  .use(bodyParser.json())
  .use(function (req, res) {
    console.log(req.body);
    console.log(req.files);
    res.end('body:', req.body);
  })

app.listen(3000, function () {
  console.log('Server has running');
});
```

### [qs](https://www.npmjs.com/package/qs)

#### method-override

*server.js*

```js
const fs = require('fs');
const connect = require('connect');
const methodOverride = require('method-override');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = connect()
  .use(morgan(':method :url'))
  .use(bodyParser())
  .use(function (req, res, next) {
    console.log(req.method);
    next();
  })
  // 查询字符串 ?_method=delete
  // .use(methodOverride('_method'))
  // 请求体中 { _method=put }
  .use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && req.body._method) {
      const method = req.body._method;
      delete req.body._method;
      return method;
    }
  }))
  .use(function (req, res, next) {
    console.log(req.method);
    next();
  })
  .use(edit)
  .use(update)
  .use(function (req, res) {
    res.end('Hello from Express!');
  });

app.listen(3000, function () {
  console.log('Server has running');
});

function edit(req, res, next) {
  if (req.method != 'GET') { return next(); }
  res.setHeader('Content-Type', 'text/html');
  res.write('<form method="post" action="http://localhost:3000/form?_method=delete">');
  res.write('<input type="hidden" name="_method" value="put"/>');
  res.write(`<input type="text" name="user[name]" value="Tobi"/>`);
  res.write('<input type="submit" value="Update" />');
  res.write('</input>');
  res.end('hhhhh');
}
function update(req, res, next) {
  if (req.method != 'PUT') { return next(); }
  res.end('Updated name to ' + req.body.user.name);
}
```

## Express

## 参考

[NodeJS扩展](NodeJS扩展.md)  
>来源：[一篇文章构建你的 NodeJS 知识体系 - 掘金](https://juejin.cn/post/6844903767926636558#heading-2)  
