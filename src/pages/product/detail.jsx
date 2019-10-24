import React, { Component } from 'react'
import {BASE_IMG_URL} from '../../utils/constants'
import { reqCategoryNews } from '../../api'
import {
  Card,
  Icon,
  List
} from 'antd'
const Item = List.Item

export default class Detail extends Component{

  state = {
    cName1: '', // 一级分类
    cName2: '' // 一级分类
  }

  async componentDidMount () {
    const {pCategoryId, categoryId} = this.props.location.state
    if (pCategoryId === '0') { // 一级分类下的商品
      const result = await reqCategoryNews(categoryId)
      const cName1 = result.data ? result.data.name : ''
      this.setState({cName1})
    } else { // 二级分类下的商品
      // 通过多个await方式发多个请求：后面一个请求实在前面一个请求成功之后才发送
      // const result1 = await reqCategoryNews(pCategoryId)
      // const result2 = await reqCategoryNews(categoryId)
      // const cName1 = result1.data ? result1.data.name : ''
      // const cName2 = result2.data ? result2.data.name : ''
      // 一次性发送多个请求， 只有成功了，才能正常处理
      const results = await Promise.all([reqCategoryNews(pCategoryId), reqCategoryNews(categoryId)])
      const cName1 = results[0].data ? results[0].data.name : ''
      const cName2 = results[1].data ? results[1].data.name : ''
      this.setState({
        cName1, 
        cName2
      })
    }
  }

  render() {
    // 读取路由携带过来的状态数据state
    const {name, desc, price, detail, imgs} = this.props.location.state
    const { cName1, cName2 } = this.state
    const title = (
      <span>
        <Icon type='arrow-left' style={{color: 'green', marginRight: 10, fontSize: 20}} onClick={() => this.props.history.goBack()} />
        <span>商品详情</span>
      </span>
    )

    return (
      <Card title={title} className="detail">
        <List>
          <Item>
            <span className="left">商品名称：</span>
            <span>{name}</span>
          </Item>
          <Item>
            <span className="left">商品描述：</span>
            <span>{desc}</span>
          </Item>
          <Item>
            <span className="left">商品价格：</span>
            <span>{price}</span>
          </Item>
          <Item>
            <span className="left">所属分类：</span>
            <span>{cName1} {cName2 ? '-->' + cName2 : ''}</span>
          </Item>
          <Item>
            <span className="left">商品图片：</span>
            <span>
              {
                imgs.map(img => (
                  <img src={BASE_IMG_URL + img} key={img} alt="img" className="product-img"/>
                ))
              }
            </span>
          </Item>
          <Item>
            <span className="left">商品详情：</span>
            <span dangerouslySetInnerHTML={{__html: detail}}>

            </span>
          </Item>
        </List>
      </Card>
    )
  }
}