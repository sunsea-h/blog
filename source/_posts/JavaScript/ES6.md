---
title: ES6
categories:
  - JavaScript
date: 2022-09-05 11:33:18
updated: 2023-12-10 19:11:45
---

# ES6

## 变量声明

### var、let 和 const 的区别

1. `var`

- 变量提升
- 可以重复定义相同的变量
- 声明范围是函数作用域
- 在方法内部为局部变量，方法外为全局变量 (不加 var 在方法内外都是全局变量；在方法内时，需要先调用方法提示声明了全局变量)

2. `let`

- 同一作用域不可以重复定义相同的变量
- 没有声明变量之前不可以使用，没有变量提升
- 声明范围是块作用域

3. `const`

- 不能重复定义相同变量
- 没有声明变量之前不可以使用，没有变量提升
- 拥有局部作用域
- 定义一个常量 (定义时必须赋值)，唯一且不可以改变  
  const 声明创建一个值的只读引用。但这并不意味着它所持有的值是不可变的，只是变量标识符不能重新分配。

  ```javascript
  const obj = { a: 1, b: 2 }
  console.log(obj.a) //1
  obj.a = 3
  console.log(obj.a) //3
  ```

```ad-tip
const声明暗示变量值是单一类型不可修改，JS运行时编译器会将其所有实例替换为实际的值，不会通过查询表进行变量查找。  
```

### 使用 let 解决闭包问题

```javascript
let arr = []
for (var i = 0; i < 10; i++) {
  let temp = function () {
    console.log(i)
  }
  arr.push(temp)
}
arr[0]() //输出10
arr[1]() //输出10
```

将 `for` 循环内的 `i` 的 `var` 声明换成 `let` 声明（`let` 有局部作用域）  

```javascript
let arr = []
for (let i = 0; i < 10; i++) {
  let temp = function () {
    console.log(i)
  }
  arr.push(temp)
}
arr[0]() //输出0
arr[1]() //输出1
```

## 解构（Destructuring）

ES6 允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构（Destructuring），解构的本质属于“模式匹配”，只要等号两边的模式相同，左边的变量就会被赋予对应的值。如果解构不成功，变量的值就等于 undefined。

### 数组解构

从数组中提取值，按照对应位置，对变量赋值。

```javascript
let [foo, [[bar], baz]] = [1, [[2], 3]]
console.log(foo, bar, baz) // 1 2 3

let [, , third] = ['foo', 'bar', 'baz']
console.log(third) // baz

let [a, , b] = [1, 2, 3]
console.log(a, b) // 1 3

let [x, y, ...z] = ['a']
console.log(x, y, z) // a undefined []
```

**不完全解构**  
不完全解构，即等号左边的模式，只匹配一部分的等号右边的数组。这种情况下，解构依然可以成功。

```javascript
let [a] = 'hello'
console.log(a) //h
```

如果等号的右边不是数组（或者严格地说，不是可遍历的结构），那么将会报错。

```javascript
// 报错
let [foo] = undefined
let [foo] = 1
let [foo] = false
```

等号右边的值，要么转为对象以后不具备 Iterator 接口（前五个表达式），要么本身就不具备 Iterator 接口（最后一个表达式）。

> 原生具备 Iterator 接口的数据结构：Array、Map、Set、String、TypedArray、arguments、NodeList 等

**集合解构**  
使用 `...` 扩展运算符接受剩余的数据。

```javascript
let [head, ...tail] = [1, 2, 3, 4]
console.log(head, tail) // 1 [ 2, 3, 4 ]

let old = [1, 2, 3, 4]
let [...arr] = old // 深拷贝
console.log(arr) // 新数组
console.log(arr === old) // false
```

**默认值**  
当一个数组成员严格等于 `undefined`，默认值才会生效。默认值可为函数。

```javascript
let [x, y = 'b'] = ['a']
console.log(x, y) // a b
```

### 对象解构

等号左边的变量放到大括号内部，匹配右侧数组中的元素。对象的属性没有次序，变量必须与属性同名，才能取到正确的值。

```javascript
let { foo, bar } = { foo: 'aaa', bar: 'bbb' }
```

#### 重命名解构

如果变量名与属性名不一致，必须进行重命名。

```javascript
let { foo: baz } = { foo: 'aaa', bar: 'bbb' } //baz = 'aaa'
```

#### 嵌套解构

```javascript
let obj = { p: ['Hello', { y: 'World' }] }
let {
  p: [x, { y }],
} = obj //x = 'Hello'

let node = {
    personalInfo: {
        basicInfo: {
            name: 'mike',
            age: 25
        }
    },
    level: 3
};
let { personalInfo: { basicInfo } } = node;
console.log(basicInfo.name);// mike
// 解构的值为 basicInfo ，personalInfo 只是指明目标所在的位置。
```

```ad-tip
嵌套解构时，要注意深层内容不存在时，会抛出错误，解构终止，只执行一部分。
```

#### 默认值

默认值生效的条件是，对象的属性值严格等于 undefined

```javascript
let { x: y = 3 } = { x: 1 }
// y = 1
let { x: y = 3 } = {}
// y = 3
```

#### 运算符…

...用到左侧是聚合，...用到右侧就是展开

```javascript
let obj = { name: 'zhangsan', age: 12 }
let { ...person } = obj
person.gender = '1'
console.log(person) //{ name: 'zhangsan', age: 12, gender: '1' }
console.log(person === obj) //false

let stu = {
  ...obj,
  gender: '1',
}
console.log(stu) //{ name: 'zhangsan', age: 12, gender: '1' }

let { gender = '2', ...zs } = stu
console.log(gender, zs) //1 { name: 'zhangsan', age: 12 }
```

### 字符串解构

等号左边的变量如果放在中括号内进行的类似于数组解构，从字符串中获取指定字符；如果放在大括号内进行的类似于对象解构，从实例属性获方法中解构。

```javascript
const [a, b, c, d, e] = 'hello'
// a = h;b = e;c = l;d = l;e = o
let { length: len } = 'hello'
console.log(len) // len = 5
//将string字符串转成数组
let [...arr] = 'hello'
console.log(arr)
```

### 数值解构

等号左边的变量放在大括号中进行解构，可以获取到数值包装器构造函数原型中指定的方法。

```javascript
let { valueOf: abd } = 12
// valueOf = Number.prototype.valueOf
console.log(abd) //[Function: valueOf]
```

### 布尔类型解构

等号左边的变量放在大括号中进行解构，可以获取到布尔包装器构造函数原型中指定的方法。

```javascript
let { valueOf } = true
// valueOf = Boolean.prototype.valueOf
```

### 解构的好处

1. **变量交换值**

```JavaScript
let a = 1,
  b = 2;
[a, b] = [b, a];
console.log(a,b)//2,1
```

2. **让函数返回多个值**

```JavaScript
function func1() {
  return [1, 2, 3];
}
let [a, b, c] = func1();
console.log(a, b, c); //1,2,3

function func2() {
  return {
    a: 1,
    b: 2
  };
}
let { a, b } = func2();
console.log(a, b); //1,2
```

