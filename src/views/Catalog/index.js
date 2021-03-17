import React, { PureComponent } from 'react'
import { Graph, Node, Color } from '@antv/x6'
import { ReactShape } from '@antv/x6-react-shape'
import treeData from '@src/comm/js/tree'


class ChunkItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
  }
  onMouseOver = () => {
    this.setState({
      show: true
    })
  }
  onMouseOut = () => {
    this.setState({
      show: false
    })
  }
  render() {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          textAlign: 'center',
          lineHeight: '50px',
          border: '2px solid #9254de',
          borderRadius: 4,
          background: '#efdbff',
        }}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
      >
        <span onClick={() => this.props.del(this.props.node)} style={{display: this.state.show ? '' : 'none', cursor: 'pointer'}}>删除</span>
        {this.props.data.ChunkName}
      </div>
    )
  }
}
class TableItem extends React.Component {
  render() {
    return (
      <div>{this.props.name}</div>
    )
  }
}


class Catalog extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      treeData: treeData,
      ex: 'hello',
      graph: null
    }
  }
  componentDidUpdate() {
    const { graph } = this.state
  }
  componentDidMount() {
    const { treeData } = this.state

    const graph = new Graph({
      container: document.getElementById('container'),
      width: 800,
      height: 600,
    })
    this.setState({
      graph: graph
    })

    const layout = () => {
      const nodes = graph.getNodes()
      console.log('布局', nodes)
      nodes.forEach(node => {
        node.position(120, 120)
      })

    }

    const del = (node) => { // 删除节点
      graph.removeCell(node)
      layout()
    }

    let allNode = {}
    let leftNode = {}
    let y = 100

    for (let table of treeData.left) { // 左边节点
      Graph.registerReactComponent(table.tableId, <TableItem name={table.tableIdName} />) // 注册节点
      graph.addNode({
        x: 100,
        y: y,
        width: 120,
        height: 40,
        shape: 'react-shape',
        component: table.tableId
      })
      for (let chunk of table.tableChunk) {
        if (chunk.length > 1) {
          y += 40 * (chunk.length + 1)
        } else {
          y += 40
        }
        Graph.registerReactComponent(chunk.ChunkId, <ChunkItem data={chunk} del={del} />) // 注册节点
        console.log(chunk.ChunkId)
        let node = graph.addNode({
          x: 100,
          y: y,
          width: 120,
          height: 40,
          shape: 'react-shape',
          data: chunk,
          component: chunk.ChunkId,
          ports: [{id: chunk.ChunkId}],
          movable: false
        })
        leftNode[chunk.ChunkId] = node
        allNode[chunk.ChunkId] = node
      }
    }

    let middleNode = {}
    for (let table of treeData.middle) { // 中间节点
      Graph.registerReactComponent(table.tableId, <TableItem name={table.tableIdName} />) // 注册节点
      graph.addNode({
        x: 360,
        y: y,
        width: 120,
        height: 40,
        shape: 'react-shape',
        component: table.tableId
      })
      for (let chunk of table.tableChunk) {
        if (chunk.length > 1) {
          y += 40 * (chunk.length + 1)
        } else {
          y += 40
        }
        Graph.registerReactComponent(chunk.ChunkId, <ChunkItem data={chunk} del={del} />) // 注册节点
        console.log(chunk.ChunkId)
        let node = graph.addNode({
          x: 360,
          y: y,
          width: 120,
          height: 40,
          shape: 'react-shape',
          data: chunk,
          component: chunk.ChunkId,
          ports: [{id: chunk.ChunkId}]
        })
        middleNode[chunk.ChunkId] = node
        allNode[chunk.ChunkId] = node
      }
    }

    const rightNode={}

    for (let table of treeData.right) { // 右侧节点
      Graph.registerReactComponent(table.tableId, <TableItem name={table.tableIdName} />) // 注册节点
      graph.addNode({
        x: 360,
        y: y,
        width: 120,
        height: 40,
        shape: 'react-shape',
        component: table.tableId
      })
      for (let chunk of table.tableChunk) {
        if (chunk.length > 1) {
          y += 40 * (chunk.length + 1)
        } else {
          y += 40
        }
        Graph.registerReactComponent(chunk.ChunkId, <ChunkItem data={chunk} del={del} />) // 注册节点
        console.log(chunk.ChunkId)
        let node = graph.addNode({
          x: 500,
          y: y,
          width: 120,
          height: 40,
          shape: 'react-shape',
          data: chunk,
          component: chunk.ChunkId,
          ports: [{id: chunk.ChunkId}]
        })
        rightNode[chunk.ChunkId] = node
        allNode[chunk.ChunkId] = node
      }
    }


    for(let item of treeData.middle){ // 画连接线
      for(let chunk of item.tableChunk){
        for(let ralation of chunk.relationChunkId){
          graph.addEdge({
            source: {cell: allNode[chunk.ChunkId], port: chunk.ChunkId},
            target: {cell: allNode[ralation], port: ralation} 
          })
        }
      }
    }
  }

  render() {
    return (
      <>
        <h2 style={{ textAlign: 'center', fontSize: '20px' }}>首页111111</h2>
        <div id="container"></div>
      </>
    )
  }
}

export default Catalog