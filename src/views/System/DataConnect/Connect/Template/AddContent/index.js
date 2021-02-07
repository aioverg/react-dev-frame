import React, { PureComponent } from 'react'
import { Menu, Button, Popover, Divider, message, Form, Input, Select } from 'antd'
import { postConnectAdd, putConnectEdit, postSchemas } from '@src/views/api/System.api'



const form = {
  id: '',
  connectName: 'connectName', // 数据库连接名称
  driver: 'com.mysql.cj.jdbc.Driver', // 驱动
  databaseName: 'test', // 数据库名称
  host: '172.16.10.137', // 主机
  port: '3306', // 端口
  userName: 'username', // 用户名
  password: 'password', // 密码
  code: '1', // 编码
  mode: '1', // 模式
  connectUrl: 'jdbc:mysql://172.16.10.137:3306/test', // 数据连接URL
  initConnectNum: '', // 初始化连接数
  maxActiveNum: '', // 最大活动连接数
  maxFreeNum: '', // 最大空闲连接数
  minFreeNum: '', // 最小空闲连接数
  maxAwaitTime: '', // 最大等待时间
  verifySQL: '', // SQL验证查询
  verifyGetConnect: '', // 获取连接前校验
  verifyReturnConnect: '', // 归还连接前校验
  verifyFreeRecycle: '', // 开启空闲回收器检验
  freeConnectDormantTime: '', // 空闲连接回收器休眠时间
  freeConnectCheckNum: '', // 空闲连接回收检查数
  minFreeTime: '' // 保持空闲最小时间值
}
const codeList = [ // 编码列表
  { label: '自动', value: '1' },
  { label: 'GBK', value: '2' },
  { label: 'BIG5', value: '3' },
  { label: 'ISO-8859-1', value: '4' },
  { label: 'UTF-8', value: '5' },
  { label: 'UTF-16', value: '6' },
  { label: 'EUC_JP', value: '7' },
  { label: 'EUC_KR', value: '8' },
  { label: 'CP850', value: '9' }
]
const driveList = [ // 驱动列表
  { label: 'com.mysql.cj.jdbc.Driver', value: 'com.mysql.cj.jdbc.Driver' },
  { label: 'org.postgresql.Driver', value: 'org.postgresql.Driver' }
]
const connectUrlHeader = [ // 数据连接URL头部
  { label: 'jdbc:mysql://172.16.10.137:3306/test', value: '1' },
  { label: 'jdbc:postgresql://localhost:5432/pgsqltest', value: '2' }
]
let type = null // 页面的模式，edit => 编辑, add => 新增
let DataBaseType = null // 数据库的模式


