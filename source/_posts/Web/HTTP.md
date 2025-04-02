---
title: HTTP
categories:
  - Web
date: 2022-11-29 16:38:30
updated: 2024-08-14 10:27:50
---

# HTTP

## HTTP 协议

超文本传输协议 (HyperText Transfer Protocol) 规定了 Web 浏览器如何从 Web 服务器获取文档和向 Web 服务器提交表单内容，以及 Web 服务器如何响应这些请求和提交。通常，HTTP 并不在脚本的控制下，只是当用户单击链接，提交表单和输入 URL 时才发生。但是，用 JavaScript 代码操纵 HTTP 是可行的。

1. **HTTP 请求**
   - HTTP 请求方法或动作
   - 正在请求的 URL
   - 请求头集合，其中可能包含身份验证信息 (可选) -- swagger
   - 请求体 (可选) -- 后台要不要参数
2. **HTTP 响应**
   - 一个数字和文本组成的返回码，用来显示请求的成功和失败
   - 一个响应头集合
   - 响应体

## AJAX 与 XMLHttpRequest

### AJAX

AJAX 是异步的 JavaScript 和 XML;  
是一种用于创建更好更快以及交互性更强的 Web 应用程序的技术;  
是一种独立于 Web 服务器软件的浏览器技术;  
不是一种新的编程语言，而是一种技术;  
使用 JavaScript 在 web 浏览器与 web 服务器之间来发送和接收数据（前端后端交互）;  
使用脚本操纵 HTTP 和 Web 服务器进行数据交换，不会导致页面重载。

![](HTTP.assets/AJAX_image_1.png)

![](HTTP.assets/AJAX_image_2.png)

### XMLHttpRequest

浏览器在 XMLHttpRequest 类上定义了它们的 HTTP API,这个类的每个实例都表示一个独立的请求/响应对，并且这个对象的属性和方法允许指定请求细节和提取响应数据。  
XMLHttpRequest 对象是 AJAX 的基础,XMLHttpRequest 用于在后台与服务器交换数据。这意味着可以 **在不重新加载整个网页的情况下，对网页的某部分进行更新**。目前所有浏览器都支持 XMLHttpRequest。  
同步编程、异步请求、局部刷新

#### 属性/方法

- responseText：作为响应体返回的文本。
- responseXML：如果响应的内容类型是 "text/xml" 或 "application/xml"，那就是包含响应数据的 XML DOM 文档。
- status：响应的 HTTP 状态。
- statusText：响应的 HTTP 状态描述。
- readyState：返回 HTTP 请求状态
  - 0 ：open() 尚未调用 **UNSENT**
  - 1 ：open() 已调用 **OPENED**
  - 2 ：接收到头信息 **HEADERS_RECEIVED**
  - 3 ：接收到响应主体 **LOADING**
  - 4 ：响应完成 **DONE**
- readystatechange 请求状态改变事件  
  当 readyState 值改变为 4 或服务器的响应完成时，所有的浏览器都触发该事件
- load 请求完成事件，减少了判断请求状态是否为完成的步骤，event.target 存放 xhr 对象
- progress 请求进度事件，可用于查看请求进度，event.target 存放 xhr 对象，需在 send 之前添加

#### 响应解码 MMIE-TYPE

1. MIME 类型为 text/plain、text/html、text/css 文本类型时，可以使用 responseText 属性解析
2. MIME 类型为 XML 文档类型时，使用 responseXML 属性解析
3. 如果服务器发送对象、数组这样的结构化数据作为其响应，他应该传输 JSON 编码的字符串数据。通过 responseText 接受到它，可以把它传递给 JSON.parse() 方法来解析。

#### 请求示例

```js
const xhr = new XMLHttpRequest();
xhr.open('get', 'http://localhost:3000/', true);// 参数三:是否异步
xhr.setRequestHeader('Content-Type', 'multipart/form-data');// 需晚于open，早于send调用

xhr.onreadystatechange = function () {
	if (xhr.readyState === 4 && xhr.status === 200) {
		// 请求完成后的操作 xhr.responseText
	}
};
xhr.onload = function (e) {
	// e.target-->xhr对象
	// 请求完成后的操作 xhr.responseText
};

// 添加表单数据
const form = new FormData();
form.append('token', 'xxxxxx');

xhr.send();
```

### 常用请求

