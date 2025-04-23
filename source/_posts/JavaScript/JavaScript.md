---
title: JavaScript
updated: '2024-09809-171432 623:55:04'
categories:
  - JavaScript
date: 2022-09-05 11:33:18
---

# JavaScript

## 基础知识

#### script 标签

- type：可看做是 language 的替代属性，表示编写代码使用的脚本语言的内容类型，MIME 这个属性非必须，默认是 text/javascript
- src：引入外部文件（引入外部文件将不会执行 script 标签中的代码）
- charset：指定 src 属性指定的代码的字符集
- async：异步执行，当页面被解析时同时被执行，多个文件解析顺序不定（只针对外部脚本文件）
- defer：在页面完成解析时执行，多个文件按顺序返回（只针对外部脚本文件）

```ad-note
title:script、link和image

`<script>`标签和`<link>`标签在设置src/href同时添加到文档后才会下载文件；  
`<img>`标签在设置src属性后就下载文件，即使没有添加到文档中。
```

#### 关键字

- 区分大小写
- 标识符
  1. 字母，数字，下划线，$ 组成
  2. 只能以字母，下划线，$ 开头
  3. 不能将关键字作为标识符。命名采用驼峰式命名  
  大驼峰（类名）：每个单词首字母大写 UserName  
  小驼峰（变量名、函数）：首单词首字母不大写，其余单词大写 username  
  4. 名称要有意义，但不能为中文
- 语句  
  每个语句以分号结尾，可省略，但最好不要省略

#### 变量

1. 变量名由字母，数字，下划线以及 $ 组成  
不要使用下划线或者数字作为变量名的开头
- 变量提升（Hoisting）：  
变量提升提到函数（本作用域）的 top 的地方。只是提升变量的声明，并不会把赋值也提升上来。  
函数会产生临时作用域，而 if 等块语句不会产生新作用域。
- 函数提升：  
函数提升是把整个函数都提到前面去，只有函数声明形式才能被提升，而函数表达式不会
2. 定义时没有 var 为全局变量  
    方法中的 this
    - 在对象中，该方法的 this 指向对象
    - 在全局变量中，环境为浏览器时 this 为 window，环境为 node 时 this 为全局变量 global

##### 原始类型初始化

原始类型初始化可以使用原始字面量形式，也可以使用 new 关键字。  
使用 new 关键字会创建一个 Object 类型的实例，行为类似原始类型；但是可以动态添加属性，原始字面量形式创建的原始类型不能动态添加属性。 

##### 参数传递

参数传递是 **按值传递** 的。  
在传递对象时，传递的是对象引用的副本（按共享引用）。

##### 上下文

执行上下文主要分为函数上下文和全局上下文两种（`eval()` 调用内部存在第三种上下文）。

```ad-info
执行上下文：全局上下文、函数上下文、块级上下文。
```

以下情况会在作用域链前端临时添加一个上下文：  
- try/catch 语句的 catch 块  
  添加一个新的变量对象：要抛出的错误对象的声明
- with 语句  
  添加指定对象

#### 数据类型

##### 基础数据类型

- boolean  
true/false
- number  
数字类型。按精度（整数、单精度、双精度）/按进制（二进制、八进制 070、十进制、十六进制 0x11）/非数值（NaN）/科学计数法  
任何涉及到 NaN 的操作都会返回 NaN; NaN 与任何值都不相等，包括 NaN 本身
- symbol  
\\n 换行、 \\t 制表、 \\b 退格、 \\r 回车、 \\\ 斜杠、 \\' 单引号、 \\" 双引号
- bigint
- string
- underfined  
变量声明没有赋值，一般不会显式的声明
- null

**null vs underfined**  
值相等、类型不相等  
undefined 派生自 null 值。undefined == null 结果为 true，null 与 undefined 用途不同，null 可以用来表示一个空对象，但是没有必要把一个变量的值显式设置为 undefined

###### 字符串迭代和解构

字符串原型暴露了 `@@iterator`。

```js
let message = "abc"; 
let stringIterator = message[Symbol.iterator](); 
console.log(stringIterator.next()); // {value: "a", done: false} 
console.log(stringIterator.next()); // {value: "b", done: false} 
console.log(stringIterator.next()); // {value: "c", done: false} 
console.log(stringIterator.next()); // {value: undefined, done: true} 


console.log([...message]); // ["a", "b", "c", "d", "e"]
```

##### 引用数据类型

- Object
  - object  
  由大括号括起来的键值对，逗号分割
  - function
  - array  
  由中括号括起来，逗号分割

**深拷贝和浅拷贝**  
深拷贝（克隆）：表示对于对象的克隆
  1. 利用 Object.assign  
      `var stu = Objection.assign({}, obj) //对象的合并（没有对象嵌套）`
  2. 利用 json  
      `var obj2 = JSON.parse(JSON.stringify(obj))//对象-->字符串-->对象`
  3. 利用递归函数