3. **让函数参数有所对应**

```JavaScript
function add(a,b){
    console.log(a,b)
};
add(1,2)//1,2
//不按照顺序
function add2({b,a}){
    console.log(a,b)
};
add2({a:1,b:2})//1,2
```

4. **提取 JSON 数据**

```JavaScript
let jsonData = {
  'name': "echo",
  'age': 26,
  'address': "深圳"
};
let { name, age, address } = jsonData;
console.log(name, age, address);
```

5. **为函数形参添加默认值**

```JavaScript
function add({ a = 1, b = 2 } = {}) {
  console.log(a + b);
}
add(); //3
add({ a: 4, b: 5 }); //9
```

6. **遍历 Map 解构**

```JavaScript
const map = new Map();
map.set(1, 2);
map.set("a", "b");
console.log(map);
for (let [key, value] of map) {
  console.log(key + "is" + value); //1is2  aisb
}
```

7. **模块引入方法**

```JavaScript
const { SourceMapConsumer, SourceNode } = require("source-map");
```

## 常用扩展

### 对象扩展

#### 对象增强语法

```javascript
const name = 'terry';
const ageValue = 'age';
const sayNameValue = 'sayName';

let foo = {
	// 属性简写
  name, 
  // 方法简写
  sayName() {
    console.log('my name is', this.name)
  },
  // 可计算属性
  [ageValue]: 18,
  [sayNameValue]() {}
}
```

#### 对象 API 拓展

##### Object.is(value1, value2)

判断两个值是否为同一个值。  
与\=\=不同于：\=\=会对两个不同类型的变量进行强制转换，会导致 `"" == false` 为 true；  
也会将数字 -0 和 +0 视为相等，Number.NaN 与 NaN 视为不相等（\=\=、\=\=\=）。

```javascript
console.log(-0 == +0) // true
console.log(-0 === +0) // true
console.log(Number.NaN == NaN) // false
console.log(Number.NaN === NaN) // false
console.log(Object.is(Number.NaN, NaN)) // true
console.log(Object.is(-0, +0)) // false
console.log('' == false) // true
```

##### Object.assign(target, ...sources)

用于将所有可枚举属性的值从一个或多个源对象分配到目标对象。  
存在相同的属性，后面覆盖前面。  
只会拷贝源对象自身的并且可枚举的属性到目标对象。

##### Object.getPrototypeOf(obj)

返回指定对象的原型（内部 Prototype 属性的值），如果没有继承属性，则返回 null 。

##### Object.setPrototypeOf(obj, prototype)

