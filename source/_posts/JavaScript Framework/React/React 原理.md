---
title: React 原理
categories:
  - JavaScript Framework
  - React
date: 2022-11-09 11:19:01
updated: 2025-12-22 22:06:39
---
# React 原理

## 虚拟 DOM

### 和真实 DOM 对比

1. 从结构方面来看

```js
const dom1 = React.createElement('div', {}, 'react');
const dom2 = document.createElement('div');
dom2.innerHTML = 'react';
console.log(dom1);
console.log(dom2);
```

![](React%20原理.assets/image-20230220134458551.png)

虚拟 DOM 本质上是一个 JS 对象，而真实 DOM 则是一个 dom 结构。  
![](React%20原理.assets/image-20230220134532418.png)

在真实 DOM 上默认挂载了许多属性和方法，所以**虚拟 DOM 相比真实 DOM 在结构方面轻便的多**。

2. 从流程方面来看  
传统 web 应用中，每次数据变化都会引起 DOM 的重新渲染。而虚拟 DOM 是将所有的操作集中起来，对比计算出所有变化后，统一进行操作更新虚拟 DOM。  
如果一个页面产生 600 多次的变化，那么页面就会渲染 600 多次，这会非常消耗性能。而虚拟 DOM 只需要渲染一次。  
所以，页面越复杂，则虚拟 DOM 性能相对越好。

3. 从操作方面来看

```html
<ul>
	<li>1</li>
	<li>2</li>
	<li>3</li>
</ul>
```

如果要修改以上结构，改为 4、5、6、7，直接修改节点有三种方式：  
	1.将 1、2、3 修改为 4、5、6，然后在添加 7；  
	2.删除 1、2、3，然后添加 4、5、6、7；  
	3.直接覆盖 `ul` 的内容。  
方式三操作相对简单，但是需要重绘和重排，性能消耗高；所以只能使用方式一，虽然操作相对复杂，但是性能消耗相对较少。

总结：使用虚拟 DOM 后，不需要在关注如何和何时修改 DOM，提高了效率。浏览器操作 JavaScript 相对于操作 DOM 更快。当有数据发生变化时，通过比较新旧两个虚拟 DOM ，找到所有需要更新的节点，统一更新，一次性更新真实 DOM 。并且因为虚拟 DOM 是一个 JavaScript 对象，所以跨平台兼容性也更好。

### 虚拟 DOM 的优势

- 提高效率，只需要关注业务逻辑，不需要关注如何操作 DOM
- 性能提升，浏览器操作 JavaScript 比操作 DOM 更快，虚拟 DOM 也减少许多 DOM 操作
- 兼容性强
	- 实现了自己的事件机制，模拟事件冒泡和捕获过程，采用事件代理和批量更新，磨平了浏览器间的兼容性问题
	- 虚拟 DOM 只是 JavaScript 对象，受平台限制少

## diff 算法

### 与传统 diff 算法相比较

传统 diff 算法在对两颗进行比较时，是通过循环递归的遍历节点进行比较，节点两两对比，复杂度为 O(n^2)，最后对树进行编辑还需要遍历一遍，所以复杂度为 O(n^3)，复杂度高。  
而 React 的 diff 算法的算法复杂度只有 O(n)。

### diff 策略

1.忽略特别少发生的 DOM 节点跨层级的移动操作；  
2.两个组件具有相同类则生成相似树形结构，不同类则生成不同的树形结构；  
3.通过唯一的 id 对同一层级的一组子节点进行区分。  
React 通过以上三点策略（对应 `tree diff` 、`component diff` 、`element diff` ）对 diff 算法进行了优化。

#### tree diff

同级比较，通过 `updateDepth` 控制虚拟 DOM 树进行同一级比较，当发现节点不存在时，会完全删除，不进行其他比较，这样只需要对树进行一次遍历。  
![](React%20原理.assets/image-20230220134558080.png)

如上图，进行一层层比较时，发现 L、B、C 从左侧跑到右侧 R 的下面，由于不进行跨层级比较，所以会直接删除整个 A ，然后重新创建。建议少进行跨层级操作。

保持 DOM 稳定性有助于提高性能，尽量利用显示与隐藏效果，而不是真正删除或增加节点。

#### component diff

组件比较，分为同类型组件和不同类型组件。
- 对于同类型组件，按层级对虚拟 DOM 树进行比较。可以通过 `shouldComponentUpdate()` 决定是否需要 diff 运算。
- 对于不同类型组件，会直接判断为脏组件，无论是否相似，直接对整个组件的所有节点进行替换。

#### element diff

节点比较，对于同一级的子节点，通过唯一的 key 比较。  
当所有节点处于同一级时，有三种操作：  
1.插入（**INSERT_MARKUP**）  
	新节点不在老集合里，需要执行插入操作。  
	如：`C` 不在集合 `A` 、`B` 中，需要插入。  
2.移动（**MOVE_EXISTING**）  
	在新老集合中都有，但是位置不同，需要执行移动操作。  
	如：`D` 在老集合 `A`、`B`、`C`、`D` 中，只是变为 `A`、`D`、`B`、`C` ，位置发生改变，执行移动操作。

传统 diff 算法会将 `B` 与 `D` 进行比较，删除 `B` ，插入 `D` 。  
3.删除（**REMOVE_NODE**）  
老集合有而新集合没有的节点，或者新老集合都有，但是无法复用或更新，执行删除操作。

index：节点在老集合中的位置，lastIndex：在 diff 过程中访问的位置的最大值  
**节点位置改变，进行移动**  
![](React%20原理.assets/image-20230220134609671.png)

