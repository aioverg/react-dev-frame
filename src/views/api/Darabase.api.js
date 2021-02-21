/**
 * 数据准备模块接口
 */
import basicService from '@comm/js/request'
const addUrl = '/bi'


// 包、分组的增删改查
function getAllList (params) { // 分组业务包我的自助数据集列表
  return basicService.basicGet(addUrl + '/config/groups', params, false)
}

function getPackList (params) { // 业务包列表
  return basicService.basicGet(addUrl + '/config/pack/names', params, false)
}

function getAddGroup (params) { // 增加分组
  return basicService.basicGet(addUrl + '/config/group/' + params, false)
}

function deleteGroup (params) { // 删除分组
  return basicService.basicDelete(addUrl + '/config/group/' + params, false)
}

function putRenameGroup (params) { // 重命名分组
  return basicService.basicPut(addUrl + '/config/group/rename', params, false)
}

function getMoveGroup (params) { // 移动分组
  return basicService.basicGet(addUrl + '/config/group/' + params.id + '/move_to/' + params.parentId, false)
}

function postAddPack (params) { // 增加业务包
  return basicService.basicPost(addUrl + '/config/pack/' + params, false)
}

function deletePack (params) { // 删除业务包
  return basicService.basicDelete(addUrl + '/config/pack/' + params, false)
}

function putRenamePack (params) { // 业务包重命名
  return basicService.basicPut(addUrl + '/config/pack/rename', params, false)
}


function postMovePack (params) { // 移动业务包
  return basicService.basicPost(addUrl + '/config/pack/' + params.id + '/' + params.parentId, false)
}

function postPackDatasetSearch (params) { // 业务包数据集搜索
  return basicService.basicPost(addUrl + '/config/group/search', params, false)
}

function getPackDetail (params) { // 业务包详情
  return basicService.basicGet(addUrl + '/config/pack/' + params, {}, false)
}

function putTableFieldSearch (params) { // 包内表和字段搜索
  return basicService.basicPut(addUrl + '/conf/pack/result/fields', params, false)
}

// 数据集操作
function getConnections (params) { // 数据库连接列表
  return basicService.basicGet(addUrl + '/conf/connections', params, false)
}

function getDatabaseTables (params) { // 数据库表列表
  return basicService.basicGet(addUrl + '/conf/connection/' + params + '/tables', {}, false)
}

function postDatasetToPack (id, params) { // 新增数据集到业务包
  return basicService.basicPost(addUrl + '/conf/pack/' + id + '/tables', params, false)
}

function getDatasetDetail (id) { // 数据集详情, 数据集编辑时拿表头
  return basicService.basicGet(addUrl + '/conf/table/' + id, {}, false)
}



function getTableDataPreview (tableId, params) { // 表数据预览
  return basicService.basicGet(addUrl + '/data/table/' + tableId + '/preview/data?', params, false)
}

function getTableDataTotal (tableId) { // 数据条数
  return basicService.basicGet(addUrl + '/data/table/' + tableId + '/preview/total', {}, false)
}

function getTableMoveEnablePacks (tableId) { // 表移动可用的业务包
  return basicService.basicGet(addUrl + '/conf/table/' + tableId + '/move/list', {}, false)
}


function putTableFieldRename (params) { // 表字段重命名
  return basicService.basicPut(addUrl + '/conf/table/fields', params, false)
}

// 数据集编辑
function postDatasetOpertors (params) { // 数据集编辑, 列操作器
  return basicService.basicPost(addUrl + '/config/table/operator/database/operators', params, false)
}

function postDatasetTransColumnData (tableId, operatorIndex, fieldName, params) { // 数据集编辑, 行列转换，转换列数据
  return basicService.basicPost(addUrl + '/data/table/' + tableId + '/operator/' + operatorIndex + '/row_trans_column/' + fieldName, params, false)
}

function postDatasetSelfCycleBuild (tableId, operatorIndex, params) { // 数据集编辑, 自循环列，构建关系
  return basicService.basicPost(addUrl + '/data/table/' + tableId + '/operator/' + operatorIndex + '/self_cycle/levels', params, false)
}

function postDatasetEditPreview (tableId, operatorIndex, params) { // 数据集编辑, 数据预览
  return basicService.basicPost(addUrl + '/data/table/' + tableId + '/operator/' + operatorIndex + '/preview/data', params, false)
}



export {
  getAllList,
  getPackList,
  postAddPack,
  getAddGroup,
  deleteGroup,
  putRenameGroup,
  getMoveGroup,
  deletePack,
  postMovePack,
  postPackDatasetSearch,
  putRenamePack,
  getPackDetail,
  putTableFieldSearch,

  getConnections,
  getDatabaseTables,
  postDatasetToPack,
  getDatasetDetail,

  getTableDataPreview,
  getTableDataTotal,
  getTableMoveEnablePacks,
  postDatasetEditPreview,
  putTableFieldRename,
  postDatasetOpertors,
  postDatasetTransColumnData,
  postDatasetSelfCycleBuild
}