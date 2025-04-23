---
title: UmiJS
categories:
  - JavaScript Framework
  - React
date: 2022-09-26 09:27:58
updated: 2023-05-05 10:50:52
---

# UmiJS

## 项目结构

## 路由

### 配置路由

```js
export default {
  routes: [
    { path: '/', component: 'index' },
    { path: '/user', component: 'user' },
  ],
}
```

#### path

只支持两种占位符：
- 动态参数 `:id` 的形式
- `*` 通配符（只能出现路由字符串的最后）

```txt
/groups
/groups/admin
/users/:id
/users/:id/messages
/files/*
/files/:id/*
```

#### component

绝对路径或相对路径，相对路径从 `src/pages` 开始找起。  
指向 `src` 目录可以使用 `@` 或 `../` 。

```js
component: '@/layouts/basic'
component: '../layouts/basic'
```

#### routers

嵌套子路由

```js
export default {
  routes: [
    { path: '/login', component: 'login' },
    {
      path: '/',
      component: '@/layouts/index',
      routes: [
        { path: '/list', component: 'list' },
        { path: '/admin', component: 'admin' },
      ],
    }, 
  ],
}
```

在 `src/layouts/index` 中通过 `<Outlet/>` 渲染子路由

```jsx
import {Outlet} from 'umi'
 
export default (props) => {
  return (
	  <div style={{ padding: 20 }}> 
		<Outlet/> 
	  </div>
  );
}
```

#### redirect

配置路由重定向

```js
export default {
  routes: [
    { path: '/', redirect: '/list' },
    { path: '/list', component: 'list' },
  ],
}
```

#### wrappers

路由组件的包装组件，在组件外增加一层嵌套路由。

```js
export default {
  routes: [
    { path: '/user', component: 'user',
      wrappers: [
        '@/wrappers/auth',
      ],
    },
    { path: '/login', component: 'login' },
  ]
}
```

*src/wrappers/auth*

```jsx
import { Navigate, Outlet } from 'umi'
 
export default (props) => {
  const { isLogin } = useAuth();
  if (isLogin) {
    return <Outlet />;
  } else{
    return <Navigate to="/login" />;
  }
}
```

>如果不希望改变路由结构，可以使用高阶组件实现 auth 逻辑。

```jsx
// src/hocs/withAuth.jsx
import { Navigate } from 'umi'
 
const withAuth = (Component) => ()=>{
  const { isLogin } = useAuth();
  if (isLogin) {
    return <Component />;
  } else{
    return <Navigate to="/login" />;
  }
}
```

然后使用高阶组件装饰路由组件：

```jsx
// src/pages/user.jsx
 
const TheOldPage = ()=>{
  ...
}
 
export default withAuth(TheOldPage)
```

#### title

配置路由标题

### 页面跳转

- 命令式：使用 `histroy`
- 组件内：使用 `useNavigate`

### Link 组件

用于单页面应用内部跳转。

```jsx
import { Link } from 'umi';
 
export default () => (
  <div>
    <Link to="/users">Users Page</Link>
  </div>
);
```

### 路由组件参数

#### match 信息

```jsx
const match = useMatch('/comp/:id')
// match 
{
  "params": {
    "id": "paramId"
  },
  "pathname": "/comp/paramId/",
  "pathnameBase": "/comp/paramId",
  "pattern": {
    "path": "/comp/:id",
    "caseSensitive": false,
    "end": true
  }
}
```

#### location 信息

```jsx
const location  = useLocation();
// location
{
  "pathname": "/path/",
  "search": "",
  "hash": "",
  "state": null,
  "key": "default"
}
```

#### 路由动态参数

```jsx
// 路由配置 /comp/:id
// 当前 location /comp/paramId
 
const params  = useParams();
// params
{
  "id": "paramId"
}
```

#### query 信息

```jsx
// 当前 location /comp?a=b;
const [searchParams, setSearchParams] = useSearchParams();
searchParams.get('a')  // b
searchParams.toString()  // a=b
 
setSearchParams({a:'c',d:'e'}) // location 变成 /comp?a=c&d=e
```

## Mock

### 请求方法

```js
// ./mock/users.ts
 
export default {
 
  // 返回值可以是数组形式
  'GET /api/users': [
    { id: 1, name: 'foo' },
    { id: 2, name: 'bar' }
  ],
 
  // 返回值也可以是对象形式
  'GET /api/users/1': { id: 1, name: 'foo' },
 
}
```

请求方式为 `GET` 时，可以省略为 `/api/users/1`。

### 自定义函数

除了声明静态返回值，也可以返回函数类型。

```js
export default {
 
  'POST /api/users/create': (req, res) => {
    // 添加跨域请求头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end('ok');
  }
 
}
```

### defineMock

待解决  
仅提供类型提示，入参与出参完全一致。

```js
import { defineMock } from "umi";
 
export default defineMock({
  "/api/users": [
    { id: 1, name: "foo" },
    { id: 2, name: "bar" },
  ],
  "/api/users/1": { id: 1, name: "foo" },
  "GET /api/users/2": (req, res) => {
    res.status(200).json({ id: 2, name: "bar" });
  },
});
```

### 关闭 Mock

1. 配置文件

```js
// .umirc.ts
 
export default {
  mock: false,
};
```

2. 环境变量

```shell
MOCK=none umi dev
```

## 代理

在开发中可以解决跨域问题。

```js
export default {
  proxy: {
    '/api': {
      'target': 'http://jsonplaceholder.typicode.com/',
      'changeOrigin': true,
      'pathRewrite': { '^/api' : '' },
    },
  },
}
```

将 `/api` 前缀的请求，代理到 `http://jsonplaceholder.typicode.com/`，替换请求地址中的 `/api` 为 `''`，并且将请求来源修改为目标 url。  
如请求 `/api/a`，实际上是请求 `http://jsonplaceholder.typicode.com/a`。

## 样式

通过 `import './index.css';` 引入样式文件会在整个 umi 项目生效，无论在那个 js 文件引入。  
可以使用 **CSS Modules** 来限制样式作用域：

```jsx
// src/pages/index.js
 
import styles from './index.css';
 
export default function () {
  return (
	  <div className={styles.title}>
	    Hello World
	  </div>
  );
}
```

>umi 默认支持 less 、 sass 、 scss 样式导入。

## 路由数据加载

### 启用方式

```js
// .umirc.ts
 
export default {
  clientLoader: {}
}
```

### 使用方式

```jsx
// pages/.../some_page.tsx
 
import { useClientLoaderData } from 'umi';
 
export default function SomePage() {
  const data = useClientLoaderData();
  return <div>{data}</div>;
}
 
export async function clientLoader() {
  const data = await fetch('/api/data');
  return data;
}
```

在 `clientLoader` 函数返回的数据，可以在组件内调 `useClientLoaderData` 获取。

## Umi Max

## 启用方式

## 配置

构建时配置