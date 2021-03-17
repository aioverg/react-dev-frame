import React, { PureComponent, useState  } from 'react'
import treeData from '@src/comm/js/tree'


class Catalog extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      treeData: treeData,
      ex: 'hello',
      graph: null
    }
  }
  OneTem = (props) => {
    const [show, setShow] = useState(false)
    console.log(show)
    return(
      <div onMouseOver={() => setShow(true)} onMouseOut={() => setShow(false)}>
        又一个组件
        <span style={{display: show ? '' : 'none'}}>隐藏</span>
      </div>
    )
  }
  addTem = () => {
    const a = [1,2,3]
    return(
      <div>
        组件
        {a.map(item => {
          return <this.OneTem key={item} props={item} /> // this.oneTem(item)
        })}
      </div>
    )
  }


  render() {
    return (
      <>
        <h2 style={{ textAlign: 'center', fontSize: '20px' }}>首页111111</h2>
        <div id="container">
          {this.addTem()}
        </div>
      </>
    )
  }
}

export default Catalog