浅拷贝（地址拷贝）：表示仅拷贝引用地址

##### null 和 undefined 的区别

- 数据类型不同；
- 意义不同：
    - undefined：
        - 声明变量未赋值；
    - null：
        - 声明了一个变量，并且赋值了，但赋的值是一个 null；
        - 表示准备用来保存对象，还没有真正保存对象的值，从逻辑角度看，null 值表示一个空对象指针；
- 转数字结果不同（Number()）：
    - undefined：NaN；
    - null：0；
- 产生场景不同：
    - undefined：
        - 声明变量未赋值；
        - 数组没有某个元素；
        - 对象没有某个属性；
        - 函数没有返回值；
        - 函数调用的时候没有传递参数并且声明函数的时候没有设置默认值；
    - null：
        - 作为原型链的终点；

```JavaScript
null == undefined // true
null === undefined // false
```

#### 引用类型

##### 基本引用类型

```ad-warning
引用类型不是类。

函数也是引用类型。
```

###### Date

**`new Date()`**
1. 传入日期字符串会后台调用 `Date.parse()`，返回 GMT 日期  
2. 传入参数，后台调用 `Date.UTC()`，返回本地时区日期（仅后台调用）  

**常用方法**  
- `Date.parse()`------ 日期字符串转毫秒数  
  1.“月/日/年”，如 "`5/23/2019`"；  
  2.“月名 日, 年”，如 "`May 23, 2019`"；  
  3.“周几 月名 日 年 时: 分: 秒 时区”，如 "`Tue May 23 2019 00:00:00 GMT-0700`"；  
  4.ISO 8601 扩展格式“YYYY-MM-DDTHH:mm:ss.sssZ”，如 `2019-05-23T00:00:00`（只适用于 兼容 ES5 的实现）。  
- `Date.UTC()`------ 参数转毫秒数  
  年、月（从 0 开始）、日（1~31）、时（0~23）、分、秒、毫秒，年、月必输，日默认 1，其他默认 0。
- `Date.now()`------ 获取现在日期

**继承方法**  
- `toLocalString()`------ 返回与浏览器运行本地环境一致的日期时间  
  `toLocaleString() - 2/1/2019 12:00:00 AM`
- `toString()`------ 返回 24 小时制的带有时区信息的日期时间  
  `toString() - Thu Feb 1 2019 00:00:00 GMT-0800 (Pacific Standard Time)`
- `valueOf()`------ 返回毫秒表示（非字符串）  
  操作符可以直接使用返回的值

```ad-tip
toLocalString()和toString()在不同浏览器上效果不同，不适合用于展示数据。

格式化方法也不适合用于用户界面展示。
```

**格式化方法**  
- `toDateString()` 显示日期中的周几、月、日、年（格式特定于实现）；  
- `toTimeString()` 显示日期中的时、分、秒和时区（格式特定于实现）；  
- `toLocaleDateString()` 显示日期中的周几、月、日、年（格式特定于实现和地区）；  
- `toLocaleTimeString()` 显示日期中的时、分、秒（格式特定于实现和地区）；  
- `toUTCString()` 显示完整的 UTC 日期（格式特定于实现）。  

###### RegExp

[正则表达式](JavaScript%20正则表达式.md)  

**实例属性**  
- `global`：布尔值，表示是否设置了 g 标记。  
- `ignoreCase`：布尔值，表示是否设置了 i 标记。  
- `unicode`：布尔值，表示是否设置了 u 标记。  
- `sticky`：布尔值，表示是否设置了 y 标记。  
- `lastIndex`：整数，表示在源字符串中下一次搜索的开始位置，始终从 0 开始。  
- `multiline`：布尔值，表示是否设置了 m 标记。  
- `dotAll`：布尔值，表示是否设置了 s 标记。  
- `source`：正则表达式的字面量字符串（不是传给构造函数的模式字符串），没有开头和结尾的 斜杠。  
- `flags`：正则表达式的标记字符串。始终以字面量而非传入构造函数的字符串模式形式返回（没 有前后斜杠）。  

**实例方法**  
- `exec()`
- `test()`

**构造函数属性（静态属性）**  
![](JavaScript.assets/image-20230220160224960.png)  
扩展：通过 `$1~$9` 访问捕获组。  
简写需要通过 **中括号** 方式访问。  

```ad-tip
正则表达式的`valueOf`返回正则表达式本身。

构造函数属性非标准，生产环境勿用。  
```

###### 原始值包装类型

Number、String、Boolean。  
以读模式访问字符串时执行：①创建 String，②调用实例上的特定方法，③销毁实例。  

1. 使用 new 调用原始值包装类型的构造函数，与调用同名的转型函数并不一样。  

```js
let value = "25"; 
let number = Number(value); // 转型函数
console.log(typeof number); // "number" 

let obj = new Number(value); // 构造函数
console.log(typeof obj); // "object"
```

