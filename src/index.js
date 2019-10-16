/* 
  入口js
*/

import React from 'react'
import ReactDom from 'react-dom'
import storageUtils from './utils/storageUtils'
import memoryUtils from './utils/memoryUtils'
import App from './App'


// 读取local中保存user，保存到内存中

const user = storageUtils.getUser()
memoryUtils.user = user

// 将App组建渲染到index页面
ReactDom.render(<App />, document.getElementById('root'))
