import React, { Component } from 'react';
import {
  Upload,
  Icon,
  Modal,
  message
} from 'antd'
import PropTypes from 'prop-types'
import { BASE_IMG_URL } from '../../utils/constants'
import { reqDeleteImg } from '../../api'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends Component{
  static propTypes = {
    imgs: PropTypes.array
  }

  constructor (props) {
    super(props)
    let fileList = []
    // 判断imgs
    const {imgs} = this.props
    console.log(imgs)
    if (imgs && imgs.length > 0) {
      fileList = imgs.map((img, index) => ({
        uid: -index,
        name: img,
        url: BASE_IMG_URL + img
      }))
    } 
    this.state = {
      previewVisible: false, // 是否显示Model
      previewImage: '', // 大图url
      fileList
    }
  }
  // 获取所有已上传的数组
  getImgs = () => {
    return this.state.fileList.map(file => file.name)
  }

  // 隐藏Model
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    // 显示指的的大图
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = async ({ file, fileList }) => {
    // 当前操作的文件 file
    // 所有上传文件的数组 fileList
    // 操作（上传/删除）过程中更新fileList
    // 一旦上传成功
    if (file.status === 'done') {
      const result = file.response
      if (result.status === 0) {
        message.success('上传成功')
        const {name, url } = result.data
        file = fileList[fileList.length - 1]
        file.name = name
        file.url = url
      } else {
        message.error('上传失败')
      }
    } else if (file.status === 'removed') {
      const result = await reqDeleteImg(file.name)
      if (result.status === 0) {
        message.error('删除图片成功')
      } else {
        message.error('删除图片失败')
      }
    }
    this.setState({ fileList })
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/manage/img/upload" // 上传地址
          accept='image/*' // 只接受图片格式
          listType="picture-card"
          name='image' // 请求参数名
          fileList={fileList} // 所有上传文件的数组
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}