import React, { Component, PureComponent } from 'react'
import {
  Card,
  Form,
  Cascader,
  Input,
  Icon,
  Button,
  message
} from 'antd'
import LinkButton from '../../components/link-button'
import PicturesWall from '../../pages/product/pictures-wall'
import RichTextEditor from '../../pages/product/rich-text-editor'
import { reqCategory, reqAddUpdateProduct } from '../../api'
const {Item} = Form
const {TextArea} = Input

class AddUpdate extends PureComponent{
  state = {
    options: []
  }

  constructor (props) {
    super(props)
    // 创建用来保存ref标识的标签对象的容器
    this.getPic = React.createRef()
    this.getText = React.createRef()
  }
  // 验证价格处理
  validatePrice = (rule, value, callback) => {
    if (value * 1 > 0) {
      callback()
    } else {
      callback('价格必须大于0')
    }
  }

  initOptions = async (categorys) => {
    // 根据categorys数组，生成options数组
    const options = categorys.map(cItem => ({
      value: cItem._id,
      label: cItem.name,
      isLeaf: false // 不是叶子
    }))

    // 如果事一个二级分类商品
    const {isUpdate, product} = this
    const {pCategoryId, categoryId} = product
    if (isUpdate && pCategoryId !== '0') {
      // 获取对应的二级分类列表
      const subCategorys = await this.getCategory(pCategoryId)
      // 生成二级下拉列表
      const childOptions = subCategorys.map(cItem => ({
        value: cItem._id,
        label: cItem.name,
        isLeaf: true // 不是叶子
      }))
      // 查找当前对应的商品，关联到一级option
      const targetOption = options.find(option => option.value === pCategoryId)
      if (targetOption) {
        targetOption.children = childOptions
      }
    }
    this.setState({
      options
    })
  }

  // 获取一级/二级分类列表
  getCategory = async (parentId) => {
    const result = await reqCategory(parentId)
    if (result.status === 0) {
      const categorys = result.data
      if (parentId === '0') {
        this.initOptions(categorys)
      } else {
        return categorys // 当前async函数返回的promise就会成功且value为categorys
      }
    }
  }

  // 选择某个列表项，加载下一级数据
  loadData = async selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    // 根据选中的分类请求二级分类
    const subCategorys = await this.getCategory(targetOption.value)
    targetOption.loading = false;
    if(subCategorys && subCategorys.length) {
      const childOptions = subCategorys.map(cItem => ({
        value: cItem._id,
        label: cItem.name,
        isLeaf: true
      }))
      // 关联到当前options
      targetOption.children = childOptions
    } else {
      targetOption.isLeaf = true
    }
    this.setState({
      options: [...this.state.options]
    })
  }

  submit = () => {
    // 验证
    this.props.form.validateFields(async (error, values) => {
      if (!error) {
        // 收集数据, 并封装成product
        const {name, desc, price, categoryIds} = values
        let pCategoryId, categoryId
        if (categoryIds.length === 1) {
          pCategoryId = 0
          categoryId = categoryIds[0]
        } else {
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        }

        const imgs = this.getPic.current.getImgs()
        const detail = this.getText.current.getDetail()

        const product = {name, desc, price, imgs, detail, pCategoryId, categoryId}

        // 如果事更新需要添加_id
        if (this.isUpdate) {
          product._id = this.product._id
        }

        // 调用接口请求函数
        const result = await reqAddUpdateProduct(product)
        if (result.status === 0) {
          message.success(`${this.isUpdate ? '更新' : '添加'}商品成功`)
          this.props.history.goBack()
        } else {
          message.error(`${this.isUpdate ? '更新' : '添加'}商品失败`)
        }
      }
    })
  }

  componentDidMount () {
    this.getCategory('0')
  }
  componentWillMount () {
    // 去除state
    const product = this.props.location.state
    this.isUpdate = !!product // 保存是否是更新的标示
    this.product = product || {} // 保存商品信息，如果没有就是一个空对象，避免报错
  }
  render() {

    const {isUpdate, product} = this
    const {pCategoryId, categoryId, imgs, detail} = product
    const categoryIds = []
    if (isUpdate) {
      if (pCategoryId === '0') {
        // 商品是一个一级分类
        categoryIds.push(categoryId)
      } else {
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }
    // 指定item布局的
    const formItemLayOut = {
      labelCol: { span: 2 },
      wrapperCol: { span: 8 }
    }
    const title = (
      <span>
        <LinkButton>
          <Icon type='arrow-left' onClick={() => this.props.history.goBack()}></Icon>
        </LinkButton>
        <span>{isUpdate ? '修改商品' : '添加商品'}</span>
      </span>
    )

    const { getFieldDecorator } = this.props.form;
    
    
    return (
      <Card title={title}>
        <Form {...formItemLayOut}>
          <Item label="商品名称">
            {
              getFieldDecorator('name', {
                initialValue: product.name,
                rules: [
                  {required: true, message: '商品信息必须输入'}
                ]
              })(
                <Input placeholder='请输入商品名称' />
              )
            }
          </Item>
          <Item label="商品描述">
            {
              getFieldDecorator('desc', {
                initialValue: product.desc,
                rules: [
                  {required: true, message: '商品描述必须输入'}
                ]
              })(
                <TextArea placeholder='请输入商品描述' autosize></TextArea>
              )
            }
          </Item>
          <Item label="商品价格">
            {
              getFieldDecorator('price', {
                initialValue: product.price,
                rules: [
                  {required: true, message: '商品价格必须输入'},
                  {validator: this.validatePrice}
                ]
              })(
                <Input placeholder='请输入商品价格' type='number' addonAfter="元" min='0'/>
              )
            }
            
          </Item>
          <Item label="商品分类">
            {
              getFieldDecorator('categoryIds', {
                initialValue: categoryIds,
                rules: [
                  {required: true, message: '选择商品分类'}
                ]
              })(
                <Cascader
                  placeholder='请选择分类'
                  options={this.state.options} /* 需要显示的列表数据 */
                  loadData={this.loadData} /* 选择某个列表项，加载下一级数据 */
                ></Cascader>
              )
            }
            
          </Item>
          <Item label="商品图片">
            <PicturesWall ref={this.getPic} imgs={imgs}></PicturesWall>
          </Item>
          <Item label="商品详情" labelCol={{span: 2}} wrapperCol={{span: 20} }>
            <RichTextEditor ref={this.getText} detail={detail}></RichTextEditor>
          </Item>
          <Item>
            <Button type="primary" onClick={this.submit}>提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(AddUpdate)

/*
1、子组件调用父组件的方法： 将父组件的方法以函数属性的形式传递给子组件，子组件就可以调用
2、父组件调用子组建的方法: 通过在父组件通过ref，调用子组件中的方法
*/