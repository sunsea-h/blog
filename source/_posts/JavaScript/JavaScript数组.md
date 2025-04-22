---
title: JavaScript 数组
date: 2022-09-05 11:33:18
updated: 2023-07-30 20:48:58
---

# JavaScript 数组

## 数组基础

js 中的数组是可以存放任意数据类型值的集合，数组的元素可以是任意数据类型，数组的长度可以动态调整  
JavaScript 里数组的最大长度是： 4,294,967,295，即 2^32 - 1

### 数组创建

#### 使用 Array 构造函

- 一个参数，如果是 number 类型的整数，则代表的是数组的长度。如果是 number 类型的小数，则报错。如果是其他类型，则当做数组元素放进去
- 两个参数或者多个参数,当做数组元素放进去

```javascript
var arr = new Array();
var arr = new Array(20);  // 预先指定数组的大小
var arr = new Array("terry","larry","boss"); //传入参数
```

#### 使用数组字面量

```javascript
var arr = ["terry","larry","boss"];
var arr = []	//空数组
```

### 数组访问

1. 数组变量名 [索引]
2. 索引数值需小于数组长度（0~length-1）
3. 如果给大于等于 length 的索引赋值，数组自动增加到索引 +1 的长度，中间跳过的索引赋值 underfined

```javascript
var arr = [0, 1, 2, 3];
arr[7] = 7;
console.log(arr);
console.log(arr[7]);
console.log(arr[5]);
```

![](JavaScript数组.assets/image-20220925210547241.png)

### 数组在内存中的表现

var arr = new Array()  
arr 对象 = new 构造函数 ()  
![](JavaScript数组.assets/image-20220925210600818.png)

### 数组检测

- 对于一个网页或者一个全局作用域而言，使用 instanceof 操作符即可判断某个值是否是数组。
- 如果网页中包含多个框架，就会存在两个不同的全局环境，存在两个不同版本的 Array 构造函数，使结果不准确。因此，ECMAScript5 新增了 Array.isArray() 方法进行判断

```javascript
var arr = [];
typeof arr ;  //结果为object
arr instanceof Array	//结果为true，在同一个全局作用域下可以这么判断
Array.isArray(arr);	//结果为true，判断arr是否是数组类型
```

### 数组序列化

1. toString()	在默认情况下都会以逗号分隔字符串的形式返回数组项
2. join()	使用指定的字符串用来分隔数组字符串
3. JSON.stringify() 和 JSON.parse() JSON 序列化和反序列化

```javascript
var arr = [1,5,2,8,10,{a:1}];
console.log(arr);//[ 1, 5, 2, 8, 10, { a: 1 } ]
console.log(arr.toString());//1,5,2,8,10,[object Object]

console.log(arr.join(""));//152810[object Object]
console.log(arr.join("-"));//1-5-2-8-10-[object Object]

var result = JSON.stringify(arr);
console.log(result);//[1,5,2,8,10,{"a":1}]
console.log(JSON.parse(result));//[ 1, 5, 2, 8, 10, { a: 1 } ]
```

## 数组 API

### 构造函数的方法

- `Array.isArray()` 判断某个变量是否是一个数组对象
- `Array.from()` 从类数组对象或者可迭代对象中创建一个新的数组实例

```javascript
Array.from('foo');   //[ 'f', 'o', 'o' ]
const set = new Set(['foo', 'bar', 'baz', 'foo']);
Array.from(set);    //[ 'foo', 'bar', 'baz' ] 
//Set是唯一值的集合，会删除重复的值
```

- `Array.of()` 根据一组参数来创建新的数组实例，支持任意的参数数量和类型

```javascript
Array.of(1, 2, 'hello') //[ 1, 2, 'hello' ]
```

### 原型的方法

#### 栈与队列方法

栈、队列方法会改变原数组
- 栈 LIFO (Last-In-First-Out)
	- `pop()`	移除数组中的最后一个项并且返回该项，同时将数组的长度减一
	- `push()` 可接受任意类型的参数，将它们逐个添加到数组的末尾，并返回数组的长度
