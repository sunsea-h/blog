---
title: Vue-Router
date: 2022-09-26 09:27:58
updated: 2023-03-22 18:24:21
---

# Vue-Router

Vue Router 是 Vue.js 官方的路由管理器。它和 Vue.js 的核心深度集成，让构建单页面应用变得易如反掌。  
**功能：**

- 嵌套路由映射
- 动态路由选择
- 模块化、基于组件的路由配置
- 路由参数、查询、通配符
- 展示由 Vue.js 的过渡系统提供的过渡效果
- 细致的导航控制
- 自动激活 CSS 类的链接
- HTML5 history 模式或 hash 模式
- 可定制的滚动行为
- URL 的正确编码

## 基础

### 安装

- 方式一 : CDN 引入

```JavaScript
<script src="https://cdn.bootcdn.net/ajax/libs/vue/2.6.9/vue.js"></script>
<script src="https://cdn.bootcdn.net/ajax/libs/vue-router/3.4.3/vue-router.js"></script>
```

- 方式二 : 本地引入

```JavaScript
<script src='vue.js'></script>
<script src='vue-router.js'></script>
```

- 方式三 : npm 下载

```shell
 $ cnpm install vue-router
```

### 使用

在 html 文件中使用时需要引入 vueRouter

```JavaScript
<div id="app">
	<!-- 4.实现路由切换，router-link的本质是创建a标签 -->
	<router-link to="/r1_path">r1</router-link>
	<router-link to="/r2_path">r2</router-link>
	<!-- 5.路由出口，将匹配到的路由组件，渲染到此 -->
	<router-view></router-view>
</div>
<script>
    let r1 = {
        template:`
            <div>组件一</div>
        `
    }
    let r2 = {
        template:`
            <div>组件二</div>
        `
    }
    // 1.声明路由器实例对象
    let router = new VueRouter({
        // 2.声明配置路由对象
        routes:[{
            path:'/r1_path',
            component:r1
        },{
            path:'/r2_path',
            component:r2
        }]
    })
    new Vue({
        el:"##app",
        // 3.注册，将路由实例对象导入vue实例，相当于router:router,在此使用简写形式
        router
    })
</script>
```

## 动态路由

把某种模式匹配到的所有路由，全部映射到同一个组件。

```JavaScript
<!-- 有一个user组件，对于所有id不同的用户，都要使用这个组件来渲染 -->
<div id="app">
    <router-link to="/user/1">user1</router-link>
    <router-link to="/user/2">user2</router-link>
   <!-- 路由对应的内容加载到这里 -->
    <router-view></router-view>
</div>
<script>
    let user = {
        // 从$route中接受参数
        template:`
             <div>{{$route.params.id}}</div>
        `
    }
    // 2.创建路由实例对象
    let router = new VueRouter({
        routes:[{
            // 动态路径参数使用':'开头
            path:'/user/:id',
            component:user
        }]
    })
    new Vue({
        el:"##app",
        // 将路由实例对象导入vue实例
        router   //相当于router:router,在此使用简写形式
    })
</script>
```

当使用动态路径参数的时候，从/user/1 到 user/2 的时候，组件 user 实例就会被复用，比起销毁再重建，复用更加高效。

但是组件也会因此不再重新创建，这就导致一个问题，生命周期钩子函数就不会被调用了。  
**解决方案：**

1. 使用 watch 监控路由

```JavaScript
let user = {
    // 接受参数
    template:` <div>{{$route.params.id}}</div> `,
    watch: {
        $route(to,from) {
            console.log('to',to)
            console.log('from',from)
        }
    }
}
```

2. 使用路由守卫
3. 给 router-view 添加添加一个唯一 key 值

```JavaScript
<router-view :key="key"></router-view>

computed: {
    key() {
        return this.$route.name !== undefined? this.$route.name + +new Date(): this.$route + +new Date()
    }
 }
```

## 嵌套路由

