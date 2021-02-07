/**
 * 业务包操作，业务包添加表、更新等、搜索表和字段等
 */
import React, { PureComponent } from 'react'
import { Tabs, Button, Input, Popover, Modal } from 'antd'
import { getPackDetail, getTableMoveEnablePacks, putTableFieldSearch } from '@src/views/api/Darabase.api'
import SearchTree from '@src/views/DataBase/components/SearchTree/SearchTree'
import { IconSvg } from '@src/components/iconFont'
import styled from 'styled-components'

const AsideTwoBox = styled.div`
  padding: 0 16px;
`
const AsideTwoHeadBox = styled.div`
  display: flex;
  align-items: center;
  height: 30px
`
const AsidePackBox = styled.div`
  display: flex;
  align-item: center;
  justify-content: space-between;
  height: 30px;
`
const AsidePackName = styled.span`
  flex-grow: 1;
  overflow: hidden;
  line-height: 30px;
  text-overflow: ellipsis;
  white-space:nowrap;
`

const AddTableBt = styled.div`
  flex-grow: 1;
  align-item: center;
`

const UpdateBox = styled.div`
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const SearchBox = styled.div`
  height: 30px;
  line-height: 30px;
`

const Ul = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`
const Li = styled.li`
  height: 30px;
  line-height: 30px;
  position: relative;
  cursor: pointer;
`

