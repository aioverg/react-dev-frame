/**
 * 下载iconfont, 修改 iconfont.css 文件中的路径。
 * 参数：
 *   name: 图标的名称
 */


import React, { PureComponent } from 'react'
import styles from '@src/comm/icon/iconfont.css'
import '@src/comm/icon/iconfont'

class IconFont extends PureComponent {
  render () {
    const { name } = this.props
    return (
      <i className={`${styles.iconfont} ${styles[name]}`}></i>
    )
  }
}

class IconSvg extends PureComponent {
  render () {
    const { name, style, onClick } = this.props
    return (
      <svg onClick={() => onClick ? onClick() : ''} className='IconSvg' style={style ? style : { width: '1em', height: '1em' }} aria-hidden="true">
        <use xlinkHref={'#' + name}></use>
      </svg >
    )
  }
}


export { IconSvg, IconFont }
