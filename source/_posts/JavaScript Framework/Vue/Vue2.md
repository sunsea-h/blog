---
title: Vue2
date: 2022-09-26 09:27:58
updated: 2024-09-14 16:02:15
---

# Vue2

## Vue 简介

Vue 是一套用于构建用户界面的渐进式框架。与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。Vue 的核心库只关注视图层，不仅易于上手，还便于与第三方库或既有项目整合。另一方面，当与现代化的工具链以及各种支持类库结合使用时，Vue 也完全能够为复杂的单页应用提供驱动。  
**特点：**

- 使用 es6 语法进行编程
- 虚拟 dom 操作
- 双向数据绑定 mvvm
- 使用指令完成条件渲染，列表渲染
- vue 基于 mvvm 框架

> m 指 model 服务器上的业务逻辑操作，v 指 view 视图 (页面)，vm 指 ViewModel 模型跟视图间的核心枢纽，比如 Vue.js。

![mvvm结构图](Vue2.assets/Vue2_image_1.png)

`DOM Listeners` 和 `Data Bindings` 是实现双向绑定的关键。  
从 View 侧看，ViewModel 中的 `DOM Listeners` 工具会帮我们监测页面上 DOM 元素的变化，如果有变化，则更改 Model 中的数据；  
从 Model 侧看，当我们更新 Model 中的数据时，`Data Bindings` 工具会帮我们更新页面中的 DOM 元素。

## 渲染和指令

一个 Vue 应用由一个通过 new Vue 创建的根 Vue 实例，以及可选的嵌套的、可复用的组件树组成。

### 基本渲染

当一个 Vue 实例被创建时，它将 data 对象中的所有的 property 加入到 Vue 的响应式系统中。当这些 property 的值发生改变时，视图将会产生“响应”，即匹配更新为新的值。

渲染最常见的形式就是使用“Mustache”语法 (双大括号) 的文本插值。

#### 文本渲染

在 data 中定义一个变量，通过 `Mustache` 语法 (双大括号) 将其渲染至页面 。

```JavaScript
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello world</title>
    <script src="https://cdn.bootcdn.net/ajax/libs/vue/2.6.9/vue.js"></script>
</head>
<body>
   <!-- 1.提供容器 -->
    <div id="app">
        <!-- {{ msg }} 在页面渲染的时候会被替换为 hello world -->
         <!-- 3.渲染到页面上 -->
        <div>{{ msg }}</div>
    </div>
    <script> // 2.创建vue实例
        let vm = new Vue({
            el: '##app',
            data() {
                return {
                    msg: 'hello world'
                }
            }
        })
		// 打开页面2s后页面显示的内容由 `'hello world'` 变化为 `'hello vue'`
		setTimeout(() => {
		vm.msg = 'hello vue'
		}, 2000)
	</script>
</body>
</html>
```

`Mustache 标签` 将会被替代为对应数据对象上 `msg property` 的值。无论何时，绑定的数据对象上 `msg property` 发生了改变，插值处的内容都会更新。  
也可以使用 **v-once** 指令，执行一次性地插值，当数据改变时，插值处的内容不会更新 。

```JavaScript
<!-- 1.提供容器 -->
<div id="app">
	<!-- {{ msg }} 在页面渲染的时候会被替换为 hello world -->
	 <!-- 3.渲染到页面上 -->
	<div v-once>{{ msg }}</div>
</div>
<script>
	// 2.创建vue实例
	let vm = new Vue({
		el: '##app',
		data() {
			return {
				msg: 'hello world'
			}
		}
	})
	setTimeout( () => {
		vm.msg = 'hello vue'
	}, 2000)
</script>
```

#### HTML 渲染

双大括号会将数据解释为普通文本，而非 HTML 代码。如果需要输出真正的 HTML，可以使用 **v-html** 指令 。

```JavaScript
<div id="app">
	<!-- 显示 <span>vue is very good</span> -->
	<div>{{ msg }}</div>
	<!-- 显示 vue is very good -->
	<div v-html='msg'></div>
</div>
<script>
	new Vue({
		el: '##app',
		data() {
			return {
				msg: '<span>vue is very good</span>'
			}
		}
	})
</script>
```

#### 属性渲染

双大括号 语法不能作用在 HTML attribute 上，遇到这种情况应该使用 **v-bind** 指令 为元素绑定属性 。

```JavaScript
<div id="app">
    <!-- 光标悬浮至div上时，显示title内文本 now you see me! -->
    <div v-bind:title='title'>{{ msg }}</div>
    <!-- 简写为:属性名="变量名" -->
    <div :title='title'>{{ msg }}</div>
</div>
<script>
    new Vue({
        el: '##app',
        data() {
            return {
                msg: 'hello world',
                title:'now you see me!'
            }
        }
    })
</script>
```

#### JS 表达式渲染

在双大括号内部，不仅可以绑定 `property` 键值，还可以绑定 JavaScript 表达式 。

```JavaScript
<div id="app">
    <!-- 页面显示 hello world haha -->
    {{ msg + 'haha' }}
</div>
<script>
    new Vue({
        el: '##app',
        data() {
            return {
                msg: 'hello world'
            }
        }
    })
</script>
```

### 指令渲染

指令 (Directives) 是带有 v- 前缀的特殊 attribute。指令 attribute 的值预期是单个 JavaScript 表达式。指令的职责是，当表达式的值改变时，将其产生的连带影响，响应式地作用于 DOM。

