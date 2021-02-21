# 框架使用 react  + redux + webpack4 + react-router

## 说明

设计原则：
1) 动态路由设置，本地mock服务

2）master分支（默认版本）

功能说明：
+ [1.菜单配置](#function.router)
+ [2.动态路由](#function.route)
+ [3.权限控制](#function.perm)
+ [4.按需加载](#function.lazy)
+ [5.本地mock服务](#function.mock)

## 初始化项目
```bash
$ npm i FEIU-BI -g
$ cfe init react
```

## 运行

```bash
$ npm start
```
or
```bash
$ npm run dev
```
## 打包

```bash
$ npm run build:test
```
or
```bash
$ npm run build:prod
```

## 结构说明
|— mock-server                 —— mock 数据
|— public                      —— 入口 index.html 文件
|— src                         —— 业务代码
|  |— comm
|  |  |— img                   —— 图片
|  |  |— icon                  —— icon 文件
|  |  |— style                 —— 样式
|  |  |— js                    —— JavaScript 文件
|  |— components               —— 组件
|  |— redux                    —— redux 状态管理
|  |— router                   —— router 路由
|  |— view                     —— 业务页面
|  |— App.js                   —— 入口 App.js 文件
|— webpack.config.js           —— webpack 配置文件 

## 功能说明
+ [1.菜单配置](#function.router)
+ [2.动态路由](#function.route)
+ [3.权限控制](#function.perm)
+ [4.数据管理](#function.data)
+ [5.按需加载](#function.lazy)
+ [6.国际化语言](#function.intl)
+ [7.本地mock服务](#function.mock)
+ [8.路径alias别名](#function.alias)
+ [9.错误统一处理](#function.error)
+ [10.安全CSRF防范](#function.csrf)
+ [11.导出当前页](#function.export)


### <span id="function.router">1.菜单配置</span>
新增一个菜单需要两个步骤：

1）在router/menu.js 中添加菜单

2）在router/router.js 中添加路由

### <span id="function.perm">2.权限控制</span>
权限控制分为菜单权限和功能权限，登录成功后，从后端获取权限列表（一个权限key值的列表）

1）菜单权限：
在router/router.data.js路由中配置permKey值，获取到用户权限列表后，重新生成新的菜单列表

2）路由权限：
在index.route.js路由中配置permKey值，获取到用户权限列表后，重新生成新的路由列表

3）功能权限：
若页面中存在某个按钮只有某些角色（权限）才能看到，根据用户权限列表判断是否需要显示该按钮，如tabs/example模块


涉及范围：
> router/menu.js 等等


### <span id="function.data">3.数据管理</span>
采用redux。
略


### <span id="function.lazy">4.按需加载</span>
按需加载处理方案：
2）采用react.lazy()处理，react16.6引入，利用import()原理处理懒加载，暂时还不支持服务器渲染


### <span id="function.intl">5.国际化语言</span>
暂不支持

目前处理国际化语言最流行的两种解决方案是[react-intl](https://github.com/formatjs/react-intl/blob/master/docs/Components.md)和[i18n](https://lingui.js.org/ref/react.html#component-I18nProvider)

本项目采用的是antd官方使用的一套国际化插件，[react-intl3](https://github.com/formatjs/react-intl/blob/master/docs/Components.md)，也是非常流行的一套解决方案，但目前网上的文章多是react-intl2的，react-intl3配置和使用方法均出现了较大的变化，具体可看官网。

### <span id="function.mock">6.本地mock服务</span>
这里采用的是一个外部插件cf-mock-server作为本地mock服务，具体配置可在webpack中配置

webpack.config.js
```js
module.exports = {
  //...
  devServer{
  //...
    after: (app, server) => {
      app.use(mock({
        config: path.join(__dirname, './mock-server/config.js')
      }))
    },
  }
}
```
然后创建mock-server文件夹及其配置文件config.js，最后在config.js配置对应的接口API以及对应json文件数据即可，具体可看home模块的例子

涉及范围：
> mock-server/*

### <span id="function.alias">7.路径alias别名</span>
通过创建import或require的别名，来确保模块的引入变得更简单。

webpack.config.js
```js
module.exports = {
  //...
  resolve: {
    alias: {
      '@assets': path.join(__dirname, 'assets'),
      '@src': path.join(__dirname, 'src'),
      '@components': path.join(__dirname, 'src/components'),
      '@utils': path.join(__dirname, 'src/utils'),
      '@router': path.join(__dirname, 'src/router'),
      '@locales': path.join(__dirname, 'src/locales'),
    }
  }
}
```
通常我们使用的编辑器是vscode，上述只对webpack有效，vscode编辑器它并不知道，command+点击并不会发生转跳，因此需要添加jsconfig.json配置

jsconfig.json
```js
{
  "compilerOptions": {
    "checkJs": false,
    "allowSyntheticDefaultImports": true,
    "baseUrl": ".",
    "paths": {
      "@assets/*": ["assets/*"],
      "@src/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"],
      "@router/*": ["src/router/*"],
      "@locales/*": ["src/locales/*"],
    }
  },
}
```

### <span id="function.error">8.错误统一处理</span>
采用axios作为通信处理方式，在应用页面初始化时，设置axios，并对url返回进行拦截处理，若出现错误异常，会出现两种场景，一种是网络错误，一种是业务错误

1）网络错误：网络请求状态为401，404，503等错误，并提示对应的信息。

2）业务错误：这种没有网络异常（即返回状态为200），通常后端返回的数据都会经过一层包装，若数据中存在success的状态，若为false，即发生了业务异常，需要对其进行特殊处理。本项目中业务异常返回到各模块中进行处理，在拦截层做统一处理，若成功直接返回真正可用的data数据；若失败，先提取后端返回的错误信息，并与原始数据一起直接返回给view层，至于如何处理错误，由view层自己决定

涉及范围：
> utils/handleAxios.js

### <span id="function.csrf">9.安全CSRF防范</span>
安全方面，采用token验证的方式解决

通过设置withCredentials携带cookie，前端登陆成功后，会从cookie中获取token值，并在axios请求的header中统一设置Authorization字段为token值，以后所有的请求的头部都会带上该Authorization字段，后端根据该字段与后端保存的token进行验证判断该请求是否合法

涉及范围：
> utils/handleAxios.js


