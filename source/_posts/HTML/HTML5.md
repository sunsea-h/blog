---
title: HTML5
date: 2022-09-05 11:33:18
updated: 2025-02-26 10:27:43
---
# HTML5

## 新增标签

**语义化标签**：article、section、aside、header、nav、footer、address

**progress**：表示运行中的进度  
`<progress value='50' max='100'></progress>`

**input 输入框**
1. placeholder 用来描述输入字段预期值的提示信息。输入字段为空时显示
2. type 的类型  
	可以设置为 number,date 等。`type=‘number’` 只能输入数字类型，火狐没效果，谷歌可以，兼容性差

## 音视频

1. **video 视频**  
H5 中 video 标签可以向向使用 img 显示图片一样简单去播放视频。

**属性**：
- src：需要引入的视频资源地址
- controls：是否显示视频的控件，比如播放暂停进度条音量全屏等。
- autoplay：在视频就绪后马上播放。跟 muted 搭配使用，否则可能不能自动播放。
- muted ：视频的音频为静音。
- loop：当视频完成播放后再次开始播放
- volume：视频的音量 0~1
- duration ：视频的总时长
- currentTime：当前播放的进度
- paused：当前视频的状态是否暂停暂停 true
- width：设置宽度
- height：设置高度

**方法**：
- play()：播放
- load()：重新加载当前视频
- pause()：暂停方法

```html
<video src="视频地址" controls ></video>
<div class="btns">
	<button>播放</button>
	<button>暂停</button>
	<button>快进</button>
	<button>快退</button>
	<button>快倍速</button>
	<button>慢倍速</button>
</div>
<div class="play">
	<button id="play">播放</button>
	<button id="progress">获得播放百分比</button>
</div>
<div class="showprogress"></div>

<script>
	var video = document.getElementsByTagName('video')[0]
	var btns = document.getElementsByClassName('btns')[0]
	btns.onclick = function(){
		var text = event.target.innerText
		if(text == '播放'){
			video.play()
		}
		if(text == '暂停'){
			video.pause()
		}
		if(text == '快进'){
			video.currentTime +=10
			video.play()
		}
		if(text == '快退'){
			video.currentTime -=10
			video.play()
		}
		if(text == '快倍速'){
			video.playbackRate *= 1.2
			video.play()
		}
		if(text == '满倍速'){
			video.playbackRate *= 0.1
			video.play()
		}
	}

	// 同一个按钮实现暂停播放
	var play_btn = document.getElementById('play')
	play_btn.onclick = function(){
		if(video.paused){            //判断视频播放状态  true为暂停
			video.play()
			play_btn.innerText = '暂停'
		}else{
			video.pause()
			play_btn.innerText = '播放'
		}
	}


	// 获得播放的百分比
	var progress = document.getElementById('progress')
	progress.onclick= function(){
		var total = video.duration
		var current = video.currentTime
		var res = (current/total*100).toFixed(2) +'%'
		console.log(res);
		//将百分比存入div
		var showprogress = document.getElementsByClassName('showprogress')[0]
		showprogress.innerText = res
	}
</script>
```

2. **audio 音频**  
audio 元素和 video 类似，是用来播放音频的。其属性方法事件也几乎与 video 元素一致

## 动画

- **requestAnimationFrame()**，通知浏览器 JavaScript 动画要执行了。
- **cancelAnimationFrame()**，取消重绘任务。

```js
// 限流：将回调限制为不超过 50 毫秒执行一次
let enabled = true;
function expensiveOperation() {
  console.log('Invoked at', Date.now());
}
window.addEventListener('scroll', () => {
  if (enabled) {
    enabled = false;
    const requestID = window.requestAnimationFrame(expensiveOperation);
    window.setTimeout(() => enabled = true, 50);
    // 可用返回的ID取消重绘
    // window.cancelAnimationFrame(requestID);
  }
});
```

## canvas

canvas 元素专门用来绘制图形。在页面中放置一个 canvas 元素，就相当于在页面上放置一块画布，可以利用 canvas api 在其中进行图形的描绘。canvas 只是一个容器，不具备绘制能力，需要编写 js 代码实现。