#### v-for

基于一个数组来渲染一个列表。需要使用 item in items 形式的特殊语法，其中 items 是源数据数组，而 item 则是被迭代的数组元素的 **别名**(index 为可选参数 :**当前项的索引。**)。

```JavaScript
<div id="app">
    <ul>
        <li v-for='(item,index) in articles'>
            <span>{{ item }} -- {{ index }}</span>
        </li>
    </ul>
</div>
<script>
    new Vue({
        el: '##app',
        data() {
            return {
                articles:['边城','简爱','无声告白']
            }
        }
    })
</script>
```

v-for 除了可以遍历数组，还可以遍历 **对象、数字、字符串**。

> 从 2.6 起，v-for 也可以在实现了可迭代协议的值上使用，包括原生的 Map 和 Set。  
> 但是 Vue 2.x 目前并不支持可响应的 Map 和 Set 值，所以无法自动探测变更。

#### v-if

用于条件性地渲染一块内容。这块内容只会在指令的表达式返回 `truthy` 值的时候被渲染。 也可以与 `v-else` 一起使用。  
`v-if` 与 `v-else` 同时使用时，`v-else` 元素必须紧跟在带 `v-if` 或者 `v-else-if` 的元素的后面，否则它将不会被识别 。  
一般使用 `<template>` 标签来进行条件渲染。

```JavaScript
<div id="app">
    <div v-if='see'> you see me! </div>
    <div v-else> you see other one</div>
</div>
<script>
    let vm = new Vue({
        el: '##app',
        data() {
            return {
                see: true
            }
        }
    })
    setTimeout(() => {
        vm.see = false
    }, 2000);
</script>
```

#### v-show

用于根据条件展示元素的选项，用法大致一样与 `v-if` 一样。  
`v-show`  不支持  `<template>`  元素，也不支持  `v-else`。

**`v-show` 与 `v-if` 的区别 :**

1. `v-show` 不支持 `v-else`
2. `v-show` 不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 进行切换。  
   `v-if` 是“真正”的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。  
   `v-if` 也是惰性的：如果在初始渲染时条件为假，则什么也不做；直到条件第一次变为真时，才会开始渲染条件块。
3. `v-if` 有更高的切换开销，而 `v-show` 有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用 `v-show` 较好；如果在运行时条件很少改变，则使用 `v-if` 较好。

#### v-bind

动态地绑定一个或多个特性，或一个组件 prop 到表达式（单项绑定）。  
在绑定 `class` 或 `style` 特性时，支持其它类型的值，如数组或对象。  
在绑定 prop 时，prop 必须在子组件中声明。可以用修饰符指定不同的绑定类型。  
没有参数时，可以绑定到一个包含键值对的对象。注意此时 `class` 和 `style` 绑定不支持数组和对象。

```JavaScript
<!-- 绑定一个属性 -->
<img v-bind:src="imageSrc">

<!-- 动态特性名 (2.6.0+) -->
<button v-bind:[key]="value"></button>

<!-- 缩写 -->
<img :src="imageSrc">

<!-- 动态特性名缩写 (2.6.0+) -->
<button :[key]="value"></button>

<!-- 内联字符串拼接 -->
<img :src="'/path/to/images/' + fileName">

<!-- class 绑定 -->
<div :class="{ red: isRed }"></div>
<div :class="[classA, classB]"></div>
<div :class="[classA, { classB: isB, classC: isC }]">

<!-- style 绑定 -->
<div :style="{ fontSize: size + 'px' }"></div> <div :style="[styleObjectA, styleObjectB]"></div>

<!-- 绑定一个有属性的对象 -->
<div v-bind="{ id: someProp, 'other-attr': otherProp }"></div>

<!-- 通过 prop 修饰符绑定 DOM 属性 -->
<!-- text-content是dom上的属性 -->
<div v-bind:text-content.prop="text"></div>

<!-- prop 绑定。“prop”必须在 my-component 中声明。-->
<my-component :prop="someThing"></my-component>

<!-- 通过 $props 将父组件的 props 一起传给子组件 -->
<child-component v-bind="$props"></child-component>
```

#### v-on

可以监听 DOM 事件，并在触发时运行一些 JavaScript 代码。

```JavaScript
<div id="app">
    <!-- 每次点击按钮，数字都会增长一次 -->
    <button v-on:click='count += 1'>{{ count }}</button>
</div>
<script>
    new Vue({
        el: '##app',
        data() {
            return {
                count: 1
            }
        }
    })
</script>
```

#### v-model

可以在表单 `<input>、<textarea> 及 <select>` 元素上创建双向数据绑定。

```JavaScript
<div id="app">
    <!-- 在input框中输入内容时，msg的值会相应的发生变化 -->
    <input type="text" v-model='msg'>
    {{ msg }}
</div>
<script>
    new Vue({
        el: '##app',
        data() {
            return {
                msg:''
            }
        }
    })
</script>
```

## 生命周期

### 生命周期钩子函数

Vue 的生命周期总共分为 8 个阶段：创建前/后，载入前/后，更新前/后，销毁前/后。

1. `beforeCreate`（创建前）  
    表示实例完全被创建出来之前，vue 实例的挂载元素 $el 和数据对象 `data` 都为 `undefined`，还未初始化。
