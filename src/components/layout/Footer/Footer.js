import React, { PureComponent } from 'react'
import { Layout } from 'antd'
import styles from './Footer.less'

class Footer extends PureComponent {

  render () {
    return (
      <Layout.Footer className={styles.footer}>
        页脚页脚
      </Layout.Footer>
    )
  }
}
export default Footer