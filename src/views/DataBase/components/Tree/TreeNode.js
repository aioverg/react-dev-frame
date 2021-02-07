import React, { PureComponent } from 'react'
import { Popover, message, Button, Modal } from 'antd'
import { getAddGroup, deleteGroup, putRenameGroup, deletePack, putRenamePack } from '@src/views/api/Darabase.api'
import { IconSvg } from '@src/components/iconFont'
import styled from 'styled-components'

const Ul = styled.ul`
  list-style-type: none;
  padding-left: 20px;
`

const Li = styled.li`
  min-height: 30px;
  line-height: 30px;
  position: relative;
  cursor: pointer;
`

const PopupDiv = styled.div`
  width: 100px;
  padding: 3px 0;
`

const PopupDivItem = styled.div`
  width: 100px;
  height: 24px;
  line-height: 24px;
  padding: 0 9px;
  &:hover {
    background: rgba(51, 51, 51, 0.1);
  }
`

const RenameBox = styled.div`
  width: 194px;
  padding: 0 12px;
`
const RenameInput = styled.input`
  height: 24px;
  width: 100%;
  border-radius: 2px;
  border: 1px solid #597EF7;
  &:focus {
    outline: none;
  }
`

const RenameBtBox = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
`



class TreeNode extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      open: false, // 是否折叠
      propsVisible: false, // 是否显示图标
      newName: null, // 修改名称
      modalVisible: false, // 对话框
      seldata: null // 当前选中的项
    }
  }

  componentDidMount () {
    this.setState({
      name: this.props.nodeData.name
    })
  }

  ModalTem = () => { // 对话框模板
    const { modalVisible, seldata } = this.state
    console.log('[[[[[[[[[', seldata)
    const handleOk = () => {
      if (seldata.packs) { // 删除分组
        deleteGroup(seldata.id).then(res => {
          message.success('操作成功')
          this.props.refresh()
        })
      } else { // 删除业务包
        deletePack(seldata.id).then(res => {
          message.success('操作成功')
          this.props.refresh()
        })
      }
    }
    const handleCancel = () => {
      this.setState({
        modalVisible: false
      })
    }
    const delGroupTem = () => {
      return (
        <div>
          <p><IconSvg name='icondaochuEXCEL' />您确定要删除分组吗？</p>
          <p>该分组下的业务包和表都将无法找回，相关联的自助数据集、仪表板也将受到影响。确定删除“{seldata.name}”?</p>
        </div>
      )
    }
    const delPackTem = () => {
      return (
        <div>
          <p><IconSvg name='icondaochuEXCEL' />您确定要删除业务包吗？</p>
          <p>该业务包下的表都将无法找回，相关联的自助数据集、仪表板也将受到影响。确定删除“{seldata.name}?</p>
        </div>
      )
    }
    return (
      <Modal closable={false} visible={modalVisible} onOk={() => handleOk()} onCancel={() => this.handleCancel()}>
        {seldata.packs ? delGroupTem() : delPackTem()}
      </Modal>
    )
  }

  treeProsTemOne (data) { // 插槽模板一
    const click = (e) => {
      e.stopPropagation()
    }
    const reName = (e, data) => { // 重命名
      e.stopPropagation()
      this.refs.popver.onClick(e)
      this.refs.rename.onClick(e)
    }
    const move = (e, data) => { // 移动
      e.stopPropagation()
      this.refs.popver.onClick(e)
      this.props.movePopup(data)
    }
    const del = (e, data) => { // 删除
      e.stopPropagation()
      this.refs.popver.onClick(e)
      this.setState({
        modalVisible: true,
        seldata: data
      })
    }
    const popupContent = () => {
      return (
        <PopupDiv>
          <PopupDivItem onClick={(e) => reName(e, data)}>
            <IconSvg name='iconxieti1' />
            <span>重命名</span>
          </PopupDivItem>
          <PopupDivItem onClick={(e) => move(e, data)}>
            <IconSvg name='iconxieti1' />
            <span>移动</span>
          </PopupDivItem>
          <PopupDivItem onClick={(e) => del(e, data)}>
            <IconSvg name='iconxieti1' />
            <span>删除</span>
          </PopupDivItem>
        </PopupDiv>
      )
    }

    return (
      <>
        <Popover ref="popver" placement="bottomLeft" content={popupContent()} trigger="click" >
          <span style={{ display: this.state.propsVisible ? '' : 'none', position: 'absolute', right: '0' }} key={data.id} onClick={(e) => click(e)}>···</span>
        </Popover>
      </>
    )
  }

  ReNameTem = (data) => { // 修改名称
    const { newName } = this.state
    const click = (e) => { // 清除点击冒泡
      e.stopPropagation()
    }

    const onChange = (e) => { // 监听值变化
      this.setState({
        newName: e.target.value
      })
    }

    const confirm = (e) => {
      e.stopPropagation()
      if (data.packs) {
        putRenameGroup({ // 分组重命名
          id: data.id,
          name: newName
        }).then(res => {
          this.props.refresh()
        })
      } else {
        putRenamePack({ // 业务包重命名
          id: data.id,
          name: newName
        }).then(res => {
          this.props.refresh()
        })
      }
      this.refs.rename.onClick(e)
    }

    const cancel = (e) => {
      e.stopPropagation()
      this.refs.rename.onClick(e)
    }

    const InputTem = () => {
      return (
        <RenameBox>
          <div style={{ padding: '12px 0' }}>修改名称</div>
          <RenameInput defaultValue={data.name} onClick={(e) => click(e)} onChange={onChange} />
          <RenameBtBox>
            <Button size="small" style={{ width: '80px' }} onClick={(e) => { cancel(e) }}>取消</Button>
            <Button size="small" style={{ width: '80px' }} type="primary" onClick={(e) => { confirm(e) }}>确定</Button>
          </RenameBtBox>
        </RenameBox>
      )
    }

    return (
      <Popover ref="rename" placement="bottomLeft" content={InputTem()} trigger="click">
        <span style={{ opacity: '0', zIndex: '-1', position: 'absolute', right: '10px' }}>+</span>
      </Popover>
    )
  }

  treeProsTemTwo (data) { // 插槽模板二
    const click = (e) => {
      e.stopPropagation()
    }
    const addPack = (e, data) => { // 增加业务包
      e.stopPropagation()
      console.log(data)
    }
    const addGroup = (e, data) => { // 增加分组
      e.stopPropagation()
      getAddGroup(data.id).then(res => {
        if (res.data.code == 200) {
          message.success('操作成功')
          this.props.refresh()
        } else {
          message.error('操作失败');
        }
      })
    }
    const popupContent = () => {
      return (
        <div>
          <div onClick={(e) => addPack(e, data)}>业务包</div>
          <div onClick={(e) => addGroup(e, data)}>分组</div>
        </div>
      )
    }
    return (
      <Popover placement="bottomLeft" content={popupContent()} trigger="click">
        <span style={{ display: this.state.propsVisible ? '' : 'none' }} key={data.id} onClick={(e) => click(e, data)}>+</span>
      </Popover>
    )
  }




  TreeNodeTem (data) { // 节点模板
    const open = this.state.open
    const click = (e, data) => { // 点击标题
      e.stopPropagation()
      console.log('点击项', data)
      if (!data.groups) {
        this.props.asideSwitch('two', { packId: data.id })
      }

      this.setState({
        open: !open
      })
    }

    const mouseOver = (e) => { // 鼠标在元素上
      e.stopPropagation()
      this.setState({
        propsVisible: true
      })
    }

    const mouseOut = (e) => { // 鼠标移出
      e.stopPropagation()
      this.setState({
        propsVisible: false
      })
    }

    if (data.packs || data.groups) {
      data.children = data.packs.concat(data.groups)
      return (
        <Li key={data.id} onClick={(e) => click(e, data)} onMouseOver={(e) => mouseOver(e)} onMouseOut={(e) => mouseOut(e)}>
          <IconSvg name={open ? 'iconshujujixiala' : 'iconshujujishouqi'} />
          <span style={{ paddingLeft: '6px' }}>
            {data.name}
            {this.ReNameTem(data)}
            {/* {this.treeProsTemTwo(data)} */}
            {this.treeProsTemOne(data)}
          </span>
          <Ul>{this.state.open && data.children.length ? data.children.map(res => { return <TreeNode key={res.id} nodeData={res} refresh={this.props.refresh} movePopup={this.props.movePopup} asideSwitch={this.props.asideSwitch} /> }) : ''}</Ul>
        </Li>
      )
    } else {
      return (
        <Li key={data.id} onClick={(e) => click(e, data)} onMouseOver={(e) => mouseOver(e)} onMouseOut={(e) => mouseOut(e)}>
          <IconSvg name='iconwenjianjia' />
          <span style={{ paddingLeft: '6px' }}>
            {data.name}
            {this.ReNameTem(data)}
            {this.treeProsTemOne(data)}
          </span>
        </Li>
      )
    }
  }

  render () {
    const { seldata } = this.state
    return (
      <>
        {seldata ? this.ModalTem() : ''}
        {this.TreeNodeTem(this.props.nodeData)}
      </>
    )
  }

}

export default TreeNode