### 导出图像

```js
// 获取canvas元素对象
let drawing = document.getElementById("drawing");
// 确保浏览器支持<canvas> 
if (drawing.getContext) {
  // 取得图像的数据 URI 
  let imgURI = drawing.toDataURL("image/png");
  // 显示图片
  let image = document.createElement("img");
  image.src = imgURI;
  document.body.appendChild(image);
}
```

### 矩形

1. 取得 canvas 对象
2. 取得 2d 上下文（context）
3. 设定绘图样式，使用图形上下文对象中的 fillStyle 填充样式 、strokeStyle 边框样式
4. 指定线宽，使用图形上下文对象中的（lineWidth）
5. 绘制矩形，使用图形上下文对象的

```html
<!-- canvas 画布宽高用heigh和width属性设置 -->
<canvas height="500" width="500" style="border: 1px solid ##333;">
此处内容在浏览器不支持canvas元素时显示
</canvas>

<script>
  // 1.获取canvas对象
  var canvas = document.getElementsByTagName('canvas')[0];
  // 2.获取canvasd的2d上下文
  // 有些浏览器对不存在的元素返回默认HTML元素对象，会不包含getContext
  if (canvas.getContext) {
    var context = canvas.getContext('2d');
    // 3.设置填充模式   填充/描边
    context.fillStyle = 'red';   //填充
    context.strokeStyle = 'blue';  //描边
    // 4.设置线宽  描边时需要设置线宽
    context.lineWidth = '1';
    // 5.绘制矩形 (x坐标，y坐标，宽度，高度)
    // 填充矩形
    context.fillRect(20, 20, 100, 100);
    // 描边矩形
    context.strokeRect(200, 200, 200, 200);
    // 清除矩形
    context.clearRect(20, 20, 30, 30);
  }
</script>
```

### 圆形

1. 取得 canvas 对象
2. 取得 2d 上下文（context）
3. 设定绘图样式，使用图形上下文对象中的 fillStyle 填充样式、strokeStyle 边框样式
4. 指定线宽，使用图形上下文对象中的（lineWidth）
5. 开始创建路径 `context.beginPath()`
6. 设置路径 `context.arc(x, y, radius, startAngle, endAanle, direction)`  
	参数分别是：圆心 x 坐标，圆心 y 坐标，半径，开始角度 (弧度制)，结束角度 (弧度制)，绘制方向（false 顺时针、true 逆时针）
7. 关闭路径 `context.closePath()`
8. 设定绘制样式，进行图形绘制 fill()、stroke() 重复绘制圆形

```html
<canvas height="500" width="500" style="border: 1px solid ##333;"></canvas>
<script>
	// 1.获取canvas对象lx
	var canvas = document.getElementsByTagName('canvas')[0]
	// 2.获取canvasd的2d上下文
	var context = canvas.getContext('2d');
	// 3.设置填充模式   填充/描边
	context.fillStyle = 'red'
	context.strokeStyle = 'blue'
	// 4.设置线宽  描边时需要设置线宽
	context.lineWidth = '1'
	// 5.开始路径
	context.beginPath()
	// 6.设置路径
	context.arc(200,200,50, Math.PI /180 * 0,Math.PI/180*360,)
	// 7.关闭路径
	context.closePath()
	// 8.绘制圆形
	context.fill()   // 填充圆形
	context.stroke()     // 描边圆形
</script>
```

### 渐变色

1. 取得 canvas 对象
2. 创建渐变对象，并添加渐变色

```javascript
var gradient = context.createLinearGradient(xstart,ystart,xend,yend)
// 参数为：起始点x坐标，y坐标，结束点x坐标，y坐标。
gradient.addColorStop(number,'color')
gradient.addColorStop(number,'color')
// number为偏移量，0～1之间
```

3. 获取 2d 上下文 context
4. 设置填充模式 `context.fillStyle = gradient`
5. 绘制矩形 `context.fillRect(x,y,width,height)`

