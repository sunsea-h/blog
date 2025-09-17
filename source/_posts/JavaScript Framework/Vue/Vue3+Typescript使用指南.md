---
title: Vue3+Typescript使用指南
categories:
  - JavaScript Framework
  - Vue
date: 2023-05-09 10:37:53
updated: 2025-08-06 17:10:21
---
# Vue3+Typescript 使用指南

## 环境搭建

```shell
npm init vue@latest   
```

[Vite2 + Vue3 + TypeScript + Pinia 搭建一套企业级的开发脚手架](https://github.com/xushanpei/vite_vue3_ts)

## 类型标注

### ref()

`ref()` 接受一个内部值，返回一个响应式的、可更改的 `ref` 对象，通过属性 `value` 获取。

`ref()` 标注类型有三种方式：

1. 通过泛型参数的形式来给 `ref()` 增加类型（推荐）

	```js
	import { ref } from 'vue'      
	const initCode = ref<string | number>('200')   
	```

2. 如果是遇到复杂点的类型，可以自定义 `interface` 然后泛型参数的形式传入（推荐）

	```js
	import { ref } from 'vue'      
	interface User {     
		name: string     
		age: string | number   
	}      
	const user = ref<User>({     
		name:'hello world!',     
		age: 20   
	})   
	```

3. 通过使用 `Ref` 这个类型为 `ref` 内的值指定一个更复杂的类型

	```js
	import { ref } from 'vue'   
	import type { Ref } from 'vue'      
	const initCode: Ref<string | number> = ref('200')   
	```

### reactive()

`reactive()` 返回一个对象的响应式代理。

`reactive()` 标注类型有两种方式：

1. 直接给声明的变量添加类型（推荐）

```js
import { reactive } from 'vue'
interface User {
  name: string
  age: string | number
}
const user: User = reactive({ name: 'hello world!', age: '20' }) 
```

2. 通过泛型参数的形式来给 `reactive()` 增加类型（不推荐，处理了深层次 ref 解包的返回值与泛型参数的类型不同）

```js
import { reactive } from 'vue'
interface User {
  name: string
  age: string | number
}
const user = reactive<User>({ name: "hello world!", age: '20' }) 
```

### computed ()

接受一个 `getter` 函数，返回一个只读的响应式 `ref` 对象，即 `getter` 函数的返回值。它也可以接受一个带有 `get` 和 `set` 函数的对象来创建一个可写的 `ref` 对象。

`computed()` 标注类型有两种方式：

1. 从其计算函数的返回值上推导出类型

```js
import { ref, computed } from 'vue'
const count = ref<number>(0)
// 推导得到的类型：ComputedRef<string>
const user = computed(() => count.value + 'hello world!') 
```

2. 通过泛型参数显式指定 `computed()` 类型（推荐）

```js
import { computed } from 'vue';
const user = computed<string>(() => {
  // 若返回值不是 string 类型则会报错  
  return 'hello world!'
})
```

### defineProps()

为了在声明 `props` 选项时获得完整的类型推断支持，我们可以使用 `defineProps` API，它将自动地在 `script setup` 中使用。

1. 从它的参数中推导类型:

```js
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  age: Number
}) 
```

2. 通过泛型参数来定义 `props` 的类型

```js
interface Props {
  name: string
  age?: number
}
const props = defineProps<Props>()   
```

> 以上的两种方式虽然都可以很方便的 `标注类型`, 但是失去了对 `props` 定义默认值的能力

目前官方也给出了解决方案,但是目前这个方案还处于实验性,并且需要 `显式地选择开启`。

```js
// vite.config.js   
export default {     
	plugins: [       
		vue({         
			reactivityTransform: true       
		})     
	]   
}   
```

通过对 `defineProps()` 的响应性解构来添加默认值:

```js
interface Props {
  name: string
  age?: number
}
const { name = 'Bob', age = 100 } = defineProps<Props>()
```

### defineEmits()

为了在声明 `emits` 选项时获得完整的类型推断支持，我们可以使用 `defineEmits` API，它将自动地在 `script setup` 中使用。

```js
import type { GlobalTheme } from 'naive-ui'
const emit = defineEmits<{ (e: 'setThemeColor', val: GlobalTheme): void }>()  
```

### defineExpose()

`defineExpose()` 编译器宏来显式指定在 `script setup` 组件中要暴露出去的 `property`,使得父组件通过 `模板ref` 的方式获取到当前组件的实例。

`defineExpose()` 类型推导直接使用参数类型自动推导即可。

```js
import { ref } from 'vue'
const name = ref<string>('Bob')
defineExpose({ name })  
```

### provide()

`provide()` 供给一个值，可以被后代组件注入。

为 `provide()` 标注类型, Vue 提供了一个 `InjectionKey` 接口，它是一个继承自 `Symbol` 的泛型类型，可以用来在提供者和消费者之间同步注入值的类型。

```js
import { provide } from 'vue'
import type { InjectionKey } from 'vue'
// 建议声明 key (name) 放到公共的文件中
// 这样就可以在 inject 的时候直接导入使用
const name = Symbol() as InjectionKey<string>
provide(name, 'Bob') // 若提供的是非字符串值会导致错误  
```

以上方式是通过定义 key 的类型来标注类型的,还有一种方式直接 `key` 采用 `字符串` 的形式添加。

```js
provide('name', 'Bob')   
```

### inject()

`inject()` 注入一个由祖先组件或整个应用供给的值。

`provide()` 的 `key` 的类型是声明式提供的话 (`provide()` 类型标注的第一种形式)，`inject()` 可以直接导入声明的 `key` 来获取父级组件提供的值。

```js
import { inject } from 'vue'
import type { InjectionKey } from 'vue'
// 由外部导入
const name = Symbol() as InjectionKey<string>
const injectName = inject(name)   
```

如果 `provide()` 的 `key` 直接使用的 `字符串` 形式添加的, 需要通过泛型参数声明。

```js
const injectName = inject<string>('name')   
```

### 模板 ref

模板 `ref` 需要通过一个显式指定的 `泛型参数` 和一个 `初始值 null` 来创建：

```html
<script lang="ts" setup>
import { ref } from 'vue';
const el = ref<HTMLImageElement | null>(null)
</script>
<template>
  <img ref="el" class="logo" src="../assets/logo.svg" alt="" />
</template>
```

### 组件 ref

有时，可能需要为一个子组件添加一个模板 ref，以便调用它公开的方法。

```js
// Child.vue
const handleLog = () => console.log('hello world!')
defineExpose({ handleLog })
```

为了获取 `MyModal` 的类型，首先需要通过 `typeof` 得到其类型，再使用 `TypeScript` 内置的 `InstanceType` 工具类型来获取其实例类型：

```js
// Parent.vue
import { ref } from 'vue'
import Child from './Child.vue'
// 为子组件 ref 声明类型
const child = ref<InstanceType<typeof Child> | null>(null)
// 调用子组件中的方法
const getChildHandleLog = () => {
  child.value?.handleLog()
}   
```

### 事件处理器

原生的 DOM 事件标注类型。

```js
function handleChange(event: Event) {
  console.log((event.target as HTMLInputElement).value)
}
```

## 外部文章

[二次封装技巧](https://mp.weixin.qq.com/s/feTyOCo1CgvH8tiGOXh2-w)