```JavaScript
<div id="app">
    <router-link to="/user">user</router-link>
    <router-link to="/manager">manager</router-link>
    <router-view></router-view>
</div>
<script>
	let user = {
		template:`
			<div>
				<router-link to="/user/user_child1">子组件1</router-link>
				<router-link to="/user/user_child2">子组件2</router-link>
				<router-view></router-view>
			</div>
		`
	}
	let manager = {
		template:`
			<div>管理员</div>
		`
	}
	let userChild1 = {
		template:`
			<div>普通用户的子组件1</div>
		`
	}
	let userChild2 = {
		template:`
			<div>普通用户的子组件2</div>
		`
	}
  // 创建路由实例对象，嵌套路由
  let router = new VueRouter({
			routes:[{
				path:'/user',
				component:user,
				children:[{
						path:'user_child1',
						component:userChild1
				},{
						path:'user_child2',
						component:userChild2
				}]
			},{
				path:'/manager',
				component:manager,
			}]
  })
  new Vue({
			el:"##app",
			// 将路由实例对象导入vue实例
			router   //相当于router:router,在此使用简写形式
  })
</script>
```

## 编程式导航

### this.$router.push()

跳转到指定路由，会向 history 栈添加一个新的记录，当用户点击浏览器回退按钮的时候，可以回到跳转前的 url。

```JavaScript
<div id="app">
	<button @click="r1Handler">r1</button>
	<button @click="r2Handler">r2</button>
	<router-view></router-view>
</div>
<script>
	let r1 = {
		template:`
			<div>组件一</div>
		`
	}
	let r2 = {
		template:`
			<div>组件二</div>
		`
	}
	// 1.创建路由实例对象
	let router = new VueRouter({
		// 2.配置实例对象
		routes:[{
			path:'/r1_path',
			component:r1
		},{
			path:'/r2_path',
			component:r2
		}]
	})
	new Vue({
		el:"##app",
		// 3.将路由实例对象导入vue实例
		router,
		methods: {
			r1Handler() {
				this.$router.push({
					path:'/r1_path'
				})
			},
			r2Handler() {
				this.$router.push({
					path:'/r2_path'
				})
			}
		}
	})
</script>
```

### this.$router.repalce()

跟 router.push 很像，唯一的不同就是，它不会向 history 添加新记录，而是跟它的方法名一样 —— 替换掉当前的 history 记录。

### this.$router.go(n)

这个方法的参数是一个整数，意思是在 history 记录中向前或者后退多少步。

```JavaScript
// 在浏览器记录中前进一步，等同于 history.forward()
router.go(1)
// 后退一步记录，等同于 history.back()
router.go(-1)
// 前进 3 步记录
router.go(3)
// 如果 history 记录不够用，则会报错
router.go(-100)
router.go(100)
```

## 命令路由

```JavaScript
const router = new VueRouter({
  routes: [
    {
      path: '/user/:userId',
      name: 'user',
      component: User
    }
  ]
})
```

链接到一个命名路由（给 router-link 的 to 属性传一个对象）

```JavaScript
// 跳转到/user/123路径

<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>
// 等同于
router.push({ name: 'user', params: { userId: 123 }})
```

## 重定向

```JavaScript
// 从 /a 重定向到 /b
// 当用户访问 /a 时，URL 将会被替换成 /b，然后匹配路由为 /b 。
const router = new VueRouter({
  routes: [
		{
			path: '/a',
			redirect: '/b',
			// 或者 redirect: { name: 'b' }
			// 或者
			/*redirect: to => {
				// 方法接收 目标路由 作为参数
				// return 重定向的 字符串路径/路径对象
			}*/
		}
  ]
})
```

## 别名

让你可以自由地将 UI 结构映射到任意的 URL，而不是受限于配置的嵌套路由结构。

```JavaScript
// /a 的别名是 /b，意味着，当用户访问 /b 时，URL 会保持为 /b，但是路由匹配则为 /a，就像用户访问 /a 一样。
const router = new VueRouter({
  routes: [
		{
			path: '/a',
			component: A,
			alias: '/b'
		}
  ]
})
```

## 路由组件传参

路由传递是指，从 A 页面跳转到 B 页面时，将 A 页面中的变量传递给 B 页面使用，传递参数的方式有两种 :

### path-query 传参

使用 path 与 query 结合的方式传递参数时，参数会被拼接在浏览器地址栏中，并且刷新页面后数据也不会丢失。

