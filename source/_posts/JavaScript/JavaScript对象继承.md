---
title: JavaScript对象继承
categories:
  - JavaScript
date: 2022-09-05 11:33:18
updated: 2023-03-23 09:43:33
---

# JavaScript 对象继承

## 原型链继承

在原型搜索机制中，构造函数，实例，和原型对象的关系为，原型对象是构造函数的一个属性 prototype，原型对象中有一个属性 constructor 指回构造函数，构造函数生成的实例中具有指针指向构造函数上的原型对象。  
![](JavaScript对象继承.assets/image-20220925210526001.png)  
当搜索一个属性/方法时，先搜索实例本身，如果实例本身没有找到，再从指针找到其指向的原型对象，向上查找的特性与作用域链相似。也就是说，如果在实例中设置了要查找的属性名，就不会再向上查找。这时候如果没找到，并且该原型对象中也有一个指向另一个原型对象的指针，就从指针向上搜索原型的原型，直到原型链的末端，也就是原型不再包含指向另一个原型的指针为止。  
特点：
1. 父类新增的原型属性/方法，子类都能够访问到
2. 非常纯粹的继承关系，实例是子类的实例，也是父类的实例

缺点： 
1. 来自原型对象的所有属性被所有实例共享
2. 创建子类实例时，无法向父类构造函数传参

## 盗用构造函数继承（经典继承/对象伪装）

在子类构造函数中调用父类构造函数。  
d1 调用 Dog 构造函数，其内部 this 指向 d1，所以 Animal.call(this) 就相当于 Animal.call(d1),就相当于 d1.Animal()。最后 d1 去跳用 Animal 方法时，Animal 内部的 this 就指向 d1.那么 Animal 内部 this 上的所有属性和方法，都被拷贝到了 d1 上。所以，每个实例都具有自己的 categorys 属性副本，互不影响。

```javascript
function Animal(){
	this.categorys = ['cat', 'rabbit'];
}
function Dog(){
	//继承Animal
	Animal.call(this);
}
var d1 = new Dog();
d1.categorys.push('dog');
console.log(d1.categorys);//[ 'cat', 'rabbit', 'dog' ]
var d2 = new Dog();
console.log(d2.categorys);//[ 'cat', 'rabbit', 'dog' ]
```

特点：
1. 创建子类实例时，可以向父类传递参数
2. 可以实现多继承（call 多个父类对象）

缺点：
1. 必须在构造函数中定义方法，无法实现函数复用
2. 只能继承父类的实例属性/方法，不能继承原型属性/方法
3. 实例并不是父类的实例，只是子类的实例

## 组合继承 (伪经典继承)

通过调用父类构造，继承父类的属性并保留传参的优点，然后通过将父类实例作为子类原型，实现函数复用。

```javascript
function Animal(){
	this.categorys = ['cat', 'rabbit'];
}

Animal.prototype.sayCategorys = function(){
	console.log(this.categorys);
}

function Dog(){
	// 继承属性（盗用构造函数继承）
	Animal.call(this);
}
// 继承方法（原型链继承）
Dog.prototype = new Animal();//原型链继承，先执行

var d1 = new Dog();//调用Dog构造函数，在实例中创建categorys属性，屏蔽了原型上的categorys属性
d1.categorys.push('dog');
console.log(d1.categorys);//[ 'cat', 'rabbit', 'dog' ]
var d2 = new Dog();
console.log(d2.categorys);//[ 'cat', 'rabbit', 'dog' ]

d1.sayCategorys();//[ 'cat', 'rabbit', 'dog' ]
```

特点：
1. 既是子类的实例，也是父类的实例
2. 不存在引用属性共享问题
3. 可传参
4. 函数可复用

缺点：  
调用了两次父类构造函数，生成了两份实例

## 原型式继承

object() 对传入的对象进行了一次浅复制。  
引用值始终在对象实例之间共享。

