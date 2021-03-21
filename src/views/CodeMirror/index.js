import React, { PureComponent, useState  } from 'react'
import treeData from '@src/comm/js/tree'
import CodeMirror from 'codemirror' // 引入 codemirror 包
import 'codemirror/lib/codemirror.css' // 引入 codemirror 样式
import 'codemirror/mode/sql/sql' // 引入 sql 语言
import 'codemirror/addon/hint/show-hint.css' // 引入输入提示样式
import 'codemirror/addon/hint/sql-hint.js' // 引入 sql 输入提示
import 'codemirror/addon/hint/show-hint.js' // 引入输入提示


class Catalog extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      treeData: treeData,
      ex: 'hello',
      codeMirrorObj: null
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
  onClick = () => { // 打印输入的代码
    const {codeMirrorObj} = this.state
    const code = codeMirrorObj.getValue()
    console.log(code)
    
  }
  codeMirror = (ref) => { // 挂载 codemirror 编辑器
    const codeMirrorObj = CodeMirror(ref, {
      value: "select * from test where id='${abc}';", // 初始化输入的内容
      mode:  "sql", // 使用 sql 语言
      extraKeys: {"Ctrl": "autocomplete"} // 设置按 Ctrl 键显示输入提示
    });
    if(ref){
      ref.addEventListener('cursorActivity', () => { // 监听 cursorActivity 事件
        ref.showHint() // 挂在输入提示
      })
    }
    
    this.setState({
      codeMirrorObj: codeMirrorObj,
      codeMirrorRef: ref,
    })
  }
  componentWillUnmount() {
    const {codeMirrorRef} = this.state
    codeMirrorRef.removeEventListener('cursorActivity', () => { // 销毁监听事件
      codeMirrorRef.showHint()
    })
  }


  render() {
    return (
      <div style={{padding: '0 20px'}}>
        <h2 style={{ textAlign: 'center', fontSize: '20px' }}>codemirror 代码编辑器插件</h2>
        <div>
          <p>github 地址：<a href='https://github.com/codemirror/CodeMirror'>https://github.com/codemirror/CodeMirror</a></p>
          <p>官方地址：<a href='https://codemirror.net/6/'>https://codemirror.net/6/</a></p>
          <p>基本使用讲解地址：<a href="http://www.tronbird.com/">暂略</a></p>
        </div>
        <div>
          <p>示例：以 sql 语言输入为例，按 Ctrl 键显示输入提示的编辑器</p>
          <button onClick={this.onClick}>打印输入的代码</button>
          <div id="container" style={{width: '500px', height: '350px', border: '1px solid #D8D8D8', marginTop: '18px'}} ref={this.codeMirror}></div>
        </div>
        
      </div>
    )
  }
}

export default Catalog