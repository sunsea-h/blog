---
title: JavaScript对象
date: 2022-09-05 11:33:18
updated: 2023-03-23 09:43:55
---

# JavaScript 对象

## 对象

JS 中万物皆对象  
字符串、布尔、数值也是通过对象方法创建的（通过原型链进行调用的），也可以调用对象原始方法 toString

```javascript
var str = 'xiaoming';
str.toString();//调用时，JS会自动进行装箱操作 String('str').toString() -> 拆箱 str
```

## [对象创建](JavaScript对象创建--被类取代.md)

### 字面量的方式

```javascript
var stu = {
    name:'xiaoming',
    cook:function(){
        console.log(this.name + '去做饭')
    },
}
```

### 构造函数的方式

```javascript
var stu = new Object();
stu.name = "xiaoming";
stu.cook = function(){
    console.log('hello');
}
```

## 对象遍历

```javascript
for(自定义变量名 in 数组/对象){
    执行代码
}
for(var key in obj){
    var value=obj[key];
}
```

能被 for...in 语句打印的属性称为可枚举属性（默认情况下，自定义属性都是可枚举的）

## 原型、原型链和 [继承](JavaScript对象继承.md)

显式原型 prototype  
隐式原型\_\_proto\_\_

### 构造函数、原型和实例的关系

每个构造函数都有一个 prototype 指针指向其原型对象，原型对象都包含一个指向其构造函数的指针 constructor，而实例都包含一个指向原型对象的内部指针\_\_proto\_\_  
![](JavaScript对象.assets/image-20220925205638076.png)

### 原型链

在 JavaScript 中万物都是对象，对象和对象之间也有关系，并不是孤立存在的，所有的对象都直接或间接继承 Object。对象之间的继承关系，在 JavaScript 中是通过 prototype 对象指向父类对象，直到指向 Object 对象为止，这样就形成了一个原型指向的链条。  
![](JavaScript对象.assets/image-20220925205754691.png)  
图中 d1 继承 Animal，Animal 继承 Function，Function 继承 Object。  
**子类添加或覆盖父类方法：**  
子类向父类中添加新的方法或覆盖父类的方法时，需要在原型赋值（`Dog.prototypr=new Animal()`）之后进行

### 原型链的破坏

以字面量的方式创建原型方法会破话之前的原型链，相当于重写了原型链。

```javascript
function Animal(){
    this.name = 'animal';
}
Animal.prototype.getAnimalName = function(){
    console.log(this.name);
}
function Dog(){
    this.name = 'dog';
}
Dog.prototype = new Animal();
Dog.prototype = {
    getDogName(){
        console.log(this.name);
    },
    someOtherMethod(){
        return false;
    }
};
var d1 = new Dog();
d1.getAnimalName();//出错
```

在以上代码中，子类的原型在被赋值为 Animal 的实例后，又被一个对象字面量覆盖了。覆盖后的原型是一个 Object 的实例，而不再是 Animal 的实例。因此原型链断了，Dog 和 Animal 之间没有联系了。

### 检测对象是否在同一个原型链中

1. `isPrototypeOf()`：检测一个对象是否存在于另一个对象的原型链上（原型的指向）

```javascript
function Animal(){}
function Dog(){}

var d2 = new Dog();
console.log(Animal.prototype.isPrototypeOf(d2));//false

Dog.prototype = new Animal();//原型链继承
var d2 = new Dog();
console.log(Animal.prototype.isPrototypeOf(d2));//true

var obj = {};
console.log(Object.prototype.isPrototypeOf(obj));//true
```

2. `instanceof`：检测一个对象是否是某个构造函数的实例 (new)

```javascript
function Animal(){}
var d1 = new Animal();
connsole.log(d1 instanceof Animal);//true
```

### 字符串地区对应

`toLocaleString()`	返回对象的字符串表示，该字符串与执行环境的地区对应

```javascript
var now = new Date();
console.log(now);
console.log(now.toString());//Thu Oct 15 2020 21:40:38 GMT+0800 (中国标准时间)
console.log(now.toLocaleString());//2020/10/15 下午9:40:38
```

## 属性

### 数据属性

1. `Object.defineProperty` 设置某一个对象的某一个属性的原始属性

```javascript
Object.defineProperty(obj,'name',{
   configurable:true,//表示是否通过delete删除属性从而重新定义属性，能否修改属性的特性，或者能否把属性修改为访问器属性
   enumerable:true,//表示能否通过for-in循环返回属性
   writable:true,//表示能否修改属性的值
   value:'terry'//包含这个属性的数据值
})
```

2. `Object.definePropertys` 一次设置对象的多个属性的原始属性

```javascript
Object.defineProperty(obj,{
	age:{
		configurable:false;
	},
	sex:{
		configurable:false;
	}
})
```

3. `Object.getOwnPropertyDescriptor` 获取到属性的描述符
4. 总结 configurable：当 `configurable设为false` 时，
	- 不可以通过 delete 去删除该属性从而重新定义属性；
	- 不可以转化为访问器属性；
	- configurable 和 enumerable 不可被修改；
	- writable 可单向修改为 false，但不可以由 false 改为 true；
	- value 是否可修改根据 writable 而定。

当 configurable 为 false 时，用 delete 删除该属性，在非严格模式下，不会报错，但操作被忽略，在严格模式下会报错；其他不可被修改的特性修改时会报错。

