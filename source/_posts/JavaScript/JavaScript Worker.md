---
title: JavaScript Worker
categories:
  - JavaScript
date: 2024-08-13 17:42:02
updated: 2025-01-02 16:09:46
---
# JavaScript Worker

[🎊🎊🎊深入 ServiceWorker，消息推送，后台同步，一网打尽！上一章讲到了ServiceWorker的基础 - 掘金](https://juejin.cn/post/7168107934046486541)  
[🚂🚂🚂 ServiceWorker -\> PWA的基石，在线离线都能玩！PWA是Progressive Web A - 掘金](https://juejin.cn/post/7171088699164213279)

## 基础知识

**工作者线程与线程**
- 以实际线程实现
- 工作者线程并行执行
- 共享部分内存，不共享全部内存
- 不一定在同一个进程中
- 创建开销更大  

**分类**
- 专用工作者线程  
  Web Worker/Worker，只能被创建它的页面使用，执行委托任务。可称为 **后台脚本**。
- 共享工作者线程  
  可以被多个不同的上下文使用，包括不同的页面，任何与创建者 **同源** 的脚本。
- 服务工作者线程  
  拦截、重定向和修改页面的发送请求。

**全局对象**
- 专用工作者线程使用 DedicatedWorkerGlobalScope。
- 共享工作者线程使用 SharedWorkerGlobalScope。
- 服务工作者线程使用 ServiceWorkerGlobalScope。

都继承了 WorkerGlobalScope，WorkerGlobalScope 通过 self 关键字暴露，其上的属性是 window 的严格子集，返回的属性是特定工作者线程版本。  
WorkerGlobalScope 还新增了全局方法 `importScripts()`。

## Web Worker

### Worker

**扩展**
- `name`，提供给构造函数的可选字符串标识。
- `postMessage()`，向父上下文发送消息。
- `close()`，立即终止脚本，不留清理的机会。
- `importScripts()`，向工作者线程导入任意数量脚本。

**创建**

```js
// 通过Blob URL创建行内工作者线程
const worker = new Worker(URL.createObjectURL(new Blob([`self.onmessage = 
({data}) => console.log(data);`])));

// 函数序列化初始脚本
// 函数体内不能使用通过闭包获得的引用和全局变量window
function fibonacci(n) {
  return n < 1 ? 0
    : n <= 2 ? 1
      : fibonacci(n - 1) + fibonacci(n - 2);
}
const worker = new Worker(URL.createObjectURL(new Blob([`self.postMessage((${fibonacci.toString()})(9));`])));
worker.postMessage('blob worker script');
```

**处理错误**  
try...catch 无法捕获工作者线程错误；通过 onerror 捕获工作者线程错误

```js
try {
  const worker = new Worker('./worker.js');
  
  worker.onerror = console.log;
  console.log('no error');
} catch (e) {
  console.log('caught error');
}
```

**通信**  
除了使用 postMessage 进行通信，还可以创建通信 **MessageChannel**，其主要用于两个工作者线程通信。

```js
// main.js
const chanel = new MessageChannel();
const worker = new Worker('./worker.js');
const worker2 = new Worker('./worker.js');
worker.postMessage('worker', [chanel.port1]);
worker2.postMessage('worker2', [chanel.port2]);
worker.onmessage = ({data}) => console.log(data);
worker2.onmessage = ({data}) => console.log(data);
worker.postMessage(['page']);
worker2.postMessage(['page']);

// worker.js
let messagePort = null;
let contextIdentifier = null;

function addContextAndSend(data, destination) {
  // 添加标识符以标识当前工作者线程
  data.push(contextIdentifier);
  console.log(data);
  // 把数据发送到下一个目标
  destination.postMessage(data);
}

self.onmessage = ({data, ports}) => {
  // 如果消息里存在端口（ports）
  // 则初始化工作者线程
  console.log(ports);
  if (ports.length) {
    console.log('11');
    // 记录标识符
    contextIdentifier = data;
    // 获取 MessagePort
    messagePort = ports[0];
    // 添加处理程序把接收的数据
    // 发回到父页面
    messagePort.onmessage = ({data}) => {
      addContextAndSend(data, self);
    };
  } else {
    console.log('22');
    addContextAndSend(data, messagePort);
  }
};
```

同源脚本也可以使用 **BroadcastChannel** 进行通信。

```js
// main.js
const channel = new BroadcastChannel('worker_channel');
const worker = new Worker('./worker.js');
channel.onmessage = ({data}) => {
  console.log(`heard ${data} on page`);
};
setTimeout(() => channel.postMessage('foo'), 1000);

// worker.js
const channel = new BroadcastChannel('worker_channel');
channel.onmessage = ({data}) => {
  console.log(`heard ${data} in worker`);
  channel.postMessage('bar');
}; 
```

**数据传输**
- 结构化克隆算法
	- 克隆 Error 对象、Function 对象和 DOM 节点会报错。
	- 对象属性描述符、获取方法和设置方法不会复制，必要时使用默认值。
	- 不会克隆原型链，`RegExp.prototype.lastIndex` 属性。
- 可转移对象
	- 包括 ArrayBuffer、MessagePort、ImageBitmap、OffscreenCanvas。
	- 权限会转移到目标脚本，本脚本将无法操作对象。
- 共享数组缓冲区 SharedArrayBuffer
	- 存在资源争用，导致结果与预期不符，使用 Atomic API 解决。

**线程池**

```js
class TaskWorker extends Worker {
  constructor(notifyAvailable, ...workerArgs) {
    super(...workerArgs);
    // 初始化为不可用状态
    this.available = false;
    this.resolve = null;
    this.reject = null;
    // 线程池会传递回调
    // 以便工作者线程发出它需要新任务的信号
    this.notifyAvailable = notifyAvailable;
    // 线程脚本在完全初始化之后
    // 会发送一条"ready"消息
    this.onmessage = () => this.setAvailable();
  }

  // 由线程池调用，以分派新任务
  dispatch({resolve, reject, postMessageArgs}) {
    this.available = false;
    this.onmessage = ({data}) => {
      resolve(data);
      this.setAvailable();
    };
    this.onerror = (e) => {
      reject(e);
      this.setAvailable();
    };
    this.postMessage(...postMessageArgs);
  }

  setAvailable() {
    this.available = true;
    this.resolve = null;
    this.reject = null;
    this.notifyAvailable();
  }
}

class WorkerPool {
  constructor(poolSize, ...workerArgs) {
    this.taskQueue = [];
    this.workers = [];
    // 初始化线程池
    for (let i = 0; i < poolSize; ++i) {
      this.workers.push(
        new TaskWorker(() => this.dispatchIfAvailable(), ...workerArgs));
    }
  }

  // 把任务推入队列
  enqueue(...postMessageArgs) {
    return new Promise((resolve, reject) => {
      this.taskQueue.push({resolve, reject, postMessageArgs});
      this.dispatchIfAvailable();
    });
  }

  // 把任务发送给下一个空闲的线程（如果有的话）
  dispatchIfAvailable() {
    if (!this.taskQueue.length) {
      return;
    }
    for (const worker of this.workers) {
      if (worker.available) {
        let a = this.taskQueue.shift();
        worker.dispatch(a);
        break;
      }
    }
  }

  // 终止所有工作者线程
  close() {
    for (const worker of this.workers) {
      worker.terminate();
    }
  }
}

const totalFloats = 1E8;
const numTasks = 20;
const floatsPerTask = totalFloats / numTasks;
const numWorkers = 4;
// 创建线程池
const pool = new WorkerPool(numWorkers, './worker.js');
// 填充浮点值数组
let arrayBuffer = new SharedArrayBuffer(4 * totalFloats);
let view = new Float32Array(arrayBuffer);
for (let i = 0; i < totalFloats; ++i) {
  view[i] = Math.random();
}
let partialSumPromises = [];
for (let i = 0; i < totalFloats; i += floatsPerTask) {
  partialSumPromises.push(
    pool.enqueue({
      startIdx: i,
      endIdx: i + floatsPerTask,
      arrayBuffer: arrayBuffer
    })
  );
}
// 等待所有期约完成，然后求和
Promise.all(partialSumPromises)
  .then((partialSums) => partialSums.reduce((x, y) => x + y))
  .then(console.log);
```

### SharedWorker

只会在相同标识不存在的情况下，才会创建新的实例。否则，重新创建匹配标识的工作者线程的连接。  
标识：解析后的脚本 URL、工作者线程名称和文档源。  
在 URL 后添加 `?` 会导致识别为不同的 URL，如：`new SharedWorker('./sharedWorker.js'); ` 和 `new SharedWorker('./sharedWorker.js?');`。

**扩展**
- name：可选的字符串标识符，可以传给 SharedWorker 构造函数。 
- `importScripts()`：用于向工作者线程中导入任意数量的脚本。 
- `close()`：立即终止线程，只要还有连接存在，就无法关闭共享工作者线程。 
- `onconnect`：与共享线程建立新连接时，应将其设置为处理程序。connect 事件包括 MessagePort 实例的 ports 数组，可用于把消息发送回父上下文。 
	- 在通过 `worker.port.onmessage` 或 `worker.port.start()` 与共享线程建立连接时都会触 发 connect 事件。 
	- connect 事件也可以通过使用 `sharedWorker.addEventListener('connect', handler)` 处理。

每次连接都会触发 `connect` 事件，但断开连接没有对应的事件。  
只能在 `beforeunload` 事件即将销毁页面时， 明确发送卸载消息，让共享线程有机会清除死端口。

## [Service Worker](https://w3c.github.io/ServiceWorker/#navigator-serviceworker)

来自一个域的多个页面共享一个服务工作者线程。  
可以在相关的标签页或浏览器关闭后继续等待到来的推送事件。  
没有全局构造函数，通过 `navigator.serviceWorker` 中的 ServiceWorkerContainer 实例管理。  
通过 `navigator.serviceWorker.register()` 创建, 同共享工作者线程一样，不存在时创建，存在时连接。

```js
// 注册服务工作者线程
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('service-worker.js').then(function (registration) {
		console.log('ServiceWorker registration successful with scope: ', registration.scope);
	}, function (err) {
		console.log('ServiceWorker registration failed: ', err);
	});
}
```

**扩展**
- caches：返回服务工作者线程的 CacheStorage 对象。 
- clients：返回服务工作者线程的 Clients 接口，用于访问底层 Client 对象。 
- registration：返回服务工作者线程的 ServiceWorkerRegistration 对象。 
- `skipWaiting()`：强制服务工作者线程进入活动状态；需要跟 `Clients.claim()` 一起使用。 
- `fetch()`：在服务工作者线程内发送常规网络请求；用于在服务工作者线程确定有必要发送实际网络请求（而不是返回缓存值）时。

**作用域**  
只拦截作用域下的请求。  
只能相对于服务脚本所在路径缩小作用域。  

| 注册参数                            | 作用域                  | 拦截请求路径 |
| ----------------------------------- | ----------------------- | ------------ |
| '/serviceWorker.js'                 | `https://example.com/`    | `/foo`         |
| '/serviceWorker.js',{scope:'./'}    | `https://example.com/`    | `/foo`         |
| '/serviceWorker.js',{scope:'./foo'} | `https://example.com/foo` | `/foo/getUser` |
| '/foo/serviceWorker.js'             | `https://example.com/foo` | `/foo/getUser` |   

扩展作用域：
- 提供服务脚本时提供想要的作用域
- 给服务脚本的响应添加 `Service-Worker-Allowed`。

```js
navigator.serviceWorker.register('/serviceWorker.js')
  .then((serviceWorkerRegistration) => {
    console.log(serviceWorkerRegistration.scope);
    // https://example.com/
  });
```

### 缓存 -self.caches

存储在全局对象的 caches 属性的 CacheStorage 对象。  
只缓存 HTTP 请求的 GET 请求。  
存储的是调用 request 和 response 对象 clone 方法的副本，不是源请求和响应对象。

**特点**
- 不自动缓存任何请求
- 不存在到期失效
- 必须手动更新和删除，手动管理缓存版本
- 缓存超出限制，浏览器根据最近最少使用原则删除缓存请求

**属性方法**（均返回 Promise）
- [CacheStorage对象](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage)
- [Cache对象](https://developer.mozilla.org/en-US/docs/Web/API/Cache)

**最大缓存空间** 没有明确标准，可以通过 `navigator.storage.estimate()` 获取近似值。

### 客户端 -self.clients

**属性方法**
- [Clients](https://developer.mozilla.org/en-US/docs/Web/API/Clients)
- [Client](https://developer.mozilla.org/en-US/docs/Web/API/Client)

### 生命周期

已解析（parsed）、安装中 （installing）、已安装（installed）、激活中（activating）、已激活（activated）和已失效（redundant）。  
**ServiceWorker.state** 永远不会返回 parsed，第一个返回的状态为 installing。

判断当前服务工作者线程状态，以下属性的值为 ServiceWorker 实例，即为对应状态。
- `registration.installing`，安装中。没有发生错误或报错时进入下一状态。  
	- 一般在这个生命周期时，服务工作者线程缓存一组资源。
- `registration.waiting`，已安装。
	- 可通过 `self.skipWaiting()` 进入下一状态。
- `registration.active`，激活中或已激活。
	- 可以通过 `registration.controller` 属性是否返回激活的实例确认是否已激活。
	- 通过 `ServiceWorkerContainer.ready` 期约可以检测当前活动线程，该期约会立解决。
	- 已激活状态时会捕获 fetch()、通知和推送事件。

*main.js*

```js
navigator.serviceWorker.register('./worker.js')
	.then((registration) => {
		// state变更时，对象状态属性的值为 ServiceWorker 实例
		if (registration.installing) {
			registration.installing.onstatechange = ({target: {state}}) => {
				console.log('to state:', state);
			};
		}
		// updatefount 在状态变为installing时触发
		registration.onupdatefound = () => {
			console.log('Service worker is in the installing state');
		};
	});
```

*worker.js*

```js
const CACHE_KEY = 'v1';

self.oninstall = (installEvent) => {
  // 这样会触发activate事件
  installEvent.waitUntil(
    // 添加一组资源
    caches.open(CACHE_KEY)
      .then((cache) => cache.addAll([
        'foo.js',
        'bar.html',
        'baz.css'
      ]))
      .then(() => self.skipWaiting()) // 强制进入已激活状态
  );
};

// 强制线程接管客户端
// 会触发每个客户端的controllerchange事件
self.onactivate = () => self.clients.claim();
```

**更新检查触发条件**
- 调用 `navigator.serviceWorker.register()` 的 URL 与当前活动线程创建 URL 不一致。
- 浏览器导航到服务工作者线程作用域中的一个页面。
- 发生了 `fetch()` 或 `push()` 等功能性事件，且至少 24 小时内没有发生更新检查。

除了触发以上条件，也可以通过 `registration.update()` 强制出发更新。

**客户端缓存行为**  
1.通过 `Cache-Control: max-age=0` 头部取得最新脚本。  
2.通过 updateViaCache 管理服务脚本。
- imports，顶级脚本永远不会被缓存；线程内部 importScripts() 导入的会被缓存。
- all，同一按照 Cache-Control 头部纳入 HTTP 缓存。
- none，顶级脚本和内部 importScripts 导入脚本都永远不会被缓存。

```js
navigator.serviceWorker.register('/serviceWorker.js', { 
 updateViaCache: 'none' 
}); 
```

### 通信

**线程被动发送**：  
主进程发送消息到线程

```js
navigator.serviceWorker.controller.postMessage()
// 或
registration.active.postMessage()
```

线程到主进程

```js
self.onmessage=({source})=>{
	source.postMessage('foo');
}
```

**线程主动发送** 消息到主进程：

```js
self.onactivate = () => {
  self.clients.matchAll({includeUncontrolled: true})
    .then((clientMatches) => clientMatches[0].postMessage('foo'));
};
```

### 拦截 fetch 事件

```js
self.onfetch = (fetchEvent) => {
  // 从网络返回
  // fetchEvent.respondWith(fetch(fetchEvent.request));

  // 从缓存返回
  // fetchEvent.respondWith(caches.match(fetchEvent.request));

  // 从网络返回，缓存作为备用
  fetchEvent.respondWith(
    fetch(fetchEvent.request)
      .catch(() => caches.match(fetchEvent.request))
  );
  
  // 从缓存返回，网络作为备用
  fetchEvent.respondWith(
    caches.match(fetchEvent.request)
      .then((response) => response || fetch(fetchEvent.request))
      // 通用后备
      .catch(() => caches.match('/callback.html'))
  );
};
```

### 通知

*main.js*

```js
navigator.serviceWorker.register('./worker.js')
	.then((registration) => {
		// 请求权限授权
		Notification.requestPermission()
			.then((status) => {
				if (status === 'granted') {
					// 显示通知
					registration.showNotification('foo');
					// 订阅推送
					registration.pushManager.subscribe({
						applicationServerKey: '服务器的公钥',
						userVisibleOnly: true
					});
				}
			});
	});
```

*worker.js*

```js
self.onactivate = () => {
  // 显示通知
  self.registration.showNotification('bar');
  // 订阅推送
  self.registration.pushManager.subscribe({
    applicationServerKey: '服务器公钥',
    userVisibleOnly: true
  });
};

// 处理推送事件后，显示消息文本
self.onpush = (pushEvent) => {
  pushEvent.waitUntil(
    self.registration.showNotification(pushEvent.data.text())
  );
};
// 用于单击通知时，打开指定网页
self.onnotificationclick = ({notification}) => {
  self.clients.openWindow('xxx');
};
// 通知关闭事件
self.onnotificationclose = ({notification}) => {
  console.log('notification close.');
};
```
