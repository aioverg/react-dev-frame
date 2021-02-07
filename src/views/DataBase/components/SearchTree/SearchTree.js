import React, { PureComponent } from 'react'
import { Input, Modal, Tree } from 'antd'
import { getMoveGroup, postMovePack } from '@src/views/api/Darabase.api'
class SearchTree extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      moveVisiable: false, // 移动弹窗
      moveData: [], // 被移动的数据
      expandedKeys: [], // 展开指定的节点
      searchValue: '', // 搜索的节点
      autoExpandParent: true, // 自否自动展开父节点
      selKey: [] // 选中的节点
    }
  }

  open = (data) => { // 弹窗打开初始化
    this.setState({
      moveVisiable: true,
      moveData: data || ''
    })
  }

  treePopupTem = () => { // 树形弹窗模板
    const { searchValue, expandedKeys, autoExpandParent, groups } = this.state
    const { treeData } = this.props // 树形数据
    const dataList = []

    const handleOk = () => { // 弹窗确认按钮
      this.setState({
        moveVisiable: false
      })
      this.props.confirm(this.state.selKey)
    }

    const handleCancel = () => { // 弹窗取消按钮
      this.setState({
        moveVisiable: false
      })
    }

    const generateList = data => { // 再次整理树形数据，生成易于搜索的数据，用来搜索
      for (let i = 0; i < data.length; i++) {
        const node = data[i]
        const { key } = node
        dataList.push({ key, title: node.name });
        if (node.children) {
          generateList(node.children)
        }
      }
    }
    generateList(treeData)

    const onExpand = expandedKeys => {
      this.setState({
        expandedKeys,
        autoExpandParent: false,
      })
    }

    const onChange = e => { // 监听搜索框内容变化，进行搜索
      const { value } = e.target;
      const expandedKeys = dataList
        .map(item => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, treeData);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      this.setState({
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      })
    }


    const getParentKey = (key, tree) => {
      let parentKey;
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        if (node.children) {
          if (node.children.some(item => item.key === key)) {
            parentKey = node.key;
          } else if (getParentKey(key, node.children)) {
            parentKey = getParentKey(key, node.children);
          }
        }
      }
      return parentKey
    }

    const onSelect = (key) => { // 选择节点
      this.setState({
        selKey: key
      })
    }

    return (
      <Modal title={'将' + this.state.moveData.name + '移动到'} visible={this.state.moveVisiable} onOk={handleOk} onCancel={handleCancel}>
        <Input.Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange} />
        <Tree
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          treeData={treeData}
          onSelect={onSelect}
        />
      </Modal>
    )
  }

  render () {
    return (
      <>{this.treePopupTem()}</>
    )
  }
}

export default SearchTree