```html
<canvas height="500" width="500" style="border: 1px solid ##333;"></canvas>
<script>
	// 1.获取canvas对象
	var canvas = document.getElementsByTagName('canvas')[0]
	// 2.获取canvasd的2d上下文
	var context = canvas.getContext('2d');
	// 3.创建渐变对象 并添加渐变色
	var gradient = context.createLinearGradient(100,100,300,300)
	gradient.addColorStop(0,'##fff')
	gradient.addColorStop(1,'##000')
	// 4.设置填充模式
	context.fillStyle = gradient
	// 5.绘制 矩形
	context.fillRect(100,100,200,200)
</script>
```

### 图片

1. 取得 canvas 对象
2. 获取 2d 上下文 context
3. 创建图像对象

```javascript
var image = new Image()
image.src = './photo.jpg'
```

4. 在图片加载完毕后绘制图片，绘制图像

```javascript
image.onload = function(){
	context.drawImage(image，x，y) // 参数：图像，绘制位置的x坐标，y坐标
	context.drawImage(image，x，y，w，h) // 参数：图像，绘制位置的x坐标，y坐标 ，宽，高
}
```

5. 可以设置平铺模式

```javascript
var pattern = context.createPattern(image,'repeat')
```

6. 将平铺对象复制给填充模式

```javascript
context.fillStyle = pattern
```

```html
<canvas height="1000" width="1000" style="border: 1px solid ##333;"></canvas>
<script>
	// 1.获取canvas对象
	var canvas = document.getElementsByTagName('canvas')[0]
	// 2.获取canvasd的2d上下文
	var context = canvas.getContext('2d');
	// 3.创建图片对象 并导入图片
	var image = new Image()
	image.src = '../image/哈士基.jpeg'
	// 4.调用绘制图片的方法 
	image.onload = function(){
		// 绘制图片
		// context.drawImage(image,100,100,100,100)

		// 创建平铺对象 并设置平铺模式  
		var pattern = context.createPattern(image,'repeat')
		context.fillStyle = pattern
		context.fillRect(20,20,500,500)
	}
</script>
```

### 文字

1. 取得 canvas 对象
2. 取得 2d 上下文（context）
3. 设定绘图样式（fillStyle 填充样式、strokeStyle 边框样式）
4. 指定线宽（lineWidth）
5. 设置文字和对齐方式
6. 绘制文字

```html
<canvas height="500" width="500" style="border: 1px solid ##333;"></canvas>    
<script>        
// 1.获取canvas对象        
var canvas = document.getElementsByTagName('canvas')[0]       
// 2.获取canvasd的2d上下文        
var context = canvas.getContext('2d');        
// 3.设置填充模式   填充/描边        
context.fillStyle = 'red'        
context.strokeStyle = 'blue'        
// 4.设置线宽  描边时需要设置线宽        
context.lineWidth = '1'       
 // 5.设置文字        
context.font = '40px sans-serif'        
context.textAlign = 'center'        
 // 6.绘制文字        
context.fillText('hello canvas', 200,100)    //填充文字        
context.strokeText('hello canvas', 200,200)   // 描边文字    
</script>
```

### 线段

moveTo(x, y)：线段的起点坐标 (x, y)  
lineTo(x, y)：线段的终点坐标 (x, y)  
cx.stroke();  
lineWidth=number;

```html
<canvas height="500" width="500" style="border: 1px solid "></canvas>    
<script>        
	window.onload = function(){
		// 获取画布
		var canvas = document.querySelector('canvas');
		// 获取上下文
		var context = canvas.getContext('2d');
		// 绘制线段
		context.beginPath();
		context.lineWidth = '3';
		context.strokeStyle = 'red';
		context.moveTo(0, 0);
		context.lineTo(100, 100);
		context.lineTo(200, 10);
		context.lineTo(300, 100);
		context.closePath();
		context.stroke();
	}
</script>
```

### 变形