2. `created`（创建后）  
    数据对象 data 已存在，可以调用 methods 中的方法，操作 `data` 中的数据，但 dom 未生成，`$el` 未存在 。
3. `beforeMount`（挂载前）  
    vue 实例的 `$el` 和 `data` 都已初始化，挂载之前为虚拟的 dom 节点，模板已经在内存中编辑完成了，但是尚未把模板渲染到页面中。`data.message` 未替换。
4. `mounted`（挂载后）  
    vue 实例挂载完成，`data.message` 成功渲染。内存中的模板，已经真实的挂载到了页面中，用户已经可以看到渲染好的页面了。实例创建期间的最后一个生命周期函数，当执行完 `mounted` 就表示，实例已经被完全创建好了，DOM 渲染在 `mounted` 中就已经完成了。
5. `beforeUpdate`（更新前）  
    当 `data` 变化时，会触发 `beforeUpdate` 方法 。data 数据尚未和最新的数据保持同步。
6. `updated`（更新后）  
    当 `data` 变化时，会触发 `updated` 方法。页面和 `data` 数据已经保持同步了。
7. `beforeDestory`（销毁前）  
    组件销毁之前调用 ，在这一步，实例仍然完全可用。
8. `destoryed`（销毁后）  
    组件销毁之后调用，对 data 的改变不会再触发周期函数，Vue 实例已解除事件监听和 dom 绑定，但 dom 结构依然存在。

生命周期钩子的 this 上下文指向调用它的 Vue 实例。

### 生命周期图

![生命周期图](Vue2.assets/Vue2_image_2.png)

## 事件

### 事件绑定

当事件处理的逻辑复杂时，在 v-on 指令中直接编写 JavaScript 代码是不可取的，此时可以在 v-on 指令中接收一个需要调用的 **方法名称**，方法名称定义在 methods 中。

```JavaScript
<div id="app">
	<!-- add_count是事件名称，需要在methods中定义 -->
	<button v-on:click='add_count'>{{ count }}</button>
</div>
<script>
	new Vue({
		el: '##app',
		data() {
			return {
				count:0
			}
		},
		methods: {
			add_count() {
				this.count ++
			}
		}
	})
</script>
```

### 事件参数

在事件调用时，可以进行参数的传递。

```JavaScript
<div id="app">
    <!-- show_msg是事件名称，小括号中的为事件参数 -->
    <button v-on:click='show_msg("hello vue")'>{{ msg }}</button>
</div>
<script>
	new Vue({
		el: '##app',
		data() {
			return {
				msg:'hello world'
			}
		},
		methods: {
			show_msg(args) {
				this.msg = args
			}
		}
	})
</script>
```

### 事件简写

进行事件绑定时，可以将 **v-on: 事件名** 缩写为**@事件名**。

```JavaScript
<!-- 绑定事件 -->
<button v-on:click='show_msg'>{{ msg }}</button>
<!-- 缩写 -->
<button @click='show_msg'>{{ msg }}</button>
```

### 事件修饰符

Vue.js 为 v-on 提供了 **事件修饰符**。使方法只有纯粹的数据逻辑，而不是去处理 DOM 事件细节。  
修饰符是由点开头的指令后缀来表示的。

- `.stop` 阻止单击事件继续传播
- `.prevent` 提交事件不再重载页面，阻止默认
- `.capture` 使用事件捕获模式
- `.self` 在自身触发时触发
- `.once` 仅执行一次
- `.passive` 滚动事件默认行为  
  `.passive` 将内核线程查询跳过，可以大大提升滑动的流畅度。

```JavaScript
<!-- 阻止单击事件继续传播 -->
<a v-on:click.stop="doThis"></a>
<!-- 提交事件不再重载页面 -->
<form v-on:submit.prevent="onSubmit"></form>
<!-- 修饰符可以串联 -->
<a v-on:click.stop.prevent="doThat"></a>
<!-- 只有修饰符 -->
<form v-on:submit.prevent></form>
<!-- 添加事件监听器时使用事件捕获模式 -->
<!-- 即内部元素触发的事件先在此处理，然后才交由内部元素进行处理 -->
<div v-on:click.capture="doThis">...</div>
<!-- 只当在 event.target 是当前元素自身时触发处理函数 -->
<!-- 即事件不是从内部元素触发的 -->
<div v-on:click.self="doThat">...</div>
<!-- 滚动事件的默认行为 (即滚动行为) 将会立即触发，而不会等待 `onScroll` 完成，这其中包含 `event.preventDefault()` 的情况 -->
<div v-on:scroll.passive="onScroll">...</div>
```

**注意：**

1. 默认事件虽然是 **冒泡后开始**，但 **不会因为 stop 阻止** 事件传递而停止。
2. 使用修饰符时，顺序很重要；相应的代码会以同样的顺序产生。用 **v-on:click.prevent.self** 会阻止所有的点击，而 **v-on:click.self.prevent** 只会阻止对元素自身的点击。
3. **passive 和 prevent 冲突，不能同时绑定在一个监听器上。**

### 按键修饰符

在监听键盘事件时，检查详细的按键。

```JavaScript
<!-- 只有在 `key` 是 `Enter` 时调用 `vm.submit()` -->
<input v-on:keyup.enter="submit">
```

## 表单

