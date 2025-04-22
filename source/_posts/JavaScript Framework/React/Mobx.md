---
title: Mobx
date: 2022-09-26 09:27:58
updated: 2023-03-22 18:26:03
---

# Mobx

## Mobx 介绍

和 React 良好配合的集中状态管理工具（同 Vue 的 Vuex）  
如：redux、dva、recoil  
**优势：**
1. 简单  
	编写无模板的极简代码来精准描述意图（原生 js）
2. 轻松实现最优渲染  
	依赖自动追踪最小渲染优化
3. 架构自由  
	可移植，可测试

## 模块化（组合多个 stores）

按照功能拆分 store 模块，根模块中组合子模块，利用 context 机制依赖注入。  
*List.Store.js*

```JavaScript
import { makeAutoObservable } from "mobx"


class ListStore {
  list = [1, 2, 3, 4]
  constructor() {
    makeAutoObservable(this)
  }
  addList = () => {
    this.list.push(7, 8, 9)
  }
}
export { ListStore }
```

*Counter.Store.js*

```JavaScript
import { makeAutoObservable } from 'mobx'

class CounterStore {
  count = 0
  constructor() {
    makeAutoObservable(this)
  }
  addCount = () => {
    this.count++
  }
}

export { CounterStore }
```

*index.js*

```JavaScript
import { CounterStore } from "./counter.Store"
import { ListStore } from "./list.Store"
import React from "react"


class RootStore {
  constructor() {
    this.listStore = new ListStore()
    this.counterStore = new CounterStore()
  }
}

const rootStore = new RootStore()
const context = React.createContext(rootStore)
const useStore = () => React.useContext(context)

export { useStore }
```

## store

### 初始化 mobx

1. 定义数据状态（state）
2. 数据响应式处理
3. 定义 action 函数（修改数据）
4. 实例化并导出实例

```JavaScript
import { makeAutoObservable } from 'mobx'
class CounterStore {
	count=0
	constructor(){
		makeAutoObservable(this)
	}
	addCount=()=>{
		this.count++
	}
}

const counterStore=new CounterStore()
export defatult counterStore
```

### 连接 react

1. 导入 store 实例
2. 使用 store 中的数据
3. 修改 store 中的数据
4. 让组件视图响应数据变化

```jsx
import { observer } from 'mobx-react-lite'
import counterStore from './store/counterStore'

function App() {
	return (
		<div className="App">
			{counterStore.count}
			<button onClick={counterStore.addCount}>+</button>
		</div>
	)
}

export default observer(App)
```

## React 组件

通过 observer 函数/装饰器，将无状态函数组件变为响应式组件。

```jsx
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react';

@observer
class TodoListView extends Component {
    render() {
        // TODO
    }
}

const TodoView = observer(({todo}) =>
    // TODO
)

const store = new TodoList();
ReactDOM.render(<TodoListView todoList={store} />, document.getElementById('mount'));
```

## 核心概念

MobX 会对在执行跟踪函数期间读取的任何现有的可观察属性做出反应。  
![](Mobx.assets/image-20220926152049983.png)

### Observable state(可观察的状态)

#### `decorate`

```js
import { decorate, observable } from "mobx";

class Todo {
    id = Math.random();
    title = "";
    finished = false;
}
decorate(Todo, {
    title: observable,
    finished: observable
})
```

#### `makeObservable`

`makeObservable(target, annotations?, options?)`
- `target`：  
  一般在类的构造函数调用，为 this 。
- `annotations`：  
  为每个成员映射注解；使用装饰器时，会被忽略。
- `options`

```js
import { makeObservable, observable, computed, action, flow } from "mobx"

class Doubler {
    value

    constructor(value) {
        makeObservable(this, {
            value: observable,
            double: computed,
            increment: action,
            fetch: flow
        })
        this.value = value
    }

    get double() {
        return this.value * 2
    }

    increment() {
        this.value++
    }

    *fetch() {
        const response = yield fetch("/api/value")
        this.value = response.json()
    }
}
```

#### `makeAutoObservable`

默认推断所有属性。  
不能被用于带有 super 的类或子类。

