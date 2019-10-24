import React, {Component} from 'react'
import {
  Card,
  Table,
  Button,
  Icon,
  message,
  Modal
} from 'antd'
import AddForm from '../category/add-form'
import UpdateForm from '../category/update-form'
import LinkButton from '../../components/link-button'
import {reqCategory, reqAddCategory, reqUpdateCategory} from '../../api'
// 商品分类
export default class Category extends Component {
  state = {
    categoryList: [], // 一级分类列表
    subCategoryList: [], // 二级
    loading: false, // 是否加载完成
    parentId: '0', // parentId当前要现实的分类列表
    parentName: '',
    showStatus: 0 // 确认框是否显示 0: 都不显示 1: 显示添加 2: 更新
  }
  // 初始化table的表头
  initColumns = () => {
    this.columns = [
      {
        title: '分类的名称',
        dataIndex: 'name' // 显示对应的属性名
      },
      {
        title: '操作',
        width: 300,
        render: (category) => ( // 返回界面标签
          <span>
            <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
            {/* 如何向事件回调函数传递参数：先定义一个匿名函数，在函数调用的时候传递 */}
            {this.state.parentId === '0' ? <LinkButton onClick={() => {this.showSubCategory(category)}}>查看子分类</LinkButton> : null}
          </span>
        )
      }
    ]
  }

  // 一级 
  // parentId: 如果没有指定，就用状态中的parentId请求
  getCategory = async (parentId) => {
    // 发请求前
    this.setState({
      loading: true
    })
    parentId = parentId || this.state.parentId
    const result = await reqCategory(parentId)
    this.setState({
      loading: false
    })
    if (result.status === 0) {
      const categoryList = result.data
      if (parentId === '0') {
        // 一级
        this.setState({categoryList})
      } else {
        // 二级
        this.setState({
          subCategoryList: categoryList
        })
      }
      
    } else {
      message.error('获取分类列表失败')
    }
  }

  // 二级

  showSubCategory = (category) => {
    // setState(updater[,callback]) 
    // setState不能立即更新状态 异步的
    this.setState({
      parentId: category._id,
      parentName: category.name
    }, () => {
      // 获取二级分类列表
      this.getCategory()
    })
  }

  // 一级分类
  showCategory = () => {
    this.setState({
      parentId: '0',
      parentName: '',
      subCategoryList: []
    })
  }

  // 隐藏确认框
  handleCancel = () => {
    this.form.resetFields()
    this.setState({
      showStatus: 0
    })
  }

  // 显示添加确认框
  showAdd = () => {
    this.setState({
      showStatus: 1
    })
  }
  // 添加分类
  addCategory = () => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        // 1、隐藏确定框
        this.setState({
          showStatus: 0
        })
        // 收集数据
        const {categoryName, parentId}= values
        // 清除输入数据
        this.form.resetFields()
        // 2、发请求
        const result = await reqAddCategory(categoryName, parentId)
        // 3、重新显示列表
        if (result.status === 0) {
          // 添加的分类就是当前分类
          if (parentId === this.state.parentId) {
            this.getCategory()
          } else if (parentId === '0') { // 在二级分类列表下添加一级分类, 重新获取一级分类列表, 但不需要显示一级列表
            this.getCategory('0')
          }
        }
      } else {
        message.error('请输入分类')
      }
    })
  }

  // 显示修改框
  showUpdate = (category) => {
    this.category = category
    this.setState({
      showStatus: 2
    })
  }

  // 更新分类
  updateCategory = () => {
    this.form.validateFields(async (err, values) => {
      if(!err) {
        // 1、隐藏确定框
        this.setState({
          showStatus: 0
        })
        const categoryId = this.category._id
        const { categoryName } = values
        // 清除输入数据
        this.form.resetFields()
        // 2、发请求
        const result = await reqUpdateCategory(categoryId, categoryName)
        // 3、重新显示列表
        if (result.status === 0) {
          this.getCategory()
        }
      } else {
        message.error('请输入分类')
      }
    })
  }

  // 为第一次render()渲染,准备数据
  componentWillMount () {
    this.initColumns()
  }

  // 执行异步ajax请求
  componentDidMount () {
    this.getCategory()
  }

  render() {
    // 读取状态数据
    const { categoryList, subCategoryList, parentId, parentName, loading, showStatus } = this.state
    // 读取分类
    const category = this.category || {} // 如果没有制定一个空对象
    const title = parentId === '0' ? '一级分类列表' : (
      <span>
        <LinkButton onClick={this.showCategory}>一级分类列表</LinkButton>
        <Icon type='arrow-right' style={{marginRight: '10px'}}/>
        <span>{parentName}</span>
      </span>
    )
    const extra = (
      <Button type="primary" onClick={this.showAdd}>
        <Icon type='plus' />
        添加
      </Button>
    )

    return (
      <Card title={title} extra={extra}>
        <Table 
        dataSource={parentId === '0' ? categoryList : subCategoryList} 
        columns={this.columns} 
        bordered
        rowKey='_id'
        loading={loading}
        pagination={{defaultPageSize: 10, showQuickJumper: true}}/>
        <Modal
          title="添加"
          visible={showStatus === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm 
            categoryList={categoryList} 
            parentId={parentId}
            setForm={(form) => {this.form = form}}
          />
        </Modal>
        <Modal
          title="修改"
          visible={showStatus === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <UpdateForm 
            categoryName={category.name} 
            setForm={(form) => {this.form = form}}
          />
        </Modal>
      </Card>
    )
  }
}