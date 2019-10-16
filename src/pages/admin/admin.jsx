import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import { Layout } from 'antd'

import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'

const {Footer, Sider, Content } = Layout
/** 
 后台路由管理组建
*/
export default class Admin extends Component {
  render () {
    const user = memoryUtils.user
    if (!user || !user._id) {
      return <Redirect to='/login'></Redirect>
    }
    return (
      <Layout style={{height: '100%'}}>
        <Sider>
          <LeftNav />
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{background: '#fff'}}>
            <Switch>
              <Route path='/home' component={Home}></Route>
              <Route path='/category' component={Category}/> 
              <Route path='/product' component={Product}/> 
              <Route path='/role' component={Role}/>
              <Route path='/user' component={User}/>
              <Route path='/charts/bar' component={Bar}/> 
              <Route path='/charts/line' component={Line}/> 
              <Route path='/charts/pie' component={Pie}/> 
              <Redirect to='/home' />
            </Switch>
          </Content>
          <Footer style={{color: '#cccccc', textAlign: 'center'}}>推荐使用谷歌浏览器，可以获得更佳的页面操作体验</Footer>
        </Layout>
      </Layout>
    )
  }
}