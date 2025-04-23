---
title: TypeScript
categories:
  - TypeScript
date: 2022-09-26 09:27:58
updated: 2025-03-14 14:08:15
---
# TypeScript

![](TypeScript.assets/image-20240909174057706.png)

## 基本类型

### 布尔值

```TypeScript
let isDone: boolean = false;
```

### 数字

```TypeScript
let decLiteral: number = 6;// 十进制
let hexLiteral: number = 0xf00d;// 十六进制
let binaryLiteral: number = 0b1010;// 二进制
let octalLiteral: number = 0o744;// 八进制
```

### 字符串

```TypeScript
let name: string = "bob";
name = "smith";


let name: string = `Gene`;
let age: number = 37;

let sentence: string = `Hello, my name is ${ name }.
	I'll be ${ age + 1 } years old next month.`;
// 等同于
let sentence: string = "Hello, my name is " + name + ".\n\n" +
    "I'll be " + (age + 1) + " years old next month.";
```

### 数组

存储相同类型值的集合。

```TypeScript
let list: number[] = [1, 2, 3];
let list: Array<number> = [1, 2, 3];
```

### 元组 Tuple

存储不同类型值的集合。

```TypeScript
let x: [string, number];
x = ['hello', 10];

console.log(x[0].substr(1)); // OK
console.log(x[1].substr(1)); // Error, 'number' does not have 'substr'
```

访问越界元素时，使用联合类型（元组中所有类型的联合）替代。即新添加的超过界限的元素，其类型为元组中所有类型的联合类型。

```TypeScript
x[3] = 'world'; // OK, 字符串可以赋值给(string | number)类型

console.log(x[5].toString()); // OK, 'string' 和 'number' 都有 toString

x[6] = true; // Error, 布尔不是(string | number)类型
```

### 枚举

```TypeScript
// 赋值
enum Color {Red, Green, Blue}// 默认从0开始编号
// enum Color {Red = 1, Green, Blue} // 或手动改为1开始编号
// enum Color {Red = 1, Green = 2, Blue = 4} // 或全部手动编号
let c: Color = Color.Green;

// 查找
enum Color {Red = 1, Green, Blue}
let colorName: string = Color[2];

alert(colorName);  // 显示'Green'因为上面代码里它的值是2
```

### 任意值

```TypeScript
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false;
```

可选择地包含或移除类型检查。  
`Object` 只允许赋任意值，但不能调用任意方法（即便有）。

```TypeScript
let notSure: any = 4;
notSure.ifItExists(); // 不会检查
notSure.toFixed(); // 不会检查

let prettySure: Object = 4;
prettySure.toFixed(); // 不能调用 Number 的 toFixed 方法
```

### 空值

`void` 与 `any` 相反。  
声明 `void` 类型的变量只能赋予 `undefined` 和 `null` 。

```TypeScript
function warnUser(): void {
    alert("This is my warning message");
}
```

### Null 和 Undefined

默认可以赋值给所有类型  
指定 `--strictNullChecks` 标记时，只能赋予本身或 `void`

### Never

可以赋值给任意类型，是任何类型的子类型

```TypeScript
// 抛出错误
function error(message: string): never {
    throw new Error(message);
}

// 推断的返回值类型为never
function fail() {
    return error("Something failed");
}

// 永远不会返回
function infiniteLoop(): never {
    while (true) {
    }
}
```

### 类型断言

两种形式：

1. “尖括号”

```TypeScript
let someValue: any = "this is a string";

let strLength: number = (<string>someValue).length;
```

2. `as`

```TypeScript
let someValue: any = "this is a string";

let strLength: number = (someValue as string).length;
```

## 变量声明

### 属性重命名

重命名并声明类型

```TypeScript
let { a: newName1, b: newName2 }:{a: string, b: number} = o;
```

### 默认值

```TypeScript
function keepWholeObject(wholeObject: { a: string, b?: number }) {
    let { a, b = 1001 } = wholeObject;
}
```

### 函数声明

```TypeScript
// 解构
type C = { a: string, b?: number }
function f({ a, b }: C): void {
    // ...
}
// 默认值
function f({ a, b } = { a: "", b: 0 }): void {
    // ...
}
f(); // 不传参，默认 { a: "", b: 0 }
```

在解构属性时给予默认或可选的属性 替换 主初始化列表

```TypeScript
function f({ a, b = 0 } = { a: "" }): void {
    // ...
}
f({ a: "yes" }); // 只传a，默认b=0
f(); // 不传参 默认{a: ""}
f({}); // 错误，不可以传空对象
```

### 对象展开 `...`

1. 展开对象后的属性覆盖前面同名属性

```TypeScript
let defaults = { food: "spicy", price: "$$", ambiance: "noisy" };
let search = { ...defaults, food: "rich" };

search// { food: "rich", price: "$$", ambiance: "noisy" }
```

2. 仅包含自身的可枚举属性，会丢失其方法

```TypeScript
class C {
	p = 12;
	m() {
	}
}
let c = new C();
let clone = { ...c };
clone.p; // ok
clone.m(); // error!
```

## 接口

1. 普通属性

```TypeScript
interface LabelledValue {
    label: string;
}

function printLabel(labelledObj: LabelledValue) {
    console.log(labelledObj.label);
}

let myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj);
```

2. 可选属性

```TypeScript
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): {color: string; area: number} {
  let newSquare = {color: "white", area: 100};
  if (config.color) {
    newSquare.color = config.color;
  }
  if (config.width) {
    newSquare.area = config.width * config.width;
  }
  return newSquare;
}

let mySquare = createSquare({color: "black"});
```

对象字面量存在任何 **目标类型** 不包含的属性时，会报错

```TypeScript
// error: 'colour' not expected in type 'SquareConfig'
let mySquare = createSquare({ colour: "red", width: 100 });
```

**绕开额外检测的方法**

- 使用 **类型断言**
- 使用 **字符串索引签名**（最佳）
- 将对象赋值给另一个变量

```TypeScript
// 类型断言
let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);
// 字符串索引签名
interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;  // 有任意数量的属性，只要不是color和width，不在意其类型是啥
}
// 将对象赋值给另一个变量
let squareOptions = { colour: "red", width: 100 };
let mySquare = createSquare(squareOptions);// squareOptions不会经过额外属性检查
```

3. 只读属性

```TypeScript
interface Point {
    // 初次赋值后不能更改
    readonly x: number;
    readonly y: number;
}
```

`ReadonlyArray<number>` 与 `Array<number>` 相似，但是数组创建后不可修改，也无法将整个 `ReadonlyArray` 赋值给普通数组。

### `readonly` 和 `const`

`readonly`：作为属性时使用  
`const`：作为变量时使用

### 函数类型

```TypeScript
interface SearchFunc {
  (source: string, subString: string): boolean;
}
let mySearch: SearchFunc;

mySearch = function(source: string, subString: string) {
// 或
// mySearch = function(src: string, sub: string): boolean {
// 或
// mySearch = function(src, sub) {
  let result = source.search(subString);
  return result > -1;
}
```

### 可索引类型

索引类型：字符串和数字  
数字类型在索引是会转换为字符串，数字类型应作为字符串类型的子类型

```TypeScript
class Animal {
    name: string;
}
class Dog extends Animal {
    breed: string;
}

// a[100] 等同于 a['100']
// 错误：使用'string'索引，有时会得到Animal!
interface NotOkay {
    [x: number]: Animal;
    [x: string]: Dog;
}
```

字符串签名保证所有属性与返回值类型相匹配

```TypeScript
interface NumberDictionary {
  [index: string]: number;
  length: number;    // 可以，length是number类型
  name: string       // 错误，`name`的类型与索引类型返回值的类型不匹配
}
```

也可以设置只读

```TypeScript
interface ReadonlyStringArray {
    readonly [index: number]: string;
}

let arr: ReadonlyStringArray = ['a', 'b'];
arr[2] = 'c'; // 错误，无法设置值，只能读取
```

### 类类型

接口只描述类的 **公共部分**  
不会检查私有成员

```TypeScript
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date);
}

class Clock implements ClockInterface {
    currentTime: Date;
    setTime(d: Date) {
        this.currentTime = d;
    }
    constructor(h: number, m: number) { }
}
```

#### 静态部分与实例部分的区别

静态部分类型：constructor 构造器  
实例部分类型：new XXX

1. 声明实例部分接口
2. 静态部分接口，用来约束构造器声明，返回类型为实例部分接口类型
3. 声明用于构造对象的方法，调用静态部分接口进行实例化对象操作
4. 声明 class，声明时实现 实例部分接口
5. 传入构造函数来实例化对象

```TypeScript
// 1.实例部分接口，用来约束最终创建的实例
interface StudentInterface {
	id: string
	age: number
	go():void;
}

// 2.静态部分接口，用来约束构造器声明，返回类型为实例部分接口类型
interface StudentInfoType {
	// 有new，就是有构造器签名，就是静态类型的接口，所以不能被类直接实现，会报错
	new (classId: string, code: string, age: number): StudentInterface;
}

// 3.声明用于构造对象的方法（区别于名词‘构造函数’）调用静态部分接口进行实例化对象操作
// 通过调用静态部分接口，来进行接口约束
function createStudent(studentInfo: StudentInfoType, classId: string, code:string, age: number): StudentInterface {
    return new studentInfo(classId, code, age);
}

// 4.声明class，声明时实现 实例部分接口
// implements StudentInterface：类StudentItem实例化出来的对象（类的实例部分）应该满足这个接口的规则
class StudentItem implements StudentInterface {
	id: string;
	age: number;

	// constructor构造器，内部声明在createStudent中被约束
	constructor(classId: string, code: string, age: number){
		this.id = classId + "" + code
		this.age = age
	}
	go(){
		console.log('gogogo')
	}
}

