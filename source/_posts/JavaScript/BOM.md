---
title: BOM
date: 2022-09-05 11:33:18
updated: 2023-03-23 14:00:27
---

# BOM

## window 对象

BOM 的核心是 window 对象，表示浏览器的实例。window 对象在浏览器中有两重身份，一个是 ECMAScript 中的 Global 对象，另一个就是浏览器窗口的 JavaScript 接口。这意味着网页中定义的所有对象、变量和函数都以 window 作为其 Global 对象，都可以访问其上定义全局方法。

### Global 作用域

因为 window 对象被复用为 ECMAScript 的 Global 对象，所以通过 var 声明的所有全局变量和函数都会变成 window 对象的属性和方法。比如：

```javascript
var name = 'zhangsan';
var sayName = function(){
	console.log(this.name);
}
console.log(window.name);//zhangsan
sayName();//zhangsan
window.sayName();//zhangsan
```

这里，变量 name 和函数 sayName() 被定义在全局作用域中，它们自动成为了 window 对象的成员。因此，变量 name 可以通过 window.name 来访问，而函数 sayName() 也可以通过 window.sayName() 来访问。因为 sayName() 存在于全局作用域，this.name 映射到 window.name，所以就可以显示正确的结果。

### Window 窗口

#### 窗口关系

- top：指向最顶层窗口对象。
- parent：指向当前窗口的父窗口。
- self：始终指向 window 对象。

#### 窗口位置

- **screenLeft 和 screenTop**  
属性返回窗口相对于 **屏幕** 的 X 和 Y 坐标。(火狐浏览器不支持)
- **screenX 和 screenY**  
属性返回窗口相对于 **屏幕** 的 X 和 Y 坐标。(ie 浏览器不支持，火狐可以使用此属性)
- **pageXOffset**  
设置或返回当前页面相对于 **窗口显示区** 左上角的 X 位置。
- **pageYOffset**  
设置或返回当前页面相对于 **窗口显示区** 左上角的 Y 位置。
- **devicePixelRatio**  
屏幕显示像素中物理像素与逻辑像素的缩放系数。

**注意：** IE8 及更早 IE 版本不支持该属性,但可以使用 "document.body.scrollLeft" 和 "document.body.scrollTop" 属性 。

**视口位置**  
`window.pageXoffset`/`window. scrollX` 和 `window.pageYoffset`/`window.scrollY`  
相对于视口滚动距离的属性。

#### 窗口大小

- **innerWidth**  
页面视图区的宽度 (包含滚动条)
- **innerHeight**  
页面视图区的高度 (包含滚动条)
- **outerWidth**  
浏览器窗口的宽度
- **outerHeight**  
浏览器窗口的高度

**注意：** 所有主流浏览器都支持 innerWidth,innerHeight,outerWidth,outerHeight 属性。注意：IE8 及更早 IE 版本不支持这些属性。

**width 和 height**  
`document.documentElement` 引用文档根元素的 html 标记；  
`document.body` 引用了文档的 body 标记。
 
`document.documentElement.scrollWidth` 返回整个文档的宽度。  
`document.documentElement.offsetWidth` 返回整个文档的可见宽度。  
`document.documentElement.clientwidth` 返回整个文档的可见宽度（不包含边框），`clientwidth = offsetWidth - borderWidth`。  
注：当 body 没有设置宽度时，scrollWidth,offsetWidth,clientWidth 与 documentElement 相同。 

### Window open()

`window.open()` 方法可以用于导航到指定 URL，也可以用于打开新浏览器窗口。这个方法接收 4 个参数：要加载的 URL、目标窗口、特性字符串和表示新窗口在浏览器历史记录中是否替代当前加载页面的布尔值。  
通常，调用这个方法时只传前 3 个参数，最后一个参数只有在不打开新窗口时才会使用。

```javascript
window.open(URL,name,specs,replace)

// 与<a href="http://www.wrox.com" target="topFrame"/>相同
window.open("http://www.wrox.com/", "topFrame");

window.open("http://www.wrox.com/", 
 "wroxWindow", 
 "height=400,width=400,top=10,left=10,resizable=yes");// 参数三不能包含空格
```

##### URL

可选。打开指定的页面的 URL。如果没有指定 URL，打开一个新的空白窗口。

##### name

可选。指定 target 属性或窗口的名称。支持以下值：
- \_blank：URL 加载到一个新的窗口。这是默认
- \_parent：URL 加载到父框架
- \_self：URL 替换当前页面
- \_top：URL 替换任何可加载的框架集
- name：窗口名称