2. String 包装类型  
`length`、`charAt()`、`charCodeAt()` 和 `fromCharCode()` 只针对 16 位码元的字符串。  
对于使用了额外 16 位表示增补平面的字符串 (代理对)，不能正确识别，可以使用 `codePointAt()` 代替 `charCodeAt()`，其可以识别完整码点。  

3. Unicode 的 4 中规范化形式，通过 `normalize("NFD")` 规范。  
   同一个字符串规范化形式不同，比较符认为不相等，需要规范。  
- NFD（Normalization Form D）、
- NFC（Normalization Form C）、
- NFKD（Normalization Form KD）、 
- NFKC（Normalization Form KC）。  

###### 单例内置对象

1.Global
- `encodeURI()`------ 用于对整个 URI 进行编码  
  不会编码属于 URL 组件的特殊字符，比如冒号、斜杠、问号、 井号
- `encodeURIComponent()`------ 多用于编码 URI 中单独的组件，如查询字符串  
  编码所有非标准字符
- `decodeURI()`------ 解码 encodeURI
- `decodeURIComponent()`------ 解码 encodeURIComponent

```js
let uri = "http://www.wrox.com/illegal value.js##start"; 

// "http://www.wrox.com/illegal%20value.js##start" 
console.log(encodeURI(uri)); 

// "http%3A%2F%2Fwww.wrox.com%2Fillegal%20value.js%23start" 
console.log(encodeURIComponent(uri));
```

2.Math  
![](JavaScript.assets/image-20230220174302367.png)

- `Math.ceil()` 方法始终向上舍入为最接近的整数。  
- `Math.floor()` 方法始终向下舍入为最接近的整数。  
- `Math.round()` 方法执行四舍五入。  
- `Math.fround()` 方法返回数值最接近的单精度（32 位）浮点值表示。  
- `Math.random()` 方法返回一个 0~1 范围内的随机数，其中包含 0 但不包含 1。

##### 集合引用类型

- 对象  
- 数组和定型数组  
- Map、WeakMap
- Set、WeakSet

```ad-tip
1. **对象和数组**通过字面量形式创建时，**不会**调用对应的构造函数。  
2. 数组空位在ES6之前会被忽略，因方法处理不同；在ES6之后，视为存在且为undefined。如果需要数组空位，建议显示声明为undefined。
```

###### 定型数组

提升原生库传输数据的效率，特殊的包含数据类型的数组。另一种形式的 ArrayBuffer 视图。与 DataView 的区别是：特定于一种 ElementType 且遵循系统原生的字节序。  

**创建定型数组**：  
- 读取已有的缓冲  
- 使用自有缓冲  
- 填充可迭代结构  
- 填充基于任意类型的定型数组  
- `<ElementType>.from()` 和 `<ElementType>.of()`  

```js
// 创建一个 12 字节的缓冲
const buf = new ArrayBuffer(12); 
// 创建一个引用该缓冲的 Int32Array 
const ints = new Int32Array(buf); 
// 这个定型数组知道自己的每个元素需要 4 字节
// 因此长度为 3 
alert(ints.length); // 3 

// 创建一个包含[2, 4, 6, 8]的 Int32Array 
const ints3 = new Int32Array([2, 4, 6, 8]); 
alert(ints3.length); // 4 
alert(ints3.buffer.byteLength); // 16 
alert(ints3[2]); // 6 

// 通过复制 ints3 的值创建一个 Int16Array 
const ints4 = new Int16Array(ints3); 
// 这个新类型数组会分配自己的缓冲
// 对应索引的每个值会相应地转换为新格式
alert(ints4.length); // 4 
alert(ints4.buffer.byteLength); // 8 
alert(ints4[2]); // 6 
```

构造函数和实例上的 BYTES_PER_ELEMENT 属性可以获取该类型数组中每个元素的大小。  

**定型数组<font color="##ff0000">不支持</font>的数组方法**：  
- `concat()`   
- `pop()`   
- `push()`   
- `shift()`   
- `splice()`   
- `unshift()`  

**新添加的方法**：  
- `set()`  
- `subarray()`  

**定型数组拼接**：  

```js
// 第一个参数是应该返回的数组类型 
// 其余参数是应该拼接在一起的定型数组
function typedArrayConcat(typedArrayConstructor, ...typedArrays) { 
 // 计算所有数组中包含的元素总数
 const numElements = typedArrays.reduce((x,y) => (x.length || x) + y.length); 
 // 按照提供的类型创建一个数组，为所有元素留出空间
 const resultArray = new typedArrayConstructor(numElements); 
 // 依次转移数组
 let currentOffset = 0; 
 typedArrays.map(x => { 
 resultArray.set(x, currentOffset); 
 currentOffset += x.length; 
 }); 
 return resultArray; 
} 
const concatArray = typedArrayConcat(Int32Array, 
 Int8Array.of(1, 2, 3), 
 Int16Array.of(4, 5, 6), 
 Float32Array.of(7, 8, 9)); 
console.log(concatArray); // [1, 2, 3, 4, 5, 6, 7, 8, 9] 
console.log(concatArray instanceof Int32Array); // true 
```

