import React, { PureComponent } from 'react'
import { connect } from "react-redux"
import { Menu } from 'antd'
import {Link, Switch} from 'react-router-dom'
import {RouteWithSubRoutes} from '@src/router/router'

const mapStateToProps = state => {
  return state
}

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
    const menuList ={ children:[
      {
        name: '目录管理',
        path: '/app/system/catalog',
        icon: 'box-plot',
        permKey: 'system.catalog',
        children: []
      },
      {
        name: '数据连接',
        path: '/app/system/dataConnect',
        icon: 'box-plot',
        permKey: 'system.dataConnect',
        children: [
          {
            name: '数据连接管理',
            path: '/app/system/dataConnect/manage',
            icon: 'box-plot',
            permKey: 'system.connect',
            children: []
          },
          {
            name: '服务器数据集',
            path: '/app/system/dataConnect/dataset',
            icon: 'box-plot',
            permKey: 'system.dataset',
            children: []
          },
        ]
      }
    ]
  }
    console.log('---------', menuList)
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
    console.log('000000000', routes)
    return (
      <div>
        {this.menuTem()}
        <Switch>
          {routes.map(item => {
            return(<RouteWithSubRoutes key={item.name} {...item} />)
          })}
        </Switch>
      </div>
    )
  }
}

export default connect(mapStateToProps)(System)