**1. 平移**  
`translate(x,y)`：重新映射画布上的原点位置  
**2. 扩大（放大坐标）**  
`scale(x,y)`：x: 代表的是水平方向上的放大倍数、y: 代表的是垂直方向上的放大倍数（如果想要缩小，参数设置为 0~1 之间  
**3. 旋转**  
`rotate(angle)`：angle: 旋转角度，旋转的中心点就是坐标轴的原点，默认按照顺时针进行旋转，想要进行逆时针旋转，角度设置为负数  
**4. 保存和回滚**  
`save()`: 将当前的绘画状态进行保存并存入状态栈  
`restore()`: 该方法每次调用只会回滚到上一次 save 的状态

```html
<canvas id="myCanvas" height="500" width="500" style="border: 1px solid "></canvas>    
<script>        
	window.onload = function(){
		// 获取画布
		var canvas = document.querySelector('canvas');
		// 获取上下文
		var context = canvas.getContext('2d');
		// 绘制线段
		context.save();// 保存状态1
		context.beginPath();
		context.lineWidth = '3';
		context.strokeStyle = 'red';
		context.moveTo(0, 0);
		context.lineTo(100, 100);
		context.stroke();

		context.translate(100,100)// 画布的原点改变为(100,100)
		context.beginPath();
		context.lineWidth = '3';
		context.strokeStyle = 'red';
		context.moveTo(0, 0);
		context.lineTo(200, 100);
		context.stroke();

		context.restore();// 恢复状态1（原点(0,0)）
		context.beginPath();
		context.lineWidth = '3';
		context.strokeStyle = 'blue';
		context.moveTo(0, 0);
		context.lineTo(100, 100);
		context.stroke();
	}
</script>
```

### 时钟

```html
<canvas height="800" width="800" style="border: 1px solid"></canvas>    
<script>
	window.onload = function(){
		var canvas = document.querySelector('canvas');
		var context = canvas.getContext('2d');
		function clock(){
			// 绘制圆盘
			context.beginPath();
			context.arc(400,400,200,0,Math.PI*2);
			context.fillStyle = 'pink';
			context.fill();
			context.closePath();
			// 绘制时刻度
			for(i=0; i<12; i++){
				context.save();
				context.translate(400,400);
				context.rotate(i*(Math.PI/6));
				context.beginPath();
				context.moveTo(0,-180);
				context.lineTo(0,-200);
				context.closePath();
				context.lineWidth = 4;
				context.fillStyle = 'black';
				context.rotate(Math.PI/6);
				context.font = '16px bold';
				context.fillText(i+1, -5, -220);
				context.stroke();
				context.restore();
			}
			// 绘制分刻度
			for(i=0; i<60; i++){
				context.save();
				context.translate(400,400);
				context.beginPath();
				context.rotate(i*(Math.PI/30));
				context.moveTo(0, -190);
				context.lineTo(0, -200);
				context.stroke();
				context.closePath();
				context.restore();
			}
			// 获取当前时间
			var today = new Date();
			var hour = today.getHours();
			var min = today.getMinutes();
			var sec = today.getSeconds();
			hour = hour+min/60;
		// 绘制时针
			context.lineWidth=4
			context.save();
			context.translate(400,400);
			context.rotate(hour*Math.PI/3);
			context.beginPath();
			context.moveTo(0,10)
			context.lineTo(0,-100);
			context.stroke()
			context.closePath();
			context.restore();
			// 绘制分针
			context.lineWidth=3
			context.save();
			context.translate(400,400);
			context.rotate(min*(Math.PI/30));
			context.beginPath();
			context.moveTo(0,10);
			context.lineTo(0,-160);
			context.stroke()
			context.closePath();
			context.restore();
			// 绘制秒针 
			context.lineWidth=2
			context.save();
			context.translate(400,400);
			context.rotate(sec*Math.PI/30);
			context.beginPath();
			context.moveTo(0,10);
			context.lineTo(0,-180);
			context.strokeStyle='red'
			context.stroke()
			context.closePath();
			context.restore();

			// 绘制交叉处
			context.lineWidth=1
			context.save();
			context.translate(400,400);
			context.beginPath();
			context.arc(0,0,5,0,Math.PI*2);
			context.fill();
			context.fillStyle='##ccc'
			context.strokeStyle='red'
			context.stroke()
			context.closePath();
			context.restore();
		}
		setInterval(clock, 1000)
		clock();
	}
</script>
```

