import React, { PureComponent } from 'react'
import { Button } from 'antd'

import styles from './index.less'

class Database extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  databaseTem = (data) => { // 数据源列表模板

  }

  render () {
    const { switchTem, params } = { ...this.props }
    return (
      <div>
        <div>
          <Button onClick={() => { switchTem('ConnectManage', null) }}>取消</Button>
          <Button>保存</Button>
        </div>
        <div>
          <div>
            <p>常用</p>
            <p>所有</p>
            <p>其他</p>
          </div>
          <div>
            <p onClick={() => { switchTem('AddContent', { DataBaseType: 'MySQL', type: 'add' }) }}>MySQL</p>
            <p onClick={() => { switchTem('AddContent', { DataBaseType: 'POSTGRES', type: 'add' }) }}>POSTGRES</p>
          </div>
        </div>
      </div>
    )
  }
}

export default Database