// 5.传入构造函数来实例化对象，在createStudent中将后续参数通过constructor构造器挂载在实例上
let 小明 = createStudent(StudentItem, '05', '33', 12)
console.log(小明)
```

或

```ts
interface StudentInterface {
  id: string
  age: number
  go(): void
}

interface StudentInfoType {
  new (classId: string, code: string, age: number): StudentInterface
}

let createStudent: StudentInfoType = class StudentItem
  implements StudentInterface
{
  id: string
  age: number
  constructor(classId: string, code: string, age: number) {
    this.id = classId + '' + code
    this.age = age
  }
  go() {
    console.log('gogogo')
  }
}

let 小明 = new createStudent('05', '33', 12)
console.log(小明)
```

TypeScript 中不能实现一个带有构造函数的接口，但可以通过继承另一个接口，并让包含构造函数的接口返回同样的类型，在类中就能实现对该构造函数的类型检查。

**类只能实现实例部分，而静态部分则可以通过传参进行类型检查**。

### 继承接口

```TypeScript
interface Shape {
    color: string;
}

interface PenStroke {
    penWidth: number;
}

interface Square extends Shape, PenStroke {
    sideLength: number;
}
let square = <Square>{};
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5.0;
```

### 混合类型

```TypeScript
interface Counter {
	// start 参数
    (start: number): string;
    interval: number;
    reset(): void;
}
// 一个对象可以同时做为函数和对象使用，并带有额外的属性。
function getCounter(): Counter {
	// <Counter> 断言
    let counter = <Counter>function (start: number) { };
    counter.interval = 123;
    counter.reset = function () { };
    return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```

### 接口继承类

创建了一个接口继承了一个拥有私有或受保护的成员的类时，这个接口类型只能被这个类或其子类所实现（implement）。

```TypeScript
class Control {
    private state: any;
}

interface SelectableControl extends Control {
    select(): void;
}

class Button extends Control implements SelectableControl {
    select() { }
}

class TextBox extends Control {

}

// 不是 Control 的子类，没有 state 属性
class Image implements SelectableControl {
    select() { }
}

class Location {

}
```

## Class（类）

### 类的派生和继承

```TypeScript
class Animal {
    name: string;
    constructor(theName: string) { this.name = theName; }
    move(distanceInMeters: number = 0) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}

class Snake extends Animal {
    constructor(name: string) { super(name); }
    move(distanceInMeters = 5) {
        console.log("Slithering...");
        super.move(distanceInMeters);
    }
}

class Horse extends Animal {
    constructor(name: string) { super(name); }
    move(distanceInMeters = 45) {
        console.log("Galloping...");
        super.move(distanceInMeters);
    }
}

let sam = new Snake("Sammy the Python");
let tom: Animal = new Horse("Tommy the Palomino");

sam.move();
tom.move(34);
```

派生类的构造函数中必须调用 `super()`，在构造函数中访问 `this` 之前必须调用 `super()`。

### 公共、私有和受保护的修饰符

`public`、`private` 和 `protected`  
成员默认 `public`  
`private`：只能在该类中访问  
`protected`：派生类中也可以访问  

```TypeScript
class Person {
    protected name: string;
    // 不能直接实例化，可以继承
    protected constructor(theName: string) { this.name = theName; }
}

// Employee 能够继承 Person
class Employee extends Person {
    private department: string;

    constructor(name: string, department: string) {
        super(name);
        this.department = department;
    }

    public getElevatorPitch() {
        return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
}

let howard = new Employee("Howard", "Sales");
let john = new Person("John"); // 错误: 'Person' 的构造函数是被保护的.
```

### 只读属性

```TypeScript
class Octopus {
    readonly name: string;
    readonly numberOfLegs: number = 8;
    constructor (theName: string) {
        this.name = theName;
    }
}
let dad = new Octopus("Man with the 8 strong legs");
dad.name = "Man with the 3-piece suit"; // 错误! name 是只读的.
```

### 参数属性

```TypeScript
class Animal {

    // 参数属性，添加访问限定符
    // 创建并初始化私有成员 name
    constructor(private name: string) { }

    move(distanceInMeters: number) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}
```

对构造函数参数添加访问限定符，会创建和初始化一个成员（合并声明和赋值）。  

### 存取器 get/set

要求 >= ECMAScript 5 。  

```TypeScript
let passcode = "secret passcode";

class Employee {
    private _fullName: string;

    get fullName(): string {
        return this._fullName;
    }

    set fullName(newName: string) {
        if (passcode && passcode == "secret passcode") {
            this._fullName = newName;
        }
        else {
            console.log("Error: Unauthorized update of employee!");
        }
    }
}

let employee = new Employee();
employee.fullName = "Bob Smith";
if (employee.fullName) {
    alert(employee.fullName);
}
```

有 `get` 无 `set` - 推断为 -> `readonly` 。  

### 静态属性

通过 `static` 声明，使用 **类名** 来访问

```TypeScript
class Grid {
    static origin = {x: 0, y: 0};
    calculateDistanceFromOrigin(point: {x: number; y: number;}) {
        let xDist = (point.x - Grid.origin.x);
        let yDist = (point.y - Grid.origin.y);
        return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
    }
    constructor (public scale: number) { }
}
```

### 抽象类

通过 `abstract` 声明抽象类和抽象方法。  
抽象方法不包含具体实现，且 **必须** 在派生类中实现

```TypeScript
abstract class Department {

    constructor(public name: string) {
    }

    printName(): void {
        console.log('Department name: ' + this.name);
    }

    abstract printMeeting(): void; // 必须在派生类中实现
}

class AccountingDepartment extends Department {

    constructor() {
        // 在派生类的构造函数中必须调用 super()
        super('Accounting and Auditing'); 
    }

    printMeeting(): void {
        console.log('The Accounting Department meets each Monday at 10am.');
    }

    generateReports(): void {
        console.log('Generating accounting reports...');
    }
}

let department: Department; // 允许创建一个对抽象类型的引用
department = new Department(); // 错误: 不能创建一个抽象类的实例
department = new AccountingDepartment(); // 允许对一个抽象子类进行实例化和赋值
department.printName();
department.printMeeting();
department.generateReports(); // 错误: 方法在声明的抽象类中不存在
```

### 高级技巧

#### 把类当接口使用

```TypeScript
class Point {
    x: number;
    y: number;
}

interface Point3d extends Point {
    z: number;
}

let point3d: Point3d = {x: 1, y: 2, z: 3};
```

## 函数

### 函数类型

```TypeScript
let myAdd = function(x: number, y: number): number { return x + y; };

// 完整函数类型

// 函数和返回值类型之前使用(=>)符号
let myAdd: (x:number, y:number) => number =
    function(x: number, y: number): number { return x + y; };

// 推断类型(按上下文归类)

// myAdd has the full function type
let myAdd = function(x: number, y: number): number { return x + y; };

// 参数类型匹配即为有效，不在乎参数名
let myAdd: (baseValue: number, increment: number) => number =
    function(x, y) { return x + y; };
```

### 可选参数、默认参数和剩余参数

可选参数在必要参数之后。  
默认参数如果出现在必要参数前，需要明确传入参数为 `undefined` 来使用默认值。  
剩余参数当做个数不限的可选参数。  
可选参数与末尾的默认参数共享参数类型。  

```TypeScript
// 可选参数
function buildName(firstName: string, lastName?: string) {
    if (lastName)
        return firstName + " " + lastName;
    else
        return firstName;
}

// 默认参数
function buildName(firstName: string, lastName = "Smith") {
    return firstName + " " + lastName;
}

// 剩余参数
// restOfName 个数：0~n
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + " " + restOfName.join(" ");
}
```

可选参数和默认参数共享类型 `(firstName: string, lastName?: string) => string` 。  

### `this` 和箭头函数

1. this 为 window  
   严格模式下，为 undefined  

```TypeScript
let deck = {
	suits: ["hearts", "spades", "clubs", "diamonds"],
	cards: Array(52),
	createCardPicker: function() {
		// this --> deck
		return function() {
			// this --> window/global
			let pickedCard = Math.floor(Math.random() * 52);
			let pickedSuit = Math.floor(pickedCard / 13);
			
			return {suit: this.suits[pickedSuit], card: pickedCard % 13};
		}
	}
}

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();
// 返回的函数 this 指向 window/global 
alert("card: " + pickedCard.card + " of " + pickedCard.suit);
```

2. `this` 为 `deck`（箭头函数创建时作用域）  
   设置 `--noImplicitThis` 标记时，编译器会指出 `this.suits[pickedSuit]` 中的 `this` 类型为 `any`  

```TypeScript
let deck = {
	suits: ["hearts", "spades", "clubs", "diamonds"],
	cards: Array(52),
	createCardPicker: function() {
		// 声明时，绑定 this
		return () => {
			let pickedCard = Math.floor(Math.random() * 52);
			let pickedSuit = Math.floor(pickedCard / 13);
			
			return {suit: this.suits[pickedSuit], card: pickedCard % 13};
		}
	}
}
```

3. `this` 参数  
   `this` 为 `Deck` 类型  

```TypeScript
// 声明 this 类型，期望在 Deck 对象上调用
// 设置 `--noImplicitThis` 标记时，编译器会不会报错，
createCardPicker: function(this: Deck) {
	return () => {
		let pickedCard = Math.floor(Math.random() * 52);
		let pickedSuit = Math.floor(pickedCard / 13);

		return {suit: this.suits[pickedSuit], card: pickedCard % 13};
	}
}
```

### 回调函数里的 `this` 函数

回调函数被调用时，当作普通函数执行，this 将为 undefined（严格模式） 。    

```ts
interface UIElement {
	// 库函数作者声明 this
	// this: void 表明不需要一个 this 类型
	addClickListener(onclick: (this: void, e: Event) => void): void;
}
```

为调用代码的 this 添加类型注解：  

```ts
class Handler {
	info: string;
	onClickBad(this: Handler, e: Event) {
		this.info = e.message;
	}
}
let h = new Handler();
uiElement.addClickListener(h.onClickBad); // 报错
```

修改为：  

```ts
class Handler {
	info: string;
	onClickGood(this: void, e: Event) {
		// 不能使用 this
		console.log('clicked!');
	}
}
let h = new Handler();
uiElement.addClickListener(h.onClickGood);
```

要传给期望接收 `this: void` 的函数，只能使用箭头函数 `onClickGood = (e: Event) => { this.info = e.message }` 。  

缺点：  
- 每一个 Handler 对象上创建一个箭头函数（实例方法）
- 方法（原型方法）只会被创建一次，添加到 Handler 原型链上，不同 Handler 对象之间共享 ([类各方法示例](./ES6##类各方法示例))

### 重载

```TypeScript
let suits = ["hearts", "spades", "clubs", "diamonds"];

// 只有两个重载定义：接受对象或数字
function pickCard(x: {suit: string; card: number; }[]): number;
function pickCard(x: number): {suit: string; card: number; };
// 不属于重载列表的一部分
function pickCard(x: any): any {
    // Check to see if we're working with an object/array
    // if so, they gave us the deck and we'll pick the card
    if (typeof x == "object") {
        let pickedCard = Math.floor(Math.random() * x.length);
        return pickedCard;
    }
    // Otherwise just let them pick the card
    else if (typeof x == "number") {
        let pickedSuit = Math.floor(x / 13);
        return { suit: suits[pickedSuit], card: x % 13 };
    }
}
let myDeck = [
	{ suit: "diamonds", card: 2 }, 
	{ suit: "spades", card: 10 }, 
	{ suit: "hearts", card: 4 }
];
let pickedCard1 = myDeck[pickCard(myDeck)];
console.log("card: " + pickedCard1.card + " of " + pickedCard1.suit);

let pickedCard2 = pickCard(15);
console.log("card: " + pickedCard2.card + " of " + pickedCard2.suit);
```

按顺序匹配重载列表，所以最精确的定义应放在最前面。

## 泛型

可以创建 **泛型接口**、**泛型类**，但==不能==创建 **泛型枚举**、**泛型命名空间**。  
使用类型变量 `T` 捕获传入的类型。

```TypeScript
// 泛型函数
function identity<T>(arg: T): T {
    return arg;
}

// 使用方法
// 1.传入所有参数，包括类型参数
let output = identity<string>("myString");
// 2.类型推论
let output = identity("myString");
```

![](TypeScript.assets/image-20221128162521959.png)

### 使用泛型变量

对于变量没有 `.length` 属性，将报错。  
如果操作 `T` 类型的数组，则应该存在 `.length` 属性。

```TypeScript
function loggingIdentity<T>(arg: T[]): T[] {
    console.log(arg.length);
    return arg;
}
// 或
function loggingIdentity<T>(arg: Array<T>): Array<T> {
    console.log(arg.length);
    return arg;
}
```

### 泛型类型

```TypeScript
function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: <T>(arg: T) => T = identity;

// 泛型参数名可以不同，只需数量和使用方式对应即可
let myIdentity: <U>(arg: U) => U = identity;
```

也可以使用 **调用签名的对象字面量** 定义：

```TypeScript
let myIdentity: {<T>(arg: T): T} = identity;

// 写为泛型接口
// 将泛型参数写在 **签名里**
interface GenericIdentityFn {
    <T>(arg: T): T;
}

function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: GenericIdentityFn = identity;

// 将泛型参数当做 **接口的参数**
interface GenericIdentityFn<T> {
    (arg: T): T;
}

function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
```

### 泛型类

泛型类指 **实例部分的类型**，静态部分不能使用泛型类型。

```TypeScript
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```

### 泛型约束

通过接口和 `extend` 关键字实现对 `T` 约束：

```TypeScript
interface Lengthwise {
    length: number;
}
// 必须包含 length 属性
function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}
```

定义约束后，只适用于符合约束类型的值。

### 在泛型约束中使用泛型类型

```TypeScript
// 约束 K 必须是 T 的属性(键)：K extends keyof T
function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a"); // okay
getProperty(x, "m"); // error: Argument of type 'm' isn't assignable to 'a' | 'b' | 'c' | 'd'.
```

### 在泛型里使用类类型

引用构造函数的类类型，创建工厂函数：

```TypeScript
// 约束 c 是一个 new 方法并返回 T 类型
function create<T>(c: {new(): T; }): T {
    return new c();
}
```

使用原型属性推断并约束构造函数与类实例的关系：

```TypeScript
class BeeKeeper {
    hasMask: boolean;
}