#### 使用 get 发送有参请求

```html
<button onclick="getRequest()">Get</button>
<script type="text/javascript">
  import qs from 'qs';

  function getRequest() {
    const xhr = new XMLHttpRequest();
    // 1.拼接字符串
    xhr.open('get', 'https://localhost:3000?city=苏州&type=1');
    // 2.传递序列化后的参数
    const params = {
      city: '苏州',
      type: 1,
    };
    xhr.open(
      'get',
      'https://api.muxiaoguo.cn/api/tianqi?' + qs.stringify(params)
    );
    // ...
    xhr.send();
  }
</script>
```

#### 用 post 发送有参请求

```html
<button onclick="getRequest()">Post</button>
<script>
  function getRequest() {
    const xhr = new XMLHttpRequest();
    xhr.open('post', 'http://139.196.172.209:8888/user/login');
    const params = {
      password: '123321',
      username: 'admin1',
    };
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        console.log(xhr.responseText);
      }
    };
    // 强制重写响应的MIME类型，解析为xml
    xhr.overrideMimeType('text/xml');
    xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
    xhr.send(JSON.stringify(params));

    // 发送表单数据
    // xhr.setRequestHeader('Content-Type', 'multipart/form-data');
    // const form = document.forms[0];
    // xhr.send(new FormData(form));
  }
</script>
```

## Fetch