可以用 v-model 指令在表单 `<input>`、`<textarea>` 及 `<select>` 元素上创建 **双向数据绑定**。 它会根据控件类型自动选取正确的方法来更新元素。

### 文本框

```JavaScript
<div id="app">
	<!-- 单行文本框 -->
    <!-- <input type="text" v-model='msg'> {{ msg }} -->
	<!-- 多行文本框 -->
	<textarea v-model='msg'></textarea> {{ msg }}
</div>
<script> new Vue({
        el: '##app',
        data() {
            return {
                msg:''
            }
        }
    })
</script>
```

### 按钮

1. **单选按钮**

```JavaScript
<div id="app">
    <input type="radio" id="A" value="A" v-model="value">
    <label for="A">A选项</label>
    <input type="radio" id="B" value="B" v-model="value">
    <label for="B">B选项</label>
    <br>
    选择的结果是：{{ value }}
</div>
<script>
	new Vue({
		el: '##app',
		data() {
			return {
				value:'A'
			}
		}
	})
</script>
```

2. **复选按钮**

```JavaScript
<div id="app">
    <input type="checkbox" id="A" value="A" v-model="options">
    <label for="A">A</label>
    <input type="checkbox" id="B" value="B" v-model="options">
    <label for="B">B</label>
    <input type="checkbox" id="C" value="C" v-model="options">
    <label for="C">C</label>
    <br>
    选择的结果是: {{ options }}
</div>
<script>
	new Vue({
		el: '##app',
		data() {
			return {
				options:[]
			}
		}
	})
</script>
```

### 下拉列表

```JavaScript
<div id="app">
	<select v-model="value">
		<option disabled value="">请选择</option>
		<option value="周杰伦">周杰伦</option>
		<option value="林俊杰">林俊杰</option>
		<option value="张杰">张杰</option>
	</select>
  <br>
	选择的结果是：{{ value }}
</div>
<script>
    new Vue({
        el: '##app',
        data() {
            return {
                value:''
            }
        }
    })
</script>
```

## 计算属性

对于任何复杂逻辑，都应当使用 **计算属性**

```JavaScript
<div id="app">
	<!-- euvolleh -->
	{{ new_msg }}
</div>
<script>
	new Vue({
		el: '##app',
		data() {
			return {
				msg: 'hellovue'
			}
		},
		computed: {
			// 在计算属性中，对字符串进行反转
			new_msg() {
				// 通过 this 访问 data 中的变量 msg
				return this.msg.split('').reverse().join('')
			}
		}
	})
</script>
```

可以像绑定普通 property 一样在模板中绑定计算属性，Vue 知道 new_msg 依赖于 msg，因此当 msg 发生改变时，所有依赖 new_msg 的绑定也会更新。  
**setter**

```JavaScript
<div id="app">
    {{ new_msg }}
    <button @click='change'>按钮</button>
</div>
<script>
	new Vue({
		el: '##app',
		data() {
			return {
				msg: 'hellovue'
			}
		},
		methods: {
			// 当new_msg发生改变时，会触发计算属性的setter
			change() {
				this.new_msg = 'hello'
			}
		},
		computed: {
			new_msg: {
				get: function() {
					return this.msg.split('').reverse().join('')
				},
				set: function() {
					console.log(this.msg);
				}
			}
		}
	})
</script>
```

## 监听器

通过 watch 选项提供了一个更通用的方法，来响应数据的变化。当需要在 **数据变化时执行异步** 或开销较大的操作时，这个方式是最有用的 。

### 基本监听

当在输入框输入内容时，用户名 username 会相应的发生变化，这种变化可以被监听器监听到。

```JavaScript
<div id="app">
    用户名：<input type="text" v-model="username">
</div>
<script>
	new Vue({
		el: '##app',
		data() {
			return {
				username: ''
			}
		},
		watch: {
			username: function(newValue, oldValue) {
				console.log(`${this.username} is inputed`)
			}
		}
	})
</script>
```

### 深度监听

当改变一个对象的某个属性，需要触发事件时，使用基本监听可能无法触发事件，此时可以使用深度监听。

```JavaScript
<div id="app">
  <button @click='add_age'>按钮</button>
</div>
<script>
    new Vue({
        el: '##app',
        data() {
            return {
                information: {
                    username: 'Ronda',
                    age:20
                }
            }
        },
        methods: {
            add_age() {
                this.information.age = 13;
            }
        },
        watch: {
            information:{
	            // 初始化时调用函数
	            immediate: true
                handler: function(newValue, oldValue) {
                    console.log(this.information)
                },
              	//深度监听
              	// 监听器会一层层向下遍历，给每一个属性添加
                deep:true
            }
        }
    })
</script>
```

单独监听指定属性：

```JavaScript
        watch: {
	        // 单独监听
            "information.name": {
            // 或information["name"]: {
                handler: function(newValue, oldValue) {
                    console.log(this.information)
                },
              	//深度监听
                deep:true
            }
        }
```

深度监听实际应用 :**分页查询、搜索**。

## Class 与 Style 绑定

1. 放置字符串

```JavaScript
<p class="active">hello</p>
```

2. 放置对象（常用）

```JavaScript
<p :class="{ active: true, helloWord: isActive }">hello</p>
<button @click="isActive = !isActive">改变active</button>

// classObj={ active: true, helloWord: isActive }
<p :class="classObj">hello</p>

// 与普通的class会进行合并
<p :class="{ active: isActive}" class="helloWorld">hello</p>

// 返回对象的计算属性
computed: {
  classObject() {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}
<p :class="classObject">hello</p>
```

