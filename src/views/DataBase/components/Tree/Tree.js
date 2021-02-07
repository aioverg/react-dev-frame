import React, { PureComponent } from 'react'
import TreeNode from "./TreeNode"
import styled from 'styled-components'

const Ul = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`

class Tree extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  TreeTem () {
    return this.props.treeData.map(item => {
      return (
        <TreeNode key={item.id} nodeData={item} refresh={this.props.refresh} movePopup={this.props.movePopup} asideSwitch={this.props.asideSwitch} />
      )
    })
  }
  render () {
    return (
      <Ul>{this.TreeTem()}</Ul>
    )
  }

}

export default Tree