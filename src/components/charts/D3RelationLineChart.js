/**
 * 关系视图组件
 * 设计方法：先渲染出所有关系视图，在获取视图的位置，将有关系的视图用线连接起来
 * exampleLineData：接收如下格式的数据
 * relationChunkId:值有两类，一类是相关联的表两边都存放有对方的id，另一种是只存放一方的id，都存放时，
 *                 鼠标悬浮在关联的任何一边连线都会变化，只存在一方时，只有鼠标悬浮在存放id的一方连线才会变化
 *
 *
 */

// const exampleLineData = [
//   {
//     tableIdName: '表1', // 表的名字
//     tableId: 'table1', // 表的ID
//     tableChunk: [ // 表的分块列表
//       {
//         ChunkId: 'chunk1-1', // 分块集合的id
//         ChunkName: '表块1-1', // 分块集合的名字
//         relationChunkId: ['chunk2-2', 'chunk3-2'], // 与分块相关联的分块Id,
//         ChunkList: [ // 分块内容
//           {
//             columnId: 'column1-1',
//             columnName: '字段1-1'
//           }
//         ]
//       },
//       {
//         ChunkId: 'chunk1-2',
//         ChunkName: '表块1-2',
//         relationChunkId: ['chunk2-1', 'chunk3-1'],
//         ChunkList: [
//           {
//             columnId: 'column1-2',
//             columnName: '字段1-2'
//           },
//           {
//             columnId: 'column1-3',
//             columnName: '字段1-3'
//           }
//         ]
//       }
//     ]
//   },
//   {
//     tableIdName: '表2',
//     tableId: 'table2',
//     tableChunk: [
//       {
//         ChunkId: 'chunk2-1',
//         ChunkName: '表块2-1',
//         relationChunkId: ['chunk1-2', 'chunk3-1'],
//         ChunkList: [
//           {
//             columnId: 'column2-1',
//             columnName: '字段2-1'
//           }
//         ]
//       },
//       {
//         ChunkId: 'chunk2-2',
//         ChunkName: '表块2-2',
//         relationChunkId: ['chunk1-1'],
//         ChunkList: [
//           {
//             columnId: 'column2-2',
//             columnName: '字段2-2'
//           },
//           {
//             columnId: 'column2-3',
//             columnName: '字段2-3'
//           }
//         ]
//       }
//     ]
//   },
//   {
//     tableIdName: '表3',
//     tableId: 'table3',
//     tableChunk: [
//       {
//         ChunkId: 'chunk3-1',
//         ChunkName: '表块3-1',
//         relationChunkId: ['chunk1-2', "chunk2-1"],
//         ChunkList: [
//           {
//             columnId: 'column3-1',
//             columnName: '字段3-1'
//           }
//         ]
//       },
//       {
//         ChunkId: 'chunk3-2',
//         ChunkName: '表块3-2',
//         relationChunkId: ['chunk1-1'],
//         ChunkList: [
//           {
//             columnId: 'column3-2',
//             columnName: '字段3-2'
//           },
//           {
//             columnId: 'column3-3',
//             columnName: '字段3-3'
//           }
//         ]
//       }
//     ]
//   }
// ]

import React, { PureComponent } from 'react'
import * as d3 from 'd3'
import styles from './D3RelationLineChart.less'