- 队列 FIFO (First-In-First-Out)
	- `shift()` 移除数组中的第一个项并且返回该项，同时将数组的长度减一
	- `unshift()` 在数组的前端添加任意个项，并返回数组的长度

```javascript
var arr = ['red', 'yellow', 'green', 'blue', 'orange', 'black'];
console.log(arr.length);	//6
console.log(arr.pop());	//black
console.log(arr.length);	//5
console.log(arr.push('hello', 'world'));	///7
console.log(arr);	//['red','yellow','green','blue','orange','hello','world']

console.log(arr.shift());	//red
console.log(arr.length);	//6
console.log(arr.unshift('white'));	//7
console.log(arr);	//['white','yellow','green','blue','orange','hello','world']
```

#### 排序方法

- `reverse()` 反转数组项的顺序。改变原数组
- `sort()` 对数组的元素进行排序，并返回数组。改变原数组  
默认：按照字符在字符编码表中出现的位置进行排序进行排序  
含有参数：参数必须是返回值为正值、零值或负值的函数，根据返回的值进行排序。

```javascript
//默认
var arr = [82,1,43,2,8,32,5];
arr.sort();
console.log(arr);//[1,2,32,43,5,8,82]

//含有参数
var arr = [82,1,43,2,8,32,5];
arr.sort(function (a, b){return a-b});//[1,2,5,8,32,43,82]  a为后面的值。返回负值，a在b的前面；返回正值，a在b的后面；返回零值，a、b的相对位置不变
console.log(arr);
```

#### 操作方法

- `concat()`  
数组拼接，先创建当前数组的一个副本，然后将接收到的参数添加到这个副本的末尾，返回副本。不改变原数组

```javascript
var arr1 = [3,8,2,5,"hello"];
var arr2 = [10,100,1000];	
var result1 = arr1.concat(arr2);
console.log(arr1);//[ 3, 8, 2, 5, 'hello' ]
console.log(result1);//[ 3, 8, 2, 5, 'briup', 10, 100, 1000 ]
```

- `slice(a, b)`  
数组切割，范围从 a 到 b，左闭右开,将切割的值返回为一个新数组。不改变原数组

```javascript
var arr = [ 3, 8, 2, 5, 'hello', 10, 100, 1000 ];
var result = arr.slice(4, 6);
console.log(arr);//[ 3, 8, 2, 5, 'hello', 10, 100, 1000 ]
console.log(result);//[ 'hello', 10 ]
```

- `splice()`  
始终返回一个数组，该数组中包含从原始数组中删除的项，还可以向原数组中插入项。

```javascript
// 删除  两个参数(起始位置，删除项数)
var arr = [3,8,2,5,"hello"];
var result = arr.splice(1,4);
console.log(arr);//[ 3 ]
console.log(result);//[ 8, 2, 5, 'hello' ]

// 替换 至少3个(起始位置，删除项数，放入的元素)
var arr = [3,8,2,5,"hello"];
var result = arr.splice(1,4,"test",[1,2,3]);
console.log(arr);//[ 3, 'test', [ 1, 2, 3 ] ]
console.log(result);//[ 8, 2, 5, 'hello' ]

// 插入元素 至少3个(起始位置，删除项数0，放入的元素)
var arr = [3,8,2,5,"hello"];
var result = arr.splice(1,0,"test",[1,2,3]);
console.log(arr);//[ 3, 'test', [ 1, 2, 3 ], 8, 2, 5, 'hello' ]
console.log(result);//[]
```

#### 位置方法

 - `indexOf()`  
从数组开头向后查找，使用全等操作符，找不到该元素返回 -1。第一个参数为要查找的项，第二个参数（可选）为索引开始位置
- `lastIndexOf()`  
从数组末尾向前查找，使用全等操作符，找不到该元素返回 -1。第一个参数为要查找的项，第二个参数（可选）为索引开始位置

