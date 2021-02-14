/**
 * 路由表
 */
import React from 'react'
import {Route} from 'react-router-dom'
const router = [
  {
    name: '首页',
    path: '/app/Catalog',
    component: React.lazy(() => import('@src/views/Catalog')),
    transKey: 'Catalog',
    permKey: true, // 表示所有用户都拥有权限
    children: []
  },
  // 目录模块
  {
    name: '首页',
    path: '/app/catalog',
    component: React.lazy(() => import('@src/views/Catalog')),
    transKey: 'Catalog',
    permKey: true, // 表示所有用户都拥有权限
    children: []
  },

  // 仪表盘模块
  {
    name: '仪表盘',
    transKey: 'dashBoard',
    path: '/app/dashBoard',
    component: React.lazy(() => import(/* webpackChunkName: 'system' */'@src/views/DashBoard')),
    routeProps: {
      
      
    },
    permKey: 'dashBoard',
    children: []
  },

  // 数据准备模块
  {
    name: '数据准备',
    path: '/app/dataBase',
    component: React.lazy(() => import(/* webpackChunkName: 'system' */'@src/views/DataBase')),
    permKey: true,
    children: []
  },

  // 系统管理模块
  {
    name: '系统管理',
    path: '/app/system',
    component: React.lazy(() => import(/* webpackChunkName: 'exchange' */'@src/views/System')),
    permKey: true, // 表示所有用户都拥有权限
    children: [
      {
        name: '目录管理',
        path: '/app/system/catalog',
        component: React.lazy(() => import(/* webpackChunkName: 'rolemanage' */'@src/views/System/CatalogManage')),
        permKey: 'system.catalog',
      },
      {
        name: '服务器数据集',
        path: '/app/system/dataConnect/dataset',
        component: React.lazy(() => import(/* webpackChunkName: 'rolemanage' */'@src/views/System/DataConnect/Dataset')),
        permKey: 'system.dataset',
      },
      {
        name: '数据连接管理',
        path: '/app/system/dataConnect/manage',
        component: React.lazy(() => import(/* webpackChunkName: 'rolemanage' */'@src/views/System/DataConnect/Connect')),
        permKey: 'system.dataConnect',
      }
    ]
  },
]

function RouteWithSubRoutes(route) {
  return(
    <Route
      path={route.path}
      render={props => (
      <route.component {...props} routes={route.children} />
    )}
    />
  )
}
export {RouteWithSubRoutes}
export default router