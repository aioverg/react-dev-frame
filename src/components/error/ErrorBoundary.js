import React, { Component } from 'react'

// 错误边界处理
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      errorInfo: null,
    }
  }

  componentDidCatch (error, errorInfo) { // 当渲染出错时，捕捉错误信息
    this.setState({
      error,
      errorInfo
    })
  }

  render () { // 首选渲染路由组件，当路由组件出错时，捕捉错误信息，渲染错误提示页面
    const { errorInfo } = this.state
    return errorInfo ? (
      <div className='middle ph100'>
        <h2 className='colorRed'>
          页面崩溃！
        </h2>
      </div>
    )
      :
      this.props.children
  }
}

export default ErrorBoundary