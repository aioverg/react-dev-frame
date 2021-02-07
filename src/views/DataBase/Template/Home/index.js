import React, { PureComponent } from 'react'
import { Tabs, Button, Switch } from 'antd'
import Tree from '@src/views/DataBase/components/Tree/Tree'
import SearchTree from '@src/views/DataBase/components/SearchTree/SearchTree'
import AsideOne from './AsideOne'
import AsideTwo from './AsideTwo'
import Content from './Content'

import styles from './index.less'
import { info } from 'autoprefixer'

class System extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      asideSwitch: 'one', // 侧边栏的切换 list => AsideOne, two => AsideTwo
      params: null, // 业务包数据，传递给
      tableData: [], // 表格数据，从AsideTwo接收而来
      tabType: 'Preview', // tabs选项, Preview => 数据预览, Relation => 关系视图, Consanguinity => 血缘分析
      asideTwoParams: null
    }
  }

  componentDidMount () {
    const { params } = this.props
    if (params && params.tableId) {
      this.setState({
        asideSwitch: 'two',
        params: params,
        asideTwoParams: params
      })
    }

  }
  asideSwitch = (type, params) => {
    this.setState({
      asideSwitch: type,
      params: params
    })
  }
  asideTwoParams = (params) => { // AsideTwo 组件传递参数
    this.setState({
      asideTwoParams: params
    })
  }

  render () {
    const { asideTwoParams, params } = this.state
    const { temSwitch } = this.props
    return (
      <div className={styles.Home}>
        <div className={styles.siderTem}>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="数据列表" key="1">
              {!this.props.params && this.state.asideSwitch == 'one' ? <AsideOne asideSwitch={this.asideSwitch} /> : ''}
              {this.state.asideSwitch == 'two' ? <AsideTwo asideSwitch={this.asideSwitch} asideTwoParams={this.asideTwoParams} params={params} temSwitch={this.props.temSwitch} /> : ''}
            </Tabs.TabPane>
            <Tabs.TabPane tab="自助数据集" key="2">
              Content of Tab Pane 2
          </Tabs.TabPane>
          </Tabs>
        </div>
        <div className={styles.Content}>
          <div className={styles.ContentHeader}>
            <Button type="text" onClick={() => temSwitch('RevelanceView')}>关联视图</Button>
            <Button type="text">多路径设置</Button>
            <Button type="text">更新任务管理</Button>
            <Button type="text">全局更新</Button>
          </div>
          <div className={styles.ContentMain}>
            <Content params={asideTwoParams} temSwitch={temSwitch} />
          </div>
        </div>
      </div>
    )
  }
}

export default System