---
title: Vue3
categories:
  - JavaScript Framework
  - Vue
date: 2022-09-26 09:27:58
updated: 2025-06-26 11:16:50
---
# Vue3

## 基础

### 应用配置

#### 全局错误处理

应用实例暴露 `.config` 对象用于配置应用级选项。

```js
app.config.error = (err)=>{
	// 错误处理
}
```

将捕获所有子应用上抛而未处理的错误。

#### 全局 `axios`

引入 `axios` 并挂载到 `app.config.globalProperties上` 。

```js
app.config.globalProperties.$http = axios;
```

通过 `getCurrentInstance` 拿到的 `ctx` 就有 `$http` 可以调用。

```js
import {getCurrentInstance} from 'vue'
```

### 模板语法

### 响应式基础

#### 响应式代理 `reactive()`

使用 `reactive()` 创建响应式数组或对象（返回原始对象的 Proxy ）。

可以跟踪 **对象属性的访问和更改** 操作（ **JavaScript Proxy** ）。

对同一原始对象使用，都返回同一个代理对象；对同一个代理对象使用，返回其本身。

```js
import {reactive} from 'vue'
const state = reactive({ count: 0 })
```

在模板中使用响应式状态，需要在 `setup()` 中定义返回。

**局限性：**

- 只对引用类型有效，对基本类型无效。
- ”替换“一个响应式对象，将响应式对象的属性赋值、解构至本地变量、传入函数中，都会失去响应性。

#### 响应式变量 `ref()`

将传入参数的值包装为带有 `.value` 属性的 ref 对象。

当值为对象类型，会自动使用 `reactive()` 转换 `.value`。

```js
const obj = {
  foo: ref(1),
  bar: ref(2)
}

// 该函数接收一个 ref
// 需要通过 .value 取值
// 但它会保持响应性
callSomeFunction(obj.foo)

// 仍然是响应式的
const { foo, bar } = obj
```

**自动解包：**

- 在模板渲染中作为顶层属性
- 文本插值（`{{}}`）
- 作为响应式对象的属性被访问或更改

  赋值一个新的 ref 会替换掉旧的 ref

> 嵌套在深层响应式对象内时会发生 ref 解包，浅层响应式对象属性被访问不会自动解包。

```js
const object = { foo: ref(1) }
// 不会按预期执行
{{ object.foo + 1 }}
// 可以将其变为顶层属性
const { foo } = object
{{ foo + 1 }}
```

 ref 作为响应式数组或像 `Map` 这种原生集合类型的元素被访问时，不会进行解包。

#### 使用 `setup()`

```js
import { reactive } from 'vue'

export default {
  setup() {
    const state = reactive({ count: 0 })

    function increment() {
      state.count++
    }

    // 不要忘记同时暴露 increment 函数
    return {
      state,
      increment
    }
  }
}
```

#### 使用 `<script setup>`

```js
<script setup>
import { reactive } from 'vue'

const state = reactive({ count: 0 })

function increment() {
  state.count++
}
</script>

<template>
  <button @click="increment">
    {{ state.count }}
  </button>
</template>
```

#### DOM 更新时机

DOM 更新不是同步，而是等待“下一个时机“。可以通过 `nextTick()` 来等待状态更新后的 DOM 更新。

```js
import { nextTick } from 'vue'

function increment() {
  state.count++
  nextTick(() => {
    // 访问更新后的 DOM
  })
}
```

#### 响应性语法糖（试验）

### 计算属性

接受一个 getter 函数，返回一个计算属性 ref 。

响应式依赖不变，直接返回缓存值。

```js
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? 'Yes' : 'No'
})
```

#### 可写计算属性（避免直接修改计算属性）

```js
const fullName = computed({
  // getter
  get() {
    // firstName和lastName为响应式
    return firstName.value + ' ' + lastName.value
  },
  // setter
  set(newValue) {
    // 注意：我们这里使用的是解构赋值语法
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})
```

直接执行 `fullName.value = 'John Doe'`，会自动调用 setter。

> 计算属性不应该有副作用。

### 类与样式绑定

#### 绑定 class

##### 绑定对象

```html
<div :class="{ active: isActive }"></div>
```

绑定一个对象

```js
const classObject = reactive({
  active: true,
  'text-danger': false
})
```

