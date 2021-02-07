/**
 * 关联视图
*/
import React, { PureComponent } from 'react'
import D3RelationLineChart from '@src/components/charts/D3RelationLineChart'
import { index } from 'd3'
import { set } from 'lodash'
class RevelanceView extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
  }

  componentDidMount () {
    const tableNameAux = [] // 表名列表
    const tableData = []
    const contentData = { "[自助数据集4 account_id,dev3_feiu_account_settle_detail_S account_id]": { "base": { "available": false, "tableName": "自助数据集4", "transferName": "自助数据集4", "fields": [{ "id": "自助数据集4_account[5f]id", "name": "account_id", "transferName": "结算账户ID", "type": 32, "size": 32, "enable": true, "usable": true }] }, "relative": { "available": true, "tableName": "dev3_feiu_account_settle_detail_S", "transferName": "账户收支单", "fields": [{ "id": "dev3[5f]feiu[5f]account[5f]settle[5f]detail[5f]S_account[5f]id", "name": "account_id", "transferName": "结算账户ID", "type": 32, "size": 32, "enable": true, "usable": true }] }, "type": 1, "weight": 0 }, "[自助数据集4 [id1 && type && bill_id && account_id && amount && settle_type && remark && creator_id && create_time && updater_id && update_time && is_deleted1 && org_id],dev3_feiu_account_settle_detail_S [id && type && bill_id && account_id && amount && settle_type && remark && creator_id && create_time && updater_id && update_time && is_deleted && org_id]": { "base": { "available": false, "tableName": "自助数据集4", "transferName": "自助数据集4", "fields": [{ "id": "自助数据集4_id1", "name": "id1", "transferName": "主键", "type": 32, "size": 32, "enable": true, "usable": true }, { "id": "自助数据集4_type", "name": "type", "transferName": "类型 收入，支出", "type": 16, "size": 32, "enable": true, "usable": true }, { "id": "自助数据集4_bill[5f]id", "name": "bill_id", "transferName": "所属单据ID", "type": 32, "size": 32, "enable": true, "usable": true }, { "id": "自助数据集4_account[5f]id", "name": "account_id", "transferName": "结算账户ID", "type": 32, "size": 32, "enable": true, "usable": true }, { "id": "自助数据集4_amount", "name": "amount", "transferName": "收付款金额", "type": 32, "size": 32, "enable": true, "usable": true }, { "id": "自助数据集4_settle[5f]type", "name": "settle_type", "transferName": "结算方式 Id", "type": 32, "size": 32, "enable": true, "usable": true }, { "id": "自助数据集4_remark", "name": "remark", "transferName": "备注", "type": 16, "size": 32, "enable": true, "usable": true }, { "id": "自助数据集4_creator[5f]id", "name": "creator_id", "transferName": "creator_id", "type": 32, "size": 32, "enable": true, "usable": true }, { "id": "自助数据集4_create[5f]time", "name": "create_time", "transferName": "create_time", "type": 48, "size": 32, "enable": true, "usable": true }, { "id": "自助数据集4_updater[5f]id", "name": "updater_id", "transferName": "updater_id", "type": 32, "size": 32, "enable": true, "usable": true }, { "id": "自助数据集4_update[5f]time", "name": "update_time", "transferName": "update_time", "type": 48, "size": 32, "enable": true, "usable": true }, { "id": "自助数据集4_is[5f]deleted1", "name": "is_deleted1", "transferName": "0-正常 1-删除", "type": 32, "size": 32, "enable": true, "usable": true }, { "id": "自助数据集4_org[5f]id", "name": "org_id", "transferName": "org_id", "type": 32, "size": 32, "enable": true, "usable": true }] }, "relative": { "available": true, "tableName": "dev3_feiu_account_settle_detail_S", "transferName": "账户收支单", "fields": [{ "id": "dev3[5f]feiu[5f]account[5f]settle[5f]detail[5f]S_id", "name": "id", "transferName": "主键", "type": 32, "size": 32, "enable": true, "usable": true }, { "id": "dev3[5f]feiu[5f]account[5f]settle[5f]detail[5f]S_type", "name": "type", "transferName": "类型 收入，支出", "type": 16, "size": 32, "enable": true, "usable": true }, { "id": "dev3[5f]feiu[5f]account[5f]settle[5f]detail[5f]S_bill[5f]id", "name": "bill_id", "transferName": "所属单据ID", "type": 32, "size": 32, "enable": true, "usable": true }, { "id": "dev3[5f]feiu[5f]account[5f]settle[5f]detail[5f]S_account[5f]id", "name": "account_id", "transferName": "结算账户ID", "type": 32, "size": 32, "enable": true, "usable": true }, { "id": "dev3[5f]feiu[5f]account[5f]settle[5f]detail[5f]S_amount", "name": "amount", "transferName": "收付款金额", "type": 32, "size": 32, "enable": true, "usable": true }, { "id": "dev3[5f]feiu[5f]account[5f]settle[5f]detail[5f]S_settle[5f]type", "name": "settle_type", "transferName": "结算方式 Id", "type": 32, "size": 32, "enable": true, "usable": true }, { "id": "dev3[5f]feiu[5f]account[5f]settle[5f]detail[5f]S_remark", "name": "remark", "transferName": "备注", "type": 16, "size": 32, "enable": true, "usable": true }, { "id": "dev3[5f]feiu[5f]account[5f]settle[5f]detail[5f]S_creator[5f]id", "name": "creator_id", "transferName": "creator_id", "type": 32, "size": 32, "enable": true, "usable": true }, { "id": "dev3[5f]feiu[5f]account[5f]settle[5f]detail[5f]S_create[5f]time", "name": "create_time", "transferName": "create_time", "type": 48, "size": 32, "enable": true, "usable": true }, { "id": "dev3[5f]feiu[5f]account[5f]settle[5f]detail[5f]S_updater[5f]id", "name": "updater_id", "transferName": "updater_id", "type": 32, "size": 32, "enable": true, "usable": true }, { "id": "dev3[5f]feiu[5f]account[5f]settle[5f]detail[5f]S_update[5f]time", "name": "update_time", "transferName": "update_time", "type": 48, "size": 32, "enable": true, "usable": true }, { "id": "dev3[5f]feiu[5f]account[5f]settle[5f]detail[5f]S_is[5f]deleted", "name": "is_deleted", "transferName": "0-正常 1-删除", "type": 32, "size": 32, "enable": true, "usable": true }, { "id": "dev3[5f]feiu[5f]account[5f]settle[5f]detail[5f]S_org[5f]id", "name": "org_id", "transferName": "org_id", "type": 32, "size": 32, "enable": true, "usable": true }] }, "type": 3, "weight": 0 } }
    for (let value of Object.keys(contentData)) {
      const relation = value.split(',')
      const tableBase = contentData[value].base
      const tableRelation = contentData[value].relative
      const tableBaseChunkId = relation[0]
      const tableBaseChunkName = relation[0]
      const tableRelationChunkId = relation[1]
      const tableRelationChunkName = relation[1]
      if (!tableNameAux.includes(tableBase.tableName)) {
        tableNameAux.push(tableBase.tableName)
        const tableItem = {}
        tableItem.tableId = tableBase.tableName
        tableItem.tableIdName = tableBase.transferName
        tableItem.tableChunk = []
        let ChunkItem = {}
        ChunkItem.ChunkId = tableBaseChunkId
        ChunkItem.ChunkName = '联合' // tableBaseChunkName
        ChunkItem.relationChunkId = [tableRelationChunkId]
        ChunkItem.ChunkList = [] // 块的项
        for (let column of tableBase.fields) {
          ChunkItem.ChunkList.push({
            columnId: column.id,
            columnName: column.transferName
          })
        }
        tableItem.tableChunk.push(ChunkItem)
        tableData.push(tableItem)
      } else {
        let tableIndex = tableData.findIndex(item => {
          return item.tableId == tableBase.tableName
        })
        let tableChunkIndex = tableData[tableIndex].tableChunk.findIndex(item => item.ChunkId == tableBaseChunkId)
        if (tableChunkIndex != -1) {
          let relationChunkIdAux = tableData[tableIndex].tableChunk[tableChunkIndex].relationChunkId
          relationChunkIdAux.push(tableRelationChunkId)
          const relationChunkIdAuxSet = new set(relationChunkIdAux)
          tableData[tableIndex].tableChunk[tableChunkIndex].relationChunkId = Array.from(relationChunkIdAuxSet)
        } else {
          let ChunkItem = {}
          ChunkItem.ChunkId = tableBaseChunkId
          ChunkItem.ChunkName = '联合' // tableBaseChunkName
          ChunkItem.relationChunkId = [tableRelationChunkId]
          ChunkItem.ChunkList = [] // 块的项
          for (let column of tableBase.fields) {
            ChunkItem.ChunkList.push({
              columnId: column.id,
              columnName: column.transferName
            })
          }
          tableData[tableIndex].tableChunk.push(ChunkItem)
        }
      }

      if (!tableNameAux.includes(tableRelation.tableName)) {
        tableNameAux.push(tableRelation.tableName)
        const tableItem = {}
        tableItem.tableId = tableRelation.tableName
        tableItem.tableIdName = tableRelation.transferName
        tableItem.tableChunk = []
        let ChunkItem = {}
        ChunkItem.ChunkId = tableRelationChunkId
        ChunkItem.ChunkName = '联合' // tableRelationChunkName
        ChunkItem.relationChunkId = [tableBaseChunkId]
        ChunkItem.ChunkList = [] // 块的项
        for (let column of tableRelation.fields) {
          ChunkItem.ChunkList.push({
            columnId: column.id,
            columnName: column.transferName
          })
        }
        tableItem.tableChunk.push(ChunkItem)
        tableData.push(tableItem)
      } else {
        let tableIndex = tableData.findIndex(item => {
          return item.tableId == tableRelation.tableName
        })
        let tableChunkIndex = tableData[tableIndex].tableChunk.findIndex(item => item.ChunkId == tableRelationChunkId)
        if (tableChunkIndex != -1) {
          let relationChunkIdAux = tableData[tableIndex].tableChunk[tableChunkIndex].relationChunkId
          relationChunkIdAux.push(tableBaseChunkId)
          const relationChunkIdAuxSet = new set(relationChunkIdAux)
          tableData[tableIndex].tableChunk[tableChunkIndex].relationChunkId = Array.from(relationChunkIdAuxSet)
        } else {
          let ChunkItem = {}
          ChunkItem.ChunkId = tableRelationChunkId
          ChunkItem.ChunkName = '联合' // tableBaseChunkName
          ChunkItem.relationChunkId = [tableBaseChunkId]
          ChunkItem.ChunkList = [] // 块的项
          for (let column of tableRelation.fields) {
            ChunkItem.ChunkList.push({
              columnId: column.id,
              columnName: column.transferName
            })
          }
          tableData[tableIndex].tableChunk.push(ChunkItem)
        }
      }
    }
    this.setState({
      data: tableData
    })
  }

  render () {
    return (
      <div>
        <div>关联视图</div>
        <D3RelationLineChart lineData={this.state.data} />
      </div>
    )
  }
}

export default RevelanceView