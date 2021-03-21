/**
 * 菜单列表
 * 有的菜单可能会没有路由，所以这里使用菜单列表(menu.js)和路由列表(router.js)，两个文件。
 */
const router = [
  {
    name: '首页',
    transKey: 'Catalog',
    path: '/app/home',
    icon: 'home',
    permKey: true,
    children: [
      {
        name: '首页',
        transKey: 'Catalog',
        path: '/app/catalog',
        icon: 'home',
        permKey: true,
        children: []
      },
    ]
  },

  {
    name: 'CodeMirror',
    transKey: 'CodeMirror',
    path: '/app/CodeMirror',
    icon: 'laptop',
    permKey: 'CodeMirror',
    children: []
  },

  {
    name: '系统管理',
    transKey: 'System',
    path: '/app/system',
    icon: 'box-plot',
    permKey: 'system',
    children: [
      {
        name: '目录管理',
        path: '/app/system/catalog',
        icon: 'box-plot',
        permKey: 'system.catalog',
        children: []
      },
      {
        name: '数据连接',
        path: '/app/system/dataConnect',
        icon: 'box-plot',
        permKey: 'system.dataConnect',
        children: [
          {
            name: '数据连接管理',
            path: '/app/system/dataConnect/manage',
            icon: 'box-plot',
            permKey: 'system.connect',
            children: []
          },
          {
            name: '服务器数据集',
            path: '/app/system/dataConnect/dataset',
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
