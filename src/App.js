/*
  应用根组建
*/
import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom' // HashRouter 有#号

import Login from './pages/login/login'
import Admin from './pages/admin/admin'

// import 'antd/dist/antd.css'
export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch> {/* 只匹配一个*/}
          <Route path='/login' component={Login}></Route>
          <Route path="/" component={Admin}></Route>
        </Switch>
      </BrowserRouter>
    )
  }
}