推断规则：
- 自有属性成为 `observable`
- `getter` 成为 `computed`
- `setter` 成为 `action`
- `prototype` 上的 `function` 成为 `autoAction`
- `prototype` 上的 `generator function` 成为 `flow` (部分编译器检测不到时需要明确指定 `flow` 注解)

**函数组件**

```js
import { makeAutoObservable } from "mobx"

function createDoubler(value) {
    return makeAutoObservable({
        value,
        get double() {
            return this.value * 2
        },
        increment() {
            this.value++
        }
    })
}
```

**类组件**

```js
import { makeAutoObservable } from 'mobx'

class CounterStore {
	count=0
	constructor(){
		makeAutoObservable(this)
	}
	addCount=()=>{
		this.count++
	}
}
```

#### `observable`

返回的对象使用 Proxy 包装，之后添加到对象的属性会自动跟踪。

`observable(source, overrides?, options?)`

```js
import { observable } from "mobx"

const todosById = observable({
    "TODO-123": {
        title: "find a decent task management system",
        done: false
    }
})

todosById["TODO-456"] = {
    title: "close all tickets older than two weeks",
    done: true
}

const tags = observable(["high prio", "medium prio", "low prio"])
tags.push("prio: for fun")
```

与 `makeObservable` 不同：可以为对象添加或删除字段。  
适用于：动态键控的对象、数组、Maps 和 Sets 之类的集合。

**注意**：原始值和类的实例永远不会转化为可观察的对象。

##### 可观察数组

Map、Set 用法类似。

```js
import { observable, autorun } from "mobx"

const todos = observable([
    { title: "Spoil tea", completed: true },
    { title: "Make coffee", completed: false }
])
```

实用函数：
- `clear()`：清除所有元素
- `replace(newIterm)`：所有元素替换为 newIterm
- `remove(value)`：删除数组中 value 元素，找到并删除后返回 true
- `shift()`：删除数组第一个元素，并返回该元素的值

##### `observable`（使用代理）与 `makeObservable`（不使用代理）

1. `make(Auto)Observable` 会修改你作为第一个参数传入的对象；  
`observable` 会创建一个可观察的 _副本_ 对象。

2. `observable` 会创建一个 Proxy 对象，能动态捕获将要添加的属性；  
可观察对象为常规结构，成员已知，推荐使用 `makeObservable`，其为非代理对象，更快。  
`observable` 也可以传入 `{proxy:false}` 作为 option 来获取非代理对象。

`make(Auto)Observable` 推荐在工厂函数中使用。

#### `@observable` 

需要支持装饰器。

```js
import { observable } from "mobx";

class Todo {
	id = Math.random();
	@observable title = "";
	@observable finished = false;
}
```

#### 局限性

待解决
1. `make(Auto)Observable` 仅支持 **已经定义** 的属性，声明但未初始化将无法正确侦测到。
2. `makeObservable` 只能注解 **本身所在的类** 声明的属性。
3. `options` 只能提供一次，具有“粘性”，之后无法更改（如在子类中）。
4. **每个字段只能被注解一次**（`override` 除外）。字段注解和配置不能在子类中改变。
5. 非普通对象（**类**）中的 **所有被注解过的** 字段都是 **不可配置的**。  
    可以通过 `configure({ safeDescriptors: false })` 来禁用 。
6. **所有不可观察**（stateless）字段（`action`，`flow`）都是 **不可写的**。  
    可以通过 `configure({ safeDescriptors: false })` 来禁用。
