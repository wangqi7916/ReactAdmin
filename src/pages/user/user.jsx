import React, {Component} from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message
} from 'antd'
import LinkButton from '../../components/link-button'
import {PAGE_SIZE} from '../../utils/constants'
import dateUtils from '../../utils/dateUtils'
import AddEdit from '../../pages/user/add-edit'
import { reqUsers, reqDeleteUser, reqAddEditUser } from '../../api'

// 用户
export default class User extends Component {

  state = {
    users: [], //所有用户数组
    isShow: false,
    roles: [], // 角色
  }

  /* initRoleNames: {
    role_id: role_name
  } 根据roles遍历得到一个对象
  */
  initRoleNames = (roles) => {
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name
      return pre
    }, {})
    this.roleNames = roleNames
  }

  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username'
      },
      {
        title: '邮箱',
        dataIndex: 'email'
      },
      {
        title: '电话',
        dataIndex: 'phone'
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: (create_time) => dateUtils('YYYY-mm-dd HH:MM:SS', new Date(create_time))
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render: (role_id) => this.roleNames[role_id]
      },
      {
        title: '操作',
        render: (user) => {
          return (
            <span>
              <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
              <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
            </span>
          )
        }
      },
    ]
  }

  // 添加用户
  addUser = () => {
    // 表单验证
    this.form.validateFields(async (error, values) => {
      if (!error) {
        const user = values
        // 更新指定id
        if (this.user) {
          user._id = this.user._id
        }
        const result = await reqAddEditUser(user)
        this.form.resetFields()
        if (result.status === 0) {
          message.success(this.user._id ? '修改用户成功' : '添加用户成功')
          this.setState({isShow: false})
          this.getUsers()
        }
      }
    })
  }

  // 修改
  showUpdate = (user) => {
    this.user = user
    this.setState({
      isShow: true
    })
  }

  // 点击添加
  showAdd = () => {
    this.user = null
    this.setState({
      isShow: true
    })
  }

  // 删除用户
  deleteUser = (user) => {
    Modal.confirm({
      title: `确认删除${user.username}吗`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id)
        if (result.status === 0) {
          message.success('删除用户成功')
          this.getUsers()
        }
      }
    })
    
  }

  // 获取用户列表
  getUsers = async () => {
    const result = await reqUsers()
    if (result.status === 0) {
      const {users, roles} = result.data
      this.initRoleNames(roles)
      if(users && users.length) {
        this.setState({users})
      }
      this.setState({roles})
    }
  }

  componentWillMount () {
    this.initColumns()
  }

  componentDidMount () {
    this.getUsers()
  }

  render() {
    const {users, isShow, roles} = this.state
    const user = this.user || {}
    const title = (
      <Button type='primary' onClick={() => this.showAdd()}>创建用户</Button>
    )
    return (
      <Card title={title}>
        <Table
         bordered
         columns={this.columns} 
         dataSource={users} 
         rowKey='_id'
         pagination={{defaultPageSize: PAGE_SIZE}}
        />
        <Modal
          title={user._id ? '修改用户' : '添加用户'}
          visible={isShow}
          onOk={this.addUser}
          onCancel={() => {
            this.setState({
              isShow: false
            })
            this.form.resetFields()
          }}
        >
          <AddEdit 
            setForm={(form) => {this.form = form}}
            roles={roles}
            user={user}
          />
        </Modal>  
      </Card>
    )
  }
}