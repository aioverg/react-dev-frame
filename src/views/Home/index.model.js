import { router } from '@router/router.data'
import { getUserPermList } from './index.api'
import { getMenuListByPermission } from '@router/menu.permission'
import { getValidMenuList } from '@router/menu.route'
import usaImg from '@assets/img/usa.svg'
import chinaImg from '@assets/img/china.svg'

const model = {
  // model名称，view层用于提取state的key，需要保证唯一
  name: 'app',
  // 初始state状态
  state: {
    language: localStorage.getItem('language') || 'zh-CN',
    languages: [
      {
        key: 'en-US',
        title: 'English',
        flag: usaImg,
      },
      {
        key: 'zh-CN',
        title: '中文',
        flag: chinaImg,
      },
    ],
    menuList: [],
    existRoute: {}, // 用户路由列表
    isNeedPermission: false, /* 路由权限控制，默认需要true; 若设置为false，所有的permKey可以去掉 */
  },
  // reducer
  reducers: {
    'app/language': (state, action) => {
      const { language } = action.payload || {}
      if (language) {
        localStorage.setItem('language', language)
      }
      return {
        ...state,
        language
      }
    },
    'app/get/router': (state, action) => {
      sessionStorage.setItem('username', 'admin')
      console.log('router', router)
      if (router) {
        // 过滤无效菜单
        const validrouter = getValidMenuList('path', router)
        return {
          ...state,
          menuList: validrouter,
        }
      }
      return { ...state }
    },
    'app/get/permission/success': (state, action) => { // 获取权限成功，根据权限设置路由
      const { permList, username } = action.payload || {}
      sessionStorage.setItem('username', username)
      if (permList) {
        // 过滤本地路由，返回本地的可用路由
        console.log('router', router)
        const validrouter = getValidMenuList('path', router)
        // 根据权限从本地路由中筛选出有权限的路由，组成动态路由
        const menuList = getMenuListByPermission(validrouter, permList)
        console.log('根据权限筛选出的路由', { ...state, menuList })
        // tips: 若只有菜单权限，没有其他按钮权限，就没必要存sessionStorage
        sessionStorage.setItem('permission', JSON.stringify(permList))
        return {
          ...state,
          menuList
        }
      }
      return { ...state }
    },
    'app/reset/state': (state, action) => {
      const { payload } = action
      if (payload) {
        return {
          ...state,
          ...payload
        }
      }
      return { ...state }
    }
  },
  // saga
  effects: { // 获取权限列表
    'app/get/permission': function* ({ payload }, { call, put }) {
      const res = yield call(getUserPermList, payload)
      const { is_success, username, perms } = res && res.data || {}
      if (res && is_success) {
        // 根据权限列表设置菜单
        yield put({ type: 'app/get/permission/success', payload: { permList: perms, username } })
      }
    },
  },
}

export default model
