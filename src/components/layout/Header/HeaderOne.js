import React, { PureComponent } from 'react'
import { Layout, Avatar, Popover } from 'antd'
import styles from './HeaderOne.less'
import Connect from '@components/hoc/Connect'
import { injectIntl } from 'react-intl'

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

  // handleClickLanguage = e => {
  //   const language = e.key
  //   this.props.dispatch({
  //     type: 'app/language',
  //     payload: {
  //       language
  //     }
  //   })
  // }

  // toggle = e => {
  //   if (this.props.toggle) {
  //     this.props.toggle()
  //   }
  // }

  menuTem = (data) => { // 菜单模板
    const { currentPath } = this.state
    const MenuItem = () => {
      return data.map(item => {
        if (item) {
          const { children, path, icon, transKey, name = '' } = item
          return (
            <div className={styles.menuItem} key={path}>
              <span style={{ color: currentPath == path ? '#FFFFFF' : '' }} className={styles.menuItemLabel} onClick={() => this.switchMenu(item)}>{name}</span>
            </div>
          )
        }
      })
    }
    return (<div className={styles.menu}>{MenuItem()}</div>)
  }

  switchMenu = (item) => { // 切换菜单，在这里处理生成菜单预留的内容
    const { history } = this.props
    history.push(item.path)
    this.setState({
      currentPath: item.path
    })
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
        {this.menuTem(menuList)}

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