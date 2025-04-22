---
title: Vuex
date: 2022-09-26 09:27:58
updated: 2023-03-22 18:24:55
---

# Vuex

专为 Vue.js 应用程序开发的 **状态管理模式**。采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。
1. 状态机可以将所有需要共享的数据进行统一维护，当某个组件需要时，直接引入即可。
2. 状态机可以对请求代码进行封装，其他任何组件可以直接调用。

每个 Vuex 应用的核心就是 store（仓库）。  
包含：
- **state**，驱动应用的数据源；
- **view**，以声明方式将 **state** 映射到视图；
- **actions**，响应在 **view** 上的用户输入导致的状态变化。

**Vuex 和单纯的全局对象的不同 :**
1. Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。
2. 使用时不能直接改变 store 中的状态。改变 store 中的状态的唯一途径就是显式地 **提交 (commit) mutation**。这样可以方便地跟踪每一个状态的变化。

## 安装

- 方式一 : 在线 CDN 引入

```JavaScript
<script src="https://cdn.bootcdn.net/ajax/libs/vue/2.6.9/vue.js"></script>
<script src="https://cdn.bootcdn.net/ajax/libs/vuex/3.5.1/vuex.js"></script>
```

- 方式二 : 本地引入

```JavaScript
<script src='vue.js'></script>
<script src='vuex.js'></script>
```

- 方式三 : npm 下载或者 yarn 下载

```JavaScript
$ npm install vuex --save
## 或者如下
$ yarn add vuex
```

在一个模块化的打包系统中，必须显式地通过 Vue.use() 来安装 Vuex：

```JavaScript
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
```

当使用全局 script 标签引用 Vuex 时，不需要以上安装过程。  
Vuex 依赖 Promise。

## 核心概念

### State

在 `State` 中存放状态，可将状态理解为组件中的 `data`，只不过在 `state` 中一般存放的是组件共享的数据，而在组件内的 `data` 中一般存放组件的私有数据。

存储在 Vuex 中的数据和 Vue 实例中的 data 遵循相同的规则。

```JavaScript
const store = new Vuex.Store({
	state: {
		count: 1
	}  
})
new Vue({
	el: "##app",
	// 注入store
	store,
})
```

**组件访问 state 中的数据**
1. 通过 `store.state.XXX` 获取 state 中的数据，**如果是在 vue 代码中，则使用 `$store.state.XXX` 和 `this.$store.state.XXX` 来获取数据**
2. 通过 `mapState` 辅助函数（当一个组件需要获取多个状态的时候）

```JavaScript
// 在单独构建的版本中辅助函数为 Vuex.mapState
import { mapState } from 'vuex'

export default {
	data () {
		return {
			str: '国籍',
			dataCount: this.$store.state.count
		}
	},
	computed: mapState({
		// 箭头函数可使代码更简练
		count: (state) => state.count, // 写法一
		sex: 'sex', // 写法二
		// 为了能够使用 `this` 获取局部状态，必须使用常规函数
		from:function (state) {
			return this.str + ':' + state.from
		}
	})
}
```

**对象展开运算符**  
`mapState` 函数返回的是一个对象。可以使用...对象展开符将多个对象合并为一个，使用最终对象传给 `computed` 属性。

```JavaScript
<div id="app">
	// 获取state中的数据方式一
	{{$store.state.count}}--{{count}}
</div>
<script>
	const { mapState } = Vuex;// 对象解构
	const store = new Vuex.Store({
		state: {
			count: 1
		}
	})
	new Vue({
	el: "##app",
	store,
	computed: {
		...mapState(['count'])// 获取state中的数据方式二
	}
	})
</script>
```

### Getters

从 store 中的 state 中派生出一些状态，例如对列表进行过滤并计数：

```JavaScript
computed: {
	doneTodosCount () {
		return this.$store.state.todos.filter(todo => todo.done).length
	}
}
```

有多个组件需要用到此属性，可以使用 getter。  
getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。

```JavaScript
const store = new Vuex.Store({
	state: {
		todos: [
			{ id: 1, text: '...', done: true },
			{ id: 2, text: '...', done: false }
		]
	},
	getters: {
		doneTodos: (state) => {
			return state.todos.filter(todo => todo.done)
		}
	}
})
```

#### 通过属性访问

```JavaScript
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```

getter 在通过属性访问时是作为 Vue 的响应式系统的一部分缓存其中的。