class ZooKeeper {
    nametag: string;
}

class Animal {
    numLegs: number;
}

class Bee extends Animal {
    keeper: BeeKeeper;
}

class Lion extends Animal {
    keeper: ZooKeeper;
}
// `c: new () => A` 表明 c 是一个类 而不是 c 的实例
function createInstance<A extends Animal>(c: new () => A): A {
    return new c();
}

createInstance(Lion).keeper.nametag;  // 类型检查
createInstance(Bee).keeper.hasMask;   // 类型检查
```

### 泛型工具类型

1. `Partial<T>`：将类型 T 中的属性转化为可选
2. `Required<T>`：将类型 T 中的属性转为为必输
3. `Readonly<T>`：将类型 T 中属性都转为只读
4. `NonNullable<T>`：移除对象中所有可为空的属性
5. `Exclude<T, M>`：排除类型 T 中的 M 属性
6. `Extract<T, M>`：只保留类型 T 中的 M 属性
7. `Pick<T, N | M>`：只选择类型 T 中的 M 和 N 属性
8. `Omit<T, M>`：只排除类型 T 中的 M 属性

## 枚举

枚举成员具有一个数字值，为常数或计算得出的值。  
枚举成员满足以下条件，当做常数：
- 不具有初始化函数、之前枚举成员为常数
  - 当前成员的值为上一个的值 +1
  - 第一枚举成员如果没有初始化方法则初始值为 0
- 使用 **常数枚举表达式** 初始化
  - 数字字面量
  - 引用之前定义的常数枚举成员（如果这个成员在同一枚举类型中定义，可使用非限定名引用）
  - 带括号的常数枚举表达式
  - `+`, `-`, `~`  一元运算符应用于常数枚举表达式
  - `+`, `-`, `*`, `/`, `%`, `<<`, `>>`, `>>>`, `&`, `|`, `^`  二元运算符，常数枚举表达式作为其一个操作对象（求值后为 `NaN` 或 `undefined` 编译时报错）

所有其他情况的枚举成员被当做需要计算得出的值。

```TypeScript
enum FileAccess {
    // constant members
    None, // 0
    Read    = 1 << 1, // 2
    Write   = 1 << 2, // 4
    ReadWrite  = Read | Write, // 6
    // computed member
    G = "123".length // 3
}
```

枚举在运行时为一个真实存在的对象，包含双向映射。  
引用枚举成员会生成一次属性访问，但永远不会内联。
>**内联**  
>不内联：
>
>```ts
>enum Enum {
>    A
>}
>let a = Enum.A;
>let nameOfA = Enum[a]; // "A"
>// 编译成(不内联)：
>var Enum;
>(function (Enum) {
>    Enum[Enum["A"] = 0] = "A";
>})(Enum || (Enum = {}));
>var a = Enum.A;
>var nameOfA = Enum[a]; // "A"
>```
>
>内联：
>
>```ts
>const enum Directions {
>    Up,
>    Down,
>    Left,
>    Right
>}
>let directions = [Directions.Up, Directions.Down, Directions.Left, irections.Right]
>// 编译成：
>var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
>```
>

### 常数枚举

为避免生成多余代码和间接引用，可使用常数枚举（`const enum`）。

```TypeScript
const enum Direction {
	// ...
}
```

1. 只能使用 **常数枚举表达式**
2. 在编译阶段会被删除
3. 常数枚举成员在使用的地方被内联起来，不可能有计算成员

> 非计算枚举成员的引用始终是内联的。  
> 计算枚举成员在其值编译时未知，非计算成员在其值编译时已知。

### 外部枚举

用来描述已经存在的枚举类型的形状。

```TypeScript
declare enum Enum {
    A = 1,
    B,
    C = 2
}
```

外部枚举和非外部枚举之间的重要的区别：  
- 在 **正常的枚举** 里，没有初始化方法的成员被当成 **常数成员**。 
- 对于 **非常数的外部枚举** 而言，没有初始化方法时被当做 **需要经过计算** 的。

## 类型推论

推断发生时机：  
- 初始化变量和成员
- 设置默认参数值
- 决定函数返回值

### 最佳通用类型

通用类型选自候选类型；没有找到最佳通用候选类型，结果为联合数组类型。

```TypeScript
let zoo = [new Rhino(), new Elephant(), new Snake()];
// 推断结果：(Rhino | Elephant | Snake)[]

// 候选类型不想使用，需明确指出类型
let zoo: Animal[] = [new Rhino(), new Elephant(), new Snake()];
```

### 上下文类型

发生表达式类型与所处位置相关时。  
通常包含函数的参数，赋值表达式的右边，类型断言，对象成员和数组字面量和返回值语句。  

```ts
// onmousedown -> null
// 不加 mouseEvent 类型会报错(会根据左边 onmousedown 推断)
window.onmousedown = function(mouseEvent: any) {
    console.log(mouseEvent.button);  //<- Now, no error is given
};

