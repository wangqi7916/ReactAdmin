import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import { Form, Icon, Input, Button, message } from 'antd' // form组件
import './login.less'
import logo from '../../assets/images/logo.png'
import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
/** 
 登陆路由组建
*/
class Login extends Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const {username, password} = values
        const result = await reqLogin(username, password)
        if (result.status === 0) {
          message.success('登陆成功')
          let user = result.data
          memoryUtils.user = user
          storageUtils.saveUser(user)
          // 跳转到后台管理界面(不需要再回退)
          this.props.history.replace('/')
        } else {
          message.error(result.msg)
        }
      } else {
        console.log('校验失败');
      }
    })
  }

  // 自定义验证
  validatePwd = (rule, value, callback) => {
    if (!value) {
      callback('密码必须输入')
    } else if (value.length < 2) {
      callback('密码不能小于2')
    } else if (value.length > 12) {
      callback('密码不能大于12')
    } else {
      callback()
    }
  }
  render() {
    const user = memoryUtils.user
    if (user && user._id) {
      return <Redirect to='/'></Redirect>
    }
    // 得到强大功能的form
    const { getFieldDecorator } = this.props.form
    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt=''/>
          <h1>React项目：后台管理</h1>
        </header>
        <section className="login-content">
          <h2>用户登陆</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('username', { // 配置对象：属性名是特定的
                rules: [
                  { required: true, whitespace: true, message: '用户名必须输入'},
                  { min: 2, message: '用户名至少2位'},
                  { max: 12, message: '用户名最多12位'}
                ],
                initialValue: 'admin'
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {
                getFieldDecorator('password', {
                  rules: [
                    {
                      validator: this.validatePwd
                    }
                  ]
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="密码"
                  />
                )
              }
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登陆
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    )
  }
}

/* 包装Form组件生成新的组件：Form(Login) 
  新组件会给我们传递新的组件：form

  1、 高阶函数
    1）、一类特别的函数
      a. 接受函数类型的参数
      b. 返回是函数
    2、常见
      a. 定时器： setTimeout/setInterval
      b. Promise
      c. 数组遍历 forEach/filter/map/reduce/find/findIndex
      d. 函数对象的bind()
      3. Form.create()()/getFieldDecorator()()
    3. 高阶函数具有扩张性

  2、高阶组件
    1). 本质就是一个函数
    2). 接收一个组件（被包装的组件），返回一个新的组件（包装组件）。包装组件会被包装组件传入特定属性 // Form.create()(Login)
    3). 扩展组件的功能  
    4). 高阶组件也是高阶函数： 接受一个组件函数，返回一个新的组件函数
*/

/*
async 和 await
1、作用
  简化Promise对象的使用： 不再使用then来指定成功/失败的回调函数
  以同步编码方式实现异步流程
2、哪里写await
  在返回Promise的表达式左侧写await：不想要promise， 想要promise异步执行的成功的value数据
3、哪里写async
  await所在函数最近的定义的左侧写async  
*/

const WrapLogin = Form.create()(Login)
export default WrapLogin