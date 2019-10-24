import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input,
  Select
} from 'antd'
const {Item} = Form
const {Option} = Select
class AddEdit extends Component {

  static propTypes = {
    setForm: PropTypes.func.isRequired,
    roles: PropTypes.array.isRequired,
    user: PropTypes.object
  }

  // 密码验证
  validatePwd = (rule, value, callback) => {
    if (!value) {
      callback('密码必须输入')
    } else if (value.length < 2) {
      callback('密码不能小于4')
    } else if (value.length > 12) {
      callback('密码不能大于12')
    } else {
      callback()
    }
  }

  // 手机号验证
  validatePhone = (rule, value, callback) => {
    const reg = /^1[3456789]\d{9}$/
    if(reg.test(value)) {
      callback()
    } else {
      callback('手机有误')
    }
  }

  // 邮箱验证
  validateMail = (rule, value, callback) => {
    const reg = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/
    if(reg.test(value)) {
      callback()
    } else {
      callback('邮箱有误')
    }
  }

  componentWillMount () {
    this.props.setForm(this.props.form)
  }

  render() {
    const formItemLayout = {
      labelCol: {span: 4}, 
      wrapperCol: {span: 20}
    }

    const { getFieldDecorator } = this.props.form
    const { roles, user } = this.props
    return (
      <Form {...formItemLayout}>
        <Item label='用户名'>
          {
            getFieldDecorator('username', {
              initialValue: user.username,
              rules: [
                { required: true, whitespace: true, message: '用户名必须输入'},
                { min: 2, message: '用户名至少2位'},
                { max: 12, message: '用户名最多12位'}
              ]
            })(
              <Input placeholder="请输入用户名"/>
            )
          }
        </Item>
        {
          user._id ? null : (
            <Item label='密码'>
              {
                getFieldDecorator('password', {
                  initialValue: user.password,
                  rules: [
                    {
                      validator: this.validatePwd
                    },
                    { required: true, message: '密码必须输入'}
                  ]
                })(
                  <Input placeholder="请输入密码" type='password'/>
                )
              }
            </Item>
          )
        }
        
        <Item label='手机号'>
          {
            getFieldDecorator('phone', {
              initialValue: user.phone,
              rules: [
                { validator: this.validatePhone },
                { required: true, message: '手机号必须输入'}
              ]
            })(
              <Input placeholder="请输入手机号"/>
            )
          }
        </Item>
        <Item label='邮箱'>
          {
            getFieldDecorator('email', {
              initialValue: user.email,
              rules: [
                { validator: this.validateMail }
              ]
            })(
              <Input placeholder="请输入邮箱"/>
            )
          }
        </Item>
        <Item label='角色'>
          {
            getFieldDecorator('role_id', {
              initialValue: user._id ? user.role_id : roles[0]._id
            })(
              <Select placeholder="请选择角色">
                {
                  roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                }
              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(AddEdit)