7. 只有定义在 **原型** 上的 **`action`，`computed`，`flow`，`action.bound`** 可以在子类中被 **overriden** 。
8. 默认情况下 _TypeScript_ 不允许注解 **私有** 字段。可以通过将相关私有字段作为泛型参数显式传入来解决： `makeObservable<MyStore, "privateField" | "privateField2">(this, { privateField: observable, privateField2: observable })`。
9. **make(Auto)Observable** 的调用和注解的提供必须无条件地进行，才可能对推断结果进行缓存。
10. **不支持** 在调用 **`make(Auto)Observable`** 之后 **修改原型**。
11. **不支持** _EcmaScript_ 中的 **私有** 字段（**`##field`**）。使用 _TypeScript_ 时，推荐改用 `private` 修饰符。
12. 2 **不支持** 在单个继承链中 **混合使用注解和装饰器** - 例如，在超类中使用了装饰器，就不能再在子类中使用注解。
13. `makeObservable`，`extendObservable` 不能在其它内置可观察类型上使用（`ObservableMap`，`ObservableSet`，`ObservableArray` 等）。
14. `makeObservable(Object.create(prototype))` 将属性从 `prototype` 拷贝到新创建的对象并且使得其是可观察的。此行为是错误的、不可预测的，因此已经 **不推荐使用**，并可能会在未来有所变动。不要使用它。

#### Options

- **`autoBind: true`** 默认使用 `action.bound`/`flow.bound`，而不使用 `action`/`flow`。不影响被显式注释过的成员。
- **`deep: false`** 默认使用 `observable.ref`，而不使用 `observable`。不影响被显式注释过的成员。
- **`name: <string>`** 为对象提供一个调试名称，该名称将被打印在错误消息和 reflection API 中。
- **`proxy: false`** 迫使 `observable(thing)` 使用非 **proxy** 的实现。如果对象的结构不会随着时间变化，那么这就是一个很好的选择，因为非代理对象更容易调试并且速度更快。

#### 将 observable 转换回普通的 JavaScript 集合

进行浅转换：

```js
const plainObject = { ...observableObject }
const plainArray = observableArray.slice()
const plainMap = new Map(observableMap)
```

数据树递归转换：使用 `toJS` 工具函数；  
类转换：实现 `toJSON()` ，可以被 `JSON.stringify` 识别。

### Computed values(计算值)

通过 `@computed` 装饰器或者利用 `(extend)Observable` 时调用 getter/setter 函数，在相关数据发生变化时自动更新的值。

```js
class TodoList {
    @observable todos = [];
    @computed get unfinishedTodoCount() {
        return this.todos.filter(todo => !todo.finished).length;
    }
}
```

1. 声明一个存在的数据
2. 定义 get 计算属性（定义计算公式）
3. 在 `makeAutoObservable` 方法中标记

```JavaScript
import { computed, makeAutoObservable } from "mobx"

class ListStore {
	list = [1, 2, 3, 4]
	constructor() {
	    makeAutoObservable(this, {
		    filterList: computed
	    })
	}
	get filterList() {
		return this.list.filter(item => item > 2)
	}
	addList = () => {
	    this.list.push(7, 8, 9)
	}
}
```

最佳实践：  
1.不应该有其他副作用或更新其他可观察数据  
2.避免创建和返回新的可观察对象  
3.不依赖不可观察的对象  

**注意**：
1. 没有被任何 reaction 使用的计算属性，每次被请求时都会执行计算表达式，与普通属性一样。
2. 计算值可以设置 setter ，但是不能直接修改计算值，而是作为派生的“逆操作”，会被标记为 actions 。
3. `computed.struct` 比较输出的结构

```js
class Box {
    width = 0
    height = 0

    constructor() {
        makeObsevable(this, {
            x: observable,
            y: observable,
            topRight: computed.struct
        })
    }

    get topRight() {
        return {
            x: this.width,
            y: this.height
        }
    }
}
```

默认情况，`computed` 通过引用进行比较，toRight 总返回一个新的对象，因此永远不会不会视为与先前的输出相同的值，可以使用 `computed.struct` 比较输出结构，决定是否通知观察者。  
4. 使用 `computed(expression)` 创建独立的计算值  
与 `observable.box` 一样创建一个独立的计算值。  
在返回的对象上使用 `.get` 获取计算值。

#### Options

##### name

