import React from 'react';
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Button,
  message,
  Upload,
  Divider,
  Select,
  InputNumber
} from 'antd';
import { PutImage } from '../utils/Request';
import Map2JSONString from '../utils/Map2JSONString';
import {getBase64, beforeUpload} from '../utils/FileUpload';

export default class UpGoodsForm extends React.Component {
  state = {
    user : this.props['user'],
    confirmDirty: false,
    upLoading : false,
    upGoodsImg : null,
    upGoodsImgFile : null,
    tmpGoodsImgSrc: null,
    goodsType : ['其他','书籍','虚拟','租房','福利']
  };

  handleSubmit = e => {
    e.preventDefault();
    const golbalMessage = message;
    this.props['form'].validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        let url = '/api/user/home/addGoods';
        let map = new Map();
        map.set('用户名',this.state['user'].username);
        map.set('商品标签',this.state.goodsType.indexOf(values.goodsType));
        map.set('商品名称',values.goodsName);
        map.set('描述',values.goodsDescribe);
        map.set('数量',values.goodsNumber);
        map.set('单价',values.goodsPrice);
        let data = Map2JSONString(map);
        let formData = new FormData();
        formData.set('data',data);
        formData.set('img',null);
        formData.set('img',this.state.upGoodsImgFile);
        let res = PutImage(url, formData);
        res.then(response=>{
            let {code, message, data} = response;
            if(code!==200){golbalMessage.error(message || 'ヤッ 上传信息出现了某些意外');}
            else{
                golbalMessage.success('成功上架商品');
                //组件刷新
                this.props.handlePutGoodsClick();
            }
        });
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props['form'];
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }
    //预览上架商品图片
    customGoodsImgRequest = (file) => {
        if(!beforeUpload(file.file)) return false;
        this.setState({
            upGoodsImgFile : file.file
        });
        getBase64(file.file,(result)=>{
          this.setState({
            tmpGoodsImgSrc : result
          });
        });
    }
  render() {
    const { getFieldDecorator } = this.props['form'];
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Divider style={{fontSize: 14}}  orientation='left'>上架物品相关图片</Divider>
        <Upload name='upGoodsImg' listType="picture-card" customRequest={this.customGoodsImgRequest} className="avatar-uploader avatar-uploader-c1er" showUploadList={false}>
          {this.state.tmpGoodsImgSrc ? <img id='showAvatar-c1er' src={this.state.tmpGoodsImgSrc} /> : <div>
            <Icon type={this.state['upLoading']?'loading':'plus'} />
            <div className='upLoadtext'>上传与你上架商品相关的图片</div>
          </div>}
        </Upload>
        <Divider style={{fontSize: 14}}  orientation='left'>上架商品信息</Divider>
        <Form.Item className='ant-form-item-c1er'
          label={
            <span>
              上架商品名称&nbsp;
              <Tooltip title="范围越小结果越容易卖出哦">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('goodsName', {
            rules: [{ required: true, message: '请输入上架商品名称', whitespace: true }]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="商品描述" className='ant-form-item-c1er'>
          {getFieldDecorator('goodsDescribe', {
            rules: [{ required: true, message: '至少输入一点点描述吧！' }]
          })(<Input.TextArea rows={4} />)}
        </Form.Item>
        <Form.Item className='ant-form-item-c1er'
          label={
            <span>
              商品标签&nbsp;
              <Tooltip title="一次只能选择一个标签哦">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('goodsType',{
              initialValue : '书籍'
          })(<Select>{
              this.state.goodsType.map((v,i)=>{
                  return(
                    <Select.Option key={i} value={v}>{v}</Select.Option>
                  );
              })
          }
          </Select>)}
        </Form.Item>
        <Form.Item label="商品数量" className='ant-form-item-c1er'>
          {getFieldDecorator('goodsNumber', {
            initialValue : 1,
            rules: [{ type: 'number' ,required: true, message: '想上架多少件商品是必须填写的！', whitespace: true }]
          })(<InputNumber min={1}  max={19} />)}
        </Form.Item>
        <Form.Item label="单价" className='ant-form-item-c1er'>
          {getFieldDecorator('goodsPrice', {
            initialValue : 1,
            rules: [{ type: 'number' ,required: true, message: '商品的单价是必须填写的！', whitespace: true }]
          })(<InputNumber min={0} style={{width:150}} step={0.1}
          formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 
          parser={value => value.replace(/￥\s?|(,*)/g, '')} />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout} className='ant-form-item-c1er message-update-c1er'>
          <Button type="primary" htmlType="submit" size={'default'} shape='round'>
            上架！
          </Button>
        </Form.Item>
      </Form>
    );
  }
}