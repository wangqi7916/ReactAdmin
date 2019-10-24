import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input
} from 'antd'
const Item = Form.Item
class AddForm extends Component {
  static propTypes = {
    setForm: PropTypes.func.isRequired // 用来传递form
  }

  componentWillMount () {
    this.props.setForm(this.props.form)
  }
  render() {
    const {getFieldDecorator} = this.props.form
    return (
      <Form>
        <Item label='角色名称' labelCol={{span: 4}} wrapperCol={{span: 20} }>
          {
            getFieldDecorator('roleName', {
              initialValue: '',
              rules: [
                {required: true, message: '请输入角色名称'}
              ]
            })(
              <Input placeholder="请输入角色名称" />
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(AddForm)