class AsideTwo extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      searchKeyword: '', // 搜索框内容
      searchResult: {}, // 搜索结果

      currenTable: null,
      searchTreeData: [], // 传递给 SearchTree 组件的数据
      searchTreeDataFlag: true, // 是否重新生成传递给 SearchTree 组件的数据
      tables: [],
      packName: null,
      tableIdList: [], // 在列表中存在表，再次查看详情不再请求表的总条数接口
      tableIdToatl: {},
      propsVisible: false, // 是否显示图标
    }
  }

  componentDidMount () { // 获取业务包详情
    const { params } = this.props
    getPackDetail(params.packId).then(res => {
      this.setState({
        tables: res.data.data.tables,
        packName: res.data.data.name
      })
    })
  }

  moveHandle (data) { // 移动回调
    console.log('move-------', data)
  }

  // 模板  --  开始
  addPopupTem () { // 增加数据集模板
    const { params } = this.props
    return (
      <ul>
        <li onClick={() => this.props.temSwitch('SelDatabase', params.packId)}>数据库表</li>
        <li>SQL数据集</li>
        <li>Excel数据集</li>
        <li>自助数据集</li>
      </ul>
    )
  }

  tableListTem (tables, currenTable) { // 表列表模板
    const { params, asideTwoParams } = this.props
    const selTable = (params) => { // 选中表
      asideTwoParams({ tableId: params.id, packId: params.packId, tableName: params.name })
    }

    const move = (e) => { // 表移动
      e.stopPropagation()
      getTableMoveEnablePacks(currenTable.id).then(res => {
        const packs = res.data.data.packs || []
        const groups = res.data.data.groups || []
        const packsFilterData = { children: [] }
        const groupsFilterData = { children: [] }
        packs.forEach(item => { // 将业务包列表整理成树形数据
          packsFilterData.children.push({
            key: item.id,
            title: item.name,
            children: []
          })
        })
        const groupsFilter = (parent, data) => { // 将分组列表整理成树形数据
          data.forEach(item => {
            let treeItem = {}
            treeItem.title = item.name
            treeItem.key = item.id
            treeItem.children = []
            if (item.groups && item.groups.length != 0 || item.packs && item.packs.length != 0) {
              treeItem.selectable = false
              groupsFilter(treeItem, item.groups.concat(item.packs))
            }
            parent.children.push(treeItem)
          })
        }
        groupsFilter(groupsFilterData, groups)
        this.setState({
          searchTreeData: packsFilterData.children.concat(groupsFilterData.children)
        })
      })
      this.refs[currenTable.id].onClick(e)
      this.refs.SearchTree.open()
    }

    const popupContent = () => {
      return (
        <Ul>
          <Li>编辑</Li>
          <Li>重命名</Li>
          <Li onClick={(e) => move(e)}>移动到</Li>
          <Li>删除</Li>
        </Ul>
      )
    }

    const onClick = (e, data) => {
      e.stopPropagation()
      this.setState({
        currenTable: data
      })
    }

    const mouseOver = (e, id) => { // 鼠标在元素
      e.stopPropagation()
      this.setState({
        propsVisible: id
      })
    }

    const mouseOut = (e) => { // 鼠标移出
      e.stopPropagation()
      this.setState({
        propsVisible: null
      })
    }

    const tableItem = () => {
      const { propsVisible } = this.state
      return tables.map(item => {
        return (
          <Li key={item.id} onMouseOver={(e) => mouseOver(e, item.id)} onMouseOut={(e) => mouseOut(e)}>
            <IconSvg name='icondaochuEXCEL' />
            <span onClick={() => selTable(item)} style={{ paddingLeft: '5px' }}>{item.tableName}</span>
            <Popover ref={item.id} content={popupContent()} trigger="click" placement="bottomLeft">
              <span style={{ display: item.id == propsVisible ? '' : 'none', position: 'absolute', right: '0' }} onClick={(e) => onClick(e, item)}>···</span>
            </Popover>
          </Li>
        )
      })
    }
    return (<Ul>{tableItem()}</Ul>)
  }
  SearchTem = () => { // 搜索框模板
    const { searchKeyword } = this.state
    const { params } = this.props
    const onChange = (e) => {
      this.setState({
        searchKeyword: e.target.value
      })
    }
    const onSearch = () => {
      putTableFieldSearch({
        id: params.packId,
        keyword: searchKeyword
      }).then(res => {
        this.setState({
          searchResult: res.data.data
        })
        console.log('res-----------', res.data.data)
      })
    }
    return (
      <Input onChange={onChange} onPressEnter={onSearch} value={searchKeyword} size="small" style={{ width: 200 }} placeholder="搜索表和字段" prefix={<IconSvg name='iconsuoxiao' />} />
    )
  }
  fieldTem = () => { // 搜索字段模板
    const searchResult = this.state.searchResult
    const ulItem = () => {
      if (searchResult.findFieldsResult) {
        return searchResult.findFieldsResult.map(item => {
          return (
            <li key={item.name}>
              <span>{item.transferName}</span>
              <span>{searchResult.fieldTableMapper[item.name]}</span>
            </li>
          )
        })
      } else {
        return ''
      }
    }
    return (<ul>{ulItem()}</ul>)
  }
  tableTem = () => { //搜索结果表模板

  }
  // 模板  --  结束

  render () {
    const { searchKeyword, searchResult, searchTreeData, tables, packName, currenTable } = this.state
    const { asideSwitch } = this.props
    return (
      <AsideTwoBox>
        <SearchTree ref='SearchTree' treeData={searchTreeData} confirm={this.moveHandle} />
        <AsideTwoHeadBox>
          <IconSvg name='icontianchongyanse2' />
          <span style={{ color: '#597EF7', paddingLeft: '9px', cursor: 'pointer' }} onClick={() => { asideSwitch('one', []) }}>返回数据列表</span>
        </AsideTwoHeadBox>

        <AsidePackBox>
          <AsidePackName title={packName}>{packName}</AsidePackName>
          <Popover content={this.addPopupTem()} title="Title" trigger="hover" placement="bottomLeft">
            <Button type="primary" size="small">
              <AddTableBt>
                添加表
              <IconSvg name="iconxiayiye1" style={{ transform: 'rotate(90deg)', width: '1em', height: '1em', marginTop: '2px' }} />
              </AddTableBt>
            </Button>
          </Popover>
        </AsidePackBox>
        <UpdateBox>
          <span>更新进度</span>
          <span>业务包更新</span>
        </UpdateBox>
        <SearchBox>{this.SearchTem()}</SearchBox>
        <div style={{ display: !searchKeyword ? '' : 'none' }}>{this.tableListTem(tables, currenTable)}</div>
        <div style={{ display: searchKeyword ? '' : 'none' }}>
          <div>
            <div>字段列表</div>
            <div>{this.fieldTem()}</div>
          </div>
          <div>
            <div>表列表</div>
            <div>{searchResult.tableFindResultDto && searchResult.tableFindResultDto.length != 0 ? this.tableListTem(searchResult.tableFindResultDto.tables, currenTable) : ''}</div>
          </div>
        </div>
      </AsideTwoBox>
    )
  }
}

export default AsideTwo