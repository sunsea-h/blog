---
title: React-Router
date: 2022-09-26 09:27:58
updated: 2023-03-22 18:25:56
---

# React-Router

## 基础使用

```JavaScript
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'

function App(){
	return (
		<BrowserRouter>
			<Link to='/'>首页</Link>
			<Link to='/about'>关于</Link>

			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/about' element={<About />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
```

## 核心组件

### BrowserRouter

作用：包裹整个应用  
常用：
- `HashRouter`  
	使用 URL 的哈希值实现 `（http://localhost:3000/##/first）`
- `BrowserRouter`  
	使用 H5 的 `history.pushState` API 实现 `（http://localhost:3000/first）`

### Link

### Routes

### Route

#### exact 

为 true 为严格匹配，为 false 为非严格匹配。

```jsx
<Route path='/' component={Home} />
<Route path='/page' component={Page}>
//这种情况下，如果匹配路由path='/page'，那么会把Home也会展示出来。
```

可以使用 exact 来解决：

```jsx
<Route exact path='/' component={Home} />
<Route path='/page' component={Page} />
```

1. 一般 `path='/'` 这个路由一般会加上 exact 。
2. 嵌套路由不要加 exact 属性，如果父级路由加上，下面的子路由将不会生效，因为外层强制匹配。

## 编程式导航（跳转和参数）

### 跳转

1. 导入 `useNavigate` 钩子函数
2. 执行钩子函数得到跳转函数
3. 执行跳转函数完成跳转

**注意**：如果在跳转时不想加历史记录，可以添加额外参数 replace 为 true

```JavaScript
import { useNavigate } from "react-router-dom"

const Login=()=>{
  const navigate=useNavigate()
  const goAbout=()=>{
    navigate('/about',{replace:true})
  }
  return (
    <div>
      Login
      <button onClick={goAbout}>跳转关于页</button>
    </div>
  )
}

export default Login
```

### 跳转携带参数

1. searchParams 传参

```JavaScript
// 传参
navigate('/about?id=1001')

// 取参
let [params] = useSearchParams()
let id = params.get('id')
```

2. params 传参（path 配合：`/:id`）

```JavaScript
// 传参
navigate('/about/1001')

// 取参
let params = useParams()
let id = params.id
```

## 嵌套路由

1. App.js：定义嵌套路由声明

```JavaScript
<Routes>
  <Route path='/' element={<Layout />}>
  	{/* 默认二级路由 */}
  	<Route index element={<Board />} />
    {/* <Route path='board' element={<Board />} /> */}
    <Route path='article' element={<Article />} />
  </Route>
</Routes>
```

2. Layout.js：使用 `<Outlet />` 指定二级路由出口

```JavaScript
import { Outlet } from 'react-router-dom'

function Layout(){
	return (
		<div>
			Layout
			<Outlet />
		</div>
	)
}
```

## 404 页配置

```JavaScript
<Routes>
  <Route path='/' element={<Layout />}>
  	{/* 默认二级路由 */}
  	<Route index element={<Board />} />
    {/* <Route path='board' element={<Board />} /> */}
    <Route path='article' element={<Article />} />
  </Route>
  <Route path='/login' element={<login />} />
  {/* 404路由配置 */}
  <Route path='*' element={<NotFount />} />
</Routes>
```