obj：要设置其原型的对象  
prototype：该对象的新原型 (一个对象 或 null)  
设置一个指定的对象的原型 ( 内部 Prototype 属性）到另一个对象或 null。

##### Object.keys(obj)

获取所有可枚举属性名，返回一个表示给定对象的所有可枚举属性的字符串数组。  
数组中属性名的排列顺序和正常循环遍历该对象时返回的顺序一致。  
如果获取一个对象的所有属性包括不可枚举的，使用 Object.getOwnPropertyNames()。

```javascript
let anObj = { 100: 'a', 2: 'b', 7: 'c' }
console.log(Object.keys(anObj)) // ['2', '7', '100']

let myObj = Object.create(
  {},
  {
    getFoo: {
      value: function () {
        return this.foo
      },
    },
  }
)
console.log(Object.keys(myObj)) // []
myObj.foo = 1
console.log(Object.keys(myObj)) // [ 'foo' ]
```

##### Object.values(obj)

获取所有的可枚举属性值，返回一个给定对象自身的所有可枚举属性值的数组。  
值的顺序与使用 for...in 循环的顺序相同 ( 区别在于 for-in 循环枚举原型链中的属性 )。

```javascript
let my_obj = Object.create(
  {},
  {
    getFoo: {
      value: function () {
        return this.foo
      },
    },
  }
)
my_obj.foo = 'bar'
console.log(Object.values(my_obj)) // ['bar']
```

##### Object.entries(obj)

获取所有的可枚举属性名和属性值键值对，返回一个给定对象自身可枚举属性的键值对数组。  
其排列与使用 for...in 循环遍历该对象时返回的顺序一致（区别在于 for-in 循环还会枚举原型链中的属性）。

```javascript
const myObj = Object.create(
  {},
  {
    getFoo: {
      value() {
        return this.foo
      },
    },
  }
)
myObj.foo = 'bar'
console.log(Object.entries(myObj)) // [ ['foo', 'bar'] ]
```

### 函数扩展

#### 函数参数

##### 设置默认值

函数的参数设置默认值，即直接写在参数定义的后面。通常情况下，定义了默认值的参数，应该是函数的尾参数。  
函数的 length 属性，将返回没有指定默认值的参数个数。

```javascript
function fun(x, y = 'World') {
  console.log(x, y) // 1 World
}
fun(1)
```

##### 参数解构

参数默认值与解构赋值的默认值结合使用。

```javascript
function foo({ x, y = 5 }) {
  console.log(x, y)
  // 打印出：1,5
}
foo({ x: 1 })
```

##### rest 参数

用于获取函数的多余参数得到一个数组

```javascript
function add(...values) {
  console.log(values) // [2,5,3]
}
add(2, 5, 3)
```

#### 箭头函数

- 没有 `this（this指向所处上下文对象this指向）`、`super`、`arguments`
- 不能通过 `new` 关键字调用
- 没有原型 `prototype`
- 不可以改变 `this` 指向
- 不支持重复的命名参数

```javascript
let obj = {
  name: 'terry',
  say1: function () {
    console.log(this.name)
  },
  say2() {
    console.log(this.name)
  },
  say3: () => {
    console.log(this) //global
  },
  say4() {
    return () => {
      console.log(this) //obj
    }
  },
}

obj.say1()
obj.say2()
obj.say3()
obj.say4()()
```

### 数组扩展

#### 拓展运算符 (...)

将一个数组转为用逗号分隔的参数序列

```javascript
let arr1 = [1, 2, 3]
let arr2 = [4, 5, 6]

// 数组合并
let arr = [...arr1, ...arr2]
console.log(arr)
// 打印出：[1,2,3,4,5,6]

// 字符串转换为数组
let temp = [...'hello']
console.log(temp)
// 打印出：['h','e','l','l','o']
```

#### 数组 API 拓展

##### Array.from()

从一个类似数组（拥有 length 属性）或可迭代对象（可获得对象中的元素）创建一个新的，浅拷贝的数组实例。

> Array.from(被转换的对象，新数组每个元素都执行的回调函数，执行回调函数时的 this 对象)

```javascript
function f() {
  return Array.from(arguments)
}
console.log(f(1, 2, 3)) // [ 1, 2, 3 ]
```

##### Array.of()

创建一个具有可变数量参数的新数组实例，而不考虑参数的数量或类型。  
与 Array() 不同于：Array(7) 创建 7 个空位的数组，Array.of(7) 创建包含单个元素 7 的数组。

```javascript
Array.of(7) // [7]
Array.of(1, 2, 3) // [1, 2, 3]
Array.of(undefined) // [undefined]

Array(7) // [ , , , , , , ]
Array(1, 2, 3) // [1, 2, 3]
```

##### Array.prototype.find()

获取元素，返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。

> arr.find(执行的函数 (当前遍历元素，当前遍历到的索引，数组本身)，执行回调时 this 对象)

##### Array.prototype.findIndex()

返回数组中满足提供的测试函数的第一个元素的索引。若没有找到对应元素则返回 -1。

> arr.findIndex(执行的函数 (当前遍历元素，当前遍历到的索引，数组本身)，执行回调时 this 对象)

```javascript
//查找等于2的元素
let arr = [10, 8, 3, 2, 4, 2, 5]
//find方法返回第一个满足条件的元素或者undefined
let resultNum = arr.find((item, index) => {
  return item === 2
})
console.log(resultNum) //2
// findIndex返回第一个满足条件的元素的索引或者-1
let resultIdx = arr.findIndex((item, index) => {
  return item === 2
})
console.log(resultIdx) //3
```

##### Array.prototype.includes()

找到一个元素是否存在于数组中  
使用 includes() 比较字符串和字符时是区分大小写。

> includes(要找的元素，开始查找的位置)  
> 查找位置为负，为到着查

```javascript
;[1, 2, 3].includes(3, -1) // true
```

##### Array.prototype.fill()

用一个固定值填充一个数组中从起始索引到终止索引内的全部元素。不包括终止索引。返回修改后的数组。

> fill(插入值，开始索引，结束索引)

```javascript
;[1, 2, 3].fill(4, -3, -2) // [4, 2, 3]
```

##### Array.prototype.keys()

返回一个新的 Array Iterator 对象，该对象包含数组中每个索引的键。

```javascript
var fruits = ['Banana', 'Orange', 'Apple', 'Mango']
fruits.keys()
```

##### Array.prototype.values()

返回一个新的 Array Iterator 对象，该对象包含数组每个索引的值。

##### Array.prototype.entries()

返回一个新的 Array Iterator 对象，该对象包含数组每个索引的键/值对。

## Symbol 类型

数据类型 `Symbol`，表示 **独一无二** 的值，是一种类似于字符串的数据类型，它是 JavaScript 语言的第七种数据类型，前六种是：`undefined`、`null`、布尔值（Boolean）、字符串（String）、数值（Number）、对象（Object）。  
**symbol 的特点：**

1. 提供独一无二的值
2. Symbol 值作为对象属性名时，不能用点运算符，要用中括号表示法
3. Symbol 值作为对象属性名时，该属性不会出现在 `for...in`、`for...of` 循环中

`Symbol函数` 可以接受参数，表示对于这个唯一值的描述。即使参数一致，symbol 值也不一样。

```javascript
// 没有描述符的symbol值
let s = Symbol()
// 有描述符的symbol值
let s1 = Symbol('hello')
console.log(s, s1) //Symbol() Symbol(hello)
console.log(typeof s) //symbol

// 独一无二的值
// 没有参数的情况
let s1 = Symbol()
let s2 = Symbol()

s1 === s2 // false

// 有参数的情况
let s1 = Symbol('foo')
let s2 = Symbol('foo')

s1 === s2 // false
```

### Symbol.prototype.description

获取 Symbol 的描述。如果没有描述则返回 undefined。

### Symbol 的应用

**给对象内追加属性**  
由于每一个 Symbol 值都是不相等的，这意味着 Symbol 值可以作为标识符，用于对象的属性名，就能保证不会出现同名的属性。这对于一个对象由多个模块构成的情况非常有用，能防止某一个键被不小心改写或覆盖。

```javascript
let obj = {
  // ...此处省略n多个属性
  name: 'ronda',
}
// 因为symbol是独一无二的，那么属性名就可以用symbol来表示。
let tempName = Symbol('name')
obj[tempName] = '张三' // '张三'保存到了obj对象中
console.log(obj[tempName]) //张三
```

**消除魔术字符串**

> 魔术字符串指的是，在代码之中多次出现、与代码形成强耦合的某一个具体的字符串或者数值。

```javascript
function getArea(shape, options) {
  let area = 0

  switch (shape) {
    case 'Triangle': // 魔术字符串
      area = 0.5 * options.width * options.height
      break
    /* ... more code ... */
  }

  return area
}

getArea('Triangle', { width: 100, height: 100 }) // 魔术字符串
```

字符串 `Triangle` 是一个魔术字符串。与代码形成“强耦合”，不利于将来的修改和维护。  
解决方案：把它设置为一个变量。

```javascript
const shapeType = {
  triangle: Symbol(), // 'Triangle'
}

function getArea(shape, options) {
  let area = 0
  switch (shape) {
    case shapeType.triangle:
      area = 0.5 * options.width * options.height
      break
  }
  return area
}

getArea(shapeType.triangle, { width: 100, height: 100 })
```

把 `Triangle` 写成 `shapeType` 对象的 `triangle` 属性

### symbol 属性名的遍历

Symbol 作为属性名，遍历对象的时候，该属性不会出现在 `for...in`、`for...of` 循环中，也不会被 `Object.keys()`、`Object.getOwnPropertyNames()`、`JSON.stringify()` 返回。

`Object.getOwnPropertySymbols()` 方法，可以获取指定对象的所有 Symbol 属性名。该方法返回一个数组，成员是当前对象的所有用作属性名的 Symbol 值。

```javascript
const obj = {}
let a = Symbol('a')
let b = Symbol('b')

obj[a] = 'Hello'
obj[b] = 'World'

const objectSymbols = Object.getOwnPropertySymbols(obj)

objectSymbols
// [Symbol(a), Symbol(b)]
```

`Reflect.ownKeys()` 方法可以返回所有类型的键名，包括常规键名和 Symbol 键名。

```javascript
let obj = {
  [Symbol('my_key')]: 1,
  enum: 2,
  nonEnum: 3,
}

Reflect.ownKeys(obj)
//  ["enum", "nonEnum", Symbol(my_key)]
```

### Symbol.for()&&Symbol.keyFor()

全局 symbol 注册表中的一个记录结构：

| 字段名      | 字段值                          |
| ----------- | ------------------------------- |
| \[[key]]    | 一个字符串，用来标识每个 symbol |
| \[[symbol]] | 存储的 symbol 值                |

#### Symbol.for(key)

根据给定的键 key，来从运行时的 symbol 注册表中找到对应的 symbol。  
如果找到了，则返回它，否则，新建一个与该键关联的 symbol，并放入全局 symbol 注册表中。

```javascript
Symbol.for('foo') // 创建一个 symbol 并放入 symbol 注册表中，键为 "foo"
Symbol.for('foo') // 从 symbol 注册表中读取键为"foo"的 symbol
Symbol.for('bar') === Symbol.for('bar') // true，证明了上面说的
Symbol('bar') === Symbol('bar') // false，Symbol() 函数每次都会返回新的一个 symbol

let sym = Symbol.for('mario')
sym.toString()
// "Symbol(mario)"，mario 既是该 symbol 在 symbol 注册表中的键名，又是该 symbol 自身的描述字符串，为了防止冲突，最好给你要放入 symbol 注册表中的 symbol 带上键前缀。
Symbol.for('mdn.foo')
Symbol.for('mdn.bar')
```

#### Symbol.keyFor(sym)

用来获取全局 symbol 注册表中与某个 symbol 关联的键。  
如果全局注册表中查找到该 symbol，则返回该 symbol 的 key 值，返回值为字符串类型。否则返回 undefined

```javascript
// 创建一个全局 Symbol
let globalSym = Symbol.for('foo')
Symbol.keyFor(globalSym) // "foo"

let localSym = Symbol()
Symbol.keyFor(localSym) // undefined

// 以下Symbol不是保存在全局Symbol注册表中
Symbol.keyFor(Symbol.iterator) // undefined
```

## 集合

### Set 集合

#### 初始化

Set 类似于数组，但是成员的值都是唯一的  
Set 构造函数可以接受一个数组（或者具有 iterable 接口的其他数据结构）作为参数

```javascript
let arr = [...new Set([1, 2, 4, 4])]
console.log(arr)
// 打印出 Array(3) [ 1, 2, 4 ]
```

#### Set API

**Set.prototype.size**：返回 Set 实例的元素总数  
**Set.prototype.add(value)**：添加某个值，返回 Set 结构本身，不能添加重复的值  
**Set.prototype.delete(value)**：删除某个值，返回一个布尔值，表示删除是否成功  
**Set.prototype.has(value)**：返回一个布尔值，表示该值是否为 Set 的元素。  
**Set.prototype.clear()**：清除所有元素，没有返回值。  
**Set.prototype.values()**：按照元素插入顺序返回一个具有 Set 对象每个元素值的全新 Iterator 对象。  
**Set.prototype.keys()**：同 values()  
**Set.prototype.entries()**：返回一个新的键值对的迭代器对象（[value, value] 每一个 entry 的 key 和 value 都拥有相同的值）  
**Set.prototype.forEach((currentValue,currentKey[,set])=>{},this)**  
根据集合中元素的插入顺序，依次执行提供的回调函数。但是由于集合对象中没有索引 (keys)，所以前两个参数都是 Set 中元素的值 (values)

```javascript
let set = new Set() // 创建set集合对象
set.add('hello') // 添加元素
set.add('world') // 添加元素

set.forEach((value, key, set) => {
  console.log(value, key, set)
})
/* 
hello hello Set(2) { 'hello', 'world' }
world world Set(2) { 'hello', 'world' }
*/

console.log(set) // Set(2) { 'hello', 'world' }
console.log('Set实例的元素总数：', set.size) //Set实例的元素总数： 2
console.log(set.keys()) // [Set Iterator] { 'hello', 'world' }
console.log(set.values()) // [Set Iterator] { 'hello', 'world' }
console.log(set.entries()) // [Set Entries] { [ 'hello', 'hello' ], [ 'world', 'world' ] }
set.delete('hello') // 删除元素
console.log(set) // Set(1) { 'world' }
console.log(set.has('world')) // true
set.clear()
console.log(set) // Set(0) {}
```

### Map 集合

#### 初始化

Map 对象保存键值对，并且能够记住键的原始插入顺序。任何值 (对象或者原始值) 都可以作为一个键或一个值。  
**Objects 和 maps 的比较**  
**同：** 都允许按键存取一个值、删除键、检测一个键是否绑定了值。  
**异：**

- `Map` 默认情况不包含任何键。只包含显式插入的键。
- 键可以是 **任意值**
- key 是有序的
- 键值对个数可以通过 size 属性获取
- 可以直接被迭代

#### Map API（与 set 类似）

**Map.prototype.size**：返回 Map 对象的键/值对的数量。  
**Map.prototype.set(key, value)**：set 方法设置键名 key 对应的键值为 value，然后返回整个 map 结构。如果 key 已经有值，则键值会被更新，否则就新生成该键。  
**Map.prototype.get(key)**：get 方法读取 key 对应的键值，如果找不到 key，返回 undefined。  
**Map.prototype.has(key)**：has 方法返回一个布尔值，表示某个键是否在当前 Map 对象之中。  
**Map.prototype.delete(key)**：delete 方法删除某个键，返回 true。如果删除失败，返回 false。  
**Map.prototype.clear()**：清除所有成员，没有返回值  
**Map.prototype.keys()**：返回键名的遍历器  
**Map.prototype.values()**：返回键值的遍历器  
**Map.prototype.entries()**：返回键值对的遍历器  
**Map.prototype.forEach()**：使用回调函数遍历每个成员

```javascript
//创建一个map集合
let myMap = new Map()

let keyObj = {}
let keyFunc = function () {}
let keyString = 'a string'

// 添加键
myMap.set(keyString, "和键'a string'关联的值")
myMap.set(keyObj, '和键keyObj关联的值')
myMap.set(keyFunc, '和键keyFunc关联的值')

myMap.size // 3

// 读取值，通过key获取value值
myMap.get(keyString) // "和键'a string'关联的值"
myMap.get(keyObj) // "和键keyObj关联的值"
myMap.get(keyFunc) // "和键keyFunc关联的值"
// 因为keyString === 'a string'
myMap.get('a string') // "和键'a string'关联的值"

myMap.get({}) // undefined, 因为keyObj !== {}
myMap.get(function () {}) // undefined, 因为keyFunc !== function () {}
```

**序列化和反序列化**

```js
const myMap = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3],
  ['d', 4],
  ['e', 5]
]);
console.log(myMap);
const stringifyMap = JSON.stringify(myMap, (key, value) => {
  if (value instanceof Map) {
    return Object.fromEntries(value);
  }
  return value;
});
console.log(stringifyMap);
const parseMap = JSON.parse(stringifyMap, (key, value) => {
  if (value && typeof value === 'object') {
    return new Map(Object.entries(value));
  }
  return value;
});
console.log(parseMap);
```

#### [Map与Object比较](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map#object_和_map_的比较)

## Class 类

与函数声明不同：  
1. 不能提升；  
2. 类受块作用域限制；函数受函数作用域限制。

### 类各方法示例

原型成员：定义在原型上，通过实例对象调用，实例共享。  
静态成员：定义在类本身上，通过类构造函数调用。  
实例成员：定义在实例上，通过实例对象调用，实例独有。

类方法（原型成员和静态成员）可用字符串、符号、计算的值作为键。

```js
class Handler {
  // 实例成员
  constructor() {
    this.info = null;
    this.onfocus = function () {
      console.log('onfocus');
    }
  }
  // 实例成员
  onClick = function (value) {
    this.info = value;
    console.log('onClick');
  }
  // 原型成员
  onClickBad(value) {
    this.info = value;
    console.log('onClickBad');
  }
  // 实例成员
  onClickGood = (value) => {
    this.info = value;
    console.log('onClickGood');
  }

  // 静态成员
  static onBound() {
    console.log('onBound');
  }
  // 静态成员
  static onBound2 = function () {
    console.log('onBound2');
  }
}
// 静态成员
Handler.onchange = function () {
  console.log('onchange');
}
```

![](ES6.assets/image-20221128142112348.png)

### 构造函数

`constructor` 方法是类的默认方法，通过 new 命令生成对象实例时，自动调用该方法。一个类必须有 constructor 方法，如果没有显式定义，一个空的 constructor 方法会被默认添加。

### 实例属性和方法

定义在类体中的属性称为实例属性，定义在类体中的方法称为实例方法。

```javascript
class Person {
  // 实例属性
  temp = 'hello'
  constructor(name, age) {
    // 实例属性  常用
    this.name = name
    this.age = age
    // 实例方法  不常用
    this.sayName = function () {
      console.log('i am ', this.name)
    }
  }
}
let p1 = new Person('zhansan', 22)
let p2 = new Person('lisi', 23)
console.log(p1.sayName === p2.sayName) // false 因为是实例方法，所有每个实例内都会有自己的方法
console.log(p1.name) // zhansan
console.log(p1.temp) // hello
p1.sayName() // i am zhansan
```

### 原型属性和方法

在构造函数的原型对象上存在的属性和方法。

```javascript
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
  // 原型方法 常用
  sayName() {
    console.log('i am ', this.name)
  }
}
// 原型属性 不常用
Person.prototype.temp = 'hello'
let p1 = new Person('zhangsan', 22)
let p2 = new Person('lisi', 23)
p1.sayName() // i am  zhangsan
console.log(p1.sayName === p2.sayName) // true
console.log(p1.temp) // hello
console.log(p2.temp) // hello
```

### 静态属性和方法

通过 `static` 关键字来定义静态属性和静态方法。  
可以通过类直接访问。在静态方法中，`this` 指向当前类。

```javascript
class Person {
  // 静态属性
  static num = 200
  // 静态方法
  static number() {
    console.log(this) // [class Person] { num: 200 }
    return this.num
  }
}
console.log(Person) // [class Person] { num: 200 }
console.log(Person.number()) //200
console.log(Person.num) //200
```

### 继承

`class` 可以通过 `extends` 关键字实现继承。  
子类必须在 `constructor` 方法中调用 `super` 方法，否则新建实例时会报错。  
子类自己的 `this` 对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。

```javascript
class Animal {
  constructor(name) {
    this.name = name
  }
  sayName() {
    console.log('my name is ', this.name)
  }
}
class Dog extends Animal {
  constructor(name, age) {
    super(name)
    this.age = age
  }
}
let dog = new Dog('乐乐', '1')
dog.sayName() // my name is  乐乐
```

extends 支持在类表达式中使用：`let Bar = class extends Foo {}`。  
class 作为构造函数的语法糖，同时有 prototype 属性和 **proto** 属性，因此同时存在两条继承链  
1.子类的 **proto** 属性，表示构造函数的继承，总是指向父类。  
2.子类 prototype 属性的 **proto** 属性，表示方法的继承，总是指向父类的 prototype 属性。  
![](ES6.assets/image-20220925210713013.png)

### super 关键字

1. 派生类在构造函数中使用 this 之前必须调用 `super()`；
2. super 关键字只能出现在派生类构造函数和静态方法中；
3. super 不能单独引用，要么调用父类构造函数，要么引用静态方法；
4. 没有定义类构造函数，实例化派生类时，会调用 `super()` 并将所有传入派生类的参数传入
5. 派生类显示声明构造函数时，要么调用 `super()`，要么返回一个对象。

**在构造函数中**

```javascript
class A {
  constructor() {
    this.q = 2
  }
  p() {
    return 2
  }
}

class B extends A {
  constructor() {
    // 没有static修饰，是一个普通方法
    // super() 代表调用父类构造函数
    super()
    // super是对象，在普通方法内使用，super对象是父类的原型对象，无法通过`super`调用定义在父类实例上的方法或属性
    console.log(super.p()) // 2
    console.log(super.q) // undefined
  }
}

let b = new B()
```

**在静态方法中**

```javascript
class A {
  // 静态属性
  static num = 200
  constructor() {
    this.num = 20
  }
  // 静态方法
  static number() {
    return this.num
  }
}
class B extends A {
  static getNumber() {
    // super是A类本身
    return super.number()
  }
}
console.log(B.getNumber()) //200
```

### 抽象基类

```js
class Vehicle {
	constructor() {
		// 抽象类不能创建实例
		if (new.target === Vehicle) {
			throw new Error('Vehicle cannot be directly instantiated');
		}
	}
	
	// 要求继承时必须要实现的方法
	if (!this.foo) { 
		throw new Error('Inheriting class must define foo()'); 
	} 
}
```

### 继承内置类型

内置类型的方法有时会返回新的实例，默认情况返回的实例与原始实例类型一致。  
可以通过覆盖 Symbol.species 访问器进行修改。

```js
class SuperArray extends Array {} 

let a1 = new SuperArray(1, 2, 3, 4, 5); 
let a2 = a1.filter(x => !!(x%2)) 
console.log(a1); // [1, 2, 3, 4, 5] 
console.log(a2); // [1, 3, 5] 
console.log(a1 instanceof SuperArray); // true 
console.log(a2 instanceof SuperArray); // true

class SuperArray extends Array { 
	static get [Symbol.species]() { 
		return Array; 
	} 
} 

let a1 = new SuperArray(1, 2, 3, 4, 5); 
let a2 = a1.filter(x => !!(x%2)) 
console.log(a1); // [1, 2, 3, 4, 5] 
console.log(a2); // [1, 3, 5] 
console.log(a1 instanceof SuperArray); // true 
console.log(a2 instanceof SuperArray); // false 
```

### 类混入 (不常用，多用组合)

extends 后支持表达式（可解析为一个类或一个构造函数），实现继承多个类。

```js
class Vehicle {} 
let FooMixin = (Superclass) => class extends Superclass { 
 foo() { 
 console.log('foo'); 
 } 
}; 
let BarMixin = (Superclass) => class extends Superclass { 
 bar() { 
 console.log('bar'); 
 } 
}; 
let BazMixin = (Superclass) => class extends Superclass { 
 baz() { 
 console.log('baz'); 
 } 
}; 
function mix(BaseClass, ...Mixins) { 
 return Mixins.reduce((accumulator, current) => current(accumulator), BaseClass); 
} 
class Bus extends mix(Vehicle, FooMixin, BarMixin, BazMixin) {} 
```

### 实现原理（基于 Function）

1. 使用严格模式 ` use strict`
2. 必须使用 `new` 关键字调用（`new.target`)
3. 类的实例属性无法被遍历

