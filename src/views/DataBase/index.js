import React, { PureComponent } from 'react'
import Home from './Template/Home'
import SelDatabase from './Template/SelDatabase'
import RevelanceView from './Template/RevelanceView'
import DatasetEdit from './Template/DatasetEdit'

import styles from './index.less'
import { info } from 'autoprefixer'

class DataBase extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      temSwitch: 'Home', // 模板切换 Home => Home, SelDatabase => SelDatabase, RevelanceView => RevelanceView, DatasetEdit => DatasetEdit
      params: null // 模板切换参数
    }
  }

  componentDidMount () {
  }

  temSwitch = (type, params) => { // 切换模板
    this.setState({
      temSwitch: type,
      params: params || null
    })
  }

  render () {
    const params = this.state.params
    return (
      this.state.temSwitch == 'Home' ? <Home temSwitch={this.temSwitch} params={params} /> :
        this.state.temSwitch == 'SelDatabase' ? <SelDatabase packData={params} temSwitch={this.temSwitch} /> :
          this.state.temSwitch == 'RevelanceView' ? <RevelanceView /> :
            this.state.temSwitch == 'DatasetEdit' ? <DatasetEdit temSwitch={this.temSwitch} params={params} /> : ''
    )
  }
}

export default DataBase