class AddContent extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      connectList: [], // 数据连接数据
      currentContentIndex: 0, // 当前选中的数据连接序号
      connectStatusData: [] // 连接池状态
    }


    const { params } = { ...this.props } // 编辑时初始化form
    type = params.type
    if (params.type == 'edit') {
      form.id = params.data.id
      form.connectName = params.data.connectionName
      form.driver = params.data.driver
      form.databaseName = params.data.database
      form.host = params.data.host
      form.port = params.data.port
      form.userName = params.data.username
      form.password = params.data.password
      form.code = params.data.newCharsetName
      form.mode = ''
      form.connectUrl = params.data.url
      form.initConnectNum = params.data.initialSize
      form.maxActiveNum = params.data.maxActive
      form.maxFreeNum = params.data.maxIdle
      form.minFreeNum = params.data.minIdle
      form.maxAwaitTime = params.data.maxWait
      form.verifySQL = params.data.validationQuery
      form.verifyGetConnect = params.data.testOnBorrow
      form.verifyReturnConnect = params.data.testOnReturn
      form.verifyFreeRecycle = params.data.testWhileIdle
      form.freeConnectDormantTime = params.data.timeBetweenEvictionRunsMillis
      form.freeConnectCheckNum = params.data.numTestsPerEvictionRun
      form.minFreeTime = params.data.minEvictableIdleTimeMillis
    }
    if (params.type == 'add') {
      DataBaseType = params.DataBaseType
    }
  }

  formFilter = () => {
    const connectionPoolAttrs = {
      initialSize: form.initConnectNum,
      maxActive: form.maxActiveNum,
      maxIdle: form.maxFreeNum,
      maxWait: form.maxAwaitTime,
      minEvictableIdleTimeMillis: form.minFreeTime,
      minIdle: form.minFreeNum,
      numTestsPerEvictionRun: form.freeConnectCheckNum,
      testOnBorrow: form.verifyGetConnect,
      testOnReturn: form.verifyReturnConnect,
      testWhileIdle: form.verifyFreeRecycle,
      timeBetweenEvictionRunsMillis: form.freeConnectDormantTime,
      validationQuery: form.verifySQL
    }
    return {
      authType: '',
      connectionName: form.connectName,
      connectionPoolAttrs: connectionPoolAttrs,
      connectionType: '',
      databaseType: this.state.databaseType,
      createTime: '',
      creatorId: '',
      creatorName: '',
      database: form.databaseName,
      driver: driveList.find(item => { return item.value == form.driver }).label,
      host: form.host,
      id: type == "edit" ? form.id : '',
      keyPath: '',
      newCharsetName: '',
      originalCharsetName: '',
      password: form.password,
      port: form.port,
      principal: '',
      queryType: '',
      updateTime: '',
      updaterId: '',
      url: form.connectUrl,
      username: form.userName,
    }
  }

  submit = () => { // 提交表单
    if (type == 'edit') {
      putConnectEdit(this.formFilter()).then(res => {
        this.props.switchTem('ConnectManage', null)
        console.log("编辑返回", res)
      })
    } else {
      postConnectAdd(this.formFilter()).then(res => {
        this.props.switchTem('ConnectManage', null)
        console.log("新增返回", res)
      })
    }
  }

  postSchemasData = () => {
    postSchemas(formFilter()).then(res => {
      console.log('测试数据库连接', res)
    })
  }

  handleInputChange = (changedValues, allValues) => { // 表单变化回调
    const key = Object.keys(changedValues)[0]
    try { // 数据库名称，主机，端口，数据连接URL联动
      const fragment = allValues.connectUrl.split('://')
      const header = fragment[0]
      const footer = fragment[1].split(/[\/|:|?]/)
      const host = footer[0]
      const port = footer[1]
      const databaseName = footer[2]
      const params = footer[3] ? '?' + footer[3] : ''
      if (key == 'host') {
        this.refs.form.setFieldsValue({
          connectUrl: header + '://' + changedValues[key] + ':' + port + '/' + databaseName + params
        })
      } else if (key == 'port') {
        this.refs.form.setFieldsValue({
          connectUrl: header + '://' + host + ':' + changedValues[key] + '/' + databaseName + params
        })
      } else if (key == 'databaseName') {
        const filterChangedValues = changedValues[key].replace('?', '')
        this.refs.form.setFieldsValue({
          databaseName: filterChangedValues,
          connectUrl: header + '://' + host + ':' + port + '/' + filterChangedValues + params
        })
      } else if (key == 'connectUrl') {
        this.refs.form.setFieldsValue({
          host: host,
          port: port,
          databaseName: databaseName
        })
      }
    } catch (error) {
      console.log(error)
    }
    if (key == 'databaseName') {
      form[key] = changedValues[key].replace('?', '')
    } else {
      form[key] = changedValues[key]
    }
  }

  render () {
    const { switchTem } = { ...this.props }
    const selectOption = (data) => {
      return data.map(item => {
        return <Select.Option value={item.value} key={item.value}>{item.label}</Select.Option>
      })
    }
    return (
      <div>
        <div>
          <Button onClick={() => switchTem('ConnectManage', null)}>取消</Button>
          <Button>测试连接</Button>
          <Button>保存</Button>
        </div>
        <div>
          <Form ref="form" onValuesChange={this.handleInputChange} initialValues={form}>
            <Form.Item label="数据库连接名称" name="connectName">
              <Input />
            </Form.Item>
            <Form.Item label="驱动" name="driver">
              <Select>{selectOption(driveList)}</Select>
            </Form.Item>
            <Form.Item label="数据库名称" name="databaseName">
              <Input />
            </Form.Item>
            <Form.Item label="主机" name="host">
              <Input />
            </Form.Item>
            <Form.Item label="端口" name="port">
              <Input />
            </Form.Item>
            <Form.Item label="用户名" name="userName">
              <Input />
            </Form.Item>
            <Form.Item label="密码" name="password">
              <Input />
            </Form.Item>
            <Form.Item label="编码" name="code">
              <Select>{selectOption(codeList)}</Select>
            </Form.Item>
            <div style={{ display: DataBaseType && DataBaseType == 'POSTGRES' ? '' : 'none' }}>
              <button type="text" onClick={() => postSchemasData()}>点击连接数据库，读取数据库模式</button>
              <Form.Item label="模式" name="mode">
                <Select>
                  <Select.Option value="1">Jack</Select.Option>
                  <Select.Option value="2">Lucy</Select.Option>
                  <Select.Option value="3">yiminghe</Select.Option>
                </Select>
              </Form.Item>
            </div>

            <Divider />
            <Form.Item label="数据连接URL" name="connectUrl">
              <Input />
            </Form.Item>
            <p>高级设置</p>
            <Form.Item label="初始化连接数" name="initConnectNum">
              <Input />
            </Form.Item>
            <Form.Item label="最大活动连接数" name="maxActiveNum">
              <Input />
            </Form.Item>
            <Form.Item label="最大空闲连接数" name="maxFreeNum">
              <Input />
            </Form.Item>
            <Form.Item label="最小空闲连接数" name="minFreeNum">
              <Input />
            </Form.Item>
            <Form.Item label="最大等待时间" name="maxAwaitTime">
              <Input />
            </Form.Item>
            <Form.Item label="SQL验证查询" name="verifySQL">
              <Input />
            </Form.Item>
            <Form.Item label="获取连接前校验" name="verifyGetConnect">
              <Select>
                <Select.Option value="0" title="lucy">否</Select.Option>
                <Select.Option value="1" title="jack">是</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="归还连接前检验" name="verifyReturnConnect">
              <Select>
                <Select.Option value="0" title="lucy">否</Select.Option>
                <Select.Option value="1" title="jack">是</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="开启空闲回收器检验" name="verifyFreeRecycle">
              <Select>
                <Select.Option value="0" title="lucy">否</Select.Option>
                <Select.Option value="1" title="jack">是</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="空闲连接回收器休眠时间" name="freeConnectDormantTime">
              <Input />
            </Form.Item>
            <Form.Item label="空闲连接回收检查数" name="freeConnectCheckNum">
              <Input />
            </Form.Item>
            <Form.Item label="保持空闲最小时间值" name="minFreeTime">
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" onClick={() => this.submit()}>提交</Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}

export default AddContent