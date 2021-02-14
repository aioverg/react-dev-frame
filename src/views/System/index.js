import React, { PureComponent } from 'react'
import { connect } from "react-redux"
import { Menu } from 'antd'
import {Link, Switch, Route} from 'react-router-dom'
import { generateRoute } from '@router/menu.route'


const mapStateToProps = state => {
  return state
}

class System extends PureComponent {
  constructor(props){
    super(props)
    const { routes, existRoute, redirects } = generateRoute()
    this.state = {
      menuList: {},
        collapsed: false,
        routes,
        existRoute,
        redirects,
    }
  }
  componentDidMount(){
    const {permissions} = this.props
    const path = window.location.hash.replace('#', '')
    const menuList = permissions.existMenu.find(res => {
      return res.path == path
    })
    this.setState({
      menuList: menuList
    })
    
  }
  menuTem = () => {
    const {menuList} = this.state
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
    const { collapsed, routes, redirects, existRoute } = this.state
    console.log('000000000', routes, redirects)
    return (
      <div>
        {this.menuTem()}
        <Switch>
          <Route exact>
          <h3>Please select a topic.</h3>
          </Route>
          <Route path='/app/system/catalog'>
          <h3>Please select a topic.</h3>
          </Route>
          
      </Switch>
      </div>
    )
  }
}

export default connect(mapStateToProps)(System)