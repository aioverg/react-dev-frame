/**
 * 菜单列表
 * path 需要保持唯一，也作为路由的唯一标识符, 由于其他地方也要用到，所以规定以子路由完全继承父路由的规则定义路由
 * permKey：表示权限Key值，true表示所有用户都有权限
 * transKey：表示翻译文本对应的key
 */
const router = [
  {
    name: '首页',
    transKey: 'Catalog',
    path: '/bi/home',
    icon: 'home',
    permKey: true,
    children: [
      {
        name: '首页',
        transKey: 'Catalog',
        path: '/bi/catalog',
        icon: 'home',
        permKey: true,
        children: []
      },
    ]
  },

  {
    name: '仪表盘',
    transKey: 'dashBoard',
    path: '/bi/dashBoard',
    icon: 'laptop',
    permKey: 'dashBoard',
    children: []
  },

  {
    name: '数据准备',
    transKey: 'Database',
    key: 'database',
    path: '/bi/dataBase',
    icon: 'table',
    permKey: 'dataBase',
    children: []
  },
  {
    name: '系统管理',
    transKey: 'System',
    path: '/bi/system',
    icon: 'box-plot',
    permKey: 'system',
    children: [
      {
        name: '目录管理',
        path: '/bi/system/catalog',
        icon: 'box-plot',
        permKey: 'system.catalog',
        children: []
      },
      {
        name: '数据连接',
        path: '/bi/system/dataConnect',
        icon: 'box-plot',
        permKey: 'system.dataConnect',
        children: [
          {
            name: '数据连接管理',
            path: '/bi/system/dataConnect/manage',
            icon: 'box-plot',
            permKey: 'system.connect',
            children: []
          },
          {
            name: '服务器数据集',
            path: '/bi/system/dataConnect/dataset',
            icon: 'box-plot',
            permKey: 'system.dataset',
            children: []
          },
        ]
      }
    ]
  }
]

export default router
