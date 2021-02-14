import React, { PureComponent, Fragment, lazy, Suspense } from 'react'
import { Switch, Redirect, withRouter } from 'react-router-dom'
import { Layout } from 'antd'
import HeaderOne from '@src/components/layout/Header/HeaderOne'
import Footer from '@src/components/layout/Footer/Footer'
import styles from './index.less'
import { generateRoute } from '@router/menu.route'
import { getCookie } from '@utils/handleCookie'
import { setAxiosToken } from '@utils/handleAxios'
import { toLoginPage } from '@utils/handleLogin'
import Connect from '@components/hoc/Connect'

/**
 * app主页面布局
 */
class Home extends PureComponent {
  constructor(props) {
    super(props)
    const { routes } = generateRoute()
    this.state = {
      collapsed: false,
      routes
    }
  }


  componentDidMount () { // 检查是否需要登录,若登录跳转到制定路由页，否则跳转到登录页
    const { dispatch, isNeedPermission } = this.props
    const token = getCookie('feiu_token')
    console.log('设置缓存', token)
    if (token) {
      setAxiosToken(token) // 为 axios 的请求加上token
      if (isNeedPermission) {// 需要菜单和路由权限
        // 获取用户权限列表
        dispatch({
          type: 'app/get/permission',
          payload: {
            token
          }
        })
      } else {// 不需要菜单和路由权限
        dispatch({
          type: 'app/get/router',
        })
      }
    } else {
      // 转跳登陆页面
      toLoginPage()
    }
  }


  goToPage = (path) => {
    const { history } = this.props
    history && path && history.push(path)
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  render () {
    const { collapsed, routes } = this.state
    const { history, match, menuList } = this.props
    const siderProps = {
      collapsed,
      history,
      menuList
    }
    console.log('routes-----', routes)
    console.log('match-----', match)
    return (
      <Layout className={styles.app}>
        <HeaderOne {...siderProps} collapsed={collapsed} history={history} toggle={this.toggle} />
        <Layout>
          <Layout.Content className={styles.content}>
            <Suspense fallback={<div>Loading...</div>}>
              <Fragment>
                <Switch>
                  {routes}
                </Switch>
              </Fragment>
            </Suspense>
          </Layout.Content>
          <Footer />
        </Layout>
      </Layout>
    );
  }
}

export default Connect(withRouter(Home), ({ app }) => (app))