// 上下文类型也会做为最佳通用类型的候选类型
// 四个候选类型：Animal，Rhino，Elephant和Snake。
function createZoo(): Animal[] {
    return [new Rhino(), new Elephant(), new Snake()];
}
```

## 类型兼容性

类型兼容性是基于结构子类型的。  
结构类型是一种只使用其成员来描述类型的方式。  
与 **名义（nominal）类型**(数据类型的兼容性或等价性是通过明确的声明和/或类型的名称来决定的，如 C##、Java) 形成对比。  

```ts
interface Named {
    name: string;
}

class Person {
    name: string;
}

let p: Named;
// OK, because of structural typing
p = new Person();
```

在名义类型中会报错，没有明确说明 Person 类实现了 Named 接口。  

### 比较原始类型和对象类型

x 要兼容 y，y 至少具有 x 相同的属性。（多 -> 少）

```TypeScript
interface Named {
    name: string;
}

let x: Named;
// y's inferred type is { name: string; location: string; }
let y = { name: 'Alice', location: 'Seattle' };
x = y;
```

检查函数参数时使用同样的规则。

```ts
function greet(n: Named) {
    alert('Hello, ' + n.name);
}
greet(y); // OK
```

### 比较两个函数

1. 比较 **参数列表**，只看类型是否相同。（少 -> 多）

```TypeScript
let x = (a: number) => 0;
let y = (b: number, s: string) => 0;

y = x; // OK
x = y; // Error
```

2. 源函数的 **返回值类型** 必须是目标函数返回值类型的子类型。（多 -> 少）

```TypeScript
let x = () => ({name: 'Alice'});
let y = () => ({name: 'Alice', location: 'Seattle'});

x = y; // OK
y = x; // Error, because x() lacks a location property
```

#### 函数参数双向协变

- 协变 _(Covariant)_：协变表示 `Comp<T>` 类型兼容和 `T` 的一致。
- 逆变 _(Contravariant)_：逆变表示 `Comp<T>` 类型兼容和 `T` 相反。
- 双向协变 _(Covariant)_：双向协变表示 `Comp<T>` 类型双向兼容。
- 不变 _(Bivariant)_：不变表示 `Comp<T>` 双向都不兼容。

**函数这一类型是逆变的。**  
>假设 `(p: Dog) => void` 为 `Action<Dog>`，`(p: Animal) => void` 为 `Action<Animal>`。  
函数就是接收参数，然后做一些处理，最后返回结果。函数就是一系列操作的集合，而对于一个具体的类型 `Dog` 作为参数，函数不仅仅可以把它当成 `Animal`，来执行一些操作；还可以访问其作为 `Dog` 独有的一些属性和方法，来执行另一部分操作。因此 `Action<Dog>` 的操作肯定比 `Action<Animal>` 要多，因此后者是前者的子集，兼容性是相反的，是逆变。  

TS 中函数同时支持协变，即双向协变。  
通过设置编译选项 `--strictFunctionTypes true` 来保持函数的逆变性而关闭协变性。

```TypeScript
enum EventType { Mouse, Keyboard }

interface Event { timestamp: number; }
interface MouseEvent extends Event { x: number; y: number }
interface KeyEvent extends Event { keyCode: number }

function listenEvent(eventType: EventType, handler: (n: Event) => void) {
    /* ... */
}

// Unsound, but useful and common
listenEvent(EventType.Mouse, (e: MouseEvent) => console.log(e.x + ',' + e.y));

// Undesirable alternatives in presence of soundness
listenEvent(EventType.Mouse, (e: Event) => console.log((<MouseEvent>e).x + ',' + (<MouseEvent>e).y));

listenEvent(EventType.Mouse, <(e: Event) => void>((e: MouseEvent) => console.log(e.x + ',' + e.y)));

// Still disallowed (clear error). Type safety enforced for wholly incompatible types
listenEvent(EventType.Mouse, (e: number) => console.log(e));
```

#### 函数重载

源函数的每个重载都要在目标函数上找到对应的函数签名。

### 枚举

枚举类型与数字类型兼容，并且数字类型与枚举类型兼容。不同枚举类型之间是不兼容的。

### 类

类与对象字面量和接口差不多，但有一点不同：类有静态部分和实例部分的类型。  
比较两个类类型的对象时，只有实例的成员会被比较。  
静态成员和构造函数不在比较的范围内。  

#### 类的私有成员和受保护成员

目标类型包含一个私有成员（或受保护成员），则源类型必须包含同一个类的这个私有成员（或受保护成员）。  
允许子类赋值给父类，但是不能赋值给其它有同样类型的类。  

### 泛型

TODO: 泛型类型兼容性

```TypeScript
interface Empty<T> {
}
let x: Empty<number>;
let y: Empty<string>;

x = y;  // OK, because y matches structure of x

interface NotEmpty<T> {
    data: T;
}
let x: NotEmpty<number>;
let y: NotEmpty<string>;

x = y;  // Error, because x and y are not compatible
```

没指定泛型类型时，看做 `any` 进行比较。

```TypeScript
let identity = function<T>(x: T): T {
    // ...
}

let reverse = function<U>(y: U): U {
    // ...
}

identity = reverse;  // OK, because (x: any) => any matches (y: any) => any
```

## 高级类型

### 交叉类型 Intersection Types(`&`)

多种类型的集合，联合对象将具有所联合类型的所有成员。  

```ts
interface People {
  age: number,
  height： number
}
interface Man{
  sex: string
}
const lilei = (man: People & Man) => {
  console.log(man.age)
  console.log(man.height)
  console.log(man.sex)
}
lilei({age: 18,height: 180,sex: 'male'});
```

### 联合类型 Union Types(`|`)

多个类型的合并类型。  

```ts
// 基础联合类型
let a: string | number;
a = 1; //ok 
a= "a"//ok

// 对象联合类型
// 只能访问共有成员
interface Women{
  age: number,
  sex: string,
  cry(): void
}
interface Man{
  age: number,
  sex: string,
}
declare function People(): Women | Man;
let people = People();
people.age = 18; //ok
people.cry();//error 非共同成员
```

### 类型保护与区分类型 Type Guards and Differentiating Types

如果想判断联合类型中是否存在某个非共有成员，可以使用类型断言。  

```ts
let pet = getSmallPet();

if ((<Fish>pet).swim) {
    (<Fish>pet).swim();
}
else {
    (<Bird>pet).fly();
}
```

这样就不会报错，但是不得不多次使用类型断言。

#### 用户自定义的类型保护

类型保护是一些表达式。  
定义一个函数，返回类型谓词 (`parameterName is Type`)。  
parameterName 必须是来自于当前函数签名里的一个参数名。  

```ts
function isFish(pet: Fish | Bird): pet is Fish {
    return (<Fish>pet).swim !== undefined;
}

// 'swim' 和 'fly' 调用都没有问题了
// TS 知道 if 分支是 Fish 类型，else 分支是 Bird 类型
if (isFish(pet)) {
    pet.swim();
}
else {
    pet.fly();
}
```

#### `typeof` 类型保护

识别形式：  
- `typeof v === "typename"`  
- `typeof v !== "typename"`  

`"typename"` 必须是 `"number"`，`"string"`，`"boolean"` 或 `"symbol"`；其他字符串不会被识别为类型保护。  

```ts
function test(value: number | string) {
	if (typeof value === 'number') {
		console.log(value);
	} else if (typeof value === 'string') {
		console.log(value);
	}
}
```

#### `instanceof` 类型保护

`instanceof` 的右侧要求是一个构造函数：  
- 此构造函数的 `prototype` 属性的类型，如果它的类型不为 `any` 的话
- 构造签名所返回的类型的联合

```ts
class Person {};
class Man extends Person {};
class Woman extends Person {};

function getName(name: Person) {
	if (name instanceof Man) {
		console.log(name);
	} else if (name instanceof Woman) {
		console.log(name);
	}
}
```

#### null 类型

声明变量不会自动包含 null 和 undefined (`--strictNullChecks`) 。  

```ts
let s = "foo";
s = null; // 错误, 'null'不能赋值给'string'
let sn: string | null = "bar";
sn = null; // 可以
sn = undefined; // error, 'undefined'不能赋值给'string | null'
```

TS 认为 `string | null` 、`string | undefined`、`string | null | undefined` 是不同的类型。  

#### 可选参数和可选属性

```ts
// `--strictNullChecks`时
// 自动添加 `| undefined`
// 可选参数
function f(x: number, y?: number) {
    return x + (y || 0);
}
f(1, 2);
f(1);
f(1, undefined);
f(1, null); // error, 'null' is not assignable to 'number | undefined'

// 可选属性
class C {
    a: number;
    b?: number;
}
let c = new C();
c.a = 12;
c.a = undefined; // error, 'undefined' is not assignable to 'number'
c.b = 13;
c.b = undefined; // ok
c.b = null; // error, 'null' is not assignable to 'number | undefined'
```

#### 类型保护和类型断言

1.去除 null  

```ts
function f(sn: string | null): string {
    if (sn == null) {
        return "default";
    }
    else {
        return sn;
    }
}
// 短路运算符
function f(sn: string | null): string {
    return sn || "default";
}
```

2.使用类型断言去除 null 和 undefined  

```ts
function broken(name: string | null): string {
	function postfix(epithet: string) {
		// error, 'name' is possibly null
		return name.charAt(0) + '.  the ' + epithet; 
		// 使用 `!` 去除 null 和 undefined
		return name!.charAt(0) + '.  the ' + epithet; 
	}
	name = name || "Bob";
	return postfix("great");
}
```

编译器无法去除嵌套函数的 null ， 尤其是内部函数作为外部函数的返回值。  

### 类型别名

```ts
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
    if (typeof n === 'string') {
        return n;
    }
    else {
        return n();
    }
}
// 泛型，在别名声明右侧传入
type Container<T> = { value: T };
```

在属性中引用类型别名。  

```ts
type Tree<T> = {
    value: T;
    left: Tree<T>;
    right: Tree<T>;
}
```

与交叉类型一起使用。  

```ts
type LinkedList<T> = T & { next: LinkedList<T> };

