import basicService from '@comm/js/request'
function login (params) {
  return basicService.basicPost('/feiu_api/userLogin/login', params, false)
}


export {
  login
}