3. 数组语法

```JavaScript
<p :class="[message, activeClass]">hello</p>
```

## 组件

组件是可复用的 Vue 实例，且带有一个名字。

- 组件的特点
  - 组件可以进行任意次数的复用。
  - 组件的 data 必须是一个函数，确保每个实例可以维护一份被返回对象的独立的拷贝，也就是任何一个组件的改变不会影响到其他组件。
- 组件的组织  
  通常一个应用会以一棵嵌套的组件树的形式来组织

### 注册与使用

| 注册              | 使用                                     |
| ----------------- | ---------------------------------------- |
| MyComponentName   | \<my-component-name>、\<MyComponentName> |
| my-component-name | \<my-component-name>                     |

#### 全局操作

在注册一个组件的时候，需要给它一个名字。使用脚手架 vue/cli 创建项目后，在 main.js 中注册，注册后可以在任意的 Vue 实例（new Vue）中调用，并且可以调用多次。  
Vue.component(" 组件名称 ",config)

```JavaScript
<div id="app">
	<warning-alert></warning-alert>
	<warning-alert></warning-alert>
	<warning-alert></warning-alert>
</div>
<script>
	// 组件的注册需要在实例创建之前
	Vue.component("warning-alert",{
		template: `
			<div>
				警告框
			</div>
		`
	})
	new Vue({
		el: '##app'
	})
</script>
```

#### 局部操作

局部注册的组件在其子组件中不可用。

```JavaScript
<div id="app">
	<warning-alert></warning-alert>
	<warning-alert></warning-alert>
	<warning-alert></warning-alert>
</div>
<script>
    new Vue({
      el: '##app',
      components: {
        'warning-alert': {
          template: `
            <div>
              警告框
            </div>
          `
        }
      }
    })
</script>
```

### 组件通信

#### $emit、props

##### 父 ->子通信

父组件向子组件传值时通过 prop，所有的 prop 都使得其父子 prop 之间形成了一个 **单向下行绑定**：父级 prop 的更新会向下流动到子组件中，但是反过来则不行。这样会防止从子组件意外变更父级组件的状态，从而导致应用的数据流向难以理解。

额外的，每次父级组件发生变更时，子组件中所有的 prop 都将会刷新为最新的值。这意味着 **不** 应该在一个子组件内部改变 prop。如果这样做了，Vue 会在浏览器的控制台中发出警告。

```JavaScript
<div id="app">
	<component_prop :msg='msg'></component_prop>
</div>
<script>
    new Vue({
        el: '##app',
        data() {
            return {
                msg:'hello vue'
            }
        },
        components: {
            'component_prop': {
                props:['msg'],
                template: `
                    <div>
                        {{msg}}
                    </div>
                `
            }
        }
    })
</script>
```

##### 子 ->父通信

子组件通过发射事件 `$.emit('xxx')` 给父组件，通知父组件数据改变，父组件通过 `@xxx` 监听。

```JavaScript
<div id="app">
    <component_emit @add='addHandlerFather'></component_emit>{{total}}
</div>
<script>
	new Vue({
		el: '##app',
		data() {
			return {
				total:0
			}
		},
		methods: {
			addHandlerFather() {
				this.total++
			}
		},
		components: {
			'component_emit': {
				template: `
					<div>
						<button @click="addHandler">增加</button>
					</div>
				`,
				methods: {
					addHandler() {
						this.$emit('add')
					}
				}
			}
		}
	})
</script>
```

#### eventBus 事件总线（`$emit` / `$on`）

_event-bus.js_

```javascript
import Vue from 'vue'

export const EventBus = new Vue()
```

组件一

```javascript
import { EventBus } from './event-bus.js' // 引入事件中心

export default {
  data() {
    return {
      num: 0,
    }
  },
  methods: {
    add() {
      EventBus.$emit('addition', {
        num: this.num++,
      })
    },
  },
}
```

组件二

```javascript
import { EventBus } from './event-bus.js'

export default {
  data() {
    return {
      count: 0,
    }
  },
  mounted() {
    EventBus.$on('addition', (param) => {
      this.count = this.count + param.num
    })
  },
}
```

#### 依赖注入 Provide / Inject

##### 非响应式：

```JavaScript
// 父辈组件
  data() {
    return {
      todos: ['Feed a cat', 'Buy tickets']
    }
  },
  // 1.传入值
  provide: {
    user: 'John Doe'
  },
 // 2.传入变量
 provide() {
	 return {
		 user: this.user
	 }
 }


// 子辈组件
  inject: ['user'],
  created() {
    console.log(`Injected property: ${this.user}`) // > 注入的 property: John Doe
  }
})
```

##### 响应式：

1. 响应式对象

```JavaScript
// 父辈组件
  data() {
    return {
      todos: ['Feed a cat', 'Buy tickets']
		 obj: {
			 user: 'John Doe'
		 }
    }
  },
 provide() {
	 return {
		 obj: this.obj
	 }
 }

// 子辈组件
  inject: ['obj'],
  created() {
    console.log(`Injected property: ${this.user}`) // > 注入的 property: John Doe
  }
})
```

2. 函数返回响应式数据