```js
function object(o) { 
 function F() {} 
 F.prototype = o; 
 return new F(); 
}

let person = { 
 name: "Nicholas", 
 friends: ["Shelby", "Court", "Van"] 
}; 
let anotherPerson = object(person); 
anotherPerson.name = "Greg"; 
anotherPerson.friends.push("Rob"); 
let yetAnotherPerson = object(person); 
yetAnotherPerson.name = "Linda"; 
yetAnotherPerson.friends.push("Barbie"); 
console.log(person.friends); // "Shelby,Court,Van,Rob,Barbie" 
```

ECMAScript 5 中 `Object.create()` 将原型式继承规范化。

```js
let person = { 
	name: "Nicholas", 
	friends: ["Shelby", "Court", "Van"] 
}; 
let anotherPerson = Object.create(person, { 
	name: { 
		value: "Greg" 
	} 
}); 
console.log(anotherPerson.name); // "Greg" 
```

## 寄生式继承

以传入对象为基准生成新的对象，对对象进行增强，然后返回新对象。

```js
function createAnother(obj){
	// 返回一个新对象
	let clone = object(obj);
	clone.sayHi = function(){
		console.log('hi');
	}
	return clone;
}

let person = { 
 name: "Nicholas", 
 friends: ["Shelby", "Court", "Van"] 
}; 
let anotherPerson = createAnother(person); 
anotherPerson.sayHi(); // "hi" 
```

新返回的对象具有 person 所有的属性和方法，还有新添加的 sayHi 方法。  
适合主要关注对象，不在乎类型和构造函数的场景。  
与构造函数模式类似。

## 寄生组合继承

通过寄生方式，砍掉父类的实例属性，这样，在调用两次父类的构造的时候，就不会初始化两次实例方法/属性，避免的组合继承的缺点。

```javascript
function Animal(){
    this.categorys = ['cat', 'rabbit'];
}

Animal.prototype.sayCategorys = function(){
    console.log(this.categorys);
}

function Dog(){
    Animal.call(this);
}

//Object.create()为ES5方法,相当于以下函数（如果浏览器不兼容）
if(!Object.create){
    Object.create = function(proto){
        function F(){};
        F.prototype = proto;
        return new F();
    }
}
// 与Object.create()作用类似
function inheritPrototype(subType, superType) { 
	let prototype = object(superType.prototype); // 创建对象
	prototype.constructor = subType; // 增强对象 
	subType.prototype = prototype; // 赋值对象
}

// Dog.prototype = new Animal();
// Object.create()或inheritPrototype
Dog.prototype = Object.create(Animal.prototype);//返回Animal的原型对象的新对象赋值给Dog的原型对象
var d1 = new Dog();
d1.categorys.push('dog');
console.log(d1.categorys);//[ 'cat', 'rabbit', 'dog' ]
var d2 = new Dog();
console.log(d2.categorys);//[ 'cat', 'rabbit', 'dog' ]

d1.sayCategorys();//[ 'cat', 'rabbit', 'dog' ]
```

- `Object.create()` 是创建一个新对象，使用现有的对象来提供新创建对象的 proto。意思就是生成一个新对象，该新对象的 proto（原型） 指向现有对象。
- `new` 生成的是构造函数的一个实例，实例继承了构造函数及其 prototype（原型属性）上的属性和方法。

`new` 关键字创建的对象会保留原构造函数的属性，而用 `Object.create()` 创建的对象不会。  

缺点：  
如果在执行 `Object.create()` 方法之前，`Dog.prototype` 上有定义的属性/方法，将会被覆盖。

## 拷贝继承

把一个对象中的属性或者方法直接复制到另一个对象中

```javascript
function extend(obj, cloneObj){
    if(typeof obj !== 'object'){
        return false;
    }
    cloneObj = cloneObj || {};
    for(var i in obj){
        if(typeof obj[i] === 'object' && typeof obj[i] !== null){
            cloneObj[i] = obj[i] instanceof Array? []:{};
            extend(obj[i], cloneObj[i]);
        } else {
            cloneObj[i] = obj[i];
        }
    }
    return cloneObj;
}

var obj = {
    a: 1,
    b: 2,
    c: {
        a: 1,
        b: 2,
        c: {
            a: 1,
            b: 2
        }
    }
}

var obj1 = extend(obj)
obj.c.c.c = 3
console.log(obj)
console.log(obj1)
```