```js
Object.defineProperty(Example.prototype, 'func', {  
	value: function() {  
		// ...  
	},  
	enumerable: false  
})

```
## 迭代器

迭代器/遍历器（Iterator）就是这样一种机制。它是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 `Iterator` 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）。

遍历器对象本质上，就是一个指针对象。  
**Iterator 的作用：**

1. 为各种数据结构，提供一个统一的、简便的访问接口；
2. 使得数据结构的成员能够按某种次序排列；
3. ES6 创造了一种新的遍历命令 `for...of` 循环，`Iterator` 接口主要供 `for...of` 消费。

**原生具备 Iterator 接口的数据结构：**  
Array、Map、Set、String、TypedArray、arguments、NodeList 等

### 迭代器协议

定义了产生一系列值的标准方式。一个对象必须实现 next() 方法，才能成为迭代器。  
`next()`  方法必须返回一个对象，该对象应当有两个属性： `done` 和 `value`  
`done`（boolean）如果迭代器可以产生序列中的下一个值，则为 `false`  
`value`  迭代器返回的任何 JavaScript 值

```javascript
let arr = ['a', 'b', 'c']
// 获取迭代器对象
let iterator = arr[Symbol.iterator]()
console.log(iterator + '') // "[object String Iterator]"
console.log(iterator.next()) // { value: "a", done: false }
console.log(iterator.next()) // { value: "b", done: false }
console.log(iterator.next()) // { value: "c", done: false }
console.log(iterator.next()) // { value: undefined, done: true }
```