```JavaScript
// 父辈组件
  data() {
    return {
      user: 'John Doe'
    }
  },
 provide() {
	 return {
		 user: ()=>this.user
	 }
 }

// 子辈组件
  inject: ['user'],
  created() {
    console.log(`Injected property: ${this.user}`) // > 注入的 property: John Doe
  }
})
```

#### ref、$refs

父子组件通信

```js
<template>
  <child ref="child"></component-a>
</template>
<script>
  import child from './child.vue'
  export default {
    components: { child },
    mounted () {
      console.log(this.$refs.child.name);  // JavaScript
      this.$refs.child.sayHello();  // hello
    }
  }
</script>
```

#### \$parent、 \$children

`$parent` 访问上一级组件实例。  
`$children` 访问子组件实例，返回一个数组，且不能保证顺序，不是响应式。  
`$root` 访问根组件实例。

#### \$attrs、 \$listeners

适用于隔代通信。  
`$attrs` 继承父作用域的所有属性（除了 prop 传递的属性、class、style）  
`$listeners` 一个对象，包含父作用域上的所有监听器（除了 `.native` 修饰的）

> inheritAttrs 为 true 自定义属性可以传入子组件；为 false 自定义属性不能传入子组件。

父组件

```js
<template>
    <div id="app">
        //此处监听了两个事件，可以在B组件或者C组件中直接触发
        <child1 :p-child1="child1" :p-child2="child2" @test1="onTest1" @test2="onTest2"></child1>
    </div>
</template>
<script>
import Child1 from './Child1.vue';
export default {
    components: { Child1 },
    methods: {
        onTest1() {
            console.log('test1 running');
        },
        onTest2() {
            console.log('test2 running');
        }
    }
};
</script>
```

子组件

```js
<template>
    <div class="child-1">
        <p>props: {{pChild1}}</p>
        <p>$attrs: {{$attrs}}</p>
        <child2 v-bind="$attrs" v-on="$listeners"></child2>
    </div>
</template>
<script>
import Child2 from './Child2.vue';
export default {
    props: ['pChild1'],
    components: { Child2 },
    inheritAttrs: false,
    mounted() {
        this.$emit('test1'); // 触发APP.vue中的test1方法
    }
};
</script>
```

孙子组件

```js
<template>
    <div class="child-2">
        <p>props: {{pChild2}}</p>
        <p>$attrs: {{$attrs}}</p>
    </div>
</template>
<script>
export default {
    props: ['pChild2'],
    inheritAttrs: false,
    mounted() {
        this.$emit('test2');// 触发APP.vue中的test2方法
    }
};
</script>
```

### 插槽

插槽就是子组件中的提供给父组件使用的一个占位符，用 `<slot></slot>` 表示，父组件可以在这个占位符中填充任何模板代码，如 HTML、组件等，填充的内容会替换子组件的 `<slot></slot>` 标签。

#### 默认插槽

当组件渲染的时候，`<slot></slot>` 将会被替换为 “Your Profile”。插槽内可以包含任何模板代码，包括 HTML : (子组件中的 `<slot></slot>` 在渲染时会被解析为父组件传递过来的内容)

```JavaScript
<div id="app">
    <component_slot>
        <div>hello vue</div>
    </component_slot>
</div>
<script>
    new Vue({
        el: '##app',
        components: {
            'component_slot': {
                template: `
                    <div>
                        <slot></slot>
                    </div>
                `
            }
        }
    })
</script>
```

#### 具名插槽

给插槽加上 name 属性。  
父组件在传递内容时在一个 `<template>` 元素上使用 v-slot 指令，并以 v-slot 的参数的形式提供其名称。

```JavaScript
<div id="app">
    <component_slot>
        <template v-slot:header>
            <div>我是头部</div>
        </template>
        <template v-slot:footer>
            <div>我是底</div>
        </template>
    </component_slot>
</div>

<script>
    new Vue({
        el: '##app',
        components: {
            'component_slot': {
                template: `
                    <div>
                        <slot name='header'></slot>
                        <slot name='footer'></slot>
                    </div>
                `
            }
        }
    })
</script>
```

#### 作用域插槽

让插槽内容能够访问子组件中才有的数据。

```JavaScript
<div id="app">
    <component_slot :arr='arr'>
        <template v-slot="scope">
            {{scope.scope.id}} -- {{scope.scope.name}}
        </template>
    </component_slot>
</div>
<script>
    new Vue({
        el: '##app',
        data() {
            return {
                arr:[{id:1,name:'Larry'},{id:2,name:'Ronda'}]
            }
        },
        components: {
            'component_slot': {
                template: `
                    <div>
                        <div v-for="item in arr">
                            <slot :scope="item"></slot>
                        </div>
                    </div>
                `,
                props:['arr'],
            }
        }
    })
</script>
```

## 混入

混入 (mixin) 提供了一种非常灵活的方式，来分发 Vue 组件中的可复用功能。一个混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被“混合”进入该组件本身的选项。

### 全局混入

```JavaScript
Vue.mixin({
    created() {},
    data() {},
    methods: {}
})
```

### 局部混入

```JavaScript
<div id="app">
    {{ msg }} -- {{ title }}
</div>
<script>
    let mixin = {
        data() {
            return {
                msg: 'this is mixin'
            }
        }
    }
    new Vue({
        el: '##app',
        data() {
            return {
                title: 'vue root'
            }
        },
        mixins:[mixin]
    })
</script>
```

