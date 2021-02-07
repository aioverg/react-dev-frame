import React, { Component } from 'react'
import { Tabs, Button, Switch, Input, Popover, Modal } from 'antd'
import { getTableDataPreview, getTableDataTotal, putTableFieldRename } from '@src/views/api/Darabase.api'
import DefinedTable from '@src/components/table/DefinedTable'
import TableFooter from '@src/components/table/TableFooter'
import Revelance from './Revelance'
import { IconSvg } from '@src/components/iconFont'
import Consanguinity from './Consanguinity'
import styled from 'styled-components'
import { cancel } from 'redux-saga/effects'

const TableNameBox = styled.div`
  height: 50px;
  display: flex;
  padding: 0 10px 0 11px;
  align-items: center;
  justify-content: space-between;
  background: #F4F5F7;
`

const TableNameBoxLeft = styled.span`
  font-size: 14px;
  font-weight: 600;
`

const TableBox = styled.div`
  padding: 0 10px 0 14px;
  flex: 1;
  display: flex;
  flex-direction: column;
`

const TableBoxHead = styled.div`
  display: flex;
  height: 42px;
  align-items: center;
  justify-content: space-between;
`

const ModifyRowBox = styled.div`
  padding: 12px;
  width: 195px;
`

const ModifyRowBtBox = styled.div`
  display: flex;
  justify-content: space-between;
`

const DefaultHeaderCell = styled.div`
  width: 100%;
  height: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const HeaderInput = styled.input`
  border: none;
  background-color: #F0F5FF;
  width: 50px;
  flex: 1;
  &:focus {
    border: none;
    outline: none;
  }