```html
<div :class="classObject"></div>
```

##### 绑定数组

```html
<div :class="[isActive ? activeClass : '', errorClass]"></div>
```

在数组中嵌套对象

```html
<div :class="[{ active: isActive }, errorClass]"></div>
```

##### 在组件中使用

```html
<!-- 子组件模板 -->
<p class="foo bar">Hi!</p>

<!-- 在使用组件时 -->
<MyComponent class="baz boo" />

<!-- 渲染后 -->
<p class="foo bar baz boo">Hi</p>
```

组件有多个根元素时，通过 `$attrs` 指定

```html
<!-- 子组件模板 -->
<p :class="$attrs.class">Hi!</p>
<span>This is a child component</span>

<MyComponent class="baz" />

<!-- 渲染后 -->
<p class="baz">Hi!</p>
<span>This is a child component</span>

```

#### 绑定内联样式

##### 绑定对象

使用 camelCase 或 kebab-cased 形式

```html
<!-- camelCase  -->
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>

<!-- kebab-cased  -->
<div :style="{ 'font-size': fontSize + 'px' }"></div>
```

直接绑定一个对象

```js
const styleObject = reactive({
  color: 'red',
  fontSize: '13px'
})
```

```html
<div :style="styleObject"></div>
```

##### 绑定数组

```html
<div :style="[baseStyles, overridingStyles]"></div>
```

##### 自动前缀

vue 会自动添加浏览器特殊前缀。

##### 样式多值

```html
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

只渲染浏览器支持的最后一个值。

### 条件渲染

#### `v-if`

只在条件值为真时进行渲染。

可以在 template 元素上使用，对多个元素进行包裹。

> v-if 和 v-for 不支持同时使用在同一元素上。

#### `v-show`

在 DOM 渲染中保留该元素，只对该元素的 `display` 属性进行切换。

不支持 `template` 元素。

### 列表渲染

#### `v-for` 

可以在 template 元素上使用。

```html
<li v-for="(item, index) in items">
  {{ parentMessage }} - {{ index }} - {{ item.message }}
</li>

<!-- 使用of -->
<div v-for="item of items"></div>
```

使用解构

```html
<li v-for="({ message }, index) in items">
  {{ message }} {{ index }}
</li>
```

#### 遍历对象属性

遍历顺序基于对象调用 `Object.keys()` 的返回值决定。

```js
const myObject = reactive({
  title: 'How to do lists in Vue',
  author: 'Jane Doe',
  publishedAt: '2016-04-10'
})
```

```html
<li v-for="(value, key, index) in myObject">
  {{ index }}. {{ key }}: {{ value }}
</li>
```

#### 使用范围值

```html
<span v-for="n in 10">{{ n }}</span>
```

遍历 `1...n` 。 

#### 绑定 Key

遍历时需要绑定 key，对遍历元素进行区分。

#### 在组件上使用

```html
<MyComponent
  v-for="(item, index) in items"
  :item="item"
  :index="index"
  :key="item.id"
/>
```

#### 数组变化侦测

##### 变更原数组

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

##### 替换新数组

Vue 实现 **未** 丢弃原数组重新进行 DOM 渲染。

- `filter()`
- `concat()` 
- `slice()`

**在计算属性中使用 `reverse()` 和 `sort()` :**

```diff
- return numbers.reverse()
+ return [...numbers].reverse()
```

##### 数组更新

通过索引修改数组可以触发视图更新。

### 事件处理

#### 内联事件处理器

```html
<button @click="count++">Add 1</button>
<p>Count is: {{ count }}</p>
```

##### 调用方法

```html
<button @click="say('hello')">Say hello</button>
```

##### 访问事件参数

```html
<!-- 使用特殊的 $event 变量 -->
<button @click="warn('Form cannot be submitted yet.', $event)">
  Submit
</button>

<!-- 使用内联箭头函数 -->
<button @click="(event) => warn('Form cannot be submitted yet.', event)">
  Submit