interface Person {
    name: string;
}

var people: LinkedList<Person>;
var s = people.name;
var s = people.next.name;
var s = people.next.next.name;
var s = people.next.next.next.name;
```

类型别名不能出现在声明右侧的任何地方。  

```ts
type Yikes = Array<Yikes>; 
```

#### 接口 vs 类型别名

- 接口创建新的名字，可在任何地方使用。  
- 类型别名不能 extends 或 implements。 
- 优先使用接口，在联合类型或元组类型等时使用类型别名。  

```ts
// 复合类型
type aa=number
type name=string|number
let a:name=123
let b:aa=456
console.log(a)   //123
console.log(b)   //456
```

### 字面量类型

集合类型的子类型。如：字面量字符串类型是字符串类型的子类型。  
主要有字符串字面量类型、数字字面量类型和布尔字面量类型。  

**字符串字面量类型**  
指定字符串的固定值，配合联合类型、类型保护、类型别名，可以实现类似枚举类型的字符串。  

```ts
// 字符串字面量类型
type name1="小红"|"小明"|"小李"
function conName(name:name1):void{
    console.log(name)
}
conName("小红")  //小红 如果是这三个字符串以外的 则报错
```

区分函数重载。  

```ts
function createElement(tagName: "img"): HTMLImageElement;
function createElement(tagName: "input"): HTMLInputElement;
// ... more overloads ...
function createElement(tagName: string): Element {
    // ... code goes here ...
}
```

**字面量类型拓宽**  
所有通过 let 或 var 定义的变量、函数的形参、对象的非只读属性，满足 **指定了初始值** 且 **未显式添加类型注解** 的条件，推断的类型即为字面量类型拓宽。  

```ts
{
  let string = 'it is a string'; // 类型是 string
  let stringFunc = (str = 'it is a string') => str; // 类型是 (str?: string) => string;
  const specifiedStr = 'it is a string'; // 类型是 'it is a string'
  let strNew = specifiedStr; // 类型是 'string'
  let stringFuncNew = (str = specifiedStr) => str; // 类型是 (str?: string) => string;
}
```

因为 string 和 stringFunc 满足了 let、形参且未显式声明类型注解的条件，所以变量、形参的类型拓宽为 string（形参类型确切地讲是 string | undefined）。  
因为 specifiedStr 的常量不可变更，类型没有拓宽，所以 specifiedStr 的类型是 'it is a string' 字面量类型。  
因为 strNew 赋予的值 specifiedStr 的类型是字面量类型，且没有显式类型注解，所以变量、形参的类型也被拓宽了。  

```ts
{
  const specifiedStr: ' it is a string' = 'it is a string'; // 类型是 '"it is a string"'
  let str2 = specifiedStr; // 即便使用 let 定义，类型是 'it is a string'
}
```

如果添加显示类型注解，则能控制类型拓宽行为。  

**数字字面量类型和布尔字面量类型使用方法同上。**  

### 可辨识联合 Discriminated Unions

可辨识联合（标签联合或代数数据类型）：合并单例类型，联合类型，类型保护和类型别名。  

```ts
interface Square {
    kind: "square";
    size: number;
}
interface Rectangle {
    kind: "rectangle";
    width: number;
    height: number;
}
interface Circle {
    kind: "circle";
    radius: number;
}

type Shape = Square | Rectangle | Circle;

function area(s: Shape) {
    switch (s.kind) {
        case "square": return s.size * s.size;
        case "rectangle": return s.height * s.width;
        case "circle": return Math.PI * s.radius ** 2;
    }
}
```

#### 完整性检查

添加了 Triangle 到 Shape，我们同时还需要更新 area。  

```ts
type Shape = Square | Rectangle | Circle | Triangle;
function area(s: Shape) {
    switch (s.kind) {
        case "square": return s.size * s.size;
        case "rectangle": return s.height * s.width;
        case "circle": return Math.PI * s.radius ** 2;
    }
    // should error here - we didn't handle case "triangle"
}
```

**解决方法**  

```ts
// 1.启用--strictNullChecks并且指定一个返回值类型
function area(s: Shape): number { // error: returns number | undefined
    switch (s.kind) {
        case "square": return s.size * s.size;
        case "rectangle": return s.height * s.width;
        case "circle": return Math.PI * s.radius ** 2;
    }
}

// 2.使用never类型
function assertNever(x: never): never {
    throw new Error("Unexpected object: " + x);
}
function area(s: Shape) {
    switch (s.kind) {
        case "square": return s.size * s.size;
        case "rectangle": return s.height * s.width;
        case "circle": return Math.PI * s.radius ** 2;
        default: return assertNever(s); // error here if there are missing cases
    }
}
```

### 多态的 `this` 类型

多态的 this 类型表示的是某个包含类或接口的子类型。这被称做 F-bounded 多态性。  

```ts
class BasicCalculator {
    public constructor(protected value: number = 0) { }
    public currentValue(): number {
        return this.value;
    }
    public add(operand: number): this {
        this.value += operand;
        return this;
    }
    public multiply(operand: number): this {
        this.value *= operand;
        return this;
    }
    // ... other operations go here ...
}

let v = new BasicCalculator(2)
            .multiply(5)
            .add(1)
            .currentValue();

class ScientificCalculator extends BasicCalculator {
    public constructor(value = 0) {
        super(value);
    }
    public sin() {
        this.value = Math.sin(this.value);
        return this;
    }
    // ... other operations go here ...
}

let v = new ScientificCalculator(2)
        .multiply(5)
        .sin()
        .add(1)
        .currentValue();
```

### 索引类型 Index types

```ts
// JavaScript模式是从对象中选取属性的子集
function pluck(o, names) {
    return names.map(n => o[n]);
}

// TypeScript里使用此函数
function pluck<T, K extends keyof T>(o: T, names: K[]): T[K][] {
  return names.map(n => o[n]);
}

interface Person {
    name: string;
    age: number;
}
let person: Person = {
    name: 'Jarid',
    age: 35
};
let strings: string[] = pluck(person, ['name']); // ok, string[]
```

#### `keyof T` 索引类型查询操作符

对于任何类型 `T`，`keyof T` 的结果为 `T` 上已知的公共属性名的联合。  
可以在像 `pluck` 函数这类上下文里使用。  

```ts
let personProps: keyof Person; // 'name' | 'age'
```

#### `T[K]` 索引访问操作符

可以在普通的上下文里使用 `T[K]` ，只要确保类型变量 `K extends keyof T` 即可。  

```ts
function getProperty<T, K extends keyof T>(o: T, name: K): T[K] {
    return o[name]; // o[name] is of type T[K]
}
```

`getProperty` 里的 `o: T` 和 `name: K` ，意味着 `o[name]: T[K]` 。

#### 索引类型和字符串索引签名

`keyof` 和 `T[K]` 与字符串索引签名进行交互。 如果你有一个带有字符串索引签名的类型，那么 `keyof T` 会是 `string`。 并且 `T[string]` 为索引签名的类型。  

```ts
interface Map<T> {
    [key: string]: T;
}
let keys: keyof Map<number>; // string
let value: Map<number>['foo']; // number
```

### 映射类型

将已知的类型的所有属性转换为 **可选** 或 **只读**。  
映射类型可以从旧类型创建新类型。  
编译器知道在添加任何新属性之前可以拷贝所有存在的属性修饰符。  

```ts
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
}

type Partial<T> = {
    [P in keyof T]?: T[P];
}

type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
}

type Record<K extends string, T> = {
    [P in K]: T;
}
```

>注意  
>1.Readonly，Partial 和 Pick 是同态的，但 Record 不是。  
>因为 `Record` 并不需要输入类型来拷贝属性，所以它不属于同态。  
>非同态类型本质上会创建新的属性，因此它们不会从它处拷贝属性修饰符。  
>2.`Readonly<T>`、`Partial<T>`、`Pick` 和 `Record` 被包含进了 TypeScript 的标准库里。  

例子 (代理)：  

```ts
type Proxy<T> = {
    get(): T;
    set(value: T): void;
}
type Proxify<T> = {
    [P in keyof T]: Proxy<T[P]>;
}
function proxify<T>(o: T): Proxify<T> {
   // ... wrap proxies ...
}
let proxyProps = proxify(props);
```

#### 由映射类型进行推断

包装了属性，就需要拆包。  

```ts
function unproxify<T>(t: Proxify<T>): T {
    let result = {} as T;
    for (const k in t) {
        result[k] = t[k].get();
    }
    return result;
}

let originalProps = unproxify(proxyProps);
```

>拆包推断只适用于同态的映射类型。  
>如果映射类型不是同态的，那么需要给拆包函数一个明确的类型参数。  

## Symbols

1. `Symbols` 不可改变且唯一。

```TypeScript
// 通过Symbol构造函数创建
let sym1 = Symbol();
let sym2 = Symbol("key"); // 可选的字符串key
let sym3 = Symbol("key");

sym2 === sym3; // false, symbols是唯一的
```

2. 可用作对象属性的键

```TypeScript
let sym = Symbol();
let obj = {
	[sym]: "value"
};
console.log(obj[sym]); // "value"
```

3. 与计算出的属性名声明相结合来声明对象的属性和类成员

```TypeScript
const getClassNameSymbol = Symbol();