### 合成

- **globalAlpha**，设置上下文中新绘制内容的透明度。
- **globalCompositionOperation**，表示新绘制的形状如何与上下文中已有的形状融合。

### WebGL

画布的 3D 上下文。  
与 OpenGL ES2.0 有很多相同。  
TODO: JavaScript 高级程序设计 p594

## SVG

可伸缩矢量图形 (Scalable Vector Graphics)。  
- 定义用于网络的基于矢量的图形
- 使用 XML 格式定义图形
- 放大或缩小不影响图片质量

相比其他图像，优势：
- SVG 可被非常多的工具读取和修改（比如记事本）
- SVG 与 JPEG 和 GIF 图像比起来，尺寸更小，且可压缩性更强
- SVG 是可伸缩的
- SVG 图像可在任何的分辨率下被高质量地打印
- SVG 可在图像质量不下降的情况下被放大
- SVG 图像中的文本是可选的，同时也是可搜索的（很适合制作地图）
- SVG 可以与 Java 技术一起运行
- SVG 是开放的标准
- SVG 文件是纯粹的 XML

### 嵌入 HTML 

**`<embed>`**  

```html
<embed src="rect.svg" width="300" height="100" 
	type="image/svg+xml"
	pluginspage="http://www.adobe.com/svg/viewer/install/" />
```

pluginspage 属性指向下载插件的 URL。  
**`<object>`**   

```html
<object data="rect.svg" width="300" height="100" 
	type="image/svg+xml"
	codebase="http://www.adobe.com/svg/viewer/install/" />
```

**`<iframe>`**  

```html
<iframe src="rect.svg" width="300" height="100"></iframe>
```

### 预定义形状元素

#### 矩形 `<rect>`

```html
<rect width="300" height="100"
	style="fill:rgb(0,0,255);stroke-width:1;
	stroke:rgb(0,0,0)"/>
```

#### 圆形 `<circle>`

```html
<circle cx="100" cy="50" r="40" stroke="black"
	stroke-width="2" fill="red"/>
```

#### 椭圆 `<ellipse>`

```html
<ellipse cx="300" cy="150" rx="200" ry="80"
	style="fill:rgb(200,100,50);
	stroke:rgb(0,0,100);stroke-width:2"/>
```

#### 线 `<line>`

```html
<line x1="0" y1="0" x2="300" y2="300"
	style="stroke:rgb(99,99,99);stroke-width:2"/>
```

#### 折线 `<polyline>`

仅包含直线的形状。  

```html
<polyline points="0,0 0,20 20,20 20,40 40,40 40,60"
	style="fill:white;stroke:red;stroke-width:2"/>
```

#### 多边形 `<polygon>`

不少于三条边的图形。  

```html
<polygon points="220,100 300,210 170,250"
	style="fill:##cccccc;
	stroke:##000000;stroke-width:1"/>
```

#### 路径 `<path>`

- M = moveto 起始  
- L = lineto 连线  
- H = horizontal lineto 水平线  
- V = vertical lineto 垂直线  
- C = curveto 三次贝塞尔曲线  
  后跟三组坐标，起点的控制点（控制曲线射出的方向）、终点的控制点（控制曲线射入的方向）、终点  
- S = smooth curveto 三次贝塞尔曲线  
  后跟两组坐标，终点的控制点（控制曲线射入的方向）、终点；同 T，自动推测起点控制点，不跟 S 或 C 则变成二次贝塞尔曲线  
- Q = quadratic Belzier curve 二次贝塞尔曲线  
  后跟两组坐标，控制点和终点  
- T = smooth quadratic Belzier curveto 二次贝塞尔曲线  
  后跟一组坐标，终点；自动根据上一个控制点推测（必须在 Q 或 T 之后使用，否则为直线）  
