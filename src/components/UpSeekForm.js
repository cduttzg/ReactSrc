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

export default class UpSeekForm extends React.Component {
  state = {
    user : this.props['user'],
    confirmDirty: false,
    upLoading : false,
    toSeekImg : null,
    toSeekImgFile : null,
    tmpSeekImgSrc: null,
    seekTags : ['水票','书籍','寝室神器','租房','文具','电脑办公',
    '游戏道具','体育用具','乐器','电器','装饰品','其它']
  };

  handleSubmit = e => {
    e.preventDefault();
    const golbalMessage = message;
    this.props['form'].validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        let url = '/api/user/home/upSeek';
        let map = new Map();
        map.set('用户名',this.state['user'].username);
        map.set('商品标签',this.state.seekTags.indexOf(values.seektag));
        map.set('商品名称',values.seekname);
        map.set('描述',values.seekcontent);
        map.set('数量',values.seeknumber);
        map.set('单价',values.seekprice);
        let data = Map2JSONString(map);
        let formData = new FormData();
        formData.set('data',data);
        formData.set('img',null);
        formData.set('img',this.state.toSeekImgFile);
        let res = PutImage(url, formData);
        res.then(response=>{
            let {code, message, data} = response;
            if(code!==200){golbalMessage.error(message || 'ヤッ 上传信息出现了某些意外');}
            else{
                golbalMessage.success('成功发布求购');
                //组件刷新
                this.props.handleSeekUpClick();
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
    //预览求购商品图片
    customSeekImgRequest = (file) => {
        if(!beforeUpload(file.file)) return false;
        this.setState({
            toSeekImgFile : file.file
        });
        getBase64(file.file,(result)=>{
          this.setState({
            tmpSeekImgSrc : result
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
        <Divider style={{fontSize: 14}}  orientation='left'>求购物品相关图片</Divider>
        <Upload name='userAvatar' listType="picture-card" customRequest={this.customSeekImgRequest} className="avatar-uploader avatar-uploader-c1er" showUploadList={false}>
          {this.state.tmpSeekImgSrc ? <img id='showAvatar-c1er' src={this.state.tmpSeekImgSrc} /> : <div>
            <Icon type={this.state['upLoading']?'loading':'plus'} />
            <div className='upLoadtext'>上传能描述求购物品的图片</div>
          </div>}
        </Upload>
        <Divider style={{fontSize: 14}}  orientation='left'>求购信息</Divider>
        <Form.Item className='ant-form-item-c1er'
          label={
            <span>
              求购物品名称&nbsp;
              <Tooltip title="范围越小结果越容易被满足哦">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('seekname', {
            rules: [{ required: true, message: '请输入求购物品名称！', whitespace: true }]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="求购描述" className='ant-form-item-c1er'>
          {getFieldDecorator('seekcontent', {
            rules: [{ required: true, message: '至少输入一点点描述吧！' }]
          })(<Input.TextArea rows={4} />)}
        </Form.Item>
        <Form.Item className='ant-form-item-c1er'
          label={
            <span>
              求购标签&nbsp;
              <Tooltip title="一次只能选择一个标签哦">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('seektag',{
              initialValue : '水票'
          })(<Select>{
              this.state.seekTags.map((v,i)=>{
                  return(
                    <Select.Option key={i} value={v}>{v}</Select.Option>
                  );
              })
          }
          </Select>)}
        </Form.Item>
        <Form.Item label="期望数量" className='ant-form-item-c1er'>
          {getFieldDecorator('seeknumber', {
            initialValue : 1,
            rules: [{ type: 'number' ,required: true, message: '想要多少件商品是必须填写的！', whitespace: true }]
          })(<InputNumber min={1}  max={19} />)}
        </Form.Item>
        <Form.Item label="预期价位" className='ant-form-item-c1er'>
          {getFieldDecorator('seekprice', {
            initialValue : 1,
            rules: [{ type: 'number' ,required: true, message: '心中的预期价位是必须填写的！', whitespace: true }]
          })(<InputNumber min={1} style={{width:150}}
          formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 
          parser={value => value.replace(/￥\s?|(,*)/g, '')} />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout} className='ant-form-item-c1er message-update-c1er'>
          <Button type="primary" htmlType="submit" size={'default'} shape='round'>
            向世界发出你的求购
          </Button>
        </Form.Item>
      </Form>
    );
  }
}