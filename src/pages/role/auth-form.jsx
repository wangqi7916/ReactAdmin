import React, { PureComponent } from 'react'
import PropTypes from 'prop-types';
import {
  Form,
  Input,
  Tree
} from 'antd'
import menuConfig from '../../config/menuConfig'
const Item = Form.Item
const { TreeNode } = Tree

export default class AddForm extends PureComponent {
  static propTypes = {
    role: PropTypes.object.isRequired
  }

  state = {
    checkedKeys: []
  }

  constructor (props) {
    super(props)

    // 根据传入角色的menus生成初始状态
    const {menus} = this.props.role
    this.state = {
      checkedKeys: menus
    }
  }
  // 为父组件提供调用方法
  getMenus = () => this.state.checkedKeys

  onCheck = checkedKeys => {
    this.setState({ checkedKeys })
  }

  getTreeNodes = (menuConfig) => {
    return menuConfig.reduce((pre, item) => {
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          {item.children ? this.getTreeNodes(item.children) : null}
        </TreeNode>
      )
      return pre
    }, [])
  }

  componentWillMount () {
    this.treeNodes = this.getTreeNodes(menuConfig)
  }

  // 根据新传入的role来更新checkedKeys状态, 当组建接收到新的属性时自动调用
  componentWillReceiveProps (nextProps) {
    const menus = nextProps.role.menus
    this.setState({
      checkedKeys: menus
    })
  }

  render() {
    console.log('render')
    const {role} = this.props
    const {checkedKeys} = this.state
    return (
      <Form>
        <Item label='角色名称' labelCol={{span: 4}} wrapperCol={{span: 20} }>
          <Input value={role.name} disabled/>
        </Item>
        <Tree
          checkable
          defaultExpandAll={true}
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
        >
          <TreeNode title="平台权限" key="all">
            {this.treeNodes}
          </TreeNode>
        </Tree>
      </Form>
    )
  }
}