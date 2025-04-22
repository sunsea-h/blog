---
title: JavaScript 模块
date: 2022-09-05 11:33:18
updated: 2024-08-20 17:32:48
---

# JavaScript 模块

## ESM

1. 模块输出的是 **值的引用** (常量, 不可修改)  
   ES6 模块加载的不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成
2. 编译时确定模块依赖 (静态结构), 可以进行静态分析
3. 导入会被提升, 优先于当前模块代码执行
4. 模块作用域
5. 浏览器中可以异步加载
6. 模块是单例
7. 在模块内部可以通过 `import.meta.url` 获取导入本模块时的 url, 包含 `?` , `#` 参数
8. 默认导出 (Default export), 导出的是值, 不是变量, 不是实时改变的
9. `const module = await import('module.mjs')` 动态导入的模块如果导出的是一个值, module 为 `{ default: 值 }`
10. `export * from './module1.js';` 将多个模块重新导出的时候, 如果模块中存在相同的命名导出, 都会失败, 不存在

> .mjs 后缀明确表明 ESM 模块

### 导出

#### Default export

```JavaScript
export default function foo() {}
export default function () {}
export default class Foo {}
export default class {}
```

#### Export of values

```JavaScript
export default foo;
export default 'bar';
export default 25;
export default a ? true : false;
```

#### Re-export

```JavaScript
export * from 'module';
export { foo, bar as baz } from 'module';
export { default } from 'module';
export { default as foo } from 'module';
export { foo as defualt } from 'module';
```

#### Named exports

```JavaScript
export { foo, bar as baz };
export { foo as defualt };
export const foo;
export function myFunc() {};
export class MyClass {}
```

### 导入

#### Default Import

```JavaScript
import foo from 'module';
import { default as foo } from 'module';
```

#### Named Imports

```JavaScript
import { foo, bar as baz } from 'module';
```

#### Namespace Import

```JavaScript
import * as foo from 'module';
```

#### Empty Import

```JavaScript
import 'module';
```

#### Combinations

```JavaScript
import theDefualt, { bar } from 'module';
import theDefault, * as foo from 'module';
```

### 在 ESM 中使用 CommonJS

```JavaScript
// CommonJS module1
module.exports = { foo: "bar" }

// ESM
import module1 from "./module1"
console.log(module1.foo)
```

## CommonJS

1. 模块输出的是一个 **值的拷贝**  
   加载的是一个对象，即 module.exports 属性，该对象只有在脚本运行完才能生成
2. 运行是确认依赖关系, 不能进行静态分析
3. 文件作用域
4. 同步加载
5. 模块缓存, 模块初始化代码只会执行一次
6. 支持循环依赖, 但无法保证加载顺序

CommonJS (CJS) 和 AMD 模块，都只能在运行时确定模块之间的依赖关系，以及输入输出的变量。比如，CommonJS 模块就是对象，输入时必须查找对象属性。
> .cjs 后缀明确表明 CommonJS 模块

```JavaScript
let { stat, exists, readfile } = require('fs');
// 等同于如下代码块
let _fs = require('fs'); 
let stat = _fs.stat;
let exists = _fs.exists; 
let readfile = _fs.readfile;


```

上面代码的实质是整体加载 fs 模块（即加载 fs 的所有方法），生成一个对象（_fs），然后再从这个对象上面读取 3 个方法。这种加载称为“运行时加载”，因为只有运行时才能得到这个对象，导致完全没办法在编译时做“静态优化”。

### 模块对象

Node 内部提供一个 Module 构建函数。所有模块都是 Module 的实例。每个模块内部，都有一个 module 对象，代表当前模块。它有以下属性，通过 `module.XXX` 来使用：

| 属性     | 说明                                         |
| -------- | -------------------------------------------- |
| id       | 模块的识别符，通常是带有绝对路径的模块文件名 |
| filename | 模块的文件名，带有绝对路径                   |
| loaded   | 返回一个布尔值，表示模块是否已经完成加载     |
| parent   | 返回一个对象，表示调用该模块的模块           |
| children | 返回一个数组，表示该模块要用到的其他模块     |
| exports  | 表示模块对外输出的值                         | 

### exports 导出

为了方便，Node 为每个模块提供一个 exports 变量，指向 module.exports。使用 `module.exports={}` 或者 `exports.XXXX=""` 来导出。这等同在每个模块头部，有一行 `let exports = module.exports;` 的命令。

### require 导入

require 函数是 nodejs 提供的内置函数，用于加载指定路径的模块或者是指定名称的模块。将加载的模块进行返回。

```JavaScript
let path = require('fs');
```

### 在 CommonJS 中导入 ESM

```JavaScript
(async function () {
	const module1 = await import("./module1.js")
	console.log(module1) 
})()
```

## 模块化开发的优点

1. **使用模块化开发能解决文件之间的依赖关系。**  
    当你引入很多个 JS 文件的时候，很有可能会不清楚这些 JS 文件之间的依赖关系，从而导致加载顺序出错。使用模块化开发之后就能避免这个问题。
2. **使用模块化开发可以避免命名的冲突。**  
    JS 本身是没有命名空间的，为了减少命名冲突，经常使用对象或者闭包来减少命名冲突。对象只能减少命名冲突的概率，闭包的过多使用会造成内存泄漏。模块化开发之后，在模块内任何形式的命名都不会和其他模块的命名产生冲突，有效的解决了命名冲突的问题。
3. **使用模块化开发能进行代码的复用。**  
    当我们想要实现某个功能的时候，如果某个模块正好有这个功能，我们就可以直接引用该模块，不必再写多余的代码，这样可以提高代码整体的效率，减少重复冗余的代码。

```html
<!-- 支持模块的浏览器会执行这段脚本 -->
<!-- 不支持模块的浏览器不会执行这段脚本 -->
<script type="module" src="module.js"></script> 
<!-- 支持模块的浏览器不会执行这段脚本 -->
<!-- 不支持模块的浏览器会执行这段脚本 -->
<script nomodule src="script.js"></script>
```