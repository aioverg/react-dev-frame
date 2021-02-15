import router from '@src/router/router'
import menu from '@src/router/menu'

export const setPermission = permission => { // 权限路由和菜单
  return ({
    type: 'SET_PERMISSION',
    payload: {existRoute: router, existMenu: menu}
  })
}

export const noPermisson = () => {  // 所有路由和菜单
  return ({
    type: 'SET_ALL_PERMISSON',
    payload: {existRoute: router, existMenu: menu}
  })
}