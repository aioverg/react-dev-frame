import React, { PureComponent } from 'react'
import { Menu, Button, Popover, Divider, message, Form, Input, Select } from 'antd'
import { getConnectList, postConnectStatus } from '@src/views/api/System.api'


import styles from './index.less'

class ConnectStatus extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      connectList: [], // 数据连接数据
      currentContentIndex: 0, // 当前选中的数据连接序号
      connectStatusData: [], // 连接池状态
    }
  }

  componentDidMount () { // 获取数据连接数据
    this.getConnectList()
  }

  getConnectList = () => { // 获取数据连接列表
    getConnectList({}).then(res => {
      this.setState({
        connectList: res.data.data,
        currentContentIndex: 0
      })
    })
  }


  connectStatus = (index) => { // 获取连接池状态
    postConnectStatus(this.state.connectList[index].id).then(res => {
      this.setState({
        connectStatusData: JSON.parse(res.data.data)
      })
      console.log(JSON.parse(res.data.data))
    })
  }



  render () {
    const { connectList, connectStatusData } = this.state
    const connectListItem = () => {
      return connectList.map((item, index) => {
        return (
          <li key={item.id}>
            <span onClick={() => this.connectStatus(index)}>{item.connectionName}</span>
          </li>
        )
      })
    }
    return (
      <div className={styles.content} >
        <div className={styles.left}>
          <div>数据连接</div>
          <ul>{connectListItem.length != 0 ? connectListItem() : "没有数据"}</ul>
        </div>
        <div className={styles.right}>
          <div>
            <div>
              <p>{connectStatusData.numActive}/{connectStatusData.maxActive}</p>
              <p>活动连接数</p>
            </div>
            <div>
              <p>{connectStatusData.numIdle}/{connectStatusData.maxIdle}</p>
              <p>空闲连接数</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ConnectStatus