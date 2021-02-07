/**
 * 数据列表中分组、业务包的添加、移动、重命名、删除、搜索等操作页面
 */

import React, { PureComponent } from 'react'
import { Button, Input, Popover } from 'antd'
import { getAllList, postAddPack, getAddGroup, postPackDatasetSearch, getMoveGroup, postMovePack } from '@src/views/api/Darabase.api'
import Tree from '@src/views/DataBase/components/Tree/Tree'
import SearchTree from '@src/views/DataBase/components/SearchTree/SearchTree'
import { extend } from 'lodash'
import styles from './index.less'
import { IconSvg } from '@src/components/iconFont'

class AsideOne extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      myDataset: [], // 我的自助数据集
      packs: [], // 业务包
      groups: [], // 分组
      currenPG: null, // 当前选中的业务包或分组
      searchTreeData: [], // 传递给 SearchTree 组件的数据
      searchTreeDataFlag: true, // 是否重新生成传递给 SearchTree 组件的数据
      searchContentFlag: false, // 是否展示搜索内容
      searchPackResult: [], // 搜索结果业务包内容
      searchDatasetResult: [] // 搜索结果数据集内容
    }
  }
  componentDidMount () {
    this.getAllList()
  }

  getAllList = () => { // 获取分组\业务包\我的自助数据集\列表
    getAllList({}).then(res => {
      console.log('所有数据列表', res.data.data)
      this.setState({
        myDataset: res.data.data.myAnalysis || [],
        packs: res.data.data.packs || [],
        groups: res.data.data.groups || [],
        searchTreeDataFlag: true
      })
    })
  }

  postAddPack = (id) => { // 增加业务包
    postAddPack(id).then(res => {
      console.log('增加业务包', res)
      this.getAllList()
    })
  }

  getAddGroup = (id) => { // 增加分组
    getAddGroup(id).then(res => {
      console.log('增加分组', res)
      this.getAllList()
    })
  }

  moveHandle = (data) => {
    const { currenPG } = this.state
    console.log('---------moveHandle', data)
    if (currenPG.packs) {
      getMoveGroup({
        id: currenPG.id,
        parentId: data[0]
      }).then(res => {
        this.getAllList()
      })
    } else {
      postMovePack({
        id: currenPG.id,
        parentId: data[0]
      }).then(res => {
        this.getAllList()
      })
    }
  }



  movePopup = (data) => { // 移动, 打开弹窗并设置生成弹窗内树形数据
    const { groups, searchTreeDataFlag } = this.state
    let searchTreeData = { children: [] }
    if (searchTreeDataFlag) {
      const groupsFilter = (parent, treeData) => {
        treeData.forEach(item => {
          let treeItem = {}
          treeItem.title = item.name
          treeItem.key = item.id
          treeItem.children = []
          if (item.groups && item.groups.length) {
            groupsFilter(treeItem, item.groups)
          }
          parent.children.push(treeItem)
        })
      }
      groupsFilter(searchTreeData, groups)
      this.setState({
        searchTreeData: searchTreeData.children,
        searchTreeDataFlag: false
      })
    }
    this.refs.SearchTree.open(data)
    this.setState({
      currenPG: data
    })
  }

  onChange = (e) => { // 搜索框变化
    const { value } = e.target
    if (value) {
      if (this.state.searchContentFlag) {
        this.setState({

        })
      } else {
        this.setState({
          searchContentFlag: true
        })
      }
    } else {
      this.setState({
        searchContentFlag: false
      })
    }
  }

  onSearch = (value) => { // 搜索
    if (value) {
      postPackDatasetSearch({ keyword: value }).then(res => {
        this.setState({
          searchPackResult: res.data.data.packFindResult,
          searchDatasetResult: res.data.data.tableFindResult
        })
      })
    }
  }

  render () {
    const { searchTreeData, searchContentFlag, searchPackResult, myDataset, packs, groups } = this.state
    return (
      <div className={styles.asideOne}>
        <SearchTree ref='SearchTree' treeData={searchTreeData} confirm={this.moveHandle} />
        <div>
          <div style={{ display: searchContentFlag ? 'none' : '' }} className={styles.addBox}>
            <span onClick={() => this.getAddGroup(0)} className={styles.addBoxItem}>
              <IconSvg name="icontianjiashujuyuan" />
              <span className={styles.addBoxItemIcon}>添加分组</span>
            </span>
            <span onClick={() => this.postAddPack(0)} className={styles.addBoxItem}>
              <IconSvg name="icontianjiashujuyuan" />
              <span className={styles.addBoxItemIcon}>添加业务包</span>
            </span>
          </div>
          <div className={styles.searchBox}>
            <Input onChange={this.onChange} onPressEnter={this.onSearch} size="small" style={{ width: 200 }} placeholder="搜索业务包和表" prefix={<IconSvg name='iconsuoxiao' />} />
          </div>
          <div style={{ display: searchContentFlag ? '' : 'none' }}>
            <div>数据集内容</div>
            <div>
              <div>业务包内容</div>
              <Tree treeData={searchPackResult} refresh={this.getAllList} movePopup={this.movePopup} asideSwitch={this.props.asideSwitch} />
            </div>
          </div>
          <div style={{ display: searchContentFlag ? 'none' : '' }}>
            <div>我的自助数据集</div>
            <Tree treeData={myDataset} />
            <Tree treeData={packs} refresh={this.getAllList} movePopup={this.movePopup} asideSwitch={this.props.asideSwitch} />
            <Tree treeData={groups} refresh={this.getAllList} movePopup={this.movePopup} asideSwitch={this.props.asideSwitch} />
          </div>
        </div>
      </div>
    )
  }
}

export default AsideOne