class C {
    [getClassNameSymbol](){
       return "C";
    }
}

let c = new C();
let className = c[getClassNameSymbol](); // "C"
```

### 内置 Symbols

- `Symbol.hasInstance`  
  方法，会被 `instanceof` 运算符调用。构造器对象用来识别一个对象是否是其实例。  
- `Symbol.isConcatSpreadable`  
  布尔值，表示当在一个对象上调用 `Array.prototype.concat` 时，这个对象的数组元素是否可展开。  
- `Symbol.iterator`  
  方法，被 `for-of` 语句调用。返回对象的默认迭代器。  
- `Symbol.match`  
  方法，被 `String.prototype.match` 调用。正则表达式用来匹配字符串。  
- `Symbol.replace`  
  方法，被 `String.prototype.replace` 调用。正则表达式用来替换字符串中匹配的子串。  
- `Symbol.search`  
  方法，被 `String.prototype.search` 调用。正则表达式返回被匹配部分在字符串中的索引。  
- `Symbol.species`  
  函数值，为一个构造函数。用来创建派生对象。  
- `Symbol.split`  
  方法，被 `String.prototype.split` 调用。正则表达式来用分割字符串。  
- `Symbol.toPrimitive`  
  方法，被 `ToPrimitive` 抽象操作调用。把对象转换为相应的原始值。  
- `Symbol.toStringTag`  
  方法，被内置方法 `Object.prototype.toString` 调用。返回创建对象时默认的字符串描述。  
- `Symbol.unscopables`  
  对象，它自己拥有的属性会被 `with` 作用域排除在外。  

## Iterators 和 Generators

### 可迭代性

一个对象实现 `Symbol.iterator` 属性，即是可迭代的。如：`Array`，`Map`，`Set`，`String`，`Int32Array`，`Uint32Array`。对象上的 `Symbol.iterator` 函数负责返回供迭代的值。

### `for..of` vs. `for..in`  语句

均可迭代一个列表，但迭代的值不同。  
`for...in` 迭代的是对象的 **键**，`for...of` 迭代对象的 **值**。  
`for...in` 可以操作任何对象，`for...of` 只关注迭代对象的值。  

当生成目标为 ES5 或 ES3，迭代器只允许在 `Array` 类型上使用。

## 模块

### 导出

通过 `export` 导出，`import` 导入。  
变量、函数、类、类型别名和接口都可 `export` 导出。

```TypeScript
class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}
export { ZipCodeValidator };
export { ZipCodeValidator as mainValidator };// 可重命名
```

### 重新导出

```TypeScript
export class ParseIntBasedZipCodeValidator {
    isAcceptable(s: string) {
        return s.length === 5 && parseInt(s).toString() === s;
    }
}

// 导出原先的验证器但做了重命名
export {ZipCodeValidator as RegExpBasedZipCodeValidator} from "./ZipCodeValidator";

// 聚合
export * from "./StringValidator"; // exports interface StringValidator
export * from "./LettersOnlyValidator"; // exports class LettersOnlyValidator
export * from "./ZipCodeValidator";  // exports class ZipCodeValidator
```

### 导入

```TypeScript
import { ZipCodeValidator } from "./ZipCodeValidator";
let myValidator = new ZipCodeValidator();

// 重命名
import { ZipCodeValidator as ZCV } from "./ZipCodeValidator";
```

将整个模块导入到一个变量，并通过它来访问模块的导出部分：

```TypeScript
import * as validator from "./ZipCodeValidator";
let myValidator = new validator.ZipCodeValidator();
```

具有副作用的导入模块：

```TypeScript
import "./my-module.js";
```

### 默认导出

类和函数声明可以直接被标记为默认导出，标记为默认导出的类和函数的名字是可以省略的。  
一个模块只能有一个 `default` 导出。  
_ZipCodeValidator.ts_

```TypeScript
export default class ZipCodeValidator {
    static numberRegexp = /^[0-9]+$/;
    isAcceptable(s: string) {
        return s.length === 5 && ZipCodeValidator.numberRegexp.test(s);
    }
}
```

_Test.ts_

```TypeScript
import validator from "./ZipCodeValidator";

let myValidator = new validator();
```

默认导出也可以是一个值。

### `export =`  和  `import = require()`

> CommonJS 和 AMD 的环境里都有一个 exports 变量，这个变量包含了一个模块的所有导出内容。  
> CommonJS 和 AMD 的 `exports` 都可以被赋值为一个对象, 这种情况下其作用就类似于 es6 语法里的默认导出，即 `export default` 语法了。但 `export default` 不兼容 `exports`。

为支持 CommonJS 和 AMD 的 `exports`，TypeScript 提供了 `export =`。（定义一个模块的导出对象，对象指类、接口、命名空间、函数或枚举）。

> 使用 `export =` 导出一个模块，必须使用 `import module = require("module")` 导入此模块。

_ZipCodeValidator.ts_

```TypeScript
let numberRegexp = /^[0-9]+$/;
class ZipCodeValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}
export = ZipCodeValidator;
```

_Test.ts_

```TypeScript
import zip = require("./ZipCodeValidator");

// Some samples to try
let strings = ["Hello", "98052", "101"];

// Validators to use
let validator = new zip();

// Show whether each string passed each validator
strings.forEach(s => {
  console.log(`"${ s }" - ${ validator.isAcceptable(s) ? "matches" : "does not match" }`);
});
```

### 可选的模块加载和其他高级加载场景

通过 `import id = require("...")` 实现模块导出的类型，模块加载器会被动态调用（通过 `require`）。

### 使用其他的 JavaScript 库

#### 外部模块

_node.d.ts (simplified excerpt)_

```TypeScript
declare module "url" {
    export interface Url {
        protocol?: string;
        hostname?: string;
        pathname?: string;
    }

    export function parse(urlStr: string, parseQueryString?, slashesDenoteHost?): Url;
}

declare module "path" {
    export function normalize(p: string): string;
    export function join(...paths: any[]): string;
    export let sep: string;
}
```

可以 `/// <reference>` `node.d.ts` 并且使用 `import url = require("url");` 或 `import * as URL from "url"` 加载模块。

```TypeScript
/// <reference path="node.d.ts"/>
import * as URL from "url";
let myUrl = URL.parse("http://www.typescriptlang.org");
```

#### 外部模块简写

_declarations.d.ts_

```TypeScript
declare module "hot-new-module";
```

简写模块里所有导出的类型将是 `any`。

```TypeScript
import x, {y} from "hot-new-module";
x(y);
```

#### 模块声明通配符

