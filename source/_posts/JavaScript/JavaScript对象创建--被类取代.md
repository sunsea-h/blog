---
title: JavaScript对象创建--被类取代
date: 2022-09-05 11:33:18
updated: 2023-03-23 09:43:41
---

# JavaScript 对象创建 -- 被类取代

## 工厂模式

1. **用字面量方式创建对象**  
缺点：一次性创建，无法批量操作
2. **new Object() 创建对象**  
缺点：代码整体性差
3. **工厂模式**

```javascript
function createPerson(name, age, gender){
	var person = new Object();
	person.name = name;
	person.age = age;
	person.gender = gender;
    person.sayName = function(){
        console.log(this.name);
    }
    return person;
}
//利用工厂函数创建对象
var person1 = createPerson('zhangsan', 18, 'male');
var person2 = createPerson('lisi', 20, 'female');
```

缺点：只是对创建对象的过程进行封装,本质没有改变，无法知道对象具体的数据类型，不能确定这个对象时 Person 的实例还是 Dog 的实例

## 构造函数模式

在函数内创建一个对象，给对象赋予属性及方法再将对象返回即可

```javascript
function Person(name, age, gender){
	this.name = name;
	this.age = age;
	this.gender = gender;
    //巧妙的使用的this指向 当this在函数内调用时。指向函数的拥有者Person对象
    this.sayName = function(){
        console.log(this.name);
    }
}
//利用构造函数模式创建对象
var person1 = new Person('zhangsan', 18, 'male');
var person2 = new Person('lisi', 20, 'female');
```

### 使用函数表达式自定义构造函数

构造函数不一定要写成函数声明的形式，赋值给变量的函数表达式也可以表示构造函数  
实例化时，函数后的括号可加可不加，只要有 new 就可以调用相应的构造函数

```js
let Person = function(name, age, gender){
    this.name = name;
    this.age = age;
    this.gender = gender;
    this.sayName = function(){
        console.log(this.namee);
    }
}
let person1 = new Person('person', 29, 'male');
let person2 = new Person;//不传参数默认underfined
```

### 构造函数和函数

构造函数也是函数  
唯一区别：调用方式不同

```javascript
//作为构造函数
var person = new Person('Jacky', 22, 'male')
person.sayName()
//作为函数调用
Person('lisi', 21, 'female')//添加到全局对象 node->global、浏览器->window
global.sayName()
```

### 构造函数的问题

构造函数定义的方法会在每个实例上都执行一遍，实例 person1 和 person2 都有 sayName 方法，但两个方法不是同一个 Function 实例。  
都是做一样的事，没必要定义两个不同的 Function 实例，可以把函数定义转移到构造函数外部：

```javascript
function Person(name, age, gender){
    this.name = name;
    this.age = age;
    this.gender = gender;
    this.sayName = sayName;//sayName属性等于全局sayName()函数，该属性中只包含一个指向外部的指针，person1和person2共享全局作用域上的sayName()函数
}
function sayName(){
    console.log(this.name);
}
```

以上方法虽解决了相同逻辑函数重复定义的问题，但全局作用域乱了，因为该函数实际上只能在一个对象上调用。如果一个对象需要多个方法，就需在全局作用域定义多个函数，导致自定义类型引用的代码不能很好地聚集在一起。--- 可以使用 **原型模式** 解决

## 构造函数模式和工厂模式的区别

1. 工厂函数需要创建对象，以及必须有返回值
2. 工厂模式生成的实例对象的\_\_proto\_\_ 直接指向基类 Object 的原型；构造函数生成的实例对象的\_\_proto\_\_ 指向他父类的原型，然后父类的原型上的\_\_proto\_\_ 指向基类 Object 的原型
3. 构造函数可以重写，可以在全局中添加新属性和方法 Person.prototype = {}，但工厂函数只能在局部添加

## 原型模式

原型模式定义的属性和方法位于构造函数的 prototype 属性上，是由所有实例共享的。

```javascript
function Person(){}
Person.prototype.name = 'zhangsan';
Person.prototype.age = 21;
Person.prototype.gender = 'male';
Person.prototype.sayName = function(){
    console.log(this.name);
};
```

以上代码，将所有属性和 sayName() 方法直接添加到 Person 的 prototype 属性上，使得 person 实例都共享相同的属性和 sayName() 方法。

### 原型层级

通过对象访问属性时，会按照属性名称从实例本身开始搜索，找到返回对应的值，没找到会沿着指针进入原型对象，在原型对象找到属性后返回对应的值。  
实例无法修改原型对象上属性的值，实例所添加的同名属性会创建在实例中，并遮蔽原型对象上的同名属性（属性值可以为 null）。可以通过 **delete** 删除实例上的属性，来恢复与原型对象同名属性联系。  
通过 `hasOwnProperty()` 判断是否存在于原型上，即是否为自有属性。  

### 修改原型对象

```js
// 1.isPrototypeOf 判断实例原型
console.log(Person.prototype.isPrototypeOf(person1)); // true 
console.log(Person.prototype.isPrototypeOf(person2)); // true 

// 2.getPrototypeOf 获取实例原型
console.log(Object.getPrototypeOf(person1) == Person.prototype); // true 
console.log(Object.getPrototypeOf(person1).name);  // "Nicholas"

// 3.setPrototypeOf 设置实例原型
// 不要直接修改原来对象的原型，而是创建一个新对象并指定原型
let biped = { 
 numLegs: 2 
}; 
let person = Object.create(biped); 
person.name = 'Matt'; 
console.log(person.name); // Matt 
console.log(person.numLegs); // 2 
console.log(Object.getPrototypeOf(person) === biped); // true 
```

## 组合模式

组合使用构造函数模式和原型模式  
构造函数模式用于定义实例属性，原型模式用于定义方法和共享属性。

```javascript
function Person(name, age, gender){
    this.name = name;
    this.age = age;
    this.gender = gender;
    this.firends = ['zhangsan', 'lisi'];
}
Person.prototype = {
    constructor: Person,
    sayName: function(){
        console.log(this.name);
    }
};
```