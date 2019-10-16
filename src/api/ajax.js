// 封装axios 
// 函数返回的是Promise对象
import axios from 'axios'
import {message} from 'antd'
export default function ajax(url, params = {}, type = 'GET') {
  return new Promise((resolve, reject) => {
    let promise
    if (type === 'GET') {
      promise = axios.get(url, {
        params
      })
    } else {
      promise = axios.post(url, params)
    }
    promise.then(res => {
      resolve(res.data)
    }).catch(error => {
      message.error('请求出错了：' + error.message)
    })
  })
} 