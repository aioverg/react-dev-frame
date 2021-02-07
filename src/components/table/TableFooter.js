import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { IconSvg } from '@src/components/iconFont'

const TableFooterBox = styled.div`
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const TableFooterLeft = styled.div`
  font-size: 12px;
`

const TableFooterRight = styled.div`
  display: flex;
  align-items: center;
`

const TableFooterInput = styled.input`
  height: 22px;
  width: 48px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  margin: 0 16px 0 14px;
  text-align: center;
  &:focus {
    border: 1px solid rgba(0, 0, 0, 0.15);
    outline: none;
  }
`

class TableFooter extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 1
    }
  }

  onKeyDown = (e) => {
    const { callBack } = this.props
    if (e.keyCode == 13) {
      callBack({ pageNum: Number(e.target.value) })
    }
  }

  componentDidMount () {
    this.setState({
      currentPage: this.props.pageNum
    })
  }

  nextPage = () => {
    const { callBack } = this.props
    this.setState({
      currentPage: Number(this.state.currentPage) + 1
    })
    callBack({ pageNum: Number(this.state.currentPage) + 1 })
  }

  prePage = () => {
    const { callBack } = this.props
    this.setState({
      currentPage: Number(this.state.currentPage) - 1
    })
    callBack({ pageNum: Number(this.state.currentPage) - 1 })
  }

  onChange = (e) => {
    this.setState({
      currentPage: Number(e.target.value)
    })
  }

  render () {
    const { currentPage } = this.state
    const { total, pageSize, pageNum } = this.props
    return (
      <TableFooterBox>
        <TableFooterLeft>
          <span>显示</span>
          <span style={{ color: '#597EF7' }}> {pageSize} </span>
          <span>行数据, 共</span>
          <span style={{ color: '#597EF7' }}> {total} </span>
          <span>条数据</span>
        </TableFooterLeft>
        <TableFooterRight>
          <IconSvg name="iconshangyiye2" onClick={() => this.prePage()} />
          <TableFooterInput value={currentPage} onChange={(e) => this.onChange(e)} onKeyDown={(e) => this.onKeyDown(e)} />
          <span>/</span>
          <span style={{ padding: '0 16px' }}>{5}</span>
          <IconSvg name="iconxiayiye1" onClick={() => this.nextPage()} />
        </TableFooterRight>
      </TableFooterBox>
    )
  }
}

export default TableFooter