### 混入规则

当组件和混入对象有同名选项时，这些选项会以恰当的方式合并

- 数据 data  
  数据对象在混入时，会进行合并，发生冲突时，保留组件的数据
- 值为对象 methods、computed 和 directives 等  
  在混入时，同名的 methods 会合并成为一个对象，如果对象的键名发生冲突，则保留组件对象的键值对
- 生命周期钩子函数  
  同名的钩子函数会被合并为一个数组，依次都会被调用，但是混入对象的钩子函数先被调用

### 自定义选项合并策略

自定义选项将使用默认策略，即简单地覆盖已有值。

```JavaScript
Vue.config.optionMergeStrategies.myOption = function (toVal, fromVal) {
	// 返回合并后的值
}
// 多数值为对象的选项，可以使用与methods相同的合并策略
var strategies = Vue.config.optionMergeStrategies strategies.myOption = strategies.methods
```

## 自定义指令

### 注册及使用

**注册全局指令**

```JavaScript
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus();
  }
})
```

**注册局部指令**

```JavaScript
new Vue({
	el: '##app',
	directives: {
	  focus: {
		// 指令的定义
		inserted: function (el) {
		  el.focus();
		}
	  }
	}
})
```

**使用**

```JavaScript
<input v-focus>
```

### 指令钩子函数

1. bind  
    指令第一次绑定到元素上的时候调用，这里可以进行一些初始化设置，只调用一次
2. inserted  
    被绑定的节点插入到父元素时会调用（只保证父节点的存在，当前节点不一定会被插入到文本中）
3. update  
    被绑定的元素 VNode 更新时调用（可能发生在子 VNode 更新之前）
4. componentUpdated  
    被绑定的元素 VNode 和它子 VNode 全部更新时调用
5. unbind  
    指令与元素解绑时调用，只调用一次

### 钩子函数参数

- el  
  绑定指令的 DOM 元素，可以直接操作 DOM
- binding  
  是一个对象，包含以下属性：
  - name  
    指令名，不包括 v- 前缀
  - value  
    指令绑定的值
  - oldValue  
    指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用
  - rawName  
    完整的指令名     v-focus
  - expression  
    字符串形式的指令表达式。例如 v-my-directive="1 + 1" 中，表达式为 "1 + 1"。
  - arg  
    传给指令的参数，可选。例如 v-my-directive:foo 中，参数为 "foo"。
  - modifiers  
    一个包含修饰符的对象。例如：v-my-directive.foo.bar 中，修饰符对象为 { foo: true, bar: true }。
- vnode  
  Vue 编译生成的虚拟节点
- oldVnode  
  上一个虚拟节点，在 update 和 componentUpdate 钩子中可用

## 渲染函数&JSX

### 渲染函数基础

Vue 推荐在绝大多数情况下使用模板来创建 HTML。然而在一些场景中，需要 JavaScript 的完全编程的能力。这时可以用 **渲染函数**，它比模板更接近编译器。

```JavaScript
<div id="app">
	<render_div></render_div>
</div>
<script>
    Vue.component("render_div",{
        render(createElement){
            return createElement('div','hello vue')
        }
    })
    new Vue({
        el: '##app',
    })
</script>
```

效果等同于

```JavaScript
<div id="app">
    <div>hello vue</div>
</div>
```

### createElement 函数

```JavaScript
// @returns {VNode}
createElement(
  // {String | Object | Function} 一个 HTML 标签名、组件选项对象或者
  // resolve 了上述任何一种的一个 async 函数。必填项。
  "div",

  // {Object}
  // 一个与模板中 attribute 对应的数据对象。可选。
  {
    // 与 `v-bind:class` 的 API 相同，
    // 接受一个字符串、对象或字符串和对象组成的数组
    class: {
      foo: true,
      bar: false,
    },
    // 与 `v-bind:style` 的 API 相同，
    // 接受一个字符串、对象，或对象组成的数组
    style: {
      color: "red",
      fontSize: "14px",
    },
    // 普通的 HTML attribute
    attrs: {
      id: "foo",
    },
    // 组件 prop
    props: {
      myProp: "bar",
    },
    // DOM property
    domProps: {
      innerHTML: "baz",
    },
    // 事件监听器在 `on` 内，
    // 但不再支持如 `v-on:keyup.enter` 这样的修饰器。
    // 需要在处理函数中手动检查 keyCode。
    on: {
      click: this.clickHandler,
    },
    // 仅用于组件，用于监听原生事件，而不是组件内部使用
    // `vm.$emit` 触发的事件。
    nativeOn: {
      click: this.nativeClickHandler,
    },
    // 自定义指令。
    // 注意，你无法对 `binding` 中的 `oldValue`赋值
    // 因为 Vue 已经自动为你进行了同步。
    directives: [
      {
        name: "my-custom-directive",
        value: "2",
        expression: "1 + 1",
        arg: "foo",
        modifiers: {
          bar: true,
        },
      },
    ],
    // 作用域插槽的格式为
    // { name: props => VNode | Array<VNode> }
    scopedSlots: {
      default: (props) => createElement("span", props.text),
    },
    // 如果组件是其它组件的子组件，需为插槽指定名称
    slot: "name-of-slot",
    // 其它特殊顶层 property
    key: "myKey",
    ref: "myRef",
    // 如果你在渲染函数中给多个元素都应用了相同的 ref 名，
    // 那么 `$refs.myRef` 会变成一个数组。
    refInFor: true,
  },

  // {String | Array}
  // 子级虚拟节点 (VNodes)，由 `createElement()` 构建而成，
  // 也可以使用字符串来生成“文本虚拟节点”。可选。
  [
    "先写一些文字",
    createElement("h1", "一则头条"),
    createElement(MyComponent, {
      props: {
        someProp: "foobar",
      },
    }),
  ]
);
```

