import React, { PureComponent, useState  } from 'react'
import treeData from '@src/comm/js/tree'
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/sql/sql'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/sql-hint.js'
import 'codemirror/addon/hint/show-hint.js'


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
  onClick = () => {
    const {codeMirrorObj} = this.state
    const code = codeMirrorObj.getValue()
    console.log(99999, code)
    
  }
  codeMirror = (ref) => {
    const codeMirrorObj = CodeMirror(ref, {
      value: "select * from test where id='${abc}';",
      mode:  "sql",
      extraKeys: {"Ctrl": "autocomplete"}
    });
    if(ref){
      ref.addEventListener('cursorActivity', () => {
        ref.showHint()
      })
    }
    
    this.setState({
      codeMirrorObj: codeMirrorObj,
      codeMirrorRef: ref,
    })
  }
  componentWillUnmount() {
    const {codeMirrorRef} = this.state
    codeMirrorRef.removeEventListener('cursorActivity', () => {
      codeMirrorRef.showHint()
    })
  }


  render() {
    return (
      <>
        <h2 style={{ textAlign: 'center', fontSize: '20px' }}>首页111111</h2>
        <button onClick={this.onClick}>点击</button>
        <div id="container" style={{width: '500px', height: '500px'}} ref={this.codeMirror}>
        </div>
      </>
    )
  }
}

export default Catalog