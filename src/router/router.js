/**
 * 路由表
 */
import React from 'react'
const router = [
  // 目录模块
  {
    name: '首页',
    transKey: 'Catalog',
    routeProps: {
      path: '/app/catalog',
      component: React.lazy(() => import('@src/views/Catalog')),
    },
    permKey: true, // 表示所有用户都拥有权限
  },

  // 仪表盘模块
  {
    name: '仪表盘',
    transKey: 'dashBoard',
    routeProps: {
      path: '/app/dashBoard',
      component: React.lazy(() => import(/* webpackChunkName: 'system' */'@src/views/DashBoard')),
    },
    permKey: 'dashBoard',
  },

  // 数据准备模块
  {
    name: '数据准备',
    routeProps: {
      path: '/app/dataBase',
      component: React.lazy(() => import(/* webpackChunkName: 'system' */'@src/views/DataBase')),
    },
    permKey: true,
  },

  // 系统管理模块
  {
    name: '系统管理',
    routeProps: {
      path: '/app/system',
      component: React.lazy(() => import(/* webpackChunkName: 'exchange' */'@src/views/System')),
    },
    permKey: true, // 表示所有用户都拥有权限
  },
  {
    name: '目录管理',
    routeProps: {
      path: '/app/system/catalog',
      component: React.lazy(() => import(/* webpackChunkName: 'rolemanage' */'@src/views/System/CatalogManage')),
    },
    permKey: 'system.catalog',
  },
  {
    name: '服务器数据集',
    routeProps: {
      path: '/app/system/dataConnect/dataset',
      component: React.lazy(() => import(/* webpackChunkName: 'rolemanage' */'@src/views/System/DataConnect/Dataset')),
    },
    permKey: 'system.dataset',
  },
  {
    name: '数据连接管理',
    routeProps: {
      path: '/app/system/dataConnect/manage',
      component: React.lazy(() => import(/* webpackChunkName: 'rolemanage' */'@src/views/System/DataConnect/Connect')),
    },
    permKey: 'system.dataConnect',
  }
]

export default router