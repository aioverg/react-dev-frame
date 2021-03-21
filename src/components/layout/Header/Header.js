import React, { PureComponent } from 'react'
import {Link} from 'react-router-dom'
import { getCookie, clearCookie } from '@utils/handleCookie'
import { connect } from 'react-redux'
import styled from 'styled-components'

const HeaderBox = styled.div`
  padding: 0 16px;
  height: 48px;
  background: #001529;
  box-shadow: 0px 0px 10px 0px rgba(44, 64, 95, 0.15);
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const LogoBox = styled.div`
  color: rgba(255, 255, 255, 0.8);
  height: 100%;
  display: flex;
  align-items: center;
`
const MenuBox = styled.div`
  flex-grow: 1;
  height: 100%;
  display: flex;
  align-items: center;
`
const MenuItem = styled.span`
  padding: 0 10px;
  color: rgba(255, 255, 255, 0.8);
`
const UserBox = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`
const UserItem = styled.div`
  padding: 0 8px;
  color: rgba(255, 255, 255, 0.8);
`
const Line = styled.span`
  border-left: 1px solid #ffffff;
  height: 16px;
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
  
  render () {
    const username = sessionStorage.getItem('username') || 'admin'
    const {permissions} = this.props
    return (
      <HeaderBox>
        {/* logo */}
        <LogoBox>
          <span style={{paddingRight: '10px'}}>react-dev-frame</span>
          <Line />
        </LogoBox>

        {/* 菜单 */}
        <MenuBox>
          {permissions.existMenu.map(item => {
            return (
              <div key={item.path}>
              <Link to={item.path}>
                <MenuItem>{item.name}</MenuItem>
              </Link>
            </div>
            )
          })}
        </MenuBox>

        {/* 用户信息 */}
        <UserBox>
          <Line />
          <UserItem>{username}</UserItem>
          <UserItem onClick={this.logout}>退出</UserItem>
        </UserBox>
      </HeaderBox>
    )
  }
}

export default connect(state => state)(Header)