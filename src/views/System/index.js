import React, { PureComponent } from 'react'
import { connect } from "react-redux"
import { Menu } from 'antd'
import {Link, Switch} from 'react-router-dom'
import {RouteWithSubRoutes} from '@src/router/router'
import styled from 'styled-components'

const SystemBox = styled.div`
  display: flex;
`
const SysTemSide = styled.div`
  width: 210px;
`

class System extends PureComponent {
  constructor(props){
    super(props)
    this.state = {
      menuList: {},
        collapsed: false,
        routes: []
    }
  }
  componentDidMount(){
    const {permissions} = this.props
    const path = window.location.hash.replace('#', '')
    const menuList = permissions
    this.setState({
      menuList: menuList
    })
    
  }
  menuTem = () => {
    const {permissions} = this.props
    let menuList = {}
    menuList = permissions.existMenu.find(item => {
      return item.path == '/bi/system'
    })
    const menuItem = (data) => {
      
      return data.map(item => {
        if(item.children.length){
          return(
            <Menu.SubMenu key={item.path} title={item.name}>
              {menuItem(item.children)}
            </Menu.SubMenu>
          ) 
        }else{
          return <Menu.Item key={item.path}><Link to={item.path}>{item.name}</Link></Menu.Item>
        }
      })
      
    }
    return(
      <Menu mode="inline">{menuList.children ? menuItem(menuList.children): null}</Menu>
    )
  }
  render(){
    const {routes} = this.props
    return (
      <SystemBox>
        <SysTemSide>
          {this.menuTem()}
        </SysTemSide>
        
        <Switch>
          {routes.map(item => {
            return(<RouteWithSubRoutes key={item.name} {...item} />)
          })}
        </Switch>
      </SystemBox>
    )
  }
}

export default connect(state => state)(System)