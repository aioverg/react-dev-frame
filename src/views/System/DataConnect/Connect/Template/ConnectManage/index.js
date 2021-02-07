/**
 * 数据连接管理
 */

import React, { PureComponent } from 'react'
import { Menu, Button, Popover, Divider, message, Form, Input, Select } from 'antd'
import { getConnectList, postTestConnect, deleteConnect } from '@src/views/api/System.api'
import styles from './index.less'

class ConnectManage extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      connectList: [], // 数据连接数据
      currentContentIndex: 0, // 当前选中的数据连接序号
    }
  }

  getConnectList = () => { // 获取数据连接列表
    getConnectList({}).then(res => {
      this.setState({
        connectList: res.data.data || [],
        currentContentIndex: 0
      })
    })
  }

  selContentItem = (index) => { // 选择列表
    this.setState({
      currentContentIndex: index
    })
  }

  testConnect = (index) => { // 测试连接
    const { connectList } = this.state
    this.refs.popver.onClick()
    postTestConnect(connectList[index]).then(res => {
      if (res.data.code == 200) {
        message.success('连接成功');
      } else {
        message.error('连接失败');
      }
    })
  }

  delConnect = (index) => { // 删除数据连接
    const { connectList } = this.state
    deleteConnect(connectList[index].id).then(res => {
      this.getConnectList()
      message.success('删除成功');
    }).catch(res => {
      message.success('删除失败');
    })
  }

  componentDidMount () { // 获取数据连接数据
    this.getConnectList()
  }

  render () {
    const { connectList, currentContentIndex } = this.state
    const popupContent = (index) => { // 数据连接管理 弹窗
      return (
        <div>
          <p onClick={() => this.testConnect(index)}>测试连接</p>
          <p>编辑</p>
          <p>重命名</p>
          <p>复制</p>
          <p onClick={() => this.delConnect(index)}>删除</p>
          <Divider />
          <p>类型{connectList.length != 0 ? connectList[currentContentIndex].database : '---'}</p>
          <p>创建者{connectList.length != 0 ? connectList[currentContentIndex].creatorName : '---'}</p>
        </div>
      )
    }

    const connectListItem = () => {
      return connectList.map((item, index) => {
        return (
          <li key={item.id}>
            <span onClick={() => this.selContentItem(index)}>{item.connectionName}</span>
            <Popover ref="popver" placement="bottomLeft" title={'弹出框标题'} content={popupContent(index)} trigger="click">
              <span>点击图标</span>
            </Popover>
          </li>
        )
      })
    }

    return (
      <div className={styles.content} >
        <div className={styles.left}>
          <div><Button onClick={() => this.props.switchTem('Database', null)}>新建数据集连接</Button></div>
          <ul>{connectList.length != 0 ? connectListItem() : ''}</ul>
        </div>
        <div className={styles.right}>
          <div><Button onClick={() => this.props.switchTem('AddContent', { type: 'edit', data: connectList[currentContentIndex] })}>编辑</Button></div>
          <div>
            <p><span>驱动</span><span>{connectList.length != 0 ? connectList[currentContentIndex].driver : '---'}</span></p>
            <p><span>数据库名称</span><span>{connectList.length != 0 ? connectList[currentContentIndex].database : '---'}</span></p>
            <p><span>主机</span><span>{connectList.length != 0 ? connectList[currentContentIndex].host : '---'}</span></p>
            <p><span>端口</span><span>{connectList.length != 0 ? connectList[currentContentIndex].port : '---'}</span></p>
            <p><span>用户名</span><span>{connectList.length != 0 ? connectList[currentContentIndex].username : '---'}</span></p>
            <p><span>密码</span><span>{connectList.length != 0 ? connectList[currentContentIndex].password : '---'}</span></p>
            <p><span>编码</span><span>{connectList.length != 0 ? connectList[currentContentIndex].originalCharsetName : '---'}</span></p>
            <p><span>模式</span><span>{connectList.length != 0 ? connectList[currentContentIndex].connectionType : '---'}</span></p>
            <p><span>数据连接URL</span><span>{connectList.length != 0 ? connectList[currentContentIndex].url : '---'}</span></p>
          </div>
          <div>高级设置</div>
          <div>
            <p><span>初始化连接数</span><span>{connectList.length != 0 ? connectList[currentContentIndex].initialSize : '---'}</span></p>
            <p><span>最大活动连接数</span><span>{connectList.length != 0 ? connectList[currentContentIndex].maxActive : '---'}</span></p>
            <p><span>最大空闲连接数</span><span>{connectList.length != 0 ? connectList[currentContentIndex].maxIdle : '---'}</span></p>
            <p><span>最小空闲连接数</span><span>{connectList.length != 0 ? connectList[currentContentIndex].minIdle : '---'}</span></p>
            <p><span>最大等待时间</span><span>{connectList.length != 0 ? connectList[currentContentIndex].maxWait : '---'}</span></p>
            <p><span>SQL验证查询</span><span>{connectList.length != 0 ? connectList[currentContentIndex].validationQuery : '---'}</span></p>
            <p><span>获取连接前检验</span><span>{connectList.length != 0 ? connectList[currentContentIndex].testOnBorrow : '---'}</span></p>
            <p><span>归还连接前检验</span><span>{connectList.length != 0 ? connectList[currentContentIndex].testOnReturn : '---'}</span></p>
            <p><span>开启空闲回收器检验</span><span>{connectList.length != 0 ? connectList[currentContentIndex].testWhileIdle : '---'}</span></p>
            <p><span>空闲连接回收器休眠时间</span><span>{connectList.length != 0 ? connectList[currentContentIndex].timeBetweenEvictionRunsMillis : '---'}</span></p>
            <p><span>空闲连接回收检查数</span><span>{connectList.length != 0 ? connectList[currentContentIndex].numTestsPerEvictionRun : '---'}</span></p>
            <p><span>保持空闲最小时间值</span><span>{connectList.length != 0 ? connectList[currentContentIndex].minEvictableIdleTimeMillis : '---'}</span></p>
          </div>
        </div>
      </div>
    )
  }
}

export default ConnectManage