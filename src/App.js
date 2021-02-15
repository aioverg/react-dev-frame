import React, { lazy, Suspense } from 'react'
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store'
import ReactIntlProvider from '@components/react-intl/ReactIntlProvider'
import { setAxiosBase } from '@utils/handleAxios'
import 'antd/dist/antd.less'
import '@src/comm/style/global.less'

// 设置axios拦截器
setAxiosBase()

/* webpackChunkName: "login" */ //打包时chunk名称，默认为数字，不利于定位分析打包文件
const Login = lazy(() => import(/* webpackChunkName: 'login' */'./views/Login'))
const Home = lazy(() => import(/* webpackChunkName: 'app' */'./views/Home'))

const App = (
  <Provider store={store}>
    <ReactIntlProvider>
      <HashRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route path='/login' component={Login} />
            <Route path='/bi' component={Home} />
            <Redirect to='/login' />
          </Switch>
        </Suspense>
      </HashRouter>
    </ReactIntlProvider>
  </Provider>
)

export default App