### 遍历

1. 使用迭代器的 `next` 方法遍历 someString 的迭代器对象

```javascript
let someString = 'hi'
// 获取遍历器对象
let iterator = someString[Symbol.iterator]()
let result
// 使用next遍历迭代器对象
while (!(result = iterator.next()).done) {
  console.log(result)
}
```

2. 因为 someString 是字符串，本身部署了 `Iterator` 接口，可以使用 `for-of` 遍历 someString

```javascript
let someString = 'hi'
for (let key of someString) {
  console.log(key)
}
```

## 异步编程

### Promise 承诺

Promise 是异步编程的一种解决方案，比传统的解决方案（回调函数和事件）更合理和更强大。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。

#### 实例化

`Promise` 构造函数接受一个函数作为参数，该函数的两个参数分别是 `resolve` 和 `reject`。它们是两个函数，由 JavaScript 引擎提供。  
Promise 对象代表一个异步操作有三种状态： **pending（进行中）**、**fulfilled（已成功）**和 **rejected（已失败）**。状态发生改变之后就凝固了，不会再变了，会一直保持这个结果，这时就称为 **resolved（已定型）**。

```javascript
const promise = new Promise(function(resolve, reject) { 
  // ... some code
  if (/* 异步操作成功 */){ 
		resolve(value);  
		// pending -> fulfilled
  } else { 
		reject(error);  
		// pending -> rejected
  } 
});
```