某些模块加载器如 [SystemJS](https://github.com/systemjs/systemjs/blob/master/docs/overview.md##plugin-syntax)  和  [AMD](https://github.com/amdjs/amdjs-api/blob/master/LoaderPlugins.md) 支持导入非 JavaScript 内容。它们通常会使用一个前缀或后缀来表示特殊的加载语法。模块声明通配符可以用来表示这些情况。

```TypeScript
declare module "*!text" {
    const content: string;
    export default content;
}
// Some do it the other way around.
declare module "json!*" {
    const value: any;
    export default value;
}
```

导入匹配 `"*!text"` 或 `"json!*"` 的内容：

```TypeScript
import fileContent from "./xyz.txt!text";
import data from "json!http://example.com/data.json";
console.log(data, fileContent);
```

#### UMD 模块

有些模块设计为兼容多个模块加载器，或不使用（全局变量），以 UMD 为代表的。  
其可以通过导入的形式或全局变量的形式访问。  
_math-lib.d.ts_

```TypeScript
export function isPrime(x: number): boolean;
export as namespace mathLib;
```

```TypeScript
// 通过模块导入
import { isPrime } from "math-lib";
isPrime(2);
mathLib.isPrime(2); // 错误: 不能在模块内使用全局定义。

// 全局变量
// 只能在某个脚本（不带有模块导入或导出的脚本文件）使用
mathLib.isPrime(2);
```

### 创建模块结构指导

- 尽可能在顶层导出
- 只导出单个 `class` 或 `function`，使用 `export default`
- 导出多个对象，放在顶层里导出
- 明确列出导入名字
- 导入大量内容使用命名空间导入模式
- 使用重新导出进行扩展
- 模块里不要使用命名空间

## 命名空间

```TypeScript
namespace Validation {
    export interface StringValidator {
        isAcceptable(s: string): boolean;
    }

    const lettersRegexp = /^[A-Za-z]+$/;
    const numberRegexp = /^[0-9]+$/;

    export class LettersOnlyValidator implements StringValidator {
        isAcceptable(s: string) {
            return lettersRegexp.test(s);
        }
    }

    export class ZipCodeValidator implements StringValidator {
        isAcceptable(s: string) {
            return s.length === 5 && numberRegexp.test(s);
        }
    }
}

// Some samples to try
let strings = ["Hello", "98052", "101"];

// Validators to use
let validators: { [s: string]: Validation.StringValidator; } = {};
validators["ZIP code"] = new Validation.ZipCodeValidator();
validators["Letters only"] = new Validation.LettersOnlyValidator();

// Show whether each string passed each validator
for (let s of strings) {
    for (let name in validators) {
        console.log(`"${ s }" - ${ validators[name].isAcceptable(s) ? "matches" : "does not match" } ${ name }`);
    }
}
```

#### 多文件的命名空间

多个文件同一个命名空间。  
_Validation.ts_

```TypeScript
namespace Validation {
    export interface StringValidator {
        isAcceptable(s: string): boolean;
    }
}
```

_LettersOnlyValidator.ts_

```TypeScript
/// <reference path="Validation.ts" />
namespace Validation {
    const lettersRegexp = /^[A-Za-z]+$/;
    export class LettersOnlyValidator implements StringValidator {
        isAcceptable(s: string) {
            return lettersRegexp.test(s);
        }
    }
}
```

_ZipCodeValidator.ts_

```TypeScript
/// <reference path="Validation.ts" />
namespace Validation {
    const numberRegexp = /^[0-9]+$/;
    export class ZipCodeValidator implements StringValidator {
        isAcceptable(s: string) {
            return s.length === 5 && numberRegexp.test(s);
        }
    }
}
```

_Test.ts_

```TypeScript
/// <reference path="Validation.ts" />
/// <reference path="LettersOnlyValidator.ts" />
/// <reference path="ZipCodeValidator.ts" />

// Some samples to try
let strings = ["Hello", "98052", "101"];

// Validators to use
let validators: { [s: string]: Validation.StringValidator; } = {};
validators["ZIP code"] = new Validation.ZipCodeValidator();
validators["Letters only"] = new Validation.LettersOnlyValidator();

// Show whether each string passed each validator
for (let s of strings) {
    for (let name in validators) {
        console.log(`"${ s }" - ${ validators[name].isAcceptable(s) ? "matches" : "does not match" } ${ name }`);
    }
}
```

多文件确保所有编译后的代码被加载：

1. 所有的输入文件编译为一个输出文件，需要使用 `--outFile` 标记

```TypeScript
// 编译器会根据源码里的引用标签自动地对输出进行排序
tsc --outFile sample.js Test.ts

// 单独地指定每个文件
tsc --outFile sample.js Validation.ts LettersOnlyValidator.ts ZipCodeValidator.ts Test.ts
```

2. 编译每一个文件（默认方式），在页面通过 `<script>` 标签将 JavaScript 文件按顺序引入

```TypeScript
    <script src="Validation.js" type="text/javascript" />
    <script src="LettersOnlyValidator.js" type="text/javascript" />
    <script src="ZipCodeValidator.js" type="text/javascript" />
    <script src="Test.js" type="text/javascript" />
```

### 别名

使用 `import q = x.y.z` 创建别名，适用于任意标识符（包括导入的模块对象），类型、导入的具有命名空间含义的符号。

```TypeScript
namespace Shapes {
    export namespace Polygons {
        export class Triangle { }
        export class Square { }
    }
}

import polygons = Shapes.Polygons;
let sq = new polygons.Square(); // Same as "new Shapes.Polygons.Square()"
```

对于值来讲，`import` 会生成与原符号不同的引用，改变别名的 `var` 值不影响原始变量的值。

### 使用其他的 JavaScript 库

#### 外部命名空间

_D3.d.ts (部分摘录)_

```TypeScript
declare namespace D3 {
    export interface Selectors {
        select: {
            (selector: string): Selection;
            (element: EventTarget): Selection;
        };
    }

    export interface Event {
        x: number;
        y: number;
    }

    export interface Base extends Selectors {
        event: Event;
    }
}

declare var d3: D3.Base;
```

## 声明合并

声明创建三种实体：命名空间、类型和值。  
声明合并：针对同一名字的多个独立声明合并。

### 合并接口

非函数成员应该唯一，不唯一则必须具有相同类型，否则报错。

```TypeScript
interface Box {
    height: number;
    width: number;
}

interface Box {
    scale: number;
}

let box: Box = {height: 5, width: 6, scale: 10};
```

函数成员的同名会作为重载，后来的接口具有更高优先级。

```TypeScript
interface Cloner {
    clone(animal: Animal): Animal;
}

interface Cloner {
    clone(animal: Sheep): Sheep;
}

interface Cloner {
    clone(animal: Dog): Dog;
    clone(animal: Cat): Cat;
}
```

合并后：

```TypeScript
interface Cloner {
    clone(animal: Dog): Dog;
    clone(animal: Cat): Cat;
    clone(animal: Sheep): Sheep;
    clone(animal: Animal): Animal;
}
```

特例：出现特殊函数签名（有一个参数的类型是 **单一的字符串字面量**），将会提升到重载列表最顶端。

```TypeScript
interface Document {
    createElement(tagName: any): Element;
}
interface Document {
    createElement(tagName: "div"): HTMLDivElement;
    createElement(tagName: "span"): HTMLSpanElement;
}
interface Document {
    createElement(tagName: string): HTMLElement;
    createElement(tagName: "canvas"): HTMLCanvasElement;
}
```

合并后：

```TypeScript
interface Document {
    createElement(tagName: "canvas"): HTMLCanvasElement;
    createElement(tagName: "div"): HTMLDivElement;
    createElement(tagName: "span"): HTMLSpanElement;
    createElement(tagName: string): HTMLElement;
    createElement(tagName: any): Element;
}
```

### 合并命名空间

命名空间会创建 **命名空间** 和 **值**。  
**命名空间**：模块导出的同名接口合并。  
**值**：后来的导出成员会被加到已经存在的模块中。

```TypeScript
namespace Animals {
    export class Zebra { }
}

namespace Animals {
    export interface Legged { numberOfLegs: number; }
    export class Dog { }
}
```

合并后：

```TypeScript
namespace Animals {
    export interface Legged { numberOfLegs: number; }

    export class Zebra { }
    export class Dog { }
}
```

> 非导出成员仅在原有（合并前）命名空间可见。

### 命名空间与类和函数和枚举类型合并

命名空间可以与其他类型合并，只要定义符合合并类型定义。

#### 合并命名空间和类

内部类：

```TypeScript
class Album {
    label: Album.AlbumLabel;
}
namespace Album {
    export class AlbumLabel { }
}
```

扩展函数的属性：

```TypeScript
function buildLabel(name: string): string {
    return buildLabel.prefix + name + buildLabel.suffix;
}

namespace buildLabel {
    export let suffix = "";
    export let prefix = "Hello, ";
}

console.log(buildLabel("Sam Smith"));
```

扩展枚举型：

```TypeScript
enum Color {
    red = 1,
    green = 2,
    blue = 4
}

namespace Color {
    export function mixColor(colorName: string) {
        if (colorName == "yellow") {
            return Color.red + Color.green;
        }
        else if (colorName == "white") {
            return Color.red + Color.green + Color.blue;
        }
        else if (colorName == "magenta") {
            return Color.red + Color.blue;
        }
        else if (colorName == "cyan") {
            return Color.green + Color.blue;
        }
    }
}
```

### 非法的合并

类不能与其他类或变量合并。可以使用混入模仿类的合并。

### 模块扩展

不能在扩展中声明新的顶级声明－仅可以扩展模块中已经存在的声明。

```TypeScript
// observable.js
export class Observable<T> {
    // ... implementation left as an exercise for the reader ...
}


// map.ts
import { Observable } from "./observable";
declare module "./observable" {
    interface Observable<T> {
        map<U>(f: (x: T) => U): Observable<U>;
    }
}
Observable.prototype.map = function (f) {
    // ... another exercise for the reader
}


// consumer.ts
import { Observable } from "./observable";
import "./map";
let o: Observable<number>;
o.map(x => x.toFixed());
```

#### 全局扩展

```TypeScript
// observable.ts
export class Observable<T> {
    // ... still no implementation ...
}

declare global {
    interface Array<T> {
        toObservable(): Observable<T>;
    }
}

Array.prototype.toObservable = function () {
    // ...
}
```

## JSX

使用 JSX 前提：

- 给文件 `.tsx` 扩展名
- 启用 `jsx` 选项

TypeScript 具有三种 JSX 模式：`preserve`、`react` 和 `react-native`。这些模式只在代码生成阶段起作用，类型检查不受影响。

1. `preserve`：
   - 生成代码保留 JSX 供后续转换操作（`Babel`）
   - 输出 `.jsx` 文件
2. `react`：
   - 生成 `React.createElement`
   - 使用前 不需要进行转换操作
   - 输出 `.js` 文件
3. `react-native`：
   - 相当于 `preserve`
   - 输出 `.js` 文件

通过在命令行里使用 `--jsx` 标记或 `tsconfig.json` 里的选项来指定模式。

### `as` 操作符

类型断言：

```TypeScript
var foo = <foo>bar;

// 在 .tsx 文件里禁用了使用尖括号的类型断言，使用 as
var foo = bar as foo;
```

`as` 操作符在 `.ts` 和 `.tsx` 里都可用，并且与尖括号类型断言行为是等价的。

### 类型检查

1. 对于 React，固有元素会生成字符串（`React.createElement("div")`），然而由你自定义的组件却不会生成（`React.createElement(MyComponent)`）。
2. 传入 JSX 元素里的属性类型的查找方式不同。 固有元素属性 _ 本身 _ 就支持，然而自定义的组件会自己去指定它们具有哪个属性。

**规范**：固有元素总是以一个小写字母开头，基于值的元素总是以一个大写字母开头。

#### 固有元素

固有元素使用特殊的接口 `JSX.IntrinsicElements` 来查找。  
默认地，如果这个接口没有指定，会全部通过，不对固有元素进行类型检查。 然而，如果这个接口存在，那么固有元素的名字需要在 `JSX.IntrinsicElements` 接口的属性里查找。

```TypeScript
declare namespace JSX {
    interface IntrinsicElements {
        foo: any;
        // 可以在`JSX.IntrinsicElements`上指定一个用来捕获所有字符串索引
        [elemName: string]: any;
    }
}

<foo />; // 正确
<bar />; // 错误
```

#### 基于值的元素

基于值的元素会简单的在它所在的作用域里按标识符查找。

```TypeScript
import MyComponent from "./myComponent";

<MyComponent />; // 正确
<SomeOtherComponent />; // 错误
```

定义方法：

1. 无状态函数组件 (SFC)
2. 类组件

按顺序对两种进行解析，都不成功则报错。

##### 无状态函数组件

组件被定义成 JavaScript 函数，第一个参数是 `props` 对象。  
TypeScript 会强制它的返回值可以赋值给 `JSX.Element`。

```TypeScript
interface FooProp {
    name: string;
    X: number;
    Y: number;
}

declare function AnotherComponent(prop: {name: string});
function ComponentFoo(prop: FooProp) {
    return <AnotherComponent name={prop.name} />;
}

const Button = (prop: {value: string}, context: { color: string }) => <button>
```

利用函数重载：

```TypeScript
interface ClickableProps {
    children: JSX.Element[] | JSX.Element
}

interface HomeProps extends ClickableProps {
    home: JSX.Element;
}

interface SideProps extends ClickableProps {
    side: JSX.Element | string;
}

function MainButton(prop: HomeProps): JSX.Element;
function MainButton(prop: SideProps): JSX.Element {
    ...
}
```

##### 类组件 待解决

一旦建立起了类类型，实例类型由类构造器或调用签名（如果存在的话）的返回值的联合构成。  
在 ES6 类的情况下，实例类型为这个类的实例的类型。  
如果是工厂函数，实例类型为这个函数返回值类型。

```TypeScript
class MyComponent {
    render() {}
}

// 使用构造签名
var myComponent = new MyComponent();

// 元素类的类型 => MyComponent
// 元素实例的类型 => { render: () => void }

function MyFactoryFunction() {
    return {
	    render: () => {}
    }
}

// 使用调用签名
var myComponent = MyFactoryFunction();

// 元素类的类型 => FactoryFunction
// 元素实例的类型 => { render: () => void }
```

元素的实例类型必须赋值给 `JSX.ElementClass` 或抛出一个错误。  
默认的 `JSX.ElementClass` 为 `{}`，但是它可以被扩展用来限制 JSX 的类型以符合相应的接口。

```TypeScript
declare namespace JSX {
    interface ElementClass {
    render: any;
    }
}

class MyComponent {
    render() {}
}
function MyFactoryFunction() {
    return { render: () => {} }
}

<MyComponent />; // 正确
<MyFactoryFunction />; // 正确

class NotAValidComponent {}
function NotAValidFactoryFunction() {
    return {};
}

<NotAValidComponent />; // 错误
<NotAValidFactoryFunction />; // 错误
```

#### 属性类型检查 待解决

1. 确认元素属性类型  
   固有元素 --->`JSX.IntrinsicElements` 属性的类型

```TypeScript
declare namespace JSX {
    interface IntrinsicElements {
    foo: { bar?: boolean }
    }
}

// `foo`的元素属性类型为`{bar?: boolean}`
<foo bar />;
```

基于值的元素 --->取决于先前确定的在元素实例类型上的某个属性的类型 --->取决于 `JSX.ElementAttributesProperty`

> 如果未指定 `JSX.ElementAttributesProperty`，那么将使用类元素构造函数或 SFC 调用的第一个参数的类型。

```TypeScript
declare namespace JSX {
    interface ElementAttributesProperty {
    props; // 指定用来使用的属性名
    }
}

class MyComponent {
    // 在元素实例类型上指定属性
    props: {
    foo?: string;
    }
}

// `MyComponent`的元素属性类型为`{foo?: string}`
<MyComponent foo="bar" />
```

元素属性类型用于的 JSX 里进行属性的类型检查。 支持可选属性和必须属性。

```TypeScript
declare namespace JSX {
    interface IntrinsicElements {
    foo: { requiredProp: string; optionalProp?: number }
    }
}

<foo requiredProp="bar" />; // 正确
<foo requiredProp="bar" optionalProp={0} />; // 正确
<foo />; // 错误, 缺少 requiredProp
<foo requiredProp={0} />; // 错误, requiredProp 应该是字符串
<foo requiredProp="bar" unknownProp />; // 错误, unknownProp 不存在
<foo requiredProp="bar" some-unknown-prop />; // 正确, `some-unknown-prop`不是个合法的标识符
// 属性名不是合法的JS标识符且未出现在元素属性类型中不会当做错误
```

JSX 还会使用 `JSX.IntrinsicAttributes` 接口来指定额外的属性，`JSX.IntrinsicClassAttributes<T>` 泛型类型也可以用来做同样的事情。这些额外的属性通常不会被组件的 props 或 arguments 使用。

延展操作符也可以使用：

```TypeScript
var props = { requiredProp: 'bar' };
<foo {...props} />; // 正确

var badProps = {};
<foo {...badProps} />; // 错误
```

#### 子孙类型检查

利用 `JSX.ElementChildrenAttribute` 来决定 _children_ 名。  
`JSX.ElementChildrenAttribute` 应该被声明在单一的属性 (property) 里。

```TypeScript
declare namespace JSX {
    interface ElementChildrenAttribute {
    children: {};  // specify children name to use
    }
}
```

### JSX 结果类型

默认地 JSX 表达式结果的类型为 `any`。  
通过指定 `JSX.Element` 接口进行类型自定义。但不能够从接口检查元素、属性或 JSX 的子元素类型信息。

### 嵌入的表达式

使用 `{ }` 标签来内嵌表达式。

```TypeScript
var a = <div>
    {['foo', 'bar'].map(i => <span>{i / 2}</span>)}
</div>
```

### React 整合 待解决

### 工厂函数 待解决

## 装饰器 Decorators 待解决

## Mixins

```TypeScript
// Disposable Mixin
class Disposable {
    isDisposed: boolean;
    dispose() {
        this.isDisposed = true;
    }

}

// Activatable Mixin
class Activatable {
    isActive: boolean;
    activate() {
        this.isActive = true;
    }
    deactivate() {
        this.isActive = false;
    }
}

class SmartObject implements Disposable, Activatable {
    constructor() {
        setInterval(() => console.log(this.isActive + " : " + this.isDisposed), 500);
    }

    interact() {
        this.activate();
    }

    // Disposable
    isDisposed: boolean = false;
    dispose: () => void;
    // Activatable
    isActive: boolean = false;
    activate: () => void;
    deactivate: () => void;
}
applyMixins(SmartObject, [Disposable, Activatable]);

let smartObj = new SmartObject();
setTimeout(() => smartObj.interact(), 1000);

////////////////////////////////////////
// In your runtime library somewhere
////////////////////////////////////////

function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}
```

## 三斜线指令

三斜线指令是包含单个 XML 标签的单行注释。 注释的内容会做为编译器指令使用。  
仅可放在包含它的文件的最顶端。  
如果它们出现在一个语句或声明之后，那么它们会被当做普通的单行注释，并且不具有特殊的涵义。  

- `/// <reference path="..." />` 指令用于声明文件间的依赖。  
  当使用 `--out` 或 `--outFile` 时，它也可以做为调整输出内容顺序的一种方法。 文件在输出文件内容中的位置与经过预处理后的输入顺序一致。  
- `/// <reference types="..." />` 指令则声明了对某个包的依赖。
- `/// <reference no-default-lib="true"/>` 指令把一个文件标记成默认库。  
  与在命令行上使用  `--noLib` 相似。

> 传递了 `--skipDefaultLibCheck` 时，编译器只会忽略检查带有 `/// <reference no-default-lib="true"/>` 的文件。

### 预处理输入文件

预处理解析所有三斜线命令，在这个过程中，额外文件会加到编译过程中。  
该过程从根文件开始（命令行中指定的文件或在  `tsconfig.json` 中的 `"files"` 列表里的文件）。  

一个三斜线引用路径是相对于包含它的文件的，如果不是根文件。  

如果指定了 `--noResolve` 编译选项，三斜线引用会被忽略。

## [实践操作](TypeScript实践.md)

## 参考

[TypeScript 深水区：3 种类型来源和 3 种模块语法TypeScript 给 JavaScript 添加了一套 - 掘金](https://juejin.cn/post/7111112135903543332)  
[GitHub - type-challenges/type-challenges: Collection of TypeScript type challenges with online judge](https://github.com/type-challenges/type-challenges)  
[不一样的 TypeScript 入门手册](https://mp.weixin.qq.com/s/a8t5G_3s6NqJx5VWf3NM0w)  
[使用 TypeScript 编写 React 的最佳实践！](https://mp.weixin.qq.com/s/o_cXCroRSK5HAKG0wjC29Q)  
[「超长 1.9W 字总结」通俗易懂的 TS 教程，一步到位](https://mp.weixin.qq.com/s/3fqC8VxazoaiPvNu6eVI6A)  
[推荐 12 个值得学习的 TypeScript 宝库！](https://mp.weixin.qq.com/s/7WVlgS5dqcgwJBB6-x0lYQ)  
[编写优雅 TypeScript 代码的 7 个技巧](https://mp.weixin.qq.com/s/IVHQn0MwXT2vqGIRfZNbPA)  
[30张图带你快速了解TypeScript每个月都会有总结和分享会📚，这个月也一样，于是我将近段时间的、关于TS的学习笔 - 掘金](https://juejin.cn/post/7036266588227502093)  
[一篇让你完全够用的TS指南大家好，我叫小杜杜，是一个喜欢动手敲代码的小菜鸟，我认为代码应该亲自敲一遍，才能更好的熟记于心 - 掘金](https://juejin.cn/post/7088304364078497800)  
[重学TypeScript前言 不做笔记不学习 一个线上的TypeScript练习地址：TypeScript Playgr - 掘金](https://juejin.cn/post/7003171767560716302)  
[\[ 万字总结 \] 夯实你的 TypeScript 基础！（一）1.环境配置和搭建 一.什么是Typescript Typ - 掘金](https://juejin.cn/post/7102384712504573982)
