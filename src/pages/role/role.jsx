import React, {Component} from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message
} from 'antd'

import AddForm from '../../pages/role/add-form'
import AuthForm from '../../pages/role/auth-form'
import dateUtils from '../../utils/dateUtils'
import {PAGE_SIZE} from '../../utils/constants'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

// 角色管理
export default class Role extends Component {
  state = {
    roles: [], // 所有角色
    role: {}, // 选中role
    isShowAdd: false, //是否显示
    isShowAuth: false
  }

  constructor (props) {
    super(props)
    this.getRoleMenus = React.createRef()
  }

  onRow = (role) => {
    return {
      onClick: event => { // 点击运行
        this.setState({role})
      }
    }
  }

  initColumn = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: (create_time) => dateUtils('YYYY-mm-dd HH:MM:SS', new Date(create_time))
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: (auth_time) => auth_time ? dateUtils('YYYY-mm-dd HH:MM:SS', new Date(auth_time)) : ''
      },
      {
        title: '授权人',
        dataIndex: 'auth_name'
      },
    ]
  }

  getRoles = async () => {
    const result = await reqRoles()
    if (result.status === 0) {
      const roles = result.data
      this.setState({roles})
    } 
  }

  // 确定添加角色
  addRole = () => {
    // 表单验证
    this.form.validateFields(async (error, values) => {
      if (!error) {
        this.setState({
          isShowAdd: false
        })
        // 收集数据
        const {roleName} = values
        // 请求添加
        const result = await reqAddRole(roleName)
        if (result.status === 0) {
          message.success('添加角色成功')
          // this.getRoles()
          const role = result.data
          // 更新roles状态，是基于原有的状态数据
          this.setState(state => ({
            roles: [...state.roles, role]
          }))
        } else {
          message.error('添加角色失败')
        }
        // 根据结果提示
      }
    })

  }

  // 更新角色
  updateRole = async () => {
    const {role} = this.state
    const menus = this.getRoleMenus.current.getMenus()
    role.menus = menus // 重新赋值权限数组
    role.auth_name = memoryUtils.user.username // 授权人姓名
    role.auth_time = Date.now()
    const result = await reqUpdateRole(role)
    this.setState({
      isShowAuth: false
    })
    if(result.status === 0) {
      this.setState({
        roles: [...this.state.roles]
      })
      if (memoryUtils.user.role.name === role.name) {
        memoryUtils.user = {}
        storageUtils.removeUser()
        // 跳转到后台管理界面(不需要再回退)
        this.props.history.replace('/login')
        message.success('更新权限成功, 请您重新登录')
      } else {
        message.success('更新权限成功')
      }
    } else {
      message.success('更新权限失败')
    }
  }

  componentWillMount () {
    this.initColumn()
  }

  componentDidMount () {
    this.getRoles()
  }

  render() {
    const { roles, role, isShowAdd, isShowAuth } = this.state
    const title = (
      <span>
        <Button type='primary' style={{marginRight: 20}} onClick={() => this.setState({isShowAdd: true})}>创建角色</Button>
        <Button type='primary' disabled={!role._id} onClick={() => this.setState({isShowAuth: true})}>设置角色权限</Button>
      </span>
    )

    return (
      <Card title={title}>
        <Table
          dataSource={ roles } 
          columns={this.columns}
          rowKey='_id'
          bordered
          pagination={{
            defaultPageSize: PAGE_SIZE
          }}
          rowSelection={{
            type: 'radio', 
            selectedRowKeys: [role._id],
            onSelect: (role) => {
              this.setState({role})
            }
          }}
          onRow={this.onRow}
        >
        </Table>
        <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({
              isShowAdd: false
            })
            this.form.resetFields()
          }}
        >
          <AddForm 
            setForm={(form) => {this.form = form}}
          />
        </Modal>
        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={() => {
            this.setState({
              isShowAuth: false
            })
          }}
        >
          <AuthForm 
            ref={this.getRoleMenus}
            role={role}
          />
        </Modal>
      </Card>
    )
  }
}