**定型数组的上溢和下溢**：  

```js
// 长度为 2 的有符号整数数组
// 每个索引保存一个二补数形式的有符号整数
// 范围是-128（-1 * 2^7）~127（2^7 - 1）
const ints = new Int8Array(2); 

// 长度为 2 的无符号整数数组
// 每个索引保存一个无符号整数
// 范围是 0~255（2^7 - 1）
const unsignedInts = new Uint8Array(2); 

// 上溢的位不会影响相邻索引
// 索引只取最低有效位上的 8 位
unsignedInts[1] = 256; // 0x100 
console.log(unsignedInts); // [0, 0] 
unsignedInts[1] = 511; // 0x1FF 
console.log(unsignedInts); // [0, 255] 

// 下溢的位会被转换为其无符号的等价值
// 0xFF 是以二补数形式表示的-1（截取到 8 位）, 
// 但 255 是一个无符号整数
unsignedInts[1] = -1 // 0xFF (truncated to 8 bits) 
console.log(unsignedInts); // [0, 255] 

// 上溢自动变成二补数形式
// 0x80 是无符号整数的 128，是二补数形式的-128 
ints[1] = 128; // 0x80 
console.log(ints); // [0, -128] 

// 下溢自动变成二补数形式
// 0xFF 是无符号整数的 255，是二补数形式的-1 
ints[1] = 255; // 0xFF 
console.log(ints); // [0, -1] 
```

```ad-tip
除了 8 种元素类型，还有一种“夹板”数组类型：Uint8ClampedArray，不允许任何方向溢出。超出最大值 255 的值会被向下舍入为 255，而小于最小值 0 的值会被向上舍入为 0。  

Uint8ClampedArray是HTML5 canvas元素的历史遗留，不进行canvas开发不要使用。  
```

**ArrayBuffer() vs malloc()**  
ArrayBuffer() 用于分配特定数量字节空间。  

|              | ArrayBuffer                                       | malloc                                   |
| ------------ | ------------------------------------------------- | ---------------------------------------- |
| 分配失败     | 抛出错误                                          | 返回 null 指针                             |
| 分配大小限制 | Number.MAX_SAFE_INTEGER（2<sup>53</sup> - 1）字节 | 只受可寻址系统内存限制（可使用虚拟内存） |
| 分配成功     | 将所有二进制初始化为 0                             | 不会初始化地址                           |
| 内存释放     | 可被垃圾回收，不用手动释放                        | free() 或程序退出                         |   

**DataVIew：** 读取 ArrayBuffer 的视图。  
- 读或写的字节偏移量。  
- 使用 ElementType 实现 JS 中 Number 类型到二进制格式的转换。  
- 内存中值的字节序（默认大端字节序）。  

```js
const buf = new ArrayBuffer(16); 

// DataView 默认使用整个 ArrayBuffer 
const fullDataView = new DataView(buf); 
alert(fullDataView.byteOffset); // 0 
alert(fullDataView.byteLength); // 16 
alert(fullDataView.buffer === buf); // true 

// 构造函数接收一个可选的字节偏移量和字节长度
// byteOffset=0 表示视图从缓冲起点开始
// byteLength=8 限制视图为前 8 个字节
const firstHalfDataView = new DataView(buf, 0, 8); 
alert(firstHalfDataView.byteOffset); // 0 
alert(firstHalfDataView.byteLength); // 8 
alert(firstHalfDataView.buffer === buf); // true 

// 如果不指定，则 DataView 会使用剩余的缓冲
// byteOffset=8 表示视图从缓冲的第 9 个字节开始
// byteLength 未指定，默认为剩余缓冲
const secondHalfDataView = new DataView(buf, 8); 
alert(secondHalfDataView.byteOffset); // 8
alert(secondHalfDataView.byteLength); // 8 
alert(secondHalfDataView.buffer === buf); // true
```

**ElementType**：（ES6 支持的 8 种）  
![](JavaScript.assets/image-20230221150245974.png)  
类型可以互换使用。  

```js
// 在内存中分配两个字节并声明一个 DataView 
const buf = new ArrayBuffer(2); 
const view = new DataView(buf); 

// 说明整个缓冲确实所有二进制位都是 0 
// 检查第一个和第二个字符
alert(view.getInt8(0)); // 0 
alert(view.getInt8(1)); // 0 

// 检查整个缓冲
alert(view.getInt16(0)); // 0 

// 将整个缓冲都设置为 1 
// 255 的二进制表示是 11111111（2^8 - 1）
view.setUint8(0, 255); 

// DataView 会自动将数据转换为特定的 ElementType 
// 255 的十六进制表示是 0xFF 
view.setUint8(1, 0xFF); 

// 现在，缓冲里都是 1 了
// 如果把它当成二补数的有符号整数，则应该是-1 
alert(view.getInt16(0)); // -1 

```