#### 约束

**VNode 必须唯一**

```JavaScript
render: function (createElement) {
  return createElement('div',
    Array.apply(null, { length: 20 }).map(function () {
      return createElement('p', 'hi')
    })
  )
}
```

> `map`、`forEach`、`reduce` 不会遍历没有初始化或 delete 的元素

> `Array.apply(null, { length: 20 })`  
> 等同于  
> `Array.apply(null, Array(20))` 或  
> `Array.from({length: 20})` 或  
> `Array(20).fill(null)`

### JSX

render 函数语法比较复杂，基本是完全用代码创建 DOM 节点，如果想回归到更接近与 HTML 模版的语上，可以使用 JSX 语法。

```JavaScript
new Vue({
  el: '##app',
  render: function (h) {
    return (
      <div>
        <span>Hello</span> world!
      </div>
    )
  }
})
```

## 插件

插件通常是为 Vue 添加全局功能。  
**功能：**

1. 添加全局方法或者 property。
2. 添加全局资源：指令/过滤器/过渡等。
3. 通过全局混入来添加一些组件选项。
4. 添加 Vue 实例方法，通过把它们添加到 Vue.prototype 上实现。
5. 一个库，提供自己的 API，同时提供上面提到的一个或多个功能。 如 vue-router

### 插件声明

```JavaScript
// 或者let MyPlugin = {install:function(){}}
let MyPlugin = {};
MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或 property
  Vue.myGlobalMethod = function () {
    // 逻辑...
  }
  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
    ...
  })
  // 3. 注入组件选项
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
    ...
  })
  // 4. 添加实例方法
  Vue.prototype.$myMethod = function (methodOptions) {
    // 逻辑...
  }
}
```

### 插件使用

通过全局方法 Vue.use() 使用插件。它需要在调用 new Vue() 启动应用之前完成，Vue.use 会自动阻止多次注册相同插件，届时即使多次调用也只会注册一次该插件。

```JavaScript
// 调用 `MyPlugin.install(Vue)`
Vue.use(MyPlugin)
new Vue({
  // ...组件选项
})
```

示例

```JavaScript
  <div id="app">
    {{msg}}--{{title}}
  </div>
  <script>
    // 插件声明
    let MyPlugin = {
      install: function () {
        console.log('开始执行插件的内容');
        Vue.mixin({
          created: function () {
            // 逻辑...
            console.log('这里插件编写的在created执行的时候的代码');
          },
          data() {
            return {
              msg: '我是插件的数据'
            }
          }
        })
      }
    }
    // 插件使用
    Vue.use(MyPlugin);
    new Vue({
      el: '##app',
      data: {
        // msg: '我是正常的数据',
        title: 'Ronda测试插件'
      },
      created: function () {
        // 逻辑...
        console.log('这里正常的created执行的时候的代码');
      },
    })
  </script>
```

## 过滤器

过滤器可以用在两个地方：**双花括号插值和 v-bind** 表达式 (后者从 2.1.0+ 开始支持)。  
过滤器应该被添加在 JavaScript 表达式的尾部，由“管道”`|` 符号指示。

```JavaScript
<!-- 在双花括号中 -->
{{ message | filterMethod }}
<!-- 在 `v-bind` 中 -->
<div v-bind:id="rawId | filterMethod"></div>
```

### 全局注册

```JavaScript
<div id="app">
	<!-- 使用过滤器 -->
	<div>{{ new Date() | fmtDate_global}}--Ronda</div>
	<div :title="new Date() | fmtDate_global">鼠标悬停查看时间</div>
</div>
<script>
	// 全局注册过滤器
	Vue.filter("fmtDate_global", function (date) {
		return moment(date).format("YYYY-MM-DD HH:mm:ss");//需导入monment库
		// 或者return自己编写的时间处理函数
	})
	new Vue({
		el: '##app',
	})
</script>
```

### 局部注册

```JavaScript
<script>
new Vue({
	el: '##app',
	// 局部注册
	filters: {
	  fmtDate(date) {
		  return moment(date).format("YYYY-MM-DD HH:mm:ss");
		  // 或者return自己编写的时间处理函数
	  }
	}
})
</script>
```

### 使用

过滤器可以串联。filterA（定义可接受一个参数），message 的值为参数。然后 filterA 的结果在传入 filterB（定义可接受一个参数）中。

```JavaScript
 {{ message | filterA | filterB }}
```

过滤器是 JavaScript 函数，可以接收参数。`message的值` 为参数一，`'arg1'` 为参数二，`arg2` 为参数三

```JavaScript
{{ message | filterA('arg1', arg2) }}
```

## 参考

[史上最全 Vue 前端代码风格指南没有最好的代码规范，只有最合适的代码规范，但是不妨碍你来看看整理好的拿来即用的前端代码 - 掘金](https://juejin.cn/post/6987349513836953607)