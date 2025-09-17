---
title: Browser
categories:
  - Web
date: 2022-11-24 14:19:04
updated: 2025-09-15 16:33:49
---
# Browser

[获取敏感权限问题](https://blog.csdn.net/qq_35517283/article/details/129733510)  
[超详细讲解页面加载过程 - 掘金](https://juejin.cn/post/7028385332391477255)  
[性能优化之html、css、js三者的加载顺序 - 前端南玖 - 博客园](https://www.cnblogs.com/songyao666/p/16112629.html)  
[从输入URL开始建立前端知识体系 - 掘金](https://juejin.cn/post/6935232082482298911)  
[中级前端必备知识点1、从输入url到页面显示出来发生了什么 1.DNS解析 2.TCP连接 3.发送HTTP请求 4.服 - 掘金](https://juejin.cn/post/7291291652139499535)

## 浏览器进程

- **主进程**
- **网络进程**  
  页面网络资源加载。
- **第三方插件进程**
- **音频进程**
- **GPU 进程**  
  最多一个，用于 3D 绘制等。
- **渲染进程**  
  浏览器内核。
	- **JS 引擎线程**  
	  处理 JavaScript 脚本（如 V8 引擎），一个渲染进程只有一个该线程在运行。
	- **事件触发线程**  
	  归属浏览器，执行添加的 setTimeOut（来自 JS 引擎），鼠标点击、AJAX 异步请求（来自浏览器其他线程）等任务。
	- **定时触发器线程**
	  - setInterval 与 setTimeout 所在线程。
	- **异步 http 请求线程**  
	  XMLHttpRequest 在连接后是通过浏览器新开一个线程请求。
	- **GUI 渲染线程**  
	  负责渲染浏览器界面,解析 HTML,CSS,构建 DOM 树和 RenderObject 树,布局和绘制等。
		- 建立数据传输通道
		- 构建 DOM 树
		- 布局阶段
		- 绘制以及合成渲染

GUI 渲染线程与 JS 引擎线程互斥。

```ad-tip
title:渲染进程中的线程
- **主线程** = GUI 渲染线程/ JS 引擎线程。
  因为二者互斥不会同时运行且都会阻塞UI 也有叫UI线程的。
- **工作线程** = 事件触发线程 + 定时触发器线程 + 异步 HTTP 请求线程 + web works 等用户执行耗时任务的线程。
- **合成线程**：用于合成帧的线程/一些动画属性变化也可以单独在这个线程运行，不需要经过主线程，提高渲染性能。
- **raster 线程**：和合成线程共同作用，用于同层分块的，提高渲染性能。
```

渲染进程的主线程中有一个 **HTML 解析器（HTMLparser）**，将 html 字节流通过分词器转换为 Token 流，最终生成 DOM 结构。

解析过程中，会先解析 CSS 文件（JS 可能改变 CSS），生成 CSSOM 后，再进行 JS 的解析，最后进行 DOM 树的构建。

```ad-info
title:解析时遇到script标签
- **script**：当解析器遇到script标签时，文档的解析将立即停止，并立即下载并且执行脚本，脚本执行完毕以后将继续解析文档
- **defer script**：当解析器遇到script标签时，文档的解析不会立即停止，其他线程将下载脚本，待到文档的解析完成，脚本才会执行
- **async script**：当解析器遇到script标签时，文档的解析不会停止，其他线程将下载脚本，脚本完成后开始执行脚本，脚本的执行过程中文档将会停止解析，直到脚本执行完毕
```

参考：[浏览器的多进程架构\_huangpb0624的博客-CSDN博客](https://blog.csdn.net/huangpb123/article/details/104076301/)

## 解析渲染机制

![](Browser.assets/image-20240830111500876.png)

## 回流（reflow） 和 重绘（repaint）

>重绘不一定导致回流，但回流一定会导致重绘

### 回流 (重排)

#### 含义

当 `页面布局` 或 `DOM 元素的几何属性`（例如位置、大小）发生变化时，浏览器需要重新计算元素的几何属性，并重新布局整个页面。这是一个比较耗性能的操作，会导致页面重新渲染，因此应该尽量避免频繁的回流

#### 触发条件

1. 页面首次渲染（无法避免且开销最大的一次）；
2. 浏览器窗口大小发生改变（`resize` 事件）；
3. 添加或删除 **可见** 的 DOM 元素；
4. 修改 DOM 元素的尺寸、位置、边距、填充等；
5. 修改 DOM 元素的内容（文本、图片等）；
6. 激活 CSS 伪类，例如 `:hover`、`:active`、`:focus` 等；
7. 查询属性或调用方法需要通过 **即时计算** 得到结果：
    - offsetTop、offsetLeft、offsetWidth、offsetHeight
    - scrollTop、scrollLeft、scrollWidth、scrollHeight
    - clientTop、clientLeft、clientWidth、clientHeight
    - getComputedStyle()
    - getBoundingClientRect()

### 重绘

#### 含义

当 `DOM 元素的样式属性`（例如颜色、背景）发生变化时，浏览器会重新绘制被影响的元素。重绘不会影响布局，只会重新绘制元素的外观，因此比回流的性能开销要小

#### 触发条件

  - 修改元素的 **颜色属性**  
    `color`、`background-color`、`border-color` 等
  - 修改元素的 **文字属性**  
    `font-weight`、`font-style`、`text-decoration` 等
  - 修改元素的 **文本属性**  
     `text-align`、`text-transform`、`line-height` 等
  - 修改元素的 **背景属性**  
    `background-image`、`background-position`、`background-size` 等
  - 修改元素的 **盒子模型属性**  
     `ox-shadow`、`outline-color`、`outline-style` 等
  - 使用 **渐变属性**  
     `linear-gradient`、`radial-gradient` 等
  - 使用 **变形属性**  
     `transform`、`transform-origin` 等
  - 使用 **过渡属性**  
     `transition`、`transition-property`、`transition-duration` 等

### 浏览器优化机制

采用 **队列化修改并批量执行** 策略, 将修改放入队列中, 直至一定时间在去清空队列  
当获取布局信息时, 会强制刷新队列, 获取实时信息

### 优化

**1.避免逐行修改样式, 合并修改样式**  
以下会触发三次重绘, 一次回流, 应尽量避免

```JavaScript
const el = document.querySelector('.el');
el.style.color = 'blue'; // 导致重绘 
el.style.backgroundColor = '#96f2d7'; // 导致重绘 
el.style.margin = '10px'; // 导致回流（回流会引起重绘）
```

**2.动态渲染少用 table 布局**  
内部出现变动, 整个 table 都会重新计算  
**3.避免强制同步**  
减少获取布局信息的次数  
**4.使用 absolute 或 fixed 脱离文档流**  
**5.文档片段 (Document Fragment)**  
**6.离线处理**  
`display:none` 不会出现在不布局中,不触发重绘和回流  
`visibility: none` 会触发重绘, 不会影响回流  
**7.使用硬件加速**  
CSS3 动画: `transform`、`opacity` 非 1 非 0、`keyframes` 和 `animation`, `filter`

## 事件循环

> 单线程是异步产生的原因；事件循环是异步的实现方式。

渲染主线程进入死循环执行消息队列中的任务。
- 微队列（最高）
- 交互队列（高）
- 延时队列（中）

## V8 垃圾回收

主要采取 **分代式** 回收机制。  
根据对象存活时间进行分代，将对象分为 **新生代** 和 **老生代** 两块内存空间。  
**存活时间较短和新建的对象** 分配到新生代内存中，**存活时间较长的对象** 分配到老生代内存中。  
两个内存空间分别采用 **不同** 的垃圾回收算法。

**Scavenge 算法 -- 新生代**  
1.对象分配到 **From Space**，直到 From Space 接近满（占用 FROM 空间的 **75%** 时）。  
2.触发 Scavenge 算法，标记存活对象并复制到 **To Space**。当 **To Space** 占用率为 **25%** 时，为了不影响之后**From Space**的分配，需要 **晋升**。  
3.复制完成后，To Space 变为新的 From Space，原 From Space 被清空。  
4.未被复制的对象（死亡对象）的内存被自动释放。

**Mark-sweep 和 Mark-compact 算法 -- 老生代**  
调用 **Mark-sweep（对象标记和清除）** 标记存活对象，清除未被标记的对象。但会造成内存空间不连续，导致新生代晋升的大对象无法分配。 

>标记清除时，会构建一个根列表，从根对象出发，可访问为活动对象，不可访问为死亡对象，执行清除。

当出现该情况时，会调用 **Mark-compact（标记整理）** 进行内存空间整理，将存活对象整理到一侧，然后清除边界外的空间。

```ad-note
title: 新生代晋升老生代  
对象被多次复制时，会认为生命周期较长，晋升到老生代空间。 

晋升条件：

1.该对象在新生代时是否经历过 Scavenge 回收（第二次 Scavenge 回收依然存活）  

2.从 From Space 复制到 To Space时，占比超过25%，该批次对象晋升
```

V8 还支持增量垃圾回收技术。  
可将垃圾回收的时间分解成多个短周期的执行任务，从而在进行垃圾回收时不会阻塞 JS 的执行。  
增量垃圾回收分为几个阶段：
- 初始标记（Initial Marking）：在该阶段，垃圾回收器会标记所有根对象和在根对象的引用链上的对象。
- 并发标记（Concurrent Marking）：在该阶段，垃圾回收器会在执行应用程序的同时，并发执行标记操作。它会标记所有从根对象出发可到达的对象，直到标记完所有活动对象。
- 重新标记（Remark）：这是一个短暂的暂停，垃圾回收器会标记在并发标记阶段有新的指针引用的对象。
- 并发清除（Concurrent Sweep）：在该阶段，垃圾回收器会在执行应用程序的同时，并发执行清除操作。它会回收标记为死亡的对象，同时不会改变存活对象的地址。

## 浏览器缓存

### 浏览器请求过程

![](Browser.assets/image-20230510150629303.png)

### 强缓存

直接从缓存中获取，不会向服务器发送请求。  
通过设置 **Expires**(有效期) 和 **Cache-Control** （优先级高）响应头设置。

**Expires** (http1.0)  
`Expires:now()+max-age`，指定时间点之前访问可命中缓存。  
> **缺点**：使用的是本地时间判断，本地时间可修改。

**Cache-Control** (http1.1)  
`Cache-Control:max-age=300`，返回时间开始，300 秒以内访问可命中缓存。

```ad-info
title:多种命令

![](Browser.assets/image-20230512144002115.png)

**immutable**：缓存有效期内禁止验证。一般搭配max-age使用，单独使用部分浏览器可能忽略该值。

**no-cache**：客户端缓存内容，是否使用缓存则需要经过协商缓存来验证决定。表示不使用 Cache-Control的缓存控制方式做前置验证，而是使用 Etag 或者Last-Modified字段来控制缓存。  

**no-store**：所有内容都不会被缓存，即不使用强制缓存，也不使用协商缓存, 也不会触发启发式缓存
```

### 协商缓存

强缓存失效后，携带缓存标识请求服务器，决定是否使用缓存。  
**Last-Modified** 和 **If-Modified-Since**  
响应头 Last-Modified 携带文件上次修改时间，下次客户端请求服务器在 If-Modified-Since 存放改时间，服务器对比文件修改时间来决定是否使用缓存。  
**ETag** 和 **If-None-Match**  
服务器响应在 ETag 携带文件唯一标识，每次更新文件重新生成，客户端请求在 If-None-Match 携带该标识，服务器对比标识决定是否使用缓存。

```ad-tip
title:Last-Modified和ETag
**精确度**：Last-Modified单位为秒，如何文件1秒内修改多次，会导致检测不到变化。  

**性能**：ETag需要算法生成hash，而Last-Modified只需要记录时间，性能更好。 

**优先级**：ETag优先级更高。  
```

### 启发式缓存

当响应中不存在 **Expires** 和 **Cache-Control** 头时, 浏览器依然会触发强缓存, 即启发式缓存  
缓存有效期计算公式：**(date - last-modified ) * 10%**

### memory cache 和 disk cache

memory cache 存储在内存中，读取速度快；  
disk cache 存储在硬盘中，读取速度慢于 memory cache。  
页面打开后刷新从 memory cache 获取，页面关闭后再打开，从 disk cache 获取。

## 客户端存储

### cookie

```js
class CookieUtil {
  static get(name) {
    let cookieName = `${encodeURIComponent(name)}=`,
      cookieStart = document.cookie.indexOf(cookieName),
      cookieValue = null;
    if (cookieStart > -1) {
      let cookieEnd = document.cookie.indexOf(";", cookieStart);
      if (cookieEnd === -1) {
        cookieEnd = document.cookie.length;
      }
      cookieValue = decodeURIComponent(document.cookie.substring(cookieStart
        + cookieName.length, cookieEnd));
    }
    return cookieValue;
  }

  static set(name, value, expires, path, domain, secure) {
    let cookieText =
      `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    if (expires instanceof Date) {
      cookieText += `; expires=${expires.toUTCString()}`;
    }
    if (path) {
      cookieText += `; path=${path}`;
    }
    if (domain) {
      cookieText += `; domain=${domain}`;
    }
    if (secure) {
      cookieText += "; secure";
    }
    document.cookie = cookieText;
  }

  static unset(name, path, domain, secure) {
    CookieUtil.set(name, "", new Date(0), path, domain, secure);
  }
};
```

**跨域携带**  
1.发送请求携带 `withCredentials: true`  
2.服务器配置响应头 `"Access-Control-Allow-Origin", "http://xxx:${port}"`，`"Access-Control-Allow-Credentials", "true"`

### Storage

当 Storage 对象发生变化时，触发 storage 事件。该事件不区分 sessionStorage 和 localStorage。

```js
window.addEventListener("storage", 
 (event) => alert('Storage changed for ${event.domain}')); 
```

### IndexedDB

每个请求都需要注册 onerror 和 onsuccess 处理程序。  
**打开数据库连接**

```js
// 打开数据库
let db,
  request,
  // 版本号需要是整数
  version = 1;
request = indexedDB.open("admin", version);
// event.target --> request
request.onerror = (event) => {
  alert(`Failed to open: ${event.target.errorCode}`);
};
request.onsuccess = (event) => {
  db = event.target.result;
};
// open()创建新数据库/数据库存在，指定升级版的版本号-->触发upgradeneeded
request.onupgradeneeded = (event) => {
  const db = event.target.result;
  // 如果存在则删除当前 objectStore。测试的时候可以这样做
  // 但这样会在每次执行事件处理程序时删除已有数据
  if (db.objectStoreNames.contains("users")) {
    db.deleteObjectStore("users");
  }
  // keyPath 用作键的存储对象的属性名
  db.createObjectStore("users", {keyPath: "username"});
};
```

**创建事务，操作数据**  
该操作应该放在打开数据的请求中的 `onsuccess` 事件处理程序中。  
`add()` 与 `put()` 的唯一区别，前者用于添加新数据，后者用于更新数据。

```js
// 创建事务
const transaction = db.transaction("users", "readwrite");
transaction.onerror = (event) => {
	// 整个事务被取消
};
transaction.oncomplete = (event) => {
	// 整个事务成功完成
	// 不能访问 get() 返回的数据 应该在请求的 onsuccess 中处理
};
// 获得对象存储引用
const store = transaction.objectStore("users");
const requestAdd = store.add({username: 'lili'});
requestAdd.onerror = (err) => {
	console.log(err);
};
requestAdd.onsuccess = (event) => {
	console.log(event.target);
};
```

**使用游标**

```js
const cursorRequest = store.openCursor();
cursorRequest.onerror = (event) => {
	console.log(event.target.errorCode);
};
cursorRequest.onsuccess = (event) => {
	const cursor = event.target.result;
	let value,
		updateRequest;
	// 必须检查是否存在
	if (cursor) {
		// 下一条记录
		// cursor.continue();
		// 指定的上2条记录
		// cursor.advance(2);
		if (cursor.key === 'lili') {
			value = cursor.value;
			value.password = "magic";
			updateRequest = cursor.update(value);
			//onerror,onsuccess
			updateRequest.onerror = (err) => {
				console.log(err);
			};
			updateRequest.onsuccess = (e) => {
				console.log(e.target);
			};
		}
	}
};
```

也可以在打开游标时 (`openCursor()`) 传入键范围对象，对游标进行限制。
- `IDBKeyRange.only(key)`，只返回指定键的值。
- `IDBKeyRange.lowerBound(key[,true])`，从键为 key 开始知道最后，参数二为 true 时则从 key 的下一个记录开始。
- `IDBKeyRange.upperBound(key[,true])`，从头到 key 结束，参数二为 true 时则从 key 的上一个记录开始。
- `IDBKeyRange.bound(lowerKey,upperKey,lowertrue,uppertrue)`，前两个方法的结合。

`openCursor(null,direction)` 第二个参数可以设置游标方向。

**创建索引**  
主键 userId,创建 username 的索引，索引同对象存储，只是主键为 username。

```js
const index=store.index("username"); 
// 通过索引键获取主键
const indexRequest=index.getKey("007");
// 删除索引
store.deleteIndex("username");
```

**并发问题**

```js
request = indexedDB.open("admin", version);
request.onsuccess = (event) => {
	db = event.target.result;
	// 每次打开数据库都注册该事件处理程序
	db.onversionchange = () => db.close();
};
```

**限制**  
与页面源（协议、域和端口）绑定，不能跨域共享。  
存储空间限制（各浏览器不同）。  
Firefox 本地文件不能访问 IndexedDB。

## 同源策略（Same-Origin Policy）

只允许从同源地址获取数据，非同源的请求会先出发 CORS 预检请求，简单请求不会出发预检请求。  

```ad-info
title: 简单请求

- HTTP 方法限制：只能使用 GET、HEAD、POST 这三种 HTTP 方法之一。如果请求使用了其他 HTTP 方法，就不再被视为简单请求。
    
- 自定义标头限制：请求的 HTTP 标头只能是以下几种常见的标头：Accept、Accept-Language、Content-Language、Last-Event-ID、Content-Type（仅限于 application/x-www-form-urlencoded、multipart/form-data、text/plain）。HTML 头部 header field 字段：DPR、Download、Save-Data、Viewport-Width、WIdth。如果请求使用了其他标头，同样不再被视为简单请求。
    
- 请求中没有使用 ReadableStream 对象。
    
- 不使用自定义请求标头：请求不能包含用户自定义的标头。
    
- 请求中的任意 XMLHttpRequestUpload 对象均没有注册任何事件监听器；XMLHttpRequestUpload 对象可以使用 XMLHttpRequest.upload 属性访问
```

### 存储分区（Storage Partitioning）

![](Browser.assets/file-20250428173808360.png)  
跨域加载页面默认启动存储分区。  
部分浏览器针对跨端口（尤其是本地环境）嵌入相对宽松。  
`127.0.0.1:5500` 嵌入 `127.0.0.1:9000` 不会触发存储分区，但 `localhost:5500` 嵌入 `127.0.0.1:9000` 会触发存储分区，因为不只是跨端口。  

如果一定要跨域访问，可以使用 Storage Access API（兼容性考虑）。

```js
document.requestStorageAccess({ localStorage: true }).then((handle) => {
	console.log(handle);
	handle.localStorage.clear();
}).catch(() => {
	console.log('拒绝授权');
});
```

需要在**用户主动触发**的操作中执行以上代码。
