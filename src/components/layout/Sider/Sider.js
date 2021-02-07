import React, { PureComponent } from 'react'
import { Layout, Menu, Tree } from 'antd'
import { WifiOutlined } from '@ant-design/icons';
import styles from './Sider.less'
import { injectIntl } from 'react-intl'
import { translateText } from '@utils/translate' // 中英文转换
import logoImg from '@assets/img/logo3.svg'

const { SubMenu } = Menu
const MenuItem = Menu.Item

const { DirectoryTree } = Tree

class Sider extends PureComponent {
  constructor(props) {
    super(props)
    const { pathname } = (props.history && props.history.location) || {}

    this.historyListener(props.history)
    let routerFlat = []
    const arrayFlat = (data) => {
      for (let item of data) {
        if (item.children.length != 0) {
          arrayFlat(item.children)

        }
      }
    }

    let defaultOpenKeys = []
    let defaultSelectedKeys = []
    let routerKey = '/app/catalog'
    if (pathname && pathname.length != 0) { // 页面刷新走这里
      const pathList = pathname.split('/')
      routerKey = pathList.slice(0, 3).join('/')
      defaultOpenKeys.push(pathList.slice(0, pathList.length - 1).join('/'))
      defaultSelectedKeys.push(pathname)
    }

    this.state = {
      selectedKey: pathname,
      // defaultOpenKeys: this.getDefaultOpenKeys(pathname),
      defaultOpenKeys: defaultOpenKeys,
      defaultSelectedKeys: defaultSelectedKeys,
      siderRightFlag: true,
      menuData: [{
        title: 'parent 0',
        key: '0-0',
        children: [
          { title: 'leaf 0-0', key: '0-0-0', isLeaf: true },
          { title: 'leaf 0-1', key: '0-0-1', isLeaf: true },
        ],
      }], // 菜单的子菜单数据
      routerKey: routerKey,

    }
  }

  componentDidMount () {
    const { menuList } = this.props
    // this.setState({
    //   routerKey: 'Catalog'
    // })
  }
  componentWillUnmount () {
    this.unlisten && this.unlisten()
  }

  historyListener = (history) => {
    // 处理输入url地址，触发菜单栏活动页，处理输入 URL 走这里
    this.unlisten = history && history.listen(location => {
      const { pathname } = location || {}
      const { existRoute } = this.props
      console.log("Sider location", location, existRoute)
      if (pathname && existRoute[pathname]) {
        let defaultOpenKeys = []
        let defaultSelectedKeys = []
        const pathList = pathname.split('/')
        defaultOpenKeys.push(pathList.slice(0, pathList.length - 1).join('/'))
        defaultSelectedKeys.push(pathname)
        this.setState({
          defaultOpenKeys: defaultOpenKeys,
          defaultSelectedKeys: defaultSelectedKeys
        })
        // this.setState({
        //   selectedKey: pathname
        // })
      }

    })
  }

  getDefaultOpenKeys = (pathname) => {
    const paths = (pathname || '').split('/')
    let res = []

    if (paths && paths.length > 3) {
      for (let i = 3; i <= paths.length; i++) {
        let p = paths.slice(0, 3).join('/')
        res.push(p)
      }
    }
    return res
  }

  menuTemplate = (data) => { // 预留菜单文件数据类型
    return (
      <DirectoryTree
        multiple
        defaultExpandAll
        treeData={data}
      />
    )
  }
  menuTem = (data) => { // 菜单模板
    return data.map(item => {
      if (item) {
        const { children, path, icon, transKey, name = '' } = item
        return (
          <div key={path} className={styles.menuItem} onClick={() => this.switchMenu(item)}>
            <div>{name}</div>
            <div>图标</div>
          </div>
        )
      }
    })
  }
  menuCatalog = () => { // 目录标签的侧栏
    return (
      <h2>目录标签的侧栏</h2>
    )
  }

  switchDashBoard = () => { // 仪表盘标签的侧栏

  }

  pushRoute = (item) => { // 切换路由
    const { history } = this.props
    history.push(item.key)
  }
  switchMenuSub = (res) => { // 关闭收起 MenSub
    if (res.key == this.state.defaultOpenKeys[0]) {
      this.setState({
        defaultOpenKeys: []
      })
    } else {
      this.setState({
        defaultOpenKeys: [res.key]
      })
    }
  }

  systemChildTem = () => { // 系统管理子标签模板
    const { menuList } = this.props
    const menuItemTem = (data) => {
      return data.map(item => {
        if (item) {
          const { children, path, icon, transKey, name = '' } = item
          if (children && children.length) {
            return (
              <SubMenu
                key={path}
                onTitleClick={this.switchMenuSub}
                title={
                  <span>
                    <span>{item.name}</span>
                  </span>
                }
              >
                {menuItemTem(children)}
              </SubMenu>
            )
          }
          return (
            <MenuItem key={path}>
              <span>{item.name}</span>
            </MenuItem>
          )
        }
      })
    }
    return (
      <Menu
        openKeys={this.state.defaultOpenKeys}
        selectedKeys={this.state.defaultSelectedKeys}
        theme="dark"
        mode="inline"
        onClick={this.pushRoute}
      >{menuList.length != 0 ? menuItemTem(menuList.find(item => { return item.path == '/app/system' }).children) : ''}
      </Menu>
    )
  }
  switchMenu = (item) => { // 切换菜单，在这里处理生成菜单预留的内容
    const { history } = this.props
    console.log(item)
    if (history && item.path) {
      if (item.path == '/app/system') {
        this.setState({
          menuData: item.children,
          routerKey: item.path
        })
      } else {
        this.setState({
          menuData: [{
            title: 'parent 0',
            key: '0-0',
            children: [
              { title: 'leaf 0-0', key: '0-0-0', isLeaf: true },
              { title: 'leaf 0-1', key: '0-0-1', isLeaf: true },
            ],
          }],
          routerKey: item.path
        })
      }
      history.push(item.path)
    }
  }

  render () {
    const { menuList, collapsed } = this.props
    const { selectedKey, defaultOpenKeys } = this.state
    return (
      // 关闭菜单栏收缩功能
      <div className={styles.siderBox}>
        <Layout.Sider style={{}} className={styles.siderLeft} trigger={null} collapsible collapsed={true}>
          <div>
            <div className={styles.logo}>
              <img src={logoImg} />
              <span className={styles.hide}>{translateText({ id: 'SystemName' })}</span>
            </div>
            {this.menuTem(menuList)}
          </div>
        </Layout.Sider>
        <div className={styles.menuSlot}>{
          this.state.routerKey == '/app/catalog' || this.state.routerKey == '/app' ? this.menuCatalog() :
            this.state.routerKey == '/app/system' ? this.systemChildTem() :
              ''
        }</div>
      </div>
    )
  }
}

export default injectIntl(Sider)