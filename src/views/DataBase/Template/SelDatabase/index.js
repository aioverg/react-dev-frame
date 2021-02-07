/**
 * 添加表，数据库表
 */
import React, { PureComponent } from 'react'
import { Button, Tag } from 'antd'
import { getConnections, getDatabaseTables, postDatasetToPack } from '@src/views/api/Darabase.api'
import { map } from 'lodash'

class SelDatabase extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      databaseList: [],
      currentDatabaseId: null,
      tablesList: [],
      selectedTags: []
    }
  }

  componentDidMount () {
    console.log('---------------------------', this.props)
    getConnections({}).then(res => {
      this.setState({
        databaseList: res.data.data
      })
    })
  }

  databaseTem () {
    const getTables = (id) => {
      getDatabaseTables(id).then(res => {
        this.setState({
          tablesList: res.data.data,
          currentDatabaseId: id,
        })
      })
    }
    const itemTem = () => {
      return this.state.databaseList.map(item => {
        return <li key={item.id} onClick={() => getTables(item.id)}>{item.connectionName}</li>
      })
    }
    return <ul>{itemTem()}</ul>

  }

  tablesTem () {
    const { selectedTags } = this.state;
    const handleChange = (tag, checked) => {
      // const { selectedTags } = this.state;
      const nextSelectedTags = checked ? [...selectedTags, tag.tableName] : selectedTags.filter(t => t !== tag.tableName);
      console.log('You are interested in: ', nextSelectedTags);
      this.setState({ selectedTags: nextSelectedTags });
    }
    return this.state.tablesList.map(item => {
      if (item.packId) {
        return (<Tag key={item.id} color="#2db7f5">{item.tableName}</Tag>)
      } else {
        return (
          <Tag.CheckableTag
            key={item.tableName}
            checked={selectedTags.indexOf(item.tableName) > -1}
            color="#2db7f5"
            onChange={checked => handleChange(item, checked)}
          >
            {item.tableName}
          </Tag.CheckableTag>
        )
      }
    })
  }

  submit () {
    const tables = []
    for (let item of this.state.selectedTags) { tables.push({ tableName: item }) }
    const form = {
      packId: this.props.packData,
      connectionId: this.state.currentDatabaseId,
      tables: tables
    }
    // console.log('------', tables)
    postDatasetToPack(form.packId, form).then(res => {
      console.log('添加数据集到业务包', res)
    })
  }

  render () {
    return (
      <div>
        <div>
          <Button type="text" onClick={() => this.props.temSwitch('Home')}>取消</Button>
          <Button type="text" onClick={() => { this.submit() }}>确定</Button>
        </div>
        <div>
          <div>
            <span>请选择数据连接</span>
            {this.databaseTem()}
          </div>
          <div>{this.tablesTem()}</div>
        </div>
      </div>
    )
  }
}

export default SelDatabase