- A = elliptical Arc 椭圆弧  
  x 轴半径、y 轴半径、x 轴旋转度数 (顺为正)、弧长 (0 短 1 长)、弧线方向 (0 逆 1 顺)、终点 x、终点 y  
  半径为比例时，默认取符合条件的最小值，则弧长无意义  
- Z = closepath 闭合，画直线到起始点  

大写表示绝对定位 (数值为线的结束位置)，小写表示相对定位 (数值等于线的长度)。  

**二次贝塞尔曲线**  
![](HTML5.assets/image-20221124112959910.png)  
**三次贝塞尔曲线**  
![](HTML5.assets/image-20221124113619483.png)  
**椭圆弧**  
![](HTML5.assets/image-20221124115027617.png)

### 滤镜

必须在 `<defs>` 中定义滤镜。  

```html
<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" 
"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">

<svg width="100%" height="100%" version="1.1"
xmlns="http://www.w3.org/2000/svg">

	<defs>
		<filter id="Gaussian_Blur">
			<feGaussianBlur in="SourceGraphic" stdDeviation="3" />
		</filter>
	</defs>
	
	<ellipse cx="200" cy="150" rx="70" ry="40"
	style="fill:##ff0000;stroke:##000000;
	stroke-width:2;filter:url(##Gaussian_Blur)"/>

</svg>
```

- `<feGaussianBlur>` 标签的 stdDeviation 属性可定义模糊的程度
- `in="SourceGraphic"` 这个部分定义了由整个图像创建效果

### 渐变

必须在 `<defs>` 中定义渐变。  

```html
<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" 
"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">

<svg width="100%" height="100%" version="1.1"
xmlns="http://www.w3.org/2000/svg">

<defs>
<linearGradient id="orange_red" x1="0%" y1="0%" x2="100%" y2="0%">
<stop offset="0%" style="stop-color:rgb(255,255,0);
stop-opacity:1"/>
<stop offset="100%" style="stop-color:rgb(255,0,0);
stop-opacity:1"/>
</linearGradient>
</defs>

<ellipse cx="200" cy="190" rx="85" ry="55"
style="fill:url(##orange_red)"/>

</svg>
```

- `<stop>` 每种颜色一个标签，offset 定义位置。  
- `<linearGradient id="orange_red" x1="0%" y1="0%" x2="100%" y2="0%">`  
  x 控制水平方向，y 控制垂直方向  
- `<radialGradient id="grey_blue" cx="20%" cy="40%" r="50%" fx="50%" fy="50%">`  
  cx、cy 和 r 属性定义外圈，而 fx 和 fy 定义内圈

### 实例

