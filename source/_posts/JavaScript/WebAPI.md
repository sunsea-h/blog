---
title: WebAPI
categories:
  - JavaScript
date: 2022-10-19 16:56:25
updated: 2024-05-06 16:28:32
---

# WebAPI

### Element.getBoundingClientRect()

返回一个 DomRect 对象。其中 width 和 height 为元素的 **实际宽高**。  
内容盒子：borderWidth/borderHeight + padding + width/height  
边框盒子：width/height (borderWidth + padding + 内容宽/高)

坐标原点为 **可视区域** 的左上角。  
![](WebAPI.assets/image-20221020110312867.png)

### IntersectionObserver

异步观察目标元素和祖先元素或顶级文档视窗（ viewport ）交叉状态的方法，祖先元素和文档视窗视为根元素。  

IntersectionObserver 对象被创建时，  
- 配置为监听 **根** 中一段给定比例可见区域的特定变化值；  
- 可配置多个目标元素；  
- 一旦被创建无法修改配置。

监听到可视区域穿过一个或多个阈值，执行指定回调函数。

```js
// 创建实例
const observer = new IntersectionObserver(callback[, option]);
 
// 开始观察element1
observer.observe(element1);
 
// 开始观察element2
observer.observe(element2);
 
// 停止观察
observer.unobserve(element);
 
// 关闭观察器
observer.disconnect();
```

参数：  
**1. callback：变化时执行的回调函数 (第一次监听目标元素、发生交集时)**  
- 参数：  
  数组，每个成员都是一个 **IntersectionObserverEntry** 对象，数量为观察元素发生变化的数量。  

**IntersectionObserverEntry** 对象  
- `boundingClientRect`：目标元素的矩形区域的信息
- `intersectionRatio`：目标元素的可见比例，即 intersectionRect 占 boundingClientRect 的比例，完全可见时为 1，完全不可见时小于等于 0
- `intersectionRect`：目标元素与视口（或根元素）的交叉区域的信息
- `rootBounds`：根元素的矩形区域的信息，getBoundingClientRect() 方法的返回值，如果没有根元素（即直接相对于视口滚动），则返回 null
- `isIntersecting`：目标元素是否与视口（或根元素）交叉
- `isVisible`：并未查阅到相关资料，且经过测试其并不会发生变化
- `target`：被观察的目标元素，是一个 DOM 节点对象
- `time`：可见性发生变化的时间，是一个高精度时间戳，单位为毫秒

**2. option：配置对象**  
- `root`：指定根元素，用于检查目标的可见性。必须是目标元素的父级元素。如果未指定或者为 null，则默认为浏览器视窗。
- `rootMargin`：根元素的外边距，类似于 CSS 中的 margin 属性。
- `threshold`：目标元素与根元素的交叉比例，可以是单一的 number 也可以是 number 数组，比如，[0, 0.25, 0.5, 0.75, 1] 就表示当目标元素 0%、25%、50%、75%、100% 可见时，会触发回调函数。

**注意**： 异步，不随目标元素滚动同步触发

**适用于**：图片懒加载、内容无限滚动等
1. 图片懒加载

使用计算，距离页面顶部距离 <= 滚动距离 + 可视区域高度（旧）

```html
<body style="text-align: center;font-size: 24px;">
  <div class="img">
    <div>
      <img src="##" data-url="./1.png">
    </div>
    <div>
      <img src="##" data-url="./1.png">
    </div>
    <div>
      <img src="##" data-url="./1.png">
    </div>
    <div>
      <img src="##" data-url="./1.png">
    </div>
    <div>
      <img src="##" data-url="./1.png">
    </div>
    <div>
      <img src="##" data-url="./1.png">
    </div>
  </div>
  <script>
    const imgs = document.getElementsByTagName("img");

    function loadImg() {
      const innerHeight = window.innerHeight; // 可视区域高度
      Array.from(imgs).forEach(img => {
        const imgRect = img.getBoundingClientRect();
        const top = imgRect.top // 目标元素上边界距离可视区域的距离
        if (top < innerHeight) {
          img.src = img.getAttribute('data-url');
        }
      })
    }
    loadImg();
    window.addEventListener('scroll', loadImg);
  </script>
</body>
```

使用 **IntersectionObserver** （新）