```javascript
var arr = [1,3,7,2,'hello','world'];
var result = arr.indexOf('hello', 2);//4
var result2 = arr.lastIndexOf(7, 4);//2
console.log(result, result2)
```

#### 迭代方法

- `every()` 对数组中的每一元素运行给定的函数，如果该函数对每一项都返回 true，则该函数返回 true
- `some()` 对数组中的每一运行给定的函数，如果该函数对某一项返回 true，则返回 true
- `filter()` 对数组中的每一项运行给定的函数，会返回满足该函数的项组成的数组
- `map()` 对数组中的每一元素运行给定的函数，返回每次函数调用的结果组成的数组
- `forEach()` 对数组中的每一元素运行给定的函数，没有返回值，常用来遍历元素

```javascript
var students = [
    {name:"briup",age:12,sno:1001},
    {name:"boss",age:32,sno:1002},
    {name:"lisi",age:89,sno:1003}
];
console.log(students);
//判断是否都是成年人-every
var result = students.every(function(item){
    return item.age>18;
});
console.log("判断是否都是成年人:"+result);
// 查看学生中有没有成年人-some
var result = students.some(function(item){
    return item.age>18;
});
console.log("查看学生中有没有成年人:"+result);
// 过滤出成年人-filter
var result = students.filter(function(item){
    return item.age>18;
});
console.log(students);//学生数组不发生改
console.log(result);//成年人有
// 查找所有学生的姓名，并返回数组-map 映射
var result = students.map(function(item){
    return item.name;
});
console.log(students);//所有学生信息
console.log(result);//只有学生姓名的数组 [ 'briup', 'boss', 'lisi' ]
//forEach 遍历数组
var arr = [3,8,2,5,"hello","5",5];
console.log(arr);
var result2=arr.forEach(
    function(arr){
        console.log(arr);//3 8 2 5 hello 5 5
    });
console.log(result2);//underfined
```

补：

## 数组清空

1. **赋值为 []**

```JavaScript
var ary = [1,2,3,4];
ary = [];
```

2. **length 赋值为 0**

```JavaScript
int[] ary = {1,2,3,4};
ary.length = 0;
```

3. **splice**

```JavaScript
var ary = [1,2,3,4];
ary.splice(0,ary.length);
```

## [深浅拷贝](JavaScript深浅拷贝.md)

## forEach 和 map 的区别

[js forEach参数详解，forEach与for循环区别，forEach中如何删除数组元素 - 听风是风 - 博客园](https://www.cnblogs.com/echolun/p/11544045.html)  
**同：**
- 都是循环遍历数组中的每一项
- forEach 和 map 方法里每次执行匿名函数都支持 3 个参数，参数分别是 item（当前每一项）、index（索引值）、arr（原数组）
- 匿名函数中的 this 都是指向 window
- 只能遍历数组

**异：**  
`forEach()`  
返回值是 undefined，return 不报错，也不会生效  
不可以链式调用  
对空数组不会调用回调函数  
不支持 break，没有办法终止或者跳出 forEach() 循环，除非抛出异常  
**forEach 删除自身元素 index 不会被重置**（隐性让 index 自增）  
`map()`  
返回一个新数组，原数组不会改变，不会对空数组检测。

## 特殊用法

`Array.filter(Boolean)`，Boolean 是一个函数，将数组的每个值按真假返回布尔值，可用于去除 Array 中的假值。

```js
const newArray = ['a', 0, null, 'hello', 1].filter(Boolean);
console.log(newArray);// [ 'a', 'hello', 1 ] 
```

## 实践

### 1.快速生成数字填充的数组

```js
const arr1 = [...new Array(10).keys()]  // 0-9
 
const arr2 = Array.from(Array(10), (v, k) => k + 1)

const arr3 = [...Array(10)].map((v, i) => i + 1)
```

### 2.快速生成 [] 填充的数组

```js
const arr = new Array(10).fill().map(() => new Array())
```