// 包含接口中所有的参数
import {message} from 'antd'
import jsonp from 'jsonp'
import ajax from './ajax'
// 登陆
export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST')
// 添加用户
export const reqAddUser = (user) => ajax('/manage/user/add', user, 'POST')

// 天气信息
// 跨域 jsonp
// 1、只能解决GET类型请求的ajax请求跨域问题
// 2、请求不是ajax请求，而是一般的get请求
// 3、基本原理：
// 浏览器端： 动态生成<script>来请求后台接口（src就是接口的url），定义好用于接收处响应数据的函数（fn）,并将函数名通过请求参数提交给后台（callbak=fn）
// 服务器端： 接收到请求处理产生结果数据，返回一个函数调用的js代码，并将结果数据作为实参传入函数调用
// 浏览器端： 收到响应自动执行函数调用的js代码，也就执行了提前准备好的回调函数，得到需要的数据
export const reqWeather = (city) => {
  const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
  return new Promise((resolve, reject) => {
    jsonp(url, {}, (err, data) => {
      if (!err && data.status === 'success') {
        const { dayPictureUrl, weather } = data.results[0].weather_data[0]
        resolve({ dayPictureUrl, weather })
      } else {
        message.error('获取天气失败')
      }
    })
  })
}