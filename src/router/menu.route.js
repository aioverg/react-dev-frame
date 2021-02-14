import React from "react"
import { Redirect } from 'react-router-dom'
import { cloneDeep } from 'lodash'
import BoundaryRoute from '@components/error/BoundaryRoute'
import router from './router'

/**
 * 根据index.route.js配置生成路由
 * @param menuList // 用户菜单列表
 * @param permList // 用户权限列表
 */

export function generateRoute ( permList = null) { // 生产路由
  // 已生成有效的路由(菜单有，路由不一定有效，如包含二级菜单的一级菜单)
  const existRoute = {}
  // 生成路由routes
  const routes = router.map(item => {
    const { name, routeProps, permKey, transKey = '' } = item || {}
    if (routeProps && routeProps.path) {
      const key = routeProps.path
      if (!existRoute[key]) {
        /**
         * 初始化阶段：用户还没获取到权限列表，permList为null，应生成全部路由，否则刷新页面时都会转跳到首页
         * 更新阶段：用户获取到权限列表，permList已更新，不为null，根据用户权限列表重新生成路由
         */
        if (!permList || permKey === true || permList.includes(permKey)) {
          existRoute[key] = { name, transKey, routeProps: { path: key } }
          return <BoundaryRoute key={key} exact={true} {...routeProps} />
        }
      } else {
        const m = existRoute[key]
        console.error(`警告：【${name}-${key}】路由无效！已存在相同的路由【${m.name}-${m.routeProps.path}】，请在route.js中重置routeProps.path！`)
      }
    } else {
      console.error(`警告：【${name}】路由无效！routeProps，routeProps.path不能为空！`)
    }
  })
  console.log('-------------', routes)
  return { routes }
}