</button>
```

#### 事件修饰符

- `.stop`

  单击事件将停止传递

- `.prevent`

  阻止默认事件

- `.self`

  仅当 `event.target` 是元素本身时才会触发事件处理器

- `.capture`

  事件捕获模式

- `.once`

  只被触发一次

- `.passive`

  立即发生而非等待 `onScroll` 完成。

  不能与 `.prevent` 同时使用。 

> `@click.prevent.self` 会阻止 **元素及其子元素的所有点击事件的默认行为**；
>
>  `@click.self.prevent` 则 **只会阻止对元素本身的点击事件的默认行为**。

#### 按键修饰符

```html
<input @keyup.enter="submit" />
<input @keyup.page-down="onPageDown" />
```

- `.enter`
- `.tab`
- `.delete` (捕获 “Delete” 和 “Backspace” 两个按键)
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

#### 系统按键修饰符

需要按住系统键，松开其他键时触发。（事件触发时处于按下状态）

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

##### `.exact` 修饰符

```html
<!-- 当按下 Ctrl 时，即使同时按下 Alt 或 Shift 也会触发 -->
<button @click.ctrl="onClick">A</button>

<!-- 仅当按下 Ctrl 且未按任何其他键时才会触发 -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- 仅当没有按下任何系统按键时触发 -->
<button @click.exact="onClick">A</button>
```

#### 鼠标按键修饰符

- `.left`
- `.right`
- `.middle`

#### 方法事件处理器

```js
const name = ref('Vue.js')

function greet(event) {
  alert(`Hello ${name.value}!`)
  // `event` 是 DOM 原生事件
  if (event) {
    alert(event.target.tagName)
  }
}
```

```html
<button @click="greet">Greet</button>
```

#### 方法与内联事件判断

方法事件处理器：`foo`、`foo.bar` 和 `foo['bar']`

内联事件处理器：`foo()` 和 `count++`

### 表单输入绑定

#### 基础使用

##### 文本

```html
<p>Message is: {{ message }}</p>
<input v-model="message" placeholder="edit me" />
```

##### 多行文本

```html
<span>Multiline message is:</span>
<p style="white-space: pre-line;">{{ message }}</p>
<textarea v-model="message" placeholder="add multiple lines"></textarea>
```

##### 复选框

```html
<!-- 绑定布尔值类型 -->
<input type="checkbox" id="checkbox" v-model="checked" />
<label for="checkbox">{{ checked }}</label>

<!-- 绑定数组或集合 -->
<div>Checked names: {{ checkedNames }}</div>

<input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
<label for="jack">Jack</label>

<input type="checkbox" id="john" value="John" v-model="checkedNames">
<label for="john">John</label>

<input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
<label for="mike">Mike</label>
```

##### 单选按钮

```html
<div>Picked: {{ picked }}</div>

<input type="radio" id="one" value="One" v-model="picked" />
<label for="one">One</label>

<input type="radio" id="two" value="Two" v-model="picked" />
<label for="two">Two</label>
```

##### 选择器

```html
<div>Selected: {{ selected }}</div>

<select v-model="selected">
  <option disabled value="">Please select one</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>

<!-- 多选 -->
<div>Selected: {{ selected }}</div>

<select v-model="selected" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```

动态渲染

```js
const selected = ref('A')

const options = ref([
  { text: 'One', value: 'A' },
  { text: 'Two', value: 'B' },
  { text: 'Three', value: 'C' }
])
```

```html
<select v-model="selected">
  <option v-for="option in options" :value="option.value">
    {{ option.text }}
  </option>
</select>

<div>Selected: {{ selected }}</div>
```

#### 值绑定

##### 复选框

```html
<input
  type="checkbox"
  v-model="toggle"
  :true-value="dynamicTrueValue"
  :false-value="dynamicFalseValue" />
```

> `true-value` 和 `false-value` 仅支持与 `v-model` 搭配使用。
>
> 其不会影响 `value` 属性。

##### 单选按钮

```html
<input type="radio" v-model="pick" :value="first" />
<input type="radio" v-model="pick" :value="second" />
```

##### 选择器选项

```html
<select v-model="selected">
  <!-- 内联对象字面量 -->
  <option :value="{ number: 123 }">123</option>
