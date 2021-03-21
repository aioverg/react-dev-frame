import React, { PureComponent, Fragment, Suspense } from 'react'
import { Switch, withRouter, useHistory } from 'react-router-dom'
import HeaderOne from '@src/components/layout/Header/Header'
import { getCookie } from '@utils/handleCookie'
import { connect } from 'react-redux'
import router, { RouteWithSubRoutes } from '@src/router/router'
import { setAxiosToken } from '@src/utils/handleAxios'
import { setPermission, noPermisson } from '@src/redux/actions'
/**
 * app主页面布局
 */
class Home extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      routes: []
    }
  }

  componentDidMount() { // 检查是否需要登录,若登录跳转到制定路由页，否则跳转到登录页
    const permissionFlag = true // 是否需要权限
    const { dispatch } = this.props
    const token = getCookie('feiu_token')
    const { history } = this.props
    this.routerGuard()
    if (token) {
      setAxiosToken(token) // 为 axios 的请求加上token
      if (permissionFlag) {// 需要菜单和路由权限
        // 获取用户权限列表
        dispatch(setPermission())
      } else {// 不需要菜单和路由权限
        dispatch(noPermisson())
      }
    } else {
      // 转跳登陆页面
      history.push("/login")
    }
  }

  routerGuard = () => { // 路由守卫
    const { history } = this.props
    window.addEventListener('hashchange', () => {
      const token = getCookie('feiu_token')
      if (!token) {
        history.push("/login")
      }
    })
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

  render() {
    const { collapsed, routes } = this.state
    const { history, match, menuList } = this.props
    const siderProps = {
      collapsed,
      history,
      menuList
    }
    return (
      <div>
        <HeaderOne {...siderProps} collapsed={collapsed} history={history} toggle={this.toggle} />
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <Fragment>
              <Switch>
                {router.map(item => {
                  return (<RouteWithSubRoutes key={item.name} {...item} />)
                })}
              </Switch>
            </Fragment>
          </Suspense>
        </div>
      </div>
    )
  }
}

export default connect(state => state)(withRouter(Home))