**字节序**：存储顺序。  
- 大端字节序 ------ 最高有效位保存在第一个字节，最低有效位保存在最后一个字节。  
- 小端字节序 ------ 与大端字节序相反。  

###### Map

可使用任何类型作为键/值。  
会维护键/值对插入顺序，可顺序迭代，可扩展操作。  

**属性和方法**：  
- `set()`：设置键/值对  
  返回 Map 实例，可链式操作
- `get()`：查询
- `has()`：查询
- `clear()`：清空  
- `delete()`：删除指定键/值对  
- `size`：获取键/值对数量  

**Object vs Map**：  
- 内存占用：给定固定内存大小，Map 比 Object 多存储 50% 的键/值对  
- 插入性能：Map 插入会快一点，插入操作频繁，Map 性能更好  
- 查找速度：少量键/值对时，Object 有时候更快（键为数字，浏览器引擎会进行特殊处理）  
- 删除性能：Map 删除比查询和插入更快，适合大量删除操作

###### WeakMap

Map 的子集，多数操作同 Map。  
“weak”指 JavaScript 中垃圾回收机制对待“弱映射”中键的方式。  
弱映射中的键只能是 Object 或者继承自 Object 的类型。  
不可迭代，没有 `clear()`。  
**用途**：  
1.私有变量

```js
// (()=>{})()闭包防止外部通过实例引用和弱映射访问私有变量
// 但会陷入ES6之前的闭包私有变量模式
const User = (() => { 
 const wm = new WeakMap(); 
 class User { 
 constructor(id) { 
 this.idProperty = Symbol('id'); 
172 第 6 章 集合引用类型
 this.setId(id); 
 } 
 setPrivate(property, value) { 
 const privateMembers = wm.get(this) || {}; 
 privateMembers[property] = value; 
 wm.set(this, privateMembers); 
 } 
 getPrivate(property) { 
 return wm.get(this)[property]; 
 } 
 setId(id) { 
 this.setPrivate(this.idProperty, id); 
 } 
 getId(id) { 
 return this.getPrivate(this.idProperty); 
 } 
 } 
 return User; 
})(); 
const user = new User(123); 
alert(user.getId()); // 123 
user.setId(456); 
alert(user.getId()); // 456
```

2.DOM 节点元数据

```js
// 当节点从DOM树中删除时，垃圾回收会自动回收
const wm = new WeakMap(); 
const loginButton = document.querySelector('##login'); 
// 给这个节点关联一些元数据
wm.set(loginButton, {disabled: true});
```

###### Set

与 Map 类似，但添加方法为 `add()`，也可以链式操作。可以包含任何类型。  
**定义正式集合操作**：  
- 有的 Set 操作具有关联性，要考虑处理多个 Set 实例
- 所有方法返回的集合要保证插入顺序
- 扩展操作符尽量避免集合与数组间转化，可以节省对象初始化成本
- 不要修改已有集合实例，返回新的集合实例

```js
class XSet extends Set { 
	union(...sets) { 
		return XSet.union(this, ...sets) 
	} 
	intersection(...sets) { 
		return XSet.intersection(this, ...sets); 
	} 
	difference(set) { 
		return XSet.difference(this, set); 
	} 
	symmetricDifference(set) { 
		return XSet.symmetricDifference(this, set); 
	} 
	cartesianProduct(set) { 
		return XSet.cartesianProduct(this, set); 
	} 
	powerSet() { 
		return XSet.powerSet(this); 
	} 
	
	// 返回两个或更多集合的并集
	static union(a, ...bSets) { 
		const unionSet = new XSet(a); 
		for (const b of bSets) { 
			for (const bValue of b) { 
				unionSet.add(bValue); 
			} 
		} 
		return unionSet; 
	} 
	
	// 返回两个或更多集合的交集
	static intersection(a, ...bSets) { 
		const intersectionSet = new XSet(a); 
		for (const aValue of intersectionSet) { 
			for (const b of bSets) { 
				if (!b.has(aValue)) { 
					intersectionSet.delete(aValue); 
				} 
			} 
		} 
		return intersectionSet; 
	} 
	
	// 返回两个集合的差集
	static difference(a, b) { 
		const differenceSet = new XSet(a); 
		for (const bValue of b) { 
			if (a.has(bValue)) { 
				differenceSet.delete(bValue); 
			} 
		} 
		return differenceSet; 
	} 
	
	// 返回两个集合的对称差集
	static symmetricDifference(a, b) { 
		// 按照定义，对称差集可以表达为
		return a.union(b).difference(a.intersection(b)); 
	} 
	
	// 返回两个集合（数组对形式）的笛卡儿积
	// 必须返回数组集合，因为笛卡儿积可能包含相同值的对
	static cartesianProduct(a, b) { 
		const cartesianProductSet = new XSet(); 
		for (const aValue of a) { 
			for (const bValue of b) { 
				cartesianProductSet.add([aValue, bValue]); 
			} 
		} 
		return cartesianProductSet; 
	} 
	// 返回一个集合的幂集
	static powerSet(a) { 
		const powerSet = new XSet().add(new XSet()); 
		for (const aValue of a) { 
			for (const set of new XSet(powerSet)) { 
				powerSet.add(new XSet(set).add(aValue)); 
			} 
		} 
		return powerSet; 
	} 
}
```