</select>
```

#### 修饰符

- `.lazy`   

  默认在每次 input 事件后触发（ IME 例外），可以通过 `.lazy` 修饰符使其在 change 事件后触发。

- `number`   

  用户输入自动转为数字，`parseFloat()` 无法处理则返回原始值。

  在 `type="number"` 时自动触发。

- `.trim`  

  去除输入内容两端空格。

```html
<!-- 在 "change" 事件后同步更新而不是 "input" -->
<input v-model.lazy="msg" />
```

### 生命周期

![Vue3生命周期](Vue3.assets/Vue3_image_1.svg)

### 侦听器

```js
watch(question, (newQuestion, oldQuestion) => {
    // TODO 
})
```

参数一：

- 一个 ref (包括计算属性)
- 一个响应式对象
- 一个 getter 函数
- 多个数据源组成的数组

不能直接监听相应对象的属性值，需要返回属性值的 getter 。

只有在返回不同的对象时，才会触发回调（）。

```js
const obj = reactive({ count: 0 })

// 错误，因为 watch() 得到的参数是一个 number
watch(obj.count, (count) => {
  console.log(`count is: ${count}`)
})

// 提供一个 getter 函数
watch(
  () => obj.count,
  (count) => {
    // 仅当 `state.someObject` 被替换时触发
    // 待实践
    console.log(`count is: ${count}`)
  }
)
```

#### 深层监听器

```js
watch(
  () => state.someObject,
  (newValue, oldValue) => {
    // 注意：`newValue` 此处和 `oldValue` 是相等的
    // *除非* state.someObject 被整个替换了
  },
  { deep: true }
)
```

直接传入一个响应式对象时，隐式创建深度监听器。

```js
const obj = reactive({ count: 0 })

watch(obj, (newValue, oldValue) => {
  // 在嵌套的属性变更时触发
  // `newValue` 此处和 `oldValue` 是相等的
  // 因为它们是同一个对象！
})

obj.count++
```

#### `watchEffect()`

`watch` 只有监听内容发生变化时，才会执行。

`watchEffect()` 会直接执行一次回调函数，自动追踪依赖。

仅会在同步执行期间，进行追踪依赖；异步回调时，只会在第一次 `wait` 正常工作前访问的属性才会被追踪。

```js
watchEffect(async () => {
  // 自动追踪 `url.value`
  const response = await fetch(url.value)
  data.value = await response.json()
})
```

#### 回调的触发时机

更改响应式状态时，会触发组件更新和侦听器回调。

默认侦听器回调在组件更新 **之前**。

若需要在侦听器回调中访问更新后的 DOM：

- 添加 `flush: 'post'` 

```js
watch(source, callback, {
  flush: 'post'
})

watchEffect(callback, {
  flush: 'post'
})
```

- 使用 `watchPostEffect`

```js
import { watchPostEffect } from 'vue'

watchPostEffect(() => {
  /* 在 Vue 更新后执行 */
})
```

#### 停止侦听器

使用同步语句创建的侦听器，组件卸载时自动停止。

异步回调创建的侦听器，需要手动停止，防止内存泄漏。

```js
// 它会自动停止
watchEffect(() => {})

// ...这个则不会！
setTimeout(() => {
  watchEffect(() => {})
}, 100)
```

手动停止侦听器，调用 `watch` 和 `watchEffect` 返回的函数。

```js
const unwatch = watchEffect(() => {})

// ...当该侦听器不再需要时
unwatch()
```

需要等待异步数据，可以使用条件式的侦听逻辑。

```js
// 需要异步请求得到的数据
const data = ref(null)

watchEffect(() => {
  if (data.value) {
    // 数据加载后执行某些操作...
  }
})
```

### 模板引用

通过 ref 对模板进行引用。

```html
<script setup>
import { ref, onMounted } from 'vue'

// 声明一个 ref 来存放该元素的引用
// 必须和模板里的 ref 同名
const input = ref(null)

onMounted(() => {
  input.value.focus()
})
</script>
<template>
  <input ref="input" />