### 访问器属性

访问器属性不包含数据值，包含的是一对 get 和 set 方法，通过这两个方法来进行读写访问器属性操作。访问器属性不能直接定义，要通过 Object.defineProperty() 这个 Object 的静态方法来定义

访问器属性 configurable 默认为 false

```javascript
var obj = {
	_num:0
}
Object.defineProperty(obj,'num',{
	set(num){
		this._num = num
	},//在num的值被设置时调用,默认隐式调用
	get(num){
		return '数字：' + this._num
	}//在num的值被获取时调用,默认隐式调用
})
```

数据描述符 value、writable 和访问器描述符 get、set 不能同时设置

## 属性操作

### 属性访问

```javascript
var stu = new Object();
stu.name = 'red';
var n = 'name';
//点表示法
console.log(stu.name);
//中括号表示法
console.log(stu['name']);//red
console.log(stu[n]);//red
//中括号里必须是计算结果为字符串的表达式   
//不加引号会默认为变量名
```

### 属性删除

`delete` 属性访问表达式  
`delete stu.name`  
`delete` 只会删除对象自有属性，不能删除继承属性  

### 属性检测

1. `in` 检测某属性是否是某对象的自有属性或者是继承属性

```javascript
var obj = new Object();
obj.name = "terry";
obj.age = 12;
obj.gender="male"
console.log("name" in obj);//true 自有
console.log("toString" in obj);//true 继承
```

2. `hasOwnProperty()` 检测给定的属性是否是对象的自有属性，对于继承属性将返回 false

```javascript
var obj = new Object();
obj.name = "terry";
obj.age = 12;
obj.gender="male"
console.log(obj.hasOwnProperty("name"));//true
```

3. `propertyIsEnumerable()` 检测给定的属性是否是该对象的自有属性，并且该属性是可枚举的。通常由 JS 代码创建的属性都是可枚举的，但是可以使用特殊的方法改变可枚举性。

```javascript
var obj = new Object();
obj.name = "terry";
obj.age = 12;
obj.gender="male"
console.log(obj.propertyIsEnumerable("name"));//true
```

4. 自定义 `hasPrototypeProperty()` 函数检测既定属性是否存在对象的原型中

```javascript
var obj = {
    a: 'a1',
    b: 'b2'
}
 
Object.prototype.c = "c3";
 
function hasPrototypeProperty(obj, property) {
    return !obj.hasOwnProperty(property) && property in obj
}
 
console.log(hasPrototypeProperty(obj, "c"))    // true
console.log(hasPrototypeProperty(obj, "b"))    // false
```

## 数据类型转换

### Object 类型到 Boolean 类型

除了空引用 (`null`) 会转换为 false，其他都被转换为 true(空对象也为 true)

### Object 类型转换为 String 类型

通过 `toString()` 和 `String()` 进行转换

**`valueOf` 和 `toString` 的区别**:
1. 这两个方法都是对象的原始方法
2. valueOf 为对象的原始值，通常不会显示的调用，通常有 JS 自动在后台进行调用
3. toString 本身的一个作用是做字符串的转换，也会进行自动调用
4. 如果重写了两个方法，在进行 **运算** 时，优先调用 valueOf；在进行 **显示** 时，优先调用 toStirng。如果只重写了一个方法，无论运算还是显示，都会调用该方法。  

==拓展==：可以用 `valueOf()` 实现一个累加的实例，每次调用 obj 时 `valueOf()` 都会调用  
（num 在 valueOf() 中被引用，所以不会被垃圾回收机制回收）。  

```javascript
var obj = {
    num:1,
    toString:function(){
        return this.num + 1;
    },
    valueOf:function(){
        return this.num++;
    }
}
console.log(obj==1); // true
console.log(obj==2); // true
console.log(obj==3); // true
```

### Object 类型转换为 Number 类型

1. 如果只重写了 `valueOf()` 或者 `toString()` 方法，则调用该方法，并将返回值用 Number() 转换。
2. 如果两个方法都重写了，则调用 `valueOf()`，并将返回值用 Number() 转换。
3. 如果两个方法都没有重写，则返回 NaN

## 值传递与引用传递 (址传递)

- 基本数据类型的变量：  
可以直接操作保存在变量中的实际的值，参数传递的时候传递的是实际值
- 引用数据类型的变量：  
 不能直接操作对象的内存空间，实际上是在操作对象的引用，参数传递的时候传递的是引用地址

## 对象序列化

将对象转换为字符串的描述，解决对象在 io 中传递的问题  
undefined 值不能序列化和反序列化
1. 常规转换  
   `obj.toString()`
2. 转换为 json 字符串  
  `JSON.stringify(obj)` //只能序列化对象可枚举的自有属性

```javascript
var obj = {
	name:"briup",
	age:12
};
console.log(obj);  //object类型打印的结果  { name: 'briup', age: 12 }

// 将对象转换为JSON字符串
var json = JSON.stringify(obj);
console.log(json);//string类型的字符串 {"name":"briup","age":12}

// 将JSON字符串转换为对象
var json = '{"name":"briup","age":12}';
//json在进行反序列化的时候是不支持单引号的
var obj = JSON.parse(json);
console.log(obj);// { name: 'briup', age: 12 }

```

3. 转换为查询字符串