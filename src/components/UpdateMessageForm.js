import React from 'react';
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Button,
  message,
  Upload,
  Divider
} from 'antd';
import { Get, PutImage } from '../utils/Request';
import Map2JSONString from '../utils/Map2JSONString';
import {getBase64, beforeUpload} from '../utils/FileUpload';
import '../stylesheets/UpdateMessageForm.css'

export default class UpdateMessageForm extends React.Component {
  constructor(props){
    super(props);
    this.state={
      confirmDirty: false,
      registerButtonDisable : true,
      upLoading : false,
      imgFile : null,
      user : this.props['user'],
      moneyCodeImgFile : null
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const golbalMessage = message;
    this.props['form'].validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        let map = new Map();
        map.set('用户名',values.nickname);
        map.set('电话号码',values.phone);
        map.set('电子邮箱',values.email);
        map.set('收货地址',values.address);
        let data = Map2JSONString(map);
        let formData = new FormData();
        formData.append('data',data);
        console.log('handlesubmit');
        //empty file
        let file1;
        file1 = this.state['imgFile'] || (new File(['file'],"nullFile"));
        let file2;
        file2 = this.state['moneyCodeImgFile'] || (new File(['file'],"nullFile"));
        console.log('handlesubmit');
        formData.append('img',file1);
        formData.append('img',file2);
        let url = '/api/user/home/updateMessage';
        let res = PutImage(url, formData);
        res.then(response=>{
          let {code, message, data} = response;
          if(code !== 200){golbalMessage.error(message ||'ヤッ 上传信息出现了某些意外');}
          else{
            golbalMessage.success('成功更新个人信息！');
            let url = `/api/user/home/message?用户名=${this.state['user'].username}`;
            const res = Get(url);
            res.then(response=>{
              let {code, message, data} = response;
              let userOld = this.state['user'];
              userOld.phone = data['手机号码'];
              userOld.email = data['电子邮箱'];
              userOld.userAvatarSrc = data['用户头像'];
              userOld.moneyCode = data['收款码'];
              userOld.address = data['收货地址'];
              this.setState({
                user : userOld
              });
            });
          }
        });
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state['confirmDirty'] || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props['form'];
    if (value && value !== form.getFieldValue('password_1')) {
      callback('两次输入的密码不一致！');
    } else {
      callback();
    }
  };
  validateToNextPassword = (rule, value, callback) => {
    const form = this.props['form'];
    if (value && this.state['confirmDirty']) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  //用户头像图片预览
  customRequest = (file) => {
    if(!beforeUpload(file.file)) return false;
    const userOld = this.state['user'];
    this.setState({
      imgFile : file.file
    });
    getBase64(file.file,(result)=>{
      userOld.userAvatarSrc = result;
      this.setState({
        user : userOld
      });
    });
  }
  //收款码图片预览
  customMoneyCodeRequest = (file) => {
    if(!beforeUpload(file.file)) return false;
    const userOld = this.state['user'];
    this.setState({
      moneyCodeImgFile : file.file
    });
    getBase64(file.file,(result)=>{
      userOld.moneyCode = result;
      this.setState({
        user : userOld
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
        <Divider style={{fontSize: 17}}  orientation='left'>你的头像</Divider>
        <Upload name='userAvatar' listType="picture-card" customRequest={this.customRequest} className="avatar-uploader avatar-uploader-c1er" showUploadList={false}>
          {this.state['user'].userAvatarSrc ? <img id='showAvatar-c1er' src={this.state['user'].userAvatarSrc} /> : <div>
            <Icon type={this.state['upLoading']?'loading':'plus'} />
            <div className='upLoadtext'>上传你的头像</div>
          </div>}
        </Upload>
        <Divider style={{fontSize: 17}}  orientation='left'>基本信息</Divider>
        <Form.Item className='ant-form-item-c1er' label="电子邮箱">
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: '输入的邮箱格式不规范！',
              },
              {
                required: true,
                message: '请输入你的电子邮箱！',
              },
            ],
            initialValue: this.state['user'].email
          })(<Input />)}
        </Form.Item>
        <Form.Item className='ant-form-item-c1er'
          label={
            <span>
              用户名&nbsp;
              <Tooltip title="暂时不支持更改用户名哦！">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('nickname', {
            rules: [{ required: true, message: '请输入你的用户名！', whitespace: true }],
            initialValue: this.state['user'].username || '你的用户名'
          })(<Input disabled />)}
        </Form.Item>
        <Form.Item label="电话号码" className='ant-form-item-c1er'>
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: '请输入你的电话号码！' }],
            initialValue: this.state['user'].phone
          })(<Input style={{ width: '100%' }} />)}
        </Form.Item>
        <Form.Item className='ant-form-item-c1er'
          label={
            <span>
              收货地址&nbsp;
              <Tooltip title="请填入你居住的寝室，便于卖家联系">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('address', {
            rules: [{ required: true, message: '请输入你的收货地址！', whitespace: true }],
            initialValue:this.state['user'].address
          })(<Input />)}
        </Form.Item>
        <Divider style={{fontSize: 17}}  orientation='left'>收款码</Divider>
        <Upload name='moneyCode' listType="picture-card" customRequest={this.customMoneyCodeRequest}  className="avatar-uploader avatar-uploader-c1er" showUploadList={false}>
          {this.state['user'].moneyCode ? <img id='moneyCode-c1er' src={this.state['user'].moneyCode} /> : <div>
            <Icon type={this.state['upLoading']?'loading':'plus'} />
            <div className='upLoadtext'>上传你的收款码</div>
          </div>}
        </Upload>
        <Form.Item {...tailFormItemLayout} className='ant-form-item-c1er message-update-c1er'>
          <Button type="primary" htmlType="submit" size={'large'} shape='round'>
            焕然一新吧
          </Button>
        </Form.Item>
      </Form>
    );
  }
}