</template>
```

若使用 `setup()` 需要返回创建的引用 input 。

模板引用需要在组件挂载后，否则为 null ；侦听时需要考虑为 null 的情况。

在 `v-for` 中使用返回的是一个数组，但 **不保证与源数组顺序相同**。

#### 函数模板引用

通过动态绑定一个函数作为 ref 。

```html
<input :ref="(el) => { /* 将 el 赋值给一个数据属性或 ref 变量 */ }">
```

每次组件更新时调用（卸载时也会调用，为 null ），元素引用作为第一个参数。

#### 组件上的 ref

使用在组件上与组件的 this 作用一致（除了使用 `<script setup>` 的组件，其默认私有）。

只能访问 `<script setup>` 中通过 `defineExpose` 暴露出来的属性或方法。

### 组件基础

#### 传递 props 

```html
<script setup>
// defineProps 仅在 <script setup> 中使用
// 不需要显示导入
// 返回一个对象
defineProps(['title'])
</script>
```

未使用 `<script setup>` 

```js
export default {
  props: ['title'],
  setup(props) {
    console.log(props.title)
  }
}
```

#### 监听事件

```html
<!-- 父组件 -->
<script setup>
import { ref } from 'vue'
import BlogPost from './BlogPost.vue'
  
const posts = ref([
  { id: 1, title: 'My journey with Vue' },
  { id: 2, title: 'Blogging with Vue' },
  { id: 3, title: 'Why Vue is so fun' }
])

const postFontSize = ref(1)
</script>

<template>
	<div :style="{ fontSize: postFontSize + 'em' }">
    <BlogPost
      v-for="post in posts"
      :key="post.id"
      :title="post.title"
      @enlarge-text="postFontSize += 0.1"
    ></BlogPost>
  </div>
</template>
```

子组件通过 `$emit` 上抛事件，通过 `defineEmits` 声明需要上抛的事件。

```html
<!-- 子组件 -->
<script setup>
defineProps(['title'])
// <script setup> 中无法直接访问 $emit
// 返回一个等同于 $emit 的 emit 函数
defineEmits(['enlarge-text'])
</script>
<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button @click="$emit('enlarge-text')">Enlarge text</button>
  </div>
</template>
```

未使用 `<script setup>` 可以通过上下文参数进行访问 emit 。

```js
export default {
  emits: ['enlarge-text'],
  setup(props, ctx) {
    ctx.emit('enlarge-text')
  }
}
```

#### 通过插槽分配内容

使用 `<slot/>` 作为占位符，显示通过双标签中的文本值传入的内容。

#### 动态组件

通过 is 属性来切换组件，切换时会卸载组件。

可以使用 `KeepAlive` 组件保存组件。

传给 `:is` 的值：

- 被注册的组件名
- 导入的组件对象

```html
<!-- currentTab 改变时组件也改变 -->
<component :is="tabs[currentTab]"></component>
```

#### DOM 模板解析注意事项

```html
<!DOCTYPE >
<html>
    <head>
        <meta charset="utf-8">
        <title>Vue Component</title>
    </head>
    <body>
        <div id="app">
            <!-- 在 HTML 中是 PascalCase (首字母大写命名) 的会被渲染 -->
            <MyComponent></MyComponent>
            <!-- 在 HTML 中是 camelCase (驼峰命名) 的不会被渲染 -->
            <myComponent></myComponent>
        </div>
    </body>
    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>
    <script>
        // 注册时：PascalCase (首字母大写命名)、camelCase (驼峰命名)、kebab-case (短横线命名) 都可以
        Vue.component('MyComponent', {
            template: '<div>Hello Vue</div>'
        });
        new Vue ({
            el: '##app'
        });
    </script>
</html>
```

#### 大小写区分

HTML 标签和属性不区分大小写，无论 `PascalCase` 形式的组件名称、`camelCase` 形式的 prop 名称还是 v-on 的事件名称，都需要转换为 `kebab-case` 形式。

```js
// JavaScript 中的 camelCase
const BlogPost = {
  props: ['postTitle'],
  emits: ['updatePost'],
  template: `
    <h3>{{ postTitle }}</h3>
  `
}
```

```html
<!-- HTML 中的 kebab-case -->
<blog-post post-title="hello!" @update-post="onUpdatePost"></blog-post>
```

#### 闭合标签

在 DOM 模板中需要显示关闭标签

```html
<my-component></my-component>
```

##### 元素位置限制

有些标签对内部元素有限制

```html
<table>
  <blog-post-row></blog-post-row>
</table>
<!-- 可以使用以下方式 -->
<table>
  <tr is="vue:blog-post-row"></tr>
