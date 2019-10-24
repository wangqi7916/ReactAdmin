import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Select,
  Input
} from 'antd'
const Item = Form.Item
const Option = Select.Option
class AddForm extends Component {
  static propTypes = {
    categoryList: PropTypes.array.isRequired, // 分类列表
    parentId: PropTypes.string.isRequired, // 父id
    setForm: PropTypes.func.isRequired // 用来传递form
  }

  componentWillMount () {
    this.props.setForm(this.props.form)
  }
  render() {
    const {getFieldDecorator} = this.props.form
    const {categoryList, parentId} = this.props
    return (
      <Form>
        <Item>
          {
            getFieldDecorator('parentId', {
              initialValue: parentId,
            })(
              <Select>
                <Option value='0'>一级分类</Option>
                {
                  categoryList.map((item, key) => <Option value={item._id} key={key}>{item.name}</Option>)
                }
              </Select>
            )
          }
        </Item>
        <Item>
          {
            getFieldDecorator('categoryName', {
              initialValue: '',
              rules: [
                {required: true, message: '请输入分类名称'}
              ]
            })(
              <Input placeholder="请输入分类名称" />
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(AddForm)