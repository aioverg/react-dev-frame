const permissionInit = {
  existRoute: {},
  existMenu: [
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
}

export default function(state = permissionInit, action) {
  const {permissionList} = action.payload || {}
  return {
    ...state,
    ...permissionList
  }
}