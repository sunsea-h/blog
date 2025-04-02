---
title: Pinia
categories:
  - JavaScript Framework
  - Vue
date: 2022-09-26 09:27:58
updated: 2023-03-22 18:23:46
---

# Pinia

## 安装

默认使用 Vite。

针对 Vue Cli 可以使用 [非官方插件](https://github.com/wobsoriano/vue-cli-plugin-pinia) 。

### Vue2

配合 `@vue/composition-api` 依赖和 `PiniaVuePlugin` 插件使用。

```js
import { createPinia, PiniaVuePlugin } from 'pinia'

Vue.use(PiniaVuePlugin)
const pinia = createPinia()

new Vue({
  el: '##app',
  // 其他选项...
  // ...
  // 注意同一个 `pinia` 实例可以在多个 Vue 应用程序中使用
  // 同一个页面
  pinia,
})
```

### Vue3

```js
import { createPinia } from 'pinia'

app.use(createPinia())
```

## Store

### 定义

```js
import { defineStore } from 'pinia'

// useStore 可以是 useUser、useCart 之类的任何东西
// 第一个参数是应用程序中 store 的唯一 id
// 第二个参数
// 2.1 一个对象
export const useStore = defineStore('main', {
  // other options...
})
// 2.2 一个箭头函数，通过return返回定义内容
export const useCounterStore = defineStore("counter", () => {
  // other options...

  return { // other options... };
});
```

定义一个 store

```js
import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", () => {
  const count = ref(0);
  const doubleCount = computed(() => count.value * 2);
  function increment() {
    count.value++;
  }

  return { count, doubleCount, increment };
});
```

### 使用

#### 使用选项式 API

##### 使用 `setup()`

```vue
<script>
import { useCounterStore } from '@/stores/counter'

export default {
  setup() {
    const counterStore = useCounterStore()

    return {
      // 您可以返回整个 store 实例以在模板中使用它
      counterStore,
    },
  },
  computed: {
    quadrupleCounter() {
      return counterStore.doubleCounter * 2
    },
  },
}
</script>
```

store 是一个 `reactive` 包裹的对象，自动解包，不能解构。

从 store 中提取属性同时保持响应性，可以使用 `storeToRefs()` 。

```js
import { storeToRefs } from 'pinia'

export default defineComponent({
  setup() {
    const store = useStore()
    const { name, doubleCount } = storeToRefs(store)

    return {
      name,
      doubleCount
    }
  },
})
```

##### 不使用 `setup()`

```vue
<script>
import { mapState, mapWritableState } from "pinia";
import { useCounterStore } from "@/stores/counter";

export default {
  name: "AboutView",
  data() {
    return {};
  },
  computed: {
    ...mapState(useCounterStore, ["countA"]),
    ...mapWritableState(useCounterStore, ["countB"]),
    // 与上面相同，但将其注册为 this.myOwnName
    ...mapState(useCounterStore, {
      myOwnName: 'doubleCounter',
      // 编写一个访问 store 的函数
      double: store => store.doubleCount,
    }),
  },
  methods: {
    // ...mapActions(useCounterStore, ["increment"]),
    addCounterA() {
      // 错误，无法直接修改
      this.countA += 1;
      console.log(this.countA);
    },
    addCounterB() {
      // 正确，可以直接修改，store
      this.countB += 1;
      console.log(this.countB);
    },
  },
};
</script>
```

`mapState` 和 `mapWritableState` 相似，但 `mapWritableState` 可以直接修改，不需要调用 store 的方法。

> 对于与数组相似的集合，不使用 `mapWritableState` 也可以修改，除非使用 `[]` 的新数组进行替换。

#### 使用 `<script setup>`

```vue
<script setup>
import { useCounterStore } from "@/stores/counter";

const counterStore = useCounterStore();
console.log(counterStore.count);
    
function increment() {
  // 可以直接修改
  counterStore.count++;
}
</script>
```

## State

state 为一个返回初始状态的函数。

```js
import { defineStore } from 'pinia'

const useStore = defineStore('storeId', {
  // 推荐使用 完整类型推断的箭头函数
  state: () => {
    return {
      // 所有这些属性都将自动推断其类型
      counter: 0,
      name: 'Eduardo',
      isAdmin: true,
    }
  },
})
```

### 重置状态

```js
const store = useStore()

store.$reset()
```

### 改变状态

除了直接 `store.count++` 也可以通过 `$patch` 修改。

```js
store.$patch({
  counter: store.counter + 1,
  name: 'Abalam',
})
```

但任何集合的修改（如：从数组推入、删除和拼接元素）需要创建一个新的集合。

可以传入一个函数：

```js
cartStore.$patch((state) => {
  state.items.push({ name: 'shoes', quantity: 1 })
  state.hasChanged = true
})
```

### 替换 state

通过设置 `$state` 属性，赋予新对象。

```js
store.$state = { counter: 666, name: 'Paimon' }
```

### 订阅状态 

待解决

使用 `$subscribe` 订阅状态，与 `watch()` 的优点是：*subscriptions* 只会在 *patches* 之后触发一次。

```js
cartStore.$subscribe((mutation, state) => {
  // import { MutationType } from 'pinia'
  mutation.type // 'direct' | 'patch object' | 'patch function'
  // 与 cartStore.$id 相同
  mutation.storeId // 'cart'
  // 仅适用于 mutation.type === 'patch object'
  mutation.payload // 补丁对象传递给 to cartStore.$patch()

  // 每当它发生变化时，将整个状态持久化到本地存储
  localStorage.setItem('cart', JSON.stringify(state))
})
```

*subscriptions* 默认绑定到添加它的组件上，跟随组件的卸载而销毁；若要保持其状态，将 `{detached:true}` 作为第二个参数出入。

```js
cartStore.$subscribe(callback, { detached: true })
```

## Getters

等同于 store 状态的计算值。

```js
// 1.传入对象
export const useStore = defineStore('main', {
  state: () => ({
    counter: 0,
  }),
  getters: {
    // 推荐使用箭头函数
    doubleCount: (state) => state.counter * 2,
  },
})

// 2.传入函数
export const useStore = defineStore('main', () => {
  const count = ref(0);
  const doubleCount = computed(() => count.value * 2);

  return { count, doubleCount };
})
```

可以通过 this 访问整个 store 实例，但必须注明返回类型（TS 中），JS 中使用 JSDoc 注明。

不影响 **使用箭头函数定义的** 和 **不使用 this 的常规函数**。

```js
export const useStore = defineStore('main', {
  state: () => ({
    counter: 0,
  }),
  getters: {
    // 自动将返回类型推断为数字
    doubleCount(state) {
      return state.counter * 2
    },
    // 返回类型必须明确设置（使用this的常规函数）
    // TS
    doublePlusOne(): number {
      return this.counter * 2 + 1
    },
    // JS
    /**
     * 返回计数器值乘以二加一。
     *
     * @returns {number}
     */
    doubleCountPlusOne() {
      // 自动完成 ✨
      // 引用其他 Getter
      return this.doubleCount + 1
    },
  },
})
```

### 将参数传给 Getters

通过返回一个函数以接受参数

```js
export const useStore = defineStore("main", {
  state: ()=>({
    users: 0,
  }),
  getters: {
    getUserById: (state) => {
      return (userId) => state.users.find((user) => user.id === userId);
    },
  },
});
```

## Actions

相当于组件中 method ，适合定义业务逻辑。

与 Getters 一样可以访问 this ，需要注明返回类型；但可以异步。

### 访问其他 store 

```js
import { useAuthStore } from './auth-store'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    // ...
  }),
  actions: {
    async fetchUserPreferences() {
      const auth = useAuthStore()
      if (auth.isAuthenticated) {
        this.preferences = await this.http()
      } else {
        throw new Error('User must be authenticated')
      }
    },
  },
})
```

### 订阅 Actions

通过 `store.$onAction()` 订阅 Action 及其结果。 传递给它的回调在 action 之前执行。

```js
const unsubscribe = someStore.$onAction(
  ({
    name, // action 的名字
    store, // store 实例
    args, // 调用这个 action 的参数
    after, // 在这个 action 执行完毕之后，执行这个函数
    onError, // 在这个 action 抛出异常的时候，执行这个函数
  }) => {
    // 记录开始的时间变量
    const startTime = Date.now()
    // 这将在 `store` 上的操作执行之前触发
    console.log(`Start "${name}" with params [${args.join(', ')}].`)

    // 如果 action 成功并且完全运行后，after 将触发。
    // 它将等待任何返回的 promise
    after((result) => {
      // TODO
    })

    // 如果 action 抛出或返回 Promise.reject ，onError 将触发
    onError((error) => {
		// TODO
    })
  }
)

// 手动移除订阅
unsubscribe()
```

`$onAction()` 绑定在使用它的组件上，随组件的卸载而销毁，可以传入第二个参数 `true` 保留。

```js
export default {
  setup() {
    const someStore = useSomeStore()

    // 此订阅将在组件卸载后保留
    someStore.$onAction(callback, true)

    // ...
  },
}
```

## Plugins

插件是一个函数，返回要添加到 store 的属性。

```js
export function myPiniaPlugin(context) {
  context.pinia // 使用 `createPinia()` 创建的 pinia
  context.app // 使用 `createApp()` 创建的当前应用程序（仅限 Vue 3）
  context.store // 插件正在扩充的 store
  context.options // 定义存储的选项对象传递给`defineStore()`
  // ...
}
```

使用 `pinia.use()` 将插件添加到 Pinia 实例上。

```js
pinia.use(myPiniaPlugin)
```

适用于：添加全局对象（如路由器、模式或 toast 管理器）

>插件仅适用于**在将 `pinia` 传递给应用程序后创建的 store **，否则将不会被应用。

简单例子：

```js
import { createPinia } from 'pinia'

// 为安装此插件后创建的每个store添加一个名为 `secret` 的属性
// 这可能在不同的文件中
function SecretPiniaPlugin() {
  return { secret: 'the cake is a lie' }
}

const pinia = createPinia()
// 将插件提供给 pinia
pinia.use(SecretPiniaPlugin)

// 在另一个文件中
const store = useStore()
store.secret // 'the cake is a lie'
```

### 扩充 Store

1.返回对象（推荐，方便 devtools 跟踪）

```js
pinia.use(() => ({ hello: 'world' }))
```

2.直接在 store 设置属性

```js
pinia.use(({ store }) => {
  store.hello = 'world'
})
```

#### 调试

添加到 `store._customProperties` （**仅在开发模式** 开发工具）

```js
pinia.use(({ store }) => {
  store.hello = 'world'
  // 确保打包器可以处理这个问题（webpack 和 vite 默认这样做）
  if (process.env.NODE_ENV === 'development') {
    // 添加您在 store 中设置的任何 keys
    store._customProperties.add('hello')
  }
})
```

> 每个 store 都使用了 `reactive` 包装，自动进行解包。

#### 添加新状态

将新的状态属性添加到 store 或在 hydration 中使用的属性，需要在两个地方都添加：

- 在 `store` 上（可以使用 `store.myState` 访问）
- 在 `store.$state` 上（可以在 devtools 中使用，并且 **在 SSR 期间被序列化**）

待解决

```js
const globalSecret = ref('secret')
pinia.use(({ store }) => {
  // `secret` 在所有 store 之间共享
  store.$state.secret = globalSecret
  store.secret = globalSecret
  // 它会自动展开
  store.secret // 'secret'

  const hasError = ref(false)
  store.$state.hasError = hasError
  // 这个必须始终设置
  store.hasError = toRef(store.$state, 'hasError')

  // 在这种情况下，最好不要返回 `hasError`，因为它
  // 将显示在 devtools 的 `state` 部分
  // 无论如何，如果我们返回它，devtools 将显示它两次。
})
```

> 插件中发生的状态更改或添加（包括调用 `store.$patch()`）发生在存储处于活动状态之前，不会触发任何订阅。
>
> 如果使用 **Vue 2**，Pinia 会受到与 Vue 一样的 [相同的响应式警告](https://vuejs.org/v2/guide/reactivity.html##Change-Detection-Caveats)。 在创建 `secret` 和 `hasError` 之类的新状态属性时，需要使用来自 `@vue/composition-api` 的 `set`：
>
> ```js
> import { set } from '@vue/composition-api'
> pinia.use(({ store }) => {
>   if (!store.$state.hasOwnProperty('hello')) {
>     const secretRef = ref('secret')
>     // 如果数据打算在 SSR 期间使用，应该
>     // 将它设置在 `$state` 属性上，以便它被序列化并
>     // 在 hydration 中被提取
>     set(store.$state, 'secret', secretRef)
>     // 也可以直接在 store 中设置它，以便可以访问它
>     // 两种方式：`store.$state.secret` / `store.secret`
>     set(store, 'secret', secretRef)
>     store.secret // 'secret'
>   }
> })
> ```
>

### 添加新的外部属性

在将新的外部属性，来自其他类实例或非响应式的内容添加到 store 之前，使用 `markRaw()` 进行包装对象。

```js
import { markRaw } from 'vue'
// 根据您的路由所在的位置进行调整
import { router } from './router'

pinia.use(({ store }) => {
  store.router = markRaw(router)
})
```

### 在插件中调用 `$subscribe`

```js
pinia.use(({ store }) => {
  store.$subscribe(() => {
    // 在存储变化的时候执行
  })
  store.$onAction(() => {
    // 在 action 的时候执行
  })
})
```

### 添加新选项

添加新的选项，以便在之后使用。

```js
defineStore("search", {
  actions: {
    searchContacts() {
      // ...
    },
  },

  // 稍后将由插件读取
  debounce: {
    // 将动作 searchContacts 防抖 300ms
    searchContacts: 300,
  },
});
```

使用 debounce 替代 原来的 action。

待解决

```js
// 使用任何防抖库
import debounce from 'lodash/debunce'

pinia.use(({ options, store }) => {
  if (options.debounce) {
    // 我们正在用新的action覆盖这些action
    return Object.keys(options.debounce).reduce((debouncedActions, action) => {
      debouncedActions[action] = debounce(
        store[action],
        options.debounce[action]
      )
      return debouncedActions
    }, {})
  }
})
```