在 [Spy event listeners](https://zh.mobx.js.org/analyzing-reactivity.html##spy) 和 [MobX developer tools](https://github.com/mobxjs/mobx-devtools) 中用作调试名称

##### equals

默认 `comparer.default`，作为比较函数，比较上一个与下一个的值。如果相同，则观察者不会重新计算。

###### 内置 comparers

- `comparer.identity` 使用全等运算符确定两个值是否相同。
- `comparer.default` 与 `comparer.identity` 相同，但是认为 `NaN` 等于 `NaN`。
- `comparer.structural` 执行 **深层的结构比较** 以确定两个值是否相同。
- `comparer.shallow` 执行 **浅层的结构比较** 以确定两个值是否相同。

##### requiresReaction

待解决  
推荐在非常昂贵的计算值中将这个选项设置为 `true`。如果你试图在响应式上下文之外读取这样的计算值——这种情况下，它可能不会被缓存起来——就会导致计算值抛出错误，而不是进行昂贵的重新计算。

##### keepAlive

避免计算值在未被观察时暂时停用。会导致内存泄漏。

### Reactions(反应，处理副作用)

与计算属性相似，但不返回一个值，而是产生一些副作用。  
使用 `autorun`、`reaction` 和 `when` 函数简单的创建自定义 reactions 。

#### Autorun

`autorun(effect: (reaction) => void)`  
接受一个函数作为参数，函数所观察的值（ observable、computed 等）发生变化时执行。在 `autorun` 创建时执行一次。

```js
autorun(() => {
    console.log("Tasks left: " + todos.unfinishedTodoCount)
})
```

**注意：**  
`autorun` 只跟踪同步执行过程中的观察对象，异步不跟踪；  
无法跟踪被调用 action 的观察对象。

#### Reaction

`reaction(() => value, (value, previousValue, reaction) => { sideEffect }, options?)`  
接受两个函数（data 函数、effect 函数）作为参数，data 函数的返回值会作为 effect 函数的参数。  
只会在 data 函数中的观察值发生变化时执行；初始化时不执行，只在观察表达式首次返回新值时执行。

#### When

- `when(predicate: () => boolean, effect?: () => void, options?)`
- `when(predicate: () => boolean, options?): Promise`  
观察并执行 predicate 函数，直到返回 true 为止。  
predicate 函数返回 true 后，执行 effect 函数并清理自动执行器函数，没有 effect 函数则返回 一个 Promise（可手动取消）。  

当返回 Promise 时，可以使用 `await when(...)` 等待可观察对象的变化，也可以通过 返回 Promise 的 `.cancel()` 取消。

#### 注意规则

1. 观察对象发生变化，reactions 立即同步运行（当前最外围的 action 执行完后运行）。
2. reaction 直到观察对象被回收后才会回收，为防止内存泄漏，可以使用其返回的 disposer 函数终止。  
`reaction` 和 `autorun` 中 effect 函数的第二个参数 reaction 也可以被用来提前把 reaction 清理掉（通过调用 reaction.dispose()）。

```js
const counter = observable({ count: 0 })

const disposer = autorun(() => {
    console.log(counter.count)
})

disposer()
```

#### 使用原则

1. **只有在引起副作用的一方与副作用之间没有直接关系的情况下才使用 reaction**
2. **reactions 不应该更新其他可观察对象**
3. **reactions 应该是独立的**

#### Options

##### name

在 [Spy event listeners](https://zh.mobx.js.org/analyzing-reactivity.html##spy) 和 [MobX developer tools](https://github.com/mobxjs/mobx-devtools) 中用作此 reaction 的调试名称。

##### fireImmediately(reaction)

是否在第一次运行 data 函数后立即触发 effect 函数，默认 false 。

##### delay(autorun, reaction)

对 effect 函数进行节流，默认 0，不节流。

##### timeout(when)

超时时间，超过 when 会 reject 或抛出错误。

##### onError

捕获异常但不向上抛出，不影响其他不相关的 reaction 调度。

##### scheduler(autorun, reaction)

自定义调度程序，决定 autorun 函数如何重新执行，接受一个函数为参数，如 `{ scheduler: run => { setTimeout(run, 1000) }}` 。

##### equals(reaction)

默认 `comparer.default`，比较 data 函数上一个与下一个的值，返回 false 时，effect 函数才会执行。

### Actions(动作)

action 不可被跟踪，在副作用或计算值中被调用时，其读取的可观察对象不会视为 derivation （派生）的依赖项。

#### make(Auto)Observable

```js
import { makeObservable, observable, action } from "mobx"
// import { makeAutoObservable, action.bound } from "mobx"

class Doubler {
    value = 0

    constructor(value) {
	    // makeAutoObservable(this)
	    // 或
        makeObservable(this, {
            value: observable,
            
            increment: action
            // 或
            // 绑定this
            // increment: action.bound
        })
    }

    increment() {
        this.value++
        this.value++
    }
}
```

#### 使用 action 包裹函数

```js
import { observable, action, runInAction } from "mobx"

const state = observable({ value: 0 })

const increment = action(state => {
    state.value++
    state.value++
})

increment(state)

// 或
// 立即调用的临时 action
runInAction(() => {
    state.value++
    state.value++
})
```

#### Actions 和继承

只有定义在原型上的函数可以重写。

```js
class Parent {
    // on instance
    arrowAction = () => {}

    // on prototype
    action() {}
    boundAction() {}

    constructor() {
        makeObservable(this, {
            arrowAction: action
            action: action,
            boundAction: action.bound,
        })
    }
}
class Child extends Parent {
    // THROWS: TypeError: Cannot redefine property: arrowAction
    arrowAction = () => {}

    // OK
    action() {}
    boundAction() {}

    constructor() {
        super()
        makeObservable(this, {
            arrowAction: override,
            action: override,
            boundAction: override,
        })
    }
}
```

将单个 action 绑定到 this 上，可以使用 `action.bound` 代替箭头函数。

#### 异步 Actions

待解决  
Promise 的决议处理程序以内联的方式处理，但会在一开始的 action 执行完之后运行，需要进行 action 包装。

```js
import { action, makeAutoObservable } from "mobx"

class Store {
    githubProjects = []
    state = "pending" // "pending", "done" or "error"

    constructor() {
        makeAutoObservable(this)
    }

    fetchProjects() {
        this.githubProjects = []
        this.state = "pending"
        fetchGithubProjectsSomehow().then(
            action("fetchSuccess", projects => {
                const filteredProjects = somePreprocessing(projects)
                this.githubProjects = filteredProjects
                this.state = "done"
            }),
            action("fetchError", error => {
                this.state = "error"
            })
        )
    }
}
```

Promise 的处理函数是类的字段，将由 `makeAutoAction` 自动进行 action 包装。

```js
import { makeAutoObservable } from "mobx"

class Store {
    githubProjects = []
    state = "pending" // "pending", "done" or "error"

    constructor() {
        makeAutoObservable(this)
    }

    fetchProjects() {
        this.githubProjects = []
        this.state = "pending"
        fetchGithubProjectsSomehow().then(this.projectsFetchSuccess, this.projectsFetchFailure)
    }

    projectsFetchSuccess = projects => {
        const filteredProjects = somePreprocessing(projects)
        this.githubProjects = filteredProjects
        this.state = "done"
    }

    projectsFetchFailure = error => {
        this.state = "error"
    }
}
```

await 之后的操作与其他操作不在一个 tick(进行一次循环操作为一个 tick )，需要使用 action 包装。

```js
import { runInAction, makeAutoObservable } from "mobx"

class Store {
    githubProjects = []
    state = "pending" // "pending", "done" or "error"

    constructor() {
        makeAutoObservable(this)
    }

    async fetchProjects() {
        this.githubProjects = []
        this.state = "pending"
        try {
            const projects = await fetchGithubProjectsSomehow()
            const filteredProjects = somePreprocessing(projects)
            runInAction(() => {
                this.githubProjects = filteredProjects
                this.state = "done"
            })
        } catch (e) {
            runInAction(() => {
                this.state = "error"
            })
        }
    }
}
```

#### 使用 flow 代替 async/await

将一个 generator 作为唯一输入，使用 yeild 替代 await 关键字，保证 generator 在 Promise 之后继续运行或抛出错误。

1.使用 flow 包装异步函数  
2.使用 function* 代替 async  
3.使用 yeild 代替 await

```js
import { flow, makeAutoObservable, flowResult } from "mobx"

class Store {
    githubProjects = []
    state = "pending"

    constructor() {
        makeAutoObservable(this, {
            fetchProjects: flow
        })
    }

    *fetchProjects() {
        this.githubProjects = []
        this.state = "pending"
        try {
            // Yield 代替 await.
            const projects = yield fetchGithubProjectsSomehow()
            const filteredProjects = somePreprocessing(projects)
            this.state = "done"
            this.githubProjects = filteredProjects
        } catch (error) {
            this.state = "error"
        }
    }
}

const store = new Store()
const projects = await flowResult(store.fetchProjects())
```

使用 TypeScript 时需要使用 `flowResult` 进行包裹，因为 flow 装饰了一个方法将返回的 generator 包裹在 Promise 中，`flowResult` 可以确保 TypeScript 意识到这种改变。

**将 flow 用于对象字段**

不需要使用 `flowResult` ，但需要指明 `this` 的类型，确保类型可以正确推断。

```js
import { flow } from "mobx"

class Store {
    githubProjects = []
    state = "pending"

    fetchProjects = flow(function* (this: Store) {
        this.githubProjects = []
        this.state = "pending"
        try {
            // yield 代替 await.
            const projects = yield fetchGithubProjectsSomehow()
            const filteredProjects = somePreprocessing(projects)
            this.state = "done"
            this.githubProjects = filteredProjects
        } catch (error) {
            this.state = "error"
        }
    })
}

const store = new Store()
const projects = await store.fetchProjects()
```

#### 取消 flows

`flow` 返回值是一个 Promise ，在 generator 运行完成会自动进行 resolve 。返回的 Promise 自带 `cancel()` 方法打断并取消 运行的 generator 。  
所有 try/finally 依然会执行。

### 可用注解

![](Mobx.assets/image-20221011103712099.png)

## 集成 React

自动订阅任何渲染期间使用的可观察对象，可观察对象发生变化自动重新渲染组件。

```jsx
//被`observer`包裹的函数式组件会被监听在它每一次调用前发生的任何变化
const TimerView = observer(({ timer }) => 
	<span>Seconds passed: {timer.secondsPassed}</span>
)
```

### 本地和外部状态

#### `observer` 组件中使用外部状态

##### 使用 Props

```jsx
import { observer } from "mobx-react-lite"

const myTimer = new Timer() 

const TimerView = observer(({ timer }) => <span>Seconds passed: {timer.secondsPassed}</span>)

// 通过props传递myTimer.
ReactDOM.render(<TimerView timer={myTimer} />, document.body)
```

##### 使用全局变量

```jsx
const myTimer = new Timer() 

// 没有props, `myTimer` 立刻变成了闭包。
const TimerView = observer(() => <span>Seconds passed: {myTimer.secondsPassed}</span>)

ReactDOM.render(<TimerView />, document.body)
```

##### 使用 React context

```jsx
import {observer} from 'mobx-react-lite'
import {createContext, useContext} from "react"

const TimerContext = createContext<Timer>()

const TimerView = observer(() => {
    // 从context中获取timer.
    const timer = useContext(TimerContext) // 可以在上面查看 Timer的定义。
    return (
        <span>Seconds passed: {timer.secondsPassed}</span>
    )
})

ReactDOM.render(
    <TimerContext.Provider value={new Timer()}>
        <TimerView />
    </TimerContext.Provider>,
    document.body
)
```

#### 在 `observer` 组件中使用全局可观察对象

##### useState+observable

```jsx
import { observer } from "mobx-react-lite"
import { useState } from "react"

const TimerView = observer(() => {
	// 不需要更新 timer 的引用
    const [timer] = useState(() => new Timer()) 
    return <span>Seconds passed: {timer.secondsPassed}</span>
})

ReactDOM.render(<TimerView />, document.body)

// 自动更新 timer
useEffect(() => {
    const handle = setInterval(() => {
        timer.increaseTimer()
    }, 1000)
    return () => {
        clearInterval(handle)
    }
}, [timer])
```

##### useState 和全局可观察对象

```jsx
import { observer } from "mobx-react-lite"
import { observable } from "mobx"
import { useState } from "react"

const TimerView = observer(() => {
    const [timer] = useState(() =>
        observable({
            secondsPassed: 0,
            increaseTimer() {
                this.secondsPassed++
            }
        })
    )
    return <span>Seconds passed: {timer.secondsPassed}</span>
})

ReactDOM.render(<TimerView />, document.body)
```

##### useLocalObservable

```jsx
import { observer, useLocalObservable } from "mobx-react-lite"
import { useState } from "react"

const TimerView = observer(() => {
    const timer = useLocalObservable(() => ({
        secondsPassed: 0,
        increaseTimer() {
            this.secondsPassed++
        }
    }))
    return <span>Seconds passed: {timer.secondsPassed}</span>
})

ReactDOM.render(<TimerView />, document.body)
```

#### 始终在 `observer` 组件中使用可观察能力

1. 不可将可观察对象传递到不是 `observer` 的组件中  
传递到子组件或回调的组件时，子组件或回调组件必须 `observer` 包裹。  
如果必须传递到不是 `observer` 的组件（第三方组件），需要转换可观察对象为显式。

```js
class Todo {
    title = "test"
    done = true

    constructor() {
        makeAutoObservable(this)
    }
}

const TodoView = observer(({ todo }: { todo: Todo }) =>
   // 错误: GridRow 不能获取到 todo.title/ todo.done 的变更
   //       因为他不是一个观察者（observer。
   return <GridRow data={todo} />

   // 正确:在 `TodoView` 中显式的声明相关的`todo` ，
   //      到data中。
   return <GridRow data={{
       title: todo.title,
       done: todo.done
   }} />

   // 正确: 使用 `toJS`也是可以的, 并且是更清晰直白的方式。
   return <GridRow data={toJS(todo)} />
)
```

2. 回调组件与 `<Observer>`

```jsx
const TodoView = observer(({ todo }: { todo: Todo }) => {
    // 错误: GridRow.onRender 不能获得 todo.title / todo.done 中的改变
    //        因为它不是一个观察者（observer） 。
    return <GridRow onRender={() => <td>{todo.title}</td>} />

    // 正确: 将回调组件通过Observer包裹将会正确的获得变化。
    return <GridRow onRender={() => <Observer>{() => <td>{todo.title}</td>}</Observer>} />
})
```

## React 优化

1. 使用大量小组件
2. 使用专门的组件渲染列表，只需返回一个组件（包含渲染的列表）
3. 不使用数组的索引作为 key
4. 尽早绑定函数

```jsx
const PersonNameDisplayer = observer(({ person }) => <DisplayName name={person.name} />)

const CarNameDisplayer = observer(({ car }) => <DisplayName name={car.model} />)

const ManufacturerNameDisplayer = observer(({ car}) => 
    <DisplayName name={car.manufacturer.name} />
)

// 优化后
const GenericNameDisplayer = observer(({ getName }) => <DisplayName name={getName()} />)

const MyComponent = ({ person, car }) => (
    <>
        <GenericNameDisplayer getName={() => person.name} />
        <GenericNameDisplayer getName={() => car.model} />
        <GenericNameDisplayer getName={() => car.manufacturer.name} />
    </>
)
```

## MobX4 vs MobX5

![](Mobx.assets/image-20220926152221643.png)

## Mobx vs Redux

同：
- 统一管理应用状态
- 操作更新方式统一

异：
- redux 数据都存储在一个 store 中；  
  mobx 存储在多个 store 中
- redux 用普通对象保存数据，需要手动操作更新；  
  mobx 用 observable 对象保存数据，自动响应更新
- redux 状态不可变，需要使用副本覆盖原件，且需要是纯函数；  
  mobx 可以直接修改状态
- redux 相对复杂，采用函数式编程思想，需要使用中间件处理异步逻辑和副作用；  
  mobx 相对简单，采用面向对象的思想
- redux 使用纯函数，抽象少，提供时间回溯开发工具，调试相对容易；  
  mobx 有更多的抽象和封装，调试相对复杂，结果也难以预测