```JavaScript
// Getter 也可以接受其他 getter 作为第二个参数
getters: {
	// ...
	doneTodosCount: (state, getters) => {
		return getters.doneTodos.length
	}
}
```

#### 通过方法访问

通过让 getter 返回一个函数，来实现给 getter 传参。对 store 里的数组进行查询时非常有用。

```JavaScript
store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
```

```JavaScript
getters: {
	// ...
	getTodoById: (state) => (id) => {
		return state.todos.find(todo => todo.id === id)
	}
}
```

getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果。

#### `mapGetters` 辅助函数

将 store 中的 getter 映射到局部计算属性

```JavaScript
import { mapGetters } from 'vuex'

export default {
	// ...
	computed: {
		// 使用对象展开运算符将 getter 混入 computed 对象中
		...mapGetters([
			'doneTodosCount',
			'anotherGetter',
			// ...
		])
	}
}
```

将一个 getter 属性另取一个名字

```JavaScript
...mapGetters({
	// 把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`
	doneCount: 'doneTodosCount'
})
```

### Mutations

**Mutation 都是同步事务，更改 Vuex 的 store 中的状态的唯一方法是提交 mutation**。  
每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。

```JavaScript
const store = new Vuex.Store({
	state: {
		count: 1
	},
	mutations: {
		increment (state) {
			// 变更状态
			state.count++
		}
	}
})


// 使用
store.commit('increment')
```

#### 提交突变载荷（Payload）

`store.commit` 的额外的参数：`mutation` 的载荷（`payload`）。  
 方式一：

 ```JavaScript
 store.commit('increment', {
	amount: 10
})
```

 方式二：

```JavaScript
// 使用对象风格的提交方式，整个对象都作为载荷传给 mutation 函数
 store.commit({
	type: 'increment',
	amount: 10
})
```

#### 接受载荷

```JavaScript
// ...
mutations: {
	increment (state, payload) { // 大多数情况下，载荷（payload）应该是一个对象
		state.count += payload.amount
	}
}
```

#### 在组件中提交 Mutation

方式一：

```JavaScript
this.$store.commit('xxx')
```

方式二：

```JavaScript
// 使用 mapMutations 辅助函数将组件中的 methods 映射为 store.commit 调用（需要在根节点注入 store）
import { mapMutations } from 'vuex'
export default {
  // ...
  methods: {
    ...mapMutations([
		// 将 `this.increment()` 映射为 `this.$store.commit('increment')`
	    'increment', 
	    // `mapMutations` 也支持载荷：将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
	    'incrementBy' 
    ]),
    ...mapMutations({
      	add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    })
  }
}
```

#### 在对象上添加新属性

1. 使用 `Vue.set(obj, 'newProp', 123)`
2. 以新对象替换老对象

```JavaScript
// 利用对象展开运算符
state.obj = { ...state.obj, newProp: 123 }
```

#### 使用常量替代 Mutation 事件类型

**mutation-types.js**

```JavaScript
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'
```

**store.js**

```JavaScript
// store.js
import Vuex from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const store = new Vuex.Store({
	state: { ... },
	mutations: {
		// 我们可以使用 ES2015 风格的计算属性命名功能来使用一个常量作为函数名
		[SOME_MUTATION] (state) {
			// mutate state
		}
	}
})
```

### Actions

类似于 `mutation`，不同：
- `Action` 提交的是 `mutation`，而不是直接变更状态。
- `Action` 可以包含任意异步操作。

```JavaScript
const store = new Vuex.Store({
	state: {
		count: 0
	},
	mutations: {
		increment (state) {
			state.count++
		}
	},
	actions: {
		// context对象与 store 实例具有相同方法和属性
		increment (context) {
			context.commit('increment')
		}
		// 简写（使用解构）
		// increment ({ commit }) {
		// 	commit('increment')
		// }
	}
})
```

调用 `context.commit` 提交一个 `mutation`  
通过 `context.state` 和 `context.getters` 来获取 `state` 和 `getters`

#### 分发 Action

```JavaScript
store.dispatch('increment')

// 以载荷形式分发
store.dispatch('incrementAsync', {
	amount: 10
})

// 以对象形式分发
store.dispatch({
	type: 'incrementAsync',
	amount: 10
})
```

#### 在组件中分发 Action

方式一：

```JavaScript
this.$store.dispatch('xxx')
```

方式二：

```JavaScript
// 使用 mapActions 辅助函数将组件的 methods 映射为 store.dispatch 调用（需要先在根节点注入 store）
import { mapActions } from 'vuex'

