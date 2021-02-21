/**
 * 系统管理模块接口
 */

import basicService from '@comm/js/request'
const addUrl = '/bi'

// 数据连接管理
function getConnectList (params) { // 数据连接列表
  return basicService.basicGet(addUrl + '/config/connections', params, false)
}

function postTestConnect (params) { // 数据连接测试
  return basicService.basicPost(addUrl + '/config/connection/test', params, false)
}

function postConnectStatus (params) { // 连接池状态
  return basicService.basicPost(addUrl + '/config/connection/status/' + params, false)
}

function postConnectAdd (params) { // 新建数据源
  return basicService.basicPost(addUrl + '/config/connection', params, false)
}

function putConnectEdit (params) { // 编辑数据源
  return basicService.basicPut(addUrl + '/config/connection', params, false)
}

function deleteConnect (params) { // 删除数据源
  return basicService.basicDelete(addUrl + '/config/connection/' + params, false)
}

function postSchemas (params) { // 获取数据库Schemas
  return basicService.basicPost(addUrl + '/config/connection/schemas', params, false)
}




export {
  getConnectList,
  postTestConnect,
  postConnectStatus,
  postConnectAdd,
  putConnectEdit,
  deleteConnect,
  postSchemas
}