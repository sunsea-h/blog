---
title: React 第三方库
categories:
  - JavaScript Framework
  - React
date: 2022-10-17 12:07:39
updated: 2025-05-06 11:42:59
---
# React 第三方库

## React-cookie

原生 js 操作 cookie，使用 `document.cookie` 添加或修改。  

```js
document.cookie = "token=hPgY5iYLuA4EdSvhizhi7gUYR83056; expires=Fri Oct 21 2022 14:10:40 GMT;"
```

只能获取所有的 cookie 键值对，无法获取指定 cookie ；通过赋予过期时间进行删除。操作复杂。  
React-cookie 对原生 js 操作 cookie 进行优化。  
**类组件**

```jsx
import { withCookies } from 'react-cookie'

class App extends React.Component {
  constructor(props) {
    super(props)
  }
  handleClick1 = () => {
    const { cookies } = this.props
    cookies.set('token', 'hPgY5iYLuA4EdSvhizhi7gUYR83056')
  }

  handleClick2 = () => {
    const { cookies } = this.props
    const token = cookies.get('token')
    console.log(token)
  }

  handleClick3 = () => {
    const { cookies } = this.props
    cookies.remove('token')
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick1}>保存cookie</button>
        <button onClick={this.handleClick2}>获取cookie</button>
        <button onClick={this.handleClick3}>删除cookie</button>
      </div>
    )
  }
}

export default withCookies(App)
```

**函数组件**

```jsx
import { useCookies } from 'react-cookie'

function App(props) {
  const [cookies, setCookies, removeCookies] = useCookies()

  const handleClick1 = () => {
    setCookies('token', 'hPgY5iYLuA4EdSvhizhi7gUYR83056')
    console.log('set')
  }
  const handleClick2 = () => {
    const token = cookies.token
    console.log(token)
  }
  const handleClick3 = () => {
    removeCookies('token')
    console.log('remove')
  }

  return (
    <div>
      <button onClick={handleClick1}>保存cookie</button>
      <button onClick={handleClick2}>获取cookie</button>
      <button onClick={handleClick3}>删除cookie</button>
    </div>
  )
}
```

**组件之外**

```jsx
import { Cookies as Cookie } from 'react-cookie';

const Cookies = new Cookie();

Cookies.set(name, value, options);

Cookies.get(name);

Cookies.remove(name, options);
```

**Options**:

```js
path: '/',  // cookie的使用路径，如果设置为“/”，则本域名下contextPath都可以访问
expires,  // cookie的绝对到期日期
maxAge: 1000,  // 从客户端收到 cookie 开始的相对过期时间
domain: 'https://play.bukinoshita.io',  // 可访问的域
secure: true,  // 如果设置true，它将只能通过 https 访问
httpOnly: true,  // 如果设置true，它将只能在服务器上访问
```

添加过期时间

```js
const expires = new Date(new Date().getTime() + 3 * 60 * 1000)

setCookies('token', 'hPgY5iYLuA4EdSvhizhi7gUYR83056', {
	expires,
})
```

不同域，不同路径可以存储相同名字的 cookie 。  
为防止重复登录等情况，产生相同名字不同域的 cookie ，导致获取 token 时失效，可以在存储 cookie 时设置访问路径和访问域。

```js
let cookieSetup = {
	path: '/',
	domain: window.location.hostname,
}
setCookies('token', token, cookieSetup);
```

删除同名不同域的 cookie 时，需要添加路径才能删除。

```js
removeCookies(name, { path: '/' })
```

在 cookie 中 `逗号` 、`分号` 、`空格` 是特殊字符，所以 key 和 value 中不能包含，在原生 js 操作时需要对三个特殊字符进行处理，将 key 和 value 存取时进行编码。  
在 React-cookie 中自动进行编码处理。  
