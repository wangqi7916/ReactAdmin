import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Home from './home'
import AddUpdate from './add-update'
import Detail from './detail'
// 分类
export default class Product extends Component {
  render() {
    return (
      <Switch>
        <Route path='/product' component={Home} exact={true}></Route> {/* 路径完全匹配 */}
        <Route path='/product/addupdate' component={AddUpdate}></Route>
        <Route path='/product/detail' component={Detail}></Route>
        <Redirect to='/product'></Redirect>
      </Switch>
    )
  }
}