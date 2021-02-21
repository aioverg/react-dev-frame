import React, { PureComponent } from 'react'
import { Layout, Avatar, Popover } from 'antd'
import styles from './HeaderOne.less'
import {Link} from 'react-router-dom'
import { getCookie, clearCookie } from '@utils/handleCookie'
import { connect } from 'react-redux'
import styled from 'styled-components'

const MenuItem = styled.span`
  color: '#ffffff'
`

class Header extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      currentPath: '/app'
    }
  }

  componentDidMount () {
    const { menuList } = this.props
    this.setState({
      currentPath: window.location.hash.replace('#', '')
    })
  }

  logout = e => {
    const {history} = this.props
    const token = getCookie('feiu_token')
    clearCookie('feiu_token')
    history.push('/login')
  }
  
  UserTem = () => { // 用户信息模板
    return (
      <div>
        <div onClick={this.logout}>退出</div>
      </div>
    )
  }

  render () {
    const username = sessionStorage.getItem('username') || '用户名写死的'
    const {permissions} = this.props
    return (
      <Layout.Header className={styles.header}>
        {/* logo */}
        <div className={styles.logo}>
          <img src="src/comm/img/logo.png" style={{ width: '35px', height: '35px' }} />
          <span className={styles.name}>FE-IU BI</span>
          <span className={styles.line}></span>
        </div>

        {/* 菜单 */}
        <div className={styles.menu}>
          {permissions.existMenu.map(item => {
            return (
              <div className={styles.menuItem} key={item.path}>
              <Link to={item.path}>
                <span style={{color: 'rgba(255, 255, 255, 0.8)'}}>{item.name}</span>
              </Link>
            </div>
            )
          })}
        </div>)

        {/* 用户信息 */}
        <div className={styles.user}>
          <Avatar size={24} style={{ backgroundColor: '#597EF7', fontSize: '9px' }}>{username}</Avatar>
          <Popover
            content={this.UserTem()}
            trigger="click"
          >
            <span className={styles.userName}>{username}</span>
          </Popover>
        </div>
      </Layout.Header>
    )
  }
}

export default connect(state => state)(Header)