[SVG 实例](https://www.w3school.com.cn/svg/svg_examples.asp)  

## 拖拽 

在 H5 中实现了拖拽技术，允许用户在网页内部拖拽以及浏览器与其他应用程序之间的拖拽，通过拖拽可以传递数据。  
**属性**：draggable（是否可拖动）  
**事件**

- 拖拽元素（需要改变位置的元素）  
	dragstart 开始拖拽  
	drag 正在拖拽  
	dragend 结束拖拽
- 目标元素（被放置元素的元素）  
	dragenter 拖拽元素进入到目标元素  
	dragover 拖拽元素在目标元素中移动  
	drop 拖拽元素放置到目标元素中

**拖拽事件流**：  
当拖动一个元素放置到目标元素上的时候将会按照如下顺序依次触发  
dragstart----drag----dragenter----dragover----drop----dragend  
**数据交互 dataTransfer**  
在拖拽事件中，我们可以通过 datatransfer 来实现数据交互。它是事件对象的一个属性 event.datatransfer。用于从被拖拽元素向目标元素传递字符串格式的数据。  
设置值：`event.datatransfer.setData()` 在元素拖拽开始时设置 `ondragstart`  
获取值：`event.datatransfer.getData()` 在元素放置时获取 `ondrop`  
将拖动元素放置到目标元素  
**前提**  
拖拽元素可拖拽 draggable  
目标元素可放置 ondragover = function(){ event.preventDefault() } // 阻止默认行为

## Web 存储

WebStorage 目标：
- 提供一种在 cookie 之外存储会话数据的路径
- 提供一种存储大量可以跨会话存在的数据的机制

HTML5 的 WebStorage 提供两种 API：localStorage（本地存储）、sessionStorage（会话机制）

### cookie

存储在浏览器中，每次浏览器向服务器发送请求都需要携带 cookie，一般情况下，cookie 是产生于服务器端，保存于客户端。但是我们也可以通过 js 来产生 cookie，可以通过 js-cookie 这个库来操作 cookie  
**特点：**
- 数据持久型，即数据在浏览器关闭时才删除
- 不需要任何服务器资源，因为 cookie 是存储在客户端并发送给服务器读取
- 可配置到期，控制 cookie 的生命周期，使之不会永远有效，偷盗者可能拿到的是过期的 cookie

```javascript
//引入cookie
<script src="https://cdn.bootcdn.net/ajax/libs/js-cookie/latest/js.cookie.min.js"></script>

//创建一个cookie，7天后过期
var cookie = Cookies.set('name','this is a cookie',{expires:7})

//获取cookie
var name = Cookies.get('name')

//移除cookie
Cookies.remove('name')
```

### sessionStorage

sessionStorage 仅在当前会话下有效（关闭选项卡或关闭浏览器后会话数据失效），关闭页面或浏览器后被清除，仅在客户端 (即浏览器）中保存，不参与和服务器的通信。  
**特点**：
- 页面会话在浏览器打开期间一直保持，并且重新加载或恢复页面仍会保持原来的页面会话
- 打开多个相同的 URL 的 Tabs 页面，会创建各自的 sessionStorage
- 关闭对应浏览器的 tab，会清除对应的 sessionStorage

```javascript
//创建
sessionStorage.setItem('name','zhangsan')
//获取
sessionStorage.getItem('name')
//移除
sessionStorage.remove('name')
//清空
sessionStorage.clear()
```

### localStorage

localStorage 生命周期是永久，这意味着除非用户显示在浏览器提供的 UI 上清除 localStorage 信息，否则这些信息将永远存在。仅在客户端（即浏览器）中保存，不参与和服务器的通信。  
**特点：**

```javascript
//创建
localStorage.setItem('name','zhangsan')
//获取
localStorage.getItem('name')
//移除
localStorage.remove('name')
//清空
localStorage.clear()
```

### 异同 

1. 作用域的不同：  
   不同浏览器无法共享 localStorage 或 sessionStorage 中的信息。相同浏览器的不同页面间可以共享相同的 localStorage（页面属于相同域名和端口），但是不同页面或标签页间无法共享 sessionStorage 的信息。页面及标签页仅指顶级窗口，如果一个标签页包含多个 iframe 标签且它们属于同源页面，那么它们之间是可以共享 sessionStorage 的

2. 存储大小：  
   localStorage 和 sessionStorage 的存储数据大小一般都是：5MB

3. 存储位置：  
   localStorage 和 sessionStorage 都保存在客户端，不与服务器进行交互通信

4. 存储内容类型：  
   localStorage 和 sessionStorage 只能存储字符串类型，对于复杂的对象可以使用 ECMAScript 提供的 JSON 对象的 stringify 和 parse 来处理

5. 获取方式：  
   localStorage:window.localStorage;  
   sessionStorage:window.sessionStorage;

6. 应用场景：  
   localStorage: 常用于长期登录（+ 判断用户是否已登录）,适合长期保存在本地的数据，而 sessionStorage: 敏感账号一次性登录

7. WebStorage 的优点：  
   存储空间更大：cookie 为 4KB，而 WebStorage 是 5MB  
   节省网络流量：WebStorage 不会传送到服务器，存储在本地的数据可以直接获取，也不会像 cookie 一样请求都会传送到服务器，所以减少了客户端和服务器 端的交互，节省了网络流量  
   对于那种只需要在用户浏览一组页面期间保存而关闭浏览器后就可以丢弃的数据，sessionStorage 会非常方便  
   快速显示：有的数据存储在 WebStorage 上，再加上浏览器本身的缓存。获取数据时可以从本地获取会比从服务器端获取快得多，所以速度更快  
   安全性：WebStorage 不会随着 HTTP header 发送到服务器端，所以安全性相对于 cookie 来说比较高一些，不会担心截获，但是仍然存在伪造问题

## 通信 

### BoardCast Channel

适用于同一 origin 下的不同页面之前进行通信。

```js
const channel = new BroadcastChannel('demo');

function sendMsg(type, content) {
  console.log('sendMsg');
  channel.postMessage({
    type,
    content,
  })
}

function listenMsg(callback) {
  const handler = e => {
    console.log('callback');
    callback && callback(e.data);
  };

  channel.addEventListener('message', handler);
  return () => {
    channel.removeEventListener('message', handler);
  }
}

const message = (function () {
  return {
    sendMsg,
    listenMsg,
  }
})()
```

### Service Worker

### Localstorage、window.onstorage

### Shared Worker 定时器轮询 (setInterval)

### IndexDB 定时器轮询 (setInterval)

### Cookie 定时器轮询 (setInterval)

### window.open、window.postMessage

H5 提供了网页文档之间互相接收与发送消息的功能，当在 a 页面中通过 window.open() 方法打开 b 页面，或者在 a 页面中通过 iframe 嵌套 b 页面，我们想让 a 中的数据传递到 b 中就可以使用跨文档消息传输  
*a.html*

```html
<button onclick="sendMessage()">发送消息</button>
<script>
	let windowB = window.open("http://127.0.0.1:5500/test/b.html")
	
	function sendMessage() {
	  const data = {
		name: 'lili'
	  };
	  // windowB 发送对象窗口引用
	  // 如：iframe 的 contentWindow 属性、执行window.open返回的窗口对象
	  windowB.postMessage(JSON.stringify(data), 'http://127.0.0.1:5500');
	};
	// 接受页面b返回数据
	window.addEventListener('message', function (e) {
	  console.log('来自页面b的数据 ---> ' + e.data);
	}, false);
</script>
```

*b.html*

```html
<script>
	// 接收页面a的数据
	window.addEventListener('message', function (e) {
		console.log('来自页面a的数据 ---> ' + e.data);
		var data = JSON.parse(e.data);
		if (data) {
			data.age = 16;
			// 处理后再发回页面a
			e.source.postMessage(JSON.stringify(data), e.origin);
		}
	}, false);
</script>
```

### Websocket

使用 websocket 可以在服务器与客户端之间建立一个非 http 的双向连接，这个连接是实时的也是永久的，除非被显示关闭。服务器可以随时将消息推送到客户端。  
想要实现 websocket 连接，需要有服务器的支持。

```javascript
//1.建立与服务器之间的长连接 绝对地址
var ws = new Websocket('ws://47.94.46.113:8888/imserver/1')
//2.连接成功后的回调函数
ws.onopen = function(e){
  console.log(e)
  ws.send('我是客户端')     //向服务端发送数据，字符串、ArrayBuffer、Blob
}
//3.收到服务器消息的回调函数
ws.onmessage = function(e){
	// 通过 binaryType 确定返回数据类型
  console.log(e.data)
}

ws.onerror = function(){}	//连接失败
ws.onclose = function(){}   //关闭连接
```

close 的 event 额外包含三个属性：
- wasClean，连接是否干净的关闭。
- code，来自服务器的数值状态码。
- reason，来自服务器的消息。

[WebSocket_ohana！的博客-CSDN博客_websocket](https://blog.csdn.net/qq_54773998/article/details/123863493)  

### SSE

[Event-Stream技术 - 柯南小海盗 - 博客园](https://www.cnblogs.com/knxhd/p/18384413)

## 地理位置 geolocation

H5 中添加了获取地理位置的 api，`window.navigator.geolocation.getCurrentPosition`。也是百度地图/高德地图通过浏览器定位的实现原理。

```javascript
window.navigator.geolocation.getCurrentPosition(function(position){
	console.log(position)  
})
```