##### specs

可选。一个逗号分隔的项目列表。支持以下值：

| hannelmode=yes\|no\|1\|0  |   是否要在影院模式显示 window。默认是没有的。仅限 IE 浏览器    |
| :-----------------------: | :----------------------------------------------------------: |
| directories=yes\|no\|1\|0 |         是否添加目录按钮。默认是肯定的。仅限 IE 浏览器         |
| fullscreen=yes\|no\|1\|0  | 浏览器是否显示全屏模式。默认是没有的。在全屏模式下的 window，还必须在影院模式。仅限 IE 浏览器 |
|       height=pixels       |                   窗口的高度。最小.值为 100                   |
|        left=pixels        |                       该窗口的左侧位置                       |
|  location=yes\|no\|1\|0   |                 是否显示地址字段.默认值是 yes                 |
|   menubar=yes\|no\|1\|0   |                  是否显示菜单栏.默认值是 yes                  |
|  resizable=yes\|no\|1\|0  |                是否可调整窗口大小.默认值是 yes                |
| scrollbars=yes\|no\|1\|0  |                  是否显示滚动条.默认值是 yes                  |
|   status=yes\|no\|1\|0    |               是否要添加一个状态栏.默认值是 yes               |
|  titlebar=yes\|no\|1\|0   | 是否显示标题栏.被忽略，除非调用 HTML 应用程序或一个值得信赖的对话框.默认值是 yes |
|   toolbar=yes\|no\|1\|0   |               是否显示浏览器工具栏.默认值是 yes               |
|        top=pixels         |                 窗口顶部的位置.仅限 IE 浏览器                  |
|       width=pixels        |                   窗口的宽度.最小.值为 100   

##### replace

Optional.Specifies 规定了装载到窗口的 URL 是在窗口的浏览历史中创建一个新条目，还是替换浏览历史中的当前条目。支持下面的值：
- true：URL 替换浏览历史中的当前条目。
- false：URL 在浏览历史中创建新的条目。

### 系统对话框

使用 alert()、confirm() 和 prompt() 方法，可以让浏览器调用系统对话框向用户显示消息。这些对话框与浏览器中显示的网页无关，而且也不包含 HTML。它们的外观由操作系统或者浏览器决定，无法使用 CSS 设置。此外，这些对话框都是同步的模态对话框，即在它们显示的时候，代码会停止执行，在它们消失以后，代码才会恢复执行。

find()、print() 是两种异步对话框，不在对话框计数中，用户禁用对话框不被影响。

#### alert()

alert() 接收一个要显示给用户的字符串（不是字符串会调用 toString() 方法转换成字符串）。  
alert() 只接收一个参数，对话框只有确认按钮。

一般会用于在项目中前后台传参时，判断是否进入某一步，有没有拿到数据。

#### confirm()

确认框通过调用 confirm() 来显示。确认框跟警告框类似，都会向用户显示消息。但不同之处在于，确认框存在确认和取消按钮。点击确认返回值为 true，点击取消或关闭对话框返回值为 false。

#### prompt()

提示框，通过调用 prompt() 方法来显示。提示框的用途是提示用户输入消息。点击确认按钮返回文本框的值，点击取消或关闭对话框返回 null。  
prompt() 方法接收两个参数：要显示给用户的文本，以及文本框的默认值（可以是空字符串）。

## location 对象

location 对象是提供了与当前窗口中加载的文档有关的信息，还提供一些导航功能，保存着把 URL 解析为离散片段后能够通过属性访问的信息。  
location 既是 window 的对象也是 document 的对象，而 document 是 window 对象的属性。直接使用 location 对象也可以。

```javascript
console.log(window.location === document.location); //true
console.log(location === document.location);	//true
console.log(location === window.location);	//true
```

#### 属性

- **host**：返回服务器 **名称和端口号**`www.baidu.com:80`  
- **hostname**：返回 **不带端口号** 的服务器 **名称**`www.baidu.com`  
- **href**：返回当前加载页面的 **完整 URL**`http://www.baidu.com:80/test/?p=5#head`  
- **pathname**：返回 URL 的 **目录和文件名**`/test/`  
- **port**：返回 URL 中指定的 **端口号**`80`  
- **protocol**：返回页面使用的 **协议**`http:`  
- **search**：返回 URL 的 **查询字符串**`?p=5`
- **hash**：URL 散列值，无则为空 `#head`
- **origin**：URL 源地址（只读）`http://www.baidu.com`