#### 原型方法

定义在 `Promise.prototype` 中的方法，通过 Promise 实例可以直接调用。

##### Promise.prototype.then()

两个函数作为参数（成功执行函数，失败执行函数）  
返回一个新的 Promise 实例对象，因此可以使用链式调用。

```JavaScript
// 如果promise的状态不改变，then里的方法不会执行
new Promise((resolve, reject) => {
	resolve('成功1');
	//reject('失败1');
}).then((value) => {	
	// 当promise实例为fulfilled状态时，执行函数
	console.log('成功2')
	// 在then方法中，通过return将返回的promise实例改为fulfilled状态
	return 123	
	// 代码出现错误时，将返回的promise实例改为rejected状态
	// console.log(a);	
}, (reason) => {	
	// 当promise实例为rejected状态时，执行函数
	console.log('失败2');
}).then((value) => {
	console.log('成功3');
}, (reason) => {
	console.log('失败3');
})
```

不传 `onResolved()` 的规范写法：`p2.then(null, () => onRejected('p2'));`。  
抛出错误，会返回一个拒绝的 Promise；返回错误，会返回一个解决的 Promise。

```js
let p10 = p1.then(() => { throw 'baz'; }); 
// Uncaught (in promise) baz 
setTimeout(console.log, 0, p10); // Promise <rejected> baz 

let p11 = p1.then(() => Error('qux')); 
setTimeout(console.log, 0, p11); // Promise <resolved>: Error: qux
```

`onRejected()` 会返回一个包装了错误的解决 Promise。

##### Promise.prototype.catch()

当状态由 pending 变为 rejected 的时候执行该回调函数。  
返回一个新的 Promise 实例对象，因此可以使用链式调用。

```JavaScript
promise
	.then(function(data) { 
	    // success
	})
	.catch(function(err) {
		// error
	})
```

rejected 状态时一般使用 catch 方法，不在 then 方法中定义 rejected 状态的回调函数（catch 还可以捕获在 then 方法执行中存在的错误）

##### Promise.prototype.finally()

在 promise 结束时，无论结果是 fulfilled 或者是 rejected，都会执行指定的回调函数返回一个 Promise。  
表现为对父 Promise 的传递；如果返回一个待定 Promise 或 onFinally() 抛出错误（显示抛出或返回一个拒绝 Promise），则返回待定 Promise/拒绝 Promise。

```JavaScript
promise
	.then( (data) => { 
	    // success
	})
	.catch( (err) => {
		// error
	})
	.finally( () => {
		console.log('最终都会执行')
	})
```

#### 静态方法

定义在 Promise 中的方法，通过 Promise 可以直接调用。

##### Promise.all([p1,p2])

用于将多个 Promise 实例，包装成一个新的 Promise 实例  
当 p1,p2 状态都为 `fulfilled` 时候，该实例的状态才为 `fulfilled`，此时 p1，p2 的返回值组成一个数组，传递给该实例的回调函数；只要 p1，p2 的返回值有一个变为 `rejected`，该实例状态为 `rejected`。

```JavaScript
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => {
	setTimeout(resolve, 100, 'foo');
});

Promise.all([promise1, promise2, promise3]).then((values) => {
	console.log(values);// Array [3, 42, "foo"]
});
```

##### Promise.race([p1,p2])

用于将多个 Promise 实例，包装成一个新的 Promise 实例  
当 p1，p2 之中有一个实例率先改变状态，该实例的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给该实例的回调函数。

```JavaScript
const promise1 = new Promise((resolve, reject) => {
	setTimeout(resolve, 500, 'one');
});

const promise2 = new Promise((resolve, reject) => {
	setTimeout(resolve, 100, 'two');
});

Promise.race([promise1, promise2]).then((value) => {
	console.log(value);// two
});
```

##### Promise.any([p1,p2])

用于将多个 Promise 实例，包装成一个新的 Promise 实例  
只要 p1,p2 状态有一个变为 `fulfilled`，该实例的状态为 `fulfilled`；p1，p2 状态都变为 `rejected`，该实例状态才为 `rejected`。

```JavaScript
const pErr = new Promise((resolve, reject) => {
	reject("总是失败");
});

const pSlow = new Promise((resolve, reject) => {
	setTimeout(resolve, 500, "最终完成");
});

const pFast = new Promise((resolve, reject) => {
	setTimeout(resolve, 100, "很快完成");
});

Promise.any([pErr, pSlow, pFast]).then((value) => {
	console.log(value);	// 很快完成
})
```

##### Promise.resolve()