```JavaScript
<div id="app">
	<router-link to="/user">user</router-link>
	<router-link to="/manager">manager</router-link>
	<router-view></router-view>
</div>
<script>
let user = {
	template:`
		<div @click="userHandler">普通用户，点击此处可跳转至管理员页面</div>
	`,
	data() {
		return {
			list:"hello",
			obj:{
				name:'tom',
				age:3
			}
		}
	},
	methods: {
		userHandler() {
			// 跳转
			this.$router.push({
				path:'/manager',
				query:{
					list:this.list,
					obj:JSON.stringify(this.obj)
				}
			})
		}
	},
}
let manager = {
	template:`
		<div>管理员 {{$route.query.list}}  {{$route.query.obj}}</div>
	`
}
let router = new VueRouter({
	routes:[{
		path:'/user',
		component:user
	},{
		path:'/manager',
		component:manager
	}]
})
new Vue ({
	el:"##app",
	router
})
</script>
```

### name-params 传参

使用 name 与 params 结合的方式传递参数时，参数不会被拼接在浏览器地址栏中显示，并且刷新页面后数据会丢失。

```JavaScript
<div id="app">
	<router-link to="/user">user</router-link>
	<router-link to="/manager">manager</router-link>
	<router-view></router-view>
</div>
<script>
let user = {
	template:`
		<div @click="userHandler">普通用户，点击此处可跳转至管理员页面</div>
	`,
	data() {
		return {
			list:"hello",
			obj:{
				name:'tom',
				age:3
			}
		}
	},
	methods: {
		userHandler() {
			// 跳转
			this.$router.push({
				name:'manager',
				params:{
					list:this.list,
					obj:JSON.stringify(this.obj)
				}
			})
		}
	},
}
let manager = {
	template:`
		<div>管理员 {{$route.params.list}}  {{$route.params.obj}}</div>
	`
}
let router = new VueRouter({
	routes:[{
		path:'/user',
		component:user,
		name:'user'
	},{
		path:'/manager',
		component:manager,
		name:'manager'
	}]
})
new Vue ({
	el:"##app",
	router
})
</script>
```

## 路由模式

| 路由模式     | 示例                          | 特点                                |
| ------------ | ----------------------------- | ----------------------------------- |
| hash 模式    | http://localhost:8080/##/login | 有##号，刷新页面没问题               |
| history 模式 | http://localhost:8080/login   | 无##号，刷新页面有问题，需要后台支持 |

### hash 模式

hash 模式的工作原理是 hashchange 事件，可以在 window 监听 hash 的变化。

```JavaScript
window.onhashchange = function(event){
	console.log(event);
	// 打印出一个HashChangeEvent事件对象，在该对象内有newURL和oldURL
	// location.hash中也有相关的信息
	// 假设hash值是个颜色值，通过location.hash来获取到对应的hash值，然后设置页面中的某个元素的背景颜色来改变页面
}
```

尽管浏览器没有请求服务器，但是页面状态和 url 已经关联起来了，这就是所谓的前端路由，单页应用的标配。

### history 模式

把 window.history 对象打印出来可以看到里边提供的方法和记录长度  
history 对象内有 back(),forword(),go() 等方法  
前进，后退，跳转操作方法：

```JavaScript
history.go(-3);//后退3次
history.go(2);//前进2次
history.go(0);//刷新当前页面
history.back(); //后退
history.forward(); //前进
```

### vue-router 使用的模式

vue-router 默认 hash 模式 —— 使用 URL 的 hash 来模拟一个完整的 URL，于是当 URL 改变时，页面不会重新加载。  
也可以使用路由的 **history 模式**，充分利用 history.pushState API 来完成 URL 跳转而无须重新加载页面。但是需要后台配置支持。

```JavaScript
const router = new VueRouter({
  mode: 'history',
  routes: [...]
})
```

## 导航守卫

`vue-router` 提供的导航守卫主要用来通过跳转或取消的方式守卫导航。

### 全局守卫

全局守卫有全局前置守卫、全局解析守卫、全局后置守卫。

当一个导航触发时，全局守卫按照创建顺序调用。守卫是 **异步** 解析执行，此时导航在所有守卫 `resolve` 完之前一直处于 **等待中**。

##### 全局前置守卫 `router.beforeEach`

路由跳转前触发，**每次导航** 时都会触发。

