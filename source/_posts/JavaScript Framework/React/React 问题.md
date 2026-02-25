---
title: React 问题
categories:
  - JavaScript Framework
  - React
date: 2023-02-20 12:08:29
updated: 2025-12-21 18:26:19
---
# React 问题

## onchange 中文输入 bug

- `compositionstart`  
	文本合成系统（如：输入法编辑器）开始输入时触发。
- `compositionupdate`  
	字符被输入到一段文字的时候触发。
- `compositionend`  
	文本段落的组合完成或取消时触发。

在其他浏览器中（除 **chrome** 之外），`compositionend` 是先于 **change** 事件触发；  
在 **chrome** 中，**change** 事件先于 `compositionend` 触发。

```js
import React from "react";

let isOnComposition = false;
const isChrome = navigator.userAgent.toLowerCase().indexOf("chrome") !== -1;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
  }

  handleComposition(e) {
    console.log("type", e.type);
    if (e.type === "compositionend") {
      isOnComposition = false;

	// 如果是 chrome ，单独再调用一次 change 事件
      if (!isOnComposition && isChrome) {
        this.changeEvent(e);
      }
    } else {
      isOnComposition = true;
    }
  }

  changeEvent(e) {
    if (!isOnComposition) {
      console.log("改变");
      this.setState({
        value: e.target.value,
      });
    }
  }

  render() {
    return (
      <div>
        <input 
          type="text"
          id="test"
          value={this.value}
          onChange={this.changeEvent.bind(this)}
          onCompositionStart={this.handleComposition.bind(this)}
          onCompositionUpdate={this.handleComposition.bind(this)}
          onCompositionEnd={this.handleComposition.bind(this)}
        />
      </div>
    );
  }
}

export default App;
```

## Vue 与 React 中的 this 问题

无论是 Vue 还是 React，都在官方文档中强调，需要注意 this 的指向丢失。  
但是，为了达到同样的目的，Vue 是不能使用箭头函数，而 React 是使用箭头函数解决 this 的指向丢失。    

**React：**  
官方文档除了提供了在构造函数中或 Render 中通过 `bind()` 手动绑定 this 外，还提供了通过箭头函数绑定 this 。  
![](React%20问题.assets/image-20230220140101094.png)

**Vue：**  
![](React%20问题.assets/image-20230220140107601.png)  
通过编写 demo 进行测试：  
在 React 中，普通函数方式 this 为 undefined，而箭头函数方式 this 指向正确。

```jsx
class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShown: true,
    };
  }
  ArrowMethod = () => {
    console.log("箭头函数：", this);
  };
  OrdinaryMethod() {
    console.log("普通函数：", this);
  }
  render() {
    return (
      <>
        <button onClick={this.OrdinaryMethod}>普通函数</button>
        <button onClick={this.ArrowMethod}>箭头函数</button>
      </>
    );
  }
}
```

![](React%20问题.assets/image-20230220140126991.png)  
在 Vue 中，箭头函数方式 this 为 undefined，而普通函数方式 this 指向正确。

```vue
<template>
	<div>
		<button @click="OrdinaryMethod">普通函数</button>
		<button @click="ArrowMethod">箭头函数</button>
	</div>
</template>

<script>
export default {
	name: 'App',
	data() {
		return {
			isShown: true,
		};
	},
	methods: {
		ArrowMethod: () => {
			console.log("箭头函数：", this);
		},
		OrdinaryMethod() {
			console.log("普通函数：", this);
		},
	},
}
</script>
```

![](React%20问题.assets/image-20230220140140461.png)  
通过测试发现 Vue 与 React 中普通函数方式和箭头函数方式的结果正向相反。  
1. 在 React 中事件触发时，回调函数的执行不是直接由实例调用。由于合成事件，会对事件处理函数做一个代理，从而导致 this 丢失。  
	JS 中的类本质是一个构造函数，通过箭头函数声明时，本身没有 this ，会找父级作用域，即构造函数作用域，所以没有丢失。  
2. 在 Vue 中对组件方法的处理，最核心的是：

```ts
function initMethods(vm: Component, methods: Object) {
  for (const key in methods) {
	vm[key] = bind(methods[key], vm)
  }
}
```

Vue 会对传入的 motheds 对象进行遍历，对其中的每个方法执行 bind() 进行 this 绑定，普通函数都有自己的 this ，所以绑定后可以正确指向组件实例；  
而箭头函数没有自己的 this ，所以会找父级作用域。作用域只有全局作用域和函数作用域。  
Vue 中 methods 、data 等属性本身是一个对象的属性，不存在作用域，所以会找全局作用域，没有指向组件实例。

## React 中各种组件复用的优缺点（mixin、render props、hoc、hook）

### Mixin