用于将现有对象转化为 Promise 实例。  
**幂等性**：如果传入参数是一个 Promise，则执行空包装（`p === Promise.resolve(p)`）。

```javascript
const promise1 = Promise.resolve(123);
promise1.then((value) => {
	console.log(value);
	// expected output: 123
});
```

##### Promise.reject()

返回一个新的 Promise 实例，该实例的状态为 rejected。  
类似 `Promise.resolve()` ，但没有幂等性。

```javascript
Promise.reject(new Error('fail')).then(function() {
	// not called
}, function(error) {
	console.error(error); // Stacktrace
});
```

#### 扩展

##### 取消期约

通过封装，将 resolve 暴露出来，调用 resolve 提前取消期约。

```html
<button id="start">Start</button> 
<button id="cancel">Cancel</button> 

<script> 
class CancelToken { 
	constructor(cancelFn) { 
		this.promise = new Promise((resolve, reject) => { 
			cancelFn(() => { 
				setTimeout(console.log, 0, "delay cancelled"); 
				resolve(); 
			}); 
		}); 
	} 
}

const startButton = document.querySelector('##start'); 
const cancelButton = document.querySelector('##cancel'); 

function cancellableDelayedResolve(delay) { 
	setTimeout(console.log, 0, "set delay"); 
	return new Promise((resolve, reject) => { 
		const id = setTimeout((() => { 
			setTimeout(console.log, 0, "delayed resolve"); 
			resolve(); 
		}), delay);
		const cancelToken = new CancelToken((cancelCallback) => 
		cancelButton.addEventListener("click", cancelCallback)); 
		cancelToken.promise.then(() => clearTimeout(id)); 
	}); 
} 

startButton.addEventListener("click", () => cancellableDelayedResolve(1000)); 
</script> 
```

##### 期约进度通知

封装期约，添加通知函数。

```js
class TrackablePromise extends Promise {
  constructor(executor) {
    const notifyHandlers = [];
    super((resolve, reject) => {
      return executor(resolve, reject, (status) => {
        notifyHandlers.map((handler) => handler(status));
      });
    });
    this.notifyHandlers = notifyHandlers;
  }
  notify(notifyHandler) {
    this.notifyHandlers.push(notifyHandler);
    return this;
  }
}

let p = new TrackablePromise((resolve, reject, notify) => {
  function countdown(x) {
    if (x > 0) {
      notify(`${20 * x}% remaining`);
      setTimeout(() => countdown(x - 1), 1000);
    } else {
      resolve();
    }
  }
  countdown(5);
});

p.notify((a) => setTimeout(console.log, 0, 'progress:', a));
p.then(() => setTimeout(console.log, 0, 'completed'));
```

### Generator

Generator 函数是 ES6 提供的一种异步编程解决方案  
执行 Generator 函数会返回一个遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。  
**特征：**
1. function 关键字与函数名之间有个星号
2. 函数内部使用 yield 表达式，可作为返回语句，返回的值可作为下次调用 next() 的第一个参数的值。

#### 执行

Generator 函数的调用方法与普通函数一样，调用 Generator 函数后，返回一个迭代器对象。调用遍历器对象的 next 方法，内部指针就从函数头部或上一次停下来的地方开始执行，直到遇到下一个 yield 表达式（或 return 语句）为止。

```JavaScript
function* helloWorldGenerator() { 
	yield 'hello'; 
	yield 'world'; 
	return 'ending'; 
}
let hw = helloWorldGenerator();
console.log(hw.next());// { value: 'hello', done: false }
console.log(hw.next());// { value: 'world', done: false }
console.log(hw.next());// { value: 'ending', done: true }
console.log(hw.next());// { value: undefined, done: true }
```

`yield*` 产生可迭代对象，关联迭代器返回的 `done:true` 的 value 。  

```js
function* genenator() {
  yield* [1, 2, 3];
}
function* genenator11() {
  for (const key of [1, 2, 3]) {
    yield key
  }
}


for (const i of genenator()) {
  console.log(i);
}
for (const i of genenator11()) {
  console.log(i);
}
```

`return()` 和 `throw()` 用于中止生成器。  
使用 `throw()` 抛出错误时，若错误未被解决，则中止；反之，跳过这个值继续执行。  
生成器还未被执行时抛出错误属于外部错误，不会在内部被捕获。  

```js
function* generatorFn() { 
 for (const x of [1, 2, 3]) { 
 yield x; 
 } 
}

const g = generatorFn(); 
console.log(g.next()); // { done: false, value: 1 } 
console.log(g.return(4)); // { done: true, value: 4 } 
console.log(g.next()); // { done: true, value: undefined } 
console.log(g.next()); // { done: true, value: undefined } 
console.log(g.next()); // { done: true, value: undefined } 
```

#### 应用

generator 是实现状态机的最佳结构。

```JavaScript
let flag = true;
function clock(){    
	if(flag){ console.log("tick");} else { console.log("tock"); }    
	flag = !flag;
}
function *  clock_generator(){    
  while(true){        
  console.log("tick"); yield;       
	console.log("tock"); yield;    
  }
}
clock();//tick滴
clock();//tock答
var cg=clock_generator();
cg.next();//tick {value:undefined,done:false}
cg.next();//tock {value:undefined,done:false}
```

### async 异步函数

async 函数是使用 async 关键字声明的函数。 async 函数是 AsyncFunction 构造函数的实例， 并且其中允许使用 await 关键字。  
async 和 await 关键字可以以一种更简洁的方式写出基于 Promise 的异步行为，而无需刻意地链式调用 promise。

期待返回一个实现 thenable 接口的对象（非必须），会自动对该对象“解包”。  
在异步函数内抛出错误会返回一个拒绝期约；但拒绝期约并不会被捕获。

>await 关键字只在 async 函数内有效。  
>async 函数一定会返回一个 promise 对象。  
>注意：forEach 中异步函数不起作用，应使用 for，for...of 或 map 函数。  
>`const userDetails = await Promise.all(users.map(user => user.getDetails()));`

项目中常用：

```JavaScript
async function foo(){   
	return await $.get("http://47.106.244.1:8099/manager/category/findAllCategory"); 
}    
let f = foo();
// f就是获取到的后台接口的数据
```

await 关键字会暂停函数内部之后的代码，推送异步任务到队列，然后继续执行函数外的同步代码，之后执行异步任务求值。  
await 关键字后是期约时，会向消息队列添加两个任务。  
消息队列：
- foo() 提供值的任务 --`foo()`
- 立即可用的值 6 的任务 --`bar()`
- 提供值 8 的任务 --`foo()`

```js
async function foo() {
  console.log(2);
  console.log(await Promise.resolve(8));
  console.log(9);
}
async function bar() {
  console.log(4);
  console.log(await 6);
  console.log(7);
}
console.log(1);
foo();
console.log(3);
bar();
console.log(5);
// 1 
// 2 
// 3 
// 4 
// 5 
// 6 
// 7 
// 8 
// 9 
```

#### 异步策略

**1. 实现 Java 中 `Thread.sleep()`**

