import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import { Modal } from 'antd'
import dateFormat from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {reqWeather} from '../../api'
import menuConfig from '../../config/menuConfig'
import LinkButton from '../../components/link-button'
import './index.less'
// 头部
class Header extends Component {
  state = {
    currentTime: dateFormat("YYYY-mm-dd HH:MM:SS", new Date()),
    dayPictureUrl: '', //天气的图片
    weather: '' // 天气文本
  }

  getTime = () => {
    this.IntervalId = setInterval(() => {
      const currentTime = dateFormat("YYYY-mm-dd HH:MM:SS", new Date())
      this.setState({currentTime})
    }, 1000)
  }

  getWeather = async () => {
    // 调用接口
    const {dayPictureUrl, weather} = await reqWeather('北京')
    this.setState({dayPictureUrl, weather})
  }

  getTitle = () => {
    // 请求当前路径
    const path = this.props.location.pathname
    let title
    menuConfig.forEach((item) => {
      if (item.key === path) {
        title = item.title
      } else if (item.children) {
        const cItem = item.children.find(cItem => cItem.key === path)
        if (cItem) {
          title = cItem.title
        }
      }
    })
    return title
  }

  /* 
    退出登陆
  */
  Logout = () => {
    Modal.confirm({
      content: '确认退出吗',
      onOk:() => {
        // 删除user数据
        memoryUtils.user = {}
        storageUtils.removeUser()
        // 跳转到login
        this.props.history.replace('/login')
      }
    })
  }

  // 第一次render()之后执行一次， 一般在执行异步操作： 发ajax/定时器
  componentDidMount () {
    // 获取当前时间
    this.getTime()
    // 获取当前天气
    this.getWeather()
  }

  // 在当前组件卸载之前调用
  componentWillUnmount () {
    // 清除定时器
    clearInterval(this.IntervalId)
  }

  render() {
    const { currentTime, dayPictureUrl, weather} = this.state
    const username = memoryUtils.user.username
    const title = this.getTitle()
    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎，{username}</span>
          <LinkButton onClick={this.Logout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
            <img src={dayPictureUrl} alt=""/>
            <span>{weather}</span>
          </div>
        </div>  
      </div>
    )
  }
}

export default withRouter(Header)