1.判断新集合中的节点 B 是否存在于老集合，然后根据 index\<lastIndex 判断，成立移动。index=1，lastIndex=0，不成立，不移动。  
2.节点 A，index=0，lastIndex=1，成立，移动。  
3.节点 D，index=3，lastIndex=1，不成立，不移动。  
4.节点 C，index=2, lastIndex=3,成立，移动。操作结束。  

在 diff 过程中，如果发现节点再老集合中没有，会创建该节点，lastIndex 不变；  
diff 结束后，发现老集合中的节点再新集合中没有，会删除该节点。

**缺陷：**  
![](React%20原理.assets/image-20230220134624937.png)

当一个节点从末尾提到开头时，原本只需要移动 D ，保持 A ，B ，C 不动即可。  
但是 element diff 算法会保持 D 不动，一次将 A ，B ，C 移动，这样会导致性能损失。  

## 合成事件

直接将事件绑定到真实 DOM 节点上，绑定的事件过多，对页面的响应和内存使用可能产生很大影响。  
所以 React 不将 click 事件直接绑定到 dom 上，而是采用 **事件冒泡** 的形式。  
在 document 处监听所有支持的事件（**React17 换成在 root 容器监听**），在事件发生并冒泡到 document 时，将事件封装到中间层 SyntheticEvent ，然后使用统一分发函数 `dispatchEvent` 将封装的事件交由对应的事件处理函数。  
![](React%20原理.assets/image-20230220135629142.png)

总结：  
1. 如果阻止了原生事件的冒泡行为后，也会阻止合成事件监听器的执行。阻止了合成事件的冒泡行为，实际上阻止了 document 上的冒泡行为，不符合预期，不影响原生事件。  
2. 由于合成事件都会绑定到 document 上，只有冒泡到 document 才会触发，所以原生事件总是比合成事件先触发， document DOM 上监听的原生事件最后触发。
3. react 事件手动需要绑定 this  
	事件触发后，react 会将事件处理函数放入一个数组对函数进行临时保存，最后遍历数组执行所有需要执行的事件处理函数。临时保存时会丢失 this ，所以需要绑定。
4. 在 react 中使用原生事件  
	由于原生事件需要绑定到真实 DOM 上，所以一般在 `componentDidMount` 或 `ref` 的函数执行阶段执行绑定操作，在 `componentWillUnmount` 阶段执行解绑操作避免内存泄漏。

[React中阻止事件冒泡的问题详析_React_脚本之家](https://www.jb51.net/article/159618.htm)  

## React Fiber 架构

### 栈式架构（Stack Reconcilation）缺陷

采用递归遍历， 当应用组件数量庞大，一旦开始比较就**无法中断**的问题，会导致长期占用主线程，形成阻塞，造成卡顿现象。  
没有任务优先级的概念，按照生成顺序执行。遇到需要立刻响应的任务，会让用户感觉卡顿。

### Fiber 结构特点

React Fiber 并**不会减少比较时间**，只是会保存工作进度，可**断点重启**。
> 原来的**树结构**，只有指向子节点。一旦中断，保存的正在处理的节点无法找到父节点。

Fiber 是一个执行单元。是纤程。  
纤程是协程的一种实现方式。协程比线程更小的调度单位。开启、暂停可以被程序员控制。  
> 底层使用类似 requestIdleCallback ，自己实现的 api（Scheduler）。

![](React%20原理.assets/file-20250417164937375.png)  
Fiber 也是一个数据结构（**链表结构**）。包含 child（第一个子节点）、sibling（兄弟节点）、return（父节点）等属性。  
![](React%20原理.assets/file-20250417165256476.png)

### 调度器 Scheduler、协调器 Reconciler、渲染器 Renderer

- Scheduler（调度器）：根据任务的优先级安排任务执行顺序。
- Reconciler（协调器）：根据新旧虚拟 DOM 树的差异确定需要更新的部分。
- Renderer（渲染器）：将更新的虚拟 DOM 转换为实际的 UI 输出。

React 定义了不同的优先级，如 `Immediate`（最高优先级，用于处理用户交互）、`Normal`（默认优先级，一般的更新任务）、`Low`（低优先级，如后台任务）等。

### 时间切片 TimeSlice

将大任务分割成多个小任务片段，每个片段都可以在一帧内执行完成。

### 双重缓冲 Double Buffering

一种渲染优化技术。  
利用两个 Fiber 树管理渲染。当前树（**current tree**）和工作树（ **work-in-progress tree**）。  
当前树代表屏幕上当前显示的内容，而工作树用于准备下一次的渲染更新，用以实现平滑的更新。

## 渲染流程

![](React%20原理.assets/file-20250430144841059.png)

中断原因：
- 有其他更高优先级的任务需要执行
- 当前的 time slice 没有剩余的时间
- 发生了其他错误

> Scheduler 和 Reconciler 与平台无关，所以有一个单独的包 [react-Reconciler](https://www.npmjs.com/package/react-reconciler)

## 启发式更新算法

`Concurrent Mode` 的目的是实现一套可中断/恢复的更新机制。  
其由两部分组成：  
- 一套协程架构
- 基于协程架构的启发式更新算法

其中，协程架构就是 `React16` 中实现的 `Fiber Reconciler`。  
React 17 对启发式更新算法进行了更新。  

[一文看懂React17新特性——启发式更新算法 | w3c笔记](https://www.w3cschool.cn/article/73903cd7e547af.html)  

## React 与 Vue 不同响应原理的影响

[阿里三面：灵魂拷问——有react fiber，为什么不需要vue fiber呢？ - 掘金](https://juejin.cn/post/7077545184807878692##heading-2)  