```js
async function sleep(delay) { 
  return new Promise((resolve) => setTimeout(resolve, delay)); 
} 
async function foo() { 
  const t0 = Date.now(); 
  await sleep(1500); // 暂停约 1500 毫秒
  console.log(Date.now() - t0); 
} 
foo(); 
// 1502
```

**2. 利用并行执行**  
当期约之间没有依赖时，可以一次性声明所有期约，然后等待它们执行。  
期约没有按顺序执行，但 await**按顺序** 收到每个期约的值。

```js
async function randomDelay(id) {
  // 延迟 0~1000 毫秒
  const delay = Math.random() * 1000;
  return new Promise((resolve) => setTimeout(() => {
    console.log(`${id} finished`);
    resolve(id);
  }, delay));
}
async function foo() {
  const t0 = Date.now();
  const promises = Array(5).fill(null).map((_, i) => randomDelay(i));
  for (const p of promises) {
    console.log(`awaited ${await p}`);
  }
  console.log(`${Date.now() - t0}ms elapsed`);
}
foo();
// 1 finished 
// 2 finished 
// 4 finished 
// 3 finished 
// 0 finished 
// awaited 0 
// awaited 1 
// awaited 2 
// awaited 3 
// awaited 4 
// 645ms elapsed
```

**3. 串行执行期约**  
获取返回的值：`x = await fn()`。  
**4. 栈追踪与内存管理**  
相较于 Promise，提供一个更有效的栈跟踪信息。  
*Promise 的栈信息*

```js
function fooPromiseExecutor(resolve, reject) {
  setTimeout(reject, 1000, 'bar');
}
function foo() {
  new Promise(fooPromiseExecutor);
} 
foo(); 
// Uncaught (in promise) bar 
// setTimeout 
// setTimeout (async) 
// fooPromiseExecutor 
// foo
```

*async/await 的栈信息*

```js
function fooPromiseExecutor(resolve, reject) {
  setTimeout(reject, 1000, 'bar');
}
async function foo() {
  await new Promise(fooPromiseExecutor);
}
foo();
// Uncaught (in promise) bar
// foo
// async function (async) 
// foo
```

## 代理与反射

### 代理

代理对象不能使用 instanceof ，因为 `Proxy.prototype = undefined`。

```js
const target = { 
 foo: 'bar' 
}; 
const handler = { 
 // 捕获器在处理程序对象中以方法名为键
 // 参数：目标对象，要查询的属性，代理对象
	get(trapTarget, property, receiver) { 
		console.log(trapTarget === target); 
		console.log(property); 
		console.log(receiver === proxy); 
	} 
}; 
const proxy = new Proxy(target, handler); 
```

在代理对象上执行“取值”相关操作（`proxy[property]`、`proxy.property` 或 `Object.create(proxy)[property]` 等操作）时会触发 `get()` 捕获器。

#### 问题和不足

**1.this 问题**  
在被代理对象依赖对象标识（使用了 WeakMap 保存私有变量）时，会出现问题。

```js
const wm = new WeakMap(); 
class User { 
	constructor(userId) { 
		wm.set(this, userId); 
	} 
	set id(userId) { 
		wm.set(this, userId); 
	} 
	get id() { 
		return wm.get(this); 
	} 
} 

const user = new User(123); 
console.log(user.id); // 123 
const userInstanceProxy = new Proxy(user, {}); 
console.log(userInstanceProxy.id); // undefined 
```

实例对象使用目标对象作为标识，代理对象却尝试从自身取得实例。  
可以代理目标类本身，之后在创建代理实例，以代理实例作为 WeakMap 的键。

```js
const UserClassProxy = new Proxy(User, {}); 
const proxyUser = new UserClassProxy(456); 
console.log(proxyUser.id); 
```

**2.代理和内置槽位**  
有些内置类型的方法代理无法控制。  
Date 类型依赖 this 上的 `[[NumberDate]]` 内置槽位，这无法通过 `get()` 和 `set()` 访问，代理上也不存在该槽位，会抛出错误。

### 反射

简化原始行为。

```js
const target = { 
	foo: 'bar' 
}; 
const handler = { 
	// 反射 1
	get() { 
		return Reflect.get(...arguments); 
	} 
	// 反射 2
	get: Reflect.get
}; 
const proxy = new Proxy(target, handler); 
// 反射 3
const proxy = new Proxy(target, Reflect);
```

**1.反射 API 和对象 API**  
反射 API 不限于捕获处理程序。  
大多在 Object 类型上有对应的方法。
>通常，Object 上的方法适用于通用程序，而反射方法适用于细粒度的对象控制与操作。

**2.状态标记**  
很多反射 API 会返回布尔值的“状态标记”，表示执行是否成功。
- `Reflect.defineProperty()`
- `Reflect.preventExtensions()`
- `Reflect.setPrototypeOf()`
- `Reflect.set()`
- `Reflect.deleteProperty()`

**3.用一等函数替代操作符**
- `Reflect.get()`：可以替代 **对象属性访问** 操作符。
- `Reflect.set()`：可以替代 `=` 赋值操作符。
- `Reflect.has()`：可以替代 `in` 操作符或 `with()`。
- `Reflect.deleteProperty()`：可以替代 `delete` 操作符。
- `Reflect.construct()`：可以替代 `new` 操作符。

**4.安全的应用函数**  
使用 apply 函数为防止被调用函数也定义了 apply 函数，使用 `Function.prototype.apply.call(myFunc, thisVal, argumentList);`。  
现在可以使用 `Reflect.apply(myFunc, thisVal, argumentsList);` 避免。

#### [内置方法](https://es6.ruanyifeng.com/##docs/reflect##静态方法)

- `Reflect.apply(target, thisArg, args)  
- `Reflect.construct(target, args)  
- `Reflect.get(target, name, receiver)`  
- `Reflect.set(target, name, value, receiver)`  
- `Reflect.defineProperty(target, name, desc)`  
- `Reflect.deleteProperty(target, name)`  
- `Reflect.has(target, name)`  
- `Reflect.ownKeys(target)`  
- `Reflect.isExtensible(target)`  
- `Reflect.preventExtensions(target)`  
- `Reflect.getOwnPropertyDescriptor(target, name)`  
- `Reflect.getPrototypeOf(target)`  
- `Reflect.setPrototypeOf(target, prototype)`

### 规范

1. 捕获不变式  
   限制捕获处理程序定义过于反常的行为，出现反常行为时会抛出错误
2. 可撤销代理

   ```js
	const { proxy, revoke } = Proxy.revocable(target, handler); 
	console.log(proxy.foo); // intercepted 
	console.log(target.foo); // bar 
	revoke();
	```

### 代理模式

1. 跟踪属性访问
2. 隐藏属性
3. 属性验证
4. 函数和构造函数参数验证
5. 数据绑定和可观察对象

## [模块化和工程化](JavaScript%20模块.md)

## 参考资料

[GitHub - ruanyf/es6tutorial: 《ECMAScript 6 入门》是一本开源的 JavaScript 语言教程，全面介绍 ECMAScript 6 新增的语法特性。](https://github.com/ruanyf/es6tutorial)
