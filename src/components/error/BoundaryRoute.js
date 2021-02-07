// 错误边界处理，将路由组件包在错误处理页面中渲染，当路由组件出错时，渲染错误处理页面
import React from 'react'
import { Route } from 'react-router-dom'
import ErrorBoundary from '@components/error/ErrorBoundary'

const BoundaryRoute = (props) => {
  return (
    <ErrorBoundary>
      <Route {...props} />
    </ErrorBoundary>
  )
}

export default BoundaryRoute