`fetch(input,init)`  
**init**：
- body，请求体内容。
- cache，缓存操作，[取值](https://developer.mozilla.org/zh-CN/docs/Web/API/Request/cache)。
- credentials，外发请求时如何包含 cookie。
	- omit，不包含。
	- same-origin，同源时包含。
	- include，无论是否同源，都包含。
- headers，请求头。
- method，请求方法。
- siginal，AbortController 实例。

### 发送文件

```js
let form = new FormData();
let imageInput = document.querySelector("input[type='file']");
form.append('image', imageInput.files[0]);

fetch('url', {
	method: 'POST',
	body: form
});
```

### 加载 Blob 文件

```js
const imageElement = document.querySelector('img')

fetch('my-image.png')
	.then((response) => response.blob())
	.then((blob) => {
		imageElement.src = URL.createObjectURL(blob)
	});
```

### 中断请求

通过 fetch 发送请求时，使用 AbortController API 中断发送的请求。  
当 fetch 请求初始化时，将 AbortSignal 作为一个选项传递进入请求的选项对象中。将 signal 和 controller 与 fetch 请求相关联，可以通过 AbortController.abort() 中止请求。

```jsx
function App() {
	const abortController = new AbortController();
	let { signal } = abortController;
	console.log("signal初始状态:", signal);
	
	const fetchResource = () => {
		fetch(
		"https://mdn.github.io/dom-examples/abort-api/sintel.mp4",
		{ signal }
		)
		.then((response) => {
			console.log(response);
		})
		.catch((error) => {
			console.log("Download Error:", error.message);
		});
	};

	const abortFetch = () => {
		abortController.abort();
		console.log("signal中止状态:", signal);
	};

	return (
	<>
		<button onClick={() => fetchResource()}>发起请求</button>
		<button onClick={() => abortFetch()}>中止请求</button>
	</>
	);
}
```

![](HTTP.assets/image-20221130164605500.png)

上图中，AbortSignal 对象的 aborted 属性由初始时的 false 变成了中止后的 true 。  

### Headers 和 Map

Headers 和 Map 很相似，都拥有 `get()`、`set()`、`has()`、`delete()` 等方法。  
但 Headers 初始化时可以使用键值对对象，Map 不行。

### Request 和 Response

可以通过 Request 和 Response 构造函数创建实例，传递给 fetch 进行请求和响应。  
一个实例的请求体只能读取一次 (调用 `.text()`,`.json()` 等)，否则会报错；根据 **bodyUsed** 判断是否已被读取或正在读取。  
要想多次复用可以对实例进行复制 (调用 `.clone()`)。
>Request 还可以给构造函数传入其他实例进行复制，但是会将传入实例 bodyUsed 设为 true，且两个对象不同源时会清除 referrer 属性，源对象 mode 为 navigator 时会变为 same-origin。

**ReadableStream 主体**  
递归的读取主体。

```js
// 递归读取响应主体
fetch('https://fetch.spec.whatwg.org/')
  .then((response) => response.body)
  .then((body) => {
    let reader = body.getReader();

    function processNextChunk({value, done}) {
      if (done) {
        return;
      }
      console.log(value);
      return reader.read()
        .then(processNextChunk);
    }

    return reader.read()
      .then(processNextChunk);
  });
// { value: Uint8Array{}, done: false }
// { value: Uint8Array{}, done: false }
// { value: Uint8Array{}, done: false }
// ... 
```

使用 async/await 进行读取。

```js
fetch('https://fetch.spec.whatwg.org/')
  .then((response) => response.body)
  .then(async function(body) {
    let reader = body.getReader();
    let asyncIterable = {
      [Symbol.asyncIterator]() {
        return {
          next() {
            return reader.read();
          }
        };
      }
    };
    // es9 for...await...of
    for await (let chunk of asyncIterable) {
      console.log(chunk);
    }
  });
```

使用生成器函数，支持读取部分流。

```js
let decoder = new TextDecoder();

async function* streamGenerator(stream) {
  const reader = stream.getReader();
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}
fetch('https://fetch.spec.whatwg.org/')
  .then((response) => response.body)
  .then(async function(body) {
    for await (let chunk of streamGenerator(body)) {
	    // 对于分块时多字节字符串被分到两个块中时，可以使用Encoding API处理
      console.log(decoder.decode(chunk,{stream:true}));
    }
  });
```

使用双流技术实时监测和操作流内容。

```js
fetch('https://fetch.spec.whatwg.org/')
  .then((response) => response.body)
  .then((body) => {
    const reader = body.getReader();
    // 创建第二个流
    return new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const {value, done} = await reader.read();
            if (done) {
              break;
            }
            // 将主体流的块推到第二个流
            controller.enqueue(value);
          }
        } finally {
          controller.close();
          reader.releaseLock();
        }
      }
    });
  })
  .then((secondaryStream) => new Response(secondaryStream))
  .then(response => response.text())
  .then(console.log); 
```

## Beacon 

该 API 确保在 unload 事件触发后依然可以发送请求。  
发送 POST 请求，有效载荷：ArrayBufferView、Blob、DOMString、FormData 实例。

```js
navigator.sendBeacon('https://example.com/analytics-reporting-url', '{foo: "bar"}');
```

**特性**：
- `sendBeacon()` 任何时候都可以使用。
- 调用 `sendBeacon()` 后，浏览器会把请求添加到一个内部的请求队列。浏览器会主动地发送队列中的请求。
- 浏览器保证在原始页面已经关闭的情况下也会发送请求。
- 状态码、超时和其他网络原因造成的失败完全是不透明的，不能通过编程方式处理。
- 信标（beacon）请求会携带调用 `sendBeacon()` 时所有相关的 cookie。

## Axios

Axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中。  
**特性**
- 从浏览器中创建 XMLHttpRequests
- 从 node.js 创建 http 请求
- 支持 Promise API
- 拦截请求和响应
- 转换请求数据和响应数据
- 自动转换 JSON 数据

### 安装

使用 npm

```Shell
$ npm install axios
```

使用 cdn

```html
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```

### 发送请求

#### get 请求

步骤：
1. 引入 axios
2. 使用 axios.get 发送请求
    - 不带参 axios.get(url)
    - 带参 axios.get(url,{params:obj}) 参数携带在 url 后，作为查询字符串参数存在
3. 接收响应

```JavaScript
<div id="app">
	{{ list }}
</div>
<script>
	new Vue({
		el:"##app",
		data() {
			return {
				list:[]
			}
		},
		created() {
			this.findAllCategory()
		},
		methods: {
			findAllCategory() {
				axios.get('http://39.96.21.48:5588/category/findAll').then((res)=>{
					console.log(res.data.data)
					// 调用接口查询的结果
					this.list = res.data.data
				})
			}
		}
	})
</script>
```

#### post 请求

步骤：
1. 引入 axios
2. 使用 axios.post 发送请求
    - 不带参 axios.post(url)
    - 带参 axios.post(url,obj,{params:obj2}) 给后台的参数 obj 携带在请求体，给后台的参数 obj2 携带在 url 后
3. 接收响应

```JavaScript
<div id="app">
	{{ token }}
</div>
<script>
	new Vue({
		el:"##app",
		data() {
			return {
				token:''
			}
		},
		created() {
			this.loginHandler()
		},
		methods: {
			loginHandler() {
				let obj = {
					username:'admin',
					type:'manager',
					password:123321
				}
				axios.post('http://39.96.21.48:5588/user/login',obj).then((res)=>{
					console.log(res.data.data)
					this.token = res.data.data
				})
			}
		}
	})
</script>
```

**响应结构**

```JavaScript
{

  // `data` 由服务器提供的响应
  data: {},
  
  // `status` 来自服务器响应的 HTTP 状态码
  status: 200,
  
  // `statusText` 来自服务器响应的 HTTP 状态信息
  statusText: 'OK',
  
  // `headers` 服务器响应的头
  headers: {},
  
  // `config` 是为请求提供的配置信息
  config: {},
}
```

### API 与请求配置

可以通过向 axios 传递相关配置来创建请求。  
`axios(config)`  
config 是创建请求时可以用的配置选项。只有 url 是必需的。如果没有指定 method，请求将默认使用 get 方法。

```JavaScript
{
  // `url` 是用于请求的服务器 URL
  url: '/user',
  
  // `method` 是创建请求时使用的方法
  method: 'get', // default
  
  // `headers` 是即将被发送的自定义请求头
  headers: {'X-Requested-With': 'XMLHttpRequest'},
  
  // `params` 是即将与请求一起发送的 URL 参数
  // 必须是一个无格式对象(plain object)或 URLSearchParams 对象
  params: {
    ID: 12345
  },
  
  // `data` 是作为请求主体被发送的数据
  data: {
    firstName: 'Fred'
  },
  
  // `timeout` 指定请求超时的毫秒数(0 表示无超时时间)
  // 如果请求花费了超过 `timeout` 的时间，请求将被中断
  timeout: 1000,
}
```

请求方法的 **别名**（为方便起见，为所有支持的请求方法提供了别名）：
- `axios.request(config)`
- `axios.get(url[, config])`
- `axios.delete(url[, config])`
- `axios.head(url[, config])`
- `axios.options(url[, config])`
- `axios.post(url[, data[, config]])`
- `axios.put(url[, data[, config]])`
- `axios.patch(url[, data[, config]])`

使用别名方法时， url、method、data 属性都不必在 config 中指定。

### 配置默认值

#### 全局的 axios 默认值

```JavaScript
axios.defaults.baseURL = 'https://api.example.com';
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
```

#### 自定义实例默认值

```JavaScript
const instance = axios.create({
  baseURL: 'https://api.example.com'
});
// 或
instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
```

### 拦截器

在请求或响应被 then 或 catch 处理前拦截它们。一般可以用于对登录后获得的令牌 token 进行处理。
>**请求拦截器** 是 **倒序** 执行的，  
>**响应拦截器** 是 **正序** 执行的。

#### 请求拦截器

```JavaScript
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
	// 在发送请求之前做些什么，可以处理数据格式或者对某些请求url做特殊处理
	if (config.method == 'post' && config.url !== '/user/login') {
		// 表单数据
		config.data = qs.stringify(config.data);
	} 
	return config;
}, function (error) {
	// 对请求错误做些什么
	return Promise.reject(error);
});
```

#### 响应拦截器

```JavaScript
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
	// 对响应数据做点什么
	let res = {
		...response,
		data: response.data.data,
		status: response.data.status,
		statusText: response.data.message,
	};
	// return response;
	return res;
}, function (error) {
	// 对响应错误做点什么
	return Promise.reject(error);
});
```

#### 移除拦截器

```JavaScript
const myInterceptor = axios.interceptors.request.use(function () {/*...*/});
axios.interceptors.request.eject(myInterceptor);
```

### 中断请求 

**AbortController**  

```js
const controller=new AbortController();

axios.get(url,{signal:controller.signal})
	.then((res)=>{console.log(res)});

controller.abort() // 取消请求
```

**CancelToken**(已弃用)  
使用 CancelToken 工厂方法的 source 方法返回一个包含 cancel 和 token 的对象，将 token 作为请求参数传递。  
通过调用 cancel 来取消请求，cancel 的参数是自定义的信息。  

```jsx
function App() {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  console.log("source初始状态:", source);

  const fetchResource = () => {
    axios
      .get("[url]", {
        // 在get请求中CancelToken作为第二个参数传入
        // 在post请求中CancelToken作为第三个参数传入
        cancelToken: source.token,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        // 判断请求是否已中断
        if (axios.isCancel(error)) {
          console.log("Download Error:", error.message);
        } else {
          console.log(error);
        }
      });
  };

  const abortFetch = () => {
    source.cancel("Operation canceled by the user.");
    console.log("source中止状态:", source);
  };

  return (
    <>
      <button onClick={() => fetchResource()}>发起请求</button>
      <button onClick={() => abortFetch()}>中止请求</button>
    </>
  );
}
```

![](HTTP.assets/image-20221130164426419.png)

source 只返回包含 cancel 和 token 的对象，无法判断请求是否中断，需要使用 axios 提供的 isCancel 方法判断。  

axios 中断请求本质还是调用 `abort()` 来中断请求。  
在 CancelToken 这个类初始化的时候需要传递一个 executor 参数，在这个类的内部还创建了一个 promise ，然后定义了一个变量，把 promise 的 resolve 方法控制权放在了 exexutor 方法的执行体中。  
这样做的目的是为了可以在外面控制 promise 的 resolve 。在 promise 的外部定义了一个 resolvePromise 变量，在 promise 的内容将 resolve 赋值给了 resolvePromise 这个变量，所以可以通过直接调用 resolvePromise 来执行 promise 的 resolve。  

![](HTTP.assets/image-20221130172030017.png)

当调用 cancel 方法后，会立即执行 abort 方法取消请求，同时调用 reject 让外层的 promise 的 reject 执行。  

## 跨源资源共享 CORS

**request**  
`Origin`，携带发送的地址。  
**response**  
`Access-Control-Allow-Origin`，设置进行响应的地址。

**跨域 XHR 对象**：  
不能通过 `setRequestHeader()` 设置自定义头部；  
不能发送和接受 cookie；  
getAllResponseHeaders() 方法始终返回空字符串。

**预检请求**：  
允许使用自定义请求头、GET 和 POST 之外的方法和不同请求体内容类型。  
**request**  
`Origin`：与简单请求相同。  
`Access-Control-Request-Method`：请求希望使用的方法。  
`Access-Control-Request-Headers`：（可选）要使用的逗号分隔的自定义头部列表。  
**response**  
`Access-Control-Allow-Origin`：与简单请求相同。  
`Access-Control-Allow-Methods`：允许的方法（逗号分隔的列表）。  
`Access-Control-Allow-Headers`：服务器允许的头部（逗号分隔的列表）。  
`Access-Control-Max-Age`：缓存预检请求的秒数。

**凭据请求**：  
**request**  
`withCredentials=true`，携带凭据（cookie、HTTP 认证和客户端 SSL 证书）。  
**response**  
`Access-Control-Allow-Credentials: true`，响应没有该头部时，浏览器不会把凭据交给 JavaScript（responseText 是空字符串，status 是 0，`onerror()` 被调用）。

## 替代性跨源技术

替代性跨源技术是 CORS 出现之前的实现方式，其不需要修改服务器。

**图片探测**  
img 能够不受限制从其他域加载资源。  
通过 `onload()` 和 `onerror()` 知道什么时候接收响应，但只能发送 GET 请求且不能获得服务器响应内容。

```js
let img = new Image();
img.onload = img.onerror = function () {
	alert('Done!');
};
img.src = 'http://www.example.com/test?name=lili';
```

**JSONP**  
包含回调和数据两部分，`<script>` 能够不受限制从其他域加载资源。  
需要确保响应域可信任，且不能确定是否失败。

```js
function handleResponse(response) {
	console.log(`You're at IP address ${response.ip}, which is in ${response.city}, ${response.region}`);
}

let script = document.createElement('script');
script.src = 'http://freegeoip.net/json/?callback=handleResponse';
document.body.insertBefore(script, document.body.firstChild);
```

## 参考

[面试官：如何中断已发出去的请求？ - 掘金 (juejin.cn)](https://juejin.cn/post/7033906910583586829)  
[(1条消息) axios.CancelToken_海绵杨宝宝的博客-CSDN博客_axios.canceltoken](https://blog.csdn.net/qq_41820577/article/details/102868824)  
[axios 之cancelToken原理以及使用 - 诗和远方-ysk - 博客园 (cnblogs.com)](https://www.cnblogs.com/ysk123/p/11544211.html)  