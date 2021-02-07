import { showMessageError, showMessageSuccess, showModalError, getAjaxErrorMsg, showMessageWarn } from './handleError'
import { toLoginPage, logout } from './handleLogin'
import { checkAccessPermission } from './permission'

export default {
  showMessageError,
  showMessageSuccess,
  showModalError,
  getAjaxErrorMsg,
  showMessageWarn,
  toLoginPage,
  logout,
  checkAccessPermission
}