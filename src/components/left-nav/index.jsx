import React, {Component} from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd'
import menuConfig from '../../config/menuConfig'
import './index.less'
import logo from '../../assets/images/logo.png'
const { SubMenu } = Menu

// 左侧导航
class LeftNav extends Component {
  // 根据menu数据生成对应的标签数组
  // reduce + 递归调用 || map + 递归调用
  getMenuNodes = (menuList) => {
    const path = this.props.location.pathname
    return menuList.reduce((pre, item) => {
      if (!item.children) {
        pre.push((
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        ))
      } else {

        // 查找一个与当前请求路径匹配的子Item
        const cItem = item.children.find(item => item.key === path)
        if (cItem) {
          this.openKey = item.key
        }

        pre.push(
          <SubMenu 
            key={item.key}
            title={
              <span>
            <Icon type={item.icon} />
            <span>{item.title}</span>
            </span>
            }
          >
            {this.getMenuNodes(item.children)}
          </SubMenu>
        )
      }
      return pre
    }, [])
  }

  /*
  在第一次render()之前执行一次
  为第一个render()准备数据(必须同步的)
   */
  componentWillMount () {
    this.menuNodes = this.getMenuNodes(menuConfig)
  }

  render() {
    // 当前路由路径 history、location、match
    let path = this.props.location.pathname
    if(path.indexOf('/product')===0) { // 当前请求的是商品或其子路由界面
      path = '/product'
    }

    // 得到需要打开菜单项的key
    const openKey = this.openKey

    return (
      <div>
        <div className="left-nav">
          <header className="left-nav-header">
            <img src={logo} alt=""/>
            <h1>wq后台</h1>
          </header>
          <Menu
            selectedKeys={[path]}
            defaultOpenKeys={[openKey]}
            mode="inline"
            theme="dark"
          >
            {
              this.menuNodes
            }
          </Menu>
        </div>
      </div>  
    )
  }
}

/*
withRouter高阶组件:
包装非路由组件, 返回一个新的组件
新的组件向非路由组件传递3个属性: history/location/match
 */
export default withRouter(LeftNav)