import React, { PureComponent } from 'react'
import { Menu, Button, Popover, Divider, message, Form, Input, Select, Tabs } from 'antd'
import { getConnectList, postTestConnect, postConnectStatus, postConnectAdd, putConnectEdit, deleteConnect, postSchemas } from '@src/views/api/System.api'

import ConnectManage from './Template/ConnectManage'
import Database from './Template/Database'
import ConnectStatus from './Template/ConnectStatus'
import AddContent from './Template/AddContent'

import styles from './index.less'

class System extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      currentTem: 'ConnectManage', // ConnectManage => ConnectManage && ConnectStatus, Database => Database, AddContent=> AddContent
      params: null
    }
  }

  switchTem = (name, params) => { // 切换模板
    this.setState({
      currentTem: name,
      params: params
    })
  }

  render () {
    const { currentTem } = this.state
    const Tab = () => {
      return (
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Tab 1" key="1">
            <ConnectManage switchTem={this.switchTem} params={this.state.params} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Tab 2" key="2">
            <ConnectStatus switchTem={this.switchTem} params={this.state.params} />
          </Tabs.TabPane>
        </Tabs>
      )
    }
    return (
      currentTem == 'ConnectManage' ? <Tab /> :
        currentTem == 'Database' ? <Database switchTem={this.switchTem} params={this.state.params} /> :
          currentTem == 'AddContent' ? <AddContent switchTem={this.switchTem} params={this.state.params} /> : ''
    )
  }
}

export default System