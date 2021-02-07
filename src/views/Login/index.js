import React, { PureComponent } from 'react'
import { Input, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styles from './index.less'
import { login } from '@src/views/api/Login.api'
import { setCookie } from '@utils/handleCookie'

import axios from 'axios'

class Login extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      name: 'admin@fareast.com',
      password: '123456'
    }
  }
  login = () => {
    const { history } = this.props
    login({
      userName: this.state.name,
      password: this.state.password
    }).then(res => {
      console.log(res)
      if (res.data.code == 200) {
        setCookie('feiu_token', res.data.data.token) // 设置cookie, 保存登录信息，有效期1天
        // devSetCookieToken(res.data.data.token)
        history.push('/app')
      }
    })
  }
  handleInputChange = (e) => {
    const target = event.target
    const value = target.value
    const name = target.name
    this.setState({
      [name]: value
    })
  }
  render () {
    return (
      <div className={styles.loginTemplate}>
        <div className={styles.loginBox}>
          <Input size="large" name="name" value={this.state.name} onChange={this.handleInputChange} placeholder="large size" prefix={<UserOutlined />} />
          <Input size="large" name="password" value={this.state.password} onChange={this.handleInputChange} placeholder="large size" prefix={<UserOutlined />} />
          <Button type="primary" shape="round" onClick={this.login}>登录</Button>
        </div>
      </div>
    )
  }
}

export default Login