###### WeakSet

类似 WeakMap。  

#### 类型扩展

##### [函数](JavaScript函数.md)

##### [对象](JavaScript对象.md)

##### [字符串](JavaScript字符串.md)

##### [数组](JavaScript数组.md)

#### 类型判断

`typeof x`: 返回变量 x 的类型  
`isNaN()`：判断是否是 NaN  
`isFinite()`：判断是否在最大值和最小值之间

```ad-tip
**typeof**  
用于检测字符串、数值、布尔值和undefined。  
在检测函数时会返回Function，实际上内部实现了`[[call]]`的对象都会返回Function；
在Safari5以前和Chrome7以前，检测正则表达式时也会返回Function。  
在IE和FIrefox浏览器中会返回Object。  
**instanceof**  
用于检测引用类型。  
```

#### 内存

变量都维护在栈区，基本数据类型的值保存在栈区，而引用数据类型的引用地址保存在栈区，值保存在堆区。  
变量的引用地址保存在栈区，真正的值保存在堆区，除了基本数据类型之外的所有其他数据类型被称为引用数据类型。  

内存泄漏：

```js
function assignHandler() { 
	let element = document.getElementById('someElement'); 
	element.onclick = () => console.log(element.id); 
} 
```

优化写法：

```js
function assignHandler() { 
	let element = document.getElementById('someElement'); 
	let id = element.id; 
	element.onclick = () => console.log(id);
	element = null; 
} 
```

#### 操作符

##### 算术运算符

  - （+）
    - 单独变量前：  
      单独放在一个变量前，相当于调用 Number()，将其他数据类型转换成 number 类型

      ```javascript
      console.log(+'123')//123  number类型
      console.log(+'');   //0
      console.log(+' ');  //0
      console.log(+'016');  //16  不识别8进制，识别成10进制
      console.log(+'0xaa'); //170  //识别16进制
      console.log(+true); //1 
      console.log(+false);  //0
      console.log(+undefined);  //NaN
      console.log(+null);   //0
      ```

    - 两个变量之间：  
      如果两边不为 string 和 object 时，转换成 number 类型做运算  
      如果两边有一边为 string 类型时，会将另外一个变量（除 object）转为 string，作拼接  
      如果两边有一边为对象，如果该对象既重写 toString,又重写了 valueOf 方法，先调用 valueOf 方法获取返回值，将该返回值和另外一个操作数进行运算。如果该对象没有重写 valueOf 方法，将调用 toString 方法获取返回值，将该返回值和另外一个操作数进行运算。

      ```javascript
      var obj = {
      name:"briup",
        valueOf:function(){
          return "1";
        },
        toString(){
          return "2";
        }
      }
      console.log(obj+1);//"11"
      ```

  - （-）  
    将一元减应用于数值时，数值会变成负数。  
    将一元减应用于非数值时，遵循与一元加操作符相同的规则，最后将得到的数值转化为负数

##### 比较运算符

  - 优先级：算术>比较>赋值
  - 当比较基本数据类型的时候比较值，当值的类型不一致时候，先将其转换为一致再进行比较
  - 当比较引用数据类型的时候比较引用地址
  - \=\=(!=) 只比较值，\=\=\=(!\=\=) 先看类型，相同再看值

**比较两个相容内容的对象：**  
将对象转换成 json 字符串，在进行比较

```JavaScript
var obj1_str = JSON.stringify(obj1);
var obj2_str = JSON.stringify(obj2);
console.log(obj1_str === obj2_str);
```

##### 逻辑运算符（短路运算符）

  与（&&）  
  或（||）  
  非（!）

##### 三目运算符

  条件?执行 1: 执行 2;  
  变量视为 false 的情况：' '、0、null、underfined、false

##### 位操作符

  针对于数字类型的值进行运算，在运算之前先转换为二进制  
  按位与（&）  
  按位或（|）  
  按位亦或（^）

##### 指数运算符（ES7）

** 运算符，作用同 `Math.pow()`。  

#### 类型转换

##### 转换字符串的三种方式

```javascript
var s = 1 + ' ';//一边为字符串
var str1 = num.toString();//toString()
var str2 = String();//String()
```

null 和 underfined 比较特殊，不能调用 toString，对象原有的方法他们都不可以调用。如果要转换，可以选用包装器函数（String、Number 等）进行转换