**解析查询字符串**

```js
let getQueryStringArgs = function () {
  // 取得没有开头问号的查询字符串
  let qs = (location.search.length > 0 ? location.search.substring(1) : ""),
    // 保存数据的对象
    args = {};
  // 把每个参数添加到 args 对象
  for (let item of qs.split("&").map(kv => kv.split("="))) {
    let name = decodeURIComponent(item[0]),
      value = decodeURIComponent(item[1]);
    if (name.length) {
      args[name] = value;
    }
  } 
  return args;
} 
```

URLSearchParams 提供了一些处理查询字符串的 API。

#### 方法

- **assign()**  
	传递一个 url 参数，打开新 url，并在浏览记录中生成一条记录。
- **replace()**  
	参数为一个 url，结果会导致浏览器位置改变，但不会在历史记录中生成新记录。
- **reload()**  
	重新加载当前显示的页面，参数可以为 boolean 类型，默认为 **false**，表示以最有效方式重新加载，可能从 **缓存** 中直接加载。  
	如果参数为 **true**，强制从 **服务器** 中重新加载。

## navigator 对象

通常用于确认浏览器的类型。  
常用属性：
- **userAgent**：返回浏览器的用户代理字符串
- **mediaDevices**： 返回可用的媒体设备
- **plugins**：返回浏览器加载的插件
- **registerProtocolHandler(要处理的协议,处理该协议的 URL,应用名称)**：注册处理程序，将 Web 应用程序注册为像桌面应用一样的默认应用程序

```js
// %s表示原始请求
navigator.registerProtocolHandler("mailto", 
 "http://www.somemailclient.com?cmd=%s", 
 "Some Mail Client");
```

## screen 对象

记录浏览器窗口外的客户端显示器信息。

- **width/height**：屏幕总宽度/高度 (像素单位)
- **availWidth/availHeight**：可用宽度/高度 (像素单位) 总高度 - 浏览器选项卡高度
- **colorDepth**：颜色深度
- **pixelDepth**：颜色分辨率

## history 对象

该对象保存着用户上网的历史记录。出于安全方面的考虑，开发人员无法得知用户浏览过的 URL，不过借由用户访问过的页面列表，同样可以在不知道实际 URL 的情况下实现后退前进。
- **length**  
	返回历史列表中的网址数  
	**注意：** Internet Explorer 和 Opera 从 0 开始，而 Firefox、Chrome 和 Safari 从 1 开始。
- **back()**  
	加载 history 列表中的前一个 URL
- **forward()**  
	加载 history 列表中的下一个 URL
- **go()**  
	加载 history 列表中的某个具体页面，负数表示向后跳转，正数表示向前跳转。

### 历史状态管理

- **replaceState(state 对象)**：替换状态，替换历史记录
- **popState(state 对象)**：执行后退，更新状态
- **pushState(state 对象, 字符串, 相对 URL)**：向历史记录中推入状态信息，更新地址栏，但不会向服务器发送请求

```js
// state对象大小通常在 500KB～1MB 以内
let stateObject = {foo:"bar"}; 
history.pushState(stateObject, "My title", "baz.html"); 
```

## 超时调用和间歇调用

javascript 是单线程语言，但是可以通过超时值和间歇时间来调度代码在特定时刻执行。

#### setTimeout(执行代码，时间 (ms))

该方法返回一个数值 ID，表示超时调用，这个超时调用 ID 是计划执行代码的唯一标识符通过它来取消超时调用。可以通过 clearTimeout(ID);

```html
<body>
    <script>
        var id = setTimeout(()=>{
            console.log('hello world');//立即执行函数ES6
        }, 1000);
        console.log(id);
        //取消超时调用
        clearTimeout(id);
    </script>
</body>
```

#### setInterval(执行代码，时间 (ms))

按照指定的时间间隔重复执行代码，直到间歇调用被取消或页面被卸载。调用该方法也会返回一个间歇调用 ID，该 ID 可以用户在将来某个时刻取消间歇调用。

```html
<body>
    <script>
        var div = document.createElement('div')
        var id = setInterval(()=>{
            div.innerHTML = new Date().toLocaleString();//立即执行函数ES6
        }, 1000);
        document.body.appendChild(div);
		//取消间歇调用
        clearInterval(id);
	</script>
</body>
```