`

class Content extends Component {
  constructor(props) {
    super(props)
    this.state = {
      oldValue: null,
      tableData: {}, // 条数据集合，传递给表格组件
      tableChart: {}, // 表结构数据
      tableName: null,
      tableTotal: null,
      currentId: null,
      total: 0, // 表数据总条数
      pageSize: 5000, // 表数据每页条数
      queryKey: null, // 表字段查询条件
      pageNum: 1, // 当前页码
      tableType: 'detail', // 表格展示方式, detail => 明细展示, chart => 结构展示
      groupVisible: false // 字段分组弹窗
    }
  }

  componentDidUpdate (prevProps) {
    const { params } = this.props
    const { queryKey, pageNum, pageSize } = this.state
    if (params != prevProps.params) {
      if (params.tableId) {
        getTableDataPreview(params.tableId, {
          pageNum: pageNum,
          pageSize: pageSize,
          tableId: params.tableId,
          queryKey: queryKey
        }).then(res => {
          const tableDataAux = {}
          const tableChartAux = {}
          tableDataAux.headerData = res.data.data.fields
          tableDataAux.columnData = res.data.data.data

          tableChartAux.headerData = [
            { id: 'type', name: '字段类型' },
            { id: 'name', name: '字段名' },
            { id: 'transferName', name: '原始名' },
            { id: 'group', name: '字段分组' }
          ]
          const list = []
          for (let item of res.data.data.fields) {
            const listItem = []
            listItem.push(item.type, item.name, item.transferName, item.fieldGroupType)
            list.push(listItem)
          }
          tableChartAux.columnData = list
          getTableDataTotal(params.tableId).then(res => {
            this.setState({
              tableData: tableDataAux,
              tableChart: tableChartAux,
              total: res.data.data
            })
          })
        })
      }
    }
  }

  getTableData = () => {
    const { queryKey, pageNum, pageSize, total } = this.state
    const { params } = this.props
    getTableDataPreview(params.tableId, {
      pageNum: pageNum,
      pageSize: pageSize,
      tableId: params.tableId,
      queryKey: queryKey
    }).then(res => {
      const tableData = {}
      tableData.headerData = res.data.data.fields
      tableData.columnData = res.data.data.data
      this.setState({
        tableData: tableData
      })
    })
  }

  onChange = (e, state) => {
    this.setState({
      [state]: e.target.value
    })
  }

  switchTableType = (type) => {
    this.setState({
      tableType: type
    })
  }

  pageNumCall = (params) => {
    this.setState({
      pageNum: params.pageNum
    }, this.getTableData)

  }

  modifyRowTem = () => { // 修改显示行数模板
    const { pageSize } = this.state
    const { params } = this.props
    const cancel = (e) => {
      e.stopPropagation()
      this.refs.renum.onClick(e)
    }
    const confirm = (e) => {
      e.stopPropagation()
      this.refs.renum.onClick(e)
      this.getTableData()
    }
    return (
      <ModifyRowBox>
        <div>设置显示行数</div>
        <Input value={pageSize} onChange={(e) => this.onChange(e, 'pageSize')} size="small" style={{ margin: '12px 0' }} />
        <ModifyRowBtBox>
          <Button type="dashed" size='small' style={{ width: '80px' }} onClick={(e) => cancel(e)}>取消</Button>
          <Button type="primary" size='small' style={{ width: '80px' }} onClick={(e) => confirm(e)}>确认</Button>
        </ModifyRowBtBox>
      </ModifyRowBox>
    )
  }

  defaultHeaderTem = (props) => { // 表头模板
    const { data, headSetField } = props
    const { params } = this.props
    const type = {
      DATE: '0',
      NUMBER: '#',
      STRING: 'T'
    }
    const click = (e) => {
      e.stopPropagation()
      const inputDom = e.target
      inputDom.select()
    }
    const onBlur = (e) => {
      const value = e.target.value
      if (value.length == 0 || e.target.value == data[headSetField.name]) {
        e.target.value = data[headSetField.name]
      } else {
        putTableFieldRename({
          id: params.tableId,
          fields: [{ name: data.name, transferName: e.target.value }]
        }).then(res => {
          this.getTableData()
        })
      }
    }
    const onEnter = (e) => {
      e.stopPropagation()
      if (e.keyCode == 13) {
        e.target.blur()
      }
    }
    return (
      data ?
        < DefaultHeaderCell >
          <span>{type[data.type]}</span>
          <HeaderInput defaultValue={data[headSetField.name]} onKeyDown={(e) => onEnter(e)} onClick={(e) => click(e)} onBlur={(e) => onBlur(e)} />
          <IconSvg name="iconxieti1" />
        </DefaultHeaderCell >
        : ''
    )
  }

  groupsTem = (e) => { // 字段分组
    const { groupVisible } = this.state
    const handleOk = (e) => {
      e.stopPropagation()
      this.setState({
        groupVisible: false
      })
    }
    const handleCancel = (e) => {
      e.stopPropagation()
      this.setState({
        groupVisible: false
      })
    }
    return (
      <Modal visible={groupVisible} onOk={(e) => handleOk(e)} onCancel={(e) => handleCancel(e)}>字段分组弹窗</Modal>
    )
  }
  openGroup = (e) => {
    e.stopPropagation()
    this.setState({
      groupVisible: true
    })
  }

  render () {
    const { tableData, total, pageNum, tableChart, pageSize, queryKey, tableType } = this.state
    const { temSwitch, params } = this.props
    return (
      params && params.tableId ?
        <div>
          {this.groupsTem()}
          <TableNameBox>
            <TableNameBoxLeft>{params.tableName}</TableNameBoxLeft>
            <div>
              <span>内存化</span>
              <Switch defaultChecked />
              <span>实时数据</span>
              <Switch defaultChecked />
              <Button type="text" onClick={() => { temSwitch('DatasetEdit', params) }}>编辑</Button>
              <Button type="text">创建组件</Button>
            </div>
          </TableNameBox>
          <TableBox>
            <Tabs defaultActiveKey="Preview" style={{ height: '100%' }}>
              <Tabs.TabPane tab="数据预览" key="Preview" style={{ height: '100%' }}>
                <TableBoxHead>
                  <div>
                    <Input value={queryKey} onChange={(e) => this.onChange(e, 'queryKey')} onPressEnter={this.getTableData} size="small" style={{ width: 200 }} placeholder="搜索字段" prefix={<IconSvg name='iconsuoxiao' />} />
                    <span onClick={(e) => this.openGroup(e)}><IconSvg name="icontianjiashujuyuan" />字段分组</span>
                  </div>
                  <div>
                    <IconSvg name='icondanyuangeyuansu' onClick={() => this.switchTableType('detail')} />
                    <IconSvg name='icondanyuangeyuansu' onClick={() => this.switchTableType('chart')} />
                    <span>显示{pageSize}行数据</span>
                    <Popover ref='renum' placement="bottomRight" content={this.modifyRowTem()} trigger="click">
                      <span style={{ cursor: 'pointer' }}>
                        <IconSvg name='iconxieti1' />
                      </span>
                    </Popover>
                  </div>
                </TableBoxHead>
                {
                  tableType == 'detail' ?
                    <>
                      <DefinedTable data={tableData} definedHeaderTem={this.defaultHeaderTem} headSetField={{ id: 'name', name: 'transferName' }} />
                      <TableFooter total={total} pageSize={pageSize} pageNum={pageNum} callBack={this.pageNumCall} />
                    </>
                    : <DefinedTable data={tableChart} />
                }

              </Tabs.TabPane>
              <Tabs.TabPane tab="血缘分析" key="Consanguinity">
                <Consanguinity />
              </Tabs.TabPane>
              <Tabs.TabPane tab="关联视图" key="Relation">
                <Revelance />
              </Tabs.TabPane>
            </Tabs>
          </TableBox>
        </div>
        : ''
    )
  }

}

export default Content