class D3RelationLineChart extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      lineChartBoxLeft: 0
    }
  }
  componentDidMount () {
    setTimeout(() => {

      let refsLabel = Object.keys(this.refs)
      refsLabel.splice(refsLabel.findIndex(item => item == 'ContentBox'), 1)

      const lineDataAux = [] // 连线数据
      const lineIdAux = [] // 连线的id列表
      const ContentBoxRect = this.refs.ContentBox.getBoundingClientRect()
      const left = ContentBoxRect.left
      const top = ContentBoxRect.top
      const initViewWidth = window.visualViewport.width
      console.log('ContentBoxRect------', initViewWidth)

      for (let item of refsLabel) { // 循环所有的ChunkId
        for (let tableItem of this.props.lineData) { // 循环所有的数据
          for (let chunkItem of tableItem.tableChunk) { // 循环所有的表块
            if (chunkItem.ChunkId == item) { // 找到ChunkId的表块详情
              let rect = this.refs[item].getBoundingClientRect()
              if (chunkItem.relationChunkId.length != 0) {
                for (let endItem of chunkItem.relationChunkId) { // 将当前表块和关联的表块划线连接
                  let rectEnd = this.refs[endItem].getBoundingClientRect()
                  let ab = item + '/' + endItem
                  let ba = endItem + '/' + item
                  if (!lineIdAux.includes(ab) && !lineIdAux.includes(ba)) {
                    lineIdAux.push(item + '/' + endItem,)
                    lineDataAux.push({
                      chunkId: item + '/' + endItem,
                      startLeft: rect.left - left,
                      startTop: rect.top - top + rect.height / 2,
                      endLeft: rectEnd.left - left + rectEnd.width,
                      endTop: rectEnd.top - top + rectEnd.height / 2
                    })
                  }
                  console.log('rectEnd', rectEnd, lineIdAux)
                }
              }
            }
          }
        }
      }

      // 画关联线 -- 开始
      const containerWidth = this.chartRef.parentElement.offsetWidth
      const containerHeight = this.chartRef.parentElement.offsetHeight
      const width = containerWidth
      const height = containerHeight
      let chart = d3.select(this.chartRef) // 选中<svg>元素, 设置元素的大小
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'none')

      const lineData = lineDataAux // this.props.lineData

      let lineBuilder = (res) => { // 绘制线
        let path = d3.path()
        path.moveTo(res.startLeft, res.startTop)
        path.lineTo(res.endLeft, res.endTop)
        path.closePath()
        return path
      }

      let lineId = (res) => { // 为每条线加上Id
        return res.chunkId
      }

      chart.selectAll('.line')
        .data(lineData)
        .enter()
        .append('path')
        .attr('class', 'line')
        .attr('id', lineId)
        .attr('d', lineBuilder)
        .attr('stroke', 'gray')
        .attr('stroke-width', 1)
      // 画关联线 -- 结束

      window.addEventListener('resize', (res) => {
        this.setState({
          lineChartBoxLeft: ((res.currentTarget.visualViewport.width - initViewWidth) / 2) + 'px'
        })
      })
    }, 0)
  }

  ContentTem = () => { // 内容模板
    const contentDataLable = this.props.lineData // exampleLineData
    const chunkItem = (data) => {
      return data.map(item => { return <div key={item.columnId}>{item.columnName}</div> })
    }
    const onMouseOver = (chunk) => {
      let lineId = []
      for (let item of chunk.relationChunkId) {
        lineId.push(item + '/' + chunk.ChunkId, chunk.ChunkId + '/' + item)
      }

      lineId.forEach(item => {
        if (document.getElementById(item)) {
          document.getElementById(item).style.stroke = 'blue'
        }

      })
    }
    const onMouseOut = () => {
      const line = document.getElementsByClassName('line')
      for (let item of line) {
        item.style.stroke = 'gray'
      }
    }
    const fx = (data) => {
      return (
        <div key={data.tableId} className={styles.items}>
          <div>{data.tableIdName}</div>
          {data.tableChunk.map(item => {
            return (<div className={styles.chunkItem} ref={item.ChunkId} key={item.ChunkId} onMouseOver={() => onMouseOver(item)} onMouseOut={() => onMouseOut()}>
              <div>{item.ChunkName}</div>
              { chunkItem(item.ChunkList)}
            </div>)
          })
          }
        </div>
      )
    }
    return (
      <>
        {contentDataLable.map(item => { return fx(item) })}
      </>
    )
  }

  render () {
    return (
      <div className={styles.chartBox} ref='ContentBox'>
        <div className={styles.contentBox}>
          {this.ContentTem()}
        </div>
        <div className={styles.lineChart} style={{ top: '0', left: this.state.lineChartBoxLeft }}>
          <svg ref={r => (this.chartRef = r)} />
        </div>
      </div >
    )
  }
}

export default D3RelationLineChart