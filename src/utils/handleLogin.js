import { getCookie, clearCookie } from '@utils/handleCookie'

/**
 * 转跳认证登陆系统
 */
export function toLoginPage () {
  location.href = `${AUTH_SERVICE}/#/login`
}

/**
 * 登出操作
 */
export function logout () {
  const token = getCookie('feiu_token')
  // 清空数据
  sessionStorage.clear()
  clearCookie('feiu_token')
  // 登出转跳
  location.href = `${AUTH_SERVICE}/#/login`
}