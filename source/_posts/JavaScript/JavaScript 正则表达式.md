---
title: JavaScript 正则表达式
date: 2022-09-26 09:27:58
updated: 2025-03-21 16:54:15
---
# JavaScript 正则表达式

## 元字符

### 基本符

| 元字符 | 描述                                                      |
| ------ | --------------------------------------------------------- |
| .      | 句号匹配任意单个字符除了换⾏符                            |
| []     | 字符种类。匹配⽅括号内的任意字符                          |
| [^]    | 否定的字符种类。匹配除了⽅括号⾥的任意字符                |
| *      | 匹配>=0 个重复的在\* 号之前的字符                           |
| +      | 匹配>=1 个重复的 + 号前的字符                                |
| ?      | 标记?之前的字符为可选                                     |
| {n,m}  | 匹配 num 个⼤括号之前的字符或字符集 (n <= num <= m)         |
| (xyz)  | 字符集，匹配与 xyz 完全相等的字符串                       |
| \|     | 或运算符，匹配符号前或后的字符                            |
| \      | 转义字符,⽤于匹配⼀些保留的字符 [ ] ( ) { } . * + ? ^ $ \ |
| ^      | 从开始行开始匹配                                          |
| $      | 从末端开始匹配                                            | 

### (...) 特征集群

相当于数学中小括号的作用，括号内为一个整体。  
例：  
`(ab)*` 匹配连续出现 0 或多个 `ab`  
`ab*` 匹配连续出现多个 `b`

### 转码特殊字符

`\.?` 匹配句子中的 `.`

## 简写字符集

| 简写 | 描述                                              |
| ---- | ------------------------------------------------- |
| .    | 除换⾏符外的所有字符                              |
| \w   | 匹配所有字⺟数字，等同于 [a-zA-Z0-9_]             |
| \W   | 匹配所有⾮字⺟数字，即符号，等同于： [^\w]        |
| \d   | 匹配数字： [0-9]                                  |
| \D   | 匹配⾮数字： [^\d]                                |
| \s   | 匹配所有空格字符，等同于： [\t\n\f\r\p{Z}]        |
| \S   | 匹配所有⾮空格字符： [^\s]                        |
| \f   | 匹配⼀个换⻚符                                    |
| \n   | 匹配⼀个换⾏符                                    |
| \r   | 匹配⼀个回⻋符                                    |
| \t   | 匹配⼀个制表符                                    |
| \v   | 匹配⼀个垂直制表符                                |
| \p   | 匹配 CR/LF（等同于 \r\n ），⽤来匹配 DOS ⾏终⽌符 | 

## 零宽度断言（前后预查）

| 符号 | 描述            |
| ---- | --------------- |
| ?=   | 正先⾏断⾔ - 存在 |
| ?!   | 负先⾏断⾔ - 排除 |
| ?<=  | 正后发断⾔ - 存在 |
| ?<!  | 负后发断⾔ - 排除 | 

- `?=...` 正先行断言：  
	"(T|t)he(?=\sfat)" => The fat cat sat on the mat.  
	匹配 The 和 the ，后⾯紧跟着 (空格)fat
- `?!...` 负先⾏断⾔  
	"(T|t)he(?!\sfat)" => The fat cat sat on the mat.  
	匹配 The 和 the ，且其后不跟着 (空格)fat
- `?<= ...` 正后发断⾔  
	"(?<=(T|t)he\s)(fat|mat)" => The fat cat sat on the mat.  
	匹配 fat 和 mat ，且其前跟着 The 或 the 
- `?<!...` 负后发断⾔  
	"(?<!(T|t)he\s)(cat)" => The cat sat on cat.  
	匹配 cat ，且其前不跟着 The 或 the 

## 标志（模式修正符）

| 标志 | 描述                                            |
| ---- | ----------------------------------------------- |
| i    |忽略大小写|
| g    | 全局搜索                                        |
| m    | 多行修饰符：锚点元字符 ^ $ ⼯作范围在每⾏的起始 | 

## 贪婪匹配和惰性匹配

默认采用贪婪匹配，通过 `？` 切换为惰性匹配。

`"/(.*at)/" => The fat cat sat on the mat.`  
`"/(.*?at)/" => The fat cat sat on the mat.`

## test 使用 g 搜索模式的坑

```js
var  reg=/cat/g;
var str='this a cat,this a dog'; 
document.write(reg.test(s)); 
document.write(reg.test(str)); 
```

按道理两次打印出来都应该是 true,true,而最终结果为 true,false。  
g 表示全文查找，在正则表达式内部有一个 lastIndex 来记录匹配的位置，第一次调用 test() 后，那么 lastIndex 就不再等于 0，而是 10，当下次在调用该方法的时候，字符串的匹配会从 lastIndex 位置进行匹配，故最终返回 false.  
**使用 test 时慎用 g 。**

遇到此种情况后的解决方法：  
1.去除 g;  
2.在第二次使用前，设置 `reg.lastIndex=0` 即可。  
3.使用字符串的 match 方法替代，`str.match(Regex)`。  
`match()` 参数如果不是正则对象，则隐式使用 `new RegExp(obj)` 转化为正则。

```js
const regex1 = /\d{2,}/g;
const regex2 = /\d{2,}/;
console.log('1234ddaa123ccc456ddd'.match(regex1));
// [ '1234', '123', '456' ]
console.log('1234ddaa123ccc456ddd'.match(regex2));
// [ '1234', index: 0, input: '1234ddaa123ccc456ddd', groups: undefined ]
```

**`exec()` 也会遇到同样的问题**：

```js
const regex1 = /\d{2,}/g;
console.log(regex1.exec('12345aas123dasd'));
// [ '12345', index: 0, input: '12345aas123dasd', groups: undefined ]
console.log(regex1.exec('12345aas123dasd'));
// [ '123', index: 8, input: '12345aas123dasd', groups: undefined ]
console.log(regex1.exec('12345aas123dasd'));
// null
```

## RegExp()

使用 RegExp() 创建正则对象时注意 **转义**。

```js
const regex1 = /\d{2,}/;
const regex2 = new RegExp('\d{2,}');
console.log(regex1.test('12345aasdasd'));// true
console.log(regex2.test('12345aasdasd'));// false

const regex1 = /\d{2,}/;
const regex2 = new RegExp('\\d{2,}');
console.log(regex1.test('12345aasdasd'));// true
console.log(regex2.test('12345aasdasd'));// true
```

## 前瞻检查

校验密码强度  
包含数字，字母，特殊字符（`$@,_.`）

```js
const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$@,_.])[\da-zA-z$@,_.]$/
```

## 常用正则

校验中文：`\u4E00-\u9FA5`
