import React, { PureComponent } from 'react'
import { connect } from "react-redux"
import { Menu } from 'antd';

const mapStateToProps = state => {
  return state
}

class System extends PureComponent {
  constructor(props){
    super(props)
    this.state = {
      menuList: {}
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
          return <Menu.Item key={item.path}>{item.name}</Menu.Item>
        }
      })
      
    }
    return(
      <Menu mode="inline">{menuList.children ? menuItem(menuList.children): null}</Menu>
    )
  }
  render(){
    return (
      <div>
        {this.menuTem()}
      </div>
    )
  }
}

export default connect(mapStateToProps)(System)