##### 转换成布尔类型的情况

  ' '、0、null、underfined、false 视为假

##### 转换成数值类型的情况

```javascript
var n1 = Number();

//整形，如果转换的值是null,undefined,boolean，均转换为NaN
var n2 = parseInt();  
//符号位出现在其他位置，保留符号位前面的数值
console.log(parseInt("1+2.7")); //1 
//如果首位为数值，依次向后解析，找到连续的数值，直到遇到第一个非数值的，将之前获取的数值转换为Number返回
console.log(parseInt("123ac")); //123 

//浮点型可以保留小数点,如果转换的值是null,undefined,boolean，均转换为NaN
var n3 = parseFloat();
//符号位出现在其他位置，保留符号位前的数值
console.log(parseFloat("1+2.6")); //1 
//如果首位为数值，依次向后解析，找到连续的数值，直到遇到第一个非数值的，将之前获取的数值转换为Number返回
console.log(parseFloat("123.3ac")); //123.3 	
```

经常需要将其他将一个字符串类型的数字转换为 number 类型的数字
- Number(a) 转换函数
- +a 
- -(-a)
- parseInt(a) 将 a 转换为字符串后解析出整数
- parseFloat(a) 将 a 转换为字符串后解析为小数

#### 流程控制语句

##### 注意事项

1. 三要素：计数器、循环条件、迭代
2. break 在循环条件之前结束循环
3. continue 不会结束循环，只跳出当前的那一次循环
4. label 标记 可以给循环体加上一个标签，未来可以使用，结束指定标签的循环体
5. case 代码块中 break 不能省略
6. default 可以放到代码任意位置，break 不能省略，最后位置可以省略 `break;`
7. 变量与常量对比使用“\=\=\=”

##### 增强版 for 循环：for..in 用于遍历数组或者对象的属性

```javascript
for(自定义变量名 in 数组/对象){
  执行代码
}
var arr=[10,'aa',20,30,40];
for(var key in arr){
  console.log(key+"--"+arr[key]);
}
```

```ad-tip
要迭代的变量是 null 或 undefined，则不执行循环体。
遍历所有可枚举的属性，包括原型上的属性。
```

##### for...of 循环可迭代对象

for...of 根据可迭代对象的 `next()` 方法产生的顺序进行迭代。  

```ad-tip
ES2018: 实现for...await...of，支持生成promise的异步可迭代对象。  
```

##### 标签语句

标签 outermost 配合 break 或 continue 语句使用。  

```js
// continue
var iNum = 0;

outermost:
for (var i=0; i<10; i++) {
  for (var j=0; j<10; j++) {
    if (i == 5 && j == 5) {
	    // 使循环减少五次
			continue outermost;
  }
  iNum++;
  }
}

alert(iNum);	//输出 "95"

// break
var iNum = 0;

outermost:
for (var i=0; i<10; i++) {
  for (var j=0; j<10; j++) {
    if (i == 5 && j == 5) {
		  // 此时，中断内外循环
			break outermost;
  }
  iNum++;
  }
}

alert(iNum);	//输出 "55"
```

##### with 语句（不建议）

with 语句：将代码作用域设置为特定对象，适用于一个对象被反复使用时。  

```js
let qs = location.search.substring(1); 
let hostName = location.hostname; 
let url = location.href; 

// 使用with语句
with(location) { 
 let qs = search.substring(1); 
 let hostName = hostname; 
 let url = href; 
} 
```

##### switch 语句

- 条件值可以是任何类型
- 比较时使用全等操作符，不会强制转换数据类型

##### 访问属性的方式

- `objectName.propertyName`
- `objectName["propertyName"]`

##### 表单

- **acceptCharset**：服务器可以接收的字符集，等价于 HTML 的 accept-charset 属性。
- **action**：请求的 URL，等价于 HTML 的 action 属性。 
- **elements**：表单中所有控件的 HTMLCollection（所有 `<input>`、`<textarea>`、`<button>`、`<select>` 和 `<fieldset>` 元素）。 
- **enctype**：请求的编码类型，等价于 HTML 的 enctype 属性。 
- **length**：表单中控件的数量。 
- **method**：HTTP 请求的方法类型，通常是 "get" 或 "post"，等价于 HTML 的 method 属性。 
- **name**：表单的名字，等价于 HTML 的 name 属性。 
- **reset()**：把表单字段重置为各自的默认值。
- **submit()**：提交表单。 
- **target**：用于发送请求和接收响应的窗口的名字，等价于 HTML 的 target 属性。

**取得对 form 的引用：**
- **document.getElementById()...**
- **doucment.forms**

### [DOM：Document Object Model文档对象模型](DOM.md)

DOM 是网页的编程接口。  
JS 操作 html 的 api。  
是针对 XML 但经过扩展用于 HTML 的应用程序编程接口。DOM 将整个页面映射成一个多节点结构。