```html
<body style="text-align: center;font-size: 24px;">
  <div class="img">
    <div>
      <img src="##" data-url="./1.png">
    </div>
    <div>
      <img src="##" data-url="./1.png">
    </div>
    <div>
      <img src="##" data-url="./1.png">
    </div>
    <div>
      <img src="##" data-url="./1.png">
    </div>
    <div>
      <img src="##" data-url="./1.png">
    </div>
    <div>
      <img src="##" data-url="./1.png">
    </div>
  </div>
  <script>
    const imgs = document.getElementsByTagName("img");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((item) => {
        const img = item.target;
        if (item.intersectionRatio > 0 && item.intersectionRatio <= 1) {
          img.src = img.getAttribute('data-url');
        }
      })
    })
    Array.from(imgs).forEach(img => {
      observer.observe(img);
    })
  </script>
</body>
```

2. 内容无限滚动

使用计算，滚动距离 + 可视区域高度 >= 目标元素距离顶部距离（旧）

```html
<body style="text-align: center;font-size: 24px;">
  <div id="container"></div>
  <div id="loadMore">加载中...</div>

  <script>
    const container = document.querySelector("##container");
    const loadMore = document.querySelector("##loadMore");
    let index = 0;

    const loadItem = (count) => {
      [...Array(count).keys()].forEach(key => {
        const p = document.createElement('p')
        p.innerHTML = `${key + index}`
        container.appendChild(p)
      })
      index += count;
    }
    loadItem(20);
    window.addEventListener('scroll', () => {
      const pageYOffset = window.pageYOffset; // 滚动的距离
      const innerHeight = window.innerHeight; // 可视区域高度
      const offsetTop = loadMore.offsetTop; // 目标元素距离顶部距离
      if (pageYOffset + innerHeight >= offsetTop) {
        loadItem(20);
      }
    })
  </script>
</body>
```

计算较复杂，容易出错。

使用 **IntersectionObserver**（新）

```html
<body style="text-align: center;font-size: 24px;">
  <div id="container"></div>
  <div id="loadMore">加载中...</div>

  <script>
    const container = document.querySelector("##container");
    const loadMore = document.querySelector("##loadMore");
    let index = 0;

    const loadItem = (count) => {
      [...Array(count).keys()].forEach(key => {
        const p = document.createElement('p')
        p.innerHTML = `${key + index}`
        container.appendChild(p)
      })
      index += count;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ isIntersecting }) => {
        if (isIntersecting) loadItem(20);
      })
    })
    observer.observe(loadMore);

  </script>
</body>
```

如果观察对象一开始就在可视区域内，则无法触发，如下图。需要让观察对象在开始时处于可视区域外，然后滚动后与可视区域发生交集，才会触发回调函数。

![](WebAPI.assets/image-20221020100235238.png)

### execCommand（实现点击复制内容）

原生 JS 实现 (通过 `execCommand` )

```html
<input type="text">
<button onClick="copyFn()">点击复制</button>
<script>
	function copyFn() {
		let txt = document.getElementsByTagName('input')[0].value;
		copy(txt);
	}

	function copy(item) {
		let span = document.createElement('span');
		let Text = document.createTextNode(item);
		span.appendChild(Text);
		document.body.appendChild(span);
		window.getSelection().selectAllChildren(span);
		document.execCommand("Copy"); // 执行 copy 命令
		document.body.removeChild(span);
	}
</script>
```

![](WebAPI.assets/image-20230214101439959.png)

使用第三方组件 react-clipboard.js

```jsx
import Clipboard from 'react-clipboard.js';
function App() {
	const copyContent = '需要复制的内容'; 
	return (
		<Clipboard data-clipboard-text={copyContent}>
			点击复制
		</Clipboard>
	)
}
```

### MediaDevices

`navigator.mediaDevices` 的属性只有特定域才可以获取，否则为 undefined 。
- `localhost` 域
- 开启了 HTTPS 的域
- 使用 `file:///` 协议打开的本地文件

### requestIdleCallback

存在屏幕刷新，计算剩余时间，存在空闲时执行；  
不存在屏幕刷新，设置 50ms 的固定空闲时间执行。
> 研究 100ms 内响应为瞬时，保留 50ms 执行用户输入等操作，不影响屏幕刷新。

注意：
 - 避免在空闲时间改变 DOM，使用 requestAnimationFrame 调度。

### WebSockets

## WebRTC