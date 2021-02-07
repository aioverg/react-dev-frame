/**
 * 表接收数据类型：
 * data: {
 *   headerData: [{name: '字段名', id: '字段id'}], // 默认至少包含 name, id 字段 (name, id 字段可在 headSetField 中设置)
 *   columnData: [[], []] // 表单元格内容数据, 顺序与表头字段顺序一致
 * }
 *
 * headSetField: {
 *   id: definedId,
 *   name: dfindedName
 * }
 *
 * 表头和表格内容的自定义配置
 * definedHeader: [id] // 自定义表头字段, id 表示哪些表头字段自定义, 默认全部使用
 * definedHeaderTem: function // 自定义表头的模板, 模板默认接收一个名为 data 的 props (数据是表头单元格的数据)
 *
 * definedColumn: [columnIndex] // 自定义表格字段, columnIndex 表示哪列表格字段自定义, 默认全部使用
 * definedColumnTem: [function] // 自定义表格字段的模板, 回调参数为当前单元格所在的坐标[rowIndex, columnIndex]
 */


import React, { PureComponent } from 'react'
import { Table, Column, Cell } from 'fixed-data-table-2'
import 'fixed-data-table-2/dist/fixed-data-table.min.css'
import styled from 'styled-components'
import { IconSvg } from '@src/components/iconFont'
import styles from './DefinedTable.less'


class TableHeaderTem extends PureComponent { // 表格头模板
  render () {
    const { data, definedHeaderTem, headSetField, ...props } = this.props
    return (
      <Cell {...props} className={styles.tableHead}>
        {definedHeaderTem ? definedHeaderTem({ data: data, headSetField: headSetField }) : <span>{data.name}</span>}
      </Cell>
    )
  }
}

class TableCellTem extends PureComponent { // 表格单元模板
  render () {
    const { data, decolumn, definedColumnTem, ...props } = this.props
    const { rowIndex, columnindex } = this.props
    const callBackData = [rowIndex, columnindex]
    return (
      <Cell {...props}>
        { definedColumnTem ? (decolumn ? (decolumn.includes(columnindex) ? definedColumnTem(callBackData) : data[rowIndex][columnindex]) : definedColumnTem(callBackData)) : data[rowIndex][columnindex]}
      </Cell >
    )
  }
}

class DefinedTable extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      columnWidths: {}, // 列的宽度
      width: 0, // 表格宽度
      data: {
        headerData: [{ name: '字段类型', id: 0 }, { name: '原始名', id: 1 }],
        columnData: [[1, 2], [3, 4], [5, 6]]
      }
    }
  }

  onColumnResizeEndCallback = (newColumnWidth, columnKey) => {
    this.setState(({ columnWidths }) => ({
      columnWidths: {
        ...columnWidths,
        [columnKey]: newColumnWidth,
      }
    }))
  }

  TableColumnTem = () => {
    const { data, definedHeader, definedHeaderTem, definedColumn, definedColumnTem } = this.props
    let { headSetField } = this.props
    if (!headSetField) {
      headSetField = {
        id: 'id',
        name: 'name'
      }
    }

    const widthFilter = (id, index) => { // 设置表格的列宽，默认根据表格字段的第一列的值的长度设置 (低于120px，设置为120px)
      let lang = data.columnData.length != 0 ? String(data.columnData[0][index]).length : 12
      return this.state.columnWidths[id] || (lang < 10 ? 120 : lang * 10)
    }

    return data.headerData.map((item, index) => {
      return (
        <Column key={item[headSetField.id]} columnKey={item[headSetField.id]} isResizable={true} width={widthFilter(item[headSetField.id], index)} flexGrow={index == data.headerData.length - 1 ? 1 : 0}
          header={<TableHeaderTem data={item} headSetField={headSetField} decolumn={definedHeader} definedHeaderTem={definedHeaderTem} />}
          cell={data.columnData.length != 0 ? <TableCellTem data={data.columnData} columnindex={index} decolumn={definedColumn} definedColumnTem={definedColumnTem ? definedColumnTem[index] : null} /> : ''}
        />
      )
    })
  }

  tableWidth = () => { // 计算表格宽度和高度
    const tableBox = this.refs.tableBox.getBoundingClientRect()
    this.setState({
      width: tableBox.width,
      pageNum: 1
    })
  }

  componentDidMount () {
    this.tableWidth()
    window.addEventListener('resize', this.tableWidth)
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this.tableWidth)
  }

  render () {
    const { data } = this.props
    const { width, pageNum } = this.state
    return (
      <div ref="tableBox">
        { data.headerData && data.headerData.length != 0 ?

          <Table
            onColumnResizeEndCallback={this.onColumnResizeEndCallback}
            rowsCount={data.columnData.length}
            rowHeight={38}
            headerHeight={38}
            isColumnResizing={false}
            width={width}
            height={500}>
            {this.TableColumnTem()}
          </Table>

          : ''
        }
      </div>
    )
  }
}

export default DefinedTable