```JavaScript
const router = new VueRouter({ ... })
// Vue3
// const router = createRouter({ ... })
router.beforeEach((to, from, next) => {
	// ...
	// 返回的值为false或路由地址
	return false; // 返回false取消导航
	// 什么都没有 underfined或返回true，导航有效
})
```

**参数：**

- `to`：即将要进入的目标路由对象
- `from`：当前导航正要离开的路由
- `next`：(`Function`) 一定要调用该方法来 `resolve` 这个钩子
  - `next()`：进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 `confirmed`(确认的)。
  - `next(false)`：中断当前的导航。如果 URL 改变，URL 重置到 from 对应的地址。
  - `next('/')` 或 `next({path:'/'})`：跳转到一个不同的地址。
  - `next(error)`：导航被终止且错误传递给 `router.onError()` 注册过的回调

##### 全局解析守卫（2.5.0+）`router.beforeResolve`

**每次导航** 时都会触发。路由跳转前，同时在所有 **组件内守卫** 和 **异步路由组件** 被解析之后触发。

```JavaScript
router.beforeResolve((to, from, next) => {
	next();
})
```

##### 全局后置钩子 `router.afterEach`

**每次导航** 时都会触发。路由跳转完成后，`beforeEach` 和 `beforeResolve` 之后，`beforeRouteEnter`（组件内守卫）之前触发。  
不接受 `next` 函数，不改变导航本身。

```JavaScript
router.afterEach((to, from) => {
	// ...
})
```

### 路由独享守卫 `beforeEnter`

直接在路由配置上定义，只在 **进入路由** 时触发，在 `beforeEach` 之后紧随执行。不会在 `params`、`query` 或 `hash` 改变时触发。  
与全局前置守卫的方法参数一样。

```JavaScript
const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: (to, from, next) => {
		// ...
    },
  },
]
```

也可以将一个函数数组传递给 `beforeEnter`，为不同路由重用守卫时很有用。

### 组件内的守卫

可以在路由组件内直接定义路由导航守卫 (传递给路由配置的)

#### `beforeRouteEnter`

在渲染该组件的对应路由被 `confirm` 前调用。  
不能获取组件实例 `this`(underfined，组件实例没被创建)，但可以通过 `next` 回调函数访问组件实例。

```JavaScript
const Foo = {
	template: `...`,
	beforeRouteEnter (to, from, next) {
		next(vm => {
		// 通过 `vm` 访问组件实例
		})
	}
}
```

#### `beforeRouteUpdate`

在当前路由改变，但是该组件被复用时调用（对于一个带有动态参数的路径 `/foo/:id`，在 `/foo/1` 和 `/foo/2` 之间跳转的时候）。  
由于会渲染同样的 `Foo` 组件，因此组件实例会被复用，而这个钩子就会在这个情况下被调用。  
可以访问组件实例 `this`。

```JavaScript
const Foo = {
  template: `...`,
  beforeRouteUpdate (to, from, next) {

  }
}
```

#### `beforeRouteLeave`

导航离开该组件的对应路由时调用。  
可以访问组件实例 `this`。

```JavaScript
const Foo = {
  template: `...`,
  beforeRouteLeave (to, from, next) {

  }
}
```

### 完整的导航解析流程

1. 导航被触发。
2. 在失活的组件里调用 `beforeRouteLeave` 守卫。
3. 调用全局的 `beforeEach` 守卫。
4. 在重用的组件里调用 `beforeRouteUpdate` 守卫 (2.2+)。
5. 在路由配置里调用 `beforeEnter`。
6. 解析异步路由组件。
7. 在被激活的组件里调用 `beforeRouteEnter`。
8. 调用全局的 `beforeResolve` 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 `afterEach` 钩子。
11. 触发 DOM 更新。
12. 调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数，创建好的组件实例会作为回调函数的参数传入。

![流程图](Vue-Router.assets/Vue-Router_image_1.png)

## 路由懒加载

使用时才会加载相关组件。

```JavaScript
// 将
// import UserDetails from './views/UserDetails'
// 替换成
const UserDetails = () => import('./views/UserDetails')

const router = createRouter({
  // ...
  routes: [{ path: '/users/:id', component: UserDetails }],
})
```

只要返回的是 Promise 组件的函数即可，也可以使用一下写法：

```JavaScript
const UserDetails = () =>
  Promise.resolve({
    /* 组件定义 */
  })
```