### [BOM：Browser Object Model 浏览器对象模型](BOM.md)

 JS 操作浏览器的 api 。  
开发人员可以使用 BOM 控制浏览器显示的页面以外的部分。弹出新浏览器窗口；移动，缩放，关闭浏览器的功能；提供浏览器详细信息的 navigator 对象; 提供浏览器所加载页面的详细信息的 location 对象；提供用户显示器分辨率详细信息的 screen 对象；对 cookies 的支持；支持 XMLHttpRequest,IE 中的 ActiveXObject 自定义对象  
弹框：
- 警告框  
  alert(" 弹框 ")
- 会话框  
  var str = prompt(" 输入框 ")
- 确认框  
  var bool = confirm(" 确认框 ")

## JavaScript 的工作原理

采用单线程模式的嵌入式脚本语言  
单线程：
  - 执行代码线程只有一个
  - 任务是需要排队的，如果一个任务执行时间长，会造成阻塞

解决方案：异步
  - setTimeOut：某一些功能，需要等带多少时间后执行
  - Ajax：通常异步，但数据回来时间不确定

## JavaScript 的垃圾回收机制

内存中存在一些不再需要的变量，造成内存泄漏，垃圾回收机制会间隔的不定期的间歇性寻找不再使用的变量并释放。  

主要标记策略：
1. 标记清理 ---- 标记变量是否离开上下文（标记方法有很多种）  
2. 引用计数 ---- 可能形成循环引用问题

对象更替速度（频繁初始化对象又快速失去引用）会影响浏览器垃圾回收的运行，采用更激进的方式。  
可以使用对象池优化。  

```js
function addVector(a, b, resultant) { 
 resultant.x = a.x + b.x; 
 resultant.y = a.y + b.y; 
 return resultant; 
} 

// vectorPool 是已有的对象池 
let v1 = vectorPool.allocate(); 
let v2 = vectorPool.allocate(); 
let v3 = vectorPool.allocate(); 
v1.x = 10; 
v1.y = 5; 
v2.x = -3; 
v2.y = -6; 
addVector(v1, v2, v3); 
console.log([v3.x, v3.y]); // [7, -1] 
vectorPool.free(v1); 
vectorPool.free(v2); 
vectorPool.free(v3); 
// 如果对象有属性引用了其他对象
// 则这里也需要把这些属性设置为 null 
v1 = null; 
v2 = null; 
v3 = null; 
```

```ad-info
对象池的维护结构推荐数组，但要注意提前设置好一个足够的大小，不用重新创建数组导致垃圾回收注意。  
```

### 隐藏类

V8 在将代码编译为实际的机器码时会利用隐藏类，提升性能。  
两个实例使用同一个构造函数生成时，则共享一个隐藏类；  
当其中一个实例动态的添加或删除属性时，则不再共享一个隐藏类；  
建议一次在构造函数中声明所有的属性，使其共享一个隐藏类；  
不想要某个属性时，最佳实践是设为 null，既共享隐藏类，又会触发垃圾回收。  

```js
function Article() { 
 this.title = 'Inauguration Ceremony Features Kazoo Band'; 
} 
let a1 = new Article(); 
let a2 = new Article(); 
// a1、a2 共享一个隐藏类

// 不再共享
a2.author = 'lili';
delete a2.author;

// 推荐一次声明所有属性
function Article(opt_author) { 
 this.title = 'Inauguration Ceremony Features Kazoo Band'; 
 this.author = opt_author; 
} 
let a1 = new Article(); 
let a2 = new Article('Jake'); 
```

## [JavaScript超集-TypeScript](../TypeScript/TypeScript.md)

## [WebAPI](WebAPI.md)

## [ES6+](ES6.md)

## [问题](JavaScript开发中的问题.md)

## 客户端检测

### 能力检测

```js
if (object.propertyInQuestion) { 
 // 使用 object.propertyInQuestion 
} 
```

**基于能力检测进行浏览器分析**

```js
// 检测浏览器是否支持 Netscape 式的插件
let hasNSPlugins = !!(navigator.plugins && navigator.plugins.length); 

// 检测浏览器是否具有 DOM Level 1 能力
let hasDOM1 = !!(document.getElementById && document.createElement && 
 document.getElementsByTagName); 
```

### 用户代理检测

识别 `navigator.userAgent`。  
频繁更新的第三方用户代理解析程序：
- Bowser 
- UAParser.js 
- Platform.js 
- CURRENT-DEVICE 
- Google Closure 
- Mootools 

## [最佳实践](JavaScript%20最佳实践.md)

## 参考

[前端面试题 ===> 【JavaScript - 基础】 - 掘金](https://juejin.cn/post/7307146429004349478)  
[(6条消息) JS语法 ES6、ES7、ES8、ES9、ES10、ES11、ES12新特性_es7 js_前端赵十三的博客-CSDN博客](https://blog.csdn.net/weixin_55846296/article/details/125148986)
