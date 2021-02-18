import { showMessageError, showMessageSuccess, showModalError, getAjaxErrorMsg, showMessageWarn } from './handleError'
import { logout } from './handleLogin'
import { checkAccessPermission } from './permission'

export default {
  showMessageError,
  showMessageSuccess,
  showModalError,
  getAjaxErrorMsg,
  showMessageWarn,
  logout,
  checkAccessPermission
}