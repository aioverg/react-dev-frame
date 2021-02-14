import React, { PureComponent } from 'react'
import { Layout, Avatar, Popover } from 'antd'
import styles from './HeaderOne.less'
import Connect from '@components/hoc/Connect'
import { injectIntl } from 'react-intl'
import {Link} from 'react-router-dom'

import { translateText } from '@utils/translate'
import avatarImg from '@assets/img/avatar.jpeg'
import { logout } from '@utils/handleLogin'


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

  handleClickSignout = e => {
    if (e.key === 'SignOut') {
      logout()
    }
  }
  
  UserTem = () => { // 用户信息模板
    return (
      <div>
        <div onClick={this.handleClickSignout}>退出</div>
      </div>
    )
  }

  render () {
    const username = sessionStorage.getItem('username')
    const { collapsed, menuList, language, languages } = this.props
    const currentLanguage = languages.find(item => item.key === language)
    return (
      <Layout.Header className={styles.header}>
        {/* logo */}
        <div className={styles.logo}>
          <img src="src/comm/assets/logo.png" style={{ width: '35px', height: '35px' }} />
          <span className={styles.name}>FE-IU BI</span>
          <span className={styles.line}></span>
        </div>

        {/* 菜单 */}
        <div className={styles.menu}>
          {menuList.map(item => {
            return (
              <div className={styles.menuItem} key={item.path}>
              <Link to={item.path}>
                <span>{item.name}</span>
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

export default Connect(injectIntl(Header), ({ app }) => (app))