export default {
	// ...
	methods: {
		...mapActions([
			'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`
		
			// `mapActions` 也支持载荷：
			'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
		]),
		...mapActions({
			add: 'increment' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
		})
	}
}
```

#### 组合 Action

`store.dispatch` 可以处理被触发的 `action` 的处理函数返回的 `Promise`，并且 `store.dispatch` 仍旧返回 `Promise`。

```JavaScript
actions: {
	actionA ({ commit }) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				commit('someMutation')
				resolve()
			}, 1000)
		})
	}
}


actions: {
	// ...
	actionB ({ dispatch, commit }) {
		return dispatch('actionA').then(() => {// 调用actionA
			commit('someOtherMutation')
		})
	}
}
```

**利用 `async/await` **

```JavaScript
// 假设 getData() 和 getOtherData() 返回的是 Promise

actions: {
	async actionA ({ commit }) {
		commit('gotData', await getData())
	},
	async actionB ({ dispatch, commit }) {
		await dispatch('actionA') // 等待 actionA 完成
		commit('gotOtherData', await getOtherData())
	}
}
```

### Modules

解决单一状态树下应用复杂导致 `store` 对象臃肿。

```JavaScript
const moduleA = {
	state: () => ({ ... }),
	mutations: { ... },
	actions: { ... },
	getters: { ... }
}

const moduleB = {
	state: () => ({ ... }),
	mutations: { ... },
	actions: { ... }
}

const store = new Vuex.Store({
	modules: {
		a: moduleA,
		b: moduleB
	}
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```

#### 模块的局部状态

```JavaScript
const moduleA = {
	state: () => ({
		count: 0
	}),
	mutations: {
		increment (state) {
		  // 这里的 `state` 对象是模块的局部状态
		  state.count++
		}
	},
	
	getters: {
		// rootState(根节点状态)
		sumWithRootCount (state, getters, rootState) {
			return state.count + rootState.count
		}
	}

	actions: {
		// context.state(局部状态)、context.rootState(根节点状态)
		incrementIfOddOnRootSum ({ state, commit, rootState }) {
			if ((state.count + rootState.count) % 2 === 1) {
				commit('increment')
			}
		}
	}
}
```

#### 命名空间

默认情况下，模块内部的 `action`、`mutation` 和 `getter` 注册在全局命名空间（多模块能对同一个 `mutation` 或 `action` 作出响应）。  
可以通过添加 `namespaced: true` 的方式使其成为带命名空间的模块。

```JavaScript
const store = new Vuex.Store({
	modules: {
		account: {
			namespaced: true,
			
			// 模块内容（module assets）
			state: () => ({ a:1 }), // 模块内的状态已经是嵌套的了，使用 `namespaced` 属性不会对其产生影响
			getters: {
				isAdmin () { ... } // -> getters['account/isAdmin']
			},
			actions: {
				login () { ... } // -> dispatch('account/login')
			},
			mutations: {
				login () { ... } // -> commit('account/login')
			},
			
			// 嵌套模块
			modules: {
				// 继承父模块的命名空间
				myPage: {
					state: () => ({ ... }),
					getters: {
						profile () { ... } // -> getters['account/profile']
					}
				},
			
				// 进一步嵌套命名空间
				posts: {
					namespaced: true,
				
					state: () => ({ b:2 }),
					getters: {
						popular () { ... } // -> getters['account/posts/popular']
					}
				}
			}
		}
	}
})
```

**带命名空间的绑定函数**  
使用 `mapState`, `mapGetters`, `mapActions` 和 `mapMutations` 绑定带命名空间的模块。

```JavaScript
computed: {
		...mapState({
			a: state => state.account.a,
			b: state => state.account.posts.b
		})
	},
	methods: {
		...mapActions([
			'account/login', // -> this['account/login']()
			'account/posts/popular' // -> this['account/posts/popular']()
		])
	}
}
```

将模块的空间名称字符串作为第一个参数传递 `mapState`, `mapGetters`, `mapActions` 和 `mapMutations` 函数。

```JavaScript
computed: {
		...mapState('account', {
			a: state => state.a
		}),
		...mapState('account/posts', {
			b: state => state.b,
			xxx: state => state.xxx
		})
	},
	methods: {
		...mapActions('account', [
			'login', // -> this.login()
		]),
		...mapActions('account/posts', [
			'popular', // -> this.popular()
			'xxx' // -> this.xxx()
		])
	},
}
```