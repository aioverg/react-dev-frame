import { getCookie, clearCookie } from '@utils/handleCookie'

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