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

// 查询分类列表
export const reqCategory = (parentId) => ajax('/manage/category/list', {parentId})

// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax('/manage/category/add', {categoryName, parentId}, 'POST')

// 更新分类
export const reqUpdateCategory = (categoryId, categoryName) => ajax('/manage/category/update', {categoryId, categoryName}, 'POST')

// 商品分页
export const reqProducts = (pageNum, pageSize) => ajax('/manage/product/list', {pageNum, pageSize})

// 根据分类id获取分类
export const reqCategoryNews = (categoryId) => ajax('/manage/category/info', {categoryId})

// 搜索商品分页列表 searchType:  productName/productDesc
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax('/manage/product/search', {pageNum, pageSize, [searchType]: searchName})

// 更新商品状态
export const reqUpdateStatus = (productId, status) => ajax('/manage/product/updateStatus', {productId, status}, 'POST')

// 删除图片
export const reqDeleteImg = (name) => ajax('/manage/img/delete', {name}, 'POST')

// 添加修改商品
export const reqAddUpdateProduct = (product) => ajax('/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')

// 获取角色列表
export const reqRoles = () => ajax('/manage/role/list')

// 添加角色
export const reqAddRole = (roleName) => ajax('/manage/role/add', {roleName}, 'POST')

// 更新角色
export const reqUpdateRole = (role) => ajax('/manage/role/update', role, 'POST')

// 获取用户
export const reqUsers = () => ajax('/manage/user/list')

// 添加修改用户
export const reqAddEditUser = (user) => ajax('/manage/user/'+ (user._id ? 'update' : 'add'), user, 'POST')

// 删除用户
export const reqDeleteUser = (userId) => ajax('/manage/user/delete', {userId}, 'POST')

