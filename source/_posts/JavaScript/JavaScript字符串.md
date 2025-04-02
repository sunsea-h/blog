---
title: JavaScript字符串
categories:
  - JavaScript
date: 2023-01-31 14:07:50
updated: 2023-03-23 09:44:03
---

# JavaScript 字符串

### 字符串

Blob 构造函数的入参 array，数组元素可以是 USVString，到底什么是 USVString 让我很困惑。

除了 [String](https://link.segmentfault.com/?enc=%2BY2czYed7J4ATNGm%2Bfylrg%3D%3D.nVrjAU8%2F0VXW2smIFGWzM2s7qJpmFTCxJvSuC9oNXhukei3gX8FrF9NHlxJBcki%2BkMtuj6VymPu6pwlrUe7dG00X8F9aCc6u1lCNJuJXUDitv%2FrKrJ2OdDDwRpIgqiPv) 外，其实还包括以下几种类型的 String。

工作中除了 String.prototype 上的那些好用的方法，es6 的模板字符串等等，貌似也没有其他常用字符串的地方了。这里就不再赘述。

参考 mdn 文档和 EcmaScript 规范，再结合实际开发中的经验，做一次简单的专项学习。

- [USVString](https://link.segmentfault.com/?enc=sKhieW4ws%2FUn0yM3GLfbmA%3D%3D.2zU%2BpUnUS1D82oF2fx9DYErGiWoWyUFmeGwIvsY5WofdHT5ns3VBTs5YiotIj%2F7ihvYUb9tk0mlkq9RIuj%2FnRA%3D%3D)
- [DOMString](https://link.segmentfault.com/?enc=L9%2FP%2FC3R%2B%2BDy4o3utW3GgA%3D%3D.IwRlhUdbDa2dHGEP0BN1UNo2FcxdtxOfgjXcLl0veMeV9tyctP4zjOAKvMuHogWhcA6dLu0MxF9pxrAG8NW45Q%3D%3D)
- [CSSOMString](https://link.segmentfault.com/?enc=RhSI76CeqBC6GUoA4wgYkg%3D%3D.SMDmp6lW94AeTiqGTzJCbDnFaODMepqDsJb7kH9nWd%2BLO%2F1qJqlQZJz645pRnvtDDxlOvv04d9YpyYuaBAXWgA%3D%3D)
- [Binary strings](https://link.segmentfault.com/?enc=QfV8oUbDqt%2BbPzZe%2FWROoQ%3D%3D.ArV0fXl6vE4un1U0jYjo7ZBQeA%2B2XMNnG46lR0WHhXnb6a7hfX4wz7nZtbeLOwG0rqyuYnAi2Bvzd90nGeHEQVo0jAqh7wBRNZMMAC0bzsw%3D)
- `<script>` 的 charset=“utf-8”怎么理解
- js 中的 String 采用 utf-16 格式编码与 `<script>` 的 charset=“utf-8”不矛盾吗

#### USVString

- USVString 代表的是所有可用 unicode 标量序列的集合
- 在 js 中返回时，USVString 会映射到一个 String
- 它通常只用于执行文本处理并需要 **操作 unicode 标量值字符串的 api**
- **USVString 会等价 DOMString**，除了不允许 **未匹配的替代的码点**（在浏览器中，USVString 中未匹配的替代码点，会转换成 Unicode `U+FFFD`(�) 字符）

#### DOMString

- DOMString 是 utf-16 字符串
- **在 js 中，DOMString 最终也会映射为 String**
- 一个 DOMString 类型的方法或者参数允许传 null，通常是指 'null'

#### CSSOMString

- 要想了解 CSSOMString，首先需要知道 CSSOM 是什么。CSSOM 是 CSS Object Model，它是一个可以通过 js 操作 css 的 api 集合。
- CSSOMString 在 CSSOM 中表示字符串数据，可以引用 DOMString 或者 USVString。
- 当规范提到 CSSOMString 时，依赖于浏览器的 vendor 去使用 DOMString 或者 USVString。
- 在浏览器内存中如果通过 UTF-8 表示字符串数据，那么可以用 USVString 来替代 CSSOMString。
- 如果浏览器要用 16 位的序列表示字符串，可能会用 DOMString。
- 所谓 utf-8，utf-16 其实就是指用多少位表示字符串，8-bit Unicode Transformation Format。
- **目前几款主流的 Firefox，Chrome，Safari，Opera 都是用 USVString 来表示 CSSOMString 的。**

#### Binary strings

- JS 中的字符串是 utf-16 编码的。**这就意味着一个代码单元需要 2 个字节的内存，也就是说 js 中 string 的长度是以 2 个字节为单位进行计算的。**
- 二进制字符串是用来代表二进制数据的，并不是为了代表字符。
- 二进制字符代表的数据大小是原始数据的两倍
- 引入二进制字符串的原因在于使用 unit8 类型数字的 web 应用在音频，视频以及 WebSocket 方面越来越强大，所以需要引入一个很好用 api 来提供支持
- 过去操作二进制数据是通过字符串的操作模拟的。也就是通过 charCodeAt 方法从二进制字符串中读取数据。效率低下，错误率高。对于不是严格意义上的二进制格式数据，32 字节整数或者浮点数也会容易出错。
- js 中的 typed arrays 提供了一个操作二进制数据的更加高效的方法。关于 typed arrays，可以参考 [JavaScript之typed arrays那些事儿](https://link.segmentfault.com/?enc=T6at%2B4gWNpdUomZpn%2FyQvQ%3D%3D.sG6pJwxx5EEPMX%2Fs2BvKpn%2BVAPa8BK%2FfvbhDJ5xtImaNIEv%2F5W1S8P%2FxlZ4b0pf0cSNLOzG1Xs8eWFw7FjMczQ%3D%3D)。

#### `<script>` 的 charset="utf-8" 怎么理解

- 不区分大小写的 'utf-8'
- 没有必要为 charset 属性设置值，因为 document 必须是 UTF-8
- script 标签会从 document 继承他的 character encoding（字符编码方式）
- HTML Living Standard 的建议是移除 charset 属性

规范中的说明如下：

> If the script element has a charset attribute, then let encoding be the result of getting an encoding from the value of the charset attribute.If the script element does not have a charset attribute, or if getting an encoding failed, let encoding be the same as the encoding of the script element's node document.To get an encoding from a string label, run these steps:Remove any leading and trailing ASCII whitespace from label.If label is an ASCII case-insensitive match for any of the labels listed in the table below, return the corresponding encoding, and failure otherwise.

Name  
Labels  
UTF-8  
"unicode-1-1-utf-8","utf-8","utf8"  
UTF-16LE  
"utf-16","utf-16le"  
js 中存在 utf-8 encoder 和 utf-8 decoder 专门进行 utf-8 的编解码工作  

#### js 中的 String 采用 utf-16 格式编码与 `<script>` 的 charset=“utf-8”不矛盾吗

不矛盾。utf-16 人类友好，utf-8 机器友好。  
写 js 代码时，utf-16 人类友好。人类可识别。  
script utf-8 编码时 utf-8 友好；端到端通信时，utf-8 机器友好。机器高效运行。  
**script 编码难道不对 utf-16 的 js string 进行编码？**  
**编码。但是 js 代码中不只有字符串类型，还有 Boolean，Number 等等一系列类型。不矛盾！**

> 4.3.17String valueprimitive value that is a finite ordered sequence of zero or more 16-bit unsigned integer valuesNOTEA String value is a member of the String type. Each integer value in the sequence usually represents a single 16-bit unit of UTF-16 text. However, ECMAScript does not place any restrictions or requirements on the values except that they must be 16-bit unsigned integers.

- js 字符串中是由 0 个或者多个 16bit 的无符号整数组成
- 每个整数的值通常表示 UTF-16 文本的一个 16bit 单元
- **es 规定 js 字符必须是一个 16bit 的无符号整数**

##### 初见端倪

通过 encodeURIComponent 和 decodeURIComponent 可以初见端倪。

首先明确一点。

utf-8 格式 url（机器友好）：`"http://foo.test.go.com/index.html##/?from=http%3A%2F%2Fbar.crm.test.go.com%2F&redirectUrl=http%3A%2F%2Fbaz.test.go.com%2Fuser%2FgetCASUser&platformCode=10004"`

utf-16 格式 url（人类友好）：`"http://foo.test.go.com/index.html##/?from=http://bar.crm.test.go.com/&redirectUrl=http://baz.test.go.com/user/getCASUser&platformCode=10004"`

encodeURIComponent(uriComponent) 将 UTF-16 编码的 url（其实就是 js 中的 url 字符串，`“https://www.foo.com?foo=123”`）编码为 UTF-8 格式 `"https%3A%2F%2Fwww.foo.com%3Ffoo%3D123"`

decodeURI(encodedURIComponent) 将 UTF8 格式的 url 解码为 utf-16 格式“[https://www.foo.com?foo=123](https://www.foo.com?foo=123)”

##### 为什么不用 encodeURI？

因为：

> Note that encodeURI by itself cannot form proper HTTP GET and POST requests, such as for XMLHTTPRequests, because "&", "+", and "=" are not encoded, which are treated as special characters in GET and POST requests. encodeURIComponent, however, does encode these characters.

不能生成用于 HTTP GET 或者 POST 请求的 url，因为：

> encodeURI Not Escaped: A-Z a-z 0-9 ; , / ? : @ & = + $ - _ . ! ~ * ' ( ) ##

##### 小结

- utf-8 编码机器友好：浏览器 http url，script 默认编码格式等等
- utf-16 编码人类友好：肉眼可识别字符串
- **script utf-8 编码难道不对 utf-16 的 js string 进行编码？** **编码。但是 js 代码中不只有字符串类型，还有 Boolean，Number 等等一系列类型。不矛盾！**

### 总结

- chrome 中的 CSSOMString 最终都会映射成 USVString
- js 中的 USVString 最终会映射成 String
- js 中的 String 采用 utf-16 格式编码，也就是说 js 中字符串的最小组织单元是 2 个字节（byte）
- js 中的二进制数据可以通过 js 的 typed arrays 进行操作
- `<script>` 的 charset="utf-8" 没有必要再显式设置，会继承 document 的编码方式
- script utf-8 编码难道不对 utf-16 的 js string 进行编码？
- 编码。但是 js 代码中不只有字符串类型，还有 Boolean，Number 等等一系列类型。不矛盾！

## 参考

[前端String那些事儿-阿里云开发者社区](https://developer.aliyun.com/article/948079)  