一些提供能够被一个或者一组子类简单 `继承功能的类`,`意在重用其功能`。  
**缺点：**
- 组件与 Mixin 之间存在隐式依赖  
  隐式依赖导致依赖关系不透明，维护成本和理解成本迅速攀升
	- 难以快速理解组件的⾏为，需要全盘了解所有依赖 Mixin 的扩展⾏为及其之间的相互影响
	- 组件⾃身的⽅法和 state 字段不敢轻易删改，因为难以确定有没有 Mixin 依赖它
	- Mixin 也难以维护，因为 Mixin 逻辑最后会被摊平合并到⼀起，很难搞清楚⼀个 Mixin 的输⼊输出
- 多个 Mixin 之间可能产⽣冲突，⽐如：多个 Mixin 中定义了相同的 state 字段，在一个组件中同时引入这些 Mixin 后会产生字段冲突
- Mixin 倾向于增加更多状态，这降低了应⽤的可预测性，状态越多越难管理和溯源，复杂度剧增

### HOC

可以看作 React 对 `装饰者模式的一种实现`，具体而言，`高阶组件是参数为组件，返回值为新组件的函数。`  
**优点：**
- 相⽐ Mixin，HOC 通过外层组件传递 props 来影响内层组件的状态，⽽不是直接改变其 state，这就不存在冲突和互相⼲扰，降低了耦合度。  
- 不同于 Mixin 的打平 + 合并，HOC 天然具有层级结构（组件树结构），这⼜降低了复杂度。

**缺点：**  
- 扩展性限制：HOC ⽆法从外部访问⼦组件的 state，因此⽆法通过 `shouldComponentUpdate` 过滤掉不必要的更新；React 在⽀持 ES6 Class 之后提供了 `React.PureComponent` 解决了这个问题
- Ref 传递问题（Ref 被隔断）。后来出现了 `React.forwardRef` 来解决了这个问题
- 包装地狱：和回调函数类似，HOC 如果出现多层包裹组件的情况，就会和回调函数一样层层嵌套；而这种多层抽象同样也增加了复杂度和理解成本
- 命名冲突：如果⾼阶组件多次嵌套而没有使⽤命名空间，就可能会产⽣冲突，覆盖⽼的属性
- 不可⻅性：HOC 相当于在原有组件外层再包装⼀个组件，这个组件的内容不可见，相当于一个黑盒。

### Render Props

**优点：**  
HOC 中的缺点，使用 Render Props 都可得到解决。  
**缺点：**
- 使⽤繁琐：HOC 使⽤只需要借助装饰器语法，通常⼀⾏代码就可以进⾏复⽤，而 Render Props ⽆法做到如此简单
- 嵌套过深：Render Props 虽然摆脱了组件多层嵌套问题，但其又会走回到了回调函数的嵌套问题

### React Hooks

**优点：**
- 简洁：React Hooks 解决了 HOC 和 Render Props 的嵌套问题，代码更加简洁
- 解耦：React Hooks 可以更⽅便地把 UI 和状态分离，做到更彻底的解耦
- 组合：Hooks 中可以通过引⽤另外的 Hooks 以此形成新的 Hooks，变化丰富
- 函数友好：React Hooks 为函数组件⽽⽣，从⽽解决了类组件的⼏⼤问题:
	- this 指向容易错误
	- 分割在不同声明周期中的逻辑会使得代码难以理解和维护
	- 代码复⽤成本⾼（⾼阶组件容易使代码量剧增）

**缺点：**
- 有额外的学习成本（需要学习和区分类组件、函数组件）
- 写法上有限制（不能出现在条件、循环中），并且这种写法限制会增加代码重构时的成本
- 破坏了 PureComponent、React.memo 浅⽐较的性能优化效果（为了获取最新的 props 和 state，每次 render() 都要重新创建事件处理函数）
- 在闭包场景中可能会引⽤到旧的 state、props 值
- 内部实现上不直观（依赖⼀份可变的全局状态，不再那么“纯”）
- `React.memo` 并不能完全替代 `shouldComponentUpdate`（因为获取不到 state 的变化，只针对 props 的变化）

[React系列-Mixin、HOC、Render Props - 落落落洛克 - 博客园](https://www.cnblogs.com/vnues/p/14300333.html)  

## hook 闭包问题

![](React%20问题.assets/file-20250418102103773.png)  
解决方法：
- 使用 useRef 声明变量，每次强制触发渲染（[useLatest](https://ahooks.js.org/zh-CN/hooks/use-latest)）
- setState 传入回调函数（推荐）
- 使用 useReducer

## hook 只能在顶层函数使用

设计原理依赖 **调用顺序的稳定性**。  
通过**链表结构**保存和管理 hook 的状态，**每次渲染时必须顺序一致**。  
如果有 hook 在条件中使用，渲染时可能跳过执行，导致后续顺序不一致，导致位置错乱。
