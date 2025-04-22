---
title: JQuery
date: 2022-09-26 09:27:58
updated: 2023-03-22 18:18:27
---

# JQuery

## jQuery 介绍

>jQuery 是一个 Javascript 库，是对于 ECMAScript、dom、bom 的一个浅封装（轻量库），让用户更方便操作。  
> jQuery 功能： 使用 CSS 选择器进行元素查询、事件机制、Dom 操作、属性操作、工具方法、Ajax

jQuery 库包含以下功能：
- HTML 选取
- HTML 元素操作
- CSS 操作
- HTML 事件函数
- JavaScript 特效和函数
- HTML DOM 遍历和修改
- AJAX

除此之外，Jquery 还提供了大量的插件，目前 jQuery 兼容于所有主流浏览器

## jQuery 安装

- 网页中添加 jQuery
	- 从 [jquery.com](http://jquery.com) 下载 jQuery 库
	- 从 CDN 中载入 jQuery
- 下载 jQuery
	- Production version - 用于实际的网站中，已被精简和压缩
	- Development version - 用于测试和开发（未压缩，是可读的代码）

jQuery 库是一个 JavaScript 文件，可以使用 HTML 的 `<script>` 标签引用，但需要注意引入的 jQuery 的版本要和 API 手册版本/开发使用一致

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>01-HelloWorld.html</title>
  <!-- 本地引入 -->
  <script src="../../jquery-3.5.1/jquery-3.5.1.js"></script>
  <!-- 通过cdn引入  在线引入  通常采用 -->
  <!-- 
  <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
   -->
  <script>
	// 文档加载完后执行
    // 1.原生JS的固定写法
    window.onload = function () {
      alert('helloworld -- js')
    }
    // 2.jQuery的固定写法
// 将document转换为JQuery对象，因为document是window的子属性所以不需要等待对象生成即可调用
    $(document).ready(function () {
      alert('helloworld -- jquery')
    })
	// JQuery的另一种写法
//	$(function(){
//	// TODO
//	})
  </script>
</head>
<body>
</body>
</html>
```

## JQuery 函数

>通过 "jQuery" 和 "$" 来调用 jQuery 函数

### jQuery 的核心函数和核心对象

1. jQuery 核心函数  
	简称:jQuery 函数（\$/jQuery）  
	引入 jQuery 库以后，直接使用 $/jQuery 即可
	- 当函数用:$(params)
	- 当对象用的时候:$.each()
2. jQuery 核心对象  
	简称:jQuery 对象 \$()
	- 得到 jQuery 对象：执行 jQuery 函数返回的就是 jQuery 对象
	- 使用 jQuery 对象:\$obj.xxx()

```javascript
$(function(){
	// jQuery核心函数
	console.log($, typeof $);
	// jQuery核心对象
	console.log($(), $() instanceof Object);
})
```

### 区别 1：文档加载完毕

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>区别1：文档加载完毕</title>
    <!-- 导入cdn -->
    <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
</head>
<body>
    <script>
        // 1.原生JS的固定写法
        window.onload = function () {
            alert('helloworld -- js')
        }
        // 2.jQuery的固定写法
        $(document).ready(function () {
            alert('helloworld -- jquery')
        })
    </script>
</body>
</html>
```

### 区别 2：选取元素

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>区别2：选取元素</title>
    <style>
        *{
            margin: 0;
            padding: 0;
        }
        div{
            width: 100px;
            height: 100px;
            border: 1px solid black;
        }
    </style>
    <!-- 导入cdn -->
    <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
</head>
<body>
    <div></div>
    <div class="box1"></div>
    <div id="box2"></div>

    <script>
        // JS原生DOM
        window.onload = function () {
            // 1.利用原生JS来查找DOM元素
            var div1 = document.getElementsByTagName('div')[0]
            var div2 = document.getElementsByClassName('box1')[0]
            var div3 = document.getElementById('box2')
            // 2.利用原生JS修改背景颜色
            div1.style.backgroundColor = 'red'
            div2.style.backgroundColor = 'yellow'
            div3.style.backgroundColor = 'blue'
        }
        // jQuery
        $(document).ready(function(){
            // 1.通过jQuery来查找元素
            var $div1 = $('div:first')
            var $div2 = $('.box1')
            var $div3 = $('##box2')
            console.log($div1);
            console.log($div2);
            console.log($div3);
            // 2.利用jQuery来修改背景颜色
            $div1.css({backgroundColor: 'red'})
            $div2.css({
                backgroundColor: 'yellow',
                width: '200px',
                height: '200px'
            })
            $div3.css({backgroundColor: 'blue'})
        })
    </script>
</body>
</html>
```

### 区别 3：入口函数

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>区别3：入口函数</title>
    <!-- 导入cdn -->
    <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
</head>
<body>
	<img src="https://img.ivsky.com/img/tupian/t/201709/01/tongxun_jifang.jpg" alt="">
	<script>
		 // 1.加载模式不同 
		 //     前提：图片或者是资源是通过网络数据获取的
		 //     需求：获取网络图片的宽度或高度
		 // 原生JS：在DOM元素及图片、音频加载完毕后执行内部代码
		 // JQuery：在DOM元素加载完毕后即执行，不等图片等加载后
	
		// 原生JS入口函数
		// window.onload = function () {
		//     // 获取img
		//     var img = document.getElementsByTagName('img')[0]
		//     //var img=document.images[0];
		//     // 通过原生JS拿到DOM元素的宽高
		//     var width = window.getComputedStyle(img).width
		//     console.log('JS' ,width)
		// }
		// jQuery入口函数
		$(document).ready(function () {
			// 获取img
			var $img = $('img')
			// console.log($img);
			// 通过jQuery来获取img的宽度
			var $width = $img.width()
			console.log('jquery', $width);// 因网速、浏览器缓存，结果可能是null或者0或者470
		})
	
		 //  2.入口函数如果写了多个
		 // 原生JS：后面覆盖前面
		 // JQuery：从上至下依次执行，不会覆盖
	
		// window.onload = function(){
		//     alert('我是第一个入口函数')
		// }
		// window.onload = function(){
		//     alert('我是第二个入口函数')
		// }
		$(document).ready(function(){
			alert('我是第一个JQuery')
		})
		$(document).ready(function(){
			alert('我是第二个JQuery')
		})
	</script>
</body>
</html>
```

## JQuery 对象

jQuery 对象是类数组对象，jQuery 的方法都是对类数组中的元素的批量操作。  
**注意：** jQuery 对象可以调用 jQuery.prototype 中声明的方法，普通的 Element 元素则不能调用。在使用 jquery 的时候，拿到一个对象务必要搞明白该对象是 Element 元素还是 jQuery 实例

```javascript
$("form").on("submit",function(){
	this;// his是Element元素，如果想调用jQuery方法，需要使用$()将其转换为jQuery实例
})
```

**jQuery 和 JS 的基本使用**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>jQuery和JS的基本使用-1</title>
    <!-- 导入cdn -->
    <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
</head>
<body>
    <!-- 需求：点击按钮，提示输入框中输入的值 -->
    用户名:<input type="text" id="username"><br>
    <button id="btn1">确定（原生）</button>
    <button id="btn2">确定（jQuery）</button>
    <script>
        // 原生JS
        // window.onload = function(){
        //     var btn1 = document.getElementById('btn1');
        //     btn1.onclick = function(){
        //         var username = document.getElementById('username').value;
        //         alert(username);
        //     }
        // }
        // JQuery
        $(function(){
            $('##btn2').click(function(){
                var username = $('##username').val();
                alert(username);
            })
        })
    </script>
</body>
</html>
```

1. jQuery 核心函数作为一般函数调用的时候:$(param)
  - 参数为函数: 当 DOM 加载完成后，执行此回调函数
  - 参数为选择器字符串: 查找所有匹配的标签，并将它们封装成 jQuery 对象
  - 参数为 DOM 对象: 将 DOM 对象封装成 jQuery 对象
  - 参数为 HTML 标签字符串 (很少用): 创建标签对象并封装成 jQuery 对象
2. jQuery 静态方法，\$ 作为对象使用:\$.xxx()
  - \$.each() 隐式遍历数组
  - \$.trim 取出两端的空格 
  - 等等

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>jQuery</title>
    <!-- 导入cdn -->
    <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
</head>
<body>
    <div>
        <button id="btn">测试</button><br>
        <input type="text" name="msg1"><br>
        <input type="text" name="msg2"><br>
    </div>    
    <script>
        //1. 点击按钮，显示按钮的文本标题，增加一个新的输入框

        // 参数为函数: 当DOM加载完成后，执行此回调函数
        $(function(){
            // 参数为选择器字符串:查找所有匹配的标签，并将它们封装成jQuery对象
            $('##btn').click(function(){
                // 发生事件的dom元素对象 当前就是btn按钮
                // alert(this.innerHTML)
                alert($(this).html())
                // 参数为HTML标签字符串:创建标签对象并封装成jQuery对象
                // $('<br><input type="text" name="msg3"><br>').appendTo('div')
            })
        })

        // 2. 遍历输出数组中的所有元素值

        // var arr = [1,2,3,4,5,6]
        // // $.each()    //隐式遍历数组
        // $.each(arr, function(index, item){
        //     console.log(index, item)
        // })

        // 3. 去掉 my jQuery 两端的空格

        // var str = '       my JQuery        ';
        // console.log('---' + str.trim() + '----')
        // console.log('---' + $.trim(str) + '----')
    </script>
</body>
</html>
```

1. jQuery 对象是一个包含所有匹配的任意多个 dom 元素的伪数组对象
2. 基本行为
  * size()(1.8 之后已废弃) 或 length : 包含的 DOM 元素的个数
  * \[index\] 或 get(index) : 得到对应位置的 DOM 元素
  * each() : 遍历包含的所有 DOM 元素
  * index() : 得到所在元素的下标

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>jQuery对象</title>
    <!-- 导入cdn -->
    <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
</head>
<body>
    <div>
        <button>测试一</button>
        <button class="b">测试二</button>
        <button id="btn3">测试三</button>
        <button class="b">测试四</button>    
    </div>    
    <script>
        $(function(){
            var $btns = $('button');
            // 统计按钮个数
            // console.log('button个数：' + $btns.length)
            // 取得第二个button的文本
            // console.log($btns[1].innerHTML);
            // console.log($btns.get(1).innerHTML);
            // 输出所有button标签的文本
            // $.each($btns, function(index, item){
            //     console.log(index, item);
            // })
            // $btns.each(function(index, item){
            //     console.log(index, item.innerHTML, this);
            // })
            // 输出测试测试三按钮是第几个按钮
            console.log($('##btn3').index());
            console.log($('.b').index());
        })
    </script>
</body>
</html>
```

## JQuery 选择器

jQuery 的选择器与 CSS3 中的选择器几乎完全一致。  
jQuery 中所有选择器都以美元符号开头：$()  
**元素选择器**

```javascript
// 用户点击按钮后所有<div>元素都隐藏
$(document).ready(function(){
	$('button').click(function(){
		$('div').hide();
	});
});
```

**id 选择器**

```javascript
// 用户点击按钮后，有id="div1"属性都元素都将被隐藏
$(document).ready(function(){
	$('button').click(function(){
		$('##div1').hide();
	});
});
```

**class 选择器**

```javascript
// 用户点击按钮后所有带有 class="box" 属性的元素都隐藏
$(document).ready(function(){
	$('button').click(function(){
		$('.box').hide();
	});
});
```

![更多实例](JQuery.assets/JQuery_image_1.png)

## JQuery 事件

jQuery 的事件绑定与 Element 元素不同，不可以使用 onxxx 属性，也不能使用 addEventListener，而是使用 on()，可以理解为 on 是对于 Element 元素事件绑定的封装。  
on() 也支持事件代理。

### 事件的基本使用

**语法：**  
on()、off()、bind()、unbind()、快捷绑定 click() 等  
在 jQuery 中，大多数 DOM 事件都有一个等效的 jQuery 方法

```javascript
// 页面中指定一个点击事件
$("p").click();
// 定义触发事件的内容
$("p").click(function(){ 
// TODO
})
```

**事件的基本使用**

```html
<button>新增</button>
<button>修改</button>
<div>标题</div>
<script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script>
	$(function(){
		// bind(事件类型, [要传的参数], 事件处理函数)
		$('button').bind('click', '123', function(event){
			console.log('button点击');
			console.log(event);
			console.log(event.data);//123
		})

		// 点击新增或修改按钮，改变div内部的内容
		// $('button').bind('click', function(event){
		//     // 通过event.target(DOM节点，可以拿到内部的内容) 来判断当前是哪个按钮点击
		//     console.log(event.target);
		//     console.log(event.target.innerHTML);
		//     if($(event.target).html() === '新增'){
		//         $('div').html('新增学生信息');
		//     } else {
		//         $('div').html('修改学生信息');
		//     }
		// })
		// 解绑 unbind() 无参时 解除绑定的所有事件
		// $('button').unbind()

		// function clickEvent() {
		//     console.log('我是click事件');
		// }
		// $('button').click(clickEvent)
		// unbind(事件类型, 事件名称)  解绑clickEvent事件
		// $('button').unbind('click', clickEvent)
	})
</script>
```

### 事件代理

```html
<button>点击</button>
<script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script>
	// on(事件类型, [将要代理谁], [传递给事件内部的参数], 事件处理程序)
	// $('body').on('click', function(event){
	//     console.log(event);
	// })
	// 用body给button做代理   
	$('body').on('click','button', [1,2], function(event, a, b){
		console.log(event, a, b);
	})
	// 事件解绑 移除代理 使用off
	// $('body').off('click', 'button');
</script>
```

### 事件类型

**常用的 jQuery 事件快速绑定方法**
1. $(document).ready()  
	$(document).ready() 方法允许我们在文档完全加载完后执行函数
2. click()  
	click() 方法是当按钮点击事件被触发时会调用一个函数
3. dbclick()  
	当双击元素时，会发生 dbclick 事件
4. mouseenter()  
	当鼠标指针穿过元素时，会发生 mouseenter 事件
5. mouseleave()  
	当鼠标指针离开元素时，会发生 mouseleave 事件
6. mousedown()  
	当鼠标指针移动到元素上方，并按下鼠标按键时，会发生 mousedown 事件
7. mouseup()  
	当元素上松开鼠标按钮时，会发生 mouseup 事件
8. hover()  
	用于模拟光标悬停事件  
	当鼠标移动到元素上时，会触发指定当第一个函数（mouseenter）；当鼠标移出这个元素时，会触发指定当第二个函数（mouseleave）
9. blur()  
	当元素失去焦点时，发生 blur 事件
10. keydown()  
	键盘事件：按键按下事件
11. keyup()  
	键盘事件：按键抬起事件
12. 表单事件等等

```html
<form action="">
	<input type="submit" value="提交">    
</form>
<script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script>
	// submit()
	$('form').submit(function () {
		alert('submit')
		return false;
	})
</script>
```

## JQueryDOM 操作

jQuery 中提供了一系列的操作 DOM 节点的 API,用于解决 DOM 原生 API 无法进行批量操作并且功能性较差的弊端。
- 插入方法：append、appendTo、prepend、prependTo、after、before、insertBefore、insertAfter
- 包裹方法：wrap、unwrap、wrapAll、wrapInner、
- 替换方法：replaceWith、replaceAll
- 移除方法：empty、remove、detach
- 克隆方法：clone

**添加新内容的四个 jQuery 方法：**
1. append() - 在被选元素的结尾插入内容（仍然在该元素的内部）
2. prepend() - 在被选元素的开头插入内容
3. after() - 在被选元素之后插入内容
4. before() - 在被选元素之前插入内容

**复制节点:**
- 原生 DOM 有 cloneNode(true/false) ：false 浅复制、true 深复制。
- jQuery 对象有 clone(true/false) ：false 浅复制、true 深复制。

**属性操作：**  
在 dom 中，我们通过 setAttribute/getAttribute/style 来操作元素属性，jQuery 中提供了更加便捷的方法  
属性：attr、removeAttr、prop、removeProp  
css：addClass、removeClass、toggleClass、wrapInner、  
内容：html、text、val  
jQuery 拥有可操作 HTML 元素和属性的强大方法

**用于 DOM 操作的 jQuery 方法：**
- text() - 设置或返回所选元素的文本内容
- html() - 设置或返回所选元素的内容（包括 HTML 标记）
- val() - 设置或返回表单字段的值

## JQuery 静态方法

静态方法属于定义在 jQuery 函数上的方法，通过 jQuery 或者 $ 直接调用的方法  
数组及对象操作：each、map、toArray、merge  
测试操作：type、isEmptyObject、isPlainObject、isNumberic  
字符串操作：param、trim

### 数组及对象操作

#### each()

通用遍历方法，可用于遍历对象和数组  
不同于遍历 jQuery 对象的 $().each() 方法，此方法可用于遍历任何对象。回调函数拥有两个参数：第一个为对象的成员或数组的索引，第二个为对应变量或内容。如果需要退出 each 循环可使回调函数返回 false，其它返回值将被忽略

```javascript
var obj = {
	name: 'zhangsan',
	height: '190'
}
// each(要遍历的对象或数组, 处理函数)
$.each(obj, function(key, value){
	console.log(key, value);// name zhangsan  height 190
})
```

#### map()

将一个数组中的元素转换到另一个数组中  
作为参数的转换函数会为每个数组元素调用，而且会给这个转换函数传递一个表示被转换的元素作为参数。转换函数可以返回转换后的值、null（删除数组中的项目）或一个包含值的数组，并扩展至原始数组中

```javascript
var arr = [1,2,3];
var arr1 =  $.map(arr, function(n){
	return n+4;
})
console.log(arr1);// Array(3) [ 5, 6, 7 ]
```

#### filter()

将符合要求的元素选中返回

```html
<div>hello1</div>
<div>hello2</div>
<div>hello3</div>
<div>hello4</div>
<script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script>
	var $result = $('div').filter(function(index, item){
		var text = $(item).text();
		// 对拿到的text进行裁切，拿到最后一位，返回大于2的
		text = text.slice(text.length - 1);
		return text>2;
	})
	console.log($result)
</script>
```

#### toArray()

 把 jQuery 集合中所有 DOM 元素恢复成一个数组

#### merge()

合并两个数组  
返回的结果会修改第一个数组的内容——第一个数组的元素后面跟着第二个数组的元素。要去除重复项，可以使用 $.unique()

### 测试操作

#### type()

用于检测 obj 的数据类型

```javascript
console.log(jQuery.type(true) === "boolean");//true
console.log(jQuery.type(3) === "number");//true
```

#### isEmptyObject()

测试对象是否是空对象（不包含任何属性）,这个方法既检测对象本身的属性，也检测从原型继承的属性（因此没有使用 hasOwnProperty 方法更具体）

```javascript
console.log(jQuery.isEmptyObject({})); // true 
console.log(jQuery.isEmptyObject({ foo: "bar" })); //false
```

#### isPlainObject()

测试对象是否是纯粹的对象（通过 "{}" 或者 "new Object" 创建的）

#### isNumberic()

确定它的参数是否是一个数字  
$.isNumeric() 方法检查它的参数是否代表一个数值。如果是这样，它返回 true。否则，它返回 false。该参数可以是任何类型的

### 字符串操作

#### param()

将表单元素数组或者对象序列化。是.serialize() 的核心方法

#### parseJSON()

解析 json 字符串转换为 js 对象/数组

```javascript
var json = '{"name":"Tom", "age":12}'// 模拟一个json对象
console.log($.parseJSON(json)); // 将json对象转换为js对象
```

#### trim()

去掉字符串起始和结尾的空格,多用于用户数据的清洗  

## jQuery Ajax

AJAX = 异步 JavaScript 和 XML（Asynchronous JavaScript and XML）  
简短地说，在不重载整个网页的情况下，AJAX 通过后台加载数据，并在网页上进行显示  
**使用原生 ajax 的问题**  
编写常规的 AJAX 代码并不容易，因为不同的浏览器对 AJAX 的实现并不相同。这意味必须编写额外的代码对浏览器进行测试。因此 jQuery 团队将原生 ajax 进行了封装，只需要一行简单的代码，就可以实现 AJAX 功能。

### 低级别接口

#### ajax()

`$.ajax()` 不仅能实现与 `$.load()`，`$.get()`，`$.post()` 同样的功能，而且还可以设定 beforeSend（提交前回调函数）、error（请求失败后处理）、success（请求成功后处理）、complete（请求完成后处理）回调函数，通过设定这些回调函数，可以给用户更多的 Ajax 提示信息，另外，还有一些参数可以设置 Ajax 请求的超时时间或者页面的 " 最后更改 " 状态。

`$.ajax()` 会自动将对象转化为查询字符串

**接口参数格式：**
1. 查询字符串 key1=val&key2=val2
2. json 字符串 '{"key1":"val", "key2":"val2"}'

**一般多个参数时用对象形式传参**  
对象 -->json、对象 -->查询字符串

**get**

```javascript
$.ajax({
	url:'接口地址?page=1&pageSize=10', // 一个或多个参数写法1：直接拼接在字符串后  查询字符串
	// 请求方法
	method:'GET',
	// 参数，不写即无参
	data:{
		// 一个或多个参数写法2：传对象
		// page:1,
		// pageSize:10
	},
	// 请求成功回调函数
	success:function(res){
		console.log(res);
	},
	// 请求失败回调函数
	error:function(err){
		console.log(err);
	}
})
```

**post**

```javascript
$.ajax({
	url:'接口地址',
	method:'POST',
	data:JSON.stringify({
		username:'aimin1',
		password:'123321'
	}),
	// JQuery中的ajax默认请求头部为X-www-form-X-www-form-urlencoded,需要设置为json格式
	contentType = 'application/json',
	// 请求成功回调函数
	success:function(res){
		console.log(res);
	},
	// 请求失败回调函数
	error:function(err){
		console.log(err);
	}
})
```

**利用 `\$.ajax()` 向后台发送 json 字符串数据**
1. 将参数转换为 json 字符串（JSON.stringify()）
2. 将请求头设为 json 格式（contentType = 'application/json'）

#### ajaxSetup()

该方法设置全局 AJAX 默认选项。  
项目中一般用于设置通用请求信息，例如携带的 token。

```javascript
$.ajaxSetup({
	// 设置 AJAX 请求默认地址为 "/xmlhttp/"
	url: "/xmlhttp/",
	// 禁止触发全局 AJAX 事件
	global: false,
	// 用 POST 代替默认 GET 方法
	type: "POST",
	// 设置默认的success函数
	success:function(result){$("div").html(result)}
});
// 其后的 AJAX 请求不再设置
$.ajax({ data: myData });

//携带的token
$.ajaxSetup({headers:{Authorization:"xxxxxxx"}})
```

### 全局 ajax 事件处理函数

jQuery 提供的一些自定义全局函数，能够为各种与 Ajax 相关的事件注册回调函数。这些都是全局函数，因此无论创建他们的代码位于何处，只要有 Ajax 请求时，就会触发他们。使用这些方法的每一步是获取一个页面元素的引用。

如果想使某个 ajax 不受全局方法的影响，那么可以在 $.ajax(options) 方法中，将参数中的 global 设置为 false。  
**ajaxStart()**  
AJAX 请求开始时执行函数。Ajax 事件。JQuery 中当一个 Ajax 请求启动时，并且没有其他未完成的 Ajax 请求时，将调用 ajaxStart() 方法。  
**ajaxStop()**  
AJAX 请求结束时执行函数。Ajax 事件。ajaxStop() 方法则是在所有 Ajax 请求都完成时调用。  
**ajaxSend()**  
AJAX 请求发送前执行函数。Ajax 事件。  
**ajaxSuccess()**  
AJAX 请求成功时执行函数。Ajax 事件。  
**ajaxError()**  
AJAX 请求发生错误时执行函数。Ajax 事件。  
**ajaxComplete()**  
AJAX 请求完成时执行函数。Ajax 事件。  
**ajax 的状态描述**

```javascript
// 当ajax处于哪个状态就调用哪个方法
// 最后顺序：请求开始-请求发送-res回调($.ajax请求的回调)-请求出错/成功-请求完毕-请求停止
$(document).ajaxComplete(function (d) {
	console.log('ajax请求完毕complete',d);
})
$(document).ajaxError(function (d) {
	console.log('ajax请求出错error',d);
})
$(document).ajaxSend(function (d) {
	console.log('ajax请求发送send',d);
})
$(document).ajaxStart(function (d) {
	console.log('ajax请求开始start',d);
})
$(document).ajaxStop(function (d) {
	console.log('ajax请求停止stop',d);
})
$(document).ajaxSuccess(function (d) {
	console.log('ajax请求成功success',d);
})
var baseURL="http://127.0.0.1:7788";
$.ajax(baseURL+"/xxx",{
	success:function(data){console.log("1success",data)},
	error:function(data){console.log("1error",data)},
	complete:function(data){console.log("1complete",data)},
});
```

### 速写接口

在 jQuery 中，\$.ajax() 方法属于最底层的方法，第 2 层是\$.load()，\$.get()，和\$.post()，第 3 层是\$.getJSON() 方法。

#### get()

通过远程 HTTP GET 请求载入信息。  
get(url, [传递的参数], [成功回调函数])

#### post()

通过远程 HTTP POST 请求载入信息。  
post(url, [传递的参数], [成功回调函数])

#### getJson()

通过 HTTP GET 请求载入 JSON 数据。  
getJson(url, [传递的参数], [成功回调函数])

#### load()

载入远程 HTML 文件代码并插入至 DOM 中。  
load(url, [传递的参数], [成功回调函数])

把 "demo_test.txt" 文件中 id="p1" 的元素的内容，加载到指定的 `<div>` 元素中：

```javascript
$("##div1").load("demo_test.txt ##p1");
```

### axios

安装：CDN 引入

使用：axios()

```javascript
axios({
	url:'接口地址',
	method:'post',
	// params:   用于get请求
	// data:     用于post请求
	data:{    
		username:'admin1',
		password:'123321'
	}
}).then((res) => {
	// 成功回调   ES6语法
	console.log(res); 
}).catch((err) => {
	// 失败回调
	console.log(err);
})
```

axios 会自动将对象转换为 json 字符串，请求头默认格式为：contentType='application/json'

**利用 axios 向后台发送查询字符串数据**
1. 将参数转换为查询字符串  
	var obj = {name:'zhansan',id:'123456'}  
	Qs.stringify(obj)
2. 将请求头设为格式  
	headers:{ contentType: 'application/x-www-form-urlencoded'}