</table>
```

## 深入组件

### 具名插槽

使用 `v-slot` 指明插槽名，`v-slot` 只能在 `<template>` 标签上使用。

### 组合式 API

#### `setup(props, context)`

新的 `setup` 会在组件被创建之前执行。  
`setup` 中避免使用 `this`，`setup` 发生在 `data`、`computed` 等之前。

```JavaScript
setup(props) {
	// 1. 通过ref定义响应式变量
	const counter = ref(0)
	function changeCounter() {
		counter.value++
	}

	// 2. 通过reactive定义响应式引用类型的数据
	const obj = reactive({
		name: "张三",
		age: 18,
		children: {
			name: "小张"
		}
	})
	function changeObjName() {
		obj.name = "李四"
	}
	// 通过扩展符解构对象中属性不是响应式的
	// toRefs使解构后的数据具备响应式
	// let { name, children } = toRefs(obj)
	// return { name, children }
	// 或
	// return { ...toRefs(obj) }
	return { counter, changeCounter, obj, changeObjName }
}
```

`ref()` 返回对象带有 `value` 属性。  
从 `setup` 返回的 `refs` 在模板中访问时是被自动浅解包的，因此不应在模板中使用 `.value`。

##### `Props`

```JavaScript
export default {
  props: {
    title: String
  },
  setup(props) {
    console.log(props.title)
  }
}

}
```

必须使用 `toRefs()` 解构，解构后返回带有 `value` 的对象。

```JavaScript
import { toRefs } from 'vue'

setup(props) {
  const { title } = toRefs(props)

  console.log(title.value)
}
```

若 `title` 为可选，则 `Props` 可能没有 `title` 属性，需要使用 `toRef`。

```JavaScript
import { toRef } from 'vue'
setup(props) {
  const title = toRef(props, 'title')
  console.log(title.value)
}

```

##### `Context`

`Context` 为普通 JavaScript 对象，可以使用 ES6 解构。

```JavaScript
  setup(props, context) {
  // setup(props, { attrs, slots, emit, expose }) {
    // Attribute (非响应式对象，等同于 $attrs)，如属性（class等）
    console.log(context.attrs)

    // 插槽 (非响应式对象，等同于 $slots)
    console.log(context.slots)

    // 触发事件 (方法，等同于 $emit)
    console.log(context.emit)

    // 暴露公共 property (函数)
    console.log(context.expose)
  }
```

**`expose`**

```JavaScript
// 子组件

context.expose({
	sendParent
})


// 父组件

// 在子组件声明ref为content，然后通过$refs访问
this.$refs.content.sendParent()
```

#### `watch()`

```JavaScript
import { ref, watch } from 'vue'

const counter = ref(0)
// watch(监听的响应式引用, 回调函数)
watch(counter, (newValue, oldValue) => {
	console.log('The new counter value is: ' + counter.value)
})

// 监听对象中的属性
// watchEffect(回调函数)
watchEffect(()=>{
	console.log(user.name)
})
```

#### `computed()`

返回一个带有 `value` 属性的对象。

```JavaScript
const msg = ref('helloworld')
const reverseMsg = computed(()=>{
	return msg.value.splie('').reverse().join('')
})
```

#### 声明周期钩子（`setup()` 中）

| 选项式 API        | Hook inside `setup` |
| ----------------- | ------------------- |
| `beforeCreate`    | Not needed*         |
| `created`         | Not needed*         |
| `beforeMount`     | `onBeforeMount`     |
| `mounted`         | `onMounted`         |
| `beforeUpdate`    | `onBeforeUpdate`    |
| `updated`         | `onUpdated`         |
| `beforeUnmount`   | `onBeforeUnmount`   |
| `unmounted`       | `onUnmounted`       |
| `errorCaptured`   | `onErrorCaptured`   |
| `renderTracked`   | `onRenderTracked`   |
| `renderTriggered` | `onRenderTriggered` |
| `activated`       | `onActivated`       |
| `deactivated`     | `onDeactivated`     |

#### `<script setup>`

##### 使用参数

```JavaScript
<script setup>
// Props
const props = defineProps({
  id: String
})

// emit
const emit = defineEmits(['change', 'delete'])
// setup code
</script>
```

##### 获取路由参数

```JavaScript
<script setup>
import { useRoute } from 'vue-router'
const id = useRoute().params.id
</script>
```

## Vue-Router

#### 路由匹配

```JavaScript
const routes = {
	// 1.静态路由
	{ path: '/', component: Home },
	
	// 2.1 动态路由参数id
	{ path: '/user/:id', component: User },
	
	// 2.2 仅匹配数字
	// 匹配 /1， /1/2， 等
	{ path: '/:chapters(\\d+)+' },
	// 匹配 /， /1， /1/2， 等
	{ path: '/:chapters(\\d+)*' },
	
	// 2.3 参数id可有可无
	// * 可以有多个参数进行叠加
	// 匹配 /user， /user/123， /user/123/456， 等
	{ path: '/user/:id*', component: User },
	// ？ 不能进行参数叠加
	// 匹配 /user， /user/123， 等
	{ path: '/user/:id', component: User }
	
	// 2.4 匹配404页面
	{ path: '/:path(.*)', component: NotFound }
}
```

#### 嵌套路由

```JavaScript
  {
    path: '/user/:id',
    component: User,
    children: [
      {
        // 当 /user/:id/profile 匹配成功
        // UserProfile 将被渲染到 User 的 <router-view> 内部
        path: 'profile',
        component: UserProfile,
      },
      {
        // 当 /user/:id/posts 匹配成功
        // UserPosts 将被渲染到 User 的 <router-view> 内部
        // 不需要加 /
        path: 'posts',
        component: UserPosts,
      },
    ],
  },
```

**以 `/` 开头的嵌套路径将被视为根路径。这允许你利用组件嵌套，而不必使用嵌套的 URL。**

#### 命名路由

```JavaScript
routes: [
{
  path: '/',
  components: {
	default: Home,
	// LeftSidebar: LeftSidebar 的缩写
	LeftSidebar,
	// 它们与 `<router-view>` 上的 `name` 属性匹配
	RightSidebar,
  },
},
],
```

### 路由组件传参

```JavaScript
const User = {
  // 请确保添加一个与路由参数完全相同的 prop 名
  props: ['id'],
  template: '<div>User {{ id }}</div>'
}
const routes = [{ path: '/user/:id', component: User, props: true }]
```

若为命名路由，每个组件都要设置：

```JavaScript
routes: [
{
  path: '/',
  components: {
	default: Home,
	// LeftSidebar: LeftSidebar 的缩写
	LeftSidebar,
	// 它们与 `<router-view>` 上的 `name` 属性匹配
	RightSidebar,
  },
  props: [default: true, LeftSidebar: false, RightSidebar: false]
},
],
```

### 不同的历史记录模式

#### Hash 模式

```JavaScript
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    //...
  ],
})
```

#### History 模式

```JavaScript
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    //...
  ],
})
```

## 跨域请求

通过设置 proxy 避免同源策略。  
*vite.config.js*

```JavaScript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
	plugins: [vue()],
	server: {
		proxy: {
			// 请求地址
			'/path': {
				target: 'https://i.maoyan.com'// 替换的服务端地址
				changeOrigin: true,
				rewrite: path=>path.replace(/^\/path/, '')// 设置重写路径
			}
		}
	}
})
```

*vue.config.js*

```JavaScript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({

	devServer: {
		proxy: {
			// 请求地址
			'/path': {
				target: 'https://i.maoyan.com'// 替换的服务端地址
				changeOrigin: true,
				pathRewrite: {// 设置重写路径
					'/path': ''
				}
			}
		}
	}
})
```

## [使用Typescript](Vue3+Typescript使用指南.md)

## Vue 代码规范指南

[Priority A Rules: Essential](https://vuejs.org/style-guide/rules-essential.html)

## 参考

[花了一天的时间，地板式扫盲了vue3所有API盲点📍前言 最近在一次理解vue项目的代码时，发现周一对好多API都不太 - 掘金](https://juejin.cn/post/7164159759619194893)  
[最全的 Vue3 快速上手指南【值得收藏】_IT 哈的博客-CSDN博客_vue3快速上手](https://blog.csdn.net/qq_31967569/article/details/123548456##comments_24106228)  
[101张脑图，带你从零开始学完Vue3（包括Vue3.2最新语法）🚀最近为了夯实Vue，花了74天，把Vue3完完整整 - 掘金](https://juejin.cn/post/7007710727725121566)
